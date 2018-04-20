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
        json=require('json'),
        Dialog=require('dialog'),
        Events = require('events'),
        fsHelper=require('modules/fs-qx/fs-qx-helper'),
        Pagination = require('uilibs/pagination');
    var LetterGroupList=fsHelper.LetterGroupList,
        JoinDialog=fsHelper.JoinDialog,
        Uploader=fsHelper.Uploader;
    /**
     * 创建部门
     * @type {*}
     */
    var CreateDepartment=Dialog.extend({
        "attrs": {
            content: '<div class="ui-dialog-title">添加部门</div>'+
                '<div class="ui-dialog-body">'+
                    '<div class="field-container">'+
                    '<div class="f-field fn-clear">'+
                        '<div class="ff-label fn-left">上级部门：</div>'+
                        '<div class="ff-value fn-left"><input type="text" class="parent-department-field fs-validate-field textfield" readonly="readonly" /></div>'+
                        '</div>'+
                    '<div class="department-field-wrapper f-field fn-clear">'+
                        '<div class="ff-label fn-left"><span class="f-field-star">*</span>&nbsp;名称：</div>'+
                        '<div class="ff-value fn-left"><input maxlength="25" type="text" class="department-name-field fs-validate-field textfield auto-focus" emptytip="请输入名称" inputtip="请填写部门名称" /></div>'+
                    '</div>'+
                '</div>'+
                '<div class="ui-dialog-bbar fn-clear">'+
                    '<div class="bbar-inner fn-right"><button class="f-sub button-submit">确定</button>&nbsp;&nbsp;<button class="f-cancel button-cancel">取消</button></div>'+
                '</div>'+
            '</div>',
            className:'department-tree-create-department department-tree-dialog fs-validate',
            width:458,
            data:null,
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function () {
            var result = CreateDepartment.superclass.render.apply(this, arguments);
            return result;
        },
        "isValid": function () {
            var passed = true;
            var requestData=this.getRequestData();

            if(requestData["name"].length==0){
                return false;
            }
            return passed;
        },
        "getRequestData": function () {
            var requestData = {};
            var data=this.get('data');
            var elEl=this.element,
                departmentNameEl=$('.department-name-field',elEl);

            requestData["name"]= _.str.trim(departmentNameEl.val());
            requestData["parentID"]= data.id;
            requestData["description"]= '';
            return requestData;
        },
        "clear": function () {
            var elEl=this.element,
                parentDepartmentEl=$('.parent-department-field',elEl),
                departmentNameEl=$('.department-name-field',elEl);
            parentDepartmentEl.val("");
            departmentNameEl.val("");
            $('.fs-validate-empty-tip,.fs-validate-input-tip',elEl).hide();
            $('.field-state-input,.field-state-empty',elEl).removeClass('field-state-input field-state-empty');
        },
        "_submit": function (evt) {
            var that = this;
            var successCb=this.get('successCb');
            var requestData;
            var elEl = this.element,
                submitEl=$(evt.currentTarget);
            var requestData=this.getRequestData();
            if (this.isValid()) {
                util.api({
                    type: 'post',
                    data: requestData,
                    url: '/Management/CreateCircle',
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
                parentDepartmentEl=$('.parent-department-field',elEl);
            //渲染dom显示
            parentDepartmentEl.val(data.name);
            //设置数据存储
            this.set('data',data);
        },
        "hide":function(){
            var result = CreateDepartment.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "_cancel": function (evt) {
            this.hide();
            evt.preventDefault();
        }
    });
    /**
     * 重命名
     * @type {*}
     */
    var RenameDepartment=Dialog.extend({
        "attrs": {
            content: '<div class="ui-dialog-title">重命名</div>'+
                '<div class="ui-dialog-body">'+
                    '<div class="field-container">'+
                        '<div class="department-field-wrapper f-field fn-clear">'+
                            '<div class="ff-label fn-left"><span class="f-field-star">*</span>&nbsp;名称：</div>'+
                            '<div class="ff-value fn-left"><input maxlength="25" type="text" class="department-name-field fs-validate-field textfield auto-focus" emptytip="请输入名称" inputtip="请填写部门名称" /></div>'+
                        '</div>'+
                    '</div>'+
                '<div class="ui-dialog-bbar fn-clear">'+
                    '<div class="bbar-inner fn-right"><button class="f-sub button-submit">确定</button>&nbsp;&nbsp;<button class="f-cancel button-cancel">取消</button></div>'+
                '</div>'+
            '</div>',
            className:'department-tree-rename-department department-tree-dialog fs-validate',
            width:458,
            data:null,
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function () {
            var result = RenameDepartment.superclass.render.apply(this, arguments);
            return result;
        },
        "isValid": function () {
            var passed = true;
            var requestData=this.getRequestData();

            if(requestData["name"].length==0){
                return false;
            }
            return passed;
        },
        "getRequestData": function () {
            var requestData = {};
            var data=this.get('data');
            var elEl=this.element,
                departmentNameEl=$('.department-name-field',elEl);

            requestData["name"]= _.str.trim(departmentNameEl.val());
            requestData["circleID"]= data.id;
            requestData["description"]= '';
            return requestData;
        },
        "clear": function () {
            var elEl=this.element,
                parentDepartmentEl=$('.parent-department-field',elEl),
                departmentNameEl=$('.department-name-field',elEl);
            parentDepartmentEl.val("");
            departmentNameEl.val("");
            $('.fs-validate-empty-tip,.fs-validate-input-tip',elEl).hide();
            $('.field-state-input,.field-state-empty',elEl).removeClass('field-state-input field-state-empty');
        },
        "_submit": function (evt) {
            var that = this;
            var successCb=this.get('successCb');
            var requestData;
            var elEl = this.element,
                submitEl=$(evt.currentTarget);
            var requestData=this.getRequestData();
            if (this.isValid()) {
                util.api({
                    type: 'post',
                    data: requestData,
                    url: '/Management/ModifyCircle',
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
                departmentEl=$('.department-name-field',elEl);
            //渲染dom显示
            departmentEl.val(data.name);
            //设置数据存储
            this.set('data',data);
        },
        "hide":function(){
            var result = RenameDepartment.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "_cancel": function (evt) {
            this.hide();
            evt.preventDefault();
        }
    });
    /**
     * 移动部门
     * @type {*}
     */
    var MoveDepartment=Dialog.extend({
        "attrs": {
            content: '<div class="ui-dialog-title">移动部门</div>'+
                '<div class="ui-dialog-body">'+
                    '<div class="department-group"></div>'+
                '</div>'+
                '<div class="ui-dialog-bbar fn-clear">'+
                    '<div class="bbar-inner fn-right"><button class="f-sub button-submit">保存修改</button>&nbsp;&nbsp;<button class="f-cancel button-cancel">取消</button></div>'+
                '</div>'+
            '</div>',
            className:'department-tree-move-department department-tree-dialog',
            width:400,
            listData:null,
            data:null,
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function () {
            var result = MoveDepartment.superclass.render.apply(this, arguments);
            this._renderCpt();
            return result;
        },
        "_renderCpt":function(){
            var elEl=this.element;
            var listData=this.get('listData');
            var departmentGroup=new LetterGroupList({
                "element":$('.department-group',elEl),
                "data":listData,
                "cls":"",
                "singleSelect":true, //单选模式
                "clickUnselect":false   //不能反选
            });
            this._departmentGroup=departmentGroup;
        },
        "clear": function () {

        },
        "_submit": function (evt) {
            var that=this;
            var successCb=this.get('successCb'),
                data=this.get('data');
            var elEl = this.element,
                submitEl=$(evt.currentTarget);
            var departmentGroup=this._departmentGroup,
                selectedData=departmentGroup.getSelectedItemData()[0];
            var requestData={
                "circleID":data.id,
                "parentID":selectedData.id
            };
            util.confirm('是否将该部门移动到部门'+selectedData.name+'下', '提示', function (evt) {
                util.api({
                    type: 'post',
                    data: requestData,
                    url: '/Management/CircleMove',
                    success: function (responseData) {
                        successCb&&successCb.call(that,responseData,requestData);
                    }
                },{
                    "submitSelector":submitEl
                });
            },{
                "onCancel":function(){}
            });
            evt.preventDefault();
        },
        /**
         * 根据id返回对应的数据信息
         * @param id
         */
        "getItemData":function(id){
            return this._departmentGroup.getItemDataById(id);
        },
        /**
         * 设置列表数据
         * @param listData
         */
        "setListData":function(listData){
            if(!this.rendered){
                this.render();
            }
            this._departmentGroup.setData(listData);
        },
        "setData":function(data){
            var elEl = this.element,
                titleEl=$('.ui-dialog-title',elEl);
            var parentData=this.getItemData(data.parentID);
            //设置title
            titleEl.text('移动部门 '+data.name+' 到 '+parentData.name);
            //选中对应的item
            this._departmentGroup.selectItem(parentData.id,true);
            //设置数据存储
            this.set('data',data);
        },
        "hide":function(){
            var result = MoveDepartment.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "_cancel": function (evt) {
            this.hide();
            evt.preventDefault();
        },
        "destroy":function(){
            var result;
            this._departmentGroup&&this._departmentGroup.destroy();
            result = MoveDepartment.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
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
    /**
     * 部门tree组件
     * @constructor
     */
    var DepartmentTree=function(opts){
        opts= _.extend({
            "element":null,
            "dataPath":"/Management/GetAllCircleInfos"
        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this.init();
    };
    _.extend(DepartmentTree.prototype,{
        "init":function(){
            this._prepareData(function(treeData){
                this._renderRootNode(treeData);
            });
            //准备右键菜单
            this._prepareContextMenu();
            //准备附属组件
            this._initCpt();
            this._bindEvents();
        },
        "_initCpt":function(){
            var that=this;
            //添加部门弹框
            this._createDepDialog=new CreateDepartment({
                "successCb":function(responseData,requestData){
                    if(responseData.success){
                        that.appendNode(requestData.parentID, _.extend({
                            "children":[]
                        },responseData.value));
                        //that.reload();
                        that._createDepDialog.hide();
                    }
                }
            });
            //重命名
            this._renameDepDialog=new RenameDepartment({
                "successCb":function(responseData,requestData){
                    if(responseData.success){
                        that.renameNode(requestData.circleID,responseData.value);
                        that._renameDepDialog.hide();
                    }
                }
            });
            //移动部门
            this._moveDepDialog=new MoveDepartment({
                "successCb":function(responseData,requestData){
                    if(responseData.success){
                        that.moveNode(that.getNode(requestData.circleID),requestData.parentID,'last');
                        that._moveDepDialog.hide();
                    }
                }
            });
        },
        "_bindEvents":function(){
            var that=this;
            var elEl=this.element;
            elEl.on('click','.state-collapse',function(evt){
                var meEl=$(evt.currentTarget),
                    nodeEl=meEl.closest('.department-node-item');
                that.expandNode(nodeEl);
            }).on('click','.state-expand',function(evt){
                var meEl=$(evt.currentTarget),
                    nodeEl=meEl.closest('.department-node-item');
                that.collapseNode(nodeEl);
            }).on('click','.node-info a',function(evt){     //点击active对应的node
                var meEl=$(evt.currentTarget),
                    nodeEl=meEl.closest('.department-node-item');
                that.selectNode(nodeEl);
                if(!$(evt.target).is('.action-h')){
                    that._contextMenu.hide();
                }
                evt.stopPropagation();
            }).on('mousedown','.node-info a',function(evt){     //右键单击出现功能菜单
                var meEl=$(evt.currentTarget),
                    nodeEl=meEl.closest('.department-node-item');
                if(evt.which==3){  //判断右键
                    //同时激活对应的node
                    that.selectNode(nodeEl);
                    that._updateAndShowCm(nodeEl);
                    //阻止页面默认右键菜单
                    document.oncontextmenu=function(){
                        document.oncontextmenu=null;
                        return false;
                    };
                    return false;
                }
            }).on('click','.node-info .action-h',function(evt){     //右键单击出现功能菜单
                var meEl=$(evt.currentTarget),
                    nodeEl=meEl.closest('.department-node-item');
                that._updateAndShowCm(nodeEl);
            });
        },
        /**
         * 重新加载
         */
        "reload":function(callback){
            this._prepareData(function(treeData){
                this._renderRootNode(treeData);
                callback&&callback.call(this,treeData);
            });
        },
        /**
         * 数据准备
         */
        "_prepareData":function(callback){
            var that=this;
            var opts=this.opts,
                dataPath=opts.dataPath;
            var getTreeData=function(listData){
                var core = function(parentId) {
                    var result = [];
                    _.each(listData,function(itemData){
                        if(itemData.parentID===parentId){
                            itemData.children=core(itemData.id);
                            result.push(itemData);
                        }
                    });
                    //按circleOrder排序
                    result=_.sortBy(result,function(itemData){
                        return itemData.circleOrder;
                    });
                    return result;
                };
                return core(0);
            };

            util.api({
                "url":dataPath,
                "type":"get",
                "success":function(responseData){
                    var dataRoot,
                        copyData,
                        treeData;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        copyData=util.deepClone(dataRoot);
                        copyData.push({
                            "id":0,
                            "name":"全公司",
                            "spell":"#"
                        });
                        //保存原始数据
                        //that._originData=util.deepClone(dataRoot);
                        //设置移动部门功能列表数据
                        //that._moveDepDialog.setListData(copyData);
                        //设置最近一次数据保存
                        that._lastOriginData=copyData;
                        treeData=getTreeData(dataRoot);
                        callback.call(that,treeData);
                    }
                }
            });
        },
        "_prepareContextMenu":function(){
            var that=this;
            var contextMenuEl=$('#department-context-menu');
            if(contextMenuEl.length==0){
                contextMenuEl=$('<div class="department-context-menu fn-hide"></div>');
                contextMenuEl.appendTo('body');
                util.regGlobalClick(contextMenuEl,function(){
                    contextMenuEl.hide();
                });
                contextMenuEl.on('click','.action-item',function(evt){
                    var itemEl=$(evt.currentTarget);
                    var actionName=itemEl.attr('actionname');
                    that['_cm_'+actionName](evt);
                    evt.preventDefault();
                });
            }
            this._contextMenu=contextMenuEl;
        },
        /*"getOriginData":function(){
            return this._originData;
        },*/
        /**
         * 扁平化返回所有的node data
         * 效率低下
         */
        /*"getAllNodeData":function(){
            var elEl=this.element,
                nodesEl=$('.department-node-item',elEl);
            var nodeDatas=[];
            nodesEl.each(function(){
                nodeDatas.push($(this).data('nodeData'));
            });
            return nodeDatas;
        },*/
        "selectNode":function(nodeSelector,slient){
            var elEl=this.element,
                nodeEl=$(nodeSelector),
                nodeInfoEl=$('.node-info',nodeEl).eq(0);
            $('.state-active',elEl).removeClass('state-active');
            nodeInfoEl.addClass('state-active');
            //触发nodeselect事件
            if(!slient){
                this.trigger('nodeselect',nodeEl.data('nodeData'));
            }
        },
        "expandNode":function(nodeSelector){
            var nodeEl=$(nodeSelector),
                visibleHEl=$('.visible-h',nodeEl).eq(0),
                //childrenNodeWEl=$('.children-node-wrapper',nodeEl).eq(0);
                childrenNodeWEl=nodeEl.children('.children-node-wrapper');
            if(childrenNodeWEl.length==0){
                this._renderChildrenNode(nodeEl);
            }
            childrenNodeWEl.show();
            //设置成展开状态
            visibleHEl.addClass('state-expand').removeClass('state-collapse');
            //触发nodeexpand事件
            this.trigger('nodeexpand',nodeEl.data('nodeData'));
        },
        "collapseNode":function(nodeSelector){
            var nodeEl=$(nodeSelector),
                visibleHEl=$('.visible-h',nodeEl).eq(0),
                childrenNodeWEl=nodeEl.children('.children-node-wrapper');
            childrenNodeWEl.hide();
            //设置成展开状态
            visibleHEl.addClass('state-collapse').removeClass('state-expand');
            //触发nodecollapse事件
            this.trigger('nodecollapse',nodeEl.data('nodeData'));
        },
        "_cm_expand":function(evt){
            this.expandNode(this.getActiveNode());
        },
        "_cm_collapse":function(evt){
            this.collapseNode(this.getActiveNode());
        },
        /**
         * 添加下级节点
         * @param evt
         */
        "_cm_createChild":function(evt){
            this.createDepartment();
        },
        /**
         * 提供对接接口添加下级部门
         */
        "createDepartment":function(){
            var createDepDialog=this._createDepDialog;
            createDepDialog.show();
            createDepDialog.setData(this.getActiveNodeData());
        },
        /**
         * 删除节点
         * @param evt
         */
        "_cm_delete":function(evt){
            var that=this;
            var nodeData=this.getActiveNodeData();
            util.confirm('是否确定删除该部门？已经发布了信息的部门不能删除', '提示', function (evt) {
                util.api({
                    "url":'/Management/DeleteCircle',
                    "type":"post",
                    "data":{
                        "circleID":nodeData.id
                    },
                    "success":function(responseData){
                        if(responseData.success){
                            that.deleteNode(nodeData.id);
                        }
                    }
                });
            },{
                "onCancel":function(){}
            });
        },
        /**
         * 重命名
         * @param evt
         */
        "_cm_rename":function(evt){
            var renameDepDialog=this._renameDepDialog;
            renameDepDialog.show();
            renameDepDialog.setData(this.getActiveNodeData());
        },
        /**
         * 停用部门
         * @param evt
         */
        "_cm_stop":function(evt){
            var that=this;
            var nodeData=this.getActiveNodeData(),
                nodeId=nodeData.id;
            util.confirm('是否确定要停用该部门？停用后员工不能再在该部门内发布信息，但是仍可以浏览该部门内之前发布的内容。', '停用部门', function (evt) {
                util.api({
                    "url":'/Management/SetCircleStatus',
                    "type":"post",
                    "data":{
                        "circleID":nodeId,
                        "isStop":true
                    },
                    "success":function(responseData){
                        //var nodeData;
                        if(responseData.success){
                            //获取节点数据
                            //nodeData=that.getNodeData(nodeId);
                            //设置停用状态
                            that.updateNodeState(that.getNode(nodeId),true);
                            /*nodeData.isStop=true;
                            //先清除原节点，再追加到根节点下
                            that.deleteNode(nodeId);
                            that.appendNode(0,nodeData);*/
                            that.moveNode(that.getNode(nodeId),0,'last');
                            //同时设置子节点禁用
                            that.updateChildrenNodeState(that.getNode(nodeId),true);
                        }
                    }
                });
            },{
                "onCancel":function(){}
            });
        },
        /**
         * 启用部门
         * @param evt
         */
        "_cm_active":function(evt){
            var that=this;
            var elEl=this.element,
                rootNodeEl=$('.root-node',elEl),
                nodeWEl=$('.children-node-wrapper',rootNodeEl).eq(0),
                firstDisabledNodeEl=$('.state-disabled',nodeWEl).eq(0).closest('.department-node-item');
            var nodeData=this.getActiveNodeData(),
                nodeId=nodeData.id,
                pos;
            //获取要启用后节点要插入的位置
            if(firstDisabledNodeEl.length==0){
                pos=nodeWEl.children().length-1;
            }else{
                pos=firstDisabledNodeEl.index();
            }
            util.confirm('是否确定要启用该部门？', '启用部门', function (evt) {
                util.api({
                    "url":'/Management/SetCircleStatus',
                    "type":"post",
                    "data":{
                        "circleID":nodeId,
                        "isStop":false
                    },
                    "success":function(responseData){
                        if(responseData.success){
                            //设置启用状态
                            that.updateNodeState(that.getNode(nodeId),false);
                            //移动到禁用节点之前
                            that.moveNode(that.getNode(nodeId),0,pos);
                            //同时设置子节点启用
                            that.updateChildrenNodeState(that.getNode(nodeId),false);
                        }
                    }
                });
            },{
                "onCancel":function(){}
            });
        },
        /**
         * 上移
         * @param evt
         */
        "_cm_moveUp":function(evt){
            var that=this;
            var nodeData=this.getActiveNodeData(),
                nodeId=nodeData.id;
            var nodeEl=that.getNode(nodeId);
            var pos=this.getNodePosition(nodeEl);
            util.api({
                "url":'/Management/SetCircleOrder',
                "type":"post",
                "data":{
                    "circleID":nodeId,
                    "isUp":true
                },
                "success":function(responseData){
                    if(responseData.success){
                        //上移一位
                        that.moveNode(nodeEl,pos-1);
                    }
                }
            });
        },
        /**
         * 下移
         * @param evt
         */
        "_cm_moveDown":function(evt){
            var that=this;
            var nodeData=this.getActiveNodeData(),
                nodeId=nodeData.id;
            var nodeEl=that.getNode(nodeId);
            var pos=this.getNodePosition(nodeEl);
            util.api({
                "url":'/Management/SetCircleOrder',
                "type":"post",
                "data":{
                    "circleID":nodeId,
                    "isUp":false
                },
                "success":function(responseData){
                    if(responseData.success){
                        //下移一位
                        that.moveNode(nodeEl,pos+2);
                    }
                }
            });
        },
        "_getSelfAndChildrenData":function(selfId){
            var lastOrginData=this.getAllNodeData();
            var result=[];
            var getChildrenData=function(parentId){
                _.each(lastOrginData,function(itemData){
                    if(itemData.parentID==parentId){
                        result.push(itemData);
                        getChildrenData(itemData.id);
                    }
                });
            };
            getChildrenData(selfId);
            return result;
        },
        /**
         * 修改上级节点
         * @param evt
         */
        "_cm_modifyParent":function(evt){
            var moveDepDialog=this._moveDepDialog;
            var lastOrginData=this.getAllNodeData(),
                activeNodeData=this.getActiveNodeData();
            var listData=[],
                rejectData=this._getSelfAndChildrenData(activeNodeData.id);
            _.each(lastOrginData,function(itemData){
                if(!_.some(rejectData,function(itemData2){
                    return itemData2.id==itemData.id;
                })){
                    listData.push(itemData);
                }
            });
            //把激活的节点排除掉
            listData= _.reject(listData,function(itemData){
                return itemData.id==activeNodeData.id;
            });
            moveDepDialog.show();
            //设置列表数据
            moveDepDialog.setListData(listData);
            moveDepDialog.setData(this.getActiveNodeData());
        },
        "_renderRootNode":function(treeData){
            var elEl=this.element;
            var treeEl=$('<ul class="department-node-list"></ul>'),
                rootNodeEl=$('<li class="department-node-item root-node" nodeid="0"><div class="node-info state-active"><img src="'+FS.BLANK_IMG+'" class="visible-h state-expand" alt="" /><a href="javascript:;"><span class="node-text">全公司</span><img src="'+FS.BLANK_IMG+'" class="action-h" alt="" /></a></div></li>');
            rootNodeEl.data('nodeData',{
                "id":0,
                "name":"全公司",
                "spell":"#",
                "children":treeData
            });
            elEl.empty();
            rootNodeEl.appendTo(treeEl);
            treeEl.appendTo(elEl);
            //默认直接展开第一层
            this._renderChildrenNode(rootNodeEl);
            //触发nodeselect事件
            this.trigger('nodeselect',{
                "id":0,
                "name":"全公司"
            });
        },
        "_renderChildrenNode":function(nodeSelector){
            var that=this;
            var nodeEl=$(nodeSelector),
                wEl=$('.children-node-wrapper',nodeEl);
            var nodeData=nodeEl.data('nodeData'),
                childrenData=nodeData.children;
            if(wEl.length==0){
                wEl=$('<div class="children-node-wrapper"></div>');
                wEl.appendTo(nodeEl);
            }
            _.each(childrenData,function(itemData){
                that._createNode(itemData).appendTo(wEl);
            });
        },
        "_createNode":function(nodeData){
            var stateCls='';
            var visibleHStr='<img src="'+FS.BLANK_IMG+'" class="icon-node" alt="" />';
            if(nodeData.children.length>0){
                visibleHStr='<img src="'+FS.BLANK_IMG+'" class="visible-h state-collapse" alt="" />';
            }
            //node状态
            if(nodeData.isStop){
                stateCls='state-disabled';
            }
            var nodeEl=$('<li class="department-node-item" nodeid="'+nodeData.id+'"><div class="node-info '+stateCls+'">'+visibleHStr+'<a href="javascript:;" title="'+nodeData.name+'"><span class="node-text">'+nodeData.name+'</span><img src="'+FS.BLANK_IMG+'" class="action-h" alt="" /></a></div></li>');
            //存储引用
            return nodeEl.data('nodeData',nodeData);
        },
        /**
         * 更新和显示右键菜单
         * @param nodeSelector
         */
        "_updateAndShowCm":function(nodeSelector){
            var nodeEl=$(nodeSelector),
                nodeLinkEl=$('.node-info a',nodeEl).eq(0),
                visibleHEl=$('.visible-h',nodeEl).eq(0);
            var nodeData=nodeEl.data('nodeData'),
                offsetPos=nodeLinkEl.offset();
            var contextMenuEl=this._contextMenu;
            var actionList=[],
                actionStr='';
            //构建菜单内容，分区三种node状态，有子集的node，无子集的node，禁用的node
            if(nodeData.isStop){    //被禁用了
                actionList.push([{
                    "actionName":"rename",
                    "text":"重命名"
                }]);
                actionList.push([{
                    "actionName":"active",
                    "text":"启用"
                },{
                    "actionName":"delete",
                    "text":"删除"
                }]);
            }else{
                if(nodeData.children.length>0){     //带子集
                    if(visibleHEl.hasClass('state-collapse')){ //收起状态
                        actionList.push([{
                            "actionName":"expand",
                            "text":"展开"
                        }]);
                    }else{
                        actionList.push([{
                            "actionName":"collapse",
                            "text":"收起"
                        }]);
                    }
                }
                if(nodeData.id==0){    //区分根节点
                    actionList.push([{
                        "actionName":"createChild",
                        "text":"新建下级"
                    }]);
                }else{
                    actionList.push([{
                        "actionName":"createChild",
                        "text":"新建下级"
                    },{
                        "actionName":"modifyParent",
                        "text":"修改上级"
                    },{
                        "actionName":"rename",
                        "text":"重命名"
                    }]);

                    actionList.push([{
                        "actionName":"stop",
                        "text":"停用"
                    },{
                        "actionName":"delete",
                        "text":"删除"
                    }]);

                    actionList.push([{
                        "actionName":"moveUp",
                        "text":"上移"
                    },{
                        "actionName":"moveDown",
                        "text":"下移"
                    }]);
                }

            }
            _.each(actionList,function(childList){
                actionStr+='<ul class="action-box">';
                _.each(childList,function(itemData,i){
                    var lastItemCls='';
                    if(i==childList.length-1){
                        lastItemCls='last-action-item';
                    }
                    actionStr+='<li class="action-item" actionname="'+itemData.actionName+'"><a href="javascript:;" title="'+itemData.text+'"><span class="'+lastItemCls+'">'+itemData.text+'</span></a></li>';
                });
                actionStr+='</ul>';
            });
            contextMenuEl.html(actionStr);
            //菜单定位
            contextMenuEl.css({
                "top":offsetPos.top+nodeLinkEl.outerHeight()-9,
                "left":offsetPos.left+nodeLinkEl.outerWidth()-11
            });
            contextMenuEl.show();
        },
        "_updateNodeView":function(nodeSelector){
            var nodeEl=$(nodeSelector),
                nodeInfoEl=nodeEl.children('.node-info'),
                iconEl=$('img.icon-node,img.visible-h',nodeInfoEl),
                childrenNodeWEl=nodeEl.children('.children-node-wrapper'),
                childrenNodeEl=childrenNodeWEl.children();
            if(childrenNodeEl.length>0){
                iconEl.addClass('visible-h');
                if(childrenNodeWEl.is(':visible')){
                    iconEl.addClass('state-expand');
                }else{
                    iconEl.addClass('state-collapse');
                }
            }else{
                iconEl.removeClass('visible-h state-expand state-collapse').addClass('icon-node');
            }
        },
        /**
         * 获取激活的node
         */
        "getActiveNode":function(){
            return $('.state-active',this.element).closest('.department-node-item');
        },
        "getActiveNodeData":function(){
            return this.getActiveNode().data('nodeData');
        },
        "getNode":function(nodeId){
            var elEl=this.element,
                nodeEl=$('[nodeid="'+nodeId+'"]',elEl);
            return nodeEl;
        },
        "getNodeData":function(nodeId){
            return this.getNode(nodeId).data('nodeData');
        },
        "setNodeData":function(nodeId,nodeData){
            var elEl=this.element,
                nodeEl=$('[nodeid="'+nodeId+'"]',elEl);
            nodeEl.data('nodeData', _.extend(nodeEl.data('nodeData'),nodeData||{}));
        },
        "appendNode":function(parentId,nodeData){
            var elEl=this.element,
                parentNodeEl=$('[nodeid="'+parentId+'"]',elEl),
                nodeWEl;
            var parentNodeData=parentNodeEl.data('nodeData');
            //重新渲染
            this.expandNode(parentNodeEl);
            nodeWEl=$('.children-node-wrapper',parentNodeEl).eq(0);
            this._createNode(nodeData).appendTo(nodeWEl);
            //添加数据存储
            parentNodeData.children.push(nodeData);
            //更新节点状态
            this._updateNodeView(parentNodeEl);
        },
        "moveNode":function(nodeSelector,parentId,index){
            var elEl=this.element,
                nodeEl=$(nodeSelector),
                oldParentNodeEl,
                parentNodeEl,
                nodeWEl,
                childrenNodeEl;
            var nodeData=nodeEl.data('nodeData'),
                parentNodeData,
                oldParentNodeData;
            oldParentNodeEl=nodeEl.parent().parent();    //保存原来的父节点，用于显示更新
            if(_.isUndefined(index)){      //两个参数表示在同一个父节点内移动
                index=parentId;
                parentId=nodeData.parentID;
            }
            parentNodeEl=$('[nodeid="'+parentId+'"]',elEl);
            //保证是展开状态
            this.expandNode(parentNodeEl);
            nodeWEl=$('.children-node-wrapper',parentNodeEl).eq(0);
            childrenNodeEl=nodeWEl.children();
            //先清除原来的节点
            //this.deleteNode(nodeData.id);
            //更新父节点id
            nodeData.parentID=parentId;
            //获取父数据源
            parentNodeData=parentNodeEl.data('nodeData');
            oldParentNodeData=oldParentNodeEl.data('nodeData');

            if(childrenNodeEl.length==0){
                nodeEl.appendTo(nodeWEl);
                //数据存储更新
                oldParentNodeData.children=_.reject(oldParentNodeData.children,function(itemData){
                    return itemData.id==nodeData.id;
                });
                parentNodeData.children.push(nodeData);
                //更新节点显示状态
                this._updateNodeView(parentNodeEl);
                this._updateNodeView(oldParentNodeEl);
                return;
            }
            //数据存储更新
            oldParentNodeData.children=_.reject(oldParentNodeData.children,function(itemData){
                return itemData.id==nodeData.id;
            });
            if(_.isNumber(index)){
                if(index<=0){
                    //this._createNode(nodeData).prependTo(nodeWEl);
                    nodeEl.prependTo(nodeWEl);
                    parentNodeData.children.unshift(nodeData);
                }else{
                    if(index>=childrenNodeEl.length){  //防止超出最大范围
                        index=childrenNodeEl.length;
                    }
                    //this._createNode(nodeData).insertAfter(nodeWEl.children().eq(index-1));
                    if(nodeEl[0]!==childrenNodeEl.eq(index-1)[0]){
                        nodeEl.insertAfter(childrenNodeEl.eq(index-1));
                        parentNodeData.children.splice(index,0,nodeData);
                    }
                }
            }else{
                if(index=="first"){
                    nodeEl.prependTo(nodeWEl);
                    parentNodeData.children.unshift(nodeData);
                }else if(index=="last"){
                    if(nodeEl[0]!==childrenNodeEl.last()[0]){
                        nodeEl.insertAfter(childrenNodeEl.last());
                        parentNodeData.children.push(nodeData);
                    }
                }
            }

            //更新节点显示状态
            this._updateNodeView(parentNodeEl);
            this._updateNodeView(oldParentNodeEl);
        },
        "deleteNode":function(nodeId){
            var elEl=this.element,
                nodeEl=$('[nodeid="'+nodeId+'"]',elEl),
                parentNodeEl=this.getParentNode(nodeEl);
            var parentNodeData=parentNodeEl.data('nodeData');
            var nodeData=nodeEl.data('nodeData');
            //清除数据
            parentNodeData.children= _.reject(parentNodeData.children,function(itemData){
                return itemData.id==nodeId;
            });
            //dom清除
            nodeEl.remove();
            //更新节点显示状态
            this._updateNodeView(parentNodeEl);
            //触发nodedelete事件
            this.trigger('nodedelete',nodeData);
        },
        "renameNode":function(nodeId,newNodeData){
            var elEl=this.element,
                nodeEl=$('[nodeid="'+nodeId+'"]',elEl),
                nodeInfoEl=$('.node-info',nodeEl).eq(0),
                nodeTextEl=$('.node-text',nodeInfoEl);
            var nodeData=nodeEl.data('nodeData');
            //更新数据
            nodeEl.data('nodeData', _.extend(nodeData,newNodeData));
            $('a',nodeInfoEl).attr('title',newNodeData.name);
            nodeTextEl.text(newNodeData.name);
        },
        "getParentNode":function(nodeSelector){
            var nodeEl=$(nodeSelector);
            //return nodeEl.closest('.department-node-item');
            return nodeEl.parent().parent('.department-node-item');
        },
        "getNodePosition":function(nodeSelector){
            var nodeEl=$(nodeSelector);
            return nodeEl.index();
        },
        /**
         * 更新子节点启用和停用状态
         */
        "updateChildrenNodeState":function(nodeSelector,isStop){
            var nodeEl=$(nodeSelector),
                childrenNodeEl=$('.department-node-item',nodeEl);
            if(isStop){
                childrenNodeEl.each(function(){
                    var itemEl=$(this);
                    var nodeData=itemEl.data('nodeData');
                    nodeData.isStop=true;
                    $('.node-info',itemEl).eq(0).addClass('state-disabled');
                });
            }else{
                childrenNodeEl.each(function(){
                    var itemEl=$(this);
                    var nodeData=itemEl.data('nodeData');
                    nodeData.isStop=false;
                    $('.node-info',itemEl).eq(0).removeClass('state-disabled');
                });
            }
        },
        /**
         * 停用或启用节点状态
         * @param nodeSelector
         * @param isStop
         */
        "updateNodeState":function(nodeSelector,isStop){
            var nodeEl=$(nodeSelector);
            var nodeData=nodeEl.data('nodeData');
            nodeData.isStop=isStop;
            if(isStop){
                $('.node-info',nodeEl).eq(0).addClass('state-disabled');
            }else{
               $('.node-info',nodeEl).eq(0).removeClass('state-disabled');
            }
        },
        "getAllNodeData":function(){
            var elEl=this.element,
                nodesEl=$('.department-node-item',elEl);
            var results=[];
            nodesEl.each(function(){
                var nodeData=$(this).data('nodeData');
                var copyData=util.deepClone(nodeData);
                delete copyData.children;
                results.push(copyData);
            });
            return results;
        },
        "destroy":function(){

        }
    });
    Events.mixTo(DepartmentTree);

    var EmployeeList=function(opts){
        opts=_.extend({
            "element":null,
            "itemTpl":'<tr class="{{trCls}}">'+
                '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                '<td><img src="'+FS.BLANK_IMG+'" class="icon-sex icon-sex-{{sex}}" /><a class="employee-name" href="javascript:;">{{name}}</a></td>'+
                '<td class="account"><a class="account" href="javascript:;" title="{{account}}">{{account}}</a></td>'+
                '<td><a class="post" href="javascript:;">{{post}}</a></td>'+
                '<td class="last-td"><a class="mobile" href="javascript:;">{{mobile}}</a></td>'+
                '</tr>',
            "listPath":'/Management/GetAllEmployees',
            "formatData":function(itemData){
                return _.extend({
                    "trCls":itemData.isStop?"state-disabled":"",
                    "sex":itemData.gender.toLowerCase()
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
            elEl.html('<table class="departmentstaff-employee-list" cellpadding="0" cellspacing="0">'+
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
         * 设置加载loading
         */
        "_showFetchLoading":function(){
            var elEl=this.element,
                tbodyEl=$('tbody',elEl);
            tbodyEl.html('<tr class="loading-tip"><td><img src="'+FS.BLANK_IMG+'" alt="loading" class="icon-loading" />&nbsp;正在加载中，请稍后。</td></tr>');
        },
        /**
         * 捕获数据
         */
        "_fetch":function(requestData){
            var that=this;
            var opts=this.opts,
                listPath=opts.listPath;
            this._showFetchLoading();
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
            },{
                "abortLast":true    //终止上次请求
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
        /**
         * 获取所有的列表数据
         */
        "getListData":function(){
            return this._lastListData;
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
        var treeEl=$('.department-tree',tplEl),
            employeeMainEl=$('.employee-main',tplEl),
            departmentTitleEl=$('.department-title',employeeMainEl),
            employeeNumEl=$('.employee-num',employeeMainEl),
            employeeListWEl=$('.employee-list-wrapper',employeeMainEl),
            filterListEl=$('.filter-list',employeeMainEl),
            searchBoxEl=$('.search-box',employeeMainEl),
            sortEl=$('.sort-list',employeeMainEl),
            allCkEl=$('.all-ck',employeeMainEl),
            actionEl=$('.employee-list-action',employeeMainEl),
            modifyEmpBtnEl=$('.modify-employee-btn',employeeMainEl),
            paginationBoxEl=$('.pagination-box',tplEl),
            allCkEl=$('.all-ck',employeeMainEl),
            employeeDetailEl=$('.employee-detail',tplEl),  //用户详细信息部分
            detailTbarEl=$('.detail-tbar',employeeDetailEl),
            employeeEditEl=$('.employee-edit',tplEl),  //用户编辑部分
            editTbarEl=$('.detail-tbar',employeeEditEl),
            employeeAddEl=$('.employee-add',tplEl),  //用户添加部分
            addTbarEl=$('.detail-tbar',employeeAddEl),
            addEmployeeBtnEl=$('.add-employee-btn',employeeMainEl), //新建用户
            addCircleBtnEl=$('.department-nav .add-circle-btn',tplEl),  //添加部门
            enterBatchImportBtnEl=$('.batch-import-btn',employeeMainEl),    //进入批量导入页
            batchImportEl=$('.batch-import',tplEl), //批量导入页
            batchUploadBtnEl=$('.upload-field',batchImportEl), //上传按钮
            importBtnEl=$('.import-btn',batchImportEl), //导入提交
            exportBtnEl=$('.export-employee-btn',tplEl); //导出按钮
        //当前选中的nodeData
        var currentNodeData,
            circleOriginData,  //部门原始数据
            pageSize=20;
        var globalData=FS.getAppStore('globalData');
        var departmentTree=new DepartmentTree({
            "element":treeEl
        }),employeeList=new EmployeeList({
            "element":employeeListWEl
        }),modifyEmpDialog=new JoinDialog({
            "className":"fs-qx-join-dialog modify-employee-dialog",
            "unjoinLabel":"部门外员工",
            "joinLabel":"部门内员工",
            "unit":"项",
            "inputPlaceholder":"输入关键词，快速筛选员工",
            "unjoinEmptyTip":"没有未选员工",
            "unjoinSearchEmptyTip":"没有筛选条件为{{keyword}}的员工",
            "joinEmptyTip":"没有已选员工",
            "joinSearchEmptyTip":"没有筛选条件为{{keyword}}的员工",
            "successCb":function(joinDatas){
                var dataState=this.joinList.getDataState(),
                    lostData=dataState.lost||[],
                    addData=dataState.add||[];
                /*var addEmployeeIDs;
                addEmployeeIDs= _.map(joinDatas,function(itemData){
                    return itemData.id;
                });*/
                util.api({
                    "url":'/Management/ModifyCircleEmployees',
                    "type":"post",
                    "data":{
                        "circleID":currentNodeData.id,
                        "addEmployeeIDs":_.map(addData,function(itemData){
                            return itemData.id;
                        }),
                        "deleteEmployeeIDs":_.map(lostData,function(itemData){
                            return itemData.id;
                        })
                    },
                    "success":function(responseData){
                        if(responseData.success){
                            employeeList.reload();
                            modifyEmpDialog.hide();
                        }
                    }
                });
            }
        }).render(),modifyCircleDialog=new JoinDialog({   //修改员工所属部门
            "className":"fs-qx-join-dialog modify-circle-dialog",
            "unjoinLabel":"其它部门",
            "joinLabel":"所属部门",
            "unit":"项",
            "bbarUnit":"部门",
            "inputPlaceholder":"输入关键词，快速筛选部门",
            "unjoinEmptyTip":"没有未选部门",
            "unjoinSearchEmptyTip":"没有筛选条件为{{keyword}}的部门",
            "joinEmptyTip":"没有已选部门",
            "joinSearchEmptyTip":"没有筛选条件为{{keyword}}的部门"
        }).render(),resetPwdDialog=new ResetPwd({   //重置密码
            "successCb":function(responseData){
                if(responseData.success){
                    this.hide();
                }
            }
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
                /*employeeList.load(_.extend(getEmpListRq(),{
                    "pageNumber":pageNumber
                }));*/
                employeeList.load(getEmpListRq());
            });
            pagination.render();
            paginations.push(pagination);
        });
        /**
         * 部门切换的重置
         */
        var depSwitchReset=function(){
            modifyEmpBtnEl.hide();
            departmentTitleEl.empty();
            employeeNumEl.empty();
            $('.filter-item',filterListEl).removeClass('state-active').eq(0).addClass('state-active');

            $('.search-field',searchBoxEl).val("");
            sortEl.val(0);
            allCkEl.prop('checked',false);
            $('.action-btn',actionEl).addClass('button-state-disabled');
            //列表重置
            //list功能键控制
            $('.stop-btn,.start-btn',actionEl).show();
            sortEl.show();
            exportBtnEl.show();
            employeeList.setOpts({
                "itemTpl":'<tr class="{{trCls}}">'+
                    '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                    '<td><img src="'+FS.BLANK_IMG+'" class="icon-sex icon-sex-{{sex}}" /><a class="employee-name" href="javascript:;">{{name}}</a></td>'+
                    '<td class="account"><a class="account" href="javascript:;" title="{{account}}">{{account}}</a></td>'+
                    '<td><a class="post" href="javascript:;">{{post}}</a></td>'+
                    '<td class="last-td"><a class="mobile" href="javascript:;">{{mobile}}</a></td>'+
                    '</tr>',
                "listPath":'/Management/GetAllEmployees',
                "formatData":function(itemData){
                    return _.extend({
                        "trCls":itemData.isStop?"state-disabled":"",
                        "sex":itemData.gender.toLowerCase()
                    },itemData);
                }
            });
            //列表清空
            employeeList.empty();
            //分页重置
            paginationAgent('reset');
        };
        /**
         * 获取本部门员工列表数据
         * @param originData
         */
        var getModifyEmpJoinData=function(originData){
            var joinData=[];
            var allItems=originData.allItems,
                currentIDs=originData.currentIDs;
            _.each(currentIDs,function(id){
                var itemData;
                itemData= _.find(allItems,function(itemData2){
                    return itemData2.value==id;
                });
                if(itemData){
                    joinData.push({
                        "id":itemData.value,
                        "name":itemData.value2,
                        "spell":itemData.value3
                    });
                }

            });
            return joinData;
        };
        var getModifyEmpUnjoinData=function(originData,circleId){
            var unjoinData=[];
            var circleItems=originData.circleItems,
                allItems=originData.allItems,
                currentIDs=originData.currentIDs;
            var currentCircleData,
                allEmployeeIds,
                rejectEmployeeIds=[];
            if(circleId!=0){
                currentCircleData= _.find(circleItems,function(itemData){
                    return itemData.value==circleId;
                });
                allEmployeeIds=currentCircleData.value2;
            }else if(circleId==0){
                allEmployeeIds= _.map(allItems,function(itemData){
                    return itemData.value;
                });
            }

            _.each(allEmployeeIds,function(id){
                if(!_.contains(currentIDs,id)){
                    rejectEmployeeIds.push(id);
                }
            });

            _.each(rejectEmployeeIds,function(id){
                var itemData;
                itemData= _.find(allItems,function(itemData2){
                    return itemData2.value==id;
                });
                if(itemData){
                    unjoinData.push({
                        "id":itemData.value,
                        "name":itemData.value2,
                        "spell":itemData.value3
                    });
                }

            });
            return unjoinData;
        };
        /**
         * 获取本员工所属部门列表数据
         * @param originData
         */
        var getModifyCircleJoinData=function(originData){
            var joinData=[];
            var allItems=originData.allItems,
                currentIDs=originData.currentIDs;
            _.each(currentIDs,function(id){
                var itemData,
                    name;
                itemData= _.find(allItems,function(itemData2){
                    return itemData2.value==id;
                });
                if(itemData){
                    name=itemData.value2;
                    if(itemData.value1){  //被停用
                        name='<span style="color:#999999;">'+itemData.value2+'&nbsp;&nbsp;已停用</span>';
                    }
                    joinData.push({
                        "id":itemData.value,
                        "name":name,
                        "spell":itemData.value3
                    });
                }

            });
            return joinData;
        };
        var getModifyCircleUnjoinData=function(originData){
            var unjoinData=[];
            var allItems=originData.allItems,
                currentIDs=originData.currentIDs;
            _.each(allItems,function(itemData){
                var name;
                if(!_.contains(currentIDs,itemData.value)){
                    name=itemData.value2;
                    if(itemData.value1){  //被停用
                        name='<span style="color:#999999;">'+itemData.value2+'&nbsp;&nbsp;已停用</span>';
                    }
                    unjoinData.push({
                        "id":itemData.value,
                        "name":name,
                        "spell":itemData.value3
                    });
                }
            });
            return unjoinData;
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
         * 获取员工列表的请求参数
         */
        var getEmpListRq=function(){
            var requestData={};
            var selectedTypeEl=$('.state-active',filterListEl);
            requestData["type"]=selectedTypeEl.attr('filtertype');
            requestData["isStop"]=0;
            if(requestData["type"]=="0"){
                requestData["isStop"]=0;
                requestData["type"]=1;
            }else if(requestData["type"]=="1"){
                requestData["isStop"]=1;
            }
            requestData["circleID"]=currentNodeData.id;
            requestData["keyword"]= _.str.trim($('.search-field',searchBoxEl).val());
            requestData["isFirstChar"]=false;
            requestData["pageSize"]=pageSize;
            requestData["pageNumber"]=paginations[0].get('activePageNumber')||1;
            requestData["orderType"]=sortEl.val();
            return requestData;

        };
        /**
         * 渲染员工信息
         * @param employeeData
         */
        var renderEmployeeDetail=function(employeeData){
            var nameEl=$('.employee-name',employeeDetailEl),
                nickEl=$('.nick-name',employeeDetailEl),
                mobileEl=$('.mobile',employeeDetailEl),
                accountEl=$('.account',employeeDetailEl),
                emailEl=$('.email',employeeDetailEl),
                postEl=$('.post',employeeDetailEl),
                sexEl=$('.sex',employeeDetailEl),
                circleListWEl=$('.circle-list-wrapper',employeeDetailEl),
                avatarWEl=$('.avatar-wrapper',employeeDetailEl);
            var gender="",
                htmlStr='';
            if(employeeData.gender=="F"){
                gender="女";
            }else if(employeeData.gender=="M"){
                gender="男";
            }
            nameEl.text(employeeData.fullName);
            nickEl.text(employeeData.name);
            mobileEl.text(employeeData.mobile);
            accountEl.text(employeeData.account);
            emailEl.text(employeeData.email);
            postEl.text(employeeData.post);
            sexEl.text(gender);
            //部门渲染
            _.each(employeeData.circles,function(itemData){
                htmlStr+='<li class="circle-item fn-left">'+itemData.value1+'</li>';
            });
            circleListWEl.html('<ul class="circle-list fn-clear">'+htmlStr+'</ul>');
            //功能按钮显示控制
            if(employeeData.isAdmin){
                $('.admin-control-btn',detailTbarEl).removeClass('set-admin-btn').addClass('cancel-admin-btn').text('取消管理员');
            }else{
                $('.admin-control-btn',detailTbarEl).removeClass('cancel-admin-btn').addClass('set-admin-btn').text('设置管理员');
            }
            if(employeeData.isStop){
                $('.valid-control-btn',detailTbarEl).removeClass('set-stop-btn').addClass('set-start-btn').text('启用');
                $('.change-pwd-btn,.belong-department-btn,.admin-control-btn',detailTbarEl).hide();
                $('.delete-btn',detailTbarEl).show();
            }else{
                $('.valid-control-btn',detailTbarEl).removeClass('set-start-btn').addClass('set-stop-btn').text('停用');
                $('.change-pwd-btn,.belong-department-btn,.admin-control-btn',detailTbarEl).show();
                $('.delete-btn',detailTbarEl).hide();
            }
            //设置头像
            avatarWEl.html('<img src="'+util.getAvatarLink(employeeData.profileImage,1)+'" alt="" />');

            //设置id标识
            employeeDetailEl.data('employeeId',employeeData.employeeID);
            //设置数据存储
            employeeDetailEl.data('employeeData',employeeData);

            //设置修改部门选择框标题和回调
            modifyCircleDialog.setTitle("修改"+employeeData.name+"所属的部门");
            modifyCircleDialog.set("successCb",function(joinDatas){
                var dataState=this.joinList.getDataState(),
                    lostData=dataState.lost||[],
                    addData=dataState.add||[];
                //修改所属部门快捷操作
                util.api({
                    "url":'/Management/ModifyEmployeeCircles',
                    "type":"post",
                    "data":{
                        "employeeID":employeeDetailEl.data('employeeId'),
                        "addCircleIDs": _.map(addData,function(itemData){
                            return itemData.id;
                        }),
                        "deleteCircleIDs":_.map(lostData,function(itemData){
                            return itemData.id;
                        })
                    },
                    "success":function(responseData){
                        var htmlStr='';
                        if(responseData.success){
                            _.each(joinDatas,function(joinData){
                                htmlStr+='<li class="circle-item fn-left">'+joinData.name+'</li>';
                            });
                            circleListWEl.html('<ul class="circle-list fn-clear">'+htmlStr+'</ul>');
                            modifyCircleDialog.hide();
                        }
                    }
                });

            });
        };
        /**
         * 渲染用户编辑信息
         * @param employeeData
         */
        var renderEmployeeEdit=function(employeeData){
            var titleEl=$('.employee-detail-title',employeeEditEl),
                nameEl=$('.detail-info-wrapper .employee-name',employeeEditEl),
                nickEl=$('.nick-name',employeeEditEl),
                mobileEl=$('.mobile',employeeEditEl),
                accountEl=$('.account',employeeEditEl),
                emailEl=$('.email',employeeEditEl),
                postEl=$('.post',employeeEditEl),
                sexEl=$('.sex',employeeEditEl),
                circleListWEl=$('.circle-list-wrapper',employeeEditEl);
            var htmlStr='';
            titleEl.text('添加员工到“'+currentNodeData.name+'”');
            nameEl.val(employeeData.fullName);
            nickEl.val(employeeData.name);
            mobileEl.val(employeeData.mobile);
            accountEl.val(employeeData.account);
            emailEl.val(employeeData.email);
            postEl.val(employeeData.post);
            sexEl.filter('[value="'+employeeData.gender+'"]').prop('checked',true);
            //部门渲染
            _.each(employeeData.circles,function(itemData){
                htmlStr+='<li class="circle-item fn-left" circleid="'+itemData.value+'">'+itemData.value1+'<span class="close-l">×</span></li>';
            });
            circleListWEl.html('<ul class="circle-list fn-clear">'+htmlStr+'</ul>');
            //设置id标识
            employeeEditEl.data('employeeId',employeeData.employeeID);
            //设置数据存储
            employeeEditEl.data('employeeData',employeeData);
            //设置修改部门选择框标题和回调
            modifyCircleDialog.setTitle("修改"+employeeData.name+"所属的部门");
            modifyCircleDialog.set("successCb",function(joinDatas){
                var htmlStr='';
                _.each(joinDatas,function(joinData){
                    htmlStr+='<li class="circle-item fn-left" circleid="'+joinData.id+'">'+joinData.name+'<span class="close-l">×</span></li>';
                });
                circleListWEl.html('<ul class="circle-list fn-clear">'+htmlStr+'</ul>');
                modifyCircleDialog.hide();
            });
        };
        /**
         * 渲染添加用户信息
         */
        var renderEmployeeAdd=function(){
            var titleEl=$('.employee-detail-title',employeeAddEl),
                circleListWEl=$('.circle-list-wrapper',employeeAddEl);
            var htmlStr='';
            titleEl.text('添加员工到“'+currentNodeData.name+'”');
            //设置修改部门选择框标题和回调
            modifyCircleDialog.setTitle("选择部门");
            //部门渲染
            if(currentNodeData.id>0){  //限制不能直接在全公司下创建员工
                htmlStr+='<li class="circle-item fn-left" circleid="'+currentNodeData.id+'">'+currentNodeData.name+'<span class="close-l">×</span></li>';
                circleListWEl.html('<ul class="circle-list fn-clear">'+htmlStr+'</ul>');
            }

            modifyCircleDialog.set("successCb",function(joinDatas){
                var htmlStr='';
                _.each(joinDatas,function(joinData){
                    htmlStr+='<li class="circle-item fn-left" circleid="'+joinData.id+'">'+joinData.name+'<span class="close-l">×</span></li>';
                });
                circleListWEl.html('<ul class="circle-list fn-clear">'+htmlStr+'</ul>');
                modifyCircleDialog.hide();
            });
        };
        /**
         * 获取员工信息
         * @param callback
         */
        var fetchEmployeeData=function(employeeId,callback){
            if(_.isUndefined(employeeId)){     //根据后台日志发现GetEmployeeByID接口employeeId参数有空的现象，特殊处理下
                return;
            }
            util.api({
                "url":'/Management/GetEmployeeByID',
                "type":"get",
                "data":{
                    "employeeId":employeeId
                },
                "success":function(responseData){
                    callback&&callback.call(this,responseData);
                }
            });
        };
        /**
         * 设置和显示修改部门选择框
         * @param employeeId
         */
        var setAndShowModifyCircle=function(employeeId,callback){
            util.api({
                "url":'/Management/GetAllCirclesOfEmployeeID',
                "type":"get",
                "data":{
                    "employeeID":employeeId
                },
                "success":function(responseData){
                    if(responseData.success){
                        modifyCircleDialog.setInitData({
                            "joinData":getModifyCircleJoinData(responseData.value),
                            "unjoinData":getModifyCircleUnjoinData(responseData.value)
                        });
                        modifyCircleDialog.show();
                    }
                    callback&&callback.call(this,responseData);
                }
            });
        };
        /**
         * 验证员工编辑提交信息是否通过
         */
        var employeeEditIsValid=function(){
            var requestData=employeeEditGetRq();
            /*if(requestData["name"].length==0||requestData["mobile"].length==0||requestData["account"].length==0){
                return false;
            }*/
            if(requestData["fullName"].length==0){
                util.alert('请输入姓名');
                return false;
            }
            if(requestData["name"].length==0){
                util.alert('请输入昵称');
                return false;
            }
            if(requestData["mobile"].length!=11||!(/^\d{11}$/.test(requestData["mobile"]))){
                util.alert('手机号应为11位的数字');
                return false;
            }
            if(requestData["account"].length==0||!(/^[a-zA-Z\d][\w\.@]{1,49}$/.test(requestData["account"]))){
                util.alert('请输入正确的账号信息');
                return false;
            }
            if(requestData["email"].length>0&&!(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/.test(requestData["email"]))){
                util.alert('请输入正确的邮箱地址');
                return false;
            }
            return true;
        };
        /**
         * 获取员工编辑的请求信息
         */
        var employeeEditGetRq=function(){
            var requestData={};
            var employeeData=employeeEditEl.data('employeeData');
            var titleEl=$('.employee-detail-title',employeeEditEl),
                nameEl=$('.detail-info-wrapper .employee-name',employeeEditEl),
                nickEl=$('.nick-name',employeeEditEl),
                mobileEl=$('.mobile',employeeEditEl),
                accountEl=$('.account',employeeEditEl),
                emailEl=$('.email',employeeEditEl),
                postEl=$('.post',employeeEditEl),
                sexEl=$('.sex',employeeEditEl),
                circleListWEl=$('.circle-list-wrapper',employeeEditEl);
            requestData["employeeID"]=employeeEditEl.data('employeeId');
            requestData["account"]= _.str.trim(accountEl.val());
            requestData["fullName"]= _.str.trim(nameEl.val());
            requestData["name"]= _.str.trim(nickEl.val());
            requestData["department"]='';
            requestData["post"]=_.str.trim(postEl.val());
            requestData["gender"]=sexEl.filter(':checked').val();
            requestData["role"]=employeeData.role;
            requestData["mobile"]=_.str.trim(mobileEl.val());
            requestData["email"]=_.str.trim(emailEl.val());
            requestData["circleIDs"]=[];
            $('.circle-item',circleListWEl).each(function(){
                var circleId=$(this).attr('circleid');
                requestData["circleIDs"].push(circleId);
            });
            return requestData;
        };
        /**
         * 验证员工添加提交信息是否通过
         */
        var employeeAddIsValid=function(){
            var requestData=employeeAddGetRq();
            /*if(requestData["name"].length==0||requestData["mobile"].length==0||requestData["account"].length==0||requestData["password"].length==0){
                return false;
            }*/
            if(requestData["fullName"].length==0){
                util.alert('请输入姓名');
                return false;
            }
            if(requestData["name"].length==0){
                util.alert('请输入昵称');
                return false;
            }
            if(requestData["mobile"].length!=11||!(/^\d{11}$/.test(requestData["mobile"]))){
                util.alert('手机号应为11位的数字');
                return false;
            }
            if(requestData["account"].length==0||!(/^[a-zA-Z\d][\w\.@]{1,49}$/.test(requestData["account"]))){
                util.alert('请输入正确的账号信息');
                return false;
            }
            if(requestData["password"].length==0){
                util.alert('请输入初始密码');
                return false;
            }
            if(requestData["email"].length>0&&!(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/.test(requestData["email"]))){
                util.alert('请输入正确的邮箱地址');
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
                nickEl=$('.nick-name',employeeAddEl),
                mobileEl=$('.mobile',employeeAddEl),
                accountEl=$('.account',employeeAddEl),
                emailEl=$('.email',employeeAddEl),
                postEl=$('.post',employeeAddEl),
                sexEl=$('.sex',employeeAddEl),
                pwdEl=$('.pwd',employeeAddEl),
                circleListWEl=$('.circle-list-wrapper',employeeAddEl);
            requestData["account"]= _.str.trim(accountEl.val());
            requestData["fullName"]= _.str.trim(nameEl.val());
            requestData["name"]= _.str.trim(nickEl.val());
            requestData["department"]='';
            requestData["post"]=_.str.trim(postEl.val());
            requestData["gender"]=sexEl.filter(':checked').val();
            requestData["role"]=4;
            requestData["mobile"]=_.str.trim(mobileEl.val());
            requestData["email"]=_.str.trim(emailEl.val());
            requestData["password"]=_.str.trim(pwdEl.val());
            requestData["circleIDs"]=[];
            $('.circle-item',circleListWEl).each(function(){
                var circleId=$(this).attr('circleid');
                requestData["circleIDs"].push(circleId);
            });
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
            $('.circle-list-wrapper',employeeAddEl).empty();
        };
        /**
         * 编辑表单清理
         */
        var employeeEditClear=function(){
            $('input[type="text"]',employeeEditEl).val("");
            $('.sex',employeeEditEl).prop('checked',false).eq(0).prop('checked',true);
            $('.fs-validate-empty-tip,.fs-validate-input-tip',employeeEditEl).hide();
            $('.field-state-empty,.field-state-input',employeeEditEl).removeClass('field-state-empty field-state-input');
            $('.circle-list-wrapper',employeeEditEl).empty();
        };
        /**
         * 编辑表单清理
         */
        var employeeDetailClear=function(){
            $('.value-item',employeeDetailEl).empty();
            $('.circle-list-wrapper',employeeDetailEl).empty();
            $('.avatar-wrapper',employeeDetailEl).empty();  //头像清理
        };
        /**
         * 员工详情页和编辑页切换控制
         * @param panelType
         */
        var switchEmpPanel=function(employeeId,panelType){
            panelType=panelType||"detail";
            if(panelType=="detail"){
                fetchEmployeeData(employeeId,function(responseData){
                    var dataRoot;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        renderEmployeeDetail(dataRoot);
                        adjustTplCHeight();
                    }
                });
                employeeDetailClear();
                employeeEditEl.hide();
                employeeDetailEl.show();
            }
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
         * tpl-c 自适应左侧高度
         */
        var adjustTplCHeight=function(){
            var tplCenterInnerEl=$('.tpl-c .tpl-inner',tplEl);
            var tplLeftInnerH=$('.tpl-l .tpl-inner',tplEl).height(),
                tplCenterInnerH;
            tplCenterInnerEl.css({
                "height":"auto"
            });
            tplCenterInnerH=tplCenterInnerEl.height();
            if(tplCenterInnerH<tplLeftInnerH){
                tplCenterInnerEl.height(tplLeftInnerH);
            }
        };

        //筛选控制
        filterListEl.on('click','.filter-item',function(evt){
            var itemEl=$(evt.currentTarget);
            var rootNodeEl=$('.root-node',departmentTree.element);
            var requestData;
            $('.state-active',filterListEl).removeClass('state-active');
            itemEl.addClass('state-active');
            //分页重置
            paginationAgent('reset');

            requestData=getEmpListRq();
            if(requestData["type"]=="-1"){  //未邀请加入的员工
                //list功能键控制
                $('.stop-btn,.start-btn',actionEl).hide();
                sortEl.hide();
                employeeList.setOpts({
                    "itemTpl":'<tr class="edit-disabled">'+
                        '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                        '<td><a class="flag-name" href="javascript:;">{{flagName}}</a></td>'+
                        '<td><a class="flag-value" href="javascript:;">{{flagValue}}</a></td>'+
                        '</tr>',
                    "listPath":'/Management/GetInviteEmployees',
                    "formatData":function(itemData){
                        return _.extend({
                            "flagName":(itemData.value1==1)?"手机":"邮箱",
                            "flagValue":itemData.value
                        },itemData);
                    }
                });
                //选中全公司
                departmentTree.selectNode(rootNodeEl,true);
                //更新当前激活节点
                currentNodeData=rootNodeEl.data('nodeData');
                $('.department-title',tplEl).text(currentNodeData.name).attr('title',currentNodeData.name);
                modifyEmpBtnEl.hide();
                //隐藏导出按钮
                exportBtnEl.hide();
                requestData=getEmpListRq();  //重新构建请求数据
                employeeList.load(requestData);
            }else{
                //list功能键控制
                $('.stop-btn,.start-btn',actionEl).show();
                sortEl.show();
                employeeList.setOpts({
                    "itemTpl":'<tr class="{{trCls}}">'+
                        '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                        '<td><img src="'+FS.BLANK_IMG+'" class="icon-sex icon-sex-{{sex}}" /><a class="employee-name" href="javascript:;">{{name}}</a></td>'+
                        '<td class="account"><a class="account" href="javascript:;" title="{{account}}">{{account}}</a></td>'+
                        '<td><a class="post" href="javascript:;">{{post}}</a></td>'+
                        '<td class="last-td"><a class="mobile" href="javascript:;">{{mobile}}</a></td>'+
                        '</tr>',
                    "listPath":'/Management/GetAllEmployees',
                    "formatData":function(itemData){
                        return _.extend({
                            "trCls":itemData.isStop?"state-disabled":"",
                            "sex":itemData.gender.toLowerCase()
                        },itemData);
                    }
                });
                if(requestData["type"]=="1"||requestData["type"]=="2"||requestData["type"]=="3"){
                    //选中全公司
                    departmentTree.selectNode(rootNodeEl,true);
                    //更新当前激活节点
                    currentNodeData=rootNodeEl.data('nodeData');
                    $('.department-title',tplEl).text(currentNodeData.name).attr('title',currentNodeData.name);
                    modifyEmpBtnEl.hide();
                }
                if(requestData["type"]=="0"||requestData["type"]=="1"){
                    exportBtnEl.show();
                }else{
                    exportBtnEl.hide();
                }
                requestData=getEmpListRq();    //重新构建请求数据
                employeeList.load(requestData);
            }
            evt.preventDefault();
        });
        //创建时间和名称
        sortEl.on('change',function(){
            //分页重置
            paginationAgent('reset');
            employeeList.load(getEmpListRq());
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
        //点击用户记录进入用户详细信息页
        employeeList.on('rowclick',function(evt){
            var trEl=$(evt.currentTarget);
            var cacheEmployeeData; //缓存的用户信息
            if(!trEl.hasClass('edit-disabled')&&$(evt.target).is('a')){    //可编辑
                employeeDetailClear();
                employeeMainEl.hide();
                employeeDetailEl.show();
                cacheEmployeeData=employeeList.getItemDataFromSelector(trEl);
                fetchEmployeeData(cacheEmployeeData.employeeID,function(responseData){
                    var dataRoot;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        renderEmployeeDetail(dataRoot);
                        adjustTplCHeight();
                    }
                });
            }
        });
        //修改部门成员弹框功能扩展
        modifyEmpDialog.after('show',function(){
            var elEl=this.element,
                unjoinWEl=$('.unjoin-wrapper',elEl),
                boxBodyEl=$('.box-body',unjoinWEl),
                depSelectEl=$('.department-select',boxBodyEl);
            //var departmentListData=departmentTree.getAllNodeData();

            if(depSelectEl.length==0){
                depSelectEl=$('<select class="department-select"></select>');
                depSelectEl.prependTo(boxBodyEl);
                depSelectEl.on('change',function(){
                    //alert(index);
                    modifyEmpDialog.setInitData({
                        "joinData":getModifyEmpJoinData(circleOriginData),
                        "unjoinData":getModifyEmpUnjoinData(circleOriginData,depSelectEl.val())
                    });
                });
            }
            //构建部门列表
            util.api({
                "url":'/Management/GetAllEmployeesOfCircle',
                "type":"get",
                "data":{
                    "circleID":currentNodeData.id
                },
                "success":function(responseData){
                    var dataRoot,
                        htmlStr='';
                    if(responseData.success){
                        dataRoot=responseData.value;
                        circleOriginData=dataRoot;
                        _.each(dataRoot.circleItems,function(itemData){
                            htmlStr+='<option value="'+itemData.value+'">'+itemData.value1+'</option>';
                        });
                        depSelectEl.html('<option value="0">全部</option>'+htmlStr).change();
                    }
                }
            });
        });
        //添加部门
        addCircleBtnEl.click(function(){
           departmentTree.createDepartment();
        });
        departmentTree.on('nodeselect',function(nodeData){
            //先重置
            depSwitchReset();
            //如果是全公司隐藏修改成员按钮
            if(nodeData.id!=0){
                modifyEmpBtnEl.show();
            }
            departmentTitleEl.text(nodeData.name).attr('title',nodeData.name);
            modifyEmpDialog.setTitle('修改'+nodeData.name+'成员');
            //设置当前数据
            currentNodeData=nodeData;
            //隐藏提取panel
            employeeEditEl.hide();
            employeeAddEl.hide();
            employeeDetailEl.hide();
            batchImportEl.hide();

            employeeMainEl.show();
            //请求列表数据
            employeeList.load(getEmpListRq());
        }).on('nodeexpand',function(){
            //自适应页面高度
            adjustTplCHeight();
        }).on('nodecollapse',function(){
            //自适应页面高度
            adjustTplCHeight();
        }).on('nodedelete',function(){
            //删除部门后重新选择根节点
            departmentTree.selectNode($('.root-node',departmentTree.element));
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
                //自适应页面高度
                adjustTplCHeight();
            }

        });
        //用户详情部分
        detailTbarEl.on('click','button',function(evt){
            var btnEl=$(evt.currentTarget);
            var employeeData=employeeDetailEl.data('employeeData');
            if(btnEl.hasClass('return-back-btn')){ //返回列表页
                employeeMainEl.show();
                employeeDetailEl.hide();
                employeeList.load(getEmpListRq());
                adjustTplCHeight();
            }else if(btnEl.hasClass('edit-btn')){   //进入编辑表单
                employeeEditClear();
                employeeDetailEl.hide();
                employeeEditEl.show();
                adjustTplCHeight();
                if(_.isUndefined(employeeData.employeeID)){     //根据后台日志发现GetEmployeeByID接口employeeId参数有空的现象，特殊处理下
                    return;
                }
                //请求员工数据
                util.api({
                    "url":'/Management/GetEmployeeByID',
                    "type":"get",
                    "data":{
                        "employeeId":employeeData.employeeID
                    },
                    "success":function(responseData){
                        var dataRoot;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            renderEmployeeEdit(dataRoot);
                        }
                    }
                });
            }else if(btnEl.hasClass('belong-department-btn')){  //修改所属部门快捷方式
                setAndShowModifyCircle(employeeDetailEl.data('employeeId'));
            }else if(btnEl.hasClass('change-pwd-btn')){  //修改密码
                resetPwdDialog.show();
                resetPwdDialog.setData({
                    "employeeId":employeeData.employeeID,
                    "name":employeeData.name,
                    "account":employeeData.account
                });
            }else if(btnEl.hasClass('valid-control-btn')){  //停用用户
                var message,
                    isStop;
                if(btnEl.hasClass('set-stop-btn')){
                    message='您确定要停用用户：'+employeeData.name+'？';
                    isStop=true;
                }else if(btnEl.hasClass('set-start-btn')){
                    message='您确定要启用用户'+employeeData.name+'？';
                    isStop=false;
                }
                util.confirm(message, '提示', function (evt) {
                    util.api({
                        type: 'post',
                        data: {
                            "employeeIDs":[employeeData.employeeID],
                            "isStop":isStop
                        },
                        url: '/Management/BatchSetEmployeeStatus',
                        success: function (responseData) {
                            if(responseData.success){
                                switchEmpPanel(employeeData.employeeID,'detail');
                            }
                        }
                    });
                },{
                    "onCancel":function(){}
                });
            }else if(btnEl.hasClass('admin-control-btn')){  //设置管理员
                var message,
                    isAdmin;
                if(btnEl.hasClass('set-admin-btn')){
                    message='您确定要设置'+employeeData.name+'为管理员吗？';
                    isAdmin=true;
                }else if(btnEl.hasClass('cancel-admin-btn')){
                    message='您确定要取消'+employeeData.name+'的管理员权限吗？';
                    isAdmin=false;
                }
                util.confirm(message, '提示', function (evt) {
                    util.api({
                        type: 'post',
                        data: {
                            "employeeId":employeeData.employeeID,
                            "isAdmin":isAdmin
                        },
                        url: '/Management/SetEmployeeIsAdmin',
                        success: function (responseData) {
                            if(responseData.success){
                                switchEmpPanel(employeeData.employeeID,'detail');
                            }
                        }
                    });
                },{
                    "onCancel":function(){}
                });
            }else if(btnEl.hasClass('delete-btn')){  //删除用户
                util.confirm('您确定要删除用户：'+employeeData.name+'？', '提示', function (evt) {
                    util.api({
                        type: 'post',
                        data: {
                            "employeeIDs":[employeeData.employeeID]
                        },
                        url: '/Management/BatchDeleteEmployee',
                        success: function (responseData) {
                            if(responseData.success){
                                //重新加载列表
                                employeeEditEl.hide();
                                employeeMainEl.show();
                                employeeList.load(getEmpListRq());
                            }
                        }
                    });
                },{
                    "onCancel":function(){}
                });
            }
        });
        //从编辑表单返回列表
        editTbarEl.on('click','.return-back-btn',function(evt){
            switchEmpPanel(employeeEditEl.data('employeeId'),'detail');
        });
        //编辑表单选择部门
        employeeEditEl.on('click','.change-circle-btn',function(evt){
            setAndShowModifyCircle(employeeEditEl.data('employeeId'));
        }).on('click','.circle-item .close-l',function(evt){    //删除部门
            $(evt.currentTarget).closest('.circle-item').remove();
        }).on('click','.f-sub',function(evt){    //编辑提交
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
                            //返回员工详细页
                            switchEmpPanel(employeeEditEl.data('employeeId'),'detail');
                        }
                    }
                },{
                    "submitSelector":$(evt.currentTarget)
                });
            }
        }).on('click','.f-cancel',function(evt){    //返回员工详细页
             switchEmpPanel(employeeEditEl.data('employeeId'),'detail');
        });
        //切换到新建员工页
        addEmployeeBtnEl.on('click',function(){
            employeeAddClear();
            employeeMainEl.hide();
            employeeAddEl.show();
            renderEmployeeAdd();
            adjustTplCHeight();
        });
        //从添加表单返回列表
        addTbarEl.on('click','.return-back-btn',function(evt){
            employeeMainEl.show();
            employeeAddEl.hide();
            employeeList.load(getEmpListRq());
            adjustTplCHeight();
        });
        employeeAddEl.on('click','.change-circle-btn',function(evt){
            setAndShowModifyCircle(0);
        }).on('click','.circle-item .close-l',function(evt){    //删除部门
            $(evt.currentTarget).closest('.circle-item').remove();
        }).on('click','.f-sub',function(evt){
            if(employeeAddIsValid()){  //通过了验证
                util.api({
                    "url":'/Management/CreateEmployee',
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
            employeeMainEl.show();
            employeeAddEl.hide();
            employeeList.load(getEmpListRq());
        }).on('blur','.employee-name',function(evt){
            var employeeNameEl=$(evt.currentTarget),
                nickNameEl=$('.nick-name',employeeAddEl);
            var employeeName= _.str.trim(employeeNameEl.val());
            if(employeeName.length>0&& _.str.trim(nickNameEl.val()).length==0){
                nickNameEl.val(employeeName);
            }
        }).on('blur','.mobile',function(evt){
            var mobileEl=$(evt.currentTarget),
                accountEl=$('.account',employeeAddEl);
            var mobile=_.str.trim(mobileEl.val());
            if(/^\d{11}$/.test(mobile)&& _.str.trim(accountEl.val()).length==0){
                accountEl.val(mobile);
            }
        });
        //列表功能键
        actionEl.on('click','.action-btn',function(evt){
            var btnEl=$(evt.currentTarget);
            var currentFilterItemEl=$('.state-active',filterListEl);
            var currentFilterType=currentFilterItemEl.attr('filtertype');
            var selectDatas=employeeList.getAllSelectData();
            var employeeIDs= _.map(selectDatas,function(itemData){
                return itemData.employeeID;
            });
            var accounts;
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
                if(currentFilterType=="-1"){  //受邀用户的删除特殊处理
                    accounts= _.map(selectDatas,function(itemData){
                        return itemData.value;
                    });
                    util.confirm('是否要删除选中的'+accounts.length+'个邀请，删除后收到邀请的员工将不能加入到企业/团队中', '提示', function (evt) {
                        util.api({
                            type: 'post',
                            data: {
                                "accounts":accounts.join('|')
                            },
                            url: '/Management/DeleteInviteEmployees',
                            success: function (responseData) {
                                if(responseData.success){
                                    util.showSucessTip("删除成功");
                                    //重新加载列表
                                    employeeList.load(getEmpListRq());
                                }
                            }
                        });
                    },{
                        "onCancel":function(){}
                    });
                }else{
                    util.confirm('您确认要删除'+employeeIDs.length+'个用户吗？', '提示', function (evt) {
                        util.api({
                            type: 'post',
                            data: {
                                "employeeIDs":employeeIDs
                            },
                            url: '/Management/BatchDeleteEmployee',
                            success: function (responseData) {
                                if(responseData.success){
                                    util.showSucessTip("删除成功");
                                    //重新加载列表
                                    employeeList.load(getEmpListRq());
                                }
                            }
                        });
                    },{
                        "onCancel":function(){}
                    });
                }

            }
        });
        //搜索事件绑定
        searchBoxEl.on('click','.icon-search',function(){
            //分页重置
            paginationAgent('reset');
            //重新加载列表
            employeeList.load(getEmpListRq());
        }).on('keydown','.search-field',function(evt){
            if(evt.keyCode==13){
                //分页重置
                paginationAgent('reset');
                //重新加载列表
                employeeList.load(getEmpListRq());
                evt.preventDefault();
            }
        });
        //批量导入
        enterBatchImportBtnEl.click(function(){
            batchImportEl.show();
            employeeMainEl.hide();
            adjustTplCHeight();
        });
        batchImportEl.on('click','.return-back-btn',function(evt){
            employeeMainEl.show();
            batchImportEl.hide();
            employeeList.load(getEmpListRq());
            adjustTplCHeight();
        });
        //设置批量导入地址
        $('.batch-import-tpl-l',tplEl).on('click',function(evt){
            util.confirm('是否要保存 员工导入模板', '提示', function (evt) {
                window.open(FS.API_PATH+'/ManagementDF/GetEmployeeExcelTemplate?r='+(new Date()/1));
            },{
                "onCancel":function(){}
            });
            evt.preventDefault();
        });
        var batchImportFilePath;
        var batchImportUploader=new Uploader({
            "element":batchUploadBtnEl,
            "h5Opts":{
                multiple:false,
                accept:"*/*"
            },
            "flashOpts":{
                file_types : "*.*",
                file_types_description : "所有文件",
                button_width: 52,
                button_height: 27
            },
            "h5UploadPath":"/Management/uploadFile", //上传地址
            "flashUploadPath":"/Management/UploadFileByForm", //普通表单上传地址
            "onSelect":function(file){
                $('.file-path-field',batchImportEl).val(file.name);
                this.startUpload();
            },
            "onSuccess":function(file,responseText){
                //上传成功后处理
                var responseData=json.parse(responseText);
                if(responseData.success){
                    batchImportFilePath=responseData.value.filePath;
                    importBtnEl.removeClass('button-state-disabled');
                }
            },
            "onComplete":function(){
                //上传成功后清理文件缓存
                this.removeAllFile();
            }
        });
        //点击开始导入按钮
        importBtnEl.click(function(evt){
            var btnEl=$(evt.currentTarget);
            if(!btnEl.hasClass('button-state-disabled')){
                util.api({
                    type: 'post',
                    data: {
                        "path":batchImportFilePath,
                        "isSendSMS":$('.is-send-sms',batchImportEl).prop('checked')
                    },
                    url: '/Management/ImportEmployees',
                    success: function (responseData) {
                        var dataRoot;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            if(dataRoot.importEmployeePropertys.length==0){ //导入成功，直接返回员工列表页
                                util.showSucessTip('导入成功');
                                tpl.navRouter.navigate('', {
                                    trigger: true
                                });
                                tpl.navRouter.navigate('#departmentstaff', {
                                    trigger: true
                                });
                            }else{
                                util.setTplStore("departmentstaff",{
                                    "importData":dataRoot
                                });
                                tpl.navRouter.navigate('circles/importemployeeseditor', {
                                    trigger: true
                                });
                            }

                        }
                    },
                    "complete":function(){
                        batchImportFilePath=""; //重置为空
                        importBtnEl.addClass('button-state-disabled');
                        $('.file-path-field',batchImportEl).val("");
                    }
                });
            }
        });

        //点击修改成员打开对话框
        modifyEmpBtnEl.click(function(evt){
            modifyEmpDialog.show();
        });
        //导出员工
        exportBtnEl.click(function(evt){
            /*util.api({
                "url": '/Management/GetAllEmployeesExcel',
                "data":getEmpListRq(),
                "type":"post",
                "success":function(responseData){
                    if(responseData.success){
                        window.open(util.getDfLink(responseData.value,'',true));
                    }
                }
            });*/
            var listData=employeeList.getListData();
            if(listData&&listData.length>0){
                window.open(FS.API_PATH+'/Management/GetAllEmployeesExcel?'+ $.param(getEmpListRq()));
            }else{
                util.alert('您选择的筛选条件中无员工数据');
            }

        });
        //处理是否显示创建部门引导图
        var locationSearch=location.search,
            searchPairArr,
            searchObj;
        if(locationSearch){
            searchPairArr=locationSearch.slice(1).split('&');
            searchObj={};
            _.each(searchPairArr,function(itemStr){
                var itemArr=itemStr.split('=');
                searchObj[itemArr[0]]=itemArr[1];
            });
            if(searchObj["showcircleguide"]=="yes"){
                util.showGuideTip(addCircleBtnEl,{
                    "leftTopIncrement":-5,
                    "rightTopIncrement":-5,
                    "rightLeftIncrement":-5,
                    "imageName":"admin-create-circle.png",
                    "imagePosition":{
                        "top":"-20px",
                        "left":"20px"
                    },
                    "renderCb":function(imgWEl,leftEl,rightEl,hostEl){
                        //模拟图片map映射
                        var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>'),
                            closeBtnEl=$('<div class="fs-guide-shadow-link"></div>');
                        var closeCb=function(){
                            leftEl.remove();
                            rightEl.remove();
                        };
                        closeLinkEl.css({
                            "width":"26px",
                            "height":"26px",
                            "position":"absolute",
                            "top":"9px",
                            "left":"203px",
                            "cursor":"pointer"
                        }).appendTo(imgWEl);
                        closeBtnEl.css({
                            "width":"122px",
                            "height":"32px",
                            "position":"absolute",
                            "top":"102px",
                            "left":"74px",
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
        }


        var firstRender=true;
        var bootExecute=function(){
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var createAction = queryParams ? queryParams.create : '';
            if(createAction=="circle"){     //创建部门
                departmentTree.createDepartment();
            }else if(createAction=="employee"){   //创建员工
                employeeAddClear();
                employeeMainEl.hide();
                employeeAddEl.show();
                renderEmployeeAdd();
            }
        };
        var fixFilterPos=function(){
            var rootNodeEl=$('.root-node',departmentTree.element);
            //定位员工列表筛选条件
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var filterId = queryParams ? queryParams.filterid : 0;
            //定位员工列表筛选条件
            $('.filter-item',filterListEl).removeClass('state-active');
            $('.filter-item',filterListEl).eq(parseInt(filterId)).addClass('state-active');
            //列表重置
            if(filterId=="-1"){  //未邀请加入的员工
                //list功能键控制
                $('.stop-btn,.start-btn',actionEl).hide();
                sortEl.hide();
                employeeList.setOpts({
                    "itemTpl":'<tr class="edit-disabled">'+
                        '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                        '<td><a class="flag-name" href="javascript:;">{{flagName}}</a></td>'+
                        '<td><a class="flag-value" href="javascript:;">{{flagValue}}</a></td>'+
                        '</tr>',
                    "listPath":'/Management/GetInviteEmployees',
                    "formatData":function(itemData){
                        return _.extend({
                            "flagName":(itemData.value1==1)?"手机":"邮箱",
                            "flagValue":itemData.value
                        },itemData);
                    }
                });
                if(rootNodeEl.length>0){
                    //选中全公司
                    departmentTree.selectNode(rootNodeEl,true);
                    //更新当前激活节点
                    currentNodeData=rootNodeEl.data('nodeData');
                    $('.department-title',tplEl).text(currentNodeData.name).attr('title',currentNodeData.name);
                    modifyEmpBtnEl.hide();
                }
            }else{
                //list功能键控制
                $('.stop-btn,.start-btn',actionEl).show();
                sortEl.show();
                employeeList.setOpts({
                    "itemTpl":'<tr class="{{trCls}}">'+
                        '<td class="ck-box first-td"><input class="ck" type="checkbox" /></td>'+
                        '<td><img src="'+FS.BLANK_IMG+'" class="icon-sex icon-sex-{{sex}}" /><a class="employee-name" href="javascript:;">{{name}}</a></td>'+
                        '<td class="account"><a class="account" href="javascript:;" title="{{account}}">{{account}}</a></td>'+
                        '<td><a class="post" href="javascript:;">{{post}}</a></td>'+
                        '<td class="last-td"><a class="mobile" href="javascript:;">{{mobile}}</a></td>'+
                        '</tr>',
                    "listPath":'/Management/GetAllEmployees',
                    "formatData":function(itemData){
                        return _.extend({
                            "trCls":itemData.isStop?"state-disabled":"",
                            "sex":itemData.gender.toLowerCase()
                        },itemData);
                    }
                });
                if(rootNodeEl.length>0){
                    if(filterId=="1"||filterId=="2"||filterId=="3"){
                        //选中全公司
                        departmentTree.selectNode(rootNodeEl,true);
                        //更新当前激活节点
                        currentNodeData=rootNodeEl.data('nodeData');
                        $('.department-title',tplEl).text(currentNodeData.name).attr('title',currentNodeData.name);
                        modifyEmpBtnEl.hide();
                    }
                    if(filterId=="0"||filterId=="1"){
                        exportBtnEl.show();
                    }else{
                        exportBtnEl.hide();
                    }
                }
            }
        };
        /**
         * 进入一个操作
         */
        var enterTplAction=function(){
            //定位员工列表筛选条件
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var enter = queryParams ? queryParams.enter : "";
            if(enter=="import"){  //打开批量导入
                batchImportEl.show();
                employeeMainEl.hide();
            }
        };
        //fixFilterPos();
        enterTplAction();
        tplEvent.on('switched', function (tplName2, tplEl) {
            var enterpriseName;
            if(tplName2==tplName){
                //设置左侧树“全公司”显示
                enterpriseName=util.getTplStore('entinfomgt','enterpriseName')||globalData.allCompanyDefaultString||"全公司";
                if(firstRender){
                    //根据地址传参控制,只执行一次
                    departmentTree.one('nodeselect',function(){
                        fixFilterPos();
                        bootExecute();
                        $('.root-node',departmentTree.element).children('.node-info').find('.node-text').text(enterpriseName);
                        //更新root nodeData
                        departmentTree.setNodeData(0,{
                            "name":enterpriseName
                        });
                        //更新title显示
                        if(currentNodeData.id==0){
                            $('.department-title',tplEl).text(enterpriseName).attr('title',enterpriseName);
                        }
                        //请求列表数据，重置上一次请求
                        employeeList.load(getEmpListRq());
                    });
                    firstRender=false;
                }else{
                    //隐藏提取panel
                    employeeEditEl.hide();
                    employeeAddEl.hide();
                    employeeDetailEl.hide();
                    batchImportEl.hide();

                    employeeMainEl.show();

                    departmentTree.reload(function(){
                        fixFilterPos();
                        //请求列表数据
                        employeeList.load(getEmpListRq());
                        bootExecute();
                        enterTplAction();
                        $('.root-node',departmentTree.element).children('.node-info').find('.node-text').text(enterpriseName);
                        //更新root nodeData
                        departmentTree.setNodeData(0,{
                            "name":enterpriseName
                        });
                        //更新title显示
                        if(currentNodeData.id==0){
                            $('.department-title',tplEl).text(enterpriseName).attr('title',enterpriseName);
                        }
                    });
                }
            }
        });

    };
});