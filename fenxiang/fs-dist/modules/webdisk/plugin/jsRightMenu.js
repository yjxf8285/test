/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("modules/webdisk/plugin/jsRightMenu",[],function(a,b,c){$.fn.showRMenu=function(a){var b=this,c=$(a).height(),d=$(a).width(),e=$(document).height(),f=$(document).width()-15;return b.each(function(){this.oncontextmenu=function(b){var g,h;document.all?(g=document.documentElement.scrollLeft+window.event.clientX,h=document.documentElement.scrollTop+window.event.clientY):(g=b.pageX,h=b.pageY);var i=h+c,j=g+d;h=i>e?h-c:h,g=j>f?g-d-15:g,$(a).css({top:h,left:g+10}).show(),document.all?window.event.returnValue=!1:b.preventDefault()},$(a).find("ul").prev("a").addClass("a_noF").click(function(){return!1}),$("a:not(.a_noF)",a).click(function(){return $(a).hide(),!1})}),b},c.exports=$.fn.showRMenu});