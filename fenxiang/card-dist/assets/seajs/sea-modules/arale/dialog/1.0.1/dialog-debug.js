/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("arale/dialog/1.0.1/dialog-debug",["$-debug","arale/overlay/1.0.1/overlay-debug","arale/position/1.0.0/position-debug","arale/iframe-shim/1.0.1/iframe-shim-debug","arale/widget/1.0.3/widget-debug","arale/base/1.0.1/base-debug","arale/class/1.0.0/class-debug","arale/events/1.0.0/events-debug","arale/overlay/1.0.1/mask-debug","arale/widget/1.0.3/templatable-debug","gallery/handlebars/1.0.0/handlebars-debug","./dialog-tpl-debug.js"],function(a,b,c){function d(a){null==a.attr("tabindex")&&a.attr("tabindex","-1")}function e(a){var b=a[0].contentWindow.document;return b.body.scrollHeight&&b.documentElement.scrollHeight?Math.min(b.body.scrollHeight,b.documentElement.scrollHeight):b.documentElement.scrollHeight?b.documentElement.scrollHeight:b.body.scrollHeight?b.body.scrollHeight:void 0}var f=a("$-debug"),g=a("arale/overlay/1.0.1/overlay-debug"),h=a("arale/overlay/1.0.1/mask-debug"),i=a("arale/events/1.0.0/events-debug"),j=a("arale/widget/1.0.3/templatable-debug"),k=".dialog",l="300px",m=g.extend({Implements:j,attrs:{template:a("./dialog-tpl-debug"),trigger:{value:null,getter:function(a){return f(a)}},classPrefix:"ui-dialog",content:{value:"",setter:function(a){return/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(a)&&(this._type="iframe"),a}},hasMask:!0,closeTpl:"×",width:500,height:null,effect:"none",zIndex:999,autoFit:!0,align:{selfXY:["50%","50%"],baseXY:["50%","50%"]}},parseElement:function(){this.model={classPrefix:this.get("classPrefix")},m.superclass.parseElement.call(this),this.contentElement=this.$("[data-role=content]"),this.contentElement.css({background:"#fff",height:"100%",zoom:1}),this.$("[data-role=close]").hide()},events:{"click [data-role=close]":function(a){a.preventDefault(),this.hide()}},show:function(){return"iframe"===this._type&&(!this.get("height")&&this.element.css("height",l),this._showIframe()),m.superclass.show.call(this),this},hide:function(){return"iframe"===this._type&&this.iframe&&(this.iframe.attr({src:"javascript:'';"}),this.iframe.remove(),this.iframe=null),m.superclass.hide.call(this),clearInterval(this._interval),delete this._interval,this},destroy:function(){return this.get("trigger")&&this.get("trigger").off("click"+k+this.cid),f(document).off("keyup."+k+this.cid),this.element.remove(),h.hide(),clearInterval(this._interval),m.superclass.destroy.call(this)},setup:function(){m.superclass.setup.call(this),this._setupTrigger(),this._setupMask(),this._setupKeyEvents(),this._setupFocus(),d(this.element),d(this.get("trigger")),this.activeTrigger=this.get("trigger").eq(0)},_onRenderContent:function(a){if("iframe"!==this._type){var b;try{b=f(a)}catch(c){b=[]}b[0]?this.contentElement.empty().append(b):this.contentElement.empty().html(a)}},_onRenderCloseTpl:function(a){""===a?this.$("[data-role=close]").html(a).hide():this.$("[data-role=close]").html(a).show()},_onRenderVisible:function(a){a?"fade"===this.get("effect")?this.element.fadeIn(300):this.element.show():this.element.hide()},_onRenderZIndex:function(a){return h.set("zIndex",parseInt(a,10)-1),m.superclass._onRenderZIndex.call(this,a)},_setupTrigger:function(){var a=this;this.get("trigger").on("click"+k+this.cid,function(b){b.preventDefault(),a.activeTrigger=f(this),a.show()})},_setupMask:function(){this.before("show",function(){this.get("hasMask")&&h.show()}),this.after("hide",function(){this.get("hasMask")&&h.hide()})},_setupFocus:function(){this.after("show",function(){this.element.focus()}),this.after("hide",function(){this.activeTrigger&&this.activeTrigger.focus()})},_setupKeyEvents:function(){var a=this;f(document).on("keyup."+k+this.cid,function(b){27===b.keyCode&&a.get("visible")&&a.hide()})},_showIframe:function(){var a=this;this.iframe||this._createIframe(),this.iframe.attr({src:this._fixUrl(),name:"dialog-iframe"+(new Date).getTime()}),this.iframe.one("load",function(){a.get("visible")&&(a.get("autoFit")&&(clearInterval(a._interval),a._interval=setInterval(function(){a._syncHeight()},300)),a._syncHeight(),a._setPosition(),a.trigger("complete:show"))})},_fixUrl:function(){var a=this.get("content").match(/([^?#]*)(\?[^#]*)?(#.*)?/);return a.shift(),a[1]=(a[1]&&"?"!==a[1]?a[1]+"&":"?")+"t="+(new Date).getTime(),a.join("")},_createIframe:function(){var a=this;this.iframe=f("<iframe>",{src:"javascript:'';",scrolling:"no",frameborder:"no",allowTransparency:"true",css:{border:"none",width:"100%",display:"block",height:"100%",overflow:"hidden"}}).appendTo(this.contentElement),i.mixTo(this.iframe[0]),this.iframe[0].on("close",function(){a.hide()})},_syncHeight:function(){var a;if(this.get("height"))clearInterval(this._interval),delete this._interval;else{try{this._errCount=0,a=e(this.iframe)+"px"}catch(b){this._errCount=(this._errCount||0)+1,this._errCount>=6&&(a=l,clearInterval(this._interval),delete this._interval)}this.element.css("height",a),this.element[0].className=this.element[0].className}}});c.exports=m}),define("arale/dialog/1.0.1/dialog-tpl-debug",["gallery/handlebars/1.0.0/handlebars-debug"],function(a,b,c){var d=a("gallery/handlebars/1.0.0/handlebars-debug");!function(){var a=d.template;d.templates=d.templates||{},c.exports=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f,g="",h="function",i=this.escapeExpression;return g+='<div class="',(f=c.classPrefix)?f=f.call(b,{hash:{},data:e}):(f=b.classPrefix,f=typeof f===h?f.apply(b):f),g+=i(f)+'">\n    <div class="',(f=c.classPrefix)?f=f.call(b,{hash:{},data:e}):(f=b.classPrefix,f=typeof f===h?f.apply(b):f),g+=i(f)+'-close" title="关闭本框" data-role="close"></div>\n    <div class="',(f=c.classPrefix)?f=f.call(b,{hash:{},data:e}):(f=b.classPrefix,f=typeof f===h?f.apply(b):f),g+=i(f)+'-content" data-role="content"></div>\n</div>\n'})}()});