import { NativeLib } from "../sigmascript/lib";
import { SigmaScriptX } from "./sigmascriptx";

window.NativeLib = NativeLib;

window.sigmaScript = new SigmaScriptX();
window.sigmaScript.initLoader();