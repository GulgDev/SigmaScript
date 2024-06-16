import { Scope, SigmaScript } from "../sigmascript/sigmascript";
import { ASTElement, Grammar } from "../parser";
import { SigmaScriptXRuntime } from "./runtime";

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

export interface SSXScope extends Scope {
    readonly components: { [key: string]: (attrs: { [key: string]: string }, content: string) => string };
}

export class SigmaScriptX extends SigmaScript {
    constructor(runtime: SigmaScriptXRuntime) {
        super(runtime, grammar);
    }

    protected compileHTMLContent(htmlcontent: ASTElement, depth: number): string {
        const children: string[] = [];
        for (const child of htmlcontent)
            switch (child.name) {
                case "htmltext":
                    children.push(JSON.stringify(child.value));
                    break;
                case "htmlentity":
                    children.push(`"${htmlentities[child.find("htmlname").value] ?? child.value}"`);
                    break;
                case "expr":
                case "html":
                    children.push(this.compileExpr(child, depth));
                    break;
            }
        switch (children.length) {
            case 0:
                return `"unknown"`;
            case 1:
                return children[0];
            default:
                return `runtime.ssxGroup(${children.join(", ")})`;
        }
    }

    protected compileExpr(expr: ASTElement, depth: number): string {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "html": {
                expr = expr.first;
                const isPaired = expr.name === "htmlpaired";
                const tagName = expr.first.value;
                if (isPaired && expr.last.value !== tagName) return `"unknown"`;
                return `runtime.ssx(scope${depth}, "${tagName}", { ${
                    expr.findChildren("htmlattr").map((attr) =>
                        `"${attr.find("htmlname").value}": ${this.compileExpr(attr.find("htmlattrval").first, depth)}`
                    ).join(", ")
                } }, ${
                    this.compileHTMLContent(expr.findChild("htmlcontent"), depth)
                })`;
            }
            default:
                return super.compileExpr(expr, depth);
        }
    }

    protected compileStatement(statement: ASTElement, depth: number): string {
        switch (statement.name) {
            case "component": {
                const attrs: { [key: string]: string } = {};
                for (const attr of statement.findChildren("htmlattr"))
                    attrs[attr.find("htmlname").value] = this.compileExpr(attr.find("htmlattrval").first, depth);
                return `scope${depth}.components["${statement.find("htmlname").value}"] = (attrs, children) => {\n${
                    this.localScope(++depth)
                }scope${depth}.variables.children = children;\n${
                    Object.keys(attrs).map((attr) => `scope${depth}.variables.${attr} = attrs.${attr} ?? ${attrs[attr]};\n`).join("") +
                    this.compileBody(statement.find("body"), depth)
                }return "unknown";\n};`;
            }
            default:
                return super.compileStatement(statement, depth);
        }
    }
}