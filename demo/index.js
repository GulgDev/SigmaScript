/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/parser/char.ts":
/*!****************************!*\
  !*** ./src/parser/char.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Char: () => (/* binding */ Char)
/* harmony export */ });
var Char;
(function (Char) {
    function isWhitespace(ch) {
        return ch === " " || ch === "\n" || ch === "\r";
    }
    Char.isWhitespace = isWhitespace;
    function isDigit(ch) {
        if (!ch)
            return false;
        const code = ch.charCodeAt(0);
        return code >= 48 && code <= 57;
    }
    Char.isDigit = isDigit;
    function isLetter(ch) {
        if (!ch)
            return false;
        const code = ch.toLowerCase().charCodeAt(0);
        return code >= 97 && code <= 122;
    }
    Char.isLetter = isLetter;
})(Char || (Char = {}));


/***/ }),

/***/ "./src/parser/index.ts":
/*!*****************************!*\
  !*** ./src/parser/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASTElement: () => (/* binding */ ASTElement),
/* harmony export */   Parser: () => (/* binding */ Parser),
/* harmony export */   inherit: () => (/* binding */ inherit)
/* harmony export */ });
/* harmony import */ var _pattern__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pattern */ "./src/parser/pattern.ts");
/* harmony import */ var _stream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stream */ "./src/parser/stream.ts");


class ASTElement {
    constructor(name, start, end, value) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.value = value;
        this.children = [];
    }
    get first() {
        return this.children[0];
    }
    get last() {
        return this.children.at(-1);
    }
    *[Symbol.iterator]() {
        for (const child of this.children)
            yield child;
    }
    addChild(child) {
        this.children.push(child);
    }
    get(index) {
        return this.children[index];
    }
    findChildren(name) {
        return this.children.filter((child) => child.name === name);
    }
    findChild(name) {
        return this.children.find((child) => child.name === name);
    }
    find(name) {
        const child = this.findChild(name);
        if (child)
            return child;
        for (const child of this.children) {
            const descendant = child.find(name);
            if (descendant)
                return descendant;
        }
    }
}
class Parser {
    constructor(grammar) {
        this.patterns = new Map();
        for (const [name, definition] of Object.entries(grammar))
            if (typeof definition === "string")
                this.patterns.set(name, (0,_pattern__WEBPACK_IMPORTED_MODULE_0__.pattern)(definition));
            else
                this.patterns.set(name, (0,_pattern__WEBPACK_IMPORTED_MODULE_0__.pattern)(definition.pattern, definition.precedence, definition.preservePrecedence));
    }
    parse(buffer) {
        function visit(current, parent) {
            if (current.name) {
                const newParent = new ASTElement(current.name, current.start, current.end, buffer.slice(current.start.offset, current.end.offset));
                parent.addChild(newParent);
                parent = newParent;
            }
            if (current.children)
                for (const child of current.children)
                    visit(child, parent);
        }
        const match = this.patterns.get("root").match(new _stream__WEBPACK_IMPORTED_MODULE_1__.Stream(buffer), this.patterns);
        if (!match)
            return;
        const root = new ASTElement("root", match.start, match.end, buffer.slice(match.start.offset, match.end.offset));
        visit(match, root);
        return root;
    }
}
function mergePatterns(a, b) {
    return b.replace(/\.\.\./g, a);
}
function merge(a, b) {
    var _a, _b;
    if (!a)
        return b;
    if (!b)
        return a;
    if (typeof a === "string" && typeof b === "string")
        return mergePatterns(a, b);
    if (typeof a === "string" && typeof b !== "string")
        return Object.assign(Object.assign({}, b), { pattern: mergePatterns(a, b.pattern) });
    if (typeof a !== "string" && typeof b === "string")
        return Object.assign(Object.assign({}, a), { pattern: mergePatterns(a.pattern, b) });
    if (typeof a !== "string" && typeof b !== "string")
        return {
            pattern: mergePatterns(a.pattern, b.pattern),
            precedence: (_a = b.precedence) !== null && _a !== void 0 ? _a : a.precedence,
            preservePrecedence: (_b = b.preservePrecedence) !== null && _b !== void 0 ? _b : a.preservePrecedence
        };
}
function inherit(parent, grammar) {
    const result = { root: merge(parent.root, grammar.root) };
    for (const name in parent)
        if (!(name in result))
            result[name] = merge(parent[name], grammar[name]);
    for (const name in grammar)
        if (!(name in result))
            result[name] = merge(parent[name], grammar[name]);
    return result;
}


/***/ }),

/***/ "./src/parser/pattern.ts":
/*!*******************************!*\
  !*** ./src/parser/pattern.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnyPattern: () => (/* binding */ AnyPattern),
/* harmony export */   CharacterGroupPattern: () => (/* binding */ CharacterGroupPattern),
/* harmony export */   DigitPattern: () => (/* binding */ DigitPattern),
/* harmony export */   GroupPattern: () => (/* binding */ GroupPattern),
/* harmony export */   NamedPattern: () => (/* binding */ NamedPattern),
/* harmony export */   OptionalPattern: () => (/* binding */ OptionalPattern),
/* harmony export */   OrPattern: () => (/* binding */ OrPattern),
/* harmony export */   Pattern: () => (/* binding */ Pattern),
/* harmony export */   RawPattern: () => (/* binding */ RawPattern),
/* harmony export */   RepeatPattern: () => (/* binding */ RepeatPattern),
/* harmony export */   WhitespacePattern: () => (/* binding */ WhitespacePattern),
/* harmony export */   pattern: () => (/* binding */ pattern)
/* harmony export */ });
/* harmony import */ var _char__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./char */ "./src/parser/char.ts");
/* harmony import */ var _stream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stream */ "./src/parser/stream.ts");


class Stack {
    constructor(elements = {}, last) {
        this.elements = elements;
        this.last = last;
    }
    with(offset, name) {
        const elements = Object.assign({}, this.elements);
        elements[offset] = elements[offset] ? [...elements[offset], name] : [name];
        return new Stack(elements, name);
    }
    has(offset, name) {
        var _a;
        return (_a = this.elements[offset]) === null || _a === void 0 ? void 0 : _a.includes(name);
    }
}
class Pattern {
}
class RawPattern extends Pattern {
    constructor(ch) {
        super();
        this.ch = ch;
    }
    match(stream) {
        const start = stream.location;
        if (stream.peekch() !== this.ch)
            return;
        stream.consume();
        return { start, end: stream.location };
    }
}
class OrPattern extends Pattern {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }
    match(stream, registry, precedence = 1, stack = new Stack(), cache = {}) {
        const start = stream.location;
        const matchA = !(this.a instanceof NamedPattern && stack.has(start.offset, this.a.name)) && this.a.match(stream, registry, precedence, stack, cache);
        const endA = stream.location;
        stream.location = start;
        const matchB = !(this.b instanceof NamedPattern && stack.has(start.offset, this.b.name)) && this.b.match(stream, registry, precedence, stack, cache);
        const endB = stream.location;
        let match = (!matchA && matchB) || (!matchB && matchA);
        if (matchA && matchB)
            match = endA.offset > endB.offset ? matchA : matchB;
        if (match === matchA)
            stream.location = endA;
        if (match)
            return { start, end: stream.location, children: [match] };
    }
}
class WhitespacePattern extends Pattern {
    match(stream) {
        const start = stream.location;
        while (_char__WEBPACK_IMPORTED_MODULE_0__.Char.isWhitespace(stream.peekch()))
            stream.consume();
        return { start, end: stream.location };
    }
}
class AnyPattern extends Pattern {
    match(stream) {
        const start = stream.location;
        if (!stream.peekch())
            return;
        stream.consume();
        return { start, end: stream.location };
    }
}
class DigitPattern extends Pattern {
    match(stream) {
        const start = stream.location;
        if (!_char__WEBPACK_IMPORTED_MODULE_0__.Char.isDigit(stream.peekch()))
            return;
        stream.consume();
        return { start, end: stream.location };
    }
}
class OptionalPattern extends Pattern {
    constructor(pattern) {
        super();
        this.pattern = pattern;
    }
    match(stream, registry, precedence = 1, stack = new Stack(), cache = {}) {
        const start = stream.location;
        const match = this.pattern.match(stream, registry, precedence, stack, cache);
        if (!match)
            stream.location = start;
        return { start, end: stream.location, children: match ? [match] : [] };
    }
}
class RepeatPattern extends Pattern {
    constructor(pattern) {
        super();
        this.pattern = pattern;
    }
    match(stream, registry, precedence = 1, stack = new Stack(), cache = {}) {
        const start = stream.location;
        let match = this.pattern.match(stream, registry, precedence, stack, cache);
        const children = [match];
        if (!match)
            return;
        let last = stream.location;
        while (match = this.pattern.match(stream, registry, precedence, stack, cache)) {
            if (last.offset === stream.offset)
                break;
            children.push(match);
            last = stream.location;
        }
        stream.location = last;
        return { start, end: stream.location, children };
    }
}
class CharacterGroupPattern extends Pattern {
    constructor(group, disallow) {
        super();
        this.group = group;
        this.disallow = disallow;
    }
    match(stream) {
        const start = stream.location;
        const ch = stream.peekch();
        if (!ch)
            return;
        const code = ch.charCodeAt(0);
        stream.consume();
        for (const expected of this.group)
            if ((Array.isArray(expected) && code >= expected[0].charCodeAt(0) && code <= expected[1].charCodeAt(0)) || ch === expected)
                return !this.disallow && { start, end: stream.location };
        return this.disallow && { start, end: stream.location };
    }
}
class GroupPattern extends Pattern {
    constructor(children) {
        super();
        this.children = children;
    }
    match(stream, registry, precedence = 1, stack = new Stack(), cache = {}) {
        const start = stream.location;
        const children = [];
        for (const child of this.children) {
            const match = child.match(stream, registry, precedence, stack, cache);
            if (!match)
                return;
            children.push(match);
        }
        return { start, end: stream.location, children };
    }
}
class NamedPattern extends Pattern {
    constructor(name) {
        super();
        this.name = name;
    }
    match(stream, registry, precedence = 1, stack = new Stack(), cache = {}) {
        var _a;
        const key = `${precedence},${stack.last},${stream.offset},${this.name}`;
        const cached = cache[key];
        if (cached !== undefined) {
            if (cached)
                stream.location = cached.end;
            return cached;
        }
        const start = stream.location;
        stack = stack.with(start.offset, this.name);
        const pattern = registry.get(this.name);
        if (!pattern || (pattern.precedence && pattern.precedence < precedence))
            return cache[key] = null;
        const match = pattern.match(stream, registry, pattern.precedence || pattern.preservePrecedence ? (_a = pattern.precedence) !== null && _a !== void 0 ? _a : precedence : 1, stack, cache);
        if (!match)
            return cache[key] = null;
        return cache[key] = { name: this.name, start, end: stream.location, children: [match] };
    }
}
function isSpecialCharacter(ch) {
    return ch === "%" || ch === "|" || ch === "(" || ch === ")" || ch === "+" || ch === "?";
}
function parsePattern(stream, precedence, preservePrecedence = false) {
    const children = [];
    let or = false;
    let ch;
    while (ch = stream.peekch()) {
        stream.consume();
        if (ch === "%") {
            ch = stream.peekch();
            if (isSpecialCharacter(ch)) {
                stream.consume();
                children.push(new RawPattern(ch));
            }
            else {
                let name = "";
                while (_char__WEBPACK_IMPORTED_MODULE_0__.Char.isLetter(ch = stream.peekch())) {
                    stream.consume();
                    name += ch;
                }
                if (name === "d")
                    children.push(new DigitPattern());
                else
                    children.push(new NamedPattern(name));
            }
        }
        else if (ch === "(")
            children.push(parsePattern(stream, precedence));
        else if (ch === ")")
            break;
        else if (ch === "[") {
            const disallow = stream.peekch() === "^";
            if (disallow)
                stream.consume();
            const group = [];
            let range = false;
            while (ch = stream.peekch()) {
                stream.consume();
                const len = group.length;
                if (ch === "%" && stream.peekch() === "]") {
                    stream.consume();
                    group.push("]");
                }
                else if (ch === "]")
                    break;
                else if (ch === "-" && !range && len > 0 && !Array.isArray(group.at(-1))) {
                    range = true;
                    continue;
                }
                else
                    group.push(ch);
                if (range) {
                    range = false;
                    const last = group.pop();
                    group.push([group.pop(), last]);
                }
            }
            children.push(new CharacterGroupPattern(group, disallow));
        }
        else if (ch === ".")
            children.push(new AnyPattern());
        else if (ch === " ")
            children.push(new WhitespacePattern());
        else if (ch === "|" && children.length > 0 && !or) {
            or = true;
            continue;
        }
        else if (ch === "?" && children.length > 0)
            children.push(new OptionalPattern(children.pop()));
        else if (ch === "+" && children.length > 0)
            children.push(new RepeatPattern(children.pop()));
        else
            children.push(new RawPattern(ch));
        if (or) {
            children.push(new OrPattern(children.pop(), children.pop()));
            or = false;
        }
    }
    const result = children.length === 1 ? children[0] : new GroupPattern(children);
    result.precedence = precedence;
    result.preservePrecedence = preservePrecedence;
    return result;
}
function pattern(source, precedence, preservePrecedence) {
    return parsePattern(new _stream__WEBPACK_IMPORTED_MODULE_1__.Stream(source), precedence, preservePrecedence);
}


/***/ }),

/***/ "./src/parser/stream.ts":
/*!******************************!*\
  !*** ./src/parser/stream.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stream: () => (/* binding */ Stream)
