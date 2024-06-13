import { SigmaScript } from "../sigmascript/sigmascript";
import { DOMLib } from "../sigmascript/lib/dom";
import { FnLib } from "../sigmascript/lib/fn";
import { BrowserJSLib } from "../sigmascript/lib/js-browser";
import { RefLib } from "../sigmascript/lib/ref";
import { StringLib } from "../sigmascript/lib/string";
import { StructLib } from "../sigmascript/lib/struct";
import { ArrayLib } from "../sigmascript/lib/array";
import { MathLib } from "../sigmascript/lib/math";

export namespace BrowserRuntime {
    export function addLibraries(sigmaScript: SigmaScript) {
        sigmaScript.addLib("dom", new DOMLib(sigmaScript));
        sigmaScript.addLib("fn", new FnLib(sigmaScript));
        sigmaScript.addLib("js", new BrowserJSLib(sigmaScript));
        sigmaScript.addLib("ref", new RefLib(sigmaScript));
        sigmaScript.addLib("string", new StringLib(sigmaScript));
        sigmaScript.addLib("struct", new StructLib(sigmaScript));
        sigmaScript.addLib("array", new ArrayLib(sigmaScript));
        sigmaScript.addLib("math", new MathLib(sigmaScript));
    }
}