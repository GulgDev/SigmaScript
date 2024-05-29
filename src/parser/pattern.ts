import { Char } from "./char";
import { Location, Stream } from "./stream";

export type CharacterGroup = (string | [string, string])[];

export type Match = {
    name?: string,
    start: Location,
    end: Location,
    children?: Match[]
};

class Stack {
    private elements: { [key: number]: string[] };
    
    readonly last?: string;

    constructor(elements: { [key: number]: string[] } = {}, last?: string) {
        this.elements = elements;
        this.last = last;
    }

    with(offset: number, name: string) {
        const elements = { ...this.elements };
        elements[offset] = elements[offset] ? [...elements[offset], name] : [name];
        return new Stack(elements, name);
    }

    has(offset: number, name: string) {
        return this.elements[offset]?.includes(name);
    }
}

export abstract class Pattern {
    precedence?: number;
    preservePrecedence: boolean;

    abstract match(stream: Stream, registry: Map<string, Pattern>, precedence?: number, stack?: Stack, cache?: { [key: string]: Match }): Match | null;
}

export class RawPattern extends Pattern {
    private readonly ch: string;

    constructor(ch: string) {
        super();
        this.ch = ch;
    }

    match(stream: Stream) {
        const start = stream.location;
        if (stream.peekch() !== this.ch) return;
        stream.consume();
        return { start, end: stream.location };
    }
}

export class OrPattern extends Pattern {
    private readonly a: Pattern;
    private readonly b: Pattern;

    constructor(a: Pattern, b: Pattern) {
        super();
        this.a = a;
        this.b = b;
    }

    match(stream: Stream, registry: Map<string, Pattern>, precedence: number = 1, stack: Stack = new Stack(), cache: { [key: string]: Match } = {}): Match {
        const start = stream.location;
        const matchA = !(this.a instanceof NamedPattern && stack.has(start.offset, this.a.name)) && this.a.match(stream, registry, precedence, stack, cache);
        const endA = stream.location;
        stream.location = start;
        const matchB = !(this.b instanceof NamedPattern && stack.has(start.offset, this.b.name)) && this.b.match(stream, registry, precedence, stack, cache);
        const endB = stream.location;
        let match = (!matchA && matchB) || (!matchB && matchA);
        if (matchA && matchB)
            match = endA.offset > endB.offset ? matchA : matchB;
        if (match === matchA)
            stream.location = endA;
        if (match) return { start, end: stream.location, children: [match] };
    }
}

export class WhitespacePattern extends Pattern {
    match(stream: Stream) {
        const start = stream.location;
        while (Char.isWhitespace(stream.peekch())) stream.consume();
        return { start, end: stream.location };
    }
}

export class AnyPattern extends Pattern {
    match(stream: Stream) {
        const start = stream.location;
        if (!stream.peekch()) return;
        stream.consume();
        return { start, end: stream.location };
    }
}

export class DigitPattern extends Pattern {
    match(stream: Stream) {
        const start = stream.location;
        if (!Char.isDigit(stream.peekch())) return;
        stream.consume();
        return { start, end: stream.location };
    }
}

export class OptionalPattern extends Pattern {
    private readonly pattern: Pattern;

    constructor(pattern: Pattern) {
        super();
        this.pattern = pattern;
    }

    match(stream: Stream, registry: Map<string, Pattern>, precedence: number = 1, stack: Stack = new Stack(), cache: { [key: string]: Match } = {}): Match {
        const start = stream.location;
        const match = this.pattern.match(stream, registry, precedence, stack, cache);
        if (!match) stream.location = start;
        return { start, end: stream.location, children: match ? [match] : [] };
    }
}

export class RepeatPattern extends Pattern {
    private readonly pattern: Pattern;

    constructor(pattern: Pattern) {
        super();
        this.pattern = pattern;
    }

    match(stream: Stream, registry: Map<string, Pattern>, precedence: number = 1, stack: Stack = new Stack(), cache: { [key: string]: Match } = {}): Match | null {
        const start = stream.location;
        let match = this.pattern.match(stream, registry, precedence, stack, cache);
        const children = [match];
        if (!match) return;
        let last = stream.location;
        while (match = this.pattern.match(stream, registry, precedence, stack, cache)) {
            if (last.offset === stream.offset) break;
            children.push(match);
            last = stream.location;
        }
        stream.location = last;
        return { start, end: stream.location, children };
    }
}

export class CharacterGroupPattern extends Pattern {
    private readonly group: CharacterGroup;
    private readonly disallow: boolean;

    constructor(group: CharacterGroup, disallow: boolean) {
        super();
        this.group = group;
        this.disallow = disallow;
    }

