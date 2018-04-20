/**
 * FS预览图片和文件
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var Preview=require('preview'),
        moment = require('moment'),
        util=require('util'),
        style=require('./fs-preview.css'),
        tplEl=$(require('./fs-preview.html'));

    var feedUrl='/feed/GetFeedByFeedID',
        replyUrl='/feed/GetFeedReplysByFeedID',
        previewBashPath=FS.BASE_PATH+'/sl/DF/Get';

    var FsPreview=Preview.extend({
        attrs: {
            "belongToFeed":true, //如果属于feed的附件，右侧要显示feed信息
            "dataId":"" //如果是
        },
        events: {
            'click .reply-input': 'showSubmit',
            'blur .reply-input':'hideSubmit'
        },
        setup:function(){
            return FsPreview.superclass.setup.apply(this,arguments);
        },
        showSubmit:function(e){
            var elEl=$(e.currentTarget),
                formEl=elEl.closest('.reply-form');
            formEl.addClass('inputting');
        },
        hideSubmit:function(e){
            var elEl=$(e.currentTarget),
                formEl=elEl.closest('.reply-form');
            formEl.removeClass('inputting');
        },
        preview:function(type,feedId,attachId){
            attachId=attachId||FS.UNDEFINED;
            this.render();	//为了利用_onRender机制提前render
            this.set('type',type);

            if(this.get('feedId')==feedId){
                this._setActiveIndexByAttachId(attachId);
            }else{
                this.set('feedId',feedId);
                this.set('attachId',attachId);
            }
            this.show();
        },
        _renderPanel:function(itemData){
            var type=this.get('type'),
                data=[];
            if(type=="img"&&itemData.pictures){
                _.each(itemData.pictures,function(v){
                    data.push({
                        "previewPath":previewBashPath+'/'+v.attachPath+'2.'+v.fileIcon,
                        "originPath":previewBashPath+'/'+v.attachPath+'1.'+v.fileIcon,
                        "thumbPath":previewBashPath+'/'+v.attachPath+'3.'+v.fileIcon,
                        "attachId":v.attachID
                    });
                });
            }else if(type=="attach"&&itemData.files){
                _.each(itemData.files,function(v){
                    data.push({
                        "previewPath":previewBashPath+'/'+v.attachPath+'2.'+v.fileIcon,
                        "originPath":previewBashPath+'/'+v.attachPath+'1.'+v.fileIcon,
                        "thumbPath":previewBashPath+'/'+v.attachPath+'3.'+v.fileIcon,
                        "fileSize":v.attachSize,
                        "fileName":v.attachName,
                        "attachId":v.attachID
                    });
                });
            }
            this.set("data",data);
            this._setActiveIndexByAttachId();

            this._renderItemInfo(itemData);
        },
        _setActiveIndexByAttachId:function(attachId){
            attachId=attachId||this.get('attachId');
            var activeIndex=0,
                data=this.get('data');
            if(attachId!==0){
                _.find(data,function(v,i){
                    if(v.attachId==attachId){
                        activeIndex=i;
                        return true;
                    }
                });
            }
            this.set('activeIndex',activeIndex);
        },
        _formatFeedData:function(itemData){
            var formatData={};
            _.extend(formatData,{
                "avaterPath":previewBashPath+'/'+itemData.sender.profileImage+'3.jpg',
                "userName":itemData.sender.name,
                "createTime":moment(itemData.createTime).startOf('hour').fromNow(),
                "replyCounts":0,
                "feedRangeTip":itemData.feedRangeTip,
                "feedContent":createFeedContent(itemData)
            });
            return formatData;
        },
        _formatReplyData:function(itemData){
            var formatData={};
            _.extend(formatData,{
                "avaterPath":previewBashPath+'/'+itemData.sender.profileImage+'3.jpg',
                "userName":itemData.sender.name,
                "createTime":moment(itemData.createTime).startOf('hour').fromNow(),
                "replyContent":createReplyContent(itemData)
            });
            return formatData;
        },
        _renderReplyPanel:function(replyTpl){
            var that=this;
            var feedId=this.get('feedId');
            var elEl=this.element,
                infoEl=$('.ui-preview-info',elEl),
                replyListEl=$('.fs-preview-reply-list',infoEl),
                replyCountsEl=$('.reply-counts',infoEl),
                compiled;
            util.api({
                "url":replyUrl,
                "type":"get",
                "data":{
                    "feedid":feedId,
                    "pagesize":1000,
                    "pageNumber":1
                },
                "apiCb":function(responseData){
                    var itemsData=[];
                    if(responseData.success){
                        //itemsData=responseData.value.items;
                        _.each(responseData.value.items,function(v,i){
                            itemsData[i]=that._formatReplyData(v);
                        });
                        compiled= _.template(replyTpl);
                        replyListEl.html(compiled({
                            "replyItems":itemsData
                        }));
                        //设置回复数
                        replyCountsEl.text(itemsData.length);
                    }
                }
            });
        },
        _renderItemInfo:function(itemData){
            var elEl=this.element,
                infoEl=$('.ui-preview-info',elEl),
                inputEl;
            var panelTplEl=tplEl.clone(),
                panelTpl,
                replyTpl,
                panelData=this._formatFeedData(itemData),
                compiled;
            $('.fs-preview-reply-list',panelTplEl).empty();
            panelTpl=panelTplEl.html();
            replyTpl=$('.fs-preview-reply-list',tplEl.clone()).html();
            //render panel
            compiled = _.template(panelTpl);
            infoEl.addClass('fs-preview-info').html(compiled(panelData));
            inputEl=$('textarea',infoEl);
            util.placeholder(inputEl);
            require.async(['jslibs/jquery.autosize.js'],function(){
                inputEl.autosize();
            });
            //render reply
            this._renderReplyPanel(replyTpl);

        },
        _onRenderFeedId:function(val){
            var that=this;
            if(val.length>0){
                util.api({
                    "url":feedUrl,
                    "type":"get",
                    "data":{
                        "feedID":val
                    },
                    "apiCb":function(responseData){
                        var itemData;
                        if(responseData.success){
                            itemData=responseData.value.items[0];
                            that._renderPanel(itemData);
                        }
                    }
                });
            }
        }
    });
    module.exports=FsPreview;
});