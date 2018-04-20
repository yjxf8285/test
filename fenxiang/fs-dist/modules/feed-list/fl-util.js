/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("modules/feed-list/fl-util",["dialog","overlay","./fl-util.css"],function(a,b,c){var d=a("dialog"),e=a("overlay");a("./fl-util.css");var f={intval:function(a){return a=parseInt(a),isNaN(a)?0:a},getPos:function(a){for(var b=0,c=0,d=this.intval(a.style.width),e=this.intval(a.style.height),f=a.offsetWidth,g=a.offsetHeight;a.offsetParent;)b+=a.offsetLeft+(a.currentStyle?this.intval(a.currentStyle.borderLeftWidth):0),c+=a.offsetTop+(a.currentStyle?this.intval(a.currentStyle.borderTopWidth):0),a=a.offsetParent;return b+=a.offsetLeft+(a.currentStyle?this.intval(a.currentStyle.borderLeftWidth):0),c+=a.offsetTop+(a.currentStyle?this.intval(a.currentStyle.borderTopWidth):0),{x:b,y:c,w:d,h:e,wb:f,hb:g}},getScroll:function(){var a,b,c,d;return document.documentElement&&document.documentElement.scrollTop?(a=document.documentElement.scrollTop,b=document.documentElement.scrollLeft,c=document.documentElement.scrollWidth,d=document.documentElement.scrollHeight):document.body&&(a=document.body.scrollTop,b=document.body.scrollLeft,c=document.body.scrollWidth,d=document.body.scrollHeight),{t:a,l:b,w:c,h:d}},scroller:function(a,b){if("object"!=typeof a&&(a=document.getElementById(a)),a){var c=this;c.el=a,c.p=this.getPos(a),c.s=this.getScroll(),c.clear=function(){window.clearInterval(c.timer),c.timer=null},c.t=(new Date).getTime(),c.step=function(){var a,d,e=(new Date).getTime(),f=(e-c.t)/b;e>=b+c.t?(c.clear(),window.setTimeout(function(){c.scroll(c.p.y,c.p.x)},13)):(a=(-Math.cos(f*Math.PI)/2+.5)*(c.p.y-c.s.t)+c.s.t,d=(-Math.cos(f*Math.PI)/2+.5)*(c.p.x-c.s.l)+c.s.l,c.scroll(a,d))},c.scroll=function(a,b){window.scrollTo(b,a)},c.timer=window.setInterval(function(){c.step()},13)}},checkboxIsoverstep:function(a,b,c){var d=$("input[type=checkbox]",a);d.on("click",function(){var d=$(":checked",a).length;d>b&&($(this).prop("checked",!1),c())})},showTip:function(a){var b={template:'<div class="fl-showtip"><h3>我是标题</h3></div>',width:200,height:"auto",align:{selfXY:["center","bottom"],baseElement:".fl-showtip-btn",baseXY:["center",0]},zIndex:9999},c=$.extend(b,a);return tip=new e(c)},showSlideUpTip:function(a){a=_.extend({element:null,autohide:!0,width:500,height:300,top:4,template:"关注成功！",callback:function(){}},a||{});var b=new Date,c=b.getTime();this.id=c,new e({template:'<div class="show-slide-up-tip-warp" id="'+c+'"><div class="show-slide-up-tip-conent">'+a.template+"</div></div>",autohide:a.autohide,width:a.width,height:a.height,align:{selfXY:["center","bottom"],baseElement:a.element,baseXY:["center","top-"+a.top+"px"]},zIndex:9999}).render().show();var d=$("#"+c);$(".show-slide-up-tip-warp",d);var f=$(".show-slide-up-tip-conent",d),g=250;f.css({bottom:-a.height}),f.animate({bottom:"0"},g),a.autohide&&setTimeout(function(){h()},1500),d.on("click ",".f-cancel",function(){h()}),d.on("click ",".f-sub",function(){a.callback(),h()});var h=function(){f.animate({bottom:-a.height},g,function(){d.remove(),$("IFRAME").remove()}),this.id=null}},showAlertDialog:function(a,b){var c=b||192,e=new d({width:c,closeTpl:"",visibleWithAnimate:!0,content:'<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> '+a+"</div>",className:"fs-feed-comment-dialog"}).render();e.show(),setTimeout(function(){e.hide()},1500)},showConformDialog:function(a){var b=new d({width:"",closeTpl:"",content:'<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> '+a+"</div>",className:"fs-feed-comment-dialog"}).render();b.show(),setTimeout(function(){b.hide()},1500)},cutStrForNum:function(a,b){var c=a;return a.split(""),a.length>=b&&(c=a.substring(0,b)+"…"),c},delStrLink:function(a){var b=/(<a.*?>)|(<\/a>)/g;return a=a.replace(b,"")},tarClickTip:function(a,b){$("."+a).click(function(){$("."+b).show()}),$(document).on("click",function(c){var c=c?c:window.event,d=c.srcElement||c.target,e=$(d).attr("class");e!=a&&e!=b&&$("."+b).hide()})}};c.exports=f});