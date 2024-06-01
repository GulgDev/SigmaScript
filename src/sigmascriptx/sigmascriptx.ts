import { SSFunction, SigmaScript } from "../sigmascript/sigmascript";
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

fn <test attr="default"> {
    ret <span>{ attr }</span>;
}

dom_append(dom_body,
    <div>
        <test attr="test"></test>
        <test></test>
    </div>
);
*/

const grammar: Partial<Grammar> = {
    "htmlname": "[a-z-]+",
    "htmlattrval": "%string|({ %expr })",
    "htmlattr": "%htmlname=%htmlattrval",
    "htmlentity": "&%htmlname;",
    "htmltext": "([^&<>{}])+",
    "htmlcontent": "(%htmltext|%htmlentity|({ %expr })|%html)+?",
    "html": "<%htmlname( %htmlattr )+?>%htmlcontent</%htmlname>",
    "expr": "...|%html"
};

const htmlentities: { [key: string]: string } = {
    "amp": "&",
    "lt": "<",
    "gt": ">"
};

export class SigmaScriptX extends SigmaScript {
    constructor() {
        super(grammar);
    }

    private parseAttributes(element: string, html: ASTElement, variables: { [key: string]: string; }, functions: { [key: string]: SSFunction; }) {
        for (const attr of html.findChildren("htmlattr"))
            domLib.functions.dom_set_attr([
                element,
                attr.find("htmlname").value,
                this.evalExpr(attr.find("htmlattrval").first, variables, functions)
            ], { variables, functions });
    }

    private parseContent(element: string, content: ASTElement, variables: { [key: string]: string; }, functions: { [key: string]: SSFunction; }) {
        for (const child of content) {
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
                    value = this.evalExpr(child, variables, functions);
                    break;
            }
            domLib.functions.dom_append([element, value], { variables, functions });
        }
    }

    protected evalExpr(expr: ASTElement, variables: { [key: string]: string; }, functions: { [key: string]: SSFunction; }): string {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "html":
                if (expr.first.value !== expr.last.value) return "unknown";
                const element = domLib.functions.dom_create([expr.first.value], { variables, functions });
                this.parseAttributes(element, expr, variables, functions);
                this.parseContent(element, expr.find("htmlcontent"), variables, functions);
                return element;
            default:
                return super.evalExpr(expr, variables, functions);
        }
    }
}