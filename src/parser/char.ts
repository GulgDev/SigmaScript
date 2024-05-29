export namespace Char {
    export function isWhitespace(ch: string) {
        return ch === " " || ch === "\n" || ch === "\r";
    }

    export function isDigit(ch: string) {
        if (!ch) return false;
        const code = ch.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    export function isLetter(ch: string) {
        if (!ch) return false;
        const code = ch.toLowerCase().charCodeAt(0);
        return code >= 97 && code <= 122;
    }
}