import { NativeLib } from ".";
import { SSFunction } from "../sigmascript";

function mathfn(fn: (...args: number[]) => number) {
    return (args: string[]) => {
        const result = fn(...args.map((n) => Number.parseFloat(n)));
        if (Number.isNaN(result)) return "unknown";
        return `${result}`;
    };
}

export class MathLib extends NativeLib {
    readonly variables: Readonly<{ [key: string]: string }> = {
        pi: `${Math.PI}`
    };
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        abs: mathfn((x) => Math.abs(x)),
        sign: mathfn((x) => Math.sign(x)),
        sqrt: mathfn((x) => Math.sqrt(x)),
        sin: mathfn((x) => Math.sin(x)),
        cos: mathfn((x) => Math.cos(x)),
        tan: mathfn((x) => Math.tan(x)),
        asin: mathfn((x) => Math.asin(x)),
        acos: mathfn((x) => Math.acos(x)),
        atan: mathfn((y, x) => x == null ? Math.atan(y) : Math.atan2(y, x)),
        sinh: mathfn((x) => Math.sinh(x)),
        cosh: mathfn((x) => Math.cosh(x)),
        tanh: mathfn((x) => Math.tanh(x)),
        asinh: mathfn((x) => Math.asinh(x)),
        acosh: mathfn((x) => Math.acosh(x)),
        atanh: mathfn((x) => Math.atanh(x)),
        exp: mathfn((x) => Math.exp(x)),
        rad: mathfn((deg) => deg * Math.PI / 180),
        deg: mathfn((rad) => rad * 180 / Math.PI),
        random: () => `${Math.random()}`,
        randint: ([a, b]) => this.randint(a, b)
    };

    randint(a: string, b: string) {
        const n1 = Number.parseFloat(a);
        const n2 = Number.parseFloat(b);
        const min = Math.min(n1, n2);
        const max = Math.max(n1, n2);
        return `${Math.random() * (max - min) + min}`;
    }
}