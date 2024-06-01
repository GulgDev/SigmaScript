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
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");

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
const domLib = new ___WEBPACK_IMPORTED_MODULE_0__.NativeLib({
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
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");

let funcId = -1;
const funcs = {};
const fnLib = new ___WEBPACK_IMPORTED_MODULE_0__.NativeLib({}, {
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
    constructor(program) {
        this.program = program;
    }
    use(sigmaScript, scope) {
        const libScope = sigmaScript.execute(this.program);
        Object.assign(scope.variables, libScope.variables);
        Object.assign(scope.functions, libScope.functions);
    }
}
class NativeLib {
    constructor(variables, functions) {
        this.variables = variables;
        this.functions = functions;
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
/* harmony export */   jsLib: () => (/* binding */ jsLib)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");

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
const jsLib = new ___WEBPACK_IMPORTED_MODULE_0__.NativeLib({
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

/***/ "./src/sigmascript/lib/ref.ts":
/*!************************************!*\
  !*** ./src/sigmascript/lib/ref.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   refLib: () => (/* binding */ refLib)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/sigmascript/lib/index.ts");

let refId = -1;
const refs = {};
const refLib = new ___WEBPACK_IMPORTED_MODULE_0__.NativeLib({}, {
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
    }
    parseImports(imports, scope) {
        for (const use of imports) {
            const name = use.find("name").value;
            if (name in this.libs)
                this.libs[name].use(this, scope);
            else
                switch (name) {
                    case "js":
                        _lib_js__WEBPACK_IMPORTED_MODULE_4__.jsLib.use(scope);
                        break;
                    case "dom":
                        _lib_dom__WEBPACK_IMPORTED_MODULE_2__.domLib.use(scope);
                        break;
                    case "ref":
                        _lib_ref__WEBPACK_IMPORTED_MODULE_5__.refLib.use(scope);
                        break;
                    case "fn":
                        _lib_fn__WEBPACK_IMPORTED_MODULE_3__.fnLib.use(scope);
                        break;
                }
        }
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
            this.libs[lib.find("name").value] = new _lib__WEBPACK_IMPORTED_MODULE_1__.SigmaScriptLib(program);
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

fn <test class="default" > {
    ret <span class={class}>{ children }</span>;
}

dom_append(dom_body,
    <div>
        <test class="test">Hello world!</test>
    </div>
);
*/
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
        this.groups = {};
        this.groupId = -1;
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
            const group = this.groups[value];
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
                    let children = "unknown";
                    if (isPaired) {
                        children = `#ssxgroup:${++this.groupId}`;
                        this.groups[children] = this.parseHTMLContent(expr.find("htmlcontent"), scope);
                    }
                    return component(children, attrvals);
                }
                else {
                    const element = _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__.domLib.functions.dom_create([tagName], scope);
                    for (const attr of expr.findChildren("htmlattr"))
                        _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__.domLib.functions.dom_set_attr([
                            element,
                            attr.find("htmlname").value,
                            this.evalExpr(attr.find("htmlattrval").first, scope)
                        ], scope);
                    if (isPaired)
                        for (const child of this.parseHTMLContent(expr.find("htmlcontent"), scope))
                            _sigmascript_lib_dom__WEBPACK_IMPORTED_MODULE_1__.domLib.functions.dom_append([element, child], scope);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtby9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPLElBQVUsSUFBSSxDQWdCcEI7QUFoQkQsV0FBaUIsSUFBSTtJQUNqQixTQUFnQixZQUFZLENBQUMsRUFBVTtRQUNuQyxPQUFPLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLElBQUksSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDO0lBQ3BELENBQUM7SUFGZSxpQkFBWSxlQUUzQjtJQUVELFNBQWdCLE9BQU8sQ0FBQyxFQUFVO1FBQzlCLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDdEIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBSmUsWUFBTyxVQUl0QjtJQUVELFNBQWdCLFFBQVEsQ0FBQyxFQUFVO1FBQy9CLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDdEIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztJQUNyQyxDQUFDO0lBSmUsYUFBUSxXQUl2QjtBQUNMLENBQUMsRUFoQmdCLElBQUksS0FBSixJQUFJLFFBZ0JwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCbUQ7QUFDUjtBQWFyQyxNQUFNLFVBQVU7SUFRbkIsWUFBWSxJQUFZLEVBQUUsS0FBZSxFQUFFLEdBQWEsRUFBRSxLQUFhO1FBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNkLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVE7WUFDN0IsTUFBTSxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFpQjtRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWE7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFZO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFZO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFZO1FBQ2IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxJQUFJLEtBQUs7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN4QixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLElBQUksVUFBVTtnQkFBRSxPQUFPLFVBQVUsQ0FBQztRQUN0QyxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBRU0sTUFBTSxNQUFNO0lBR2YsWUFBWSxPQUFnQjtRQUZYLGFBQVEsR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUd4RCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDcEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRO2dCQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsaURBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOztnQkFFN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGlEQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjO1FBQ2hCLFNBQVMsS0FBSyxDQUFDLE9BQWMsRUFBRSxNQUFrQjtZQUM3QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixNQUFNLFNBQVMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkksTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUN2QixDQUFDO1lBQ0QsSUFBSSxPQUFPLENBQUMsUUFBUTtnQkFDaEIsS0FBSyxNQUFNLEtBQUssSUFBSSxPQUFPLENBQUMsUUFBUTtvQkFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksMkNBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPO1FBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEgsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFFRCxTQUFTLGFBQWEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUN2QyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxDQUFhLEVBQUUsQ0FBYTs7SUFDdkMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqQixJQUFJLENBQUMsQ0FBQztRQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pCLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0UsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUFFLHVDQUFZLENBQUMsS0FBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUc7SUFDMUcsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUFFLHVDQUFZLENBQUMsS0FBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUc7SUFDMUcsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUM5QyxPQUFPO1lBQ0gsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDNUMsVUFBVSxFQUFFLE9BQUMsQ0FBQyxVQUFVLG1DQUFJLENBQUMsQ0FBQyxVQUFVO1lBQ3hDLGtCQUFrQixFQUFFLE9BQUMsQ0FBQyxrQkFBa0IsbUNBQUksQ0FBQyxDQUFDLGtCQUFrQjtTQUNuRSxDQUFDO0FBQ1YsQ0FBQztBQUVNLFNBQVMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUF5QjtJQUM5RCxNQUFNLE1BQU0sR0FBWSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNuRSxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU07UUFDckIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQztZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdFLEtBQUssTUFBTSxJQUFJLElBQUksT0FBTztRQUN0QixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0UsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdINkI7QUFDYztBQVc1QyxNQUFNLEtBQUs7SUFLUCxZQUFZLFdBQXdDLEVBQUUsRUFBRSxJQUFhO1FBQ2pFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLENBQUMsTUFBYyxFQUFFLElBQVk7UUFDN0IsTUFBTSxRQUFRLHFCQUFRLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUN0QyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNFLE9BQU8sSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBYyxFQUFFLElBQVk7O1FBQzVCLE9BQU8sVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsMENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSjtBQUVNLE1BQWUsT0FBTztDQUs1QjtBQUVNLE1BQU0sVUFBVyxTQUFRLE9BQU87SUFHbkMsWUFBWSxFQUFVO1FBQ2xCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPO1FBQ3hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0MsQ0FBQztDQUNKO0FBRU0sTUFBTSxTQUFVLFNBQVEsT0FBTztJQUlsQyxZQUFZLENBQVUsRUFBRSxDQUFVO1FBQzlCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYyxFQUFFLFFBQThCLEVBQUUsYUFBcUIsQ0FBQyxFQUFFLFFBQWUsSUFBSSxLQUFLLEVBQUUsRUFBRSxRQUFrQyxFQUFFO1FBQzFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksWUFBWSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JKLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDN0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDeEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksWUFBWSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JKLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELElBQUksTUFBTSxJQUFJLE1BQU07WUFDaEIsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDeEQsSUFBSSxLQUFLLEtBQUssTUFBTTtZQUNoQixNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLEtBQUs7WUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDekUsQ0FBQztDQUNKO0FBRU0sTUFBTSxpQkFBa0IsU0FBUSxPQUFPO0lBQzFDLEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsT0FBTyx1Q0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUQsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNDLENBQUM7Q0FDSjtBQUVNLE1BQU0sVUFBVyxTQUFRLE9BQU87SUFDbkMsS0FBSyxDQUFDLE1BQWM7UUFDaEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUFFLE9BQU87UUFDN0IsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0NBQ0o7QUFFTSxNQUFNLFlBQWEsU0FBUSxPQUFPO0lBQ3JDLEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLHVDQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUFFLE9BQU87UUFDM0MsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0NBQ0o7QUFFTSxNQUFNLGVBQWdCLFNBQVEsT0FBTztJQUd4QyxZQUFZLE9BQWdCO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjLEVBQUUsUUFBOEIsRUFBRSxhQUFxQixDQUFDLEVBQUUsUUFBZSxJQUFJLEtBQUssRUFBRSxFQUFFLFFBQWtDLEVBQUU7UUFDMUksTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNwQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQzNFLENBQUM7Q0FDSjtBQUVNLE1BQU0sYUFBYyxTQUFRLE9BQU87SUFHdEMsWUFBWSxPQUFnQjtRQUN4QixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYyxFQUFFLFFBQThCLEVBQUUsYUFBcUIsQ0FBQyxFQUFFLFFBQWUsSUFBSSxLQUFLLEVBQUUsRUFBRSxRQUFrQyxFQUFFO1FBQzFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNFLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPO1FBQ25CLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDM0IsT0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDNUUsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNO2dCQUFFLE1BQU07WUFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0NBQ0o7QUFFTSxNQUFNLHFCQUFzQixTQUFRLE9BQU87SUFJOUMsWUFBWSxLQUFxQixFQUFFLFFBQWlCO1FBQ2hELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUNoQixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLO1lBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLFFBQVE7Z0JBQ3RILE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDNUQsQ0FBQztDQUNKO0FBRU0sTUFBTSxZQUFhLFNBQVEsT0FBTztJQUdyQyxZQUFZLFFBQW1CO1FBQzNCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjLEVBQUUsUUFBOEIsRUFBRSxhQUFxQixDQUFDLEVBQUUsUUFBZSxJQUFJLEtBQUssRUFBRSxFQUFFLFFBQWtDLEVBQUU7UUFDMUksTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTztZQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ3JELENBQUM7Q0FDSjtBQUVNLE1BQU0sWUFBYSxTQUFRLE9BQU87SUFHckMsWUFBWSxJQUFZO1FBQ3BCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjLEVBQUUsUUFBOEIsRUFBRSxhQUFxQixDQUFDLEVBQUUsUUFBZSxJQUFJLEtBQUssRUFBRSxFQUFFLFFBQWtDLEVBQUU7O1FBQzFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsVUFBVSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEUsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksTUFBTTtnQkFBRSxNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDekMsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDbEcsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxhQUFPLENBQUMsVUFBVSxtQ0FBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckosSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDckMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUM1RixDQUFDO0NBQ0o7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEVBQVU7SUFDbEMsT0FBTyxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQztBQUM1RixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBYyxFQUFFLFVBQW1CLEVBQUUscUJBQThCLEtBQUs7SUFDMUYsTUFBTSxRQUFRLEdBQWMsRUFBRSxDQUFDO0lBQy9CLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNmLElBQUksRUFBRSxDQUFDO0lBQ1AsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2IsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNyQixJQUFJLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7aUJBQU0sQ0FBQztnQkFDSixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsT0FBTyx1Q0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDekMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNqQixJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNmLENBQUM7Z0JBQ0QsSUFBSSxJQUFJLEtBQUssR0FBRztvQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQzs7b0JBRWxDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5QyxDQUFDO1FBQ0wsQ0FBQzthQUFNLElBQUksRUFBRSxLQUFLLEdBQUc7WUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDL0MsSUFBSSxFQUFFLEtBQUssR0FBRztZQUNmLE1BQU07YUFDTCxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxDQUFDO1lBQ3pDLElBQUksUUFBUTtnQkFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDL0IsTUFBTSxLQUFLLEdBQW1CLEVBQUUsQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbEIsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDekIsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDeEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixDQUFDO3FCQUFNLElBQUksRUFBRSxLQUFLLEdBQUc7b0JBQ2pCLE1BQU07cUJBQ0wsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ3ZFLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2IsU0FBUztnQkFDYixDQUFDOztvQkFDRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNSLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2QsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBcUIsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO1lBQ0wsQ0FBQztZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDO2FBQU0sSUFBSSxFQUFFLEtBQUssR0FBRztZQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQzthQUMvQixJQUFJLEVBQUUsS0FBSyxHQUFHO1lBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixFQUFFLENBQUMsQ0FBQzthQUN0QyxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNoRCxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ1YsU0FBUztRQUNiLENBQUM7YUFBTSxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNsRCxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7WUFFakQsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDTCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdELEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0wsQ0FBQztJQUNELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztJQUMvQyxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRU0sU0FBUyxPQUFPLENBQUMsTUFBYyxFQUFFLFVBQW1CLEVBQUUsa0JBQTRCO0lBQ3JGLE9BQU8sWUFBWSxDQUFDLElBQUksMkNBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUM1RSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNuU00sTUFBTSxNQUFNO0lBTWYsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzFFLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxRQUFrQjtRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsT0FBTztRQUNILElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3pCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7O1lBQ0csRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2xCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQzNDTSxNQUFNLE9BQU8sR0FBWTtJQUM1QixRQUFRLEVBQUUsS0FBSztJQUNmLE1BQU0sRUFBRSx5QkFBeUI7SUFDakMsUUFBUSxFQUFFLDZCQUE2QjtJQUN2QyxNQUFNLEVBQUUsZ0JBQWdCO0lBQ3hCLEtBQUssRUFBRTtRQUNILE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsZUFBZTtRQUN4QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELEtBQUssRUFBRTtRQUNILE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsT0FBTyxFQUFFLGVBQWU7UUFDeEIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxRQUFRLEVBQUU7UUFDTixPQUFPLEVBQUUsZUFBZTtRQUN4QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELElBQUksRUFBRTtRQUNGLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFLGVBQWU7UUFDeEIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsZUFBZTtRQUN4QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELElBQUksRUFBRTtRQUNGLE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsZ0JBQWdCO1FBQ3pCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFLGdCQUFnQjtRQUN6QixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELEtBQUssRUFBRTtRQUNILE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsS0FBSyxFQUFFLFNBQVM7SUFDaEIsU0FBUyxFQUFFLHNCQUFzQjtJQUNqQyxNQUFNLEVBQUUsc0JBQXNCO0lBQzlCLGlCQUFpQixFQUFFLGFBQWE7SUFDaEMsTUFBTSxFQUFFO1FBQ0osT0FBTyxFQUFFLGtIQUFrSDtRQUMzSCxrQkFBa0IsRUFBRSxJQUFJO0tBQzNCO0lBQ0QsUUFBUSxFQUFFLGdCQUFnQjtJQUMxQixXQUFXLEVBQUUsc0JBQXNCO0lBQ25DLElBQUksRUFBRSwyQkFBMkI7SUFDakMsTUFBTSxFQUFFLGdCQUFnQjtJQUN4QixPQUFPLEVBQUUsdUJBQXVCO0lBQ2hDLFVBQVUsRUFBRSxxQ0FBcUM7SUFDakQsUUFBUSxFQUFFLFlBQVk7SUFDdEIsVUFBVSxFQUFFLFFBQVE7SUFDcEIsT0FBTyxFQUFFLGNBQWM7SUFDdkIsV0FBVyxFQUFFLHVEQUF1RDtJQUNwRSxNQUFNLEVBQUUsa0JBQWtCO0lBQzFCLEtBQUssRUFBRSxZQUFZO0lBQ25CLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLEtBQUssRUFBRSxZQUFZO0lBQ25CLE1BQU0sRUFBRSxzQkFBc0I7Q0FDakMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzlFNEI7QUFFOUIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFbkIsTUFBTSxRQUFRLEdBQStCLEVBQUUsQ0FBQztBQUVoRCxTQUFTLFdBQVcsQ0FBQyxPQUFnQjtJQUNqQyxNQUFNLEdBQUcsR0FBRyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7SUFDbEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUN4QixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxNQUFjO0lBQzlCLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFFTSxNQUFNLE1BQU0sR0FBRyxJQUFJLHdDQUFTLENBQUM7SUFDaEMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3BDLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztDQUN2QyxFQUFFO0lBQ0MsU0FBUyxDQUFDLENBQUUsS0FBSyxDQUFFO1FBQ2YsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFVBQVUsQ0FBQyxDQUFFLE9BQU8sQ0FBRTtRQUNsQixPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFFLFFBQVEsQ0FBRTtRQUNqQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDL0IsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELFVBQVUsQ0FBQyxDQUFFLE1BQU0sRUFBRSxLQUFLLENBQUU7O1FBQ3hCLGdCQUFVLENBQUMsTUFBTSxDQUFDLDBDQUFFLFdBQVcsQ0FBQyxnQkFBVSxDQUFDLEtBQUssQ0FBQyxtQ0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckYsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFVBQVUsQ0FBQyxDQUFFLE9BQU8sQ0FBRTtRQUNsQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0IsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELGFBQWEsQ0FBQyxDQUFFLE9BQU8sRUFBRSxTQUFTLENBQUU7UUFDaEMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUksR0FBRyxZQUFZLFdBQVc7WUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3RCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsZ0JBQWdCLENBQUMsQ0FBRSxPQUFPLEVBQUUsU0FBUyxDQUFFO1FBQ25DLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxJQUFJLEdBQUcsWUFBWSxXQUFXO1lBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEUsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELGdCQUFnQixDQUFDLENBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBRTtRQUNuQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsSUFBSSxHQUFHLFlBQVksV0FBVztZQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxZQUFZLENBQUMsQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFFO1FBQzFCLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxJQUFJLEdBQUcsWUFBWSxXQUFXO1lBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDckQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFlBQVksQ0FBQyxDQUFFLE9BQU8sRUFBRSxJQUFJLENBQUU7UUFDMUIsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUksR0FBRyxZQUFZLFdBQVc7WUFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsWUFBWSxDQUFDLENBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUU7O1FBQ2pDLGdCQUFVLENBQUMsT0FBTyxDQUFDLDBDQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0MsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFlBQVksQ0FBQyxDQUFFLE9BQU8sRUFBRSxJQUFJLENBQUU7O1FBQzFCLE9BQU8sZ0JBQVUsQ0FBQyxPQUFPLENBQUMsMENBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBRTtRQUM1QixNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsSUFBSSxHQUFHLFlBQVksV0FBVztZQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRSxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUUsRUFBRSxLQUFLO1FBQ3pDLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Q0FDSixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRjJCO0FBRTlCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRWhCLE1BQU0sS0FBSyxHQUFrQyxFQUFFLENBQUM7QUFFekMsTUFBTSxLQUFLLEdBQUcsSUFBSSx3Q0FBUyxDQUFDLEVBQUUsRUFBRTtJQUNuQyxFQUFFLENBQUMsQ0FBRSxJQUFJLENBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRTtRQUN0QixNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDOUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUUsRUFBRSxLQUFLOztRQUN2QixPQUFPLGlCQUFLLENBQUMsRUFBRSxDQUFDLHNEQUFHLElBQUksRUFBRSxLQUFLLENBQUMsbUNBQUksU0FBUyxDQUFDO0lBQ2pELENBQUM7Q0FDSixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiSSxNQUFNLGNBQWM7SUFHdkIsWUFBWSxPQUFtQjtRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQsR0FBRyxDQUFDLFdBQXdCLEVBQUUsS0FBWTtRQUN0QyxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNKO0FBRU0sTUFBTSxTQUFTO0lBSWxCLFlBQVksU0FBb0MsRUFBRSxTQUF3QztRQUN0RixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQVk7UUFDWixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FDOUI2QjtBQUU5QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVsQixNQUFNLE9BQU8sR0FBMkIsRUFBRSxDQUFDO0FBRTNDLFNBQVMsVUFBVSxDQUFDLE1BQVc7SUFDM0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDdEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsTUFBYztJQUM3QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsS0FBYTtJQUN2QixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsSUFBSSxLQUFLLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksS0FBSyxLQUFLLE9BQU87UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNwQyxJQUFJLEtBQUssS0FBSyxNQUFNO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDbkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFBRSxPQUFPLE1BQU0sQ0FBQztJQUN6QyxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsS0FBVTtJQUNwQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLFlBQVksTUFBTTtRQUNwRCxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxZQUFZLE9BQU87UUFDdEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDL0MsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDM0QsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVNLE1BQU0sS0FBSyxHQUFHLElBQUksd0NBQVMsQ0FBQztJQUMvQixTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQztDQUNoQyxFQUFFO0lBQ0MsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFFO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFFLE1BQU0sRUFBRSxRQUFRLENBQUU7O1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLGVBQVMsQ0FBQyxNQUFNLENBQUMsMENBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLElBQUksSUFBSTtZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBRTtRQUM5QixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsSUFBSSxNQUFNLElBQUksSUFBSTtZQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBRTtRQUN0QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLElBQUksSUFBSTtZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFFOztRQUN2QixNQUFNLEtBQUssR0FBRyxlQUFTLENBQUMsTUFBTSxDQUFDLDBDQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsY0FBYyxDQUFDLENBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBRTs7UUFDdEMsTUFBTSxLQUFLLEdBQUcscUJBQVMsQ0FBQyxNQUFNLENBQUMsMENBQUcsTUFBTSxDQUFDLG1EQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkUyQjtBQUU5QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVmLE1BQU0sSUFBSSxHQUE4QixFQUFFLENBQUM7QUFFcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSx3Q0FBUyxDQUFDLEVBQUUsRUFBRTtJQUNwQyxHQUFHLENBQUMsQ0FBRSxZQUFZLENBQUU7UUFDaEIsTUFBTSxHQUFHLEdBQUcsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLGFBQVosWUFBWSxjQUFaLFlBQVksR0FBSSxTQUFTLENBQUM7UUFDdEMsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQUUsR0FBRyxFQUFFLEtBQUssQ0FBRTtRQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBRSxHQUFHLENBQUU7O1FBQ1gsT0FBTyxVQUFJLENBQUMsR0FBRyxDQUFDLG1DQUFJLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25COEQ7QUFDMUI7QUFDSjtBQUNGO0FBQ0E7QUFDRTtBQUNDO0FBRTdCLE1BQU0sS0FBSztJQUlkLFlBQVksS0FBYTtRQUhoQixjQUFTLEdBQThCLEVBQUUsQ0FBQztRQUMxQyxjQUFTLEdBQWtDLEVBQUUsQ0FBQztRQUduRCxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFNBQVMscUJBQVEsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLHFCQUFRLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBQztRQUM1QyxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBQUEsQ0FBQztBQUlLLE1BQU0sV0FBVztJQUtwQixZQUFZLGVBQWlDLEVBQUU7UUFGNUIsU0FBSSxHQUFzQyxFQUFFLENBQUM7UUFHNUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDJDQUFNLENBQUMsZ0RBQU8sQ0FBQyw2Q0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVTLFlBQVksQ0FBQyxPQUFtQixFQUFFLEtBQVk7UUFDcEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUN4QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNwQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7O2dCQUVwRCxRQUFRLElBQUksRUFBRSxDQUFDO29CQUNYLEtBQUssSUFBSTt3QkFDTCwwQ0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDakIsTUFBTTtvQkFDVixLQUFLLEtBQUs7d0JBQ04sNENBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ2xCLE1BQU07b0JBQ1YsS0FBSyxLQUFLO3dCQUNOLDRDQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNsQixNQUFNO29CQUNWLEtBQUssSUFBSTt3QkFDTCwwQ0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDakIsTUFBTTtnQkFDZCxDQUFDO1FBQ1QsQ0FBQztJQUNMLENBQUM7SUFFUyxXQUFXLENBQUMsR0FBVztRQUM3QixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFUyxRQUFRLENBQUMsSUFBZ0IsRUFBRSxLQUFZOztRQUM3QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTtZQUNwQixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN0QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixLQUFLLGlCQUFpQjtnQkFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUMsS0FBSyxNQUFNO2dCQUNQLE9BQU8sV0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1DQUFJLFNBQVMsQ0FBQztZQUNwRCxLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssTUFBTTtnQkFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdEIsS0FBSyxRQUFRO2dCQUNULE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO1lBQzFELENBQUM7WUFDRCxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDMUQsQ0FBQztZQUNELEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDMUQsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN4QixDQUFDO1lBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFBRSxPQUFPLFNBQVMsQ0FBQztnQkFDekQsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0QixDQUFDO1lBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFBRSxPQUFPLFNBQVMsQ0FBQztnQkFDekQsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0QixDQUFDO1lBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFBRSxPQUFPLFNBQVMsQ0FBQztnQkFDekQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN2QixDQUFDO1lBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsS0FB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Ozs7Ozs7OztDQVlWO0lBQ0csV0FBVyxFQUFFOzs7Ozs7Ozs7Ozs7O2dCQWFEO0NBQ2YsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksb0VBQVcsRUFBRSxDQUFDO0FBRXRDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUF3QixDQUFDO0FBQ3BFLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFzQixDQUFDO0FBQ3RFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFzQixDQUFDO0FBRS9FLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBRUgsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdkMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9wYXJzZXIvY2hhci50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9wYXJzZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvcGFyc2VyL3BhdHRlcm4udHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvcGFyc2VyL3N0cmVhbS50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9ncmFtbWFyLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9kb20udHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL2ZuLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9pbmRleC50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9saWIvanMudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL3JlZi50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9zaWdtYXNjcmlwdC50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdHgvc2lnbWFzY3JpcHR4LnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NpZ21hc2NyaXB0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NpZ21hc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvZGVtby50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgbmFtZXNwYWNlIENoYXIge1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoID09PSBcIiBcIiB8fCBjaCA9PT0gXCJcXG5cIiB8fCBjaCA9PT0gXCJcXHJcIjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFjaCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBjaC5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBjb2RlID49IDQ4ICYmIGNvZGUgPD0gNTc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzTGV0dGVyKGNoOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIWNoKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGNoLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICByZXR1cm4gY29kZSA+PSA5NyAmJiBjb2RlIDw9IDEyMjtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1hdGNoLCBQYXR0ZXJuLCBwYXR0ZXJuIH0gZnJvbSBcIi4vcGF0dGVyblwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiwgU3RyZWFtIH0gZnJvbSBcIi4vc3RyZWFtXCI7XHJcblxyXG50eXBlIERlZmluaXRpb24gPSB7XHJcbiAgICBwcmVjZWRlbmNlPzogbnVtYmVyLFxyXG4gICAgcHJlc2VydmVQcmVjZWRlbmNlPzogYm9vbGVhbixcclxuICAgIHBhdHRlcm46IHN0cmluZ1xyXG59IHwgc3RyaW5nO1xyXG5cclxuZXhwb3J0IHR5cGUgR3JhbW1hciA9IHtcclxuICAgIFtrZXk6IHN0cmluZ106IERlZmluaXRpb24sXHJcbiAgICByb290OiBEZWZpbml0aW9uXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgQVNURWxlbWVudCB7XHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBzdGFydDogTG9jYXRpb247XHJcbiAgICByZWFkb25seSBlbmQ6IExvY2F0aW9uO1xyXG4gICAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoaWxkcmVuOiBBU1RFbGVtZW50W107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBzdGFydDogTG9jYXRpb24sIGVuZDogTG9jYXRpb24sIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcclxuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmaXJzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblswXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGFzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5hdCgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICAgICAgeWllbGQgY2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQ6IEFTVEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChpbmRleDogbnVtYmVyKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQ2hpbGRyZW4obmFtZTogc3RyaW5nKTogQVNURWxlbWVudFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZC5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQ2hpbGQobmFtZTogc3RyaW5nKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbmQoKGNoaWxkKSA9PiBjaGlsZC5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kKG5hbWU6IHN0cmluZyk6IEFTVEVsZW1lbnQgfCBudWxsIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuZmluZENoaWxkKG5hbWUpO1xyXG4gICAgICAgIGlmIChjaGlsZCkgcmV0dXJuIGNoaWxkO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjb25zdCBkZXNjZW5kYW50ID0gY2hpbGQuZmluZChuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGRlc2NlbmRhbnQpIHJldHVybiBkZXNjZW5kYW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnNlciB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm5zOiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihncmFtbWFyOiBHcmFtbWFyKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBbbmFtZSwgZGVmaW5pdGlvbl0gb2YgT2JqZWN0LmVudHJpZXMoZ3JhbW1hcikpXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgICAgIHRoaXMucGF0dGVybnMuc2V0KG5hbWUsIHBhdHRlcm4oZGVmaW5pdGlvbikpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdHRlcm5zLnNldChuYW1lLCBwYXR0ZXJuKGRlZmluaXRpb24ucGF0dGVybiwgZGVmaW5pdGlvbi5wcmVjZWRlbmNlLCBkZWZpbml0aW9uLnByZXNlcnZlUHJlY2VkZW5jZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKGJ1ZmZlcjogc3RyaW5nKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIGZ1bmN0aW9uIHZpc2l0KGN1cnJlbnQ6IE1hdGNoLCBwYXJlbnQ6IEFTVEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UGFyZW50ID0gbmV3IEFTVEVsZW1lbnQoY3VycmVudC5uYW1lLCBjdXJyZW50LnN0YXJ0LCBjdXJyZW50LmVuZCwgYnVmZmVyLnNsaWNlKGN1cnJlbnQuc3RhcnQub2Zmc2V0LCBjdXJyZW50LmVuZC5vZmZzZXQpKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZChuZXdQYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gbmV3UGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50LmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjdXJyZW50LmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0KGNoaWxkLCBwYXJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnBhdHRlcm5zLmdldChcInJvb3RcIikubWF0Y2gobmV3IFN0cmVhbShidWZmZXIpLCB0aGlzLnBhdHRlcm5zKTtcclxuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IG5ldyBBU1RFbGVtZW50KFwicm9vdFwiLCBtYXRjaC5zdGFydCwgbWF0Y2guZW5kLCBidWZmZXIuc2xpY2UobWF0Y2guc3RhcnQub2Zmc2V0LCBtYXRjaC5lbmQub2Zmc2V0KSk7XHJcbiAgICAgICAgdmlzaXQobWF0Y2gsIHJvb3QpO1xyXG4gICAgICAgIHJldHVybiByb290O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZVBhdHRlcm5zKGE6IHN0cmluZywgYjogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYi5yZXBsYWNlKC9cXC5cXC5cXC4vZywgYSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlKGE6IERlZmluaXRpb24sIGI6IERlZmluaXRpb24pOiBEZWZpbml0aW9uIHtcclxuICAgIGlmICghYSkgcmV0dXJuIGI7XHJcbiAgICBpZiAoIWIpIHJldHVybiBhO1xyXG4gICAgaWYgKHR5cGVvZiBhID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiBiID09PSBcInN0cmluZ1wiKSByZXR1cm4gbWVyZ2VQYXR0ZXJucyhhLCBiKTtcclxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgYiAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIHsgLi4uYiwgcGF0dGVybjogbWVyZ2VQYXR0ZXJucyhhLCBiLnBhdHRlcm4pIH07XHJcbiAgICBpZiAodHlwZW9mIGEgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGIgPT09IFwic3RyaW5nXCIpIHJldHVybiB7IC4uLmEsIHBhdHRlcm46IG1lcmdlUGF0dGVybnMoYS5wYXR0ZXJuLCBiKSB9O1xyXG4gICAgaWYgKHR5cGVvZiBhICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBiICE9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBhdHRlcm46IG1lcmdlUGF0dGVybnMoYS5wYXR0ZXJuLCBiLnBhdHRlcm4pLFxyXG4gICAgICAgICAgICBwcmVjZWRlbmNlOiBiLnByZWNlZGVuY2UgPz8gYS5wcmVjZWRlbmNlLFxyXG4gICAgICAgICAgICBwcmVzZXJ2ZVByZWNlZGVuY2U6IGIucHJlc2VydmVQcmVjZWRlbmNlID8/IGEucHJlc2VydmVQcmVjZWRlbmNlXHJcbiAgICAgICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaGVyaXQocGFyZW50OiBHcmFtbWFyLCBncmFtbWFyOiBQYXJ0aWFsPEdyYW1tYXI+KTogR3JhbW1hciB7XHJcbiAgICBjb25zdCByZXN1bHQ6IEdyYW1tYXIgPSB7IHJvb3Q6IG1lcmdlKHBhcmVudC5yb290LCBncmFtbWFyLnJvb3QpIH07XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcGFyZW50KVxyXG4gICAgICAgIGlmICghKG5hbWUgaW4gcmVzdWx0KSkgcmVzdWx0W25hbWVdID0gbWVyZ2UocGFyZW50W25hbWVdLCBncmFtbWFyW25hbWVdKTtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBncmFtbWFyKVxyXG4gICAgICAgIGlmICghKG5hbWUgaW4gcmVzdWx0KSkgcmVzdWx0W25hbWVdID0gbWVyZ2UocGFyZW50W25hbWVdLCBncmFtbWFyW25hbWVdKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn0iLCJpbXBvcnQgeyBDaGFyIH0gZnJvbSBcIi4vY2hhclwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiwgU3RyZWFtIH0gZnJvbSBcIi4vc3RyZWFtXCI7XHJcblxyXG5leHBvcnQgdHlwZSBDaGFyYWN0ZXJHcm91cCA9IChzdHJpbmcgfCBbc3RyaW5nLCBzdHJpbmddKVtdO1xyXG5cclxuZXhwb3J0IHR5cGUgTWF0Y2ggPSB7XHJcbiAgICBuYW1lPzogc3RyaW5nLFxyXG4gICAgc3RhcnQ6IExvY2F0aW9uLFxyXG4gICAgZW5kOiBMb2NhdGlvbixcclxuICAgIGNoaWxkcmVuPzogTWF0Y2hbXVxyXG59O1xyXG5cclxuY2xhc3MgU3RhY2sge1xyXG4gICAgcHJpdmF0ZSBlbGVtZW50czogeyBba2V5OiBudW1iZXJdOiBzdHJpbmdbXSB9O1xyXG4gICAgXHJcbiAgICByZWFkb25seSBsYXN0Pzogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRzOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZ1tdIH0gPSB7fSwgbGFzdD86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcclxuICAgICAgICB0aGlzLmxhc3QgPSBsYXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHdpdGgob2Zmc2V0OiBudW1iZXIsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0geyAuLi50aGlzLmVsZW1lbnRzIH07XHJcbiAgICAgICAgZWxlbWVudHNbb2Zmc2V0XSA9IGVsZW1lbnRzW29mZnNldF0gPyBbLi4uZWxlbWVudHNbb2Zmc2V0XSwgbmFtZV0gOiBbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdGFjayhlbGVtZW50cywgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzKG9mZnNldDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50c1tvZmZzZXRdPy5pbmNsdWRlcyhuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhdHRlcm4ge1xyXG4gICAgcHJlY2VkZW5jZT86IG51bWJlcjtcclxuICAgIHByZXNlcnZlUHJlY2VkZW5jZTogYm9vbGVhbjtcclxuXHJcbiAgICBhYnN0cmFjdCBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlPzogbnVtYmVyLCBzdGFjaz86IFN0YWNrLCBjYWNoZT86IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSk6IE1hdGNoIHwgbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhd1BhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2g6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNoID0gY2g7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBpZiAoc3RyZWFtLnBlZWtjaCgpICE9PSB0aGlzLmNoKSByZXR1cm47XHJcbiAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9yUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhOiBQYXR0ZXJuO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBiOiBQYXR0ZXJuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGE6IFBhdHRlcm4sIGI6IFBhdHRlcm4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2gge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoQSA9ICEodGhpcy5hIGluc3RhbmNlb2YgTmFtZWRQYXR0ZXJuICYmIHN0YWNrLmhhcyhzdGFydC5vZmZzZXQsIHRoaXMuYS5uYW1lKSkgJiYgdGhpcy5hLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgY29uc3QgZW5kQSA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBzdHJlYW0ubG9jYXRpb24gPSBzdGFydDtcclxuICAgICAgICBjb25zdCBtYXRjaEIgPSAhKHRoaXMuYiBpbnN0YW5jZW9mIE5hbWVkUGF0dGVybiAmJiBzdGFjay5oYXMoc3RhcnQub2Zmc2V0LCB0aGlzLmIubmFtZSkpICYmIHRoaXMuYi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGNvbnN0IGVuZEIgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgbGV0IG1hdGNoID0gKCFtYXRjaEEgJiYgbWF0Y2hCKSB8fCAoIW1hdGNoQiAmJiBtYXRjaEEpO1xyXG4gICAgICAgIGlmIChtYXRjaEEgJiYgbWF0Y2hCKVxyXG4gICAgICAgICAgICBtYXRjaCA9IGVuZEEub2Zmc2V0ID4gZW5kQi5vZmZzZXQgPyBtYXRjaEEgOiBtYXRjaEI7XHJcbiAgICAgICAgaWYgKG1hdGNoID09PSBtYXRjaEEpXHJcbiAgICAgICAgICAgIHN0cmVhbS5sb2NhdGlvbiA9IGVuZEE7XHJcbiAgICAgICAgaWYgKG1hdGNoKSByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24sIGNoaWxkcmVuOiBbbWF0Y2hdIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXaGl0ZXNwYWNlUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICB3aGlsZSAoQ2hhci5pc1doaXRlc3BhY2Uoc3RyZWFtLnBlZWtjaCgpKSkgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFueVBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgaWYgKCFzdHJlYW0ucGVla2NoKCkpIHJldHVybjtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGlnaXRQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGlmICghQ2hhci5pc0RpZ2l0KHN0cmVhbS5wZWVrY2goKSkpIHJldHVybjtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IFBhdHRlcm47XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0dGVybjogUGF0dGVybikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2gge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5wYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgaWYgKCFtYXRjaCkgc3RyZWFtLmxvY2F0aW9uID0gc3RhcnQ7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbjogbWF0Y2ggPyBbbWF0Y2hdIDogW10gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlcGVhdFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjogUGF0dGVybjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBQYXR0ZXJuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBtYXRjaCA9IHRoaXMucGF0dGVybi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW21hdGNoXTtcclxuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhc3QgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgd2hpbGUgKG1hdGNoID0gdGhpcy5wYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSkpIHtcclxuICAgICAgICAgICAgaWYgKGxhc3Qub2Zmc2V0ID09PSBzdHJlYW0ub2Zmc2V0KSBicmVhaztcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChtYXRjaCk7XHJcbiAgICAgICAgICAgIGxhc3QgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0cmVhbS5sb2NhdGlvbiA9IGxhc3Q7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyR3JvdXBQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdyb3VwOiBDaGFyYWN0ZXJHcm91cDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGlzYWxsb3c6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ3JvdXA6IENoYXJhY3Rlckdyb3VwLCBkaXNhbGxvdzogYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGdyb3VwO1xyXG4gICAgICAgIHRoaXMuZGlzYWxsb3cgPSBkaXNhbGxvdztcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IGNoID0gc3RyZWFtLnBlZWtjaCgpO1xyXG4gICAgICAgIGlmICghY2gpIHJldHVybjtcclxuICAgICAgICBjb25zdCBjb2RlID0gY2guY2hhckNvZGVBdCgwKTtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZXhwZWN0ZWQgb2YgdGhpcy5ncm91cClcclxuICAgICAgICAgICAgaWYgKChBcnJheS5pc0FycmF5KGV4cGVjdGVkKSAmJiBjb2RlID49IGV4cGVjdGVkWzBdLmNoYXJDb2RlQXQoMCkgJiYgY29kZSA8PSBleHBlY3RlZFsxXS5jaGFyQ29kZUF0KDApKSB8fCBjaCA9PT0gZXhwZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuZGlzYWxsb3cgJiYgeyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXNhbGxvdyAmJiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR3JvdXBQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoaWxkcmVuOiBQYXR0ZXJuW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hpbGRyZW46IFBhdHRlcm5bXSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gY2hpbGQubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG1hdGNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmFtZWRQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGAke3ByZWNlZGVuY2V9LCR7c3RhY2subGFzdH0sJHtzdHJlYW0ub2Zmc2V0fSwke3RoaXMubmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGNhY2hlZCA9IGNhY2hlW2tleV07XHJcbiAgICAgICAgaWYgKGNhY2hlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWQpIHN0cmVhbS5sb2NhdGlvbiA9IGNhY2hlZC5lbmQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIHN0YWNrID0gc3RhY2sud2l0aChzdGFydC5vZmZzZXQsIHRoaXMubmFtZSk7XHJcbiAgICAgICAgY29uc3QgcGF0dGVybiA9IHJlZ2lzdHJ5LmdldCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIGlmICghcGF0dGVybiB8fCAocGF0dGVybi5wcmVjZWRlbmNlICYmIHBhdHRlcm4ucHJlY2VkZW5jZSA8IHByZWNlZGVuY2UpKSByZXR1cm4gY2FjaGVba2V5XSA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBwYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHBhdHRlcm4ucHJlY2VkZW5jZSB8fCBwYXR0ZXJuLnByZXNlcnZlUHJlY2VkZW5jZSA/IHBhdHRlcm4ucHJlY2VkZW5jZSA/PyBwcmVjZWRlbmNlIDogMSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm4gY2FjaGVba2V5XSA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlW2tleV0gPSB7IG5hbWU6IHRoaXMubmFtZSwgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbjogW21hdGNoXSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1NwZWNpYWxDaGFyYWN0ZXIoY2g6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGNoID09PSBcIiVcIiB8fCBjaCA9PT0gXCJ8XCIgfHwgY2ggPT09IFwiKFwiIHx8IGNoID09PSBcIilcIiB8fCBjaCA9PT0gXCIrXCIgfHwgY2ggPT09IFwiP1wiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVBhdHRlcm4oc3RyZWFtOiBTdHJlYW0sIHByZWNlZGVuY2U/OiBudW1iZXIsIHByZXNlcnZlUHJlY2VkZW5jZTogYm9vbGVhbiA9IGZhbHNlKTogUGF0dGVybiB7XHJcbiAgICBjb25zdCBjaGlsZHJlbjogUGF0dGVybltdID0gW107XHJcbiAgICBsZXQgb3IgPSBmYWxzZTtcclxuICAgIGxldCBjaDtcclxuICAgIHdoaWxlIChjaCA9IHN0cmVhbS5wZWVrY2goKSkge1xyXG4gICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgaWYgKGNoID09PSBcIiVcIikge1xyXG4gICAgICAgICAgICBjaCA9IHN0cmVhbS5wZWVrY2goKTtcclxuICAgICAgICAgICAgaWYgKGlzU3BlY2lhbENoYXJhY3RlcihjaCkpIHtcclxuICAgICAgICAgICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBSYXdQYXR0ZXJuKGNoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoQ2hhci5pc0xldHRlcihjaCA9IHN0cmVhbS5wZWVrY2goKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gY2g7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgRGlnaXRQYXR0ZXJuKCkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IE5hbWVkUGF0dGVybihuYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIihcIilcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChwYXJzZVBhdHRlcm4oc3RyZWFtLCBwcmVjZWRlbmNlKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiKVwiKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJbXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgZGlzYWxsb3cgPSBzdHJlYW0ucGVla2NoKCkgPT09IFwiXlwiO1xyXG4gICAgICAgICAgICBpZiAoZGlzYWxsb3cpIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwOiBDaGFyYWN0ZXJHcm91cCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcmFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgd2hpbGUgKGNoID0gc3RyZWFtLnBlZWtjaCgpKSB7XHJcbiAgICAgICAgICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gZ3JvdXAubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSBcIiVcIiAmJiBzdHJlYW0ucGVla2NoKCkgPT09IFwiXVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiLVwiICYmICFyYW5nZSAmJiBsZW4gPiAwICYmICFBcnJheS5pc0FycmF5KGdyb3VwLmF0KC0xKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKGNoKTtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdCA9IGdyb3VwLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goW2dyb3VwLnBvcCgpLCBsYXN0XSBhcyBbc3RyaW5nLCBzdHJpbmddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBDaGFyYWN0ZXJHcm91cFBhdHRlcm4oZ3JvdXAsIGRpc2FsbG93KSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCIuXCIpXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IEFueVBhdHRlcm4oKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiIFwiKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBXaGl0ZXNwYWNlUGF0dGVybigpKTtcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJ8XCIgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCAmJiAhb3IpIHtcclxuICAgICAgICAgICAgb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIj9cIiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBPcHRpb25hbFBhdHRlcm4oY2hpbGRyZW4ucG9wKCkpKTtcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCIrXCIgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgUmVwZWF0UGF0dGVybihjaGlsZHJlbi5wb3AoKSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgUmF3UGF0dGVybihjaCkpO1xyXG4gICAgICAgIGlmIChvcikge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBPclBhdHRlcm4oY2hpbGRyZW4ucG9wKCksIGNoaWxkcmVuLnBvcCgpKSk7XHJcbiAgICAgICAgICAgIG9yID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gY2hpbGRyZW4ubGVuZ3RoID09PSAxID8gY2hpbGRyZW5bMF0gOiBuZXcgR3JvdXBQYXR0ZXJuKGNoaWxkcmVuKTtcclxuICAgIHJlc3VsdC5wcmVjZWRlbmNlID0gcHJlY2VkZW5jZTtcclxuICAgIHJlc3VsdC5wcmVzZXJ2ZVByZWNlZGVuY2UgPSBwcmVzZXJ2ZVByZWNlZGVuY2U7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGF0dGVybihzb3VyY2U6IHN0cmluZywgcHJlY2VkZW5jZT86IG51bWJlciwgcHJlc2VydmVQcmVjZWRlbmNlPzogYm9vbGVhbik6IFBhdHRlcm4ge1xyXG4gICAgcmV0dXJuIHBhcnNlUGF0dGVybihuZXcgU3RyZWFtKHNvdXJjZSksIHByZWNlZGVuY2UsIHByZXNlcnZlUHJlY2VkZW5jZSk7XHJcbn0iLCJleHBvcnQgdHlwZSBMb2NhdGlvbiA9IHtcclxuICAgIG9mZnNldDogbnVtYmVyLFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sdW1uOiBudW1iZXJcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJlYW0ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBidWZmZXI6IHN0cmluZztcclxuICAgIHByaXZhdGUgX29mZnNldDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGNvbHVtbjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJ1ZmZlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gMDtcclxuICAgICAgICB0aGlzLmxpbmUgPSAwO1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jYXRpb24oKTogTG9jYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB7IG9mZnNldDogdGhpcy5fb2Zmc2V0LCBsaW5lOiB0aGlzLmxpbmUsIGNvbHVtbjogdGhpcy5jb2x1bW4gfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jYXRpb24obG9jYXRpb246IExvY2F0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gbG9jYXRpb24ub2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGluZSA9IGxvY2F0aW9uLmxpbmU7XHJcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBsb2NhdGlvbi5jb2x1bW47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9mZnNldCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xyXG4gICAgfVxyXG5cclxuICAgIHBlZWtjaCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5fb2Zmc2V0XTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBlZWtjaCgpID09PSBcIlxcblwiKSB7XHJcbiAgICAgICAgICAgICsrdGhpcy5saW5lO1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbiA9IDA7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICsrdGhpcy5jb2x1bW47XHJcbiAgICAgICAgKyt0aGlzLl9vZmZzZXQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHcmFtbWFyIH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdyYW1tYXI6IEdyYW1tYXIgPSB7XHJcbiAgICBcIm51bWJlclwiOiBcIiVkK1wiLFxyXG4gICAgXCJuYW1lXCI6IFwiW2EtekEtWl9dW2EtekEtWjAtOV9dKz9cIixcclxuICAgIFwic3RyaW5nXCI6IFwiXFxcIihbXlxcXCJdfChcXFxcXFxcXCl8KFxcXFxcXFwiKSkrP1xcXCJcIixcclxuICAgIFwiYm9vbFwiOiBcIih0cnVlKXwoZmFsc2UpXCIsXHJcbiAgICBcImFkZFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAlKyAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDVcclxuICAgIH0sXHJcbiAgICBcInN1YlwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAtICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNVxyXG4gICAgfSxcclxuICAgIFwibXVsXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICogJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA2XHJcbiAgICB9LFxyXG4gICAgXCJkaXZcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgLyAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDZcclxuICAgIH0sXHJcbiAgICBcImNvbmNhdFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciBAICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogMVxyXG4gICAgfSxcclxuICAgIFwiZXFcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPSAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcImx0XCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByIDwgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJndFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA+ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNFxyXG4gICAgfSxcclxuICAgIFwibGVcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPD0gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJnZVwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA+PSAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcIm9yXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICV8ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogMlxyXG4gICAgfSxcclxuICAgIFwiYW5kXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICYgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiAzXHJcbiAgICB9LFxyXG4gICAgXCJub3RcIjogXCIhICVleHByXCIsXHJcbiAgICBcImFyZ2xpc3RcIjogXCIoJWV4cHIoICwgJWV4cHIpKz8pP1wiLFxyXG4gICAgXCJjYWxsXCI6IFwiJW5hbWUgJSggJWFyZ2xpc3QgJSlcIixcclxuICAgIFwicGFyZW50aGVzaXNleHByXCI6IFwiJSggJWV4cHIgJSlcIixcclxuICAgIFwiZXhwclwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlcGFyZW50aGVzaXNleHByfCVudW1iZXJ8JXN0cmluZ3wlYm9vbHwlbmFtZXwlYWRkfCVzdWJ8JW11bHwlZGl2fCVjb25jYXR8JWVxfCVsdHwlZ3R8JWxlfCVnZXwlb3J8JWFuZHwlbm90fCVjYWxsXCIsXHJcbiAgICAgICAgcHJlc2VydmVQcmVjZWRlbmNlOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgXCJhc3NpZ25cIjogXCIlbmFtZSA9ICVleHByO1wiLFxyXG4gICAgXCJwYXJhbWxpc3RcIjogXCIoJW5hbWUoICwgJW5hbWUpKz8pP1wiLFxyXG4gICAgXCJpZlwiOiBcImlmICVleHByIHsgJWJvZHkgfSAlZWxzZT9cIixcclxuICAgIFwiZWxzZVwiOiBcImVsc2UgeyAlYm9keSB9XCIsXHJcbiAgICBcIndoaWxlXCI6IFwid2hpbGUgJWV4cHIgeyAlYm9keSB9XCIsXHJcbiAgICBcImZ1bmN0aW9uXCI6IFwiZm4gJW5hbWUgJSggJXBhcmFtbGlzdCAlKSB7ICVib2R5IH1cIixcclxuICAgIFwicmV0dXJuXCI6IFwicmV0ICVleHByO1wiLFxyXG4gICAgXCJjYWxsc3RhdFwiOiBcIiVjYWxsO1wiLFxyXG4gICAgXCJwcmludFwiOiBcInByaW50ICVleHByO1wiLFxyXG4gICAgXCJzdGF0ZW1lbnRcIjogXCIlYXNzaWdufCVpZnwld2hpbGV8JWZ1bmN0aW9ufCVyZXR1cm58JWNhbGxzdGF0fCVwcmludFwiLFxyXG4gICAgXCJib2R5XCI6IFwiKCAlc3RhdGVtZW50ICkrP1wiLFxyXG4gICAgXCJ1c2VcIjogXCJ1c2UgJW5hbWU7XCIsXHJcbiAgICBcImltcG9ydHNcIjogXCIoICV1c2UgKSs/XCIsXHJcbiAgICBcImxpYlwiOiBcImxpYiAlbmFtZTtcIixcclxuICAgIFwicm9vdFwiOiBcIiVsaWI/ICVpbXBvcnRzICVib2R5XCJcclxufTsiLCJpbXBvcnQgeyBOYXRpdmVMaWIgfSBmcm9tIFwiLlwiO1xyXG5cclxubGV0IGVsZW1lbnRJZCA9IC0xO1xyXG5cclxuY29uc3QgZWxlbWVudHM6IHsgW2tleTogc3RyaW5nXTogRWxlbWVudCB9ID0ge307XHJcblxyXG5mdW5jdGlvbiBzYXZlRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGtleSA9IGAjZG9tOiR7KytlbGVtZW50SWR9YDtcclxuICAgIGVsZW1lbnRzW2tleV0gPSBlbGVtZW50O1xyXG4gICAgcmV0dXJuIGtleTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudChoYW5kbGU6IHN0cmluZyk6IEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRzW2hhbmRsZV07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb21MaWIgPSBuZXcgTmF0aXZlTGliKHtcclxuICAgIGRvbV9oZWFkOiBzYXZlRWxlbWVudChkb2N1bWVudC5oZWFkKSxcclxuICAgIGRvbV9ib2R5OiBzYXZlRWxlbWVudChkb2N1bWVudC5ib2R5KVxyXG59LCB7XHJcbiAgICBkb21fdGl0bGUoWyB0aXRsZSBdKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX2NyZWF0ZShbIHRhZ05hbWUgXSkge1xyXG4gICAgICAgIHJldHVybiBzYXZlRWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpKTtcclxuICAgIH0sXHJcbiAgICBkb21fZmluZChbIHNlbGVjdG9yIF0pIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHNhdmVFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgfSxcclxuICAgIGRvbV9hcHBlbmQoWyBwYXJlbnQsIGNoaWxkIF0pIHtcclxuICAgICAgICBnZXRFbGVtZW50KHBhcmVudCk/LmFwcGVuZENoaWxkKGdldEVsZW1lbnQoY2hpbGQpID8/IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9yZW1vdmUoWyBlbGVtZW50IF0pIHtcclxuICAgICAgICBnZXRFbGVtZW50KGVsZW1lbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICBkb21fYWRkX2NsYXNzKFsgZWxlbWVudCwgY2xhc3NOYW1lIF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX3JlbW92ZV9jbGFzcyhbIGVsZW1lbnQsIGNsYXNzTmFtZSBdKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIGVsbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV90b2dnbGVfY2xhc3MoWyBlbGVtZW50LCBjbGFzc05hbWUgXSkge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IGdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICBkb21fc2V0X3RleHQoWyBlbGVtZW50LCB0ZXh0IF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmlubmVyVGV4dCA9IHRleHQ7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9zZXRfaHRtbChbIGVsZW1lbnQsIGh0bWwgXSkge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IGdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX3NldF9hdHRyKFsgZWxlbWVudCwgYXR0ciwgdmFsdWUgXSkge1xyXG4gICAgICAgIGdldEVsZW1lbnQoZWxlbWVudCk/LnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9nZXRfYXR0cihbIGVsZW1lbnQsIGF0dHIgXSkge1xyXG4gICAgICAgIHJldHVybiBnZXRFbGVtZW50KGVsZW1lbnQpPy5nZXRBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICB9LFxyXG4gICAgZG9tX2NzcyhbIGVsZW1lbnQsIGF0dHIsIHZhbHVlIF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLnN0eWxlLnNldFByb3BlcnR5KGF0dHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX2V2ZW50KFsgZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrIF0sIHNjb3BlKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBmbiA9IHNjb3BlLmZ1bmN0aW9uc1tjYWxsYmFja107XHJcbiAgICAgICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsICgpID0+IGZuKFtdLCBzY29wZSkpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgU1NGdW5jdGlvbiB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBOYXRpdmVMaWIgfSBmcm9tIFwiLlwiO1xyXG5cclxubGV0IGZ1bmNJZCA9IC0xO1xyXG5cclxuY29uc3QgZnVuY3M6IHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9ID0ge307XHJcblxyXG5leHBvcnQgY29uc3QgZm5MaWIgPSBuZXcgTmF0aXZlTGliKHt9LCB7XHJcbiAgICBmbihbIG5hbWUgXSwgeyBmdW5jdGlvbnMgfSkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGAjZm46JHsrK2Z1bmNJZH1gO1xyXG4gICAgICAgIGZ1bmNzW2tleV0gPSBmdW5jdGlvbnNbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH0sXHJcbiAgICBjYWxsKFsgZm4sIC4uLmFyZ3MgXSwgc2NvcGUpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3NbZm5dPy4oYXJncywgc2NvcGUpID8/IFwidW5rbm93blwiO1xyXG4gICAgfVxyXG59KTsiLCJpbXBvcnQgeyBTU0Z1bmN0aW9uLCBTY29wZSwgU2lnbWFTY3JpcHQgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHRcIjtcclxuaW1wb3J0IHsgQVNURWxlbWVudCB9IGZyb20gXCIuLi8uLi9wYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaWdtYVNjcmlwdExpYiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2dyYW06IEFTVEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvZ3JhbTogQVNURWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XHJcbiAgICB9XHJcblxyXG4gICAgdXNlKHNpZ21hU2NyaXB0OiBTaWdtYVNjcmlwdCwgc2NvcGU6IFNjb3BlKSB7XHJcbiAgICAgICAgY29uc3QgbGliU2NvcGUgPSBzaWdtYVNjcmlwdC5leGVjdXRlKHRoaXMucHJvZ3JhbSk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS52YXJpYWJsZXMsIGxpYlNjb3BlLnZhcmlhYmxlcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS5mdW5jdGlvbnMsIGxpYlNjb3BlLmZ1bmN0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYXRpdmVMaWIge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHZhcmlhYmxlczogUmVhZG9ubHk8eyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfT47XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25zOiBSZWFkb25seTx7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfT47XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBmdW5jdGlvbnM6IHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9KSB7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSB2YXJpYWJsZXM7XHJcbiAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSBmdW5jdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgdXNlKHNjb3BlOiBTY29wZSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2NvcGUudmFyaWFibGVzLCB0aGlzLnZhcmlhYmxlcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS5mdW5jdGlvbnMsIHRoaXMuZnVuY3Rpb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE5hdGl2ZUxpYiB9IGZyb20gXCIuXCI7XHJcblxyXG5sZXQgb2JqZWN0SWQgPSAtMTtcclxuXHJcbmNvbnN0IG9iamVjdHM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcclxuXHJcbmZ1bmN0aW9uIHNhdmVPYmplY3Qob2JqZWN0OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qga2V5ID0gYCNqczokeysrb2JqZWN0SWR9YDtcclxuICAgIG9iamVjdHNba2V5XSA9IG9iamVjdDtcclxuICAgIHJldHVybiBrZXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdChoYW5kbGU6IHN0cmluZyk6IGFueSB7XHJcbiAgICByZXR1cm4gb2JqZWN0c1toYW5kbGVdO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0pTKHZhbHVlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCIjanM6XCIpKSByZXR1cm4gZ2V0T2JqZWN0KHZhbHVlKTtcclxuICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmtub3duXCIpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYgKHZhbHVlID09PSBcInRydWVcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgY29uc3QgbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlKTtcclxuICAgIGlmICghTnVtYmVyLmlzTmFOKG51bWJlcikpIHJldHVybiBudW1iZXI7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvU1ModmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8XHJcbiAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIiB8fCB2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4gfHxcclxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICByZXR1cm4gc2F2ZU9iamVjdCh2YWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBqc0xpYiA9IG5ldyBOYXRpdmVMaWIoe1xyXG4gICAganNfd2luZG93OiBzYXZlT2JqZWN0KHdpbmRvdylcclxufSwge1xyXG4gICAganMoWyBjb2RlIF0pIHtcclxuICAgICAgICByZXR1cm4gdG9TUyhldmFsKGNvZGUpKTtcclxuICAgIH0sXHJcbiAgICBqc19nZXQoWyBoYW5kbGUsIHByb3BlcnR5IF0pIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldE9iamVjdChoYW5kbGUpPy5bcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRvU1ModmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGpzX3NldChbIGhhbmRsZSwgcHJvcGVydHksIHZhbHVlIF0pIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBnZXRPYmplY3QoaGFuZGxlKTtcclxuICAgICAgICBpZiAob2JqZWN0ICE9IG51bGwpIG9iamVjdFtwcm9wZXJ0eV0gPSB0b0pTKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAganNfbmV3KFsgaGFuZGxlLCAuLi5hcmdzIF0pIHtcclxuICAgICAgICBjb25zdCBjdG9yID0gZ2V0T2JqZWN0KGhhbmRsZSk7XHJcbiAgICAgICAgaWYgKGN0b3IgPT0gbnVsbCkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IGN0b3IoLi4uYXJncy5tYXAodG9KUykpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRvU1ModmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGpzX2NhbGwoWyBoYW5kbGUsIC4uLmFyZ3MgXSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0T2JqZWN0KGhhbmRsZSk/LiguLi5hcmdzLm1hcCh0b0pTKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdG9TUyh2YWx1ZSk7XHJcbiAgICB9LFxyXG4gICAganNfY2FsbF9tZXRob2QoWyBoYW5kbGUsIG1ldGhvZCwgLi4uYXJncyBdKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRPYmplY3QoaGFuZGxlKT8uW21ldGhvZF0/LiguLi5hcmdzLm1hcCh0b0pTKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdG9TUyh2YWx1ZSk7XHJcbiAgICB9XHJcbn0pOyIsImltcG9ydCB7IE5hdGl2ZUxpYiB9IGZyb20gXCIuXCI7XHJcblxyXG5sZXQgcmVmSWQgPSAtMTtcclxuXHJcbmNvbnN0IHJlZnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWZMaWIgPSBuZXcgTmF0aXZlTGliKHt9LCB7XHJcbiAgICByZWYoWyBpbml0aWFsVmFsdWUgXSkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGAjcmVmOiR7KytyZWZJZH1gO1xyXG4gICAgICAgIHJlZnNba2V5XSA9IGluaXRpYWxWYWx1ZSA/PyBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgfSxcclxuICAgIHJlZl9zZXQoWyByZWYsIHZhbHVlIF0pIHtcclxuICAgICAgICByZWZzW3JlZl0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgcmVmX2dldChbIHJlZiBdKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlZnNbcmVmXSA/PyBcInVua25vd25cIjtcclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgQVNURWxlbWVudCwgR3JhbW1hciwgUGFyc2VyLCBpbmhlcml0IH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5pbXBvcnQgeyBTaWdtYVNjcmlwdExpYiB9IGZyb20gXCIuL2xpYlwiO1xyXG5pbXBvcnQgeyBkb21MaWIgfSBmcm9tIFwiLi9saWIvZG9tXCI7XHJcbmltcG9ydCB7IGZuTGliIH0gZnJvbSBcIi4vbGliL2ZuXCI7XHJcbmltcG9ydCB7IGpzTGliIH0gZnJvbSBcIi4vbGliL2pzXCI7XHJcbmltcG9ydCB7IHJlZkxpYiB9IGZyb20gXCIuL2xpYi9yZWZcIjtcclxuaW1wb3J0IHsgZ3JhbW1hciB9IGZyb20gXCIuL2dyYW1tYXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY29wZSB7XHJcbiAgICByZWFkb25seSB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgIHJlYWRvbmx5IGZ1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZT86IFNjb3BlKSB7XHJcbiAgICAgICAgaWYgKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzID0geyAuLi5zY29wZS52YXJpYWJsZXMgfTtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSB7IC4uLnNjb3BlLmZ1bmN0aW9ucyB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIFNTRnVuY3Rpb24gPSAoYXJnczogc3RyaW5nW10sIHNjb3BlOiBTY29wZSkgPT4gc3RyaW5nO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpZ21hU2NyaXB0IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyc2VyOiBQYXJzZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxpYnM6IHsgW2tleTogc3RyaW5nXTogU2lnbWFTY3JpcHRMaWIgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lcmdlR3JhbW1hcjogUGFydGlhbDxHcmFtbWFyPiA9IHt9KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKGluaGVyaXQoZ3JhbW1hciwgbWVyZ2VHcmFtbWFyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBhcnNlSW1wb3J0cyhpbXBvcnRzOiBBU1RFbGVtZW50LCBzY29wZTogU2NvcGUpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHVzZSBvZiBpbXBvcnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB1c2UuZmluZChcIm5hbWVcIikudmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lIGluIHRoaXMubGlicykgdGhpcy5saWJzW25hbWVdLnVzZSh0aGlzLCBzY29wZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJqc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc0xpYi51c2Uoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZG9tXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbUxpYi51c2Uoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmVmXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZkxpYi51c2Uoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZm5cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5MaWIudXNlKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwYXJzZVN0cmluZyhyYXc6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiByYXcuc2xpY2UoMSwgLTEpLnJlcGxhY2UoL1xcXFxcXFwiL2csIFwiXFxcIlwiKS5yZXBsYWNlKC9cXFxcXFxcXC9nLCBcIlxcXFxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV2YWxFeHByKGV4cHI6IEFTVEVsZW1lbnQsIHNjb3BlOiBTY29wZSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKGV4cHIubmFtZSA9PT0gXCJleHByXCIpXHJcbiAgICAgICAgICAgIGV4cHIgPSBleHByLmZpcnN0O1xyXG4gICAgICAgIHN3aXRjaCAoZXhwci5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwYXJlbnRoZXNpc2V4cHJcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS52YXJpYWJsZXNbZXhwci52YWx1ZV0gPz8gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcclxuICAgICAgICAgICAgY2FzZSBcImJvb2xcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBleHByLnZhbHVlO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVN0cmluZyhleHByLnZhbHVlKTtcclxuICAgICAgICAgICAgY2FzZSBcImFkZFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE51bWJlci5wYXJzZUludChhKSArIE51bWJlci5wYXJzZUludChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcInN1YlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE51bWJlci5wYXJzZUludChhKSAtIE51bWJlci5wYXJzZUludChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIm11bFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE51bWJlci5wYXJzZUludChhKSAqIE51bWJlci5wYXJzZUludChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImRpdlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IH5+KE51bWJlci5wYXJzZUludChhKSAvIE51bWJlci5wYXJzZUludChiKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHJlc3VsdCkgPyBcInVua25vd25cIiA6IGAke3Jlc3VsdH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJlcVwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID09PSBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYSkgfHwgTnVtYmVyLmlzTmFOKGIpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA8IGJ9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwiZ3RcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5sYXN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihhKSB8fCBOdW1iZXIuaXNOYU4oYikpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID4gYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJsZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGEpIHx8IE51bWJlci5pc05hTihiKSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPD0gYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJnZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGEpIHx8IE51bWJlci5pc05hTihiKSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPj0gYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJvclwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID09PSBcInRydWVcIiB8fCBiID09PSBcInRydWVcIn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJhbmRcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHRoaXMuZXZhbEV4cHIoZXhwci5sYXN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA9PT0gXCJ0cnVlXCIgJiYgYiA9PT0gXCJ0cnVlXCJ9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwibm90XCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSkgPT09IFwidHJ1ZVwiID8gXCJmYWxzZVwiIDogXCJ0cnVlXCJ9YDtcclxuICAgICAgICAgICAgY2FzZSBcImNvbmNhdFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhICsgYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwiY2FsbFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZXhwci5maW5kKFwibmFtZVwiKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBzY29wZS5mdW5jdGlvbnNbbmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZ1bmMpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGV4cHIuZmluZChcImFyZ2xpc3RcIikpLm1hcCgoYXJnKSA9PiB0aGlzLmV2YWxFeHByKGFyZywgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jKGFyZ3MsIHNjb3BlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50OiBBU1RFbGVtZW50LCBzY29wZTogU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdGVtZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImFzc2lnblwiOlxyXG4gICAgICAgICAgICAgICAgc2NvcGUudmFyaWFibGVzW3N0YXRlbWVudC5maW5kKFwibmFtZVwiKS52YWx1ZV0gPSB0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpZlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24gPT09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZXhlYyhzdGF0ZW1lbnQuZmluZChcImJvZHlcIiksIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsc2VTdGF0ZW1lbnQgPSBzdGF0ZW1lbnQuZmluZENoaWxkKFwiZWxzZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbHNlU3RhdGVtZW50ICYmIGNvbmRpdGlvbiA9PT0gXCJmYWxzZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZXhlYyhlbHNlU3RhdGVtZW50LmZpbmQoXCJib2R5XCIpLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIndoaWxlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHIgPSBzdGF0ZW1lbnQuZmluZChcImV4cHJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZXZhbEV4cHIoZXhwciwgc2NvcGUpID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXhlYyhib2R5LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gQXJyYXkuZnJvbShzdGF0ZW1lbnQuZmluZChcInBhcmFtbGlzdFwiKSkubWFwKChwYXJhbSkgPT4gcGFyYW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuZnVuY3Rpb25zW3N0YXRlbWVudC5maW5kKFwibmFtZVwiKS52YWx1ZV0gPSAoYXJnczogc3RyaW5nW10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFNjb3BlID0gdGhpcy5uZXdTY29wZShzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2YgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXJnKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS52YXJpYWJsZXNbcGFyYW1dID0gYXJnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWMoYm9keSwgbG9jYWxTY29wZSkgPz8gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiY2FsbHN0YXRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJldHVyblwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpbmQoXCJleHByXCIpLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgZXhlYyhib2R5OiBBU1RFbGVtZW50LCBzY29wZTogU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGZvciAoY29uc3QgeyBmaXJzdDogc3RhdGVtZW50IH0gb2YgYm9keSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50LCBzY29wZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgbG9hZFNjcmlwdChzY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpICE9PSBcInRleHQvc2lnbWFzY3JpcHRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBzb3VyY2U7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5oYXNBdHRyaWJ1dGUoXCJzcmNcIikpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChzY3JpcHQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKTtcclxuICAgICAgICAgICAgc291cmNlID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzb3VyY2UgPSBzY3JpcHQuaW5uZXJUZXh0O1xyXG4gICAgICAgIHRoaXMubG9hZChzb3VyY2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0TG9hZGVyKCkge1xyXG4gICAgICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIilcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgbXV0YXRpb24uYWRkZWROb2RlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MU2NyaXB0RWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNjcmlwdChub2RlKTtcclxuICAgICAgICB9KS5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHNjcmlwdCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSlcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NyaXB0KHNjcmlwdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG5ld1Njb3BlKHBhcmVudD86IFNjb3BlKTogU2NvcGUge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2NvcGUocGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBleGVjdXRlKHByb2dyYW06IEFTVEVsZW1lbnQpOiBTY29wZSB7XHJcbiAgICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLm5ld1Njb3BlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJzZUltcG9ydHMocHJvZ3JhbS5maW5kKFwiaW1wb3J0c1wiKSwgc2NvcGUpO1xyXG4gICAgICAgIHRoaXMuZXhlYyhwcm9ncmFtLmZpbmQoXCJib2R5XCIpLCBzY29wZSk7XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoc291cmNlOiBzdHJpbmcpOiBTY29wZSB7XHJcbiAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHRoaXMucGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbiAgICAgICAgaWYgKCFwcm9ncmFtIHx8IHByb2dyYW0uZW5kLm9mZnNldCAhPT0gc291cmNlLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGxpYiA9IHByb2dyYW0uZmluZENoaWxkKFwibGliXCIpO1xyXG4gICAgICAgIGlmIChsaWIpXHJcbiAgICAgICAgICAgIHRoaXMubGlic1tsaWIuZmluZChcIm5hbWVcIikudmFsdWVdID0gbmV3IFNpZ21hU2NyaXB0TGliKHByb2dyYW0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShwcm9ncmFtKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNjb3BlLCBTaWdtYVNjcmlwdCB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdC9zaWdtYXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBBU1RFbGVtZW50LCBHcmFtbWFyIH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5pbXBvcnQgeyBkb21MaWIgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHQvbGliL2RvbVwiO1xyXG5cclxuLypcclxudXNlIGRvbTtcclxuXHJcbmRvbV9hcHBlbmQoZG9tX2JvZHksXHJcbiAgICA8ZGl2IGF0dHI9XCJ0ZXN0XCI+XHJcbiAgICAgICAgPHNwYW4+SGVsbG8gd29ybGQhIDIgKyAyID0gezIgKyAyfTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG4qL1xyXG5cclxuLypcclxudXNlIGRvbTtcclxuXHJcbmZuIDx0ZXN0IGNsYXNzPVwiZGVmYXVsdFwiID4ge1xyXG4gICAgcmV0IDxzcGFuIGNsYXNzPXtjbGFzc30+eyBjaGlsZHJlbiB9PC9zcGFuPjtcclxufVxyXG5cclxuZG9tX2FwcGVuZChkb21fYm9keSxcclxuICAgIDxkaXY+XHJcbiAgICAgICAgPHRlc3QgY2xhc3M9XCJ0ZXN0XCI+SGVsbG8gd29ybGQhPC90ZXN0PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcbiovXHJcblxyXG5jb25zdCBncmFtbWFyOiBQYXJ0aWFsPEdyYW1tYXI+ID0ge1xyXG4gICAgXCJodG1sbmFtZVwiOiBcIlthLXowLTktXStcIixcclxuICAgIFwiaHRtbGF0dHJ2YWxcIjogXCIlc3RyaW5nfCh7ICVleHByIH0pXCIsXHJcbiAgICBcImh0bWxhdHRyXCI6IFwiJWh0bWxuYW1lPSVodG1sYXR0cnZhbFwiLFxyXG4gICAgXCJodG1sZW50aXR5XCI6IFwiJiVodG1sbmFtZTtcIixcclxuICAgIFwiaHRtbHRleHRcIjogXCIoW14mPD57fV0pK1wiLFxyXG4gICAgXCJodG1sY29udGVudFwiOiBcIiglaHRtbHRleHR8JWh0bWxlbnRpdHl8KHsgJWV4cHIgfSl8JWh0bWwpKz9cIixcclxuICAgIFwiaHRtbHNpbmdsZVwiOiBcIjwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8gLz5cIixcclxuICAgIFwiaHRtbHBhaXJlZFwiOiBcIjwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8+JWh0bWxjb250ZW50PC8laHRtbG5hbWU+XCIsXHJcbiAgICBcImh0bWxcIjogXCIlaHRtbHNpbmdsZXwlaHRtbHBhaXJlZFwiLFxyXG4gICAgXCJleHByXCI6IFwiLi4ufCVodG1sXCIsXHJcbiAgICBcImNvbXBvbmVudFwiOiBcImZuIDwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8+IHsgJWJvZHkgfVwiLFxyXG4gICAgXCJzdGF0ZW1lbnRcIjogXCIuLi58JWNvbXBvbmVudFwiXHJcbn07XHJcblxyXG5jb25zdCBodG1sZW50aXRpZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XHJcbiAgICBcImFtcFwiOiBcIiZcIixcclxuICAgIFwibHRcIjogXCI8XCIsXHJcbiAgICBcImd0XCI6IFwiPlwiXHJcbn07XHJcblxyXG5jbGFzcyBTU1hTY29wZSBleHRlbmRzIFNjb3BlIHtcclxuICAgIHJlYWRvbmx5IGNvbXBvbmVudHM6IHsgW2tleTogc3RyaW5nXTogKGNoaWxkcmVuOiBzdHJpbmcsIGF0dHJ2YWxzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSA9PiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlPzogU2NvcGUpIHtcclxuICAgICAgICBzdXBlcihzY29wZSk7XHJcbiAgICAgICAgaWYgKHNjb3BlIGluc3RhbmNlb2YgU1NYU2NvcGUpXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHsgLi4uc2NvcGUuY29tcG9uZW50cyB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2lnbWFTY3JpcHRYIGV4dGVuZHMgU2lnbWFTY3JpcHQge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBncm91cHM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBncm91cElkID0gLTE7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoZ3JhbW1hcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBhcnNlSFRNTENvbnRlbnQoaHRtbGNvbnRlbnQ6IEFTVEVsZW1lbnQsIHNjb3BlOiBTU1hTY29wZSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbjogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGh0bWxjb250ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICAgICAgc3dpdGNoIChjaGlsZC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaHRtbHRleHRcIjpcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNoaWxkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImh0bWxlbnRpdHlcIjpcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGh0bWxlbnRpdGllc1tjaGlsZC5maW5kKFwiaHRtbG5hbWVcIikudmFsdWVdID8/IGNoaWxkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImV4cHJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJodG1sXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWxFeHByKGNoaWxkLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3Vwc1t2YWx1ZV07XHJcbiAgICAgICAgICAgIGlmIChncm91cClcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goLi4uZ3JvdXApO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBldmFsRXhwcihleHByOiBBU1RFbGVtZW50LCBzY29wZTogU1NYU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChleHByLm5hbWUgPT09IFwiZXhwclwiKVxyXG4gICAgICAgICAgICBleHByID0gZXhwci5maXJzdDtcclxuICAgICAgICBzd2l0Y2ggKGV4cHIubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaHRtbFwiOiB7XHJcbiAgICAgICAgICAgICAgICBleHByID0gZXhwci5maXJzdDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUGFpcmVkID0gZXhwci5uYW1lID09PSBcImh0bWxwYWlyZWRcIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhZ05hbWUgPSBleHByLmZpcnN0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkICYmIGV4cHIubGFzdC52YWx1ZSAhPT0gdGFnTmFtZSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gc2NvcGUuY29tcG9uZW50c1t0YWdOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRydmFsczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBleHByLmZpbmRDaGlsZHJlbihcImh0bWxhdHRyXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRydmFsc1thdHRyLmZpbmQoXCJodG1sbmFtZVwiKS52YWx1ZV0gPSB0aGlzLmV2YWxFeHByKGF0dHIuZmluZChcImh0bWxhdHRydmFsXCIpLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gYCNzc3hncm91cDokeysrdGhpcy5ncm91cElkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBzW2NoaWxkcmVuXSA9IHRoaXMucGFyc2VIVE1MQ29udGVudChleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50KGNoaWxkcmVuLCBhdHRydmFscyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb21MaWIuZnVuY3Rpb25zLmRvbV9jcmVhdGUoW3RhZ05hbWVdLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGV4cHIuZmluZENoaWxkcmVuKFwiaHRtbGF0dHJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbUxpYi5mdW5jdGlvbnMuZG9tX3NldF9hdHRyKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyLmZpbmQoXCJodG1sbmFtZVwiKS52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZhbEV4cHIoYXR0ci5maW5kKFwiaHRtbGF0dHJ2YWxcIikuZmlyc3QsIHNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMucGFyc2VIVE1MQ29udGVudChleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgc2NvcGUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTGliLmZ1bmN0aW9ucy5kb21fYXBwZW5kKFtlbGVtZW50LCBjaGlsZF0sIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmV2YWxFeHByKGV4cHIsIHNjb3BlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50OiBBU1RFbGVtZW50LCBzY29wZTogU1NYU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdGVtZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImNvbXBvbmVudFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzdGF0ZW1lbnQuZmluZENoaWxkcmVuKFwiaHRtbGF0dHJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbYXR0ci5maW5kKFwiaHRtbG5hbWVcIikudmFsdWVdID0gdGhpcy5ldmFsRXhwcihhdHRyLmZpbmQoXCJodG1sYXR0cnZhbFwiKS5maXJzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY29tcG9uZW50c1tzdGF0ZW1lbnQuZmluZChcImh0bWxuYW1lXCIpLnZhbHVlXSA9IChjaGlsZHJlbjogc3RyaW5nLCBhdHRydmFsczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsU2NvcGUgPSB0aGlzLm5ld1Njb3BlKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLnZhcmlhYmxlcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0cm5hbWUgaW4gYXR0cnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUudmFyaWFibGVzW2F0dHJuYW1lXSA9IGF0dHJ2YWxzW2F0dHJuYW1lXSA/PyBhdHRyc1thdHRybmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlYyhib2R5LCBsb2NhbFNjb3BlKSA/PyBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50LCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBuZXdTY29wZShwYXJlbnQ/OiBTY29wZSk6IFNTWFNjb3BlIHtcclxuICAgICAgICByZXR1cm4gbmV3IFNTWFNjb3BlKHBhcmVudCk7XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNpZ21hU2NyaXB0WCBhcyBTaWdtYVNjcmlwdCB9IGZyb20gXCIuL3NpZ21hc2NyaXB0eC9zaWdtYXNjcmlwdHhcIjtcclxuXHJcbmNvbnN0IGRlbW9zOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge1xyXG4gICAgXCJoZWxsby13b3JsZFwiOiBgcHJpbnQgXCJIZWxsbyB3b3JsZCFcIjtgLFxyXG4gICAgXCJzdHJ1Y3R1cmVzXCI6IGBcclxucHJpbnQgXCJsb29wIGZyb20gMSB0byAxMFwiO1xyXG54ID0gMDtcclxud2hpbGUgeCA8IDEwIHtcclxuICAgIHggPSB4ICsgMTtcclxuICAgIHByaW50IHg7XHJcbn1cclxuICAgIFxyXG5pZiB4ID0gMTAge1xyXG4gICAgcHJpbnQgXCJ4ID0gMTBcIjtcclxufSBlbHNlIHtcclxuICAgIHByaW50IFwieCDiiaAgMTBcIjtcclxufVxyXG5gLFxyXG4gICAgXCJmaWJvbmFjY2lcIjogYFxyXG5mbiBmaWIobikge1xyXG4gICAgaWYgbiA9IDEgfCBuID0gMiB7IHJldCAxOyB9XHJcbiAgICByZXQgZmliKG4gLSAxKSArIGZpYihuIC0gMik7XHJcbn1cclxuXHJcbnByaW50IFwiMTB0aCBGaWJvbmFjY2kgbnVtYmVyIGlzIFwiIEAgZmliKDEwKTtcclxuYCxcclxuICAgIFwiZG9tXCI6IGBcclxudXNlIGRvbTtcclxudXNlIGpzO1xyXG5cclxucHJvbXB0ID0ganNfZ2V0KGpzX3dpbmRvdywgXCJwcm9tcHRcIik7XHJcbmNvbG9yID0ganNfY2FsbChwcm9tcHQsIFwiRW50ZXIgYmFja2dyb3VuZCBjb2xvclwiLCBcIndoaXRlXCIpO1xyXG5kb21fY3NzKGRvbV9ib2R5LCBcImJhY2tncm91bmQtY29sb3JcIiwgY29sb3IpO1xyXG5gLFxyXG4gICAgXCJyZWZcIjogYFxyXG51c2UgcmVmO1xyXG5cclxuZm4gaW5jKHJlZikge1xyXG4gICAgcmVmX3NldChyZWYsIHJlZl9nZXQocmVmKSArIDEpO1xyXG59XHJcblxyXG54ID0gcmVmKDApO1xyXG5wcmludCBcInggPSBcIiBAIHJlZl9nZXQoeCk7XHJcblxyXG5pbmMoeCk7XHJcbnByaW50IFwieCA9IFwiIEAgcmVmX2dldCh4KTtcclxuYCxcclxuICAgIFwiY2FsbGJhY2tzXCI6IGBcclxudXNlIGZuO1xyXG5cclxuZm4gZm9vKCkge1xyXG4gICAgcHJpbnQgXCJJIGFtIGZvb1wiO1xyXG4gICAgcmV0IDEyMztcclxufVxyXG5cclxuZm4gYmFyKGNhbGxiYWNrKSB7XHJcbiAgICBwcmludCBcIkkgYW0gYmFyXCI7XHJcbiAgICBwcmludCBcIkkgZ290IFwiIEAgY2FsbChjYWxsYmFjaykgQCBcIiBmcm9tIGNhbGxiYWNrXCI7XHJcbn1cclxuXHJcbmJhcihmbihcImZvb1wiKSk7YFxyXG59O1xyXG5cclxuY29uc3Qgc2lnbWFTY3JpcHQgPSBuZXcgU2lnbWFTY3JpcHQoKTtcclxuXHJcbmNvbnN0IGNvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvZGVcIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuY29uc3QgcnVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5cIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmNvbnN0IGRlbW9TZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbW8tc2VsZWN0XCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxucnVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBpZiAoIXNpZ21hU2NyaXB0LmxvYWQoY29kZS52YWx1ZSkpXHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImludmFsaWQgc3ludGF4XCIpO1xyXG59KTtcclxuXHJcbmRlbW9TZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb2RlLnZhbHVlID0gZGVtb3NbZGVtb1NlbGVjdC52YWx1ZV0udHJpbSgpO1xyXG59KTtcclxuXHJcbmNvZGUudmFsdWUgPSBkZW1vc1tcImhlbGxvLXdvcmxkXCJdLnRyaW0oKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=