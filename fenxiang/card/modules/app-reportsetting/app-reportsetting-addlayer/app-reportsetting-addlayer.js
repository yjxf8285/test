define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    require('modules/app-reportsetting/app-reportsetting-addlayer/app-reportsetting-addlayer.css');
    var Dialog=require('dialog'),
    	tplhtml = require('modules/app-reportsetting/app-reportsetting-addlayer/app-reportsetting-addlayer.html');
    
    //添加层级
    var AddLayer=Dialog.extend({
    	"attrs":{
	    	"title": "新建上报节点",
	        "width": 510,
	        "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
	        "content": tplhtml,
	        "condition": {
		    	title: '',
				parentName: '',
				nodeID: '',
				callback: function(){}
	        },
	        "className": 'app-reportsetting-addlayer',
	        "hasParent": false
        },
        events: {
        	'click .btn-ok': 'submit',
        	'click .btn-cancel': 'hide'
        },
        setup:function(){
            var result=AddLayer.superclass.setup.call(this);
            return result;
        },
        show: function(data) {
        	var that = this;
        	var condition = this.get('condition');
        	condition = _.extend(condition, data);
        	this.set('condition', condition);
        	var result = AddLayer.superclass.show.apply(this, arguments);
        	$('.app-reportsetting-addlayer-hd', this.element).html(data.title);
        	if(data.nodeID) {
        		$('.ipt-parent-node', this.element).val(data.parentName).addClass('disabled').attr('readonly', true);
        		this.set('hasParent', true);
        		this.set('nodeID', data.nodeID);
        	} else {
        		this.set('hasParent', false);
        		this.ipt = util.bindIptSearch($('.ipt-parent-node', this.element), '/DataReporting/SreachNotBottomNode', {
            		templateID: that.get('condition').templateID
            	});
        		$('.ipt-parent-node', this.element).val('').removeClass('disabled').removeAttr('readonly');
        	}
        	return result;
        },
        "render": function () {
            var result = AddLayer.superclass.render.apply(this, arguments);
            return result;
        },
        submit: function(evt){
        	if(!this.get('hasParent')) {
        		if(!$.trim($('.ipt-parent-node', this.element).val())) {
        			util.showInputError($('.ipt-parent-node', this.element));
            		return;
        		}
        	}
        	var nodeName = $('.ipt-name', this.element);
        	if (nodeName.val().length > 20 || !$.trim(nodeName.val())) {
        		util.showInputError(nodeName);
        		return;
        	}
        	var callback = this.get('condition').callback,
        		parentID;
        	if(this.get('hasParent')) {
        		parentID = this.get('condition').nodeID
        	} else {
        		parentID = this.ipt.getValue() && this.ipt.getValue().id;
        	}
        	callback && callback(parentID, nodeName.val(), $(evt.target));
        	//this.hide();
        },
        //隐藏
        "hide": function () {
            var result = AddLayer.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        //重置
        "reset": function () {
        	$('.ipt-name', this.element).val('');
        	if(!this.get('hasParent')) {
        		$('.ipt-parent-node', this.element).val('');
        	} else {
        		util.unbindIptSearch($('.ipt-parent-node', this.element));
        		this.ipt = null;
        	}
        },
        destroy:function(){
            var result;
            result=AddLayer.superclass.destroy.call(this);
            return result;
        }
    });
    module.exports=AddLayer;
});