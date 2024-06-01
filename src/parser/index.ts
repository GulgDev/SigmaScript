import { Match, Pattern, pattern } from "./pattern";
import { Location, Stream } from "./stream";

type Definition = {
    precedence?: number,
    preservePrecedence?: boolean,
    pattern: string
} | string;

export type Grammar = {
    [key: string]: Definition,
    root: Definition
};

export class ASTElement {
    readonly name: string;
    readonly start: Location;
    readonly end: Location;
    readonly value: string;

    private readonly children: ASTElement[];

    constructor(name: string, start: Location, end: Location, value: string) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.value = value;
        this.children = [];
    }

    get first() {
        return this.children[0];
    }

    get last() {
        return this.children.at(-1);
    }

    *[Symbol.iterator]() {
        for (const child of this.children)
            yield child;
    }

    addChild(child: ASTElement) {
        this.children.push(child);
    }

    get(index: number): ASTElement | null {
        return this.children[index];
    }

    findChildren(name: string): ASTElement[] {
        return this.children.filter((child) => child.name === name);
    }

    findChild(name: string): ASTElement | null {
        return this.children.find((child) => child.name === name);
    }

    find(name: string): ASTElement | null {
        const child = this.findChild(name);
        if (child) return child;
        for (const child of this.children) {
            const descendant = child.find(name);
            if (descendant) return descendant;
        }
    }
}

export class Parser {
    private readonly patterns: Map<string, Pattern> = new Map();

    constructor(grammar: Grammar) {
        for (const [name, definition] of Object.entries(grammar))
            if (typeof definition === "string")
                this.patterns.set(name, pattern(definition));
            else
                this.patterns.set(name, pattern(definition.pattern, definition.precedence, definition.preservePrecedence));
    }

    parse(buffer: string): ASTElement | null {
        function visit(current: Match, parent: ASTElement) {
            if (current.name) {
                const newParent = new ASTElement(current.name, current.start, current.end, buffer.slice(current.start.offset, current.end.offset));
                parent.addChild(newParent);
                parent = newParent;
            }
            if (current.children)
                for (const child of current.children)
                    visit(child, parent);
        }

        const match = this.patterns.get("root").match(new Stream(buffer), this.patterns);
        if (!match) return;
        const root = new ASTElement("root", match.start, match.end, buffer.slice(match.start.offset, match.end.offset));
        visit(match, root);
        return root;
    }
}

function mergePatterns(a: string, b: string) {
    return b.replace(/\.\.\./g, a);
}

function merge(a: Definition, b: Definition): Definition {
    if (!a) return b;
    if (!b) return a;
    if (typeof a === "string" && typeof b === "string") return mergePatterns(a, b);
    if (typeof a === "string" && typeof b !== "string") return { ...b, pattern: mergePatterns(a, b.pattern) };
    if (typeof a !== "string" && typeof b === "string") return { ...a, pattern: mergePatterns(a.pattern, b) };
    if (typeof a !== "string" && typeof b !== "string")
        return {
            pattern: mergePatterns(a.pattern, b.pattern),
            precedence: b.precedence ?? a.precedence,
            preservePrecedence: b.preservePrecedence ?? a.preservePrecedence
        };
}

export function inherit(parent: Grammar, grammar: Partial<Grammar>): Grammar {
    const result: Grammar = { root: merge(parent.root, grammar.root) };
    for (const name in parent)
        if (!(name in result)) result[name] = merge(parent[name], grammar[name]);
    for (const name in grammar)
        if (!(name in result)) result[name] = merge(parent[name], grammar[name]);
    return result;
}