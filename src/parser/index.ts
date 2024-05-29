import { Match, Pattern, pattern } from "./pattern";
import { Location, Stream } from "./stream";

type Definition = {
    precedence?: number,
    preservePrecedence?: boolean,
    pattern: string
} | string;

type Grammar = {
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