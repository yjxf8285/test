/* 
 Created on : 2013-12-04, 14:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var fsHelper = require('modules/fs-qx/fs-qx-helper');
    var JoinDialog = fsHelper.JoinDialog; //选人选部门弹出组件
    exports.init = function() {
    	var that = this;
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
//        if(!FS.getAppStore('globalData').isAllowDangerOperate) {
//        	tpl.navRouter.navigate('#datamanage/networkdiskmanage', {trigger: true});//手动跳转页面
//		}
        //页面切回后重新调整输入框大小
        tpl.event.on('switched', function (tplName2, tplEl) {
            if (tplName2 ==that.tplName) {
            	if(FS.getAppStore('globalData').isAllowDangerOperate) {
            		$('.btn-reset-crm', this.element).addClass('button-submit').removeAttr('disabled');
        		} else {
        			$('.btn-reset-crm', this.element).removeClass('button-submit').attr('disabled', true);
        		}
            }
        });
        if(FS.getAppStore('globalData').isAllowDangerOperate) {
        	$('.btn-reset-crm', this.element).addClass('button-submit').removeAttr('disabled');
	        $('.btn-reset-crm', this.element).on('click', function(){
	        	util.confirm('确定要执行CRM数据初始化吗？', 'CRM初始设置', function(){
	        		util.api({
	        			 "url": '/Management/InitCRM',
	                     "type": 'post',
	                     "dataType": 'json',
	                     "data": {},
	                     "timeout": 120000,//延时2分钟
	                     "success": function(responseData) {
	                         var datas = responseData.value;
	                         if (responseData.success) {
	                        	 util.showSucessTip('CRM初始化成功！');
	                         } else {
	                        	 FS.util.alert(responseData.message || '执行失败');
	                         }
	                     },
	                     "error": function(){
	                    	 FS.util.alert('执行失败');
	                     }
	        		});
	        	});
	        });
        }
        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a',tplEl),'fl-item-on');
    };
});