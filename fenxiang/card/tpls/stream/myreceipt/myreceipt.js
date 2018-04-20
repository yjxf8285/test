/**
 * 我的回执
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var Tabs = require('tabs'),
        util = require('util');
    var FeedList = require('modules/feed-list/feed-list'),
        tplCommon = require('../stream-common');

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName=exports.tplName;

        var listEl=$('.receipt-list',tplEl),
            pagEl = $('.receipt-list-pagination', tplEl),
            searchWEl=$('.search-wrap',tplEl),
            searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl),
            filterWEl=$('.filter-wrapper',tplEl),
            subFilterEl=$('.sub-filter',filterWEl);
        var existReceiptGuide=false;    //设置是否已显示回执标志
        var pageConfig=util.getEnterpriseConfig(107,true)||{};  //服务端页面配置
        var contactData=util.getContactData(),
            loginUserData=contactData['u'];
        //对IsShowReceiptionGuide特殊处理,用于新用户第一次登录
        if(_.isUndefined(pageConfig.IsShowReceiptionGuide)){
            pageConfig.IsShowReceiptionGuide=true;
        }
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);

        var feedList=new FeedList({
            "element":listEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":20,
                "visiblePageNums":7
            },
            "listPath":"/Feed/GetReceiptFeedsOfIReceive",
            "loadSize":15,   //单次加载 15条记录
            "defaultRequestData":function(){
                var requestData={};
                var receiptType=$('.filter .depw-menu-aon',filterWEl).attr('receipttype'),
                    receiptStatus;
                requestData.keyword=_.str.trim(searchEl.val());
                requestData.receiptType=receiptType;
                if(receiptType=="received"){    //收到的回执信息
                    receiptStatus=$('.sub-filter .depw-tabs-aon',filterWEl).attr('receiptstatus');
                    requestData.receiptType=receiptStatus;
                }
                return requestData;
            },
            "listXhrBeforeSend": function () {   //默认原样返回
                existReceiptGuide=false;
                //清理回执引导
                $('.fs-guide-receipt-bracket').remove();
            },
            "itemReadyCb":function(){
                var elEl=this.$el,
                    receiptLinkEl=$('.aj-receipt-fn',elEl);
                if(!loginUserData["isDemoAccount"]&&pageConfig.IsShowReceiptionGuide&&receiptLinkEl.length>0&&!existReceiptGuide){
                    existReceiptGuide=true; //设置回执已存在的标志
                    util.showGuideTip(receiptLinkEl,{
                        "leftTopIncrement":-10,
                        "rightTopIncrement":-10,
                        "imageName":"receiption-item.png",
                        "imagePosition":{
                            "top":"-94px",
                            "left":"20px"
                        },
                        "renderCb":function(imgWEl,leftEl,rightEl,hostEl){
                            //模拟图片map映射
                            var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>'),
                                closeBtnEl=$('<div class="fs-guide-shadow-link"></div>');
                            var closeCb=function(){
                                pageConfig.IsShowReceiptionGuide=false;
                                util.setEnterpriseConfig(107,pageConfig,true);
                                util.updateEnterpriseConfig(107);
                                leftEl.remove();
                                rightEl.remove();
                            };
                            leftEl.addClass('fs-guide-receipt-bracket');
                            rightEl.addClass('fs-guide-receipt-bracket');
                            closeLinkEl.css({
                                "width":"26px",
                                "height":"26px",
                                "position":"absolute",
                                "top":"9px",
                                "left":"240px",
                                "cursor":"pointer"
                            }).appendTo(imgWEl);
                            closeBtnEl.css({
                                "width":"130px",
                                "height":"32px",
                                "position":"absolute",
                                "top":"124px",
                                "left":"100px",
                                "cursor":"pointer"
                            }).appendTo(imgWEl);
                            //点击关闭
                            closeLinkEl.click(function(){
                                closeCb();
                            });
                            //点击关闭按钮
                            closeBtnEl.click(function(){
                                closeCb();
                            });
                            hostEl.one('click',function(){
                                closeCb();
                            });
                        }
                    });
                }
            },
            "reloadAfterReply":false,    //回复后不刷新feed，回执在回复操作里更新
            "searchOpts":{
                "inputSelector":searchEl,
                "btnSelector":searchBtnEl
            } //默认请求数据
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            feedList.reload();
            evt.preventDefault();
        });
        //filter筛选
        filterWEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            var receiptType=meEl.attr('receipttype');
            $('.filter-field',filterWEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            if(receiptType=="received"){
                feedList.opts.listPath="/Feed/GetReceiptFeedsOfIReceive";
                subFilterEl.show();
            }else{
                feedList.opts.listPath="/Feed/GetReceiptFeedsOfISend";
                subFilterEl.hide();
            }
            //清空搜索框
//            $('.empty-h',searchWEl).click();
            //reload
            feedList.reload();
            evt.preventDefault();
        }).on('click','.receipt-status',function(evt){
            var meEl=$(this);
            $('.receipt-status',filterWEl).removeClass('depw-tabs-aon');
            meEl.addClass('depw-tabs-aon');
            //清空搜索框
            //$('.empty-h',searchWEl).click();
            //reload
            feedList.reload();
            evt.preventDefault();
        });


        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        tplEvent.on('switched', function (tplName2) {
            if(tplName2==tplName){
                if(firstRender){
                    feedList.load();
                    firstRender=false;
                }else{
                    //定位到第一个tab
                    $('.filter-field',filterWEl).removeClass('depw-menu-aon').eq(0).addClass('depw-menu-aon');
                    $('.receipt-status',filterWEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
                    $('.sub-filter',filterWEl).show();
                    feedList.opts.listPath="/Feed/GetReceiptFeedsOfIReceive";
                    feedList.reload();
                }
                //回执页隐藏部门引导图提示和头像引导图提示
                $('.fs-guide-group-bracket,.fs-guide-avatar-bracket').css('visibility','hidden');
            }else{
                //切换到其他页面后再可见出来
                $('.fs-guide-group-bracket,.fs-guide-avatar-bracket').css('visibility','visible');
            }
        });
    };
});