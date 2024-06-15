import { NodeRuntime } from "./runtimes/node";
import { SigmaScript } from "./sigmascript/sigmascript";
import fetch from "node-fetch";
import { readFile, writeFile } from "fs/promises";

const FLAGS = {
    compile: ["C"],
    bundle: ["B"]
};

function isURL(path: string) {
    let url;
    try {
        url = new URL(path);
    } catch {
        return false;
    }
    return true;
}

const sigmaScript = new SigmaScript();
NodeRuntime.addLibraries(sigmaScript);

const flags = new Map<string, string>();

const args = process.argv.slice(2);

argLoop: for (const arg of args) {
    if (/^(-[A-Z]|--[a-z-]+)(=.+)?$/.test(arg)) {
        const flagName = arg.match(/^(-[A-Z]|--[a-z-]+)/)[0];
        const eqIndex = arg.indexOf("=");
        const flagValue = eqIndex === -1 ? flagName : arg.slice(eqIndex + 1);
        for (const [flag, aliases] of Object.entries(FLAGS)) {
            if (flag === flagName || aliases.includes(flagName)) {
                flags.set(flag, flagValue);
                continue argLoop;
            }
        }
        console.error(`Invalid flag: '${arg}'`);
        continue;
    }
}

const bundle = [];

for (const path of args) {
    let source;
    if (isURL(path)) {
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
        await writeFile(path.split(".").slice(0, -1).join(".") + ".js", sigmaScript.compile(source) ?? "");
    else if (flags.has("bundle"))
        bundle.push(sigmaScript.compile(source) ?? "");
    else
        sigmaScript.load(source);
}

if (flags.has("bundle")) {
    let result = "";
    for (const script of bundle) {
        result += `(() => {\n${script}})();\n`;
    }
    await writeFile(flags.get("bundle"), result);
}