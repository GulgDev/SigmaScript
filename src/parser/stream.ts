export type Location = {
    offset: number,
    line: number,
    column: number
};

export class Stream {
    private readonly buffer: string;
    private _offset: number;
    private line: number;
    private column: number;

    constructor(buffer: string) {
        this.buffer = buffer;
        this._offset = 0;
        this.line = 0;
        this.column = 0;
    }

    get location(): Location {
        return { offset: this._offset, line: this.line, column: this.column };
    }

    set location(location: Location) {
        this._offset = location.offset;
        this.line = location.line;
        this.column = location.column;
    }

    get offset() {
        return this._offset;
    }

    peekch() {
        return this.buffer[this._offset];
    }

    consume() {
        if (this.peekch() === "\n") {
            ++this.line;
            this.column = 0;
        } else
            ++this.column;
        ++this._offset;
    }
}