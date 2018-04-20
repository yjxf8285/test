/**
 * 定义信息列表Collection
 *
 * 遵循seajs module规范
 * @author liuxf
 */
define(function(require, exports, module) {
    var root = window,
            FS = root.FS,
            tpl = FS.tpl,
            store = tpl.store,
            tplEvent = tpl.event;
    var util = require('util'),
            flutil = require('modules/feed-list/fl-util'),
            moment = require('moment'),
            listViewM = require('modules/feed-list/feed-list-m'),
            feedHelper = require('./feed-list-helper');

    var pinLink = feedHelper.feedContentFormat; //拼超链接
    var formatPics = feedHelper.picturesFormat; //拼图片
    var formatFiles = feedHelper.filesFormat; //拼附件
    var contactData = util.getContactData(),
            currentUserData = contactData["u"]; //自己
    var formatFeedContent = feedHelper.feedContentFormat_; //feed内容拼接

    /* 格式化数据并分类 */
    var formator = {
        "common": function(itemData) {
            var formatData = {};
            formatData.rootPath = FS.API_PATH; //根目录地址
            formatData.isWhat = itemData.isWhat || "";
            formatData.feedContent = itemData.feedContent;
            formatData.fiveStar = itemData.fiveStar || "";
            formatData.leaderinfo = itemData.leaderinfo || "";
            formatData.replyContent = itemData.replyContent || "";
            formatData.feedID = itemData.feedID || "";
            formatData.employeeID = itemData.sender.employeeID || "";
            formatData.textcur = itemData.textcur || "";
            formatData.textbtn = itemData.textbtn || "";
            formatData.feedPic = itemData.feedPic || "";
            formatData.feedFiles = itemData.feedFiles || "";
            formatData.pictures = itemData.pictures || "";
            formatData.sourceDescription = itemData.sourceDescription || "";
            formatData.archive = itemData.archive || "";
            formatData.serviceTime = itemData.serviceTime || "";
            formatData.announcement = itemData.announcement || null;
            formatData.voteItem = itemData.voteItem || null;
            formatData.schedule = itemData.schedule || null;
            formatData.isHide = ''; //用于判断隐藏
            formatData.morePendingW = ''; //更多里面的待办
            formatData.onencrypted = '';
            formatData.isencryptedTit = '';
            var isEncrypted = itemData.isEncrypted; //是否是加密信息
            if (isEncrypted) {
                formatData.onencrypted = "onencrypted";
                formatData.isencryptedTit = itemData.encryptTitle;
                formatData.isHide = 'hide';
            }

            /* 赞 */
            var likeCount = itemData.like.likeCount;
            var isAlreadyLike = itemData.isAlreadyLike;
            var islikeStr = '';
            var islikeTitStr = '取消赞';
            var islikeCurStr = 'islike cur';
            var islikeCountStr = '(<span class="likecountnum">' + likeCount + '</span>)';
            var likeEmployees = itemData.like.likeEmployees;
            var contentStr = '';
            var imgStr = '';
            var morebtnStr = '';

            if (likeEmployees) {
                _.each(likeEmployees, function(likeEmployeesdata, n) {
                    var name = likeEmployeesdata.name;
                    var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, '2');
                    var employeeID = likeEmployeesdata.employeeID;
                    imgStr += '<a href="#profile/=/empid-' + employeeID + '" class="js-empids" title="' + name + '"><img alt="' + name + '" src="' + profileImage + '"></a>';
                });
                //人数大于5个显示更多
                if (likeEmployees.length > 5) {
                    morebtnStr = '<a href="#stream/showfeed/=/id-' + formatData.feedID + '/open-like" title="更多" class="islike-more"></a>';
                } else {
                    morebtnStr = '<a href="#stream/showfeed/=/id-' + formatData.feedID + '/open-like" title="更多" class="islike-more hide"></a>';
                }

            }

            if (!isAlreadyLike) { //我没赞过
                islikeTitStr = '赞';
                islikeCurStr = 'islike';
                islikeCountStr = '';
                contentStr = '';
            }

            contentStr = '<div class="islike-tip" style="display:none;"><div class="toparrow"> <em>◆</em> <span>◆</span> </div>' + imgStr + morebtnStr + '</div>';
            if (likeCount > 0) { //别人赞过
                islikeCountStr = '(<span class="likecountnum">' + likeCount + '</span>)';
            } else {
                contentStr = '';
            }
            islikeStr = '<div class="' + islikeCurStr + '"><span class="islike-btn aj-feed-fn-com-btn" title="' + islikeTitStr + '"><b></b><a href="javascript:void(0);" class="likecount">' + islikeCountStr + '</a><i class="S_txt3">|</i></span>' + contentStr + '</div>';

            formatData.islike = islikeStr;

            /* 赞-详情页列表 */
            var islikeType = 0; //是列表的赞吗？
            var islikeListStr = '<div class="' + islikeCurStr + '"><span class="islike-btn aj-feed-fn-com-btn islikelist-btn" title="' + islikeTitStr + '"><b></b><a href="javascript:void(0);" class="likecount">' + islikeCountStr + '</a><i class="S_txt3">|</i></span></div>';

            if (islikeType) {
                formatData.islike = islikeListStr;
            }

            /* 主列表左侧大头像 */
            formatData.listprofileImage = util.getAvatarLink(itemData.sender.profileImage, '2');

            /* 是否显示“新”图标 */
            var newico = '<div class="img-new"></div>';
            if (itemData.isUnRead) {
                formatData.newico = newico;
            } else {
                formatData.newico = '';
            }


            /* 关注时间 */
            var oftime = itemData.followTime,
                    oftimetext = "";
            if (oftime) {
                oftime = moment.unix(oftime).format('YYYY年MMMDD日 HH:mm');
                oftimetext = '<div class="followtimeinfo">关注于：' + oftime + '</div>';
                formatData.oftimetext = oftimetext;
            } else {
                formatData.oftimetext = "";
            }

            /* feed类型 */
            var fmfeedType = util.getFeedTypeName(itemData.feedType);
            if (itemData.feedType == 2) {
                fmfeedType = util.getPlanTypeName(itemData.plan.planType);
            }
            formatData.feedTypeDescription = fmfeedType;

            /* feed 范围 */
            if (itemData.feedRangeDescription) {
                formatData.feedRangeDescription = '<span>-</span> <span class="group"> <a href="javascript:void(0);" title="' + itemData.feedRangeTip + '"> ' + itemData.feedRangeDescription + '</a> </span>';
            } else {
                formatData.feedRangeDescription = '<span>-</span> <span class="group"> <a href="javascript:void(0);" title="' + itemData.feedRangeTip + '"> 数据错误 </a> </span>';
            }

            /* 人名加链接 */
            formatData.sendername = '<a class="employee-name" href="#profile/=/empid-' + itemData.sender.employeeID + '">' + itemData.sender.name + '</a>';
            formatData.senderNameNoLink = itemData.sender.name; //无连接的人名
            /*=    显示图片    =*/
            _.extend(formatData, formatPics(itemData.pictures || []));


            /**
             * 网盘发同事功能带来的附件
             */
            var showEntnetworkdiskFile = function() {
                var feedNDFiles = itemData.feedNDFiles;
                var feedFiles = '';
                var feedFile = '';
                var previewBtn = '';
                var networkLinkBtn = '<a class="networklink-btn" href="#entnetworkdisk">进入网盘</a>';
                if (feedNDFiles.length > 0) {
                    _.each(feedNDFiles, function(file) {
                        var canPreview = file.isPreview;
                        //是否显示预览按钮
                        if (canPreview) {
                            previewBtn = '<a href="#" class="attach-preview-l v">预览</a>';
                        } else {
                            previewBtn = '';
                        }
                        //支持播放
                        //因为低级浏览器不能确定播放时间，所以暂时去掉音频附件的播放功能
                        /*if (util.getFileExtText(file.attachName) == "mp3") {
                         previewBtn = '<a href="#" class="attach-play-l v">播放</a>';
                         }*/
                        feedFiles += '<dl attachid="' + file.ndFileID + '"><dt><img src="' + FS.ASSETS_PATH + '/images/file/' + file.fileIcon + '.png" alt=""></dt><dd><p>' + file.attachName + '(' + util.getFileSize(file.attachSize) + ')</p><p><a href="' + util.getDfLink(file.attachPath, file.attachName, true) + '" class="d" title="' + file.name + '" target="_blank">下载</a> ' + previewBtn + '</p></dd></dl>';
                    });

                    formatData.feedFiles = '<div class="feed-files feed-attach fn-clear netdiskfile">' + feedFiles + networkLinkBtn + '</div>';


                } else {
                    /*=    显示feed附件    =*/
                    _.extend(formatData, formatFiles(itemData.files || []));
                }
            };
            showEntnetworkdiskFile();

            /* 显示归档提示 */
            formatData.archiveData = formatData.archive; //保留原来的归档数据
            formatData.archive = feedHelper.renderArchiveBar(formatData.archive, itemData);

            /* 计算发布的时间 */
            var ctime = itemData.createTime;
            //var finalTime = moment.unix(ctime).from(moment.unix(itemData.serviceTime));
            var finalTime = util.getDateSummaryDesc(moment.unix(ctime), moment.unix(itemData.serviceTime), 1);
            formatData.createTimeNoLink = finalTime;
            formatData.createTime = '<a href="#stream/showfeed/=/id-' + formatData.feedID + '" class="f-date"> ' + finalTime + '</a>';
            formatData.nolinkcreateTime = finalTime; //没有超链接的创建时间
            /* 内容拼接 */
            var feedText = pinLink(itemData.feedContent, itemData);

            formatData.feedText = feedText;
            formatData.pendfeedText = feedText;
            /* 正文格式化 */
            formatData.feedFormatContent = formatFeedContent(300, itemData);


            /* 回复的记录数字 */
            var fnReplyNum = itemData.replyCount;
            if (fnReplyNum == 0) {
                fnReplyNum = '';
            } else {
                fnReplyNum = '(<span class="num">' + fnReplyNum + '</span>)';
            }


            /* 列表功能区按钮 */
            var fnDelete = '<a href="javascript:void(0);" class="aj-delete aj-feed-fn-com-btn">删除</a>',
                    fnUnplaceonfile = '<a href="javascript:void(0);" class="aj-unplaceonfile aj-feed-fn-com-btn">取消归档</a>',
                    fnUnattention = '<a href="javascript:void(0);" class="aj-unattention follow-action-h aj-feed-fn-com-btn">取消关注</a>',
                    fnPending = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-pending aj-feed-fn-com-btn">待办</a></div>',
                    fnReply = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-Reply aj-feed-fn-com-btn"> 回复' + fnReplyNum + '</a></div>',
                    fnReplyRc = '<div class="fl-fn-btn"><a href="javascript:void(0);" class="aj-Reply aj-feed-fn-com-btn"> 同事回复' + fnReplyNum + '</a></div>';
            formatData.fnReplyPre = '<div class="fl-fn-btn"><a href="javascript:void(0);" class="aj-replytext aj-feed-fn-com-btn"> 回复' + fnReplyNum + '</a></div>'; //没有竖线的回复
            formatData.fnDeleteW = ""; //删除
            formatData.fnUnplaceonfileW = ""; //取消归档
            formatData.fnApprovalW = ""; //批复
            formatData.fnPendingW = fnPending; //待办
            formatData.fnCommentonW = ""; //点评
            formatData.fnCcW = ""; //抄送
            formatData.fnModifyapprovalW = ""; //修改审批人
            formatData.fnWorkingReW = ""; //指令中回复
            formatData.fnWorkSendW = ""; //指令的回复
            formatData.fnReplyW = fnReply; //回复
            formatData.fnReplyRcW = fnReplyRc; //回复
            /* 显示删除按钮 */
            if ((currentUserData.id == formatData.employeeID) && itemData.canDelete) {
                formatData.fnDeleteW = fnDelete;
            }
            /* 控制取消关注的显示 */
            if (itemData.isFollowed) {
                formatData.fnUnattentionW = fnUnattention;
            } else {
                formatData.fnUnattentionW = '<a href="javascript:void(0);" class="aj-attention follow-action-h aj-feed-fn-com-btn">关注</a>';
            }
            /* 控制取消归档的显示 */
            if (itemData.isArchived) {
                formatData.fnUnplaceonfileW = fnUnplaceonfile;
            } else {
                formatData.fnUnplaceonfileW = '<a class="aj-placeonfile aj-feed-fn-com-btn" href="javascript:;">归档</a>';
            }
            /**
             * 录音
             */
            var showAudio = function() {
                var audio = itemData.audio;
                var attachSize;
                var attachPath;
                if (audio) {
                    attachPath = audio.attachPath;
                    attachPath = util.getFileNamePath(attachPath) + '.mp3';
                    attachPath = util.getDfLink(attachPath, '', false, '');
                    attachSize = audio.attachSize;
                    if (attachSize > 360) { //大于某值提示错误
                        attachSize = '值错';
                    } else {
                        if (attachSize > 60 && attachSize < 360) {
                            attachSize = parseInt(attachSize / 60.0) + ':' + parseInt((parseFloat(attachSize / 60.0) -
                                    parseInt(attachSize / 60.0)) * 60);
                        } else {
                            attachSize = '00:' + parseInt(attachSize);
                        }
                    }


                    formatData.audioBtn = '<div class="aj-feed-fn-com-btn feed-audio-open-btn audio-btn">(' + attachSize + ')</div>';
                    formatData.attachPath = attachPath;
                    formatData.audioWarp = ' <div class="audio-warp"> <div class="aj-feed-fn-com-btn feed-audio-close-btn audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div class="audio-box"></div> </div>';
                }
                else {
                    formatData.audioBtn = '';
                    formatData.attachPath = '';
                    formatData.audioWarp = '';
                }
            };
            showAudio();

            /*formatData.audioWarp = ' <div class="audio-warp"> <div class="audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div><audio src="' + FS.BASE_PATH + '/html/fs/data/wav2mp3.mp3" controls="true" ></div> </div>';*/

            /* 定位信息 */
            formatData.feedLocationStr = '';
            var feedLocation = itemData.feedLocation;
            var feedLocationStr = '';
            var feedLocationTextStr = '';
            var country = '';
            var province = '';
            var city = '';
            var district = '';
            var street = '';
            var streetNumber = '';
            var isTokenChengedStr = '';
            var isTokenChenged;
            if (feedLocation) {
                isTokenChenged = feedLocation.isTokenChenged;
                country = feedLocation.country;
                province = feedLocation.province;
                city = feedLocation.city;
                district = feedLocation.district;
                street = feedLocation.street;
                streetNumber = feedLocation.streetNumber;
                feedLocationTextStr = country + province + city + district + street + streetNumber;
                if (isTokenChenged) {
                    isTokenChengedStr = '<img src="../../html/fs/assets/images/location_istokenchenged.png" class="istokenchenged-ico" title="该用户本次签到所用设备与上次不同"> ';
                }
                feedLocationStr = '<div class="feed-location"><img src="../../html/fs/assets/images/feedlocation_ico.gif" alt=""/ class="feed-location-ico"><span class="feed-location-text">' + feedLocationTextStr + '</span><span class="feed-location-fn"><a href="#" class="feed-location-fn-map">显示地图</a> | <a href="javascript: void(0);" class="aj-feed-fn-com-btn feed-location-fn-equipment">查看设备</a></span>' + isTokenChengedStr + '</div>';
                // feedLocationStr = '<div class="feed-location"><img src="../../html/fs/assets/images/feedlocation_ico.gif" alt=""/ class="feed-location-ico"><span class="feed-location-text">' + feedLocationTextStr + '</span><span class="feed-location-fn"><a href="">显示地图</a> | 查看设备</span></div>';

                formatData.feedLocationStr = feedLocationStr;
                formatData.feedLocation = feedLocation;
            }

            return formatData;
        },
        "share": function(itemData, data) { //分享
            var formatData = {};

            /* 公告 */
            var announcement = itemData.announcement;
            var announcetitStr = '';
            var isShow;
            formatData.deletegg = '';
            // formatData.fnDeleteW = '';
            if (announcement) {
                announcetitStr = announcement.title;
                isShow = announcement.isShow;
                /* 显示不显示 */
                if (isShow) {
                    formatData.isShowText = '不显示';
                } else {
                    formatData.isShowText = '显示';
                }
                /* 显示删除按钮 */
                if (_.some(currentUserData.functionPermissions, function(permission) {
                    return permission.value == 1; //权限1表示可以发公告,公告管理员
                })) {
                    if (announcement.canDelete) {
                        formatData.deletegg = '<a class="aj-delete" href="javascript:void(0);">删除</a><i class="S_txt3">|</i>';
                        formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete">删除</a>';
                    }
                }
                formatData.announcetit = announcetitStr;
            } else {
                formatData.announcetit = '';
            }

            /* 投票 */
            var voteItem = itemData.voteItem,
                    votedownurl = '',
                    count = "";
            if (voteItem) {
                count = voteItem.voteEmpCount;
                formatData.votecount = count;
                votedownurl = FS.API_PATH + '/df/GetVoteResultExcel?feedID=' + itemData.feedID; //下载投票的链接地址
                formatData.votedownurl = votedownurl;
            } else {
                formatData.votecount = "";
                formatData.votedownurl = "";
            }
            /* 日程 */
            formatData.schedule = itemData.schedule;
            var schedules = itemData.schedule,
                    senderId = itemData.sender.employeeID, //发出人
                    currentUserId = util.getContactData()["u"].id; //我自己
            var ctime, smsRemindType, relateEmployees, rElength, smsRemindTypeText, schedulesEmployeesNames = '',
                    schedulesDescription;
            var serviceTime = itemData.serviceTime,
                    yearTime, yearTimeService;
            if (!schedules) {
                formatData.startTime = "错误了";
            } else {
                /* 日程范围 */
                if (schedules.relateEmployees) {
                    relateEmployees = schedules.relateEmployees;
                    rElength = relateEmployees.length;
                    _.each(relateEmployees, function(schedulesEmployees) {
                        var employeeID = schedulesEmployees.employeeID,
                                employeeName = schedulesEmployees.name,
                                profileImage = schedulesEmployees.profileImage;
                        schedulesEmployeesNames += employeeName + '，';
                        //替换范围显示文字
                        /*if (rElength == 1) {
                         schedulesDescription = schedulesEmployeesNames.substr(0, schedulesEmployeesNames.length - 1); //删掉末尾的逗号
                         if (employeeID == currentUserId) {
                         schedulesDescription = "个人日程";
                         }
                         } else {
                         schedulesDescription = '参与者共' + rElength + '人';
                         }*/

                        schedulesDescription = itemData.feedRangeDescription;

                    });
                    schedulesEmployeesNames = schedulesEmployeesNames.substr(0, schedulesEmployeesNames.length - 1); //删掉末尾的逗号
                    schedulesEmployeesNames = '';
                    formatData.feedRangeDescription = '<span>-</span> <span class="schedulesgroup"> <a href="javascript:void(0);" title="' + schedulesEmployeesNames + '"> ' + schedulesDescription + ' </a> </span>';
                }
                yearTime = moment.unix(schedules.startTime).format('YYYY');
                yearTimeService = moment.unix(serviceTime).format('YYYY');

                if (yearTime == yearTimeService) { //如果是今年就不显示年了
                    ctime = moment.unix(schedules.startTime).format('MMMDD日 (dddd) HH:mm');
                    // ctime = moment.unix(schedules.startTime).format('HH:mm');
                } else {
                    ctime = moment.unix(schedules.startTime).format('YYYY年MMMDD日 (dddd) HH:mm');
                }

                smsRemindTypeText = util.getSmsRemindTypeName(schedules.smsRemindType);
                if (senderId == currentUserId) {
                    formatData.voteico = "voteico.gif";
                    formatData.voteSenderInfo = '';
                } else {
                    formatData.voteico = "voteico_blue.gif";
                    formatData.voteSenderInfo = '<div class="from">该日程由<a href="#profile/=/empid-' + itemData.sender.employeeID + '">' + itemData.sender.name + '</a>为您创建。</div>';
                }
                formatData.startTime = ctime;
                formatData.smsRemindTypeText = smsRemindTypeText;

            }
            /* 短信提醒信息 */
            var smsRemaindCount = itemData.smsRemaindCount,
                    readCount = itemData.readCount;
            if (smsRemaindCount == 0) {
                formatData.smsRemaind = "";
            } else {
                formatData.smsRemaind = ' <a href="#" class="msmremaindcount alertlistbtn">短信提醒' + smsRemaindCount + '人</a>';
            }
            /* 回执信息 */
            var receipt = itemData.receipt;
            var requireReceiptCount = 0;
            var receiptedCount = 0;
            var myReceiptStatus = 0;
            var isSendSms = false;
            var receiptFnStr = '';
            var isSendSmsStr = '';
            formatData.receiptfn = ''; //回执的功能按钮
            formatData.receiptRemaind = ''; //回执的提醒信息

            if (receipt) {
                requireReceiptCount = receipt.requireReceiptCount; //需回执人数
                receiptedCount = receipt.receiptedCount; //已回执人数
                myReceiptStatus = receipt.myReceiptStatus; //回执状态
                isSendSms = receipt.isSendSms; //是否发短信


                if (myReceiptStatus == 1) {
                    formatData.receiptfn = '<div class="receiptfnBtnwarp"><a href="javascript:void(0);" class="aj-receipt-fn">回执</a><i class="S_txt3">|</i></div>';
                } else if (myReceiptStatus == 2) {
                    formatData.receiptfn = '<div class="receiptfnBtnwarp"><a href="javascript:void(0);" class="disable"><img src="../../html/fs/assets/images/receipted.gif" alt="" class="vm">已回执</a><i class="S_txt3">|</i></div>';
                }
                if (isSendSms) {
                    isSendSmsStr = '已发短信，';

                }
                formatData.receiptRemaind = ' <div class="receiptfnwarp"><a href="#" class="receiptalertlist alertlistbtn">需要' + requireReceiptCount + '人回执，' + isSendSmsStr + '已回执' + receiptedCount + '人</a></div>';
                formatData.receiptedCount = receiptedCount;   //回执人数
            }
            return formatData;
        },
        "plan": function(itemData, data) { //日志

            var formatData = {};
            var otherWork = pinLink(itemData.feedContent, itemData), //心得体会
                    todayWork = pinLink(itemData.plan.reportContent, itemData), //今日工作总结
                    tomorrowWork = pinLink(itemData.plan.planContent, itemData), //明日工作计划
                    commonername = '',
                    commonerid,
                    allWork = "";
            /* 回复的记录数字 */
            var fnReplyNum = itemData.replyCount;
            if (fnReplyNum == 0) {
                fnReplyNum = '';
            } else {
                fnReplyNum = '(<span class="num">' + fnReplyNum + '</span>)';
            }

            var fnCommenton = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-commenton">点评' + fnReplyNum + '</a></div>';
            formatData.feedID = itemData.feedID;
            /* 显示删除按钮 */
            /*if ((currentUserData.id==data.employeeID)&&itemData.canDelete) {
             formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete">删除</a>';
             }
             */
            /* 所有的工作内容 */

            switch (itemData.plan.planType) {
                case 0:
                    allWork = 'planType为0';
                    break;
                case 1:
                    allWork = '<p class="work-tit">今日工作总结</p><p>' + todayWork + '</p><p>&nbsp;</p><p class="work-tit">明日工作计划</p><p>' + tomorrowWork + '</p><p>&nbsp;</p><p class="work-tit">工作心得体会</p><p>' + otherWork + '</p>';

                    break;
                case 2:
                    allWork = '<p class="work-tit">本周工作总结</p><p>' + todayWork + '</p><p>&nbsp;</p><p class="work-tit">本周工作计划</p><p>' + tomorrowWork + '</p><p>&nbsp;</p><p class="work-tit">工作心得体会</p><p>' + otherWork + '</p>';
                    break;
                case 3:
                    allWork = '<p class="work-tit">本月工作总结</p><p>' + todayWork + '</p><p>&nbsp;</p><p class="work-tit">本月工作计划</p><p>' + tomorrowWork + '</p><p>&nbsp;</p><p class="work-tit">工作心得体会</p><p>' + otherWork + '</p>';

                    break;
            }

            formatData.pendfeedText = otherWork + ' ' + todayWork + ' ' + tomorrowWork;
            formatData.feedText = allWork;
            if (itemData.plan.isComment) {
                formatData.leaderinfo = '';
                formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">已点评</a></span>';
            } else {
                if (itemData.plan.leader) {
                    commonername = itemData.plan.leader.name,
                            commonerid = itemData.plan.leader.employeeID,
                            commonername = '<a class="employee-name" href="#profile/=/empid-' + commonerid + '">' + commonername + '</a>';
                    formatData.leaderinfo = '<div class="plan-leader"><a class="employee-name" href="#profile/=/empid-' + commonerid + '"><img src = "' + util.getAvatarLink(itemData.plan.leader.profileImage, '3') + '" / ></a>该日志由' + commonername + '点评。</div>';
                } else {
                    formatData.leaderinfo = '';
                }

                formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">未点评</a></span>';
                formatData.replyContent = "";
            }
            ;
            /* 已点评 星级*/
            var starNum = itemData.plan.rate;
            var starTitleInfo = '';

            if (starNum > 0) {
                switch (starNum) {
                    case 1:
                        starTitleInfo = '一分：严重批评';
                        break;
                    case 2:
                        starTitleInfo = '二分：不合格';
                        break;
                    case 3:
                        starTitleInfo = '三分：符合要求';
                        break;
                    case 4:
                        starTitleInfo = '四分：超过预期';
                        break;
                    case 5:
                        starTitleInfo = '五分：非常满意';
                        break;
                }
                formatData.fiveStar = '<div class="five-star num' + starNum + '" title="' + starTitleInfo + '"></div>';
            } else {
                formatData.fiveStar = '';
            }

            /*= 回复-上部(日志关键回复) =*/
            var replies = itemData.replies,
                    replyContentList = '',
                    senderName = '',
                    RCTime = '',
                    senderId = '',
                    profileImage = '',
                    replycontText = '',
                    operationText = '1',
                    sourceText = '',
                    replyconterText = '以下为日志点评人的点评';
            var feedFormatContents = [];
            if (replies.length > 0) { //显示领导点评
                _.each(replies, function(replayItemT, index) {
                    //判断客户端来源
                    operationText = util.getWorkOperationTypeName(replayItemT.operationType);
                    if (replayItemT.source == 1) {
                        sourceText = '';
                    } else {
                        sourceText = '，来自' + util.getSourceNameFromCode(replayItemT.source);
                    }
                    //时间处理
                    RCTime = util.getDateSummaryDesc(moment.unix(replayItemT.createTime), moment.unix(itemData.serviceTime), 1);

                    /* 正文格式化 */
                    var feedFormatContent = formatFeedContent(300, replayItemT);
                    var feedFormatContentOpenBtn = '';
                    var contentEllipsis = '';
                    replycontText = feedFormatContent.summaryHtml; //截取过的正文
                    feedFormatContents.push(feedFormatContent); // 把截取后的正文保存到数组

                    //添加展开收起按钮
                    if (feedFormatContent.leftHtml.length > 0) {
                        contentEllipsis = '<span class="feed-content-ellipsis">&#8230;</span>';
                        feedFormatContentOpenBtn = '<br/><br/><a href="javascript:;" class="feed-topreply-content-visible-h" data-index="' + index + '"> 展开正文，（共' + feedFormatContent.feedWordNum + '个字）</a>';
                    }

                    //判断人名是不是我
                    if (replayItemT.sender) {
                        profileImage = replayItemT.sender.profileImage;
                        senderName = replayItemT.sender.name;
                        senderId = replayItemT.sender.employeeID;
                        if (currentUserData.name == senderName) {
                            senderName = '我';
                        }
                        /* 人名加链接 */
                        senderName = '<a href="#profile/=/empid-' + senderId + '"> ' + senderName + '</a>';
                    } else {
                        profileImage = "";
                        senderName = "";
                    }
                  
                    replyContentList += '<dl class="comment-list fn-clear"><dt><a class="master-reply-face-l" href="javascript:void(0);"><a href="#profile/=/empid-' + senderId + '"><img src = "' + util.getAvatarLink(profileImage, '3') + '" / ></a></a></dt><dd><a href="#">' + senderName + '</a>： <span class="feed-topreply-summary-text">' + replycontText + '</span>' + contentEllipsis + '(' + RCTime + '，点评' + sourceText + ')' + feedFormatContentOpenBtn + '</dd></dl>';
                });
                formatData.feedFormatContents = feedFormatContents; //截取后的正文的数组
                formatData.replyContent = '<div class="reply-content"><div class="RC-arrow"><em class="S_line1_c">◆</em><span>◆</span></div><div class="RC-tit">' + replyconterText + '</div><div class="RC-feed">' + replyContentList + '</div></div>';

            } else {
                formatData.replyContent = "";
            }


            /* 功能按钮 */
            if (itemData.plan.canComment) {
                formatData.fnCommentonW = fnCommenton; //点评
                formatData.fnReplyW = '';
            } else {
                formatData.fnCommentonW = "";
            }
            formatData.planType = itemData.plan.planType;
            return formatData;
        },
        "work": function(itemData, data) { //指令
            var formatData = {},
                    smsRemindTime2,
                    smsRemindTime3;
            formatData.feedID = itemData.feedID;
            formatData.canCancel = itemData.canCancel;
            var fnWorkingRe = '<i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-working aj-feed-fn-com-btn">w回复1</a>',
                    fnWorkSend = '<i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-sendwork aj-feed-fn-com-btn">w回复2</a>';

            /* 已点评 星级*/
            var starNum = itemData.work.rate;
            if (starNum > 0) {
                formatData.fiveStar = '<div class="five-star num' + starNum + '"></div>';
            } else {
                formatData.fiveStar = '';
            }

            /* 短信提醒几次 */
            var smsRemindInfo = "不提醒";
            switch (itemData.work.smsRemindType) {
                case 1:
                    smsRemindInfo = "";
                    break;
                case 2:
                    smsRemindInfo = "短信提醒一次";
                    break;
                case 3:
                    smsRemindInfo = "短信提醒两次";
                    break;
                case 4:
                    smsRemindInfo = "短信提醒三次";
                    break;
            }
            var smsRemindTime1 = '第一次短信提醒：' + moment.unix(itemData.work.smsRemindTime1).format('MMMDD日 HH:mm') + '&#10;';

            if (itemData.work.smsRemindTime2) {
                smsRemindTime2 = '第二次短信提醒：' + moment.unix(itemData.work.smsRemindTime2).format('MMMDD日 HH:mm') + '&#10;';
            } else {
                smsRemindTime2 = "";
            }
            if (itemData.work.smsRemindTime3) {
                smsRemindTime3 = '第三次短信提醒：' + moment.unix(itemData.work.smsRemindTime3).format('MMMDD日 HH:mm');
            } else {
                smsRemindTime3 = "";
            }

            var RemindTime = smsRemindTime1 + smsRemindTime2 + smsRemindTime3,
                    feedStatusDescription = util.getWorkStatusName(itemData.work.status);

            if (itemData.work.isComment) {
                feedStatusDescription = "已点评";
            }

            if (itemData.work.smsRemindType > 1) {
                formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">' + feedStatusDescription + '</a></span><span>-</span><span class="con"><a href="javascript:void(0);" title="' + RemindTime + '">' + smsRemindInfo + '</a></span>';
            } else {
                formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">' + feedStatusDescription + '</a></span>';
            }

            /* 指令执行人 */
            // var workDeadLine = moment.unix(itemData.work.deadline).format('MMMDD日 HH:mm'),
            //var workDeadLine = moment.unix(itemData.work.deadline).add('days', 1).calendar(),
            // workEndTime = moment.unix(itemData.work.endTime).format('MMMDD日 HH:mm'),
            var workDeadLine = util.getDateSummaryDesc(moment.unix(itemData.work.deadline), moment.unix(itemData.serviceTime), 2),
                    workEndTime = util.getDateSummaryDesc(moment.unix(itemData.work.endTime), moment.unix(itemData.serviceTime), 2),
                    workEndTimeText = "";
            var executername = itemData.work.executer.name,
                    myId = util.getContactData()["u"].id,
                    executerid = itemData.work.executer.employeeID;
            executername = '<a class="employee-name" href="#profile/=/empid-' + executerid + '">' + executername + '</a>';

            if (myId == executerid) { //判断我是不是执行人
                formatData.executer = "1";
            } else {
                formatData.executer = "0";
            }

            /**
             * 判断指令状态通过status
             * 执行中：1；
             * 已完成：2；
             * 已取消：3
             */
            switch (itemData.work.status) {
                case 1:
                    if (itemData.work.deadline < itemData.serviceTime) {
                        workEndTimeText = '应于' + workDeadLine + '前完成，<span class="highlight">该指令已超时。</span>';
                    } else {
                        workEndTimeText = '应于' + workDeadLine + '前完成，该指令正在执行。';
                    }
                    break;
                case 2:
                    workEndTimeText = '该指令已于' + workEndTime + '完成。';
                    break;
                case 3:
                    workEndTimeText = '已于' + workEndTime + '取消。';
                    break;
            }

            formatData.leaderinfo = '<div class="plan-leader"><a class="employee-name" href="#profile/=/empid-' + executerid + '"><img src = "' + util.getAvatarLink(itemData.work.executer.profileImage, '3') + '" / ></a>该指令由' + executername + '执行，' + workEndTimeText + '</div>';

            /*= 回复-上部(指令关键回复) =*/

            var replies = itemData.replies,
                    replyContentList = '',
                    senderName = '',
                    RCTime = '',
                    senderId = '',
                    profileImage = '',
                    replycontText = '',
                    sourceText = '',
                    operationText = '1',
                    replyconterText = '以下为指令关键节点的回复：';


            if (replies.length > 0) { //显示领导点评
                var feedFormatContents = [];
                _.each(replies, function(replayItemT, index) {
                    operationText = util.getWorkOperationTypeName(replayItemT.operationType);

                    if (replayItemT.source == 1) {
                        sourceText = '';
                    } else {
                        sourceText = '，来自' + util.getSourceNameFromCode(replayItemT.source);
                    }
                    //RCTime = moment.unix(replayItemT.createTime).from(moment.unix(itemData.serviceTime));
                    RCTime = util.getDateSummaryDesc(moment.unix(replayItemT.createTime), moment.unix(itemData.serviceTime), 1);
                    // replycontText = pinLink(replayItemT.replyContent, itemData);//拼正文

                    /**
                     * 正文格式化
                     */
                    var feedFormatContent = formatFeedContent(300, replayItemT);
                    var feedFormatContentOpenBtn = '';
                    var contentEllipsis = '';
                    replycontText = feedFormatContent.summaryHtml; //截取过的正文
                    feedFormatContents.push(feedFormatContent); // 把截取后的正文保存到数组
                    /**
                     * 添加展开收起按钮
                     */
                    if (feedFormatContent.leftHtml.length > 0) {
                        contentEllipsis = '<span class="feed-content-ellipsis">&#8230;</span>';
                        feedFormatContentOpenBtn = '<br/><br/><a href="javascript:;" class="feed-topreply-content-visible-h" data-index="' + index + '"> 展开正文，（共' + feedFormatContent.feedWordNum + '个字）</a>';
                    }

                    if (replayItemT.sender) {
                        profileImage = replayItemT.sender.profileImage;
                        senderName = replayItemT.sender.name;
                        if (currentUserData.name == senderName) {
                            senderName = '我';
                        }
                        senderId = replayItemT.sender.employeeID;
                        /* 人名加链接 */
                        senderName = '<a href="#profile/=/empid-' + senderId + '"> ' + senderName + '</a>';
                    } else {
                        profileImage = "";
                        senderName = "";
                    }

                    /**
                     * 关键回复查看附件功能需要的数据
                     */
                    var files = replayItemT.files; //附件
                    var pictures = replayItemT.pictures; //图片
                    var filesStr = formatFiles(files).feedFiles; //拼附件
                    var picturesStr = formatPics(pictures).feedPic; //拼图片
                    var openFileBtn = '';
                    var imgorfileHtml = '';
                    var imgorfileWarpHtml = '';

                    if ((files.length > 0) || (pictures.length > 0)) {
                        openFileBtn = '<div class="open-replies-imgorfile aj-feed-fn-com-btn"><a href="javascript:;">查看附件</a></div>';
                        imgorfileHtml = picturesStr + filesStr;
                        imgorfileWarpHtml = '<div class="replies-imgorfile-warp">' + openFileBtn + '<div class="replies-imgorfile"><div class="item-media">' + imgorfileHtml + '</div></div></div>';
                    } else {
                        imgorfileWarpHtml = '';
                    }
//                    imgorfileWarpHtml = '<div class="replies-imgorfile-warp"><div class="open-replies-imgorfile aj-feed-fn-com-btn" style="display: none;"><a href="javascript:;">查看附件</a></div><div class="replies-imgorfile" style="display: block;"><div class="item-media"><div class="feedpics-bor feed-img"><div class="fpt-group"><div style="position: absolute;" class="img-warp"><table><tbody><tr><td valign="middle" align="center"><img alt="" src="http://localhost/Coop.HtmlHost/H/df/get?id=201311_04_26f30619-c174-47be-aeff-e1d2447b19183.jpg"></td></tr></tbody></table></div></div></div><p class="pic-num">图集(共3张)</p></div></div></div>'; //手写测试数据
                    /**
                     * 录音
                     */
                    var audio = replayItemT.audio;
                    var attachSize;
                    var attachPath;
                    var audioEl;
                    var audioBtn;
                    var audioWarp;
                    if (audio) {
                        attachPath = util.getFileNamePath(audio.attachPath) + '.mp3';
                        attachPath = util.getDfLink(attachPath, '', false, '');
                        attachSize = audio.attachSize;
                        if (attachSize > 360) { //大于某值提示错误
                            attachSize = '值错';
                        } else {
                            if (attachSize > 60 && attachSize < 360) {
                                attachSize = parseInt(attachSize / 60.0) + ':' + parseInt((parseFloat(attachSize / 60.0) -
                                        parseInt(attachSize / 60.0)) * 60);
                            } else {
                                attachSize = '00:' + parseInt(attachSize);
                            }
                        }


                        audioBtn = '<div class="aj-feed-fn-com-btn feed-audio-open-btn important-reply-audio replies audio-btn" data-attachpath="' + attachPath + '" data-attachsize="' + audio.attachSize + '">(' + attachSize + ')</div>';
                        audioWarp = ' <div class="audio-warp"> <div class="aj-feed-fn-com-btn feed-audio-close-btn important-reply-audio audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div class="audio-box"></div> </div>';
                        audioEl = '<div class="audio-el">' + audioBtn + audioWarp + '</div>';
                    }
                    else {
                        audioEl = '';
                    }
//                    audioEl = '<div class="audio-el"><div class="aj-feed-fn-com-btn feed-audio-open-btn important-reply-audio replies audio-btn" data-attachpath="" data-attachsize="">(' + 1 + ')</div></div>';//手写测试数据


                    replyContentList += '<dl class="comment-list fn-clear"><dt><a class="master-reply-face-l" href="#profile/=/empid-' + senderId + '"><img src = "' + util.getAvatarLink(profileImage, '3') + '" / ></a></dt><dd><a href="#">' + senderName + '</a>：<span class="feed-topreply-summary-text">' + replycontText + '</span>' + contentEllipsis + ' (' + RCTime + '，' + operationText + sourceText + ')' + feedFormatContentOpenBtn + '</dd></dl>' + audioEl + imgorfileWarpHtml;
                });
                formatData.feedFormatContents = feedFormatContents; //截取后的正文的数组

                formatData.replyContent = '<div class="reply-content"><div class="RC-arrow"><em class="S_line1_c">◆</em><span>◆</span></div><div class="RC-tit">' + replyconterText + '</div><div class="RC-feed">' + replyContentList + '</div></div>';
            } else {
                formatData.replyContent = "";
            }

            /* 显示删除按钮 */
            // if ((currentUserData.id == itemData.work.assignerID) || itemData.work.canCancel) {}
            if (itemData.work.canCancel) {
                formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete">取消</a>';
            }
            return formatData;
        },
        "approve": function(itemData, data) { //审批

            var formatData = {};
            var replyCount = itemData.replyCount || ''; //回复数量
            formatData.feedID = itemData.feedID;
            formatData.canCancel = itemData.canCancel;

            myId = util.getContactData()["u"].id;
            var fnApproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-approval aj-feed-fn-com-btn">批复</a></div>',
                    fnCc = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-cc aj-feed-fn-com-btn">抄送</a></div>',
                    fnPending = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-pending aj-feed-fn-com-btn">待办</a></div>',
                    fnModifyapproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i><a href="javascript:void(0);" class="aj-modifyapproval aj-feed-fn-com-btn">修改审批人</a></div>';
            var morePending = '<a href="javascript:void(0);" class="aj-pending aj-feed-fn-com-btn">待办</a>';
            var feedStatusDescription = util.getApproveStatusName(itemData.approve.status);
            if (replyCount > 0) {
                fnApproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-approval aj-feed-fn-com-btn">批复(' + replyCount + ')</a></div>';
            }
            if (itemData.approve) {
                /* 显示取消按钮 */
                if ((currentUserData.id == itemData.approve.senderID) && itemData.approve.canCancel) {
                    formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete aj-feed-fn-com-btn">取消</a>';
                }
            }
            formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">' + feedStatusDescription + '</a></span>';

            if (itemData.approve.status == 1) {
                var approvername = itemData.approve.currentApprover.name||"",
                        approverid = itemData.approve.currentApprover.employeeID||"",
                        myId = util.getContactData()["u"].id;
                approvername = '<a class="employee-name" href="#profile/=/empid-' + approverid + '">' + approvername + '</a>'; //人名加超链接
                formatData.leaderinfo = '<div class="plan-leader"><a href="#profile/=/empid-' + approverid + '" class="employee-name"><img src = "' + util.getAvatarLink(itemData.approve.currentApprover.profileImage, '3') + '" / ></a>已提交，待<a href="#">' + approvername + '</a>审批。</div>';
            }
            if (myId == approverid) { //判断我是不是执行人
                formatData.approver = "1";
                approvername = '我';
            } else {
                formatData.approver = "0";
            }

            /*= 回复-上部(审批关键回复) =*/
            var replyContentList = '',
                    printReplyContentList = '',
                    RCTime = '',
                    operationTypeText = '',
                    profileImage = '',
                    isagreeImg = '',
                    replycontText = '',
                    sourceText = '';
            var feedFormatContents = [];
            _.each(itemData.replies, function(replayItemT, index) {
                //var RCTime = moment.unix(replayItemT.createTime).from(moment.unix(itemData.serviceTime));
                var RCTime = util.getDateSummaryDesc(moment.unix(replayItemT.createTime), moment.unix(itemData.serviceTime), 1);
                // RCTime = moment.unix(replayItemT.createTime).format('MMMDD日 HH:mm');

                /**
                 * 正文格式化
                 */
                var feedFormatContent = formatFeedContent(300, replayItemT);
                var feedFormatContentOpenBtn = '';
                var contentEllipsis = '';
                var nolinkapprovername = '';
                var replycontTextNoLink = '';
                var replycontTextAll = pinLink(replayItemT.replyContent, itemData); //未截取的全部正文
                replycontText = feedFormatContent.summaryHtml; //截取过的正文
                feedFormatContents.push(feedFormatContent); // 把截取后的正文保存到数组
                /**
                 * 添加展开收起按钮
                 */
                if (feedFormatContent.leftHtml.length > 0) {
                    contentEllipsis = '<span class="feed-content-ellipsis">&#8230;</span>';
                    feedFormatContentOpenBtn = '<br/><br/><a href="javascript:;" class="feed-topreply-content-visible-h" data-index="' + index + '"> 展开正文，（共' + feedFormatContent.feedWordNum + '个字）</a>';
                }




                // 同意不同意图标 
                (function() {
                    switch (replayItemT.operationType) {
                        case 1:
                            operationTypeText = "同意";

                            isagreeImg = '<img src="../../html/fs/assets/images/agree.gif" alt="" class="approve-isagree">';
                            break;
                        case 2:
                            operationTypeText = "不同意";
                            isagreeImg = '<img src="../../html/fs/assets/images/unagree.gif" alt="" class="approve-isagree">';
                            break;
                        case 3:
                            operationTypeText = "设置为已取消";
                            isagreeImg = "";
                            break;
                    }
                })();

                // 来源
                (function() {
                    if (replayItemT.source == 1) {
                        sourceText = '';
                    } else {
                        sourceText = '，来自' + util.getSourceNameFromCode(replayItemT.source);
                    }

                    if (replayItemT.sender) {
                        approverid = replayItemT.sender.employeeID;
                        if (myId == approverid) { //判断我是不是执行人
                            approvername = '我';
                        } else {
                            approvername = replayItemT.sender.name;
                        }

                        profileImage = replayItemT.sender.profileImage;
                        //nolinkapprovername = approvername;
                        nolinkapprovername = replayItemT.sender.name;   //打印模式直接显示名字
                        approvername = '<a href="#profile/=/empid-' + approverid + '"> ' + approvername + '</a>';

                    } else {
                        approvername = "";
                        approverid = "";
                        profileImage = "";
                    }
                })();


                replycontTextNoLink = flutil.delStrLink(replycontTextAll); //把正文里面的超链接去掉，因为打印窗口里面不需要超链接
                replyContentList += '<dl class="comment-list fn-clear isappr"><dt>' + isagreeImg + '<a class="master-reply-face-l" href="#profile/=/empid-' + approverid + '"><img src = "' + util.getAvatarLink(profileImage, '3') + '" / ></a></dt><dd>' + approvername + '：<span class="feed-topreply-summary-text">' + replycontText + '</span>' + contentEllipsis + ' (' + RCTime + '，' + operationTypeText + sourceText + ')' + feedFormatContentOpenBtn + '</dd></dl>';

                printReplyContentList += '<dl class="comment-list fn-clear isappr-print"><dt>' + isagreeImg + '</dt><dd><span class="print-approvername">' + nolinkapprovername + '</span>：' + replycontTextNoLink + ' (' + RCTime + '，' + operationTypeText + sourceText + ')</dd></dl>';

            });
            formatData.feedFormatContents = feedFormatContents; //截取后的正文的数组

            if (replyContentList == "") {
                formatData.replyContent = "";
                formatData.printReplyContent = "";
            } else {
                formatData.replyContent = '<div class="reply-content"><div class="RC-arrow"><em class="S_line1_c">◆</em><span>◆</span></div><div class="RC-tit">以下为审批人的批复意见</div><div class="RC-feed">' + replyContentList + '</div></div>';
                formatData.printReplyContent = '<div class="reply-content"><div class="RC-arrow"><em class="S_line1_c">◆</em><span>◆</span></div><div class="RC-feed">' + printReplyContentList + '</div></div>';
            }

            formatData.fnCcW = ""; //抄送
            formatData.fnModifyapprovalW = ""; //修改审批人
            formatData.fnApprovalW = ""; //批复
            formatData.fnPendingW = fnPending; //待办
            formatData.morePendingW = ''; //更多里面的待办

            /* 功能按钮 */

            if (itemData.approve.canApprove) { //是否可以批复
                formatData.fnApprovalW = fnApproval; //批复
                formatData.fnReplyW = ''; //回复

            }
            if (itemData.approve.canAddAtEmployees) { //是否可以抄送
                formatData.fnCcW = fnCc; //抄送
                formatData.fnPendingW = ""; //待办
                formatData.morePendingW = morePending; //更多里面的待办
            }
            if (itemData.approve.canChangeApprover) { //是否可以修改审批人
                formatData.fnModifyapprovalW = fnModifyapproval; //修改审批人
                formatData.fnPendingW = ""; //待办
                if (itemData.approve.currentApproverID == 0) { //修改审批人还是转审批人
                    formatData.fnModifyapprovalW = '<div class="fl-fn-btn"><i class="S_txt3">|</i><a href="javascript:void(0);" class="aj-modifyapproval aj-feed-fn-com-btn">转审批人</a></div>'; //转审批人
                }
            }

            /**
             * 打印模板需要的处理数据们
             */
            (function() {
                formatData.printSendername = '<span class="print-sendername">' + itemData.sender.name + '</span>' || '';
                formatData.printPictures = '';
                formatData.printFiles = '';
                formatData.printText = '';
                //文本
                _.each(itemData.feedContent, function(text) {
                    formatData.printText += text.text;
                });
                formatData.printText = formatData.printText.replace(/[\n|\r]/g, '<br/>');//把/n变成br
                //图片
                _.each(itemData.pictures, function(picture) {
                    formatData.printPictures += '<div class="print-img-item"><span class="print-img-warp"><img src="' + FS.API_PATH + '/df/get?id=' + picture.attachPath + '1.jpg" class="print-pictures"/><img src="../../html/fs/assets/images/print-del-pic-ico.gif" title="不打印该图" class="print-del-pic-ico aj-feed-fn-com-btn" /></span></div>';
                });
                //附件
                var printFilesNum = 1;
                _.each(itemData.files, function(file) {
                    formatData.printFiles += '<div class="print-feedfile">附件' + printFilesNum + '：' + file.attachName + ' (' + util.getFileSize(file.attachSize) + ')</div>';
                    printFilesNum++;
                });
                formatData.printCTime = moment.unix(itemData.createTime).format('YYYY年MMMDD日 HH:mm'); //审批打印时显示的发出时间
            })();

            return formatData;
        }

    }
    ;

    /**
     * 格式化返回数据
     * @param itemData
     * @returns {*}
     */

    function formatData(itemData) {
        var data = {};
        data = _.extend(data, formator["common"](itemData));
        var feedType = parseInt(itemData.feedType);
        // feedType 分享:1,日志:2,指令:3,审批:4
        switch (feedType) {
            case 101: //互动 （已废弃）
            case 1001: //客户轨迹 （已废弃）
            case 1: //分享
                data = _.extend(data, formator["share"](itemData, data));
                break;
            case 2: //日志
                data = _.extend(data, formator["plan"](itemData, data));
                break;
            case 3: //指令
                data = _.extend(data, formator["work"](itemData, data));
                break;
            case 4: //审批
                data = _.extend(data, formator["approve"](itemData, data));
                break;
            default:
                break;
        }
        data.originData = itemData;
        data.feedType = feedType;
        return data;
    }


    var ListC = Backbone.Collection.extend({
        model: listViewM.itemM,
        url: '/Feed/GetFeeds',
        //parseCb:FS.EMPTY_FN,    //解析回调
        // url: '/html/fs/data/feed-list.json', //假数据，仅用于测试
        sync: function(method, model, options) {
            var that = this;
            var data = options.data || {};
            options.data = _.extend({
                "circleID": 0, //部门id
                "subType": 0, //子类型
                "feedType": 0,
                "keyword": "",
                "pageSize": 30,
                "pageNumber": 2
            }, data);
            return Backbone.sync('read', model, _.extend(options, {
                "apiCb": function(responseData) {
                }
            }));
        },
        parse: function(responseData) {
            /************/
            /** 预处理 **/
            /************/
            var items,
                    formatItems = [];
            if (responseData.success) {
                items = responseData.value.items;
                _.each(items, function(itemData, i) {
                    itemData.serviceTime = responseData.serviceTime; //设置服务器端时间依据
                    formatItems[i] = formatData(itemData);
                });
            }
            return formatItems;
        }
    });
    exports.listC = ListC;
})
        ;