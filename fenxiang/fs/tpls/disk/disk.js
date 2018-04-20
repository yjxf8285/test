/**
 * Created with IntelliJ IDEA.
 * User: liuxf
 * Date: 13-7-9
 * Time: 下午6:06
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
	var root = window,
		FS = root.FS,
		tpl = FS.tpl,
		store = tpl.store,
		tplEvent = tpl.event;
	var WebDisk = require('modules/webdisk/webdisk');

	exports.init = function() {
		var tplName = exports.tplName;
		var tplEl = exports.tplEl;
		var diskEl = $('.disk-model', tplEl);
		var webdisk = new WebDisk({
			"element": diskEl, //容器           
			"listPath": "/NetDisk/GetNDDirectoryInfos" //网盘请求列表默认地址		
		});
	};
});