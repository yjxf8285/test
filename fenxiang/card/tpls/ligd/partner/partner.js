addDialog/**********
 * chart demo页
 **********/
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;

    //发送工作通知
    var AddDialog= require('modules/app-partnermanage/app-partnermanage-add/app-partnermanage-add');
    var Example = require('modules/crm-attachment-rename/crm-attachment-rename');
	
    exports.init = function() {              
        var tplEl = exports.tplEl,
            tplName = exports.tplName;

        var addDialog=new AddDialog();
        var example=new Example();


        var $addBtn=$('#addDialog');

        $addBtn.click(function(){
            addDialog.show();
            //example.show();
        });
      

    };
});   
