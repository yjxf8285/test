/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("arale/iframe-shim/1.0.1/iframe-shim-debug",["$-debug","arale/position/1.0.0/position-debug"],function(a,b,c){function d(a){this.target=g(a).eq(0)}function e(){}function f(a){var b={display:"none",border:"none",opacity:0,position:"absolute"},c=a.css("zIndex");return c&&c>0&&(b.zIndex=c-1),g("<iframe>",{src:"javascript:''",frameborder:0,css:b}).insertBefore(a)}var g=a("$-debug"),h=a("arale/position/1.0.0/position-debug");d.prototype.sync=function(){var a=this.target,b=this.iframe;if(!a.length)return this;var c=a.outerHeight(),d=a.outerWidth();return c&&d&&!a.is(":hidden")?(b||(b=this.iframe=f(a)),b.css({height:c,width:d}),h.pin(b[0],a[0]),b.show()):b&&b.hide(),this},d.prototype.destroy=function(){this.iframe&&(this.iframe.remove(),delete this.iframe),delete this.target},g.browser.msie&&"6.0"===g.browser.version?c.exports=d:(e.prototype.sync=e,e.prototype.destroy=e,c.exports=e)});