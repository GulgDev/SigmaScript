import { NativeLib } from ".";
import { Registry } from "../registry";
import { SSFunction } from "../sigmascript";

export class StructLib extends NativeLib {
    private readonly registry = new Registry<{ [key: string]: string }>("struct");

    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        struct: () => this.struct(),
        struct_set: ([ struct, name, value ]) => this.set(struct, name, value),
        struct_get: ([ struct, name ]) => this.get(struct, name)
    };

    struct() {
        return this.registry.add({});
    }

    set(struct: string, name: string, value: string) {
        const object = this.registry.get(struct);
        if (object) object[name] = value;
        return "unknown";
    }

    get(struct: string, name: string) {
        return this.registry.get(struct)?.[name] ?? "unknown";
    }

    getStruct(struct: string) {
        return this.registry.get(struct);
    }
}