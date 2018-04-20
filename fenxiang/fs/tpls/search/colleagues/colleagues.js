/**
 * Search模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        EmployeeList=require('modules/fs-employee/fs-employee-list');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var listEl=$('.employee-list',tplEl),
            pagEl=$('.employee-list-pagination',tplEl),
            searchEl=$('.search-inp-s',tplEl),  //搜索框
            employeeStatusEl=$('.employee-status',tplEl),
            tplLeftEl=$('.tpl-l .tpl-inner',tplEl), //左边栏
            tplCenterEl=$('.tpl-c .tpl-inner',tplEl),   //中部显示区
            searchBtnEl=$('.search-btn-s',tplCenterEl), //中部搜索按钮
            searchRemindEl=$('.search-remind',tplCenterEl), //搜索范围提醒
            searchRemindInfoEl=$('.tip-info',searchRemindEl), //搜索范围提醒内容
            employeeList;
        /**
         * 设置筛选信息提示文字
         */
        var setFilterInfo=function(){
            var currentEmployeeStatusEl=employeeStatusEl.filter('.depw-menu-aon');
            searchRemindInfoEl.text('筛选条件：'+currentEmployeeStatusEl.text());
        };
        //创建列表
        employeeList=new EmployeeList({
            "element":listEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "listPath":"/FeedSearch/getEmployeeForSearch",
            "defaultRequestData":function(){
                var employeeStatus=employeeStatusEl.filter('.depw-menu-aon').attr('val')||-1;
                return {
                    "keyword": _.str.trim(searchEl.val()),
                    "isStop":employeeStatus
                };
            }, //默认请求数据
            "listEmptyText": "没有符合条件的搜索结果"  //列表记录为空的文字提示
        });
        employeeStatusEl.click(function(evt){
            var meEl=$(this);
            employeeStatusEl.removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            evt.preventDefault();
            setFilterInfo();    //设置筛选信息
            //重新发送请求
            employeeList.reload();
        });
        //点击搜索发送请求
        searchBtnEl.click(function(){
            setFilterInfo();    //设置筛选信息
            employeeList.reload();
        });
        searchRemindEl.on('click','.sr-close',function(evt){
            searchRemindEl.hide();
            evt.preventDefault();
        });
        //监听搜索输入，自动append到各类搜索链接下
        searchEl.keyup(function(evt){
            var val= _.str.trim(searchEl.val());
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
        });

        /*tpl.event.on('switched', function (tplName2, tplEl) {
            if (tplName2 == tplName) {
                var queryParams=util.getTplQueryParams();   //传给模板的参数
                var key=queryParams? queryParams.key:""; //获取key
                searchEl.val(key).keyup();  //设置默认查询参数
                setFilterInfo();    //设置筛选信息
                employeeList.reload();
                //高亮同事栏
                $('.tpl-nav-l',tplLeftEl).eq(4).addClass('depw-menu-aon');
            }
        });*/
        //不缓存搜索结果
        (function(){
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var key=queryParams? queryParams.key:""; //获取key
            searchEl.val(key).keyup();  //设置默认查询参数
            setFilterInfo();    //设置筛选信息
            employeeList.reload();
            //高亮同事栏
            $('.tpl-nav-l',tplLeftEl).eq(4).addClass('depw-menu-aon');
        }());

        //路由注册
        util.tplRouterReg('#search');
        util.tplRouterReg('#search/images');
        util.tplRouterReg('#search/attachs');
        util.tplRouterReg('#search/audios');
    };
});