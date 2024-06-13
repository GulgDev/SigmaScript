import { NodeRuntime } from "./runtimes/node";
import { SigmaScript } from "./sigmascript/sigmascript";
import fetch from "node-fetch";
import { readFile } from "fs/promises";

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

for (const path of process.argv.slice(2)) {
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
    sigmaScript.load(source);
}