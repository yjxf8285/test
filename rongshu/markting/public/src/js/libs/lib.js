/*! jQuery v2.2.3 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="2.2.3",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isPlainObject:function(a){var b;if("object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype||{},"isPrototypeOf"))return!1;for(b in a);return void 0===b||k.call(a,b)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=d.createElement("script"),b.text=a,d.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:h.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(d=e.call(arguments,2),f=function(){return a.apply(b||this,d.concat(e.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=R.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return h.call(b,a)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&f.parentNode&&(this.length=1,this[0]=f),this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?void 0!==c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?h.call(n(a),this[0]):h.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||n.uniqueSort(e),D.test(a)&&e.reverse()),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.removeEventListener("DOMContentLoaded",J),a.removeEventListener("load",J),n.ready()}n.ready.promise=function(b){return I||(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(n.ready):(d.addEventListener("DOMContentLoaded",J),a.addEventListener("load",J))),I.promise(b)},n.ready.promise();var K=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)K(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},L=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function M(){this.expando=n.expando+M.uid++}M.uid=1,M.prototype={register:function(a,b){var c=b||{};return a.nodeType?a[this.expando]=c:Object.defineProperty(a,this.expando,{value:c,writable:!0,configurable:!0}),a[this.expando]},cache:function(a){if(!L(a))return{};var b=a[this.expando];return b||(b={},L(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[b]=c;else for(d in b)e[d]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=a[this.expando];if(void 0!==f){if(void 0===b)this.register(a);else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in f?d=[b,e]:(d=e,d=d in f?[d]:d.match(G)||[])),c=d.length;while(c--)delete f[d[c]]}(void 0===b||n.isEmptyObject(f))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!n.isEmptyObject(b)}};var N=new M,O=new M,P=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Q=/[A-Z]/g;function R(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Q,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:P.test(c)?n.parseJSON(c):c;
}catch(e){}O.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return O.hasData(a)||N.hasData(a)},data:function(a,b,c){return O.access(a,b,c)},removeData:function(a,b){O.remove(a,b)},_data:function(a,b,c){return N.access(a,b,c)},_removeData:function(a,b){N.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=O.get(f),1===f.nodeType&&!N.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),R(f,d,e[d])));N.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){O.set(this,a)}):K(this,function(b){var c,d;if(f&&void 0===b){if(c=O.get(f,a)||O.get(f,a.replace(Q,"-$&").toLowerCase()),void 0!==c)return c;if(d=n.camelCase(a),c=O.get(f,d),void 0!==c)return c;if(c=R(f,d,void 0),void 0!==c)return c}else d=n.camelCase(a),this.each(function(){var c=O.get(this,d);O.set(this,d,b),a.indexOf("-")>-1&&void 0!==c&&O.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){O.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=N.get(a,b),c&&(!d||n.isArray(c)?d=N.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return N.get(a,c)||N.access(a,c,{empty:n.Callbacks("once memory").add(function(){N.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=N.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function W(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&T.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var X=/^(?:checkbox|radio)$/i,Y=/<([\w:-]+)/,Z=/^$|\/(?:java|ecma)script/i,$={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};$.optgroup=$.option,$.tbody=$.tfoot=$.colgroup=$.caption=$.thead,$.th=$.td;function _(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function aa(a,b){for(var c=0,d=a.length;d>c;c++)N.set(a[c],"globalEval",!b||N.get(b[c],"globalEval"))}var ba=/<|&#?\w+;/;function ca(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],o=0,p=a.length;p>o;o++)if(f=a[o],f||0===f)if("object"===n.type(f))n.merge(m,f.nodeType?[f]:f);else if(ba.test(f)){g=g||l.appendChild(b.createElement("div")),h=(Y.exec(f)||["",""])[1].toLowerCase(),i=$[h]||$._default,g.innerHTML=i[1]+n.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;n.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",o=0;while(f=m[o++])if(d&&n.inArray(f,d)>-1)e&&e.push(f);else if(j=n.contains(f.ownerDocument,f),g=_(l.appendChild(f),"script"),j&&aa(g),c){k=0;while(f=g[k++])Z.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var da=/^key/,ea=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,fa=/^([^.]*)(?:\.(.+)|)/;function ga(){return!0}function ha(){return!1}function ia(){try{return d.activeElement}catch(a){}}function ja(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ja(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ha;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return"undefined"!=typeof n&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(G)||[""],j=b.length;while(j--)h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.hasData(a)&&N.get(a);if(r&&(i=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&N.remove(a,"handle events")}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(N.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())a.rnamespace&&!a.rnamespace.test(g.namespace)||(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||d,e=c.documentElement,f=c.body,a.pageX=b.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ea.test(f)?this.mouseHooks:da.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=d),3===a.target.nodeType&&(a.target=a.target.parentNode),h.filter?h.filter(a,g):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==ia()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===ia()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ga:ha):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:ha,isPropagationStopped:ha,isImmediatePropagationStopped:ha,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ga,a&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ga,a&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ga,a&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||n.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),n.fn.extend({on:function(a,b,c,d){return ja(this,a,b,c,d)},one:function(a,b,c,d){return ja(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=ha),this.each(function(){n.event.remove(this,a,c,b)})}});var ka=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,la=/<script|<style|<link/i,ma=/checked\s*(?:[^=]|=\s*.checked.)/i,na=/^true\/(.*)/,oa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function pa(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function qa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function ra(a){var b=na.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function sa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(N.hasData(a)&&(f=N.access(a),g=N.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}O.hasData(a)&&(h=O.access(a),i=n.extend({},h),O.set(b,i))}}function ta(a,b){var c=b.nodeName.toLowerCase();"input"===c&&X.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function ua(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&ma.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),ua(f,b,c,d)});if(o&&(e=ca(b,a[0].ownerDocument,!1,a,d),g=e.firstChild,1===e.childNodes.length&&(e=g),g||d)){for(h=n.map(_(e,"script"),qa),i=h.length;o>m;m++)j=e,m!==p&&(j=n.clone(j,!0,!0),i&&n.merge(h,_(j,"script"))),c.call(a[m],j,m);if(i)for(k=h[h.length-1].ownerDocument,n.map(h,ra),m=0;i>m;m++)j=h[m],Z.test(j.type||"")&&!N.access(j,"globalEval")&&n.contains(k,j)&&(j.src?n._evalUrl&&n._evalUrl(j.src):n.globalEval(j.textContent.replace(oa,"")))}return a}function va(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(_(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&aa(_(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(ka,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=_(h),f=_(a),d=0,e=f.length;e>d;d++)ta(f[d],g[d]);if(b)if(c)for(f=f||_(a),g=g||_(h),d=0,e=f.length;e>d;d++)sa(f[d],g[d]);else sa(a,h);return g=_(h,"script"),g.length>0&&aa(g,!i&&_(a,"script")),h},cleanData:function(a){for(var b,c,d,e=n.event.special,f=0;void 0!==(c=a[f]);f++)if(L(c)){if(b=c[N.expando]){if(b.events)for(d in b.events)e[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);c[N.expando]=void 0}c[O.expando]&&(c[O.expando]=void 0)}}}),n.fn.extend({domManip:ua,detach:function(a){return va(this,a,!0)},remove:function(a){return va(this,a)},text:function(a){return K(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.appendChild(a)}})},prepend:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(_(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return K(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!la.test(a)&&!$[(Y.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(_(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return ua(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(_(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),f=e.length-1,h=0;f>=h;h++)c=h===f?this:this.clone(!0),n(e[h])[b](c),g.apply(d,c.get());return this.pushStack(d)}});var wa,xa={HTML:"block",BODY:"block"};function ya(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function za(a){var b=d,c=xa[a];return c||(c=ya(a,b),"none"!==c&&c||(wa=(wa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=wa[0].contentDocument,b.write(),b.close(),c=ya(a,b),wa.detach()),xa[a]=c),c}var Aa=/^margin/,Ba=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ca=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)},Da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Ea=d.documentElement;!function(){var b,c,e,f,g=d.createElement("div"),h=d.createElement("div");if(h.style){h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,g.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",g.appendChild(h);function i(){h.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",h.innerHTML="",Ea.appendChild(g);var d=a.getComputedStyle(h);b="1%"!==d.top,f="2px"===d.marginLeft,c="4px"===d.width,h.style.marginRight="50%",e="4px"===d.marginRight,Ea.removeChild(g)}n.extend(l,{pixelPosition:function(){return i(),b},boxSizingReliable:function(){return null==c&&i(),c},pixelMarginRight:function(){return null==c&&i(),e},reliableMarginLeft:function(){return null==c&&i(),f},reliableMarginRight:function(){var b,c=h.appendChild(d.createElement("div"));return c.style.cssText=h.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",h.style.width="1px",Ea.appendChild(g),b=!parseFloat(a.getComputedStyle(c).marginRight),Ea.removeChild(g),h.removeChild(c),b}})}}();function Fa(a,b,c){var d,e,f,g,h=a.style;return c=c||Ca(a),g=c?c.getPropertyValue(b)||c[b]:void 0,""!==g&&void 0!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),c&&!l.pixelMarginRight()&&Ba.test(g)&&Aa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f),void 0!==g?g+"":g}function Ga(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Ha=/^(none|table(?!-c[ea]).+)/,Ia={position:"absolute",visibility:"hidden",display:"block"},Ja={letterSpacing:"0",fontWeight:"400"},Ka=["Webkit","O","Moz","ms"],La=d.createElement("div").style;function Ma(a){if(a in La)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ka.length;while(c--)if(a=Ka[c]+b,a in La)return a}function Na(a,b,c){var d=T.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Oa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Pa(b,c,e){var f=!0,g="width"===c?b.offsetWidth:b.offsetHeight,h=Ca(b),i="border-box"===n.css(b,"boxSizing",!1,h);if(d.msFullscreenElement&&a.top!==a&&b.getClientRects().length&&(g=Math.round(100*b.getBoundingClientRect()[c])),0>=g||null==g){if(g=Fa(b,c,h),(0>g||null==g)&&(g=b.style[c]),Ba.test(g))return g;f=i&&(l.boxSizingReliable()||g===b.style[c]),g=parseFloat(g)||0}return g+Oa(b,c,e||(i?"border":"content"),f,h)+"px"}function Qa(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=N.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=N.access(d,"olddisplay",za(d.nodeName)))):(e=V(d),"none"===c&&e||N.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Fa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=T.exec(c))&&e[1]&&(c=W(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Fa(a,b,d)),"normal"===e&&b in Ja&&(e=Ja[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Ha.test(n.css(a,"display"))&&0===a.offsetWidth?Da(a,Ia,function(){return Pa(a,b,d)}):Pa(a,b,d):void 0},set:function(a,c,d){var e,f=d&&Ca(a),g=d&&Oa(a,b,d,"border-box"===n.css(a,"boxSizing",!1,f),f);return g&&(e=T.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=n.css(a,b)),Na(a,c,g)}}}),n.cssHooks.marginLeft=Ga(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Fa(a,"marginLeft"))||a.getBoundingClientRect().left-Da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px":void 0}),n.cssHooks.marginRight=Ga(l.reliableMarginRight,function(a,b){return b?Da(a,{display:"inline-block"},Fa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Aa.test(a)||(n.cssHooks[a+b].set=Na)}),n.fn.extend({css:function(a,b){return K(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ca(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Qa(this,!0)},hide:function(){return Qa(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function Ra(a,b,c,d,e){return new Ra.prototype.init(a,b,c,d,e)}n.Tween=Ra,Ra.prototype={constructor:Ra,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ra.propHooks[this.prop];return a&&a.get?a.get(this):Ra.propHooks._default.get(this)},run:function(a){var b,c=Ra.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ra.propHooks._default.set(this),this}},Ra.prototype.init.prototype=Ra.prototype,Ra.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},Ra.propHooks.scrollTop=Ra.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=Ra.prototype.init,n.fx.step={};var Sa,Ta,Ua=/^(?:toggle|show|hide)$/,Va=/queueHooks$/;function Wa(){return a.setTimeout(function(){Sa=void 0}),Sa=n.now()}function Xa(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=U[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ya(a,b,c){for(var d,e=(_a.tweeners[b]||[]).concat(_a.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Za(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&V(a),q=N.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?N.get(a,"olddisplay")||za(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Ua.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?za(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=N.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;N.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ya(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function $a(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function _a(a,b,c){var d,e,f=0,g=_a.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Sa||Wa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:Sa||Wa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for($a(k,j.opts.specialEasing);g>f;f++)if(d=_a.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,Ya,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(_a,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return W(c.elem,a,T.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],_a.tweeners[c]=_a.tweeners[c]||[],_a.tweeners[c].unshift(b)},prefilters:[Za],prefilter:function(a,b){b?_a.prefilters.unshift(a):_a.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=_a(this,n.extend({},a),f);(e||N.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=N.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Va.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=N.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Xa(b,!0),a,d,e)}}),n.each({slideDown:Xa("show"),slideUp:Xa("hide"),slideToggle:Xa("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Sa=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Sa=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ta||(Ta=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(Ta),Ta=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=d.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var ab,bb=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return K(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ab:void 0)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)}}),ab={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=bb[b]||n.find.attr;bb[b]=function(a,b,d){var e,f;return d||(f=bb[b],bb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,bb[b]=f),e}});var cb=/^(?:input|select|textarea|button)$/i,db=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return K(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,
    e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):cb.test(a.nodeName)||db.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var eb=/[\t\r\n\f]/g;function fb(a){return a.getAttribute&&a.getAttribute("class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,fb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,fb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,fb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=fb(this),b&&N.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":N.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+fb(c)+" ").replace(eb," ").indexOf(b)>-1)return!0;return!1}});var gb=/\r/g,hb=/[\x20\t\r\n\f]+/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(gb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a)).replace(hb," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(n.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var ib=/^(?:focusinfocus|focusoutblur)$/;n.extend(n.event,{trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!ib.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),l=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},f||!o.trigger||o.trigger.apply(e,c)!==!1)){if(!f&&!o.noBubble&&!n.isWindow(e)){for(j=o.delegateType||q,ib.test(j+q)||(h=h.parentNode);h;h=h.parentNode)p.push(h),i=h;i===(e.ownerDocument||d)&&p.push(i.defaultView||i.parentWindow||a)}g=0;while((h=p[g++])&&!b.isPropagationStopped())b.type=g>1?j:o.bindType||q,m=(N.get(h,"events")||{})[b.type]&&N.get(h,"handle"),m&&m.apply(h,c),m=l&&h[l],m&&m.apply&&L(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=q,f||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!L(e)||l&&n.isFunction(e[q])&&!n.isWindow(e)&&(i=e[l],i&&(e[l]=null),n.event.triggered=q,e[q](),n.event.triggered=void 0,i&&(e[l]=i)),b.result}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b),d.isDefaultPrevented()&&c.preventDefault()}}),n.fn.extend({trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),l.focusin="onfocusin"in a,l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=N.access(d,b);e||d.addEventListener(a,c,!0),N.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=N.access(d,b)-1;e?N.access(d,b,e):(d.removeEventListener(a,c,!0),N.remove(d,b))}}});var jb=a.location,kb=n.now(),lb=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var mb=/#.*$/,nb=/([?&])_=[^&]*/,ob=/^(.*?):[ \t]*([^\r\n]*)$/gm,pb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,qb=/^(?:GET|HEAD)$/,rb=/^\/\//,sb={},tb={},ub="*/".concat("*"),vb=d.createElement("a");vb.href=jb.href;function wb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function xb(a,b,c,d){var e={},f=a===tb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function yb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function zb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Ab(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:jb.href,type:"GET",isLocal:pb.test(jb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":ub,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?yb(yb(a,n.ajaxSettings),b):yb(n.ajaxSettings,a)},ajaxPrefilter:wb(sb),ajaxTransport:wb(tb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m=n.ajaxSetup({},c),o=m.context||m,p=m.context&&(o.nodeType||o.jquery)?n(o):n.event,q=n.Deferred(),r=n.Callbacks("once memory"),s=m.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,getResponseHeader:function(a){var b;if(2===v){if(!h){h={};while(b=ob.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===v?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return v||(a=u[c]=u[c]||a,t[a]=b),this},overrideMimeType:function(a){return v||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>v)for(b in a)s[b]=[s[b],a[b]];else x.always(a[x.status]);return this},abort:function(a){var b=a||w;return e&&e.abort(b),z(0,b),this}};if(q.promise(x).complete=r.add,x.success=x.done,x.error=x.fail,m.url=((b||m.url||jb.href)+"").replace(mb,"").replace(rb,jb.protocol+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=n.trim(m.dataType||"*").toLowerCase().match(G)||[""],null==m.crossDomain){j=d.createElement("a");try{j.href=m.url,j.href=j.href,m.crossDomain=vb.protocol+"//"+vb.host!=j.protocol+"//"+j.host}catch(y){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=n.param(m.data,m.traditional)),xb(sb,m,c,x),2===v)return x;k=n.event&&m.global,k&&0===n.active++&&n.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!qb.test(m.type),f=m.url,m.hasContent||(m.data&&(f=m.url+=(lb.test(f)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=nb.test(f)?f.replace(nb,"$1_="+kb++):f+(lb.test(f)?"&":"?")+"_="+kb++)),m.ifModified&&(n.lastModified[f]&&x.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&x.setRequestHeader("If-None-Match",n.etag[f])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",m.contentType),x.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+ub+"; q=0.01":""):m.accepts["*"]);for(l in m.headers)x.setRequestHeader(l,m.headers[l]);if(m.beforeSend&&(m.beforeSend.call(o,x,m)===!1||2===v))return x.abort();w="abort";for(l in{success:1,error:1,complete:1})x[l](m[l]);if(e=xb(tb,m,c,x)){if(x.readyState=1,k&&p.trigger("ajaxSend",[x,m]),2===v)return x;m.async&&m.timeout>0&&(i=a.setTimeout(function(){x.abort("timeout")},m.timeout));try{v=1,e.send(t,z)}catch(y){if(!(2>v))throw y;z(-1,y)}}else z(-1,"No Transport");function z(b,c,d,h){var j,l,t,u,w,y=c;2!==v&&(v=2,i&&a.clearTimeout(i),e=void 0,g=h||"",x.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(u=zb(m,x,d)),u=Ab(m,u,x,j),j?(m.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(n.lastModified[f]=w),w=x.getResponseHeader("etag"),w&&(n.etag[f]=w)),204===b||"HEAD"===m.type?y="nocontent":304===b?y="notmodified":(y=u.state,l=u.data,t=u.error,j=!t)):(t=y,!b&&y||(y="error",0>b&&(b=0))),x.status=b,x.statusText=(c||y)+"",j?q.resolveWith(o,[l,y,x]):q.rejectWith(o,[x,y,t]),x.statusCode(s),s=void 0,k&&p.trigger(j?"ajaxSuccess":"ajaxError",[x,m,j?l:t]),r.fireWith(o,[x,y]),k&&(p.trigger("ajaxComplete",[x,m]),--n.active||n.event.trigger("ajaxStop")))}return x},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return!n.expr.filters.visible(a)},n.expr.filters.visible=function(a){return a.offsetWidth>0||a.offsetHeight>0||a.getClientRects().length>0};var Bb=/%20/g,Cb=/\[\]$/,Db=/\r?\n/g,Eb=/^(?:submit|button|image|reset|file)$/i,Fb=/^(?:input|select|textarea|keygen)/i;function Gb(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Cb.test(a)?d(a,e):Gb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Gb(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Gb(c,a[c],b,e);return d.join("&").replace(Bb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Fb.test(this.nodeName)&&!Eb.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Db,"\r\n")}}):{name:b.name,value:c.replace(Db,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Hb={0:200,1223:204},Ib=n.ajaxSettings.xhr();l.cors=!!Ib&&"withCredentials"in Ib,l.ajax=Ib=!!Ib,n.ajaxTransport(function(b){var c,d;return l.cors||Ib&&!b.crossDomain?{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Hb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=n("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Jb=[],Kb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Jb.pop()||n.expando+"_"+kb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Kb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Kb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Kb,"$1"+e):b.jsonp!==!1&&(b.url+=(lb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Jb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||d;var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ca([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var Lb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Lb)return Lb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function Mb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(e=d.getBoundingClientRect(),c=Mb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ea})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;n.fn[a]=function(d){return K(this,function(a,d,e){var f=Mb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Ga(l.pixelPosition,function(a,c){return c?(c=Fa(a,b),Ba.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return K(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)},size:function(){return this.length}}),n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Nb=a.jQuery,Ob=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Ob),b&&a.jQuery===n&&(a.jQuery=Nb),n},b||(a.jQuery=a.$=n),n});



//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map




