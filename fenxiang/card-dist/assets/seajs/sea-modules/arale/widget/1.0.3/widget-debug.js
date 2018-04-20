/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("arale/widget/1.0.3/daparser-debug",["$-debug"],function(a,b){function c(a){return a.toLowerCase().replace(g,function(a,b){return(b+"").toUpperCase()})}function d(a){for(var b in a)if(a.hasOwnProperty(b)){var c=a[b];if("string"!=typeof c)continue;h.test(c)?(c=c.replace(/'/g,'"'),a[b]=d(i(c))):a[b]=e(c)}return a}function e(a){if("false"===a.toLowerCase())a=!1;else if("true"===a.toLowerCase())a=!0;else if(/\d/.test(a)&&/[^a-z]/i.test(a)){var b=parseFloat(a);b+""===a&&(a=b)}return a}var f=a("$-debug");b.parseElement=function(a,b){a=f(a)[0];var e={};if(a.dataset)e=f.extend({},a.dataset);else for(var g=a.attributes,h=0,i=g.length;i>h;h++){var j=g[h],k=j.name;0===k.indexOf("data-")&&(k=c(k.substring(5)),e[k]=j.value)}return b===!0?e:d(e)};var g=/-([a-z])/g,h=/^\s*[\[{].*[\]}]\s*$/,i=this.JSON?JSON.parse:f.parseJSON}),define("arale/widget/1.0.3/auto-render-debug",["$-debug"],function(a,b){var c=a("$-debug"),d="data-widget-auto-rendered";b.autoRender=function(a){return new this(a).render()},b.autoRenderAll=function(a,e){"function"==typeof a&&(e=a,a=null),a=c(a||document.body);var f=[],g=[];a.find("[data-widget]").each(function(a,c){b.isDataApiOff(c)||(f.push(c.getAttribute("data-widget").toLowerCase()),g.push(c))}),f.length&&seajs.use(f,function(){for(var a=0;a<arguments.length;a++){var b=arguments[a],f=c(g[a]);f.attr(d)||(b.autoRender&&b.autoRender({element:f,renderType:"auto"}),f.attr(d,"true"))}e&&e()})};var e="off"===c(document.body).attr("data-api");b.isDataApiOff=function(a){var b=c(a).attr("data-api");return"off"===b||"on"!==b&&e}}),define("arale/widget/1.0.3/widget-debug",["./daparser-debug","./auto-render-debug","arale/base/1.0.1/base-debug","arale/class/1.0.0/class-debug","arale/events/1.0.0/events-debug","$-debug"],function(a,b,c){function d(){return"widget-"+x++}function e(a){return"[object String]"===w.call(a)}function f(a){return"[object Function]"===w.call(a)}function g(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0}function h(a){return y(document.documentElement,a)}function i(a){return a.charAt(0).toUpperCase()+a.substring(1)}function j(a){return f(a.events)&&(a.events=a.events()),a.events}function k(a,b){var c=a.match(z),d=c[1]+r+b.cid,e=c[2]||void 0;return e&&e.indexOf("{{")>-1&&(e=l(e,b)),{type:d,selector:e}}function l(a,b){return a.replace(A,function(a,c){for(var d,f=c.split("."),g=b;d=f.shift();)g=g===b.attrs?b.get(d):g[d];return e(g)?g:B})}function m(a){return null==a||(e(a)||o.isArray(a))&&0===a.length||o.isPlainObject(a)&&g(a)}var n=a("arale/base/1.0.1/base-debug"),o=a("$-debug"),p=a("./daparser-debug"),q=a("./auto-render-debug"),r=".delegate-events-",s="_onRender",t="data-widget-cid",u={},v=n.extend({propsInAttrs:["element","template","model","events"],element:null,template:"<div></div>",model:null,events:null,attrs:{id:"",className:"",style:{},parentNode:document.body},initialize:function(a){this.cid=d();var b=this._parseDataAttrsConfig(a);this.initAttrs(a,b),this.parseElement(),this.initProps(),this.delegateEvents(),this.setup(),this._stamp()},_parseDataAttrsConfig:function(a){var b,c;return a&&(b=o(a.element)),b&&b[0]&&!q.isDataApiOff(b)&&(c=p.parseElement(b)),c},parseElement:function(){var a=this.element;if(a?this.element=o(a):this.get("template")&&this.parseElementFromTemplate(),!this.element||!this.element[0])throw new Error("element is invalid")},parseElementFromTemplate:function(){this.element=o(this.get("template"))},initProps:function(){},delegateEvents:function(a,b){if(a||(a=j(this)),a){if(e(a)&&f(b)){var c={};c[a]=b,a=c}for(var d in a)if(a.hasOwnProperty(d)){var g=k(d,this),h=g.type,i=g.selector;!function(a,b){var c=function(c){f(a)?a.call(b,c):b[a](c)};i?b.element.on(h,i,c):b.element.on(h,c)}(a[d],this)}return this}},undelegateEvents:function(a){var b={};return 0===arguments.length?b.type=r+this.cid:b=k(a,this),this.element.off(b.type,b.selector),this},setup:function(){},render:function(){this.rendered||(this._renderAndBindAttrs(),this.rendered=!0);var a=this.get("parentNode");return a&&!h(this.element[0])&&this.element.appendTo(a),this},_renderAndBindAttrs:function(){var a=this,b=a.attrs;for(var c in b)if(b.hasOwnProperty(c)){var d=s+i(c);if(this[d]){var e=this.get(c);m(e)||this[d](e,void 0,c),function(b){a.on("change:"+c,function(c,d,e){a[b](c,d,e)})}(d)}}},_onRenderId:function(a){this.element.attr("id",a)},_onRenderClassName:function(a){this.element.addClass(a)},_onRenderStyle:function(a){this.element.css(a)},_stamp:function(){var a=this.cid;this.element.attr(t,a),u[a]=this},$:function(a){return this.element.find(a)},destroy:function(){this.undelegateEvents(),delete u[this.cid],this.element&&(this.element.off(),this.element=null),v.superclass.destroy.call(this)}});o(window).unload(function(){for(var a in u)u[a].destroy()}),v.query=function(a){var b,c=o(a).eq(0);return c&&(b=c.attr(t)),u[b]},v.autoRender=q.autoRender,v.autoRenderAll=q.autoRenderAll,v.StaticsWhiteList=["autoRender"],c.exports=v;var w=Object.prototype.toString,x=0,y=o.contains||function(a,b){return!!(16&a.compareDocumentPosition(b))},z=/^(\S+)\s*(.*)$/,A=/{{([^}]+)}}/g,B="INVALID_SELECTOR"});