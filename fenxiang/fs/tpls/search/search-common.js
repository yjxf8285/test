/**
 * Search模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var util=require('util'),
        filter=require('filter'),
        moment=require('moment'),
        leftTpl=require('./search-common.html'),
        leftTplEl=$(leftTpl),
        Autocomplete=require('autocomplete'),
        Events=require('events');
    var searchSenderAcEl=leftTplEl.filter('.search-sender-ac');
    var stringMatch = filter.stringMatch,
        startsWith=filter.startsWith;
    //路由注册
    util.tplRouterReg('#search');
    util.tplRouterReg('#search/=/:key-:value');
    util.tplRouterReg('#search/images');
    util.tplRouterReg('#search/images/=/:key-:value');
    util.tplRouterReg('#search/attachs');
    util.tplRouterReg('#search/attachs/=/:key-:value');
    util.tplRouterReg('#search/audios');
    util.tplRouterReg('#search/audios/=/:key-:value');
    util.tplRouterReg('#search/colleagues');
    util.tplRouterReg('#search/colleagues/=/:key-:value');
    util.tplRouterReg('#search/shortmessage');
    util.tplRouterReg('#search/shortmessage/=/:key-:value');


    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl),
            tplCenterEl=$('.tpl-c .tpl-inner',tplEl),
            searchBtnEl=$('.search-btn-s',tplCenterEl), //中部搜索按钮
            searchInputEl=$('.search-inp-s',tplCenterEl),   //中部搜索框
            searchRemindEl=$('.search-remind',tplCenterEl), //搜索范围提醒
            searchRemindInfoEl=$('.tip-info',searchRemindEl), //搜索范围提醒内容
            allEmployeeEl,
            mySendEl,
            customEmployeeEl,
            filterEmployeeEl,
            cusSendPersonEl,
            filterDateEl,
            customDateEl,
            cusDateRangeEl,
            latestOneWeekEl,
            latestOneMonthEl,
            latestThreeMonthEl,
            latestHalfYearEl,
            latestOneYearEl,
            dateSearchBtn,  //日期搜索按钮
            includeListEl;  //包含条件列表
        var queryParams=util.getTplQueryParams();   //传给模板的参数
        var contactData=util.getContactData();
        //自定义左侧边栏事件
        var tplLeftEvent=new Events();
        //render左边栏信息
        var currentMember=contactData["u"],
            contactPersonData=contactData["p"];
        var renderData={};

	    var leftCompiled=_.template(leftTplEl.filter('.search-tpl-left').html()); //模板编译方法

        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });

        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));

        //初始化变量
        allEmployeeEl=$('.all-employee',tplLeftEl);
        mySendEl=$('.my-send',tplLeftEl);
        customEmployeeEl=$('.custom-employee',tplLeftEl);
        filterEmployeeEl=$('.filter-employee a',tplLeftEl);
        cusSendPersonEl=$('.custom-send-person',tplLeftEl);
        filterDateEl=$('.filter-date a',tplLeftEl);
        cusDateRangeEl=$('.custom-data-range',tplLeftEl);
        latestOneWeekEl=$('.latest-one-week',tplLeftEl);
        latestOneMonthEl=$('.latest-one-month',tplLeftEl);
        latestThreeMonthEl=$('.latest-three-month',tplLeftEl);
        latestHalfYearEl=$('.latest-half-year',tplLeftEl);
        latestOneYearEl=$('.latest-one-year',tplLeftEl);
        customDateEl=$('.custom-date',tplLeftEl);
        dateSearchBtn=$('.date-search-btn',tplLeftEl);
        includeListEl=$('.search-include-nav-list',tplLeftEl);

        //重置搜索条件
        var resetSearchFilter=function(){
            //发送人
            filterEmployeeEl.removeClass('depw-menu-aon');
            filterEmployeeEl.filter('.all-employee').addClass('depw-menu-aon');
            $('.reselect-btn',tplLeftEl).click();
            $('.custom-send-person',tplLeftEl).hide();
            //时间
            filterDateEl.removeClass('depw-menu-aon');
            filterDateEl.filter('.latest-one-week').addClass('depw-menu-aon');
            $('.custom-data-range .csp-input',tplLeftEl).val('');
            $('.custom-data-range',tplLeftEl).hide();
            //包含条件
            $('a',includeListEl).removeClass('depw-menu-aon').eq(0).addClass('depw-menu-aon');
        };

        //左侧 自定义标签 展开

        //检索人自动完成
        var queryEmployeeEl=$('.query-employee',tplLeftEl);
        var ac=new Autocomplete({
            className:'custom-sender-search-ac',
            trigger: queryEmployeeEl,
            template: searchSenderAcEl.html(),
            delay:0,    //默认延迟100ms
            submitOnEnter:false,    //回车不会提交表单
            zIndex:100,
            dataSource:contactPersonData    //只筛选人
        }).render();
        //重设过滤器
        var acFilter=ac.get('filter');
        acFilter.func=function(data, query, options){
            var filterData=[],
                filterData1,
                filterData2;
            filterData1 = stringMatch.apply(this, [data, query, {
                "key": "name"
            }]);
            filterData2 = startsWith.apply(this, [data, query.toLowerCase(), {
                "key": "spell"
            }]);
            //先插入filterData2的数据
            _.each(filterData2,function(itemData){
                if(!_.find(filterData1,function(itemData2){
                    return itemData2.id==itemData.id;
                })){
                    filterData.push(itemData);
                }
            });
            filterData=filterData.concat(filterData1);
            return filterData;
        };
        ac.set('filter',acFilter);
        ac.on('itemSelect',function(data){
            queryEmployeeEl.text(data.name).prop('disabled',true);
            //设置current send id
            customEmployeeEl.data('sendid',data.id);
            //设置按钮启用
            reselectBtnEl.prop('disabled',false);
            employeeSearchBtnEl.prop('disabled',false);
        });
        var employeeSearchBtnEl=$('.employee-search-btn',tplLeftEl),    //选人搜索
            reselectBtnEl=$('.reselect-btn',tplLeftEl); //重选按钮

        reselectBtnEl.click(function(){
            queryEmployeeEl.val("").prop('disabled',false).get(0).focus();
            //设置自定义发出人id为0
            customEmployeeEl.data('sendid',0);
            //设置按钮禁用
            reselectBtnEl.prop('disabled',true);
            employeeSearchBtnEl.prop('disabled',true);
        });
        employeeSearchBtnEl.click(function(){
            //触发tplLeftEvent事件
            triggerTplLeftEvent();
            //打开搜索条件显示
            searchRemindEl.show();
        });
        //选人交互
        allEmployeeEl.data('sendid',0);
        mySendEl.data('sendid',currentMember.id);

        filterEmployeeEl.click(function(evt){
            var meEl=$(this);
            filterEmployeeEl.removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            if(meEl.hasClass('custom-employee')){
                cusSendPersonEl.show();
            }else{
                //设置自定义发出人id为0
                customEmployeeEl.data('sendid',0);
                cusSendPersonEl.hide();
                //触发tplLeftEvent事件
                triggerTplLeftEvent();
                //打开搜索条件显示
                searchRemindEl.show();
            }
            evt.preventDefault();
        });

        //选时间交互
        var now=moment(),
            nowUnix=now.unix();
        latestOneWeekEl.data({
            "dateTimeType":1,
            "startTime":now.subtract('weeks',1).unix(),
            "endTime":nowUnix
        });
        latestOneMonthEl.data({
            "dateTimeType":2,
            "startTime":now.subtract('months',1).unix(),
            "endTime":nowUnix
        });
        latestThreeMonthEl.data({
            "dateTimeType":3,
            "startTime":now.subtract('months',3).unix(),
            "endTime":nowUnix
        });
        latestHalfYearEl.data({
            "dateTimeType":4,
            "startTime":now.subtract('years',0.5).unix(),
            "endTime":nowUnix
        });
        latestOneYearEl.data({
            "dateTimeType":5,
            "startTime":now.subtract('years',1).unix(),
            "endTime":nowUnix
        });
        customDateEl.data({
            "dateTimeType":6
        });
        filterDateEl.click(function(evt){
            var meEl=$(this);
            filterDateEl.removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            if(meEl.hasClass('custom-date')){
                cusDateRangeEl.show();
            }else{
                cusDateRangeEl.hide();
                //触发tplLeftEvent事件
                triggerTplLeftEvent();
                //打开搜索条件显示
                searchRemindEl.show();
            }
            evt.preventDefault();
        });
        dateSearchBtn.click(function(){
            var startDateEl=$('.start-date',tplLeftEl),
                endDateEl=$('.end-date',tplLeftEl);
            var startDateVal= _.str.trim(startDateEl.val()),
                endDateVal= _.str.trim(endDateEl.val());
            var startDate,
                endDate;
            if(startDateVal.length>0&&endDateVal.length>0){
                if(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(startDateVal)&&/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(endDateVal)){
                    startDate=moment(startDateVal,'YYYY-MM-DD');
                    endDate=moment(endDateVal,'YYYY-MM-DD');
                    customDateEl.data({
                        "startTime":startDate.unix(),
                        "endTime":endDate.unix()
                    });
                    //触发tplLeftEvent事件
                    triggerTplLeftEvent();
                    //打开搜索条件显示
                    searchRemindEl.show();
                }else{
                    util.alert('请输入有效的时间格式');
                }
            }else{
                util.alert('自定义时间不能为空');
            }
        });
        //包含条件过滤
        includeListEl.on('click','a',function(evt){
            var meEl=$(this);
            $('a',includeListEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            //触发tplLeftEvent事件
            triggerTplLeftEvent();
            //打开搜索条件显示
            searchRemindEl.show();
            evt.preventDefault();
        });

        //手动搜索
        searchBtnEl.click(function(){
            //触发search事件
            triggerTplLeftEvent();
        });
        //点击搜索条件关闭按钮
        searchRemindEl.on('click','.sr-close',function(evt){
            searchRemindEl.hide();
            resetSearchFilter();
            //重启搜索
            triggerTplLeftEvent();
            evt.preventDefault();
        });
        //设置输入框默认值
        //var defaultQueryText=queryParams? queryParams.key:""; //获取默认的搜索内容
        //searchInputEl.val(defaultQueryText);

        //监听搜索输入，自动append到各类搜索链接下
        searchInputEl.keyup(function(evt){
            var val= _.str.trim(searchInputEl.val());
            $('.tpl-nav-l',tplLeftEl).each(function(){
                var meEl=$(this),
                    originHref=meEl.data('originhref');
                if(!originHref){
                    originHref=meEl.attr('href');
                    meEl.data('originhref',originHref);
                }
                if(val.length>0){
                    meEl.attr('href',originHref+'/=/key-'+val);
                }else{
                    meEl.attr('href',originHref);
                }
            });
            if(evt.keyCode==13){  //回车
                //触发search事件
                triggerTplLeftEvent();
                //打开搜索条件显示
                searchRemindEl.show();
            }
        }).on('mouseenter',function(){
            $(this).addClass('state-mouse-over');
        }).on('mouseleave',function(){
            $(this).removeClass('state-mouse-over');
        });

        //高亮导航注册
        //util.regTplNav($('.tpl-nav-l',tplLeftEl));   //改为不缓存模式后需要取消导航高亮注册
        //注册子路由
        //util.tplRouterReg($('.tpl-nav-lb',tplLeftEl));
        function triggerTplLeftEvent(){
            var currentSendId=getCurrentSendId(),
                rangeDate=getRangeDate(),
                senderName;
            var currentEmployeeEl=filterEmployeeEl.filter('.depw-menu-aon'),
                currentDateEl=filterDateEl.filter('.depw-menu-aon');
            //传递给search事件的数据
            var searchData= _.extend({
                senderID:currentSendId
            },rangeDate);
            if(tplName=="search"){  //只有搜索工作才有"包含"条件过滤
                _.extend(searchData,getFeedAttachType());
            }
            if(!_.isUndefined(currentSendId)&&!_.isUndefined(rangeDate.startTime)&&!_.isUndefined(rangeDate.endTime)){
                tplLeftEvent.trigger('search', searchData);
                if(currentSendId=="0"){
                    senderName="所有人";
                }else{
                    if(currentSendId==currentMember.id){
                        senderName="我";
                    }else{
                        senderName=util.getContactDataById(currentSendId,'p').name;
                    }
                }
                searchRemindInfoEl.text('筛选条件：'+senderName+'发出的，'+currentDateEl.text());
            }
        }
        /**
         * 获取发出人id
         */
        function getCurrentSendId(){
            var currentEmployeeEl=filterEmployeeEl.filter('.depw-menu-aon');
            return currentEmployeeEl.data('sendid');
        }
        /**
         * 获取检索时间范围
         */
        function getRangeDate(){
            var currentDateEl=filterDateEl.filter('.depw-menu-aon');
            return {
                "dateTimeType":currentDateEl.data('dateTimeType'),
                "startTime":currentDateEl.data('startTime'),
                "endTime":currentDateEl.data('endTime')
            };
        }

        /**
         * 获取包含附件类型
         */
        function getFeedAttachType(){
            var currentIncludeEl=$('.depw-menu-aon',includeListEl);
            return {
                "feedAttachType":currentIncludeEl.attr('feedattachtype')
            };
        }
        //对外暴露获取发出人id和自定义时间的事件
        return tplLeftEvent;
    };
});