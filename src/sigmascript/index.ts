import { SigmaScript } from "./sigmascript";

declare global {
    interface Window {
        sigmaScript: SigmaScript;
    }
}

window.sigmaScript = new SigmaScript();
window.sigmaScript.initLoader();