import { NativeLib } from ".";
import { Registry } from "../registry";
import { SSFunction } from "../sigmascript";

export class ArrayLib extends NativeLib {
    private readonly registry = new Registry<string[]>("array");

    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        array: (...elements) => this.array(elements),
        array_add: (array, element) => this.add(array, element),
        array_remove: (array, index) => this.remove(array, index),
        array_at: (array, index) => this.at(array, index),
        array_set: (array, index, element) => this.set(array, index, element),
        array_length: (array) => this.length(array),
        array_find: (array, element) => this.find(array, element)
    };

    array(elements: string[]) {
        return this.registry.add(elements);
    }

    add(array: string, element: string) {
        this.registry.get(array)?.push(element);
        return "unknown";
    }

    remove(array: string, index: string) {
        this.registry.get(array)?.splice(Number.parseInt(index), 1);
        return "unknown";
    }

    at(array: string, index: string) {
        return this.registry.get(array)?.at(Number.parseInt(index)) ?? "unknown";
    }

    set(array: string, index: string, element: string) {
        const arr = this.registry.get(array);
        const i = Number.parseInt(index);
        if (arr && !Number.isNaN(i) && i >= -arr.length && i < arr.length)
            arr[i < 0 ? arr.length + i : i] = element;
        return "unknown";
    }

    length(array: string) {
        const arr = this.registry.get(array);
        if (arr == null) return "unknown";
        return `${arr.length}`;
    }

    find(array: string, element: string) {
        const index = this.registry.get(array)?.indexOf(element);
        if (index == null || index === -1) return "unknown";
        return `${index}`;
    }

    getArray(array: string) {
        return this.registry.get(array);
    }
}