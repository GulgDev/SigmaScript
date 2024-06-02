import { NativeLib } from "./lib";
import { SigmaScript } from "./sigmascript";

declare global {
    interface Window {
        sigmaScript: SigmaScript;
        NativeLib: typeof NativeLib;
    }
}

window.NativeLib = NativeLib;

window.sigmaScript = new SigmaScript();
window.sigmaScript.initLoader();