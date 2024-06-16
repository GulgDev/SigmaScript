import { SigmaScriptRuntime } from ".";
import { FnLib } from "../lib/fn";
import { NodeJSLib } from "../lib/js-node";
import { RefLib } from "../lib/ref";
import { StringLib } from "../lib/string";
import { StructLib } from "../lib/struct";
import { ArrayLib } from "../lib/array";
import { MathLib } from "../lib/math";

export const runtime = new SigmaScriptRuntime();
runtime.addLib("fn", new FnLib(runtime));
runtime.addLib("js", new NodeJSLib(runtime));
runtime.addLib("ref", new RefLib(runtime));
runtime.addLib("string", new StringLib(runtime));
runtime.addLib("struct", new StructLib(runtime));
runtime.addLib("array", new ArrayLib(runtime));
runtime.addLib("math", new MathLib(runtime));