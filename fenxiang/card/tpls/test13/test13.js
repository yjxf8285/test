/**
 * test
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var moment=require('moment'),
        Widget=require('widget');
    var CardCalendar=Widget.extend({
        "attrs":{
            //"initFocusDate":moment()    //初始选中日期，默认是当天
            "initFocusDate":{   //初始选中日期，默认是当天
                "getter":function(date){
                    if(!date){
                        date=moment();
                    }
                    //过滤掉时间
                    return moment(moment(date).format('YYYY-MM-DD'),'YYYY-MM-DD');
                }
            },
            "currentDate":{
                "getter":function(date){
                    if(!date){
                        return this.get('initFocusDate');
                    }
                    return moment(date,'YYYY-MM-DD');
                },
                "setter":function(date){
                    return date.format('YYYY-MM-DD');
                }
            },
            "panelState":"", //date、month、year三个面板状态切换
            "inputSelect":true //是否开启input输入框选中行为
        },
        "events":{
            "click .card-calendar-nav-prev":"_clickNavPrev",
            "click .card-calendar-nav-next":"_clickNavNext",
            "click .card-calendar-title .label-year":"_clickLabelYear",
            "click .card-calendar-title .label-month":"_clickLabelMonth",
            "click .card-calendar-year-panel .year-nav-prev":"_clickYearNavPrev", //年份面板向前导航
            "click .card-calendar-year-panel .year-nav-next":"_clickYearNavNext",  //年份面板向后导航
            "click .card-calendar-year-panel .year-item":"_clickYearItem",  //选择当前年
            "click .card-calendar-month-panel .month-item":"_clickMonthItem", //选择当前月
            "click .card-calendar-date-panel .date-body .date-cell":"_clickDateCell"   //点击日期
        },
        setup: function() {
            var that=this;
            var result;
            result=CardCalendar.superclass.setup.apply(this,arguments);
            //建立印记存储
            this._stampStore={};
            if(this.get('inputSelect')){
                this.on('dateclick',function(dateStr){
                    that.removeStamp('selected'); //清空所有的选中时间戳
                    //添加当前点击的时间戳到选中存储
                    that.setStamp('selected',moment(dateStr,'YYYY-MM-DD'));
                    //刷一遍view
                    that.updateDateView();
                });
            }
            return result;
        },
        render:function(){
            var result=CardCalendar.superclass.render.apply(this,arguments);
            this._renderSelf();
            this._initFocusDate();
            return result;
        },
        /**
         * 设置时间戳，以字符串形式存储节省内存
         * @param stampType
         * @param vals
         */
        setStamp:function(stampType,vals){
            var storeVals=this._stampStore[stampType]||[];
            if(_.isUndefined(vals)){
                return;
            }
            vals=[].concat(vals);
            vals= _.map(vals,function(val){
                return moment(val);     //扩展成moment格式的对象
            });
            _.each(vals,function(val){
                if(!_.some(storeVals,function(val2){    //去重
                    return val2==val.format('YYYY-MM-DD');
                })){
                    storeVals.push(val.format('YYYY-MM-DD'));
                }
            });
            //重设
            this._stampStore[stampType]=storeVals;
        },
        /**
         * 返回特定类型的时间戳，类型为空返回全部时间戳
         * @param stampType
         */
        getStamp:function(stampType){
            if(_.isUndefined(stampType)){
                return this._stampStore;
            }
            return this._stampStore[stampType];
        },
        /**
         * 清理对应类型，对应值的时间戳
         * @param stampType
         * @param stampValue
         */
        removeStamp:function(stampType,vals){
            var that=this;
            if(_.isUndefined(stampType)){   //时间戳类型为空，全清空
                this._stampStore={};
                return;
            }
            if(_.isUndefined(vals)){   //时间戳值为空，特定类型全清空
                this._stampStore[stampType]=[];
                return;
            }
            vals=[].concat(vals);   //清除指定类型指定值的时间戳
            vals= _.map(vals,function(val){
                return moment(val);     //扩展成moment格式的对象
            });
            _.each(vals,function(val){
                that._stampStore[stampType]= _.reject(that._stampStore[stampType],function(val2){
                    return val.format('YYYY-MM-DD')==val2;
                });
            });
        },
        /**
         * 刷新日期显示
         */
        updateDateView:function(){
            var panelState=this.get('panelState');
            var elEl=this.element,
                datePanelEl=$('.card-calendar-date-panel',elEl),
                dateEl=$('.date-body td',datePanelEl);
            var stampStore=this._stampStore,
                stampTypes=_.keys(stampStore);
            if(panelState=="date"){
                _.each(stampTypes,function(stampType){
                    //先清空对应类型时间戳的className
                    dateEl.removeClass('stamp-'+stampType);
                    //逐个添加已存储的className
                    _.each(stampStore[stampType],function(val){
                        dateEl.filter('[data-date="'+val+'"]').addClass('stamp-'+stampType);
                    });
                });
            }
        },
        /**
         * 初始化焦点日期对应的date panel
         * @private
         */
        _initFocusDate:function(){
            var initFocusDate=this.get('initFocusDate');
            this._renderDatePanel(initFocusDate);
            this.set('currentDate',this.get('initFocusDate'));
            this.set('panelState','date');
        },
        /**
         * 月导航减1
         * @private
         */
        _clickNavPrev:function(){
            var currentDate=this.get('currentDate');
            currentDate=currentDate.subtract('months',1);
            this._renderDatePanel(currentDate);
            this.set('currentDate',currentDate);
            this.set('panelState','date');
        },
        /**
         * 月导航加1
         * @private
         */
        _clickNavNext:function(){
            var currentDate=this.get('currentDate');
            currentDate=currentDate.add('months',1);
            this._renderDatePanel(currentDate);
            this.set('currentDate',currentDate);
            this.set('panelState','date');
        },
        /**
         * 点击year label切换到年份选择面板
         * @private
         */
        _clickLabelYear:function(){
            var currentDate=this.get('currentDate');
            var panelState=this.get('panelState');
            if(panelState=="year"){
                this._renderDatePanel(currentDate);
                this.set('panelState','date');
            }else{
                this._renderYearPanel(currentDate.format('YYYY'));
                this.set('panelState','year');
            }

        },
        /**
         * 点击month label切换到月份选择面板
         * @private
         */
        _clickLabelMonth:function(){
            var currentDate=this.get('currentDate');
            var panelState=this.get('panelState');
            if(panelState=="month"){
                this._renderDatePanel(currentDate);
                this.set('panelState','date');
            }else{
                this._renderMonthPanel();
                this.set('panelState','month');
            }
        },
        _clickYearNavPrev:function(){
            var elEl=this.element,
                yearPanelEl=$('.card-calendar-year-panel',elEl),
                firstItemYear=$('li.year-item',yearPanelEl).eq(0).data('year');
            this._renderYearPanel(firstItemYear);
        },
        _clickYearNavNext:function(){
            var elEl=this.element,
                yearPanelEl=$('.card-calendar-year-panel',elEl),
                lastItemYear=$('li.year-item',yearPanelEl).last().data('year');
            this._renderYearPanel(lastItemYear);
        },
        _clickYearItem:function(evt){
            var itemEl=$(evt.currentTarget);
            var year=itemEl.data('year');
            //设置当前日期
            this.set('currentDate',moment(year+'-'+this.get('currentDate').format('MM-DD'),'YYYY-MM-DD'));
            //高亮对应项
            itemEl.addClass('is-current-year').siblings('.year-item').removeClass('is-current-year');
        },
        _clickMonthItem:function(evt){
            var itemEl=$(evt.currentTarget);
            var currentDate=this.get('currentDate');
            var month=itemEl.data('month');
            //设置当前日期
            this.set('currentDate',moment(currentDate.format('YYYY')+'-'+month+'-'+currentDate.format('DD'),'YYYY-M-DD'));
            //高亮对应项
            itemEl.addClass('is-current-month').siblings('.month-item').removeClass('is-current-month');
        },
        _clickDateCell:function(evt){
            var meEl=$(evt.currentTarget),
                tdEl=meEl.closest('td');
            var dateStr=tdEl.data('date');
            this.trigger('dateclick',dateStr);  //触发dateclick事件
        },
        /**
         * 构建calendar结构
         * @private
         */
        _renderSelf:function(){
            var elEl=this.element;
            //设置className
            elEl.addClass('card-calendar');
            //构建dom
            elEl.html('<div class="card-calendar-tbar">'+
                '<div class="card-calendar-nav-prev">&#139;</div>'+
                '<div class="card-calendar-title"><span class="label-year">0000</span>年<span class="label-month">00</span>月</div>'+
                '<div class="card-calendar-nav-next">&#155;</div>'+
            '</div>'+
            '<div class="card-calendar-body">'+
                '<div class="card-calendar-date-panel card-calendar-panel"></div>'+
                '<div class="card-calendar-year-panel card-calendar-panel"></div>'+
                '<div class="card-calendar-month-panel card-calendar-panel"></div>'+
            '</div>');
        },
        /**
         * 根据date值渲染date面板
         * @param date
         */
        _renderDatePanel:function(date){
            var elEl=this.element,
                datePanelEl=$('.card-calendar-date-panel',elEl);
            var initFocusDate=this.get('initFocusDate');
            var firstDateOfMonth=date.clone().startOf('month'),
                beginDate=firstDateOfMonth.startOf('week'),
                tmpDate,
                tmpCls;
            var htmlStr='<table cellpadding="0" cellspacing="0">',
                i=0;
            //构建周期表头
            htmlStr+='<thead class="day-title"><tr><th><span class="date-cell">日</span></th><th><span class="date-cell">一</span></th><th><span class="date-cell">二</span></th><th><span class="date-cell">三</span></th><th><span class="date-cell">四</span></th><th><span class="date-cell">五</span></th><th><span class="date-cell">六</span></th></tr></thead>';
            //构建date主体
            htmlStr+='<tbody class="date-body">';
            while(i<42){
                tmpDate=beginDate.clone();
                tmpDate.add('d',i);
                //区分className
                if(parseInt(tmpDate.format('M'))<parseInt(date.format('M'))){   //上一个月
                    tmpCls='prev-month-date state-inactive';
                }else if(parseInt(tmpDate.format('M'))>parseInt(date.format('M'))){  //下一个月
                    tmpCls='next-month-date state-inactive';
                }else{
                    tmpCls='current-month-date state-active';
                }
                //判断是否和初始焦点日期一致
                if(tmpDate.isSame(initFocusDate)){
                    tmpCls+=' is-init-focus-date';
                }
                if(i%7==0){ //模7加tr
                    if(i==0){
                        htmlStr+='<tr>';
                    }else{
                        htmlStr+='</tr><tr>';
                    }
                }
                htmlStr+='<td data-date="'+tmpDate.format('YYYY-MM-DD')+'" class="'+tmpCls+'"><span class="date-cell">'+tmpDate.format('D')+'</span></td>';
                i++;    //自增1
            }
            htmlStr+='</tr></tbody>';
            htmlStr+='</table>';
            datePanelEl.html(htmlStr);
            //更新时间戳className
            this.updateDateView();
        },
        _renderYearPanel:function(year){
            var elEl=this.element,
                yearPanelEl=$('.card-calendar-year-panel',elEl);
            var currentDate=this.get('currentDate');
            var htmlStr='',
                i;
            year=parseInt(year);
            //向前6年
            for(i=year-6;i<=year-1;i++){
                htmlStr+='<li data-year="'+i+'" class="year-item">'+i+'</li>';
            }
            htmlStr+='<li data-year="'+year+'" class="year-item">'+year+'</li>';
            //向后6年
            for(i=year+1;i<=year+6;i++){
                htmlStr+='<li data-year="'+i+'" class="year-item">'+i+'</li>';
            }
            //前后添加省略号导航
            htmlStr='<ul class="fn-clear"><li class="year-nav-prev">&#8230;</li>'+htmlStr+'<li class="year-nav-next">&#8230;</li></ul>';
            //渲染
            yearPanelEl.html(htmlStr);
            //设置当前年的className
            $('[data-year="'+currentDate.format('YYYY')+'"]',yearPanelEl).addClass('is-current-year');

        },
        _renderMonthPanel:function(){
            var elEl=this.element,
                monthPanelEl=$('.card-calendar-month-panel',elEl);
            var currentDate=this.get('currentDate');
            var htmlStr='',
                i,
                currentMonth=parseInt(currentDate.format('M'));
            for(i=1;i<=12;i++){
                htmlStr+='<li class="month-item" data-month="'+i+'">'+(new Array(2 - i.toString().length + 1).join("0") +i)+'</li>';  //不足两位前补0
            }
            htmlStr='<ul class="fn-clear">'+htmlStr+'</ul>';
            monthPanelEl.html(htmlStr);
            //设置当前月的className
            $('[data-month="'+currentMonth+'"]',monthPanelEl).addClass('is-current-month');
        },
        /**
         * 根据当前日期调整ui表现
         * @param currentDate
         * @private
         */
        _onChangeCurrentDate:function(currentDate){
            var elEl=this.element,
                tbarEl=$('.card-calendar-tbar',elEl),
                labelYearEl=$('.label-year',tbarEl),
                labelMonthEl=$('.label-month',tbarEl);
            if(currentDate){
                currentDate=moment(currentDate,'YYYY-MM-DD');
                labelYearEl.text(currentDate.format('YYYY'));
                labelMonthEl.text(currentDate.format('MM'));
            }
        },
        _onChangePanelState:function(panelState){
            var elEl=this.element;
            //先隐藏所有的面板
            $('.card-calendar-panel',elEl).hide();
            //显示对应的面板
            $('.card-calendar-'+panelState+'-panel',elEl).show();
        },
        destroy:function(){
            var result;
            this._stampStore=null;
            result=CardCalendar.superclass.destroy.apply(this,arguments);
            return result;
        }
    });


    var FeedReply=require('modules/card-reply/feed-reply.js');

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        var calendarEl=$('.calendar',tplEl);
        new CardCalendar({
            "element":calendarEl
        }).render();

        var feedReplyEl=$('.feed-reply',tplEl);
        var feedReply=new FeedReply({
            "element":feedReplyEl,
            "showMainInput":false,
            "title":""
            //"feedData":model.get("originData")
        });
        //feedReply.set("listPath","231231");
        feedReply.show();
        /*feedReply.reply({

        });*/
        feedReply.refreshList();
        feedReply.on('replycount',function(totalCount){
            alert(totalCount);
        });
    };
});