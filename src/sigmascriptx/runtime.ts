import { DOMLib } from "../sigmascript/lib/dom";
import { Registry } from "../sigmascript/registry";
import { SigmaScriptRuntime } from "../sigmascript/runtime";
import { Scope } from "../sigmascript/sigmascript";
import { SSXScope } from "./sigmascriptx";

export class SigmaScriptXRuntime extends SigmaScriptRuntime {
    private readonly groupRegistry = new Registry<string[]>("ssxgroup");

    scope(parent?: Scope): SSXScope {
        const scope = { variables: {}, functions: {}, components: {} };
        if (parent)
            this.copyScope(parent, scope);
        return scope;
    }

    copyScope(source: Scope, destination: Scope) {
        Object.assign(destination.variables, source.variables);
        Object.assign(destination.functions, source.functions);
        if ("components" in source && "components" in destination)
            Object.assign(destination.components, source.components);
    }

    ssx(scope: SSXScope, tagName: string, attrs: { [key: string]: string }, content: string) {
        const component = scope.components[tagName];
        if (component)
            return component(attrs, content);
        else {
            const domLib = this.getLib(DOMLib);
            const element = domLib.create(tagName);
            for (const [attr, value] of Object.entries(attrs))
                domLib.setAttr(element, attr, value);
            if (content !== "unknown") {
                const group = this.groupRegistry.get(content);
                if (group)
                    for (const child of group)
                        domLib.append(element, child);
                else
                    domLib.append(element, content);
            }
            return element;
        }
    }

    ssxGroup(...elements: string[]) {
        return this.groupRegistry.add(elements);
    }
}