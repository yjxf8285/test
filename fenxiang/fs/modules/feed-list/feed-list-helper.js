/**
 * feedlist helper,对外提供一些帮助接口
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var helper = {};
    var util = require('util'),
            moment = require('moment');
    _.extend(helper, {
        /**
         * 根据文本类型转换成对应的html片段
         * @param text
         */
        "feedContentFormat_helper": function(content) {
            var tempContent,
                    text = content.text,
                    type = content.type;
            //组装文本
            switch (type) {
                case 1:
                    tempContent = '<span class="highlight">' + text + '</span>'; //高亮
                    break;
                case 2:
                    tempContent = '<a href="' + text + '" target="_blank">' + text + '</a>'; //超链接
                    break;
                case 3:
                    tempContent = '<a href="#stream/showtopic/=/name-' + encodeURIComponent(content.dataTitle) + '">' + text + '</a>'; //话题
                    break;
                case 4:
                    tempContent = '<a href="#circles/atcircle/=/cid-' + content.dataID + '">' + text + '</a>'; //@部门
                    break;
                case 5:
                    tempContent = '<a href="#profile/=/empid-' + content.dataID + '">' + text + '</a>'; //@人
                    break;
                default:
                    tempContent = text; //普通文本
                    break;
            }
            //换行转换
            //tempContent = tempContent.replace(/[\n|\r]/g, '<br/>');
            tempContent = tempContent.replace(/[\n\r]/g, '<br/>');
            return tempContent;
        },
        /**
         * feedContent组织成html
         * feedContentFormat的另一个版本
         * @param itemData
         */
        "feedContentFormat_": function(maxWordNum, itemData) {
            var feedType = itemData.feedType,
                    planType,
                    planLabel;
            var summaryHtml = '', //summary text
                    leftHtml = '', //剩下的文本
                    counter = 0; //word计数器
            /**
             * 分派文本到summaryHtml或者leftHtml
             * @param itemContent
             */
            var dispatchHtml = function(itemContent) {
                var text = itemContent.text, //内容文本
                        type = itemContent.type; //文本类型
                if (type != 0) { //特殊类型的文本需要转换
                    //先追加算子，保证summaryHtml包含的text<=maxWordNum
                    counter += text.length;
                    if (counter <= maxWordNum) {
                        summaryHtml += helper.feedContentFormat_helper(itemContent);
                    } else {
                        leftHtml += helper.feedContentFormat_helper(itemContent);
                    }
                } else { //普通文本直接处理
                    _.each(text.split(''), function(word) {
                        counter += 1;
                        //word = word.replace(/[\n|\r]/g, '<br/>');
                        word = word.replace(/</g, '&lt;');  //尖括号替换
                        word = word.replace(/>/g, '&gt;');  //尖括号替换
                        word = word.replace(/[\n\r]/g, '<br/>');
                        word = word.replace(new RegExp(' ', 'g'), '&nbsp;'); //空格转成实体&nbsp;

                        if (counter <= maxWordNum) {
                            summaryHtml += word;
                        } else {
                            leftHtml += word;
                        }
                    });
                }
            };
            /**
             * 根据planType获取对应的label
             * @param planType
             */
            var getPlanLabel = function(planType) {
                var labelText;
                switch (planType) {
                    case 1:
                        labelText = ["今日", "明日"];
                        break;
                    case 2:
                        labelText = ["本周", "下周"];
                        break;
                    case 3:
                        labelText = ["本月", "下月"];
                    default:
                        labelText = ["", ""];
                        break;
                }
                return labelText;
            };
            if (itemData.replyContent) { //如果是回复的内容
                _.each(itemData.replyContent, function(itemContent) {
                    dispatchHtml(itemContent);
                });
            } else if (feedType == 2) { //日志类型有三段content
                planType = itemData.plan.planType;
                planLabel = getPlanLabel(planType);

                //counter += 6; //包含title字数
                summaryHtml += '<span class="feed-content-title">' + planLabel[0] + '工作总结</span><br/>';
                _.each(itemData.plan.reportContent, function(itemContent) { //今日工作总结
                    dispatchHtml(itemContent);
                });
                //counter += 6; //包含title字数
                if (counter <= maxWordNum) {
                    summaryHtml += '<br/><br/><span class="feed-content-title">' + planLabel[1] + '工作计划</span><br/>';
                } else {
                    leftHtml += '<br/><br/><span class="feed-content-title">' + planLabel[1] + '工作计划</span><br/>';
                }
                _.each(itemData.plan.planContent, function(itemContent) { //明日工作计划
                    dispatchHtml(itemContent);
                });
                //counter += 6; //包含title字数
                if (counter <= maxWordNum) {
                    summaryHtml += '<br/><br/><span class="feed-content-title">工作心得体会</span><br/>';
                } else {
                    leftHtml += '<br/><br/><span class="feed-content-title">工作心得体会</span><br/>';
                }
                _.each(itemData.feedContent, function(itemContent) { //明日工作计划
                    dispatchHtml(itemContent);
                });
            } else { //其他类型只有一个content

                _.each(itemData.feedContent, function(itemContent) {
                    dispatchHtml(itemContent);
                });
            }

            return {
                "summaryHtml": summaryHtml,
                "leftHtml": leftHtml,
                "feedWordNum": counter
            };
        },
        /**
         * feedContent组织成html
         * @param contents {Array||Object}
         * @returns {string}
         */
        /*=    显示超链接#和@    =*/
        "feedContentFormat": function(contents, itemData) {
            var formatContent = '';
            contents = [].concat(contents);
            _.each(contents, function(content) {
                var type = content.type,
                        tempContent = '';
                //添加超链接

                switch (type) {
                    case 1:
                        tempContent += '<span class="highlight">' + content.text + '</span>'; //高亮
                        break;
                    case 2:
                        tempContent += '<a href="' + content.text + '" target="_blank">' + content.text + '</a>'; //超链接
                        break;
                    case 3:
                        tempContent += '<a href="#stream/showtopic/=/name-' + encodeURIComponent(content.dataTitle) + '">' + content.text + '</a>'; //话题
                        break;
                    case 4:
                        tempContent += '<a href="#circles/atcircle/=/cid-' + content.dataID + '">' + content.text + '</a>'; //@部门
                        break;
                    case 5:
                        tempContent += '<a href="#profile/=/empid-' + content.dataID + '">' + content.text + '</a>'; //@人
                        break;
                    default:
                        tempContent += content.text; //普通文本
                        break;
                }
                //换行转换
                //tempContent = tempContent.replace(/[\n|\r]/g, '<br/>');
                tempContent = tempContent.replace(/[\n\r]/g, '<br/>');
                formatContent += tempContent;
            });
            return formatContent;
        },
        /*=    显示图片    =*/
        "picturesFormat": function(pictures, itemData) {
            var formatData = {};
            var picN;
            var downAll = '';
            var feedPicNum;
            var pictures = [].concat(pictures);
            var firstPic;
            if (pictures.length > 0) {
                picN = pictures.length;
                firstPic = pictures[0];
                if (picN > 1) {
//                    downAll = '<div class="downall-btn"><a href="#">打包下载</a></div>';
                    feedPicNum = '<p class="pic-num">图集(共' + picN + '张)</p>';
                    formatData.feedPic = downAll + '<div class="feedpics-bor feed-img"><div class="fpt-group"><div class="img-warp" style="position: absolute;"><table><tr><td valign="middle" align="center"><img src="' + util.getDfLink(firstPic.attachPath + '3', firstPic.attachName, false, 'jpg') + '" alt=""/></td></tr></table></div></div></div>' + feedPicNum;
                } else {
                    formatData.feedPic = '<div class="feed-img"><div class="img-warp"><table><tr><td valign="middle" align="center"><img src="' + util.getDfLink(firstPic.attachPath + '3', firstPic.attachName, false, 'jpg') + '"/></td></tr></table></div></div>';
                }
                ;
            } else {
                formatData.feedPic = '';
            }
            return formatData;
        },
        /*=    显示附件    =*/
        "filesFormat": function(files, itemData) {
            var formatData = {};
            var feedFiles = "";
            var canPreview = false;
            var previewBtn;
            var filePaths = '';
            var fileNames = '';
            var downAllLink = '';
            var downAll = '';
            files = [].concat(files);
            _.each(files, function(file) {
                canPreview = file.canPreview;
                file.name = file.attachName;
                if (canPreview) {
                    previewBtn = '<a href="#" class="attach-preview-l v">预览</a>';
                } else {
                    previewBtn = '';
                }
                //支持播放
                /*if(util.getFileExtText(file.attachName)=="mp3"){
                 previewBtn = '<a href="#" class="attach-play-l v">播放</a>';
                 }*/
                file.feedFiles = '<dl attachid="' + file.attachID + '"><dt><img src="' + FS.ASSETS_PATH + '/images/file/' + file.fileIcon + '.png" alt=""></dt><dd><p>' + file.attachName + '(' + util.getFileSize(file.attachSize) + ')</p><p><a href="' + util.getDfLink(file.attachPath, file.attachName, true) + '" class="d" title="' + file.name + '" target="_blank">下载</a> ' + previewBtn + '</p></dd></dl>';
                feedFiles += file.feedFiles;
                filePaths += file.attachPath + '|';
                fileNames += encodeURIComponent(file.attachName) + '|';
            });
            downAllLink = FS.API_PATH+'/df/GetBatchFiles?ids='+filePaths+'&names='+fileNames;
            downAll = '<div class="downall-btn fn-clear"><a href="' + downAllLink + '" style="float:right;margin-bottom: 4px;">打包下载</a></div>';
            if (files.length > 0) {
                if (files.length > 1) {
                    formatData.feedFiles = '<div class="feed-files feed-attach fn-clear">' + downAll + feedFiles + '</div>';
                } else {
                    formatData.feedFiles = '<div class="feed-files feed-attach fn-clear">' + feedFiles + '</div>';
                }
            } else {
                formatData.feedFiles = "";
            }
            return formatData;
        },
        /**
         * 渲染archive列表bar
         * @param archiveData
         * @returns {string}
         */
        "renderArchiveBar": function(archiveData, itemData) {
            var archive = archiveData;
            var htmlStr = "";
            var archiveTime, fmarchiveTime, archiveTag, archiveRemindHtml;
            if (!archive) {
                htmlStr = "";
            } else {
                archiveTime = archive.archiveTime;
                //fmarchiveTime = moment.unix(archiveTime).from(moment.unix(itemData.serviceTime));
                fmarchiveTime = util.getDateSummaryDesc(moment.unix(archiveTime), moment.unix(itemData.serviceTime), 1);
                archiveTag = "";
                _.each(archive.tags, function(archivetag) {
                    archiveTag += '<span class="ar-tip"><a href="javascript:void(0);">' + archivetag.tagName + '</a></span>';
                });
                archiveRemindHtml = '<div class="archive-remind"><span class="ar-time">归档于：' + fmarchiveTime + '</span><span class="ar-tit">标签：</span>' + archiveTag + '<span class="ar-modfiy"><a href="javascript:void(0);">修改</a></span></div>';
                htmlStr = archiveRemindHtml;
            }
            return htmlStr;
        }
    });
    module.exports = helper;
});