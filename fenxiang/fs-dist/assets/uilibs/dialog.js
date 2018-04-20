define("uilibs/dialog",["dialog_core","dnd","mask"],function(a,b,c){var d,e=a("dialog_core"),f=a("dnd"),g=a("mask"),h=".dialog",i=[];$(function(){d=$('<div class="ui-dialog-drag-proxy fn-hide-abs"></div>'),d.appendTo("body")});var j=e.extend({attrs:{enableDrag:!0,visibleWithAnimate:!1,hideWithEsc:!1},_onRenderVisible:function(a){var b=this.get("visibleWithAnimate");b?a?this.element.fadeIn(200):this.element.fadeOut(200):this.element[a?"show":"hide"]()},_onRenderZIndex:function(a){return this.get("hasMask")&&g.set("zIndex",parseInt(a,10)-1),e.superclass._onRenderZIndex.call(this,a)},_setupMask:function(){this.before("show",function(){this.get("hasMask")&&g.show()})},_setupKeyEvents:function(){var a=this,b=this.get("hideWithEsc");b&&$(document).on("keyup."+h+this.cid,function(b){27===b.keyCode&&a.get("visible")&&a.hide()})},_setupFocus:function(){this.after("show",function(){var a=$(".auto-focus",this.element);a.length>0?a.get(0).focus():this.element.focus()}),this.after("hide",function(){this.activeTrigger&&this.activeTrigger.focus()})},render:function(){var a;return a=j.superclass.render.apply(this,arguments)},show:function(){var a,b,c=this.get("enableDrag"),e=this.element;return a=j.superclass.show.apply(this,arguments),i.push(this),this._setMaskStatus(),b=$(".ui-dialog-title",this.element),!this.dnd&&b.length>0&&c&&(this.dnd=new f(e,{drag:b,proxy:d,containment:"body"}),this.dnd.on("dragstart",function(a,c){c.width(e.width()),c.height(e.height()),b.click()})),$("textarea",this.element).each(function(){var a=$(this),b=_.str.trim(a.val()),c=a.attr("placeholder");b==c&&a.val("").trigger("autosize.resize")}),a},hide:function(){var a,b=this;return a=j.superclass.hide.apply(this,arguments),i=_.filter(i,function(a){return a!==b}),this._setMaskStatus(),a},_setMaskStatus:function(){var a=-1;_.each(i,function(b){b.get("hasMask")&&b.get("zIndex")>a&&(a=b.get("zIndex"))}),-1!=a?(g.set("zIndex",a-1),g.show()):g.hide()},destroy:function(){return this.get("trigger")&&this.get("trigger").off("click"+h+this.cid),$(document).off("keyup."+h+this.cid),this.dnd&&this.dnd.destroy(),this.element&&this.element.remove(),this._setMaskStatus(),clearInterval(this._interval),e.superclass.destroy.call(this)}});j.hideAll=function(a){a?_.each(i,function(b){b.element.is(a)&&b.hide()}):_.each(i,function(a){a.hide()})},c.exports=j});