(function(t){var e=typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global;if(typeof define==="function"&&define.amd){define(["underscore","jquery","exports"],function(i,r,n){e.Backbone=t(e,n,i,r)})}else if(typeof exports!=="undefined"){var i=require("underscore"),r;try{r=require("jquery")}catch(n){}t(e,exports,i,r)}else{e.Backbone=t(e,{},e._,e.jQuery||e.Zepto||e.ender||e.$)}})(function(t,e,i,r){var n=t.Backbone;var s=Array.prototype.slice;e.VERSION="1.3.3";e.$=r;e.noConflict=function(){t.Backbone=n;return this};e.emulateHTTP=false;e.emulateJSON=false;var a=function(t,e,r){switch(t){case 1:return function(){return i[e](this[r])};case 2:return function(t){return i[e](this[r],t)};case 3:return function(t,n){return i[e](this[r],o(t,this),n)};case 4:return function(t,n,s){return i[e](this[r],o(t,this),n,s)};default:return function(){var t=s.call(arguments);t.unshift(this[r]);return i[e].apply(i,t)}}};var h=function(t,e,r){i.each(e,function(e,n){if(i[n])t.prototype[n]=a(e,n,r)})};var o=function(t,e){if(i.isFunction(t))return t;if(i.isObject(t)&&!e._isModel(t))return l(t);if(i.isString(t))return function(e){return e.get(t)};return t};var l=function(t){var e=i.matches(t);return function(t){return e(t.attributes)}};var u=e.Events={};var c=/\s+/;var f=function(t,e,r,n,s){var a=0,h;if(r&&typeof r==="object"){if(n!==void 0&&"context"in s&&s.context===void 0)s.context=n;for(h=i.keys(r);a<h.length;a++){e=f(t,e,h[a],r[h[a]],s)}}else if(r&&c.test(r)){for(h=r.split(c);a<h.length;a++){e=t(e,h[a],n,s)}}else{e=t(e,r,n,s)}return e};u.on=function(t,e,i){return d(this,t,e,i)};var d=function(t,e,i,r,n){t._events=f(v,t._events||{},e,i,{context:r,ctx:t,listening:n});if(n){var s=t._listeners||(t._listeners={});s[n.id]=n}return t};u.listenTo=function(t,e,r){if(!t)return this;var n=t._listenId||(t._listenId=i.uniqueId("l"));var s=this._listeningTo||(this._listeningTo={});var a=s[n];if(!a){var h=this._listenId||(this._listenId=i.uniqueId("l"));a=s[n]={obj:t,objId:n,id:h,listeningTo:s,count:0}}d(t,e,r,this,a);return this};var v=function(t,e,i,r){if(i){var n=t[e]||(t[e]=[]);var s=r.context,a=r.ctx,h=r.listening;if(h)h.count++;n.push({callback:i,context:s,ctx:s||a,listening:h})}return t};u.off=function(t,e,i){if(!this._events)return this;this._events=f(g,this._events,t,e,{context:i,listeners:this._listeners});return this};u.stopListening=function(t,e,r){var n=this._listeningTo;if(!n)return this;var s=t?[t._listenId]:i.keys(n);for(var a=0;a<s.length;a++){var h=n[s[a]];if(!h)break;h.obj.off(e,r,this)}return this};var g=function(t,e,r,n){if(!t)return;var s=0,a;var h=n.context,o=n.listeners;if(!e&&!r&&!h){var l=i.keys(o);for(;s<l.length;s++){a=o[l[s]];delete o[a.id];delete a.listeningTo[a.objId]}return}var u=e?[e]:i.keys(t);for(;s<u.length;s++){e=u[s];var c=t[e];if(!c)break;var f=[];for(var d=0;d<c.length;d++){var v=c[d];if(r&&r!==v.callback&&r!==v.callback._callback||h&&h!==v.context){f.push(v)}else{a=v.listening;if(a&&--a.count===0){delete o[a.id];delete a.listeningTo[a.objId]}}}if(f.length){t[e]=f}else{delete t[e]}}return t};u.once=function(t,e,r){var n=f(p,{},t,e,i.bind(this.off,this));if(typeof t==="string"&&r==null)e=void 0;return this.on(n,e,r)};u.listenToOnce=function(t,e,r){var n=f(p,{},e,r,i.bind(this.stopListening,this,t));return this.listenTo(t,n)};var p=function(t,e,r,n){if(r){var s=t[e]=i.once(function(){n(e,s);r.apply(this,arguments)});s._callback=r}return t};u.trigger=function(t){if(!this._events)return this;var e=Math.max(0,arguments.length-1);var i=Array(e);for(var r=0;r<e;r++)i[r]=arguments[r+1];f(m,this._events,t,void 0,i);return this};var m=function(t,e,i,r){if(t){var n=t[e];var s=t.all;if(n&&s)s=s.slice();if(n)_(n,r);if(s)_(s,[e].concat(r))}return t};var _=function(t,e){var i,r=-1,n=t.length,s=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<n)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<n)(i=t[r]).callback.call(i.ctx,s);return;case 2:while(++r<n)(i=t[r]).callback.call(i.ctx,s,a);return;case 3:while(++r<n)(i=t[r]).callback.call(i.ctx,s,a,h);return;default:while(++r<n)(i=t[r]).callback.apply(i.ctx,e);return}};u.bind=u.on;u.unbind=u.off;i.extend(e,u);var y=e.Model=function(t,e){var r=t||{};e||(e={});this.cid=i.uniqueId(this.cidPrefix);this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)r=this.parse(r,e)||{};var n=i.result(this,"defaults");r=i.defaults(i.extend({},n,r),n);this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};i.extend(y.prototype,u,{changed:null,validationError:null,idAttribute:"id",cidPrefix:"c",initialize:function(){},toJSON:function(t){return i.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return i.escape(this.get(t))},has:function(t){return this.get(t)!=null},matches:function(t){return!!i.iteratee(t,this)(this.attributes)},set:function(t,e,r){if(t==null)return this;var n;if(typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r||(r={});if(!this._validate(n,r))return false;var s=r.unset;var a=r.silent;var h=[];var o=this._changing;this._changing=true;if(!o){this._previousAttributes=i.clone(this.attributes);this.changed={}}var l=this.attributes;var u=this.changed;var c=this._previousAttributes;for(var f in n){e=n[f];if(!i.isEqual(l[f],e))h.push(f);if(!i.isEqual(c[f],e)){u[f]=e}else{delete u[f]}s?delete l[f]:l[f]=e}if(this.idAttribute in n)this.id=this.get(this.idAttribute);if(!a){if(h.length)this._pending=r;for(var d=0;d<h.length;d++){this.trigger("change:"+h[d],this,l[h[d]],r)}}if(o)return this;if(!a){while(this._pending){r=this._pending;this._pending=false;this.trigger("change",this,r)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,i.extend({},e,{unset:true}))},clear:function(t){var e={};for(var r in this.attributes)e[r]=void 0;return this.set(e,i.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!i.isEmpty(this.changed);return i.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?i.clone(this.changed):false;var e=this._changing?this._previousAttributes:this.attributes;var r={};for(var n in t){var s=t[n];if(i.isEqual(e[n],s))continue;r[n]=s}return i.size(r)?r:false},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return i.clone(this._previousAttributes)},fetch:function(t){t=i.extend({parse:true},t);var e=this;var r=t.success;t.success=function(i){var n=t.parse?e.parse(i,t):i;if(!e.set(n,t))return false;if(r)r.call(t.context,e,i,t);e.trigger("sync",e,i,t)};B(this,t);return this.sync("read",this,t)},save:function(t,e,r){var n;if(t==null||typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r=i.extend({validate:true,parse:true},r);var s=r.wait;if(n&&!s){if(!this.set(n,r))return false}else if(!this._validate(n,r)){return false}var a=this;var h=r.success;var o=this.attributes;r.success=function(t){a.attributes=o;var e=r.parse?a.parse(t,r):t;if(s)e=i.extend({},n,e);if(e&&!a.set(e,r))return false;if(h)h.call(r.context,a,t,r);a.trigger("sync",a,t,r)};B(this,r);if(n&&s)this.attributes=i.extend({},o,n);var l=this.isNew()?"create":r.patch?"patch":"update";if(l==="patch"&&!r.attrs)r.attrs=n;var u=this.sync(l,this,r);this.attributes=o;return u},destroy:function(t){t=t?i.clone(t):{};var e=this;var r=t.success;var n=t.wait;var s=function(){e.stopListening();e.trigger("destroy",e,e.collection,t)};t.success=function(i){if(n)s();if(r)r.call(t.context,e,i,t);if(!e.isNew())e.trigger("sync",e,i,t)};var a=false;if(this.isNew()){i.defer(t.success)}else{B(this,t);a=this.sync("delete",this,t)}if(!n)s();return a},url:function(){var t=i.result(this,"urlRoot")||i.result(this.collection,"url")||F();if(this.isNew())return t;var e=this.get(this.idAttribute);return t.replace(/[^\/]$/,"$&/")+encodeURIComponent(e)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},i.extend({},t,{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=i.extend({},this.attributes,t);var r=this.validationError=this.validate(t,e)||null;if(!r)return true;this.trigger("invalid",this,r,i.extend(e,{validationError:r}));return false}});var b={keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1};h(y,b,"attributes");var x=e.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,i.extend({silent:true},e))};var w={add:true,remove:true,merge:true};var E={add:true,remove:false};var I=function(t,e,i){i=Math.min(Math.max(i,0),t.length);var r=Array(t.length-i);var n=e.length;var s;for(s=0;s<r.length;s++)r[s]=t[s+i];for(s=0;s<n;s++)t[s+i]=e[s];for(s=0;s<r.length;s++)t[s+n+i]=r[s]};i.extend(x.prototype,u,{model:y,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return e.sync.apply(this,arguments)},add:function(t,e){return this.set(t,i.extend({merge:false},e,E))},remove:function(t,e){e=i.extend({},e);var r=!i.isArray(t);t=r?[t]:t.slice();var n=this._removeModels(t,e);if(!e.silent&&n.length){e.changes={added:[],merged:[],removed:n};this.trigger("update",this,e)}return r?n[0]:n},set:function(t,e){if(t==null)return;e=i.extend({},w,e);if(e.parse&&!this._isModel(t)){t=this.parse(t,e)||[]}var r=!i.isArray(t);t=r?[t]:t.slice();var n=e.at;if(n!=null)n=+n;if(n>this.length)n=this.length;if(n<0)n+=this.length+1;var s=[];var a=[];var h=[];var o=[];var l={};var u=e.add;var c=e.merge;var f=e.remove;var d=false;var v=this.comparator&&n==null&&e.sort!==false;var g=i.isString(this.comparator)?this.comparator:null;var p,m;for(m=0;m<t.length;m++){p=t[m];var _=this.get(p);if(_){if(c&&p!==_){var y=this._isModel(p)?p.attributes:p;if(e.parse)y=_.parse(y,e);_.set(y,e);h.push(_);if(v&&!d)d=_.hasChanged(g)}if(!l[_.cid]){l[_.cid]=true;s.push(_)}t[m]=_}else if(u){p=t[m]=this._prepareModel(p,e);if(p){a.push(p);this._addReference(p,e);l[p.cid]=true;s.push(p)}}}if(f){for(m=0;m<this.length;m++){p=this.models[m];if(!l[p.cid])o.push(p)}if(o.length)this._removeModels(o,e)}var b=false;var x=!v&&u&&f;if(s.length&&x){b=this.length!==s.length||i.some(this.models,function(t,e){return t!==s[e]});this.models.length=0;I(this.models,s,0);this.length=this.models.length}else if(a.length){if(v)d=true;I(this.models,a,n==null?this.length:n);this.length=this.models.length}if(d)this.sort({silent:true});if(!e.silent){for(m=0;m<a.length;m++){if(n!=null)e.index=n+m;p=a[m];p.trigger("add",p,this,e)}if(d||b)this.trigger("sort",this,e);if(a.length||o.length||h.length){e.changes={added:a,removed:o,merged:h};this.trigger("update",this,e)}}return r?t[0]:t},reset:function(t,e){e=e?i.clone(e):{};for(var r=0;r<this.models.length;r++){this._removeReference(this.models[r],e)}e.previousModels=this.models;this._reset();t=this.add(t,i.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,i.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t)},unshift:function(t,e){return this.add(t,i.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t)},slice:function(){return s.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;return this._byId[t]||this._byId[this.modelId(t.attributes||t)]||t.cid&&this._byId[t.cid]},has:function(t){return this.get(t)!=null},at:function(t){if(t<0)t+=this.length;return this.models[t]},where:function(t,e){return this[e?"find":"filter"](t)},findWhere:function(t){return this.where(t,true)},sort:function(t){var e=this.comparator;if(!e)throw new Error("Cannot sort a set without a comparator");t||(t={});var r=e.length;if(i.isFunction(e))e=i.bind(e,this);if(r===1||i.isString(e)){this.models=this.sortBy(e)}else{this.models.sort(e)}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return this.map(t+"")},fetch:function(t){t=i.extend({parse:true},t);var e=t.success;var r=this;t.success=function(i){var n=t.reset?"reset":"set";r[n](i,t);if(e)e.call(t.context,r,i,t);r.trigger("sync",r,i,t)};B(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?i.clone(e):{};var r=e.wait;t=this._prepareModel(t,e);if(!t)return false;if(!r)this.add(t,e);var n=this;var s=e.success;e.success=function(t,e,i){if(r)n.add(t,i);if(s)s.call(i.context,t,e,i)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(t){return t[this.model.prototype.idAttribute||"id"]},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(this._isModel(t)){if(!t.collection)t.collection=this;return t}e=e?i.clone(e):{};e.collection=this;var r=new this.model(t,e);if(!r.validationError)return r;this.trigger("invalid",this,r.validationError,e);return false},_removeModels:function(t,e){var i=[];for(var r=0;r<t.length;r++){var n=this.get(t[r]);if(!n)continue;var s=this.indexOf(n);this.models.splice(s,1);this.length--;delete this._byId[n.cid];var a=this.modelId(n.attributes);if(a!=null)delete this._byId[a];if(!e.silent){e.index=s;n.trigger("remove",n,this,e)}i.push(n);this._removeReference(n,e)}return i},_isModel:function(t){return t instanceof y},_addReference:function(t,e){this._byId[t.cid]=t;var i=this.modelId(t.attributes);if(i!=null)this._byId[i]=t;t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){delete this._byId[t.cid];var i=this.modelId(t.attributes);if(i!=null)delete this._byId[i];if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if(e){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(t==="change"){var n=this.modelId(e.previousAttributes());var s=this.modelId(e.attributes);if(n!==s){if(n!=null)delete this._byId[n];if(s!=null)this._byId[s]=e}}}this.trigger.apply(this,arguments)}});var S={forEach:3,each:3,map:3,collect:3,reduce:0,foldl:0,inject:0,reduceRight:0,foldr:0,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:3,includes:3,contains:3,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3,groupBy:3,countBy:3,sortBy:3,indexBy:3,findIndex:3,findLastIndex:3};h(x,S,"models");var k=e.View=function(t){this.cid=i.uniqueId("view");i.extend(this,i.pick(t,P));this._ensureElement();this.initialize.apply(this,arguments)};var T=/^(\S+)\s*(.*)$/;var P=["model","collection","el","id","attributes","className","tagName","events"];i.extend(k.prototype,u,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this._removeElement();this.stopListening();return this},_removeElement:function(){this.$el.remove()},setElement:function(t){this.undelegateEvents();this._setElement(t);this.delegateEvents();return this},_setElement:function(t){this.$el=t instanceof e.$?t:e.$(t);this.el=this.$el[0]},delegateEvents:function(t){t||(t=i.result(this,"events"));if(!t)return this;this.undelegateEvents();for(var e in t){var r=t[e];if(!i.isFunction(r))r=this[r];if(!r)continue;var n=e.match(T);this.delegate(n[1],n[2],i.bind(r,this))}return this},delegate:function(t,e,i){this.$el.on(t+".delegateEvents"+this.cid,e,i);return this},undelegateEvents:function(){if(this.$el)this.$el.off(".delegateEvents"+this.cid);return this},undelegate:function(t,e,i){this.$el.off(t+".delegateEvents"+this.cid,e,i);return this},_createElement:function(t){return document.createElement(t)},_ensureElement:function(){if(!this.el){var t=i.extend({},i.result(this,"attributes"));if(this.id)t.id=i.result(this,"id");if(this.className)t["class"]=i.result(this,"className");this.setElement(this._createElement(i.result(this,"tagName")));this._setAttributes(t)}else{this.setElement(i.result(this,"el"))}},_setAttributes:function(t){this.$el.attr(t)}});e.sync=function(t,r,n){var s=H[t];i.defaults(n||(n={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var a={type:s,dataType:"json"};if(!n.url){a.url=i.result(r,"url")||F()}if(n.data==null&&r&&(t==="create"||t==="update"||t==="patch")){a.contentType="application/json";a.data=JSON.stringify(n.attrs||r.toJSON(n))}if(n.emulateJSON){a.contentType="application/x-www-form-urlencoded";a.data=a.data?{model:a.data}:{}}if(n.emulateHTTP&&(s==="PUT"||s==="DELETE"||s==="PATCH")){a.type="POST";if(n.emulateJSON)a.data._method=s;var h=n.beforeSend;n.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",s);if(h)return h.apply(this,arguments)}}if(a.type!=="GET"&&!n.emulateJSON){a.processData=false}var o=n.error;n.error=function(t,e,i){n.textStatus=e;n.errorThrown=i;if(o)o.call(n.context,t,e,i)};var l=n.xhr=e.ajax(i.extend(a,n));r.trigger("request",r,l,n);return l};var H={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var $=e.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var A=/\((.*?)\)/g;var C=/(\(\?)?:\w+/g;var R=/\*\w+/g;var j=/[\-{}\[\]+?.,\\\^$|#\s]/g;i.extend($.prototype,u,{initialize:function(){},route:function(t,r,n){if(!i.isRegExp(t))t=this._routeToRegExp(t);if(i.isFunction(r)){n=r;r=""}if(!n)n=this[r];var s=this;e.history.route(t,function(i){var a=s._extractParameters(t,i);if(s.execute(n,a,r)!==false){s.trigger.apply(s,["route:"+r].concat(a));s.trigger("route",r,a);e.history.trigger("route",s,r,a)}});return this},execute:function(t,e,i){if(t)t.apply(this,e)},navigate:function(t,i){e.history.navigate(t,i);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=i.result(this,"routes");var t,e=i.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(j,"\\$&").replace(A,"(?:$1)?").replace(C,function(t,e){return e?t:"([^/?]+)"}).replace(R,"([^?]*?)");return new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var r=t.exec(e).slice(1);return i.map(r,function(t,e){if(e===r.length-1)return t||null;return t?decodeURIComponent(t):null})}});var N=e.History=function(){this.handlers=[];this.checkUrl=i.bind(this.checkUrl,this);if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var M=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var U=/#.*$/;N.started=false;i.extend(N.prototype,u,{interval:50,atRoot:function(){var t=this.location.pathname.replace(/[^\/]$/,"$&/");return t===this.root&&!this.getSearch()},matchRoot:function(){var t=this.decodeFragment(this.location.pathname);var e=t.slice(0,this.root.length-1)+"/";return e===this.root},decodeFragment:function(t){return decodeURI(t.replace(/%25/g,"%2525"))},getSearch:function(){var t=this.location.href.replace(/#.*/,"").match(/\?.+/);return t?t[0]:""},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getPath:function(){var t=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return t.charAt(0)==="/"?t.slice(1):t},getFragment:function(t){if(t==null){if(this._usePushState||!this._wantsHashChange){t=this.getPath()}else{t=this.getHash()}}return t.replace(M,"")},start:function(t){if(N.started)throw new Error("Backbone.history has already been started");N.started=true;this.options=i.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._hasHashChange="onhashchange"in window&&(document.documentMode===void 0||document.documentMode>7);this._useHashChange=this._wantsHashChange&&this._hasHashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.history&&this.history.pushState);this._usePushState=this._wantsPushState&&this._hasPushState;this.fragment=this.getFragment();this.root=("/"+this.root+"/").replace(O,"/");if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){var e=this.root.slice(0,-1)||"/";this.location.replace(e+"#"+this.getPath());return true}else if(this._hasPushState&&this.atRoot()){this.navigate(this.getHash(),{replace:true})}}if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement("iframe");this.iframe.src="javascript:0";this.iframe.style.display="none";this.iframe.tabIndex=-1;var r=document.body;var n=r.insertBefore(this.iframe,r.firstChild).contentWindow;n.document.open();n.document.close();n.location.hash="#"+this.fragment}var s=window.addEventListener||function(t,e){return attachEvent("on"+t,e)};if(this._usePushState){s("popstate",this.checkUrl,false)}else if(this._useHashChange&&!this.iframe){s("hashchange",this.checkUrl,false)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}if(!this.options.silent)return this.loadUrl()},stop:function(){var t=window.removeEventListener||function(t,e){return detachEvent("on"+t,e)};if(this._usePushState){t("popstate",this.checkUrl,false)}else if(this._useHashChange&&!this.iframe){t("hashchange",this.checkUrl,false)}if(this.iframe){document.body.removeChild(this.iframe);this.iframe=null}if(this._checkUrlInterval)clearInterval(this._checkUrlInterval);N.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getHash(this.iframe.contentWindow)}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){if(!this.matchRoot())return false;t=this.fragment=this.getFragment(t);return i.some(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!N.started)return false;if(!e||e===true)e={trigger:!!e};t=this.getFragment(t||"");var i=this.root;if(t===""||t.charAt(0)==="?"){i=i.slice(0,-1)||"/"}var r=i+t;t=this.decodeFragment(t.replace(U,""));if(this.fragment===t)return;this.fragment=t;if(this._usePushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,r)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getHash(this.iframe.contentWindow)){var n=this.iframe.contentWindow;if(!e.replace){n.document.open();n.document.close()}this._updateHash(n.location,t,e.replace)}}else{return this.location.assign(r)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});e.history=new N;var q=function(t,e){var r=this;var n;if(t&&i.has(t,"constructor")){n=t.constructor}else{n=function(){return r.apply(this,arguments)}}i.extend(n,r,e);n.prototype=i.create(r.prototype,t);n.prototype.constructor=n;n.__super__=r.prototype;return n};y.extend=x.extend=$.extend=k.extend=N.extend=q;var F=function(){throw new Error('A "url" property or function must be specified')};var B=function(t,e){var i=e.error;e.error=function(r){if(i)i.call(e.context,t,r,e);t.trigger("error",t,r,e)}};return e});
//# sourceMappingURL=backbone-min.map


/*!
 * Materialize v0.97.6 (http://materializecss.com)
 * Copyright 2014-2015 Materialize
 * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)
 */
// Check for jQuery.
if (typeof(jQuery) === 'undefined') {
    var jQuery;
    // Check if require is a defined function.
    if (typeof(require) === 'function') {
        jQuery = $ = require('jquery');
        // Else use the dollar sign alias.
    } else {
        jQuery = $;
    }
}
;/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
    {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            //alert(jQuery.easing.default);
            return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */;    // Custom Easing
jQuery.extend( jQuery.easing,
    {
        easeInOutMaterial: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return c/4*((t-=2)*t*t + 2) + b;
        }
    });

;/*! VelocityJS.org (1.2.3). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
/*! Note that this has been modified by Materialize to confirm that Velocity is not already being imported. */
jQuery.Velocity?console.log("Velocity is already loaded. You may be needlessly importing Velocity again; note that Materialize includes Velocity."):(!function(e){function t(e){var t=e.length,a=r.type(e);return"function"===a||r.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===a||0===t||"number"==typeof t&&t>0&&t-1 in e}if(!e.jQuery){var r=function(e,t){return new r.fn.init(e,t)};r.isWindow=function(e){return null!=e&&e==e.window},r.type=function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[i.call(e)]||"object":typeof e},r.isArray=Array.isArray||function(e){return"array"===r.type(e)},r.isPlainObject=function(e){var t;if(!e||"object"!==r.type(e)||e.nodeType||r.isWindow(e))return!1;try{if(e.constructor&&!o.call(e,"constructor")&&!o.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(a){return!1}for(t in e);return void 0===t||o.call(e,t)},r.each=function(e,r,a){var n,o=0,i=e.length,s=t(e);if(a){if(s)for(;i>o&&(n=r.apply(e[o],a),n!==!1);o++);else for(o in e)if(n=r.apply(e[o],a),n===!1)break}else if(s)for(;i>o&&(n=r.call(e[o],o,e[o]),n!==!1);o++);else for(o in e)if(n=r.call(e[o],o,e[o]),n===!1)break;return e},r.data=function(e,t,n){if(void 0===n){var o=e[r.expando],i=o&&a[o];if(void 0===t)return i;if(i&&t in i)return i[t]}else if(void 0!==t){var o=e[r.expando]||(e[r.expando]=++r.uuid);return a[o]=a[o]||{},a[o][t]=n,n}},r.removeData=function(e,t){var n=e[r.expando],o=n&&a[n];o&&r.each(t,function(e,t){delete o[t]})},r.extend=function(){var e,t,a,n,o,i,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[l]||{},l++),"object"!=typeof s&&"function"!==r.type(s)&&(s={}),l===u&&(s=this,l--);u>l;l++)if(null!=(o=arguments[l]))for(n in o)e=s[n],a=o[n],s!==a&&(c&&a&&(r.isPlainObject(a)||(t=r.isArray(a)))?(t?(t=!1,i=e&&r.isArray(e)?e:[]):i=e&&r.isPlainObject(e)?e:{},s[n]=r.extend(c,i,a)):void 0!==a&&(s[n]=a));return s},r.queue=function(e,a,n){function o(e,r){var a=r||[];return null!=e&&(t(Object(e))?!function(e,t){for(var r=+t.length,a=0,n=e.length;r>a;)e[n++]=t[a++];if(r!==r)for(;void 0!==t[a];)e[n++]=t[a++];return e.length=n,e}(a,"string"==typeof e?[e]:e):[].push.call(a,e)),a}if(e){a=(a||"fx")+"queue";var i=r.data(e,a);return n?(!i||r.isArray(n)?i=r.data(e,a,o(n)):i.push(n),i):i||[]}},r.dequeue=function(e,t){r.each(e.nodeType?[e]:e,function(e,a){t=t||"fx";var n=r.queue(a,t),o=n.shift();"inprogress"===o&&(o=n.shift()),o&&("fx"===t&&n.unshift("inprogress"),o.call(a,function(){r.dequeue(a,t)}))})},r.fn=r.prototype={init:function(e){if(e.nodeType)return this[0]=e,this;throw new Error("Not a DOM node.")},offset:function(){var t=this[0].getBoundingClientRect?this[0].getBoundingClientRect():{top:0,left:0};return{top:t.top+(e.pageYOffset||document.scrollTop||0)-(document.clientTop||0),left:t.left+(e.pageXOffset||document.scrollLeft||0)-(document.clientLeft||0)}},position:function(){function e(){for(var e=this.offsetParent||document;e&&"html"===!e.nodeType.toLowerCase&&"static"===e.style.position;)e=e.offsetParent;return e||document}var t=this[0],e=e.apply(t),a=this.offset(),n=/^(?:body|html)$/i.test(e.nodeName)?{top:0,left:0}:r(e).offset();return a.top-=parseFloat(t.style.marginTop)||0,a.left-=parseFloat(t.style.marginLeft)||0,e.style&&(n.top+=parseFloat(e.style.borderTopWidth)||0,n.left+=parseFloat(e.style.borderLeftWidth)||0),{top:a.top-n.top,left:a.left-n.left}}};var a={};r.expando="velocity"+(new Date).getTime(),r.uuid=0;for(var n={},o=n.hasOwnProperty,i=n.toString,s="Boolean Number String Function Array Date RegExp Object Error".split(" "),l=0;l<s.length;l++)n["[object "+s[l]+"]"]=s[l].toLowerCase();r.fn.init.prototype=r.fn,e.Velocity={Utilities:r}}}(window),function(e){"object"==typeof module&&"object"==typeof module.exports?module.exports=e():"function"==typeof define&&define.amd?define(e):e()}(function(){return function(e,t,r,a){function n(e){for(var t=-1,r=e?e.length:0,a=[];++t<r;){var n=e[t];n&&a.push(n)}return a}function o(e){return m.isWrapped(e)?e=[].slice.call(e):m.isNode(e)&&(e=[e]),e}function i(e){var t=f.data(e,"velocity");return null===t?a:t}function s(e){return function(t){return Math.round(t*e)*(1/e)}}function l(e,r,a,n){function o(e,t){return 1-3*t+3*e}function i(e,t){return 3*t-6*e}function s(e){return 3*e}function l(e,t,r){return((o(t,r)*e+i(t,r))*e+s(t))*e}function u(e,t,r){return 3*o(t,r)*e*e+2*i(t,r)*e+s(t)}function c(t,r){for(var n=0;m>n;++n){var o=u(r,e,a);if(0===o)return r;var i=l(r,e,a)-t;r-=i/o}return r}function p(){for(var t=0;b>t;++t)w[t]=l(t*x,e,a)}function f(t,r,n){var o,i,s=0;do i=r+(n-r)/2,o=l(i,e,a)-t,o>0?n=i:r=i;while(Math.abs(o)>h&&++s<v);return i}function d(t){for(var r=0,n=1,o=b-1;n!=o&&w[n]<=t;++n)r+=x;--n;var i=(t-w[n])/(w[n+1]-w[n]),s=r+i*x,l=u(s,e,a);return l>=y?c(t,s):0==l?s:f(t,r,r+x)}function g(){V=!0,(e!=r||a!=n)&&p()}var m=4,y=.001,h=1e-7,v=10,b=11,x=1/(b-1),S="Float32Array"in t;if(4!==arguments.length)return!1;for(var P=0;4>P;++P)if("number"!=typeof arguments[P]||isNaN(arguments[P])||!isFinite(arguments[P]))return!1;e=Math.min(e,1),a=Math.min(a,1),e=Math.max(e,0),a=Math.max(a,0);var w=S?new Float32Array(b):new Array(b),V=!1,C=function(t){return V||g(),e===r&&a===n?t:0===t?0:1===t?1:l(d(t),r,n)};C.getControlPoints=function(){return[{x:e,y:r},{x:a,y:n}]};var T="generateBezier("+[e,r,a,n]+")";return C.toString=function(){return T},C}function u(e,t){var r=e;return m.isString(e)?b.Easings[e]||(r=!1):r=m.isArray(e)&&1===e.length?s.apply(null,e):m.isArray(e)&&2===e.length?x.apply(null,e.concat([t])):m.isArray(e)&&4===e.length?l.apply(null,e):!1,r===!1&&(r=b.Easings[b.defaults.easing]?b.defaults.easing:v),r}function c(e){if(e){var t=(new Date).getTime(),r=b.State.calls.length;r>1e4&&(b.State.calls=n(b.State.calls));for(var o=0;r>o;o++)if(b.State.calls[o]){var s=b.State.calls[o],l=s[0],u=s[2],d=s[3],g=!!d,y=null;d||(d=b.State.calls[o][3]=t-16);for(var h=Math.min((t-d)/u.duration,1),v=0,x=l.length;x>v;v++){var P=l[v],V=P.element;if(i(V)){var C=!1;if(u.display!==a&&null!==u.display&&"none"!==u.display){if("flex"===u.display){var T=["-webkit-box","-moz-box","-ms-flexbox","-webkit-flex"];f.each(T,function(e,t){S.setPropertyValue(V,"display",t)})}S.setPropertyValue(V,"display",u.display)}u.visibility!==a&&"hidden"!==u.visibility&&S.setPropertyValue(V,"visibility",u.visibility);for(var k in P)if("element"!==k){var A,F=P[k],j=m.isString(F.easing)?b.Easings[F.easing]:F.easing;if(1===h)A=F.endValue;else{var E=F.endValue-F.startValue;if(A=F.startValue+E*j(h,u,E),!g&&A===F.currentValue)continue}if(F.currentValue=A,"tween"===k)y=A;else{if(S.Hooks.registered[k]){var H=S.Hooks.getRoot(k),N=i(V).rootPropertyValueCache[H];N&&(F.rootPropertyValue=N)}var L=S.setPropertyValue(V,k,F.currentValue+(0===parseFloat(A)?"":F.unitType),F.rootPropertyValue,F.scrollData);S.Hooks.registered[k]&&(i(V).rootPropertyValueCache[H]=S.Normalizations.registered[H]?S.Normalizations.registered[H]("extract",null,L[1]):L[1]),"transform"===L[0]&&(C=!0)}}u.mobileHA&&i(V).transformCache.translate3d===a&&(i(V).transformCache.translate3d="(0px, 0px, 0px)",C=!0),C&&S.flushTransformCache(V)}}u.display!==a&&"none"!==u.display&&(b.State.calls[o][2].display=!1),u.visibility!==a&&"hidden"!==u.visibility&&(b.State.calls[o][2].visibility=!1),u.progress&&u.progress.call(s[1],s[1],h,Math.max(0,d+u.duration-t),d,y),1===h&&p(o)}}b.State.isTicking&&w(c)}function p(e,t){if(!b.State.calls[e])return!1;for(var r=b.State.calls[e][0],n=b.State.calls[e][1],o=b.State.calls[e][2],s=b.State.calls[e][4],l=!1,u=0,c=r.length;c>u;u++){var p=r[u].element;if(t||o.loop||("none"===o.display&&S.setPropertyValue(p,"display",o.display),"hidden"===o.visibility&&S.setPropertyValue(p,"visibility",o.visibility)),o.loop!==!0&&(f.queue(p)[1]===a||!/\.velocityQueueEntryFlag/i.test(f.queue(p)[1]))&&i(p)){i(p).isAnimating=!1,i(p).rootPropertyValueCache={};var d=!1;f.each(S.Lists.transforms3D,function(e,t){var r=/^scale/.test(t)?1:0,n=i(p).transformCache[t];i(p).transformCache[t]!==a&&new RegExp("^\\("+r+"[^.]").test(n)&&(d=!0,delete i(p).transformCache[t])}),o.mobileHA&&(d=!0,delete i(p).transformCache.translate3d),d&&S.flushTransformCache(p),S.Values.removeClass(p,"velocity-animating")}if(!t&&o.complete&&!o.loop&&u===c-1)try{o.complete.call(n,n)}catch(g){setTimeout(function(){throw g},1)}s&&o.loop!==!0&&s(n),i(p)&&o.loop===!0&&!t&&(f.each(i(p).tweensContainer,function(e,t){/^rotate/.test(e)&&360===parseFloat(t.endValue)&&(t.endValue=0,t.startValue=360),/^backgroundPosition/.test(e)&&100===parseFloat(t.endValue)&&"%"===t.unitType&&(t.endValue=0,t.startValue=100)}),b(p,"reverse",{loop:!0,delay:o.delay})),o.queue!==!1&&f.dequeue(p,o.queue)}b.State.calls[e]=!1;for(var m=0,y=b.State.calls.length;y>m;m++)if(b.State.calls[m]!==!1){l=!0;break}l===!1&&(b.State.isTicking=!1,delete b.State.calls,b.State.calls=[])}var f,d=function(){if(r.documentMode)return r.documentMode;for(var e=7;e>4;e--){var t=r.createElement("div");if(t.innerHTML="<!--[if IE "+e+"]><span></span><![endif]-->",t.getElementsByTagName("span").length)return t=null,e}return a}(),g=function(){var e=0;return t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(t){var r,a=(new Date).getTime();return r=Math.max(0,16-(a-e)),e=a+r,setTimeout(function(){t(a+r)},r)}}(),m={isString:function(e){return"string"==typeof e},isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)},isNode:function(e){return e&&e.nodeType},isNodeList:function(e){return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e))&&e.length!==a&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},isWrapped:function(e){return e&&(e.jquery||t.Zepto&&t.Zepto.zepto.isZ(e))},isSVG:function(e){return t.SVGElement&&e instanceof t.SVGElement},isEmptyObject:function(e){for(var t in e)return!1;return!0}},y=!1;if(e.fn&&e.fn.jquery?(f=e,y=!0):f=t.Velocity.Utilities,8>=d&&!y)throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");if(7>=d)return void(jQuery.fn.velocity=jQuery.fn.animate);var h=400,v="swing",b={State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:t.chrome,isFirefox:/Firefox/i.test(navigator.userAgent),prefixElement:r.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:f,Redirects:{},Easings:{},Promise:t.Promise,defaults:{queue:"",duration:h,easing:v,begin:a,complete:a,progress:a,display:a,visibility:a,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},init:function(e){f.data(e,"velocity",{isSVG:m.isSVG(e),isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}})},hook:null,mock:!1,version:{major:1,minor:2,patch:2},debug:!1};t.pageYOffset!==a?(b.State.scrollAnchor=t,b.State.scrollPropertyLeft="pageXOffset",b.State.scrollPropertyTop="pageYOffset"):(b.State.scrollAnchor=r.documentElement||r.body.parentNode||r.body,b.State.scrollPropertyLeft="scrollLeft",b.State.scrollPropertyTop="scrollTop");var x=function(){function e(e){return-e.tension*e.x-e.friction*e.v}function t(t,r,a){var n={x:t.x+a.dx*r,v:t.v+a.dv*r,tension:t.tension,friction:t.friction};return{dx:n.v,dv:e(n)}}function r(r,a){var n={dx:r.v,dv:e(r)},o=t(r,.5*a,n),i=t(r,.5*a,o),s=t(r,a,i),l=1/6*(n.dx+2*(o.dx+i.dx)+s.dx),u=1/6*(n.dv+2*(o.dv+i.dv)+s.dv);return r.x=r.x+l*a,r.v=r.v+u*a,r}return function a(e,t,n){var o,i,s,l={x:-1,v:0,tension:null,friction:null},u=[0],c=0,p=1e-4,f=.016;for(e=parseFloat(e)||500,t=parseFloat(t)||20,n=n||null,l.tension=e,l.friction=t,o=null!==n,o?(c=a(e,t),i=c/n*f):i=f;s=r(s||l,i),u.push(1+s.x),c+=16,Math.abs(s.x)>p&&Math.abs(s.v)>p;);return o?function(e){return u[e*(u.length-1)|0]}:c}}();b.Easings={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},spring:function(e){return 1-Math.cos(4.5*e*Math.PI)*Math.exp(6*-e)}},f.each([["ease",[.25,.1,.25,1]],["ease-in",[.42,0,1,1]],["ease-out",[0,0,.58,1]],["ease-in-out",[.42,0,.58,1]],["easeInSine",[.47,0,.745,.715]],["easeOutSine",[.39,.575,.565,1]],["easeInOutSine",[.445,.05,.55,.95]],["easeInQuad",[.55,.085,.68,.53]],["easeOutQuad",[.25,.46,.45,.94]],["easeInOutQuad",[.455,.03,.515,.955]],["easeInCubic",[.55,.055,.675,.19]],["easeOutCubic",[.215,.61,.355,1]],["easeInOutCubic",[.645,.045,.355,1]],["easeInQuart",[.895,.03,.685,.22]],["easeOutQuart",[.165,.84,.44,1]],["easeInOutQuart",[.77,0,.175,1]],["easeInQuint",[.755,.05,.855,.06]],["easeOutQuint",[.23,1,.32,1]],["easeInOutQuint",[.86,0,.07,1]],["easeInExpo",[.95,.05,.795,.035]],["easeOutExpo",[.19,1,.22,1]],["easeInOutExpo",[1,0,0,1]],["easeInCirc",[.6,.04,.98,.335]],["easeOutCirc",[.075,.82,.165,1]],["easeInOutCirc",[.785,.135,.15,.86]]],function(e,t){b.Easings[t[0]]=l.apply(null,t[1])});var S=b.CSS={RegEx:{isHex:/^#([A-f\d]{3}){1,2}$/i,valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Lists:{colors:["fill","stroke","stopColor","color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],transformsBase:["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"],transforms3D:["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]},Hooks:{templates:{textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0px"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){for(var e=0;e<S.Lists.colors.length;e++){var t="color"===S.Lists.colors[e]?"0 0 0 1":"255 255 255 1";S.Hooks.templates[S.Lists.colors[e]]=["Red Green Blue Alpha",t]}var r,a,n;if(d)for(r in S.Hooks.templates){a=S.Hooks.templates[r],n=a[0].split(" ");var o=a[1].match(S.RegEx.valueSplit);"Color"===n[0]&&(n.push(n.shift()),o.push(o.shift()),S.Hooks.templates[r]=[n.join(" "),o.join(" ")])}for(r in S.Hooks.templates){a=S.Hooks.templates[r],n=a[0].split(" ");for(var e in n){var i=r+n[e],s=e;S.Hooks.registered[i]=[r,s]}}},getRoot:function(e){var t=S.Hooks.registered[e];return t?t[0]:e},cleanRootPropertyValue:function(e,t){return S.RegEx.valueUnwrap.test(t)&&(t=t.match(S.RegEx.valueUnwrap)[1]),S.Values.isCSSNullValue(t)&&(t=S.Hooks.templates[e][1]),t},extractValue:function(e,t){var r=S.Hooks.registered[e];if(r){var a=r[0],n=r[1];return t=S.Hooks.cleanRootPropertyValue(a,t),t.toString().match(S.RegEx.valueSplit)[n]}return t},injectValue:function(e,t,r){var a=S.Hooks.registered[e];if(a){var n,o,i=a[0],s=a[1];return r=S.Hooks.cleanRootPropertyValue(i,r),n=r.toString().match(S.RegEx.valueSplit),n[s]=t,o=n.join(" ")}return r}},Normalizations:{registered:{clip:function(e,t,r){switch(e){case"name":return"clip";case"extract":var a;return S.RegEx.wrappedValueAlreadyExtracted.test(r)?a=r:(a=r.toString().match(S.RegEx.valueUnwrap),a=a?a[1].replace(/,(\s+)?/g," "):r),a;case"inject":return"rect("+r+")"}},blur:function(e,t,r){switch(e){case"name":return b.State.isFirefox?"filter":"-webkit-filter";case"extract":var a=parseFloat(r);if(!a&&0!==a){var n=r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);a=n?n[1]:0}return a;case"inject":return parseFloat(r)?"blur("+r+")":"none"}},opacity:function(e,t,r){if(8>=d)switch(e){case"name":return"filter";case"extract":var a=r.toString().match(/alpha\(opacity=(.*)\)/i);return r=a?a[1]/100:1;case"inject":return t.style.zoom=1,parseFloat(r)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(r),10)+")"}else switch(e){case"name":return"opacity";case"extract":return r;case"inject":return r}}},register:function(){9>=d||b.State.isGingerbread||(S.Lists.transformsBase=S.Lists.transformsBase.concat(S.Lists.transforms3D));for(var e=0;e<S.Lists.transformsBase.length;e++)!function(){var t=S.Lists.transformsBase[e];S.Normalizations.registered[t]=function(e,r,n){switch(e){case"name":return"transform";case"extract":return i(r)===a||i(r).transformCache[t]===a?/^scale/i.test(t)?1:0:i(r).transformCache[t].replace(/[()]/g,"");case"inject":var o=!1;switch(t.substr(0,t.length-1)){case"translate":o=!/(%|px|em|rem|vw|vh|\d)$/i.test(n);break;case"scal":case"scale":b.State.isAndroid&&i(r).transformCache[t]===a&&1>n&&(n=1),o=!/(\d)$/i.test(n);break;case"skew":o=!/(deg|\d)$/i.test(n);break;case"rotate":o=!/(deg|\d)$/i.test(n)}return o||(i(r).transformCache[t]="("+n+")"),i(r).transformCache[t]}}}();for(var e=0;e<S.Lists.colors.length;e++)!function(){var t=S.Lists.colors[e];S.Normalizations.registered[t]=function(e,r,n){switch(e){case"name":return t;case"extract":var o;if(S.RegEx.wrappedValueAlreadyExtracted.test(n))o=n;else{var i,s={black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",red:"rgb(255, 0, 0)",white:"rgb(255, 255, 255)"};/^[A-z]+$/i.test(n)?i=s[n]!==a?s[n]:s.black:S.RegEx.isHex.test(n)?i="rgb("+S.Values.hexToRgb(n).join(" ")+")":/^rgba?\(/i.test(n)||(i=s.black),o=(i||n).toString().match(S.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=d||3!==o.split(" ").length||(o+=" 1"),o;case"inject":return 8>=d?4===n.split(" ").length&&(n=n.split(/\s+/).slice(0,3).join(" ")):3===n.split(" ").length&&(n+=" 1"),(8>=d?"rgb":"rgba")+"("+n.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})},SVGAttribute:function(e){var t="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return(d||b.State.isAndroid&&!b.State.isChrome)&&(t+="|transform"),new RegExp("^("+t+")$","i").test(e)},prefixCheck:function(e){if(b.State.prefixMatches[e])return[b.State.prefixMatches[e],!0];for(var t=["","Webkit","Moz","ms","O"],r=0,a=t.length;a>r;r++){var n;if(n=0===r?e:t[r]+e.replace(/^\w/,function(e){return e.toUpperCase()}),m.isString(b.State.prefixElement.style[n]))return b.State.prefixMatches[e]=n,[n,!0]}return[e,!1]}},Values:{hexToRgb:function(e){var t,r=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;return e=e.replace(r,function(e,t,r,a){return t+t+r+r+a+a}),t=a.exec(e),t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[0,0,0]},isCSSNullValue:function(e){return 0==e||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)},getUnitType:function(e){return/^(rotate|skew)/i.test(e)?"deg":/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e)?"":"px"},getDisplayType:function(e){var t=e&&e.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t)?"inline":/^(li)$/i.test(t)?"list-item":/^(tr)$/i.test(t)?"table-row":/^(table)$/i.test(t)?"table":/^(tbody)$/i.test(t)?"table-row-group":"block"},addClass:function(e,t){e.classList?e.classList.add(t):e.className+=(e.className.length?" ":"")+t},removeClass:function(e,t){e.classList?e.classList.remove(t):e.className=e.className.toString().replace(new RegExp("(^|\\s)"+t.split(" ").join("|")+"(\\s|$)","gi")," ")}},getPropertyValue:function(e,r,n,o){function s(e,r){function n(){u&&S.setPropertyValue(e,"display","none")}var l=0;if(8>=d)l=f.css(e,r);else{var u=!1;if(/^(width|height)$/.test(r)&&0===S.getPropertyValue(e,"display")&&(u=!0,S.setPropertyValue(e,"display",S.Values.getDisplayType(e))),!o){if("height"===r&&"border-box"!==S.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var c=e.offsetHeight-(parseFloat(S.getPropertyValue(e,"borderTopWidth"))||0)-(parseFloat(S.getPropertyValue(e,"borderBottomWidth"))||0)-(parseFloat(S.getPropertyValue(e,"paddingTop"))||0)-(parseFloat(S.getPropertyValue(e,"paddingBottom"))||0);return n(),c}if("width"===r&&"border-box"!==S.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var p=e.offsetWidth-(parseFloat(S.getPropertyValue(e,"borderLeftWidth"))||0)-(parseFloat(S.getPropertyValue(e,"borderRightWidth"))||0)-(parseFloat(S.getPropertyValue(e,"paddingLeft"))||0)-(parseFloat(S.getPropertyValue(e,"paddingRight"))||0);return n(),p}}var g;g=i(e)===a?t.getComputedStyle(e,null):i(e).computedStyle?i(e).computedStyle:i(e).computedStyle=t.getComputedStyle(e,null),"borderColor"===r&&(r="borderTopColor"),l=9===d&&"filter"===r?g.getPropertyValue(r):g[r],(""===l||null===l)&&(l=e.style[r]),n()}if("auto"===l&&/^(top|right|bottom|left)$/i.test(r)){var m=s(e,"position");("fixed"===m||"absolute"===m&&/top|left/i.test(r))&&(l=f(e).position()[r]+"px")}return l}var l;if(S.Hooks.registered[r]){var u=r,c=S.Hooks.getRoot(u);n===a&&(n=S.getPropertyValue(e,S.Names.prefixCheck(c)[0])),S.Normalizations.registered[c]&&(n=S.Normalizations.registered[c]("extract",e,n)),l=S.Hooks.extractValue(u,n)}else if(S.Normalizations.registered[r]){var p,g;p=S.Normalizations.registered[r]("name",e),"transform"!==p&&(g=s(e,S.Names.prefixCheck(p)[0]),S.Values.isCSSNullValue(g)&&S.Hooks.templates[r]&&(g=S.Hooks.templates[r][1])),l=S.Normalizations.registered[r]("extract",e,g)}if(!/^[\d-]/.test(l))if(i(e)&&i(e).isSVG&&S.Names.SVGAttribute(r))if(/^(height|width)$/i.test(r))try{l=e.getBBox()[r]}catch(m){l=0}else l=e.getAttribute(r);else l=s(e,S.Names.prefixCheck(r)[0]);return S.Values.isCSSNullValue(l)&&(l=0),b.debug>=2&&console.log("Get "+r+": "+l),l},setPropertyValue:function(e,r,a,n,o){var s=r;if("scroll"===r)o.container?o.container["scroll"+o.direction]=a:"Left"===o.direction?t.scrollTo(a,o.alternateValue):t.scrollTo(o.alternateValue,a);else if(S.Normalizations.registered[r]&&"transform"===S.Normalizations.registered[r]("name",e))S.Normalizations.registered[r]("inject",e,a),s="transform",a=i(e).transformCache[r];else{if(S.Hooks.registered[r]){var l=r,u=S.Hooks.getRoot(r);n=n||S.getPropertyValue(e,u),a=S.Hooks.injectValue(l,a,n),r=u}if(S.Normalizations.registered[r]&&(a=S.Normalizations.registered[r]("inject",e,a),r=S.Normalizations.registered[r]("name",e)),s=S.Names.prefixCheck(r)[0],8>=d)try{e.style[s]=a}catch(c){b.debug&&console.log("Browser does not support ["+a+"] for ["+s+"]")}else i(e)&&i(e).isSVG&&S.Names.SVGAttribute(r)?e.setAttribute(r,a):e.style[s]=a;b.debug>=2&&console.log("Set "+r+" ("+s+"): "+a)}return[s,a]},flushTransformCache:function(e){function t(t){return parseFloat(S.getPropertyValue(e,t))}var r="";if((d||b.State.isAndroid&&!b.State.isChrome)&&i(e).isSVG){var a={translate:[t("translateX"),t("translateY")],skewX:[t("skewX")],skewY:[t("skewY")],scale:1!==t("scale")?[t("scale"),t("scale")]:[t("scaleX"),t("scaleY")],rotate:[t("rotateZ"),0,0]};f.each(i(e).transformCache,function(e){/^translate/i.test(e)?e="translate":/^scale/i.test(e)?e="scale":/^rotate/i.test(e)&&(e="rotate"),a[e]&&(r+=e+"("+a[e].join(" ")+") ",delete a[e])})}else{var n,o;f.each(i(e).transformCache,function(t){return n=i(e).transformCache[t],"transformPerspective"===t?(o=n,!0):(9===d&&"rotateZ"===t&&(t="rotate"),void(r+=t+n+" "))}),o&&(r="perspective"+o+" "+r)}S.setPropertyValue(e,"transform",r)}};S.Hooks.register(),S.Normalizations.register(),b.hook=function(e,t,r){var n=a;return e=o(e),f.each(e,function(e,o){if(i(o)===a&&b.init(o),r===a)n===a&&(n=b.CSS.getPropertyValue(o,t));else{var s=b.CSS.setPropertyValue(o,t,r);"transform"===s[0]&&b.CSS.flushTransformCache(o),n=s}}),n};var P=function(){function e(){return s?k.promise||null:l}function n(){function e(e){function p(e,t){var r=a,n=a,i=a;return m.isArray(e)?(r=e[0],!m.isArray(e[1])&&/^[\d-]/.test(e[1])||m.isFunction(e[1])||S.RegEx.isHex.test(e[1])?i=e[1]:(m.isString(e[1])&&!S.RegEx.isHex.test(e[1])||m.isArray(e[1]))&&(n=t?e[1]:u(e[1],s.duration),e[2]!==a&&(i=e[2]))):r=e,t||(n=n||s.easing),m.isFunction(r)&&(r=r.call(o,V,w)),m.isFunction(i)&&(i=i.call(o,V,w)),[r||0,n,i]}function d(e,t){var r,a;return a=(t||"0").toString().toLowerCase().replace(/[%A-z]+$/,function(e){return r=e,""}),r||(r=S.Values.getUnitType(e)),[a,r]}function h(){var e={myParent:o.parentNode||r.body,position:S.getPropertyValue(o,"position"),fontSize:S.getPropertyValue(o,"fontSize")},a=e.position===L.lastPosition&&e.myParent===L.lastParent,n=e.fontSize===L.lastFontSize;L.lastParent=e.myParent,L.lastPosition=e.position,L.lastFontSize=e.fontSize;var s=100,l={};if(n&&a)l.emToPx=L.lastEmToPx,l.percentToPxWidth=L.lastPercentToPxWidth,l.percentToPxHeight=L.lastPercentToPxHeight;else{var u=i(o).isSVG?r.createElementNS("http://www.w3.org/2000/svg","rect"):r.createElement("div");b.init(u),e.myParent.appendChild(u),f.each(["overflow","overflowX","overflowY"],function(e,t){b.CSS.setPropertyValue(u,t,"hidden")}),b.CSS.setPropertyValue(u,"position",e.position),b.CSS.setPropertyValue(u,"fontSize",e.fontSize),b.CSS.setPropertyValue(u,"boxSizing","content-box"),f.each(["minWidth","maxWidth","width","minHeight","maxHeight","height"],function(e,t){b.CSS.setPropertyValue(u,t,s+"%")}),b.CSS.setPropertyValue(u,"paddingLeft",s+"em"),l.percentToPxWidth=L.lastPercentToPxWidth=(parseFloat(S.getPropertyValue(u,"width",null,!0))||1)/s,l.percentToPxHeight=L.lastPercentToPxHeight=(parseFloat(S.getPropertyValue(u,"height",null,!0))||1)/s,l.emToPx=L.lastEmToPx=(parseFloat(S.getPropertyValue(u,"paddingLeft"))||1)/s,e.myParent.removeChild(u)}return null===L.remToPx&&(L.remToPx=parseFloat(S.getPropertyValue(r.body,"fontSize"))||16),null===L.vwToPx&&(L.vwToPx=parseFloat(t.innerWidth)/100,L.vhToPx=parseFloat(t.innerHeight)/100),l.remToPx=L.remToPx,l.vwToPx=L.vwToPx,l.vhToPx=L.vhToPx,b.debug>=1&&console.log("Unit ratios: "+JSON.stringify(l),o),l}if(s.begin&&0===V)try{s.begin.call(g,g)}catch(x){setTimeout(function(){throw x},1)}if("scroll"===A){var P,C,T,F=/^x$/i.test(s.axis)?"Left":"Top",j=parseFloat(s.offset)||0;s.container?m.isWrapped(s.container)||m.isNode(s.container)?(s.container=s.container[0]||s.container,P=s.container["scroll"+F],T=P+f(o).position()[F.toLowerCase()]+j):s.container=null:(P=b.State.scrollAnchor[b.State["scrollProperty"+F]],C=b.State.scrollAnchor[b.State["scrollProperty"+("Left"===F?"Top":"Left")]],T=f(o).offset()[F.toLowerCase()]+j),l={scroll:{rootPropertyValue:!1,startValue:P,currentValue:P,endValue:T,unitType:"",easing:s.easing,scrollData:{container:s.container,direction:F,alternateValue:C}},element:o},b.debug&&console.log("tweensContainer (scroll): ",l.scroll,o)}else if("reverse"===A){if(!i(o).tweensContainer)return void f.dequeue(o,s.queue);"none"===i(o).opts.display&&(i(o).opts.display="auto"),"hidden"===i(o).opts.visibility&&(i(o).opts.visibility="visible"),i(o).opts.loop=!1,i(o).opts.begin=null,i(o).opts.complete=null,v.easing||delete s.easing,v.duration||delete s.duration,s=f.extend({},i(o).opts,s);var E=f.extend(!0,{},i(o).tweensContainer);for(var H in E)if("element"!==H){var N=E[H].startValue;E[H].startValue=E[H].currentValue=E[H].endValue,E[H].endValue=N,m.isEmptyObject(v)||(E[H].easing=s.easing),b.debug&&console.log("reverse tweensContainer ("+H+"): "+JSON.stringify(E[H]),o)}l=E}else if("start"===A){var E;i(o).tweensContainer&&i(o).isAnimating===!0&&(E=i(o).tweensContainer),f.each(y,function(e,t){if(RegExp("^"+S.Lists.colors.join("$|^")+"$").test(e)){var r=p(t,!0),n=r[0],o=r[1],i=r[2];if(S.RegEx.isHex.test(n)){for(var s=["Red","Green","Blue"],l=S.Values.hexToRgb(n),u=i?S.Values.hexToRgb(i):a,c=0;c<s.length;c++){var f=[l[c]];o&&f.push(o),u!==a&&f.push(u[c]),y[e+s[c]]=f}delete y[e]}}});for(var z in y){var O=p(y[z]),q=O[0],$=O[1],M=O[2];z=S.Names.camelCase(z);var I=S.Hooks.getRoot(z),B=!1;if(i(o).isSVG||"tween"===I||S.Names.prefixCheck(I)[1]!==!1||S.Normalizations.registered[I]!==a){(s.display!==a&&null!==s.display&&"none"!==s.display||s.visibility!==a&&"hidden"!==s.visibility)&&/opacity|filter/.test(z)&&!M&&0!==q&&(M=0),s._cacheValues&&E&&E[z]?(M===a&&(M=E[z].endValue+E[z].unitType),B=i(o).rootPropertyValueCache[I]):S.Hooks.registered[z]?M===a?(B=S.getPropertyValue(o,I),M=S.getPropertyValue(o,z,B)):B=S.Hooks.templates[I][1]:M===a&&(M=S.getPropertyValue(o,z));var W,G,Y,D=!1;if(W=d(z,M),M=W[0],Y=W[1],W=d(z,q),q=W[0].replace(/^([+-\/*])=/,function(e,t){return D=t,""}),G=W[1],M=parseFloat(M)||0,q=parseFloat(q)||0,"%"===G&&(/^(fontSize|lineHeight)$/.test(z)?(q/=100,G="em"):/^scale/.test(z)?(q/=100,G=""):/(Red|Green|Blue)$/i.test(z)&&(q=q/100*255,G="")),/[\/*]/.test(D))G=Y;else if(Y!==G&&0!==M)if(0===q)G=Y;else{n=n||h();var Q=/margin|padding|left|right|width|text|word|letter/i.test(z)||/X$/.test(z)||"x"===z?"x":"y";switch(Y){case"%":M*="x"===Q?n.percentToPxWidth:n.percentToPxHeight;break;case"px":break;default:M*=n[Y+"ToPx"]}switch(G){case"%":M*=1/("x"===Q?n.percentToPxWidth:n.percentToPxHeight);break;case"px":break;default:M*=1/n[G+"ToPx"]}}switch(D){case"+":q=M+q;break;case"-":q=M-q;break;case"*":q=M*q;break;case"/":q=M/q}l[z]={rootPropertyValue:B,startValue:M,currentValue:M,endValue:q,unitType:G,easing:$},b.debug&&console.log("tweensContainer ("+z+"): "+JSON.stringify(l[z]),o)}else b.debug&&console.log("Skipping ["+I+"] due to a lack of browser support.")}l.element=o}l.element&&(S.Values.addClass(o,"velocity-animating"),R.push(l),""===s.queue&&(i(o).tweensContainer=l,i(o).opts=s),i(o).isAnimating=!0,V===w-1?(b.State.calls.push([R,g,s,null,k.resolver]),b.State.isTicking===!1&&(b.State.isTicking=!0,c())):V++)}var n,o=this,s=f.extend({},b.defaults,v),l={};switch(i(o)===a&&b.init(o),parseFloat(s.delay)&&s.queue!==!1&&f.queue(o,s.queue,function(e){b.velocityQueueEntryFlag=!0,i(o).delayTimer={setTimeout:setTimeout(e,parseFloat(s.delay)),next:e}}),s.duration.toString().toLowerCase()){case"fast":s.duration=200;break;case"normal":s.duration=h;break;case"slow":s.duration=600;break;default:s.duration=parseFloat(s.duration)||1}b.mock!==!1&&(b.mock===!0?s.duration=s.delay=1:(s.duration*=parseFloat(b.mock)||1,s.delay*=parseFloat(b.mock)||1)),s.easing=u(s.easing,s.duration),s.begin&&!m.isFunction(s.begin)&&(s.begin=null),s.progress&&!m.isFunction(s.progress)&&(s.progress=null),s.complete&&!m.isFunction(s.complete)&&(s.complete=null),s.display!==a&&null!==s.display&&(s.display=s.display.toString().toLowerCase(),"auto"===s.display&&(s.display=b.CSS.Values.getDisplayType(o))),s.visibility!==a&&null!==s.visibility&&(s.visibility=s.visibility.toString().toLowerCase()),s.mobileHA=s.mobileHA&&b.State.isMobile&&!b.State.isGingerbread,s.queue===!1?s.delay?setTimeout(e,s.delay):e():f.queue(o,s.queue,function(t,r){return r===!0?(k.promise&&k.resolver(g),!0):(b.velocityQueueEntryFlag=!0,void e(t))}),""!==s.queue&&"fx"!==s.queue||"inprogress"===f.queue(o)[0]||f.dequeue(o)}var s,l,d,g,y,v,x=arguments[0]&&(arguments[0].p||f.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||m.isString(arguments[0].properties));if(m.isWrapped(this)?(s=!1,d=0,g=this,l=this):(s=!0,d=1,g=x?arguments[0].elements||arguments[0].e:arguments[0]),g=o(g)){x?(y=arguments[0].properties||arguments[0].p,v=arguments[0].options||arguments[0].o):(y=arguments[d],v=arguments[d+1]);var w=g.length,V=0;if(!/^(stop|finish)$/i.test(y)&&!f.isPlainObject(v)){var C=d+1;v={};for(var T=C;T<arguments.length;T++)m.isArray(arguments[T])||!/^(fast|normal|slow)$/i.test(arguments[T])&&!/^\d/.test(arguments[T])?m.isString(arguments[T])||m.isArray(arguments[T])?v.easing=arguments[T]:m.isFunction(arguments[T])&&(v.complete=arguments[T]):v.duration=arguments[T]}var k={promise:null,resolver:null,rejecter:null};s&&b.Promise&&(k.promise=new b.Promise(function(e,t){k.resolver=e,k.rejecter=t}));var A;switch(y){case"scroll":A="scroll";break;case"reverse":A="reverse";break;case"finish":case"stop":f.each(g,function(e,t){i(t)&&i(t).delayTimer&&(clearTimeout(i(t).delayTimer.setTimeout),i(t).delayTimer.next&&i(t).delayTimer.next(),delete i(t).delayTimer)});var F=[];return f.each(b.State.calls,function(e,t){t&&f.each(t[1],function(r,n){var o=v===a?"":v;return o===!0||t[2].queue===o||v===a&&t[2].queue===!1?void f.each(g,function(r,a){a===n&&((v===!0||m.isString(v))&&(f.each(f.queue(a,m.isString(v)?v:""),function(e,t){
    m.isFunction(t)&&t(null,!0)}),f.queue(a,m.isString(v)?v:"",[])),"stop"===y?(i(a)&&i(a).tweensContainer&&o!==!1&&f.each(i(a).tweensContainer,function(e,t){t.endValue=t.currentValue}),F.push(e)):"finish"===y&&(t[2].duration=1))}):!0})}),"stop"===y&&(f.each(F,function(e,t){p(t,!0)}),k.promise&&k.resolver(g)),e();default:if(!f.isPlainObject(y)||m.isEmptyObject(y)){if(m.isString(y)&&b.Redirects[y]){var j=f.extend({},v),E=j.duration,H=j.delay||0;return j.backwards===!0&&(g=f.extend(!0,[],g).reverse()),f.each(g,function(e,t){parseFloat(j.stagger)?j.delay=H+parseFloat(j.stagger)*e:m.isFunction(j.stagger)&&(j.delay=H+j.stagger.call(t,e,w)),j.drag&&(j.duration=parseFloat(E)||(/^(callout|transition)/.test(y)?1e3:h),j.duration=Math.max(j.duration*(j.backwards?1-e/w:(e+1)/w),.75*j.duration,200)),b.Redirects[y].call(t,t,j||{},e,w,g,k.promise?k:a)}),e()}var N="Velocity: First argument ("+y+") was not a property map, a known action, or a registered redirect. Aborting.";return k.promise?k.rejecter(new Error(N)):console.log(N),e()}A="start"}var L={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPx:null,vwToPx:null,vhToPx:null},R=[];f.each(g,function(e,t){m.isNode(t)&&n.call(t)});var z,j=f.extend({},b.defaults,v);if(j.loop=parseInt(j.loop),z=2*j.loop-1,j.loop)for(var O=0;z>O;O++){var q={delay:j.delay,progress:j.progress};O===z-1&&(q.display=j.display,q.visibility=j.visibility,q.complete=j.complete),P(g,"reverse",q)}return e()}};b=f.extend(P,b),b.animate=P;var w=t.requestAnimationFrame||g;return b.State.isMobile||r.hidden===a||r.addEventListener("visibilitychange",function(){r.hidden?(w=function(e){return setTimeout(function(){e(!0)},16)},c()):w=t.requestAnimationFrame||g}),e.Velocity=b,e!==t&&(e.fn.velocity=P,e.fn.velocity.defaults=b.defaults),f.each(["Down","Up"],function(e,t){b.Redirects["slide"+t]=function(e,r,n,o,i,s){var l=f.extend({},r),u=l.begin,c=l.complete,p={height:"",marginTop:"",marginBottom:"",paddingTop:"",paddingBottom:""},d={};l.display===a&&(l.display="Down"===t?"inline"===b.CSS.Values.getDisplayType(e)?"inline-block":"block":"none"),l.begin=function(){u&&u.call(i,i);for(var r in p){d[r]=e.style[r];var a=b.CSS.getPropertyValue(e,r);p[r]="Down"===t?[a,0]:[0,a]}d.overflow=e.style.overflow,e.style.overflow="hidden"},l.complete=function(){for(var t in d)e.style[t]=d[t];c&&c.call(i,i),s&&s.resolver(i)},b(e,p,l)}}),f.each(["In","Out"],function(e,t){b.Redirects["fade"+t]=function(e,r,n,o,i,s){var l=f.extend({},r),u={opacity:"In"===t?1:0},c=l.complete;l.complete=n!==o-1?l.begin=null:function(){c&&c.call(i,i),s&&s.resolver(i)},l.display===a&&(l.display="In"===t?"auto":"none"),b(this,u,l)}}),b}(window.jQuery||window.Zepto||window,window,document)}));
;!function(a,b,c,d){"use strict";function k(a,b,c){return setTimeout(q(a,c),b)}function l(a,b,c){return Array.isArray(a)?(m(a,c[b],c),!0):!1}function m(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function n(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function o(a,b){return n(a,b,!0)}function p(a,b,c){var e,d=b.prototype;e=a.prototype=Object.create(d),e.constructor=a,e._super=d,c&&n(e,c)}function q(a,b){return function(){return a.apply(b,arguments)}}function r(a,b){return typeof a==g?a.apply(b?b[0]||d:d,b):a}function s(a,b){return a===d?b:a}function t(a,b,c){m(x(b),function(b){a.addEventListener(b,c,!1)})}function u(a,b,c){m(x(b),function(b){a.removeEventListener(b,c,!1)})}function v(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function w(a,b){return a.indexOf(b)>-1}function x(a){return a.trim().split(/\s+/g)}function y(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function z(a){return Array.prototype.slice.call(a,0)}function A(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];y(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function B(a,b){for(var c,f,g=b[0].toUpperCase()+b.slice(1),h=0;h<e.length;){if(c=e[h],f=c?c+g:b,f in a)return f;h++}return d}function D(){return C++}function E(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function ab(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){r(a.options.enable,[a])&&c.handler(b)},this.init()}function bb(a){var b,c=a.options.inputClass;return b=c?c:H?wb:I?Eb:G?Gb:rb,new b(a,cb)}function cb(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&O&&0===d-e,g=b&(Q|R)&&0===d-e;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,db(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function db(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=gb(b)),e>1&&!c.firstMultiple?c.firstMultiple=gb(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=hb(d);b.timeStamp=j(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=lb(h,i),b.distance=kb(h,i),eb(c,b),b.offsetDirection=jb(b.deltaX,b.deltaY),b.scale=g?nb(g.pointers,d):1,b.rotation=g?mb(g.pointers,d):0,fb(c,b);var k=a.element;v(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function eb(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===O||f.eventType===Q)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function fb(a,b){var f,g,h,j,c=a.lastInterval||b,e=b.timeStamp-c.timeStamp;if(b.eventType!=R&&(e>N||c.velocity===d)){var k=c.deltaX-b.deltaX,l=c.deltaY-b.deltaY,m=ib(e,k,l);g=m.x,h=m.y,f=i(m.x)>i(m.y)?m.x:m.y,j=jb(k,l),a.lastInterval=b}else f=c.velocity,g=c.velocityX,h=c.velocityY,j=c.direction;b.velocity=f,b.velocityX=g,b.velocityY=h,b.direction=j}function gb(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:h(a.pointers[c].clientX),clientY:h(a.pointers[c].clientY)},c++;return{timeStamp:j(),pointers:b,center:hb(b),deltaX:a.deltaX,deltaY:a.deltaY}}function hb(a){var b=a.length;if(1===b)return{x:h(a[0].clientX),y:h(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:h(c/b),y:h(d/b)}}function ib(a,b,c){return{x:b/a||0,y:c/a||0}}function jb(a,b){return a===b?S:i(a)>=i(b)?a>0?T:U:b>0?V:W}function kb(a,b,c){c||(c=$);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function lb(a,b,c){c||(c=$);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function mb(a,b){return lb(b[1],b[0],_)-lb(a[1],a[0],_)}function nb(a,b){return kb(b[0],b[1],_)/kb(a[0],a[1],_)}function rb(){this.evEl=pb,this.evWin=qb,this.allow=!0,this.pressed=!1,ab.apply(this,arguments)}function wb(){this.evEl=ub,this.evWin=vb,ab.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function Ab(){this.evTarget=yb,this.evWin=zb,this.started=!1,ab.apply(this,arguments)}function Bb(a,b){var c=z(a.touches),d=z(a.changedTouches);return b&(Q|R)&&(c=A(c.concat(d),"identifier",!0)),[c,d]}function Eb(){this.evTarget=Db,this.targetIds={},ab.apply(this,arguments)}function Fb(a,b){var c=z(a.touches),d=this.targetIds;if(b&(O|P)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=z(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return v(a.target,i)}),b===O)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Q|R)&&delete d[g[e].identifier],e++;return h.length?[A(f.concat(h),"identifier",!0),h]:void 0}function Gb(){ab.apply(this,arguments);var a=q(this.handler,this);this.touch=new Eb(this.manager,a),this.mouse=new rb(this.manager,a)}function Pb(a,b){this.manager=a,this.set(b)}function Qb(a){if(w(a,Mb))return Mb;var b=w(a,Nb),c=w(a,Ob);return b&&c?Nb+" "+Ob:b||c?b?Nb:Ob:w(a,Lb)?Lb:Kb}function Yb(a){this.id=D(),this.manager=null,this.options=o(a||{},this.defaults),this.options.enable=s(this.options.enable,!0),this.state=Rb,this.simultaneous={},this.requireFail=[]}function Zb(a){return a&Wb?"cancel":a&Ub?"end":a&Tb?"move":a&Sb?"start":""}function $b(a){return a==W?"down":a==V?"up":a==T?"left":a==U?"right":""}function _b(a,b){var c=b.manager;return c?c.get(a):a}function ac(){Yb.apply(this,arguments)}function bc(){ac.apply(this,arguments),this.pX=null,this.pY=null}function cc(){ac.apply(this,arguments)}function dc(){Yb.apply(this,arguments),this._timer=null,this._input=null}function ec(){ac.apply(this,arguments)}function fc(){ac.apply(this,arguments)}function gc(){Yb.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function hc(a,b){return b=b||{},b.recognizers=s(b.recognizers,hc.defaults.preset),new kc(a,b)}function kc(a,b){b=b||{},this.options=o(b,hc.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=bb(this),this.touchAction=new Pb(this,this.options.touchAction),lc(this,!0),m(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function lc(a,b){var c=a.element;m(a.options.cssProps,function(a,d){c.style[B(c.style,d)]=b?a:""})}function mc(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var e=["","webkit","moz","MS","ms","o"],f=b.createElement("div"),g="function",h=Math.round,i=Math.abs,j=Date.now,C=1,F=/mobile|tablet|ip(ad|hone|od)|android/i,G="ontouchstart"in a,H=B(a,"PointerEvent")!==d,I=G&&F.test(navigator.userAgent),J="touch",K="pen",L="mouse",M="kinect",N=25,O=1,P=2,Q=4,R=8,S=1,T=2,U=4,V=8,W=16,X=T|U,Y=V|W,Z=X|Y,$=["x","y"],_=["clientX","clientY"];ab.prototype={handler:function(){},init:function(){this.evEl&&t(this.element,this.evEl,this.domHandler),this.evTarget&&t(this.target,this.evTarget,this.domHandler),this.evWin&&t(E(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&u(this.element,this.evEl,this.domHandler),this.evTarget&&u(this.target,this.evTarget,this.domHandler),this.evWin&&u(E(this.element),this.evWin,this.domHandler)}};var ob={mousedown:O,mousemove:P,mouseup:Q},pb="mousedown",qb="mousemove mouseup";p(rb,ab,{handler:function(a){var b=ob[a.type];b&O&&0===a.button&&(this.pressed=!0),b&P&&1!==a.which&&(b=Q),this.pressed&&this.allow&&(b&Q&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:L,srcEvent:a}))}});var sb={pointerdown:O,pointermove:P,pointerup:Q,pointercancel:R,pointerout:R},tb={2:J,3:K,4:L,5:M},ub="pointerdown",vb="pointermove pointerup pointercancel";a.MSPointerEvent&&(ub="MSPointerDown",vb="MSPointerMove MSPointerUp MSPointerCancel"),p(wb,ab,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=sb[d],f=tb[a.pointerType]||a.pointerType,g=f==J,h=y(b,a.pointerId,"pointerId");e&O&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Q|R)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var xb={touchstart:O,touchmove:P,touchend:Q,touchcancel:R},yb="touchstart",zb="touchstart touchmove touchend touchcancel";p(Ab,ab,{handler:function(a){var b=xb[a.type];if(b===O&&(this.started=!0),this.started){var c=Bb.call(this,a,b);b&(Q|R)&&0===c[0].length-c[1].length&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:J,srcEvent:a})}}});var Cb={touchstart:O,touchmove:P,touchend:Q,touchcancel:R},Db="touchstart touchmove touchend touchcancel";p(Eb,ab,{handler:function(a){var b=Cb[a.type],c=Fb.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:J,srcEvent:a})}}),p(Gb,ab,{handler:function(a,b,c){var d=c.pointerType==J,e=c.pointerType==L;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Q|R)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Hb=B(f.style,"touchAction"),Ib=Hb!==d,Jb="compute",Kb="auto",Lb="manipulation",Mb="none",Nb="pan-x",Ob="pan-y";Pb.prototype={set:function(a){a==Jb&&(a=this.compute()),Ib&&(this.manager.element.style[Hb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return m(this.manager.recognizers,function(b){r(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),Qb(a.join(" "))},preventDefaults:function(a){if(!Ib){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return b.preventDefault(),void 0;var d=this.actions,e=w(d,Mb),f=w(d,Ob),g=w(d,Nb);return e||f&&c&X||g&&c&Y?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var Rb=1,Sb=2,Tb=4,Ub=8,Vb=Ub,Wb=16,Xb=32;Yb.prototype={defaults:{},set:function(a){return n(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(l(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_b(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return l(a,"dropRecognizeWith",this)?this:(a=_b(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(l(a,"requireFailure",this))return this;var b=this.requireFail;return a=_b(a,this),-1===y(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(l(a,"dropRequireFailure",this))return this;a=_b(a,this);var b=y(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function d(d){b.manager.emit(b.options.event+(d?Zb(c):""),a)}var b=this,c=this.state;Ub>c&&d(!0),d(),c>=Ub&&d(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):(this.state=Xb,void 0)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(Xb|Rb)))return!1;a++}return!0},recognize:function(a){var b=n({},a);return r(this.options.enable,[this,b])?(this.state&(Vb|Wb|Xb)&&(this.state=Rb),this.state=this.process(b),this.state&(Sb|Tb|Ub|Wb)&&this.tryEmit(b),void 0):(this.reset(),this.state=Xb,void 0)},process:function(){},getTouchAction:function(){},reset:function(){}},p(ac,Yb,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(Sb|Tb),e=this.attrTest(a);return d&&(c&R||!e)?b|Wb:d||e?c&Q?b|Ub:b&Sb?b|Tb:Sb:Xb}}),p(bc,ac,{defaults:{event:"pan",threshold:10,pointers:1,direction:Z},getTouchAction:function(){var a=this.options.direction,b=[];return a&X&&b.push(Ob),a&Y&&b.push(Nb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&X?(e=0===f?S:0>f?T:U,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?S:0>g?V:W,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return ac.prototype.attrTest.call(this,a)&&(this.state&Sb||!(this.state&Sb)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$b(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),p(cc,ac,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Mb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&Sb)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),p(dc,Yb,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[Kb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,e=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Q|R)&&!e)this.reset();else if(a.eventType&O)this.reset(),this._timer=k(function(){this.state=Vb,this.tryEmit()},b.time,this);else if(a.eventType&Q)return Vb;return Xb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===Vb&&(a&&a.eventType&Q?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=j(),this.manager.emit(this.options.event,this._input)))}}),p(ec,ac,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Mb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&Sb)}}),p(fc,ac,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:X|Y,pointers:1},getTouchAction:function(){return bc.prototype.getTouchAction.call(this)},attrTest:function(a){var c,b=this.options.direction;return b&(X|Y)?c=a.velocity:b&X?c=a.velocityX:b&Y&&(c=a.velocityY),this._super.attrTest.call(this,a)&&b&a.direction&&a.distance>this.options.threshold&&i(c)>this.options.velocity&&a.eventType&Q},emit:function(a){var b=$b(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),p(gc,Yb,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[Lb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,e=a.deltaTime<b.time;if(this.reset(),a.eventType&O&&0===this.count)return this.failTimeout();if(d&&e&&c){if(a.eventType!=Q)return this.failTimeout();var f=this.pTime?a.timeStamp-this.pTime<b.interval:!0,g=!this.pCenter||kb(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,g&&f?this.count+=1:this.count=1,this._input=a;var h=this.count%b.taps;if(0===h)return this.hasRequireFailures()?(this._timer=k(function(){this.state=Vb,this.tryEmit()},b.interval,this),Sb):Vb}return Xb},failTimeout:function(){return this._timer=k(function(){this.state=Xb},this.options.interval,this),Xb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==Vb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),hc.VERSION="2.0.4",hc.defaults={domEvents:!1,touchAction:Jb,enable:!0,inputTarget:null,inputClass:null,preset:[[ec,{enable:!1}],[cc,{enable:!1},["rotate"]],[fc,{direction:X}],[bc,{direction:X},["swipe"]],[gc],[gc,{event:"doubletap",taps:2},["tap"]],[dc]],cssProps:{userSelect:"default",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ic=1,jc=2;kc.prototype={set:function(a){return n(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?jc:ic},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&Vb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===jc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(Sb|Tb|Ub)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Yb)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(l(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(l(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(y(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return m(x(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return m(x(a),function(a){b?c[a].splice(y(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&mc(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&lc(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},n(hc,{INPUT_START:O,INPUT_MOVE:P,INPUT_END:Q,INPUT_CANCEL:R,STATE_POSSIBLE:Rb,STATE_BEGAN:Sb,STATE_CHANGED:Tb,STATE_ENDED:Ub,STATE_RECOGNIZED:Vb,STATE_CANCELLED:Wb,STATE_FAILED:Xb,DIRECTION_NONE:S,DIRECTION_LEFT:T,DIRECTION_RIGHT:U,DIRECTION_UP:V,DIRECTION_DOWN:W,DIRECTION_HORIZONTAL:X,DIRECTION_VERTICAL:Y,DIRECTION_ALL:Z,Manager:kc,Input:ab,TouchAction:Pb,TouchInput:Eb,MouseInput:rb,PointerEventInput:wb,TouchMouseInput:Gb,SingleTouchInput:Ab,Recognizer:Yb,AttrRecognizer:ac,Tap:gc,Pan:bc,Swipe:fc,Pinch:cc,Rotate:ec,Press:dc,on:t,off:u,each:m,merge:o,extend:n,inherit:p,bindFn:q,prefixed:B}),typeof define==g&&define.amd?define(function(){return hc}):"undefined"!=typeof module&&module.exports?module.exports=hc:a[c]=hc}(window,document,"Hammer");;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));
;// Required for Meteor package, the use of window prevents export by Meteor
(function(window){
    if(window.Package){
        Materialize = {};
    } else {
        window.Materialize = {};
    }
})(window);


// Unique ID
Materialize.guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

Materialize.elementOrParentIsFixed = function(element) {
    var $element = $(element);
    var $checkElements = $element.add($element.parents());
    var isFixed = false;
    $checkElements.each(function(){
        if ($(this).css("position") === "fixed") {
            isFixed = true;
            return false;
        }
    });
    return isFixed;
};

// Velocity has conflicts when loaded with jQuery, this will check for it
var Vel;
if ($) {
    Vel = $.Velocity;
} else if (jQuery) {
    Vel = jQuery.Velocity;
} else {
    Vel = Velocity;
}
;(function ($) {
    $.fn.collapsible = function(options) {
        var defaults = {
            accordion: undefined
        };

        options = $.extend(defaults, options);


        return this.each(function() {

            var $this = $(this);

            var $panel_headers = $(this).find('> li > .collapsible-header');

            var collapsible_type = $this.data("collapsible");

            // Turn off any existing event handlers
            $this.off('click.collapse', '> li > .collapsible-header');
            $panel_headers.off('click.collapse');


            /****************
             Helper Functions
             ****************/

            // Accordion Open
            function accordionOpen(object) {
                $panel_headers = $this.find('> li > .collapsible-header');
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                }
                else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')){
                    object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                }
                else{
                    object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                }

                $panel_headers.not(object).removeClass('active').parent().removeClass('active');
                $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).slideUp(
                    {
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: false,
                        complete:
                            function() {
                                $(this).css('height', '');
                            }
                    });
            }

            // Expandable Open
            function expandableOpen(object) {
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                }
                else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')){
                    object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                }
                else{
                    object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                }
            }

            /**
             * Check if object is children of panel header
             * @param  {Object}  object Jquery object
             * @return {Boolean} true if it is children
             */
            function isChildrenOfPanelHeader(object) {

                var panelHeader = getPanelHeader(object);

                return panelHeader.length > 0;
            }

            /**
             * Get panel header from a children element
             * @param  {Object} object Jquery object
             * @return {Object} panel header object
             */
            function getPanelHeader(object) {

                return object.closest('li > .collapsible-header');
            }

            /*****  End Helper Functions  *****/



                // Add click handler to only direct collapsible header children
            $this.on('click.collapse', '> li > .collapsible-header', function(e) {
                var $header = $(this),
                    element = $(e.target);

                if (isChildrenOfPanelHeader(element)) {
                    element = getPanelHeader(element);
                }

                element.toggleClass('active');

                if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
                    accordionOpen(element);
                } else { // Handle Expandables
                    expandableOpen(element);

                    if ($header.hasClass('active')) {
                        expandableOpen($header);
                    }
                }
            });

            // Open first active
            var $panel_headers = $this.find('> li > .collapsible-header');
            if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
                accordionOpen($panel_headers.filter('.active').first());
            }
            else { // Handle Expandables
                $panel_headers.filter('.active').each(function() {
                    expandableOpen($(this));
                });
            }

        });
    };

    $(document).ready(function(){
        $('.collapsible').collapsible();
    });
}( jQuery ));;(function ($) {

    // Add posibility to scroll to selected option
    // usefull for select for example
    $.fn.scrollTo = function(elem) {
        $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
        return this;
    };

    $.fn.dropdown = function (option) {
        var defaults = {
            inDuration: 300,
            outDuration: 225,
            constrain_width: true, // Constrains width of dropdown to the activator
            hover: false,
            gutter: 0, // Spacing from edge
            belowOrigin: false,
            alignment: 'left'
        };

        this.each(function(){
            var origin = $(this);
            var options = $.extend({}, defaults, option);
            var isFocused = false;

            // Dropdown menu
            var activates = $("#"+ origin.attr('data-activates'));

            function updateOptions() {
                if (origin.data('induration') !== undefined)
                    options.inDuration = origin.data('inDuration');
                if (origin.data('outduration') !== undefined)
                    options.outDuration = origin.data('outDuration');
                if (origin.data('constrainwidth') !== undefined)
                    options.constrain_width = origin.data('constrainwidth');
                if (origin.data('hover') !== undefined)
                    options.hover = origin.data('hover');
                if (origin.data('gutter') !== undefined)
                    options.gutter = origin.data('gutter');
                if (origin.data('beloworigin') !== undefined)
                    options.belowOrigin = origin.data('beloworigin');
                if (origin.data('alignment') !== undefined)
                    options.alignment = origin.data('alignment');
            }

            updateOptions();

            // Attach dropdown to its activator
            origin.after(activates);

            /*
             Helper function to position and resize dropdown.
             Used in hover and click handler.
             */
            function placeDropdown(eventType) {
                // Check for simultaneous focus and click events.
                if (eventType === 'focus') {
                    isFocused = true;
                }

                // Check html data attributes
                updateOptions();

                // Set Dropdown state
                activates.addClass('active');
                origin.addClass('active');

                // Constrain width
                if (options.constrain_width === true) {
                    activates.css('width', origin.outerWidth());

                } else {
                    activates.css('white-space', 'nowrap');
                }

                // Offscreen detection
                var windowHeight = window.innerHeight;
                var originHeight = origin.innerHeight();
                var offsetLeft = origin.offset().left;
                var offsetTop = origin.offset().top - $(window).scrollTop();
                var currAlignment = options.alignment;
                var gutterSpacing = 0;
                var leftPosition = 0;

                // Below Origin
                var verticalOffset = 0;
                if (options.belowOrigin === true) {
                    verticalOffset = originHeight;
                }

                // Check for scrolling positioned container.
                var scrollOffset = 0;
                var wrapper = origin.parent();
                if (!wrapper.is('body') && wrapper[0].scrollHeight > wrapper[0].clientHeight) {
                    scrollOffset = wrapper[0].scrollTop;
                }


                if (offsetLeft + activates.innerWidth() > $(window).width()) {
                    // Dropdown goes past screen on right, force right alignment
                    currAlignment = 'right';

                } else if (offsetLeft - activates.innerWidth() + origin.innerWidth() < 0) {
                    // Dropdown goes past screen on left, force left alignment
                    currAlignment = 'left';
                }
                // Vertical bottom offscreen detection
                if (offsetTop + activates.innerHeight() > windowHeight) {
                    // If going upwards still goes offscreen, just crop height of dropdown.
                    if (offsetTop + originHeight - activates.innerHeight() < 0) {
                        var adjustedHeight = windowHeight - offsetTop - verticalOffset;
                        activates.css('max-height', adjustedHeight);
                    } else {
                        // Flow upwards.
                        if (!verticalOffset) {
                            verticalOffset += originHeight;
                        }
                        verticalOffset -= activates.innerHeight();
                    }
                }

                // Handle edge alignment
                if (currAlignment === 'left') {
                    gutterSpacing = options.gutter;
                    leftPosition = origin.position().left + gutterSpacing;
                }
                else if (currAlignment === 'right') {
                    var offsetRight = origin.position().left + origin.outerWidth() - activates.outerWidth();
                    gutterSpacing = -options.gutter;
                    leftPosition =  offsetRight + gutterSpacing;
                }

                // Position dropdown
                activates.css({
                    position: 'absolute',
                    top: origin.position().top + verticalOffset + scrollOffset,
                    left: leftPosition
                });


                // Show dropdown
                activates.stop(true, true).css('opacity', 0)
                    .slideDown({
                        queue: false,
                        duration: options.inDuration,
                        easing: 'easeOutCubic',
                        complete: function() {
                            $(this).css('height', '');
                        }
                    })
                    .animate( {opacity: 1}, {queue: false, duration: options.inDuration, easing: 'easeOutSine'});
            }

            function hideDropdown() {
                // Check for simultaneous focus and click events.
                isFocused = false;
                activates.fadeOut(options.outDuration);
                activates.removeClass('active');
                origin.removeClass('active');
                setTimeout(function() { activates.css('max-height', ''); }, options.outDuration);
            }

            // Hover
            if (options.hover) {
                var open = false;
                origin.unbind('click.' + origin.attr('id'));
                // Hover handler to show dropdown
                origin.on('mouseenter', function(e){ // Mouse over
                    if (open === false) {
                        placeDropdown();
                        open = true;
                    }
                });
                origin.on('mouseleave', function(e){
                    // If hover on origin then to something other than dropdown content, then close
                    var toEl = e.toElement || e.relatedTarget; // added browser compatibility for target element
                    if(!$(toEl).closest('.dropdown-content').is(activates)) {
                        activates.stop(true, true);
                        hideDropdown();
                        open = false;
                    }
                });

                activates.on('mouseleave', function(e){ // Mouse out
                    var toEl = e.toElement || e.relatedTarget;
                    if(!$(toEl).closest('.dropdown-button').is(origin)) {
                        activates.stop(true, true);
                        hideDropdown();
                        open = false;
                    }
                });

                // Click
            } else {
                // Click handler to show dropdown
                origin.unbind('click.' + origin.attr('id'));
                origin.bind('click.'+origin.attr('id'), function(e){
                    if (!isFocused) {
                        if ( origin[0] == e.currentTarget &&
                            !origin.hasClass('active') &&
                            ($(e.target).closest('.dropdown-content').length === 0)) {
                            e.preventDefault(); // Prevents button click from moving window
                            placeDropdown('click');
                        }
                        // If origin is clicked and menu is open, close menu
                        else if (origin.hasClass('active')) {
                            hideDropdown();
                            $(document).unbind('click.'+ activates.attr('id') + ' touchstart.' + activates.attr('id'));
                        }
                        // If menu open, add click close handler to document
                        if (activates.hasClass('active')) {
                            $(document).bind('click.'+ activates.attr('id') + ' touchstart.' + activates.attr('id'), function (e) {
                                if (!activates.is(e.target) && !origin.is(e.target) && (!origin.find(e.target).length) ) {
                                    hideDropdown();
                                    $(document).unbind('click.'+ activates.attr('id') + ' touchstart.' + activates.attr('id'));
                                }
                            });
                        }
                    }
                });

            } // End else

            // Listen to open and close event - useful for select component
            origin.on('open', function(e, eventType) {
                placeDropdown(eventType);
            });
            origin.on('close', hideDropdown);


        });
    }; // End dropdown plugin

    $(document).ready(function(){
        $('.dropdown-button').dropdown();
    });
}( jQuery ));
;(function($) {
    var _stack = 0,
        _lastID = 0,
        _generateID = function() {
            _lastID++;
            return 'materialize-lean-overlay-' + _lastID;
        };

    $.fn.extend({
        openModal: function(options) {

            var $body = $('body');
            var oldWidth = $body.innerWidth();
            $body.css('overflow', 'hidden');
            $body.width(oldWidth);

            var defaults = {
                    opacity: 0.5,
                    in_duration: 350,
                    out_duration: 250,
                    ready: undefined,
                    complete: undefined,
                    dismissible: true,
                    starting_top: '4%'
                },
                $modal = $(this);

            if ($modal.hasClass('open')) {
                return;
            }
            overlayID = _generateID();
            $overlay = $('<div class="lean-overlay"></div>');
            lStack = (++_stack);

            // Store a reference of the overlay
            $overlay.attr('id', overlayID).css('z-index', 1000 + lStack * 2);
            $modal.data('overlay-id', overlayID).css('z-index', 1000 + lStack * 2 + 1);
            $modal.addClass('open');

            $("body").append($overlay);

            // Override defaults
            options = $.extend(defaults, options);

            if (options.dismissible) {
                $overlay.click(function() {
                    $modal.closeModal(options);
                });
                // Return on ESC
                $(document).on('keyup.leanModal' + overlayID, function(e) {
                    if (e.keyCode === 27) {   // ESC key
                        $modal.closeModal(options);
                    }
                });
            }

            $modal.find(".modal-close").on('click.close', function(e) {
                $modal.closeModal(options);
            });

            $overlay.css({ display : "block", opacity : 0 });

            $modal.css({
                display : "block",
                opacity: 0
            });

            $overlay.velocity({opacity: options.opacity}, {duration: options.in_duration, queue: false, ease: "easeOutCubic"});
            $modal.data('associated-overlay', $overlay[0]);

            // Define Bottom Sheet animation
            if ($modal.hasClass('bottom-sheet')) {
                $modal.velocity({bottom: "0", opacity: 1}, {
                    duration: options.in_duration,
                    queue: false,
                    ease: "easeOutCubic",
                    // Handle modal ready callback
                    complete: function() {
                        if (typeof(options.ready) === "function") {
                            options.ready();
                        }
                    }
                });
            }
            else {
                $.Velocity.hook($modal, "scaleX", 0.7);
                $modal.css({ top: options.starting_top });
                $modal.velocity({top: "10%", opacity: 1, scaleX: '1'}, {
                    duration: options.in_duration,
                    queue: false,
                    ease: "easeOutCubic",
                    // Handle modal ready callback
                    complete: function() {
                        if (typeof(options.ready) === "function") {
                            options.ready();
                        }
                    }
                });
            }


        }
    });

    $.fn.extend({
        closeModal: function(options) {
            var defaults = {
                    out_duration: 250,
                    complete: undefined
                },
                $modal = $(this),
                overlayID = $modal.data('overlay-id'),
                $overlay = $('#' + overlayID);
            $modal.removeClass('open');

            options = $.extend(defaults, options);

            // Enable scrolling
            $('body').css({
                overflow: '',
                width: ''
            });

            $modal.find('.modal-close').off('click.close');
            $(document).off('keyup.leanModal' + overlayID);

            $overlay.velocity( { opacity: 0}, {duration: options.out_duration, queue: false, ease: "easeOutQuart"});


            // Define Bottom Sheet animation
            if ($modal.hasClass('bottom-sheet')) {
                $modal.velocity({bottom: "-100%", opacity: 0}, {
                    duration: options.out_duration,
                    queue: false,
                    ease: "easeOutCubic",
                    // Handle modal ready callback
                    complete: function() {
                        $overlay.css({display:"none"});

                        // Call complete callback
                        if (typeof(options.complete) === "function") {
                            options.complete();
                        }
                        $overlay.remove();
                        _stack--;
                    }
                });
            }
            else {
                $modal.velocity(
                    { top: options.starting_top, opacity: 0, scaleX: 0.7}, {
                        duration: options.out_duration,
                        complete:
                            function() {

                                $(this).css('display', 'none');
                                // Call complete callback
                                if (typeof(options.complete) === "function") {
                                    options.complete();
                                }
                                $overlay.remove();
                                _stack--;
                            }
                    }
                );
            }
        }
    });

    $.fn.extend({
        leanModal: function(option) {
            return this.each(function() {

                var defaults = {
                        starting_top: '4%'
                    },
                // Override defaults
                    options = $.extend(defaults, option);

                // Close Handlers
                $(this).click(function(e) {
                    options.starting_top = ($(this).offset().top - $(window).scrollTop()) /1.15;
                    var modal_id = $(this).attr("href") || '#' + $(this).data('target');
                    $(modal_id).openModal(options);
                    e.preventDefault();
                }); // done set on click
            }); // done return
        }
    });
})(jQuery);
;(function ($) {

    $.fn.materialbox = function () {

        return this.each(function() {

            if ($(this).hasClass('initialized')) {
                return;
            }

            $(this).addClass('initialized');

            var overlayActive = false;
            var doneAnimating = true;
            var inDuration = 275;
            var outDuration = 200;
            var origin = $(this);
            var placeholder = $('<div></div>').addClass('material-placeholder');
            var originalWidth = 0;
            var originalHeight = 0;
            var ancestorsChanged;
            var ancestor;
            origin.wrap(placeholder);


            origin.on('click', function(){
                var placeholder = origin.parent('.material-placeholder');
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var originalWidth = origin.width();
                var originalHeight = origin.height();


                // If already modal, return to original
                if (doneAnimating === false) {
                    returnToOriginal();
                    return false;
                }
                else if (overlayActive && doneAnimating===true) {
                    returnToOriginal();
                    return false;
                }


                // Set states
                doneAnimating = false;
                origin.addClass('active');
                overlayActive = true;

                // Set positioning for placeholder
                placeholder.css({
                    width: placeholder[0].getBoundingClientRect().width,
                    height: placeholder[0].getBoundingClientRect().height,
                    position: 'relative',
                    top: 0,
                    left: 0
                });

                // Find ancestor with overflow: hidden; and remove it
                ancestorsChanged = undefined;
                ancestor = placeholder[0].parentNode;
                var count = 0;
                while (ancestor !== null && !$(ancestor).is(document)) {
                    var curr = $(ancestor);
                    if (curr.css('overflow') !== 'visible') {
                        curr.css('overflow', 'visible');
                        if (ancestorsChanged === undefined) {
                            ancestorsChanged = curr;
                        }
                        else {
                            ancestorsChanged = ancestorsChanged.add(curr);
                        }
                    }
                    ancestor = ancestor.parentNode;
                }

                // Set css on origin
                origin.css({position: 'absolute', 'z-index': 1000})
                    .data('width', originalWidth)
                    .data('height', originalHeight);

                // Add overlay
                var overlay = $('<div id="materialbox-overlay"></div>')
                    .css({
                        opacity: 0
                    })
                    .click(function(){
                        if (doneAnimating === true)
                            returnToOriginal();
                    });
                // Animate Overlay
                // Put before in origin image to preserve z-index layering.
                origin.before(overlay);
                overlay.velocity({opacity: 1},
                    {duration: inDuration, queue: false, easing: 'easeOutQuad'} );

                // Add and animate caption if it exists
                if (origin.data('caption') !== "") {
                    var $photo_caption = $('<div class="materialbox-caption"></div>');
                    $photo_caption.text(origin.data('caption'));
                    $('body').append($photo_caption);
                    $photo_caption.css({ "display": "inline" });
                    $photo_caption.velocity({opacity: 1}, {duration: inDuration, queue: false, easing: 'easeOutQuad'});
                }

                // Resize Image
                var ratio = 0;
                var widthPercent = originalWidth / windowWidth;
                var heightPercent = originalHeight / windowHeight;
                var newWidth = 0;
                var newHeight = 0;

                if (widthPercent > heightPercent) {
                    ratio = originalHeight / originalWidth;
                    newWidth = windowWidth * 0.9;
                    newHeight = windowWidth * 0.9 * ratio;
                }
                else {
                    ratio = originalWidth / originalHeight;
                    newWidth = (windowHeight * 0.9) * ratio;
                    newHeight = windowHeight * 0.9;
                }

                // Animate image + set z-index
                if(origin.hasClass('responsive-img')) {
                    origin.velocity({'max-width': newWidth, 'width': originalWidth}, {duration: 0, queue: false,
                        complete: function(){
                            origin.css({left: 0, top: 0})
                                .velocity(
                                    {
                                        height: newHeight,
                                        width: newWidth,
                                        left: $(document).scrollLeft() + windowWidth/2 - origin.parent('.material-placeholder').offset().left - newWidth/2,
                                        top: $(document).scrollTop() + windowHeight/2 - origin.parent('.material-placeholder').offset().top - newHeight/ 2
                                    },
                                    {
                                        duration: inDuration,
                                        queue: false,
                                        easing: 'easeOutQuad',
                                        complete: function(){doneAnimating = true;}
                                    }
                                );
                        } // End Complete
                    }); // End Velocity
                }
                else {
                    origin.css('left', 0)
                        .css('top', 0)
                        .velocity(
                            {
                                height: newHeight,
                                width: newWidth,
                                left: $(document).scrollLeft() + windowWidth/2 - origin.parent('.material-placeholder').offset().left - newWidth/2,
                                top: $(document).scrollTop() + windowHeight/2 - origin.parent('.material-placeholder').offset().top - newHeight/ 2
                            },
                            {
                                duration: inDuration,
                                queue: false,
                                easing: 'easeOutQuad',
                                complete: function(){doneAnimating = true;}
                            }
                        ); // End Velocity
                }

            }); // End origin on click


            // Return on scroll
            $(window).scroll(function() {
                if (overlayActive) {
                    returnToOriginal();
                }
            });

            // Return on ESC
            $(document).keyup(function(e) {

                if (e.keyCode === 27 && doneAnimating === true) {   // ESC key
                    if (overlayActive) {
                        returnToOriginal();
                    }
                }
            });


            // This function returns the modaled image to the original spot
            function returnToOriginal() {

                doneAnimating = false;

                var placeholder = origin.parent('.material-placeholder');
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var originalWidth = origin.data('width');
                var originalHeight = origin.data('height');

                origin.velocity("stop", true);
                $('#materialbox-overlay').velocity("stop", true);
                $('.materialbox-caption').velocity("stop", true);


                $('#materialbox-overlay').velocity({opacity: 0}, {
                    duration: outDuration, // Delay prevents animation overlapping
                    queue: false, easing: 'easeOutQuad',
                    complete: function(){
                        // Remove Overlay
                        overlayActive = false;
                        $(this).remove();
                    }
                });

                // Resize Image
                origin.velocity(
                    {
                        width: originalWidth,
                        height: originalHeight,
                        left: 0,
                        top: 0
                    },
                    {
                        duration: outDuration,
                        queue: false, easing: 'easeOutQuad'
                    }
                );

                // Remove Caption + reset css settings on image
                $('.materialbox-caption').velocity({opacity: 0}, {
                    duration: outDuration, // Delay prevents animation overlapping
                    queue: false, easing: 'easeOutQuad',
                    complete: function(){
                        placeholder.css({
                            height: '',
                            width: '',
                            position: '',
                            top: '',
                            left: ''
                        });

                        origin.css({
                            height: '',
                            top: '',
                            left: '',
                            width: '',
                            'max-width': '',
                            position: '',
                            'z-index': ''
                        });

                        // Remove class
                        origin.removeClass('active');
                        doneAnimating = true;
                        $(this).remove();

                        // Remove overflow overrides on ancestors
                        if (ancestorsChanged) {
                            ancestorsChanged.css('overflow', '');
                        }
                    }
                });

            }
        });
    };

    $(document).ready(function(){
        $('.materialboxed').materialbox();
    });

}( jQuery ));
;(function ($) {

    $.fn.parallax = function () {
        var window_width = $(window).width();
        // Parallax Scripts
        return this.each(function(i) {
            var $this = $(this);
            $this.addClass('parallax');

            function updateParallax(initial) {
                var container_height;
                if (window_width < 601) {
                    container_height = ($this.height() > 0) ? $this.height() : $this.children("img").height();
                }
                else {
                    container_height = ($this.height() > 0) ? $this.height() : 500;
                }
                var $img = $this.children("img").first();
                var img_height = $img.height();
                var parallax_dist = img_height - container_height;
                var bottom = $this.offset().top + container_height;
                var top = $this.offset().top;
                var scrollTop = $(window).scrollTop();
                var windowHeight = window.innerHeight;
                var windowBottom = scrollTop + windowHeight;
                var percentScrolled = (windowBottom - top) / (container_height + windowHeight);
                var parallax = Math.round((parallax_dist * percentScrolled));

                if (initial) {
                    $img.css('display', 'block');
                }
                if ((bottom > scrollTop) && (top < (scrollTop + windowHeight))) {
                    $img.css('transform', "translate3D(-50%," + parallax + "px, 0)");
                }

            }

            // Wait for image load
            $this.children("img").one("load", function() {
                updateParallax(true);
            }).each(function() {
                if(this.complete) $(this).load();
            });

            $(window).scroll(function() {
                window_width = $(window).width();
                updateParallax(false);
            });

            $(window).resize(function() {
                window_width = $(window).width();
                updateParallax(false);
            });

        });

    };
}( jQuery ));;(function ($) {

    var methods = {
        init : function() {
            return this.each(function() {

                // For each set of tabs, we want to keep track of
                // which tab is active and its associated content
                var $this = $(this),
                    window_width = $(window).width();

                $this.width('100%');
                var $active, $content, $links = $this.find('li.tab a'),
                    $tabs_width = $this.width(),
                    $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length,
                    $index = 0;

                // If the location.hash matches one of the links, use that as the active tab.
                $active = $($links.filter('[href="'+location.hash+'"]'));

                // If no match is found, use the first link or any with class 'active' as the initial active tab.
                if ($active.length === 0) {
                    $active = $(this).find('li.tab a.active').first();
                }
                if ($active.length === 0) {
                    $active = $(this).find('li.tab a').first();
                }

                $active.addClass('active');
                $index = $links.index($active);
                if ($index < 0) {
                    $index = 0;
                }

                if ($active[0] !== undefined) {
                    $content = $($active[0].hash);
                }

                // append indicator then set indicator width to tab width
                $this.append('<div class="indicator"></div>');
                var $indicator = $this.find('.indicator');
                if ($this.is(":visible")) {
                    $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
                    $indicator.css({"left": $index * $tab_width});
                }
                $(window).resize(function () {
                    $tabs_width = $this.width();
                    $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;
                    if ($index < 0) {
                        $index = 0;
                    }
                    if ($tab_width !== 0 && $tabs_width !== 0) {
                        $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
                        $indicator.css({"left": $index * $tab_width});
                    }
                });

                // Hide the remaining content
                $links.not($active).each(function () {
                    $(this.hash).hide();
                });


                // Bind the click event handler
                $this.on('click', 'a', function(e) {
                    if ($(this).parent().hasClass('disabled')) {
                        e.preventDefault();
                        return;
                    }

                    $tabs_width = $this.width();
                    $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;

                    // Make the old tab inactive.
                    $active.removeClass('active');
                    if ($content !== undefined) {
                        $content.hide();
                    }

                    // Update the variables with the new link and content
                    $active = $(this);
                    $content = $(this.hash);
                    $links = $this.find('li.tab a');

                    // Make the tab active.
                    $active.addClass('active');
                    var $prev_index = $index;
                    $index = $links.index($(this));
                    if ($index < 0) {
                        $index = 0;
                    }
                    // Change url to current tab
                    // window.location.hash = $active.attr('href');

                    if ($content !== undefined) {
                        $content.show();
                    }

                    // Update indicator
                    if (($index - $prev_index) >= 0) {
                        $indicator.velocity({"right": $tabs_width - (($index + 1) * $tab_width)}, { duration: 300, queue: false, easing: 'easeOutQuad'});
                        $indicator.velocity({"left": $index * $tab_width}, {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90});

                    }
                    else {
                        $indicator.velocity({"left": $index * $tab_width}, { duration: 300, queue: false, easing: 'easeOutQuad'});
                        $indicator.velocity({"right": $tabs_width - (($index + 1) * $tab_width)}, {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90});
                    }

                    // Prevent the anchor's default click action
                    e.preventDefault();
                });
            });

        },
        select_tab : function( id ) {
            this.find('a[href="#' + id + '"]').trigger('click');
        }
    };

    $.fn.tabs = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }
    };

    $(document).ready(function(){
        $('ul.tabs').tabs();
    });
}( jQuery ));
;(function ($) {
    $.fn.tooltip = function (options) {
        var timeout = null,
            margin = 5;

        // Defaults
        var defaults = {
            delay: 350
        };

        // Remove tooltip from the activator
        if (options === "remove") {
            this.each(function(){
                $('#' + $(this).attr('data-tooltip-id')).remove();
                $(this).off('mouseenter.tooltip mouseleave.tooltip');
            });
            return false;
        }

        options = $.extend(defaults, options);


        return this.each(function(){
            var tooltipId = Materialize.guid();
            var origin = $(this);
            origin.attr('data-tooltip-id', tooltipId);

            // Create Text span
            var tooltip_text = $('<span></span>').text(origin.attr('data-tooltip'));

            // Create tooltip
            var newTooltip = $('<div></div>');
            newTooltip.addClass('material-tooltip').append(tooltip_text)
                .appendTo($('body'))
                .attr('id', tooltipId);

            var backdrop = $('<div></div>').addClass('backdrop');
            backdrop.appendTo(newTooltip);
            backdrop.css({ top: 0, left:0 });


            //Destroy previously binded events
            origin.off('mouseenter.tooltip mouseleave.tooltip');
            // Mouse In
            var started = false, timeoutRef;
            origin.on({
                'mouseenter.tooltip': function(e) {
                    var tooltip_delay = origin.attr('data-delay');
                    tooltip_delay = (tooltip_delay === undefined || tooltip_delay === '') ?
                        options.delay : tooltip_delay;
                    timeoutRef = setTimeout(function(){
                        started = true;
                        newTooltip.velocity('stop');
                        backdrop.velocity('stop');
                        newTooltip.css({ display: 'block', left: '0px', top: '0px' });

                        // Set Tooltip text
                        newTooltip.children('span').text(origin.attr('data-tooltip'));

                        // Tooltip positioning
                        var originWidth = origin.outerWidth();
                        var originHeight = origin.outerHeight();
                        var tooltipPosition =  origin.attr('data-position');
                        var tooltipHeight = newTooltip.outerHeight();
                        var tooltipWidth = newTooltip.outerWidth();
                        var tooltipVerticalMovement = '0px';
                        var tooltipHorizontalMovement = '0px';
                        var scale_factor = 8;
                        var targetTop, targetLeft, newCoordinates;

                        if (tooltipPosition === "top") {
                            // Top Position
                            targetTop = origin.offset().top - tooltipHeight - margin;
                            targetLeft = origin.offset().left + originWidth/2 - tooltipWidth/2;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);

                            tooltipVerticalMovement = '-10px';
                            backdrop.css({
                                borderRadius: '14px 14px 0 0',
                                transformOrigin: '50% 90%',
                                marginTop: tooltipHeight,
                                marginLeft: (tooltipWidth/2) - (backdrop.width()/2)
                            });
                        }
                        // Left Position
                        else if (tooltipPosition === "left") {
                            targetTop = origin.offset().top + originHeight/2 - tooltipHeight/2;
                            targetLeft =  origin.offset().left - tooltipWidth - margin;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);

                            tooltipHorizontalMovement = '-10px';
                            backdrop.css({
                                width: '14px',
                                height: '14px',
                                borderRadius: '14px 0 0 14px',
                                transformOrigin: '95% 50%',
                                marginTop: tooltipHeight/2,
                                marginLeft: tooltipWidth
                            });
                        }
                        // Right Position
                        else if (tooltipPosition === "right") {
                            targetTop = origin.offset().top + originHeight/2 - tooltipHeight/2;
                            targetLeft = origin.offset().left + originWidth + margin;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);

                            tooltipHorizontalMovement = '+10px';
                            backdrop.css({
                                width: '14px',
                                height: '14px',
                                borderRadius: '0 14px 14px 0',
                                transformOrigin: '5% 50%',
                                marginTop: tooltipHeight/2,
                                marginLeft: '0px'
                            });
                        }
                        else {
                            // Bottom Position
                            targetTop = origin.offset().top + origin.outerHeight() + margin;
                            targetLeft = origin.offset().left + originWidth/2 - tooltipWidth/2;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);
                            tooltipVerticalMovement = '+10px';
                            backdrop.css({
                                marginLeft: (tooltipWidth/2) - (backdrop.width()/2)
                            });
                        }

                        // Set tooptip css placement
                        newTooltip.css({
                            top: newCoordinates.y,
                            left: newCoordinates.x
                        });

                        // Calculate Scale to fill
                        scale_factor = tooltipWidth / 8;
                        if (scale_factor < 8) {
                            scale_factor = 8;
                        }
                        if (tooltipPosition === "right" || tooltipPosition === "left") {
                            scale_factor = tooltipWidth / 10;
                            if (scale_factor < 6)
                                scale_factor = 6;
                        }

                        newTooltip.velocity({ marginTop: tooltipVerticalMovement, marginLeft: tooltipHorizontalMovement}, { duration: 350, queue: false })
                            .velocity({opacity: 1}, {duration: 300, delay: 50, queue: false});
                        backdrop.css({ display: 'block' })
                            .velocity({opacity:1},{duration: 55, delay: 0, queue: false})
                            .velocity({scale: scale_factor}, {duration: 300, delay: 0, queue: false, easing: 'easeInOutQuad'});


                    }, tooltip_delay); // End Interval

                    // Mouse Out
                },
                'mouseleave.tooltip': function(){
                    // Reset State
                    started = false;
                    clearTimeout(timeoutRef);

                    // Animate back
                    setTimeout(function() {
                        if (started != true) {
                            newTooltip.velocity({
                                opacity: 0, marginTop: 0, marginLeft: 0}, { duration: 225, queue: false});
                            backdrop.velocity({opacity: 0, scale: 1}, {
                                duration:225,
                                queue: false,
                                complete: function(){
                                    backdrop.css('display', 'none');
                                    newTooltip.css('display', 'none');
                                    started = false;}
                            });
                        }
                    },225);
                }
            });
        });
    };

    var repositionWithinScreen = function(x, y, width, height) {
        var newX = x
        var newY = y;

        if (newX < 0) {
            newX = 4;
        } else if (newX + width > window.innerWidth) {
            newX -= newX + width - window.innerWidth;
        }

        if (newY < 0) {
            newY = 4;
        } else if (newY + height > window.innerHeight + $(window).scrollTop) {
            newY -= newY + height - window.innerHeight;
        }

        return {x: newX, y: newY};
    };

    $(document).ready(function(){
        $('.tooltipped').tooltip();
    });
}( jQuery ));
;/*!
 * Waves v0.6.4
 * http://fian.my.id/Waves
 *
 * Copyright 2014 Alfiana E. Sibuea and other contributors
 * Released under the MIT license
 * https://github.com/fians/Waves/blob/master/LICENSE
 */

