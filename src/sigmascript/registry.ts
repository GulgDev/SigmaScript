export class Registry<T> {
    private readonly elements: { [key: string]: T } = {};
    private id: number = -1;

    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    add(element: T): string {
        const key = `#${this.name}:${++this.id}`;
        this.elements[key] = element;
        return key;
    }

    set(key: string, element: T) {
        if (key in this.elements) this.elements[key] = element;
    }

    get(key: string): T {
        return this.elements[key];
    }
}