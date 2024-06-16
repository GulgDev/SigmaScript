import { NativeLib as _NativeLib } from "./sigmascript/lib";
import { SigmaScriptRuntime } from "./sigmascript/runtime";
import { SigmaScript } from "./sigmascript/sigmascript";

declare global {
    var runtime: SigmaScriptRuntime;
    var sigmaScript: SigmaScript;
    var NativeLib: typeof _NativeLib;
}