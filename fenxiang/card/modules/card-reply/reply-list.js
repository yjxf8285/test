/**
 * 卡片式回复列表组件
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var Widget=require('widget'),
        util=require('util'),
        moduleTpl=require('./reply.html'),
//        moduleStyle=require('./reply.css'),
        publish=require('modules/publish/publish'),
        moment=require('moment'),
        feedHelper = require('modules/feed-list/feed-list-helper.js'),
        AttachPreview = require('modules/fs-attach/fs-attach-preview'), //预览组件
        filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
        AudioPlayer = require('uilibs/audio-player'); //音频播放组件

    var moduleTplEl=$(moduleTpl),
        feedReplyTpl=moduleTplEl.filter('.feed-reply-tpl').html(), //主体模板
        inputBoxTplCompiled= _.template(moduleTplEl.filter('.feed-reply-input-tpl').html()),  //输入框模板
        replyItemTplCompiled=_.template(moduleTplEl.filter('.feed-reply-item-tpl').html());    //回复item模板
    var AtInput = publish.atInput,
        MediaMaker = publish.mediaMaker,
        formatContent = feedHelper.feedContentFormat_;//reply拼接;
    //设置预览组件
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件

    var contactData=util.getContactData(),
        loginUserData=contactData["u"];

    var ReplyList=function(opts){

    };
    _.extend(ReplyList.prototype,{

    });
    module.exports = ReplyList;
});