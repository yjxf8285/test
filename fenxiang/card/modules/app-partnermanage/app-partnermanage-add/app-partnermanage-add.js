name="partner-area"/**********
 * 新增代理商彈窗
 **********/
define(function(require, exports, module) {
    var util=require("util");

    var Dialog = require("dialog"),
        Address = require("../app-partnermanage-address/app-partnermanage-address.js");




    var addPartnerString = require("./app-partnermanage-add.html"),
        style=require("./app-partnermanage-add.css");
	
    var AddPartner=Dialog.extend({
        "attrs":{
			"content":addPartnerString,
			"width":455,
            "closeTpl":"X"
		},
        initialize:function(){
            var self=this;
            var result=AddPartner.superclass.initialize.apply(this,arguments);
            return result;
        },
		setup:function(){
            var self=this;
            var result=AddPartner.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result =AddPartner.superclass.render.apply(this, arguments);
            var self=this;
            self.address=new Address({'trigger':self.$('[name="partner-area"]')});
            return result;
        },
        //显示
        "show": function () {
            var result = AddPartner.superclass.show.apply(this, arguments);




            return result;
        },
        //隐藏
        "hide": function () {
            var result =AddPartner.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "events":{
           'click .overlay-a':'overlay_a',
           'click .bottom-sure':'sureEve',
           'keydown':'keyEve',
           'click .bottom-cancel':'hide'
        },

        //检查并获取数据
        'checkInfo':function(){
            var self=this;
            var areaCode=self.$('[name="partner-area"]').attr('data-id'),
                name=self.$('[name="partner-name"]').val();
            
            return {
                'areaCode':areaCode,
                'name':name
            }
        },
        keyEve:function(e){
            if(e.keyCode==13){
                this.sureEve();
            }
        },
        //确定按钮响应事件
        'sureEve':function(){
            var self=this;

            var info=self.checkInfo();

            util.api({
                'type':'post',
                'url':'/CrossPartner/AddDepartment',
                'data':{
                    'name':info['name'],
                    'areaCode':info['areaCode']
                },
                'success':function(data){
                    console.warn(data);
                }
            })
        },
        //重置值
        'reset':function(){
            this.$('[name="partner-area"]').val('');
            this.$('[name="partner-name"]').val('');
        },
        "destroy":function(){
            var result=AddPartner.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    
    module.exports=AddPartner;
});   









