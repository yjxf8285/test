/**
 * 定义信息列表Collection
 *
 * 遵循seajs module规范
 * @author liuxf
 */
define(function (require, exports, module) {
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
        "common": function (itemData, crmParam) {
            var formatData = {};
            formatData.meProfileImage = currentUserData.profileImage;//我的头像图片地址
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

            /* 提醒 */
            var feedRemindStr = '<div class="fl-fn-btn feed-remind-btn"><i class="S_txt3">|</i> <div class="remind-more-menu" style="display: none;"> <a href="javascript:;" class="feed-remind-btn-item" data-value="1">1小时后提醒我</a> <a href="javascript:;" class="feed-remind-btn-item" data-value="3">3小时后提醒我</a> <a href="javascript:;" class="feed-remind-btn-item" data-value="5">5小时后提醒我</a> <a href="javascript:;" class="feed-remind-btn-item" data-value="998">自定义提醒</a> </div> <a href="javascript:;">提醒 <i class="arrow"></i></a> </div>';
            formatData.feedRemind = feedRemindStr;
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
            var hideStr = '';
            var widthNum;//动态改变父级容器的宽度，1张图片的宽度为40
            if (likeEmployees) {
                _.each(likeEmployees, function (likeEmployeesdata, n) {
                    var name = likeEmployeesdata.name;
                    var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, '2');
                    var employeeID = likeEmployeesdata.employeeID;
                    imgStr += '<a href="#profile/=/empid-' + employeeID + '" class="js-empids" title="' + name + '"><img alt="' + name + '" src="' + profileImage + '"></a>';

                });
                //人数大于5个显示更多
                if (likeEmployees.length > 5) {
                    morebtnStr = '<a href="#stream/showfeed/=/id-' + formatData.feedID + '/open-like" title="更多" class="islike-more"></a>';
                    widthNum = 200;//最大200
                } else {
                    morebtnStr = '<a href="#stream/showfeed/=/id-' + formatData.feedID + '/open-like" title="更多" class="islike-more hide"></a>';
                    widthNum = likeEmployees.length * 40;
                }

            }

            if (!isAlreadyLike) { //我没赞过
                islikeTitStr = '赞';
                islikeCurStr = 'islike';
                islikeCountStr = '';
                contentStr = '';
            }

            contentStr = '<div class="islike-tip" style="display:none;width: ' + widthNum + 'px"><div class="toparrow"> <em>◆</em> <span>◆</span> </div>' + imgStr + morebtnStr + '</div>';

            if (likeCount > 0) { //别人赞过
                islikeCountStr = '(<span class="likecountnum">' + likeCount + '</span>)';
                hideStr = '';
            } else {
                contentStr = '';
                hideStr = 'hide';
            }

            islikeStr = '<div class="fl-fn-btn ' + islikeCurStr + '"><i class="S_txt3">|</i><span class="islike-btn aj-feed-fn-com-btn" title="' + islikeTitStr + '"><b></b><a href="javascript:void(0);" class="likecount ' + hideStr + '">' + islikeCountStr + '</a></span>' + contentStr + '</div>';

            formatData.islike = islikeStr;

            /* 赞-详情页列表 */
            var islikeType = 0; //是列表的赞吗？
            var islikeListStr = '<div class="fl-fn-btn ' + islikeCurStr + '"><span class="islike-btn aj-feed-fn-com-btn islikelist-btn" title="' + islikeTitStr + '"><b></b><a href="javascript:void(0);" class="likecount ' + hideStr + '">' + islikeCountStr + '</a><i class="S_txt3">|</i></span></div>';

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

                formatData.feedRangeDescription = '<span>-</span> <span class="group"> <a href="javascript:void(0);" title="' +  util.cutBadStr(itemData.feedRangeTip) + '"> ' + itemData.feedRangeDescription + '</a> </span>';
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
            var showEntnetworkdiskFile = function () {
                var feedNDFiles = itemData.feedNDFiles;
                var feedFiles = '';
                var feedFile = '';
                var previewBtn = '';
                var networkLinkBtn = '<a class="networklink-btn" href="#entnetworkdisk">进入网盘</a>';
                if (feedNDFiles.length > 0) {
                    _.each(feedNDFiles, function (file) {
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
                        feedFiles += '<dl attachid="' + file.ndFileID + '"><dt><img src="' + FS.ASSETS_PATH + '/images/file/' + util.getFileType({
                            "name": file.attachName
                        }, true) + '.png" alt=""></dt><dd><p>' + file.attachName + '(' + util.getFileSize(file.attachSize) + ')</p><p><a href="' + util.getDfLink(file.attachPath, file.attachName, true) + '" class="d" title="' + file.name + '" target="_blank">下载</a> ' + previewBtn + '</p></dd></dl>';
                    });

                    formatData.feedFiles = '<div class="feed-files feed-attach fn-clear netdiskfile">' + feedFiles + networkLinkBtn + '</div>';


                } else {
                    /*=    显示feed附件    =*/
                    _.extend(formatData, formatFiles(itemData.files || [], itemData));
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
            if(itemData.feedType==2003){
                formatData.createTime = '<a href="#stream/showfeed/=/id-' + formatData.feedID + '/datalighted-app|workmessage' + '" class="f-date"> ' + finalTime + '</a>';
            }else{
                formatData.createTime = '<a href="#stream/showfeed/=/id-' + formatData.feedID + (crmParam ? '/feedSource-crm' : '') + '" class="f-date"> ' + finalTime + '</a>';
            }


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
                fnReplyRc = '<div class="fl-fn-btn"><a href="javascript:void(0);" class="aj-Reply aj-feed-fn-com-btn rc">同事回复' + fnReplyNum + '</a></div>';
            formatData.fnReplyPre = '<div class="fl-fn-btn"><a href="javascript:void(0);" class="aj-replytext aj-feed-fn-com-btn fl-common-up-arrow"> 回复' + fnReplyNum + '</a></div>'; //没有竖线的回复
            var delWorkmessageStr='<div class="fl-fn-btn"><a href="javascript:void(0);" class="aj-delete aj-feed-fn-com-btn">删除</a><i class="S_txt3" style="float: right;">|</i> </div>';
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
                formatData.delWorkmessageBtn = delWorkmessageStr;
            }else{
                formatData.delWorkmessageBtn = '';
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

            /*formatData.audioWarp = ' <div class="audio-warp"> <div class="audio-close"><img src="'+FS.ASSETS_PATH+'/images/audio_colse_ico.gif" alt="">收起</div> <div><audio src="' + FS.BASE_PATH + '/html/fs/data/wav2mp3.mp3" controls="true" ></div> </div>';*/

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
                    isTokenChengedStr = '<img src="' + FS.ASSETS_PATH + '/images/location_istokenchenged.png" class="istokenchenged-ico" title="该用户本次签到所用设备与上次不同"> ';
                }

                //                feedLocationStr = '<div class="feed-location"><span class="feed-location-text fn-left">' + feedLocationTextStr + '</span><span class="feed-location-fn"><a href="#" class="feed-location-fn-map">显示地图</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript: void(0);" class="aj-feed-fn-com-btn feed-location-fn-equipment">查看设备</a>' + isTokenChengedStr + '</span><img src="http://maps.googleapis.com/maps/api/staticmap?language=zh-CN&size=546x100&zoom=13&markers=color:red%7C' + feedLocation.latitude + ',' + feedLocation.longitude + '&sensor=false&key=AIzaSyCVmXMoRwu4GCJzrH2KnAz-6pgOBuV2Rdc" width="546" height="100" class="googlemap-jpg"/></div>';

                feedLocationStr = '<div class="feed-location"><span class="feed-location-text fn-left">' + feedLocationTextStr + '</span><span class="feed-location-fn"><a href="#" class="feed-location-fn-map">显示地图</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript: void(0);" class="aj-feed-fn-com-btn feed-location-fn-equipment">查看设备</a>' + isTokenChengedStr + '</<span></span><span class="map-api fn-clear"><img class="feed-location-fn-map" src="http://restapi.amap.com/v3/staticmap?location=' + feedLocation.longitude + ',' + feedLocation.latitude + '&zoom=10&size=546*140&markers=mid,,A:' + feedLocation.longitude + ',' + feedLocation.latitude + '&key=ee95e52bf08006f63fd29bcfbcf21df0" style="cursor:pointer;"/></span></div>';

                formatData.feedLocationStr = feedLocationStr;
                formatData.feedLocation = feedLocation;
            }
            formatData.crmStartTime = '';//开始时间
            formatData.crmfBusinessTagRelationsStr = '';

            //清除当前crm下的与“自己”相关的内容
            if (crmParam) {
                formatData.feedSource = 'crm';
                switch (crmParam.type) {
                    //            	case 'customer':
                    //            	case 'contact':
                    //            		var arr = [];
                    //            		$.each(itemData.crmCustomers, function(idx, item){
                    //            			if(item.customerID != crmParam.id){
                    //            				arr.push(item);
                    //            			}
                    //            		});
                    //            		itemData.crmCustomers = arr;
                    //            		var arr = [];
                    //            		$.each(itemData.crmContacts, function(idx, item){
                    //            			if(item.contactID != crmParam.id){
                    //            				arr.push(item);
                    //            			}
                    //            		});
                    //            		itemData.crmContacts = arr;
                    //            		break;
                    case 'contract':
                        if (itemData.crmContract && itemData.crmContract.contractID == crmParam.id) {
                            itemData.crmContract = null;
                        }
                        break;
                    case 'opportunity':
                        if (itemData.crmSalesOpportunity && itemData.crmSalesOpportunity.salesOpportunityID == crmParam.id) {
                            itemData.crmSalesOpportunity = null;
                        }
                        break;
                    case 'marketing':
                        if (itemData.crmMarketing && itemData.crmMarketing.marketingEventID == crmParam.id) {
                            itemData.crmMarketing = null;
                        }
                        break;
                    case 'salesclue':
                        if (itemData.crmSalesClue && itemData.crmSalesClue.salesClueID == crmParam.id) {
                            itemData.crmSalesClue = null;
                        }
                        break;
                    case 'competitor':
                        if (itemData.crmCompetitor && itemData.crmCompetitor.competitorID == crmParam.id) {
                            itemData.crmCompetitor = null;
                        }
                        break;
                    case 'product':
                        if (itemData.crmProduct && itemData.crmProduct.productID == crmParam.id) {
                            itemData.crmProduct = null;
                        }
                        break;
                }
            } else {
                formatData.feedSource = 'oa';
            }
            //是否是详情页
            var isFeedDetail = (window.location.hash && window.location.hash.toLowerCase().indexOf('showfeed') >= 0);
            /**
             * crm 打通后相关数据
             */
            //关联的客户
            var crmCustomersInfoStr = '';
            formatData.crmCustomersInfo = '';
            //oa里发的分享
            if (!crmParam && parseInt(itemData.feedType) != 5 || (crmParam && parseInt(itemData.feedType) != 5 )) {
                if (itemData.crmCustomers && itemData.crmCustomers.length > 0) {
                    _.each(itemData.crmCustomers, function (item) {
                        var customerID = item.customerID;
                        var name = item.name;
                        var param = {
                            id: customerID,
                            returnUrl: window.location.href.split('#')[1]
                        };
                        crmCustomersInfoStr += '<div><a href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '" >' + name + '</a></div>'
                    });
                    formatData.crmCustomersInfo = '<div class="crm-feedinfo-hd">关联客户(' + itemData.crmCustomers.length + ')</div><div class="crm-feedinfo-bd">' + crmCustomersInfoStr + '</div>';
                }
            }

            //关联的联系人
            var crmContactsInfoStr = '';
            formatData.crmContactsInfo = '';
            //oa里发的分享或者详情页
            if ((!crmParam && parseInt(itemData.feedType) != 5) || isFeedDetail || crmParam) {
                if (itemData.crmContacts && itemData.crmContacts.length > 0) {
                    _.each(itemData.crmContacts, function (item, idx) {
                        var contactID = item.contactID;
                        var name = item.name;
                        var param = {
                            id: contactID,
                            returnUrl: window.location.href.split('#')[1]
                        };
                        crmContactsInfoStr += '<span><a href="#contacts/showcontact/=/param-' + encodeURIComponent(JSON.stringify(param)) + '" >' + name + (idx == itemData.crmContacts.length - 1 ? '' : '、') + '</a></span>'
                    });
                    formatData.crmContactsInfo = '<div class="crm-feedinfo-hd">关联联系人(' + itemData.crmContacts.length + ')</div><div class="crm-feedinfo-bd">' + crmContactsInfoStr + '</div>';
                }
            }

            //crm顶部信息（合同，市场，产品……）
            formatData.crmTopInfo = '';
            var crmTopInfoStr = '';
            var param = {};
            //是否是从crm里点过来的详情
            var queryParam = util.getTplQueryParams(),
                isCrmFeedDetail = (queryParam && queryParam.feedSource == 'crm');
            if (!crmParam && !isCrmFeedDetail) {
                //销售记录里，显示优先级:机会>客户>联系人
                //联系人
                if (parseInt(itemData.feedType) == 5 && itemData.showCRMType == 2) {
                    var contact = itemData.crmContacts && itemData.crmContacts[0];
                    if (contact) {
                        param = { id: contact.contactID, returnUrl: window.location.href.split('#')[1] };
                        crmTopInfoStr = '<a href="#contacts/showcontact/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + contact.name + '</a>';
                        formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmcontact">' + crmTopInfoStr + '<span title="联系人" class="crm-icon"></span></div>';
                    }
                }

                //客户
                if (parseInt(itemData.feedType) == 5 && itemData.showCRMType == 1) {
                    var customer = itemData.crmCustomers && itemData.crmCustomers[0];
                    if (customer) {
                        param = { id: customer.customerID, returnUrl: window.location.href.split('#')[1] };
                        crmTopInfoStr = '<a href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + customer.name + '</a>';
                        formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmcustomer">' + crmTopInfoStr + '<span title="客户" class="crm-icon"></span></div>';
                    }
                }

                //机会
                if (itemData.crmSalesOpportunity && itemData.showCRMType == 3) {
                    param = { id: itemData.crmSalesOpportunity.salesOpportunityID, returnUrl: window.location.href.split('#')[1] };
                    crmTopInfoStr = '<a href="#opportunities/showopportunity/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + itemData.crmSalesOpportunity.name + '</a>';
                    formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmsalesopportunity">' + crmTopInfoStr + '<span title="机会" class="crm-icon"></span></div>';
                }

                //合同
                if (itemData.crmContract && itemData.showCRMType == 6) {
                    param = { id: itemData.crmContract.contractID, returnUrl: window.location.href.split('#')[1] };
                    crmTopInfoStr = '<a href="#contracts/showcontract/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + itemData.crmContract.title + '</a>';
                    formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmcontract">' + crmTopInfoStr + '<span title="合同" class="crm-icon"></span></div>';
                }

                //市场
                if (itemData.crmMarketing && itemData.showCRMType == 7) {
                    param = { id: itemData.crmMarketing.marketingEventID, returnUrl: window.location.href.split('#')[1] };
                    crmTopInfoStr = '<a href="#marketings/showmarketing/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + itemData.crmMarketing.name + '</a>';
                    formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmmarketing">' + crmTopInfoStr + '<span title="市场" class="crm-icon"></span></div>';
                }

                //线索
                if (itemData.crmSalesClue && itemData.showCRMType == 8) {
                    param = { id: itemData.crmSalesClue.salesClueID, returnUrl: window.location.href.split('#')[1] };
                    crmTopInfoStr = '<a href="#salesclues/showsalesclue/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + itemData.crmSalesClue.name + '，' + itemData.crmSalesClue.company + '</a>';
                    formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmsalesclue">' + crmTopInfoStr + '<span title="线索" class="crm-icon"></span></div>';
                }

                //对手
                if (itemData.crmCompetitor && itemData.showCRMType == 5) {
                    param = { id: itemData.crmCompetitor.competitorID, returnUrl: window.location.href.split('#')[1] };
                    crmTopInfoStr = '<a href="#competitors/showcompetitor/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + itemData.crmCompetitor.name + '</a>';
                    formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmcompetitor">' + crmTopInfoStr + '<span title="对手" class="crm-icon"></span></div>';
                }

                //产品
                if (itemData.crmProduct && itemData.showCRMType == 4) {
                    param = { id: itemData.crmProduct.productID, returnUrl: window.location.href.split('#')[1] };
                    crmTopInfoStr = '<a href="#products/showproduct/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + itemData.crmProduct.name + '</a>';
                    formatData.crmTopInfo = '<div class="crm-crmtopinfo-warp crmproduct">' + crmTopInfoStr + '<span title="产品" class="crm-icon"></span></div>';
                }
            }
            return formatData;
        },
        "share": function (itemData, data) { //分享
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
                if (_.some(currentUserData.functionPermissions, function (permission) {
                    return permission.value == 1; //权限1表示可以发公告,公告管理员
                })) {
                    if (announcement.canDelete) {
                        formatData.deletegg = '<a class="aj-delete" href="javascript:void(0);">删除</a><i class="S_txt3">|</i>';
                        formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete">删除</a>';
                    } else {
                        formatData.deletegg = '';
                        formatData.fnDeleteW = '';
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
                    _.each(relateEmployees, function (schedulesEmployees) {
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
            var noTopLine = '';
            formatData.receiptfn = ''; //回执的功能按钮
            formatData.receiptRemaind = ''; //回执的提醒信息

            if (receipt) {
                requireReceiptCount = receipt.requireReceiptCount; //需回执人数
                receiptedCount = receipt.receiptedCount; //已回执人数
                myReceiptStatus = receipt.myReceiptStatus; //回执状态
                isSendSms = receipt.isSendSms; //是否发短信

                //回执状态
                if (myReceiptStatus === 1) {
                    formatData.receiptfn = '<a href="javascript:;" class="receiptbtn aj-receipt-fn">立即回执</a>';
                } else if (myReceiptStatus == 2) {
                    formatData.receiptfn = '<a href="javascript:;" class="receiptbtn disable">已回执</a>';
                }
                if (isSendSms) {
                    isSendSmsStr = '已发短信，';
                }
                //是否显示上边线
                if ((itemData.pictures && itemData.pictures.length > 0) || (itemData.files && itemData.files.length > 0) || (itemData.voteItem)) {
                    noTopLine = 'no-top-line';
                } else {
                    noTopLine = '';
                }

                formatData.receiptRemaind = ' <div class="receiptfnwarp ' + noTopLine + '"><a href="#" class="receiptalertlist alertlistbtn">需' + requireReceiptCount + '人回执，' + isSendSmsStr + '已回执' + receiptedCount + '人</a></div>';
                formatData.receiptedCount = receiptedCount;   //回执人数
            }
            return formatData;
        },
        /**
         * CRM
         */
        "crm": function (itemData, data) {
            var formatData = {};


            /* 公告 */
            var announcement = itemData.announcement;
            var announcetitStr = '';
            var isShow;
            /* CRM数据 */
            var crmEvent = itemData.crmEvent || null;
            var contacts = [];
            var fBusinessTagRelations = [];
            var crmStartTime = '';//事件
            var crmContacts = '';
            var crmfBusinessTagRelations = '';
            var crmfBusinessTagRelationsStr = '';
            if (crmEvent) {
                if (crmEvent.startTime) {
                    var startTimeStr = util.getDateSummaryDesc(moment.unix(crmEvent.startTime), moment.unix(itemData.serviceTime), 2);
                    //                var startTimeStr = moment.unix(crmEvent.startTime).format('MMMDD日 HH:mm');
                    crmStartTime = '<div class="crm-start-time-warp">' + startTimeStr + '</div>';
                }
                    //事件标签
                    fBusinessTagRelations = crmEvent.fBusinessTagRelations || [];
                    if (fBusinessTagRelations && fBusinessTagRelations.length > 0) {
                        _.each(fBusinessTagRelations, function (option) {
                            var name = '<a data-id="' + option.fBusinessTagOptionID + '" href="javascript:;">#' + option.fBusinessTagOptionName + '</a>';
                            crmfBusinessTagRelations += name;
                        });
                        crmfBusinessTagRelationsStr = '<div class=crm-tags-warp>' + crmfBusinessTagRelations + '</div>'
                    }

            }

            formatData.crmStartTime = crmStartTime || '';//开始时间
            formatData.crmfBusinessTagRelationsStr = crmfBusinessTagRelationsStr || '';


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
                if (_.some(currentUserData.functionPermissions, function (permission) {
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
                    _.each(relateEmployees, function (schedulesEmployees) {
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
            var noTopLine = '';
            formatData.receiptfn = ''; //回执的功能按钮
            formatData.receiptRemaind = ''; //回执的提醒信息

            if (receipt) {
                requireReceiptCount = receipt.requireReceiptCount; //需回执人数
                receiptedCount = receipt.receiptedCount; //已回执人数
                myReceiptStatus = receipt.myReceiptStatus; //回执状态
                isSendSms = receipt.isSendSms; //是否发短信

                //回执状态
                if (myReceiptStatus === 1) {
                    formatData.receiptfn = '<a href="javascript:;" class="receiptbtn aj-receipt-fn">立即回执</a>';
                } else if (myReceiptStatus == 2) {
                    formatData.receiptfn = '<a href="javascript:;" class="receiptbtn disable">已回执</a>';
                }
                if (isSendSms) {
                    isSendSmsStr = '已发短信，';
                }
                //是否显示上边线
                if ((itemData.pictures && itemData.pictures.length > 0) || (itemData.files && itemData.files.length > 0) || (itemData.voteItem)) {
                    noTopLine = 'no-top-line';
                } else {
                    noTopLine = '';
                }

                formatData.receiptRemaind = ' <div class="receiptfnwarp ' + noTopLine + '"><a href="#" class="receiptalertlist alertlistbtn">需' + requireReceiptCount + '人回执，' + isSendSmsStr + '已回执' + receiptedCount + '人</a></div>';
                formatData.receiptedCount = receiptedCount;   //回执人数
            }

            return formatData;
        },
        /**
         * 日志
         * @param {type} itemData
         * @param {type} data
         */
        "plan": function (itemData, data) {
            var formatData = {};
            var otherWork = pinLink(itemData.feedContent, itemData), //心得体会
                todayWork = pinLink(itemData.plan.reportContent, itemData), //今日工作总结
                tomorrowWork = pinLink(itemData.plan.planContent, itemData), //明日工作计划
                commonername = '',
                commonerid,
                allWork = "";

            // 回复的记录数字
            var fnReplyNum = itemData.replyCount;
            if (fnReplyNum == 0) {
                fnReplyNum = '';
            } else {
                fnReplyNum = '(<span class="num">' + fnReplyNum + '</span>)';
            }

            var fnCommenton = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-commenton">点评' + fnReplyNum + '</a></div>';
            formatData.feedID = itemData.feedID;

            // 所有的工作内容
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
                // 点评的3种状态
                if (itemData.plan.leader) {
                    commonername = itemData.plan.leader.name || '',
                        commonerid = itemData.plan.leader.employeeID,
                        commonername = '<a class="employee-name" href="#profile/=/empid-' + commonerid + '">' + commonername + '</a>';
                    formatData.leaderinfo = '<div class="plan-leader">该日志由' + commonername + '点评。</div>';
                } else {
                    formatData.leaderinfo = '';
                }
                formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">未点评</a></span>';
                formatData.replyContent = "";
            }

            // 已点评 星级
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

            // 功能按钮
            if (itemData.plan.canComment) {
                formatData.fnCommentonW = fnCommenton; //点评
                formatData.fnReplyW = '';
            } else {
                formatData.fnCommentonW = "";
            }
            formatData.planType = itemData.plan.planType;

            // 是否显示关键回复按钮
            var replies = itemData.replies;
            if (replies.length > 0) {
                formatData.repliesBtn = '<a href="javascript:;" class="replies-btn aj-feed-fn-com-btn fl-common-up-arrow">关键回复(' + replies.length + ')</a>';
            } else {
                formatData.repliesBtn = '';
            }

            return formatData;
        },
        /**
         * 指令
         */
        "work": function (itemData, data) {
            var formatData = {},
                smsRemindTime2,
                smsRemindTime3;
            formatData.feedID = itemData.feedID;
            formatData.canCancel = itemData.canCancel;

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

            formatData.leaderinfo = '<div class="plan-leader">该指令由' + executername + '执行，' + workEndTimeText + '</div>';

            // 是否显示关键回复按钮
            var replies = itemData.replies;
            if (replies.length > 0) {
                formatData.repliesBtn = '<a href="javascript:;" class="replies-btn aj-feed-fn-com-btn fl-common-up-arrow">关键回复(' + replies.length + ')</a>';
            } else {
                formatData.repliesBtn = '';
            }

            /* 显示删除按钮 */
            // if ((currentUserData.id == itemData.work.assignerID) || itemData.work.canCancel) {}
            if (itemData.work.canCancel) {
                formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete">取消</a>';
            }
            return formatData;
        },
        "approve": function (itemData, data) { //审批
            if (itemData.approve) {
                var formatData = {};
                var replyCount = itemData.replyCount || ''; //回复数量
                formatData.feedID = itemData.feedID;
                formatData.canCancel = itemData.canCancel;

                myId = util.getContactData()["u"].id;
                var fnApproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-approbtn aj-feed-fn-com-btn">批复</a></div>',
                    fnCc = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-cc aj-feed-fn-com-btn">抄送</a></div>',
                    fnPending = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-pending aj-feed-fn-com-btn">待办</a></div>',
                    fnModifyapproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i><a href="javascript:void(0);" class="aj-modifyapproval aj-feed-fn-com-btn">修改审批人</a></div>';
                var morePending = '<a href="javascript:void(0);" class="aj-pending aj-feed-fn-com-btn">待办</a>';
                var feedStatusDescription = util.getApproveStatusName(itemData.approve.status);
                if (replyCount > 0) {
                    fnApproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-approbtn aj-feed-fn-com-btn" data-replycount="' + replyCount + '">批复(' + replyCount + ')</a></div>';
                } else {
                    fnApproval = '<div class="fl-fn-btn"><i class="S_txt3">|</i> <a href="javascript:void(0);" class="aj-approbtn aj-feed-fn-com-btn" data-replycount="0">批复</a></div>';
                }
                if (itemData.approve) {
                    /* 显示取消按钮 */
                    if ((currentUserData.id == itemData.approve.senderID) && itemData.approve.canCancel) {
                        formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete aj-feed-fn-com-btn">取消</a>';
                    }
                    if ((currentUserData.id == itemData.approve.currentApproverID) && itemData.approve.canCancel) {
                        formatData.fnDeleteW = '<a href="javascript:void(0);" class="aj-delete aj-feed-fn-com-btn">取消</a>';
                    }

                }
                formatData.isWhat = '<span>-</span><span class="con"><a href="javascript:void(0);">' + feedStatusDescription + '</a></span>';

                if (itemData.approve.status == 1) {
                    var approvername = itemData.approve.currentApprover.name || "",
                        approverid = itemData.approve.currentApprover.employeeID || "",
                        myId = util.getContactData()["u"].id;
                    approvername = '<a class="employee-name" href="#profile/=/empid-' + approverid + '">' + approvername + '</a>'; //人名加超链接
                    formatData.leaderinfo = '<div class="plan-leader">已提交，待<a href="#">' + approvername + '</a>审批。</div>';
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
                _.each(itemData.replies, function (replayItemT, index) {
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
                        feedFormatContentOpenBtn = '<br/><br/><a href="javascript:;" class="feed-topreply-content-visible-h" data-index="' + index + '"> 展开正文（共' + feedFormatContent.feedWordNum + '个字）</a>';
                    }


                    // 同意不同意图标
                    (function () {
                        switch (replayItemT.operationType) {
                            case 1:
                                operationTypeText = "同意";

                                isagreeImg = '<img src="' + FS.ASSETS_PATH + '/images/agree.gif" alt="" class="approve-isagree">';
                                break;
                            case 2:
                                operationTypeText = "不同意";
                                isagreeImg = '<img src="' + FS.ASSETS_PATH + '/images/unagree.gif" alt="" class="approve-isagree">';
                                break;
                            case 3:
                                operationTypeText = "设置为已取消";
                                isagreeImg = "";
                                break;
                        }
                    })();

                    // 来源
                    (function () {
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
                (function () {
                    formatData.printSendername = '<span class="print-sendername">' + itemData.sender.name + '</span>' || '';
                    formatData.printPictures = '';
                    formatData.printFiles = '';
                    formatData.printText = '';
                    //文本
                    _.each(itemData.feedContent, function (text) {
                        formatData.printText += text.text;
                    });
                    formatData.printText = formatData.printText.replace(/[\n|\r]/g, '<br/>');//把/n变成br
                    //图片
                    _.each(itemData.pictures, function (picture) {
                        formatData.printPictures += '<div class="print-img-item"><span class="print-img-warp"><img src="' + FS.API_PATH + '/df/get?id=' + picture.attachPath + '1.jpg" class="print-pictures"/><img src="' + FS.ASSETS_PATH + '/images/print-del-pic-ico.gif" title="不打印该图" class="print-del-pic-ico aj-feed-fn-com-btn" /></span></div>';
                    });
                    //附件
                    var printFilesNum = 1;
                    _.each(itemData.files, function (file) {
                        formatData.printFiles += '<div class="print-feedfile">附件' + printFilesNum + '：' + file.attachName + ' (' + util.getFileSize(file.attachSize) + ')</div>';
                        printFilesNum++;
                    });
                    formatData.printCTime = moment.unix(itemData.createTime).format('YYYY年MMMDD日 HH:mm'); //审批打印时显示的发出时间
                })();

                // 是否显示关键回复按钮
                var replies = itemData.replies;
                if (replies.length > 0) {
                    formatData.repliesBtn = '<a href="javascript:;" class="replies-btn aj-feed-fn-com-btn fl-common-up-arrow">关键回复(' + replies.length + ')</a>';
                } else {
                    formatData.repliesBtn = '';
                }
                return formatData;
            }

        },
        // 提醒列表
        myremind: function (itemData, data) {
            var formatData = {};
            var timingMessageRemaind=itemData.timingMessageRemaind;
            var serviceTime = data.serviceTime,
                yearTime, ctime, rtime, yearTimeService;
            yearTime = moment(timingMessageRemaind.remaindTime).format('YYYY');
            yearTimeService = moment.unix(serviceTime).format('YYYY');

            if (yearTime == yearTimeService) { //如果是今年就不显示年了
                ctime = moment(timingMessageRemaind.createTime).format('MMMDD日 (dddd) HH:mm');
                rtime = moment(timingMessageRemaind.remaindTime).format('MMMDD日 HH:mm');
            } else {
                ctime = moment(timingMessageRemaind.createTime).format('YYYY年MMMDD日 (dddd) HH:mm');
                rtime = moment(timingMessageRemaind.remaindTime).format('YYYY年MMMDD日 HH:mm');
            }
            //自己创建的不显示创建者
            if (currentUserData.id == timingMessageRemaind.creator.employeeID) {
                timingMessageRemaind.hideCreator = 'fn-hide';
            } else {
                timingMessageRemaind.hideCreator = '';
            }
            timingMessageRemaind.createTime = ctime;
            timingMessageRemaind.remaindTime = rtime;
            formatData.timingMessageRemaind=timingMessageRemaind;
            return formatData;

        },
        // 工作通知
        worknotice: function (itemData, data) {
            var formatData = {};
            formatData.feedWorkNoticeRangesReaded = itemData.feedWorkNoticeRangesReaded || [];
            formatData.feedWorkNoticeRangesUnread = itemData.feedWorkNoticeRangesUnread || [];
            formatData.feedWorkNoticeRangesConfirmed = itemData.feedWorkNoticeRangesConfirmed || [];
            formatData.isNeedConfirm = itemData.feedWorkNotice && itemData.feedWorkNotice.isNeedConfirm || false;

            if (itemData.feedWorkNotice.isNeedConfirm) { //如果需要确认

                if (_.some(formatData.feedWorkNoticeRangesConfirmed, function (item) {
                    if (item.employeeID == currentUserData.employeeID) {
                        return true;
                    }
                })) {   // 如果已确认名单里面有我
                    formatData.isNeedConfirm = '<a href="javascript:;" class="receiptbtn disable">已确认</a>';
                } else {
                    formatData.isNeedConfirm = '<a href="javascript:;" class="receiptbtn aj-confirmworknotice-btn">确认</a>';
                }
            } else {
                formatData.isNeedConfirm = '';
            }

            /* 提醒 */
            var feedRemindStr = '<div class="fl-fn-btn feed-remind-btn"><div class="remind-more-menu" style="display: none;"> <a href="javascript:;" class="feed-remind-btn-item" data-value="1">1小时后提醒我</a> <a href="javascript:;" class="feed-remind-btn-item" data-value="3">3小时后提醒我</a> <a href="javascript:;" class="feed-remind-btn-item" data-value="5">5小时后提醒我</a> <a href="javascript:;" class="feed-remind-btn-item" data-value="998">自定义提醒</a> </div> <a href="javascript:;">提醒 <i class="arrow"></i></a> </div>';
            formatData.feedRemind = feedRemindStr;
            formatData.title = itemData.feedWorkNotice.title || '';

            var feedWorkNoticeRangesReadedItemStr = '';
            _.each(formatData.feedWorkNoticeRangesReaded, function (item) {
                var listprofileImage = util.getAvatarLink(item.Employee && item.Employee.profileImage, '2');
                var name = item.Employee && item.Employee.name || '';
                var employeeID = item.employeeID || 0;
                feedWorkNoticeRangesReadedItemStr += '<div class="items fn-clear"> <img alt="" src="' + listprofileImage + '"> <a class="name" href="#profile/=/empid-' + employeeID + '">' + name + '</a> </div>';

            });
            formatData.feedWorkNoticeRangesReadedItemStr = feedWorkNoticeRangesReadedItemStr;

            var feedWorkNoticeRangesUnreadItemStr = '';
            _.each(formatData.feedWorkNoticeRangesUnread, function (item) {
                var listprofileImage = util.getAvatarLink(item.Employee && item.Employee.profileImage, '2');
                var name = item.Employee && item.Employee.name || '';
                var employeeID = item.employeeID || 0;
                feedWorkNoticeRangesUnreadItemStr += '<div class="items fn-clear"> <img alt="" src="' + listprofileImage + '"> <a class="name" href="#profile/=/empid-' + employeeID + '">' + name + '</a> </div>';

            });
            formatData.feedWorkNoticeRangesUnreadItemStr = feedWorkNoticeRangesUnreadItemStr;

            var feedWorkNoticeRangesConfirmedItemStr = '';
            _.each(formatData.feedWorkNoticeRangesConfirmed, function (item) {
                var listprofileImage = util.getAvatarLink(item.Employee && item.Employee.profileImage, '2');
                var name = item.Employee && item.Employee.name || '';
                var employeeID = item.employeeID || 0;
                feedWorkNoticeRangesConfirmedItemStr += '<div class="items fn-clear"> <img alt="" src="' + listprofileImage + '"> <a class="name" href="#profile/=/empid-' + employeeID + '">' + name + '</a> </div>';

            });
            formatData.feedWorkNoticeRangesConfirmedItemStr = feedWorkNoticeRangesConfirmedItemStr;

            return formatData;
        }
    };


    /**
     * 格式化返回数据
     * @param itemData
     * @returns {*}
     */

    function formatData(itemData, crmParam) {
        var data = {};
        data = _.extend(data, formator["common"](itemData, crmParam));
        var feedType = parseInt(itemData.feedType);
        // feedType 分享:1,日志:2,指令:3,审批:4
        switch (feedType) {
            case 151://提醒列表
                data = _.extend(data, formator["myremind"](itemData, data));
                break;
            case 1: //分享
                data = _.extend(data, formator["share"](itemData, data));
                break;
            case 5: //crm1
                data = _.extend(data, formator["crm"](itemData, data));
                break;
                /* case 2002: //crm2（已废弃）
                 data = _.extend(data, formator["crm"](itemData, data));*/
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
            case 2003: //工作通知
                data = _.extend(data, formator["worknotice"](itemData, data));
                break;
            default:
                data = _.extend(data, formator["share"](itemData, data));
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
        sync: function (method, model, options) {
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
                "apiCb": function (responseData) {
                }
            }));
        },
        parse: function (responseData) {
            /************/
            /** 预处理 **/
            /************/
            var items,
                formatItems = [];
            var that = this;
            if (responseData.success) {
                items = responseData.value.items;
                _.each(items, function (itemData, i) {
                    itemData.serviceTime = responseData.serviceTime; //设置服务器端时间依据
                    itemData.GetBatchFilesSource = that.GetBatchFilesSource; //附件权限标识
                    formatItems[i] = formatData(itemData, that.crmParam);
                });
            }
            return formatItems;
        }
    });
    exports.listC = ListC;
})
;