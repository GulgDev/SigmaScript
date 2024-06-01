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
/* harmony export */   domLib: () => (/* binding */ domLib)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./src/sigmascript/lib/lib.ts");

let elementId = -1;
const elements = {};
function saveElement(element) {
    const key = `#dom:${++elementId}`;
    elements[key] = element;
    return key;
}
function getElement(handle) {
    return elements[handle];
}
const domLib = new _lib__WEBPACK_IMPORTED_MODULE_0__.NativeLib({
    dom_head: saveElement(document.head),
    dom_body: saveElement(document.body)
}, {
    dom_title([title]) {
        document.title = title;
        return "unknown";
    },
    dom_create([tagName]) {
        return saveElement(document.createElement(tagName));
    },
    dom_find([selector]) {
        const element = document.querySelector(selector);
        if (!element)
            return "unknown";
        return saveElement(element);
    },
    dom_append([parent, child]) {
        var _a, _b;
        (_a = getElement(parent)) === null || _a === void 0 ? void 0 : _a.appendChild((_b = getElement(child)) !== null && _b !== void 0 ? _b : document.createTextNode(child));
        return "unknown";
    },
    dom_remove([element]) {
        getElement(element).remove();
        return "unknown";
    },
    dom_add_class([element, className]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement)
            elm.classList.add(className);
        return "unknown";
    },
    dom_remove_class([element, className]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement)
            elm.classList.remove(className);
        return "unknown";
    },
    dom_toggle_class([element, className]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement)
            elm.classList.toggle(className);
        return "unknown";
    },
    dom_set_text([element, text]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement)
            elm.innerText = text;
        return "unknown";
    },
    dom_set_html([element, html]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement)
            elm.innerHTML = html;
        return "unknown";
    },
    dom_set_attr([element, attr, value]) {
        var _a;
        (_a = getElement(element)) === null || _a === void 0 ? void 0 : _a.setAttribute(attr, value);
        return "unknown";
    },
    dom_get_attr([element, attr]) {
        var _a;
        return (_a = getElement(element)) === null || _a === void 0 ? void 0 : _a.getAttribute(attr);
    },
    dom_css([element, attr, value]) {
        const elm = getElement(element);
        if (elm instanceof HTMLElement)
            elm.style.setProperty(attr, value);
        return "unknown";
    },
    dom_event([element, event, callback], scope) {
        const elm = getElement(element);
        const fn = scope.functions[callback];
        elm.addEventListener(event, () => fn([], scope));
        return "unknown";
    }
});


/***/ }),

/***/ "./src/sigmascript/lib/fn.ts":
/*!***********************************!*\
  !*** ./src/sigmascript/lib/fn.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fnLib: () => (/* binding */ fnLib)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./src/sigmascript/lib/lib.ts");

let funcId = -1;
const funcs = {};
const fnLib = new _lib__WEBPACK_IMPORTED_MODULE_0__.NativeLib({}, {
    fn([name], { functions }) {
        const key = `#fn:${++funcId}`;
        funcs[key] = functions[name];
        return key;
    },
    call([fn, ...args], scope) {
        var _a, _b;
        return (_b = (_a = funcs[fn]) === null || _a === void 0 ? void 0 : _a.call(funcs, args, scope)) !== null && _b !== void 0 ? _b : "unknown";
    }
});


/***/ }),

/***/ "./src/sigmascript/lib/js.ts":
/*!***********************************!*\
  !*** ./src/sigmascript/lib/js.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   jsLib: () => (/* binding */ jsLib)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./src/sigmascript/lib/lib.ts");

let objectId = -1;
const objects = {};
function saveObject(object) {
    const key = `#js:${++objectId}`;
    objects[key] = object;
    return key;
}
function getObject(handle) {
    return objects[handle];
}
function toJS(value) {
    if (value.startsWith("#js:"))
        return getObject(value);
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
function toSS(value) {
    if (typeof value === "string" || value instanceof String ||
        typeof value === "boolean" || value instanceof Boolean ||
        Number.isInteger(value))
        return `${value}`;
    if (value == null || Number.isNaN(value))
        return "unknown";
    return saveObject(value);
}
const jsLib = new _lib__WEBPACK_IMPORTED_MODULE_0__.NativeLib({
    js_window: saveObject(window)
}, {
    js([code]) {
        return toSS(eval(code));
    },
    js_get([handle, property]) {
        var _a;
        const value = (_a = getObject(handle)) === null || _a === void 0 ? void 0 : _a[property];
        if (value == null)
            return "unknown";
        return toSS(value);
    },
    js_set([handle, property, value]) {
        const object = getObject(handle);
        if (object != null)
            object[property] = toJS(value);
        return "unknown";
    },
    js_new([handle, ...args]) {
        const ctor = getObject(handle);
        if (ctor == null)
            return "unknown";
        const value = new ctor(...args.map(toJS));
        if (value == null)
            return "unknown";
        return toSS(value);
    },
    js_call([handle, ...args]) {
        var _a;
        const value = (_a = getObject(handle)) === null || _a === void 0 ? void 0 : _a(...args.map(toJS));
        if (value == null)
            return "unknown";
        return toSS(value);
    },
    js_call_method([handle, method, ...args]) {
        var _a, _b;
        const value = (_b = (_a = getObject(handle)) === null || _a === void 0 ? void 0 : _a[method]) === null || _b === void 0 ? void 0 : _b.call(_a, ...args.map(toJS));
        if (value == null)
            return "unknown";
        return toSS(value);
    }
});


/***/ }),

/***/ "./src/sigmascript/lib/lib.ts":
/*!************************************!*\
  !*** ./src/sigmascript/lib/lib.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NativeLib: () => (/* binding */ NativeLib),
/* harmony export */   SigmaScriptLib: () => (/* binding */ SigmaScriptLib)
/* harmony export */ });
class SigmaScriptLib {
    constructor(program) {
        this.program = program;
    }
    use(sigmaScript, variables, functions) {
        const scope = sigmaScript.execute(this.program);
        Object.assign(variables, scope.variables);
        Object.assign(functions, scope.functions);
    }
}
class NativeLib {
    constructor(variables, functions) {
        this.variables = variables;
        this.functions = functions;
    }
    use(variables, functions) {
        Object.assign(variables, this.variables);
        Object.assign(functions, this.functions);
    }
}


/***/ }),

/***/ "./src/sigmascript/lib/ref.ts":
/*!************************************!*\
  !*** ./src/sigmascript/lib/ref.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   refLib: () => (/* binding */ refLib)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./src/sigmascript/lib/lib.ts");

let refId = -1;
const refs = {};
const refLib = new _lib__WEBPACK_IMPORTED_MODULE_0__.NativeLib({}, {
    ref([initialValue]) {
        const key = `#ref:${++refId}`;
        refs[key] = initialValue !== null && initialValue !== void 0 ? initialValue : "unknown";
        return key;
    },
    ref_set([ref, value]) {
        refs[ref] = value;
        return "unknown";
    },
    ref_get([ref]) {
        var _a;
        return (_a = refs[ref]) !== null && _a !== void 0 ? _a : "unknown";
    }
});


/***/ }),

/***/ "./src/sigmascript/sigmascript.ts":
/*!****************************************!*\
  !*** ./src/sigmascript/sigmascript.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SigmaScript: () => (/* binding */ SigmaScript)
/* harmony export */ });
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parser */ "./src/parser/index.ts");
/* harmony import */ var _lib_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/lib */ "./src/sigmascript/lib/lib.ts");
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







