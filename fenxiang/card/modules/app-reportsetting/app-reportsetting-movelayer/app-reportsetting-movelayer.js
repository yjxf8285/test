define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    require('modules/app-reportsetting/app-reportsetting-movelayer/app-reportsetting-movelayer.css');
    var Dialog=require('dialog'),
    	tplhtml = require('modules/app-reportsetting/app-reportsetting-movelayer/app-reportsetting-movelayer.html');
    
    //添加层级
    var MoveLayer=Dialog.extend({
    	"attrs":{
	    	"title": "移动",
	        "width": 510,
	        "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
	        "content": tplhtml,
	        "condition": {
	            
	        },
	        "className": 'app-reportsetting-movelayer',
	        "callback": null
        },
        events: {
        	'click .btn-ok': 'submit',
        	'click .btn-cancel': 'hide'
        },
        setup:function(){
            var result=MoveLayer.superclass.setup.call(this);
            return result;
        },
        show: function(data) {
        	var condition = this.get('condition');
        	condition = _.extend(condition, data);
        	this.set('condition', condition);
        	var result = MoveLayer.superclass.show.apply(this, arguments);
        	this.set('callback', data.callback);
        	return result;
        },
        "render": function () {
            var result = MoveLayer.superclass.render.apply(this, arguments);
            this.bindEvents();
            return result;
        },
        bindEvents: function(){
        	this.ipt = util.bindIptSearch($('.ipt-parent-node', this.element), '/DataReporting/SreachNotBottomNode', {
        		templateID: this.get('condition').templateID
        	});
        },
        submit: function(evt){
        	var value = this.ipt.getValue();
        	if(!value) {
        		util.showInputError($('.ipt-parent-node'), this.element);
        		return;
        	}
        	var callback = this.get('callback');
        	callback && callback(value.id, $(evt.target));
        	// this.hide();
        },
        //隐藏
        "hide": function () {
            var result = MoveLayer.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        //重置
        "reset": function () {
        	$('.ipt-parent-node', this.element).val('');
        },
        destroy:function(){
            var result;
            result=MoveLayer.superclass.destroy.call(this);
            return result;
        }
    });
    module.exports=MoveLayer;
});