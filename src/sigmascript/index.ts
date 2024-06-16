import { initLoader } from "../loader";
import { NativeLib } from "./lib";
import { MIME_TYPE, SigmaScript } from "./sigmascript";
import { runtime } from "./runtime/browser";

globalThis.NativeLib = NativeLib;

globalThis.sigmaScript = new SigmaScript(runtime);
initLoader(MIME_TYPE, (source) => globalThis.sigmaScript.load(source));