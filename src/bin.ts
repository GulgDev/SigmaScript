import { SigmaScript } from "./sigmascript/sigmascript";
import { SigmaScriptX } from "./sigmascriptx/sigmascriptx";
import fetch from "node-fetch";
import { readFile, writeFile } from "fs/promises";
import { resolve, basename } from "path";
import { runtime } from "./sigmascript/runtime/node";
import * as fg from "fast-glob";

const FLAGS: { [key: string]: string } = {
    "compile": "C",
    "bundle": "B",
    "bundle-runtime": "R",
    "ssx": "X"
};

const RUNTIMES = ["node", "browser", "ssx"];

function isURL(path: string) {
    try {
        new URL(path);
    } catch {
        return false;
    }
    return true;
}

const flags = new Map<string, string>();

const paths = [];

argLoop: for (const arg of process.argv.slice(2)) {
    if (/^(-[A-Z]|--[a-z-]+)(=.+)?$/.test(arg)) {
        const match = arg.match(/^(-([A-Z])|--([a-z-]+))/);
        const flagName = match[2] ?? match[3];
        const eqIndex = arg.indexOf("=");
        const flagValue = eqIndex === -1 ? flagName : arg.slice(eqIndex + 1);
        for (const [flag, alias] of Object.entries(FLAGS))
            if (flag === flagName || alias === flagName) {
                flags.set(flag, flagValue);
                continue argLoop;
            }
        console.error(`Invalid flag: '${flagName}' (${arg})`);
    } else
        paths.push(...await fg(arg, { dot: true }));
}

if (flags.has("bundle-runtime") && !RUNTIMES.includes(flags.get("bundle-runtime"))) {
    console.error(`Unknown runtime: '${flags.get("bundle-runtime")}'`);
    process.exit(-1);
}

if (flags.has("bundle") && flags.has("compile")) {
    console.error("Cannot use '--bundle' and '--compile' together");
    process.exit(-1);
}

if (!flags.has("bundle") && flags.has("bundle-runtime"))
    console.warn("'--bundle-runtime' is ignored when '--bundle' flag is not set");

if (flags.has("ssx") && !flags.has("bundle") && !flags.has("compile")) {
    console.error("Cannot run scripts with '--ssx' flag");
    process.exit(-1);
} else if (flags.has("ssx") && flags.has("bundle-runtime") && flags.get("bundle-runtime") !== "ssx")
    console.warn("'--ssx' is enabled, but '--bundle-runtime' is not 'ssx'");

const sigmaScript =
    (flags.has("bundle") || flags.has("compile")) && flags.has("ssx") ?
        new SigmaScriptX(null) : new SigmaScript(runtime);

const scripts = [];

for (const path of paths) {
    let source;
    const url = isURL(path);
    if (url) {
        let response;
        try {
            response = await fetch(path);
        } catch (err) {
            console.error(`${path} - ${err.message}`);
            continue;
        }
        if (!response.ok) {
            console.error(`${path} - ${response.status} (${response.statusText})`);
            continue;
        }
        try {
            source = await response.text();
        } catch (err) {
            console.error(`${path} - ${err.message}`);
            continue;
        }
    } else {
        try {
            source = await readFile(path, { encoding: "utf8" });
        } catch (err) {
            console.error(`${path} - ${err.message}`);
            continue;
        }
    }
    if (flags.has("compile"))
        await writeFile(
            (url ? basename(path) : path).split(".").slice(0, -1).join(".") + ".js",
            sigmaScript.compile(source) ?? ""
        );
    else {
        const lib = sigmaScript.getLibName(source);
        const script = { lib, source };
        if (lib)
            scripts.unshift(script);
        else
            scripts.push(script);
    }
}

if (flags.has("bundle")) {
    let result = flags.has("bundle-runtime") ?
        await readFile(resolve(__dirname, `../dist/runtime/${flags.get("bundle-runtime")}.js`), { encoding: "utf8" }) + "\n" : "";
    for (const script of scripts) {
        const compiled = sigmaScript.compile(script.source);
        if (!compiled) continue;
        const func = `(runtime) => {\n${compiled}}`;
        result += script.lib ? `runtime.lib("${script.lib}", ${func});\n` : `(${func})(runtime);\n`;
    }
    await writeFile(flags.get("bundle"), result);
} else {
    for (const { source } of scripts)
        sigmaScript.load(source);
}