import { SigmaScript } from ".";

export async function load(script: HTMLScriptElement) {
    if (script.getAttribute("type") !== "text/sigmascript") return;
    let source;
    if (script.hasAttribute("src")) {
        const response = await fetch(script.getAttribute("src"));
        source = await response.text();
    } else
        source = script.innerText;
    SigmaScript.load(source);
}

export function init() {
    new MutationObserver((mutations) => {
        for (const mutation of mutations)
            if (mutation.type === "childList")
                for (const node of mutation.addedNodes)
                    if (node instanceof HTMLScriptElement)
                        load(node);
    }).observe(document, { childList: true, subtree: true });
    for (const script of document.getElementsByTagName("script"))
        load(script);
}