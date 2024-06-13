import { initLoader } from "../loader";
import { BrowserRuntime } from "../runtimes/browser";
import { NativeLib } from "../sigmascript/lib";
import { MIME_TYPE } from "../sigmascript/sigmascript";
import { SigmaScriptX } from "./sigmascriptx";

window.NativeLib = NativeLib;

window.sigmaScript = new SigmaScriptX();
BrowserRuntime.addLibraries(window.sigmaScript);
initLoader(MIME_TYPE, (source) => window.sigmaScript.load(source));