;(function(window) {
    'use strict';

    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);

    // Find exact position of element
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function offset(elem) {
        var docElem, win,
            box = {top: 0, left: 0},
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    function convertStyle(obj) {
        var style = '';

        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += (a + ':' + obj[a] + ';');
            }
        }

        return style;
    }

    var Effect = {

        // Effect delay
        duration: 750,

        show: function(e, element) {

            // Disable right click
            if (e.button === 2) {
                return false;
            }

            var el = element || this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple';
            el.appendChild(ripple);

            // Get click coordinate and element witdh
            var pos         = offset(el);
            var relativeY   = (e.pageY - pos.top);
            var relativeX   = (e.pageX - pos.left);
            var scale       = 'scale('+((el.clientWidth / 100) * 10)+')';

            // Support for touch devices
            if ('touches' in e) {
                relativeY   = (e.touches[0].pageY - pos.top);
                relativeX   = (e.touches[0].pageX - pos.left);
            }

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);

            // Set ripple position
            var rippleStyle = {
                'top': relativeY+'px',
                'left': relativeX+'px'
            };

            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');

            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale;
            rippleStyle['-moz-transform'] = scale;
            rippleStyle['-ms-transform'] = scale;
            rippleStyle['-o-transform'] = scale;
            rippleStyle.transform = scale;
            rippleStyle.opacity   = '1';

            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-moz-transition-duration']    = Effect.duration + 'ms';
            rippleStyle['-o-transition-duration']      = Effect.duration + 'ms';
            rippleStyle['transition-duration']         = Effect.duration + 'ms';

            rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['-moz-transition-timing-function']    = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['-o-transition-timing-function']      = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['transition-timing-function']         = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

            ripple.setAttribute('style', convertStyle(rippleStyle));
        },

        hide: function(e) {
            TouchHandler.touchup(e);

            var el = this;
            var width = el.clientWidth * 1.4;

            // Get first ripple
            var ripple = null;
            var ripples = el.getElementsByClassName('waves-ripple');
            if (ripples.length > 0) {
                ripple = ripples[ripples.length - 1];
            } else {
                return false;
            }

            var relativeX   = ripple.getAttribute('data-x');
            var relativeY   = ripple.getAttribute('data-y');
            var scale       = ripple.getAttribute('data-scale');

            // Get delay beetween mousedown and mouse leave
            var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
            var delay = 350 - diff;

            if (delay < 0) {
                delay = 0;
            }

            // Fade out ripple after delay
            setTimeout(function() {
                var style = {
                    'top': relativeY+'px',
                    'left': relativeX+'px',
                    'opacity': '0',

                    // Duration
                    '-webkit-transition-duration': Effect.duration + 'ms',
                    '-moz-transition-duration': Effect.duration + 'ms',
                    '-o-transition-duration': Effect.duration + 'ms',
                    'transition-duration': Effect.duration + 'ms',
                    '-webkit-transform': scale,
                    '-moz-transform': scale,
                    '-ms-transform': scale,
                    '-o-transform': scale,
                    'transform': scale,
                };

                ripple.setAttribute('style', convertStyle(style));

                setTimeout(function() {
                    try {
                        el.removeChild(ripple);
                    } catch(e) {
                        return false;
                    }
                }, Effect.duration);
            }, delay);
        },

        // Little hack to make <input> can perform waves effect
        wrapInput: function(elements) {
            for (var a = 0; a < elements.length; a++) {
                var el = elements[a];

                if (el.tagName.toLowerCase() === 'input') {
                    var parent = el.parentNode;

                    // If input already have parent just pass through
                    if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
                        continue;
                    }

                    // Put element class and style to the specified parent
                    var wrapper = document.createElement('i');
                    wrapper.className = el.className + ' waves-input-wrapper';

                    var elementStyle = el.getAttribute('style');

                    if (!elementStyle) {
                        elementStyle = '';
                    }

                    wrapper.setAttribute('style', elementStyle);

                    el.className = 'waves-button-input';
                    el.removeAttribute('style');

                    // Put element as child
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        }
    };


    /**
     * Disable mousedown event for 500ms during and after touch
     */
    var TouchHandler = {
        /* uses an integer rather than bool so there's no issues with
         * needing to clear timeouts if another touch event occurred
         * within the 500ms. Cannot mouseup between touchstart and
         * touchend, nor in the 500ms after touchend. */
        touches: 0,
        allowEvent: function(e) {
            var allow = true;

            if (e.type === 'touchstart') {
                TouchHandler.touches += 1; //push
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                setTimeout(function() {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1; //pop after 500ms
                    }
                }, 500);
            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                allow = false;
            }

            return allow;
        },
        touchup: function(e) {
            TouchHandler.allowEvent(e);
        }
    };


    /**
     * Delegated click handler for .waves-effect element.
     * returns null when .waves-effect element not in "click tree"
     */
    function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }

        var element = null;
        var target = e.target || e.srcElement;

        while (target.parentElement !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
                element = target;
                break;
            } else if (target.classList.contains('waves-effect')) {
                element = target;
                break;
            }
            target = target.parentElement;
        }

        return element;
    }

    /**
     * Bubble the click and show effect if .waves-effect elem was found
     */
    function showEffect(e) {
        var element = getWavesEffectElement(e);

        if (element !== null) {
            Effect.show(e, element);

            if ('ontouchstart' in window) {
                element.addEventListener('touchend', Effect.hide, false);
                element.addEventListener('touchcancel', Effect.hide, false);
            }

            element.addEventListener('mouseup', Effect.hide, false);
            element.addEventListener('mouseleave', Effect.hide, false);
        }
    }

    Waves.displayEffect = function(options) {
        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }

        //Wrap input inside <i> tag
        Effect.wrapInput($$('.waves-effect'));

        if ('ontouchstart' in window) {
            document.body.addEventListener('touchstart', showEffect, false);
        }

        document.body.addEventListener('mousedown', showEffect, false);
    };

    /**
     * Attach Waves to an input element (or any element which doesn't
     * bubble mouseup/mousedown events).
     *   Intended to be used with dynamically loaded forms/inputs, or
     * where the user doesn't want a delegated click handler.
     */
    Waves.attach = function(element) {
        //FUTURE: automatically add waves classes and allow users
        // to specify them with an options param? Eg. light/classic/button
        if (element.tagName.toLowerCase() === 'input') {
            Effect.wrapInput([element]);
            element = element.parentElement;
        }

        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', showEffect, false);
        }

        element.addEventListener('mousedown', showEffect, false);
    };

    window.Waves = Waves;

    document.addEventListener('DOMContentLoaded', function() {
        Waves.displayEffect();
    }, false);

})(window);
;Materialize.toast = function (message, displayLength, className, completeCallback) {
    className = className || "";

    var container = document.getElementById('toast-container');

    // Create toast container if it does not exist
    if (container === null) {
        // create notification container
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Select and append toast
    var newToast = createToast(message);

    // only append toast if message is not undefined
    if(message){
        container.appendChild(newToast);
    }

    newToast.style.top = '35px';
    newToast.style.opacity = 0;

    // Animate toast in
    Vel(newToast, { "top" : "0px", opacity: 1 }, {duration: 300,
        easing: 'easeOutCubic',
        queue: false});

    // Allows timer to be pause while being panned
    var timeLeft = displayLength;
    var counterInterval = setInterval (function(){


        if (newToast.parentNode === null)
            window.clearInterval(counterInterval);

        // If toast is not being dragged, decrease its time remaining
        if (!newToast.classList.contains('panning')) {
            timeLeft -= 20;
        }

        if (timeLeft <= 0) {
            // Animate toast out
            Vel(newToast, {"opacity": 0, marginTop: '-40px'}, { duration: 375,
                easing: 'easeOutExpo',
                queue: false,
                complete: function(){
                    // Call the optional callback
                    if(typeof(completeCallback) === "function")
                        completeCallback();
                    // Remove toast after it times out
                    this[0].parentNode.removeChild(this[0]);
                }
            });
            window.clearInterval(counterInterval);
        }
    }, 20);



    function createToast(html) {

        // Create toast
        var toast = document.createElement('div');
        toast.classList.add('toast');
        if (className) {
            var classes = className.split(' ');

            for (var i = 0, count = classes.length; i < count; i++) {
                toast.classList.add(classes[i]);
            }
        }
        // If type of parameter is HTML Element
        if ( typeof HTMLElement === "object" ? html instanceof HTMLElement : html && typeof html === "object" && html !== null && html.nodeType === 1 && typeof html.nodeName==="string"
        ) {
            toast.appendChild(html);
        }
        else if (html instanceof jQuery) {
            // Check if it is jQuery object
            toast.appendChild(html[0]);
        }
        else {
            // Insert as text;
            toast.innerHTML = html;
        }
        // Bind hammer
        var hammerHandler = new Hammer(toast, {prevent_default: false});
        hammerHandler.on('pan', function(e) {
            var deltaX = e.deltaX;
            var activationDistance = 80;

            // Change toast state
            if (!toast.classList.contains('panning')){
                toast.classList.add('panning');
            }

            var opacityPercent = 1-Math.abs(deltaX / activationDistance);
            if (opacityPercent < 0)
                opacityPercent = 0;

            Vel(toast, {left: deltaX, opacity: opacityPercent }, {duration: 50, queue: false, easing: 'easeOutQuad'});

        });

        hammerHandler.on('panend', function(e) {
            var deltaX = e.deltaX;
            var activationDistance = 80;

            // If toast dragged past activation point
            if (Math.abs(deltaX) > activationDistance) {
                Vel(toast, {marginTop: '-40px'}, { duration: 375,
                    easing: 'easeOutExpo',
                    queue: false,
                    complete: function(){
                        if(typeof(completeCallback) === "function") {
                            completeCallback();
                        }
                        toast.parentNode.removeChild(toast);
                    }
                });

            } else {
                toast.classList.remove('panning');
                // Put toast back into original position
                Vel(toast, { left: 0, opacity: 1 }, { duration: 300,
                    easing: 'easeOutExpo',
                    queue: false
                });

            }
        });

        return toast;
    }
};
;(function ($) {

    var methods = {
        init : function(options) {
            var defaults = {
                menuWidth: 240,
                edge: 'left',
                closeOnClick: false
            };
            options = $.extend(defaults, options);

            $(this).each(function(){
                var $this = $(this);
                var menu_id = $("#"+ $this.attr('data-activates'));

                // Set to width
                if (options.menuWidth != 240) {
                    menu_id.css('width', options.menuWidth);
                }

                // Add Touch Area
                var dragTarget = $('<div class="drag-target"></div>');
                $('body').append(dragTarget);

                if (options.edge == 'left') {
                    menu_id.css('transform', 'translateX(-100%)');
                    dragTarget.css({'left': 0}); // Add Touch Area
                }
                else {
                    menu_id.addClass('right-aligned') // Change text-alignment to right
                        .css('transform', 'translateX(100%)');
                    dragTarget.css({'right': 0}); // Add Touch Area
                }

                // If fixed sidenav, bring menu out
                if (menu_id.hasClass('fixed')) {
                    if (window.innerWidth > 992) {
                        menu_id.css('transform', 'translateX(0)');
                    }
                }

                // Window resize to reset on large screens fixed
                if (menu_id.hasClass('fixed')) {
                    $(window).resize( function() {
                        if (window.innerWidth > 992) {
                            // Close menu if window is resized bigger than 992 and user has fixed sidenav
                            if ($('#sidenav-overlay').length != 0 && menuOut) {
                                removeMenu(true);
                            }
                            else {
                                // menu_id.removeAttr('style');
                                menu_id.css('transform', 'translateX(0%)');
                                // menu_id.css('width', options.menuWidth);
                            }
                        }
                        else if (menuOut === false){
                            if (options.edge === 'left') {
                                menu_id.css('transform', 'translateX(-100%)');
                            } else {
                                menu_id.css('transform', 'translateX(100%)');
                            }

                        }

                    });
                }

                // if closeOnClick, then add close event for all a tags in side sideNav
                if (options.closeOnClick === true) {
                    menu_id.on("click.itemclick", "a:not(.collapsible-header)", function(){
                        removeMenu();
                    });
                }

                function removeMenu(restoreNav) {
                    panning = false;
                    menuOut = false;
                    // Reenable scrolling
                    $('body').css({
                        overflow: '',
                        width: ''
                    });

                    $('#sidenav-overlay').velocity({opacity: 0}, {duration: 200,
                        queue: false, easing: 'easeOutQuad',
                        complete: function() {
                            $(this).remove();
                        } });
                    if (options.edge === 'left') {
                        // Reset phantom div
                        dragTarget.css({width: '', right: '', left: '0'});
                        menu_id.velocity(
                            {'translateX': '-100%'},
                            { duration: 200,
                                queue: false,
                                easing: 'easeOutCubic',
                                complete: function() {
                                    if (restoreNav === true) {
                                        // Restore Fixed sidenav
                                        menu_id.removeAttr('style');
                                        menu_id.css('width', options.menuWidth);
                                    }
                                }

                            });
                    }
                    else {
                        // Reset phantom div
                        dragTarget.css({width: '', right: '0', left: ''});
                        menu_id.velocity(
                            {'translateX': '100%'},
                            { duration: 200,
                                queue: false,
                                easing: 'easeOutCubic',
                                complete: function() {
                                    if (restoreNav === true) {
                                        // Restore Fixed sidenav
                                        menu_id.removeAttr('style');
                                        menu_id.css('width', options.menuWidth);
                                    }
                                }
                            });
                    }
                }



                // Touch Event
                var panning = false;
                var menuOut = false;

                dragTarget.on('click', function(){
                    removeMenu();
                });

                dragTarget.hammer({
                    prevent_default: false
                }).bind('pan', function(e) {

                    if (e.gesture.pointerType == "touch") {

                        var direction = e.gesture.direction;
                        var x = e.gesture.center.x;
                        var y = e.gesture.center.y;
                        var velocityX = e.gesture.velocityX;

                        // Disable Scrolling
                        var $body = $('body');
                        var oldWidth = $body.innerWidth();
                        $body.css('overflow', 'hidden');
                        $body.width(oldWidth);

                        // If overlay does not exist, create one and if it is clicked, close menu
                        if ($('#sidenav-overlay').length === 0) {
                            var overlay = $('<div id="sidenav-overlay"></div>');
                            overlay.css('opacity', 0).click( function(){
                                removeMenu();
                            });
                            $('body').append(overlay);
                        }

                        // Keep within boundaries
                        if (options.edge === 'left') {
                            if (x > options.menuWidth) { x = options.menuWidth; }
                            else if (x < 0) { x = 0; }
                        }

                        if (options.edge === 'left') {
                            // Left Direction
                            if (x < (options.menuWidth / 2)) { menuOut = false; }
                            // Right Direction
                            else if (x >= (options.menuWidth / 2)) { menuOut = true; }
                            menu_id.css('transform', 'translateX(' + (x - options.menuWidth) + 'px)');
                        }
                        else {
                            // Left Direction
                            if (x < (window.innerWidth - options.menuWidth / 2)) {
                                menuOut = true;
                            }
                            // Right Direction
                            else if (x >= (window.innerWidth - options.menuWidth / 2)) {
                                menuOut = false;
                            }
                            var rightPos = (x - options.menuWidth / 2);
                            if (rightPos < 0) {
                                rightPos = 0;
                            }

                            menu_id.css('transform', 'translateX(' + rightPos + 'px)');
                        }


                        // Percentage overlay
                        var overlayPerc;
                        if (options.edge === 'left') {
                            overlayPerc = x / options.menuWidth;
                            $('#sidenav-overlay').velocity({opacity: overlayPerc }, {duration: 10, queue: false, easing: 'easeOutQuad'});
                        }
                        else {
                            overlayPerc = Math.abs((x - window.innerWidth) / options.menuWidth);
                            $('#sidenav-overlay').velocity({opacity: overlayPerc }, {duration: 10, queue: false, easing: 'easeOutQuad'});
                        }
                    }

                }).bind('panend', function(e) {

                    if (e.gesture.pointerType == "touch") {
                        var velocityX = e.gesture.velocityX;
                        var x = e.gesture.center.x;
                        var leftPos = x - options.menuWidth;
                        var rightPos = x - options.menuWidth / 2;
                        if (leftPos > 0 ) {
                            leftPos = 0;
                        }
                        if (rightPos < 0) {
                            rightPos = 0;
                        }
                        panning = false;

                        if (options.edge === 'left') {
                            // If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
                            if ((menuOut && velocityX <= 0.3) || velocityX < -0.5) {
                                if (leftPos != 0) {
                                    menu_id.velocity({'translateX': [0, leftPos]}, {duration: 300, queue: false, easing: 'easeOutQuad'});
                                }

                                // menu_id.css({'translateX': 0});
                                $('#sidenav-overlay').velocity({opacity: 1 }, {duration: 50, queue: false, easing: 'easeOutQuad'});
                                dragTarget.css({width: '50%', right: 0, left: ''});
                            }
                            else if (!menuOut || velocityX > 0.3) {
                                // Enable Scrolling
                                $('body').css({
                                    overflow: '',
                                    width: ''
                                });
                                // Slide menu closed
                                menu_id.velocity({'translateX': [-1 * options.menuWidth - 10, leftPos]}, {duration: 200, queue: false, easing: 'easeOutQuad'});
                                $('#sidenav-overlay').velocity({opacity: 0 }, {duration: 200, queue: false, easing: 'easeOutQuad',
                                    complete: function () {
                                        $(this).remove();
                                    }});
                                dragTarget.css({width: '10px', right: '', left: 0});
                            }
                        }
                        else {
                            if ((menuOut && velocityX >= -0.3) || velocityX > 0.5) {
                                menu_id.velocity({'translateX': [0, rightPos]}, {duration: 300, queue: false, easing: 'easeOutQuad'});
                                $('#sidenav-overlay').velocity({opacity: 1 }, {duration: 50, queue: false, easing: 'easeOutQuad'});
                                dragTarget.css({width: '50%', right: '', left: 0});
                            }
                            else if (!menuOut || velocityX < -0.3) {
                                // Enable Scrolling
                                $('body').css({
                                    overflow: '',
                                    width: ''
                                });

                                // Slide menu closed
                                menu_id.velocity({'translateX': [options.menuWidth + 10, rightPos]}, {duration: 200, queue: false, easing: 'easeOutQuad'});
                                $('#sidenav-overlay').velocity({opacity: 0 }, {duration: 200, queue: false, easing: 'easeOutQuad',
                                    complete: function () {
                                        $(this).remove();
                                    }});
                                dragTarget.css({width: '10px', right: 0, left: ''});
                            }
                        }

                    }
                });

                $this.click(function() {
                    if (menuOut === true) {
                        menuOut = false;
                        panning = false;
                        removeMenu();
                    }
                    else {

                        // Disable Scrolling
                        var $body = $('body');
                        var oldWidth = $body.innerWidth();
                        $body.css('overflow', 'hidden');
                        $body.width(oldWidth);

                        // Push current drag target on top of DOM tree
                        $('body').append(dragTarget);

                        if (options.edge === 'left') {
                            dragTarget.css({width: '50%', right: 0, left: ''});
                            menu_id.velocity({'translateX': [0, -1 * options.menuWidth]}, {duration: 300, queue: false, easing: 'easeOutQuad'});
                        }
                        else {
                            dragTarget.css({width: '50%', right: '', left: 0});
                            menu_id.velocity({'translateX': [0, options.menuWidth]}, {duration: 300, queue: false, easing: 'easeOutQuad'});
                        }

                        var overlay = $('<div id="sidenav-overlay"></div>');
                        overlay.css('opacity', 0)
                            .click(function(){
                                menuOut = false;
                                panning = false;
                                removeMenu();
                                overlay.velocity({opacity: 0}, {duration: 300, queue: false, easing: 'easeOutQuad',
                                    complete: function() {
                                        $(this).remove();
                                    } });

                            });
                        $('body').append(overlay);
                        overlay.velocity({opacity: 1}, {duration: 300, queue: false, easing: 'easeOutQuad',
                            complete: function () {
                                menuOut = true;
                                panning = false;
                            }
                        });
                    }

                    return false;
                });
            });


        },
        show : function() {
            this.trigger('click');
        },
        hide : function() {
            $('#sidenav-overlay').trigger('click');
        }
    };


    $.fn.sideNav = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.sideNav' );
        }
    }; // Plugin end
}( jQuery ));
;/**
 * Extend jquery with a scrollspy plugin.
 * This watches the window scroll and fires events when elements are scrolled into viewport.
 *
 * throttle() and getTime() taken from Underscore.js
 * https://github.com/jashkenas/underscore
 *
 * @author Copyright 2013 John Smart
 * @license https://raw.github.com/thesmart/jquery-scrollspy/master/LICENSE
 * @see https://github.com/thesmart
 * @version 0.1.2
 */
