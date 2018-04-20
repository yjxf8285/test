/**
 * worktodo 待办
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        Dialog=require('dialog'),
        moduleTpl=require('./fs-worktodo.html'),
//        moduleStyle=require('./fs-worktodo.css'),
        publish=require('modules/publish/publish');
    var moduleTplEl=$(moduleTpl),
        contactData=util.getContactData(),
        currentUserData=contactData["u"];   //当前登录用户信息

    var SelectBar=publish.selectBar,
        AtInput=publish.atInput;
    //创建待办
    var NewWorktodoDialog=Dialog.extend({
        "attrs":{
            className:'fs-worktodo-new-dialog',
            content:moduleTplEl.filter('.add-worktodo-tpl').html(),
            successCb:FS.EMPTY_FN
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel"
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
            var elEl=this.element;
            var rangeSbEl=$('.worktodo-range',elEl),
                rangeSb=new SelectBar({
                    "element": rangeSbEl,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": contactData["p"]
                        }
                    ],
                    "title": "选择同事",
                    "autoCompleteTitle": "请输入同事的名称或拼音",
                    "defaultSelectedData":[{
                        "id":currentUserData.id,
                        "type":"p"
                    }]
                }),
                addTitleEl=$('.worktodo-title',elEl);
            var titleAtInput=new AtInput({
                "element":addTitleEl
            });
            this.sb=rangeSb;
            this.atInput=titleAtInput;
        },
        "render":function(){
            var result=NewWorktodoDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=NewWorktodoDialog.superclass.show.apply(this,arguments);
            return result;
        },
        "hide":function(){
            var result=NewWorktodoDialog.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
                inputEl=$('.worktodo-title',elEl),
                isImportantEl=$('.is-important',elEl);
            var sb=this.sb;
            var requestData={},
                sbData=sb.getSelectedData();
            //title信息
            requestData["title"] = _.str.trim(inputEl.val());
            //同事范围
            requestData["employeeIDs"]= sbData['p'] || [];
            //feedID
            requestData["feedID"]=0;
            //重要事项
            requestData["isImportant"]=isImportantEl.prop('checked');
			requestData["feedType"]=0;
            return requestData;
        },
        "isValid":function(){
            var elEl=this.element,
                inputEl=$('.worktodo-title',elEl);
            var sb=this.sb,
                requestData=this.getRequestData();
            var passed=true;
            if(requestData["employeeIDs"].length==0){
                $('.input-tip', sb.element).click();
                passed=false;
            }
            if(requestData["title"].length==0){
                util.showInputError(inputEl);
                passed=false;
            }
            //标题不能超过1000字
            if (requestData["title"].length >1000) {
                util.alert('内容不超过1000字');
                passed = false;
            }
            return passed;
        },
        "_clear":function(){
            var elEl=this.element,
                inputEl=$('.worktodo-title',elEl),
                isImportantEl=$('.is-important',elEl);
            var sb=this.sb;
            //同事范围
            sb.removeAllItem();
            sb.addItem({
                "id":currentUserData.id,
                "name":currentUserData.name,
                "type":"p"
            });
            //待办标题
            inputEl.val("").trigger('autosize.resize');
            //重要事项
            isImportantEl.prop('checked',false);
        },
        "_submit":function(evt){
            var that=this;
            var requestData=this.getRequestData();
            var subBtnEl=$(evt.currentTarget);
            if(this.isValid()){
                util.api({
                    "data":requestData,
                    "url":"/worktodolist/addWorkToDoList",
                    "success":function(responseData){
                        if(responseData.success){
                            that.get('successCb').apply(that,[responseData,requestData]);
							that.hide();
                        }
                    }
                },{
                    "submitSelector":subBtnEl
                });
            }else{
                evt.stopPropagation();
            }

        },
        "_cancel":function(){
            this.hide();
        },
        "destroy":function(){
            var result;
            this.sb&&this.sb.destroy();
            this.atInput&&this.atInput.destroy();
            result=NewWorktodoDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    _.extend(exports,{
        "NewWorktodoDialog":NewWorktodoDialog
    });
});