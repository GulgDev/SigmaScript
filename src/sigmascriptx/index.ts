import { initLoader } from "../loader";
import { runtime } from "../sigmascript/runtime/ssx";
import { NativeLib } from "../sigmascript/lib";
import { MIME_TYPE } from "../sigmascript/sigmascript";
import { SigmaScriptX } from "./sigmascriptx";

globalThis.NativeLib = NativeLib;

globalThis.sigmaScript = new SigmaScriptX(runtime);
initLoader(MIME_TYPE, (source) => globalThis.sigmaScript.load(source));