class SigmaScript {
    constructor(mergeGrammar = {}) {
        this.libs = {};
        this.parser = new _parser__WEBPACK_IMPORTED_MODULE_0__.Parser((0,_parser__WEBPACK_IMPORTED_MODULE_0__.inherit)(_grammar__WEBPACK_IMPORTED_MODULE_6__.grammar, mergeGrammar));
    }
    parseImports(imports) {
        const variables = {};
        const functions = {};
        for (const use of imports) {
            const name = use.find("name").value;
            if (name in this.libs)
                this.libs[name].use(this, variables, functions);
            else
                switch (name) {
                    case "js":
                        _lib_js__WEBPACK_IMPORTED_MODULE_4__.jsLib.use(variables, functions);
                        break;
                    case "dom":
                        _lib_dom__WEBPACK_IMPORTED_MODULE_2__.domLib.use(variables, functions);
                        break;
                    case "ref":
                        _lib_ref__WEBPACK_IMPORTED_MODULE_5__.refLib.use(variables, functions);
                        break;
                    case "fn":
                        _lib_fn__WEBPACK_IMPORTED_MODULE_3__.fnLib.use(variables, functions);
                        break;
                }
        }
        return { variables, functions };
    }
    parseString(raw) {
        return raw.slice(1, -1).replace(/\\\"/g, "\"").replace(/\\\\/g, "\\");
    }
    evalExpr(expr, variables, functions) {
        var _a;
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "parenthesisexpr":
                return this.evalExpr(expr.first, variables, functions);
            case "name":
                return (_a = variables[expr.value]) !== null && _a !== void 0 ? _a : "unknown";
            case "number":
            case "bool":
                return expr.value;
            case "string":
                return this.parseString(expr.value);
            case "add": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) + Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "sub": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) - Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "mul": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) * Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "div": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = ~~(Number.parseInt(a) / Number.parseInt(b));
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "eq": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return `${a === b}`;
            }
            case "lt": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a < b}`;
            }
            case "gt": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a > b}`;
            }
            case "le": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a <= b}`;
            }
            case "ge": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b))
                    return "unknown";
                return `${a >= b}`;
            }
            case "or": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return `${a === "true" || b === "true"}`;
            }
            case "and": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return `${a === "true" && b === "true"}`;
            }
            case "not":
                return `${this.evalExpr(expr.first, variables, functions) === "true" ? "false" : "true"}`;
            case "concat": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return a + b;
            }
            case "call": {
                const name = expr.find("name").value;
                const func = functions[name];
                if (!func)
                    return "unknown";
                const args = Array.from(expr.find("arglist")).map((arg) => this.evalExpr(arg, variables, functions));
                return func(args, { variables, functions });
            }
        }
        return "unknown";
    }
    execStatement(statement, variables, functions) {
        switch (statement.name) {
            case "assign":
                variables[statement.find("name").value] = this.evalExpr(statement.find("expr"), variables, functions);
                break;
            case "if": {
                const condition = this.evalExpr(statement.find("expr"), variables, functions);
                let result;
                if (condition === "true")
                    result = this.exec(statement.find("body"), variables, functions);
                const elseStatement = statement.findChild("else");
                if (elseStatement && condition === "false")
                    result = this.exec(elseStatement.find("body"), variables, functions);
                if (result)
                    return result;
                break;
            }
            case "while": {
                const expr = statement.find("expr");
                const body = statement.find("body");
                while (this.evalExpr(expr, variables, functions) === "true") {
                    const result = this.exec(body, variables, functions);
                    if (result)
                        return result;
                }
                break;
            }
            case "function": {
                const body = statement.find("body");
                const params = Array.from(statement.find("paramlist")).map((param) => param.value);
                functions[statement.find("name").value] = (args) => {
                    var _a;
                    const localVariables = Object.assign({}, variables);
                    const localFunctions = Object.assign({}, functions);
                    let i = 0;
                    for (const param of params) {
                        const arg = args[i];
                        if (!arg)
                            break;
                        localVariables[param] = arg;
                        ++i;
                    }
                    return (_a = this.exec(body, localVariables, localFunctions)) !== null && _a !== void 0 ? _a : "unknown";
                };
                break;
            }
            case "print":
                console.log(this.evalExpr(statement.find("expr"), variables, functions));
                break;
            case "callstat":
                this.evalExpr(statement.first, variables, functions);
                break;
            case "return":
                return this.evalExpr(statement.find("expr"), variables, functions);
        }
    }
    exec(body, variables, functions) {
        for (const { first: statement } of body) {
            const result = this.execStatement(statement, variables, functions);
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
    execute(program) {
        const { variables, functions } = this.parseImports(program.find("imports"));
        this.exec(program.find("body"), variables, functions);
        return { variables, functions };
    }
    load(source) {
        const program = this.parser.parse(source);
        if (!program || program.end.offset !== source.length)
            return;
        const lib = program.findChild("lib");
        if (lib)
            this.libs[lib.find("name").value] = new _lib_lib__WEBPACK_IMPORTED_MODULE_1__.SigmaScriptLib(program);
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
/* harmony import */ var _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sigmascript/lib/dom */ "./src/sigmascript/lib/dom.ts");


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
const grammar = {
    "htmlname": "[a-z-]+",
    "htmlattrval": "%string|({ %expr })",
    "htmlattr": "%htmlname=%htmlattrval",
    "htmlentity": "&%htmlname;",
    "htmltext": "([^&<>{}])+",
    "htmlcontent": "(%htmltext|%htmlentity|({ %expr })|%html)+?",
    "html": "<%htmlname( %htmlattr )+?>%htmlcontent</%htmlname>",
    "expr": "...|%html"
};
const htmlentities = {
    "amp": "&",
    "lt": "<",
    "gt": ">"
};
class SigmaScriptX extends _sigmascript_sigmascript__WEBPACK_IMPORTED_MODULE_0__.SigmaScript {
    constructor() {
        super(grammar);
    }
    parseAttributes(element, html, variables, functions) {
        for (const attr of html.findChildren("htmlattr"))
            _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__.domLib.functions.dom_set_attr([
                element,
                attr.find("htmlname").value,
                this.evalExpr(attr.find("htmlattrval").first, variables, functions)
            ], { variables, functions });
    }
    parseContent(element, content, variables, functions) {
        var _a;
        for (const child of content) {
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
                    value = this.evalExpr(child, variables, functions);
                    break;
            }
            _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__.domLib.functions.dom_append([element, value], { variables, functions });
        }
    }
    evalExpr(expr, variables, functions) {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "html":
                if (expr.first.value !== expr.last.value)
                    return "unknown";
                const element = _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__.domLib.functions.dom_create([expr.first.value], { variables, functions });
                this.parseAttributes(element, expr, variables, functions);
                this.parseContent(element, expr.find("htmlcontent"), variables, functions);
                return element;
            default:
                return super.evalExpr(expr, variables, functions);
        }
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
/*!***********************************!*\
  !*** ./src/sigmascriptx/index.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sigmascriptx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sigmascriptx */ "./src/sigmascriptx/sigmascriptx.ts");

new _sigmascriptx__WEBPACK_IMPORTED_MODULE_0__.SigmaScriptX().initLoader();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdC9zaWdtYXNjcmlwdHguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBTyxJQUFVLElBQUksQ0FnQnBCO0FBaEJELFdBQWlCLElBQUk7SUFDakIsU0FBZ0IsWUFBWSxDQUFDLEVBQVU7UUFDbkMsT0FBTyxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRmUsaUJBQVksZUFFM0I7SUFFRCxTQUFnQixPQUFPLENBQUMsRUFBVTtRQUM5QixJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUplLFlBQU8sVUFJdEI7SUFFRCxTQUFnQixRQUFRLENBQUMsRUFBVTtRQUMvQixJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxHQUFHLENBQUM7SUFDckMsQ0FBQztJQUplLGFBQVEsV0FJdkI7QUFDTCxDQUFDLEVBaEJnQixJQUFJLEtBQUosSUFBSSxRQWdCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQm1EO0FBQ1I7QUFhckMsTUFBTSxVQUFVO0lBUW5CLFlBQVksSUFBWSxFQUFFLEtBQWUsRUFBRSxHQUFhLEVBQUUsS0FBYTtRQUNuRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDZCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQzdCLE1BQU0sS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBaUI7UUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBWTtRQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBWTtRQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxLQUFLO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDeEIsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFJLFVBQVU7Z0JBQUUsT0FBTyxVQUFVLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVNLE1BQU0sTUFBTTtJQUdmLFlBQVksT0FBZ0I7UUFGWCxhQUFRLEdBQXlCLElBQUksR0FBRyxFQUFFLENBQUM7UUFHeEQsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3BELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUTtnQkFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGlEQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7Z0JBRTdDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxpREFBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQ3ZILENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYztRQUNoQixTQUFTLEtBQUssQ0FBQyxPQUFjLEVBQUUsTUFBa0I7WUFDN0MsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25JLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sR0FBRyxTQUFTLENBQUM7WUFDdkIsQ0FBQztZQUNELElBQUksT0FBTyxDQUFDLFFBQVE7Z0JBQ2hCLEtBQUssTUFBTSxLQUFLLElBQUksT0FBTyxDQUFDLFFBQVE7b0JBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLDJDQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUNuQixNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hILEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBRUQsU0FBUyxhQUFhLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDdkMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsQ0FBYSxFQUFFLENBQWE7O0lBQ3ZDLElBQUksQ0FBQyxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDakIsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqQixJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO1FBQUUsT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9FLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSx1Q0FBWSxDQUFDLEtBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFHO0lBQzFHLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSx1Q0FBWSxDQUFDLEtBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFHO0lBQzFHLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFDOUMsT0FBTztZQUNILE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzVDLFVBQVUsRUFBRSxPQUFDLENBQUMsVUFBVSxtQ0FBSSxDQUFDLENBQUMsVUFBVTtZQUN4QyxrQkFBa0IsRUFBRSxPQUFDLENBQUMsa0JBQWtCLG1DQUFJLENBQUMsQ0FBQyxrQkFBa0I7U0FDbkUsQ0FBQztBQUNWLENBQUM7QUFFTSxTQUFTLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBeUI7SUFDOUQsTUFBTSxNQUFNLEdBQVksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkUsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNO1FBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3RSxLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU87UUFDdEIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQztZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdFLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3SDZCO0FBQ2M7QUFXNUMsTUFBTSxLQUFLO0lBS1AsWUFBWSxXQUF3QyxFQUFFLEVBQUUsSUFBYTtRQUNqRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxDQUFDLE1BQWMsRUFBRSxJQUFZO1FBQzdCLE1BQU0sUUFBUSxxQkFBUSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUM7UUFDdEMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxPQUFPLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsR0FBRyxDQUFDLE1BQWMsRUFBRSxJQUFZOztRQUM1QixPQUFPLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLDBDQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0o7QUFFTSxNQUFlLE9BQU87Q0FLNUI7QUFFTSxNQUFNLFVBQVcsU0FBUSxPQUFPO0lBR25DLFlBQVksRUFBVTtRQUNsQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUN4QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNDLENBQUM7Q0FDSjtBQUVNLE1BQU0sU0FBVSxTQUFRLE9BQU87SUFJbEMsWUFBWSxDQUFVLEVBQUUsQ0FBVTtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQWMsRUFBRSxRQUE4QixFQUFFLGFBQXFCLENBQUMsRUFBRSxRQUFlLElBQUksS0FBSyxFQUFFLEVBQUUsUUFBa0MsRUFBRTtRQUMxSSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLFlBQVksSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNySixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLFlBQVksSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNySixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLE1BQU0sSUFBSSxNQUFNO1lBQ2hCLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hELElBQUksS0FBSyxLQUFLLE1BQU07WUFDaEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxLQUFLO1lBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3pFLENBQUM7Q0FDSjtBQUVNLE1BQU0saUJBQWtCLFNBQVEsT0FBTztJQUMxQyxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLE9BQU8sdUNBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVELE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0NBQ0o7QUFFTSxNQUFNLFVBQVcsU0FBUSxPQUFPO0lBQ25DLEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFBRSxPQUFPO1FBQzdCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0MsQ0FBQztDQUNKO0FBRU0sTUFBTSxZQUFhLFNBQVEsT0FBTztJQUNyQyxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyx1Q0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFBRSxPQUFPO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0MsQ0FBQztDQUNKO0FBRU0sTUFBTSxlQUFnQixTQUFRLE9BQU87SUFHeEMsWUFBWSxPQUFnQjtRQUN4QixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYyxFQUFFLFFBQThCLEVBQUUsYUFBcUIsQ0FBQyxFQUFFLFFBQWUsSUFBSSxLQUFLLEVBQUUsRUFBRSxRQUFrQyxFQUFFO1FBQzFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxLQUFLO1lBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDcEMsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUMzRSxDQUFDO0NBQ0o7QUFFTSxNQUFNLGFBQWMsU0FBUSxPQUFPO0lBR3RDLFlBQVksT0FBZ0I7UUFDeEIsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQWMsRUFBRSxRQUE4QixFQUFFLGFBQXFCLENBQUMsRUFBRSxRQUFlLElBQUksS0FBSyxFQUFFLEVBQUUsUUFBa0MsRUFBRTtRQUMxSSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRSxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUNuQixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzNCLE9BQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzVFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTTtnQkFBRSxNQUFNO1lBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDM0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDckQsQ0FBQztDQUNKO0FBRU0sTUFBTSxxQkFBc0IsU0FBUSxPQUFPO0lBSTlDLFlBQVksS0FBcUIsRUFBRSxRQUFpQjtRQUNoRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU87UUFDaEIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSztZQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxRQUFRO2dCQUN0SCxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzVELENBQUM7Q0FDSjtBQUVNLE1BQU0sWUFBYSxTQUFRLE9BQU87SUFHckMsWUFBWSxRQUFtQjtRQUMzQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYyxFQUFFLFFBQThCLEVBQUUsYUFBcUIsQ0FBQyxFQUFFLFFBQWUsSUFBSSxLQUFLLEVBQUUsRUFBRSxRQUFrQyxFQUFFO1FBQzFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU87WUFDbkIsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0NBQ0o7QUFFTSxNQUFNLFlBQWEsU0FBUSxPQUFPO0lBR3JDLFlBQVksSUFBWTtRQUNwQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYyxFQUFFLFFBQThCLEVBQUUsYUFBcUIsQ0FBQyxFQUFFLFFBQWUsSUFBSSxLQUFLLEVBQUUsRUFBRSxRQUFrQyxFQUFFOztRQUMxSSxNQUFNLEdBQUcsR0FBRyxHQUFHLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN2QixJQUFJLE1BQU07Z0JBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ3pDLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xHLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsYUFBTyxDQUFDLFVBQVUsbUNBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JKLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDNUYsQ0FBQztDQUNKO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxFQUFVO0lBQ2xDLE9BQU8sRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUM7QUFDNUYsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLE1BQWMsRUFBRSxVQUFtQixFQUFFLHFCQUE4QixLQUFLO0lBQzFGLE1BQU0sUUFBUSxHQUFjLEVBQUUsQ0FBQztJQUMvQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDZixJQUFJLEVBQUUsQ0FBQztJQUNQLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNiLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDckIsSUFBSSxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN6QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0QyxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sdUNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ3pDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDakIsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDO2dCQUNELElBQUksSUFBSSxLQUFLLEdBQUc7b0JBQ1osUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUM7O29CQUVsQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsQ0FBQztRQUNMLENBQUM7YUFBTSxJQUFJLEVBQUUsS0FBSyxHQUFHO1lBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2FBQy9DLElBQUksRUFBRSxLQUFLLEdBQUc7WUFDZixNQUFNO2FBQ0wsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDbEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsQ0FBQztZQUN6QyxJQUFJLFFBQVE7Z0JBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQy9CLE1BQU0sS0FBSyxHQUFtQixFQUFFLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO2dCQUMxQixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ3pCLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztxQkFBTSxJQUFJLEVBQUUsS0FBSyxHQUFHO29CQUNqQixNQUFNO3FCQUNMLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUN2RSxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUNiLFNBQVM7Z0JBQ2IsQ0FBQzs7b0JBQ0csS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxLQUFLLEVBQUUsQ0FBQztvQkFDUixLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNkLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQXFCLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztZQUNMLENBQUM7WUFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQzthQUFNLElBQUksRUFBRSxLQUFLLEdBQUc7WUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUM7YUFDL0IsSUFBSSxFQUFFLEtBQUssR0FBRztZQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7YUFDdEMsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDaEQsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNWLFNBQVM7UUFDYixDQUFDO2FBQU0sSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbEQsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O1lBRWpELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3RCxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNMLENBQUM7SUFDRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRixNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUMvQixNQUFNLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7SUFDL0MsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVNLFNBQVMsT0FBTyxDQUFDLE1BQWMsRUFBRSxVQUFtQixFQUFFLGtCQUE0QjtJQUNyRixPQUFPLFlBQVksQ0FBQyxJQUFJLDJDQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDNUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDblNNLE1BQU0sTUFBTTtJQU1mLFlBQVksTUFBYztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsUUFBa0I7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTTtRQUNGLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELE9BQU87UUFDSCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUN6QixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNwQixDQUFDOztZQUNHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNsQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUMzQ00sTUFBTSxPQUFPLEdBQVk7SUFDNUIsUUFBUSxFQUFFLEtBQUs7SUFDZixNQUFNLEVBQUUseUJBQXlCO0lBQ2pDLFFBQVEsRUFBRSw2QkFBNkI7SUFDdkMsTUFBTSxFQUFFLGdCQUFnQjtJQUN4QixLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsZ0JBQWdCO1FBQ3pCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsT0FBTyxFQUFFLGVBQWU7UUFDeEIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsZUFBZTtRQUN4QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELEtBQUssRUFBRTtRQUNILE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsUUFBUSxFQUFFO1FBQ04sT0FBTyxFQUFFLGVBQWU7UUFDeEIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsZUFBZTtRQUN4QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELElBQUksRUFBRTtRQUNGLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFLGVBQWU7UUFDeEIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsZ0JBQWdCO1FBQ3pCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFLGdCQUFnQjtRQUN6QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELElBQUksRUFBRTtRQUNGLE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsZUFBZTtRQUN4QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELEtBQUssRUFBRSxTQUFTO0lBQ2hCLFNBQVMsRUFBRSxzQkFBc0I7SUFDakMsTUFBTSxFQUFFLHNCQUFzQjtJQUM5QixpQkFBaUIsRUFBRSxhQUFhO0lBQ2hDLE1BQU0sRUFBRTtRQUNKLE9BQU8sRUFBRSxrSEFBa0g7UUFDM0gsa0JBQWtCLEVBQUUsSUFBSTtLQUMzQjtJQUNELFFBQVEsRUFBRSxnQkFBZ0I7SUFDMUIsV0FBVyxFQUFFLHNCQUFzQjtJQUNuQyxJQUFJLEVBQUUsMkJBQTJCO0lBQ2pDLE1BQU0sRUFBRSxnQkFBZ0I7SUFDeEIsT0FBTyxFQUFFLHVCQUF1QjtJQUNoQyxVQUFVLEVBQUUscUNBQXFDO0lBQ2pELFFBQVEsRUFBRSxZQUFZO0lBQ3RCLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLE9BQU8sRUFBRSxjQUFjO0lBQ3ZCLFdBQVcsRUFBRSx1REFBdUQ7SUFDcEUsTUFBTSxFQUFFLGtCQUFrQjtJQUMxQixLQUFLLEVBQUUsWUFBWTtJQUNuQixTQUFTLEVBQUUsWUFBWTtJQUN2QixLQUFLLEVBQUUsWUFBWTtJQUNuQixNQUFNLEVBQUUsc0JBQXNCO0NBQ2pDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RWdDO0FBRWxDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRW5CLE1BQU0sUUFBUSxHQUErQixFQUFFLENBQUM7QUFFaEQsU0FBUyxXQUFXLENBQUMsT0FBZ0I7SUFDakMsTUFBTSxHQUFHLEdBQUcsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDO0lBQ2xDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDeEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsTUFBYztJQUM5QixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRU0sTUFBTSxNQUFNLEdBQUcsSUFBSSwyQ0FBUyxDQUFDO0lBQ2hDLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNwQyxRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Q0FDdkMsRUFBRTtJQUNDLFNBQVMsQ0FBQyxDQUFFLEtBQUssQ0FBRTtRQUNmLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxVQUFVLENBQUMsQ0FBRSxPQUFPLENBQUU7UUFDbEIsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBRSxRQUFRLENBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQy9CLE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxVQUFVLENBQUMsQ0FBRSxNQUFNLEVBQUUsS0FBSyxDQUFFOztRQUN4QixnQkFBVSxDQUFDLE1BQU0sQ0FBQywwQ0FBRSxXQUFXLENBQUMsZ0JBQVUsQ0FBQyxLQUFLLENBQUMsbUNBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxVQUFVLENBQUMsQ0FBRSxPQUFPLENBQUU7UUFDbEIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxhQUFhLENBQUMsQ0FBRSxPQUFPLEVBQUUsU0FBUyxDQUFFO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxJQUFJLEdBQUcsWUFBWSxXQUFXO1lBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELGdCQUFnQixDQUFDLENBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBRTtRQUNuQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsSUFBSSxHQUFHLFlBQVksV0FBVztZQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxDQUFFLE9BQU8sRUFBRSxTQUFTLENBQUU7UUFDbkMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUksR0FBRyxZQUFZLFdBQVc7WUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRSxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsWUFBWSxDQUFDLENBQUUsT0FBTyxFQUFFLElBQUksQ0FBRTtRQUMxQixNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsSUFBSSxHQUFHLFlBQVksV0FBVztZQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxZQUFZLENBQUMsQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFFO1FBQzFCLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxJQUFJLEdBQUcsWUFBWSxXQUFXO1lBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDckQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFlBQVksQ0FBQyxDQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFFOztRQUNqQyxnQkFBVSxDQUFDLE9BQU8sQ0FBQywwQ0FBRSxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxZQUFZLENBQUMsQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFFOztRQUMxQixPQUFPLGdCQUFVLENBQUMsT0FBTyxDQUFDLDBDQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUU7UUFDNUIsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUksR0FBRyxZQUFZLFdBQVc7WUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkUsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFNBQVMsQ0FBQyxDQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFFLEVBQUUsS0FBSztRQUN6QyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbEYrQjtBQUVsQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVoQixNQUFNLEtBQUssR0FBa0MsRUFBRSxDQUFDO0FBRXpDLE1BQU0sS0FBSyxHQUFHLElBQUksMkNBQVMsQ0FBQyxFQUFFLEVBQUU7SUFDbkMsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUU7UUFDdEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQzlCLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFFLEVBQUUsS0FBSzs7UUFDdkIsT0FBTyxpQkFBSyxDQUFDLEVBQUUsQ0FBQyxzREFBRyxJQUFJLEVBQUUsS0FBSyxDQUFDLG1DQUFJLFNBQVMsQ0FBQztJQUNqRCxDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEIrQjtBQUVsQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVsQixNQUFNLE9BQU8sR0FBMkIsRUFBRSxDQUFDO0FBRTNDLFNBQVMsVUFBVSxDQUFDLE1BQVc7SUFDM0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDdEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsTUFBYztJQUM3QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsS0FBYTtJQUN2QixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsSUFBSSxLQUFLLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksS0FBSyxLQUFLLE9BQU87UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNwQyxJQUFJLEtBQUssS0FBSyxNQUFNO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDbkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFBRSxPQUFPLE1BQU0sQ0FBQztJQUN6QyxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsS0FBVTtJQUNwQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLFlBQVksTUFBTTtRQUNwRCxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxZQUFZLE9BQU87UUFDdEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDL0MsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDM0QsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVNLE1BQU0sS0FBSyxHQUFHLElBQUksMkNBQVMsQ0FBQztJQUMvQixTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQztDQUNoQyxFQUFFO0lBQ0MsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFFO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFFLE1BQU0sRUFBRSxRQUFRLENBQUU7O1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLGVBQVMsQ0FBQyxNQUFNLENBQUMsMENBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLElBQUksSUFBSTtZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBRTtRQUM5QixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsSUFBSSxNQUFNLElBQUksSUFBSTtZQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBRTtRQUN0QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLElBQUksSUFBSTtZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFFOztRQUN2QixNQUFNLEtBQUssR0FBRyxlQUFTLENBQUMsTUFBTSxDQUFDLDBDQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsY0FBYyxDQUFDLENBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBRTs7UUFDdEMsTUFBTSxLQUFLLEdBQUcscUJBQVMsQ0FBQyxNQUFNLENBQUMsMENBQUcsTUFBTSxDQUFDLG1EQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEVJLE1BQU0sY0FBYztJQUd2QixZQUFZLE9BQW1CO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxHQUFHLENBQUMsV0FBd0IsRUFBRSxTQUFvQyxFQUFFLFNBQXdDO1FBQ3hHLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNKO0FBRU0sTUFBTSxTQUFTO0lBSWxCLFlBQVksU0FBb0MsRUFBRSxTQUF3QztRQUN0RixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBRUQsR0FBRyxDQUFDLFNBQW9DLEVBQUUsU0FBd0M7UUFDOUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QmlDO0FBRWxDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRWYsTUFBTSxJQUFJLEdBQThCLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE1BQU0sR0FBRyxJQUFJLDJDQUFTLENBQUMsRUFBRSxFQUFFO0lBQ3BDLEdBQUcsQ0FBQyxDQUFFLFlBQVksQ0FBRTtRQUNoQixNQUFNLEdBQUcsR0FBRyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksYUFBWixZQUFZLGNBQVosWUFBWSxHQUFJLFNBQVMsQ0FBQztRQUN0QyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBRSxHQUFHLEVBQUUsS0FBSyxDQUFFO1FBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEIsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELE9BQU8sQ0FBQyxDQUFFLEdBQUcsQ0FBRTs7UUFDWCxPQUFPLFVBQUksQ0FBQyxHQUFHLENBQUMsbUNBQUksU0FBUyxDQUFDO0lBQ2xDLENBQUM7Q0FDSixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjhEO0FBQ3RCO0FBQ1I7QUFDRjtBQUNBO0FBQ0U7QUFDQztBQVE3QixNQUFNLFdBQVc7SUFLcEIsWUFBWSxlQUFpQyxFQUFFO1FBRjVCLFNBQUksR0FBc0MsRUFBRSxDQUFDO1FBRzVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSwyQ0FBTSxDQUFDLGdEQUFPLENBQUMsNkNBQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFUyxZQUFZLENBQUMsT0FBbUI7UUFDdEMsTUFBTSxTQUFTLEdBQThCLEVBQUUsQ0FBQztRQUNoRCxNQUFNLFNBQVMsR0FBa0MsRUFBRSxDQUFDO1FBQ3BELEtBQUssTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7WUFDeEIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDcEMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUk7Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7Z0JBRW5FLFFBQVEsSUFBSSxFQUFFLENBQUM7b0JBQ1gsS0FBSyxJQUFJO3dCQUNMLDBDQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDaEMsTUFBTTtvQkFDVixLQUFLLEtBQUs7d0JBQ04sNENBQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUNqQyxNQUFNO29CQUNWLEtBQUssS0FBSzt3QkFDTiw0Q0FBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQ2pDLE1BQU07b0JBQ1YsS0FBSyxJQUFJO3dCQUNMLDBDQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDaEMsTUFBTTtnQkFDZCxDQUFDO1FBQ1QsQ0FBQztRQUNELE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVTLFdBQVcsQ0FBQyxHQUFXO1FBQzdCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVTLFFBQVEsQ0FBQyxJQUFnQixFQUFFLFNBQW9DLEVBQUUsU0FBd0M7O1FBQy9HLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNO1lBQ3BCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLEtBQUssaUJBQWlCO2dCQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDM0QsS0FBSyxNQUFNO2dCQUNQLE9BQU8sZUFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUNBQUksU0FBUyxDQUFDO1lBQzlDLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxNQUFNO2dCQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN0QixLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDekQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDMUQsQ0FBQztZQUNELEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO1lBQzFELENBQUM7WUFDRCxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDekQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELE9B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LEtBQUs7b0JBQUUsT0FBTyxTQUFTLENBQUM7Z0JBQzNELE1BQU0sT0FBTyxHQUFHLHdEQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDMUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzNFLE9BQU8sT0FBTyxDQUFDO1lBQ25CO2dCQUNJLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDTCxDQUFDO0NBQ0o7Ozs7Ozs7VUM3RkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ044QztBQUU5QyxJQUFJLHVEQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3BhcnNlci9jaGFyLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3BhcnNlci9pbmRleC50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9wYXJzZXIvcGF0dGVybi50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9wYXJzZXIvc3RyZWFtLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2dyYW1tYXIudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL2RvbS50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9saWIvZm4udHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL2pzLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9saWIudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL3JlZi50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9zaWdtYXNjcmlwdC50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdHgvc2lnbWFzY3JpcHR4LnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NpZ21hc2NyaXB0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NpZ21hc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHR4L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBuYW1lc3BhY2UgQ2hhciB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKGNoOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gY2ggPT09IFwiIFwiIHx8IGNoID09PSBcIlxcblwiIHx8IGNoID09PSBcIlxcclwiO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0RpZ2l0KGNoOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIWNoKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGNoLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgcmV0dXJuIGNvZGUgPj0gNDggJiYgY29kZSA8PSA1NztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaXNMZXR0ZXIoY2g6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghY2gpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBjb25zdCBjb2RlID0gY2gudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBjb2RlID49IDk3ICYmIGNvZGUgPD0gMTIyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTWF0Y2gsIFBhdHRlcm4sIHBhdHRlcm4gfSBmcm9tIFwiLi9wYXR0ZXJuXCI7XHJcbmltcG9ydCB7IExvY2F0aW9uLCBTdHJlYW0gfSBmcm9tIFwiLi9zdHJlYW1cIjtcclxuXHJcbnR5cGUgRGVmaW5pdGlvbiA9IHtcclxuICAgIHByZWNlZGVuY2U/OiBudW1iZXIsXHJcbiAgICBwcmVzZXJ2ZVByZWNlZGVuY2U/OiBib29sZWFuLFxyXG4gICAgcGF0dGVybjogc3RyaW5nXHJcbn0gfCBzdHJpbmc7XHJcblxyXG5leHBvcnQgdHlwZSBHcmFtbWFyID0ge1xyXG4gICAgW2tleTogc3RyaW5nXTogRGVmaW5pdGlvbixcclxuICAgIHJvb3Q6IERlZmluaXRpb25cclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBU1RFbGVtZW50IHtcclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IHN0YXJ0OiBMb2NhdGlvbjtcclxuICAgIHJlYWRvbmx5IGVuZDogTG9jYXRpb247XHJcbiAgICByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2hpbGRyZW46IEFTVEVsZW1lbnRbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHN0YXJ0OiBMb2NhdGlvbiwgZW5kOiBMb2NhdGlvbiwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZpcnN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsYXN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmF0KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICB5aWVsZCBjaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZDogQVNURWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGluZGV4OiBudW1iZXIpOiBBU1RFbGVtZW50IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRDaGlsZHJlbihuYW1lOiBzdHJpbmcpOiBBU1RFbGVtZW50W10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLm5hbWUgPT09IG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRDaGlsZChuYW1lOiBzdHJpbmcpOiBBU1RFbGVtZW50IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmluZCgoY2hpbGQpID0+IGNoaWxkLm5hbWUgPT09IG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmQobmFtZTogc3RyaW5nKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5maW5kQ2hpbGQobmFtZSk7XHJcbiAgICAgICAgaWYgKGNoaWxkKSByZXR1cm4gY2hpbGQ7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjaGlsZC5maW5kKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoZGVzY2VuZGFudCkgcmV0dXJuIGRlc2NlbmRhbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybnM6IE1hcDxzdHJpbmcsIFBhdHRlcm4+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdyYW1tYXI6IEdyYW1tYXIpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhncmFtbWFyKSlcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXR0ZXJucy5zZXQobmFtZSwgcGF0dGVybihkZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMucGF0dGVybnMuc2V0KG5hbWUsIHBhdHRlcm4oZGVmaW5pdGlvbi5wYXR0ZXJuLCBkZWZpbml0aW9uLnByZWNlZGVuY2UsIGRlZmluaXRpb24ucHJlc2VydmVQcmVjZWRlbmNlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UoYnVmZmVyOiBzdHJpbmcpOiBBU1RFbGVtZW50IHwgbnVsbCB7XHJcbiAgICAgICAgZnVuY3Rpb24gdmlzaXQoY3VycmVudDogTWF0Y2gsIHBhcmVudDogQVNURWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQYXJlbnQgPSBuZXcgQVNURWxlbWVudChjdXJyZW50Lm5hbWUsIGN1cnJlbnQuc3RhcnQsIGN1cnJlbnQuZW5kLCBidWZmZXIuc2xpY2UoY3VycmVudC5zdGFydC5vZmZzZXQsIGN1cnJlbnQuZW5kLm9mZnNldCkpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKG5ld1BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBuZXdQYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGN1cnJlbnQuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaXQoY2hpbGQsIHBhcmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMucGF0dGVybnMuZ2V0KFwicm9vdFwiKS5tYXRjaChuZXcgU3RyZWFtKGJ1ZmZlciksIHRoaXMucGF0dGVybnMpO1xyXG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcclxuICAgICAgICBjb25zdCByb290ID0gbmV3IEFTVEVsZW1lbnQoXCJyb290XCIsIG1hdGNoLnN0YXJ0LCBtYXRjaC5lbmQsIGJ1ZmZlci5zbGljZShtYXRjaC5zdGFydC5vZmZzZXQsIG1hdGNoLmVuZC5vZmZzZXQpKTtcclxuICAgICAgICB2aXNpdChtYXRjaCwgcm9vdCk7XHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlUGF0dGVybnMoYTogc3RyaW5nLCBiOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBiLnJlcGxhY2UoL1xcLlxcLlxcLi9nLCBhKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2UoYTogRGVmaW5pdGlvbiwgYjogRGVmaW5pdGlvbik6IERlZmluaXRpb24ge1xyXG4gICAgaWYgKCFhKSByZXR1cm4gYjtcclxuICAgIGlmICghYikgcmV0dXJuIGE7XHJcbiAgICBpZiAodHlwZW9mIGEgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGIgPT09IFwic3RyaW5nXCIpIHJldHVybiBtZXJnZVBhdHRlcm5zKGEsIGIpO1xyXG4gICAgaWYgKHR5cGVvZiBhID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiBiICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyAuLi5iLCBwYXR0ZXJuOiBtZXJnZVBhdHRlcm5zKGEsIGIucGF0dGVybikgfTtcclxuICAgIGlmICh0eXBlb2YgYSAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgYiA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHsgLi4uYSwgcGF0dGVybjogbWVyZ2VQYXR0ZXJucyhhLnBhdHRlcm4sIGIpIH07XHJcbiAgICBpZiAodHlwZW9mIGEgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGIgIT09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGF0dGVybjogbWVyZ2VQYXR0ZXJucyhhLnBhdHRlcm4sIGIucGF0dGVybiksXHJcbiAgICAgICAgICAgIHByZWNlZGVuY2U6IGIucHJlY2VkZW5jZSA/PyBhLnByZWNlZGVuY2UsXHJcbiAgICAgICAgICAgIHByZXNlcnZlUHJlY2VkZW5jZTogYi5wcmVzZXJ2ZVByZWNlZGVuY2UgPz8gYS5wcmVzZXJ2ZVByZWNlZGVuY2VcclxuICAgICAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQ6IEdyYW1tYXIsIGdyYW1tYXI6IFBhcnRpYWw8R3JhbW1hcj4pOiBHcmFtbWFyIHtcclxuICAgIGNvbnN0IHJlc3VsdDogR3JhbW1hciA9IHsgcm9vdDogbWVyZ2UocGFyZW50LnJvb3QsIGdyYW1tYXIucm9vdCkgfTtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBwYXJlbnQpXHJcbiAgICAgICAgaWYgKCEobmFtZSBpbiByZXN1bHQpKSByZXN1bHRbbmFtZV0gPSBtZXJnZShwYXJlbnRbbmFtZV0sIGdyYW1tYXJbbmFtZV0pO1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIGdyYW1tYXIpXHJcbiAgICAgICAgaWYgKCEobmFtZSBpbiByZXN1bHQpKSByZXN1bHRbbmFtZV0gPSBtZXJnZShwYXJlbnRbbmFtZV0sIGdyYW1tYXJbbmFtZV0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufSIsImltcG9ydCB7IENoYXIgfSBmcm9tIFwiLi9jaGFyXCI7XHJcbmltcG9ydCB7IExvY2F0aW9uLCBTdHJlYW0gfSBmcm9tIFwiLi9zdHJlYW1cIjtcclxuXHJcbmV4cG9ydCB0eXBlIENoYXJhY3Rlckdyb3VwID0gKHN0cmluZyB8IFtzdHJpbmcsIHN0cmluZ10pW107XHJcblxyXG5leHBvcnQgdHlwZSBNYXRjaCA9IHtcclxuICAgIG5hbWU/OiBzdHJpbmcsXHJcbiAgICBzdGFydDogTG9jYXRpb24sXHJcbiAgICBlbmQ6IExvY2F0aW9uLFxyXG4gICAgY2hpbGRyZW4/OiBNYXRjaFtdXHJcbn07XHJcblxyXG5jbGFzcyBTdGFjayB7XHJcbiAgICBwcml2YXRlIGVsZW1lbnRzOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZ1tdIH07XHJcbiAgICBcclxuICAgIHJlYWRvbmx5IGxhc3Q/OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudHM6IHsgW2tleTogbnVtYmVyXTogc3RyaW5nW10gfSA9IHt9LCBsYXN0Pzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xyXG4gICAgICAgIHRoaXMubGFzdCA9IGxhc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgd2l0aChvZmZzZXQ6IG51bWJlciwgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSB7IC4uLnRoaXMuZWxlbWVudHMgfTtcclxuICAgICAgICBlbGVtZW50c1tvZmZzZXRdID0gZWxlbWVudHNbb2Zmc2V0XSA/IFsuLi5lbGVtZW50c1tvZmZzZXRdLCBuYW1lXSA6IFtuYW1lXTtcclxuICAgICAgICByZXR1cm4gbmV3IFN0YWNrKGVsZW1lbnRzLCBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXMob2Zmc2V0OiBudW1iZXIsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW29mZnNldF0/LmluY2x1ZGVzKG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGF0dGVybiB7XHJcbiAgICBwcmVjZWRlbmNlPzogbnVtYmVyO1xyXG4gICAgcHJlc2VydmVQcmVjZWRlbmNlOiBib29sZWFuO1xyXG5cclxuICAgIGFic3RyYWN0IG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U/OiBudW1iZXIsIHN0YWNrPzogU3RhY2ssIGNhY2hlPzogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9KTogTWF0Y2ggfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmF3UGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjaDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuY2ggPSBjaDtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGlmIChzdHJlYW0ucGVla2NoKCkgIT09IHRoaXMuY2gpIHJldHVybjtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3JQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGE6IFBhdHRlcm47XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGI6IFBhdHRlcm47XHJcblxyXG4gICAgY29uc3RydWN0b3IoYTogUGF0dGVybiwgYjogUGF0dGVybikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgY29uc3QgbWF0Y2hBID0gISh0aGlzLmEgaW5zdGFuY2VvZiBOYW1lZFBhdHRlcm4gJiYgc3RhY2suaGFzKHN0YXJ0Lm9mZnNldCwgdGhpcy5hLm5hbWUpKSAmJiB0aGlzLmEubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICBjb25zdCBlbmRBID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIHN0cmVhbS5sb2NhdGlvbiA9IHN0YXJ0O1xyXG4gICAgICAgIGNvbnN0IG1hdGNoQiA9ICEodGhpcy5iIGluc3RhbmNlb2YgTmFtZWRQYXR0ZXJuICYmIHN0YWNrLmhhcyhzdGFydC5vZmZzZXQsIHRoaXMuYi5uYW1lKSkgJiYgdGhpcy5iLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgY29uc3QgZW5kQiA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBsZXQgbWF0Y2ggPSAoIW1hdGNoQSAmJiBtYXRjaEIpIHx8ICghbWF0Y2hCICYmIG1hdGNoQSk7XHJcbiAgICAgICAgaWYgKG1hdGNoQSAmJiBtYXRjaEIpXHJcbiAgICAgICAgICAgIG1hdGNoID0gZW5kQS5vZmZzZXQgPiBlbmRCLm9mZnNldCA/IG1hdGNoQSA6IG1hdGNoQjtcclxuICAgICAgICBpZiAobWF0Y2ggPT09IG1hdGNoQSlcclxuICAgICAgICAgICAgc3RyZWFtLmxvY2F0aW9uID0gZW5kQTtcclxuICAgICAgICBpZiAobWF0Y2gpIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiwgY2hpbGRyZW46IFttYXRjaF0gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdoaXRlc3BhY2VQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIHdoaWxlIChDaGFyLmlzV2hpdGVzcGFjZShzdHJlYW0ucGVla2NoKCkpKSBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQW55UGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBpZiAoIXN0cmVhbS5wZWVrY2goKSkgcmV0dXJuO1xyXG4gICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEaWdpdFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgaWYgKCFDaGFyLmlzRGlnaXQoc3RyZWFtLnBlZWtjaCgpKSkgcmV0dXJuO1xyXG4gICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjogUGF0dGVybjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBQYXR0ZXJuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnBhdHRlcm4ubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICBpZiAoIW1hdGNoKSBzdHJlYW0ubG9jYXRpb24gPSBzdGFydDtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24sIGNoaWxkcmVuOiBtYXRjaCA/IFttYXRjaF0gOiBbXSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVwZWF0UGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuOiBQYXR0ZXJuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdHRlcm46IFBhdHRlcm4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0sIHJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiwgcHJlY2VkZW5jZTogbnVtYmVyID0gMSwgc3RhY2s6IFN0YWNrID0gbmV3IFN0YWNrKCksIGNhY2hlOiB7IFtrZXk6IHN0cmluZ106IE1hdGNoIH0gPSB7fSk6IE1hdGNoIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgbGV0IG1hdGNoID0gdGhpcy5wYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbbWF0Y2hdO1xyXG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcclxuICAgICAgICBsZXQgbGFzdCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLnBhdHRlcm4ubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKSkge1xyXG4gICAgICAgICAgICBpZiAobGFzdC5vZmZzZXQgPT09IHN0cmVhbS5vZmZzZXQpIGJyZWFrO1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG1hdGNoKTtcclxuICAgICAgICAgICAgbGFzdCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RyZWFtLmxvY2F0aW9uID0gbGFzdDtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24sIGNoaWxkcmVuIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJHcm91cFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ3JvdXA6IENoYXJhY3Rlckdyb3VwO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBkaXNhbGxvdzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihncm91cDogQ2hhcmFjdGVyR3JvdXAsIGRpc2FsbG93OiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XHJcbiAgICAgICAgdGhpcy5kaXNhbGxvdyA9IGRpc2FsbG93O1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgY29uc3QgY2ggPSBzdHJlYW0ucGVla2NoKCk7XHJcbiAgICAgICAgaWYgKCFjaCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBjaC5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBleHBlY3RlZCBvZiB0aGlzLmdyb3VwKVxyXG4gICAgICAgICAgICBpZiAoKEFycmF5LmlzQXJyYXkoZXhwZWN0ZWQpICYmIGNvZGUgPj0gZXhwZWN0ZWRbMF0uY2hhckNvZGVBdCgwKSAmJiBjb2RlIDw9IGV4cGVjdGVkWzFdLmNoYXJDb2RlQXQoMCkpIHx8IGNoID09PSBleHBlY3RlZClcclxuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5kaXNhbGxvdyAmJiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpc2FsbG93ICYmIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcm91cFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2hpbGRyZW46IFBhdHRlcm5bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjogUGF0dGVybltdKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0sIHJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiwgcHJlY2VkZW5jZTogbnVtYmVyID0gMSwgc3RhY2s6IFN0YWNrID0gbmV3IFN0YWNrKCksIGNhY2hlOiB7IFtrZXk6IHN0cmluZ106IE1hdGNoIH0gPSB7fSk6IE1hdGNoIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBjaGlsZC5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobWF0Y2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24sIGNoaWxkcmVuIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYW1lZFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0sIHJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiwgcHJlY2VkZW5jZTogbnVtYmVyID0gMSwgc3RhY2s6IFN0YWNrID0gbmV3IFN0YWNrKCksIGNhY2hlOiB7IFtrZXk6IHN0cmluZ106IE1hdGNoIH0gPSB7fSk6IE1hdGNoIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7cHJlY2VkZW5jZX0sJHtzdGFjay5sYXN0fSwke3N0cmVhbS5vZmZzZXR9LCR7dGhpcy5uYW1lfWA7XHJcbiAgICAgICAgY29uc3QgY2FjaGVkID0gY2FjaGVba2V5XTtcclxuICAgICAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZCkgc3RyZWFtLmxvY2F0aW9uID0gY2FjaGVkLmVuZDtcclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgc3RhY2sgPSBzdGFjay53aXRoKHN0YXJ0Lm9mZnNldCwgdGhpcy5uYW1lKTtcclxuICAgICAgICBjb25zdCBwYXR0ZXJuID0gcmVnaXN0cnkuZ2V0KHRoaXMubmFtZSk7XHJcbiAgICAgICAgaWYgKCFwYXR0ZXJuIHx8IChwYXR0ZXJuLnByZWNlZGVuY2UgJiYgcGF0dGVybi5wcmVjZWRlbmNlIDwgcHJlY2VkZW5jZSkpIHJldHVybiBjYWNoZVtrZXldID0gbnVsbDtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IHBhdHRlcm4ubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcGF0dGVybi5wcmVjZWRlbmNlIHx8IHBhdHRlcm4ucHJlc2VydmVQcmVjZWRlbmNlID8gcGF0dGVybi5wcmVjZWRlbmNlID8/IHByZWNlZGVuY2UgOiAxLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybiBjYWNoZVtrZXldID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gY2FjaGVba2V5XSA9IHsgbmFtZTogdGhpcy5uYW1lLCBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24sIGNoaWxkcmVuOiBbbWF0Y2hdIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3BlY2lhbENoYXJhY3RlcihjaDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gY2ggPT09IFwiJVwiIHx8IGNoID09PSBcInxcIiB8fCBjaCA9PT0gXCIoXCIgfHwgY2ggPT09IFwiKVwiIHx8IGNoID09PSBcIitcIiB8fCBjaCA9PT0gXCI/XCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlUGF0dGVybihzdHJlYW06IFN0cmVhbSwgcHJlY2VkZW5jZT86IG51bWJlciwgcHJlc2VydmVQcmVjZWRlbmNlOiBib29sZWFuID0gZmFsc2UpOiBQYXR0ZXJuIHtcclxuICAgIGNvbnN0IGNoaWxkcmVuOiBQYXR0ZXJuW10gPSBbXTtcclxuICAgIGxldCBvciA9IGZhbHNlO1xyXG4gICAgbGV0IGNoO1xyXG4gICAgd2hpbGUgKGNoID0gc3RyZWFtLnBlZWtjaCgpKSB7XHJcbiAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICBpZiAoY2ggPT09IFwiJVwiKSB7XHJcbiAgICAgICAgICAgIGNoID0gc3RyZWFtLnBlZWtjaCgpO1xyXG4gICAgICAgICAgICBpZiAoaXNTcGVjaWFsQ2hhcmFjdGVyKGNoKSkge1xyXG4gICAgICAgICAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IFJhd1BhdHRlcm4oY2gpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChDaGFyLmlzTGV0dGVyKGNoID0gc3RyZWFtLnBlZWtjaCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSBjaDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImRcIilcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBEaWdpdFBhdHRlcm4oKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgTmFtZWRQYXR0ZXJuKG5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiKFwiKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHBhcnNlUGF0dGVybihzdHJlYW0sIHByZWNlZGVuY2UpKTtcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCIpXCIpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoID09PSBcIltcIikge1xyXG4gICAgICAgICAgICBjb25zdCBkaXNhbGxvdyA9IHN0cmVhbS5wZWVrY2goKSA9PT0gXCJeXCI7XHJcbiAgICAgICAgICAgIGlmIChkaXNhbGxvdykgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICAgICAgY29uc3QgZ3JvdXA6IENoYXJhY3Rlckdyb3VwID0gW107XHJcbiAgICAgICAgICAgIGxldCByYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoY2ggPSBzdHJlYW0ucGVla2NoKCkpIHtcclxuICAgICAgICAgICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBncm91cC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09IFwiJVwiICYmIHN0cmVhbS5wZWVrY2goKSA9PT0gXCJdXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJdXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCItXCIgJiYgIXJhbmdlICYmIGxlbiA+IDAgJiYgIUFycmF5LmlzQXJyYXkoZ3JvdXAuYXQoLTEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goY2gpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0ID0gZ3JvdXAucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAucHVzaChbZ3JvdXAucG9wKCksIGxhc3RdIGFzIFtzdHJpbmcsIHN0cmluZ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IENoYXJhY3Rlckdyb3VwUGF0dGVybihncm91cCwgZGlzYWxsb3cpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIi5cIilcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgQW55UGF0dGVybigpKTtcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCIgXCIpXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IFdoaXRlc3BhY2VQYXR0ZXJuKCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoID09PSBcInxcIiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwICYmICFvcikge1xyXG4gICAgICAgICAgICBvciA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiP1wiICYmIGNoaWxkcmVuLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IE9wdGlvbmFsUGF0dGVybihjaGlsZHJlbi5wb3AoKSkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoID09PSBcIitcIiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBSZXBlYXRQYXR0ZXJuKGNoaWxkcmVuLnBvcCgpKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBSYXdQYXR0ZXJuKGNoKSk7XHJcbiAgICAgICAgaWYgKG9yKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IE9yUGF0dGVybihjaGlsZHJlbi5wb3AoKSwgY2hpbGRyZW4ucG9wKCkpKTtcclxuICAgICAgICAgICAgb3IgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXN1bHQgPSBjaGlsZHJlbi5sZW5ndGggPT09IDEgPyBjaGlsZHJlblswXSA6IG5ldyBHcm91cFBhdHRlcm4oY2hpbGRyZW4pO1xyXG4gICAgcmVzdWx0LnByZWNlZGVuY2UgPSBwcmVjZWRlbmNlO1xyXG4gICAgcmVzdWx0LnByZXNlcnZlUHJlY2VkZW5jZSA9IHByZXNlcnZlUHJlY2VkZW5jZTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXR0ZXJuKHNvdXJjZTogc3RyaW5nLCBwcmVjZWRlbmNlPzogbnVtYmVyLCBwcmVzZXJ2ZVByZWNlZGVuY2U/OiBib29sZWFuKTogUGF0dGVybiB7XHJcbiAgICByZXR1cm4gcGFyc2VQYXR0ZXJuKG5ldyBTdHJlYW0oc291cmNlKSwgcHJlY2VkZW5jZSwgcHJlc2VydmVQcmVjZWRlbmNlKTtcclxufSIsImV4cG9ydCB0eXBlIExvY2F0aW9uID0ge1xyXG4gICAgb2Zmc2V0OiBudW1iZXIsXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2x1bW46IG51bWJlclxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmVhbSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJ1ZmZlcjogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxpbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgY29sdW1uOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYnVmZmVyOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcclxuICAgICAgICB0aGlzLl9vZmZzZXQgPSAwO1xyXG4gICAgICAgIHRoaXMubGluZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2x1bW4gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2NhdGlvbigpOiBMb2NhdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHsgb2Zmc2V0OiB0aGlzLl9vZmZzZXQsIGxpbmU6IHRoaXMubGluZSwgY29sdW1uOiB0aGlzLmNvbHVtbiB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsb2NhdGlvbihsb2NhdGlvbjogTG9jYXRpb24pIHtcclxuICAgICAgICB0aGlzLl9vZmZzZXQgPSBsb2NhdGlvbi5vZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5saW5lID0gbG9jYXRpb24ubGluZTtcclxuICAgICAgICB0aGlzLmNvbHVtbiA9IGxvY2F0aW9uLmNvbHVtbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb2Zmc2V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcGVla2NoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlclt0aGlzLl9vZmZzZXRdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGVla2NoKCkgPT09IFwiXFxuXCIpIHtcclxuICAgICAgICAgICAgKyt0aGlzLmxpbmU7XHJcbiAgICAgICAgICAgIHRoaXMuY29sdW1uID0gMDtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgKyt0aGlzLmNvbHVtbjtcclxuICAgICAgICArK3RoaXMuX29mZnNldDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdyYW1tYXIgfSBmcm9tIFwiLi4vcGFyc2VyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ3JhbW1hcjogR3JhbW1hciA9IHtcclxuICAgIFwibnVtYmVyXCI6IFwiJWQrXCIsXHJcbiAgICBcIm5hbWVcIjogXCJbYS16QS1aX11bYS16QS1aMC05X10rP1wiLFxyXG4gICAgXCJzdHJpbmdcIjogXCJcXFwiKFteXFxcIl18KFxcXFxcXFxcKXwoXFxcXFxcXCIpKSs/XFxcIlwiLFxyXG4gICAgXCJib29sXCI6IFwiKHRydWUpfChmYWxzZSlcIixcclxuICAgIFwiYWRkXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICUrICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNVxyXG4gICAgfSxcclxuICAgIFwic3ViXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByIC0gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA1XHJcbiAgICB9LFxyXG4gICAgXCJtdWxcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgKiAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDZcclxuICAgIH0sXHJcbiAgICBcImRpdlwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAvICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNlxyXG4gICAgfSxcclxuICAgIFwiY29uY2F0XCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByIEAgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiAxXHJcbiAgICB9LFxyXG4gICAgXCJlcVwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA9ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNFxyXG4gICAgfSxcclxuICAgIFwibHRcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPCAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcImd0XCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByID4gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJsZVwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA8PSAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcImdlXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByID49ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNFxyXG4gICAgfSxcclxuICAgIFwib3JcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgJXwgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiAyXHJcbiAgICB9LFxyXG4gICAgXCJhbmRcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgJiAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDNcclxuICAgIH0sXHJcbiAgICBcIm5vdFwiOiBcIiEgJWV4cHJcIixcclxuICAgIFwiYXJnbGlzdFwiOiBcIiglZXhwciggLCAlZXhwcikrPyk/XCIsXHJcbiAgICBcImNhbGxcIjogXCIlbmFtZSAlKCAlYXJnbGlzdCAlKVwiLFxyXG4gICAgXCJwYXJlbnRoZXNpc2V4cHJcIjogXCIlKCAlZXhwciAlKVwiLFxyXG4gICAgXCJleHByXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVwYXJlbnRoZXNpc2V4cHJ8JW51bWJlcnwlc3RyaW5nfCVib29sfCVuYW1lfCVhZGR8JXN1YnwlbXVsfCVkaXZ8JWNvbmNhdHwlZXF8JWx0fCVndHwlbGV8JWdlfCVvcnwlYW5kfCVub3R8JWNhbGxcIixcclxuICAgICAgICBwcmVzZXJ2ZVByZWNlZGVuY2U6IHRydWVcclxuICAgIH0sXHJcbiAgICBcImFzc2lnblwiOiBcIiVuYW1lID0gJWV4cHI7XCIsXHJcbiAgICBcInBhcmFtbGlzdFwiOiBcIiglbmFtZSggLCAlbmFtZSkrPyk/XCIsXHJcbiAgICBcImlmXCI6IFwiaWYgJWV4cHIgeyAlYm9keSB9ICVlbHNlP1wiLFxyXG4gICAgXCJlbHNlXCI6IFwiZWxzZSB7ICVib2R5IH1cIixcclxuICAgIFwid2hpbGVcIjogXCJ3aGlsZSAlZXhwciB7ICVib2R5IH1cIixcclxuICAgIFwiZnVuY3Rpb25cIjogXCJmbiAlbmFtZSAlKCAlcGFyYW1saXN0ICUpIHsgJWJvZHkgfVwiLFxyXG4gICAgXCJyZXR1cm5cIjogXCJyZXQgJWV4cHI7XCIsXHJcbiAgICBcImNhbGxzdGF0XCI6IFwiJWNhbGw7XCIsXHJcbiAgICBcInByaW50XCI6IFwicHJpbnQgJWV4cHI7XCIsXHJcbiAgICBcInN0YXRlbWVudFwiOiBcIiVhc3NpZ258JWlmfCV3aGlsZXwlZnVuY3Rpb258JXJldHVybnwlY2FsbHN0YXR8JXByaW50XCIsXHJcbiAgICBcImJvZHlcIjogXCIoICVzdGF0ZW1lbnQgKSs/XCIsXHJcbiAgICBcInVzZVwiOiBcInVzZSAlbmFtZTtcIixcclxuICAgIFwiaW1wb3J0c1wiOiBcIiggJXVzZSApKz9cIixcclxuICAgIFwibGliXCI6IFwibGliICVuYW1lO1wiLFxyXG4gICAgXCJyb290XCI6IFwiJWxpYj8gJWltcG9ydHMgJWJvZHlcIlxyXG59OyIsImltcG9ydCB7IE5hdGl2ZUxpYiB9IGZyb20gXCIuL2xpYlwiO1xyXG5cclxubGV0IGVsZW1lbnRJZCA9IC0xO1xyXG5cclxuY29uc3QgZWxlbWVudHM6IHsgW2tleTogc3RyaW5nXTogRWxlbWVudCB9ID0ge307XHJcblxyXG5mdW5jdGlvbiBzYXZlRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGtleSA9IGAjZG9tOiR7KytlbGVtZW50SWR9YDtcclxuICAgIGVsZW1lbnRzW2tleV0gPSBlbGVtZW50O1xyXG4gICAgcmV0dXJuIGtleTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudChoYW5kbGU6IHN0cmluZyk6IEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRzW2hhbmRsZV07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb21MaWIgPSBuZXcgTmF0aXZlTGliKHtcclxuICAgIGRvbV9oZWFkOiBzYXZlRWxlbWVudChkb2N1bWVudC5oZWFkKSxcclxuICAgIGRvbV9ib2R5OiBzYXZlRWxlbWVudChkb2N1bWVudC5ib2R5KVxyXG59LCB7XHJcbiAgICBkb21fdGl0bGUoWyB0aXRsZSBdKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX2NyZWF0ZShbIHRhZ05hbWUgXSkge1xyXG4gICAgICAgIHJldHVybiBzYXZlRWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpKTtcclxuICAgIH0sXHJcbiAgICBkb21fZmluZChbIHNlbGVjdG9yIF0pIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHNhdmVFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgfSxcclxuICAgIGRvbV9hcHBlbmQoWyBwYXJlbnQsIGNoaWxkIF0pIHtcclxuICAgICAgICBnZXRFbGVtZW50KHBhcmVudCk/LmFwcGVuZENoaWxkKGdldEVsZW1lbnQoY2hpbGQpID8/IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9yZW1vdmUoWyBlbGVtZW50IF0pIHtcclxuICAgICAgICBnZXRFbGVtZW50KGVsZW1lbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICBkb21fYWRkX2NsYXNzKFsgZWxlbWVudCwgY2xhc3NOYW1lIF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX3JlbW92ZV9jbGFzcyhbIGVsZW1lbnQsIGNsYXNzTmFtZSBdKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIGVsbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV90b2dnbGVfY2xhc3MoWyBlbGVtZW50LCBjbGFzc05hbWUgXSkge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IGdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICBkb21fc2V0X3RleHQoWyBlbGVtZW50LCB0ZXh0IF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmlubmVyVGV4dCA9IHRleHQ7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9zZXRfaHRtbChbIGVsZW1lbnQsIGh0bWwgXSkge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IGdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX3NldF9hdHRyKFsgZWxlbWVudCwgYXR0ciwgdmFsdWUgXSkge1xyXG4gICAgICAgIGdldEVsZW1lbnQoZWxlbWVudCk/LnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9nZXRfYXR0cihbIGVsZW1lbnQsIGF0dHIgXSkge1xyXG4gICAgICAgIHJldHVybiBnZXRFbGVtZW50KGVsZW1lbnQpPy5nZXRBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICB9LFxyXG4gICAgZG9tX2NzcyhbIGVsZW1lbnQsIGF0dHIsIHZhbHVlIF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLnN0eWxlLnNldFByb3BlcnR5KGF0dHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX2V2ZW50KFsgZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrIF0sIHNjb3BlKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBmbiA9IHNjb3BlLmZ1bmN0aW9uc1tjYWxsYmFja107XHJcbiAgICAgICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsICgpID0+IGZuKFtdLCBzY29wZSkpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgU1NGdW5jdGlvbiB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBOYXRpdmVMaWIgfSBmcm9tIFwiLi9saWJcIjtcclxuXHJcbmxldCBmdW5jSWQgPSAtMTtcclxuXHJcbmNvbnN0IGZ1bmNzOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfSA9IHt9O1xyXG5cclxuZXhwb3J0IGNvbnN0IGZuTGliID0gbmV3IE5hdGl2ZUxpYih7fSwge1xyXG4gICAgZm4oWyBuYW1lIF0sIHsgZnVuY3Rpb25zIH0pIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBgI2ZuOiR7KytmdW5jSWR9YDtcclxuICAgICAgICBmdW5jc1trZXldID0gZnVuY3Rpb25zW25hbWVdO1xyXG4gICAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9LFxyXG4gICAgY2FsbChbIGZuLCAuLi5hcmdzIF0sIHNjb3BlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmNzW2ZuXT8uKGFyZ3MsIHNjb3BlKSA/PyBcInVua25vd25cIjtcclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgTmF0aXZlTGliIH0gZnJvbSBcIi4vbGliXCI7XHJcblxyXG5sZXQgb2JqZWN0SWQgPSAtMTtcclxuXHJcbmNvbnN0IG9iamVjdHM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcclxuXHJcbmZ1bmN0aW9uIHNhdmVPYmplY3Qob2JqZWN0OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qga2V5ID0gYCNqczokeysrb2JqZWN0SWR9YDtcclxuICAgIG9iamVjdHNba2V5XSA9IG9iamVjdDtcclxuICAgIHJldHVybiBrZXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdChoYW5kbGU6IHN0cmluZyk6IGFueSB7XHJcbiAgICByZXR1cm4gb2JqZWN0c1toYW5kbGVdO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0pTKHZhbHVlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCIjanM6XCIpKSByZXR1cm4gZ2V0T2JqZWN0KHZhbHVlKTtcclxuICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmtub3duXCIpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYgKHZhbHVlID09PSBcInRydWVcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgY29uc3QgbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlKTtcclxuICAgIGlmICghTnVtYmVyLmlzTmFOKG51bWJlcikpIHJldHVybiBudW1iZXI7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvU1ModmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8XHJcbiAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIiB8fCB2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4gfHxcclxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICByZXR1cm4gc2F2ZU9iamVjdCh2YWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBqc0xpYiA9IG5ldyBOYXRpdmVMaWIoe1xyXG4gICAganNfd2luZG93OiBzYXZlT2JqZWN0KHdpbmRvdylcclxufSwge1xyXG4gICAganMoWyBjb2RlIF0pIHtcclxuICAgICAgICByZXR1cm4gdG9TUyhldmFsKGNvZGUpKTtcclxuICAgIH0sXHJcbiAgICBqc19nZXQoWyBoYW5kbGUsIHByb3BlcnR5IF0pIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldE9iamVjdChoYW5kbGUpPy5bcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRvU1ModmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGpzX3NldChbIGhhbmRsZSwgcHJvcGVydHksIHZhbHVlIF0pIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBnZXRPYmplY3QoaGFuZGxlKTtcclxuICAgICAgICBpZiAob2JqZWN0ICE9IG51bGwpIG9iamVjdFtwcm9wZXJ0eV0gPSB0b0pTKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAganNfbmV3KFsgaGFuZGxlLCAuLi5hcmdzIF0pIHtcclxuICAgICAgICBjb25zdCBjdG9yID0gZ2V0T2JqZWN0KGhhbmRsZSk7XHJcbiAgICAgICAgaWYgKGN0b3IgPT0gbnVsbCkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IGN0b3IoLi4uYXJncy5tYXAodG9KUykpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRvU1ModmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGpzX2NhbGwoWyBoYW5kbGUsIC4uLmFyZ3MgXSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0T2JqZWN0KGhhbmRsZSk/LiguLi5hcmdzLm1hcCh0b0pTKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdG9TUyh2YWx1ZSk7XHJcbiAgICB9LFxyXG4gICAganNfY2FsbF9tZXRob2QoWyBoYW5kbGUsIG1ldGhvZCwgLi4uYXJncyBdKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRPYmplY3QoaGFuZGxlKT8uW21ldGhvZF0/LiguLi5hcmdzLm1hcCh0b0pTKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdG9TUyh2YWx1ZSk7XHJcbiAgICB9XHJcbn0pOyIsImltcG9ydCB7IFNTRnVuY3Rpb24sIFNpZ21hU2NyaXB0IH0gZnJvbSBcIi4uL3NpZ21hc2NyaXB0XCI7XHJcbmltcG9ydCB7IEFTVEVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vcGFyc2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2lnbWFTY3JpcHRMaWIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9ncmFtOiBBU1RFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb2dyYW06IEFTVEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnByb2dyYW0gPSBwcm9ncmFtO1xyXG4gICAgfVxyXG5cclxuICAgIHVzZShzaWdtYVNjcmlwdDogU2lnbWFTY3JpcHQsIHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgZnVuY3Rpb25zOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfSkge1xyXG4gICAgICAgIGNvbnN0IHNjb3BlID0gc2lnbWFTY3JpcHQuZXhlY3V0ZSh0aGlzLnByb2dyYW0pO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odmFyaWFibGVzLCBzY29wZS52YXJpYWJsZXMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZnVuY3Rpb25zLCBzY29wZS5mdW5jdGlvbnMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmF0aXZlTGliIHtcclxuICAgIHB1YmxpYyByZWFkb25seSB2YXJpYWJsZXM6IFJlYWRvbmx5PHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0+O1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uczogUmVhZG9ubHk8eyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgZnVuY3Rpb25zOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfSkge1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gdmFyaWFibGVzO1xyXG4gICAgICAgIHRoaXMuZnVuY3Rpb25zID0gZnVuY3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHVzZSh2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGZ1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHZhcmlhYmxlcywgdGhpcy52YXJpYWJsZXMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZnVuY3Rpb25zLCB0aGlzLmZ1bmN0aW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBOYXRpdmVMaWIgfSBmcm9tIFwiLi9saWJcIjtcclxuXHJcbmxldCByZWZJZCA9IC0xO1xyXG5cclxuY29uc3QgcmVmczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlZkxpYiA9IG5ldyBOYXRpdmVMaWIoe30sIHtcclxuICAgIHJlZihbIGluaXRpYWxWYWx1ZSBdKSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gYCNyZWY6JHsrK3JlZklkfWA7XHJcbiAgICAgICAgcmVmc1trZXldID0gaW5pdGlhbFZhbHVlID8/IFwidW5rbm93blwiO1xyXG4gICAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9LFxyXG4gICAgcmVmX3NldChbIHJlZiwgdmFsdWUgXSkge1xyXG4gICAgICAgIHJlZnNbcmVmXSA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICByZWZfZ2V0KFsgcmVmIF0pIHtcclxuICAgICAgICByZXR1cm4gcmVmc1tyZWZdID8/IFwidW5rbm93blwiO1xyXG4gICAgfVxyXG59KTsiLCJpbXBvcnQgeyBBU1RFbGVtZW50LCBHcmFtbWFyLCBQYXJzZXIsIGluaGVyaXQgfSBmcm9tIFwiLi4vcGFyc2VyXCI7XHJcbmltcG9ydCB7IFNpZ21hU2NyaXB0TGliIH0gZnJvbSBcIi4vbGliL2xpYlwiO1xyXG5pbXBvcnQgeyBkb21MaWIgfSBmcm9tIFwiLi9saWIvZG9tXCI7XHJcbmltcG9ydCB7IGZuTGliIH0gZnJvbSBcIi4vbGliL2ZuXCI7XHJcbmltcG9ydCB7IGpzTGliIH0gZnJvbSBcIi4vbGliL2pzXCI7XHJcbmltcG9ydCB7IHJlZkxpYiB9IGZyb20gXCIuL2xpYi9yZWZcIjtcclxuaW1wb3J0IHsgZ3JhbW1hciB9IGZyb20gXCIuL2dyYW1tYXJcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFNjb3BlID0ge1xyXG4gICAgdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LFxyXG4gICAgZnVuY3Rpb25zOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfVxyXG59O1xyXG5leHBvcnQgdHlwZSBTU0Z1bmN0aW9uID0gKGFyZ3M6IHN0cmluZ1tdLCBzY29wZTogU2NvcGUpID0+IHN0cmluZztcclxuXHJcbmV4cG9ydCBjbGFzcyBTaWdtYVNjcmlwdCB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhcnNlcjogUGFyc2VyO1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBsaWJzOiB7IFtrZXk6IHN0cmluZ106IFNpZ21hU2NyaXB0TGliIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXJnZUdyYW1tYXI6IFBhcnRpYWw8R3JhbW1hcj4gPSB7fSkge1xyXG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcihpbmhlcml0KGdyYW1tYXIsIG1lcmdlR3JhbW1hcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwYXJzZUltcG9ydHMoaW1wb3J0czogQVNURWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0gPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IHVzZSBvZiBpbXBvcnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB1c2UuZmluZChcIm5hbWVcIikudmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lIGluIHRoaXMubGlicykgdGhpcy5saWJzW25hbWVdLnVzZSh0aGlzLCB2YXJpYWJsZXMsIGZ1bmN0aW9ucyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJqc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc0xpYi51c2UodmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZG9tXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbUxpYi51c2UodmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmVmXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZkxpYi51c2UodmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZm5cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5MaWIudXNlKHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IHZhcmlhYmxlcywgZnVuY3Rpb25zIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBhcnNlU3RyaW5nKHJhdzogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHJhdy5zbGljZSgxLCAtMSkucmVwbGFjZSgvXFxcXFxcXCIvZywgXCJcXFwiXCIpLnJlcGxhY2UoL1xcXFxcXFxcL2csIFwiXFxcXFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZXZhbEV4cHIoZXhwcjogQVNURWxlbWVudCwgdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBmdW5jdGlvbnM6IHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoZXhwci5uYW1lID09PSBcImV4cHJcIilcclxuICAgICAgICAgICAgZXhwciA9IGV4cHIuZmlyc3Q7XHJcbiAgICAgICAgc3dpdGNoIChleHByLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInBhcmVudGhlc2lzZXhwclwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcmlhYmxlc1tleHByLnZhbHVlXSA/PyBcInVua25vd25cIjtcclxuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiYm9vbFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHIudmFsdWU7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlU3RyaW5nKGV4cHIudmFsdWUpO1xyXG4gICAgICAgICAgICBjYXNlIFwiYWRkXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyLnBhcnNlSW50KGEpICsgTnVtYmVyLnBhcnNlSW50KGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXN1bHQpID8gXCJ1bmtub3duXCIgOiBgJHtyZXN1bHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwic3ViXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyLnBhcnNlSW50KGEpIC0gTnVtYmVyLnBhcnNlSW50KGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXN1bHQpID8gXCJ1bmtub3duXCIgOiBgJHtyZXN1bHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwibXVsXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyLnBhcnNlSW50KGEpICogTnVtYmVyLnBhcnNlSW50KGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXN1bHQpID8gXCJ1bmtub3duXCIgOiBgJHtyZXN1bHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwiZGl2XCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gfn4oTnVtYmVyLnBhcnNlSW50KGEpIC8gTnVtYmVyLnBhcnNlSW50KGIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImVxXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPT09IGJ9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwibHRcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5sYXN0LCB2YXJpYWJsZXMsIGZ1bmN0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihhKSB8fCBOdW1iZXIuaXNOYU4oYikpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthIDwgYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJndFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGEpIHx8IE51bWJlci5pc05hTihiKSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPiBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImxlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCB2YXJpYWJsZXMsIGZ1bmN0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpKTtcclxuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYSkgfHwgTnVtYmVyLmlzTmFOKGIpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA8PSBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImdlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCB2YXJpYWJsZXMsIGZ1bmN0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpKTtcclxuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYSkgfHwgTnVtYmVyLmlzTmFOKGIpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA+PSBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIm9yXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPT09IFwidHJ1ZVwiIHx8IGIgPT09IFwidHJ1ZVwifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImFuZFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCB2YXJpYWJsZXMsIGZ1bmN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID09PSBcInRydWVcIiAmJiBiID09PSBcInRydWVcIn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJub3RcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKSA9PT0gXCJ0cnVlXCIgPyBcImZhbHNlXCIgOiBcInRydWVcIn1gO1xyXG4gICAgICAgICAgICBjYXNlIFwiY29uY2F0XCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKyBiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBleHByLmZpbmQoXCJuYW1lXCIpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGZ1bmN0aW9uc1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmICghZnVuYykgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IEFycmF5LmZyb20oZXhwci5maW5kKFwiYXJnbGlzdFwiKSkubWFwKChhcmcpID0+IHRoaXMuZXZhbEV4cHIoYXJnLCB2YXJpYWJsZXMsIGZ1bmN0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMoYXJncywgeyB2YXJpYWJsZXMsIGZ1bmN0aW9ucyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50OiBBU1RFbGVtZW50LCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGZ1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0pOiBzdHJpbmcge1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdGVtZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImFzc2lnblwiOlxyXG4gICAgICAgICAgICAgICAgdmFyaWFibGVzW3N0YXRlbWVudC5maW5kKFwibmFtZVwiKS52YWx1ZV0gPSB0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpZlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24gPT09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZXhlYyhzdGF0ZW1lbnQuZmluZChcImJvZHlcIiksIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsc2VTdGF0ZW1lbnQgPSBzdGF0ZW1lbnQuZmluZENoaWxkKFwiZWxzZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbHNlU3RhdGVtZW50ICYmIGNvbmRpdGlvbiA9PT0gXCJmYWxzZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZXhlYyhlbHNlU3RhdGVtZW50LmZpbmQoXCJib2R5XCIpLCB2YXJpYWJsZXMsIGZ1bmN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIndoaWxlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHIgPSBzdGF0ZW1lbnQuZmluZChcImV4cHJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZXZhbEV4cHIoZXhwciwgdmFyaWFibGVzLCBmdW5jdGlvbnMpID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXhlYyhib2R5LCB2YXJpYWJsZXMsIGZ1bmN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gQXJyYXkuZnJvbShzdGF0ZW1lbnQuZmluZChcInBhcmFtbGlzdFwiKSkubWFwKChwYXJhbSkgPT4gcGFyYW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25zW3N0YXRlbWVudC5maW5kKFwibmFtZVwiKS52YWx1ZV0gPSAoYXJnczogc3RyaW5nW10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFZhcmlhYmxlcyA9IHsuLi52YXJpYWJsZXN9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsRnVuY3Rpb25zID0gey4uLmZ1bmN0aW9uc307XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2YgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXJnKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxWYXJpYWJsZXNbcGFyYW1dID0gYXJnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWMoYm9keSwgbG9jYWxWYXJpYWJsZXMsIGxvY2FsRnVuY3Rpb25zKSA/PyBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpbmQoXCJleHByXCIpLCB2YXJpYWJsZXMsIGZ1bmN0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsc3RhdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsRXhwcihzdGF0ZW1lbnQuZmlyc3QsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicmV0dXJuXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsRXhwcihzdGF0ZW1lbnQuZmluZChcImV4cHJcIiksIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBleGVjKGJvZHk6IEFTVEVsZW1lbnQsIHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgZnVuY3Rpb25zOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfSk6IHN0cmluZyB7XHJcbiAgICAgICAgZm9yIChjb25zdCB7IGZpcnN0OiBzdGF0ZW1lbnQgfSBvZiBib2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXhlY1N0YXRlbWVudChzdGF0ZW1lbnQsIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkU2NyaXB0KHNjcmlwdDogSFRNTFNjcmlwdEVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoc2NyaXB0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgIT09IFwidGV4dC9zaWdtYXNjcmlwdFwiKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHNvdXJjZTtcclxuICAgICAgICBpZiAoc2NyaXB0Lmhhc0F0dHJpYnV0ZShcInNyY1wiKSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpO1xyXG4gICAgICAgICAgICBzb3VyY2UgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNvdXJjZSA9IHNjcmlwdC5pbm5lclRleHQ7XHJcbiAgICAgICAgdGhpcy5sb2FkKHNvdXJjZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXRMb2FkZXIoKSB7XHJcbiAgICAgICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcclxuICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEhUTUxTY3JpcHRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU2NyaXB0KG5vZGUpO1xyXG4gICAgICAgIH0pLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2NyaXB0IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpKVxyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY3JpcHQoc2NyaXB0KTtcclxuICAgIH1cclxuXHJcbiAgICBleGVjdXRlKHByb2dyYW06IEFTVEVsZW1lbnQpOiBTY29wZSB7XHJcbiAgICAgICAgY29uc3QgeyB2YXJpYWJsZXMsIGZ1bmN0aW9ucyB9ID0gdGhpcy5wYXJzZUltcG9ydHMocHJvZ3JhbS5maW5kKFwiaW1wb3J0c1wiKSk7XHJcbiAgICAgICAgdGhpcy5leGVjKHByb2dyYW0uZmluZChcImJvZHlcIiksIHZhcmlhYmxlcywgZnVuY3Rpb25zKTtcclxuICAgICAgICByZXR1cm4geyB2YXJpYWJsZXMsIGZ1bmN0aW9ucyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoc291cmNlOiBzdHJpbmcpOiBTY29wZSB7XHJcbiAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHRoaXMucGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbiAgICAgICAgaWYgKCFwcm9ncmFtIHx8IHByb2dyYW0uZW5kLm9mZnNldCAhPT0gc291cmNlLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGxpYiA9IHByb2dyYW0uZmluZENoaWxkKFwibGliXCIpO1xyXG4gICAgICAgIGlmIChsaWIpXHJcbiAgICAgICAgICAgIHRoaXMubGlic1tsaWIuZmluZChcIm5hbWVcIikudmFsdWVdID0gbmV3IFNpZ21hU2NyaXB0TGliKHByb2dyYW0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShwcm9ncmFtKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNTRnVuY3Rpb24sIFNpZ21hU2NyaXB0IH0gZnJvbSBcIi4uL3NpZ21hc2NyaXB0L3NpZ21hc2NyaXB0XCI7XHJcbmltcG9ydCB7IEFTVEVsZW1lbnQsIEdyYW1tYXIgfSBmcm9tIFwiLi4vcGFyc2VyXCI7XHJcbmltcG9ydCB7IGRvbUxpYiB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdC9saWIvZG9tXCI7XHJcblxyXG4vKlxyXG51c2UgZG9tO1xyXG5cclxuZG9tX2FwcGVuZChkb21fYm9keSxcclxuICAgIDxkaXYgYXR0cj1cInRlc3RcIj5cclxuICAgICAgICA8c3Bhbj5IZWxsbyB3b3JsZCEgMiArIDIgPSB7MiArIDJ9PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbik7XHJcbiovXHJcblxyXG4vKlxyXG51c2UgZG9tO1xyXG5cclxuZm4gPHRlc3QgYXR0cj1cImRlZmF1bHRcIj4ge1xyXG4gICAgcmV0IDxzcGFuPnsgYXR0ciB9PC9zcGFuPjtcclxufVxyXG5cclxuZG9tX2FwcGVuZChkb21fYm9keSxcclxuICAgIDxkaXY+XHJcbiAgICAgICAgPHRlc3QgYXR0cj1cInRlc3RcIj48L3Rlc3Q+XHJcbiAgICAgICAgPHRlc3Q+PC90ZXN0PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcbiovXHJcblxyXG5jb25zdCBncmFtbWFyOiBQYXJ0aWFsPEdyYW1tYXI+ID0ge1xyXG4gICAgXCJodG1sbmFtZVwiOiBcIlthLXotXStcIixcclxuICAgIFwiaHRtbGF0dHJ2YWxcIjogXCIlc3RyaW5nfCh7ICVleHByIH0pXCIsXHJcbiAgICBcImh0bWxhdHRyXCI6IFwiJWh0bWxuYW1lPSVodG1sYXR0cnZhbFwiLFxyXG4gICAgXCJodG1sZW50aXR5XCI6IFwiJiVodG1sbmFtZTtcIixcclxuICAgIFwiaHRtbHRleHRcIjogXCIoW14mPD57fV0pK1wiLFxyXG4gICAgXCJodG1sY29udGVudFwiOiBcIiglaHRtbHRleHR8JWh0bWxlbnRpdHl8KHsgJWV4cHIgfSl8JWh0bWwpKz9cIixcclxuICAgIFwiaHRtbFwiOiBcIjwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8+JWh0bWxjb250ZW50PC8laHRtbG5hbWU+XCIsXHJcbiAgICBcImV4cHJcIjogXCIuLi58JWh0bWxcIlxyXG59O1xyXG5cclxuY29uc3QgaHRtbGVudGl0aWVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge1xyXG4gICAgXCJhbXBcIjogXCImXCIsXHJcbiAgICBcImx0XCI6IFwiPFwiLFxyXG4gICAgXCJndFwiOiBcIj5cIlxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpZ21hU2NyaXB0WCBleHRlbmRzIFNpZ21hU2NyaXB0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKGdyYW1tYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VBdHRyaWJ1dGVzKGVsZW1lbnQ6IHN0cmluZywgaHRtbDogQVNURWxlbWVudCwgdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfSwgZnVuY3Rpb25zOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb247IH0pIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgaHRtbC5maW5kQ2hpbGRyZW4oXCJodG1sYXR0clwiKSlcclxuICAgICAgICAgICAgZG9tTGliLmZ1bmN0aW9ucy5kb21fc2V0X2F0dHIoW1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCxcclxuICAgICAgICAgICAgICAgIGF0dHIuZmluZChcImh0bWxuYW1lXCIpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsRXhwcihhdHRyLmZpbmQoXCJodG1sYXR0cnZhbFwiKS5maXJzdCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpXHJcbiAgICAgICAgICAgIF0sIHsgdmFyaWFibGVzLCBmdW5jdGlvbnMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNvbnRlbnQoZWxlbWVudDogc3RyaW5nLCBjb250ZW50OiBBU1RFbGVtZW50LCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9LCBmdW5jdGlvbnM6IHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbjsgfSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY29udGVudCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoY2hpbGQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImh0bWx0ZXh0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJodG1sZW50aXR5XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBodG1sZW50aXRpZXNbY2hpbGQuZmluZChcImh0bWxuYW1lXCIpLnZhbHVlXSA/PyBjaGlsZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJleHByXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaHRtbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5ldmFsRXhwcihjaGlsZCwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvbUxpYi5mdW5jdGlvbnMuZG9tX2FwcGVuZChbZWxlbWVudCwgdmFsdWVdLCB7IHZhcmlhYmxlcywgZnVuY3Rpb25zIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZXZhbEV4cHIoZXhwcjogQVNURWxlbWVudCwgdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfSwgZnVuY3Rpb25zOiB7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb247IH0pOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChleHByLm5hbWUgPT09IFwiZXhwclwiKVxyXG4gICAgICAgICAgICBleHByID0gZXhwci5maXJzdDtcclxuICAgICAgICBzd2l0Y2ggKGV4cHIubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaHRtbFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKGV4cHIuZmlyc3QudmFsdWUgIT09IGV4cHIubGFzdC52YWx1ZSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvbUxpYi5mdW5jdGlvbnMuZG9tX2NyZWF0ZShbZXhwci5maXJzdC52YWx1ZV0sIHsgdmFyaWFibGVzLCBmdW5jdGlvbnMgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlQXR0cmlidXRlcyhlbGVtZW50LCBleHByLCB2YXJpYWJsZXMsIGZ1bmN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlQ29udGVudChlbGVtZW50LCBleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuZXZhbEV4cHIoZXhwciwgdmFyaWFibGVzLCBmdW5jdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgU2lnbWFTY3JpcHRYIH0gZnJvbSBcIi4vc2lnbWFzY3JpcHR4XCI7XHJcblxyXG5uZXcgU2lnbWFTY3JpcHRYKCkuaW5pdExvYWRlcigpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==