import { NativeLib } from ".";
import { SSFunction } from "../sigmascript";

export class StringLib extends NativeLib {
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        string_at: (string, index) => string.at(Number.parseInt(index)) ?? "unknown",
        string_length: (string) => `${string.length}`,
        string_slice: (string, start, end) => string.slice(Number.parseInt(start), Number.parseInt(end)),
        string_replace: (string, search, replace) => string.replaceAll(search, replace),
        string_format: (string, ...values) => this.format(string, values)
    };

    format(string: string, values: string[]) {
        if (values.length === 0)
            return string;
        let result = "";
        const strlen = string.length;
        let i = 0;
        let j = 0;
        while (i < strlen) {
            const ch = string[i];
            ++i;
            if (ch === "%") {
                if (string[i] === "%")
                    ++i;
                else {
                    result += values[j];
                    ++j;
                    if (j >= values.length) {
                        result += string.slice(i);
                        break;
                    }
                    continue;
                }
            }
            result += ch;
        }
        return result;
    }
}