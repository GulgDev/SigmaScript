import { NativeLib } from ".";
import { Registry } from "../registry";
import { SSFunction, Scope } from "../sigmascript";
import { FnLib } from "./fn";

export class DOMLib extends NativeLib {
    private readonly registry = new Registry<Element>("dom");

    readonly variables: Readonly<{ [key: string]: string }> = {
        dom_head: this.registry.add(document.head),
        dom_body: this.registry.add(document.body)
    };
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        dom_title: ([ title ]) => this.title(title),
        dom_create: ([ tagName ]) => this.create(tagName),
        dom_find: ([ selector ]) => this.find(selector),
        dom_append: ([ parent, child ]) => this.append(parent, child),
        dom_remove: ([ element ]) => this.remove(element),
        dom_add_class: ([ element, className ]) => this.addClass(element, className),
        dom_remove_class: ([ element, className ]) => this.removeClass(element, className),
        dom_toggle_class: ([ element, className ]) => this.toggleClass(element, className),
        dom_set_text: ([ element, text ]) => this.setText(element, text),
        dom_set_html: ([ element, html ]) => this.setHtml(element, html),
        dom_set_attr: ([ element, attr, value ], scope) => this.setAttr(element, attr, value, scope),
        dom_get_attr: ([ element, attr ]) => this.getAttr(element, attr),
        dom_css: ([ element, prop, value ]) => this.css(element, prop, value),
        dom_event: ([ element, event, callback ], scope) => this.event(element, event, callback, scope)
    };
    
    getElement(handle: string): Element {
        return this.registry.get(handle);
    }

    title(title: string) {
        document.title = title;
        return "unknown";
    }

    create(tagName: string) {
        return this.registry.add(document.createElement(tagName));
    }

    find(selector: string) {
        const element = document.querySelector(selector);
        if (!element) return "unknown";
        return this.registry.add(element);
    }

    append(parent: string, child: string) {
        this.getElement(parent)?.appendChild(this.getElement(child) ?? document.createTextNode(child));
        return "unknown";
    }

    remove(element: string) {
        this.getElement(element).remove();
        return "unknown";
    }

    addClass(element: string, className: string) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement) elm.classList.add(className);
        return "unknown";
    }

    removeClass(element: string, className: string) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement) elm.classList.remove(className);
        return "unknown";
    }

    toggleClass(element: string, className: string) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement) elm.classList.toggle(className);
        return "unknown";
    }

    setText(element: string, text: string) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement) elm.innerText = text;
        return "unknown";
    }

    setHtml(element: string, html: string) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement) elm.innerHTML = html;
        return "unknown";
    }

    setAttr(element: string, attr: string, value: string, scope: Scope) {
        if (attr.startsWith("on")) this.event(element, attr.slice(2), value, scope);
        else this.getElement(element)?.setAttribute(attr, value);
        return "unknown";
    }

    getAttr(element: string, attr: string) {
        return this.getElement(element)?.getAttribute(attr);
    }

    css(element: string, prop: string, value: string) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement) elm.style.setProperty(prop, value);
        return "unknown";
    }

    event(element: string, event: string, callback: string, scope: Scope) {
        const elm = this.getElement(element);
        const fn = this.sigmaScript.getLib(FnLib).getFn(callback, scope);
        if (fn) elm.addEventListener(event, () => fn([], scope));
        return "unknown";
    }
}