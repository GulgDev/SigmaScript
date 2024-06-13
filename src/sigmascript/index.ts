import { initLoader } from "../loader";
import { BrowserRuntime } from "../runtimes/browser";
import { NativeLib } from "./lib";
import { MIME_TYPE, SigmaScript } from "./sigmascript";

declare global {
    interface Window {
        sigmaScript: SigmaScript;
        NativeLib: typeof NativeLib;
    }
}

window.NativeLib = NativeLib;

window.sigmaScript = new SigmaScript();
BrowserRuntime.addLibraries(window.sigmaScript);
initLoader(MIME_TYPE, (source) => window.sigmaScript.load(source));