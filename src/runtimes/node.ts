import { SigmaScript } from "../sigmascript/sigmascript";
import { FnLib } from "../sigmascript/lib/fn";
import { NodeJSLib } from "../sigmascript/lib/js-node";
import { RefLib } from "../sigmascript/lib/ref";
import { StringLib } from "../sigmascript/lib/string";
import { StructLib } from "../sigmascript/lib/struct";
import { ArrayLib } from "../sigmascript/lib/array";
import { MathLib } from "../sigmascript/lib/math";

export namespace NodeRuntime {
    export function addLibraries(sigmaScript: SigmaScript) {
        sigmaScript.addLib("fn", new FnLib(sigmaScript));
        sigmaScript.addLib("js", new NodeJSLib(sigmaScript));
        sigmaScript.addLib("ref", new RefLib(sigmaScript));
        sigmaScript.addLib("string", new StringLib(sigmaScript));
        sigmaScript.addLib("struct", new StructLib(sigmaScript));
        sigmaScript.addLib("array", new ArrayLib(sigmaScript));
        sigmaScript.addLib("math", new MathLib(sigmaScript));
    }
}