/**
 * 纷享资源脚本
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
!function(a){function b(b,c){function d(){return k.update(),f(),k}function e(){var a=t.toLowerCase();q.obj.css(s,u/o.ratio),n.obj.css(s,-u),w.start=q.obj.offset()[s],o.obj.css(a,p[c.axis]),p.obj.css(a,p[c.axis]),q.obj.css(a,q[c.axis])}function f(){x?m.obj[0].ontouchstart=function(a){1===a.touches.length&&(g(a.touches[0]),a.stopPropagation())}:(q.obj.bind("mousedown",g),p.obj.bind("mouseup",i)),c.scroll&&window.addEventListener?(l[0].addEventListener("DOMMouseScroll",h,!1),l[0].addEventListener("mousewheel",h,!1)):c.scroll&&(l[0].onmousewheel=h)}function g(b){a("body").addClass("noSelect");var c=parseInt(q.obj.css(s),10);w.start=r?b.pageX:b.pageY,v.start="auto"==c?0:c,x?(document.ontouchmove=function(a){a.preventDefault(),i(a.touches[0])},document.ontouchend=j):(a(document).bind("mousemove",i),a(document).bind("mouseup",j),q.obj.bind("mouseup",j))}function h(b){if(n.ratio<1){var d=b||window.event,e=d.wheelDelta?d.wheelDelta/120:-d.detail/3;u-=e*c.wheel,u=Math.min(n[c.axis]-m[c.axis],Math.max(0,u)),q.obj.css(s,u/o.ratio),n.obj.css(s,-u),(c.lockscroll||u!==n[c.axis]-m[c.axis]&&0!==u)&&(d=a.event.fix(d),d.preventDefault())}}function i(a){n.ratio<1&&(v.now=c.invertscroll&&x?Math.min(p[c.axis]-q[c.axis],Math.max(0,v.start+(w.start-(r?a.pageX:a.pageY)))):Math.min(p[c.axis]-q[c.axis],Math.max(0,v.start+((r?a.pageX:a.pageY)-w.start))),u=v.now*o.ratio,n.obj.css(s,-u),q.obj.css(s,v.now)),window.getSelection?window.getSelection().removeAllRanges():document.selection.empty()}function j(){a("body").removeClass("noSelect"),a(document).unbind("mousemove",i),a(document).unbind("mouseup",j),q.obj.unbind("mouseup",j),document.ontouchmove=document.ontouchend=null}var k=this,l=b,m={obj:a(".viewport",b)},n={obj:a(".overview",b)},o={obj:a(".scrollbar",b)},p={obj:a(".track",o.obj)},q={obj:a(".thumb",o.obj)},r="x"===c.axis,s=r?"left":"top",t=r?"Width":"Height",u=0,v={start:0,now:0},w={},x="ontouchstart"in document.documentElement;return this.update=function(a){m[c.axis]=m.obj[0]["offset"+t],n[c.axis]=n.obj[0]["scroll"+t],n.ratio=m[c.axis]/n[c.axis],o.obj.toggleClass("disable",n.ratio>=1),p[c.axis]="auto"===c.size?m[c.axis]:c.size,q[c.axis]=Math.min(p[c.axis],Math.max(0,"auto"===c.sizethumb?p[c.axis]*n.ratio:c.sizethumb)),o.ratio="auto"===c.sizethumb?n[c.axis]/p[c.axis]:(n[c.axis]-m[c.axis])/(p[c.axis]-q[c.axis]),u="relative"===a&&n.ratio<=1?Math.min(n[c.axis]-m[c.axis],Math.max(0,u)):0,u="bottom"===a&&n.ratio<=1?n[c.axis]-m[c.axis]:isNaN(parseInt(a,10))?u:parseInt(a,10),e()},d()}a.tiny=a.tiny||{},a.tiny.scrollbar={options:{axis:"y",wheel:40,scroll:!0,lockscroll:!0,size:"auto",sizethumb:"auto",invertscroll:!1}},a.fn.tinyscrollbar=function(c){var d=a.extend({},a.tiny.scrollbar.options,c);return this.each(function(){a(this).data("tsb",new b(a(this),d))}),this},a.fn.tinyscrollbar_update=function(b){return a(this).data("tsb").update(b)}}(jQuery);