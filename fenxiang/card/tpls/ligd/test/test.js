/**********
 * chart demo页
 **********/
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;

    var util = require('util'),
        Dialog = require("dialog");

    var AttachmentRename=require('modules/crm-attachment-rename/crm-attachment-rename');
    var Highsea=require('modules/crm-highsea-editsetting/crm-highsea-editsetting');
    var Expiretime=require('modules/crm-highsea-expiretime/crm-highsea-expiretime');
    var Cusedit=require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit');
    var Pagination=require('uilibs/pagination');

	var chart=require('modules/crm-chart/mainchart');
    
    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        
        $('.sub-tpl-switch-mask').hide();
        
        var rename = new AttachmentRename({});
        var highsea=new Highsea();
        var expiretime=new Expiretime();
        var cusedit=new Cusedit();

        $('.highseasBtn').click(function(){
            //rename.show(100,'oldname');
            highsea.show(30);
        })
        $('.newhighsea').click(function(){
        	highsea.show();
        })
        $('.settime').click(function(){
            expiretime.show(1403070925000,30);
        })
        $('.customeredit').click(function(){
            cusedit.show({
                customerID:520,
                dialogType:1
            })
        })
        $('.customereditb').click(function(){
            cusedit.show({
                customerID:520
            })
        })
        $('.customereditc').click(function(){
            cusedit.show({
                customerID:520,
                dialogType:2
            })
        })

        highsea.on('addSuccess',function(data){
     
        });
        highsea.on('deleteSuccess',function(){
        });
        highsea.on('modifySuccess',function(data){
        });
       
        expiretime.on('submit',function(val){
        })

        var page=new Pagination({
                "element": $('.tpl-pagenation'),
                "pageSize": 14,
                "totalSize":24
            });
        page.render();
        page.on('page', function (pageNumber) {
            console.log(pageNumber);        
        });
    };
});   