/* harmony export */ });
class Stream {
    constructor(buffer) {
        this.buffer = buffer;
        this._offset = 0;
        this.line = 0;
        this.column = 0;
    }
    get location() {
        return { offset: this._offset, line: this.line, column: this.column };
    }
    set location(location) {
        this._offset = location.offset;
        this.line = location.line;
        this.column = location.column;
    }
    get offset() {
        return this._offset;
    }
    peekch() {
        return this.buffer[this._offset];
    }
    consume() {
        if (this.peekch() === "\n") {
            ++this.line;
            this.column = 0;
        }
        else
            ++this.column;
        ++this._offset;
    }
}


/***/ }),

/***/ "./src/sigmascript/grammar.ts":
/*!************************************!*\
  !*** ./src/sigmascript/grammar.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   grammar: () => (/* binding */ grammar)
/* harmony export */ });
const grammar = {
    "number": "%d+",
    "name": "[a-zA-Z_][a-zA-Z0-9_]+?",
    "string": "\"([^\"]|(\\\\)|(\\\"))+?\"",
    "bool": "(true)|(false)",
    "add": {
        pattern: "%expr %+ %expr",
        precedence: 5
    },
    "sub": {
        pattern: "%expr - %expr",
        precedence: 5
    },
    "mul": {
        pattern: "%expr * %expr",
        precedence: 6
    },
    "div": {
        pattern: "%expr / %expr",
        precedence: 6
    },
    "concat": {
        pattern: "%expr @ %expr",
        precedence: 1
    },
    "eq": {
        pattern: "%expr = %expr",
        precedence: 4
    },
    "lt": {
        pattern: "%expr < %expr",
        precedence: 4
    },
    "gt": {
        pattern: "%expr > %expr",
        precedence: 4
    },
    "le": {
        pattern: "%expr <= %expr",
        precedence: 4
    },
    "ge": {
        pattern: "%expr >= %expr",
        precedence: 4
    },
    "or": {
        pattern: "%expr %| %expr",
        precedence: 2
    },
    "and": {
        pattern: "%expr & %expr",
        precedence: 3
    },
    "not": "! %expr",
    "arglist": "(%expr( , %expr)+?)?",
    "call": "%name %( %arglist %)",
    "parenthesisexpr": "%( %expr %)",
    "expr": {
        pattern: "%parenthesisexpr|%number|%string|%bool|%name|%add|%sub|%mul|%div|%concat|%eq|%lt|%gt|%le|%ge|%or|%and|%not|%call",
        preservePrecedence: true
    },
    "assign": "%name = %expr;",
    "paramlist": "(%name( , %name)+?)?",
    "if": "if %expr { %body } %else?",
    "else": "else { %body }",
    "while": "while %expr { %body }",
    "function": "fn %name %( %paramlist %) { %body }",
    "return": "ret %expr;",
    "callstat": "%call;",
    "print": "print %expr;",
    "statement": "%assign|%if|%while|%function|%return|%callstat|%print",
    "body": "( %statement )+?",
    "use": "use %name;",
    "imports": "( %use )+?",
    "lib": "lib %name;",
    "root": "%lib? %imports %body"
};


/***/ }),

/***/ "./src/sigmascript/lib/dom.ts":
/*!************************************!*\
  !*** ./src/sigmascript/lib/dom.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMLib: () => (/* binding */ DOMLib)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registry */ "./src/sigmascript/registry.ts");


class DOMLib extends ___WEBPACK_IMPORTED_MODULE_0__.NativeLib {
    constructor() {
        super(...arguments);
        this.registry = new _registry__WEBPACK_IMPORTED_MODULE_1__.Registry("dom");
        this.variables = {
            dom_head: this.registry.add(document.head),
            dom_body: this.registry.add(document.body)
        };
        this.functions = {
            dom_title: ([title]) => this.title(title),
            dom_create: ([tagName]) => this.create(tagName),
            dom_find: ([selector]) => this.find(selector),
            dom_append: ([parent, child]) => this.append(parent, child),
            dom_remove: ([element]) => this.remove(element),
            dom_add_class: ([element, className]) => this.addClass(element, className),
            dom_remove_class: ([element, className]) => this.removeClass(element, className),
            dom_toggle_class: ([element, className]) => this.toggleClass(element, className),
            dom_set_text: ([element, text]) => this.setText(element, text),
            dom_set_html: ([element, html]) => this.setHtml(element, html),
            dom_set_attr: ([element, attr, value]) => this.setAttr(element, attr, value),
            dom_get_attr: ([element, attr]) => this.getAttr(element, attr),
            dom_css: ([element, prop, value]) => this.css(element, prop, value),
            dom_event: ([element, event, callback], scope) => this.event(element, event, callback, scope)
        };
    }
    getElement(handle) {
        return this.registry.get(handle);
    }
    title(title) {
        document.title = title;
        return "unknown";
    }
    create(tagName) {
        return this.registry.add(document.createElement(tagName));
    }
    find(selector) {
        const element = document.querySelector(selector);
        if (!element)
            return "unknown";
        return this.registry.add(element);
    }
    append(parent, child) {
        var _a, _b;
        (_a = this.getElement(parent)) === null || _a === void 0 ? void 0 : _a.appendChild((_b = this.getElement(child)) !== null && _b !== void 0 ? _b : document.createTextNode(child));
        return "unknown";
    }
    remove(element) {
        this.getElement(element).remove();
        return "unknown";
    }
    addClass(element, className) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement)
            elm.classList.add(className);
        return "unknown";
    }
    removeClass(element, className) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement)
            elm.classList.remove(className);
        return "unknown";
    }
    toggleClass(element, className) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement)
            elm.classList.toggle(className);
        return "unknown";
    }
    setText(element, text) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement)
            elm.innerText = text;
        return "unknown";
    }
    setHtml(element, html) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement)
            elm.innerHTML = html;
        return "unknown";
    }
    setAttr(element, attr, value) {
        var _a;
        (_a = this.getElement(element)) === null || _a === void 0 ? void 0 : _a.setAttribute(attr, value);
        return "unknown";
    }
    getAttr(element, attr) {
        var _a;
        return (_a = this.getElement(element)) === null || _a === void 0 ? void 0 : _a.getAttribute(attr);
    }
    css(element, prop, value) {
        const elm = this.getElement(element);
        if (elm instanceof HTMLElement)
            elm.style.setProperty(prop, value);
        return "unknown";
    }
    event(element, event, callback, scope) {
        const elm = this.getElement(element);
        const fn = scope.functions[callback];
        elm.addEventListener(event, () => fn([], scope));
        return "unknown";
    }
}


/***/ }),

/***/ "./src/sigmascript/lib/fn.ts":
/*!***********************************!*\
  !*** ./src/sigmascript/lib/fn.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FnLib: () => (/* binding */ FnLib)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registry */ "./src/sigmascript/registry.ts");


class FnLib extends ___WEBPACK_IMPORTED_MODULE_0__.NativeLib {
    constructor() {
        super(...arguments);
        this.registry = new _registry__WEBPACK_IMPORTED_MODULE_1__.Registry("fn");
        this.functions = {
            fn: ([name], scope) => this.fn(name, scope),
            call: ([fn, ...args], scope) => this.call(fn, args, scope)
        };
    }
    fn(name, scope) {
        return this.registry.add(scope.functions[name]);
    }
    call(fn, args, scope) {
        var _a, _b;
        return (_b = (_a = this.registry.get(fn)) === null || _a === void 0 ? void 0 : _a(args, scope)) !== null && _b !== void 0 ? _b : "unknown";
    }
}


/***/ }),

/***/ "./src/sigmascript/lib/index.ts":
/*!**************************************!*\
  !*** ./src/sigmascript/lib/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NativeLib: () => (/* binding */ NativeLib),
/* harmony export */   SigmaScriptLib: () => (/* binding */ SigmaScriptLib)
/* harmony export */ });
class SigmaScriptLib {
    constructor(sigmaScript, program) {
        this.sigmaScript = sigmaScript;
        this.program = program;
    }
    use(scope) {
        const libScope = this.sigmaScript.execute(this.program);
        Object.assign(scope.variables, libScope.variables);
        Object.assign(scope.functions, libScope.functions);
    }
}
class NativeLib {
    constructor(sigmaScript) {
        this.variables = {};
        this.functions = {};
        this.sigmaScript = sigmaScript;
    }
    use(scope) {
        Object.assign(scope.variables, this.variables);
        Object.assign(scope.functions, this.functions);
    }
}


/***/ }),

/***/ "./src/sigmascript/lib/js.ts":
/*!***********************************!*\
  !*** ./src/sigmascript/lib/js.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JSLib: () => (/* binding */ JSLib)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registry */ "./src/sigmascript/registry.ts");


class JSLib extends ___WEBPACK_IMPORTED_MODULE_0__.NativeLib {
    constructor() {
        super(...arguments);
        this.registry = new _registry__WEBPACK_IMPORTED_MODULE_1__.Registry("js");
        this.variables = {
            js_window: this.registry.add(window)
        };
        this.functions = {
            js: ([code]) => this.js(code),
            js_get: ([handle, property]) => this.get(handle, property),
            js_set: ([handle, property, value]) => this.set(handle, property, value),
            js_new: ([handle, ...args]) => this.new(handle, args),
            js_call: ([handle, ...args]) => this.call(handle, args),
            js_call_method: ([handle, method, ...args]) => this.callMethod(handle, method, args)
        };
    }
    getObject(handle) {
        return this.registry.get(handle);
    }
    toJS(value) {
        if (value.startsWith("#js:"))
            return this.getObject(value);
        if (value === "unknown")
            return undefined;
        if (value === "false")
            return false;
        if (value === "true")
            return false;
        const number = Number.parseInt(value);
        if (!Number.isNaN(number))
            return number;
        return value;
    }
    toSS(value) {
        if (typeof value === "string" || value instanceof String ||
            typeof value === "boolean" || value instanceof Boolean ||
            Number.isInteger(value))
            return `${value}`;
        if (value == null || Number.isNaN(value))
            return "unknown";
        return this.registry.add(value);
    }
    js(code) {
        return this.toSS(eval(code));
    }
    get(handle, property) {
        var _a;
        const value = (_a = this.getObject(handle)) === null || _a === void 0 ? void 0 : _a[property];
        if (value == null)
            return "unknown";
        return this.toSS(value);
    }
    set(handle, property, value) {
        const object = this.getObject(handle);
        if (object != null)
            object[property] = this.toJS(value);
        return "unknown";
    }
    new(handle, args) {
        const ctor = this.getObject(handle);
        if (ctor == null)
            return "unknown";
        const value = new ctor(...args.map((arg) => this.toJS(arg)));
        if (value == null)
            return "unknown";
        return this.toSS(value);
    }
    call(handle, args) {
        var _a;
        const value = (_a = this.getObject(handle)) === null || _a === void 0 ? void 0 : _a(...args.map((arg) => this.toJS(arg)));
        if (value == null)
            return "unknown";
        return this.toSS(value);
    }
    callMethod(handle, method, args) {
        var _a, _b;
        const value = (_b = (_a = this.getObject(handle)) === null || _a === void 0 ? void 0 : _a[method]) === null || _b === void 0 ? void 0 : _b.call(_a, ...args.map((arg) => this.toJS(arg)));
        if (value == null)
            return "unknown";
        return this.toSS(value);
    }
}
;


/***/ }),

/***/ "./src/sigmascript/lib/ref.ts":
/*!************************************!*\
  !*** ./src/sigmascript/lib/ref.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RefLib: () => (/* binding */ RefLib)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registry */ "./src/sigmascript/registry.ts");


class RefLib extends ___WEBPACK_IMPORTED_MODULE_0__.NativeLib {
    constructor() {
        super(...arguments);
        this.registry = new _registry__WEBPACK_IMPORTED_MODULE_1__.Registry("ref");
        this.functions = {
            ref: ([initialValue]) => this.ref(initialValue),
            ref_set: ([ref, value]) => this.set(ref, value),
            ref_get: ([ref]) => this.get(ref)
        };
    }
    ref(initialValue) {
        return this.registry.add(initialValue);
    }
    set(ref, value) {
        this.registry.set(ref, value);
        return "unknown";
    }
    get(ref) {
        var _a;
        return (_a = this.registry.get(ref)) !== null && _a !== void 0 ? _a : "unknown";
    }
}


/***/ }),

/***/ "./src/sigmascript/registry.ts":
/*!*************************************!*\
  !*** ./src/sigmascript/registry.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Registry: () => (/* binding */ Registry)
/* harmony export */ });
class Registry {
    constructor(name) {
        this.elements = {};
        this.id = -1;
        this.name = name;
    }
    add(element) {
        const key = `#${this.name}:${++this.id}`;
        this.elements[key] = element;
        return key;
    }
    set(key, element) {
        if (key in this.elements)
            this.elements[key] = element;
    }
    get(key) {
        return this.elements[key];
    }
}


/***/ }),

/***/ "./src/sigmascript/sigmascript.ts":
/*!****************************************!*\
  !*** ./src/sigmascript/sigmascript.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scope: () => (/* binding */ Scope),
/* harmony export */   SigmaScript: () => (/* binding */ SigmaScript)
/* harmony export */ });
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parser */ "./src/parser/index.ts");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib */ "./src/sigmascript/lib/index.ts");
/* harmony import */ var _lib_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/dom */ "./src/sigmascript/lib/dom.ts");
/* harmony import */ var _lib_fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/fn */ "./src/sigmascript/lib/fn.ts");
/* harmony import */ var _lib_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/js */ "./src/sigmascript/lib/js.ts");
/* harmony import */ var _lib_ref__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/ref */ "./src/sigmascript/lib/ref.ts");
/* harmony import */ var _grammar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./grammar */ "./src/sigmascript/grammar.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







