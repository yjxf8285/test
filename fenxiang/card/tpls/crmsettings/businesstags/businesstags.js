/**
 * CRM - 设置 - 标签管理 - tpl
 *
 * @author liuxiaofan
 * 2014-03-20
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Businesstags = require('modules/crm-businesstags/crm-businesstags'),
        tplCommon = require('../settings-common');


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var businesstagsWarpEl = $('.businesstags-warp', tplEl);
        var businesstags = new Businesstags({
            warpEl: businesstagsWarpEl,
            url: "/FBusinessTag/GetBusinessTags",
            data: {}
        });
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);
        //监听页面切换事件
        tplEvent.on('switched', function (tplName2, tplEl) {
            var queryParams, tagType, data;
            //如果是当前页面
            if (tplName2 == tplName) {
                queryParams = util.getTplQueryParams();   //取地址栏的参数格式示例 /=/tagType-4
                tagType = queryParams ? queryParams.tagtype : 1; //默认打开tagType类型
                data = {
                    tagType: parseFloat(tagType),//int，标签类型(1:客户;2:联系人;3:销售记录;4:销售机会;5:产品;6:竞争对手;7:合同;8:市场活动;9:销售线索;)
                    keyword: ''//string，搜索关键字(标签名称 模糊匹配)
                };
                businesstags && businesstags.refresh(data);//刷新
            }
        });

    };
});