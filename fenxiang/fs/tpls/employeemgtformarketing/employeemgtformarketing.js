/**
 * 部门与员工模板
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
        Dialog=require('dialog'),
        Events = require('events'),
        Pagination = require('uilibs/pagination');
    /**
     * 重置密码
     * @type {*}
     */
    var ResetPwd=Dialog.extend({
        "attrs": {
            content: '<div class="ui-dialog-title">重置密码</div>'+
                '<div class="ui-dialog-body">'+
                '<div class="field-container">'+
                '<div class="account-field-wrapper f-field fn-clear">'+
                '<div class="ff-label fn-left">帐号：</div>'+
                '<div class="ff-value fn-left"><input type="text" class="account-field fs-validate-field textfield" inputtip="用户帐号" readonly="readonly" /></div>'+
                '</div>'+
                '<div class="name-field-wrapper f-field fn-clear">'+
                '<div class="ff-label fn-left">姓名：</div>'+
                '<div class="ff-value fn-left"><input type="text" class="name-field fs-validate-field textfield" inputtip="用户姓名" readonly="readonly" /></div>'+
                '</div>'+
                '<div class="pwd-field-wrapper f-field fn-clear">'+
                '<div class="ff-label fn-left">密码：</div>'+
                '<div class="ff-value fn-left"><input type="password" class="pwd-field fs-validate-field textfield auto-focus" inputtip="请输入密码" emptytip="请输入初始密码" /></div>'+
                '</div>'+
                '</div>'+
                '<div class="ui-dialog-bbar fn-clear">'+
                '<div class="bbar-inner fn-right"><button class="f-sub button-submit">保存修改</button>&nbsp;&nbsp;<button class="f-cancel button-cancel">取消</button></div>'+
                '</div>'+
                '</div>',
            className:'department-tree-reset-pwd department-tree-dialog fs-validate',
            width:500,
            data:null,
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function () {
            var result = ResetPwd.superclass.render.apply(this, arguments);
            return result;
        },
        "clear": function () {
            var elEl = this.element,
                nameEl=$('.name-field',elEl),
                accountEl=$('.account-field',elEl),
                pwdEl=$('.pwd-field',elEl);
            nameEl.val("");
            accountEl.val("");
            pwdEl.val("");
        },
        "isValid": function () {
            var passed = true;
            var requestData=this.getRequestData();
            if(requestData["newPassword"].length==0){
                return false;
            }
            return passed;
        },
        "getRequestData": function () {
            var requestData = {};
            var data=this.get('data');
            var elEl=this.element,
                pwdEl=$('.pwd-field',elEl);

            requestData["newPassword"]= _.str.trim(pwdEl.val());
            requestData["employeeID"]= data.employeeId;
            return requestData;
        },
        "_submit": function (evt) {
            var that=this;
            var submitEl=$(evt.currentTarget);
            var successCb=this.get('successCb'),
                requestData=this.getRequestData();
            if(this.isValid()){
                util.api({
                    type: 'post',
                    data: requestData,
                    url: '/Management/ChangeEmployeePassword',
                    success: function (responseData) {
                        successCb&&successCb.call(that,responseData,requestData);
                    }
                },{
                    "submitSelector":submitEl
                });
            }
            evt.preventDefault();
        },
        "setData":function(data){
            var elEl = this.element,
                nameEl=$('.name-field',elEl),
                accountEl=$('.account-field',elEl);
            //渲染dom显示
            nameEl.val(data.name);
            accountEl.val(data.account);
            //设置数据存储
            this.set('data',data);
        },
        "hide":function(){
            var result = ResetPwd.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "_cancel": function (evt) {
            this.hide();
            evt.preventDefault();
        },
        "destroy":function(){
            var result;
            result = ResetPwd.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    var EmployeeList=function(opts){
        opts=_.extend({
            "element":null,
            "itemTpl":'<tr class="{{trCls}}">'+
                '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                '<td><img src="'+FS.BLANK_IMG+'" class="icon-sex icon-sex-{{sex}}" /><a class="employee-name" href="javascript:;">{{name}}</a></td>'+
                '<td><a class="account" href="javascript:;">{{account}}</a></td>'+
                '<td><a class="mobile" href="javascript:;">{{mobile}}</a></td>'+
                '<td class="last-td"><a class="edit-l action-l" href="javascript:;">编辑</a>&nbsp;&nbsp;<a class="{{validCls}} valid-control-l action-l" href="javascript:;">{{validText}}</a>&nbsp;&nbsp;<a class="change-pwd-l action-l" href="javascript:;">重置密码</a></td>'+
                '</tr>',
            "listPath":'/Management/GetEmployees',
            "formatData":function(itemData){
                return _.extend({
                    "trCls":itemData.isStop?"state-disabled":"",
                    "sex":itemData.gender?itemData.gender.toLowerCase():"m",    //默认是
                    "validCls":itemData.isStop?"set-start-l":"set-stop-l",
                    "validText":itemData.isStop?"启用":"停用"
                },itemData);
            }
        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this._lastRequestData=null;
        this._lastListData=null;
        this.init();
    };
    _.extend(EmployeeList.prototype,{
        "init":function(){
            this._renderSelf();
            this._bindEvents();
        },
        "_bindEvents":function(){
            var that=this;
            var elEl=this.element;
            elEl.on('mouseenter','tr',function(){
                $(this).addClass('state-hover');
            }).on('mouseleave','tr',function(){
                    $(this).removeClass('state-hover');
                }).on('click','tr',function(evt){
                    var trEl=$(evt.currentTarget),
                        targetEl=$(evt.target),
                        ckEl=$('.ck',trEl);
                    if(!targetEl.is('.ck')){
                        ckEl.prop('checked',!ckEl.prop('checked')).change();
                    }
                    that.trigger('rowclick',evt);
                });
        },
        "_renderSelf":function(){
            var elEl=this.element;
            elEl.html('<table class="employeemgtformarketing-employee-list" cellpadding="0" cellspacing="0">'+
                '<tbody></tbody>'+
                '</table>');
        },
        "_renderList":function(listData){
            var opts=this.opts,
                itemTpl=opts.itemTpl,
                formatData=opts.formatData;
            var elEl=this.element,
                tbodyEl=$('tbody',elEl);
            var htmlStr='';
            _.each(listData,function(itemData){
                htmlStr+=_.template(itemTpl)(formatData(itemData));
            });
            if(htmlStr.length==0){
                htmlStr+='<tr class="empty-tip"><td>该筛选条件没有找到员工，请更换筛选条件。</td></tr>';
            }
            tbodyEl.html(htmlStr);
        },
        /**
         * 捕获数据
         */
        "_fetch":function(requestData){
            var that=this;
            var opts=this.opts,
                listPath=opts.listPath;
            util.api({
                "url":listPath,
                "data":requestData,
                "type":"get",
                "success":function(responseData){
                    if(responseData.success){
                        that._renderList(responseData.value.items);
                        //触发fetch事件
                        that.trigger('fetch',responseData,requestData);
                        //保存上一次的请求数据
                        that._lastRequestData=requestData;
                        //保存上一次的返回数据
                        that._lastListData=responseData.value.items;
                    }
                }
            });
        },
        /**
         * 覆盖options选项
         * @param opts
         */
        "setOpts":function(opts){
            _.extend(this.opts,opts||{});
        },
        "getItemDataFromSelector":function(trSelector){
            var index=$(trSelector).index();
            return this._lastListData[index];
        },
        /**
         * 获取已选中的员工数据
         */
        "getAllSelectData":function(){
            var that=this;
            var selectDatas=[];
            var elEl=this.element,
                ckCheckedEl=$('.ck',elEl).filter(':checked');
            ckCheckedEl.each(function(){
                var trEl=$(this).closest('tr');
                selectDatas.push(that.getItemDataFromSelector(trEl));
            });
            return selectDatas;
        },
        "load":function(requestData){
            this._fetch(requestData);
        },
        "reload":function(){
            this.load(this._lastRequestData);
        },
        "empty":function(){
            var elEl=this.element,
                bodyEl=$('tbody',elEl);
            bodyEl.empty();
        },
        "destroy":function(){
            this._lastRequestData=null;
            this._lastListData=null;
        }
    });
    Events.mixTo(EmployeeList);

    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var employeeMainEl=$('.employee-main',tplEl),
            employeeNumEl=$('.employee-num',employeeMainEl),
            employeeListWEl=$('.employee-list-wrapper',employeeMainEl),
            filterListEl=$('.filter-list',employeeMainEl),
            firstCharWEl=$('.first-char-wrapper',employeeMainEl),
            searchBoxEl=$('.search-box',employeeMainEl),
            paginationBoxEl=$('.pagination-box',tplEl),
            allCkEl=$('.all-ck',employeeMainEl),
            actionEl=$('.employee-list-action',employeeMainEl),
            employeeEditEl=$('.employee-edit',tplEl),  //用户编辑部分
            editTbarEl=$('.detail-tbar',employeeEditEl),
            employeeAddEl=$('.employee-add',tplEl),  //用户添加部分
            addTbarEl=$('.detail-tbar',employeeAddEl),
            addEmployeeBtnEl=$('.add-employee-btn',employeeMainEl); //新建用户
        var pageSize=20;
        /**
         * 获取员工列表的请求参数
         */
        var getEmpListRq=function(){
            var requestData={};
            var selectedTypeEl=$('.state-active',filterListEl),
                selectedFcEl=$('.state-active',firstCharWEl),
                searchFieldEl=$('.search-field',searchBoxEl);
            var firstCharValue=selectedFcEl.attr('filtervalue'),
                filterType=selectedTypeEl.attr('filtertype'),
                keyword= _.str.trim(searchFieldEl.val());
            if(keyword.length==0){
                requestData["selectAll"]=true;
            }else{
                requestData["selectAll"]=false;
            }
            requestData["keyword"]=keyword;
            if(firstCharValue=="0"){
                requestData["isFirstChar"]=false;
            }else{
                requestData["keyword"]=firstCharValue;
                requestData["isFirstChar"]=true;
                requestData["selectAll"]=false; //拼音检索和搜索互斥
            }
            if(filterType=="0"){    //在职
                requestData["isStop"]=false;
            }else{
                requestData["isStop"]=true;
            }

            requestData["pageSize"]=pageSize;
            requestData["pageNumber"]=1;
            return requestData;
        };
        /**
         * 多个分页组件相同处理
         * @param method
         */
        var paginationAgent=function(method){
            var vals=Array.prototype.slice.call(arguments,1);
            _.each(paginations,function(pagination){
                pagination[method](vals);
            });
        };
        /**
         * 列表功能键控制
         */
        var listActionControl=function(){
            var enableBtn=false;
            $('.ck',employeeList.element).each(function(){
                if($(this).prop('checked')){
                    enableBtn=true;
                    return false;
                }
            });
            if(enableBtn){
                $('.action-btn',actionEl).removeClass('button-state-disabled');
            }else{
                $('.action-btn',actionEl).addClass('button-state-disabled');
            }
        };
        /**
         * 验证员工添加提交信息是否通过
         */
        var employeeAddIsValid=function(){
            var requestData=employeeAddGetRq();
            if(requestData["fullName"].length==0||requestData["mobile"].length==0||requestData["account"].length==0||requestData["password"].length==0){
                return false;
            }
            return true;
        };
        /**
         * 获取员工添加的请求信息
         */
        var employeeAddGetRq=function(){
            var requestData={};
            var titleEl=$('.employee-detail-title',employeeAddEl),
                nameEl=$('.detail-info-wrapper .employee-name',employeeAddEl),
                mobileEl=$('.mobile',employeeAddEl),
                accountEl=$('.account',employeeAddEl),
                pwdEl=$('.pwd',employeeAddEl);
            requestData["account"]= _.str.trim(accountEl.val());
            requestData["fullName"]= _.str.trim(nameEl.val());
            requestData["role"]=0;  //表示为促销宝
            requestData["mobile"]=_.str.trim(mobileEl.val());
            requestData["password"]=_.str.trim(pwdEl.val());
            return requestData;
        };
        /**
         * 添加表单的清理
         */
        var employeeAddClear=function(){
            $('input[type="text"]',employeeAddEl).val("");
            $('.sex',employeeAddEl).prop('checked',false).eq(0).prop('checked',true);
            $('.fs-validate-empty-tip,.fs-validate-input-tip',employeeAddEl).hide();
            $('.field-state-empty,.field-state-input',employeeAddEl).removeClass('field-state-empty field-state-input');
        };
        /**
         * 验证员工编辑提交信息是否通过
         */
        var employeeEditIsValid=function(){
            var requestData=employeeEditGetRq();
            if(requestData["fullName"].length==0||requestData["mobile"].length==0||requestData["account"].length==0){
                return false;
            }
            return true;
        };
        /**
         * 获取员工添加的请求信息
         */
        var employeeEditGetRq=function(){
            var requestData={};
            var employeeData=employeeEditEl.data('employeeData');
            var titleEl=$('.employee-detail-title',employeeEditEl),
                nameEl=$('.detail-info-wrapper .employee-name',employeeEditEl),
                mobileEl=$('.mobile',employeeEditEl),
                accountEl=$('.account',employeeEditEl);
            requestData["employeeID"]= employeeData.employeeID;
            requestData["account"]= _.str.trim(accountEl.val());
            requestData["fullName"]= _.str.trim(nameEl.val());
            requestData["name"]= _.str.trim(nameEl.val());
            requestData["department"]= "";
            requestData["post"]= employeeData.post;
            requestData["role"]=employeeData.role;
            requestData["mobile"]=_.str.trim(mobileEl.val());
            requestData["gender"]=employeeData.gender;
            return requestData;
        };
        /**
         * 编辑表单清理
         */
        var employeeEditClear=function(){
            $('input[type="text"]',employeeEditEl).val("");
            $('.sex',employeeEditEl).prop('checked',false).eq(0).prop('checked',true);
            $('.fs-validate-empty-tip,.fs-validate-input-tip',employeeEditEl).hide();
            $('.field-state-empty,.field-state-input',employeeEditEl).removeClass('field-state-empty field-state-input');
        };
        /**
         * 渲染用户编辑信息
         * @param employeeData
         */
        var renderEmployeeEdit=function(employeeData){
            var nameEl=$('.detail-info-wrapper .employee-name',employeeEditEl),
                mobileEl=$('.mobile',employeeEditEl),
                accountEl=$('.account',employeeEditEl);
            nameEl.val(employeeData.name);
            mobileEl.val(employeeData.mobile);
            accountEl.val(employeeData.account);
        };


        var employeeList=new EmployeeList({
            "element":employeeListWEl
        });
        //分页组件初始化
        var paginations=[];
        paginationBoxEl.each(function(){
            var pagination=new Pagination({
                "element": this,
                "pageSize":pageSize
            });
            pagination.on('page',function(pageNumber){
                //绑定和其他pagination的关联
                _.each(paginations, function(item) {
                    if (item !== pagination) {
                        item.set('activePageNumber', pageNumber);
                    }
                });
                employeeList.load(_.extend(getEmpListRq(),{
                    "pageNumber":pageNumber
                }));
            });
            pagination.render();
            paginations.push(pagination);
        });
        var resetPwdDialog=new ResetPwd({   //重置密码
            "successCb":function(responseData){
                if(responseData.success){
                    this.hide();
                }
            }
        });

        employeeList.on('fetch',function(responseData){
            var dataRoot;
            if(responseData.success){
                dataRoot=responseData.value;
                employeeNumEl.text(dataRoot.totalCount);
                allCkEl.prop('checked',false);
                $('.action-btn',actionEl).addClass('button-state-disabled');
                //设置分页总数
                paginationAgent('setTotalSize',dataRoot.totalCount);
            }

        });
        //筛选控制
        filterListEl.on('click','.filter-item',function(evt){
            var itemEl=$(evt.currentTarget);
            var requestData;
            //先重置先查询条件
            //depSwitchReset();

            $('.state-active',filterListEl).removeClass('state-active');
            itemEl.addClass('state-active');

            requestData=getEmpListRq();
            employeeList.load(requestData);
            evt.preventDefault();
        });
        firstCharWEl.on('click','.first-char-field',function(evt){
            var itemEl=$(evt.currentTarget);
            $('.first-char-field',firstCharWEl).removeClass('state-active');
            itemEl.addClass('state-active');
            employeeList.load(getEmpListRq());
            evt.preventDefault();
        });
        //全选和反全选
        allCkEl.on('change',function(){
            var checked=allCkEl.prop('checked');
            if(checked){
                $('.ck',employeeList.element).prop('checked',true);
            }else{
                $('.ck',employeeList.element).prop('checked',false);
            }
            listActionControl();
        });
        employeeList.element.on('change','.ck',function(){
            var cksEl=$('.ck',employeeList.element);
            var allChecked=true;
            cksEl.each(function(){
                if(!$(this).prop('checked')){
                    return allChecked=false;
                }
            });
            allCkEl.prop('checked',allChecked);
            listActionControl();
        });
        //添加用户
        addEmployeeBtnEl.on('click',function(evt){
            employeeAddClear();
            employeeAddEl.show();
            employeeMainEl.hide();
            evt.preventDefault();
        });
        employeeAddEl.on('click','.return-back-btn',function(){
            employeeAddEl.hide();
            employeeMainEl.show();
            employeeList.load(getEmpListRq());
        }).on('click','.f-sub',function(evt){
            if(employeeAddIsValid()){  //通过了验证
                util.api({
                    "url":'/Management/CreateEmployeeForMarketing',
                    "type":"post",
                    "data":employeeAddGetRq(),
                    "success":function(responseData){
                        var dataRoot;
                        if(responseData.success){
                            //显示成功提示
                            util.showSucessTip("添加成功");
                            //返回列表页
                            employeeMainEl.show();
                            employeeAddEl.hide();
                            employeeList.load(getEmpListRq());
                        }
                    }
                },{
                    "submitSelector":$(evt.currentTarget)
                });
            }
        }).on('click','.f-cancel',function(){
            employeeAddEl.hide();
            employeeMainEl.show();
            employeeList.load(getEmpListRq());
        });
        //编辑用户
        employeeList.element.on('click','.edit-l',function(evt){
            var linkEl=$(evt.currentTarget),
                trEl=linkEl.closest('tr');
            var itemData=employeeList.getItemDataFromSelector(trEl);
            employeeEditClear();
            employeeEditEl.show();
            employeeMainEl.hide();
            //请求员工数据
            util.api({
                "url":'/Management/GetEmployeeByID',
                "type":"get",
                "data":{
                    "employeeId":itemData.employeeID
                },
                "success":function(responseData){
                    var dataRoot;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        renderEmployeeEdit(dataRoot);
                    }
                }
            });
            //设置数据存储
            employeeEditEl.data('employeeData',itemData);
            evt.preventDefault();
        }).on('click','.change-pwd-l',function(evt){   //重置密码
            var linkEl=$(evt.currentTarget),
                trEl=linkEl.closest('tr');
            var employeeData=employeeList.getItemDataFromSelector(trEl);
            resetPwdDialog.show();
            resetPwdDialog.setData({
                "employeeId":employeeData.employeeID,
                "name":employeeData.name,
                "account":employeeData.account
            });
            evt.preventDefault();
        }).on('click','.set-stop-l',function(evt){   //停用
            var linkEl=$(evt.currentTarget),
                trEl=linkEl.closest('tr');
            var employeeData=employeeList.getItemDataFromSelector(trEl);
            util.confirm('是否确定要停用该帐号？该操作后可以在“已停用的帐号”中重新启用', '提示', function (evt) {
                util.api({
                    type: 'post',
                    data: {
                        "employeeId":employeeData.employeeID,
                        "isStop":true
                    },
                    url: '/Management/SetEmployeeStatus',
                    success: function (responseData) {
                        if(responseData.success){
                            //重新加载列表
                            employeeList.load(getEmpListRq());
                        }
                    }
                });
            },{
                "onCancel":function(){}
            });
            evt.preventDefault();
        }).on('click','.set-start-l',function(evt){   //启用
            var linkEl=$(evt.currentTarget),
                trEl=linkEl.closest('tr');
            var employeeData=employeeList.getItemDataFromSelector(trEl);
            util.confirm('是否确定要启用该帐号？', '提示', function (evt) {
                util.api({
                    type: 'post',
                    data: {
                        "employeeId":employeeData.employeeID,
                        "isStop":false
                    },
                    url: '/Management/SetEmployeeStatus',
                    success: function (responseData) {
                        if(responseData.success){
                            //重新加载列表
                            employeeList.load(getEmpListRq());
                        }
                    }
                });
            },{
                "onCancel":function(){}
            });
            evt.preventDefault();
        });
        //列表功能键
        actionEl.on('click','.action-btn',function(evt){
            var btnEl=$(evt.currentTarget);
            var selectDatas=employeeList.getAllSelectData();
            var employeeIDs= _.map(selectDatas,function(itemData){
                return itemData.employeeID;
            });
            var isPassed=true;
            if(btnEl.hasClass('button-state-disabled')){  //禁用的按钮不可点
                return false;
            }
            if(btnEl.hasClass('stop-btn')){  //停用
                _.some(selectDatas,function(itemData){
                    if(itemData.isStop){
                        isPassed=false;
                        return true;
                    }
                });
                if(!isPassed){
                    util.alert('没有被停用的用户可以停用，请选择');
                    return false;
                }
                util.confirm('您确认要停用'+employeeIDs.length+'个用户吗？', '提示', function (evt) {
                    util.api({
                        type: 'post',
                        data: {
                            "employeeIDs":employeeIDs,
                            "isStop":true
                        },
                        url: '/Management/BatchSetEmployeeStatus',
                        success: function (responseData) {
                            if(responseData.success){
                                //重新加载列表
                                employeeList.load(getEmpListRq());
                            }
                        }
                    });
                },{
                    "onCancel":function(){}
                });
            }else if(btnEl.hasClass('start-btn')){  //启用
                _.some(selectDatas,function(itemData){
                    if(!itemData.isStop){
                        isPassed=false;
                        return true;
                    }
                });
                if(!isPassed){
                    util.alert('只有停用的用户才可以启用，请选择');
                    return false;
                }
                util.confirm('您确认要启用'+employeeIDs.length+'个用户吗？', '提示', function (evt) {
                    util.api({
                        type: 'post',
                        data: {
                            "employeeIDs":employeeIDs,
                            "isStop":false
                        },
                        url: '/Management/BatchSetEmployeeStatus',
                        success: function (responseData) {
                            if(responseData.success){
                                //重新加载列表
                                employeeList.load(getEmpListRq());
                            }
                        }
                    });
                },{
                    "onCancel":function(){}
                });
            }else if(btnEl.hasClass('delete-btn')){  //删除
                util.confirm('您确认要删除'+employeeIDs.length+'个用户吗？', '提示', function (evt) {
                    util.api({
                        type: 'post',
                        data: {
                            "employeeIDs":employeeIDs
                        },
                        url: '/Management/BatchDeleteEmployee',
                        success: function (responseData) {
                            if(responseData.success){
                                //重新加载列表
                                employeeList.load(getEmpListRq());
                            }
                        }
                    });
                },{
                    "onCancel":function(){}
                });
            }
        });

        employeeEditEl.on('click','.return-back-btn',function(){
            employeeEditEl.hide();
            employeeMainEl.show();
            employeeList.load(getEmpListRq());
        }).on('click','.f-sub',function(evt){
            if(employeeEditIsValid()){  //通过了验证
                util.api({
                    "url":'/Management/ModifyEmployee',
                    "type":"post",
                    "data":employeeEditGetRq(),
                    "success":function(responseData){
                        var dataRoot;
                        if(responseData.success){
                            //显示成功提示
                            util.showSucessTip("修改成功");
                            //返回列表页
                            employeeMainEl.show();
                            employeeAddEl.hide();
                            employeeList.load(getEmpListRq());
                        }
                    }
                },{
                    "submitSelector":$(evt.currentTarget)
                });
            }
        }).on('click','.f-cancel',function(){
            employeeEditEl.hide();
            employeeMainEl.show();
            employeeList.load(getEmpListRq());
        });
        //搜索事件绑定
        searchBoxEl.on('click','.icon-search',function(){
            //重新加载列表
            employeeList.load(getEmpListRq());
        }).on('keyup','.search-field',function(evt){
            if(evt.keyCode==13){
                //重新加载列表
                employeeList.load(getEmpListRq());
            }
        });

        tplEvent.on('switched', function (tplName2, tplEl) {
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var createAction = queryParams ? queryParams.create : '';
            if(tplName2==tplName){
                if(createAction=="employee"){   //创建员工
                    employeeAddClear();
                    employeeMainEl.hide();
                    employeeAddEl.show();
                }else{
                    employeeMainEl.show();
                    employeeAddEl.hide();
                    //请求列表
                    employeeList.load(getEmpListRq());
                }
                //重置页面title
                document.title="员工管理";
            }
        });
    };
});