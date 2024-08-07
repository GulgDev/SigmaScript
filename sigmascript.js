(()=>{"use strict";var __webpack_modules__={842:(t,e,s)=>{s.d(e,{h:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("array"),this.functions={array:(...t)=>this.array(t),array_add:(t,e)=>this.add(t,e),array_remove:(t,e)=>this.remove(t,e),array_at:(t,e)=>this.at(t,e),array_set:(t,e,s)=>this.set(t,e,s),array_length:t=>this.length(t),array_find:(t,e)=>this.find(t,e)}}array(t){return this.registry.add(t)}add(t,e){return this.registry.get(t)?.push(e),"unknown"}remove(t,e){return this.registry.get(t)?.splice(Number.parseInt(e),1),"unknown"}at(t,e){return this.registry.get(t)?.at(Number.parseInt(e))??"unknown"}set(t,e,s){const r=this.registry.get(t),n=Number.parseInt(e);return r&&!Number.isNaN(n)&&n>=-r.length&&n<r.length&&(r[n<0?r.length+n:n]=s),"unknown"}length(t){const e=this.registry.get(t);return null==e?"unknown":`${e.length}`}find(t,e){const s=this.registry.get(t)?.indexOf(e);return null==s||-1===s?"unknown":`${s}`}getArray(t){return this.registry.get(t)}}},855:(t,e,s)=>{s.d(e,{a:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("fn"),this.functions={call:(t,...e)=>this.call(t,e)}}addFn(t){return this.registry.add(t)}getFn(t){return this.registry.get(t)}call(t,e){return this.registry.get(t)?.(...e)??"unknown"}}},879:(t,e,s)=>{s.d(e,{j:()=>n,y:()=>r});class r{constructor(t,e){this.result=null,this.runtime=t,this.func=e}use(t){this.runtime.copyScope(this.result??(this.result=this.func(this.runtime)),t)}}class n{constructor(t){this.variables={},this.functions={},this.runtime=t}use(t){Object.assign(t.variables,this.variables),Object.assign(t.functions,this.functions)}}},416:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{V:()=>JSLib});var ___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(879),_registry__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(56),_array__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(842),_fn__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(855),_ref__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(642),_struct__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(126);const ssSymbol=Symbol("ss");class JSLib extends ___WEBPACK_IMPORTED_MODULE_4__.j{constructor(){super(...arguments),this.registry=new _registry__WEBPACK_IMPORTED_MODULE_5__.O("js"),this.functions={js:t=>this.js(t),js_get:(t,e)=>this.get(t,e),js_set:(t,e,s)=>this.set(t,e,s),js_new:(t,...e)=>this.new(t,e),js_object:()=>this.toSS({}),js_array:()=>this.toSS([]),js_call:(t,...e)=>this.call(t,e),js_call_method:(t,e,...s)=>this.callMethod(t,e,s)}}getObject(t){return this.registry.get(t)}toJSObject(t){if(t.startsWith("#js:"))return this.getObject(t);if(t.startsWith("#fn")){const e=this.runtime.getLib(_fn__WEBPACK_IMPORTED_MODULE_1__.a).getFn(t);if(!e)return;return(...t)=>this.toJS(e(...t.map((t=>this.toSS(t)))))}if(t.startsWith("#struct:")){const e=this.runtime.getLib(_struct__WEBPACK_IMPORTED_MODULE_3__.B).getStruct(t);if(!e)return;const s={};for(const t in e)s[t]=this.toJS(e[t]);return s}if(t.startsWith("#array:")){const e=this.runtime.getLib(_array__WEBPACK_IMPORTED_MODULE_0__.h).getArray(t);if(!e)return;return e.map((t=>this.toJS(t)))}return t}toJS(t){if(t.startsWith("#ref:"))return this.toJS(this.runtime.getLib(_ref__WEBPACK_IMPORTED_MODULE_2__.t).get(t));if("unknown"===t)return;if("false"===t)return!1;if("true"===t)return!0;if(/^-?[0-9]+(\.[0-9]+)?$/.test(t))return Number.parseFloat(t);const e=this.toJSObject(t);return e instanceof Object&&!e[ssSymbol]&&Object.defineProperty(e,ssSymbol,{value:t,enumerable:!1}),e}toSS(t){const e=t[ssSymbol];return void 0!==e?e:null==t||Number.isNaN(t)?"unknown":"string"==typeof t||t instanceof String||"boolean"==typeof t||t instanceof Boolean||"number"==typeof t||t instanceof Number?`${t}`:this.registry.add(t)}js(code){return this.toSS(eval(code))}get(t,e){const s=this.toJS(t)?.[e];return null==s?"unknown":this.toSS(s)}set(t,e,s){const r=this.toJS(t);return null!=r&&(r[e]=this.toJS(s)),"unknown"}new(t,e){const s=this.toJS(t);if(null==s)return"unknown";const r=new s(...e.map((t=>this.toJS(t))));return null==r?"unknown":this.toSS(r)}call(t,e){const s=this.toJS(t)?.(...e.map((t=>this.toJS(t))));return null==s?"unknown":this.toSS(s)}callMethod(t,e,s){const r=this.toJS(t)?.[e]?.(...s.map((t=>this.toJS(t))));return null==r?"unknown":this.toSS(r)}}},642:(t,e,s)=>{s.d(e,{t:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("ref"),this.functions={ref:t=>this.ref(t),ref_set:(t,e)=>this.set(t,e),ref_get:t=>this.get(t)}}ref(t){return this.registry.add(t)}set(t,e){return this.registry.set(t,e),"unknown"}get(t){return this.registry.get(t)??"unknown"}}},126:(t,e,s)=>{s.d(e,{B:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("struct"),this.functions={struct:()=>this.struct(),struct_set:(t,e,s)=>this.set(t,e,s),struct_get:(t,e)=>this.get(t,e)}}struct(){return this.registry.add({})}set(t,e,s){const r=this.registry.get(t);return r&&(r[e]=s),"unknown"}get(t,e){return this.registry.get(t)?.[e]??"unknown"}getStruct(t){return this.registry.get(t)}}},56:(t,e,s)=>{s.d(e,{O:()=>r});class r{constructor(t){this.elements={},this.id=-1,this.name=t}add(t){const e=`#${this.name}:${++this.id}`;return this.elements[e]=t,e}set(t,e){t in this.elements&&(this.elements[t]=e)}get(t){return this.elements[t]}}}},__webpack_module_cache__={};function __webpack_require__(t){var e=__webpack_module_cache__[t];if(void 0!==e)return e.exports;var s=__webpack_module_cache__[t]={exports:{}};return __webpack_modules__[t](s,s.exports,__webpack_require__),s.exports}__webpack_require__.d=(t,e)=>{for(var s in e)__webpack_require__.o(e,s)&&!__webpack_require__.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},__webpack_require__.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var __webpack_exports__={};(()=>{class t{constructor(t,e,s){this.state="pending",this.callback=s,this.promise=e,this.promise.then((t=>{this.result=t,this.state="ready",this.update()})),this.index=t.length,this.queue=t,t.push(this)}update(){"ready"!==this.state||0!==this.index&&"done"!==this.queue[this.index-1].state||(this.state="done",this.callback(this.result),this.queue[this.index+1]?.update())}}var e,s=__webpack_require__(879);!function(t){t.isWhitespace=function(t){return" "===t||"\n"===t||"\r"===t},t.isDigit=function(t){if(!t)return!1;const e=t.charCodeAt(0);return e>=48&&e<=57},t.isLetter=function(t){if(!t)return!1;const e=t.toLowerCase().charCodeAt(0);return e>=97&&e<=122}}(e||(e={}));class r{constructor(t){this.buffer=t,this._offset=0,this.line=0,this.column=0}get location(){return{offset:this._offset,line:this.line,column:this.column}}set location(t){this._offset=t.offset,this.line=t.line,this.column=t.column}get offset(){return this._offset}peekch(){return this.buffer[this._offset]}consume(){"\n"===this.peekch()?(++this.line,this.column=0):++this.column,++this._offset}}class n{constructor(t={},e){this.elements=t,this.last=e}with(t,e){const s={...this.elements};return s[t]=s[t]?[...s[t],e]:[e],new n(s,e)}has(t,e){return this.elements[t]?.includes(e)}}class i{}class o extends i{constructor(t){super(),this.ch=t}match(t){const e=t.location;if(t.peekch()===this.ch)return t.consume(),{start:e,end:t.location}}}class a extends i{constructor(t,e){super(),this.a=t,this.b=e}match(t,e,s=1,r=new n,i={}){const o=t.location,a=!(this.a instanceof _&&r.has(o.offset,this.a.name))&&this.a.match(t,e,s,r,i),c=t.location;t.location=o;const h=!(this.b instanceof _&&r.has(o.offset,this.b.name))&&this.b.match(t,e,s,r,i),l=t.location;let u=!a&&h||!h&&a;if(a&&h&&(u=c.offset>l.offset?a:h),u===a&&(t.location=c),u)return{start:o,end:t.location,children:[u]}}}class c extends i{match(t){const s=t.location;for(;e.isWhitespace(t.peekch());)t.consume();return{start:s,end:t.location}}}class h extends i{match(t){const e=t.location;if(t.peekch())return t.consume(),{start:e,end:t.location}}}class l extends i{match(t){const s=t.location;if(e.isDigit(t.peekch()))return t.consume(),{start:s,end:t.location}}}class u extends i{constructor(t){super(),this.pattern=t}match(t,e,s=1,r=new n,i={}){const o=t.location,a=this.pattern.match(t,e,s,r,i);return a||(t.location=o),{start:o,end:t.location,children:a?[a]:[]}}}class p extends i{constructor(t){super(),this.pattern=t}match(t,e,s=1,r=new n,i={}){const o=t.location;let a=this.pattern.match(t,e,s,r,i);const c=[a];if(!a)return;let h=t.location;for(;(a=this.pattern.match(t,e,s,r,i))&&h.offset!==t.offset;)c.push(a),h=t.location;return t.location=h,{start:o,end:t.location,children:c}}}class d extends i{constructor(t,e){super(),this.group=t,this.disallow=e}match(t){const e=t.location,s=t.peekch();if(!s)return;const r=s.charCodeAt(0);t.consume();for(const n of this.group)if(Array.isArray(n)&&r>=n[0].charCodeAt(0)&&r<=n[1].charCodeAt(0)||s===n)return!this.disallow&&{start:e,end:t.location};return this.disallow&&{start:e,end:t.location}}}class m extends i{constructor(t){super(),this.children=t}match(t,e,s=1,r=new n,i={}){const o=t.location,a=[];for(const n of this.children){const o=n.match(t,e,s,r,i);if(!o)return;a.push(o)}return{start:o,end:t.location,children:a}}}class _ extends i{constructor(t,e){super(),this.name=t,this.unmatched=e}match(t,e,s=1,r=new n,i={}){const o=`${s},${r.last},${t.offset},${this.name}`,a=i[o];if(void 0!==a)return a&&(t.location=a.end),a;const c=t.location;r=r.with(c.offset,this.name);const h=e.get(this.name);if(!h||h.precedence&&h.precedence<s)return i[o]=null;const l=h.match(t,e,h.precedence||h.preservePrecedence?h.precedence??s:1,r,i);return this.unmatched?i[o]=l:i[o]=l?{name:this.name,start:c,end:t.location,children:[l]}:null}}function f(t){return"%"===t||"|"===t||"("===t||")"===t||"+"===t||"?"===t||"."===t}function g(t,s,r=!1){const n=[];let i,b=!1;for(;i=t.peekch();){if(t.consume(),"%"===i)if(i=t.peekch(),f(i))t.consume(),n.push(new o(i));else{let s=!1;"!"===t.peekch()&&(s=!0,t.consume());let r="";for(;e.isLetter(i=t.peekch());)t.consume(),r+=i;"d"===r?n.push(new l):n.push(new _(r,s))}else if("("===i)n.push(g(t,s));else{if(")"===i)break;if("["===i){const e="^"===t.peekch();e&&t.consume();const s=[];let r=!1;for(;i=t.peekch();){t.consume();const e=s.length;if("%"===i&&"]"===t.peekch())t.consume(),s.push("]");else{if("]"===i)break;if("-"===i&&!r&&e>0&&!Array.isArray(s.at(-1))){r=!0;continue}s.push(i)}if(r){r=!1;const t=s.pop();s.push([s.pop(),t])}}n.push(new d(s,e))}else if("."===i)n.push(new h);else if(" "===i)n.push(new c);else{if("|"===i&&n.length>0&&!b){b=!0;continue}"?"===i&&n.length>0?n.push(new u(n.pop())):"+"===i&&n.length>0?n.push(new p(n.pop())):n.push(new o(i))}}b&&(n.push(new a(n.pop(),n.pop())),b=!1)}const w=1===n.length?n[0]:new m(n);return w.precedence=s,w.preservePrecedence=r,w}function b(t,e,s){return g(new r(t),e,s)}class w{constructor(t,e,s,r){this.name=t,this.start=e,this.end=s,this.value=r,this.children=[]}get first(){return this.children[0]}get last(){return this.children.at(-1)}*[Symbol.iterator](){for(const t of this.children)yield t}addChild(t){this.children.push(t)}get(t){return this.children[t]}findChildren(t){return this.children.filter((e=>e.name===t))}findChild(t){return this.children.find((e=>e.name===t))}find(t){const e=this.findChild(t);if(e)return e;for(const e of this.children){const s=e.find(t);if(s)return s}}}class x{constructor(t){this.patterns=new Map,this.cache={};for(const[e,s]of Object.entries(t))"string"==typeof s?this.patterns.set(e,b(s)):this.patterns.set(e,b(s.pattern,s.precedence,s.preservePrecedence))}parse(t){const e=this.cache[t];if(void 0!==e)return e;const s=this.patterns.get("root").match(new r(t),this.patterns);if(!s)return;const n=new w("root",s.start,s.end,t.slice(s.start.offset,s.end.offset));return function e(s,r){if(s.name){const e=new w(s.name,s.start,s.end,t.slice(s.start.offset,s.end.offset));r.addChild(e),r=e}if(s.children)for(const t of s.children)e(t,r)}(s,n),n}}function y(t,e){return e.replace(/\.\.\./g,t)}function E(t,e){return t?e?"string"==typeof t&&"string"==typeof e?y(t,e):"string"==typeof t&&"string"!=typeof e?{...e,pattern:y(t,e.pattern)}:"string"!=typeof t&&"string"==typeof e?{...t,pattern:y(t.pattern,e)}:"string"!=typeof t&&"string"!=typeof e?{pattern:y(t.pattern,e.pattern),precedence:e.precedence??t.precedence,preservePrecedence:e.preservePrecedence??t.preservePrecedence}:void 0:t:e}const $={number:"%d+(%.%d+)?",name:"[a-zA-Z_][a-zA-Z0-9_]+?",string:'"([^"]|(\\\\)|(\\"))+?"',bool:"(true)|(false)",neg:"- %expr",add:{pattern:"%expr %+ %expr",precedence:5},sub:{pattern:"%expr - %expr",precedence:5},mul:{pattern:"%expr * %expr",precedence:6},div:{pattern:"%expr / %expr",precedence:6},concat:{pattern:"%expr @ %expr",precedence:1},eq:{pattern:"%expr = %expr",precedence:4},lt:{pattern:"%expr < %expr",precedence:4},gt:{pattern:"%expr > %expr",precedence:4},le:{pattern:"%expr <= %expr",precedence:4},ge:{pattern:"%expr >= %expr",precedence:4},or:{pattern:"%expr %| %expr",precedence:2},and:{pattern:"%expr & %expr",precedence:3},not:"! %expr",arglist:"(%expr( , %expr)+?)?",call:"%name %( %arglist %)",lambda:"%( %paramlist %) => ({ %body })|%expr",parenthesisexpr:"%( %expr %)",expr:{pattern:"%parenthesisexpr|%number|%string|%bool|%name|%neg|%add|%sub|%mul|%div|%concat|%eq|%lt|%gt|%le|%ge|%or|%and|%not|%call|%lambda",preservePrecedence:!0},assign:"%name = %expr;",paramlist:"(%name( , %name)+?)?",if:"if %expr { %body } %else?",else:"else { %body }",while:"while %expr { %body }",function:"fn %name %( %paramlist %) { %body }",return:"ret %expr;",callstat:"%call;",print:"print %expr;",statement:"%assign|%if|%while|%function|%return|%callstat|%print",comment:"//[^\n]+?",comments:"( %!comment )+?",body:"( %!comments %statement %!comments )+?",use:"use %name;",imports:"( %use %!comments )+?",lib:"lib %name;",root:"%!comments %lib? %!comments %imports %body %!comments"};var k=__webpack_require__(855),v=__webpack_require__(416),S=__webpack_require__(56);class M extends s.j{constructor(){super(...arguments),this.registry=new S.O("dom"),this.variables={dom_head:this.registry.add(document.head),dom_body:this.registry.add(document.body)},this.functions={dom_title:t=>this.title(t),dom_create:t=>this.create(t),dom_find:t=>this.find(t),dom_append:(t,e)=>this.append(t,e),dom_remove:t=>this.remove(t),dom_add_class:(t,e)=>this.addClass(t,e),dom_remove_class:(t,e)=>this.removeClass(t,e),dom_toggle_class:(t,e)=>this.toggleClass(t,e),dom_set_text:(t,e)=>this.setText(t,e),dom_set_html:(t,e)=>this.setHtml(t,e),dom_set_attr:(t,e,s)=>this.setAttr(t,e,s),dom_get_attr:(t,e)=>this.getAttr(t,e),dom_css:(t,e,s)=>this.css(t,e,s),dom_event:(t,e,s)=>this.event(t,e,s)}}getElement(t){return this.registry.get(t)}title(t){return document.title=t,"unknown"}create(t){return this.registry.add(document.createElement(t))}find(t){const e=document.querySelector(t);return e?this.registry.add(e):"unknown"}append(t,e){return this.getElement(t)?.appendChild(this.getElement(e)??document.createTextNode(e)),"unknown"}remove(t){return this.getElement(t).remove(),"unknown"}addClass(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&s.classList.add(e),"unknown"}removeClass(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&s.classList.remove(e),"unknown"}toggleClass(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&s.classList.toggle(e),"unknown"}setText(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&(s.innerText=e),"unknown"}setHtml(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&(s.innerHTML=e),"unknown"}setAttr(t,e,s){return e.startsWith("on")?this.event(t,e.slice(2),s):this.getElement(t)?.setAttribute(e,s),"unknown"}getAttr(t,e){return this.getElement(t)?.getAttribute(e)}css(t,e,s){const r=this.getElement(t);return r instanceof HTMLElement&&r.style.setProperty(e,s),"unknown"}event(t,e,s){const r=this.getElement(t),n=this.runtime.getLib(k.a).getFn(s);return n&&r.addEventListener(e,(()=>n())),"unknown"}}class L extends v.V{constructor(){super(...arguments),this.variables={js_env:"browser",js_window:this.registry.add(window),js_global:this.registry.add(globalThis)}}toJSObject(t){return t.startsWith("#dom:")?this.runtime.getLib(M).getElement(t):super.toJSObject(t)}}var O=__webpack_require__(642);class j extends s.j{constructor(){super(...arguments),this.functions={string_at:(t,e)=>t.at(Number.parseInt(e))??"unknown",string_length:t=>`${t.length}`,string_slice:(t,e,s)=>t.slice(Number.parseInt(e),Number.parseInt(s)),string_replace:(t,e,s)=>t.replaceAll(e,s),string_format:(t,...e)=>this.format(t,e)}}format(t,e){if(0===e.length)return t;let s="";const r=t.length;let n=0,i=0;for(;n<r;){const r=t[n];if(++n,"%"===r){if("%"!==t[n]){if(s+=e[i],++i,i>=e.length){s+=t.slice(n);break}continue}++n}s+=r}return s}}var P=__webpack_require__(126),A=__webpack_require__(842);function C(t){return(...e)=>{const s=t(...e.map((t=>Number.parseFloat(t))));return Number.isNaN(s)?"unknown":`${s}`}}class q extends s.j{constructor(){super(...arguments),this.variables={pi:`${Math.PI}`},this.functions={abs:C((t=>Math.abs(t))),sign:C((t=>Math.sign(t))),sqrt:C((t=>Math.sqrt(t))),mod:C(((t,e)=>t%e)),sin:C((t=>Math.sin(t))),cos:C((t=>Math.cos(t))),tan:C((t=>Math.tan(t))),asin:C((t=>Math.asin(t))),acos:C((t=>Math.acos(t))),atan:C(((t,e)=>null==e?Math.atan(t):Math.atan2(t,e))),sinh:C((t=>Math.sinh(t))),cosh:C((t=>Math.cosh(t))),tanh:C((t=>Math.tanh(t))),asinh:C((t=>Math.asinh(t))),acosh:C((t=>Math.acosh(t))),atanh:C((t=>Math.atanh(t))),exp:C((t=>Math.exp(t))),rad:C((t=>t*Math.PI/180)),deg:C((t=>180*t/Math.PI)),round:C(((t,e=1)=>Math.round(t/e)*e)),floor:C(((t,e=1)=>Math.floor(t/e)*e)),ceil:C(((t,e=1)=>Math.ceil(t/e)*e)),random:()=>`${Math.random()}`,randint:(t,e)=>this.randint(t,e)}}randint(t,e){const s=Number.parseFloat(t),r=Number.parseFloat(e),n=Math.min(s,r),i=Math.max(s,r);return`${Math.random()*(i-n)+n}`}}const T=new class{constructor(){this.libs={}}addLib(t,e){return this.libs[t]=e}getLib(t){return Object.values(this.libs).find((e=>e instanceof t))}lib(t,e){this.addLib(t,new s.y(this,e))}scope(t){const e={variables:{},functions:{}};return t&&this.copyScope(t,e),e}copyScope(t,e){Object.assign(e.variables,t.variables),Object.assign(e.functions,t.functions)}lambda(t){return this.getLib(k.a).addFn(t)}print(t){void 0===(t=this.getLib(v.V).toJS(t))&&(t="unknown"),console.log(t)}};T.addLib("dom",new M(T)),T.addLib("fn",new k.a(T)),T.addLib("js",new L(T)),T.addLib("ref",new O.t(T)),T.addLib("string",new j(T)),T.addLib("struct",new P.B(T)),T.addLib("array",new A.h(T)),T.addLib("math",new q(T)),globalThis.NativeLib=s.j,globalThis.sigmaScript=new class{constructor(t,e={}){this.runtime=t,this.parser=new x(function(t,e){const s={root:E(t.root,e.root)};for(const r in t)r in s||(s[r]=E(t[r],e[r]));for(const r in e)r in s||(s[r]=E(t[r],e[r]));return s}($,e))}compileExpr(t,e){switch("expr"===t.name&&(t=t.first),t.name){case"parenthesisexpr":return`(${this.compileExpr(t.first,e)})`;case"name":return`(scope${e}.variables.${t.value} ?? "unknown")`;case"number":case"bool":return`"${t.value}"`;case"string":return t.value;case"neg":return`\`\${-${this.compileExpr(t.first,e)}}\``;case"add":return`\`\${+${this.compileExpr(t.first,e)} + +${this.compileExpr(t.last,e)}}\``;case"sub":return`\`\${+${this.compileExpr(t.first,e)} - +${this.compileExpr(t.last,e)}}\``;case"mul":return`\`\${+${this.compileExpr(t.first,e)} * +${this.compileExpr(t.last,e)}}\``;case"div":return`\`\${+${this.compileExpr(t.first,e)} / +${this.compileExpr(t.last,e)}}\``;case"eq":return`\`\${${this.compileExpr(t.first,e)} === ${this.compileExpr(t.last,e)}}\``;case"lt":return`\`\${+${this.compileExpr(t.first,e)} < +${this.compileExpr(t.last,e)}}\``;case"gt":return`\`\${+${this.compileExpr(t.first,e)} > +${this.compileExpr(t.last,e)}}\``;case"le":return`\`\${+${this.compileExpr(t.first,e)} <= +${this.compileExpr(t.last,e)}}\``;case"ge":return`\`\${+${this.compileExpr(t.first,e)} >= +${this.compileExpr(t.last,e)}}\``;case"or":return`\`\${${this.compileExpr(t.first,e)} === "true" || ${this.compileExpr(t.last,e)} === "true"}\``;case"and":return`\`\${${this.compileExpr(t.first,e)} === "true" && ${this.compileExpr(t.last,e)} === "true"}\``;case"not":return`\`\${${this.compileExpr(t.first,e)} === "true" ? "false" : "true"}\``;case"concat":return`${this.compileExpr(t.first,e)} + ${this.compileExpr(t.last,e)}`;case"call":return`(${this.compileCall(t,e)} ?? "unknown")`;case"lambda":return`runtime.lambda(${t.findChild("expr")?this.compileLambda(t,e):this.compileFunction(t,e)})`}}compileCall(t,e){return`scope${e}.functions.${t.find("name").value}?.(${Array.from(t.find("arglist")).map((t=>this.compileExpr(t,e))).join(", ")})`}compileFunction(t,e){const s=Array.from(t.find("paramlist"));return`(${s.map(((t,e)=>`arg${e}="unknown"`)).join(", ")}) => {\n${this.localScope(++e)+s.map(((t,s)=>`scope${e}.variables.${t.value} = arg${s};\n`)).join("")+this.compileBody(t.find("body"),e)}return "unknown";\n}`}compileLambda(t,e){const s=Array.from(t.find("paramlist"));return`(${s.map(((t,e)=>`arg${e}="unknown"`)).join(", ")}) => {\n${this.localScope(++e)+s.map(((t,s)=>`scope${e}.variables.${t.value} = arg${s};\n`)).join("")}return ${this.compileExpr(t.find("expr"),e)};\n}`}compileStatement(t,e){switch(t.name){case"assign":return`scope${e}.variables.${t.find("name").value} = ${this.compileExpr(t.find("expr"),e)};`;case"if":{let s=`if ((${this.compileExpr(t.find("expr"),e)}) === "true") {\n${this.compileBody(t.find("body"),e)}}`;const r=t.findChild("else");return r&&(s+=`\nelse {\n${this.compileBody(r.find("body"),e)}}`),s}case"while":return`while ((${this.compileExpr(t.find("expr"),e)}) === "true") {\n${this.compileBody(t.find("body"),e)}}`;case"function":return`scope${e}.functions.${t.find("name").value} = ${this.compileFunction(t,e)};`;case"print":return`runtime.print(${this.compileExpr(t.find("expr"),e)});`;case"callstat":return this.compileCall(t.first,e)+";";case"return":return`return ${this.compileExpr(t.find("expr"),e)};`}}compileBody(t,e=0){let s="";for(const{first:r}of t)s+=this.compileStatement(r,e)+"\n";return s}localScope(t){return`const scope${t} = runtime.scope(scope${t-1});\n`}globalScope(){return"const scope0 = runtime.scope();\n"}compileImports(t){let e="";for(const s of t)e+=`runtime.libs.${s.find("name").value}?.use(scope0);\n`;return e}compileProgram(t){let e=this.globalScope();return e+=this.compileImports(t.find("imports")),e+=this.compileBody(t.find("body")),e+="return scope0;\n",e}createFunction(t){return Function("runtime",this.compileProgram(t))}getLibName(t){return this.parser.parse(t)?.findChild("lib")?.find("name")?.value}compile(t){const e=this.parser.parse(t);if(e&&e.end.offset===t.length)return this.compileProgram(e)}load(t){const e=this.parser.parse(t);if(!e||e.end.offset!==t.length)return;const r=e.findChild("lib"),n=this.createFunction(e);if(!r)return n(this.runtime);this.runtime.addLib(r.find("name").value,new s.y(this.runtime,n))}}(T),new class{constructor(t,e){this.queue=[],this.type=t,this.load=e}loadScript(e){e.getAttribute("type")===this.type&&new t(this.queue,(async()=>{if(e.hasAttribute("src")){const t=await fetch(e.getAttribute("src"));return await t.text()}return e.innerText})(),(t=>this.load(t)))}listen(){new MutationObserver((t=>{for(const e of t)if("childList"===e.type)for(const t of e.addedNodes)t instanceof HTMLScriptElement&&this.loadScript(t)})).observe(document,{childList:!0,subtree:!0});for(const t of document.getElementsByTagName("script"))this.loadScript(t)}}("text/sigmascript",(t=>globalThis.sigmaScript.load(t))).listen()})()})();