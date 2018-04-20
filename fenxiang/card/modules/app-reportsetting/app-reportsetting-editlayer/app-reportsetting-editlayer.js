define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    require('modules/app-reportsetting/app-reportsetting-editlayer/app-reportsetting-editlayer.css');
    var Dialog=require('dialog'),
    	tplhtml = require('modules/app-reportsetting/app-reportsetting-editlayer/app-reportsetting-editlayer.html'),
    	LayersInvolver = require('modules/app-reportsetting/app-reportsetting-involver/app-reportsetting-involver');
    
    //添加层级
    var EditLayer=Dialog.extend({
    	"attrs":{
	    	"title": "编辑节点",
	        "width": 616,
	        "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
	        "content": tplhtml,
	        "condition": {
		    	name: '',//节点名称
		    	id: null,//节点id
		    	parent: false,//是否是管理节点
		    	templateID: null//模板id
	        },
	        "className": 'app-reportsetting-editlayer',
	        "callback": null
        },
        events: {
        	'click .btn-save': 'save'
        },
        setup:function(){
            var result=EditLayer.superclass.setup.call(this);
            return result;
        },
        show: function(data) {
        	var condition = this.get('condition');
        	condition = _.extend(condition, data);
        	this.set('condition', condition);
        	var result = EditLayer.superclass.show.apply(this, arguments);
        	this.set('callback', data.callback);
        	$('.ipt-name', this.element).val(condition.name);
        	if(!this.layersInvolver) {
        		this.layersInvolver = new LayersInvolver({
                	wrapEl: $('.report-view-ctner', this.element)
                });
        		this.layersInvolver.getAllSimpleEmployees();
                this.layersInvolver.getAllOuterEmployees();
        	}
        	condition.showtip = false;
        	this.layersInvolver.refresh(condition);
        	return result;
        },
        "render": function () {
            var result = EditLayer.superclass.render.apply(this, arguments);
            this.setup();
            return result;
        },
        submit: function(){
        	var callback = this.get('callback');
        	callback && callback(this.get('nodeID'));
        },
        //保存名称
        save: function(){
        	var that = this,
        		$iptName = $('.ipt-name', this.element),
        		name = $.trim($iptName.val());
        	if(!name) {
        		util.showInputError($iptName);
        		return false;
        	}
        	util.api({
				"url": '/DataReporting/UpdateTemplateNodeName',
                "type": 'post',
                "dataType": 'json',
                "data": {
        			templateID: that.get('condition').templateID,
        			nodeName: name,
        			nodeID: that.get('condition').id
        		},
                "success": function (data) {
                    if (data.success) {
                    	that.trigger('saveName');
                    	util.remind(2, '保存成功');
                    }
                }
			});
        },
        //隐藏
        "hide": function () {
            var result = EditLayer.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        //重置
        "reset": function () {
        	$('.ipt-name', this.element).val('');
        },
        destroy:function(){
            var result;
            result=EditLayer.superclass.destroy.call(this);
            return result;
        }
    });
    module.exports=EditLayer;
});