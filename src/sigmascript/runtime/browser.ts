import { SigmaScriptRuntime } from ".";
import { DOMLib } from "../lib/dom";
import { FnLib } from "../lib/fn";
import { BrowserJSLib } from "../lib/js-browser";
import { RefLib } from "../lib/ref";
import { StringLib } from "../lib/string";
import { StructLib } from "../lib/struct";
import { ArrayLib } from "../lib/array";
import { MathLib } from "../lib/math";

export const runtime = new SigmaScriptRuntime();
runtime.addLib("dom", new DOMLib(runtime));
runtime.addLib("fn", new FnLib(runtime));
runtime.addLib("js", new BrowserJSLib(runtime));
runtime.addLib("ref", new RefLib(runtime));
runtime.addLib("string", new StringLib(runtime));
runtime.addLib("struct", new StructLib(runtime));
runtime.addLib("array", new ArrayLib(runtime));
runtime.addLib("math", new MathLib(runtime));