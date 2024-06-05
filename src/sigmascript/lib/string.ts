import { NativeLib } from ".";
import { SSFunction } from "../sigmascript";

export class StringLib extends NativeLib {
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        string_at: ([ string, index ]) => string.at(Number.parseInt(index)) ?? "unknown",
        string_length: ([ string ]) => `${string.length}`,
        string_slice: ([ string, start, end ]) => string.slice(Number.parseInt(start), Number.parseInt(end)),
        string_replace: ([ string, search, replace ]) => string.replace(search, replace)
    };
}