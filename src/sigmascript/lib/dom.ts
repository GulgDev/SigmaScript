import { NativeLib } from "./lib";

let elementId = -1;

const elements: { [key: string]: Element } = {};

function saveElement(element: Element): string {
    const key = `#dom:${++elementId}`;
    elements[key] = element;
    return key;
}

function getElement(handle: string): Element {
    return elements[handle];
}

export const domLib = new NativeLib({
    dom_head: saveElement(document.head),
    dom_body: saveElement(document.body)
}, {
    dom_title([ title ]) {
        document.title = title;
        return "unknown";
    },
    dom_create([ tagName ]) {
        return saveElement(document.createElement(tagName));
    },
    dom_find([ selector ]) {
        const element = document.querySelector(selector);
        if (!element) return "unknown";
        return saveElement(element);
    },
    dom_append([ parent, child ]) {
        getElement(parent)?.appendChild(getElement(child));
        return "unknown";
    },
    dom_remove([ element ]) {
        getElement(element).remove();
        return "unknown";
    },
    dom_add_class([ element, className ]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement) elm.classList.add(className);
        return "unknown";
    },
    dom_remove_class([ element, className ]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement) elm.classList.remove(className);
        return "unknown";
    },
    dom_toggle_class([ element, className ]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement) elm.classList.toggle(className);
        return "unknown";
    },
    dom_set_text([ element, text ]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement) elm.innerText = text;
        return "unknown";
    },
    dom_set_html([ element, html ]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement) elm.innerHTML = html;
        return "unknown";
    },
    dom_set_attr([ element, attr, value ]) {
        getElement(element)?.setAttribute(attr, value);
        return "unknown";
    },
    dom_get_attr([ element, attr ]) {
        return getElement(element)?.getAttribute(attr);
    },
    dom_css([ element, attr, value ]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement) elm.style.setProperty(attr, value);
        return "unknown";
    }
});