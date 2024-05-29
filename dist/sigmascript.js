(()=>{"use strict";var __webpack_modules__={111:(e,t,n)=>{var r;n.d(t,{b:()=>q}),function(e){e.isWhitespace=function(e){return" "===e||"\n"===e||"\r"===e},e.isDigit=function(e){if(!e)return!1;const t=e.charCodeAt(0);return t>=48&&t<=57},e.isLetter=function(e){if(!e)return!1;const t=e.toLowerCase().charCodeAt(0);return t>=97&&t<=122}}(r||(r={}));class s{constructor(e){this.buffer=e,this._offset=0,this.line=0,this.column=0}get location(){return{offset:this._offset,line:this.line,column:this.column}}set location(e){this._offset=e.offset,this.line=e.line,this.column=e.column}get offset(){return this._offset}peekch(){return this.buffer[this._offset]}consume(){"\n"===this.peekch()?(++this.line,this.column=0):++this.column,++this._offset}}class o{constructor(e={},t){this.elements=e,this.last=t}with(e,t){const n=Object.assign({},this.elements);return n[e]=n[e]?[...n[e],t]:[t],new o(n,t)}has(e,t){var n;return null===(n=this.elements[e])||void 0===n?void 0:n.includes(t)}}class c{}class i extends c{constructor(e){super(),this.ch=e}match(e){const t=e.location;if(e.peekch()===this.ch)return e.consume(),{start:t,end:e.location}}}class a extends c{constructor(e,t){super(),this.a=e,this.b=t}match(e,t,n=1,r=new o,s={}){const c=e.location,i=!(this.a instanceof _&&r.has(c.offset,this.a.name))&&this.a.match(e,t,n,r,s),a=e.location;e.location=c;const u=!(this.b instanceof _&&r.has(c.offset,this.b.name))&&this.b.match(e,t,n,r,s),l=e.location;let f=!i&&u||!u&&i;if(i&&u&&(f=a.offset>l.offset?i:u),f===i&&(e.location=a),f)return{start:c,end:e.location,children:[f]}}}class u extends c{match(e){const t=e.location;for(;r.isWhitespace(e.peekch());)e.consume();return{start:t,end:e.location}}}class l extends c{match(e){const t=e.location;if(e.peekch())return e.consume(),{start:t,end:e.location}}}class f extends c{match(e){const t=e.location;if(r.isDigit(e.peekch()))return e.consume(),{start:t,end:e.location}}}class d extends c{constructor(e){super(),this.pattern=e}match(e,t,n=1,r=new o,s={}){const c=e.location,i=this.pattern.match(e,t,n,r,s);return i||(e.location=c),{start:c,end:e.location,children:i?[i]:[]}}}class p extends c{constructor(e){super(),this.pattern=e}match(e,t,n=1,r=new o,s={}){const c=e.location;let i=this.pattern.match(e,t,n,r,s);const a=[i];if(!i)return;let u=e.location;for(;(i=this.pattern.match(e,t,n,r,s))&&u.offset!==e.offset;)a.push(i),u=e.location;return e.location=u,{start:c,end:e.location,children:a}}}class h extends c{constructor(e,t){super(),this.group=e,this.disallow=t}match(e){const t=e.location,n=e.peekch();if(!n)return;const r=n.charCodeAt(0);e.consume();for(const s of this.group)if(Array.isArray(s)&&r>=s[0].charCodeAt(0)&&r<=s[1].charCodeAt(0)||n===s)return!this.disallow&&{start:t,end:e.location};return this.disallow&&{start:t,end:e.location}}}class m extends c{constructor(e){super(),this.children=e}match(e,t,n=1,r=new o,s={}){const c=e.location,i=[];for(const o of this.children){const c=o.match(e,t,n,r,s);if(!c)return;i.push(c)}return{start:c,end:e.location,children:i}}}class _ extends c{constructor(e){super(),this.name=e}match(e,t,n=1,r=new o,s={}){var c;const i=`${n},${r.last},${e.offset},${this.name}`,a=s[i];if(void 0!==a)return a&&(e.location=a.end),a;const u=e.location;r=r.with(u.offset,this.name);const l=t.get(this.name);if(!l||l.precedence&&l.precedence<n)return s[i]=null;const f=l.match(e,t,l.precedence||l.preservePrecedence?null!==(c=l.precedence)&&void 0!==c?c:n:1,r,s);return s[i]=f?{name:this.name,start:u,end:e.location,children:[f]}:null}}function b(e){return"%"===e||"|"===e||"("===e||")"===e||"+"===e||"?"===e}function w(e,t,n=!1){const s=[];let o,c=!1;for(;o=e.peekch();){if(e.consume(),"%"===o)if(o=e.peekch(),b(o))e.consume(),s.push(new i(o));else{let t="";for(;r.isLetter(o=e.peekch());)e.consume(),t+=o;"d"===t?s.push(new f):s.push(new _(t))}else if("("===o)s.push(w(e,t));else{if(")"===o)break;if("["===o){const t="^"===e.peekch();t&&e.consume();const n=[];let r=!1;for(;o=e.peekch();){e.consume();const t=n.length;if("%"===o&&"]"===e.peekch())e.consume(),n.push("]");else{if("]"===o)break;if("-"===o&&!r&&t>0&&!Array.isArray(n.at(-1))){r=!0;continue}n.push(o)}if(r){r=!1;const e=n.pop();n.push([n.pop(),e])}}s.push(new h(n,t))}else if("."===o)s.push(new l);else if(" "===o)s.push(new u);else{if("|"===o&&s.length>0&&!c){c=!0;continue}"?"===o&&s.length>0?s.push(new d(s.pop())):"+"===o&&s.length>0?s.push(new p(s.pop())):s.push(new i(o))}}c&&(s.push(new a(s.pop(),s.pop())),c=!1)}const v=1===s.length?s[0]:new m(s);return v.precedence=t,v.preservePrecedence=n,v}function v(e,t,n){return w(new s(e),t,n)}class k{constructor(e,t,n,r){this.name=e,this.start=t,this.end=n,this.value=r,this.children=[]}get first(){return this.children[0]}get last(){return this.children.at(-1)}*[Symbol.iterator](){for(const e of this.children)yield e}addChild(e){this.children.push(e)}get(e){return this.children[e]}findChild(e){return this.children.find((t=>t.name===e))}find(e){const t=this.findChild(e);if(t)return t;for(const t of this.children){const n=t.find(e);if(n)return n}}}class g{constructor(e){this.patterns=new Map;for(const[t,n]of Object.entries(e))"string"==typeof n?this.patterns.set(t,v(n)):this.patterns.set(t,v(n.pattern,n.precedence,n.preservePrecedence))}parse(e){const t=this.patterns.get("root").match(new s(e),this.patterns);if(!t)return;const n=new k("root",t.start,t.end,e.slice(t.start.offset,t.end.offset));return function t(n,r){if(n.name){const t=new k(n.name,n.start,n.end,e.slice(n.start.offset,n.end.offset));r.addChild(t),r=t}if(n.children)for(const e of n.children)t(e,r)}(t,n),n}}var x=n(152);let N=-1;const j={};function y(e){const t="#dom:"+ ++N;return j[t]=e,t}function O(e){return j[e]}const I=new x.j({dom_head:y(document.head),dom_body:y(document.body)},{dom_title:([e])=>(document.title=e,"unknown"),dom_create:([e])=>y(document.createElement(e)),dom_find([e]){const t=document.querySelector(e);return t?y(t):"unknown"},dom_append([e,t]){var n;return null===(n=O(e))||void 0===n||n.appendChild(O(t)),"unknown"},dom_remove:([e])=>(O(e).remove(),"unknown"),dom_add_class([e,t]){const n=O(e);return n instanceof HTMLElement&&n.classList.add(t),"unknown"},dom_remove_class([e,t]){const n=O(e);return n instanceof HTMLElement&&n.classList.remove(t),"unknown"},dom_toggle_class([e,t]){const n=O(e);return n instanceof HTMLElement&&n.classList.toggle(t),"unknown"},dom_set_text([e,t]){const n=O(e);return n instanceof HTMLElement&&(n.innerText=t),"unknown"},dom_set_html([e,t]){const n=O(e);return n instanceof HTMLElement&&(n.innerHTML=t),"unknown"},dom_set_attr([e,t,n]){var r;return null===(r=O(e))||void 0===r||r.setAttribute(t,n),"unknown"},dom_get_attr([e,t]){var n;return null===(n=O(e))||void 0===n?void 0:n.getAttribute(t)},dom_css([e,t,n]){const r=O(e);return r instanceof HTMLElement&&r.style.setProperty(t,n),"unknown"}});let S=-1;const A={},L=new x.j({},{fn([e],{functions:t}){const n="#fn:"+ ++S;return A[n]=t[e],n},call([e,...t],n){var r,s;return null!==(s=null===(r=A[e])||void 0===r?void 0:r.call(A,t,n))&&void 0!==s?s:void 0}});var $=n(416);let C=-1;const E={},T=new x.j({},{ref([e]){const t="#ref:"+ ++C;return E[t]=null!=e?e:"unknown",t},ref_set:([e,t])=>(E[e]=t,"unknown"),ref_get([e]){var t;return null!==(t=E[e])&&void 0!==t?t:"unknown"}});var q;!function(e){const t=new g({number:"%d+",name:"[a-zA-Z_][a-zA-Z0-9_]+?",string:'"([^"]|(\\\\)|(\\"))+?"',bool:"(true)|(false)",add:{pattern:"%expr %+ %expr",precedence:5},sub:{pattern:"%expr - %expr",precedence:5},mul:{pattern:"%expr * %expr",precedence:6},div:{pattern:"%expr / %expr",precedence:6},concat:{pattern:"%expr @ %expr",precedence:1},eq:{pattern:"%expr = %expr",precedence:4},lt:{pattern:"%expr < %expr",precedence:4},gt:{pattern:"%expr > %expr",precedence:4},le:{pattern:"%expr <= %expr",precedence:4},ge:{pattern:"%expr >= %expr",precedence:4},or:{pattern:"%expr %| %expr",precedence:2},and:{pattern:"%expr & %expr",precedence:3},not:"! %expr",arglist:"(%expr( , %expr)+?)?",call:"%name %( %arglist %)",parenthesisexpr:"%( %expr %)",expr:{pattern:"%parenthesisexpr|%number|%string|%bool|%name|%add|%sub|%mul|%div|%concat|%eq|%lt|%gt|%le|%ge|%or|%and|%not|%call",preservePrecedence:!0},assign:"%name = %expr;",paramlist:"(%name( , %name)+?)?",if:"if %expr { %body } %else?",else:"else { %body }",while:"while %expr { %body }",function:"fn %name %( %paramlist %) { %body }",return:"ret %expr;",callstat:"%call;",print:"print %expr;",statement:"%assign|%if|%while|%function|%return|%callstat|%print",body:"( %statement )+?",use:"use %name;",imports:"( %use )+?",lib:"lib %name;",root:"%lib? %imports %body"}),n={};function r(e,t,n){var s;switch((e=e.first).name){case"parenthesisexpr":return r(e.first,t,n);case"name":return null!==(s=t[e.value])&&void 0!==s?s:"unknown";case"number":case"bool":return e.value;case"string":return e.value.slice(1,-1).replace(/\\\"/g,'"').replace(/\\\\/g,"\\");case"add":{const s=r(e.first,t,n),o=r(e.last,t,n),c=Number.parseInt(s)+Number.parseInt(o);return Number.isNaN(c)?"unknown":`${c}`}case"sub":{const s=r(e.first,t,n),o=r(e.last,t,n),c=Number.parseInt(s)-Number.parseInt(o);return Number.isNaN(c)?"unknown":`${c}`}case"mul":{const s=r(e.first,t,n),o=r(e.last,t,n),c=Number.parseInt(s)*Number.parseInt(o);return Number.isNaN(c)?"unknown":`${c}`}case"div":{const s=r(e.first,t,n),o=r(e.last,t,n),c=~~(Number.parseInt(s)/Number.parseInt(o));return Number.isNaN(c)?"unknown":`${c}`}case"eq":return`${r(e.first,t,n)===r(e.last,t,n)}`;case"lt":{const s=Number.parseInt(r(e.first,t,n)),o=Number.parseInt(r(e.last,t,n));return Number.isNaN(s)||Number.isNaN(o)?"unknown":`${s<o}`}case"gt":{const s=Number.parseInt(r(e.first,t,n)),o=Number.parseInt(r(e.last,t,n));return Number.isNaN(s)||Number.isNaN(o)?"unknown":`${s>o}`}case"le":{const s=Number.parseInt(r(e.first,t,n)),o=Number.parseInt(r(e.last,t,n));return Number.isNaN(s)||Number.isNaN(o)?"unknown":`${s<=o}`}case"ge":{const s=Number.parseInt(r(e.first,t,n)),o=Number.parseInt(r(e.last,t,n));return Number.isNaN(s)||Number.isNaN(o)?"unknown":`${s>=o}`}case"or":{const s=r(e.first,t,n),o=r(e.last,t,n);return`${"true"===s||"true"===o}`}case"and":{const s=r(e.first,t,n),o=r(e.last,t,n);return`${"true"===s&&"true"===o}`}case"not":return"true"===r(e.first,t,n)?"false":"true";case"concat":return r(e.first,t,n)+r(e.last,t,n);case"call":{const s=e.find("name").value,o=n[s];return o?o(Array.from(e.find("arglist")).map((e=>r(e,t,n))),{variables:t,functions:n}):"unknown"}}return"unknown"}function s(e,t,n){for(const{first:o}of e)switch(o.name){case"assign":t[o.find("name").value]=r(o.find("expr"),t,n);break;case"if":{const e=r(o.find("expr"),t,n);let c;"true"===e&&(c=s(o.find("body"),t,n));const i=o.findChild("else");if(i&&"false"===e&&(c=s(i.find("body"),t,n)),c)return c;break}case"while":{const e=o.find("expr"),c=o.find("body");for(;"true"===r(e,t,n);){const e=s(c,t,n);if(e)return e}break}case"function":{const e=o.find("body"),r=Array.from(o.find("paramlist")).map((e=>e.value));n[o.find("name").value]=o=>{var c;const i=Object.assign({},t),a=Object.assign({},n);let u=0;for(const e of r){const t=o[u];if(!t)break;i[e]=t,++u}return null!==(c=s(e,i,a))&&void 0!==c?c:"unknown"};break}case"print":console.log(r(o.find("expr"),t,n));break;case"callstat":r(o,t,n);break;case"return":return r(o.find("expr"),t,n)}}function o(e){const{variables:t,functions:r}=function(e){const t={},r={};for(const s of e){const e=s.find("name").value;if(e in n)n[e].use(t,r);else switch(e){case"js":$.T.use(t,r);break;case"dom":I.use(t,r);break;case"ref":T.use(t,r);break;case"fn":L.use(t,r)}}return{variables:t,functions:r}}(e.find("imports"));return s(e.find("body"),t,r),{variables:t,functions:r}}e.execute=o,e.load=function(e){const r=t.parse(e);if(!r||r.end.offset!==e.length)return;const s=r.findChild("lib");if(!s)return o(r);n[s.find("name").value]=new x.y(r)}}(q||(q={}))},416:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T:()=>jsLib});var _lib__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(152);let objectId=-1;const objects={};function saveObject(e){const t="#js:"+ ++objectId;return objects[t]=e,t}function getObject(e){return objects[e]}function toJS(e){if(e.startsWith("#js:"))return getObject(e);if("unknown"===e)return;if("false"===e)return!1;if("true"===e)return!1;const t=Number.parseInt(e);return Number.isNaN(t)?e:t}function toSS(e){return"string"==typeof e||e instanceof String||"boolean"==typeof e||e instanceof Boolean||Number.isInteger(e)?`${e}`:null==e||Number.isNaN(e)?"unknown":saveObject(e)}const jsLib=new _lib__WEBPACK_IMPORTED_MODULE_0__.j({js_window:saveObject(window)},{js([code]){return toSS(eval(code))},js_get([e,t]){var n;const r=null===(n=getObject(e))||void 0===n?void 0:n[t];return null==r?"unknown":toSS(r)},js_set([e,t,n]){const r=getObject(e);return null!=r&&(r[t]=toJS(n)),"unknown"},js_new([e,...t]){const n=getObject(e);if(null==n)return"unknown";const r=new n(...t.map(toJS));return null==r?"unknown":toSS(r)},js_call([e,...t]){var n;const r=null===(n=getObject(e))||void 0===n?void 0:n(...t.map(toJS));return null==r?"unknown":toSS(r)},js_call_method([e,t,...n]){var r,s;const o=null===(s=null===(r=getObject(e))||void 0===r?void 0:r[t])||void 0===s?void 0:s.call(r,...n.map(toJS));return null==o?"unknown":toSS(o)}})},152:(e,t,n)=>{n.d(t,{j:()=>o,y:()=>s});var r=n(111);class s{constructor(e){this.program=e}use(e,t){const n=r.b.execute(this.program);Object.assign(e,n.variables),Object.assign(t,n.functions)}}class o{constructor(e,t){this.variables=e,this.functions=t}use(e,t){Object.assign(e,this.variables),Object.assign(t,this.functions)}}}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var __webpack_exports__={};(()=>{var e=__webpack_require__(111);function t(t){return n=this,r=void 0,o=function*(){if("text/sigmascript"!==t.getAttribute("type"))return;let n;if(t.hasAttribute("src")){const e=yield fetch(t.getAttribute("src"));n=yield e.text()}else n=t.innerText;e.b.load(n)},new((s=void 0)||(s=Promise))((function(e,t){function c(e){try{a(o.next(e))}catch(e){t(e)}}function i(e){try{a(o.throw(e))}catch(e){t(e)}}function a(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(c,i)}a((o=o.apply(n,r||[])).next())}));var n,r,s,o}!function(){new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)e instanceof HTMLScriptElement&&t(e)})).observe(document,{childList:!0,subtree:!0});for(const e of document.getElementsByTagName("script"))t(e)}()})()})();