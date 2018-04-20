/**
 * CRM - 线索 - tpl
 *
 * @author liuxiaofan
 * 2014-04-23
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Header = require('modules/crm-list-header/crm-list-header');
//    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var SalesClue = require('modules/crm-salesclue-list/crm-salesclue-list');
    var tplName, salesClue, header;

    exports.init = function () {
        var employee = util.getCrmData().currentEmp;
        tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);
        var salesClueListWarpEl = $('.salesclues-salesclue-warp', tplEl);
        salesClue = new SalesClue({
            warpEl: salesClueListWarpEl,
            data: {
                keyword: '',//string，搜索关键字
                states: 0,//int，状态：0、全部；1、未处理；2、已联系；3、关闭
                tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                queryType: 0,//int，查询类型：0、我负责的线索；1、下属负责的线索；2、我创建的线索；3、下属创建的线索；
                isCreateOpportunity: -1,//int，是否创建过机会，0、未创建；1、已创建；其他数字、全部；
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，当前页keyword: string，搜索关键字
            },
            url: "/SalesClue/GetSalesClueList"
        });
        salesClue.load();
        header = new Header({
            "element": $(".crm-list-hd", tplEl),
            "title": "销售线索",
            "searchPlaceholder": "搜索销售线索"
        });
        header.on("search", function (keyword) {
            salesClue.refresh({
                "keyword": keyword
            });
        });
       /* var subordinate = new Subordinate({
            "element": $(".tpl-subordinate-wrapper", tplEl),
            "employeeName": employee.name,
            "imageSrc": util.getAvatarLink(employee.profileImage, '2'),
            "canSelect": employee.subEmployees && employee.subEmployees.length > 0
        });*/
    };
    //监听页面切换事件
    tplEvent.on('switched', function (tplName2, tplEl) {
        var queryParams, tagType, data;
        //如果是当前页面
        if (tplName2 == tplName) {
            queryParams = util.getTplQueryParams2();  //取地址栏的参数格式示例 /=/tagType-4
            if (queryParams && queryParams.queryType) {
                tagType = queryParams.queryType
            } else {
                tagType = 0;
            }
            //左侧菜单高亮手动控制
            switch (tagType) {
                case 0:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(0).addClass('state-active');
                    break;
                case 1:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
                    break;
                case 2:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(2).addClass('state-active');
                    break;
                case 3:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(3).addClass('state-active');
                    break;
            }
            header.setTitle($('.crm-list-left-nav .state-active').text()+util.addListTitle($('.crm-list-left-nav .state-active').text(), '销售线索', 4));//设置页面头部标题文字
            //清空搜索内容
            header.clearSearch();

            if (tagType == 1 || tagType == 3) {
                $('.update-salesclue-sowner-btn', tplEl).hide();
                $('.create-salesclue-btn', tplEl).hide();
            } else {
                $('.update-salesclue-sowner-btn', tplEl).show();
                $('.create-salesclue-btn', tplEl).show();
            }
            data = {
                queryType: parseFloat(tagType),
                keyword: '',//string，搜索关键字
                states: 0,//int，状态：0、全部；1、未处理；2、已联系；3、关闭
                tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                isCreateOpportunity: -1,//int，是否创建过机会，0、未创建；1、已创建；其他数字、全部；
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，当前页keyword: string，搜索关键字
            };
            salesClue && salesClue.refresh(data);//刷新
            salesClue && salesClue.reSetMnselect();//重置模拟下拉框

        }
    });


});