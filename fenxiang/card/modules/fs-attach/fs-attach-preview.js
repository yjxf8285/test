/**
 * FS附件预览图片和文件
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var Preview=require('preview'),
        moment = require('moment'),
//        attachStyle=require('./fs-attach.css'),
        util=require('util'),
        Widget=require('widget');
    var AttachPreview=Preview.extend({
        attrs: {
            "zIndex":1000,
            "belongToType":"feed", //如果属于feed的附件，右侧要显示feed详细信息，可选值是"feed"/"reply"/"qx"/"notice"
            "refId":"" //如果附件属于feed，refId是feedId；如果附件属于reply，refId是replyId；如果附件属于qx，refId是相应id
        },
        setup:function(){
            var that=this;
            var result=AttachPreview.superclass.setup.apply(this,arguments);
            this.previewInfoCpt=[];    //保存右侧信息栏包含的组件实例，供以后清除
            return result;
        },
        render:function(){
            var result=AttachPreview.superclass.render.apply(this,arguments);
            return result;
        },
        hide:function(){
            var that=this;
            var elEl=this.element,
                replyInputEl=$('.preview-reply',elEl);
            if(_.str.trim(replyInputEl.val()).length>0){
                util.confirm('已输入回复内容，关闭后要清空内容，是否确定要关闭？','提示',function(){
                    AttachPreview.superclass.hide.apply(that,arguments);
                });
            }else{
                AttachPreview.superclass.hide.apply(this,arguments);
            }
        },
        /**
         * 渲染右侧信息栏
         * @private
         */
        _renderPreviewInfo:function(){
            var elEl=this.element,
                previewInfoEl=$('.ui-preview-info',elEl),
                previewPanelEl=$('.ui-preview-panel',elEl),
                closeBtnEl=$('.ui-preview-close-btn',elEl);
            var belongToType=this.get('belongToType'),
                previewPanelMr=previewPanelEl.css('margin-right');  //preview panel的margin right初始值
            //先重置右侧信息栏
            //this._resetPreviewInfo();
            //设置独特className
            previewInfoEl.addClass('ui-preview-info-attach');
            //重新渲染
            if(belongToType=="feed"){
                previewPanelEl.css({
                    "margin-right":previewPanelMr
                });
                previewInfoEl.show();   //显示右侧边栏
                closeBtnEl.removeClass('ui-preview-close-btn-right');
                this._renderFeedPreviewInfo();
            }else{
                previewPanelEl.css({
                    "margin-right":'0px'
                });
                previewInfoEl.hide();   //隐藏右侧边栏
                closeBtnEl.addClass('ui-preview-close-btn-right');
            }
        },
        /**
         * 重置右侧信息栏
         * @private
         */
        _resetPreviewInfo:function(){
            var elEl=this.element,
                previewInfoEl=$('.ui-preview-info',elEl);
            _.each(this.previewInfoCpt,function(cpt){
                cpt.destroy&&cpt.destroy();
            });
            this.previewInfoCpt=[];
            previewInfoEl.empty();
        },
        /**
         * belongToType==feed时右侧信息栏的渲染
         * @private
         */
        _renderFeedPreviewInfo:function(){
            var that=this;
            var elEl=this.element,
                previewInfoEl=$('.ui-preview-info',elEl);
            var feedId=this.get('refId');
            //延时引用是因为feedlist中可能会循环引用
            var feedC = require('modules/feed-list/feed-list-c'),
                feedM = require('modules/feed-list/feed-list-m'),
                feedV = require('modules/feed-list/preview-feed-v');
            var FeedC=feedC.listC,
                FeedM=feedM.itemM,
                FeedItemV=feedV.itemV;  //feed view实例
            var tempFeedC=new FeedC();  //用于feed返回信息格式化
            //feed详情view
            util.api({
                "url":"/feed/getFeedByFeedID",
                "data":{
                    "feedID":feedId
                },
                "type":"get",
                "success":function(responseData){
                    var formatData,
                        feedV,
                        feedEl;
                    if(responseData.success){
                        formatData=tempFeedC.parse(responseData);
                        feedV=new FeedItemV({
                            "model":new FeedM(formatData[0]),
                            "replyListOpts":{   //回复列表配置参数
                                "listPath":"/Feed/GetFeedReplysByFeedID",  //请求回复列表地址
                                "withPagination":false   //默认不带分页
                            },
                            "replyWithMedia":false  //不加多媒体功能
                        }).render();
                        feedEl=feedV.$el;
                        feedEl.appendTo(previewInfoEl);
                        feedV.renderCpt();  //需要等到feedV渲染到文档流中再render组件，否则在ie下AtInput初始高度不正确
                        //注册到previewInfoCpt中
                        that.previewInfoCpt.push(feedV);
                    }
                }
            });
        },
        "preview":function(attrs){
            var that=this;
            var data=attrs.data,
                refId=attrs.refId,
                belongToType=attrs.belongToType,
                type=attrs.type,
                activeIndex=attrs.activeIndex;
            if(_.isUndefined(activeIndex)){
                activeIndex=0;     //默认预览第一张图
            }

            this._resetPreviewInfo();   //先清空
            this.set('belongToType',belongToType);
            this.set('data',data);
            this.set('refId',refId);
            this.set('type',type);  //设置type会重新计算渲染整个preview dom层
            this.set('activeIndex',activeIndex);  //设置第一个为激活item
            //重新渲染右侧信息
            this._renderPreviewInfo();
            this.show();


        },
        /**
         * 重载父类接口
         * @returns {*|string}
         * @private
         */
        _getFileLink:function(path){
            var belongToType=this.get('belongToType'),
                arg = Array.prototype.slice.call(arguments);
            if(belongToType == 'newqx'){
                return util.getFileUrl.apply(this, arg);
            }
            else if(belongToType!="notice"){
                return util.getDfLink.apply(this,arg);
            }else{
                return util.getDfGlobalLink.apply(this,arg);

            }

        },
        destroy:function(){
            var result;
            this._resetPreviewInfo();
            result=AttachPreview.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    tplEvent.on('switch', function (tplName, tplSelector) {
        //用户切换行为会隐藏所有预览组件
        $('.ui-preview').each(function(){
            Widget.query(this).hide();
        });
    });
    //module.exports=AttachPreview;
    module.exports=function(){    //改为单例模式，减少dom上的开销
        var selfFn=arguments.callee;
        if(!selfFn.singleIns){
            selfFn.singleIns=new AttachPreview();
        }
        return selfFn.singleIns;
    };
});