/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("arale/calendar/0.8.5/calendar-debug",["$-debug","gallery/moment/2.0.0/moment-debug","arale/overlay/1.0.1/overlay-debug","arale/position/1.0.0/position-debug","arale/iframe-shim/1.0.1/iframe-shim-debug","arale/widget/1.0.3/widget-debug","arale/base/1.0.1/base-debug","arale/class/1.0.0/class-debug","arale/events/1.0.0/events-debug","arale/widget/1.0.3/templatable-debug","gallery/handlebars/1.0.0/handlebars-debug","./calendar-tpl-debug","./model-debug"],function(a,b,c){function d(a,b){for(var c,d=b.get("mode"),e=["date","month","year"],f=0;f<e.length;f++)d[e[f]]&&(c=e[f]);if(c){var g="[data-value="+b.get(c).current.value+"]";a.find(".focused-element").removeClass("focused-element"),a.find(g).addClass("focused-element")}}var e=a("$-debug"),f=a("gallery/moment/2.0.0/moment-debug"),g=a("arale/overlay/1.0.1/overlay-debug"),h=a("arale/widget/1.0.3/templatable-debug"),i="i18n!lang",j=a(i)||{},k=a("./calendar-tpl-debug"),l=a("./model-debug"),m={trigger:null,triggerType:"click",format:"YYYY-MM-DD",output:{value:"",getter:function(a){return a=a?a:this.get("trigger"),e(a)}},align:{getter:function(){var a=this.get("trigger");return a?{selfXY:[0,0],baseElement:a,baseXY:[0,e(a).height()+10]}:{selfXY:[0,0],baseXY:[0,0]}}},startDay:"Sun",showTime:!1,hideOnSelect:!0,focus:{value:"",getter:function(a){return a=a?a:e(this.get("trigger")).val(),a?f(a,this.get("format")):f()}},range:null,template:k,model:{getter:function(){if(!this.hasOwnProperty("model")){var a={focus:this.get("focus"),range:this.get("range"),showTime:this.get("showTime"),startDay:this.get("startDay")};this.model=new l(a)}return this.model}}},n=g.extend({Implements:[h],attrs:m,events:{"click [data-role=mode-year]":"_changeMode","click [data-role=prev-year]":"prevYear","click [data-role=next-year]":"nextYear","click [data-role=mode-month]":"_changeMode","click [data-role=prev-month]":"prevMonth","click [data-role=next-month]":"nextMonth","click [data-role=previous-10-year]":"_selectYear","click [data-role=next-10-year]":"_selectYear","click [data-role=year]":"_selectYear","click [data-role=month]":"_selectMonth","click [data-role=day]":"_selectDay","click [data-role=date]":"_selectDate","click [data-role=today]":"_selectToday"},templateHelpers:{_:function(a){return j[a]||a}},setup:function(){n.superclass.setup.call(this);var a=this,b=e(this.get("trigger"));b.on(this.get("triggerType"),function(){a.show(),d(a.element,a.model)}),b.on("keydown",function(b){a._keyControl(b)}),b.on("blur",function(){a.hide()}),a.element.on("mousedown",function(a){if(e.browser.msie&&parseInt(e.browser.version,10)<9){var c=b[0];c.onbeforedeactivate=function(){window.event.returnValue=!1,c.onbeforedeactivate=null}}a.preventDefault()});var c=this.model;c.on("changeStartday changeMode",function(){a.renderPartial("[data-role=data-container]"),a.renderPartial("[data-role=pannel-container]"),a.renderPartial("[data-role=month-year-container]"),d(a.element,a.model)}),c.on("changeMonth changeYear",function(){var b=c.get("mode");(b.date||b.year)&&a.renderPartial("[data-role=data-container]"),a.renderPartial("[data-role=month-year-container]"),d(a.element,a.model)}),c.on("changeRange",function(){a.renderPartial("[data-role=data-container]")}),c.on("refresh",function(){d(a.element,a.model)})},show:function(){n.superclass.show.call(this);var a=this.get("output"),b=a.val();b&&this.setFocus(f(b,this.get("format")))},range:function(a){this.model.changeRange(a)},prevYear:function(){this.model.changeYear(-1)},nextYear:function(){this.model.changeYear(1)},prevMonth:function(){this.model.changeMonth(-1)},nextMonth:function(){this.model.changeMonth(1)},setFocus:function(a){this.model.selectDate(a),this.model.changeMode("date"),d(this.element,this.model)},_selectYear:function(a){var b=e(a.target);"year"===b.data("role")?this.model.changeMode("date",{year:b.data("value")}):this.model.changeMode("year",{year:b.data("value")})},_selectMonth:function(a){var b=e(a.target);this.model.changeMode("date",{month:b.data("value")})},_selectDay:function(a){var b=e(a.target);this.model.changeStartDay(b.data("value"))},_selectDate:function(a){var b=e(a.target),c=this.model.selectDate(b.data("value"));this._fillDate(c)},_selectToday:function(){var a=f().format("YYYY-MM-DD"),b=this.model.selectDate(a);this._fillDate(b)},_changeMode:function(a){var b=e(a.target).data("role").substring(5);this.model.changeMode(b)},_keyControl:function(a){var b={68:"date",77:"month",89:"year"};if(a.keyCode in b)return this.model.changeMode(b[a.keyCode]),a.preventDefault(),!1;var c={13:"enter",27:"esc",37:"left",38:"up",39:"right",40:"down"};if(a.keyCode in c){a.preventDefault();var d=c[a.keyCode],e=this.model.get("mode");a.shiftKey&&"down"===d?this.nextYear():a.shiftKey&&"up"===d?this.prevYear():a.shiftKey&&"right"===d?this.nextMonth():a.shiftKey&&"left"===d?this.prevMonth():"esc"===d?this.hide():e.date?this._keyControlDate(d):e.month?this._keyControlMonth(d):e.year&&this._keyControlYear(d)}},_keyControlDate:function(a){if("enter"===a){var b=this.model.selectDate();return this._fillDate(b),void 0}var c={right:1,left:-1,up:-7,down:7};this.model.changeDate(c[a])},_keyControlMonth:function(a){if("enter"===a){var b=this.model.selectDate();return this.model.changeMode("date",{month:b.month()}),void 0}var c={right:1,left:-1,up:-3,down:3};this.model.changeMonth(c[a])},_keyControlYear:function(a){if("enter"===a){var b=this.model.selectDate();return this.model.changeMode("date",{year:b.year()}),void 0}var c={right:1,left:-1,up:-3,down:3};this.model.changeYear(c[a])},_fillDate:function(a){if(!this.model.isInRange(a))return this.trigger("selectDisabledDate",a),this;this.trigger("selectDate",a);var b=this.get("trigger");if(!b)return this;var c=this.get("output");if("undefined"==typeof c[0].value)return this;var d=a.format(this.get("format"));c.val(d),this.get("hideOnSelect")&&this.hide()}});n.autoRender=function(a){a.trigger=a.element,a.element="",new n(a)},c.exports=n}),define("arale/calendar/0.8.5/calendar-tpl-debug",["gallery/handlebars/1.0.0/handlebars-debug"],function(a,b,c){var d=a("gallery/handlebars/1.0.0/handlebars-debug");!function(){var a=d.template;d.templates=d.templates||{},c.exports=a(function(a,b,c,d,e){function f(a,b){var d,e,f="";return f+="\n        ",e=c.each.call(a,(d=a.day,null==d||d===!1?d:d.items),{hash:{},inverse:z.noop,fn:z.program(2,g,b),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function g(a,b){var d,e,f="";return f+='\n        <li class="ui-calendar-day ui-calendar-day-',(d=c.value)?d=d.call(a,{hash:{},data:b}):(d=a.value,d=typeof d===w?d.apply(a):d),f+=x(d)+'" data-role="day" data-value="',(d=c.value)?d=d.call(a,{hash:{},data:b}):(d=a.value,d=typeof d===w?d.apply(a):d),f+=x(d)+'">',e={hash:{},data:b},f+=x((d=c._,d?d.call(a,a.label,e):y.call(a,"_",a.label,e)))+"</li>\n        "}function h(a,b){var d,e,f="";return f+="\n        ",e=c.each.call(a,(d=a.date,null==d||d===!1?d:d.items),{hash:{},inverse:z.noop,fn:z.program(5,i,b),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function i(a,b){var d,e="";return e+='\n        <ul class="ui-calendar-date-column">\n            ',d=c.each.call(a,a,{hash:{},inverse:z.noop,fn:z.program(6,j,b),data:b}),(d||0===d)&&(e+=d),e+="\n        </ul>\n        "}function j(a,b){var d,e="";return e+='\n            <li class="ui-calendar-day-',(d=c.day)?d=d.call(a,{hash:{},data:b}):(d=a.day,d=typeof d===w?d.apply(a):d),e+=x(d)+" ",(d=c.className)?d=d.call(a,{hash:{},data:b}):(d=a.className,d=typeof d===w?d.apply(a):d),e+=x(d)+"\n            ",d=c.unless.call(a,a.available,{hash:{},inverse:z.noop,fn:z.program(7,k,b),data:b}),(d||0===d)&&(e+=d),e+='\n            "\n            data-role="date" data-value="',(d=c.value)?d=d.call(a,{hash:{},data:b}):(d=a.value,d=typeof d===w?d.apply(a):d),e+=x(d)+'"\n            >',(d=c.label)?d=d.call(a,{hash:{},data:b}):(d=a.label,d=typeof d===w?d.apply(a):d),e+=x(d)+"</li>\n            "}function k(){return"disabled-date"}function l(a,b){var d,e,f="";return f+="\n        ",e=c.each.call(a,(d=a.month,null==d||d===!1?d:d.items),{hash:{},inverse:z.noop,fn:z.program(10,m,b),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function m(a,b){var d,e="";return e+='\n        <ul class="ui-calendar-month-column">\n            ',d=c.each.call(a,a,{hash:{},inverse:z.noop,fn:z.program(11,n,b),data:b}),(d||0===d)&&(e+=d),e+="\n        </ul>\n        "}function n(a,b){var d,e,f="";return f+='\n            <li data-role="month" data-value="',(d=c.value)?d=d.call(a,{hash:{},data:b}):(d=a.value,d=typeof d===w?d.apply(a):d),f+=x(d)+'">',e={hash:{},data:b},f+=x((d=c._,d?d.call(a,a.label,e):y.call(a,"_",a.label,e)))+"</li>\n            "}function o(a,b){var d,e,f="";return f+="\n        ",e=c.each.call(a,(d=a.year,null==d||d===!1?d:d.items),{hash:{},inverse:z.noop,fn:z.program(14,p,b),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function p(a,b){var d,e="";return e+='\n        <ul class="ui-calendar-year-column">\n            ',d=c.each.call(a,a,{hash:{},inverse:z.noop,fn:z.program(15,q,b),data:b}),(d||0===d)&&(e+=d),e+="\n        </ul>\n        "}function q(a,b){var d,e,f="";return f+='\n            <li data-role="',(d=c.role)?d=d.call(a,{hash:{},data:b}):(d=a.role,d=typeof d===w?d.apply(a):d),f+=x(d)+'" data-value="',(d=c.value)?d=d.call(a,{hash:{},data:b}):(d=a.value,d=typeof d===w?d.apply(a):d),f+=x(d)+'">',e={hash:{},data:b},f+=x((d=c._,d?d.call(a,a.label,e):y.call(a,"_",a.label,e)))+"</li>\n            "}function r(a){var b,c="";return c+='\n        <li class="ui-calendar-time" colspan="2" data-role="time"><span class="ui-calendar-hour">'+x((b=a.time,b=null==b||b===!1?b:b.hour,typeof b===w?b.apply(a):b))+"</span> : "+x((b=a.time,b=null==b||b===!1?b:b.minute,typeof b===w?b.apply(a):b))+"</li>\n        "}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var s,t,u,v="",w="function",x=this.escapeExpression,y=c.helperMissing,z=this;return v+='<div class="ui-calendar">\n    <ul class="ui-calendar-navigation" data-role="navigation-container">\n        <li class="ui-calendar-previous-year" data-role="prev-year">&lt;&lt;</li>\n        <li class="ui-calendar-previous-month" data-role="prev-month">&lt;</li>\n        <li class="ui-calendar-month-year" data-role="month-year-container">\n        <span class="month" data-role="mode-month" data-value="'+x((s=b.month,s=null==s||s===!1?s:s.current,s=null==s||s===!1?s:s.value,typeof s===w?s.apply(b):s))+'">',u={hash:{},data:e},v+=x((s=c._,s?s.call(b,(s=b.month,s=null==s||s===!1?s:s.current,null==s||s===!1?s:s.label),u):y.call(b,"_",(s=b.month,s=null==s||s===!1?s:s.current,null==s||s===!1?s:s.label),u)))+'</span>\n        <span class="year" data-role="mode-year">'+x((s=b.year,s=null==s||s===!1?s:s.current,s=null==s||s===!1?s:s.label,typeof s===w?s.apply(b):s))+'</span>\n        </li>\n        <li class="ui-calendar-next-month" data-role="next-month">&gt;</li>\n        <li class="ui-calendar-next-year" data-role="next-year">&gt;&gt;</li>\n    </ul>\n\n    <ul class="ui-calendar-control" data-role="pannel-container">\n        ',t=c["if"].call(b,(s=b.mode,null==s||s===!1?s:s.date),{hash:{},inverse:z.noop,fn:z.program(1,f,e),data:e}),(t||0===t)&&(v+=t),v+='\n    </ul>\n\n    <div class="ui-calendar-data-container" data-role="data-container">\n        ',t=c["if"].call(b,(s=b.mode,null==s||s===!1?s:s.date),{hash:{},inverse:z.noop,fn:z.program(4,h,e),data:e}),(t||0===t)&&(v+=t),v+="\n\n        ",t=c["if"].call(b,(s=b.mode,null==s||s===!1?s:s.month),{hash:{},inverse:z.noop,fn:z.program(9,l,e),data:e}),(t||0===t)&&(v+=t),v+="\n\n        ",t=c["if"].call(b,(s=b.mode,null==s||s===!1?s:s.year),{hash:{},inverse:z.noop,fn:z.program(13,o,e),data:e}),(t||0===t)&&(v+=t),v+='\n    </div>\n\n    <ul class="ui-calendar-footer" data-role="time-container">\n        <li class="ui-calendar-today" data-role="today">',u={hash:{},data:e},v+=x((s=c._,s?s.call(b,(s=b.message,null==s||s===!1?s:s.today),u):y.call(b,"_",(s=b.message,null==s||s===!1?s:s.today),u)))+"</li>\n        ",t=c["if"].call(b,(s=b.mode,null==s||s===!1?s:s.time),{hash:{},inverse:z.noop,fn:z.program(17,r,e),data:e}),(t||0===t)&&(v+=t),v+="\n    </ul>\n</div>\n"})}()}),define("arale/calendar/0.8.5/model-debug",["$-debug","arale/base/1.0.1/base-debug","arale/class/1.0.0/class-debug","arale/events/1.0.0/events-debug","gallery/moment/2.0.0/moment-debug"],function(a,b,c){function d(a){if(a=(a||0).toString().toLowerCase(),j.isNumeric(a))return a=parseInt(a);for(var b=0;b<o.length;b++)if(0===o[b].indexOf(a)){a=b;break}return a}function e(a){var b=[];for(e=0;e<n.length;e++)b.push({value:e,label:n[e]});for(var c={value:a,label:n[a]},d=[],e=0;e<b.length/3;e++)d.push(b.slice(3*e,3*e+3));return{current:c,items:d}}function f(a){for(var b=[{value:a-10,label:". . .",role:"previous-10-year"}],c=a-6;a+4>c;c++)b.push({value:c,label:c,role:"year"});b[7]={value:a,label:a,role:"year",current:!0},b.push({value:a+10,label:". . .",role:"next-10-year"});var d=[];for(c=0;c<b.length/3;c++)d.push(b.slice(3*c,3*c+3));var e={value:a,label:a};return{current:e,items:d}}function g(a){a=d(a);for(var b=[],c=a;7>c;c++)b.push({label:p[c],value:c});for(c=0;a>c;c++)b.push({label:p[c],value:c});var e={value:a,label:p[a]};return{current:e,items:b}}function h(a,b,c){var e,f,g,h=[];b=d(b);var j=function(a,b){h.push({value:a.format("YYYY-MM-DD"),label:a.date(),day:a.day(),className:b,available:i(a,c)})},k=a.clone().date(1),l=k.clone().add("months",-1),m=k.clone().add("months",1);if(e=k.day()-b,0>e&&(e+=7),0!=e)for(g=l.daysInMonth(),o=e-1;o>=0;o--)f=l.date(g-o),j(f,"previous-month");for(g=k.daysInMonth(),o=1;g>=o;o++)f=k.date(o),j(f,"current-month");if(e=35-h.length,0!=e)for(0>e&&(e+=7),o=1;e>=o;o++)f=m.date(o),j(f,"next-month");for(var n=[],o=0;o<h.length/7;o++)n.push(h.slice(7*o,7*o+7));var p={value:a.format("YYYY-MM-DD"),label:a.date()};return{current:p,items:n}}function i(a,b){if(null==b)return!0;if(j.isArray(b)){var c=b[0],d=b[1],e=!0;return c&&(e=e&&a>=l(c)),d&&(e=e&&a<=l(d)),e}return j.isFunction(b)?b(a):!0}var j=a("$-debug"),k=a("arale/base/1.0.1/base-debug"),l=a("gallery/moment/2.0.0/moment-debug"),m=k.extend({attrs:{year:{setter:function(a){return f(a)}},month:{setter:function(a){return e(a)}},day:{setter:function(){return g(this.startDay)}},date:{setter:function(a){return h(a,this.startDay,this.range)}},mode:{setter:function(a){var b={date:!1,month:!1,year:!1};return b[a]=!0,b}},message:null},initialize:function(a){m.superclass.initialize.call(this),this.startDay=a.startDay||0,this.activeTime=l(a.focus).clone(),this.range=a.range||null;var b=a.message||{};b.today="Today",this.set("message",b),this.set("mode","date"),this._refresh()},changeYear:function(a){this.activeTime.add("years",a),this._refresh(),this.trigger("changeYear")},changeMonth:function(a){this.activeTime.add("months",a),this._refresh(),this.trigger("changeMonth")},changeDate:function(a){var b=this.activeTime.format("YYYY-MM");this.activeTime.add("days",a),this._refresh();var c=this.activeTime.format("YYYY-MM");b!=c&&this.get("mode").date&&this.trigger("changeMonth")},changeStartDay:function(a){this.startDay=a,this._refresh(),this.trigger("changeStartday")},changeMode:function(a,b){b||(b={}),"month"in b&&this.activeTime.month(b.month),"year"in b&&this.activeTime.year(b.year),this.get("mode")[a]?this.set("mode","date"):this.set("mode",a),this._refresh(),this.trigger("changeMode")},changeRange:function(a){this.range=a,this._refresh(),this.trigger("changeRange")},selectDate:function(a){if(a){var b=this.activeTime.format("YYYY-MM");this.activeTime=l(a),this._refresh();var c=this.activeTime.format("YYYY-MM");b!=c&&this.get("mode").date&&this.trigger("changeMonth")}return this.activeTime.clone()},isInRange:function(a){return i(a,this.range)},toJSON:function(){var a={},b=this.attrs;for(var c in b)a[c]=this.get(c);return a},_refresh:function(){this.set("year",this.activeTime.year()),this.set("month",this.activeTime.month()),this.set("date",this.activeTime.clone()),this.set("day"),this.trigger("refresh")},range:null,activeTime:null,startDay:0}),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],o=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],p=["Su","Mo","Tu","We","Th","Fr","Sa"];c.exports=m});