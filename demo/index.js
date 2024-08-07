(()=>{"use strict";var __webpack_modules__={842:(t,e,n)=>{n.d(e,{h:()=>i});var r=n(879),s=n(56);class i extends r.j{constructor(){super(...arguments),this.registry=new s.O("array"),this.functions={array:(...t)=>this.array(t),array_add:(t,e)=>this.add(t,e),array_remove:(t,e)=>this.remove(t,e),array_at:(t,e)=>this.at(t,e),array_set:(t,e,n)=>this.set(t,e,n),array_length:t=>this.length(t),array_find:(t,e)=>this.find(t,e)}}array(t){return this.registry.add(t)}add(t,e){return this.registry.get(t)?.push(e),"unknown"}remove(t,e){return this.registry.get(t)?.splice(Number.parseInt(e),1),"unknown"}at(t,e){return this.registry.get(t)?.at(Number.parseInt(e))??"unknown"}set(t,e,n){const r=this.registry.get(t),s=Number.parseInt(e);return r&&!Number.isNaN(s)&&s>=-r.length&&s<r.length&&(r[s<0?r.length+s:s]=n),"unknown"}length(t){const e=this.registry.get(t);return null==e?"unknown":`${e.length}`}find(t,e){const n=this.registry.get(t)?.indexOf(e);return null==n||-1===n?"unknown":`${n}`}getArray(t){return this.registry.get(t)}}},855:(t,e,n)=>{n.d(e,{a:()=>i});var r=n(879),s=n(56);class i extends r.j{constructor(){super(...arguments),this.registry=new s.O("fn"),this.functions={call:(t,...e)=>this.call(t,e)}}addFn(t){return this.registry.add(t)}getFn(t){return this.registry.get(t)}call(t,e){return this.registry.get(t)?.(...e)??"unknown"}}},879:(t,e,n)=>{n.d(e,{j:()=>s,y:()=>r});class r{constructor(t,e){this.result=null,this.runtime=t,this.func=e}use(t){this.runtime.copyScope(this.result??(this.result=this.func(this.runtime)),t)}}class s{constructor(t){this.variables={},this.functions={},this.runtime=t}use(t){Object.assign(t.variables,this.variables),Object.assign(t.functions,this.functions)}}},416:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{V:()=>JSLib});var ___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(879),_registry__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(56),_array__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(842),_fn__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(855),_ref__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(642),_struct__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(126);const ssSymbol=Symbol("ss");class JSLib extends ___WEBPACK_IMPORTED_MODULE_4__.j{constructor(){super(...arguments),this.registry=new _registry__WEBPACK_IMPORTED_MODULE_5__.O("js"),this.functions={js:t=>this.js(t),js_get:(t,e)=>this.get(t,e),js_set:(t,e,n)=>this.set(t,e,n),js_new:(t,...e)=>this.new(t,e),js_object:()=>this.toSS({}),js_array:()=>this.toSS([]),js_call:(t,...e)=>this.call(t,e),js_call_method:(t,e,...n)=>this.callMethod(t,e,n)}}getObject(t){return this.registry.get(t)}toJSObject(t){if(t.startsWith("#js:"))return this.getObject(t);if(t.startsWith("#fn")){const e=this.runtime.getLib(_fn__WEBPACK_IMPORTED_MODULE_1__.a).getFn(t);if(!e)return;return(...t)=>this.toJS(e(...t.map((t=>this.toSS(t)))))}if(t.startsWith("#struct:")){const e=this.runtime.getLib(_struct__WEBPACK_IMPORTED_MODULE_3__.B).getStruct(t);if(!e)return;const n={};for(const t in e)n[t]=this.toJS(e[t]);return n}if(t.startsWith("#array:")){const e=this.runtime.getLib(_array__WEBPACK_IMPORTED_MODULE_0__.h).getArray(t);if(!e)return;return e.map((t=>this.toJS(t)))}return t}toJS(t){if(t.startsWith("#ref:"))return this.toJS(this.runtime.getLib(_ref__WEBPACK_IMPORTED_MODULE_2__.t).get(t));if("unknown"===t)return;if("false"===t)return!1;if("true"===t)return!0;if(/^-?[0-9]+(\.[0-9]+)?$/.test(t))return Number.parseFloat(t);const e=this.toJSObject(t);return e instanceof Object&&!e[ssSymbol]&&Object.defineProperty(e,ssSymbol,{value:t,enumerable:!1}),e}toSS(t){const e=t[ssSymbol];return void 0!==e?e:null==t||Number.isNaN(t)?"unknown":"string"==typeof t||t instanceof String||"boolean"==typeof t||t instanceof Boolean||"number"==typeof t||t instanceof Number?`${t}`:this.registry.add(t)}js(code){return this.toSS(eval(code))}get(t,e){const n=this.toJS(t)?.[e];return null==n?"unknown":this.toSS(n)}set(t,e,n){const r=this.toJS(t);return null!=r&&(r[e]=this.toJS(n)),"unknown"}new(t,e){const n=this.toJS(t);if(null==n)return"unknown";const r=new n(...e.map((t=>this.toJS(t))));return null==r?"unknown":this.toSS(r)}call(t,e){const n=this.toJS(t)?.(...e.map((t=>this.toJS(t))));return null==n?"unknown":this.toSS(n)}callMethod(t,e,n){const r=this.toJS(t)?.[e]?.(...n.map((t=>this.toJS(t))));return null==r?"unknown":this.toSS(r)}}},642:(t,e,n)=>{n.d(e,{t:()=>i});var r=n(879),s=n(56);class i extends r.j{constructor(){super(...arguments),this.registry=new s.O("ref"),this.functions={ref:t=>this.ref(t),ref_set:(t,e)=>this.set(t,e),ref_get:t=>this.get(t)}}ref(t){return this.registry.add(t)}set(t,e){return this.registry.set(t,e),"unknown"}get(t){return this.registry.get(t)??"unknown"}}},126:(t,e,n)=>{n.d(e,{B:()=>i});var r=n(879),s=n(56);class i extends r.j{constructor(){super(...arguments),this.registry=new s.O("struct"),this.functions={struct:()=>this.struct(),struct_set:(t,e,n)=>this.set(t,e,n),struct_get:(t,e)=>this.get(t,e)}}struct(){return this.registry.add({})}set(t,e,n){const r=this.registry.get(t);return r&&(r[e]=n),"unknown"}get(t,e){return this.registry.get(t)?.[e]??"unknown"}getStruct(t){return this.registry.get(t)}}},56:(t,e,n)=>{n.d(e,{O:()=>r});class r{constructor(t){this.elements={},this.id=-1,this.name=t}add(t){const e=`#${this.name}:${++this.id}`;return this.elements[e]=t,e}set(t,e){t in this.elements&&(this.elements[t]=e)}get(t){return this.elements[t]}}}},__webpack_module_cache__={};function __webpack_require__(t){var e=__webpack_module_cache__[t];if(void 0!==e)return e.exports;var n=__webpack_module_cache__[t]={exports:{}};return __webpack_modules__[t](n,n.exports,__webpack_require__),n.exports}__webpack_require__.d=(t,e)=>{for(var n in e)__webpack_require__.o(e,n)&&!__webpack_require__.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},__webpack_require__.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var __webpack_exports__={};(()=>{var t=__webpack_require__(879),e=__webpack_require__(855),n=__webpack_require__(416),r=__webpack_require__(56);class s extends t.j{constructor(){super(...arguments),this.registry=new r.O("dom"),this.variables={dom_head:this.registry.add(document.head),dom_body:this.registry.add(document.body)},this.functions={dom_title:t=>this.title(t),dom_create:t=>this.create(t),dom_find:t=>this.find(t),dom_append:(t,e)=>this.append(t,e),dom_remove:t=>this.remove(t),dom_add_class:(t,e)=>this.addClass(t,e),dom_remove_class:(t,e)=>this.removeClass(t,e),dom_toggle_class:(t,e)=>this.toggleClass(t,e),dom_set_text:(t,e)=>this.setText(t,e),dom_set_html:(t,e)=>this.setHtml(t,e),dom_set_attr:(t,e,n)=>this.setAttr(t,e,n),dom_get_attr:(t,e)=>this.getAttr(t,e),dom_css:(t,e,n)=>this.css(t,e,n),dom_event:(t,e,n)=>this.event(t,e,n)}}getElement(t){return this.registry.get(t)}title(t){return document.title=t,"unknown"}create(t){return this.registry.add(document.createElement(t))}find(t){const e=document.querySelector(t);return e?this.registry.add(e):"unknown"}append(t,e){return this.getElement(t)?.appendChild(this.getElement(e)??document.createTextNode(e)),"unknown"}remove(t){return this.getElement(t).remove(),"unknown"}addClass(t,e){const n=this.getElement(t);return n instanceof HTMLElement&&n.classList.add(e),"unknown"}removeClass(t,e){const n=this.getElement(t);return n instanceof HTMLElement&&n.classList.remove(e),"unknown"}toggleClass(t,e){const n=this.getElement(t);return n instanceof HTMLElement&&n.classList.toggle(e),"unknown"}setText(t,e){const n=this.getElement(t);return n instanceof HTMLElement&&(n.innerText=e),"unknown"}setHtml(t,e){const n=this.getElement(t);return n instanceof HTMLElement&&(n.innerHTML=e),"unknown"}setAttr(t,e,n){return e.startsWith("on")?this.event(t,e.slice(2),n):this.getElement(t)?.setAttribute(e,n),"unknown"}getAttr(t,e){return this.getElement(t)?.getAttribute(e)}css(t,e,n){const r=this.getElement(t);return r instanceof HTMLElement&&r.style.setProperty(e,n),"unknown"}event(t,n,r){const s=this.getElement(t),i=this.runtime.getLib(e.a).getFn(r);return i&&s.addEventListener(n,(()=>i())),"unknown"}}class i extends n.V{constructor(){super(...arguments),this.variables={js_env:"browser",js_window:this.registry.add(window),js_global:this.registry.add(globalThis)}}toJSObject(t){return t.startsWith("#dom:")?this.runtime.getLib(s).getElement(t):super.toJSObject(t)}}var o=__webpack_require__(642);class a extends t.j{constructor(){super(...arguments),this.functions={string_at:(t,e)=>t.at(Number.parseInt(e))??"unknown",string_length:t=>`${t.length}`,string_slice:(t,e,n)=>t.slice(Number.parseInt(e),Number.parseInt(n)),string_replace:(t,e,n)=>t.replaceAll(e,n),string_format:(t,...e)=>this.format(t,e)}}format(t,e){if(0===e.length)return t;let n="";const r=t.length;let s=0,i=0;for(;s<r;){const r=t[s];if(++s,"%"===r){if("%"!==t[s]){if(n+=e[i],++i,i>=e.length){n+=t.slice(s);break}continue}++s}n+=r}return n}}var c=__webpack_require__(126),l=__webpack_require__(842);function u(t){return(...e)=>{const n=t(...e.map((t=>Number.parseFloat(t))));return Number.isNaN(n)?"unknown":`${n}`}}class h extends t.j{constructor(){super(...arguments),this.variables={pi:`${Math.PI}`},this.functions={abs:u((t=>Math.abs(t))),sign:u((t=>Math.sign(t))),sqrt:u((t=>Math.sqrt(t))),mod:u(((t,e)=>t%e)),sin:u((t=>Math.sin(t))),cos:u((t=>Math.cos(t))),tan:u((t=>Math.tan(t))),asin:u((t=>Math.asin(t))),acos:u((t=>Math.acos(t))),atan:u(((t,e)=>null==e?Math.atan(t):Math.atan2(t,e))),sinh:u((t=>Math.sinh(t))),cosh:u((t=>Math.cosh(t))),tanh:u((t=>Math.tanh(t))),asinh:u((t=>Math.asinh(t))),acosh:u((t=>Math.acosh(t))),atanh:u((t=>Math.atanh(t))),exp:u((t=>Math.exp(t))),rad:u((t=>t*Math.PI/180)),deg:u((t=>180*t/Math.PI)),round:u(((t,e=1)=>Math.round(t/e)*e)),floor:u(((t,e=1)=>Math.floor(t/e)*e)),ceil:u(((t,e=1)=>Math.ceil(t/e)*e)),random:()=>`${Math.random()}`,randint:(t,e)=>this.randint(t,e)}}randint(t,e){const n=Number.parseFloat(t),r=Number.parseFloat(e),s=Math.min(n,r),i=Math.max(n,r);return`${Math.random()*(i-s)+s}`}}const p=new class{constructor(){this.libs={}}addLib(t,e){return this.libs[t]=e}getLib(t){return Object.values(this.libs).find((e=>e instanceof t))}lib(e,n){this.addLib(e,new t.y(this,n))}scope(t){const e={variables:{},functions:{}};return t&&this.copyScope(t,e),e}copyScope(t,e){Object.assign(e.variables,t.variables),Object.assign(e.functions,t.functions)}lambda(t){return this.getLib(e.a).addFn(t)}print(t){void 0===(t=this.getLib(n.V).toJS(t))&&(t="unknown"),console.log(t)}};var d;p.addLib("dom",new s(p)),p.addLib("fn",new e.a(p)),p.addLib("js",new i(p)),p.addLib("ref",new o.t(p)),p.addLib("string",new a(p)),p.addLib("struct",new c.B(p)),p.addLib("array",new l.h(p)),p.addLib("math",new h(p)),function(t){t.isWhitespace=function(t){return" "===t||"\n"===t||"\r"===t},t.isDigit=function(t){if(!t)return!1;const e=t.charCodeAt(0);return e>=48&&e<=57},t.isLetter=function(t){if(!t)return!1;const e=t.toLowerCase().charCodeAt(0);return e>=97&&e<=122}}(d||(d={}));class m{constructor(t){this.buffer=t,this._offset=0,this.line=0,this.column=0}get location(){return{offset:this._offset,line:this.line,column:this.column}}set location(t){this._offset=t.offset,this.line=t.line,this.column=t.column}get offset(){return this._offset}peekch(){return this.buffer[this._offset]}consume(){"\n"===this.peekch()?(++this.line,this.column=0):++this.column,++this._offset}}class _{constructor(t={},e){this.elements=t,this.last=e}with(t,e){const n={...this.elements};return n[t]=n[t]?[...n[t],e]:[e],new _(n,e)}has(t,e){return this.elements[t]?.includes(e)}}class f{}class g extends f{constructor(t){super(),this.ch=t}match(t){const e=t.location;if(t.peekch()===this.ch)return t.consume(),{start:e,end:t.location}}}class b extends f{constructor(t,e){super(),this.a=t,this.b=e}match(t,e,n=1,r=new _,s={}){const i=t.location,o=!(this.a instanceof M&&r.has(i.offset,this.a.name))&&this.a.match(t,e,n,r,s),a=t.location;t.location=i;const c=!(this.b instanceof M&&r.has(i.offset,this.b.name))&&this.b.match(t,e,n,r,s),l=t.location;let u=!o&&c||!c&&o;if(o&&c&&(u=a.offset>l.offset?o:c),u===o&&(t.location=a),u)return{start:i,end:t.location,children:[u]}}}class w extends f{match(t){const e=t.location;for(;d.isWhitespace(t.peekch());)t.consume();return{start:e,end:t.location}}}class x extends f{match(t){const e=t.location;if(t.peekch())return t.consume(),{start:e,end:t.location}}}class y extends f{match(t){const e=t.location;if(d.isDigit(t.peekch()))return t.consume(),{start:e,end:t.location}}}class E extends f{constructor(t){super(),this.pattern=t}match(t,e,n=1,r=new _,s={}){const i=t.location,o=this.pattern.match(t,e,n,r,s);return o||(t.location=i),{start:i,end:t.location,children:o?[o]:[]}}}class k extends f{constructor(t){super(),this.pattern=t}match(t,e,n=1,r=new _,s={}){const i=t.location;let o=this.pattern.match(t,e,n,r,s);const a=[o];if(!o)return;let c=t.location;for(;(o=this.pattern.match(t,e,n,r,s))&&c.offset!==t.offset;)a.push(o),c=t.location;return t.location=c,{start:i,end:t.location,children:a}}}class $ extends f{constructor(t,e){super(),this.group=t,this.disallow=e}match(t){const e=t.location,n=t.peekch();if(!n)return;const r=n.charCodeAt(0);t.consume();for(const s of this.group)if(Array.isArray(s)&&r>=s[0].charCodeAt(0)&&r<=s[1].charCodeAt(0)||n===s)return!this.disallow&&{start:e,end:t.location};return this.disallow&&{start:e,end:t.location}}}class v extends f{constructor(t){super(),this.children=t}match(t,e,n=1,r=new _,s={}){const i=t.location,o=[];for(const i of this.children){const a=i.match(t,e,n,r,s);if(!a)return;o.push(a)}return{start:i,end:t.location,children:o}}}class M extends f{constructor(t,e){super(),this.name=t,this.unmatched=e}match(t,e,n=1,r=new _,s={}){const i=`${n},${r.last},${t.offset},${this.name}`,o=s[i];if(void 0!==o)return o&&(t.location=o.end),o;const a=t.location;r=r.with(a.offset,this.name);const c=e.get(this.name);if(!c||c.precedence&&c.precedence<n)return s[i]=null;const l=c.match(t,e,c.precedence||c.preservePrecedence?c.precedence??n:1,r,s);return this.unmatched?s[i]=l:s[i]=l?{name:this.name,start:a,end:t.location,children:[l]}:null}}function S(t){return"%"===t||"|"===t||"("===t||")"===t||"+"===t||"?"===t||"."===t}function L(t,e,n=!1){const r=[];let s,i=!1;for(;s=t.peekch();){if(t.consume(),"%"===s)if(s=t.peekch(),S(s))t.consume(),r.push(new g(s));else{let e=!1;"!"===t.peekch()&&(e=!0,t.consume());let n="";for(;d.isLetter(s=t.peekch());)t.consume(),n+=s;"d"===n?r.push(new y):r.push(new M(n,e))}else if("("===s)r.push(L(t,e));else{if(")"===s)break;if("["===s){const e="^"===t.peekch();e&&t.consume();const n=[];let i=!1;for(;s=t.peekch();){t.consume();const e=n.length;if("%"===s&&"]"===t.peekch())t.consume(),n.push("]");else{if("]"===s)break;if("-"===s&&!i&&e>0&&!Array.isArray(n.at(-1))){i=!0;continue}n.push(s)}if(i){i=!1;const t=n.pop();n.push([n.pop(),t])}}r.push(new $(n,e))}else if("."===s)r.push(new x);else if(" "===s)r.push(new w);else{if("|"===s&&r.length>0&&!i){i=!0;continue}"?"===s&&r.length>0?r.push(new E(r.pop())):"+"===s&&r.length>0?r.push(new k(r.pop())):r.push(new g(s))}}i&&(r.push(new b(r.pop(),r.pop())),i=!1)}const o=1===r.length?r[0]:new v(r);return o.precedence=e,o.preservePrecedence=n,o}function j(t,e,n){return L(new m(t),e,n)}class O{constructor(t,e,n,r){this.name=t,this.start=e,this.end=n,this.value=r,this.children=[]}get first(){return this.children[0]}get last(){return this.children.at(-1)}*[Symbol.iterator](){for(const t of this.children)yield t}addChild(t){this.children.push(t)}get(t){return this.children[t]}findChildren(t){return this.children.filter((e=>e.name===t))}findChild(t){return this.children.find((e=>e.name===t))}find(t){const e=this.findChild(t);if(e)return e;for(const e of this.children){const n=e.find(t);if(n)return n}}}class P{constructor(t){this.patterns=new Map,this.cache={};for(const[e,n]of Object.entries(t))"string"==typeof n?this.patterns.set(e,j(n)):this.patterns.set(e,j(n.pattern,n.precedence,n.preservePrecedence))}parse(t){const e=this.cache[t];if(void 0!==e)return e;const n=this.patterns.get("root").match(new m(t),this.patterns);if(!n)return;const r=new O("root",n.start,n.end,t.slice(n.start.offset,n.end.offset));return function e(n,r){if(n.name){const e=new O(n.name,n.start,n.end,t.slice(n.start.offset,n.end.offset));r.addChild(e),r=e}if(n.children)for(const t of n.children)e(t,r)}(n,r),r}}function C(t,e){return e.replace(/\.\.\./g,t)}function A(t,e){return t?e?"string"==typeof t&&"string"==typeof e?C(t,e):"string"==typeof t&&"string"!=typeof e?{...e,pattern:C(t,e.pattern)}:"string"!=typeof t&&"string"==typeof e?{...t,pattern:C(t.pattern,e)}:"string"!=typeof t&&"string"!=typeof e?{pattern:C(t.pattern,e.pattern),precedence:e.precedence??t.precedence,preservePrecedence:e.preservePrecedence??t.preservePrecedence}:void 0:t:e}const I={number:"%d+(%.%d+)?",name:"[a-zA-Z_][a-zA-Z0-9_]+?",string:'"([^"]|(\\\\)|(\\"))+?"',bool:"(true)|(false)",neg:"- %expr",add:{pattern:"%expr %+ %expr",precedence:5},sub:{pattern:"%expr - %expr",precedence:5},mul:{pattern:"%expr * %expr",precedence:6},div:{pattern:"%expr / %expr",precedence:6},concat:{pattern:"%expr @ %expr",precedence:1},eq:{pattern:"%expr = %expr",precedence:4},lt:{pattern:"%expr < %expr",precedence:4},gt:{pattern:"%expr > %expr",precedence:4},le:{pattern:"%expr <= %expr",precedence:4},ge:{pattern:"%expr >= %expr",precedence:4},or:{pattern:"%expr %| %expr",precedence:2},and:{pattern:"%expr & %expr",precedence:3},not:"! %expr",arglist:"(%expr( , %expr)+?)?",call:"%name %( %arglist %)",lambda:"%( %paramlist %) => ({ %body })|%expr",parenthesisexpr:"%( %expr %)",expr:{pattern:"%parenthesisexpr|%number|%string|%bool|%name|%neg|%add|%sub|%mul|%div|%concat|%eq|%lt|%gt|%le|%ge|%or|%and|%not|%call|%lambda",preservePrecedence:!0},assign:"%name = %expr;",paramlist:"(%name( , %name)+?)?",if:"if %expr { %body } %else?",else:"else { %body }",while:"while %expr { %body }",function:"fn %name %( %paramlist %) { %body }",return:"ret %expr;",callstat:"%call;",print:"print %expr;",statement:"%assign|%if|%while|%function|%return|%callstat|%print",comment:"//[^\n]+?",comments:"( %!comment )+?",body:"( %!comments %statement %!comments )+?",use:"use %name;",imports:"( %use %!comments )+?",lib:"lib %name;",root:"%!comments %lib? %!comments %imports %body %!comments"},q={"hello-world":'print "Hello world!";',structures:'\nprint "loop from 1 to 10";\nx = 0;\nwhile x < 10 {\n    x = x + 1;\n    print x;\n}\n    \nif x = 10 {\n    print "x = 10";\n} else {\n    print "x ≠ 10";\n}\n',fibonacci:'\nfn fib(n) {\n    if n = 1 | n = 2 { ret 1; }\n    ret fib(n - 1) + fib(n - 2);\n}\n\nprint "10th Fibonacci number is " @ fib(10);\n',dom:'\nuse dom;\nuse js;\n\nprompt = js_get(js_window, "prompt");\ncolor = js_call(prompt, "Enter background color", "white");\ndom_css(dom_body, "background-color", color);\n',ref:'\nuse ref;\n\nfn inc(ref) {\n    ref_set(ref, ref_get(ref) + 1);\n}\n\nx = ref(0);\nprint "x = " @ ref_get(x);\n\ninc(x);\nprint "x = " @ ref_get(x);\n',callbacks:'\nuse fn;\n\nfn foo() {\n    print "I am foo";\n    ret 123;\n}\n\nfn bar(callback) {\n    print "I am bar";\n    print "I got " @ call(callback) @ " from callback";\n}\n\nbar(fn("foo"));\n',string:'\nuse string;\n\nstr = string_format("Hello, %!", "world");\nprint str;\nprint string_length(str);\nprint string_replace(str, "world", "banana");\n',struct:'\nuse struct;\n\nfn point_new(x, y) {\n    point = struct();\n    struct_set(point, "x", x);\n    struct_set(point, "y", y);\n    ret point;\n}\n\nfn point_str(point) {\n    x = struct_get(point, "x");\n    y = struct_get(point, "y");\n    ret "{ x=" @ x @ ", y=" @ y @ " }";\n}\n\np1 = point_new(123, 321);\np2 = point_new(321, 123);\n\nprint "p1: " @ point_str(p1);\nprint "p2: " @ point_str(p2);\n',array:"\nuse array;\n\narray = array(1, 2, 3, 4, 5);\nprint array_at(array, 0);\narray_remove(array, 0);\nprint array_at(array, 0);"},D=new class{constructor(t,e={}){this.runtime=t,this.parser=new P(function(t,e){const n={root:A(t.root,e.root)};for(const r in t)r in n||(n[r]=A(t[r],e[r]));for(const r in e)r in n||(n[r]=A(t[r],e[r]));return n}(I,e))}compileExpr(t,e){switch("expr"===t.name&&(t=t.first),t.name){case"parenthesisexpr":return`(${this.compileExpr(t.first,e)})`;case"name":return`(scope${e}.variables.${t.value} ?? "unknown")`;case"number":case"bool":return`"${t.value}"`;case"string":return t.value;case"neg":return`\`\${-${this.compileExpr(t.first,e)}}\``;case"add":return`\`\${+${this.compileExpr(t.first,e)} + +${this.compileExpr(t.last,e)}}\``;case"sub":return`\`\${+${this.compileExpr(t.first,e)} - +${this.compileExpr(t.last,e)}}\``;case"mul":return`\`\${+${this.compileExpr(t.first,e)} * +${this.compileExpr(t.last,e)}}\``;case"div":return`\`\${+${this.compileExpr(t.first,e)} / +${this.compileExpr(t.last,e)}}\``;case"eq":return`\`\${${this.compileExpr(t.first,e)} === ${this.compileExpr(t.last,e)}}\``;case"lt":return`\`\${+${this.compileExpr(t.first,e)} < +${this.compileExpr(t.last,e)}}\``;case"gt":return`\`\${+${this.compileExpr(t.first,e)} > +${this.compileExpr(t.last,e)}}\``;case"le":return`\`\${+${this.compileExpr(t.first,e)} <= +${this.compileExpr(t.last,e)}}\``;case"ge":return`\`\${+${this.compileExpr(t.first,e)} >= +${this.compileExpr(t.last,e)}}\``;case"or":return`\`\${${this.compileExpr(t.first,e)} === "true" || ${this.compileExpr(t.last,e)} === "true"}\``;case"and":return`\`\${${this.compileExpr(t.first,e)} === "true" && ${this.compileExpr(t.last,e)} === "true"}\``;case"not":return`\`\${${this.compileExpr(t.first,e)} === "true" ? "false" : "true"}\``;case"concat":return`${this.compileExpr(t.first,e)} + ${this.compileExpr(t.last,e)}`;case"call":return`(${this.compileCall(t,e)} ?? "unknown")`;case"lambda":return`runtime.lambda(${t.findChild("expr")?this.compileLambda(t,e):this.compileFunction(t,e)})`}}compileCall(t,e){return`scope${e}.functions.${t.find("name").value}?.(${Array.from(t.find("arglist")).map((t=>this.compileExpr(t,e))).join(", ")})`}compileFunction(t,e){const n=Array.from(t.find("paramlist"));return`(${n.map(((t,e)=>`arg${e}="unknown"`)).join(", ")}) => {\n${this.localScope(++e)+n.map(((t,n)=>`scope${e}.variables.${t.value} = arg${n};\n`)).join("")+this.compileBody(t.find("body"),e)}return "unknown";\n}`}compileLambda(t,e){const n=Array.from(t.find("paramlist"));return`(${n.map(((t,e)=>`arg${e}="unknown"`)).join(", ")}) => {\n${this.localScope(++e)+n.map(((t,n)=>`scope${e}.variables.${t.value} = arg${n};\n`)).join("")}return ${this.compileExpr(t.find("expr"),e)};\n}`}compileStatement(t,e){switch(t.name){case"assign":return`scope${e}.variables.${t.find("name").value} = ${this.compileExpr(t.find("expr"),e)};`;case"if":{let n=`if ((${this.compileExpr(t.find("expr"),e)}) === "true") {\n${this.compileBody(t.find("body"),e)}}`;const r=t.findChild("else");return r&&(n+=`\nelse {\n${this.compileBody(r.find("body"),e)}}`),n}case"while":return`while ((${this.compileExpr(t.find("expr"),e)}) === "true") {\n${this.compileBody(t.find("body"),e)}}`;case"function":return`scope${e}.functions.${t.find("name").value} = ${this.compileFunction(t,e)};`;case"print":return`runtime.print(${this.compileExpr(t.find("expr"),e)});`;case"callstat":return this.compileCall(t.first,e)+";";case"return":return`return ${this.compileExpr(t.find("expr"),e)};`}}compileBody(t,e=0){let n="";for(const{first:r}of t)n+=this.compileStatement(r,e)+"\n";return n}localScope(t){return`const scope${t} = runtime.scope(scope${t-1});\n`}globalScope(){return"const scope0 = runtime.scope();\n"}compileImports(t){let e="";for(const n of t)e+=`runtime.libs.${n.find("name").value}?.use(scope0);\n`;return e}compileProgram(t){let e=this.globalScope();return e+=this.compileImports(t.find("imports")),e+=this.compileBody(t.find("body")),e+="return scope0;\n",e}createFunction(t){return Function("runtime",this.compileProgram(t))}getLibName(t){return this.parser.parse(t)?.findChild("lib")?.find("name")?.value}compile(t){const e=this.parser.parse(t);if(e&&e.end.offset===t.length)return this.compileProgram(e)}load(e){const n=this.parser.parse(e);if(!n||n.end.offset!==e.length)return;const r=n.findChild("lib"),s=this.createFunction(n);if(!r)return s(this.runtime);this.runtime.addLib(r.find("name").value,new t.y(this.runtime,s))}}(p),B=document.getElementById("code"),T=document.getElementById("run"),N=document.getElementById("demo-select");T.addEventListener("click",(()=>{D.load(B.value)||console.error("invalid syntax")})),N.addEventListener("change",(()=>{B.value=q[N.value].trim()})),B.value=q["hello-world"].trim()})()})();