class Scope {
    constructor(scope) {
        this.variables = {};
        this.functions = {};
        if (scope) {
            this.variables = Object.assign({}, scope.variables);
            this.functions = Object.assign({}, scope.functions);
        }
    }
}
;
class SigmaScript {
    constructor(mergeGrammar = {}) {
        this.libs = {};
        this.parser = new _parser__WEBPACK_IMPORTED_MODULE_0__.Parser((0,_parser__WEBPACK_IMPORTED_MODULE_0__.inherit)(_grammar__WEBPACK_IMPORTED_MODULE_6__.grammar, mergeGrammar));
        this.addLib("dom", new _lib_dom__WEBPACK_IMPORTED_MODULE_2__.DOMLib(this));
        this.addLib("fn", new _lib_fn__WEBPACK_IMPORTED_MODULE_3__.FnLib(this));
        this.addLib("js", new _lib_js__WEBPACK_IMPORTED_MODULE_4__.JSLib(this));
        this.addLib("ref", new _lib_ref__WEBPACK_IMPORTED_MODULE_5__.RefLib(this));
    }
    parseImports(imports, scope) {
        var _a;
        for (const use of imports)
            (_a = this.libs[use.find("name").value]) === null || _a === void 0 ? void 0 : _a.use(scope);
    }
    parseString(raw) {
        return raw.slice(1, -1).replace(/\\\"/g, "\"").replace(/\\\\/g, "\\");
    }
    evalExpr(expr, scope) {
        var _a;
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "parenthesisexpr":
                return this.evalExpr(expr.first, scope);
            case "name":
                return (_a = scope.variables[expr.value]) !== null && _a !== void 0 ? _a : "unknown";
            case "number":
            case "bool":
                return expr.value;
            case "string":
                return this.parseString(expr.value);
            case "add": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseInt(a) + Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "sub": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseInt(a) - Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "mul": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseInt(a) * Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "div": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = ~~(Number.parseInt(a) / Number.parseInt(b));
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "eq": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === b}`;
            }
            case "lt": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a < b}`;
            }
            case "gt": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a > b}`;
            }
            case "le": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a <= b}`;
            }
            case "ge": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a >= b}`;
            }
            case "or": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === "true" || b === "true"}`;
            }
            case "and": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === "true" && b === "true"}`;
            }
            case "not":
                return `${this.evalExpr(expr.first, scope) === "true" ? "false" : "true"}`;
            case "concat": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return a + b;
            }
            case "call": {
                const name = expr.find("name").value;
                const func = scope.functions[name];
                if (!func)
                    return "unknown";
                const args = Array.from(expr.find("arglist")).map((arg) => this.evalExpr(arg, scope));
                return func(args, scope);
            }
        }
        return "unknown";
    }
    execStatement(statement, scope) {
        switch (statement.name) {
            case "assign":
                scope.variables[statement.find("name").value] = this.evalExpr(statement.find("expr"), scope);
                break;
            case "if": {
                const condition = this.evalExpr(statement.find("expr"), scope);
                let result;
                if (condition === "true")
                    result = this.exec(statement.find("body"), scope);
                const elseStatement = statement.findChild("else");
                if (elseStatement && condition === "false")
                    result = this.exec(elseStatement.find("body"), scope);
                if (result)
                    return result;
                break;
            }
            case "while": {
                const expr = statement.find("expr");
                const body = statement.find("body");
                while (this.evalExpr(expr, scope) === "true") {
                    const result = this.exec(body, scope);
                    if (result)
                        return result;
                }
                break;
            }
            case "function": {
                const body = statement.find("body");
                const params = Array.from(statement.find("paramlist")).map((param) => param.value);
                scope.functions[statement.find("name").value] = (args) => {
                    var _a;
                    const localScope = this.newScope(scope);
                    let i = 0;
                    for (const param of params) {
                        const arg = args[i];
                        if (!arg)
                            break;
                        localScope.variables[param] = arg;
                        ++i;
                    }
                    return (_a = this.exec(body, localScope)) !== null && _a !== void 0 ? _a : "unknown";
                };
                break;
            }
            case "print":
                console.log(this.evalExpr(statement.find("expr"), scope));
                break;
            case "callstat":
                this.evalExpr(statement.first, scope);
                break;
            case "return":
                return this.evalExpr(statement.find("expr"), scope);
        }
    }
    exec(body, scope) {
        for (const { first: statement } of body) {
            const result = this.execStatement(statement, scope);
            if (result)
                return result;
        }
    }
    loadScript(script) {
        return __awaiter(this, void 0, void 0, function* () {
            if (script.getAttribute("type") !== "text/sigmascript")
                return;
            let source;
            if (script.hasAttribute("src")) {
                const response = yield fetch(script.getAttribute("src"));
                source = yield response.text();
            }
            else
                source = script.innerText;
            this.load(source);
        });
    }
    addLib(name, lib) {
        this.libs[name] = lib;
    }
    getLib(libClass) {
        return Object.values(this.libs).find((lib) => lib instanceof libClass);
    }
    initLoader() {
        new MutationObserver((mutations) => {
            for (const mutation of mutations)
                if (mutation.type === "childList")
                    for (const node of mutation.addedNodes)
                        if (node instanceof HTMLScriptElement)
                            this.loadScript(node);
        }).observe(document, { childList: true, subtree: true });
        for (const script of document.getElementsByTagName("script"))
            this.loadScript(script);
    }
    newScope(parent) {
        return new Scope(parent);
    }
    execute(program) {
        const scope = this.newScope();
        this.parseImports(program.find("imports"), scope);
        this.exec(program.find("body"), scope);
        return scope;
    }
    load(source) {
        const program = this.parser.parse(source);
        if (!program || program.end.offset !== source.length)
            return;
        const lib = program.findChild("lib");
        if (lib)
            this.addLib(lib.find("name").value, new _lib__WEBPACK_IMPORTED_MODULE_1__.SigmaScriptLib(this, program));
        else
            return this.execute(program);
    }
}


/***/ }),

/***/ "./src/sigmascriptx/sigmascriptx.ts":
/*!******************************************!*\
  !*** ./src/sigmascriptx/sigmascriptx.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SigmaScriptX: () => (/* binding */ SigmaScriptX)
/* harmony export */ });
/* harmony import */ var _sigmascript_sigmascript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sigmascript/sigmascript */ "./src/sigmascript/sigmascript.ts");
/* harmony import */ var _sigmascript_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sigmascript/registry */ "./src/sigmascript/registry.ts");
/* harmony import */ var _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sigmascript/lib/dom */ "./src/sigmascript/lib/dom.ts");



const grammar = {
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
const htmlentities = {
    "amp": "&",
    "lt": "<",
    "gt": ">"
};
class SSXScope extends _sigmascript_sigmascript__WEBPACK_IMPORTED_MODULE_0__.Scope {
    constructor(scope) {
        super(scope);
        this.components = {};
        if (scope instanceof SSXScope)
            this.components = Object.assign({}, scope.components);
    }
}
class SigmaScriptX extends _sigmascript_sigmascript__WEBPACK_IMPORTED_MODULE_0__.SigmaScript {
    constructor() {
        super(grammar);
        this.groupRegistry = new _sigmascript_registry__WEBPACK_IMPORTED_MODULE_1__.Registry("ssxgroup");
    }
    parseHTMLContent(htmlcontent, scope) {
        var _a;
        const children = [];
        for (const child of htmlcontent) {
            let value;
            switch (child.name) {
                case "htmltext":
                    value = child.value;
                    break;
                case "htmlentity":
                    value = (_a = htmlentities[child.find("htmlname").value]) !== null && _a !== void 0 ? _a : child.value;
                    break;
                case "expr":
                case "html":
                    value = this.evalExpr(child, scope);
                    break;
            }
            const group = this.groupRegistry.get(value);
            if (group)
                children.push(...group);
            else
                children.push(value);
        }
        return children;
    }
    evalExpr(expr, scope) {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "html": {
                expr = expr.first;
                const isPaired = expr.name === "htmlpaired";
                const tagName = expr.first.value;
                if (isPaired && expr.last.value !== tagName)
                    return "unknown";
                const component = scope.components[tagName];
                if (component) {
                    const attrvals = {};
                    for (const attr of expr.findChildren("htmlattr"))
                        attrvals[attr.find("htmlname").value] = this.evalExpr(attr.find("htmlattrval").first, scope);
                    return component(isPaired ? this.groupRegistry.add(this.parseHTMLContent(expr.find("htmlcontent"), scope)) : "unknown", attrvals);
                }
                else {
                    const domLib = this.getLib(_sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_2__.DOMLib);
                    const element = domLib.create(tagName);
                    for (const attr of expr.findChildren("htmlattr"))
                        domLib.setAttr(element, attr.find("htmlname").value, this.evalExpr(attr.find("htmlattrval").first, scope));
                    if (isPaired)
                        for (const child of this.parseHTMLContent(expr.find("htmlcontent"), scope))
                            domLib.append(element, child);
                    return element;
                }
            }
            default:
                return super.evalExpr(expr, scope);
        }
    }
    execStatement(statement, scope) {
        switch (statement.name) {
            case "component": {
                const body = statement.find("body");
                const attrs = {};
                for (const attr of statement.findChildren("htmlattr"))
                    attrs[attr.find("htmlname").value] = this.evalExpr(attr.find("htmlattrval").first, scope);
                scope.components[statement.find("htmlname").value] = (children, attrvals) => {
                    var _a, _b;
                    const localScope = this.newScope(scope);
                    localScope.variables.children = children;
                    for (const attrname in attrs)
                        localScope.variables[attrname] = (_a = attrvals[attrname]) !== null && _a !== void 0 ? _a : attrs[attrname];
                    return (_b = this.exec(body, localScope)) !== null && _b !== void 0 ? _b : "unknown";
                };
                break;
            }
            default:
                return super.execStatement(statement, scope);
        }
    }
    newScope(parent) {
        return new SSXScope(parent);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/demo.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sigmascriptx_sigmascriptx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sigmascriptx/sigmascriptx */ "./src/sigmascriptx/sigmascriptx.ts");

const demos = {
    "hello-world": `print "Hello world!";`,
    "structures": `
print "loop from 1 to 10";
x = 0;
while x < 10 {
    x = x + 1;
    print x;
}
    
if x = 10 {
    print "x = 10";
} else {
    print "x ≠ 10";
}
`,
    "fibonacci": `
fn fib(n) {
    if n = 1 | n = 2 { ret 1; }
    ret fib(n - 1) + fib(n - 2);
}

print "10th Fibonacci number is " @ fib(10);
`,
    "dom": `
use dom;
use js;

prompt = js_get(js_window, "prompt");
color = js_call(prompt, "Enter background color", "white");
dom_css(dom_body, "background-color", color);
`,
    "ref": `
use ref;

fn inc(ref) {
    ref_set(ref, ref_get(ref) + 1);
}

x = ref(0);
print "x = " @ ref_get(x);

inc(x);
print "x = " @ ref_get(x);
`,
    "callbacks": `
use fn;

fn foo() {
    print "I am foo";
    ret 123;
}

fn bar(callback) {
    print "I am bar";
    print "I got " @ call(callback) @ " from callback";
}

