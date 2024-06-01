import { NativeLib } from ".";
import { Registry } from "../registry";
import { SSFunction } from "../sigmascript";

export class RefLib extends NativeLib {
    private readonly registry = new Registry<string>("ref");

    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        ref: ([ initialValue ]) => this.ref(initialValue),
        ref_set: ([ ref, value ]) => this.set(ref, value),
        ref_get: ([ ref ]) => this.get(ref)
    };

    ref(initialValue: string) {
        return this.registry.add(initialValue);
    }

    set(ref: string, value: string) {
        this.registry.set(ref, value);
        return "unknown";
    }

    get(ref: string) {
        return this.registry.get(ref) ?? "unknown";
    }
}