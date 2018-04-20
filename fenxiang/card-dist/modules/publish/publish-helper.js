/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/publish/publish-helper",["util","events","placeholder","calendar","select","moment"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.store,e.event;var f=a("util"),g=a("events"),h=a("placeholder"),i=a("calendar"),j=a("select"),k=a("moment"),l=i.extend({attrs:{showTodayBtn:!1,align:{getter:function(){var a=this.get("trigger");return a?{selfXY:[0,0],baseElement:a,baseXY:[13,13]}:{selfXY:[0,0],baseXY:[0,0]}}}}}),m=function(a){a=_.extend({element:null,placeholder:"请选择日期",formatStr:"YYYY-MM-DD",isCRM:!1,noResteBtn:!1},a||{}),this.element=$(a.element),this.opts=a,this.init()};m.prototype.init=function(){var a,b,c,d=this,e=this.element,f=this.opts,g=[],i=f.formatStr;e.html('<input type="text" class="fs-publish-dateselect-input" readonly="readonly" placeholder="'+f.placeholder+'" />'),a=$(".fs-publish-dateselect-input",e),h(a),b=k(),c=b.format(i),g[0]={value:c,text:"今天"},b=k().add("days",1),c=b.format(i),g[1]={value:c,text:"明天"},b=k().startOf("week").add("days",5),c=b.format(i),g[2]={value:c,text:"本周五"},b=k().startOf("week").add("days",8),c=b.format(i),g[3]={value:c,text:"下周一"},b=k().startOf("month").add("months",1).subtract("days",1),c=b.format(i),g[4]={value:c,text:"本月底"};var m='<a class="reset-l" href="javascript:;">清空</a>';f.noResteBtn&&(m="");var n='<div class="{{classPrefix}}"><div class="fs-publish-dateselect-title">请选择日期'+m+"</div>"+'<div class="fs-publish-dateselect-calendar"></div>';f.isCRM||(n+='<ul class="{{classPrefix}}-content" data-role="content">{{#each select}}<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a href="javascript:;" title="{{{text}}}" class="fs-prevent-default">{{{text}}}</a></li>{{/each}}</ul>'),n+="</div>";var o=new j({trigger:a,className:"fs-publish-dateselect",template:n,model:g,zIndex:2e3,autoWidth:!1}).render(),p=o.element,q=$(".fs-publish-dateselect-calendar",p),r=new l({trigger:q,zIndex:2e3});r.on("selectDate",function(b){var c=b.format(i);a.val(c),o.hide(),d.trigger("change",c)}),o.on("change",function(b){var c=b.data("value");a.val(c),d.trigger("change",c)}),o.after("show",function(){r.show(),r.setFocus_(d.getValue(!0)||new Date)}),o.after("hide",function(){r.hide()}),p.on("click",".reset-l",function(b){a.val(""),a[0].focus(),a[0].blur(),o.set("selectedIndex",-1),o.hide(),d.trigger("change",""),b.preventDefault()}),r.element.on("click",function(a){a.stopPropagation()}),a.bind("mousedown",function(a){a.stopPropagation()}),this.calendar=r,this.selector=o},m.prototype.getValue=function(a){var b=this.opts,c=b.formatStr,d=this.element,e=$(".fs-publish-dateselect-input",d),f=_.str.trim(e.val()),g=k(f,c);return a?g:_.str.trim(g?g.format("YYYY-MM-DD"):"")},m.prototype.getTime=function(){var a=this.opts,b=a.formatStr,c=this.element,d=$(".fs-publish-dateselect-input",c),e=_.str.trim(d.val()),f=k(e,b);return f?f._d.getTime()/1e3:0},m.prototype.setValue=function(a){var b=k(a),c=this.calendar;c.setFocus(b),c.trigger("selectDate",b)},m.prototype.clear=function(){var a=this.element,b=$(".fs-publish-dateselect-input",a);this.selector.select(-1),b.val("")},m.prototype.destroy=function(){this.calendar&&this.calendar.destroy(),this.selector&&this.selector.destroy()},g.mixTo(m);var n=function(a){a=_.extend({element:null,placeholder:"请选择时间",timeDivision:30},a||{}),this.element=$(a.element),this.opts=a,this.init()};n.prototype.init=function(){var a,b=this,c=this.element,d=this.opts,e=[],f=0,g=k("20130423080000","YYYYMMDDhhmmss"),i=g;if(c.html('<input type="text" class="fs-publish-timeselect-input" readonly="readonly" placeholder="'+d.placeholder+'" />'),a=$(".fs-publish-timeselect-input",c),h(a),30==this.opts.timeDivision)for(f=0;48>f;f++)e.push({value:i.format("HH:mm"),text:i.format("HH:mm")}),i=g.add("minutes",30);else if(15==this.opts.timeDivision)for(f=0;96>f;f++)e.push({value:i.format("HH:mm"),text:i.format("HH:mm")}),i=g.add("minutes",15);this.selector=new j({trigger:a,model:e,zIndex:2e3,autoWidth:!1,className:"fs-publish-timeselect",template:'<div class="{{classPrefix}}"><div class="fs-publish-timeselect-title">请选择时间<a class="reset-l" href="javascript:;">清空</a></div><ul class="{{classPrefix}}-content" data-role="content">{{#each select}}<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a class="fs-prevent-default" href="javascript:;" title="{{{text}}}">{{{text}}}</a></li>{{/each}}</ul></div>'}).render().on("change",function(c){var d=c.data("value");a.val(d),b.trigger("change",d)}),this.selector.element.on("click",".reset-l",function(c){a.val(""),a[0].focus(),a[0].blur(),b.selector.hide(),b.selector.set("selectedIndex",-1),b.trigger("change",""),c.preventDefault()})},n.prototype.getValue=function(){var a=this.element,b=$(".fs-publish-timeselect-input",a);return _.str.trim(b.val())},n.prototype.setValue=function(a){var b=this.selector;b.select(a)},n.prototype.clear=function(){var a=this.element,b=$(".fs-publish-timeselect-input",a);return this.selector.select(-1),b.val("")},n.prototype.destroy=function(){this.selector&&this.selector.destroy()},g.mixTo(n);var o=function(a){var b;a=_.extend({element:null},a||{}),b=$(a.element),this.element=b,f.asyncOrder(["jslibs/jquery.autosize.js"],function(){b.addClass("autosize-animated").autosize({append:" "})}),b.change(function(){b.trigger("autosize.resize")})};_.extend(o.prototype,{destroy:function(){this.element.trigger("autosize.destroy").removeClass("autosize-animated")}}),_.extend(b,{DateSelect:m,TimeSelect:n,AdjustTextAreaSize:o})});