import { Scope, SigmaScript } from "../sigmascript/sigmascript";
import { ASTElement, Grammar } from "../parser";
import { domLib } from "../sigmascript/lib/dom";

/*
use dom;

dom_append(dom_body,
    <div attr="test">
        <span>Hello world! 2 + 2 = {2 + 2}</span>
    </div>
);
*/

/*
use dom;

fn <test class="default" > {
    ret <span class={class}>{ children }</span>;
}

dom_append(dom_body,
    <div>
        <test class="test">Hello world!</test>
    </div>
);
*/

const grammar: Partial<Grammar> = {
    "htmlname": "[a-z0-9-]+",
    "htmlattrval": "%string|({ %expr })",
    "htmlattr": "%htmlname=%htmlattrval",
    "htmlentity": "&%htmlname;",
    "htmltext": "([^&<>{}])+",
    "htmlcontent": "(%htmltext|%htmlentity|({ %expr })|%html)+?",
    "htmlsingle": "<%htmlname( %htmlattr )+? />",
    "htmlpaired": "<%htmlname( %htmlattr )+?>%htmlcontent</%htmlname>",
    "html": "%htmlsingle|%htmlpaired",
    "expr": "...|%html",
    "component": "fn <%htmlname( %htmlattr )+?> { %body }",
    "statement": "...|%component"
};

const htmlentities: { [key: string]: string } = {
    "amp": "&",
    "lt": "<",
    "gt": ">"
};

class SSXScope extends Scope {
    readonly components: { [key: string]: (children: string, attrvals: { [key: string]: string }) => string } = {};

    constructor(scope?: Scope) {
        super(scope);
        if (scope instanceof SSXScope)
            this.components = { ...scope.components };
    }
}

export class SigmaScriptX extends SigmaScript {
    private readonly groups: { [key: string]: string[] } = {};
    private groupId = -1;

    constructor() {
        super(grammar);
    }

    protected parseHTMLContent(htmlcontent: ASTElement, scope: SSXScope): string[] {
        const children: string[] = [];
        for (const child of htmlcontent) {
            let value;
            switch (child.name) {
                case "htmltext":
                    value = child.value;
                    break;
                case "htmlentity":
                    value = htmlentities[child.find("htmlname").value] ?? child.value;
                    break;
                case "expr":
                case "html":
                    value = this.evalExpr(child, scope);
                    break;
            }
            const group = this.groups[value];
            if (group)
                children.push(...group);
            else
                children.push(value);
        }
        return children;
    }

    protected evalExpr(expr: ASTElement, scope: SSXScope): string {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "html": {
                expr = expr.first;
                const isPaired = expr.name === "htmlpaired";
                const tagName = expr.first.value;
                if (isPaired && expr.last.value !== tagName) return "unknown";
                const component = scope.components[tagName];
                if (component) {
                    const attrvals: { [key: string]: string } = {};
                    for (const attr of expr.findChildren("htmlattr"))
                        attrvals[attr.find("htmlname").value] = this.evalExpr(attr.find("htmlattrval").first, scope);
                    let children = "unknown";
                    if (isPaired) {
                        children = `#ssxgroup:${++this.groupId}`;
                        this.groups[children] = this.parseHTMLContent(expr.find("htmlcontent"), scope);
                    }
                    return component(children, attrvals);
                } else {
                    const element = domLib.functions.dom_create([tagName], scope);
                    for (const attr of expr.findChildren("htmlattr"))
                        domLib.functions.dom_set_attr([
                            element,
                            attr.find("htmlname").value,
                            this.evalExpr(attr.find("htmlattrval").first, scope)
                        ], scope);
                    if (isPaired)
                        for (const child of this.parseHTMLContent(expr.find("htmlcontent"), scope))
                            domLib.functions.dom_append([element, child], scope);
                    return element;
                }
            }
            default:
                return super.evalExpr(expr, scope);
        }
    }

    protected execStatement(statement: ASTElement, scope: SSXScope): string {
        switch (statement.name) {
            case "component": {
                const body = statement.find("body");
                const attrs: { [key: string]: string } = {};
                for (const attr of statement.findChildren("htmlattr"))
                    attrs[attr.find("htmlname").value] = this.evalExpr(attr.find("htmlattrval").first, scope);
                scope.components[statement.find("htmlname").value] = (children: string, attrvals: { [key: string]: string }) => {
                    const localScope = this.newScope(scope);
                    localScope.variables.children = children;
                    for (const attrname in attrs)
                        localScope.variables[attrname] = attrvals[attrname] ?? attrs[attrname];
                    return this.exec(body, localScope) ?? "unknown";
                };
                break;
            }
            default:
                return super.execStatement(statement, scope);
        }
    }

    protected newScope(parent?: Scope): SSXScope {
        return new SSXScope(parent);
    }
}