bar(fn("foo"));`
};
const sigmaScript = new _sigmascriptx_sigmascriptx__WEBPACK_IMPORTED_MODULE_0__.SigmaScriptX();
const code = document.getElementById("code");
const runButton = document.getElementById("run");
const demoSelect = document.getElementById("demo-select");
runButton.addEventListener("click", () => {
    if (!sigmaScript.load(code.value))
        console.error("invalid syntax");
});
demoSelect.addEventListener("change", () => {
    code.value = demos[demoSelect.value].trim();
});
code.value = demos["hello-world"].trim();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDMUQsQ0FBQztZQUNELEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO1lBQzFELENBQUM7WUFDRCxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3hCLENBQUM7WUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUFFLE9BQU8sU0FBUyxDQUFDO2dCQUN6RCxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUFFLE9BQU8sU0FBUyxDQUFDO2dCQUN6RCxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUFFLE9BQU8sU0FBUyxDQUFDO2dCQUN6RCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLENBQUM7WUFDRCxLQUFLLElBQUksQ0FB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QUFJLEVBQUUsQ0FBQztBQUNoRCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvcGFyc2VyL2NoYXIudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvcGFyc2VyL2luZGV4LnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3BhcnNlci9wYXR0ZXJuLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3BhcnNlci9zdHJlYW0udHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvZ3JhbW1hci50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9saWIvZG9tLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9mbi50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9saWIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL2pzLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9yZWYudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvcmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvc2lnbWFzY3JpcHQudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHR4L3NpZ21hc2NyaXB0eC50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL2RlbW8udHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IG5hbWVzcGFjZSBDaGFyIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc1doaXRlc3BhY2UoY2g6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBjaCA9PT0gXCIgXCIgfHwgY2ggPT09IFwiXFxuXCIgfHwgY2ggPT09IFwiXFxyXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2g6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghY2gpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBjb25zdCBjb2RlID0gY2guY2hhckNvZGVBdCgwKTtcclxuICAgICAgICByZXR1cm4gY29kZSA+PSA0OCAmJiBjb2RlIDw9IDU3O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0xldHRlcihjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFjaCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBjaC50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgcmV0dXJuIGNvZGUgPj0gOTcgJiYgY29kZSA8PSAxMjI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNYXRjaCwgUGF0dGVybiwgcGF0dGVybiB9IGZyb20gXCIuL3BhdHRlcm5cIjtcclxuaW1wb3J0IHsgTG9jYXRpb24sIFN0cmVhbSB9IGZyb20gXCIuL3N0cmVhbVwiO1xyXG5cclxudHlwZSBEZWZpbml0aW9uID0ge1xyXG4gICAgcHJlY2VkZW5jZT86IG51bWJlcixcclxuICAgIHByZXNlcnZlUHJlY2VkZW5jZT86IGJvb2xlYW4sXHJcbiAgICBwYXR0ZXJuOiBzdHJpbmdcclxufSB8IHN0cmluZztcclxuXHJcbmV4cG9ydCB0eXBlIEdyYW1tYXIgPSB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBEZWZpbml0aW9uLFxyXG4gICAgcm9vdDogRGVmaW5pdGlvblxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFTVEVsZW1lbnQge1xyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgc3RhcnQ6IExvY2F0aW9uO1xyXG4gICAgcmVhZG9ubHkgZW5kOiBMb2NhdGlvbjtcclxuICAgIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjaGlsZHJlbjogQVNURWxlbWVudFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3RhcnQ6IExvY2F0aW9uLCBlbmQ6IExvY2F0aW9uLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgICAgdGhpcy5lbmQgPSBlbmQ7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZmlyc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bMF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxhc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uYXQoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIHlpZWxkIGNoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkOiBBU1RFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoaW5kZXg6IG51bWJlcik6IEFTVEVsZW1lbnQgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZmluZENoaWxkcmVuKG5hbWU6IHN0cmluZyk6IEFTVEVsZW1lbnRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gY2hpbGQubmFtZSA9PT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZENoaWxkKG5hbWU6IHN0cmluZyk6IEFTVEVsZW1lbnQgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maW5kKChjaGlsZCkgPT4gY2hpbGQubmFtZSA9PT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZChuYW1lOiBzdHJpbmcpOiBBU1RFbGVtZW50IHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLmZpbmRDaGlsZChuYW1lKTtcclxuICAgICAgICBpZiAoY2hpbGQpIHJldHVybiBjaGlsZDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgZGVzY2VuZGFudCA9IGNoaWxkLmZpbmQobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChkZXNjZW5kYW50KSByZXR1cm4gZGVzY2VuZGFudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuczogTWFwPHN0cmluZywgUGF0dGVybj4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ3JhbW1hcjogR3JhbW1hcikge1xyXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKGdyYW1tYXIpKVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdHRlcm5zLnNldChuYW1lLCBwYXR0ZXJuKGRlZmluaXRpb24pKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXR0ZXJucy5zZXQobmFtZSwgcGF0dGVybihkZWZpbml0aW9uLnBhdHRlcm4sIGRlZmluaXRpb24ucHJlY2VkZW5jZSwgZGVmaW5pdGlvbi5wcmVzZXJ2ZVByZWNlZGVuY2UpKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZShidWZmZXI6IHN0cmluZyk6IEFTVEVsZW1lbnQgfCBudWxsIHtcclxuICAgICAgICBmdW5jdGlvbiB2aXNpdChjdXJyZW50OiBNYXRjaCwgcGFyZW50OiBBU1RFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhcmVudCA9IG5ldyBBU1RFbGVtZW50KGN1cnJlbnQubmFtZSwgY3VycmVudC5zdGFydCwgY3VycmVudC5lbmQsIGJ1ZmZlci5zbGljZShjdXJyZW50LnN0YXJ0Lm9mZnNldCwgY3VycmVudC5lbmQub2Zmc2V0KSk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQobmV3UGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHBhcmVudCA9IG5ld1BhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudC5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY3VycmVudC5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgICAgICB2aXNpdChjaGlsZCwgcGFyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5wYXR0ZXJucy5nZXQoXCJyb290XCIpLm1hdGNoKG5ldyBTdHJlYW0oYnVmZmVyKSwgdGhpcy5wYXR0ZXJucyk7XHJcbiAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHJvb3QgPSBuZXcgQVNURWxlbWVudChcInJvb3RcIiwgbWF0Y2guc3RhcnQsIG1hdGNoLmVuZCwgYnVmZmVyLnNsaWNlKG1hdGNoLnN0YXJ0Lm9mZnNldCwgbWF0Y2guZW5kLm9mZnNldCkpO1xyXG4gICAgICAgIHZpc2l0KG1hdGNoLCByb290KTtcclxuICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2VQYXR0ZXJucyhhOiBzdHJpbmcsIGI6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGIucmVwbGFjZSgvXFwuXFwuXFwuL2csIGEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZShhOiBEZWZpbml0aW9uLCBiOiBEZWZpbml0aW9uKTogRGVmaW5pdGlvbiB7XHJcbiAgICBpZiAoIWEpIHJldHVybiBiO1xyXG4gICAgaWYgKCFiKSByZXR1cm4gYTtcclxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgYiA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIG1lcmdlUGF0dGVybnMoYSwgYik7XHJcbiAgICBpZiAodHlwZW9mIGEgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGIgIT09IFwic3RyaW5nXCIpIHJldHVybiB7IC4uLmIsIHBhdHRlcm46IG1lcmdlUGF0dGVybnMoYSwgYi5wYXR0ZXJuKSB9O1xyXG4gICAgaWYgKHR5cGVvZiBhICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBiID09PSBcInN0cmluZ1wiKSByZXR1cm4geyAuLi5hLCBwYXR0ZXJuOiBtZXJnZVBhdHRlcm5zKGEucGF0dGVybiwgYikgfTtcclxuICAgIGlmICh0eXBlb2YgYSAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgYiAhPT0gXCJzdHJpbmdcIilcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwYXR0ZXJuOiBtZXJnZVBhdHRlcm5zKGEucGF0dGVybiwgYi5wYXR0ZXJuKSxcclxuICAgICAgICAgICAgcHJlY2VkZW5jZTogYi5wcmVjZWRlbmNlID8/IGEucHJlY2VkZW5jZSxcclxuICAgICAgICAgICAgcHJlc2VydmVQcmVjZWRlbmNlOiBiLnByZXNlcnZlUHJlY2VkZW5jZSA/PyBhLnByZXNlcnZlUHJlY2VkZW5jZVxyXG4gICAgICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmhlcml0KHBhcmVudDogR3JhbW1hciwgZ3JhbW1hcjogUGFydGlhbDxHcmFtbWFyPik6IEdyYW1tYXIge1xyXG4gICAgY29uc3QgcmVzdWx0OiBHcmFtbWFyID0geyByb290OiBtZXJnZShwYXJlbnQucm9vdCwgZ3JhbW1hci5yb290KSB9O1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHBhcmVudClcclxuICAgICAgICBpZiAoIShuYW1lIGluIHJlc3VsdCkpIHJlc3VsdFtuYW1lXSA9IG1lcmdlKHBhcmVudFtuYW1lXSwgZ3JhbW1hcltuYW1lXSk7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gZ3JhbW1hcilcclxuICAgICAgICBpZiAoIShuYW1lIGluIHJlc3VsdCkpIHJlc3VsdFtuYW1lXSA9IG1lcmdlKHBhcmVudFtuYW1lXSwgZ3JhbW1hcltuYW1lXSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59IiwiaW1wb3J0IHsgQ2hhciB9IGZyb20gXCIuL2NoYXJcIjtcclxuaW1wb3J0IHsgTG9jYXRpb24sIFN0cmVhbSB9IGZyb20gXCIuL3N0cmVhbVwiO1xyXG5cclxuZXhwb3J0IHR5cGUgQ2hhcmFjdGVyR3JvdXAgPSAoc3RyaW5nIHwgW3N0cmluZywgc3RyaW5nXSlbXTtcclxuXHJcbmV4cG9ydCB0eXBlIE1hdGNoID0ge1xyXG4gICAgbmFtZT86IHN0cmluZyxcclxuICAgIHN0YXJ0OiBMb2NhdGlvbixcclxuICAgIGVuZDogTG9jYXRpb24sXHJcbiAgICBjaGlsZHJlbj86IE1hdGNoW11cclxufTtcclxuXHJcbmNsYXNzIFN0YWNrIHtcclxuICAgIHByaXZhdGUgZWxlbWVudHM6IHsgW2tleTogbnVtYmVyXTogc3RyaW5nW10gfTtcclxuICAgIFxyXG4gICAgcmVhZG9ubHkgbGFzdD86IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50czogeyBba2V5OiBudW1iZXJdOiBzdHJpbmdbXSB9ID0ge30sIGxhc3Q/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XHJcbiAgICAgICAgdGhpcy5sYXN0ID0gbGFzdDtcclxuICAgIH1cclxuXHJcbiAgICB3aXRoKG9mZnNldDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHsgLi4udGhpcy5lbGVtZW50cyB9O1xyXG4gICAgICAgIGVsZW1lbnRzW29mZnNldF0gPSBlbGVtZW50c1tvZmZzZXRdID8gWy4uLmVsZW1lbnRzW29mZnNldF0sIG5hbWVdIDogW25hbWVdO1xyXG4gICAgICAgIHJldHVybiBuZXcgU3RhY2soZWxlbWVudHMsIG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhcyhvZmZzZXQ6IG51bWJlciwgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbb2Zmc2V0XT8uaW5jbHVkZXMobmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYXR0ZXJuIHtcclxuICAgIHByZWNlZGVuY2U/OiBudW1iZXI7XHJcbiAgICBwcmVzZXJ2ZVByZWNlZGVuY2U6IGJvb2xlYW47XHJcblxyXG4gICAgYWJzdHJhY3QgbWF0Y2goc3RyZWFtOiBTdHJlYW0sIHJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiwgcHJlY2VkZW5jZT86IG51bWJlciwgc3RhY2s/OiBTdGFjaywgY2FjaGU/OiB7IFtrZXk6IHN0cmluZ106IE1hdGNoIH0pOiBNYXRjaCB8IG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSYXdQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2g6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5jaCA9IGNoO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgaWYgKHN0cmVhbS5wZWVrY2goKSAhPT0gdGhpcy5jaCkgcmV0dXJuO1xyXG4gICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBPclBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYTogUGF0dGVybjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYjogUGF0dGVybjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBQYXR0ZXJuLCBiOiBQYXR0ZXJuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0sIHJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiwgcHJlY2VkZW5jZTogbnVtYmVyID0gMSwgc3RhY2s6IFN0YWNrID0gbmV3IFN0YWNrKCksIGNhY2hlOiB7IFtrZXk6IHN0cmluZ106IE1hdGNoIH0gPSB7fSk6IE1hdGNoIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBjb25zdCBtYXRjaEEgPSAhKHRoaXMuYSBpbnN0YW5jZW9mIE5hbWVkUGF0dGVybiAmJiBzdGFjay5oYXMoc3RhcnQub2Zmc2V0LCB0aGlzLmEubmFtZSkpICYmIHRoaXMuYS5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGNvbnN0IGVuZEEgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgc3RyZWFtLmxvY2F0aW9uID0gc3RhcnQ7XHJcbiAgICAgICAgY29uc3QgbWF0Y2hCID0gISh0aGlzLmIgaW5zdGFuY2VvZiBOYW1lZFBhdHRlcm4gJiYgc3RhY2suaGFzKHN0YXJ0Lm9mZnNldCwgdGhpcy5iLm5hbWUpKSAmJiB0aGlzLmIubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICBjb25zdCBlbmRCID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBtYXRjaCA9ICghbWF0Y2hBICYmIG1hdGNoQikgfHwgKCFtYXRjaEIgJiYgbWF0Y2hBKTtcclxuICAgICAgICBpZiAobWF0Y2hBICYmIG1hdGNoQilcclxuICAgICAgICAgICAgbWF0Y2ggPSBlbmRBLm9mZnNldCA+IGVuZEIub2Zmc2V0ID8gbWF0Y2hBIDogbWF0Y2hCO1xyXG4gICAgICAgIGlmIChtYXRjaCA9PT0gbWF0Y2hBKVxyXG4gICAgICAgICAgICBzdHJlYW0ubG9jYXRpb24gPSBlbmRBO1xyXG4gICAgICAgIGlmIChtYXRjaCkgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbjogW21hdGNoXSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2hpdGVzcGFjZVBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgd2hpbGUgKENoYXIuaXNXaGl0ZXNwYWNlKHN0cmVhbS5wZWVrY2goKSkpIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBbnlQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGlmICghc3RyZWFtLnBlZWtjaCgpKSByZXR1cm47XHJcbiAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERpZ2l0UGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBpZiAoIUNoYXIuaXNEaWdpdChzdHJlYW0ucGVla2NoKCkpKSByZXR1cm47XHJcbiAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuOiBQYXR0ZXJuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdHRlcm46IFBhdHRlcm4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0sIHJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiwgcHJlY2VkZW5jZTogbnVtYmVyID0gMSwgc3RhY2s6IFN0YWNrID0gbmV3IFN0YWNrKCksIGNhY2hlOiB7IFtrZXk6IHN0cmluZ106IE1hdGNoIH0gPSB7fSk6IE1hdGNoIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMucGF0dGVybi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGlmICghbWF0Y2gpIHN0cmVhbS5sb2NhdGlvbiA9IHN0YXJ0O1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiwgY2hpbGRyZW46IG1hdGNoID8gW21hdGNoXSA6IFtdIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZXBlYXRQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IFBhdHRlcm47XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0dGVybjogUGF0dGVybikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2ggfCBudWxsIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBsZXQgbWF0Y2ggPSB0aGlzLnBhdHRlcm4ubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFttYXRjaF07XHJcbiAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBsYXN0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHRoaXMucGF0dGVybi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXN0Lm9mZnNldCA9PT0gc3RyZWFtLm9mZnNldCkgYnJlYWs7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobWF0Y2gpO1xyXG4gICAgICAgICAgICBsYXN0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdHJlYW0ubG9jYXRpb24gPSBsYXN0O1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiwgY2hpbGRyZW4gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3Rlckdyb3VwUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBncm91cDogQ2hhcmFjdGVyR3JvdXA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRpc2FsbG93OiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdyb3VwOiBDaGFyYWN0ZXJHcm91cCwgZGlzYWxsb3c6IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcclxuICAgICAgICB0aGlzLmRpc2FsbG93ID0gZGlzYWxsb3c7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBjb25zdCBjaCA9IHN0cmVhbS5wZWVrY2goKTtcclxuICAgICAgICBpZiAoIWNoKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGNoLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGV4cGVjdGVkIG9mIHRoaXMuZ3JvdXApXHJcbiAgICAgICAgICAgIGlmICgoQXJyYXkuaXNBcnJheShleHBlY3RlZCkgJiYgY29kZSA+PSBleHBlY3RlZFswXS5jaGFyQ29kZUF0KDApICYmIGNvZGUgPD0gZXhwZWN0ZWRbMV0uY2hhckNvZGVBdCgwKSkgfHwgY2ggPT09IGV4cGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmRpc2FsbG93ICYmIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWxsb3cgJiYgeyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdyb3VwUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjaGlsZHJlbjogUGF0dGVybltdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOiBQYXR0ZXJuW10pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2ggfCBudWxsIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IGNoaWxkLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChtYXRjaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiwgY2hpbGRyZW4gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5hbWVkUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2ggfCBudWxsIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBgJHtwcmVjZWRlbmNlfSwke3N0YWNrLmxhc3R9LCR7c3RyZWFtLm9mZnNldH0sJHt0aGlzLm5hbWV9YDtcclxuICAgICAgICBjb25zdCBjYWNoZWQgPSBjYWNoZVtrZXldO1xyXG4gICAgICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoY2FjaGVkKSBzdHJlYW0ubG9jYXRpb24gPSBjYWNoZWQuZW5kO1xyXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBzdGFjayA9IHN0YWNrLndpdGgoc3RhcnQub2Zmc2V0LCB0aGlzLm5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSByZWdpc3RyeS5nZXQodGhpcy5uYW1lKTtcclxuICAgICAgICBpZiAoIXBhdHRlcm4gfHwgKHBhdHRlcm4ucHJlY2VkZW5jZSAmJiBwYXR0ZXJuLnByZWNlZGVuY2UgPCBwcmVjZWRlbmNlKSkgcmV0dXJuIGNhY2hlW2tleV0gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gcGF0dGVybi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwYXR0ZXJuLnByZWNlZGVuY2UgfHwgcGF0dGVybi5wcmVzZXJ2ZVByZWNlZGVuY2UgPyBwYXR0ZXJuLnByZWNlZGVuY2UgPz8gcHJlY2VkZW5jZSA6IDEsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuIGNhY2hlW2tleV0gPSBudWxsO1xyXG4gICAgICAgIHJldHVybiBjYWNoZVtrZXldID0geyBuYW1lOiB0aGlzLm5hbWUsIHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiwgY2hpbGRyZW46IFttYXRjaF0gfTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTcGVjaWFsQ2hhcmFjdGVyKGNoOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBjaCA9PT0gXCIlXCIgfHwgY2ggPT09IFwifFwiIHx8IGNoID09PSBcIihcIiB8fCBjaCA9PT0gXCIpXCIgfHwgY2ggPT09IFwiK1wiIHx8IGNoID09PSBcIj9cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VQYXR0ZXJuKHN0cmVhbTogU3RyZWFtLCBwcmVjZWRlbmNlPzogbnVtYmVyLCBwcmVzZXJ2ZVByZWNlZGVuY2U6IGJvb2xlYW4gPSBmYWxzZSk6IFBhdHRlcm4ge1xyXG4gICAgY29uc3QgY2hpbGRyZW46IFBhdHRlcm5bXSA9IFtdO1xyXG4gICAgbGV0IG9yID0gZmFsc2U7XHJcbiAgICBsZXQgY2g7XHJcbiAgICB3aGlsZSAoY2ggPSBzdHJlYW0ucGVla2NoKCkpIHtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIGlmIChjaCA9PT0gXCIlXCIpIHtcclxuICAgICAgICAgICAgY2ggPSBzdHJlYW0ucGVla2NoKCk7XHJcbiAgICAgICAgICAgIGlmIChpc1NwZWNpYWxDaGFyYWN0ZXIoY2gpKSB7XHJcbiAgICAgICAgICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgUmF3UGF0dGVybihjaCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKENoYXIuaXNMZXR0ZXIoY2ggPSBzdHJlYW0ucGVla2NoKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lICs9IGNoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IERpZ2l0UGF0dGVybigpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBOYW1lZFBhdHRlcm4obmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCIoXCIpXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gocGFyc2VQYXR0ZXJuKHN0cmVhbSwgcHJlY2VkZW5jZSkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoID09PSBcIilcIilcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiW1wiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc2FsbG93ID0gc3RyZWFtLnBlZWtjaCgpID09PSBcIl5cIjtcclxuICAgICAgICAgICAgaWYgKGRpc2FsbG93KSBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBncm91cDogQ2hhcmFjdGVyR3JvdXAgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHJhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHdoaWxlIChjaCA9IHN0cmVhbS5wZWVrY2goKSkge1xyXG4gICAgICAgICAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IGdyb3VwLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gXCIlXCIgJiYgc3RyZWFtLnBlZWtjaCgpID09PSBcIl1cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAucHVzaChcIl1cIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIl1cIilcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSBcIi1cIiAmJiAhcmFuZ2UgJiYgbGVuID4gMCAmJiAhQXJyYXkuaXNBcnJheShncm91cC5hdCgtMSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAucHVzaChjaCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBncm91cC5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKFtncm91cC5wb3AoKSwgbGFzdF0gYXMgW3N0cmluZywgc3RyaW5nXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgQ2hhcmFjdGVyR3JvdXBQYXR0ZXJuKGdyb3VwLCBkaXNhbGxvdykpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiLlwiKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBBbnlQYXR0ZXJuKCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoID09PSBcIiBcIilcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgV2hpdGVzcGFjZVBhdHRlcm4oKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwifFwiICYmIGNoaWxkcmVuLmxlbmd0aCA+IDAgJiYgIW9yKSB7XHJcbiAgICAgICAgICAgIG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCI/XCIgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgT3B0aW9uYWxQYXR0ZXJuKGNoaWxkcmVuLnBvcCgpKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiK1wiICYmIGNoaWxkcmVuLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IFJlcGVhdFBhdHRlcm4oY2hpbGRyZW4ucG9wKCkpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IFJhd1BhdHRlcm4oY2gpKTtcclxuICAgICAgICBpZiAob3IpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgT3JQYXR0ZXJuKGNoaWxkcmVuLnBvcCgpLCBjaGlsZHJlbi5wb3AoKSkpO1xyXG4gICAgICAgICAgICBvciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IGNoaWxkcmVuLmxlbmd0aCA9PT0gMSA/IGNoaWxkcmVuWzBdIDogbmV3IEdyb3VwUGF0dGVybihjaGlsZHJlbik7XHJcbiAgICByZXN1bHQucHJlY2VkZW5jZSA9IHByZWNlZGVuY2U7XHJcbiAgICByZXN1bHQucHJlc2VydmVQcmVjZWRlbmNlID0gcHJlc2VydmVQcmVjZWRlbmNlO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhdHRlcm4oc291cmNlOiBzdHJpbmcsIHByZWNlZGVuY2U/OiBudW1iZXIsIHByZXNlcnZlUHJlY2VkZW5jZT86IGJvb2xlYW4pOiBQYXR0ZXJuIHtcclxuICAgIHJldHVybiBwYXJzZVBhdHRlcm4obmV3IFN0cmVhbShzb3VyY2UpLCBwcmVjZWRlbmNlLCBwcmVzZXJ2ZVByZWNlZGVuY2UpO1xyXG59IiwiZXhwb3J0IHR5cGUgTG9jYXRpb24gPSB7XHJcbiAgICBvZmZzZXQ6IG51bWJlcixcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbHVtbjogbnVtYmVyXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgU3RyZWFtIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYnVmZmVyOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9vZmZzZXQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbGluZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBjb2x1bW46IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihidWZmZXI6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xyXG4gICAgICAgIHRoaXMuX29mZnNldCA9IDA7XHJcbiAgICAgICAgdGhpcy5saW5lID0gMDtcclxuICAgICAgICB0aGlzLmNvbHVtbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvY2F0aW9uKCk6IExvY2F0aW9uIHtcclxuICAgICAgICByZXR1cm4geyBvZmZzZXQ6IHRoaXMuX29mZnNldCwgbGluZTogdGhpcy5saW5lLCBjb2x1bW46IHRoaXMuY29sdW1uIH07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uOiBMb2NhdGlvbikge1xyXG4gICAgICAgIHRoaXMuX29mZnNldCA9IGxvY2F0aW9uLm9mZnNldDtcclxuICAgICAgICB0aGlzLmxpbmUgPSBsb2NhdGlvbi5saW5lO1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gbG9jYXRpb24uY29sdW1uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvZmZzZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICBwZWVrY2goKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuX29mZnNldF07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3VtZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5wZWVrY2goKSA9PT0gXCJcXG5cIikge1xyXG4gICAgICAgICAgICArK3RoaXMubGluZTtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSAwO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICArK3RoaXMuY29sdW1uO1xyXG4gICAgICAgICsrdGhpcy5fb2Zmc2V0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR3JhbW1hciB9IGZyb20gXCIuLi9wYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBncmFtbWFyOiBHcmFtbWFyID0ge1xyXG4gICAgXCJudW1iZXJcIjogXCIlZCtcIixcclxuICAgIFwibmFtZVwiOiBcIlthLXpBLVpfXVthLXpBLVowLTlfXSs/XCIsXHJcbiAgICBcInN0cmluZ1wiOiBcIlxcXCIoW15cXFwiXXwoXFxcXFxcXFwpfChcXFxcXFxcIikpKz9cXFwiXCIsXHJcbiAgICBcImJvb2xcIjogXCIodHJ1ZSl8KGZhbHNlKVwiLFxyXG4gICAgXCJhZGRcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgJSsgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA1XHJcbiAgICB9LFxyXG4gICAgXCJzdWJcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgLSAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDVcclxuICAgIH0sXHJcbiAgICBcIm11bFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAqICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNlxyXG4gICAgfSxcclxuICAgIFwiZGl2XCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByIC8gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA2XHJcbiAgICB9LFxyXG4gICAgXCJjb25jYXRcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgQCAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDFcclxuICAgIH0sXHJcbiAgICBcImVxXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByID0gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJsdFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA8ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNFxyXG4gICAgfSxcclxuICAgIFwiZ3RcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPiAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcImxlXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByIDw9ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNFxyXG4gICAgfSxcclxuICAgIFwiZ2VcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPj0gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJvclwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAlfCAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDJcclxuICAgIH0sXHJcbiAgICBcImFuZFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAmICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogM1xyXG4gICAgfSxcclxuICAgIFwibm90XCI6IFwiISAlZXhwclwiLFxyXG4gICAgXCJhcmdsaXN0XCI6IFwiKCVleHByKCAsICVleHByKSs/KT9cIixcclxuICAgIFwiY2FsbFwiOiBcIiVuYW1lICUoICVhcmdsaXN0ICUpXCIsXHJcbiAgICBcInBhcmVudGhlc2lzZXhwclwiOiBcIiUoICVleHByICUpXCIsXHJcbiAgICBcImV4cHJcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJXBhcmVudGhlc2lzZXhwcnwlbnVtYmVyfCVzdHJpbmd8JWJvb2x8JW5hbWV8JWFkZHwlc3VifCVtdWx8JWRpdnwlY29uY2F0fCVlcXwlbHR8JWd0fCVsZXwlZ2V8JW9yfCVhbmR8JW5vdHwlY2FsbFwiLFxyXG4gICAgICAgIHByZXNlcnZlUHJlY2VkZW5jZTogdHJ1ZVxyXG4gICAgfSxcclxuICAgIFwiYXNzaWduXCI6IFwiJW5hbWUgPSAlZXhwcjtcIixcclxuICAgIFwicGFyYW1saXN0XCI6IFwiKCVuYW1lKCAsICVuYW1lKSs/KT9cIixcclxuICAgIFwiaWZcIjogXCJpZiAlZXhwciB7ICVib2R5IH0gJWVsc2U/XCIsXHJcbiAgICBcImVsc2VcIjogXCJlbHNlIHsgJWJvZHkgfVwiLFxyXG4gICAgXCJ3aGlsZVwiOiBcIndoaWxlICVleHByIHsgJWJvZHkgfVwiLFxyXG4gICAgXCJmdW5jdGlvblwiOiBcImZuICVuYW1lICUoICVwYXJhbWxpc3QgJSkgeyAlYm9keSB9XCIsXHJcbiAgICBcInJldHVyblwiOiBcInJldCAlZXhwcjtcIixcclxuICAgIFwiY2FsbHN0YXRcIjogXCIlY2FsbDtcIixcclxuICAgIFwicHJpbnRcIjogXCJwcmludCAlZXhwcjtcIixcclxuICAgIFwic3RhdGVtZW50XCI6IFwiJWFzc2lnbnwlaWZ8JXdoaWxlfCVmdW5jdGlvbnwlcmV0dXJufCVjYWxsc3RhdHwlcHJpbnRcIixcclxuICAgIFwiYm9keVwiOiBcIiggJXN0YXRlbWVudCApKz9cIixcclxuICAgIFwidXNlXCI6IFwidXNlICVuYW1lO1wiLFxyXG4gICAgXCJpbXBvcnRzXCI6IFwiKCAldXNlICkrP1wiLFxyXG4gICAgXCJsaWJcIjogXCJsaWIgJW5hbWU7XCIsXHJcbiAgICBcInJvb3RcIjogXCIlbGliPyAlaW1wb3J0cyAlYm9keVwiXHJcbn07IiwiaW1wb3J0IHsgTmF0aXZlTGliIH0gZnJvbSBcIi5cIjtcclxuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tIFwiLi4vcmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgU1NGdW5jdGlvbiwgU2NvcGUgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBET01MaWIgZXh0ZW5kcyBOYXRpdmVMaWIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeTxFbGVtZW50PihcImRvbVwiKTtcclxuXHJcbiAgICByZWFkb25seSB2YXJpYWJsZXM6IFJlYWRvbmx5PHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0+ID0ge1xyXG4gICAgICAgIGRvbV9oZWFkOiB0aGlzLnJlZ2lzdHJ5LmFkZChkb2N1bWVudC5oZWFkKSxcclxuICAgICAgICBkb21fYm9keTogdGhpcy5yZWdpc3RyeS5hZGQoZG9jdW1lbnQuYm9keSlcclxuICAgIH07XHJcbiAgICByZWFkb25seSBmdW5jdGlvbnM6IFJlYWRvbmx5PHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9PiA9IHtcclxuICAgICAgICBkb21fdGl0bGU6IChbIHRpdGxlIF0pID0+IHRoaXMudGl0bGUodGl0bGUpLFxyXG4gICAgICAgIGRvbV9jcmVhdGU6IChbIHRhZ05hbWUgXSkgPT4gdGhpcy5jcmVhdGUodGFnTmFtZSksXHJcbiAgICAgICAgZG9tX2ZpbmQ6IChbIHNlbGVjdG9yIF0pID0+IHRoaXMuZmluZChzZWxlY3RvciksXHJcbiAgICAgICAgZG9tX2FwcGVuZDogKFsgcGFyZW50LCBjaGlsZCBdKSA9PiB0aGlzLmFwcGVuZChwYXJlbnQsIGNoaWxkKSxcclxuICAgICAgICBkb21fcmVtb3ZlOiAoWyBlbGVtZW50IF0pID0+IHRoaXMucmVtb3ZlKGVsZW1lbnQpLFxyXG4gICAgICAgIGRvbV9hZGRfY2xhc3M6IChbIGVsZW1lbnQsIGNsYXNzTmFtZSBdKSA9PiB0aGlzLmFkZENsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSksXHJcbiAgICAgICAgZG9tX3JlbW92ZV9jbGFzczogKFsgZWxlbWVudCwgY2xhc3NOYW1lIF0pID0+IHRoaXMucmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSxcclxuICAgICAgICBkb21fdG9nZ2xlX2NsYXNzOiAoWyBlbGVtZW50LCBjbGFzc05hbWUgXSkgPT4gdGhpcy50b2dnbGVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpLFxyXG4gICAgICAgIGRvbV9zZXRfdGV4dDogKFsgZWxlbWVudCwgdGV4dCBdKSA9PiB0aGlzLnNldFRleHQoZWxlbWVudCwgdGV4dCksXHJcbiAgICAgICAgZG9tX3NldF9odG1sOiAoWyBlbGVtZW50LCBodG1sIF0pID0+IHRoaXMuc2V0SHRtbChlbGVtZW50LCBodG1sKSxcclxuICAgICAgICBkb21fc2V0X2F0dHI6IChbIGVsZW1lbnQsIGF0dHIsIHZhbHVlIF0pID0+IHRoaXMuc2V0QXR0cihlbGVtZW50LCBhdHRyLCB2YWx1ZSksXHJcbiAgICAgICAgZG9tX2dldF9hdHRyOiAoWyBlbGVtZW50LCBhdHRyIF0pID0+IHRoaXMuZ2V0QXR0cihlbGVtZW50LCBhdHRyKSxcclxuICAgICAgICBkb21fY3NzOiAoWyBlbGVtZW50LCBwcm9wLCB2YWx1ZSBdKSA9PiB0aGlzLmNzcyhlbGVtZW50LCBwcm9wLCB2YWx1ZSksXHJcbiAgICAgICAgZG9tX2V2ZW50OiAoWyBlbGVtZW50LCBldmVudCwgY2FsbGJhY2sgXSwgc2NvcGUpID0+IHRoaXMuZXZlbnQoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrLCBzY29wZSlcclxuICAgIH07XHJcbiAgICBcclxuICAgIGdldEVsZW1lbnQoaGFuZGxlOiBzdHJpbmcpOiBFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeS5nZXQoaGFuZGxlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlKHRhZ05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5LmFkZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kKHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuYWRkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZChwYXJlbnQ6IHN0cmluZywgY2hpbGQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudChwYXJlbnQpPy5hcHBlbmRDaGlsZCh0aGlzLmdldEVsZW1lbnQoY2hpbGQpID8/IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShlbGVtZW50OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnQoZWxlbWVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENsYXNzKGVsZW1lbnQ6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbG0gPSB0aGlzLmdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDbGFzcyhlbGVtZW50OiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gdGhpcy5nZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ2xhc3MoZWxlbWVudDogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IHRoaXMuZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIGVsbS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRleHQoZWxlbWVudDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbG0gPSB0aGlzLmdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uaW5uZXJUZXh0ID0gdGV4dDtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SHRtbChlbGVtZW50OiBzdHJpbmcsIGh0bWw6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IHRoaXMuZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIGVsbS5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyKGVsZW1lbnQ6IHN0cmluZywgYXR0cjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KGVsZW1lbnQpPy5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdHRyKGVsZW1lbnQ6IHN0cmluZywgYXR0cjogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudChlbGVtZW50KT8uZ2V0QXR0cmlidXRlKGF0dHIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNzcyhlbGVtZW50OiBzdHJpbmcsIHByb3A6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IHRoaXMuZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIGVsbS5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfVxyXG5cclxuICAgIGV2ZW50KGVsZW1lbnQ6IHN0cmluZywgZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IHN0cmluZywgc2NvcGU6IFNjb3BlKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gdGhpcy5nZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGNvbnN0IGZuID0gc2NvcGUuZnVuY3Rpb25zW2NhbGxiYWNrXTtcclxuICAgICAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKCkgPT4gZm4oW10sIHNjb3BlKSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU1NGdW5jdGlvbiwgU2NvcGUgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHRcIjtcclxuaW1wb3J0IHsgTmF0aXZlTGliIH0gZnJvbSBcIi5cIjtcclxuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tIFwiLi4vcmVnaXN0cnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGbkxpYiBleHRlbmRzIE5hdGl2ZUxpYiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5PFNTRnVuY3Rpb24+KFwiZm5cIik7XHJcblxyXG4gICAgcmVhZG9ubHkgZnVuY3Rpb25zOiBSZWFkb25seTx7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfT4gPSB7XHJcbiAgICAgICAgZm46IChbIG5hbWUgXSwgc2NvcGUpID0+IHRoaXMuZm4obmFtZSwgc2NvcGUpLFxyXG4gICAgICAgIGNhbGw6IChbIGZuLCAuLi5hcmdzIF0sIHNjb3BlKSA9PiB0aGlzLmNhbGwoZm4sIGFyZ3MsIHNjb3BlKVxyXG4gICAgfTtcclxuXHJcbiAgICBmbihuYW1lOiBzdHJpbmcsIHNjb3BlOiBTY29wZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5LmFkZChzY29wZS5mdW5jdGlvbnNbbmFtZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGwoZm46IHN0cmluZywgYXJnczogc3RyaW5nW10sIHNjb3BlOiBTY29wZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5LmdldChmbik/LihhcmdzLCBzY29wZSkgPz8gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTU0Z1bmN0aW9uLCBTY29wZSwgU2lnbWFTY3JpcHQgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHRcIjtcclxuaW1wb3J0IHsgQVNURWxlbWVudCB9IGZyb20gXCIuLi8uLi9wYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGliIHtcclxuICAgIHVzZShzY29wZTogU2NvcGUpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2lnbWFTY3JpcHRMaWIgaW1wbGVtZW50cyBMaWIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzaWdtYVNjcmlwdDogU2lnbWFTY3JpcHQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2dyYW06IEFTVEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2lnbWFTY3JpcHQ6IFNpZ21hU2NyaXB0LCBwcm9ncmFtOiBBU1RFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5zaWdtYVNjcmlwdCA9IHNpZ21hU2NyaXB0O1xyXG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XHJcbiAgICB9XHJcblxyXG4gICAgdXNlKHNjb3BlOiBTY29wZSkge1xyXG4gICAgICAgIGNvbnN0IGxpYlNjb3BlID0gdGhpcy5zaWdtYVNjcmlwdC5leGVjdXRlKHRoaXMucHJvZ3JhbSk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS52YXJpYWJsZXMsIGxpYlNjb3BlLnZhcmlhYmxlcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS5mdW5jdGlvbnMsIGxpYlNjb3BlLmZ1bmN0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYXRpdmVMaWIgaW1wbGVtZW50cyBMaWIge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNpZ21hU2NyaXB0OiBTaWdtYVNjcmlwdDtcclxuXHJcbiAgICByZWFkb25seSB2YXJpYWJsZXM6IFJlYWRvbmx5PHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0+ID0ge307XHJcbiAgICByZWFkb25seSBmdW5jdGlvbnM6IFJlYWRvbmx5PHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9PiA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNpZ21hU2NyaXB0OiBTaWdtYVNjcmlwdCkge1xyXG4gICAgICAgIHRoaXMuc2lnbWFTY3JpcHQgPSBzaWdtYVNjcmlwdDtcclxuICAgIH1cclxuXHJcbiAgICB1c2Uoc2NvcGU6IFNjb3BlKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS52YXJpYWJsZXMsIHRoaXMudmFyaWFibGVzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHNjb3BlLmZ1bmN0aW9ucywgdGhpcy5mdW5jdGlvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTmF0aXZlTGliIH0gZnJvbSBcIi5cIjtcclxuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tIFwiLi4vcmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgU1NGdW5jdGlvbiB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEpTTGliIGV4dGVuZHMgTmF0aXZlTGliIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnk8YW55PihcImpzXCIpO1xyXG5cclxuICAgIHJlYWRvbmx5IHZhcmlhYmxlczogUmVhZG9ubHk8eyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfT4gPSB7XHJcbiAgICAgICAganNfd2luZG93OiB0aGlzLnJlZ2lzdHJ5LmFkZCh3aW5kb3cpXHJcbiAgICB9O1xyXG4gICAgcmVhZG9ubHkgZnVuY3Rpb25zOiBSZWFkb25seTx7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfT4gPSB7XHJcbiAgICAgICAganM6IChbIGNvZGUgXSkgPT4gdGhpcy5qcyhjb2RlKSxcclxuICAgICAgICBqc19nZXQ6IChbIGhhbmRsZSwgcHJvcGVydHkgXSkgPT4gdGhpcy5nZXQoaGFuZGxlLCBwcm9wZXJ0eSksXHJcbiAgICAgICAganNfc2V0OiAoWyBoYW5kbGUsIHByb3BlcnR5LCB2YWx1ZSBdKSA9PiB0aGlzLnNldChoYW5kbGUsIHByb3BlcnR5LCB2YWx1ZSksXHJcbiAgICAgICAganNfbmV3OiAoWyBoYW5kbGUsIC4uLmFyZ3MgXSkgPT4gdGhpcy5uZXcoaGFuZGxlLCBhcmdzKSxcclxuICAgICAgICBqc19jYWxsOiAoWyBoYW5kbGUsIC4uLmFyZ3MgXSkgPT4gdGhpcy5jYWxsKGhhbmRsZSwgYXJncyksXHJcbiAgICAgICAganNfY2FsbF9tZXRob2Q6IChbIGhhbmRsZSwgbWV0aG9kLCAuLi5hcmdzIF0pID0+IHRoaXMuY2FsbE1ldGhvZChoYW5kbGUsIG1ldGhvZCwgYXJncylcclxuICAgIH07XHJcbiAgICBcclxuICAgIGdldE9iamVjdChoYW5kbGU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0KGhhbmRsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRvSlModmFsdWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCIjanM6XCIpKSByZXR1cm4gdGhpcy5nZXRPYmplY3QodmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmtub3duXCIpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcImZhbHNlXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwidHJ1ZVwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlKTtcclxuICAgICAgICBpZiAoIU51bWJlci5pc05hTihudW1iZXIpKSByZXR1cm4gbnVtYmVyO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdG9TUyh2YWx1ZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIgfHwgdmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuIHx8XHJcbiAgICAgICAgICAgIE51bWJlci5pc0ludGVnZXIodmFsdWUpKSByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuYWRkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBqcyhjb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b1NTKGV2YWwoY29kZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChoYW5kbGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRPYmplY3QoaGFuZGxlKT8uW3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvU1ModmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChoYW5kbGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMuZ2V0T2JqZWN0KGhhbmRsZSk7XHJcbiAgICAgICAgaWYgKG9iamVjdCAhPSBudWxsKSBvYmplY3RbcHJvcGVydHldID0gdGhpcy50b0pTKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3KGhhbmRsZTogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IGN0b3IgPSB0aGlzLmdldE9iamVjdChoYW5kbGUpO1xyXG4gICAgICAgIGlmIChjdG9yID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBjdG9yKC4uLmFyZ3MubWFwKChhcmcpID0+IHRoaXMudG9KUyhhcmcpKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdGhpcy50b1NTKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxsKGhhbmRsZTogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRPYmplY3QoaGFuZGxlKT8uKC4uLmFyZ3MubWFwKChhcmcpID0+IHRoaXMudG9KUyhhcmcpKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdGhpcy50b1NTKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxsTWV0aG9kKGhhbmRsZTogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgYXJnczogc3RyaW5nW10pIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0T2JqZWN0KGhhbmRsZSk/LlttZXRob2RdPy4oLi4uYXJncy5tYXAoKGFyZykgPT4gdGhpcy50b0pTKGFyZykpKTtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvU1ModmFsdWUpO1xyXG4gICAgfVxyXG59OyIsImltcG9ydCB7IE5hdGl2ZUxpYiB9IGZyb20gXCIuXCI7XHJcbmltcG9ydCB7IFJlZ2lzdHJ5IH0gZnJvbSBcIi4uL3JlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7IFNTRnVuY3Rpb24gfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWZMaWIgZXh0ZW5kcyBOYXRpdmVMaWIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeTxzdHJpbmc+KFwicmVmXCIpO1xyXG5cclxuICAgIHJlYWRvbmx5IGZ1bmN0aW9uczogUmVhZG9ubHk8eyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0+ID0ge1xyXG4gICAgICAgIHJlZjogKFsgaW5pdGlhbFZhbHVlIF0pID0+IHRoaXMucmVmKGluaXRpYWxWYWx1ZSksXHJcbiAgICAgICAgcmVmX3NldDogKFsgcmVmLCB2YWx1ZSBdKSA9PiB0aGlzLnNldChyZWYsIHZhbHVlKSxcclxuICAgICAgICByZWZfZ2V0OiAoWyByZWYgXSkgPT4gdGhpcy5nZXQocmVmKVxyXG4gICAgfTtcclxuXHJcbiAgICByZWYoaW5pdGlhbFZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeS5hZGQoaW5pdGlhbFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQocmVmOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnJlZ2lzdHJ5LnNldChyZWYsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHJlZjogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0KHJlZikgPz8gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUmVnaXN0cnk8VD4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50czogeyBba2V5OiBzdHJpbmddOiBUIH0gPSB7fTtcclxuICAgIHByaXZhdGUgaWQ6IG51bWJlciA9IC0xO1xyXG5cclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZChlbGVtZW50OiBUKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBgIyR7dGhpcy5uYW1lfTokeysrdGhpcy5pZH1gO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHNba2V5XSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQoa2V5OiBzdHJpbmcsIGVsZW1lbnQ6IFQpIHtcclxuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZWxlbWVudHMpIHRoaXMuZWxlbWVudHNba2V5XSA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGtleTogc3RyaW5nKTogVCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHNba2V5XTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEFTVEVsZW1lbnQsIEdyYW1tYXIsIFBhcnNlciwgaW5oZXJpdCB9IGZyb20gXCIuLi9wYXJzZXJcIjtcclxuaW1wb3J0IHsgTGliLCBTaWdtYVNjcmlwdExpYiB9IGZyb20gXCIuL2xpYlwiO1xyXG5pbXBvcnQgeyBET01MaWIgfSBmcm9tIFwiLi9saWIvZG9tXCI7XHJcbmltcG9ydCB7IEZuTGliIH0gZnJvbSBcIi4vbGliL2ZuXCI7XHJcbmltcG9ydCB7IEpTTGliIH0gZnJvbSBcIi4vbGliL2pzXCI7XHJcbmltcG9ydCB7IFJlZkxpYiB9IGZyb20gXCIuL2xpYi9yZWZcIjtcclxuaW1wb3J0IHsgZ3JhbW1hciB9IGZyb20gXCIuL2dyYW1tYXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY29wZSB7XHJcbiAgICByZWFkb25seSB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgIHJlYWRvbmx5IGZ1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZT86IFNjb3BlKSB7XHJcbiAgICAgICAgaWYgKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzID0geyAuLi5zY29wZS52YXJpYWJsZXMgfTtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSB7IC4uLnNjb3BlLmZ1bmN0aW9ucyB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIFNTRnVuY3Rpb24gPSAoYXJnczogc3RyaW5nW10sIHNjb3BlOiBTY29wZSkgPT4gc3RyaW5nO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpZ21hU2NyaXB0IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyc2VyOiBQYXJzZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxpYnM6IHsgW2tleTogc3RyaW5nXTogTGliIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXJnZUdyYW1tYXI6IFBhcnRpYWw8R3JhbW1hcj4gPSB7fSkge1xyXG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcihpbmhlcml0KGdyYW1tYXIsIG1lcmdlR3JhbW1hcikpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZExpYihcImRvbVwiLCBuZXcgRE9NTGliKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmFkZExpYihcImZuXCIsIG5ldyBGbkxpYih0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5hZGRMaWIoXCJqc1wiLCBuZXcgSlNMaWIodGhpcykpO1xyXG4gICAgICAgIHRoaXMuYWRkTGliKFwicmVmXCIsIG5ldyBSZWZMaWIodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwYXJzZUltcG9ydHMoaW1wb3J0czogQVNURWxlbWVudCwgc2NvcGU6IFNjb3BlKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB1c2Ugb2YgaW1wb3J0cylcclxuICAgICAgICAgICAgdGhpcy5saWJzW3VzZS5maW5kKFwibmFtZVwiKS52YWx1ZV0/LnVzZShzY29wZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBhcnNlU3RyaW5nKHJhdzogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHJhdy5zbGljZSgxLCAtMSkucmVwbGFjZSgvXFxcXFxcXCIvZywgXCJcXFwiXCIpLnJlcGxhY2UoL1xcXFxcXFxcL2csIFwiXFxcXFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZXZhbEV4cHIoZXhwcjogQVNURWxlbWVudCwgc2NvcGU6IFNjb3BlKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoZXhwci5uYW1lID09PSBcImV4cHJcIilcclxuICAgICAgICAgICAgZXhwciA9IGV4cHIuZmlyc3Q7XHJcbiAgICAgICAgc3dpdGNoIChleHByLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInBhcmVudGhlc2lzZXhwclwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLnZhcmlhYmxlc1tleHByLnZhbHVlXSA/PyBcInVua25vd25cIjtcclxuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiYm9vbFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHIudmFsdWU7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlU3RyaW5nKGV4cHIudmFsdWUpO1xyXG4gICAgICAgICAgICBjYXNlIFwiYWRkXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyLnBhcnNlSW50KGEpICsgTnVtYmVyLnBhcnNlSW50KGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXN1bHQpID8gXCJ1bmtub3duXCIgOiBgJHtyZXN1bHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwic3ViXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyLnBhcnNlSW50KGEpIC0gTnVtYmVyLnBhcnNlSW50KGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXN1bHQpID8gXCJ1bmtub3duXCIgOiBgJHtyZXN1bHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwibXVsXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyLnBhcnNlSW50KGEpICogTnVtYmVyLnBhcnNlSW50KGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXN1bHQpID8gXCJ1bmtub3duXCIgOiBgJHtyZXN1bHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwiZGl2XCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gfn4oTnVtYmVyLnBhcnNlSW50KGEpIC8gTnVtYmVyLnBhcnNlSW50KGIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImVxXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPT09IGJ9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwibHRcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5sYXN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihhKSB8fCBOdW1iZXIuaXNOYU4oYikpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthIDwgYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJndFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGEpIHx8IE51bWJlci5pc05hTihiKSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPiBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImxlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYSkgfHwgTnVtYmVyLmlzTmFOKGIpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA8PSBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImdlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYSkgfHwgTnVtYmVyLmlzTmFOKGIpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA+PSBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIm9yXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPT09IFwidHJ1ZVwiIHx8IGIgPT09IFwidHJ1ZVwifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImFuZFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID09PSBcInRydWVcIiAmJiBiID09PSBcInRydWVcIn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJub3RcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKSA9PT0gXCJ0cnVlXCIgPyBcImZhbHNlXCIgOiBcInRydWVcIn1gO1xyXG4gICAgICAgICAgICBjYXNlIFwiY29uY2F0XCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKyBiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBleHByLmZpbmQoXCJuYW1lXCIpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IHNjb3BlLmZ1bmN0aW9uc1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmICghZnVuYykgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IEFycmF5LmZyb20oZXhwci5maW5kKFwiYXJnbGlzdFwiKSkubWFwKChhcmcpID0+IHRoaXMuZXZhbEV4cHIoYXJnLCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMoYXJncywgc2NvcGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZXhlY1N0YXRlbWVudChzdGF0ZW1lbnQ6IEFTVEVsZW1lbnQsIHNjb3BlOiBTY29wZSk6IHN0cmluZyB7XHJcbiAgICAgICAgc3dpdGNoIChzdGF0ZW1lbnQubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiYXNzaWduXCI6XHJcbiAgICAgICAgICAgICAgICBzY29wZS52YXJpYWJsZXNbc3RhdGVtZW50LmZpbmQoXCJuYW1lXCIpLnZhbHVlXSA9IHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpbmQoXCJleHByXCIpLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImlmXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpbmQoXCJleHByXCIpLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmRpdGlvbiA9PT0gXCJ0cnVlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5leGVjKHN0YXRlbWVudC5maW5kKFwiYm9keVwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWxzZVN0YXRlbWVudCA9IHN0YXRlbWVudC5maW5kQ2hpbGQoXCJlbHNlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsc2VTdGF0ZW1lbnQgJiYgY29uZGl0aW9uID09PSBcImZhbHNlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5leGVjKGVsc2VTdGF0ZW1lbnQuZmluZChcImJvZHlcIiksIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwid2hpbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwciA9IHN0YXRlbWVudC5maW5kKFwiZXhwclwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBzdGF0ZW1lbnQuZmluZChcImJvZHlcIik7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5ldmFsRXhwcihleHByLCBzY29wZSkgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5leGVjKGJvZHksIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBzdGF0ZW1lbnQuZmluZChcImJvZHlcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBBcnJheS5mcm9tKHN0YXRlbWVudC5maW5kKFwicGFyYW1saXN0XCIpKS5tYXAoKHBhcmFtKSA9PiBwYXJhbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5mdW5jdGlvbnNbc3RhdGVtZW50LmZpbmQoXCJuYW1lXCIpLnZhbHVlXSA9IChhcmdzOiBzdHJpbmdbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsU2NvcGUgPSB0aGlzLm5ld1Njb3BlKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnID0gYXJnc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhcmcpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLnZhcmlhYmxlc1twYXJhbV0gPSBhcmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlYyhib2R5LCBsb2NhbFNjb3BlKSA/PyBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpbmQoXCJleHByXCIpLCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsc3RhdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsRXhwcihzdGF0ZW1lbnQuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicmV0dXJuXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsRXhwcihzdGF0ZW1lbnQuZmluZChcImV4cHJcIiksIHNjb3BlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBleGVjKGJvZHk6IEFTVEVsZW1lbnQsIHNjb3BlOiBTY29wZSk6IHN0cmluZyB7XHJcbiAgICAgICAgZm9yIChjb25zdCB7IGZpcnN0OiBzdGF0ZW1lbnQgfSBvZiBib2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXhlY1N0YXRlbWVudChzdGF0ZW1lbnQsIHNjb3BlKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkU2NyaXB0KHNjcmlwdDogSFRNTFNjcmlwdEVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoc2NyaXB0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgIT09IFwidGV4dC9zaWdtYXNjcmlwdFwiKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHNvdXJjZTtcclxuICAgICAgICBpZiAoc2NyaXB0Lmhhc0F0dHJpYnV0ZShcInNyY1wiKSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpO1xyXG4gICAgICAgICAgICBzb3VyY2UgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNvdXJjZSA9IHNjcmlwdC5pbm5lclRleHQ7XHJcbiAgICAgICAgdGhpcy5sb2FkKHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGliKG5hbWU6IHN0cmluZywgbGliOiBMaWIpIHtcclxuICAgICAgICB0aGlzLmxpYnNbbmFtZV0gPSBsaWI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGliPFQgZXh0ZW5kcyBMaWI+KGxpYkNsYXNzOiB7IG5ldyguLi5hcmdzOiBhbnkpOiBUIH0pOiBUIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmxpYnMpLmZpbmQoKGxpYikgPT4gbGliIGluc3RhbmNlb2YgbGliQ2xhc3MpIGFzIFQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXRMb2FkZXIoKSB7XHJcbiAgICAgICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcclxuICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEhUTUxTY3JpcHRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU2NyaXB0KG5vZGUpO1xyXG4gICAgICAgIH0pLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2NyaXB0IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpKVxyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY3JpcHQoc2NyaXB0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbmV3U2NvcGUocGFyZW50PzogU2NvcGUpOiBTY29wZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTY29wZShwYXJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4ZWN1dGUocHJvZ3JhbTogQVNURWxlbWVudCk6IFNjb3BlIHtcclxuICAgICAgICBjb25zdCBzY29wZSA9IHRoaXMubmV3U2NvcGUoKTtcclxuICAgICAgICB0aGlzLnBhcnNlSW1wb3J0cyhwcm9ncmFtLmZpbmQoXCJpbXBvcnRzXCIpLCBzY29wZSk7XHJcbiAgICAgICAgdGhpcy5leGVjKHByb2dyYW0uZmluZChcImJvZHlcIiksIHNjb3BlKTtcclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChzb3VyY2U6IHN0cmluZyk6IFNjb3BlIHtcclxuICAgICAgICBjb25zdCBwcm9ncmFtID0gdGhpcy5wYXJzZXIucGFyc2Uoc291cmNlKTtcclxuICAgICAgICBpZiAoIXByb2dyYW0gfHwgcHJvZ3JhbS5lbmQub2Zmc2V0ICE9PSBzb3VyY2UubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgbGliID0gcHJvZ3JhbS5maW5kQ2hpbGQoXCJsaWJcIik7XHJcbiAgICAgICAgaWYgKGxpYilcclxuICAgICAgICAgICAgdGhpcy5hZGRMaWIobGliLmZpbmQoXCJuYW1lXCIpLnZhbHVlLCBuZXcgU2lnbWFTY3JpcHRMaWIodGhpcywgcHJvZ3JhbSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShwcm9ncmFtKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNjb3BlLCBTaWdtYVNjcmlwdCB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdC9zaWdtYXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBBU1RFbGVtZW50LCBHcmFtbWFyIH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5pbXBvcnQgeyBSZWdpc3RyeSB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdC9yZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBET01MaWIgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHQvbGliL2RvbVwiO1xyXG5cclxuY29uc3QgZ3JhbW1hcjogUGFydGlhbDxHcmFtbWFyPiA9IHtcclxuICAgIFwiaHRtbG5hbWVcIjogXCJbYS16MC05LV0rXCIsXHJcbiAgICBcImh0bWxhdHRydmFsXCI6IFwiJXN0cmluZ3woeyAlZXhwciB9KVwiLFxyXG4gICAgXCJodG1sYXR0clwiOiBcIiVodG1sbmFtZT0laHRtbGF0dHJ2YWxcIixcclxuICAgIFwiaHRtbGVudGl0eVwiOiBcIiYlaHRtbG5hbWU7XCIsXHJcbiAgICBcImh0bWx0ZXh0XCI6IFwiKFteJjw+e31dKStcIixcclxuICAgIFwiaHRtbGNvbnRlbnRcIjogXCIoJWh0bWx0ZXh0fCVodG1sZW50aXR5fCh7ICVleHByIH0pfCVodG1sKSs/XCIsXHJcbiAgICBcImh0bWxzaW5nbGVcIjogXCI8JWh0bWxuYW1lKCAlaHRtbGF0dHIgKSs/IC8+XCIsXHJcbiAgICBcImh0bWxwYWlyZWRcIjogXCI8JWh0bWxuYW1lKCAlaHRtbGF0dHIgKSs/PiVodG1sY29udGVudDwvJWh0bWxuYW1lPlwiLFxyXG4gICAgXCJodG1sXCI6IFwiJWh0bWxzaW5nbGV8JWh0bWxwYWlyZWRcIixcclxuICAgIFwiZXhwclwiOiBcIi4uLnwlaHRtbFwiLFxyXG4gICAgXCJjb21wb25lbnRcIjogXCJmbiA8JWh0bWxuYW1lKCAlaHRtbGF0dHIgKSs/PiB7ICVib2R5IH1cIixcclxuICAgIFwic3RhdGVtZW50XCI6IFwiLi4ufCVjb21wb25lbnRcIlxyXG59O1xyXG5cclxuY29uc3QgaHRtbGVudGl0aWVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge1xyXG4gICAgXCJhbXBcIjogXCImXCIsXHJcbiAgICBcImx0XCI6IFwiPFwiLFxyXG4gICAgXCJndFwiOiBcIj5cIlxyXG59O1xyXG5cclxuY2xhc3MgU1NYU2NvcGUgZXh0ZW5kcyBTY29wZSB7XHJcbiAgICByZWFkb25seSBjb21wb25lbnRzOiB7IFtrZXk6IHN0cmluZ106IChjaGlsZHJlbjogc3RyaW5nLCBhdHRydmFsczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkgPT4gc3RyaW5nIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZT86IFNjb3BlKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUpO1xyXG4gICAgICAgIGlmIChzY29wZSBpbnN0YW5jZW9mIFNTWFNjb3BlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7IC4uLnNjb3BlLmNvbXBvbmVudHMgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNpZ21hU2NyaXB0WCBleHRlbmRzIFNpZ21hU2NyaXB0IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ3JvdXBSZWdpc3RyeSA9IG5ldyBSZWdpc3RyeTxzdHJpbmdbXT4oXCJzc3hncm91cFwiKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihncmFtbWFyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcGFyc2VIVE1MQ29udGVudChodG1sY29udGVudDogQVNURWxlbWVudCwgc2NvcGU6IFNTWFNjb3BlKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgaHRtbGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGNoaWxkLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJodG1sdGV4dFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2hpbGQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaHRtbGVudGl0eVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaHRtbGVudGl0aWVzW2NoaWxkLmZpbmQoXCJodG1sbmFtZVwiKS52YWx1ZV0gPz8gY2hpbGQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZXhwclwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImh0bWxcIjpcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbEV4cHIoY2hpbGQsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBSZWdpc3RyeS5nZXQodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXApXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKC4uLmdyb3VwKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZXZhbEV4cHIoZXhwcjogQVNURWxlbWVudCwgc2NvcGU6IFNTWFNjb3BlKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoZXhwci5uYW1lID09PSBcImV4cHJcIilcclxuICAgICAgICAgICAgZXhwciA9IGV4cHIuZmlyc3Q7XHJcbiAgICAgICAgc3dpdGNoIChleHByLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImh0bWxcIjoge1xyXG4gICAgICAgICAgICAgICAgZXhwciA9IGV4cHIuZmlyc3Q7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1BhaXJlZCA9IGV4cHIubmFtZSA9PT0gXCJodG1scGFpcmVkXCI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YWdOYW1lID0gZXhwci5maXJzdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc1BhaXJlZCAmJiBleHByLmxhc3QudmFsdWUgIT09IHRhZ05hbWUpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHNjb3BlLmNvbXBvbmVudHNbdGFnTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cnZhbHM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgZXhwci5maW5kQ2hpbGRyZW4oXCJodG1sYXR0clwiKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnZhbHNbYXR0ci5maW5kKFwiaHRtbG5hbWVcIikudmFsdWVdID0gdGhpcy5ldmFsRXhwcihhdHRyLmZpbmQoXCJodG1sYXR0cnZhbFwiKS5maXJzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQoaXNQYWlyZWQgPyB0aGlzLmdyb3VwUmVnaXN0cnkuYWRkKHRoaXMucGFyc2VIVE1MQ29udGVudChleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgc2NvcGUpKSA6IFwidW5rbm93blwiLCBhdHRydmFscyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbUxpYiA9IHRoaXMuZ2V0TGliKERPTUxpYik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvbUxpYi5jcmVhdGUodGFnTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGV4cHIuZmluZENoaWxkcmVuKFwiaHRtbGF0dHJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbUxpYi5zZXRBdHRyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIuZmluZChcImh0bWxuYW1lXCIpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmFsRXhwcihhdHRyLmZpbmQoXCJodG1sYXR0cnZhbFwiKS5maXJzdCwgc2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMucGFyc2VIVE1MQ29udGVudChleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgc2NvcGUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTGliLmFwcGVuZChlbGVtZW50LCBjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5ldmFsRXhwcihleHByLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBleGVjU3RhdGVtZW50KHN0YXRlbWVudDogQVNURWxlbWVudCwgc2NvcGU6IFNTWFNjb3BlKTogc3RyaW5nIHtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlbWVudC5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjb21wb25lbnRcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHN0YXRlbWVudC5maW5kKFwiYm9keVwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2Ygc3RhdGVtZW50LmZpbmRDaGlsZHJlbihcImh0bWxhdHRyXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzW2F0dHIuZmluZChcImh0bWxuYW1lXCIpLnZhbHVlXSA9IHRoaXMuZXZhbEV4cHIoYXR0ci5maW5kKFwiaHRtbGF0dHJ2YWxcIikuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmNvbXBvbmVudHNbc3RhdGVtZW50LmZpbmQoXCJodG1sbmFtZVwiKS52YWx1ZV0gPSAoY2hpbGRyZW46IHN0cmluZywgYXR0cnZhbHM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFNjb3BlID0gdGhpcy5uZXdTY29wZShzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS52YXJpYWJsZXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGF0dHJuYW1lIGluIGF0dHJzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLnZhcmlhYmxlc1thdHRybmFtZV0gPSBhdHRydmFsc1thdHRybmFtZV0gPz8gYXR0cnNbYXR0cm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWMoYm9keSwgbG9jYWxTY29wZSkgPz8gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5leGVjU3RhdGVtZW50KHN0YXRlbWVudCwgc2NvcGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbmV3U2NvcGUocGFyZW50PzogU2NvcGUpOiBTU1hTY29wZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTU1hTY29wZShwYXJlbnQpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBTaWdtYVNjcmlwdFggYXMgU2lnbWFTY3JpcHQgfSBmcm9tIFwiLi9zaWdtYXNjcmlwdHgvc2lnbWFzY3JpcHR4XCI7XHJcblxyXG5jb25zdCBkZW1vczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcclxuICAgIFwiaGVsbG8td29ybGRcIjogYHByaW50IFwiSGVsbG8gd29ybGQhXCI7YCxcclxuICAgIFwic3RydWN0dXJlc1wiOiBgXHJcbnByaW50IFwibG9vcCBmcm9tIDEgdG8gMTBcIjtcclxueCA9IDA7XHJcbndoaWxlIHggPCAxMCB7XHJcbiAgICB4ID0geCArIDE7XHJcbiAgICBwcmludCB4O1xyXG59XHJcbiAgICBcclxuaWYgeCA9IDEwIHtcclxuICAgIHByaW50IFwieCA9IDEwXCI7XHJcbn0gZWxzZSB7XHJcbiAgICBwcmludCBcIngg4omgIDEwXCI7XHJcbn1cclxuYCxcclxuICAgIFwiZmlib25hY2NpXCI6IGBcclxuZm4gZmliKG4pIHtcclxuICAgIGlmIG4gPSAxIHwgbiA9IDIgeyByZXQgMTsgfVxyXG4gICAgcmV0IGZpYihuIC0gMSkgKyBmaWIobiAtIDIpO1xyXG59XHJcblxyXG5wcmludCBcIjEwdGggRmlib25hY2NpIG51bWJlciBpcyBcIiBAIGZpYigxMCk7XHJcbmAsXHJcbiAgICBcImRvbVwiOiBgXHJcbnVzZSBkb207XHJcbnVzZSBqcztcclxuXHJcbnByb21wdCA9IGpzX2dldChqc193aW5kb3csIFwicHJvbXB0XCIpO1xyXG5jb2xvciA9IGpzX2NhbGwocHJvbXB0LCBcIkVudGVyIGJhY2tncm91bmQgY29sb3JcIiwgXCJ3aGl0ZVwiKTtcclxuZG9tX2Nzcyhkb21fYm9keSwgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGNvbG9yKTtcclxuYCxcclxuICAgIFwicmVmXCI6IGBcclxudXNlIHJlZjtcclxuXHJcbmZuIGluYyhyZWYpIHtcclxuICAgIHJlZl9zZXQocmVmLCByZWZfZ2V0KHJlZikgKyAxKTtcclxufVxyXG5cclxueCA9IHJlZigwKTtcclxucHJpbnQgXCJ4ID0gXCIgQCByZWZfZ2V0KHgpO1xyXG5cclxuaW5jKHgpO1xyXG5wcmludCBcInggPSBcIiBAIHJlZl9nZXQoeCk7XHJcbmAsXHJcbiAgICBcImNhbGxiYWNrc1wiOiBgXHJcbnVzZSBmbjtcclxuXHJcbmZuIGZvbygpIHtcclxuICAgIHByaW50IFwiSSBhbSBmb29cIjtcclxuICAgIHJldCAxMjM7XHJcbn1cclxuXHJcbmZuIGJhcihjYWxsYmFjaykge1xyXG4gICAgcHJpbnQgXCJJIGFtIGJhclwiO1xyXG4gICAgcHJpbnQgXCJJIGdvdCBcIiBAIGNhbGwoY2FsbGJhY2spIEAgXCIgZnJvbSBjYWxsYmFja1wiO1xyXG59XHJcblxyXG5iYXIoZm4oXCJmb29cIikpO2BcclxufTtcclxuXHJcbmNvbnN0IHNpZ21hU2NyaXB0ID0gbmV3IFNpZ21hU2NyaXB0KCk7XHJcblxyXG5jb25zdCBjb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2RlXCIpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbmNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5jb25zdCBkZW1vU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZW1vLXNlbGVjdFwiKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuXHJcbnJ1bkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaWYgKCFzaWdtYVNjcmlwdC5sb2FkKGNvZGUudmFsdWUpKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJpbnZhbGlkIHN5bnRheFwiKTtcclxufSk7XHJcblxyXG5kZW1vU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29kZS52YWx1ZSA9IGRlbW9zW2RlbW9TZWxlY3QudmFsdWVdLnRyaW0oKTtcclxufSk7XHJcblxyXG5jb2RlLnZhbHVlID0gZGVtb3NbXCJoZWxsby13b3JsZFwiXS50cmltKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9