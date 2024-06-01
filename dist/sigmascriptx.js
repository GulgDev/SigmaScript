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
/*!***********************************!*\
  !*** ./src/sigmascriptx/index.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sigmascriptx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sigmascriptx */ "./src/sigmascriptx/sigmascriptx.ts");

new _sigmascriptx__WEBPACK_IMPORTED_MODULE_0__.SigmaScriptX().initLoader();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO1lBQzFELENBQUM7WUFDRCxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDMUQsQ0FBQztZQUNELEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO1lBQzFELENBQUM7WUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTyxTQUFTLENBQUM7Z0JBQ3pELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEIsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTyxTQUFTLENBQUM7Z0JBQ3pELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEIsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTyxTQUFTLENBQUM7Z0JBQ3pELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxD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b0JBQzNHLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3hDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztvQkFDekMsS0FBSyxNQUFNLFFBQVEsSUFBSSxLQUFLO3dCQUN4QixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGNBQVEsQ0FBQyxRQUFRLENBQUMsbUNBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMzRSxPQUFPLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxtQ0FBSSxTQUFTLENBQUM7Z0JBQ3BELENBQUMsQ0FBQztnQkFDRixNQUFNO1lBQ1YsQ0FBQztZQUNEO2dCQUNJLE9BQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNMLENBQUM7SUFFUyxRQUFRLENBQUMsTUFBYztRQUM3QixPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjs7Ozs7OztVQzNKRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjhDO0FBRTlDLElBQUksdURBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvcGFyc2VyL2NoYXIudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvcGFyc2VyL2luZGV4LnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3BhcnNlci9wYXR0ZXJuLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3BhcnNlci9zdHJlYW0udHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvZ3JhbW1hci50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9saWIvZG9tLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9mbi50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC8uL3NyYy9zaWdtYXNjcmlwdC9saWIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvbGliL2pzLnRzIiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0L2xpYi9yZWYudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHQvc2lnbWFzY3JpcHQudHMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvLi9zcmMvc2lnbWFzY3JpcHR4L3NpZ21hc2NyaXB0eC50cyIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2lnbWFzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zaWdtYXNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NpZ21hc2NyaXB0Ly4vc3JjL3NpZ21hc2NyaXB0eC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgbmFtZXNwYWNlIENoYXIge1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoID09PSBcIiBcIiB8fCBjaCA9PT0gXCJcXG5cIiB8fCBjaCA9PT0gXCJcXHJcIjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFjaCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBjaC5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBjb2RlID49IDQ4ICYmIGNvZGUgPD0gNTc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzTGV0dGVyKGNoOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIWNoKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGNoLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICByZXR1cm4gY29kZSA+PSA5NyAmJiBjb2RlIDw9IDEyMjtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1hdGNoLCBQYXR0ZXJuLCBwYXR0ZXJuIH0gZnJvbSBcIi4vcGF0dGVyblwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiwgU3RyZWFtIH0gZnJvbSBcIi4vc3RyZWFtXCI7XHJcblxyXG50eXBlIERlZmluaXRpb24gPSB7XHJcbiAgICBwcmVjZWRlbmNlPzogbnVtYmVyLFxyXG4gICAgcHJlc2VydmVQcmVjZWRlbmNlPzogYm9vbGVhbixcclxuICAgIHBhdHRlcm46IHN0cmluZ1xyXG59IHwgc3RyaW5nO1xyXG5cclxuZXhwb3J0IHR5cGUgR3JhbW1hciA9IHtcclxuICAgIFtrZXk6IHN0cmluZ106IERlZmluaXRpb24sXHJcbiAgICByb290OiBEZWZpbml0aW9uXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgQVNURWxlbWVudCB7XHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBzdGFydDogTG9jYXRpb247XHJcbiAgICByZWFkb25seSBlbmQ6IExvY2F0aW9uO1xyXG4gICAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoaWxkcmVuOiBBU1RFbGVtZW50W107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBzdGFydDogTG9jYXRpb24sIGVuZDogTG9jYXRpb24sIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcclxuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmaXJzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblswXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGFzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5hdCgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICAgICAgeWllbGQgY2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQ6IEFTVEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChpbmRleDogbnVtYmVyKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQ2hpbGRyZW4obmFtZTogc3RyaW5nKTogQVNURWxlbWVudFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZC5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQ2hpbGQobmFtZTogc3RyaW5nKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbmQoKGNoaWxkKSA9PiBjaGlsZC5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kKG5hbWU6IHN0cmluZyk6IEFTVEVsZW1lbnQgfCBudWxsIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuZmluZENoaWxkKG5hbWUpO1xyXG4gICAgICAgIGlmIChjaGlsZCkgcmV0dXJuIGNoaWxkO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjb25zdCBkZXNjZW5kYW50ID0gY2hpbGQuZmluZChuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGRlc2NlbmRhbnQpIHJldHVybiBkZXNjZW5kYW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnNlciB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm5zOiBNYXA8c3RyaW5nLCBQYXR0ZXJuPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihncmFtbWFyOiBHcmFtbWFyKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBbbmFtZSwgZGVmaW5pdGlvbl0gb2YgT2JqZWN0LmVudHJpZXMoZ3JhbW1hcikpXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgICAgIHRoaXMucGF0dGVybnMuc2V0KG5hbWUsIHBhdHRlcm4oZGVmaW5pdGlvbikpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdHRlcm5zLnNldChuYW1lLCBwYXR0ZXJuKGRlZmluaXRpb24ucGF0dGVybiwgZGVmaW5pdGlvbi5wcmVjZWRlbmNlLCBkZWZpbml0aW9uLnByZXNlcnZlUHJlY2VkZW5jZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKGJ1ZmZlcjogc3RyaW5nKTogQVNURWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIGZ1bmN0aW9uIHZpc2l0KGN1cnJlbnQ6IE1hdGNoLCBwYXJlbnQ6IEFTVEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UGFyZW50ID0gbmV3IEFTVEVsZW1lbnQoY3VycmVudC5uYW1lLCBjdXJyZW50LnN0YXJ0LCBjdXJyZW50LmVuZCwgYnVmZmVyLnNsaWNlKGN1cnJlbnQuc3RhcnQub2Zmc2V0LCBjdXJyZW50LmVuZC5vZmZzZXQpKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZChuZXdQYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gbmV3UGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50LmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjdXJyZW50LmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0KGNoaWxkLCBwYXJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnBhdHRlcm5zLmdldChcInJvb3RcIikubWF0Y2gobmV3IFN0cmVhbShidWZmZXIpLCB0aGlzLnBhdHRlcm5zKTtcclxuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IG5ldyBBU1RFbGVtZW50KFwicm9vdFwiLCBtYXRjaC5zdGFydCwgbWF0Y2guZW5kLCBidWZmZXIuc2xpY2UobWF0Y2guc3RhcnQub2Zmc2V0LCBtYXRjaC5lbmQub2Zmc2V0KSk7XHJcbiAgICAgICAgdmlzaXQobWF0Y2gsIHJvb3QpO1xyXG4gICAgICAgIHJldHVybiByb290O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZVBhdHRlcm5zKGE6IHN0cmluZywgYjogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYi5yZXBsYWNlKC9cXC5cXC5cXC4vZywgYSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlKGE6IERlZmluaXRpb24sIGI6IERlZmluaXRpb24pOiBEZWZpbml0aW9uIHtcclxuICAgIGlmICghYSkgcmV0dXJuIGI7XHJcbiAgICBpZiAoIWIpIHJldHVybiBhO1xyXG4gICAgaWYgKHR5cGVvZiBhID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiBiID09PSBcInN0cmluZ1wiKSByZXR1cm4gbWVyZ2VQYXR0ZXJucyhhLCBiKTtcclxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgYiAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIHsgLi4uYiwgcGF0dGVybjogbWVyZ2VQYXR0ZXJucyhhLCBiLnBhdHRlcm4pIH07XHJcbiAgICBpZiAodHlwZW9mIGEgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGIgPT09IFwic3RyaW5nXCIpIHJldHVybiB7IC4uLmEsIHBhdHRlcm46IG1lcmdlUGF0dGVybnMoYS5wYXR0ZXJuLCBiKSB9O1xyXG4gICAgaWYgKHR5cGVvZiBhICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBiICE9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBhdHRlcm46IG1lcmdlUGF0dGVybnMoYS5wYXR0ZXJuLCBiLnBhdHRlcm4pLFxyXG4gICAgICAgICAgICBwcmVjZWRlbmNlOiBiLnByZWNlZGVuY2UgPz8gYS5wcmVjZWRlbmNlLFxyXG4gICAgICAgICAgICBwcmVzZXJ2ZVByZWNlZGVuY2U6IGIucHJlc2VydmVQcmVjZWRlbmNlID8/IGEucHJlc2VydmVQcmVjZWRlbmNlXHJcbiAgICAgICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaGVyaXQocGFyZW50OiBHcmFtbWFyLCBncmFtbWFyOiBQYXJ0aWFsPEdyYW1tYXI+KTogR3JhbW1hciB7XHJcbiAgICBjb25zdCByZXN1bHQ6IEdyYW1tYXIgPSB7IHJvb3Q6IG1lcmdlKHBhcmVudC5yb290LCBncmFtbWFyLnJvb3QpIH07XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcGFyZW50KVxyXG4gICAgICAgIGlmICghKG5hbWUgaW4gcmVzdWx0KSkgcmVzdWx0W25hbWVdID0gbWVyZ2UocGFyZW50W25hbWVdLCBncmFtbWFyW25hbWVdKTtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBncmFtbWFyKVxyXG4gICAgICAgIGlmICghKG5hbWUgaW4gcmVzdWx0KSkgcmVzdWx0W25hbWVdID0gbWVyZ2UocGFyZW50W25hbWVdLCBncmFtbWFyW25hbWVdKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn0iLCJpbXBvcnQgeyBDaGFyIH0gZnJvbSBcIi4vY2hhclwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiwgU3RyZWFtIH0gZnJvbSBcIi4vc3RyZWFtXCI7XHJcblxyXG5leHBvcnQgdHlwZSBDaGFyYWN0ZXJHcm91cCA9IChzdHJpbmcgfCBbc3RyaW5nLCBzdHJpbmddKVtdO1xyXG5cclxuZXhwb3J0IHR5cGUgTWF0Y2ggPSB7XHJcbiAgICBuYW1lPzogc3RyaW5nLFxyXG4gICAgc3RhcnQ6IExvY2F0aW9uLFxyXG4gICAgZW5kOiBMb2NhdGlvbixcclxuICAgIGNoaWxkcmVuPzogTWF0Y2hbXVxyXG59O1xyXG5cclxuY2xhc3MgU3RhY2sge1xyXG4gICAgcHJpdmF0ZSBlbGVtZW50czogeyBba2V5OiBudW1iZXJdOiBzdHJpbmdbXSB9O1xyXG4gICAgXHJcbiAgICByZWFkb25seSBsYXN0Pzogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRzOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZ1tdIH0gPSB7fSwgbGFzdD86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcclxuICAgICAgICB0aGlzLmxhc3QgPSBsYXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHdpdGgob2Zmc2V0OiBudW1iZXIsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0geyAuLi50aGlzLmVsZW1lbnRzIH07XHJcbiAgICAgICAgZWxlbWVudHNbb2Zmc2V0XSA9IGVsZW1lbnRzW29mZnNldF0gPyBbLi4uZWxlbWVudHNbb2Zmc2V0XSwgbmFtZV0gOiBbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdGFjayhlbGVtZW50cywgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzKG9mZnNldDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50c1tvZmZzZXRdPy5pbmNsdWRlcyhuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhdHRlcm4ge1xyXG4gICAgcHJlY2VkZW5jZT86IG51bWJlcjtcclxuICAgIHByZXNlcnZlUHJlY2VkZW5jZTogYm9vbGVhbjtcclxuXHJcbiAgICBhYnN0cmFjdCBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlPzogbnVtYmVyLCBzdGFjaz86IFN0YWNrLCBjYWNoZT86IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSk6IE1hdGNoIHwgbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhd1BhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2g6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNoID0gY2g7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBpZiAoc3RyZWFtLnBlZWtjaCgpICE9PSB0aGlzLmNoKSByZXR1cm47XHJcbiAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9yUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhOiBQYXR0ZXJuO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBiOiBQYXR0ZXJuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGE6IFBhdHRlcm4sIGI6IFBhdHRlcm4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2gge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoQSA9ICEodGhpcy5hIGluc3RhbmNlb2YgTmFtZWRQYXR0ZXJuICYmIHN0YWNrLmhhcyhzdGFydC5vZmZzZXQsIHRoaXMuYS5uYW1lKSkgJiYgdGhpcy5hLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgY29uc3QgZW5kQSA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICBzdHJlYW0ubG9jYXRpb24gPSBzdGFydDtcclxuICAgICAgICBjb25zdCBtYXRjaEIgPSAhKHRoaXMuYiBpbnN0YW5jZW9mIE5hbWVkUGF0dGVybiAmJiBzdGFjay5oYXMoc3RhcnQub2Zmc2V0LCB0aGlzLmIubmFtZSkpICYmIHRoaXMuYi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGNvbnN0IGVuZEIgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgbGV0IG1hdGNoID0gKCFtYXRjaEEgJiYgbWF0Y2hCKSB8fCAoIW1hdGNoQiAmJiBtYXRjaEEpO1xyXG4gICAgICAgIGlmIChtYXRjaEEgJiYgbWF0Y2hCKVxyXG4gICAgICAgICAgICBtYXRjaCA9IGVuZEEub2Zmc2V0ID4gZW5kQi5vZmZzZXQgPyBtYXRjaEEgOiBtYXRjaEI7XHJcbiAgICAgICAgaWYgKG1hdGNoID09PSBtYXRjaEEpXHJcbiAgICAgICAgICAgIHN0cmVhbS5sb2NhdGlvbiA9IGVuZEE7XHJcbiAgICAgICAgaWYgKG1hdGNoKSByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24sIGNoaWxkcmVuOiBbbWF0Y2hdIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXaGl0ZXNwYWNlUGF0dGVybiBleHRlbmRzIFBhdHRlcm4ge1xyXG4gICAgbWF0Y2goc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHN0cmVhbS5sb2NhdGlvbjtcclxuICAgICAgICB3aGlsZSAoQ2hhci5pc1doaXRlc3BhY2Uoc3RyZWFtLnBlZWtjaCgpKSkgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFueVBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgaWYgKCFzdHJlYW0ucGVla2NoKCkpIHJldHVybjtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGlnaXRQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGlmICghQ2hhci5pc0RpZ2l0KHN0cmVhbS5wZWVrY2goKSkpIHJldHVybjtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IFBhdHRlcm47XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0dGVybjogUGF0dGVybikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSwgcmVnaXN0cnk6IE1hcDxzdHJpbmcsIFBhdHRlcm4+LCBwcmVjZWRlbmNlOiBudW1iZXIgPSAxLCBzdGFjazogU3RhY2sgPSBuZXcgU3RhY2soKSwgY2FjaGU6IHsgW2tleTogc3RyaW5nXTogTWF0Y2ggfSA9IHt9KTogTWF0Y2gge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5wYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSk7XHJcbiAgICAgICAgaWYgKCFtYXRjaCkgc3RyZWFtLmxvY2F0aW9uID0gc3RhcnQ7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbjogbWF0Y2ggPyBbbWF0Y2hdIDogW10gfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlcGVhdFBhdHRlcm4gZXh0ZW5kcyBQYXR0ZXJuIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjogUGF0dGVybjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBQYXR0ZXJuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBtYXRjaCA9IHRoaXMucGF0dGVybi5tYXRjaChzdHJlYW0sIHJlZ2lzdHJ5LCBwcmVjZWRlbmNlLCBzdGFjaywgY2FjaGUpO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW21hdGNoXTtcclxuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhc3QgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgd2hpbGUgKG1hdGNoID0gdGhpcy5wYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHByZWNlZGVuY2UsIHN0YWNrLCBjYWNoZSkpIHtcclxuICAgICAgICAgICAgaWYgKGxhc3Qub2Zmc2V0ID09PSBzdHJlYW0ub2Zmc2V0KSBicmVhaztcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChtYXRjaCk7XHJcbiAgICAgICAgICAgIGxhc3QgPSBzdHJlYW0ubG9jYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0cmVhbS5sb2NhdGlvbiA9IGxhc3Q7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyR3JvdXBQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdyb3VwOiBDaGFyYWN0ZXJHcm91cDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGlzYWxsb3c6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ3JvdXA6IENoYXJhY3Rlckdyb3VwLCBkaXNhbGxvdzogYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGdyb3VwO1xyXG4gICAgICAgIHRoaXMuZGlzYWxsb3cgPSBkaXNhbGxvdztcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IGNoID0gc3RyZWFtLnBlZWtjaCgpO1xyXG4gICAgICAgIGlmICghY2gpIHJldHVybjtcclxuICAgICAgICBjb25zdCBjb2RlID0gY2guY2hhckNvZGVBdCgwKTtcclxuICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZXhwZWN0ZWQgb2YgdGhpcy5ncm91cClcclxuICAgICAgICAgICAgaWYgKChBcnJheS5pc0FycmF5KGV4cGVjdGVkKSAmJiBjb2RlID49IGV4cGVjdGVkWzBdLmNoYXJDb2RlQXQoMCkgJiYgY29kZSA8PSBleHBlY3RlZFsxXS5jaGFyQ29kZUF0KDApKSB8fCBjaCA9PT0gZXhwZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuZGlzYWxsb3cgJiYgeyBzdGFydCwgZW5kOiBzdHJlYW0ubG9jYXRpb24gfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXNhbGxvdyAmJiB7IHN0YXJ0LCBlbmQ6IHN0cmVhbS5sb2NhdGlvbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR3JvdXBQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoaWxkcmVuOiBQYXR0ZXJuW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hpbGRyZW46IFBhdHRlcm5bXSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gY2hpbGQubWF0Y2goc3RyZWFtLCByZWdpc3RyeSwgcHJlY2VkZW5jZSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG1hdGNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmFtZWRQYXR0ZXJuIGV4dGVuZHMgUGF0dGVybiB7XHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHN0cmVhbTogU3RyZWFtLCByZWdpc3RyeTogTWFwPHN0cmluZywgUGF0dGVybj4sIHByZWNlZGVuY2U6IG51bWJlciA9IDEsIHN0YWNrOiBTdGFjayA9IG5ldyBTdGFjaygpLCBjYWNoZTogeyBba2V5OiBzdHJpbmddOiBNYXRjaCB9ID0ge30pOiBNYXRjaCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGAke3ByZWNlZGVuY2V9LCR7c3RhY2subGFzdH0sJHtzdHJlYW0ub2Zmc2V0fSwke3RoaXMubmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGNhY2hlZCA9IGNhY2hlW2tleV07XHJcbiAgICAgICAgaWYgKGNhY2hlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWQpIHN0cmVhbS5sb2NhdGlvbiA9IGNhY2hlZC5lbmQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLmxvY2F0aW9uO1xyXG4gICAgICAgIHN0YWNrID0gc3RhY2sud2l0aChzdGFydC5vZmZzZXQsIHRoaXMubmFtZSk7XHJcbiAgICAgICAgY29uc3QgcGF0dGVybiA9IHJlZ2lzdHJ5LmdldCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIGlmICghcGF0dGVybiB8fCAocGF0dGVybi5wcmVjZWRlbmNlICYmIHBhdHRlcm4ucHJlY2VkZW5jZSA8IHByZWNlZGVuY2UpKSByZXR1cm4gY2FjaGVba2V5XSA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBwYXR0ZXJuLm1hdGNoKHN0cmVhbSwgcmVnaXN0cnksIHBhdHRlcm4ucHJlY2VkZW5jZSB8fCBwYXR0ZXJuLnByZXNlcnZlUHJlY2VkZW5jZSA/IHBhdHRlcm4ucHJlY2VkZW5jZSA/PyBwcmVjZWRlbmNlIDogMSwgc3RhY2ssIGNhY2hlKTtcclxuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm4gY2FjaGVba2V5XSA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlW2tleV0gPSB7IG5hbWU6IHRoaXMubmFtZSwgc3RhcnQsIGVuZDogc3RyZWFtLmxvY2F0aW9uLCBjaGlsZHJlbjogW21hdGNoXSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1NwZWNpYWxDaGFyYWN0ZXIoY2g6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGNoID09PSBcIiVcIiB8fCBjaCA9PT0gXCJ8XCIgfHwgY2ggPT09IFwiKFwiIHx8IGNoID09PSBcIilcIiB8fCBjaCA9PT0gXCIrXCIgfHwgY2ggPT09IFwiP1wiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVBhdHRlcm4oc3RyZWFtOiBTdHJlYW0sIHByZWNlZGVuY2U/OiBudW1iZXIsIHByZXNlcnZlUHJlY2VkZW5jZTogYm9vbGVhbiA9IGZhbHNlKTogUGF0dGVybiB7XHJcbiAgICBjb25zdCBjaGlsZHJlbjogUGF0dGVybltdID0gW107XHJcbiAgICBsZXQgb3IgPSBmYWxzZTtcclxuICAgIGxldCBjaDtcclxuICAgIHdoaWxlIChjaCA9IHN0cmVhbS5wZWVrY2goKSkge1xyXG4gICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgaWYgKGNoID09PSBcIiVcIikge1xyXG4gICAgICAgICAgICBjaCA9IHN0cmVhbS5wZWVrY2goKTtcclxuICAgICAgICAgICAgaWYgKGlzU3BlY2lhbENoYXJhY3RlcihjaCkpIHtcclxuICAgICAgICAgICAgICAgIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBSYXdQYXR0ZXJuKGNoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoQ2hhci5pc0xldHRlcihjaCA9IHN0cmVhbS5wZWVrY2goKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gY2g7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgRGlnaXRQYXR0ZXJuKCkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IE5hbWVkUGF0dGVybihuYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIihcIilcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChwYXJzZVBhdHRlcm4oc3RyZWFtLCBwcmVjZWRlbmNlKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiKVwiKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJbXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgZGlzYWxsb3cgPSBzdHJlYW0ucGVla2NoKCkgPT09IFwiXlwiO1xyXG4gICAgICAgICAgICBpZiAoZGlzYWxsb3cpIHN0cmVhbS5jb25zdW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwOiBDaGFyYWN0ZXJHcm91cCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcmFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgd2hpbGUgKGNoID0gc3RyZWFtLnBlZWtjaCgpKSB7XHJcbiAgICAgICAgICAgICAgICBzdHJlYW0uY29uc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gZ3JvdXAubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSBcIiVcIiAmJiBzdHJlYW0ucGVla2NoKCkgPT09IFwiXVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLmNvbnN1bWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiLVwiICYmICFyYW5nZSAmJiBsZW4gPiAwICYmICFBcnJheS5pc0FycmF5KGdyb3VwLmF0KC0xKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKGNoKTtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdCA9IGdyb3VwLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goW2dyb3VwLnBvcCgpLCBsYXN0XSBhcyBbc3RyaW5nLCBzdHJpbmddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBDaGFyYWN0ZXJHcm91cFBhdHRlcm4oZ3JvdXAsIGRpc2FsbG93KSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCIuXCIpXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IEFueVBhdHRlcm4oKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiIFwiKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBXaGl0ZXNwYWNlUGF0dGVybigpKTtcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJ8XCIgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCAmJiAhb3IpIHtcclxuICAgICAgICAgICAgb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIj9cIiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBPcHRpb25hbFBhdHRlcm4oY2hpbGRyZW4ucG9wKCkpKTtcclxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCIrXCIgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgUmVwZWF0UGF0dGVybihjaGlsZHJlbi5wb3AoKSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgUmF3UGF0dGVybihjaCkpO1xyXG4gICAgICAgIGlmIChvcikge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5ldyBPclBhdHRlcm4oY2hpbGRyZW4ucG9wKCksIGNoaWxkcmVuLnBvcCgpKSk7XHJcbiAgICAgICAgICAgIG9yID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gY2hpbGRyZW4ubGVuZ3RoID09PSAxID8gY2hpbGRyZW5bMF0gOiBuZXcgR3JvdXBQYXR0ZXJuKGNoaWxkcmVuKTtcclxuICAgIHJlc3VsdC5wcmVjZWRlbmNlID0gcHJlY2VkZW5jZTtcclxuICAgIHJlc3VsdC5wcmVzZXJ2ZVByZWNlZGVuY2UgPSBwcmVzZXJ2ZVByZWNlZGVuY2U7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGF0dGVybihzb3VyY2U6IHN0cmluZywgcHJlY2VkZW5jZT86IG51bWJlciwgcHJlc2VydmVQcmVjZWRlbmNlPzogYm9vbGVhbik6IFBhdHRlcm4ge1xyXG4gICAgcmV0dXJuIHBhcnNlUGF0dGVybihuZXcgU3RyZWFtKHNvdXJjZSksIHByZWNlZGVuY2UsIHByZXNlcnZlUHJlY2VkZW5jZSk7XHJcbn0iLCJleHBvcnQgdHlwZSBMb2NhdGlvbiA9IHtcclxuICAgIG9mZnNldDogbnVtYmVyLFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sdW1uOiBudW1iZXJcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJlYW0ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBidWZmZXI6IHN0cmluZztcclxuICAgIHByaXZhdGUgX29mZnNldDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGNvbHVtbjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJ1ZmZlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gMDtcclxuICAgICAgICB0aGlzLmxpbmUgPSAwO1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jYXRpb24oKTogTG9jYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB7IG9mZnNldDogdGhpcy5fb2Zmc2V0LCBsaW5lOiB0aGlzLmxpbmUsIGNvbHVtbjogdGhpcy5jb2x1bW4gfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jYXRpb24obG9jYXRpb246IExvY2F0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gbG9jYXRpb24ub2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGluZSA9IGxvY2F0aW9uLmxpbmU7XHJcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBsb2NhdGlvbi5jb2x1bW47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9mZnNldCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xyXG4gICAgfVxyXG5cclxuICAgIHBlZWtjaCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5fb2Zmc2V0XTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBlZWtjaCgpID09PSBcIlxcblwiKSB7XHJcbiAgICAgICAgICAgICsrdGhpcy5saW5lO1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbiA9IDA7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICsrdGhpcy5jb2x1bW47XHJcbiAgICAgICAgKyt0aGlzLl9vZmZzZXQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHcmFtbWFyIH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdyYW1tYXI6IEdyYW1tYXIgPSB7XHJcbiAgICBcIm51bWJlclwiOiBcIiVkK1wiLFxyXG4gICAgXCJuYW1lXCI6IFwiW2EtekEtWl9dW2EtekEtWjAtOV9dKz9cIixcclxuICAgIFwic3RyaW5nXCI6IFwiXFxcIihbXlxcXCJdfChcXFxcXFxcXCl8KFxcXFxcXFwiKSkrP1xcXCJcIixcclxuICAgIFwiYm9vbFwiOiBcIih0cnVlKXwoZmFsc2UpXCIsXHJcbiAgICBcImFkZFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAlKyAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDVcclxuICAgIH0sXHJcbiAgICBcInN1YlwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciAtICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNVxyXG4gICAgfSxcclxuICAgIFwibXVsXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICogJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA2XHJcbiAgICB9LFxyXG4gICAgXCJkaXZcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgLyAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDZcclxuICAgIH0sXHJcbiAgICBcImNvbmNhdFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciBAICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogMVxyXG4gICAgfSxcclxuICAgIFwiZXFcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPSAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcImx0XCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByIDwgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJndFwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA+ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogNFxyXG4gICAgfSxcclxuICAgIFwibGVcIjoge1xyXG4gICAgICAgIHBhdHRlcm46IFwiJWV4cHIgPD0gJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiA0XHJcbiAgICB9LFxyXG4gICAgXCJnZVwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlZXhwciA+PSAlZXhwclwiLFxyXG4gICAgICAgIHByZWNlZGVuY2U6IDRcclxuICAgIH0sXHJcbiAgICBcIm9yXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICV8ICVleHByXCIsXHJcbiAgICAgICAgcHJlY2VkZW5jZTogMlxyXG4gICAgfSxcclxuICAgIFwiYW5kXCI6IHtcclxuICAgICAgICBwYXR0ZXJuOiBcIiVleHByICYgJWV4cHJcIixcclxuICAgICAgICBwcmVjZWRlbmNlOiAzXHJcbiAgICB9LFxyXG4gICAgXCJub3RcIjogXCIhICVleHByXCIsXHJcbiAgICBcImFyZ2xpc3RcIjogXCIoJWV4cHIoICwgJWV4cHIpKz8pP1wiLFxyXG4gICAgXCJjYWxsXCI6IFwiJW5hbWUgJSggJWFyZ2xpc3QgJSlcIixcclxuICAgIFwicGFyZW50aGVzaXNleHByXCI6IFwiJSggJWV4cHIgJSlcIixcclxuICAgIFwiZXhwclwiOiB7XHJcbiAgICAgICAgcGF0dGVybjogXCIlcGFyZW50aGVzaXNleHByfCVudW1iZXJ8JXN0cmluZ3wlYm9vbHwlbmFtZXwlYWRkfCVzdWJ8JW11bHwlZGl2fCVjb25jYXR8JWVxfCVsdHwlZ3R8JWxlfCVnZXwlb3J8JWFuZHwlbm90fCVjYWxsXCIsXHJcbiAgICAgICAgcHJlc2VydmVQcmVjZWRlbmNlOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgXCJhc3NpZ25cIjogXCIlbmFtZSA9ICVleHByO1wiLFxyXG4gICAgXCJwYXJhbWxpc3RcIjogXCIoJW5hbWUoICwgJW5hbWUpKz8pP1wiLFxyXG4gICAgXCJpZlwiOiBcImlmICVleHByIHsgJWJvZHkgfSAlZWxzZT9cIixcclxuICAgIFwiZWxzZVwiOiBcImVsc2UgeyAlYm9keSB9XCIsXHJcbiAgICBcIndoaWxlXCI6IFwid2hpbGUgJWV4cHIgeyAlYm9keSB9XCIsXHJcbiAgICBcImZ1bmN0aW9uXCI6IFwiZm4gJW5hbWUgJSggJXBhcmFtbGlzdCAlKSB7ICVib2R5IH1cIixcclxuICAgIFwicmV0dXJuXCI6IFwicmV0ICVleHByO1wiLFxyXG4gICAgXCJjYWxsc3RhdFwiOiBcIiVjYWxsO1wiLFxyXG4gICAgXCJwcmludFwiOiBcInByaW50ICVleHByO1wiLFxyXG4gICAgXCJzdGF0ZW1lbnRcIjogXCIlYXNzaWdufCVpZnwld2hpbGV8JWZ1bmN0aW9ufCVyZXR1cm58JWNhbGxzdGF0fCVwcmludFwiLFxyXG4gICAgXCJib2R5XCI6IFwiKCAlc3RhdGVtZW50ICkrP1wiLFxyXG4gICAgXCJ1c2VcIjogXCJ1c2UgJW5hbWU7XCIsXHJcbiAgICBcImltcG9ydHNcIjogXCIoICV1c2UgKSs/XCIsXHJcbiAgICBcImxpYlwiOiBcImxpYiAlbmFtZTtcIixcclxuICAgIFwicm9vdFwiOiBcIiVsaWI/ICVpbXBvcnRzICVib2R5XCJcclxufTsiLCJpbXBvcnQgeyBOYXRpdmVMaWIgfSBmcm9tIFwiLlwiO1xyXG5cclxubGV0IGVsZW1lbnRJZCA9IC0xO1xyXG5cclxuY29uc3QgZWxlbWVudHM6IHsgW2tleTogc3RyaW5nXTogRWxlbWVudCB9ID0ge307XHJcblxyXG5mdW5jdGlvbiBzYXZlRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGtleSA9IGAjZG9tOiR7KytlbGVtZW50SWR9YDtcclxuICAgIGVsZW1lbnRzW2tleV0gPSBlbGVtZW50O1xyXG4gICAgcmV0dXJuIGtleTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudChoYW5kbGU6IHN0cmluZyk6IEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRzW2hhbmRsZV07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb21MaWIgPSBuZXcgTmF0aXZlTGliKHtcclxuICAgIGRvbV9oZWFkOiBzYXZlRWxlbWVudChkb2N1bWVudC5oZWFkKSxcclxuICAgIGRvbV9ib2R5OiBzYXZlRWxlbWVudChkb2N1bWVudC5ib2R5KVxyXG59LCB7XHJcbiAgICBkb21fdGl0bGUoWyB0aXRsZSBdKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX2NyZWF0ZShbIHRhZ05hbWUgXSkge1xyXG4gICAgICAgIHJldHVybiBzYXZlRWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpKTtcclxuICAgIH0sXHJcbiAgICBkb21fZmluZChbIHNlbGVjdG9yIF0pIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHNhdmVFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgfSxcclxuICAgIGRvbV9hcHBlbmQoWyBwYXJlbnQsIGNoaWxkIF0pIHtcclxuICAgICAgICBnZXRFbGVtZW50KHBhcmVudCk/LmFwcGVuZENoaWxkKGdldEVsZW1lbnQoY2hpbGQpID8/IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9yZW1vdmUoWyBlbGVtZW50IF0pIHtcclxuICAgICAgICBnZXRFbGVtZW50KGVsZW1lbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICBkb21fYWRkX2NsYXNzKFsgZWxlbWVudCwgY2xhc3NOYW1lIF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX3JlbW92ZV9jbGFzcyhbIGVsZW1lbnQsIGNsYXNzTmFtZSBdKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIGVsbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV90b2dnbGVfY2xhc3MoWyBlbGVtZW50LCBjbGFzc05hbWUgXSkge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IGdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH0sXHJcbiAgICBkb21fc2V0X3RleHQoWyBlbGVtZW50LCB0ZXh0IF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLmlubmVyVGV4dCA9IHRleHQ7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9zZXRfaHRtbChbIGVsZW1lbnQsIGh0bWwgXSkge1xyXG4gICAgICAgIGNvbnN0IGVsbSA9IGdldEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGVsbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBlbG0uaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX3NldF9hdHRyKFsgZWxlbWVudCwgYXR0ciwgdmFsdWUgXSkge1xyXG4gICAgICAgIGdldEVsZW1lbnQoZWxlbWVudCk/LnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfSxcclxuICAgIGRvbV9nZXRfYXR0cihbIGVsZW1lbnQsIGF0dHIgXSkge1xyXG4gICAgICAgIHJldHVybiBnZXRFbGVtZW50KGVsZW1lbnQpPy5nZXRBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICB9LFxyXG4gICAgZG9tX2NzcyhbIGVsZW1lbnQsIGF0dHIsIHZhbHVlIF0pIHtcclxuICAgICAgICBjb25zdCBlbG0gPSBnZXRFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgZWxtLnN0eWxlLnNldFByb3BlcnR5KGF0dHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgZG9tX2V2ZW50KFsgZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrIF0sIHNjb3BlKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gZ2V0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBmbiA9IHNjb3BlLmZ1bmN0aW9uc1tjYWxsYmFja107XHJcbiAgICAgICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsICgpID0+IGZuKFtdLCBzY29wZSkpO1xyXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgU1NGdW5jdGlvbiB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBOYXRpdmVMaWIgfSBmcm9tIFwiLlwiO1xyXG5cclxubGV0IGZ1bmNJZCA9IC0xO1xyXG5cclxuY29uc3QgZnVuY3M6IHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9ID0ge307XHJcblxyXG5leHBvcnQgY29uc3QgZm5MaWIgPSBuZXcgTmF0aXZlTGliKHt9LCB7XHJcbiAgICBmbihbIG5hbWUgXSwgeyBmdW5jdGlvbnMgfSkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGAjZm46JHsrK2Z1bmNJZH1gO1xyXG4gICAgICAgIGZ1bmNzW2tleV0gPSBmdW5jdGlvbnNbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH0sXHJcbiAgICBjYWxsKFsgZm4sIC4uLmFyZ3MgXSwgc2NvcGUpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3NbZm5dPy4oYXJncywgc2NvcGUpID8/IFwidW5rbm93blwiO1xyXG4gICAgfVxyXG59KTsiLCJpbXBvcnQgeyBTU0Z1bmN0aW9uLCBTY29wZSwgU2lnbWFTY3JpcHQgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHRcIjtcclxuaW1wb3J0IHsgQVNURWxlbWVudCB9IGZyb20gXCIuLi8uLi9wYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaWdtYVNjcmlwdExpYiB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2dyYW06IEFTVEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvZ3JhbTogQVNURWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XHJcbiAgICB9XHJcblxyXG4gICAgdXNlKHNpZ21hU2NyaXB0OiBTaWdtYVNjcmlwdCwgc2NvcGU6IFNjb3BlKSB7XHJcbiAgICAgICAgY29uc3QgbGliU2NvcGUgPSBzaWdtYVNjcmlwdC5leGVjdXRlKHRoaXMucHJvZ3JhbSk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS52YXJpYWJsZXMsIGxpYlNjb3BlLnZhcmlhYmxlcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS5mdW5jdGlvbnMsIGxpYlNjb3BlLmZ1bmN0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYXRpdmVMaWIge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHZhcmlhYmxlczogUmVhZG9ubHk8eyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfT47XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25zOiBSZWFkb25seTx7IFtrZXk6IHN0cmluZ106IFNTRnVuY3Rpb24gfT47XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBmdW5jdGlvbnM6IHsgW2tleTogc3RyaW5nXTogU1NGdW5jdGlvbiB9KSB7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSB2YXJpYWJsZXM7XHJcbiAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSBmdW5jdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgdXNlKHNjb3BlOiBTY29wZSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2NvcGUudmFyaWFibGVzLCB0aGlzLnZhcmlhYmxlcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzY29wZS5mdW5jdGlvbnMsIHRoaXMuZnVuY3Rpb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE5hdGl2ZUxpYiB9IGZyb20gXCIuXCI7XHJcblxyXG5sZXQgb2JqZWN0SWQgPSAtMTtcclxuXHJcbmNvbnN0IG9iamVjdHM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcclxuXHJcbmZ1bmN0aW9uIHNhdmVPYmplY3Qob2JqZWN0OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qga2V5ID0gYCNqczokeysrb2JqZWN0SWR9YDtcclxuICAgIG9iamVjdHNba2V5XSA9IG9iamVjdDtcclxuICAgIHJldHVybiBrZXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdChoYW5kbGU6IHN0cmluZyk6IGFueSB7XHJcbiAgICByZXR1cm4gb2JqZWN0c1toYW5kbGVdO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0pTKHZhbHVlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCIjanM6XCIpKSByZXR1cm4gZ2V0T2JqZWN0KHZhbHVlKTtcclxuICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmtub3duXCIpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYgKHZhbHVlID09PSBcInRydWVcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgY29uc3QgbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlKTtcclxuICAgIGlmICghTnVtYmVyLmlzTmFOKG51bWJlcikpIHJldHVybiBudW1iZXI7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvU1ModmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8XHJcbiAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIiB8fCB2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4gfHxcclxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICByZXR1cm4gc2F2ZU9iamVjdCh2YWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBqc0xpYiA9IG5ldyBOYXRpdmVMaWIoe1xyXG4gICAganNfd2luZG93OiBzYXZlT2JqZWN0KHdpbmRvdylcclxufSwge1xyXG4gICAganMoWyBjb2RlIF0pIHtcclxuICAgICAgICByZXR1cm4gdG9TUyhldmFsKGNvZGUpKTtcclxuICAgIH0sXHJcbiAgICBqc19nZXQoWyBoYW5kbGUsIHByb3BlcnR5IF0pIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldE9iamVjdChoYW5kbGUpPy5bcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRvU1ModmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGpzX3NldChbIGhhbmRsZSwgcHJvcGVydHksIHZhbHVlIF0pIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBnZXRPYmplY3QoaGFuZGxlKTtcclxuICAgICAgICBpZiAob2JqZWN0ICE9IG51bGwpIG9iamVjdFtwcm9wZXJ0eV0gPSB0b0pTKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAganNfbmV3KFsgaGFuZGxlLCAuLi5hcmdzIF0pIHtcclxuICAgICAgICBjb25zdCBjdG9yID0gZ2V0T2JqZWN0KGhhbmRsZSk7XHJcbiAgICAgICAgaWYgKGN0b3IgPT0gbnVsbCkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IGN0b3IoLi4uYXJncy5tYXAodG9KUykpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgcmV0dXJuIHRvU1ModmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGpzX2NhbGwoWyBoYW5kbGUsIC4uLmFyZ3MgXSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0T2JqZWN0KGhhbmRsZSk/LiguLi5hcmdzLm1hcCh0b0pTKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdG9TUyh2YWx1ZSk7XHJcbiAgICB9LFxyXG4gICAganNfY2FsbF9tZXRob2QoWyBoYW5kbGUsIG1ldGhvZCwgLi4uYXJncyBdKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRPYmplY3QoaGFuZGxlKT8uW21ldGhvZF0/LiguLi5hcmdzLm1hcCh0b0pTKSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4gdG9TUyh2YWx1ZSk7XHJcbiAgICB9XHJcbn0pOyIsImltcG9ydCB7IE5hdGl2ZUxpYiB9IGZyb20gXCIuXCI7XHJcblxyXG5sZXQgcmVmSWQgPSAtMTtcclxuXHJcbmNvbnN0IHJlZnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWZMaWIgPSBuZXcgTmF0aXZlTGliKHt9LCB7XHJcbiAgICByZWYoWyBpbml0aWFsVmFsdWUgXSkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGAjcmVmOiR7KytyZWZJZH1gO1xyXG4gICAgICAgIHJlZnNba2V5XSA9IGluaXRpYWxWYWx1ZSA/PyBcInVua25vd25cIjtcclxuICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgfSxcclxuICAgIHJlZl9zZXQoWyByZWYsIHZhbHVlIF0pIHtcclxuICAgICAgICByZWZzW3JlZl0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9LFxyXG4gICAgcmVmX2dldChbIHJlZiBdKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlZnNbcmVmXSA/PyBcInVua25vd25cIjtcclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgQVNURWxlbWVudCwgR3JhbW1hciwgUGFyc2VyLCBpbmhlcml0IH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5pbXBvcnQgeyBTaWdtYVNjcmlwdExpYiB9IGZyb20gXCIuL2xpYlwiO1xyXG5pbXBvcnQgeyBkb21MaWIgfSBmcm9tIFwiLi9saWIvZG9tXCI7XHJcbmltcG9ydCB7IGZuTGliIH0gZnJvbSBcIi4vbGliL2ZuXCI7XHJcbmltcG9ydCB7IGpzTGliIH0gZnJvbSBcIi4vbGliL2pzXCI7XHJcbmltcG9ydCB7IHJlZkxpYiB9IGZyb20gXCIuL2xpYi9yZWZcIjtcclxuaW1wb3J0IHsgZ3JhbW1hciB9IGZyb20gXCIuL2dyYW1tYXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY29wZSB7XHJcbiAgICByZWFkb25seSB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgIHJlYWRvbmx5IGZ1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBTU0Z1bmN0aW9uIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZT86IFNjb3BlKSB7XHJcbiAgICAgICAgaWYgKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzID0geyAuLi5zY29wZS52YXJpYWJsZXMgfTtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSB7IC4uLnNjb3BlLmZ1bmN0aW9ucyB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIFNTRnVuY3Rpb24gPSAoYXJnczogc3RyaW5nW10sIHNjb3BlOiBTY29wZSkgPT4gc3RyaW5nO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpZ21hU2NyaXB0IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyc2VyOiBQYXJzZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxpYnM6IHsgW2tleTogc3RyaW5nXTogU2lnbWFTY3JpcHRMaWIgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lcmdlR3JhbW1hcjogUGFydGlhbDxHcmFtbWFyPiA9IHt9KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKGluaGVyaXQoZ3JhbW1hciwgbWVyZ2VHcmFtbWFyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBhcnNlSW1wb3J0cyhpbXBvcnRzOiBBU1RFbGVtZW50LCBzY29wZTogU2NvcGUpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHVzZSBvZiBpbXBvcnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB1c2UuZmluZChcIm5hbWVcIikudmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lIGluIHRoaXMubGlicykgdGhpcy5saWJzW25hbWVdLnVzZSh0aGlzLCBzY29wZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJqc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc0xpYi51c2Uoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZG9tXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbUxpYi51c2Uoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmVmXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZkxpYi51c2Uoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZm5cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5MaWIudXNlKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwYXJzZVN0cmluZyhyYXc6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiByYXcuc2xpY2UoMSwgLTEpLnJlcGxhY2UoL1xcXFxcXFwiL2csIFwiXFxcIlwiKS5yZXBsYWNlKC9cXFxcXFxcXC9nLCBcIlxcXFxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV2YWxFeHByKGV4cHI6IEFTVEVsZW1lbnQsIHNjb3BlOiBTY29wZSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKGV4cHIubmFtZSA9PT0gXCJleHByXCIpXHJcbiAgICAgICAgICAgIGV4cHIgPSBleHByLmZpcnN0O1xyXG4gICAgICAgIHN3aXRjaCAoZXhwci5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwYXJlbnRoZXNpc2V4cHJcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS52YXJpYWJsZXNbZXhwci52YWx1ZV0gPz8gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcclxuICAgICAgICAgICAgY2FzZSBcImJvb2xcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBleHByLnZhbHVlO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVN0cmluZyhleHByLnZhbHVlKTtcclxuICAgICAgICAgICAgY2FzZSBcImFkZFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE51bWJlci5wYXJzZUludChhKSArIE51bWJlci5wYXJzZUludChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcInN1YlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE51bWJlci5wYXJzZUludChhKSAtIE51bWJlci5wYXJzZUludChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIm11bFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE51bWJlci5wYXJzZUludChhKSAqIE51bWJlci5wYXJzZUludChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocmVzdWx0KSA/IFwidW5rbm93blwiIDogYCR7cmVzdWx0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImRpdlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IH5+KE51bWJlci5wYXJzZUludChhKSAvIE51bWJlci5wYXJzZUludChiKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHJlc3VsdCkgPyBcInVua25vd25cIiA6IGAke3Jlc3VsdH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJlcVwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID09PSBifWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIubGFzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYSkgfHwgTnVtYmVyLmlzTmFOKGIpKSByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA8IGJ9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwiZ3RcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IE51bWJlci5wYXJzZUludCh0aGlzLmV2YWxFeHByKGV4cHIuZmlyc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5sYXN0LCBzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihhKSB8fCBOdW1iZXIuaXNOYU4oYikpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID4gYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJsZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGEpIHx8IE51bWJlci5pc05hTihiKSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPD0gYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJnZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gTnVtYmVyLnBhcnNlSW50KHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGEpIHx8IE51bWJlci5pc05hTihiKSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2EgPj0gYn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJvclwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHthID09PSBcInRydWVcIiB8fCBiID09PSBcInRydWVcIn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJhbmRcIjoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IHRoaXMuZXZhbEV4cHIoZXhwci5maXJzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHRoaXMuZXZhbEV4cHIoZXhwci5sYXN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YSA9PT0gXCJ0cnVlXCIgJiYgYiA9PT0gXCJ0cnVlXCJ9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwibm90XCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSkgPT09IFwidHJ1ZVwiID8gXCJmYWxzZVwiIDogXCJ0cnVlXCJ9YDtcclxuICAgICAgICAgICAgY2FzZSBcImNvbmNhdFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5ldmFsRXhwcihleHByLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ldmFsRXhwcihleHByLmxhc3QsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhICsgYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwiY2FsbFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZXhwci5maW5kKFwibmFtZVwiKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBzY29wZS5mdW5jdGlvbnNbbmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZ1bmMpIHJldHVybiBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGV4cHIuZmluZChcImFyZ2xpc3RcIikpLm1hcCgoYXJnKSA9PiB0aGlzLmV2YWxFeHByKGFyZywgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jKGFyZ3MsIHNjb3BlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJ1bmtub3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50OiBBU1RFbGVtZW50LCBzY29wZTogU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdGVtZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImFzc2lnblwiOlxyXG4gICAgICAgICAgICAgICAgc2NvcGUudmFyaWFibGVzW3N0YXRlbWVudC5maW5kKFwibmFtZVwiKS52YWx1ZV0gPSB0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpZlwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24gPT09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZXhlYyhzdGF0ZW1lbnQuZmluZChcImJvZHlcIiksIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsc2VTdGF0ZW1lbnQgPSBzdGF0ZW1lbnQuZmluZENoaWxkKFwiZWxzZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbHNlU3RhdGVtZW50ICYmIGNvbmRpdGlvbiA9PT0gXCJmYWxzZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZXhlYyhlbHNlU3RhdGVtZW50LmZpbmQoXCJib2R5XCIpLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcIndoaWxlXCI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHIgPSBzdGF0ZW1lbnQuZmluZChcImV4cHJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZXZhbEV4cHIoZXhwciwgc2NvcGUpID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXhlYyhib2R5LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gQXJyYXkuZnJvbShzdGF0ZW1lbnQuZmluZChcInBhcmFtbGlzdFwiKSkubWFwKChwYXJhbSkgPT4gcGFyYW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuZnVuY3Rpb25zW3N0YXRlbWVudC5maW5kKFwibmFtZVwiKS52YWx1ZV0gPSAoYXJnczogc3RyaW5nW10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFNjb3BlID0gdGhpcy5uZXdTY29wZShzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2YgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXJnKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS52YXJpYWJsZXNbcGFyYW1dID0gYXJnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWMoYm9keSwgbG9jYWxTY29wZSkgPz8gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmV2YWxFeHByKHN0YXRlbWVudC5maW5kKFwiZXhwclwiKSwgc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiY2FsbHN0YXRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJldHVyblwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbEV4cHIoc3RhdGVtZW50LmZpbmQoXCJleHByXCIpLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgZXhlYyhib2R5OiBBU1RFbGVtZW50LCBzY29wZTogU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGZvciAoY29uc3QgeyBmaXJzdDogc3RhdGVtZW50IH0gb2YgYm9keSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50LCBzY29wZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgbG9hZFNjcmlwdChzY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpICE9PSBcInRleHQvc2lnbWFzY3JpcHRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBzb3VyY2U7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5oYXNBdHRyaWJ1dGUoXCJzcmNcIikpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChzY3JpcHQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKTtcclxuICAgICAgICAgICAgc291cmNlID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzb3VyY2UgPSBzY3JpcHQuaW5uZXJUZXh0O1xyXG4gICAgICAgIHRoaXMubG9hZChzb3VyY2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0TG9hZGVyKCkge1xyXG4gICAgICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIilcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgbXV0YXRpb24uYWRkZWROb2RlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MU2NyaXB0RWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNjcmlwdChub2RlKTtcclxuICAgICAgICB9KS5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHNjcmlwdCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSlcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NyaXB0KHNjcmlwdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG5ld1Njb3BlKHBhcmVudD86IFNjb3BlKTogU2NvcGUge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2NvcGUocGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBleGVjdXRlKHByb2dyYW06IEFTVEVsZW1lbnQpOiBTY29wZSB7XHJcbiAgICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLm5ld1Njb3BlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJzZUltcG9ydHMocHJvZ3JhbS5maW5kKFwiaW1wb3J0c1wiKSwgc2NvcGUpO1xyXG4gICAgICAgIHRoaXMuZXhlYyhwcm9ncmFtLmZpbmQoXCJib2R5XCIpLCBzY29wZSk7XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoc291cmNlOiBzdHJpbmcpOiBTY29wZSB7XHJcbiAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHRoaXMucGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbiAgICAgICAgaWYgKCFwcm9ncmFtIHx8IHByb2dyYW0uZW5kLm9mZnNldCAhPT0gc291cmNlLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGxpYiA9IHByb2dyYW0uZmluZENoaWxkKFwibGliXCIpO1xyXG4gICAgICAgIGlmIChsaWIpXHJcbiAgICAgICAgICAgIHRoaXMubGlic1tsaWIuZmluZChcIm5hbWVcIikudmFsdWVdID0gbmV3IFNpZ21hU2NyaXB0TGliKHByb2dyYW0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShwcm9ncmFtKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNjb3BlLCBTaWdtYVNjcmlwdCB9IGZyb20gXCIuLi9zaWdtYXNjcmlwdC9zaWdtYXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBBU1RFbGVtZW50LCBHcmFtbWFyIH0gZnJvbSBcIi4uL3BhcnNlclwiO1xyXG5pbXBvcnQgeyBkb21MaWIgfSBmcm9tIFwiLi4vc2lnbWFzY3JpcHQvbGliL2RvbVwiO1xyXG5cclxuLypcclxudXNlIGRvbTtcclxuXHJcbmRvbV9hcHBlbmQoZG9tX2JvZHksXHJcbiAgICA8ZGl2IGF0dHI9XCJ0ZXN0XCI+XHJcbiAgICAgICAgPHNwYW4+SGVsbG8gd29ybGQhIDIgKyAyID0gezIgKyAyfTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG4qL1xyXG5cclxuLypcclxudXNlIGRvbTtcclxuXHJcbmZuIDx0ZXN0IGNsYXNzPVwiZGVmYXVsdFwiID4ge1xyXG4gICAgcmV0IDxzcGFuIGNsYXNzPXtjbGFzc30+eyBjaGlsZHJlbiB9PC9zcGFuPjtcclxufVxyXG5cclxuZG9tX2FwcGVuZChkb21fYm9keSxcclxuICAgIDxkaXY+XHJcbiAgICAgICAgPHRlc3QgY2xhc3M9XCJ0ZXN0XCI+SGVsbG8gd29ybGQhPC90ZXN0PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcbiovXHJcblxyXG5jb25zdCBncmFtbWFyOiBQYXJ0aWFsPEdyYW1tYXI+ID0ge1xyXG4gICAgXCJodG1sbmFtZVwiOiBcIlthLXowLTktXStcIixcclxuICAgIFwiaHRtbGF0dHJ2YWxcIjogXCIlc3RyaW5nfCh7ICVleHByIH0pXCIsXHJcbiAgICBcImh0bWxhdHRyXCI6IFwiJWh0bWxuYW1lPSVodG1sYXR0cnZhbFwiLFxyXG4gICAgXCJodG1sZW50aXR5XCI6IFwiJiVodG1sbmFtZTtcIixcclxuICAgIFwiaHRtbHRleHRcIjogXCIoW14mPD57fV0pK1wiLFxyXG4gICAgXCJodG1sY29udGVudFwiOiBcIiglaHRtbHRleHR8JWh0bWxlbnRpdHl8KHsgJWV4cHIgfSl8JWh0bWwpKz9cIixcclxuICAgIFwiaHRtbHNpbmdsZVwiOiBcIjwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8gLz5cIixcclxuICAgIFwiaHRtbHBhaXJlZFwiOiBcIjwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8+JWh0bWxjb250ZW50PC8laHRtbG5hbWU+XCIsXHJcbiAgICBcImh0bWxcIjogXCIlaHRtbHNpbmdsZXwlaHRtbHBhaXJlZFwiLFxyXG4gICAgXCJleHByXCI6IFwiLi4ufCVodG1sXCIsXHJcbiAgICBcImNvbXBvbmVudFwiOiBcImZuIDwlaHRtbG5hbWUoICVodG1sYXR0ciApKz8+IHsgJWJvZHkgfVwiLFxyXG4gICAgXCJzdGF0ZW1lbnRcIjogXCIuLi58JWNvbXBvbmVudFwiXHJcbn07XHJcblxyXG5jb25zdCBodG1sZW50aXRpZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XHJcbiAgICBcImFtcFwiOiBcIiZcIixcclxuICAgIFwibHRcIjogXCI8XCIsXHJcbiAgICBcImd0XCI6IFwiPlwiXHJcbn07XHJcblxyXG5jbGFzcyBTU1hTY29wZSBleHRlbmRzIFNjb3BlIHtcclxuICAgIHJlYWRvbmx5IGNvbXBvbmVudHM6IHsgW2tleTogc3RyaW5nXTogKGNoaWxkcmVuOiBzdHJpbmcsIGF0dHJ2YWxzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSA9PiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlPzogU2NvcGUpIHtcclxuICAgICAgICBzdXBlcihzY29wZSk7XHJcbiAgICAgICAgaWYgKHNjb3BlIGluc3RhbmNlb2YgU1NYU2NvcGUpXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHsgLi4uc2NvcGUuY29tcG9uZW50cyB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2lnbWFTY3JpcHRYIGV4dGVuZHMgU2lnbWFTY3JpcHQge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBncm91cHM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBncm91cElkID0gLTE7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoZ3JhbW1hcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBhcnNlSFRNTENvbnRlbnQoaHRtbGNvbnRlbnQ6IEFTVEVsZW1lbnQsIHNjb3BlOiBTU1hTY29wZSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbjogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGh0bWxjb250ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICAgICAgc3dpdGNoIChjaGlsZC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaHRtbHRleHRcIjpcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNoaWxkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImh0bWxlbnRpdHlcIjpcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGh0bWxlbnRpdGllc1tjaGlsZC5maW5kKFwiaHRtbG5hbWVcIikudmFsdWVdID8/IGNoaWxkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImV4cHJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJodG1sXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWxFeHByKGNoaWxkLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3Vwc1t2YWx1ZV07XHJcbiAgICAgICAgICAgIGlmIChncm91cClcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goLi4uZ3JvdXApO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBldmFsRXhwcihleHByOiBBU1RFbGVtZW50LCBzY29wZTogU1NYU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChleHByLm5hbWUgPT09IFwiZXhwclwiKVxyXG4gICAgICAgICAgICBleHByID0gZXhwci5maXJzdDtcclxuICAgICAgICBzd2l0Y2ggKGV4cHIubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaHRtbFwiOiB7XHJcbiAgICAgICAgICAgICAgICBleHByID0gZXhwci5maXJzdDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUGFpcmVkID0gZXhwci5uYW1lID09PSBcImh0bWxwYWlyZWRcIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhZ05hbWUgPSBleHByLmZpcnN0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkICYmIGV4cHIubGFzdC52YWx1ZSAhPT0gdGFnTmFtZSkgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gc2NvcGUuY29tcG9uZW50c1t0YWdOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRydmFsczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBleHByLmZpbmRDaGlsZHJlbihcImh0bWxhdHRyXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRydmFsc1thdHRyLmZpbmQoXCJodG1sbmFtZVwiKS52YWx1ZV0gPSB0aGlzLmV2YWxFeHByKGF0dHIuZmluZChcImh0bWxhdHRydmFsXCIpLmZpcnN0LCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gXCJ1bmtub3duXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gYCNzc3hncm91cDokeysrdGhpcy5ncm91cElkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBzW2NoaWxkcmVuXSA9IHRoaXMucGFyc2VIVE1MQ29udGVudChleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50KGNoaWxkcmVuLCBhdHRydmFscyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb21MaWIuZnVuY3Rpb25zLmRvbV9jcmVhdGUoW3RhZ05hbWVdLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGV4cHIuZmluZENoaWxkcmVuKFwiaHRtbGF0dHJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbUxpYi5mdW5jdGlvbnMuZG9tX3NldF9hdHRyKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyLmZpbmQoXCJodG1sbmFtZVwiKS52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZhbEV4cHIoYXR0ci5maW5kKFwiaHRtbGF0dHJ2YWxcIikuZmlyc3QsIHNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCBzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGFpcmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMucGFyc2VIVE1MQ29udGVudChleHByLmZpbmQoXCJodG1sY29udGVudFwiKSwgc2NvcGUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTGliLmZ1bmN0aW9ucy5kb21fYXBwZW5kKFtlbGVtZW50LCBjaGlsZF0sIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmV2YWxFeHByKGV4cHIsIHNjb3BlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50OiBBU1RFbGVtZW50LCBzY29wZTogU1NYU2NvcGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdGVtZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImNvbXBvbmVudFwiOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gc3RhdGVtZW50LmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzdGF0ZW1lbnQuZmluZENoaWxkcmVuKFwiaHRtbGF0dHJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbYXR0ci5maW5kKFwiaHRtbG5hbWVcIikudmFsdWVdID0gdGhpcy5ldmFsRXhwcihhdHRyLmZpbmQoXCJodG1sYXR0cnZhbFwiKS5maXJzdCwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY29tcG9uZW50c1tzdGF0ZW1lbnQuZmluZChcImh0bWxuYW1lXCIpLnZhbHVlXSA9IChjaGlsZHJlbjogc3RyaW5nLCBhdHRydmFsczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsU2NvcGUgPSB0aGlzLm5ld1Njb3BlKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLnZhcmlhYmxlcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0cm5hbWUgaW4gYXR0cnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUudmFyaWFibGVzW2F0dHJuYW1lXSA9IGF0dHJ2YWxzW2F0dHJuYW1lXSA/PyBhdHRyc1thdHRybmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlYyhib2R5LCBsb2NhbFNjb3BlKSA/PyBcInVua25vd25cIjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmV4ZWNTdGF0ZW1lbnQoc3RhdGVtZW50LCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBuZXdTY29wZShwYXJlbnQ/OiBTY29wZSk6IFNTWFNjb3BlIHtcclxuICAgICAgICByZXR1cm4gbmV3IFNTWFNjb3BlKHBhcmVudCk7XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNpZ21hU2NyaXB0WCB9IGZyb20gXCIuL3NpZ21hc2NyaXB0eFwiO1xyXG5cclxubmV3IFNpZ21hU2NyaXB0WCgpLmluaXRMb2FkZXIoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=