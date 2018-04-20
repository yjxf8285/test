/**
 * approve辅助页面逻辑
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var util=require('util'),
        moment=require('moment'),
        Dialog=require('dialog'),
        publish=require('modules/publish/publish'),
        commonStyle=require('./approve-common.css'),
        leftTpl=require('./approve-common.html'),
        leftTplEl=$(leftTpl);

    var SelectBar=publish.selectBar,
        DateSelect=publish.dateSelect;
    //注册子路由
    util.tplRouterReg('#approve/sentapproves/=/:approvestatus-:value');  //可定位到不同的子tab
	 /**
     * 创建右边栏
     */
    var createRightSb=function(tplEl,tplName){
		//右边栏
        var approveRmylistWrapEl=$('.approver-my-list-wrap',tplEl);
        var approveRupslistWrapEl=$('.approver-ups-list-wrap',tplEl);
		//先清空
		approveRmylistWrapEl.empty();
		approveRupslistWrapEl.empty();
        util.api({
            "type":"get",
            "data":{},
            //"url":"/content/fs/data/approve-right-nav.json",
            "url":"/feedApprove/getFeedApprovesInAbeyance",
            "success":function(responseData){
                if(responseData.success){
                    //render 右侧栏 待上级
                    var iSends=responseData.value.iSends,
                        iSendCount=responseData.value.iSendCount;
                    $('.approver-ups-title-count').text(iSendCount);
                    if(iSends.length>5){
                        iSends=iSends.slice(0,5);
                    }
					if(iSends.length>0){
                        var approveRupslistHtml='';
                        _.each(iSends,function(data){
                            if(!data.employee){
                                return;
                            }
                            var employee=data.employee,
                                userName=employee?employee.name:"",
                                userId=data.employeeID,
                                //profileImage=FS.FILES_PATH+'/'+(employee?employee.profileImage:'')+'3.jpg',
                                profileImage=util.getAvatarLink(employee?employee.profileImage:'',3),
                                dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
                                feedId=data.feedID,
                                feedContent=data.feedContent;
                            approveRupslistHtml+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";

                        });
                        approveRupslistWrapEl.html(approveRupslistHtml);
					}else{
						approveRupslistWrapEl.append("<div class='right-list-notext color-999999'>无我审批的事项</div>");	
					}

                    //render 右侧栏 待我
                    var toBeIs=responseData.value.toBeIs,
                        toBeICount=responseData.value.toBeICount;
                    $('.approver-my-title-count').text(toBeICount);
                    if(toBeIs.length>5){
                        toBeIs=toBeIs.slice(0,5);
                    }
					if(toBeIs.length>0){
                        var approveRmylistHtml='';
                        _.each(toBeIs,function(data){
                            if(!data.employee){
                                return;
                            }
                            var employee=data.employee,
                                userName=employee?employee.name:"",
                                userId=data.employeeID,
                                //profileImage=FS.FILES_PATH+'/'+(employee?employee.profileImage:'')+'3.jpg',
                                profileImage=util.getAvatarLink(employee?employee.profileImage:'',3),
                                dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
                                feedId=data.feedID,
                                feedContent=data.feedContent;
                            approveRmylistHtml+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";

                        });
                        approveRmylistWrapEl.html(approveRmylistHtml);
					}else{
						approveRmylistWrapEl.append("<div class='right-list-notext color-999999'>无上级审批的事项</div>");	
					}

                }
            }
        });
	}
	exports.createRightSb=createRightSb;

    /**
     * 人事审批验证密码
     * @type {*}
     */
    var AllApproveValid=Dialog.extend({
        "attrs":{
			width:400,
            className:'all-approve-valid-dialog',
            content:leftTplEl.filter('.all-approve-valid-tpl').html(),
            successCb:FS.EMPTY_FN,
            cancelCb:function(){    //默认跳到stream页
                tpl.navRouter.navigate('#stream', {
                    trigger: true
                });
            },
            defaultRequestData:FS.EMPTY_FN
        },
        "events":{
            "click .ui-dialog-close":"_clickCloseBtn",
            'keydown .pwd':'_keydownPwd',
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel"
        },
        "hide":function(){
            var result=AllApproveValid.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
                pwdEl=$('.pwd',elEl);
            var requestData={
                "password": _.str.trim(pwdEl.val())
            };
            _.extend(requestData,this.get('defaultRequestData')());
            return requestData;
        },
        "isValid":function(){
            var elEl=this.element,
                pwdEl=$('.pwd',elEl);
            if(_.str.trim(pwdEl.val()).length==0){
                util.showInputError(pwdEl);
                return false;
            }
            return true;
        },
        "_clickCloseBtn":function(){
            this.hide();
            this.get('cancelCb').call(this);
        },
        "_clear":function(){
            var elEl=this.element,
                pwdEl=$('.pwd',elEl);
            pwdEl.val("");
        },
        "_keydownPwd":function(evt){
            var elEl=this.element,
                subEl=$('.f-sub',elEl);
            if(evt.keyCode==13){
                this._submit(evt);
            }
        },
        "_submit":function(evt){
            var that=this;
            var requestData=this.getRequestData();
            var subBtnEl=$('.f-sub',this.element);
            if(this.isValid()){
                util.api({
                    "data":requestData,
                    "url":"/Account/ValidateUserAndPermission",
                    "success":function(responseData){
                        if(responseData.success){
                            that.get('successCb').apply(that,[responseData,requestData]);
                            that.hide();
                        }
                    }
                },{
                    "submitSelector":subBtnEl
                });
            }
        },
        "_cancel":function(){
            this.hide();
            this.get('cancelCb').call(this);
        }
    });

    exports.AllApproveValid=AllApproveValid;

    /**
     * 月度考勤统计
     * @type {*}
     */
    var MonthWorkDialog=Dialog.extend({
        "attrs":{
            width:500,
            className:'all-approve-month-work-dialog',
            content:leftTplEl.filter('.all-approve-month-work-tpl').html()
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .download-l":"_hideDownload"
        },
        "hide":function(){
            var result=MonthWorkDialog.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "show":function(){
            var result=MonthWorkDialog.superclass.show.apply(this,arguments);
            var freeReadMeEl=$('.free-download-readme',this.element);   //非免费升级提示说明
            if(!this.inVipService()){
                this._adjustDownLoadTime();
                freeReadMeEl.show();
            }else{
                freeReadMeEl.hide();
            }
            return result;
        },
        "_adjustDownLoadTime":function(callback){
            var that=this;
            var elEl=this.element,
                subBtnEl=$('.f-sub',elEl),
                totalDownloadTimeEl=$('.free-download-readme .total-download-time',elEl);
            subBtnEl.addClass('button-state-disabled');
            util.api({
                "url":"/file/GetDownLoadLimit",
                "type":"get",
                "data":{
                    "bussinessType":4
                },
                "success":function(responseData){
                    var dataRoot,
                        remainTime;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        remainTime=dataRoot.value-dataRoot.value1;
                        subBtnEl.text('生成报表（余'+remainTime+'次）').data('remainTime',remainTime);
                        if(remainTime>0){
                            subBtnEl.removeClass('button-state-disabled');
                        }
                        //设置总下载次数
                        totalDownloadTimeEl.text(dataRoot.value);
                    }
                    callback&&callback.call(that,responseData);
                }
            });
        },
        /**
         * 判断当前登录用户是否是收费用户
         */
        "inVipService":function(){
            var contactData=util.getContactData(),
                loginUserData=contactData["u"];
            return loginUserData.inVipService;
        },
        "render":function(){
            var result=MonthWorkDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        /**
         *渲染组件x
         */
        "_renderCpt":function(){
            var elEl=this.element,
                rangeEl=$('.range-sb',elEl),
                yearSelectEl=$('.year-select',elEl),
                monthSelectEl=$('.month-select',elEl);
            var contactData=util.getContactData(),
                nowYear=moment().year(),
                nowMonth=moment().month(),
                htmlStr='';
            var rangeSb=new SelectBar({
                "element": rangeEl,
                "data": [{
                    "title": "同事",
                    "type": "p",
                    "list": contactData["p"]
                },{
                    "title": "部门",
                    "type": "g",
                    "list": contactData["g"]
                }],
                "title": "请选择同事范围",
                "autoCompleteTitle": "请输入姓名或拼音",
                "acInitData":util.getPublishRange()
            });
            this.sb=rangeSb;
            yearSelectEl.html('<option value="'+(nowYear-1)+'">'+(nowYear-1)+'年</option><option value="'+nowYear+'" selected="selected">'+nowYear+'年</option>');
            for (var i = 1; i <=12; i++) {
                htmlStr+='<option value="'+i+'">'+(i<10?('0'+i):i)+'月</option>';
            }
            monthSelectEl.html(htmlStr).val(nowMonth+1);
        },
        /**
         * 点击下载链接后隐藏
         * @param evt
         */
        "_hideDownload":function(evt){
            var elEl=this.element,
                    subBtnEl=$('.f-sub',elEl);
            var remainTime;
            //如果是免费版，下载次数减1
            if(!this.inVipService()){
                remainTime=subBtnEl.data('remainTime');
                remainTime--;
                subBtnEl.text('生成报表（余'+remainTime+'次）').data('remainTime',remainTime);
                if(remainTime<=0){
                    subBtnEl.addClass('button-state-disabled');
                }
            }
            $(evt.currentTarget).hide();
        },
        "getRequestData":function(){
            var elEl=this.element,
                yearSelectEl=$('.year-select',elEl),
                monthSelectEl=$('.month-select',elEl);
            var sbData=this.sb.getSelectedData();
            var requestData={
                "year": _.str.trim(yearSelectEl.val()),
                "month":_.str.trim(monthSelectEl.val()),
                "circleIds": (sbData['g']||[]).join(','),
                "employeeIds":(sbData['p']||[]).join(',')
            };
            return requestData;
        },
        "isValid":function(){

            return true;
        },
        "_clear":function(){
            var elEl=this.element,
                yearSelectEl=$('.year-select',elEl),
                monthSelectEl=$('.month-select',elEl),
                downloadEl=$('.download-l',elEl);
            var nowYear=moment().year(),
                nowMonth=moment().month();
            yearSelectEl.val(nowYear);
            monthSelectEl.val(nowMonth);
            this.sb.removeAllItem();
            downloadEl.hide();
        },
        "_submit":function(){
            var that=this;
            var elEl=this.element,
                downloadEl=$('.download-l',elEl),
                subEl=$('.f-sub',elEl);
            var requestData=this.getRequestData(),
                downloadName;
            var coreExecuter=function(){
                util.api({
                    "data":requestData,
                    "url":"/FeedApprove/ExportStaffLeaveStatistics",
                    "type":"get",
                    "success":function(responseData){
                        if(responseData.success){
                            downloadName=requestData.year+'-'+requestData.month+'_月度考勤统计.'+
                                util.getFileExtText(responseData.value);
                            downloadEl.attr('href',FS.API_PATH+'/DF/GetTemp1?bussinessType=4&id='+responseData.value+'&name='+encodeURIComponent(downloadName)+'&isAttachment=1').show();
                        }
                    }
                },{
                    "submitSelector":subEl
                });
            };
            if(this.isValid()&&!subEl.hasClass('button-state-disabled')){
                //免费版修正下载次数
                if(!this.inVipService()){
                    this._adjustDownLoadTime(function(responseData){
                        if(responseData.success){
                            coreExecuter();
                        }
                    });
                }else{
                    coreExecuter();
                }
            }
        },
        "_cancel":function(){
            this.hide();
        },
        "destroy":function(){
            var result;
            this.sb&&this.sb.destroy();
            result=MonthWorkDialog.superclass.render.apply(this,arguments);
            return result;
        }
    });
    exports.MonthWorkDialog=MonthWorkDialog;
    /**
     * 汇总统计
     * @type {*}
     */
    var CompDialog=Dialog.extend({
        "attrs":{
            width:500,
            className:'all-approve-comp-dialog',
            content:leftTplEl.filter('.all-approve-comp-tpl').html()
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .date-shortcut":"_clickDateSc",
            "click .clear-l":"_clearDate",
            "click .download-l":"_hideDownload"
        },
        "hide":function(){
            var result=CompDialog.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "show":function(){
            var result=CompDialog.superclass.show.apply(this,arguments);
            var freeReadMeEl=$('.free-download-readme',this.element);   //非免费升级提示说明
            if(!this.inVipService()){
                this._adjustDownLoadTime();
                freeReadMeEl.show();
            }else{
                freeReadMeEl.hide();
            }
            return result;
        },
        "render":function(){
            var result=CompDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "_adjustDownLoadTime":function(callback){
            var that=this;
            var elEl=this.element,
                subBtnEl=$('.f-sub',elEl),
                totalDownloadTimeEl=$('.free-download-readme .total-download-time',elEl);
            subBtnEl.addClass('button-state-disabled');
            util.api({
                "url":"/file/GetDownLoadLimit",
                "type":"get",
                "data":{
                    "bussinessType":5
                },
                "success":function(responseData){
                    var dataRoot,
                        remainTime;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        remainTime=dataRoot.value-dataRoot.value1;
                        subBtnEl.text('生成报表（余'+remainTime+'次）').data('remainTime',remainTime);
                        if(remainTime>0){
                            subBtnEl.removeClass('button-state-disabled');
                        }
                        //设置总下载次数
                        totalDownloadTimeEl.text(dataRoot.value);
                    }
                    callback&&callback.call(that,responseData);
                }
            });
        },
        /**
         *渲染组件x
         */
        "_renderCpt":function(){
            var elEl=this.element,
                rangeEl=$('.range-sb',elEl),
                sdEl=$('.start-date',elEl),
                edEl=$('.end-date',elEl);
            var contactData=util.getContactData();
            var rangeSb=new SelectBar({
                "element": rangeEl,
                "data": [{
                    "title": "同事",
                    "type": "p",
                    "list": contactData["p"]
                },{
                    "title": "部门",
                    "type": "g",
                    "list": contactData["g"]
                }],
                "title": "请选择同事范围",
                "autoCompleteTitle": "请输入姓名或拼音",
                "acInitData":util.getPublishRange()
            }),sd=new DateSelect({
                "element": sdEl,
                "placeholder": "选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            }),ed=new DateSelect({
                "element": edEl,
                "placeholder": "选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            });

            this.sb=rangeSb;
            this.sd=sd;
            this.ed=ed;
        },
        /**
         * 判断当前登录用户是否是收费用户
         */
        "inVipService":function(){
            var contactData=util.getContactData(),
                loginUserData=contactData["u"];
            return loginUserData.inVipService;
        },
        /**
         * 点击下载链接后隐藏
         * @param evt
         */
        "_hideDownload":function(evt){
            var elEl=this.element,
                subBtnEl=$('.f-sub',elEl);
            var remainTime;
            //如果是免费版，下载次数减1
            if(!this.inVipService()){
                remainTime=subBtnEl.data('remainTime');
                remainTime--;
                subBtnEl.text('生成报表（余'+remainTime+'次）').data('remainTime',remainTime);
                if(remainTime<=0){
                    subBtnEl.addClass('button-state-disabled');
                }
            }
            $(evt.currentTarget).hide();
        },
        "_clickDateSc":function(evt){
            var meEl=$(evt.currentTarget);
            var sd=this.sd,
                ed=this.ed;
            if(meEl.hasClass('current-week')){ //本周
                sd.setValue(moment().startOf('week').add('d', 1));
                ed.setValue(moment().endOf('week').add('d', 1));
            }
            if(meEl.hasClass('last-week')){ //上周
                sd.setValue(moment().startOf('week').subtract('w', 1).add('d', 1));
                ed.setValue(moment().startOf('week'));
            }
            if(meEl.hasClass('current-month')){ //本月
                sd.setValue(moment().startOf('month'));
                ed.setValue(moment().endOf('month'));
            }
            if(meEl.hasClass('last-month')){ //上月
                sd.setValue(moment().startOf('month').subtract('M', 1));
                ed.setValue(moment().endOf('month').subtract('M', 1));
            }
            evt.preventDefault();
        },
        "_clearDate":function(evt){
            var sd=this.sd,
                ed=this.ed;
            sd.clear();
            ed.clear();
            evt.preventDefault();
        },
        "getRequestData":function(){
            var elEl=this.element,
                isIncludeReplyEl=$('.is-include-reply',elEl),
                approveTypeEl=$('.approve-type',elEl);
            var sd=this.sd,
                ed=this.ed;
            var sbData=this.sb.getSelectedData(),
                sdDate=sd.getValue(true),
                edDate=ed.getValue(true);
            var requestData={
                "beginTime": sdDate?sdDate.unix():0,
                "endTime":edDate?edDate.unix():0,
                "circleIDs": (sbData['g']||[]).join(','),
                "employeeIDs":(sbData['p']||[]).join(','),
                "approveType":approveTypeEl.filter(':checked').val(),
                "isDisplayReply":isIncludeReplyEl.prop('checked')
            };
            return requestData;
        },
        "isValid":function(){
            var sd=this.sd,
                ed=this.ed;
            var sdDate=sd.getValue(true),
                edDate=ed.getValue(true);
            if(!sdDate){
                util.showInputError(sd.element);
                return false;
            }
            if(!edDate){
                util.showInputError(ed.element);
                return false;
            }
            return true;
        },
        "_clear":function(){
            var elEl=this.element,
                approveTypeEl=$('.approve-type',elEl),
                isIncludeReplyEl=$('.is-include-reply',elEl),
                downloadEl=$('.download-l',elEl);
            approveTypeEl.filter('[value="0"]').prop('checked',true);
            isIncludeReplyEl.prop('checked',false);
            this.sb.removeAllItem();
            this.sd.clear();
            this.ed.clear();
            downloadEl.hide();
        },
        "_submit":function(){
            var that=this;
            var elEl=this.element,
                downloadEl=$('.download-l',elEl),
                subEl=$('.f-sub',elEl);
            var requestData=this.getRequestData(),
                downloadName;
            var coreExecuter=function(){
                util.api({
                    "data":requestData,
                    "url":"/FeedApprove/ExportApprovalSummary",
                    "type":"get",
                    "success":function(responseData){
                        if(responseData.success){
                            downloadName=moment.unix(requestData.beginTime).format('YYYYMMDD')+'-'+moment.unix(requestData.endTime).format('YYYYMMDD')+'审批汇总统计.'+
                                util.getFileExtText(responseData.value);
                            downloadEl.attr('href',FS.API_PATH+'/DF/GetTemp1?bussinessType=5&id='+responseData.value+'&name='+encodeURIComponent(downloadName)+'&isAttachment=1').show();
                        }
                    }
                },{
                    "submitSelector":subEl
                });
            };
            if(this.isValid()&&!subEl.hasClass('button-state-disabled')){
                //免费版修正下载次数
                if(!this.inVipService()){
                    this._adjustDownLoadTime(function(responseData){
                        if(responseData.success){
                            coreExecuter();
                        }
                    });
                }else{
                    coreExecuter();
                }
            }
        },
        "_cancel":function(){
            this.hide();
        },
        "destroy":function(){
            var result;
            this.sb&&this.sb.destroy();
            result=CompDialog.superclass.render.apply(this,arguments);
            return result;
        }
    });
    exports.CompDialog=CompDialog;

    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData();
        //render左边栏信息
        var currentMember=contactData["u"],
            functionPermissions=currentMember.functionPermissions;
        var renderData={};
        var leftCompiled=_.template(leftTplEl.filter('.approve-tpl-left').html()); //模板编译方法
        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });

        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));

        //根据权限显示对应的人事管理和财务管理
        if(_.some(functionPermissions,function(permission){
            return permission.value==3;
        })){   //先判断财务管理
            $('.finance-approve-l',tplLeftEl).closest('.files-nav-item').show();
            //
        }else{
            //在不是财务管理的情况下再判断是否是人事管理员
            if(_.some(functionPermissions,function(permission){
                return permission.value==4;
            })){
                $('.staffing-approve-l',tplLeftEl).closest('.files-nav-item').show();
            }
        }
        //高亮对应的页面导航
        util.regTplNav($('.tpl-nav-lb',tplLeftEl),'depw-menu-aon');
        //右侧渲染
        createRightSb(tplEl,tplName);
        //注册子导航
        util.tplRouterReg($('.tpl-nav-lb',tplLeftEl));
    };
});