(function($) {

    var jWindow = $(window);
    var elements = [];
    var elementsInView = [];
    var isSpying = false;
    var ticks = 0;
    var unique_id = 1;
    var offset = {
        top : 0,
        right : 0,
        bottom : 0,
        left : 0,
    }

    /**
     * Find elements that are within the boundary
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     * @param {number} left
     * @return {jQuery}		A collection of elements
     */
    function findElements(top, right, bottom, left) {
        var hits = $();
        $.each(elements, function(i, element) {
            if (element.height() > 0) {
                var elTop = element.offset().top,
                    elLeft = element.offset().left,
                    elRight = elLeft + element.width(),
                    elBottom = elTop + element.height();

                var isIntersect = !(elLeft > right ||
                elRight < left ||
                elTop > bottom ||
                elBottom < top);

                if (isIntersect) {
                    hits.push(element);
                }
            }
        });

        return hits;
    }


    /**
     * Called when the user scrolls the window
     */
    function onScroll() {
        // unique tick id
        ++ticks;

        // viewport rectangle
        var top = jWindow.scrollTop(),
            left = jWindow.scrollLeft(),
            right = left + jWindow.width(),
            bottom = top + jWindow.height();

        // determine which elements are in view
        //        + 60 accounts for fixed nav
        var intersections = findElements(top+offset.top + 200, right+offset.right, bottom+offset.bottom, left+offset.left);
        $.each(intersections, function(i, element) {

            var lastTick = element.data('scrollSpy:ticks');
            if (typeof lastTick != 'number') {
                // entered into view
                element.triggerHandler('scrollSpy:enter');
            }

            // update tick id
            element.data('scrollSpy:ticks', ticks);
        });

        // determine which elements are no longer in view
        $.each(elementsInView, function(i, element) {
            var lastTick = element.data('scrollSpy:ticks');
            if (typeof lastTick == 'number' && lastTick !== ticks) {
                // exited from view
                element.triggerHandler('scrollSpy:exit');
                element.data('scrollSpy:ticks', null);
            }
        });

        // remember elements in view for next tick
        elementsInView = intersections;
    }

    /**
     * Called when window is resized
     */
    function onWinSize() {
        jWindow.trigger('scrollSpy:winSize');
    }

    /**
     * Get time in ms
     * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
     * @type {function}
     * @return {number}
     */
    var getTime = (Date.now || function () {
        return new Date().getTime();
    });

    /**
     * Returns a function, that, when invoked, will only be triggered at most once
     * during a given window of time. Normally, the throttled function will run
     * as much as it can, without ever going more than once per `wait` duration;
     * but if you'd like to disable the execution on the leading edge, pass
     * `{leading: false}`. To disable execution on the trailing edge, ditto.
     * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
     * @param {function} func
     * @param {number} wait
     * @param {Object=} options
     * @returns {Function}
     */
    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function () {
            previous = options.leading === false ? 0 : getTime();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };
        return function () {
            var now = getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    /**
     * Enables ScrollSpy using a selector
     * @param {jQuery|string} selector  The elements collection, or a selector
     * @param {Object=} options	Optional.
     throttle : number -> scrollspy throttling. Default: 100 ms
     offsetTop : number -> offset from top. Default: 0
     offsetRight : number -> offset from right. Default: 0
     offsetBottom : number -> offset from bottom. Default: 0
     offsetLeft : number -> offset from left. Default: 0
     * @returns {jQuery}
     */
    $.scrollSpy = function(selector, options) {
        var visible = [];
        selector = $(selector);
        selector.each(function(i, element) {
            elements.push($(element));
            $(element).data("scrollSpy:id", i);
            // Smooth scroll to section
            $('a[href="#' + $(element).attr('id') + '"]').click(function(e) {
                e.preventDefault();
                var offset = $(this.hash).offset().top + 1;

                //          offset - 200 allows elements near bottom of page to scroll

                $('html, body').animate({ scrollTop: offset - 200 }, {duration: 400, queue: false, easing: 'easeOutCubic'});

            });
        });
        options = options || {
                throttle: 100
            };

        offset.top = options.offsetTop || 0;
        offset.right = options.offsetRight || 0;
        offset.bottom = options.offsetBottom || 0;
        offset.left = options.offsetLeft || 0;

        var throttledScroll = throttle(onScroll, options.throttle || 100);
        var readyScroll = function(){
            $(document).ready(throttledScroll);
        };

        if (!isSpying) {
            jWindow.on('scroll', readyScroll);
            jWindow.on('resize', readyScroll);
            isSpying = true;
        }

        // perform a scan once, after current execution context, and after dom is ready
        setTimeout(readyScroll, 0);


        selector.on('scrollSpy:enter', function() {
            visible = $.grep(visible, function(value) {
                return value.height() != 0;
            });

            var $this = $(this);

            if (visible[0]) {
                $('a[href="#' + visible[0].attr('id') + '"]').removeClass('active');
                if ($this.data('scrollSpy:id') < visible[0].data('scrollSpy:id')) {
                    visible.unshift($(this));
                }
                else {
                    visible.push($(this));
                }
            }
            else {
                visible.push($(this));
            }


            $('a[href="#' + visible[0].attr('id') + '"]').addClass('active');
        });
        selector.on('scrollSpy:exit', function() {
            visible = $.grep(visible, function(value) {
                return value.height() != 0;
            });

            if (visible[0]) {
                $('a[href="#' + visible[0].attr('id') + '"]').removeClass('active');
                var $this = $(this);
                visible = $.grep(visible, function(value) {
                    return value.attr('id') != $this.attr('id');
                });
                if (visible[0]) { // Check if empty
                    $('a[href="#' + visible[0].attr('id') + '"]').addClass('active');
                }
            }
        });

        return selector;
    };

    /**
     * Listen for window resize events
     * @param {Object=} options						Optional. Set { throttle: number } to change throttling. Default: 100 ms
     * @returns {jQuery}		$(window)
     */
    $.winSizeSpy = function(options) {
        $.winSizeSpy = function() { return jWindow; }; // lock from multiple calls
        options = options || {
                throttle: 100
            };
        return jWindow.on('resize', throttle(onWinSize, options.throttle || 100));
    };

    /**
     * Enables ScrollSpy on a collection of elements
     * e.g. $('.scrollSpy').scrollSpy()
     * @param {Object=} options	Optional.
     throttle : number -> scrollspy throttling. Default: 100 ms
     offsetTop : number -> offset from top. Default: 0
     offsetRight : number -> offset from right. Default: 0
     offsetBottom : number -> offset from bottom. Default: 0
     offsetLeft : number -> offset from left. Default: 0
     * @returns {jQuery}
     */
    $.fn.scrollSpy = function(options) {
        return $.scrollSpy($(this), options);
    };

})(jQuery);
;(function ($) {
    $(document).ready(function() {

        // Function to update labels of text fields
        Materialize.updateTextFields = function() {
            var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
            $(input_selector).each(function(index, element) {
                if ($(element).val().length > 0 || element.autofocus ||$(this).attr('placeholder') !== undefined || $(element)[0].validity.badInput === true) {
                    $(this).siblings('label, i').addClass('active');
                }
                else {
                    $(this).siblings('label, i').removeClass('active');
                }
            });
        };

        // Text based inputs
        var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';

        // Add active if form auto complete
        $(document).on('change', input_selector, function () {
            if($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
                $(this).siblings('label').addClass('active');
            }
            validate_field($(this));
        });

        // Add active if input element has been pre-populated on document ready
        $(document).ready(function() {
            Materialize.updateTextFields();
        });

        // HTML DOM FORM RESET handling
        $(document).on('reset', function(e) {
            var formReset = $(e.target);
            if (formReset.is('form')) {
                formReset.find(input_selector).removeClass('valid').removeClass('invalid');
                formReset.find(input_selector).each(function () {
                    if ($(this).attr('value') === '') {
                        $(this).siblings('label, i').removeClass('active');
                    }
                });

                // Reset select
                formReset.find('select.initialized').each(function () {
                    var reset_text = formReset.find('option[selected]').text();
                    formReset.siblings('input.select-dropdown').val(reset_text);
                });
            }
        });

        // Add active when element has focus
        $(document).on('focus', input_selector, function () {
            $(this).siblings('label, i').addClass('active');
        });

        $(document).on('blur', input_selector, function () {
            var $inputElement = $(this);
            if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
                $inputElement.siblings('label, i').removeClass('active');
            }

            if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') !== undefined) {
                $inputElement.siblings('i').removeClass('active');
            }
            validate_field($inputElement);
        });

        window.validate_field = function(object) {
            var hasLength = object.attr('length') !== undefined;
            var lenAttr = parseInt(object.attr('length'));
            var len = object.val().length;

            if (object.val().length === 0 && object[0].validity.badInput === false) {
                if (object.hasClass('validate')) {
                    object.removeClass('valid');
                    object.removeClass('invalid');
                }
            }
            else {
                if (object.hasClass('validate')) {
                    // Check for character counter attributes
                    if ((object.is(':valid') && hasLength && (len <= lenAttr)) || (object.is(':valid') && !hasLength)) {
                        object.removeClass('invalid');
                        object.addClass('valid');
                    }
                    else {
                        object.removeClass('valid');
                        object.addClass('invalid');
                    }
                }
            }
        };

        // Radio and Checkbox focus class
        var radio_checkbox = 'input[type=radio], input[type=checkbox]';
        $(document).on('keyup.radio', radio_checkbox, function(e) {
            // TAB, check if tabbing to radio or checkbox.
            if (e.which === 9) {
                $(this).addClass('tabbed');
                var $this = $(this);
                $this.one('blur', function(e) {

                    $(this).removeClass('tabbed');
                });
                return;
            }
        });

        // Textarea Auto Resize
        var hiddenDiv = $('.hiddendiv').first();
        if (!hiddenDiv.length) {
            hiddenDiv = $('<div class="hiddendiv common"></div>');
            $('body').append(hiddenDiv);
        }
        var text_area_selector = '.materialize-textarea';

        function textareaAutoResize($textarea) {
            // Set font properties of hiddenDiv

            var fontFamily = $textarea.css('font-family');
            var fontSize = $textarea.css('font-size');

            if (fontSize) { hiddenDiv.css('font-size', fontSize); }
            if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }

            if ($textarea.attr('wrap') === "off") {
                hiddenDiv.css('overflow-wrap', "normal")
                    .css('white-space', "pre");
            }

            hiddenDiv.text($textarea.val() + '\n');
            var content = hiddenDiv.html().replace(/\n/g, '<br>');
            hiddenDiv.html(content);


            // When textarea is hidden, width goes crazy.
            // Approximate with half of window size

            if ($textarea.is(':visible')) {
                hiddenDiv.css('width', $textarea.width());
            }
            else {
                hiddenDiv.css('width', $(window).width()/2);
            }

            $textarea.css('height', hiddenDiv.height());
        }

        $(text_area_selector).each(function () {
            var $textarea = $(this);
            if ($textarea.val().length) {
                textareaAutoResize($textarea);
            }
        });

        $('body').on('keyup keydown autoresize', text_area_selector, function () {
            textareaAutoResize($(this));
        });

        // File Input Path
        $(document).on('change', '.file-field input[type="file"]', function () {
            var file_field = $(this).closest('.file-field');
            var path_input = file_field.find('input.file-path');
            var files      = $(this)[0].files;
            var file_names = [];
            for (var i = 0; i < files.length; i++) {
                file_names.push(files[i].name);
            }
            path_input.val(file_names.join(", "));
            path_input.trigger('change');
        });

        /****************
         *  Range Input  *
         ****************/

        var range_type = 'input[type=range]';
        var range_mousedown = false;
        var left;

        $(range_type).each(function () {
            var thumb = $('<span class="thumb"><span class="value"></span></span>');
            $(this).after(thumb);
        });

        var range_wrapper = '.range-field';
        $(document).on('change', range_type, function(e) {
            var thumb = $(this).siblings('.thumb');
            thumb.find('.value').html($(this).val());
        });

        $(document).on('input mousedown touchstart', range_type, function(e) {
            var thumb = $(this).siblings('.thumb');
            var width = $(this).outerWidth();

            // If thumb indicator does not exist yet, create it
            if (thumb.length <= 0) {
                thumb = $('<span class="thumb"><span class="value"></span></span>');
                $(this).after(thumb);
            }

            // Set indicator value
            thumb.find('.value').html($(this).val());

            range_mousedown = true;
            $(this).addClass('active');

            if (!thumb.hasClass('active')) {
                thumb.velocity({ height: "30px", width: "30px", top: "-20px", marginLeft: "-15px"}, { duration: 300, easing: 'easeOutExpo' });
            }

            if (e.type !== 'input') {
                if(e.pageX === undefined || e.pageX === null){//mobile
                    left = e.originalEvent.touches[0].pageX - $(this).offset().left;
                }
                else{ // desktop
                    left = e.pageX - $(this).offset().left;
                }
                if (left < 0) {
                    left = 0;
                }
                else if (left > width) {
                    left = width;
                }
                thumb.addClass('active').css('left', left);
            }

            thumb.find('.value').html($(this).val());
        });

        $(document).on('mouseup touchend', range_wrapper, function() {
            range_mousedown = false;
            $(this).removeClass('active');
        });

        $(document).on('mousemove touchmove', range_wrapper, function(e) {
            var thumb = $(this).children('.thumb');
            var left;
            if (range_mousedown) {
                if (!thumb.hasClass('active')) {
                    thumb.velocity({ height: '30px', width: '30px', top: '-20px', marginLeft: '-15px'}, { duration: 300, easing: 'easeOutExpo' });
                }
                if (e.pageX === undefined || e.pageX === null) { //mobile
                    left = e.originalEvent.touches[0].pageX - $(this).offset().left;
                }
                else{ // desktop
                    left = e.pageX - $(this).offset().left;
                }
                var width = $(this).outerWidth();

                if (left < 0) {
                    left = 0;
                }
                else if (left > width) {
                    left = width;
                }
                thumb.addClass('active').css('left', left);
                thumb.find('.value').html(thumb.siblings(range_type).val());
            }
        });

        $(document).on('mouseout touchleave', range_wrapper, function() {
            if (!range_mousedown) {

                var thumb = $(this).children('.thumb');

                if (thumb.hasClass('active')) {
                    thumb.velocity({ height: '0', width: '0', top: '10px', marginLeft: '-6px'}, { duration: 100 });
                }
                thumb.removeClass('active');
            }
        });
    }); // End of $(document).ready

    /*******************
     *  Select Plugin  *
     ******************/
    $.fn.material_select = function (callback) {
        $(this).each(function(){
            var $select = $(this);

            if ($select.hasClass('browser-default')) {
                return; // Continue to next (return false breaks out of entire loop)
            }

            var multiple = $select.attr('multiple') ? true : false,
                lastID = $select.data('select-id'); // Tear down structure if Select needs to be rebuilt

            if (lastID) {
                $select.parent().find('span.caret').remove();
                $select.parent().find('input').remove();

                $select.unwrap();
                $('ul#select-options-'+lastID).remove();
            }

            // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
            if(callback === 'destroy') {
                $select.data('select-id', null).removeClass('initialized');
                return;
            }

            var uniqueID = Materialize.guid();
            $select.data('select-id', uniqueID);
            var wrapper = $('<div class="select-wrapper"></div>');
            wrapper.addClass($select.attr('class'));
            var options = $('<ul id="select-options-' + uniqueID +'" class="dropdown-content select-dropdown ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>'),
                selectChildren = $select.children('option, optgroup'),
                valuesSelected = [],
                optionsHover = false;

            var label = $select.find('option:selected').html() || $select.find('option:first').html() || "";

            // Function that renders and appends the option taking into
            // account type and possible image icon.
            var appendOptionWithIcon = function(select, option, type) {
                // Add disabled attr if disabled
                var disabledClass = (option.is(':disabled')) ? 'disabled ' : '';
                var optgroupClass = (type === 'optgroup-option') ? 'optgroup-option ' : '';

                // add icons
                var icon_url = option.data('icon');
                var classes = option.attr('class');
                if (!!icon_url) {
                    var classString = '';
                    if (!!classes) classString = ' class="' + classes + '"';

                    // Check for multiple type.
                    if (type === 'multiple') {
                        options.append($('<li class="' + disabledClass + '"><img src="' + icon_url + '"' + classString + '><span><input type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'));
                    } else {
                        options.append($('<li class="' + disabledClass + optgroupClass + '"><img src="' + icon_url + '"' + classString + '><span>' + option.html() + '</span></li>'));
                    }
                    return true;
                }

                // Check for multiple type.
                if (type === 'multiple') {
                    options.append($('<li class="' + disabledClass + '"><span><input type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'));
                } else {
                    options.append($('<li class="' + disabledClass + optgroupClass + '"><span>' + option.html() + '</span></li>'));
                }
            };

            /* Create dropdown structure. */
            if (selectChildren.length) {
                selectChildren.each(function() {
                    if ($(this).is('option')) {
                        // Direct descendant option.
                        if (multiple) {
                            appendOptionWithIcon($select, $(this), 'multiple');

                        } else {
                            appendOptionWithIcon($select, $(this));
                        }
                    } else if ($(this).is('optgroup')) {
                        // Optgroup.
                        var selectOptions = $(this).children('option');
                        options.append($('<li class="optgroup"><span>' + $(this).attr('label') + '</span></li>'));

                        selectOptions.each(function() {
                            appendOptionWithIcon($select, $(this), 'optgroup-option');
                        });
                    }
                });
            }

            options.find('li:not(.optgroup)').each(function (i) {
                $(this).click(function (e) {
                    // Check if option element is disabled
                    if (!$(this).hasClass('disabled') && !$(this).hasClass('optgroup')) {
                        var selected = true;

                        if (multiple) {
                            $('input[type="checkbox"]', this).prop('checked', function(i, v) { return !v; });
                            selected = toggleEntryFromArray(valuesSelected, $(this).index(), $select);
                            $newSelect.trigger('focus');
                        } else {
                            options.find('li').removeClass('active');
                            $(this).toggleClass('active');
                            $newSelect.val($(this).text());
                        }

                        activateOption(options, $(this));
                        $select.find('option').eq(i).prop('selected', selected);
                        // Trigger onchange() event
                        $select.trigger('change');
                        if (typeof callback !== 'undefined') callback();
                    }

                    e.stopPropagation();
                });
            });

            // Wrap Elements
            $select.wrap(wrapper);
            // Add Select Display Element
            var dropdownIcon = $('<span class="caret">&#9660;</span>');
            if ($select.is(':disabled'))
                dropdownIcon.addClass('disabled');

            // escape double quotes
            var sanitizedLabelHtml = label.replace(/"/g, '&quot;');

            var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID +'" value="'+ sanitizedLabelHtml +'"/>');
            $select.before($newSelect);
            $newSelect.before(dropdownIcon);

            $newSelect.after(options);
            // Check if section element is disabled
            if (!$select.is(':disabled')) {
                $newSelect.dropdown({'hover': false, 'closeOnClick': false});
            }

            // Copy tabindex
            if ($select.attr('tabindex')) {
                $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
            }

            $select.addClass('initialized');

            $newSelect.on({
                'focus': function (){
                    if ($('ul.select-dropdown').not(options[0]).is(':visible')) {
                        $('input.select-dropdown').trigger('close');
                    }
                    if (!options.is(':visible')) {
                        $(this).trigger('open', ['focus']);
                        var label = $(this).val();
                        var selectedOption = options.find('li').filter(function() {
                            return $(this).text().toLowerCase() === label.toLowerCase();
                        })[0];
                        activateOption(options, selectedOption);
                    }
                },
                'click': function (e){
                    e.stopPropagation();
                }
            });

            $newSelect.on('blur', function() {
                if (!multiple) {
                    $(this).trigger('close');
                }
                options.find('li.selected').removeClass('selected');
            });

            options.hover(function() {
                optionsHover = true;
            }, function () {
                optionsHover = false;
            });

            $(window).on({
                'click': function () {
                    multiple && (optionsHover || $newSelect.trigger('close'));
                }
            });

            // Add initial multiple selections.
            if (multiple) {
                $select.find("option:selected:not(:disabled)").each(function () {
                    var index = $(this).index();

                    toggleEntryFromArray(valuesSelected, index, $select);
                    options.find("li").eq(index).find(":checkbox").prop("checked", true);
                });
            }

            // Make option as selected and scroll to selected position
            var activateOption = function(collection, newOption) {
                if (newOption) {
                    collection.find('li.selected').removeClass('selected');
                    var option = $(newOption);
                    option.addClass('selected');
                    options.scrollTo(option);
                }
            };

            // Allow user to search by typing
            // this array is cleared after 1 second
            var filterQuery = [],
                onKeyDown = function(e){
                    // TAB - switch to another input
                    if(e.which == 9){
                        $newSelect.trigger('close');
                        return;
                    }

                    // ARROW DOWN WHEN SELECT IS CLOSED - open select options
                    if(e.which == 40 && !options.is(':visible')){
                        $newSelect.trigger('open');
                        return;
                    }

                    // ENTER WHEN SELECT IS CLOSED - submit form
                    if(e.which == 13 && !options.is(':visible')){
                        return;
                    }

                    e.preventDefault();

                    // CASE WHEN USER TYPE LETTERS
                    var letter = String.fromCharCode(e.which).toLowerCase(),
                        nonLetters = [9,13,27,38,40];
                    if (letter && (nonLetters.indexOf(e.which) === -1)) {
                        filterQuery.push(letter);

                        var string = filterQuery.join(''),
                            newOption = options.find('li').filter(function() {
                                return $(this).text().toLowerCase().indexOf(string) === 0;
                            })[0];

                        if (newOption) {
                            activateOption(options, newOption);
                        }
                    }

                    // ENTER - select option and close when select options are opened
                    if (e.which == 13) {
                        var activeOption = options.find('li.selected:not(.disabled)')[0];
                        if(activeOption){
                            $(activeOption).trigger('click');
                            if (!multiple) {
                                $newSelect.trigger('close');
                            }
                        }
                    }

                    // ARROW DOWN - move to next not disabled option
                    if (e.which == 40) {
                        if (options.find('li.selected').length) {
                            newOption = options.find('li.selected').next('li:not(.disabled)')[0];
                        } else {
                            newOption = options.find('li:not(.disabled)')[0];
                        }
                        activateOption(options, newOption);
                    }

                    // ESC - close options
                    if (e.which == 27) {
                        $newSelect.trigger('close');
                    }

                    // ARROW UP - move to previous not disabled option
                    if (e.which == 38) {
                        newOption = options.find('li.selected').prev('li:not(.disabled)')[0];
                        if(newOption)
                            activateOption(options, newOption);
                    }

                    // Automaticaly clean filter query so user can search again by starting letters
                    setTimeout(function(){ filterQuery = []; }, 1000);
                };

            $newSelect.on('keydown', onKeyDown);
        });

        function toggleEntryFromArray(entriesArray, entryIndex, select) {
            var index = entriesArray.indexOf(entryIndex),
                notAdded = index === -1;

            if (notAdded) {
                entriesArray.push(entryIndex);
            } else {
                entriesArray.splice(index, 1);
            }

            select.siblings('ul.dropdown-content').find('li').eq(entryIndex).toggleClass('active');

            // use notAdded instead of true (to detect if the option is selected or not)
            select.find('option').eq(entryIndex).prop('selected', notAdded);
            setValueToInput(entriesArray, select);

            return notAdded;
        }

        function setValueToInput(entriesArray, select) {
            var value = '';

            for (var i = 0, count = entriesArray.length; i < count; i++) {
                var text = select.find('option').eq(entriesArray[i]).text();

                i === 0 ? value += text : value += ', ' + text;
            }

            if (value === '') {
                value = select.find('option:disabled').eq(0).text();
            }

            select.siblings('input.select-dropdown').val(value);
        }
    };

}( jQuery ));
;(function ($) {

    var methods = {

        init : function(options) {
            var defaults = {
                indicators: true,
                height: 400,
                transition: 500,
                interval: 6000
            };
            options = $.extend(defaults, options);

            return this.each(function() {

                // For each slider, we want to keep track of
                // which slide is active and its associated content
                var $this = $(this);
                var $slider = $this.find('ul.slides').first();
                var $slides = $slider.find('li');
                var $active_index = $slider.find('.active').index();
                var $active, $indicators, $interval;
                if ($active_index != -1) { $active = $slides.eq($active_index); }

                // Transitions the caption depending on alignment
                function captionTransition(caption, duration) {
                    if (caption.hasClass("center-align")) {
                        caption.velocity({opacity: 0, translateY: -100}, {duration: duration, queue: false});
                    }
                    else if (caption.hasClass("right-align")) {
                        caption.velocity({opacity: 0, translateX: 100}, {duration: duration, queue: false});
                    }
                    else if (caption.hasClass("left-align")) {
                        caption.velocity({opacity: 0, translateX: -100}, {duration: duration, queue: false});
                    }
                }

                // This function will transition the slide to any index of the next slide
                function moveToSlide(index) {
                    // Wrap around indices.
                    if (index >= $slides.length) index = 0;
                    else if (index < 0) index = $slides.length -1;

                    $active_index = $slider.find('.active').index();

                    // Only do if index changes
                    if ($active_index != index) {
                        $active = $slides.eq($active_index);
                        $caption = $active.find('.caption');

                        $active.removeClass('active');
                        $active.velocity({opacity: 0}, {duration: options.transition, queue: false, easing: 'easeOutQuad',
                            complete: function() {
                                $slides.not('.active').velocity({opacity: 0, translateX: 0, translateY: 0}, {duration: 0, queue: false});
                            } });
                        captionTransition($caption, options.transition);


                        // Update indicators
                        if (options.indicators) {
                            $indicators.eq($active_index).removeClass('active');
                        }

                        $slides.eq(index).velocity({opacity: 1}, {duration: options.transition, queue: false, easing: 'easeOutQuad'});
                        $slides.eq(index).find('.caption').velocity({opacity: 1, translateX: 0, translateY: 0}, {duration: options.transition, delay: options.transition, queue: false, easing: 'easeOutQuad'});
                        $slides.eq(index).addClass('active');


                        // Update indicators
                        if (options.indicators) {
                            $indicators.eq(index).addClass('active');
                        }
                    }
                }

                // Set height of slider
                // If fullscreen, do nothing
                if (!$this.hasClass('fullscreen')) {
                    if (options.indicators) {
                        // Add height if indicators are present
                        $this.height(options.height + 40);
                    }
                    else {
                        $this.height(options.height);
                    }
                    $slider.height(options.height);
                }


                // Set initial positions of captions
                $slides.find('.caption').each(function () {
                    captionTransition($(this), 0);
                });

                // Move img src into background-image
                $slides.find('img').each(function () {
                    var placeholderBase64 = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                    if ($(this).attr('src') !== placeholderBase64) {
                        $(this).css('background-image', 'url(' + $(this).attr('src') + ')' );
                        $(this).attr('src', placeholderBase64);
                    }
                });

                // dynamically add indicators
                if (options.indicators) {
                    $indicators = $('<ul class="indicators"></ul>');
                    $slides.each(function( index ) {
                        var $indicator = $('<li class="indicator-item"></li>');

                        // Handle clicks on indicators
                        $indicator.click(function () {
                            var $parent = $slider.parent();
                            var curr_index = $parent.find($(this)).index();
                            moveToSlide(curr_index);

                            // reset interval
                            clearInterval($interval);
                            $interval = setInterval(
                                function(){
                                    $active_index = $slider.find('.active').index();
                                    if ($slides.length == $active_index + 1) $active_index = 0; // loop to start
                                    else $active_index += 1;

                                    moveToSlide($active_index);

                                }, options.transition + options.interval
                            );
                        });
                        $indicators.append($indicator);
                    });
                    $this.append($indicators);
                    $indicators = $this.find('ul.indicators').find('li.indicator-item');
                }

                if ($active) {
                    $active.show();
                }
                else {
                    $slides.first().addClass('active').velocity({opacity: 1}, {duration: options.transition, queue: false, easing: 'easeOutQuad'});

                    $active_index = 0;
                    $active = $slides.eq($active_index);

                    // Update indicators
                    if (options.indicators) {
                        $indicators.eq($active_index).addClass('active');
                    }
                }

                // Adjust height to current slide
                $active.find('img').each(function() {
                    $active.find('.caption').velocity({opacity: 1, translateX: 0, translateY: 0}, {duration: options.transition, queue: false, easing: 'easeOutQuad'});
                });

                // auto scroll
                $interval = setInterval(
                    function(){
                        $active_index = $slider.find('.active').index();
                        moveToSlide($active_index + 1);

                    }, options.transition + options.interval
                );


                // HammerJS, Swipe navigation

                // Touch Event
                var panning = false;
                var swipeLeft = false;
                var swipeRight = false;

                $this.hammer({
                    prevent_default: false
                }).bind('pan', function(e) {
                    if (e.gesture.pointerType === "touch") {

                        // reset interval
                        clearInterval($interval);

                        var direction = e.gesture.direction;
                        var x = e.gesture.deltaX;
                        var velocityX = e.gesture.velocityX;

                        $curr_slide = $slider.find('.active');
                        $curr_slide.velocity({ translateX: x
                        }, {duration: 50, queue: false, easing: 'easeOutQuad'});

                        // Swipe Left
                        if (direction === 4 && (x > ($this.innerWidth() / 2) || velocityX < -0.65)) {
                            swipeRight = true;
                        }
                        // Swipe Right
                        else if (direction === 2 && (x < (-1 * $this.innerWidth() / 2) || velocityX > 0.65)) {
                            swipeLeft = true;
                        }

                        // Make Slide Behind active slide visible
                        var next_slide;
                        if (swipeLeft) {
                            next_slide = $curr_slide.next();
                            if (next_slide.length === 0) {
                                next_slide = $slides.first();
                            }
                            next_slide.velocity({ opacity: 1
                            }, {duration: 300, queue: false, easing: 'easeOutQuad'});
                        }
                        if (swipeRight) {
                            next_slide = $curr_slide.prev();
                            if (next_slide.length === 0) {
                                next_slide = $slides.last();
                            }
                            next_slide.velocity({ opacity: 1
                            }, {duration: 300, queue: false, easing: 'easeOutQuad'});
                        }


                    }

                }).bind('panend', function(e) {
                    if (e.gesture.pointerType === "touch") {

                        $curr_slide = $slider.find('.active');
                        panning = false;
                        curr_index = $slider.find('.active').index();

                        if (!swipeRight && !swipeLeft || $slides.length <=1) {
                            // Return to original spot
                            $curr_slide.velocity({ translateX: 0
                            }, {duration: 300, queue: false, easing: 'easeOutQuad'});
                        }
                        else if (swipeLeft) {
                            moveToSlide(curr_index + 1);
                            $curr_slide.velocity({translateX: -1 * $this.innerWidth() }, {duration: 300, queue: false, easing: 'easeOutQuad',
                                complete: function() {
                                    $curr_slide.velocity({opacity: 0, translateX: 0}, {duration: 0, queue: false});
                                } });
                        }
                        else if (swipeRight) {
                            moveToSlide(curr_index - 1);
                            $curr_slide.velocity({translateX: $this.innerWidth() }, {duration: 300, queue: false, easing: 'easeOutQuad',
                                complete: function() {
                                    $curr_slide.velocity({opacity: 0, translateX: 0}, {duration: 0, queue: false});
                                } });
                        }
                        swipeLeft = false;
                        swipeRight = false;

                        // Restart interval
                        clearInterval($interval);
                        $interval = setInterval(
                            function(){
                                $active_index = $slider.find('.active').index();
                                if ($slides.length == $active_index + 1) $active_index = 0; // loop to start
                                else $active_index += 1;

                                moveToSlide($active_index);

                            }, options.transition + options.interval
                        );
                    }
                });

                $this.on('sliderPause', function() {
                    clearInterval($interval);
                });

                $this.on('sliderStart', function() {
                    clearInterval($interval);
                    $interval = setInterval(
                        function(){
                            $active_index = $slider.find('.active').index();
                            if ($slides.length == $active_index + 1) $active_index = 0; // loop to start
                            else $active_index += 1;

                            moveToSlide($active_index);

                        }, options.transition + options.interval
                    );
                });

                $this.on('sliderNext', function() {
                    $active_index = $slider.find('.active').index();
                    moveToSlide($active_index + 1);
                });

                $this.on('sliderPrev', function() {
                    $active_index = $slider.find('.active').index();
                    moveToSlide($active_index - 1);
                });

            });



        },
        pause : function() {
            $(this).trigger('sliderPause');
        },
        start : function() {
            $(this).trigger('sliderStart');
        },
        next : function() {
            $(this).trigger('sliderNext');
        },
        prev : function() {
            $(this).trigger('sliderPrev');
        }
    };


    $.fn.slider = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }
    }; // Plugin end
}( jQuery ));
;(function ($) {
    $(document).ready(function() {

        $(document).on('click.card', '.card', function (e) {
            if ($(this).find('> .card-reveal').length) {
                if ($(e.target).is($('.card-reveal .card-title')) || $(e.target).is($('.card-reveal .card-title i'))) {
                    // Make Reveal animate down and display none
                    $(this).find('.card-reveal').velocity(
                        {translateY: 0}, {
                            duration: 225,
                            queue: false,
                            easing: 'easeInOutQuad',
                            complete: function() { $(this).css({ display: 'none'}); }
                        }
                    );
                }
                else if ($(e.target).is($('.card .activator')) ||
                    $(e.target).is($('.card .activator i')) ) {
                    $(e.target).closest('.card').css('overflow', 'hidden');
                    $(this).find('.card-reveal').css({ display: 'block'}).velocity("stop", false).velocity({translateY: '-100%'}, {duration: 300, queue: false, easing: 'easeInOutQuad'});
                }
            }

            $('.card-reveal').closest('.card').css('overflow', 'hidden');

        });

    });
}( jQuery ));;(function ($) {
    $(document).ready(function() {

        $(document).on('click.chip', '.chip .material-icons', function (e) {
            $(this).parent().remove();
        });

    });
}( jQuery ));;(function ($) {
    $.fn.pushpin = function (options) {

        var defaults = {
            top: 0,
            bottom: Infinity,
            offset: 0
        };
        options = $.extend(defaults, options);

        $index = 0;
        return this.each(function() {
            var $uniqueId = Materialize.guid(),
                $this = $(this),
                $original_offset = $(this).offset().top;

            function removePinClasses(object) {
                object.removeClass('pin-top');
                object.removeClass('pinned');
                object.removeClass('pin-bottom');
            }

            function updateElements(objects, scrolled) {
                objects.each(function () {
                    // Add position fixed (because its between top and bottom)
                    if (options.top <= scrolled && options.bottom >= scrolled && !$(this).hasClass('pinned')) {
                        removePinClasses($(this));
                        $(this).css('top', options.offset);
                        $(this).addClass('pinned');
                    }

                    // Add pin-top (when scrolled position is above top)
                    if (scrolled < options.top && !$(this).hasClass('pin-top')) {
                        removePinClasses($(this));
                        $(this).css('top', 0);
                        $(this).addClass('pin-top');
                    }

                    // Add pin-bottom (when scrolled position is below bottom)
                    if (scrolled > options.bottom && !$(this).hasClass('pin-bottom')) {
                        removePinClasses($(this));
                        $(this).addClass('pin-bottom');
                        $(this).css('top', options.bottom - $original_offset);
                    }
                });
            }

            updateElements($this, $(window).scrollTop());
            $(window).on('scroll.' + $uniqueId, function () {
                var $scrolled = $(window).scrollTop() + options.offset;
                updateElements($this, $scrolled);
            });

        });

    };
}( jQuery ));;(function ($) {
    $(document).ready(function() {

        // jQuery reverse
        $.fn.reverse = [].reverse;

        // Hover behaviour: make sure this doesn't work on .click-to-toggle FABs!
        $(document).on('mouseenter.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle)', function(e) {
            var $this = $(this);
            openFABMenu($this);
        });
        $(document).on('mouseleave.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle)', function(e) {
            var $this = $(this);
            closeFABMenu($this);
        });

        // Toggle-on-click behaviour.
        $(document).on('click.fixedActionBtn', '.fixed-action-btn.click-to-toggle > a', function(e) {
            var $this = $(this);
            var $menu = $this.parent();
            if ($menu.hasClass('active')) {
                closeFABMenu($menu);
            } else {
                openFABMenu($menu);
            }
        });

    });

    $.fn.extend({
        openFAB: function() {
            openFABMenu($(this));
        },
        closeFAB: function() {
            closeFABMenu($(this));
        }
    });


    var openFABMenu = function (btn) {
        $this = btn;
        if ($this.hasClass('active') === false) {

            // Get direction option
            var horizontal = $this.hasClass('horizontal');
            var offsetY, offsetX;

            if (horizontal === true) {
                offsetX = 40;
            } else {
                offsetY = 40;
            }

            $this.addClass('active');
            $this.find('ul .btn-floating').velocity(
                { scaleY: ".4", scaleX: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px'},
                { duration: 0 });

            var time = 0;
            $this.find('ul .btn-floating').reverse().each( function () {
                $(this).velocity(
                    { opacity: "1", scaleX: "1", scaleY: "1", translateY: "0", translateX: '0'},
                    { duration: 80, delay: time });
                time += 40;
            });
        }
    };

    var closeFABMenu = function (btn) {
        $this = btn;
        // Get direction option
        var horizontal = $this.hasClass('horizontal');
        var offsetY, offsetX;

        if (horizontal === true) {
            offsetX = 40;
        } else {
            offsetY = 40;
        }

        $this.removeClass('active');
        var time = 0;
        $this.find('ul .btn-floating').velocity("stop", true);
        $this.find('ul .btn-floating').velocity(
            { opacity: "0", scaleX: ".4", scaleY: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px'},
            { duration: 80 }
        );
    };


}( jQuery ));
;(function ($) {
    // Image transition function
    Materialize.fadeInImage =  function(selector){
        var element = $(selector);
        element.css({opacity: 0});
        $(element).velocity({opacity: 1}, {
            duration: 650,
            queue: false,
            easing: 'easeOutSine'
        });
        $(element).velocity({opacity: 1}, {
            duration: 1300,
            queue: false,
            easing: 'swing',
            step: function(now, fx) {
                fx.start = 100;
                var grayscale_setting = now/100;
                var brightness_setting = 150 - (100 - now)/1.75;

                if (brightness_setting < 100) {
                    brightness_setting = 100;
                }
                if (now >= 0) {
                    $(this).css({
                        "-webkit-filter": "grayscale("+grayscale_setting+")" + "brightness("+brightness_setting+"%)",
                        "filter": "grayscale("+grayscale_setting+")" + "brightness("+brightness_setting+"%)"
                    });
                }
            }
        });
    };

    // Horizontal staggered list
    Materialize.showStaggeredList = function(selector) {
        var time = 0;
        $(selector).find('li').velocity(
            { translateX: "-100px"},
            { duration: 0 });

        $(selector).find('li').each(function() {
            $(this).velocity(
                { opacity: "1", translateX: "0"},
                { duration: 800, delay: time, easing: [60, 10] });
            time += 120;
        });
    };


    $(document).ready(function() {
        // Hardcoded .staggered-list scrollFire
        // var staggeredListOptions = [];
        // $('ul.staggered-list').each(function (i) {

        //   var label = 'scrollFire-' + i;
        //   $(this).addClass(label);
        //   staggeredListOptions.push(
        //     {selector: 'ul.staggered-list.' + label,
        //      offset: 200,
        //      callback: 'showStaggeredList("ul.staggered-list.' + label + '")'});
        // });
        // scrollFire(staggeredListOptions);

        // HammerJS, Swipe navigation

        // Touch Event
        var swipeLeft = false;
        var swipeRight = false;


        // Dismissible Collections
        $('.dismissable').each(function() {
            $(this).hammer({
                prevent_default: false
            }).bind('pan', function(e) {
                if (e.gesture.pointerType === "touch") {
                    var $this = $(this);
                    var direction = e.gesture.direction;
                    var x = e.gesture.deltaX;
                    var velocityX = e.gesture.velocityX;

                    $this.velocity({ translateX: x
                    }, {duration: 50, queue: false, easing: 'easeOutQuad'});

                    // Swipe Left
                    if (direction === 4 && (x > ($this.innerWidth() / 2) || velocityX < -0.75)) {
                        swipeLeft = true;
                    }

                    // Swipe Right
                    if (direction === 2 && (x < (-1 * $this.innerWidth() / 2) || velocityX > 0.75)) {
                        swipeRight = true;
                    }
                }
            }).bind('panend', function(e) {
                // Reset if collection is moved back into original position
                if (Math.abs(e.gesture.deltaX) < ($(this).innerWidth() / 2)) {
                    swipeRight = false;
                    swipeLeft = false;
                }

                if (e.gesture.pointerType === "touch") {
                    var $this = $(this);
                    if (swipeLeft || swipeRight) {
                        var fullWidth;
                        if (swipeLeft) { fullWidth = $this.innerWidth(); }
                        else { fullWidth = -1 * $this.innerWidth(); }

                        $this.velocity({ translateX: fullWidth,
                        }, {duration: 100, queue: false, easing: 'easeOutQuad', complete:
                            function() {
                                $this.css('border', 'none');
                                $this.velocity({ height: 0, padding: 0,
                                }, {duration: 200, queue: false, easing: 'easeOutQuad', complete:
                                    function() { $this.remove(); }
                                });
                            }
                        });
                    }
                    else {
                        $this.velocity({ translateX: 0,
                        }, {duration: 100, queue: false, easing: 'easeOutQuad'});
                    }
                    swipeLeft = false;
                    swipeRight = false;
                }
            });

        });


        // time = 0
        // // Vertical Staggered list
        // $('ul.staggered-list.vertical li').velocity(
        //     { translateY: "100px"},
        //     { duration: 0 });

        // $('ul.staggered-list.vertical li').each(function() {
        //   $(this).velocity(
        //     { opacity: "1", translateY: "0"},
        //     { duration: 800, delay: time, easing: [60, 25] });
        //   time += 120;
        // });

        // // Fade in and Scale
        // $('.fade-in.scale').velocity(
        //     { scaleX: .4, scaleY: .4, translateX: -600},
        //     { duration: 0});
        // $('.fade-in').each(function() {
        //   $(this).velocity(
        //     { opacity: "1", scaleX: 1, scaleY: 1, translateX: 0},
        //     { duration: 800, easing: [60, 10] });
        // });
    });
}( jQuery ));
;(function($) {

    // Input: Array of JSON objects {selector, offset, callback}

    Materialize.scrollFire = function(options) {

        var didScroll = false;

        window.addEventListener("scroll", function() {
            didScroll = true;
        });

        // Rate limit to 100ms
        setInterval(function() {
            if(didScroll) {
                didScroll = false;

                var windowScroll = window.pageYOffset + window.innerHeight;

                for (var i = 0 ; i < options.length; i++) {
                    // Get options from each line
                    var value = options[i];
                    var selector = value.selector,
                        offset = value.offset,
                        callback = value.callback;

                    var currentElement = document.querySelector(selector);
                    if ( currentElement !== null) {
                        var elementOffset = currentElement.getBoundingClientRect().top + window.pageYOffset;

                        if (windowScroll > (elementOffset + offset)) {
                            if (value.done !== true) {
                                if (typeof(callback) === 'function') {
                                    callback.call(this);
                                } else if (typeof(callback) === 'string') {
                                    var callbackFunc = new Function(callback);
                                    callbackFunc();
                                }
                                value.done = true;
                            }
                        }
                    }
                }
            }
        }, 100);
    };

})(jQuery);
;/*!
 * pickadate.js v3.5.0, 2014/04/13
 * By Amsul, http://amsul.ca
 * Hosted on http://amsul.github.io/pickadate.js
 * Licensed under MIT
 */

(function ( factory ) {

    // AMD.
    if ( typeof define == 'function' && define.amd )
        define( 'picker', ['jquery'], factory )

    // Node.js/browserify.
    else if ( typeof exports == 'object' )
        module.exports = factory( require('jquery') )

    // Browser globals.
    else this.Picker = factory( jQuery )

}(function( $ ) {

    var $window = $( window )
    var $document = $( document )
    var $html = $( document.documentElement )


    /**
     * The picker constructor that creates a blank picker.
     */
    function PickerConstructor( ELEMENT, NAME, COMPONENT, OPTIONS ) {

        // If there’s no element, return the picker constructor.
        if ( !ELEMENT ) return PickerConstructor


        var
            IS_DEFAULT_THEME = false,


        // The state of the picker.
            STATE = {
                id: ELEMENT.id || 'P' + Math.abs( ~~(Math.random() * new Date()) )
            },


        // Merge the defaults and options passed.
            SETTINGS = COMPONENT ? $.extend( true, {}, COMPONENT.defaults, OPTIONS ) : OPTIONS || {},


        // Merge the default classes with the settings classes.
            CLASSES = $.extend( {}, PickerConstructor.klasses(), SETTINGS.klass ),


        // The element node wrapper into a jQuery object.
            $ELEMENT = $( ELEMENT ),


        // Pseudo picker constructor.
            PickerInstance = function() {
                return this.start()
            },


        // The picker prototype.
            P = PickerInstance.prototype = {

                constructor: PickerInstance,

                $node: $ELEMENT,


                /**
                 * Initialize everything
                 */
                start: function() {

                    // If it’s already started, do nothing.
                    if ( STATE && STATE.start ) return P


                    // Update the picker states.
                    STATE.methods = {}
                    STATE.start = true
                    STATE.open = false
                    STATE.type = ELEMENT.type


                    // Confirm focus state, convert into text input to remove UA stylings,
                    // and set as readonly to prevent keyboard popup.
                    ELEMENT.autofocus = ELEMENT == getActiveElement()
                    ELEMENT.readOnly = !SETTINGS.editable
                    ELEMENT.id = ELEMENT.id || STATE.id
                    if ( ELEMENT.type != 'text' ) {
                        ELEMENT.type = 'text'
                    }


                    // Create a new picker component with the settings.
                    P.component = new COMPONENT(P, SETTINGS)


                    // Create the picker root with a holder and then prepare it.
                    P.$root = $( PickerConstructor._.node('div', createWrappedComponent(), CLASSES.picker, 'id="' + ELEMENT.id + '_root" tabindex="0"') )
                    prepareElementRoot()


                    // If there’s a format for the hidden input element, create the element.
                    if ( SETTINGS.formatSubmit ) {
                        prepareElementHidden()
                    }


                    // Prepare the input element.
                    prepareElement()


                    // Insert the root as specified in the settings.
                    if ( SETTINGS.container ) $( SETTINGS.container ).append( P.$root )
                    else $ELEMENT.after( P.$root )


                    // Bind the default component and settings events.
                    P.on({
                        start: P.component.onStart,
                        render: P.component.onRender,
                        stop: P.component.onStop,
                        open: P.component.onOpen,
                        close: P.component.onClose,
                        set: P.component.onSet
                    }).on({
                        start: SETTINGS.onStart,
                        render: SETTINGS.onRender,
                        stop: SETTINGS.onStop,
                        open: SETTINGS.onOpen,
                        close: SETTINGS.onClose,
                        set: SETTINGS.onSet
                    })


                    // Once we’re all set, check the theme in use.
                    IS_DEFAULT_THEME = isUsingDefaultTheme( P.$root.children()[ 0 ] )


                    // If the element has autofocus, open the picker.
                    if ( ELEMENT.autofocus ) {
                        P.open()
                    }


                    // Trigger queued the “start” and “render” events.
                    return P.trigger( 'start' ).trigger( 'render' )
                }, //start


                /**
                 * Render a new picker
                 */
                render: function( entireComponent ) {

                    // Insert a new component holder in the root or box.
                    if ( entireComponent ) P.$root.html( createWrappedComponent() )
                    else P.$root.find( '.' + CLASSES.box ).html( P.component.nodes( STATE.open ) )

                    // Trigger the queued “render” events.
                    return P.trigger( 'render' )
                }, //render


                /**
                 * Destroy everything
                 */
                stop: function() {

                    // If it’s already stopped, do nothing.
                    if ( !STATE.start ) return P

                    // Then close the picker.
                    P.close()

                    // Remove the hidden field.
                    if ( P._hidden ) {
                        P._hidden.parentNode.removeChild( P._hidden )
                    }

                    // Remove the root.
                    P.$root.remove()

                    // Remove the input class, remove the stored data, and unbind
                    // the events (after a tick for IE - see `P.close`).
                    $ELEMENT.removeClass( CLASSES.input ).removeData( NAME )
                    setTimeout( function() {
                        $ELEMENT.off( '.' + STATE.id )
                    }, 0)

                    // Restore the element state
                    ELEMENT.type = STATE.type
                    ELEMENT.readOnly = false

                    // Trigger the queued “stop” events.
                    P.trigger( 'stop' )

                    // Reset the picker states.
                    STATE.methods = {}
                    STATE.start = false

                    return P
                }, //stop


                /**
                 * Open up the picker
                 */
                open: function( dontGiveFocus ) {

                    // If it’s already open, do nothing.
                    if ( STATE.open ) return P

                    // Add the “active” class.
                    $ELEMENT.addClass( CLASSES.active )
                    aria( ELEMENT, 'expanded', true )

                    // * A Firefox bug, when `html` has `overflow:hidden`, results in
                    //   killing transitions :(. So add the “opened” state on the next tick.
                    //   Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=625289
                    setTimeout( function() {

                        // Add the “opened” class to the picker root.
                        P.$root.addClass( CLASSES.opened )
                        aria( P.$root[0], 'hidden', false )

                    }, 0 )

                    // If we have to give focus, bind the element and doc events.
                    if ( dontGiveFocus !== false ) {

                        // Set it as open.
                        STATE.open = true

                        // Prevent the page from scrolling.
                        if ( IS_DEFAULT_THEME ) {
                            $html.
                            css( 'overflow', 'hidden' ).
                            css( 'padding-right', '+=' + getScrollbarWidth() )
                        }

                        // Pass focus to the root element’s jQuery object.
                        // * Workaround for iOS8 to bring the picker’s root into view.
                        P.$root.eq(0).focus()

                        // Bind the document events.
                        $document.on( 'click.' + STATE.id + ' focusin.' + STATE.id, function( event ) {

                            var target = event.target

                            // If the target of the event is not the element, close the picker picker.
                            // * Don’t worry about clicks or focusins on the root because those don’t bubble up.
                            //   Also, for Firefox, a click on an `option` element bubbles up directly
                            //   to the doc. So make sure the target wasn't the doc.
                            // * In Firefox stopPropagation() doesn’t prevent right-click events from bubbling,
                            //   which causes the picker to unexpectedly close when right-clicking it. So make
                            //   sure the event wasn’t a right-click.
                            if ( target != ELEMENT && target != document && event.which != 3 ) {

                                // If the target was the holder that covers the screen,
                                // keep the element focused to maintain tabindex.
                                P.close( target === P.$root.children()[0] )
                            }

                        }).on( 'keydown.' + STATE.id, function( event ) {

                            var
                            // Get the keycode.
                                keycode = event.keyCode,

                            // Translate that to a selection change.
                                keycodeToMove = P.component.key[ keycode ],

                            // Grab the target.
                                target = event.target


                            // On escape, close the picker and give focus.
                            if ( keycode == 27 ) {
                                P.close( true )
                            }


                            // Check if there is a key movement or “enter” keypress on the element.
                            else if ( target == P.$root[0] && ( keycodeToMove || keycode == 13 ) ) {

                                // Prevent the default action to stop page movement.
                                event.preventDefault()

                                // Trigger the key movement action.
                                if ( keycodeToMove ) {
                                    PickerConstructor._.trigger( P.component.key.go, P, [ PickerConstructor._.trigger( keycodeToMove ) ] )
                                }

                                // On “enter”, if the highlighted item isn’t disabled, set the value and close.
                                else if ( !P.$root.find( '.' + CLASSES.highlighted ).hasClass( CLASSES.disabled ) ) {
                                    P.set( 'select', P.component.item.highlight ).close()
                                }
                            }


                            // If the target is within the root and “enter” is pressed,
                            // prevent the default action and trigger a click on the target instead.
                            else if ( $.contains( P.$root[0], target ) && keycode == 13 ) {
                                event.preventDefault()
                                target.click()
                            }
                        })
                    }

                    // Trigger the queued “open” events.
                    return P.trigger( 'open' )
                }, //open


                /**
                 * Close the picker
                 */
                close: function( giveFocus ) {

                    // If we need to give focus, do it before changing states.
                    if ( giveFocus ) {
                        // ....ah yes! It would’ve been incomplete without a crazy workaround for IE :|
                        // The focus is triggered *after* the close has completed - causing it
                        // to open again. So unbind and rebind the event at the next tick.
                        P.$root.off( 'focus.toOpen' ).eq(0).focus()
                        setTimeout( function() {
                            P.$root.on( 'focus.toOpen', handleFocusToOpenEvent )
                        }, 0 )
                    }

                    // Remove the “active” class.
                    $ELEMENT.removeClass( CLASSES.active )
                    aria( ELEMENT, 'expanded', false )

                    // * A Firefox bug, when `html` has `overflow:hidden`, results in
                    //   killing transitions :(. So remove the “opened” state on the next tick.
                    //   Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=625289
                    setTimeout( function() {

                        // Remove the “opened” and “focused” class from the picker root.
                        P.$root.removeClass( CLASSES.opened + ' ' + CLASSES.focused )
                        aria( P.$root[0], 'hidden', true )

                    }, 0 )

                    // If it’s already closed, do nothing more.
                    if ( !STATE.open ) return P

                    // Set it as closed.
                    STATE.open = false

                    // Allow the page to scroll.
                    if ( IS_DEFAULT_THEME ) {
                        $html.
                        css( 'overflow', '' ).
                        css( 'padding-right', '-=' + getScrollbarWidth() )
                    }

                    // Unbind the document events.
                    $document.off( '.' + STATE.id )

                    // Trigger the queued “close” events.
                    return P.trigger( 'close' )
                }, //close


                /**
                 * Clear the values
                 */
                clear: function( options ) {
                    return P.set( 'clear', null, options )
                }, //clear


                /**
                 * Set something
                 */
                set: function( thing, value, options ) {

                    var thingItem, thingValue,
                        thingIsObject = $.isPlainObject( thing ),
                        thingObject = thingIsObject ? thing : {}

                    // Make sure we have usable options.
                    options = thingIsObject && $.isPlainObject( value ) ? value : options || {}

                    if ( thing ) {

                        // If the thing isn’t an object, make it one.
                        if ( !thingIsObject ) {
                            thingObject[ thing ] = value
                        }

                        // Go through the things of items to set.
                        for ( thingItem in thingObject ) {

                            // Grab the value of the thing.
                            thingValue = thingObject[ thingItem ]

                            // First, if the item exists and there’s a value, set it.
                            if ( thingItem in P.component.item ) {
                                if ( thingValue === undefined ) thingValue = null
                                P.component.set( thingItem, thingValue, options )
                            }

                            // Then, check to update the element value and broadcast a change.
                            if ( thingItem == 'select' || thingItem == 'clear' ) {
                                $ELEMENT.
                                val( thingItem == 'clear' ? '' : P.get( thingItem, SETTINGS.format ) ).
                                trigger( 'change' )
                            }
                        }

                        // Render a new picker.
                        P.render()
                    }

                    // When the method isn’t muted, trigger queued “set” events and pass the `thingObject`.
                    return options.muted ? P : P.trigger( 'set', thingObject )
                }, //set


                /**
                 * Get something
                 */
                get: function( thing, format ) {

                    // Make sure there’s something to get.
                    thing = thing || 'value'

                    // If a picker state exists, return that.
                    if ( STATE[ thing ] != null ) {
                        return STATE[ thing ]
                    }

                    // Return the submission value, if that.
                    if ( thing == 'valueSubmit' ) {
                        if ( P._hidden ) {
                            return P._hidden.value
                        }
                        thing = 'value'
                    }

                    // Return the value, if that.
                    if ( thing == 'value' ) {
                        return ELEMENT.value
                    }

                    // Check if a component item exists, return that.
                    if ( thing in P.component.item ) {
                        if ( typeof format == 'string' ) {
                            var thingValue = P.component.get( thing )
                            return thingValue ?
                                PickerConstructor._.trigger(
                                    P.component.formats.toString,
                                    P.component,
                                    [ format, thingValue ]
                                ) : ''
                        }
                        return P.component.get( thing )
                    }
                }, //get



                /**
                 * Bind events on the things.
                 */
                on: function( thing, method, internal ) {

                    var thingName, thingMethod,
                        thingIsObject = $.isPlainObject( thing ),
                        thingObject = thingIsObject ? thing : {}

                    if ( thing ) {

                        // If the thing isn’t an object, make it one.
                        if ( !thingIsObject ) {
                            thingObject[ thing ] = method
                        }

                        // Go through the things to bind to.
                        for ( thingName in thingObject ) {

                            // Grab the method of the thing.
                            thingMethod = thingObject[ thingName ]

                            // If it was an internal binding, prefix it.
                            if ( internal ) {
                                thingName = '_' + thingName
                            }

                            // Make sure the thing methods collection exists.
                            STATE.methods[ thingName ] = STATE.methods[ thingName ] || []

                            // Add the method to the relative method collection.
                            STATE.methods[ thingName ].push( thingMethod )
                        }
                    }

                    return P
                }, //on



                /**
                 * Unbind events on the things.
                 */
                off: function() {
                    var i, thingName,
                        names = arguments;
                    for ( i = 0, namesCount = names.length; i < namesCount; i += 1 ) {
                        thingName = names[i]
                        if ( thingName in STATE.methods ) {
                            delete STATE.methods[thingName]
                        }
                    }
                    return P
                },


                /**
                 * Fire off method events.
                 */
                trigger: function( name, data ) {
                    var _trigger = function( name ) {
                        var methodList = STATE.methods[ name ]
                        if ( methodList ) {
                            methodList.map( function( method ) {
                                PickerConstructor._.trigger( method, P, [ data ] )
                            })
                        }
                    }
                    _trigger( '_' + name )
                    _trigger( name )
                    return P
                } //trigger
            } //PickerInstance.prototype


        /**
         * Wrap the picker holder components together.
         */
        function createWrappedComponent() {

            // Create a picker wrapper holder
            return PickerConstructor._.node( 'div',

                // Create a picker wrapper node
                PickerConstructor._.node( 'div',

                    // Create a picker frame
                    PickerConstructor._.node( 'div',

                        // Create a picker box node
                        PickerConstructor._.node( 'div',

                            // Create the components nodes.
                            P.component.nodes( STATE.open ),

                            // The picker box class
                            CLASSES.box
                        ),

                        // Picker wrap class
                        CLASSES.wrap
                    ),

                    // Picker frame class
                    CLASSES.frame
                ),

                // Picker holder class
                CLASSES.holder
            ) //endreturn
        } //createWrappedComponent



        /**
         * Prepare the input element with all bindings.
         */
        function prepareElement() {

            $ELEMENT.

            // Store the picker data by component name.
            data(NAME, P).

            // Add the “input” class name.
            addClass(CLASSES.input).

            // Remove the tabindex.
            attr('tabindex', -1).

            // If there’s a `data-value`, update the value of the element.
            val( $ELEMENT.data('value') ?
                P.get('select', SETTINGS.format) :
                ELEMENT.value
            )


            // Only bind keydown events if the element isn’t editable.
            if ( !SETTINGS.editable ) {

                $ELEMENT.

                // On focus/click, focus onto the root to open it up.
                on( 'focus.' + STATE.id + ' click.' + STATE.id, function( event ) {
                    event.preventDefault()
                    P.$root.eq(0).focus()
                }).

                // Handle keyboard event based on the picker being opened or not.
                on( 'keydown.' + STATE.id, handleKeydownEvent )
            }


            // Update the aria attributes.
            aria(ELEMENT, {
                haspopup: true,
                expanded: false,
                readonly: false,
                owns: ELEMENT.id + '_root'
            })
        }


        /**
         * Prepare the root picker element with all bindings.
         */
        function prepareElementRoot() {

            P.$root.

            on({

                // For iOS8.
                keydown: handleKeydownEvent,

                // When something within the root is focused, stop from bubbling
                // to the doc and remove the “focused” state from the root.
                focusin: function( event ) {
                    P.$root.removeClass( CLASSES.focused )
                    event.stopPropagation()
                },

                // When something within the root holder is clicked, stop it
                // from bubbling to the doc.
                'mousedown click': function( event ) {

                    var target = event.target

                    // Make sure the target isn’t the root holder so it can bubble up.
                    if ( target != P.$root.children()[ 0 ] ) {

                        event.stopPropagation()

                        // * For mousedown events, cancel the default action in order to
                        //   prevent cases where focus is shifted onto external elements
                        //   when using things like jQuery mobile or MagnificPopup (ref: #249 & #120).
                        //   Also, for Firefox, don’t prevent action on the `option` element.
                        if ( event.type == 'mousedown' && !$( target ).is( 'input, select, textarea, button, option' )) {

                            event.preventDefault()

                            // Re-focus onto the root so that users can click away
                            // from elements focused within the picker.
                            P.$root.eq(0).focus()
                        }
                    }
                }
            }).

            // Add/remove the “target” class on focus and blur.
            on({
                focus: function() {
                    $ELEMENT.addClass( CLASSES.target )
                },
                blur: function() {
                    $ELEMENT.removeClass( CLASSES.target )
                }
            }).

            // Open the picker and adjust the root “focused” state
            on( 'focus.toOpen', handleFocusToOpenEvent ).

            // If there’s a click on an actionable element, carry out the actions.
            on( 'click', '[data-pick], [data-nav], [data-clear], [data-close]', function() {

                var $target = $( this ),
                    targetData = $target.data(),
                    targetDisabled = $target.hasClass( CLASSES.navDisabled ) || $target.hasClass( CLASSES.disabled ),

                // * For IE, non-focusable elements can be active elements as well
                //   (http://stackoverflow.com/a/2684561).
                    activeElement = getActiveElement()
                activeElement = activeElement && ( activeElement.type || activeElement.href )

                // If it’s disabled or nothing inside is actively focused, re-focus the element.
                if ( targetDisabled || activeElement && !$.contains( P.$root[0], activeElement ) ) {
                    P.$root.eq(0).focus()
                }

                // If something is superficially changed, update the `highlight` based on the `nav`.
                if ( !targetDisabled && targetData.nav ) {
                    P.set( 'highlight', P.component.item.highlight, { nav: targetData.nav } )
                }

                // If something is picked, set `select` then close with focus.
                else if ( !targetDisabled && 'pick' in targetData ) {
                    P.set( 'select', targetData.pick )
                }

                // If a “clear” button is pressed, empty the values and close with focus.
                else if ( targetData.clear ) {
                    P.clear().close( true )
                }

                else if ( targetData.close ) {
                    P.close( true )
                }

            }) //P.$root

            aria( P.$root[0], 'hidden', true )
        }


        /**
         * Prepare the hidden input element along with all bindings.
         */
        function prepareElementHidden() {

            var name

            if ( SETTINGS.hiddenName === true ) {
                name = ELEMENT.name
                ELEMENT.name = ''
            }
            else {
                name = [
                    typeof SETTINGS.hiddenPrefix == 'string' ? SETTINGS.hiddenPrefix : '',
                    typeof SETTINGS.hiddenSuffix == 'string' ? SETTINGS.hiddenSuffix : '_submit'
                ]
                name = name[0] + ELEMENT.name + name[1]
            }

            P._hidden = $(
                '<input ' +
                'type=hidden ' +

                    // Create the name using the original input’s with a prefix and suffix.
                'name="' + name + '"' +

                    // If the element has a value, set the hidden value as well.
                (
                    $ELEMENT.data('value') || ELEMENT.value ?
                    ' value="' + P.get('select', SETTINGS.formatSubmit) + '"' :
                        ''
                ) +
                '>'
            )[0]

            $ELEMENT.

            // If the value changes, update the hidden input with the correct format.
            on('change.' + STATE.id, function() {
                P._hidden.value = ELEMENT.value ?
                    P.get('select', SETTINGS.formatSubmit) :
                    ''
            })


            // Insert the hidden input as specified in the settings.
            if ( SETTINGS.container ) $( SETTINGS.container ).append( P._hidden )
            else $ELEMENT.after( P._hidden )
        }


        // For iOS8.
        function handleKeydownEvent( event ) {

            var keycode = event.keyCode,

            // Check if one of the delete keys was pressed.
                isKeycodeDelete = /^(8|46)$/.test(keycode)

            // For some reason IE clears the input value on “escape”.
            if ( keycode == 27 ) {
                P.close()
                return false
            }

            // Check if `space` or `delete` was pressed or the picker is closed with a key movement.
            if ( keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[keycode] ) {

                // Prevent it from moving the page and bubbling to doc.
                event.preventDefault()
                event.stopPropagation()

                // If `delete` was pressed, clear the values and close the picker.
                // Otherwise open the picker.
                if ( isKeycodeDelete ) { P.clear().close() }
                else { P.open() }
            }
        }


        // Separated for IE
        function handleFocusToOpenEvent( event ) {

            // Stop the event from propagating to the doc.
            event.stopPropagation()

            // If it’s a focus event, add the “focused” class to the root.
            if ( event.type == 'focus' ) {
                P.$root.addClass( CLASSES.focused )
            }

            // And then finally open the picker.
            P.open()
        }


        // Return a new picker instance.
        return new PickerInstance()
    } //PickerConstructor



    /**
     * The default classes and prefix to use for the HTML classes.
     */
    PickerConstructor.klasses = function( prefix ) {
        prefix = prefix || 'picker'
        return {

            picker: prefix,
            opened: prefix + '--opened',
            focused: prefix + '--focused',

            input: prefix + '__input',
            active: prefix + '__input--active',
            target: prefix + '__input--target',

            holder: prefix + '__holder',

            frame: prefix + '__frame',
            wrap: prefix + '__wrap',

            box: prefix + '__box'
        }
    } //PickerConstructor.klasses



    /**
     * Check if the default theme is being used.
     */
    function isUsingDefaultTheme( element ) {

        var theme,
            prop = 'position'

        // For IE.
        if ( element.currentStyle ) {
            theme = element.currentStyle[prop]
        }

        // For normal browsers.
        else if ( window.getComputedStyle ) {
            theme = getComputedStyle( element )[prop]
        }

        return theme == 'fixed'
    }



    /**
     * Get the width of the browser’s scrollbar.
     * Taken from: https://github.com/VodkaBears/Remodal/blob/master/src/jquery.remodal.js
     */
    function getScrollbarWidth() {

        if ( $html.height() <= $window.height() ) {
            return 0
        }

        var $outer = $( '<div style="visibility:hidden;width:100px" />' ).
        appendTo( 'body' )

        // Get the width without scrollbars.
        var widthWithoutScroll = $outer[0].offsetWidth

        // Force adding scrollbars.
        $outer.css( 'overflow', 'scroll' )

        // Add the inner div.
        var $inner = $( '<div style="width:100%" />' ).appendTo( $outer )

        // Get the width with scrollbars.
        var widthWithScroll = $inner[0].offsetWidth

        // Remove the divs.
        $outer.remove()

        // Return the difference between the widths.
        return widthWithoutScroll - widthWithScroll
    }



    /**
     * PickerConstructor helper methods.
     */
    PickerConstructor._ = {

        /**
         * Create a group of nodes. Expects:
         * `
         {
            min:    {Integer},
            max:    {Integer},
            i:      {Integer},
            node:   {String},
            item:   {Function}
        }
         * `
         */
        group: function( groupObject ) {

            var
            // Scope for the looped object
                loopObjectScope,

            // Create the nodes list
                nodesList = '',

            // The counter starts from the `min`
                counter = PickerConstructor._.trigger( groupObject.min, groupObject )


            // Loop from the `min` to `max`, incrementing by `i`
            for ( ; counter <= PickerConstructor._.trigger( groupObject.max, groupObject, [ counter ] ); counter += groupObject.i ) {

                // Trigger the `item` function within scope of the object
                loopObjectScope = PickerConstructor._.trigger( groupObject.item, groupObject, [ counter ] )

                // Splice the subgroup and create nodes out of the sub nodes
                nodesList += PickerConstructor._.node(
                    groupObject.node,
                    loopObjectScope[ 0 ],   // the node
                    loopObjectScope[ 1 ],   // the classes
                    loopObjectScope[ 2 ]    // the attributes
                )
            }

            // Return the list of nodes
            return nodesList
        }, //group


        /**
         * Create a dom node string
         */
        node: function( wrapper, item, klass, attribute ) {

            // If the item is false-y, just return an empty string
            if ( !item ) return ''

            // If the item is an array, do a join
            item = $.isArray( item ) ? item.join( '' ) : item

            // Check for the class
            klass = klass ? ' class="' + klass + '"' : ''

            // Check for any attributes
            attribute = attribute ? ' ' + attribute : ''

            // Return the wrapped item
            return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'
        }, //node


        /**
         * Lead numbers below 10 with a zero.
         */
        lead: function( number ) {
            return ( number < 10 ? '0': '' ) + number
        },


        /**
         * Trigger a function otherwise return the value.
         */
        trigger: function( callback, scope, args ) {
            return typeof callback == 'function' ? callback.apply( scope, args || [] ) : callback
        },


        /**
         * If the second character is a digit, length is 2 otherwise 1.
         */
        digits: function( string ) {
            return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
        },


        /**
         * Tell if something is a date object.
         */
        isDate: function( value ) {
            return {}.toString.call( value ).indexOf( 'Date' ) > -1 && this.isInteger( value.getDate() )
        },


        /**
         * Tell if something is an integer.
         */
        isInteger: function( value ) {
            return {}.toString.call( value ).indexOf( 'Number' ) > -1 && value % 1 === 0
        },


        /**
         * Create ARIA attribute strings.
         */
        ariaAttr: ariaAttr
    } //PickerConstructor._



    /**
     * Extend the picker with a component and defaults.
     */
    PickerConstructor.extend = function( name, Component ) {

        // Extend jQuery.
        $.fn[ name ] = function( options, action ) {

            // Grab the component data.
            var componentData = this.data( name )

            // If the picker is requested, return the data object.
            if ( options == 'picker' ) {
                return componentData
            }

            // If the component data exists and `options` is a string, carry out the action.
            if ( componentData && typeof options == 'string' ) {
                return PickerConstructor._.trigger( componentData[ options ], componentData, [ action ] )
            }

            // Otherwise go through each matched element and if the component
            // doesn’t exist, create a new picker using `this` element
            // and merging the defaults and options with a deep copy.
            return this.each( function() {
                var $this = $( this )
                if ( !$this.data( name ) ) {
                    new PickerConstructor( this, name, Component, options )
                }
            })
        }

        // Set the defaults.
        $.fn[ name ].defaults = Component.defaults
    } //PickerConstructor.extend



    function aria(element, attribute, value) {
        if ( $.isPlainObject(attribute) ) {
            for ( var key in attribute ) {
                ariaSet(element, key, attribute[key])
            }
        }
        else {
            ariaSet(element, attribute, value)
        }
    }
    function ariaSet(element, attribute, value) {
        element.setAttribute(
            (attribute == 'role' ? '' : 'aria-') + attribute,
            value
        )
    }
    function ariaAttr(attribute, data) {
        if ( !$.isPlainObject(attribute) ) {
            attribute = { attribute: data }
        }
        data = ''
        for ( var key in attribute ) {
            var attr = (key == 'role' ? '' : 'aria-') + key,
                attrVal = attribute[key]
            data += attrVal == null ? '' : attr + '="' + attribute[key] + '"'
        }
        return data
    }

    // IE8 bug throws an error for activeElements within iframes.
    function getActiveElement() {
        try {
            return document.activeElement
        } catch ( err ) { }
    }



    // Expose the picker constructor.
    return PickerConstructor


}));


;/*!
 * Date picker for pickadate.js v3.5.0
 * http://amsul.github.io/pickadate.js/date.htm
 */

(function ( factory ) {

    // AMD.
    if ( typeof define == 'function' && define.amd )
        define( ['picker', 'jquery'], factory )

    // Node.js/browserify.
    else if ( typeof exports == 'object' )
        module.exports = factory( require('./picker.js'), require('jquery') )

    // Browser globals.
    else factory( Picker, jQuery )

}(function( Picker, $ ) {


    /**
     * Globals and constants
     */
    var DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,
        _ = Picker._



    /**
     * The date picker constructor
     */
    function DatePicker( picker, settings ) {

        var calendar = this,
            element = picker.$node[ 0 ],
            elementValue = element.value,
            elementDataValue = picker.$node.data( 'value' ),
            valueString = elementDataValue || elementValue,
            formatString = elementDataValue ? settings.formatSubmit : settings.format,
            isRTL = function() {

                return element.currentStyle ?

                    // For IE.
                element.currentStyle.direction == 'rtl' :

                    // For normal browsers.
                getComputedStyle( picker.$root[0] ).direction == 'rtl'
            }

        calendar.settings = settings
        calendar.$node = picker.$node

        // The queue of methods that will be used to build item objects.
        calendar.queue = {
            min: 'measure create',
            max: 'measure create',
            now: 'now create',
            select: 'parse create validate',
            highlight: 'parse navigate create validate',
            view: 'parse create validate viewset',
            disable: 'deactivate',
            enable: 'activate'
        }

        // The component's item object.
        calendar.item = {}

        calendar.item.clear = null
        calendar.item.disable = ( settings.disable || [] ).slice( 0 )
        calendar.item.enable = -(function( collectionDisabled ) {
            return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
        })( calendar.item.disable )

        calendar.
        set( 'min', settings.min ).
        set( 'max', settings.max ).
        set( 'now' )

        // When there’s a value, set the `select`, which in turn
        // also sets the `highlight` and `view`.
        if ( valueString ) {
            calendar.set( 'select', valueString, { format: formatString })
        }

        // If there’s no value, default to highlighting “today”.
        else {
            calendar.
            set( 'select', null ).
            set( 'highlight', calendar.item.now )
        }


        // The keycode to movement mapping.
        calendar.key = {
            40: 7, // Down
            38: -7, // Up
            39: function() { return isRTL() ? -1 : 1 }, // Right
            37: function() { return isRTL() ? 1 : -1 }, // Left
            go: function( timeChange ) {
                var highlightedObject = calendar.item.highlight,
                    targetDate = new Date( highlightedObject.year, highlightedObject.month, highlightedObject.date + timeChange )
                calendar.set(
                    'highlight',
                    targetDate,
                    { interval: timeChange }
                )
                this.render()
            }
        }


        // Bind some picker events.
        picker.
        on( 'render', function() {
            picker.$root.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
                var value = this.value
                if ( value ) {
                    picker.set( 'highlight', [ picker.get( 'view' ).year, value, picker.get( 'highlight' ).date ] )
                    picker.$root.find( '.' + settings.klass.selectMonth ).trigger( 'focus' )
                }
            })
            picker.$root.find( '.' + settings.klass.selectYear ).on( 'change', function() {
                var value = this.value
                if ( value ) {
                    picker.set( 'highlight', [ value, picker.get( 'view' ).month, picker.get( 'highlight' ).date ] )
                    picker.$root.find( '.' + settings.klass.selectYear ).trigger( 'focus' )
                }
            })
        }, 1 ).
        on( 'open', function() {
            var includeToday = ''
            if ( calendar.disabled( calendar.get('now') ) ) {
                includeToday = ':not(.' + settings.klass.buttonToday + ')'
            }
            picker.$root.find( 'button' + includeToday + ', select' ).attr( 'disabled', false )
        }, 1 ).
        on( 'close', function() {
            picker.$root.find( 'button, select' ).attr( 'disabled', true )
        }, 1 )

    } //DatePicker


    /**
     * Set a datepicker item object.
     */
    DatePicker.prototype.set = function( type, value, options ) {

        var calendar = this,
            calendarItem = calendar.item

        // If the value is `null` just set it immediately.
        if ( value === null ) {
            if ( type == 'clear' ) type = 'select'
            calendarItem[ type ] = value
            return calendar
        }

        // Otherwise go through the queue of methods, and invoke the functions.
        // Update this as the time unit, and set the final value as this item.
        // * In the case of `enable`, keep the queue but set `disable` instead.
        //   And in the case of `flip`, keep the queue but set `enable` instead.
        calendarItem[ ( type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type ) ] = calendar.queue[ type ].split( ' ' ).map( function( method ) {
            value = calendar[ method ]( type, value, options )
            return value
        }).pop()

        // Check if we need to cascade through more updates.
        if ( type == 'select' ) {
            calendar.set( 'highlight', calendarItem.select, options )
        }
        else if ( type == 'highlight' ) {
            calendar.set( 'view', calendarItem.highlight, options )
        }
        else if ( type.match( /^(flip|min|max|disable|enable)$/ ) ) {
            if ( calendarItem.select && calendar.disabled( calendarItem.select ) ) {
                calendar.set( 'select', calendarItem.select, options )
            }
            if ( calendarItem.highlight && calendar.disabled( calendarItem.highlight ) ) {
                calendar.set( 'highlight', calendarItem.highlight, options )
            }
        }

        return calendar
    } //DatePicker.prototype.set


    /**
     * Get a datepicker item object.
     */
    DatePicker.prototype.get = function( type ) {
        return this.item[ type ]
    } //DatePicker.prototype.get


    /**
     * Create a picker date object.
     */
    DatePicker.prototype.create = function( type, value, options ) {

        var isInfiniteValue,
            calendar = this

        // If there’s no value, use the type as the value.
        value = value === undefined ? type : value


        // If it’s infinity, update the value.
        if ( value == -Infinity || value == Infinity ) {
            isInfiniteValue = value
        }

        // If it’s an object, use the native date object.
        else if ( $.isPlainObject( value ) && _.isInteger( value.pick ) ) {
            value = value.obj
        }

        // If it’s an array, convert it into a date and make sure
        // that it’s a valid date – otherwise default to today.
        else if ( $.isArray( value ) ) {
            value = new Date( value[ 0 ], value[ 1 ], value[ 2 ] )
            value = _.isDate( value ) ? value : calendar.create().obj
        }

        // If it’s a number or date object, make a normalized date.
        else if ( _.isInteger( value ) || _.isDate( value ) ) {
            value = calendar.normalize( new Date( value ), options )
        }

        // If it’s a literal true or any other case, set it to now.
        else /*if ( value === true )*/ {
            value = calendar.now( type, value, options )
        }

        // Return the compiled object.
        return {
            year: isInfiniteValue || value.getFullYear(),
            month: isInfiniteValue || value.getMonth(),
            date: isInfiniteValue || value.getDate(),
            day: isInfiniteValue || value.getDay(),
            obj: isInfiniteValue || value,
            pick: isInfiniteValue || value.getTime()
        }
    } //DatePicker.prototype.create


    /**
     * Create a range limit object using an array, date object,
     * literal “true”, or integer relative to another time.
     */
    DatePicker.prototype.createRange = function( from, to ) {

        var calendar = this,
            createDate = function( date ) {
                if ( date === true || $.isArray( date ) || _.isDate( date ) ) {
                    return calendar.create( date )
                }
                return date
            }

        // Create objects if possible.
        if ( !_.isInteger( from ) ) {
            from = createDate( from )
        }
        if ( !_.isInteger( to ) ) {
            to = createDate( to )
        }

        // Create relative dates.
        if ( _.isInteger( from ) && $.isPlainObject( to ) ) {
            from = [ to.year, to.month, to.date + from ];
        }
        else if ( _.isInteger( to ) && $.isPlainObject( from ) ) {
            to = [ from.year, from.month, from.date + to ];
        }

        return {
            from: createDate( from ),
            to: createDate( to )
        }
    } //DatePicker.prototype.createRange


    /**
     * Check if a date unit falls within a date range object.
     */
    DatePicker.prototype.withinRange = function( range, dateUnit ) {
        range = this.createRange(range.from, range.to)
        return dateUnit.pick >= range.from.pick && dateUnit.pick <= range.to.pick
    }


    /**
     * Check if two date range objects overlap.
     */
    DatePicker.prototype.overlapRanges = function( one, two ) {

        var calendar = this

        // Convert the ranges into comparable dates.
        one = calendar.createRange( one.from, one.to )
        two = calendar.createRange( two.from, two.to )

        return calendar.withinRange( one, two.from ) || calendar.withinRange( one, two.to ) ||
            calendar.withinRange( two, one.from ) || calendar.withinRange( two, one.to )
    }


    /**
     * Get the date today.
     */
    DatePicker.prototype.now = function( type, value, options ) {
        value = new Date()
        if ( options && options.rel ) {
            value.setDate( value.getDate() + options.rel )
        }
        return this.normalize( value, options )
    }


    /**
     * Navigate to next/prev month.
     */
    DatePicker.prototype.navigate = function( type, value, options ) {

        var targetDateObject,
            targetYear,
            targetMonth,
            targetDate,
            isTargetArray = $.isArray( value ),
            isTargetObject = $.isPlainObject( value ),
            viewsetObject = this.item.view/*,
         safety = 100*/


        if ( isTargetArray || isTargetObject ) {

            if ( isTargetObject ) {
                targetYear = value.year
                targetMonth = value.month
                targetDate = value.date
            }
            else {
                targetYear = +value[0]
                targetMonth = +value[1]
                targetDate = +value[2]
            }

            // If we’re navigating months but the view is in a different
            // month, navigate to the view’s year and month.
            if ( options && options.nav && viewsetObject && viewsetObject.month !== targetMonth ) {
                targetYear = viewsetObject.year
                targetMonth = viewsetObject.month
            }

            // Figure out the expected target year and month.
            targetDateObject = new Date( targetYear, targetMonth + ( options && options.nav ? options.nav : 0 ), 1 )
            targetYear = targetDateObject.getFullYear()
            targetMonth = targetDateObject.getMonth()

            // If the month we’re going to doesn’t have enough days,
            // keep decreasing the date until we reach the month’s last date.
            while ( /*safety &&*/ new Date( targetYear, targetMonth, targetDate ).getMonth() !== targetMonth ) {
                targetDate -= 1
                /*safety -= 1
                 if ( !safety ) {
                 throw 'Fell into an infinite loop while navigating to ' + new Date( targetYear, targetMonth, targetDate ) + '.'
                 }*/
            }

            value = [ targetYear, targetMonth, targetDate ]
        }

        return value
    } //DatePicker.prototype.navigate


    /**
     * Normalize a date by setting the hours to midnight.
     */
    DatePicker.prototype.normalize = function( value/*, options*/ ) {
        value.setHours( 0, 0, 0, 0 )
        return value
    }


    /**
     * Measure the range of dates.
     */
    DatePicker.prototype.measure = function( type, value/*, options*/ ) {

        var calendar = this

        // If it’s anything false-y, remove the limits.
        if ( !value ) {
            value = type == 'min' ? -Infinity : Infinity
        }

        // If it’s a string, parse it.
        else if ( typeof value == 'string' ) {
            value = calendar.parse( type, value )
        }

        // If it's an integer, get a date relative to today.
        else if ( _.isInteger( value ) ) {
            value = calendar.now( type, value, { rel: value } )
        }

        return value
    } ///DatePicker.prototype.measure


    /**
     * Create a viewset object based on navigation.
     */
    DatePicker.prototype.viewset = function( type, dateObject/*, options*/ ) {
        return this.create([ dateObject.year, dateObject.month, 1 ])
    }


    /**
     * Validate a date as enabled and shift if needed.
     */
    DatePicker.prototype.validate = function( type, dateObject, options ) {

        var calendar = this,

        // Keep a reference to the original date.
            originalDateObject = dateObject,

        // Make sure we have an interval.
            interval = options && options.interval ? options.interval : 1,

        // Check if the calendar enabled dates are inverted.
            isFlippedBase = calendar.item.enable === -1,

        // Check if we have any enabled dates after/before now.
            hasEnabledBeforeTarget, hasEnabledAfterTarget,

        // The min & max limits.
            minLimitObject = calendar.item.min,
            maxLimitObject = calendar.item.max,

        // Check if we’ve reached the limit during shifting.
            reachedMin, reachedMax,

        // Check if the calendar is inverted and at least one weekday is enabled.
            hasEnabledWeekdays = isFlippedBase && calendar.item.disable.filter( function( value ) {

                    // If there’s a date, check where it is relative to the target.
                    if ( $.isArray( value ) ) {
                        var dateTime = calendar.create( value ).pick
                        if ( dateTime < dateObject.pick ) hasEnabledBeforeTarget = true
                        else if ( dateTime > dateObject.pick ) hasEnabledAfterTarget = true
                    }

                    // Return only integers for enabled weekdays.
                    return _.isInteger( value )
                }).length/*,

         safety = 100*/



        // Cases to validate for:
        // [1] Not inverted and date disabled.
        // [2] Inverted and some dates enabled.
        // [3] Not inverted and out of range.
        //
        // Cases to **not** validate for:
        // • Navigating months.
        // • Not inverted and date enabled.
        // • Inverted and all dates disabled.
        // • ..and anything else.
        if ( !options || !options.nav ) if (
            /* 1 */ ( !isFlippedBase && calendar.disabled( dateObject ) ) ||
            /* 2 */ ( isFlippedBase && calendar.disabled( dateObject ) && ( hasEnabledWeekdays || hasEnabledBeforeTarget || hasEnabledAfterTarget ) ) ||
            /* 3 */ ( !isFlippedBase && (dateObject.pick <= minLimitObject.pick || dateObject.pick >= maxLimitObject.pick) )
        ) {


            // When inverted, flip the direction if there aren’t any enabled weekdays
            // and there are no enabled dates in the direction of the interval.
            if ( isFlippedBase && !hasEnabledWeekdays && ( ( !hasEnabledAfterTarget && interval > 0 ) || ( !hasEnabledBeforeTarget && interval < 0 ) ) ) {
                interval *= -1
            }


            // Keep looping until we reach an enabled date.
            while ( /*safety &&*/ calendar.disabled( dateObject ) ) {

                /*safety -= 1
                 if ( !safety ) {
                 throw 'Fell into an infinite loop while validating ' + dateObject.obj + '.'
                 }*/


                // If we’ve looped into the next/prev month with a large interval, return to the original date and flatten the interval.
                if ( Math.abs( interval ) > 1 && ( dateObject.month < originalDateObject.month || dateObject.month > originalDateObject.month ) ) {
                    dateObject = originalDateObject
                    interval = interval > 0 ? 1 : -1
                }


                // If we’ve reached the min/max limit, reverse the direction, flatten the interval and set it to the limit.
                if ( dateObject.pick <= minLimitObject.pick ) {
                    reachedMin = true
                    interval = 1
                    dateObject = calendar.create([
                        minLimitObject.year,
                        minLimitObject.month,
                        minLimitObject.date + (dateObject.pick === minLimitObject.pick ? 0 : -1)
                    ])
                }
                else if ( dateObject.pick >= maxLimitObject.pick ) {
                    reachedMax = true
                    interval = -1
                    dateObject = calendar.create([
                        maxLimitObject.year,
                        maxLimitObject.month,
                        maxLimitObject.date + (dateObject.pick === maxLimitObject.pick ? 0 : 1)
                    ])
                }


                // If we’ve reached both limits, just break out of the loop.
                if ( reachedMin && reachedMax ) {
                    break
                }


                // Finally, create the shifted date using the interval and keep looping.
                dateObject = calendar.create([ dateObject.year, dateObject.month, dateObject.date + interval ])
            }

        } //endif


        // Return the date object settled on.
        return dateObject
    } //DatePicker.prototype.validate


    /**
     * Check if a date is disabled.
     */
    DatePicker.prototype.disabled = function( dateToVerify ) {

        var
            calendar = this,

        // Filter through the disabled dates to check if this is one.
            isDisabledMatch = calendar.item.disable.filter( function( dateToDisable ) {

                // If the date is a number, match the weekday with 0index and `firstDay` check.
                if ( _.isInteger( dateToDisable ) ) {
                    return dateToVerify.day === ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7
                }

                // If it’s an array or a native JS date, create and match the exact date.
                if ( $.isArray( dateToDisable ) || _.isDate( dateToDisable ) ) {
                    return dateToVerify.pick === calendar.create( dateToDisable ).pick
                }

                // If it’s an object, match a date within the “from” and “to” range.
                if ( $.isPlainObject( dateToDisable ) ) {
                    return calendar.withinRange( dateToDisable, dateToVerify )
                }
            })

        // If this date matches a disabled date, confirm it’s not inverted.
        isDisabledMatch = isDisabledMatch.length && !isDisabledMatch.filter(function( dateToDisable ) {
                return $.isArray( dateToDisable ) && dateToDisable[3] == 'inverted' ||
                    $.isPlainObject( dateToDisable ) && dateToDisable.inverted
            }).length

        // Check the calendar “enabled” flag and respectively flip the
        // disabled state. Then also check if it’s beyond the min/max limits.
        return calendar.item.enable === -1 ? !isDisabledMatch : isDisabledMatch ||
        dateToVerify.pick < calendar.item.min.pick ||
        dateToVerify.pick > calendar.item.max.pick

    } //DatePicker.prototype.disabled


    /**
     * Parse a string into a usable type.
     */
    DatePicker.prototype.parse = function( type, value, options ) {

        var calendar = this,
            parsingObject = {}

        // If it’s already parsed, we’re good.
        if ( !value || typeof value != 'string' ) {
            return value
        }

        // We need a `.format` to parse the value with.
        if ( !( options && options.format ) ) {
            options = options || {}
            options.format = calendar.settings.format
        }

        // Convert the format into an array and then map through it.
        calendar.formats.toArray( options.format ).map( function( label ) {

            var
            // Grab the formatting label.
                formattingLabel = calendar.formats[ label ],

            // The format length is from the formatting label function or the
            // label length without the escaping exclamation (!) mark.
                formatLength = formattingLabel ? _.trigger( formattingLabel, calendar, [ value, parsingObject ] ) : label.replace( /^!/, '' ).length

            // If there's a format label, split the value up to the format length.
            // Then add it to the parsing object with appropriate label.
            if ( formattingLabel ) {
                parsingObject[ label ] = value.substr( 0, formatLength )
            }

            // Update the value as the substring from format length to end.
            value = value.substr( formatLength )
        })

        // Compensate for month 0index.
        return [
            parsingObject.yyyy || parsingObject.yy,
            +( parsingObject.mm || parsingObject.m ) - 1,
            parsingObject.dd || parsingObject.d
        ]
    } //DatePicker.prototype.parse


    /**
     * Various formats to display the object in.
     */
    DatePicker.prototype.formats = (function() {

        // Return the length of the first word in a collection.
        function getWordLengthFromCollection( string, collection, dateObject ) {

            // Grab the first word from the string.
            var word = string.match( /\w+/ )[ 0 ]

            // If there's no month index, add it to the date object
            if ( !dateObject.mm && !dateObject.m ) {
                dateObject.m = collection.indexOf( word ) + 1
            }

            // Return the length of the word.
            return word.length
        }

        // Get the length of the first word in a string.
        function getFirstWordLength( string ) {
            return string.match( /\w+/ )[ 0 ].length
        }

        return {

            d: function( string, dateObject ) {

                // If there's string, then get the digits length.
                // Otherwise return the selected date.
                return string ? _.digits( string ) : dateObject.date
            },
            dd: function( string, dateObject ) {

                // If there's a string, then the length is always 2.
                // Otherwise return the selected date with a leading zero.
                return string ? 2 : _.lead( dateObject.date )
            },
            ddd: function( string, dateObject ) {

                // If there's a string, then get the length of the first word.
                // Otherwise return the short selected weekday.
                return string ? getFirstWordLength( string ) : this.settings.weekdaysShort[ dateObject.day ]
            },
            dddd: function( string, dateObject ) {

                // If there's a string, then get the length of the first word.
                // Otherwise return the full selected weekday.
                return string ? getFirstWordLength( string ) : this.settings.weekdaysFull[ dateObject.day ]
            },
            m: function( string, dateObject ) {

                // If there's a string, then get the length of the digits
                // Otherwise return the selected month with 0index compensation.
                return string ? _.digits( string ) : dateObject.month + 1
            },
            mm: function( string, dateObject ) {

                // If there's a string, then the length is always 2.
                // Otherwise return the selected month with 0index and leading zero.
                return string ? 2 : _.lead( dateObject.month + 1 )
            },
            mmm: function( string, dateObject ) {

                var collection = this.settings.monthsShort

                // If there's a string, get length of the relevant month from the short
                // months collection. Otherwise return the selected month from that collection.
                return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.month ]
            },
            mmmm: function( string, dateObject ) {

                var collection = this.settings.monthsFull

                // If there's a string, get length of the relevant month from the full
                // months collection. Otherwise return the selected month from that collection.
                return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.month ]
            },
            yy: function( string, dateObject ) {

                // If there's a string, then the length is always 2.
                // Otherwise return the selected year by slicing out the first 2 digits.
                return string ? 2 : ( '' + dateObject.year ).slice( 2 )
            },
            yyyy: function( string, dateObject ) {

                // If there's a string, then the length is always 4.
                // Otherwise return the selected year.
                return string ? 4 : dateObject.year
            },

            // Create an array by splitting the formatting string passed.
            toArray: function( formatString ) { return formatString.split( /(d{1,4}|m{1,4}|y{4}|yy|!.)/g ) },

            // Format an object into a string using the formatting options.
            toString: function ( formatString, itemObject ) {
                var calendar = this
                return calendar.formats.toArray( formatString ).map( function( label ) {
                    return _.trigger( calendar.formats[ label ], calendar, [ 0, itemObject ] ) || label.replace( /^!/, '' )
                }).join( '' )
            }
        }
    })() //DatePicker.prototype.formats




    /**
     * Check if two date units are the exact.
     */
    DatePicker.prototype.isDateExact = function( one, two ) {

        var calendar = this

        // When we’re working with weekdays, do a direct comparison.
        if (
            ( _.isInteger( one ) && _.isInteger( two ) ) ||
            ( typeof one == 'boolean' && typeof two == 'boolean' )
        ) {
            return one === two
        }

        // When we’re working with date representations, compare the “pick” value.
        if (
            ( _.isDate( one ) || $.isArray( one ) ) &&
            ( _.isDate( two ) || $.isArray( two ) )
        ) {
            return calendar.create( one ).pick === calendar.create( two ).pick
        }

        // When we’re working with range objects, compare the “from” and “to”.
        if ( $.isPlainObject( one ) && $.isPlainObject( two ) ) {
            return calendar.isDateExact( one.from, two.from ) && calendar.isDateExact( one.to, two.to )
        }

        return false
    }


    /**
     * Check if two date units overlap.
     */
    DatePicker.prototype.isDateOverlap = function( one, two ) {

        var calendar = this,
            firstDay = calendar.settings.firstDay ? 1 : 0

        // When we’re working with a weekday index, compare the days.
        if ( _.isInteger( one ) && ( _.isDate( two ) || $.isArray( two ) ) ) {
            one = one % 7 + firstDay
            return one === calendar.create( two ).day + 1
        }
        if ( _.isInteger( two ) && ( _.isDate( one ) || $.isArray( one ) ) ) {
            two = two % 7 + firstDay
            return two === calendar.create( one ).day + 1
        }

        // When we’re working with range objects, check if the ranges overlap.
        if ( $.isPlainObject( one ) && $.isPlainObject( two ) ) {
            return calendar.overlapRanges( one, two )
        }

        return false
    }


    /**
     * Flip the “enabled” state.
     */
    DatePicker.prototype.flipEnable = function(val) {
        var itemObject = this.item
        itemObject.enable = val || (itemObject.enable == -1 ? 1 : -1)
    }


    /**
     * Mark a collection of dates as “disabled”.
     */
    DatePicker.prototype.deactivate = function( type, datesToDisable ) {

        var calendar = this,
            disabledItems = calendar.item.disable.slice(0)


        // If we’re flipping, that’s all we need to do.
        if ( datesToDisable == 'flip' ) {
            calendar.flipEnable()
        }

        else if ( datesToDisable === false ) {
            calendar.flipEnable(1)
            disabledItems = []
        }

        else if ( datesToDisable === true ) {
            calendar.flipEnable(-1)
            disabledItems = []
        }

        // Otherwise go through the dates to disable.
        else {

            datesToDisable.map(function( unitToDisable ) {

                var matchFound

                // When we have disabled items, check for matches.
                // If something is matched, immediately break out.
                for ( var index = 0; index < disabledItems.length; index += 1 ) {
                    if ( calendar.isDateExact( unitToDisable, disabledItems[index] ) ) {
                        matchFound = true
                        break
                    }
                }

                // If nothing was found, add the validated unit to the collection.
                if ( !matchFound ) {
                    if (
                        _.isInteger( unitToDisable ) ||
                        _.isDate( unitToDisable ) ||
                        $.isArray( unitToDisable ) ||
                        ( $.isPlainObject( unitToDisable ) && unitToDisable.from && unitToDisable.to )
                    ) {
                        disabledItems.push( unitToDisable )
                    }
                }
            })
        }

        // Return the updated collection.
        return disabledItems
    } //DatePicker.prototype.deactivate


    /**
     * Mark a collection of dates as “enabled”.
     */
    DatePicker.prototype.activate = function( type, datesToEnable ) {

        var calendar = this,
            disabledItems = calendar.item.disable,
            disabledItemsCount = disabledItems.length

        // If we’re flipping, that’s all we need to do.
        if ( datesToEnable == 'flip' ) {
            calendar.flipEnable()
        }

        else if ( datesToEnable === true ) {
            calendar.flipEnable(1)
            disabledItems = []
        }

        else if ( datesToEnable === false ) {
            calendar.flipEnable(-1)
            disabledItems = []
        }

        // Otherwise go through the disabled dates.
        else {

            datesToEnable.map(function( unitToEnable ) {

                var matchFound,
                    disabledUnit,
                    index,
                    isExactRange

                // Go through the disabled items and try to find a match.
                for ( index = 0; index < disabledItemsCount; index += 1 ) {

                    disabledUnit = disabledItems[index]

                    // When an exact match is found, remove it from the collection.
                    if ( calendar.isDateExact( disabledUnit, unitToEnable ) ) {
                        matchFound = disabledItems[index] = null
                        isExactRange = true
                        break
                    }

                    // When an overlapped match is found, add the “inverted” state to it.
                    else if ( calendar.isDateOverlap( disabledUnit, unitToEnable ) ) {
                        if ( $.isPlainObject( unitToEnable ) ) {
                            unitToEnable.inverted = true
                            matchFound = unitToEnable
                        }
                        else if ( $.isArray( unitToEnable ) ) {
                            matchFound = unitToEnable
                            if ( !matchFound[3] ) matchFound.push( 'inverted' )
                        }
                        else if ( _.isDate( unitToEnable ) ) {
                            matchFound = [ unitToEnable.getFullYear(), unitToEnable.getMonth(), unitToEnable.getDate(), 'inverted' ]
                        }
                        break
                    }
                }

                // If a match was found, remove a previous duplicate entry.
                if ( matchFound ) for ( index = 0; index < disabledItemsCount; index += 1 ) {
                    if ( calendar.isDateExact( disabledItems[index], unitToEnable ) ) {
                        disabledItems[index] = null
                        break
                    }
                }

                // In the event that we’re dealing with an exact range of dates,
                // make sure there are no “inverted” dates because of it.
                if ( isExactRange ) for ( index = 0; index < disabledItemsCount; index += 1 ) {
                    if ( calendar.isDateOverlap( disabledItems[index], unitToEnable ) ) {
                        disabledItems[index] = null
                        break
                    }
                }

                // If something is still matched, add it into the collection.
                if ( matchFound ) {
                    disabledItems.push( matchFound )
                }
            })
        }

        // Return the updated collection.
        return disabledItems.filter(function( val ) { return val != null })
    } //DatePicker.prototype.activate


    /**
     * Create a string for the nodes in the picker.
     */
    DatePicker.prototype.nodes = function( isOpen ) {

        var
            calendar = this,
            settings = calendar.settings,
            calendarItem = calendar.item,
            nowObject = calendarItem.now,
            selectedObject = calendarItem.select,
            highlightedObject = calendarItem.highlight,
            viewsetObject = calendarItem.view,
            disabledCollection = calendarItem.disable,
            minLimitObject = calendarItem.min,
            maxLimitObject = calendarItem.max,


        // Create the calendar table head using a copy of weekday labels collection.
        // * We do a copy so we don't mutate the original array.
            tableHead = (function( collection, fullCollection ) {

                // If the first day should be Monday, move Sunday to the end.
                if ( settings.firstDay ) {
                    collection.push( collection.shift() )
                    fullCollection.push( fullCollection.shift() )
                }

                // Create and return the table head group.
                return _.node(
                    'thead',
                    _.node(
                        'tr',
                        _.group({
                            min: 0,
                            max: DAYS_IN_WEEK - 1,
                            i: 1,
                            node: 'th',
                            item: function( counter ) {
                                return [
                                    collection[ counter ],
                                    settings.klass.weekdays,
                                    'scope=col title="' + fullCollection[ counter ] + '"'
                                ]
                            }
                        })
                    )
                ) //endreturn

                // Materialize modified
            })( ( settings.showWeekdaysFull ? settings.weekdaysFull : settings.weekdaysLetter ).slice( 0 ), settings.weekdaysFull.slice( 0 ) ), //tableHead


        // Create the nav for next/prev month.
            createMonthNav = function( next ) {

                // Otherwise, return the created month tag.
                return _.node(
                    'div',
                    ' ',
                    settings.klass[ 'nav' + ( next ? 'Next' : 'Prev' ) ] + (

                        // If the focused month is outside the range, disabled the button.
                        ( next && viewsetObject.year >= maxLimitObject.year && viewsetObject.month >= maxLimitObject.month ) ||
                        ( !next && viewsetObject.year <= minLimitObject.year && viewsetObject.month <= minLimitObject.month ) ?
                        ' ' + settings.klass.navDisabled : ''
                    ),
                    'data-nav=' + ( next || -1 ) + ' ' +
                    _.ariaAttr({
                        role: 'button',
                        controls: calendar.$node[0].id + '_table'
                    }) + ' ' +
                    'title="' + (next ? settings.labelMonthNext : settings.labelMonthPrev ) + '"'
                ) //endreturn
            }, //createMonthNav


        // Create the month label.
        //Materialize modified
            createMonthLabel = function(override) {

                var monthsCollection = settings.showMonthsShort ? settings.monthsShort : settings.monthsFull

                // Materialize modified
                if (override == "short_months") {
                    monthsCollection = settings.monthsShort;
                }

                // If there are months to select, add a dropdown menu.
                if ( settings.selectMonths  && override == undefined) {

                    return _.node( 'select',
                        _.group({
                            min: 0,
                            max: 11,
                            i: 1,
                            node: 'option',
                            item: function( loopedMonth ) {

                                return [

                                    // The looped month and no classes.
                                    monthsCollection[ loopedMonth ], 0,

                                    // Set the value and selected index.
                                    'value=' + loopedMonth +
                                    ( viewsetObject.month == loopedMonth ? ' selected' : '' ) +
                                    (
                                        (
                                            ( viewsetObject.year == minLimitObject.year && loopedMonth < minLimitObject.month ) ||
                                            ( viewsetObject.year == maxLimitObject.year && loopedMonth > maxLimitObject.month )
                                        ) ?
                                            ' disabled' : ''
                                    )
                                ]
                            }
                        }),
                        settings.klass.selectMonth + ' browser-default',
                        ( isOpen ? '' : 'disabled' ) + ' ' +
                        _.ariaAttr({ controls: calendar.$node[0].id + '_table' }) + ' ' +
                        'title="' + settings.labelMonthSelect + '"'
                    )
                }

                // Materialize modified
                if (override == "short_months")
                    if (selectedObject != null)
                        return _.node( 'div', monthsCollection[ selectedObject.month ] );
                    else return _.node( 'div', monthsCollection[ viewsetObject.month ] );

                // If there's a need for a month selector
                return _.node( 'div', monthsCollection[ viewsetObject.month ], settings.klass.month )
            }, //createMonthLabel


        // Create the year label.
        // Materialize modified
            createYearLabel = function(override) {

                var focusedYear = viewsetObject.year,

                // If years selector is set to a literal "true", set it to 5. Otherwise
                // divide in half to get half before and half after focused year.
                    numberYears = settings.selectYears === true ? 5 : ~~( settings.selectYears / 2 )

                // If there are years to select, add a dropdown menu.
                if ( numberYears ) {

                    var
                        minYear = minLimitObject.year,
                        maxYear = maxLimitObject.year,
                        lowestYear = focusedYear - numberYears,
                        highestYear = focusedYear + numberYears

                    // If the min year is greater than the lowest year, increase the highest year
                    // by the difference and set the lowest year to the min year.
                    if ( minYear > lowestYear ) {
                        highestYear += minYear - lowestYear
                        lowestYear = minYear
                    }

                    // If the max year is less than the highest year, decrease the lowest year
                    // by the lower of the two: available and needed years. Then set the
                    // highest year to the max year.
                    if ( maxYear < highestYear ) {

                        var availableYears = lowestYear - minYear,
                            neededYears = highestYear - maxYear

                        lowestYear -= availableYears > neededYears ? neededYears : availableYears
                        highestYear = maxYear
                    }

                    if ( settings.selectYears  && override == undefined ) {
                        return _.node( 'select',
                            _.group({
                                min: lowestYear,
                                max: highestYear,
                                i: 1,
                                node: 'option',
                                item: function( loopedYear ) {
                                    return [

                                        // The looped year and no classes.
                                        loopedYear, 0,

                                        // Set the value and selected index.
                                        'value=' + loopedYear + ( focusedYear == loopedYear ? ' selected' : '' )
                                    ]
                                }
                            }),
                            settings.klass.selectYear + ' browser-default',
                            ( isOpen ? '' : 'disabled' ) + ' ' + _.ariaAttr({ controls: calendar.$node[0].id + '_table' }) + ' ' +
                            'title="' + settings.labelYearSelect + '"'
                        )
                    }
                }

                // Materialize modified
                if (override == "raw")
                    return _.node( 'div', focusedYear )

                // Otherwise just return the year focused
                return _.node( 'div', focusedYear, settings.klass.year )
            } //createYearLabel


        // Materialize modified
        createDayLabel = function() {
            if (selectedObject != null)
                return _.node( 'div', selectedObject.date)
            else return _.node( 'div', nowObject.date)
        }
        createWeekdayLabel = function() {
            var display_day;

            if (selectedObject != null)
                display_day = selectedObject.day;
            else
                display_day = nowObject.day;
            var weekday = settings.weekdaysFull[ display_day ]
            return weekday
        }


        // Create and return the entire calendar.
        return _.node(
                // Date presentation View
                'div',
                _.node(
                    'div',
                    createWeekdayLabel(),
                    "picker__weekday-display"
                )+
                _.node(
                    // Div for short Month
                    'div',
                    createMonthLabel("short_months"),
                    settings.klass.month_display
                )+
                _.node(
                    // Div for Day
                    'div',
                    createDayLabel() ,
                    settings.klass.day_display
                )+
                _.node(
                    // Div for Year
                    'div',
                    createYearLabel("raw") ,
                    settings.klass.year_display
                ),
                settings.klass.date_display
            )+
                // Calendar container
            _.node('div',
                _.node('div',
                    ( settings.selectYears ?  createMonthLabel() + createYearLabel() : createMonthLabel() + createYearLabel() ) +
                    createMonthNav() + createMonthNav( 1 ),
                    settings.klass.header
                ) + _.node(
                    'table',
                    tableHead +
                    _.node(
                        'tbody',
                        _.group({
                            min: 0,
                            max: WEEKS_IN_CALENDAR - 1,
                            i: 1,
                            node: 'tr',
                            item: function( rowCounter ) {

                                // If Monday is the first day and the month starts on Sunday, shift the date back a week.
                                var shiftDateBy = settings.firstDay && calendar.create([ viewsetObject.year, viewsetObject.month, 1 ]).day === 0 ? -7 : 0

                                return [
                                    _.group({
                                        min: DAYS_IN_WEEK * rowCounter - viewsetObject.day + shiftDateBy + 1, // Add 1 for weekday 0index
                                        max: function() {
                                            return this.min + DAYS_IN_WEEK - 1
                                        },
                                        i: 1,
                                        node: 'td',
                                        item: function( targetDate ) {

                                            // Convert the time date from a relative date to a target date.
                                            targetDate = calendar.create([ viewsetObject.year, viewsetObject.month, targetDate + ( settings.firstDay ? 1 : 0 ) ])

                                            var isSelected = selectedObject && selectedObject.pick == targetDate.pick,
                                                isHighlighted = highlightedObject && highlightedObject.pick == targetDate.pick,
                                                isDisabled = disabledCollection && calendar.disabled( targetDate ) || targetDate.pick < minLimitObject.pick || targetDate.pick > maxLimitObject.pick,
                                                formattedDate = _.trigger( calendar.formats.toString, calendar, [ settings.format, targetDate ] )

                                            return [
                                                _.node(
                                                    'div',
                                                    targetDate.date,
                                                    (function( klasses ) {

                                                        // Add the `infocus` or `outfocus` classes based on month in view.
                                                        klasses.push( viewsetObject.month == targetDate.month ? settings.klass.infocus : settings.klass.outfocus )

                                                        // Add the `today` class if needed.
                                                        if ( nowObject.pick == targetDate.pick ) {
                                                            klasses.push( settings.klass.now )
                                                        }

                                                        // Add the `selected` class if something's selected and the time matches.
                                                        if ( isSelected ) {
                                                            klasses.push( settings.klass.selected )
                                                        }

                                                        // Add the `highlighted` class if something's highlighted and the time matches.
                                                        if ( isHighlighted ) {
                                                            klasses.push( settings.klass.highlighted )
                                                        }

                                                        // Add the `disabled` class if something's disabled and the object matches.
                                                        if ( isDisabled ) {
                                                            klasses.push( settings.klass.disabled )
                                                        }

                                                        return klasses.join( ' ' )
                                                    })([ settings.klass.day ]),
                                                    'data-pick=' + targetDate.pick + ' ' + _.ariaAttr({
                                                        role: 'gridcell',
                                                        label: formattedDate,
                                                        selected: isSelected && calendar.$node.val() === formattedDate ? true : null,
                                                        activedescendant: isHighlighted ? true : null,
                                                        disabled: isDisabled ? true : null
                                                    })
                                                ),
                                                '',
                                                _.ariaAttr({ role: 'presentation' })
                                            ] //endreturn
                                        }
                                    })
                                ] //endreturn
                            }
                        })
                    ),
                    settings.klass.table,
                    'id="' + calendar.$node[0].id + '_table' + '" ' + _.ariaAttr({
                        role: 'grid',
                        controls: calendar.$node[0].id,
                        readonly: true
                    })
                )
                , settings.klass.calendar_container) // end calendar

            +

                // * For Firefox forms to submit, make sure to set the buttons’ `type` attributes as “button”.
            _.node(
                'div',
                _.node( 'button', settings.today, "btn-flat picker__today",
                    'type=button data-pick=' + nowObject.pick +
                    ( isOpen && !calendar.disabled(nowObject) ? '' : ' disabled' ) + ' ' +
                    _.ariaAttr({ controls: calendar.$node[0].id }) ) +
                _.node( 'button', settings.clear, "btn-flat picker__clear",
                    'type=button data-clear=1' +
                    ( isOpen ? '' : ' disabled' ) + ' ' +
                    _.ariaAttr({ controls: calendar.$node[0].id }) ) +
                _.node('button', settings.close, "btn-flat picker__close",
                    'type=button data-close=true ' +
                    ( isOpen ? '' : ' disabled' ) + ' ' +
                    _.ariaAttr({ controls: calendar.$node[0].id }) ),
                settings.klass.footer
            ) //endreturn
    } //DatePicker.prototype.nodes




    /**
     * The date picker defaults.
     */
    DatePicker.defaults = (function( prefix ) {

        return {

            // The title label to use for the month nav buttons
            labelMonthNext: 'Next month',
            labelMonthPrev: 'Previous month',

            // The title label to use for the dropdown selectors
            labelMonthSelect: 'Select a month',
            labelYearSelect: 'Select a year',

            // Months and weekdays
            monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
            monthsShort: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
            weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
            weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

            // Materialize modified
            weekdaysLetter: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],

            // Today and clear
            today: '今天',
            clear: '清空',
            close: '关闭',

            // The format to show on the `input` element
            format: 'd mmmm, yyyy',

            // Classes
            klass: {

                table: prefix + 'table',

                header: prefix + 'header',


                // Materialize Added klasses
                date_display: prefix + 'date-display',
                day_display: prefix + 'day-display',
                month_display: prefix + 'month-display',
                year_display: prefix + 'year-display',
                calendar_container: prefix + 'calendar-container',
                // end



                navPrev: prefix + 'nav--prev',
                navNext: prefix + 'nav--next',
                navDisabled: prefix + 'nav--disabled',

                month: prefix + 'month',
                year: prefix + 'year',

                selectMonth: prefix + 'select--month',
                selectYear: prefix + 'select--year',

                weekdays: prefix + 'weekday',

                day: prefix + 'day',
                disabled: prefix + 'day--disabled',
                selected: prefix + 'day--selected',
                highlighted: prefix + 'day--highlighted',
                now: prefix + 'day--today',
                infocus: prefix + 'day--infocus',
                outfocus: prefix + 'day--outfocus',

                footer: prefix + 'footer',

                buttonClear: prefix + 'button--clear',
                buttonToday: prefix + 'button--today',
                buttonClose: prefix + 'button--close'
            }
        }
    })( Picker.klasses().picker + '__' )





    /**
     * Extend the picker to add the date picker.
     */
    Picker.extend( 'pickadate', DatePicker )


}));


