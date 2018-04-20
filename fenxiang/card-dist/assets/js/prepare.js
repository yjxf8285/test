/**
 * 纷享资源脚本
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("jslibs/prepare",["util","widget"],function(a){var b=a("util"),c=a("widget");Backbone.ajax=b.api,function(){function a(a,c){var d=a.match(f),g=d[1]+e+c.cid,h=d[2]||void 0;return h&&h.indexOf("{{")>-1&&(h=b(h,c)),{type:g,selector:h}}function b(a,b){return a.replace(g,function(a,c){for(var e,f=c.split("."),g=b;e=f.shift();)g=g===b.attrs?b.get(e):g[e];return d(g)?g:h})}function d(a){return"[object String]"===i.call(a)}var e=".delegate-events-",f=/^(\S+)\s*(.*)$/,g=/{{([^}]+)}}/g,h="INVALID_SELECTOR";c.prototype.undelegateEvents=function(b){var c={};return 0===arguments.length?c.type=e+this.cid:c=a(b,this),this.element&&this.element.off(c.type,c.selector),this};var i=Object.prototype.toString}()});