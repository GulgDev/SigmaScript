(()=>{"use strict";var __webpack_modules__={842:(t,e,s)=>{s.d(e,{h:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("array"),this.functions={array:(...t)=>this.array(t),array_add:(t,e)=>this.add(t,e),array_remove:(t,e)=>this.remove(t,e),array_at:(t,e)=>this.at(t,e),array_set:(t,e,s)=>this.set(t,e,s),array_length:t=>this.length(t),array_find:(t,e)=>this.find(t,e)}}array(t){return this.registry.add(t)}add(t,e){return this.registry.get(t)?.push(e),"unknown"}remove(t,e){return this.registry.get(t)?.splice(Number.parseInt(e),1),"unknown"}at(t,e){return this.registry.get(t)?.at(Number.parseInt(e))??"unknown"}set(t,e,s){const r=this.registry.get(t),n=Number.parseInt(e);return r&&!Number.isNaN(n)&&n>=-r.length&&n<r.length&&(r[n<0?r.length+n:n]=s),"unknown"}length(t){const e=this.registry.get(t);return null==e?"unknown":`${e.length}`}find(t,e){const s=this.registry.get(t)?.indexOf(e);return null==s||-1===s?"unknown":`${s}`}getArray(t){return this.registry.get(t)}}},855:(t,e,s)=>{s.d(e,{a:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("fn"),this.functions={call:(t,...e)=>this.call(t,e)}}addFn(t){return this.registry.add(t)}getFn(t){return this.registry.get(t)}call(t,e){return this.registry.get(t)?.(...e)??"unknown"}}},879:(t,e,s)=>{s.d(e,{j:()=>n,y:()=>r});class r{constructor(t,e){this.result=null,this.runtime=t,this.func=e}use(t){this.runtime.copyScope(this.result??(this.result=this.func(this.runtime)),t)}}class n{constructor(t){this.variables={},this.functions={},this.runtime=t}use(t){Object.assign(t.variables,this.variables),Object.assign(t.functions,this.functions)}}},416:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{V:()=>JSLib});var ___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(879),_registry__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(56),_array__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(842),_fn__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(855),_ref__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(642),_struct__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(126);const ssSymbol=Symbol("ss");class JSLib extends ___WEBPACK_IMPORTED_MODULE_4__.j{constructor(){super(...arguments),this.registry=new _registry__WEBPACK_IMPORTED_MODULE_5__.O("js"),this.functions={js:t=>this.js(t),js_get:(t,e)=>this.get(t,e),js_set:(t,e,s)=>this.set(t,e,s),js_new:(t,...e)=>this.new(t,e),js_object:()=>this.toSS({}),js_array:()=>this.toSS([]),js_call:(t,...e)=>this.call(t,e),js_call_method:(t,e,...s)=>this.callMethod(t,e,s)}}getObject(t){return this.registry.get(t)}toJSObject(t){if(t.startsWith("#js:"))return this.getObject(t);if(t.startsWith("#fn")){const e=this.runtime.getLib(_fn__WEBPACK_IMPORTED_MODULE_1__.a).getFn(t);if(!e)return;return(...t)=>this.toJS(e(...t.map((t=>this.toSS(t)))))}if(t.startsWith("#struct:")){const e=this.runtime.getLib(_struct__WEBPACK_IMPORTED_MODULE_3__.B).getStruct(t);if(!e)return;const s={};for(const t in e)s[t]=this.toJS(e[t]);return s}if(t.startsWith("#array:")){const e=this.runtime.getLib(_array__WEBPACK_IMPORTED_MODULE_0__.h).getArray(t);if(!e)return;return e.map((t=>this.toJS(t)))}return t}toJS(t){if(t.startsWith("#ref:"))return this.toJS(this.runtime.getLib(_ref__WEBPACK_IMPORTED_MODULE_2__.t).get(t));if("unknown"===t)return;if("false"===t)return!1;if("true"===t)return!0;if(/^-?[0-9]+(\.[0-9]+)?$/.test(t))return Number.parseFloat(t);const e=this.toJSObject(t);return e instanceof Object&&!e[ssSymbol]&&Object.defineProperty(e,ssSymbol,{value:t,enumerable:!1}),e}toSS(t){const e=t[ssSymbol];return void 0!==e?e:null==t||Number.isNaN(t)?"unknown":"string"==typeof t||t instanceof String||"boolean"==typeof t||t instanceof Boolean||"number"==typeof t||t instanceof Number?`${t}`:this.registry.add(t)}js(code){return this.toSS(eval(code))}get(t,e){const s=this.toJS(t)?.[e];return null==s?"unknown":this.toSS(s)}set(t,e,s){const r=this.toJS(t);return null!=r&&(r[e]=this.toJS(s)),"unknown"}new(t,e){const s=this.toJS(t);if(null==s)return"unknown";const r=new s(...e.map((t=>this.toJS(t))));return null==r?"unknown":this.toSS(r)}call(t,e){const s=this.toJS(t)?.(...e.map((t=>this.toJS(t))));return null==s?"unknown":this.toSS(s)}callMethod(t,e,s){const r=this.toJS(t)?.[e]?.(...s.map((t=>this.toJS(t))));return null==r?"unknown":this.toSS(r)}}},642:(t,e,s)=>{s.d(e,{t:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("ref"),this.functions={ref:t=>this.ref(t),ref_set:(t,e)=>this.set(t,e),ref_get:t=>this.get(t)}}ref(t){return this.registry.add(t)}set(t,e){return this.registry.set(t,e),"unknown"}get(t){return this.registry.get(t)??"unknown"}}},126:(t,e,s)=>{s.d(e,{B:()=>i});var r=s(879),n=s(56);class i extends r.j{constructor(){super(...arguments),this.registry=new n.O("struct"),this.functions={struct:()=>this.struct(),struct_set:(t,e,s)=>this.set(t,e,s),struct_get:(t,e)=>this.get(t,e)}}struct(){return this.registry.add({})}set(t,e,s){const r=this.registry.get(t);return r&&(r[e]=s),"unknown"}get(t,e){return this.registry.get(t)?.[e]??"unknown"}getStruct(t){return this.registry.get(t)}}},56:(t,e,s)=>{s.d(e,{O:()=>r});class r{constructor(t){this.elements={},this.id=-1,this.name=t}add(t){const e=`#${this.name}:${++this.id}`;return this.elements[e]=t,e}set(t,e){t in this.elements&&(this.elements[t]=e)}get(t){return this.elements[t]}}}},__webpack_module_cache__={};function __webpack_require__(t){var e=__webpack_module_cache__[t];if(void 0!==e)return e.exports;var s=__webpack_module_cache__[t]={exports:{}};return __webpack_modules__[t](s,s.exports,__webpack_require__),s.exports}__webpack_require__.d=(t,e)=>{for(var s in e)__webpack_require__.o(e,s)&&!__webpack_require__.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},__webpack_require__.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var __webpack_exports__={};(()=>{var t=__webpack_require__(879),e=__webpack_require__(56),s=__webpack_require__(855);class r extends t.j{constructor(){super(...arguments),this.registry=new e.O("dom"),this.variables={dom_head:this.registry.add(document.head),dom_body:this.registry.add(document.body)},this.functions={dom_title:t=>this.title(t),dom_create:t=>this.create(t),dom_find:t=>this.find(t),dom_append:(t,e)=>this.append(t,e),dom_remove:t=>this.remove(t),dom_add_class:(t,e)=>this.addClass(t,e),dom_remove_class:(t,e)=>this.removeClass(t,e),dom_toggle_class:(t,e)=>this.toggleClass(t,e),dom_set_text:(t,e)=>this.setText(t,e),dom_set_html:(t,e)=>this.setHtml(t,e),dom_set_attr:(t,e,s)=>this.setAttr(t,e,s),dom_get_attr:(t,e)=>this.getAttr(t,e),dom_css:(t,e,s)=>this.css(t,e,s),dom_event:(t,e,s)=>this.event(t,e,s)}}getElement(t){return this.registry.get(t)}title(t){return document.title=t,"unknown"}create(t){return this.registry.add(document.createElement(t))}find(t){const e=document.querySelector(t);return e?this.registry.add(e):"unknown"}append(t,e){return this.getElement(t)?.appendChild(this.getElement(e)??document.createTextNode(e)),"unknown"}remove(t){return this.getElement(t).remove(),"unknown"}addClass(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&s.classList.add(e),"unknown"}removeClass(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&s.classList.remove(e),"unknown"}toggleClass(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&s.classList.toggle(e),"unknown"}setText(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&(s.innerText=e),"unknown"}setHtml(t,e){const s=this.getElement(t);return s instanceof HTMLElement&&(s.innerHTML=e),"unknown"}setAttr(t,e,s){return e.startsWith("on")?this.event(t,e.slice(2),s):this.getElement(t)?.setAttribute(e,s),"unknown"}getAttr(t,e){return this.getElement(t)?.getAttribute(e)}css(t,e,s){const r=this.getElement(t);return r instanceof HTMLElement&&r.style.setProperty(e,s),"unknown"}event(t,e,r){const n=this.getElement(t),i=this.runtime.getLib(s.a).getFn(r);return i&&n.addEventListener(e,(()=>i())),"unknown"}}var n=__webpack_require__(416);class i{constructor(){this.libs={}}addLib(t,e){return this.libs[t]=e}getLib(t){return Object.values(this.libs).find((e=>e instanceof t))}lib(e,s){this.addLib(e,new t.y(this,s))}scope(t){const e={variables:{},functions:{}};return t&&this.copyScope(t,e),e}copyScope(t,e){Object.assign(e.variables,t.variables),Object.assign(e.functions,t.functions)}lambda(t){return this.getLib(s.a).addFn(t)}print(t){void 0===(t=this.getLib(n.V).toJS(t))&&(t="unknown"),console.log(t)}}class a extends n.V{constructor(){super(...arguments),this.variables={js_env:"browser",js_window:this.registry.add(window),js_global:this.registry.add(globalThis)}}toJSObject(t){return t.startsWith("#dom:")?this.runtime.getLib(r).getElement(t):super.toJSObject(t)}}var o=__webpack_require__(642);class _ extends t.j{constructor(){super(...arguments),this.functions={string_at:(t,e)=>t.at(Number.parseInt(e))??"unknown",string_length:t=>`${t.length}`,string_slice:(t,e,s)=>t.slice(Number.parseInt(e),Number.parseInt(s)),string_replace:(t,e,s)=>t.replaceAll(e,s),string_format:(t,...e)=>this.format(t,e)}}format(t,e){if(0===e.length)return t;let s="";const r=t.length;let n=0,i=0;for(;n<r;){const r=t[n];if(++n,"%"===r){if("%"!==t[n]){if(s+=e[i],++i,i>=e.length){s+=t.slice(n);break}continue}++n}s+=r}return s}}var u=__webpack_require__(126),c=__webpack_require__(842);function h(t){return(...e)=>{const s=t(...e.map((t=>Number.parseFloat(t))));return Number.isNaN(s)?"unknown":`${s}`}}class l extends t.j{constructor(){super(...arguments),this.variables={pi:`${Math.PI}`},this.functions={abs:h((t=>Math.abs(t))),sign:h((t=>Math.sign(t))),sqrt:h((t=>Math.sqrt(t))),mod:h(((t,e)=>t%e)),sin:h((t=>Math.sin(t))),cos:h((t=>Math.cos(t))),tan:h((t=>Math.tan(t))),asin:h((t=>Math.asin(t))),acos:h((t=>Math.acos(t))),atan:h(((t,e)=>null==e?Math.atan(t):Math.atan2(t,e))),sinh:h((t=>Math.sinh(t))),cosh:h((t=>Math.cosh(t))),tanh:h((t=>Math.tanh(t))),asinh:h((t=>Math.asinh(t))),acosh:h((t=>Math.acosh(t))),atanh:h((t=>Math.atanh(t))),exp:h((t=>Math.exp(t))),rad:h((t=>t*Math.PI/180)),deg:h((t=>180*t/Math.PI)),round:h(((t,e=1)=>Math.round(t/e)*e)),floor:h(((t,e=1)=>Math.floor(t/e)*e)),ceil:h(((t,e=1)=>Math.ceil(t/e)*e)),random:()=>`${Math.random()}`,randint:(t,e)=>this.randint(t,e)}}randint(t,e){const s=Number.parseFloat(t),r=Number.parseFloat(e),n=Math.min(s,r),i=Math.max(s,r);return`${Math.random()*(i-n)+n}`}}const d=new class extends i{constructor(){super(...arguments),this.groupRegistry=new e.O("ssxgroup")}scope(t){const e={variables:{},functions:{},components:{}};return t&&this.copyScope(t,e),e}copyScope(t,e){Object.assign(e.variables,t.variables),Object.assign(e.functions,t.functions),"components"in t&&"components"in e&&Object.assign(e.components,t.components)}ssx(t,e,s,n){const i=t.components[e];if(i)return i(s,n);{const t=this.getLib(r),i=t.create(e);for(const[e,r]of Object.entries(s))t.setAttr(i,e,r);if("unknown"!==n){const e=this.groupRegistry.get(n);if(e)for(const s of e)t.append(i,s);else t.append(i,n)}return i}}ssxGroup(...t){return this.groupRegistry.add(t)}};d.addLib("dom",new r(d)),d.addLib("fn",new s.a(d)),d.addLib("js",new a(d)),d.addLib("ref",new o.t(d)),d.addLib("string",new _(d)),d.addLib("struct",new u.B(d)),d.addLib("array",new c.h(d)),d.addLib("math",new l(d)),globalThis.runtime=d})()})();