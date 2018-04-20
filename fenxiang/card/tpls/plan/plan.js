/**
 * plan
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('./plan-common'),
        publish = require('modules/publish/publish'),
        Dialog=require('dialog');
    var AtInput=publish.atInput;
    //批量点评日志
    var BatchComment=Dialog.extend({
        "attrs":{
            width: '440px',
            className:'plan-bat-remark-dialog',
            list:null   //列表组件
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .all-checked":"_checkAll",   //全选
            "click .rate-chk":"_cancelCheckAll"     //取消全选
        },
        "_renderCpt":function(){
            var elEl=this.element,
                inputEl=$('.comment-input',elEl);
            var atInput=new AtInput({
                "element":inputEl,
                "withAt":true
            });
            this.atInput=atInput;
        },
        "render":function(){
            var result=BatchComment.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=BatchComment.superclass.show.apply(this,arguments);
            this._createPlanInfo();
            return result;
        },
        "hide":function(){
            var result=BatchComment.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
                commentInputEl=$('.comment-input',elEl),
                commentFieldEl=$('.comment-field',elEl),
                isSendSmsEl=$('.is-send-sms',elEl);
            var requestData={},
                comment= _.str.trim(commentInputEl.val());
            requestData["replyContent"]=comment;
            requestData["feedIDAndRates"]=[];
            commentFieldEl.each(function(){
                var itemEl=$(this),
                    rateSelectEl=$('.rate-select',itemEl),
                    rateChkEl=$('.rate-chk',itemEl);
                var feedIds=itemEl.attr('feedids').split(','),
                    rate=rateSelectEl.val();
                if(rateChkEl.prop('checked')){
                    _.each(feedIds,function(feedId){
                        requestData["feedIDAndRates"].push({
                            "feedID":feedId,
                            "rate":rate
                        });
                    });
                }
            });
            requestData['isSendSms']=isSendSmsEl.prop('checked');
            return requestData;
        },
        "isValid":function(){
            var elEl=this.element,
                commentInputEl=$('.comment-input',elEl),
                commentFieldEl=$('.comment-field',elEl);
            var requestData=this.getRequestData();
            if(requestData["replyContent"].length==0){
                util.showInputError(commentInputEl);
                return false;
            }
            if(commentFieldEl.length==0){
                util.alert('没有需要您点评的日志');
                return false;
            }
            if(requestData["replyContent"].length>2000){
                util.alert('点评内容不能超过2000字，目前已超出<em>'+(requestData['replyContent'].length-2000)+'</em>个字');
                return false;
            }
            if(requestData["feedIDAndRates"].length==0){
                util.alert('请勾选点评内容');
                return false;
            }
            return true;
        },
        "_clear":function(){
            var elEl=this.element,
                commentInputEl=$('.comment-input',elEl),
                commentFieldEl=$('.comment-field',elEl),
                isSendSmsEl=$('.is-send-sms',elEl);
            commentInputEl.val("").trigger('autosize.resize');
            commentFieldEl.remove();
            isSendSmsEl.prop('checked',false);
        },
        "_checkAll":function(){
            var elEl=this.element,
                allChkEl=$('.all-checked',elEl),
                rateChkEl=$('.rate-chk',elEl);
            if(allChkEl.prop('checked')){
                rateChkEl.prop('checked',true);
            }else{
                rateChkEl.prop('checked',false);
            }
        },
        "_cancelCheckAll":function(e){
            var elEl=this.element,
                allChkEl=$('.all-checked',elEl),
                rateChkEl=$('.rate-chk',elEl);
            if(rateChkEl.filter(':checked').length==rateChkEl.length){
                allChkEl.prop('checked',true); //全选
            }else{
                allChkEl.prop('checked',false); //取消全选
            }
        },
        "_submit":function(){
            var that=this;
            var requestData=this.getRequestData();
            if(this.isValid()){
                util.api({
                    "data":requestData,
                    "url":"/feedplan/batchFeedPlanComment",
                    "success":function(responseData){
                        if(responseData.success){
                            that.hide();
                            //更新feed状态
                            that.get('list')&&that.get('list').reload();
                        }
                    }
                });
            }
        },
        "_cancel":function(){
            this.hide();
        },
        "_getPlanInfoCompiled":function(){
            var tplStr='<tr employeeid="{{employeeId}}" feedids="{{feedIDs}}" class="comment-field">'+
                '<td align="left" width="30"><input type="checkbox" class="rate-chk" checked="checked" /></td>'+
           	 	'<td align="left"><img class="pldp_tdimg_head" src="{{profileImage}}" width="25" height="25" />{{employeeName}}</td>'+
                '<td align="left" class="color-999999">评分:'+
                '<select class="rate-select">'+
                    '<option value="5">五分：非常满意</option>'+
                    '<option value="4">四分：超过预期</option>'+
                    '<option value="3" selected="selected">三分：符合要求</option>'+
                    '<option value="2">二分：不合格</option>'+
                    '<option value="1">一分：严重批评</option>'+
                '</select>'+
                '</td>'+
                '<td width="90"><a href="javascript:;" class="fna-blue">共{{count}}条未点评</a></td>'+
            '</tr>';
            return _.template(tplStr);
        },
        "_createPlanInfo":function(){
            var compiled=this._getPlanInfoCompiled();
            var elEl=this.element,
                allChkedWEl=$('.all-checked-wrapper',elEl);
            util.api({
                "url":"/feedplan/getBatchFeedPlanCommentInfos",
                "type":"get",
                "success":function(responseData){
                    var dataItems,
                        htmlStr="";
                    if(responseData.success){
                        dataItems=responseData.value.items;
                        _.each(dataItems,function(dataItem){
                            htmlStr+=compiled({
                                "employeeId":dataItem.employeeID,
                                "employeeName":dataItem.employee.name,
								//"profileImage":util.getDfLink(dataItem.employee.profileImage+'3',dataItem.employee.name,false,'jpg'),
								"profileImage":util.getAvatarLink(dataItem.employee.profileImage,3),
                                "feedIDs":dataItem.feedIDs.join(','),
                                "count":dataItem.feedIDs.length
                            });
							
                        });
                        $(htmlStr).insertAfter(allChkedWEl);
						
						if(dataItems.length == 0){
							$('.dialog-empty-wrap').show();
							$('.rph-list-wrap').hide();
						}else{
							$('.dialog-empty-wrap').hide();
							$('.rph-list-wrap').show();
						}
						
                    }
                }
            });
        },
        "destroy":function(){
            var result;
            this.atInput&&this.atInput.destroy();
            result=BatchComment.superclass.destroy.apply(this,arguments);
            return result;
        }
    });

    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;

        var feedListEl=$('.feed-list',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            feedListCtrEl=$('.plan-status-type',tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        var dialog,
            feedList;
        tplCommon.init(tplEl,tplName);
        //批量点评弹框
        dialog=new BatchComment({
            trigger: $('#btn-remark-plan',tplEl),
            content: $('.bat-remark-plan-tpl', tplEl).html()
        }).render();

        //feedlist列表
        feedList=new FeedList({
            "element":feedListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":10,
                "visiblePageNums":7
            },
            "listPath":"/FeedPlan/GetFeedPlanOfIVetting",
            "defaultRequestData":function(){
                var statusEl=$('.plan-status',feedListCtrEl),
                    typeEl=$('.plan-type',feedListCtrEl);
                var status=statusEl.filter('.depw-tabs-aon').attr('val'),
                    type=typeEl.filter('.depw-tabs-aon').attr('val');
                return {
                    "type":status,   //点评状态
                    "planType":type,
                    "keyword":_.str.trim(searchEl.val())
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
			}
        });
        dialog.set('list',feedList);    //设置feedlist引用
        //feedList.load();
        feedListCtrEl.on('click','.plan-status,.plan-type',function(e){
            var meEl=$(this);
            if(meEl.hasClass('plan-status')){
                $('.plan-status',feedListCtrEl).removeClass('depw-tabs-aon');
                meEl.addClass('depw-tabs-aon');
            }else{
                $('.plan-type',feedListCtrEl).removeClass('depw-tabs-aon');
                meEl.addClass('depw-tabs-aon');
            }
            feedList.reload();
            e.preventDefault();
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            feedList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist
		/*var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                $('.plan-status',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
                $('.plan-type',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
                feedList.reload();
                //刷新右侧列表
				if(!firstRender){
					tplCommon.createRightSb();	
				}else{
					firstRender=false;	
				}
                
            }else{
                feedList&&feedList.loadKill();
            }
        });*/
        var destroy=function(){
            feedList.destroy();
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
        //改为不缓存
        $('.plan-status',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
        $('.plan-type',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
        feedList.reload();
        //刷新右侧列表
        //tplCommon.createRightSb();
    };
});