;(function ($) {

    $.fn.characterCounter = function(){
        return this.each(function(){
            var $input = $(this);
            var $counterElement = $input.parent().find('span[class="character-counter"]');

            // character counter has already been added appended to the parent container
            if ($counterElement.length) {
                return;
            }

            var itHasLengthAttribute = $input.attr('length') !== undefined;

            if(itHasLengthAttribute){
                $input.on('input', updateCounter);
                $input.on('focus', updateCounter);
                $input.on('blur', removeCounterElement);

                addCounterElement($input);
            }

        });
    };

    function updateCounter(){
        var maxLength     = +$(this).attr('length'),
            actualLength      = +$(this).val().length,
            isValidLength     = actualLength <= maxLength;

        $(this).parent().find('span[class="character-counter"]')
            .html( actualLength + '/' + maxLength);

        addInputStyle(isValidLength, $(this));
    }

    function addCounterElement($input) {
        var $counterElement = $input.parent().find('span[class="character-counter"]');

        if ($counterElement.length) {
            return;
        }

        $counterElement = $('<span/>')
            .addClass('character-counter')
            .css('float','right')
            .css('font-size','12px')
            .css('height', 1);

        $input.parent().append($counterElement);
    }

    function removeCounterElement(){
        $(this).parent().find('span[class="character-counter"]').html('');
    }

    function addInputStyle(isValidLength, $input){
        var inputHasInvalidClass = $input.hasClass('invalid');
        if (isValidLength && inputHasInvalidClass) {
            $input.removeClass('invalid');
        }
        else if(!isValidLength && !inputHasInvalidClass){
            $input.removeClass('valid');
            $input.addClass('invalid');
        }
    }

    $(document).ready(function(){
        $('input, textarea').characterCounter();
    });

}( jQuery ));
;(function ($) {

    var methods = {

        init : function(options) {
            var defaults = {
                time_constant: 200, // ms
                dist: -100, // zoom scale TODO: make this more intuitive as an option
                shift: 0, // spacing for center image
                padding: 0, // Padding between non center items
                full_width: false // Change to full width styles
            };
            options = $.extend(defaults, options);

            return this.each(function() {

                var images, offset, center, pressed, dim, count,
                    reference, referenceY, amplitude, target, velocity,
                    xform, frame, timestamp, ticker, dragged, vertical_dragged;

                // Initialize
                var view = $(this);
                // Don't double initialize.
                if (view.hasClass('initialized')) {
                    return true;
                }

                // Options
                if (options.full_width) {
                    options.dist = 0;
                    imageHeight = view.find('.carousel-item img').first().load(function(){
                        view.css('height', $(this).height());
                    });
                }

                view.addClass('initialized');
                pressed = false;
                offset = target = 0;
                images = [];
                item_width = view.find('.carousel-item').first().innerWidth();
                dim = item_width * 2 + options.padding;

                view.find('.carousel-item').each(function () {
                    images.push($(this)[0]);
                });

                count = images.length;


                function setupEvents() {
                    if (typeof window.ontouchstart !== 'undefined') {
                        view[0].addEventListener('touchstart', tap);
                        view[0].addEventListener('touchmove', drag);
                        view[0].addEventListener('touchend', release);
                    }
                    view[0].addEventListener('mousedown', tap);
                    view[0].addEventListener('mousemove', drag);
                    view[0].addEventListener('mouseup', release);
                    view[0].addEventListener('click', click);
                }

                function xpos(e) {
                    // touch event
                    if (e.targetTouches && (e.targetTouches.length >= 1)) {
                        return e.targetTouches[0].clientX;
                    }

                    // mouse event
                    return e.clientX;
                }

                function ypos(e) {
                    // touch event
                    if (e.targetTouches && (e.targetTouches.length >= 1)) {
                        return e.targetTouches[0].clientY;
                    }

                    // mouse event
                    return e.clientY;
                }

                function wrap(x) {
                    return (x >= count) ? (x % count) : (x < 0) ? wrap(count + (x % count)) : x;
                }

                function scroll(x) {
                    var i, half, delta, dir, tween, el, alignment, xTranslation;

                    offset = (typeof x === 'number') ? x : offset;
                    center = Math.floor((offset + dim / 2) / dim);
                    delta = offset - center * dim;
                    dir = (delta < 0) ? 1 : -1;
                    tween = -dir * delta * 2 / dim;

                    if (!options.full_width) {
                        alignment = 'translateX(' + (view[0].clientWidth - item_width) / 2 + 'px) ';
                        alignment += 'translateY(' + (view[0].clientHeight - item_width) / 2 + 'px)';
                    } else {
                        alignment = 'translateX(0)';
                    }

                    // center
                    el = images[wrap(center)];
                    el.style[xform] = alignment +
                        ' translateX(' + (-delta / 2) + 'px)' +
                        ' translateX(' + (dir * options.shift * tween * i) + 'px)' +
                        ' translateZ(' + (options.dist * tween) + 'px)';
                    el.style.zIndex = 0;
                    if (options.full_width) { tweenedOpacity = 1; }
                    else { tweenedOpacity = 1 - 0.2 * tween; }
                    el.style.opacity = tweenedOpacity;
                    half = count >> 1;

                    for (i = 1; i <= half; ++i) {
                        // right side
                        if (options.full_width) {
                            zTranslation = options.dist;
                            tweenedOpacity = (i === half && delta < 0) ? 1 - tween : 1;
                        } else {
                            zTranslation = options.dist * (i * 2 + tween * dir);
                            tweenedOpacity = 1 - 0.2 * (i * 2 + tween * dir);
                        }
                        el = images[wrap(center + i)];
                        el.style[xform] = alignment +
                            ' translateX(' + (options.shift + (dim * i - delta) / 2) + 'px)' +
                            ' translateZ(' + zTranslation + 'px)';
                        el.style.zIndex = -i;
                        el.style.opacity = tweenedOpacity;


                        // left side
                        if (options.full_width) {
                            zTranslation = options.dist;
                            tweenedOpacity = (i === half && delta > 0) ? 1 - tween : 1;
                        } else {
                            zTranslation = options.dist * (i * 2 - tween * dir);
                            tweenedOpacity = 1 - 0.2 * (i * 2 - tween * dir);
                        }
                        el = images[wrap(center - i)];
                        el.style[xform] = alignment +
                            ' translateX(' + (-options.shift + (-dim * i - delta) / 2) + 'px)' +
                            ' translateZ(' + zTranslation + 'px)';
                        el.style.zIndex = -i;
                        el.style.opacity = tweenedOpacity;
                    }

                    // center
                    el = images[wrap(center)];
                    el.style[xform] = alignment +
                        ' translateX(' + (-delta / 2) + 'px)' +
                        ' translateX(' + (dir * options.shift * tween) + 'px)' +
                        ' translateZ(' + (options.dist * tween) + 'px)';
                    el.style.zIndex = 0;
                    if (options.full_width) { tweenedOpacity = 1; }
                    else { tweenedOpacity = 1 - 0.2 * tween; }
                    el.style.opacity = tweenedOpacity;
                }

                function track() {
                    var now, elapsed, delta, v;

                    now = Date.now();
                    elapsed = now - timestamp;
                    timestamp = now;
                    delta = offset - frame;
                    frame = offset;

                    v = 1000 * delta / (1 + elapsed);
                    velocity = 0.8 * v + 0.2 * velocity;
                }

                function autoScroll() {
                    var elapsed, delta;

                    if (amplitude) {
                        elapsed = Date.now() - timestamp;
                        delta = amplitude * Math.exp(-elapsed / options.time_constant);
                        if (delta > 2 || delta < -2) {
                            scroll(target - delta);
                            requestAnimationFrame(autoScroll);
                        } else {
                            scroll(target);
                        }
                    }
                }

                function click(e) {
                    // Disable clicks if carousel was dragged.
                    if (dragged) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;

                    } else if (!options.full_width) {
                        var clickedIndex = $(e.target).closest('.carousel-item').index();
                        var diff = (center % count) - clickedIndex;

                        // Account for wraparound.
                        if (diff < 0) {
                            if (Math.abs(diff + count) < Math.abs(diff)) { diff += count; }

                        } else if (diff > 0) {
                            if (Math.abs(diff - count) < diff) { diff -= count; }
                        }

                        // Call prev or next accordingly.
                        if (diff < 0) {
                            $(this).trigger('carouselNext', [Math.abs(diff)]);

                        } else if (diff > 0) {
                            $(this).trigger('carouselPrev', [diff]);
                        }
                    }
                }

                function tap(e) {
                    pressed = true;
                    dragged = false;
                    vertical_dragged = false;
                    reference = xpos(e);
                    referenceY = ypos(e);

                    velocity = amplitude = 0;
                    frame = offset;
                    timestamp = Date.now();
                    clearInterval(ticker);
                    ticker = setInterval(track, 100);

                }

                function drag(e) {
                    var x, delta, deltaY;
                    if (pressed) {
                        x = xpos(e);
                        y = ypos(e);
                        delta = reference - x;
                        deltaY = Math.abs(referenceY - y);
                        if (deltaY < 30 && !vertical_dragged) {
                            // If vertical scrolling don't allow dragging.
                            if (delta > 2 || delta < -2) {
                                dragged = true;
                                reference = x;
                                scroll(offset + delta);
                            }

                        } else if (dragged) {
                            // If dragging don't allow vertical scroll.
                            e.preventDefault();
                            e.stopPropagation();
                            return false;

                        } else {
                            // Vertical scrolling.
                            vertical_dragged = true;
                        }
                    }

                    if (dragged) {
                        // If dragging don't allow vertical scroll.
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }

                function release(e) {
                    pressed = false;

                    clearInterval(ticker);
                    target = offset;
                    if (velocity > 10 || velocity < -10) {
                        amplitude = 0.9 * velocity;
                        target = offset + amplitude;
                    }
                    target = Math.round(target / dim) * dim;
                    amplitude = target - offset;
                    timestamp = Date.now();
                    requestAnimationFrame(autoScroll);

                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                xform = 'transform';
                ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
                    var e = prefix + 'Transform';
                    if (typeof document.body.style[e] !== 'undefined') {
                        xform = e;
                        return false;
                    }
                    return true;
                });



                window.onresize = scroll;

                setupEvents();
                scroll(offset);

                $(this).on('carouselNext', function(e, n) {
                    if (n === undefined) {
                        n = 1;
                    }
                    target = offset + dim * n;
                    if (offset !== target) {
                        amplitude = target - offset;
                        timestamp = Date.now();
                        requestAnimationFrame(autoScroll);
                    }
                });

                $(this).on('carouselPrev', function(e, n) {
                    if (n === undefined) {
                        n = 1;
                    }
                    target = offset - dim * n;
                    if (offset !== target) {
                        amplitude = target - offset;
                        timestamp = Date.now();
                        requestAnimationFrame(autoScroll);
                    }
                });

            });



        },
        next : function(n) {
            $(this).trigger('carouselNext', [n]);
        },
        prev : function(n) {
            $(this).trigger('carouselPrev', [n]);
        },
    };


    $.fn.carousel = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.carousel' );
        }
    }; // Plugin end
}( jQuery ));
