    match(stream: Stream) {
        const start = stream.location;
        const ch = stream.peekch();
        if (!ch) return;
        const code = ch.charCodeAt(0);
        stream.consume();
        for (const expected of this.group)
            if ((Array.isArray(expected) && code >= expected[0].charCodeAt(0) && code <= expected[1].charCodeAt(0)) || ch === expected)
                return !this.disallow && { start, end: stream.location };
        return this.disallow && { start, end: stream.location };
    }
}

export class GroupPattern extends Pattern {
    private readonly children: Pattern[];

    constructor(children: Pattern[]) {
        super();
        this.children = children;
    }

    match(stream: Stream, registry: Map<string, Pattern>, precedence: number = 1, stack: Stack = new Stack(), cache: { [key: string]: Match } = {}): Match | null {
        const start = stream.location;
        const children = [];
        for (const child of this.children) {
            const match = child.match(stream, registry, precedence, stack, cache);
            if (!match) return;
            children.push(match);
        }
        return { start, end: stream.location, children };
    }
}

export class NamedPattern extends Pattern {
    readonly name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    match(stream: Stream, registry: Map<string, Pattern>, precedence: number = 1, stack: Stack = new Stack(), cache: { [key: string]: Match } = {}): Match | null {
        const key = `${precedence},${stack.last},${stream.offset},${this.name}`;
        const cached = cache[key];
        if (cached !== undefined) {
            if (cached) stream.location = cached.end;
            return cached;
        }
        const start = stream.location;
        stack = stack.with(start.offset, this.name);
        const pattern = registry.get(this.name);
        if (!pattern || (pattern.precedence && pattern.precedence < precedence)) return cache[key] = null;
        const match = pattern.match(stream, registry, pattern.precedence || pattern.preservePrecedence ? pattern.precedence ?? precedence : 1, stack, cache);
        if (!match) return cache[key] = null;
        return cache[key] = { name: this.name, start, end: stream.location, children: [match] };
    }
}

function isSpecialCharacter(ch: string) {
    return ch === "%" || ch === "|" || ch === "(" || ch === ")" || ch === "+" || ch === "?";
}

function parsePattern(stream: Stream, precedence?: number, preservePrecedence: boolean = false): Pattern {
    const children: Pattern[] = [];
    let or = false;
    let ch;
    while (ch = stream.peekch()) {
        stream.consume();
        if (ch === "%") {
            ch = stream.peekch();
            if (isSpecialCharacter(ch)) {
                stream.consume();
                children.push(new RawPattern(ch));
            } else {
                let name = "";
                while (Char.isLetter(ch = stream.peekch())) {
                    stream.consume();
                    name += ch;
                }
                if (name === "d")
                    children.push(new DigitPattern());
                else
                    children.push(new NamedPattern(name));
            }
        } else if (ch === "(")
            children.push(parsePattern(stream, precedence));
        else if (ch === ")")
            break;
        else if (ch === "[") {
            const disallow = stream.peekch() === "^";
            if (disallow) stream.consume();
            const group: CharacterGroup = [];
            let range = false;
            while (ch = stream.peekch()) {
                stream.consume();
                const len = group.length;
                if (ch === "%" && stream.peekch() === "]") {
                    stream.consume();
                    group.push("]");
                } else if (ch === "]")
                    break;
                else if (ch === "-" && !range && len > 0 && !Array.isArray(group.at(-1))) {
                    range = true;
                    continue;
                } else
                    group.push(ch);
                if (range) {
                    range = false;
                    const last = group.pop();
                    group.push([group.pop(), last] as [string, string]);
                }
            }
            children.push(new CharacterGroupPattern(group, disallow));
        } else if (ch === ".")
            children.push(new AnyPattern());
        else if (ch === " ")
            children.push(new WhitespacePattern());
        else if (ch === "|" && children.length > 0 && !or) {
            or = true;
            continue;
        } else if (ch === "?" && children.length > 0)
            children.push(new OptionalPattern(children.pop()));
        else if (ch === "+" && children.length > 0)
            children.push(new RepeatPattern(children.pop()));
        else
            children.push(new RawPattern(ch));
        if (or) {
            children.push(new OrPattern(children.pop(), children.pop()));
            or = false;
        }
    }
    const result = children.length === 1 ? children[0] : new GroupPattern(children);
    result.precedence = precedence;
    result.preservePrecedence = preservePrecedence;
    return result;
}

export function pattern(source: string, precedence?: number, preservePrecedence?: boolean): Pattern {
    return parsePattern(new Stream(source), precedence, preservePrecedence);
}