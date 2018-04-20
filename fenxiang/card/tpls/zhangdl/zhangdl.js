/**
 * demo页
 *
 * 遵循seajs module规范
 * @author lxf
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        Pagination=require('uilibs/pagination2'),
        CurrencyInput=require('uilibs/currency-input'),
        Select=require('uilibs/select2'),
        Tab=require('uilibs/tabs2'),
        SelectColleague=require('modules/crm-select-colleague/crm-select-colleague'),
        Attachment=require('modules/crm-attachment-simple/crm-attachment-simple'),
        Tag=require('modules/crm-tag-dialog/crm-tag-dialog'),
        File=require('modules/crm-file-dialog/crm-file-dialog'),
        AttachmentList=require('modules/crm-attachment/crm-attachment'),
        AttachmentRename=require('modules/crm-attachment-rename/crm-attachment-rename'),
        Subordinate=require('modules/crm-subordinate-select/crm-subordinate-select'),
        ImportDialog=require('modules/crm-object-import/crm-object-import'),
        ExportDialog=require('modules/crm-customer-export/crm-customer-export'),
        ContactsDialog=require('modules/crm-select-contacts/crm-select-contacts'),
        CustomerDialog=require('modules/crm-select-customer/crm-select-customer'),
        OppSelect=require('modules/crm-select-opp/crm-select-opp'),
        ProductInOppDialog=require('modules/crm-productinopp-edit/crm-productinopp-edit'),
        CompetitorInOppDialog=require('modules/crm-competitorinopp-edit/crm-competitorinopp-edit'),
        CustomerinsettingDialog=require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit'),
        ProductSelect=require('modules/crm-select-product/crm-select-product'),
        CompetitorSelect=require('modules/crm-select-competitor/crm-select-competitor'),
        PaymentPlanDialog=require('modules/crm-paymentplan-edit/crm-paymentplan-edit'),
        PaymentRecordDialog=require('modules/crm-paymentrecord-edit/crm-paymentrecord-edit'),
        ContractDialog = require('modules/crm-contract-edit/crm-contract-edit'),
        ContactViewDialog = require('modules/crm-contact-view/crm-contact-view'),
        Publish=require('modules/crm-publish/crm-publish'),
        CustomerMap=require('modules/crm-customer-map/crm-customer-map'),


        FollowUp=require('modules/crm-follow-up/crm-follow-up'),
        ContactBox=require('modules/crm-contact-box/crm-contact-box');
    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;



        //初始化分页组件
        var pagination=new Pagination({
            "element":$('.pagination-wrapper',tplEl),
            "pageSize":11,
            "totalSize":20000,
            "activePageNumber":1
        });
        //渲染到页面
        //pagination.render();
        //初始化下拉列表组件
        var select=new Select({
            "element":$('.select-wrapper',tplEl),
            "autoRender":true,  //不自动渲染
            "hasAll":true,
            "options":[{"value":1,"text":"test1"},{"value":2,"text":"test2"},{"value":3,"text":"test3"}]
            //"beforeInit":function(){
            //alert(1);
            //return false;
            //}
        });

        var tag = new Tag({
        });

        var file =  new File({

        });

        var followUp = new FollowUp({
            "element":$(".crm_follow_up",tplEl),
            "addApi":"/FCustomer/AddFCustomerCombineSalers",
            "deleteApi":"/FCustomer/DeleteFCustomerCombineSaler",
            "parameter":{
                "customerID":495,
                "employeeIDs":""
            },
            "items":[],
            "title":"联合跟进人",
            "typeName":"客户",
            "name":"联合跟进人"
        });

        var contactBox = new ContactBox({
            "element":$(".crm_contact_box",tplEl)
        });

        var contactBoxModify = new ContactBox({
            "element":$(".crm_contact_modify",tplEl),
            "customerID":495,
            "type":"modify",
            "parameter":{
                "salesOpportunityID":157,
                "employeeIDs":""
            },
        });

        var importDialog = new ImportDialog({
            "title":"我的客户导入",
            "downloadApi":"GetMyFCustomerExcelTemplate",
            "importApi":"/FCustomer/ImportMyFCustomer",
            "downloadText":"我的客户导入模板"
        });

        var exportDialog = new ExportDialog({
            "title":"测试客户导出",
            "exportApi":"/FCustomer/ExportAllFCustomersExcel"
        });

        var subordinate = new Subordinate({
            "element":$(".subordinate_wrapper",tplEl),
            "employeeName":"测试"
        });

        var tab = new Tab({
            "element":$('.crm-tabs-test',tplEl),

            "items":[{value:"test1",text:"test1"},{value:"test2",text:"test2"},{value:"test3",text:"test3"},{value:"test4",text:"test4"},{value:"test5",text:"test5"}]
        });
        tab.on("change",function(oldValue,newValue){
            alert(newValue);
        });

        var publish = new Publish({
            "element":$('.crm_publish_wrapper',tplEl),
            "title":"测试",
            "placeholder":"placeholder",
            "type":"event",
            "condition":{
                "customerID":482,// int，客户ID
                "contactIDs":"",// string，关联联系人ID集合，逗号分隔
                "fileInfos":[],// List<ParamValue<int, string, int, string>>，附件集合
                "isAllDayEvent":false,// bool，是否全天事件
                "startTime":0,// long，事件开始提醒时间
                "remindType":1,// int，全部 = 0,不提醒 = 1,销售记录发生时= 2,5分钟前 = 3,15分钟前= 4,30分钟前= 5,1小时前= 6,2小时前= 7,6小时前= 8,1天前= 9,2天前= 10,自定义时间= 11
                //"remindTime":0,// long，自定义时间
                "isSentSms":false,// bool，是否发送短信
                "feedContent":"",// string，事件内容
                "parentFeedID":0, //int，父事件ID
                "listTagOptionID":[],// List<string>，销售记录标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)，除销售记录外选其他标签会报错
                "fbrType":1,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                //1，与客户关联，dataID：客户ID；DataID1：联系人ID
                //2,与联系人关联，DataID：客户ID；DataID1：联系人ID
                //3,与机会关联，DataID：客户ID；DataID1：联系人ID列表；DataID2：机会ID
                "dataID":482,// int，数据ID    
                "dataID1":0,// string，数据ID1
                "dataID2":0// int，数据ID
            },
            "display":["time","contact","picture","attach","tag"]
        });

        var feedpublish = new Publish({
            "element":$('.crm_feed_publish_wrapper',tplEl),
            "title":"feed测试",
            "type":"feed",
            "condition":{
                "fileInfos":[],// List<ParamValue<int, string, int, string>>，附件
                "feedContent":"",// string，Feed内容
                "fbrType":4,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                //4，与产品关联，dataID：产品ID；
                //5,与对手关联，dataID：对手ID；
                //6，与合同关联，dataID：合同ID；
                //7，与市场活动关联，dataID：市场活动ID；
                //8，销售线索关联，dataID：线索ID
                "dataID":165// int，数据ID
            },
            "display":["picture","attach"]
        });
        var customerMap = new CustomerMap({
            "element":$(".crm_map",tplEl),
            "address":"北京市海淀区知春路甲63号卫星大厦7层703",
            "mapWidth":600
        });

        var attachment = new Attachment({
            "element":$('.attachment_wrapper',tplEl),
            "items":[{"attachName":"test.xls","attachPath":"attachPath","fileName":"attachPath"},{"attachName":"test.xls","attachPath":"attachPath","fileName":"attachPath"},{"attachName":"test.xls","attachPath":"attachPath","fileName":"attachPath"}]
        });

        var rename = new AttachmentRename({});

        var attachmentList = new AttachmentList({
            "element":$(".attach_list",tplEl)
        });

        var selectColleague = new SelectColleague({
            //"element":$('.select-colleague',tplEl)
            "isMultiSelect":true,
            "hasWorkLeaveBtn":false,
            "title":"sdfdsfas"
        });

        var selectcontacts = new ContactsDialog({
            "url":"/Contact/GetContactsByCustomerID/",
            "defaultCondition":{
                "customerID":495
            }
        });

        var selectcustomer = new CustomerDialog({});

        var oppSelect = new OppSelect();

        var paymentPlan = new PaymentPlanDialog({
            //新建
//            contractID: 157,
//            contractTitle: 'ttt',
//            ownerID: 2,
//            ownerName: '刘晨',
            //编辑
            contractPaymentPlanID: 103,
            contractID: 157,
            contractTitle: 'ttt',
            contractPaymentPlan: undefined,
            payTimes: []
            //show
//            contractTitle: undefined,
//            ownerID: 2,
//            ownerName: '刘晨'
        });
        paymentPlan.on('success', function(){
            console.log(arguments)
        })
        var paymentRecord = new PaymentRecordDialog({
            //新建
//            contractID: 157,
//            ownerID: 2,
//            ownerName: '刘晨',
//            payTimes: [],

            //编辑
//            contractPaymentRecordID: 179,

            //在回款计划下新建
//            contractPaymentPlanID: 1,
//            contractID: 157,
//            ownerID: 2,
//            ownerName: '刘晨'

            //show
//            ownerID: 2,
//            ownerName: '刘晨',
//            paymentTimes: 2,
//            paymentTime: 0,
//            amount: 111
        });

        var productSelectDialog = new ProductSelect({
            salesOpportunityID: 153
        });
        productSelectDialog.on('success', function(){
            console.log(arguments)
        })
        productSelectDialog.on('good', function(){
            console.log(arguments)
        })
        var competitorSelectDialog = new CompetitorSelect({
            salesOpportunityID: 153
        });

        var currencyInput =  new CurrencyInput({
            "element":$(".currency_input",tplEl)
        });
        var currencyInput1 =  new CurrencyInput({
            "element":$(".currency_input1",tplEl)
        });

        attachment.on("toAll",function(){
            alert("toAll");
        });

        attachment.on("upload",function(){
            alert("upload");
        });

        rename.on("submit",function(attachId,oldName,newName){
            alert("attachId:"+attachId+"+++++++oldName:"+oldName+"......newName:"+newName);
        });

        select.on('selected',function(val){
            //ajax();
            //alert(1);
            alert(val.text);
        });

        pagination.on('page',function(val){
            alert(val);
        });

        selectColleague.on("selected",function(val){
            alert(val.name);
        });

        selectcontacts.on("selected",function(val){
            alert(val.length);
        });

        selectcustomer.on("selected",function(val){
            alert(val.length);
        });

        $('#btn_test',tplEl).click(function(){
            var test = $("#ipt_test").val();
            pagination.setTotalSize(test);
        });

        $("#btn_showDialog",tplEl).click(function(){
            selectColleague.show();
        });

        $("#btn_tagDialog",tplEl).click(function(){
            tag.willShow();
        });

        $("#btn_renameDialog",tplEl).click(function(){
            rename.show(100,"old name");
        });

        $("#btn_fileDialog",tplEl).click(function(){
            file.show();
        });

        $("#btn_importDialog",tplEl).click(function(){
            importDialog.show();
        });
        $("#btn_exportDialog",tplEl).click(function(){
            exportDialog.show();
        });
        $("#btn_contactsDialog",tplEl).click(function(){
            selectcontacts.show();
        });
        $("#btn_customerDialog",tplEl).click(function(){
            selectcustomer.show("测试");
        });
        $("#btn_alert",tplEl).click(function(){
            //util.remind(2,"张丁亮您好！");
            attachmentList.reset({"dataID":100});

        });

        $("#btn_confirm",tplEl).click(function(){
            currencyInput.setValue(1256);
        });
        $("#btn_oppselect",tplEl).click(function(){
            oppSelect.show();
        });
        $("#btn_paymentplan",tplEl).click(function(){
            paymentPlan.show();
        });
        $("#btn_paymentrecord",tplEl).click(function(){
            paymentRecord.show();
            this.createDialogInOpp = new ContractDialog({
                salesOpportunityID: 11,
                salesOpportunityName: 'tt',
                customerID: 22,
                customerName: 'ss'
            });
            this.createDialogInOpp.show();
        });

        $("#btn_select_product",tplEl).click(function(){
            productSelectDialog.show();
//            competitorSelectDialog.show();
        });
        $("#btn_product_inopp",tplEl).click(function(){
//            var d = new ProductInOppDialog({
//                oppProductRelationID: 179
//            })
//            d.show({
//                flag: 'view',
//                oppProductRelationID: 179
//            });
//            var d = new CompetitorInOppDialog({
//                salesOpportunityID: 152,
//                competitorID: 49
//            })
//            d.show({
//                flag: 'view',
//                salesOpportunityID: 152,
//                competitorID: 49
//            });
//            var cD = new ContactViewDialog();
//
//            cD.show({
//                contactID: 1021
//            });
            var cd = new CustomerinsettingDialog();
            cd.show({
                customerID: 501
            })
        });
    };
});