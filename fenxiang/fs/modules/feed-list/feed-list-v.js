/**
 * 定义信息列表View
 *
 * 遵循seajs module规范
 * @author liuxf
 */

define(function(require, exports, module) {
    var SwrCanceDialog;
    var root = window,
            FS = root.FS,
            tpl = FS.tpl,
            store = tpl.store,
            tplEvent = tpl.event;
    var util = require('util'),
            flutil = require('modules/feed-list/fl-util'),
            Dialog = require('dialog'),
            moment = require('moment'),
            publish = require('modules/publish/publish'),
            feedListStyle = require('modules/feed-list/feed-list.css'),
            M = require('modules/feed-list/feed-list-m'),
            C = require('modules/feed-list/feed-list-c'),
            FsReply = require('modules/fs-reply/fs-reply'),
            feedHelper = require('modules/feed-list/feed-list-helper'),
            filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
            AttachPreview = require('modules/fs-attach/fs-attach-preview'),
            swfobject = require('swfobject'),
            AudioPlayer = require('uilibs/audio-player'), //音频播放组件
            fsMap = require('modules/fs-map/fs-map'); //地图组件
    tpl = require('modules/feed-list/feed-list.html');
    var pinLink = feedHelper.feedContentFormat; //拼超链接
    var ItemM = M.itemM, //item model
            ListC = C.listC, //list collection
            tplEl = $(tpl);
    /* 定义组件 */
    var MediaMaker = publish.mediaMaker; //多媒体按钮组件
    var AtInput = publish.atInput, //at输入框
            SelectBar = publish.selectBar,
            SelectPanel = publish.selectPanel,
            TimeSelect = publish.timeSelect, //时间选择组件
            DateSelect = publish.dateSelect; //日期选择组件
    //var contactData = util.deepClone(FS.getAppStore('contactData') || {}); //人和组织的数据来源
    var contactData = util.getContactData(),
            currentUserData = contactData["u"]; //自己
    //设置预览组件
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    //地图定位
    var FsMapOverlay = fsMap.FsMapOverlay;
    var fsMapOverlay = new FsMapOverlay();

    /* 判断输入内容不能为空 */
    var isEmpty = function(target) {
        var targetText = target.val(),
                passed = true;
        targetText = $.trim(targetText);
        //标题不能为空
        if (targetText == "") {
            util.showInputError(target);
            passed = false;
        }
        return passed;
    };
    //打印地址
    var feedPrintUrl = FS.BASE_PATH + '/H/Home/Index' + (PUBLISH_MODEL == 'development' ? '2' : '') + '?model=print#stream/showfeed/=/id-';
    /* 回复内容数据获取 */
    /* var getReplyContent = function(feedId, callback) {
     util.api({
     "url": '/Feed/GetFeedReplysByFeedID',
     type: 'get',
     "data": {
     feedid: feedId,
     pagesize: 10,
     pageNumber: 1
     }, //传给后台数据
     "apiCb": function(responseData) {
     var data = responseData.value;
     //后台返回的数据
     var replyContent = '';
     if (responseData.success) {
     callback(data.items);
     }
     }
     });
     };*/

    /* 点击页面空白处触发的事件 */
    $(document).click(function() {
        $('.item-func .more-menu').hide(); //功能菜单更多的弹出层
        $('.item-vote .seemore-info').hide(); //投票查看详情的弹出层
    });
    var AnnounceOnTimeDialog = Dialog.extend({//公告显示时间
        "attrs": {
            width: 380,
            content: tplEl.filter('.announce-on-time-templet').html(),
            className: 'common-style-richard announce-on-time'
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel',
            'change .selectlist': '_selectlistChange'
        },
        "_renderCpt": function() {
            var elEl = this.element,
                    wEl = $('.selecttimediv', elEl);
            var ds = new DateSelect({
                "element": wEl,
                "placeholder": "选择日期"
            });
            this.ds = ds;
        },
        "render": function() {
            var result = AnnounceOnTimeDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._renderCpt();
            return result;
        },
        // "hide": function() {
        //  var result = Dialog.superclass.hide.apply(this, arguments);
        //  this._clear();
        //  return result;
        // },
        "_selectlistChange": function() {
            var elEl = this.element;
            var selectlistEl = $('.selectlist', elEl);
            var EnumDescription = selectlistEl.val();
            var selecttimedivEl = $('.selecttimediv', elEl);
            if (EnumDescription == 12) {
                selecttimedivEl.show();
            } else {
                selecttimedivEl.hide();
            }
        },
        "_settimeshow": function() {
            var that = this;
            var itemV = announceontimeDialog.itemV;
            var model = itemV.model;
            var elEl = this.element;
            var selectlistEl = $('.selectlist', elEl);
            var EnumDescription = selectlistEl.val();
            var originData = model.get("originData");
            var feedID = originData.feedID;
            var anTime = this.ds.getValue(true);

            if (anTime) {
                anTime = moment(anTime).unix();
            } else {
                anTime = 0;
            }
            util.api({
                "url": '/FeedAnnounce/SetAnnounceIsShow ', //公告显示时间提交接口地址
                "type": 'post',
                "data": {
                    "feedID": feedID, //信息源ID
                    //"feedModelType": 1, //1,工作管理 2,客群管理
                    "isShow": true, //是否显示
                    "showtimeDataType": EnumDescription, //有效时间枚举
                    "time": anTime //公示期
                },
                "dataType": 'json',
                "success": function(responseData) {
                    if (responseData.success) {
                        that.hide();
                        that._clear();
                        itemV.updateModel(); //刷新列表
                    }
                }
            });
        },
        "_clear": function() {

        },
        "_submit": function(evt) {
            this._settimeshow();
            this.hide();
        },
        "_cancel": function(evt) {
            this.hide();
        },
        "destroy": function() {
            var result;
            this.ds && this.ds.destroy();
            result = AnnounceOnTimeDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    var announceontimeDialog = new AnnounceOnTimeDialog(); //公告显示时间

    /* 投票超出选择数量限制的弹出层 */
    var voteOverstepDialog = new Dialog({
        width: '380',
        content: '<div class="fs-feed-comment-dialog"><div class="working-content"> <h1 class="ui-dialog-title"> </h1> <div class="working-warp fn-clear"> <p style="font-size:14px;"> 最多可选择<span class="Overstepnum">0</span>项 </p> <p class="working-btnwarp"><span class="button-r"> <button type="submit" class="button-green place-btn close-btn">确定</button> </span> </p> </div> </div></div>',
        className: 'common-style-richard fs-feed-voteOverstep-dialog'
    });
    voteOverstepDialog.after('show', function() {
        $('.fs-feed-comment-dialog .Overstepnum').text(voteOverstepDialog.voteCountNum);
    });
    /* 投票没有选项的弹出层 */
    var voteDialog = new Dialog({
        width: '380',
        content: '<div class="fs-feed-comment-dialog"><div class="working-content"> <h1 class="ui-dialog-title"> </h1> <div class="working-warp fn-clear"> <p> 请选择投票选项 </p> <p class="working-btnwarp"><span class="button-r"> <button type="submit" class="button-green place-btn close-btn">确定</button> </span> </p> </div> </div></div>',
        className: 'common-style-richard fs-vote-comment-dialog'
    });

    /* 点评的弹出层 */
    var commentDialog = new Dialog({
        width: 909,
        content: tplEl.filter('.commenton-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });

    /* 点评窗口数据获取 */
    commentDialog.after('show', function() {
        var elEl = commentDialog.element,
                box = $('.dialog-right', elEl),
                inputTextEl = $('.input-text', elEl), //回复框
                forwarderEl = $('.aj-selectcommentoner', elEl);
        inputTextEl.val('').trigger('autosize.resize'); //bug:ie10下会默认把placeholder填充到textarea里
        //每次显示都把右侧展开
        commentDialog.set('width', 909);
        box.show();
        $(window).resize();

        /* 调用选人组件 */
        var sb = commentDialog.sb;
        if (!sb) {
            sb = new SelectBar({
                "element": forwarderEl,
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                    /*, {
                     "title": "部门",
                     "type": "g",
                     "list": contactData["g"] //数据来源通过contactData获取
                     }*/
                ],
                "singleCked": false, //单选？
                "title": "添加抄送人", //默认文字内容
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            commentDialog.sb = sb;
            /*  点评的关闭按钮 */
            commentDialog.element.on('click', '.close-btn', function() {
                commentDialog.hide();
            });
            commentDialog.atInput = new AtInput({
                "element": inputTextEl,
                "withAt": true
            });
        }
        var itemV = this.itemV,
                model = itemV.model;
        var feedContent = model.get("feedText"),
                feedid = model.get("feedID"),
                originData = model.get("originData"),
                name = originData.sender.name,
                plantype = originData.plan.planType;
        var nameimg = util.getAvatarLink(originData.sender.profileImage, 2),
                employeeid = originData.sender.employeeID,
                creattime = moment.unix(originData.createTime).format('MMMDD日');
        var isforward = true;
        var feedContentEl = $(".comment-feedcontent", elEl),
                nameEl = $(".name", elEl),
                nameimgEl = $(".name-img", elEl),
                creattimeEl = $(".aj-ctime", elEl);
        feedContent = flutil.delStrLink(feedContent); //删除字符串的超连接
        /* 渲染 */
        feedContentEl.html(feedContent);
        nameEl.html(name);
        nameimgEl.attr("src", nameimg);
        creattimeEl.html(creattime);
        readhisplan(feedid, employeeid, plantype, isforward);
    });
    /* 展开历史点评 */
    commentDialog.element.on('click', '.look-history', function() {
        var elEl = commentDialog.element,
                box = $('.dialog-right', elEl);
        if (box.is(':visible')) {
            $(this).text("查看历史日志>>");
            box.hide();
            commentDialog.set('width', 458);

            $(window).resize();
        } else {
            //Position.center(elEl);
            $(this).text("收起历史日志<<");
            commentDialog.set('width', 909);
            box.show();
            $(window).resize();
        }
    });

    /* 获取历史日志的左按钮 */
    commentDialog.element.on('click', '.dialy-history i', function() {
        var elEl = commentDialog.element,
                hisPlanEl = $(".aj-hisplanel", elEl),
                hisTimeEl = $(".aj-histime", elEl),
                historyfnEl = $(".dialy-history", elEl),
                leftbtEl = $("i", historyfnEl);
        var feedid = hisPlanEl.attr("feedid"),
                employeeid = hisPlanEl.attr("employeeid"),
                plantype = hisPlanEl.attr("plantype"),
                hasforward = hisPlanEl.attr("hasforward"),
                isforward = false;
        var cur = leftbtEl.attr("class");
        if (cur != "cur") {
            isforward = true;
            readhisplan(feedid, employeeid, plantype, isforward);
        }
    });

    /* 获取历史日志的右按钮 */
    commentDialog.element.on('click', '.dialy-history b', function() {
        var elEl = commentDialog.element,
                hisPlanEl = $(".aj-hisplanel", elEl),
                hisTimeEl = $(".aj-histime", elEl),
                historyfnEl = $(".dialy-history", elEl),
                rightbtEl = $("b", historyfnEl);
        var feedid = hisPlanEl.attr("feedid"),
                employeeid = hisPlanEl.attr("employeeid"),
                plantype = hisPlanEl.attr("plantype"),
                hasbackward = hisPlanEl.attr("hasbackward"),
                isforward = false;
        var cur = rightbtEl.attr("class");
        if (cur != "cur") {
            isforward = false;
            readhisplan(feedid, employeeid, plantype, isforward);
        }
    });

    //保证dom准备好
    commentDialog.after('render', function() {
        //placeholder
        util.placeholder($('.aj-commenton-replycontent', commentDialog.element));
        //历史日志换人
        var commentChangeUserSp = new SelectPanel({
            "trigger": $('.change-user-l', commentDialog.element),
            "data": [
                {
                    "title": "同事",
                    "type": "p",
                    "list": contactData['p']
                }
            ],
            "singleCked": true
        });
        commentChangeUserSp.on('select', function(eventData) {

            var elEl = commentDialog.element,
                    hisPlanEl = $(".aj-hisplanel", elEl),
                    userInfoEl = $('.user-info', elEl),
                    userInfo;
            var attrValue = {};
            _.each(eventData, function(v, key) {
                _.each(v, function(itemData) {
                    _.extend(attrValue, {
                        "feedid": "0",
                        "employeeid": itemData.id,
                        "employeename": itemData.name
                    });
                });
            });
            hisPlanEl.attr(attrValue);
            readhisplan(attrValue.feedid, attrValue.employeeid, hisPlanEl.attr('plantype'), true); //向前找
            //更换个人信息
            userInfo = util.getContactDataById(attrValue.employeeid, 'p');
            userInfoEl.html('<img src="' + userInfo.profileImage + '" alt="" width="30" height="30" class="name-img"> <span class="name">' + userInfo.name + '</span>');

            commentChangeUserSp.hide();
            //隐藏后取消选中
            commentChangeUserSp.unselect('all', 'all', true);
        });
        commentDialog.element.on('click', '.change-user-l', function(evt) {
            commentChangeUserSp.show();
            evt.preventDefault();
        });
    });


    /* 获取历史日志 */
    var readhisplan = function(feedid, employeeid, plantype, isforward) {

        var elEl = commentDialog.element;
        util.api({
            "url": '/Feed/GetSomeOnePlanWithForwardOrBackward', //获取历史日志接口
            "type": 'get',
            "data": {
                "feedID": feedid, //信息源ID
                "employeeID": employeeid, //int员工 ID
                "planType": plantype, //int日志类型
                "isForward": isforward //bool是否往前查询
            },
            "dataType": 'json',
            "success": function(responseData) {
                var hisPlanEl = $(".aj-hisplanel", elEl),
                        hisTimeEl = $(".aj-histime", elEl),
                        historyfnEl = $(".dialy-history", elEl),
                        leftbtEl = $("i", historyfnEl),
                        rightbtEl = $("b", historyfnEl);
                var data = responseData.value,
                        otherWork = "",
                        todayWork = "",
                        tomorrowWork = "",
                        allWork = "";
                var feedContent = data.feedContent, //心得
                        report = data.report, //总结
                        planContent = data.planContent, //计划
                        feedID = data.feedID,
                        planType = data.planType, //日志类型
                        hasBackward = data.hasBackward, //之后是否有信息
                        hasForward = data.hasForward, //之前是否有信息
                        hisTime = data.createTime; //日期

                /* 左右按钮的置灰 */
                if (!hasBackward) {
                    rightbtEl.addClass("cur");
                } else {
                    rightbtEl.removeClass("cur");
                }
                if (!hasForward) {
                    leftbtEl.addClass("cur");
                } else {
                    leftbtEl.removeClass("cur");
                }

                if (responseData.success) {
                    otherWork = feedContent || '<p>&nbsp;</p>';
                    todayWork = report || '';
                    tomorrowWork = planContent || '';
                    hisTime = moment.unix(hisTime).format('MMMDD日 (dddd)');

                    // 按类型拼日志内容
                    switch (planType) {
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

                    /* 回复-上部(日志关键回复) */
                    var commentContent = data.commentContent, //目前通过是否有点评内容来判断是否显示领导点评，可能并不是特别合理
                            replyContentList = '',
                            senderName = '',
                            RCTime = '',
                            senderId = '',
                            profileImage = '',
                            replycontText = '',
                            operationText = '1',
                            replyContentStr = '',
                            replyconterText = '以下为日志点评人的点评';
                    if (commentContent) { //显示领导点评
                        RCTime = util.getDateSummaryDesc(moment.unix(data.replyTime), moment.unix(responseData.serviceTime), 1);
                        replycontText = commentContent;
                        profileImage = data.leader.profileImage;
                        senderName = data.leader.name;
                        /* 人名加链接 */
                        /*senderName = '<a href="#profile/=/empid-' + senderId + '"> ' + senderName + '</a>';*/
                        replyContentList = '<dl class="comment-list fn-clear"><dt><a class="master-reply-face-l" href="javascript:void(0);"><a href="javascript:;"><img src = "' + util.getAvatarLink(profileImage, '3') + '" / ></a></a></dt><dd><a href="javascript:;">' + senderName + '</a>：' + replycontText + ' (' + RCTime + '，点评)</dd></dl>';
                        replyContentStr = '<div class="reply-content"><div class="RC-arrow"><em class="S_line1_c">◆</em><span>◆</span></div><div class="RC-tit">' + replyconterText + '</div><div class="RC-feed">' + replyContentList + '</div></div>';
                    } else {
                        replyContentStr = "";
                    }
                    /*渲染*/

                    hisPlanEl.html(allWork + replyContentStr);

                    hisTimeEl.text(hisTime);
                    hisPlanEl.attr({
                        "feedid": feedID,
                        "hasbackward": hasBackward,
                        "hasforward": hasForward,
                        "employeeid": employeeid, //int员工 ID
                        "plantype": plantype //int日志类型
                    });
                    if (data.createTime == 0) {
                        hisPlanEl.html('<div class="list-empty-tip" style="display: block;"><img src="../../html/fs/assets/images/clear.gif" alt="loading" class="icon-empty">&nbsp;&nbsp;<span class="empty-text">暂无记录</span></div>');
                    }
                }
            }
        });
    };

    /* 点评的确定按钮 */
    commentDialog.element.on('click', '.commentonsend-btn', function() {
        var itemV = commentDialog.itemV,
                sb = commentDialog.sb,
                elEl = commentDialog.element,
                model = itemV.model;
        var replycontentEl = $(".aj-commenton-replycontent", elEl),
                issendEl = $(".aj-issend", elEl),
                selectEl = $(".commenton-select", elEl);
        var sbData = sb.getSelectedData(),
                memberData = [],
                memberDataP = sbData.p || [], //p是人的数据g是部门的数据
                memberDataG = sbData.g || []; //p是人的数据g是部门的数据
        memberData = memberData.concat(memberDataP, memberDataG);

        var feedid = model.get("feedID"),
                replycontent = replycontentEl.val(),
                rate = selectEl.val(),
                atemployeeids = memberData,
                issendsms = issendEl.is(':checked');
        if (!replycontent) { //如果内容为空则赋值评分内容
            replycontent = $("option:selected", selectEl).text();
        }
        if (replycontent.length > 2000) { //如果字数长度超过2000   
            util.alert('请控制输入在2000字内');
        } else {
            commentsendbtn(feedid, replycontent, rate, atemployeeids, issendsms);
        }
    });
    /* 点评窗口隐藏后数据清空 */
    commentDialog.after('hide', function() {
        var elEl = commentDialog.element;
        var replycontentEl = $(".aj-commenton-replycontent", elEl); //回复内容输入框
        var commentonSelectEl = $(".commenton-select", elEl); //评分下拉菜单
        commentonSelectEl.val(3);
        commentDialog.sb.removeAllItem(); //清空选人组件数据
        replycontentEl.val(""); //清空input内容

    });

    /* 点评提交的操作 */
    var commentsendbtn = function(feedid, replycontent, rate, atemployeeids, issendsms) {
        var itemV = commentDialog.itemV,
                sb = commentDialog.sb,
                elEl = commentDialog.element,
                model = itemV.model;
        var replycontentEl = $(".aj-commenton-replycontent", elEl),
                issendEl = $(".aj-issend", elEl),
                selectEl = $(".commenton-select", elEl);
        var atemployeename = '';
        _.each(atemployeeids, function(atemployeeid) {
            _.each(contactData.p, function(p) {
                if (p.id == atemployeeid) {
                    atemployeename += '@' + p.name + ' ';
                }
            });
        });


        util.api({
            "url": '/FeedPlan/ApproverComment ', //点评提交接口地址
            "type": 'post',
            "data": {
                "feedID": feedid, //信息源ID
                "replyContent": replycontent + ' ' + atemployeename, //回复内容
                "rate": Number(rate), //点评，枚举：Rate
                "atEmployeeIDs": atemployeeids, //抄送员工ID
                "isSendSms": issendsms //是否发送短信
            },
            "dataType": 'json',
            "success": function(responseData) {
                if (responseData.success) {
                    replycontentEl.val("");
                    commentDialog.hide();
                    commentDialog.itemV.updateModel(); //刷新列表
                }
            }
        }, {
            "submitSelector": $('.commentonsend-btn', elEl)
        });
    };

    /* 归档的弹出层 */
    var pofDialog = new Dialog({
        width: '370',
        content: tplEl.filter('.place-on-file-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });

    /* 弹出层取消按钮 */
    pofDialog.element.on('click', '.close-btn', function() {
        pofDialog.hide();
    });
    /* 归档窗口显示事件触发后的数据处理 */
    pofDialog.after('show', function() {


        var elEl = pofDialog.element,
                itemV = pofDialog.itemV,
                thisTags = pofDialog.thisTags,
                allTags = "",
                mytagwarpEl = $('.aj-mytagnames', elEl),
                tagnameselEL = $('.tagnamesel', elEl);
        /* 添加当前记录的归档标签到INPUT */

        tagnameselEL.val(thisTags);
        var myVal = tagnameselEL.val(),
                valArray = myVal.split(" ");
        //        myVal = $.trim(myVal); //去掉前后空格
        /*获取全部归档的标签*/
        //        thisTags = $.trim(thisTags); //去掉前后空格
        util.api({
            "url": '/FeedArchive/GetMyFeedArchiveTags', //获取归档全部标签接口地址
            "type": 'get',
            "data": {},
            "dataType": 'json',
            "success": function(responseData) {
                _.each(responseData.value, function(tags) {
                    var tn = tags.tagName,
                            tnHtmll = '<a href="#" class="place-tap">',
                            tnHtmlr = '</a>';
                    if (tn) {
                        for (var n in valArray) {
                            if (valArray[n] == tn) {
                                tnHtmll = '<a href="#" class="place-tap cur">';
                            }
                        }
                    } else {
                        allTags = "";
                    }
                    allTags += tnHtmll + tn + tnHtmlr;
                });
                mytagwarpEl.html("").append(allTags);
            }
        });

    });
    /* 归档窗口隐藏后数据清空 */
    pofDialog.after('hide', function() {
        var elEl = pofDialog.element,
                tagnameselEL = $('.tagnamesel', elEl);
        pofDialog.thisTags = "";
    });

    /* 点击归档标签 将内容添加到输入框 */
    pofDialog.element.on('click', '.aj-mytagnames a', function() {
        var elEl = pofDialog.element;
        var tagnamesEl = $('.tagnamesel', elEl);
        var myVal = $.trim(tagnamesEl.val()); //去掉前后空格
        var valArray = myVal.split(" ");
        var aLength = valArray.length;
        var myText = '';
        if (!myVal) {
            myText = $(this).text();
        } else {
            myText = ' ' + $(this).text();
        }
        if (aLength < 3) {
            if ($(this).attr('class') != 'place-tap cur') {
                tagnamesEl.val(myVal + myText);
                $(this).addClass('cur');
            }
        }
        return false;
    });
    /* 归档的输入框内容限制 */

    pofDialog.element.on('keydown', '.tagnamesel', function(evt) {
        var valArrayNew = [];
        var elEl = pofDialog.element,
                tagnamesEl = $('.tagnamesel', elEl),
                myVal = tagnamesEl.val(),
                myValFm = $.trim(myVal), //去掉前后空格
                valArray = myValFm.split(" "),
                valArrayN = [],
                aLength = valArray.length;

        evt = (evt) ? evt : window.event;
        if (evt.keyCode != 46 && evt.keyCode != 8 && evt.keyCode != 37 && evt.keyCode != 39) { //排除一些按键，如del,backspace,left……

            for (var n in valArray) {

                if (valArray[n].length > 12) { //每个数组元素的字符长度不能超过12
                    valArrayN = valArray[n].substr(0, valArray[n].length - 1); //超过12就把末尾字符删除
                    valArray[n] = valArrayN;
                    valArray = valArray.join(' ');
                    tagnamesEl.val(valArray);
                }
            }
        }
        if (evt.keyCode == 32) { //敲空格的时候		
            if (myVal.slice(-1) == " ") {
                return false;
            }
            for (var m in valArray) {
                if (aLength >= 3) { //数组内容大于3个的时候
                    return false;
                }
            }
        }
    });

    /* 归档的输入框内容包含标签时 标签变暗 */
    pofDialog.element.on('keyup', '.tagnamesel', function() {
        var elEl = pofDialog.element,
                tagnamesEl = $('.tagnamesel', elEl),
                tagtextEl = $('.aj-mytagnames a', elEl),
                myVal = tagnamesEl.val();
        myVal = $.trim(myVal); //去掉前后空格
        var valArray = myVal.split(" ");
        for (var n in valArray) {
            tagtextEl.each(function(i) {
                if (valArray[n] != tagtextEl.eq(i).text()) {
                    tagtextEl.eq(i).removeClass('cur');
                }
            });
        }
        for (var m in valArray) {
            tagtextEl.each(function(i) {
                if (valArray[m] == tagtextEl.eq(i).text()) {
                    tagtextEl.eq(i).addClass('cur');
                }
            });
        }
        return false;
    });

    /* 归档确定按钮 */
    pofDialog.element.on('click', '.aj-pof-btn', function() {
        var elEl = pofDialog.element,
                tagnamesEl = $('.tagnamesel', elEl),
                tagnames = tagnamesEl.val().split(" ");

        var itemV = pofDialog.itemV,
                model = itemV.model,
                feedid = model.get("feedID"),
                feedtype = model.get("feedType");

        if (isEmpty(tagnamesEl)) { //如果为空暂定操作  
            pofbtn(feedid, feedtype, tagnames);
        }
    });

    /* 提交归档的操作 */
    var pofbtn = function(feedid, feedtype, tagnames) {
        var elEl = pofDialog.element,
                tagnamesEl = $('.tagnamesel', elEl);
        var itemV = pofDialog.itemV,
                model = itemV.model,
                archiveData = model.get('archiveData'),
                originData = model.get('originData');
        var feedID = originData.feedID;


        util.api({
            "url": '/FeedArchive/SaveFeedArchive', //接口地址
            "type": 'post',
            "data": {
                "feedID": feedid, //信息源ID
                "feedType": feedtype, //信息源类型
                "tagNames": tagnames //标签，必填，空格分割，最多三个
            },
            "dataType": 'json',
            "success": function(responseData) {

                var that = this;
                if (responseData.success) {

                    var o = new Dialog({
                        width: '',
                        closeTpl: '',
                        content: '<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> 归档成功</div>',
                        className: 'common-style-richard fs-feed-comment-dialog'
                    }).render();
                    o.show();
                    setTimeout(function() {
                        o.hide();
                    }, 1500);
                    // itemV.updateModel(); //刷新列表


                    tagnamesEl.val("");
                    pofDialog.hide();
                    //刷新结构
                    /*model.set('archive', feedHelper.renderArchiveBar({
                     "archiveTime": archiveData.archiveTime,
                     "tags": _.map(tagnames, function(tagName) {
                     return {
                     "tagName": tagName
                     };
                     })
                     }, {
                     "serviceTime": originData.serviceTime
                     }));*/
                    itemV.reRenderArchive(feedHelper.renderArchiveBar({
                        "archiveTime": archiveData.archiveTime,
                        "tags": _.map(tagnames, function(tagName) {
                            return {
                                "tagName": tagName
                            };
                        })
                    }, {
                        "serviceTime": originData.serviceTime
                    }));

                    var itmevEl = itemV.$el;
                    var placeonfileBtnEl = $('.aj-placeonfile', itmevEl);
                    placeonfileBtnEl.text('取消归档').attr('class', 'aj-unplaceonfile aj-feed-fn-com-btn');

                }
            }
        }, {
            "submitSelector": $('.aj-pof-btn', elEl)
        });
    };

    /* 转发的弹出层 */
    var fwdDialog = new Dialog({
        width: '500',
        content: tplEl.filter('.forward-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });
    var fwdDialogRender = function() { //转发添加选人组件
        var elEl,
                el,
                pedTitleEl;
        var myId = currentUserData.employeeID; //我的id
        elEl = fwdDialog.element;
        pedTitleEl = $('.fwd-title', elEl); //内容
        el = $('.aj-forwarder', elEl);

        //把自己排除 过滤
        /*for (var i = 0; i < contactData.p.length; i++) {
         if (contactData.p[i].id == myId) {
         contactData.p.splice(i, 1);
         }
         };*/
        var sbEmployeeData = util.excludeContactData([myId], 'p');
        var sb = new SelectBar({
            "element": el,
            "data": [
                {
                    "title": "同事",
                    "type": "p",
                    "list": sbEmployeeData //数据来源通过contactData获取(已排除自己)
                }
            ],
            "singleCked": false, //单选？
            "title": "添加转发人",
            "autoCompleteTitle": "请输入姓名或拼音"
        });
        var atInput = new AtInput({
            "element": pedTitleEl,
            "withAt": true
        });
        $('.close-btn', fwdDialog.element).click(function() {
            fwdDialog.hide();
        });
        //保存select bar引用
        fwdDialog.sb = sb;
        fwdDialog.atInput = atInput;

        pedTitleEl.val(""); //ie10下需要做清空处理
    };


    /* 转发的确定按钮 */
    fwdDialog.element.on('click', '.fwdsend-btn', function() {

        var sb = fwdDialog.sb;
        var elEl = this.element,
                isimportantEl = $('.is-important', elEl),
                pedTitleEl = $('.fwd-title', elEl); //内容

        var sbData = sb.getSelectedData(),
                memberData = sbData.p || []; //p是人的数据g是部门的数据
        var ditemV = fwdDialog.itemV,
                model = ditemV.model,
                feedid = model.get("feedID"),
                replycontent = pedTitleEl.val(),
                replytoReplyid = 0,
                replytoemployeeid = 0,
                fileinfos = [],
                issendsms = false;
        _.each(memberData, function(itemId) {
            var itemData = sb.getItemData(itemId, 'p');
            replycontent += '@' + itemData.name + ' ';
        });
        //验证
        if (memberData.length == 0) {
            $('.input-tip', sb.element).click();
            return false;
        }
        if (isEmpty(pedTitleEl) && memberData.length != 0) { //如果为空暂定操作     
            if (replycontent.length > 2000) { //如果字数长度超过2000   
                util.alert('请控制输入在2000字内');
                //pedTitleEl.val(replycontent.substring(0, 2000)); //把2000字后面的内容删掉
            } else {
                fwdsendbtn(feedid, replycontent, replytoReplyid, replytoemployeeid, fileinfos, issendsms);
            }
        }
    });
    /* 转发窗口显示后 */
    fwdDialog.after('show', function() {
        if (!fwdDialog.sb) {
            fwdDialogRender();
        }
        $('.fwd-title', this.element).trigger('autosize.resize');
    });
    /* 转发窗口隐藏后数据清空 */
    fwdDialog.after('hide', function() {
        var elEl = fwdDialog.element,
                replycontentEl = $(".fwd-title", elEl);
        fwdDialog.sb.removeAllItem(); //清空选人组件数据
        replycontentEl.val("").trigger('autosize.resize'); //清空input内容
    });

    /* 转发提交的操作 */
    var fwdsendbtn = function(feedid, replycontent, replytoReplyid, replytoemployeeid, fileinfos, issendsms) {
        util.api({
            "url": '/Feed/SendFeedReplyForTransmit', //转发接口地址
            "type": 'post',
            "data": {
                "feedID": feedid, //信息源ID
                "replyContent": replycontent, //回复内容
                "replyToReplyID": replytoReplyid, //如果是回复的回复，则填写被回复的回复的ID
                "replyToEmployeeID": replytoemployeeid, //如果是回复的回复，则填写被回复的回复的发出人的ID
                "fileInfos": fileinfos, //附件
                "isSendSms": issendsms //是否发送短信
            },
            "dataType": 'json',
            "success": function(responseData) {
                var elEl = fwdDialog.element,
                        isimportantEl = $('.is-important', elEl),
                        pedTitleEl = $('.ped-title', elEl);
                if (responseData.success) {
                    fwdDialog.hide();
                    pedTitleEl.val("");
                    fwdDialog.sb.removeAllItem();
                    fwdDialog.itemV.addReplyCountPlusOne();
                    // fwdDialog.itemV.updateModel(); //刷新列表
                }
            }
        }, {
            "submitSelector": $('.fwdsend-btn', fwdDialog.element)
        });
    };

    /* 待办的弹出层 */
    var pedDialog = new Dialog({
        width: '500',
        content: tplEl.filter('.pending-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });
    var pedDialogRender = function() { //待办添加选人组件
        var elEl,
                el,
                titleEl;

        elEl = pedDialog.element;
        el = $('.aj-peder', elEl);
        titleEl = $('.ped-title', elEl);
        var sb = new SelectBar({
            "element": el,
            "data": [
                {
                    "title": "同事",
                    "type": "p",
                    "list": contactData["p"] //数据来源通过contactData获取
                }
            ],
            "singleCked": false, //单选？
            "title": "选择同事",
            "autoCompleteTitle": "请输入姓名或拼音"
        });
        var atInput = new AtInput({
            "element": titleEl
        });
        $('.close-btn', pedDialog.element).click(function() {
            pedDialog.hide();
        });
        //保存select bar引用
        pedDialog.sb = sb;
        pedDialog.atInput = atInput;
    };


    /* 待办窗口显示事件触发后的数据处理 */
    pedDialog.after('show', function() {
        if (!pedDialog.sb) {
            pedDialogRender();
        }

        var itemV = this.itemV,
                model = itemV.model,
                elEl = this.element,
                sb = pedDialog.sb,
                typeEl = $(".ped-feedtype", elEl),
                contentEl = $(".ped-feedContent", elEl),
                titleEl = $(".ped-title", elEl);
        var feedType = model.get("feedTypeDescription");
        var originData = model.get("originData");
        var feedContents = originData.feedContent;
        var formatText = '';
        var reportContentDataText = '';
        var planContentDatasText = '';
        var planData = originData.plan || null; //日志数据
        var reportContentDatas, planContentDatas;

        _.each(feedContents, function(feedContent) {
            formatText += feedContent.text;
        });
        if (planData) {
            reportContentDatas = planData.reportContent || ''; //今日工作总结
            planContentDatas = planData.planContent || ''; //明日工作计划
            //如果是日志类型要把内容拼起来
            _.each(reportContentDatas, function(reportContentData) {
                reportContentDataText += reportContentData.text;
            });
            _.each(planContentDatas, function(planContentData) {
                planContentDatasText += planContentData.text;
            });
            formatText = reportContentDataText + ' ' + planContentDatasText + ' ' + formatText;

        } else {
            formatText = formatText.replace(/<br\/>/g, ' '); //去掉换行符变成空格
            formatText = formatText.replace(/\n+/g, ' '); //去掉换行符变成空格
        }

        var sCutFormatText = flutil.cutStrForNum(formatText, 20).toString(); //截取字符长度用...补全
        typeEl.html(feedType);
        contentEl.html(sCutFormatText);
        titleEl.val(sCutFormatText).trigger('autosize.resize');
        sb.addItem(currentUserData); //选人组件设置默认值，这里传的是自己
    });

    /* 待办窗口隐藏后数据清空 */
    pedDialog.after('hide', function() {
        var elEl = pedDialog.element,
                replycontentEl = $(".ped-title", elEl),
                isimportantEl = $(".is-important", elEl);
        pedDialog.sb.removeAllItem(); //清空选人组件数据
        replycontentEl.val("").trigger('autosize.resize'); //自适应高度需触发keyup事件 //清空input内容
        // isimportantEl.removeAttr("checked"); //重要事项取消勾选
        isimportantEl.prop("checked", false);
    });
    /* 点击文本后添加到待办标题input中 */
    pedDialog.element.on('click', '.ped-feedContent', function() {
        var elEl = pedDialog.element,
                pedTitleEl = $('.ped-title', elEl),
                myText = $(this).text();

        pedTitleEl.val(myText);
        return false;
    });
    /* 待办的确定按钮 */
    pedDialog.element.on('click', '.pedsend-btn', function() {
        var sb = pedDialog.sb;
        var elEl = pedDialog.element,
                isimportantEl = $('.is-important', elEl),
                pedTitleEl = $('.ped-title', elEl),
                isimportantchecked = isimportantEl.is(':checked');

        var sbData = sb.getSelectedData(),
                memberData = sbData.p || []; //p是人的数据g是部门的数据
        var ditemV = pedDialog.itemV,
                model = ditemV.model,
                feedid = model.get("feedID"),
                employeeids = memberData,
                feedtype = model.get("feedType"),
                title = pedTitleEl.val(),
                isimportant = isimportantchecked;
        if (isEmpty(pedTitleEl) && memberData.length != 0) { //如果为空暂定操作
            pedsendbtn(feedid, employeeids, title, feedtype, isimportant);
        }
    });

    /* 待办提交的操作 */
    var pedsendbtn = function(feedid, employeeids, title, feedtype, isimportant) {
        var itemV = pedDialog.itemV,
                worktodoCb = itemV.options.worktodoCb; //待办回调
        if (title.length > 1000) { //如果字数长度超过1000   
            util.alert('请控制输入在1000字内');
            return false;
        } else {
            util.api({
                "url": '/Worktodolist/AddWorkToDoList', //添加待办接口地址
                "type": 'post',
                "data": {
                    "feedID": feedid, //信息源ID
                    "feedType": feedtype, //类型
                    "employeeIDs": employeeids, //员工范围
                    "title": title, //标题
                    "isImportant": isimportant //是否重要
                },
                "dataType": 'json',
                "success": function(responseData) {
                    var elEl = pedDialog.element,
                            pedTitleEl = $('.ped-title', elEl);
                    if (responseData.success) {
                        pedDialog.hide();
                        pedTitleEl.val("");
                        pedDialog.sb.removeAllItem();
                        worktodoCb && worktodoCb.call(itemV, responseData);
                    }
                }

            }, {
                "submitSelector": $('.pedsend-btn', pedDialog.element)
            });
        }
    };

    /* 批复-同意的弹出层 */
    var appryesDialog = new Dialog({
        width: '525',
        content: tplEl.filter('.appryes-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });
    var appryesDialogRender = function() { //批复-同意添加选人组件
        var elEl = appryesDialog.element;
        var apperEl = $('.appryes-apper', elEl);
        var ccerEl = $('.appryes-ccer', elEl);

        var appersb = new SelectBar({
            "element": apperEl,
            "data": [
                {
                    "title": "同事",
                    "type": "p",
                    "list": [] //数据来源通过contactData获取
                }
            ],
            "singleCked": true, //单选？
            "title": "选择下一个审批人（一个）",
            "acInitData": util.getPublishDefaultUser('approveApprovers'),
            "autoCompleteTitle": "请输入姓名或拼音"
        });
        var ccersb = new SelectBar({
            "element": ccerEl,
            "data": [
                {
                    "title": "同事",
                    "type": "p",
                    "list": [] //数据来源通过contactData获取
                }
            ],
            "singleCked": false, //单选？
            "title": "添加抄送人",
            "autoCompleteTitle": "请输入姓名或拼音"
        });
        //at input
        appryesDialog.atInput = new AtInput({
            "element": $('.appryes-content-input', elEl),
            "withAt": true
        });
        $('.close-btn', appryesDialog.element).click(function() {
            appryesDialog.hide();
        });
        //保存select bar引用
        appryesDialog.appersb = appersb;
        appryesDialog.ccersb = ccersb;
    };
    appryesDialog.after('show', function() {
        var defaultApproveData = util.getPublishDefaultUser('approveApprovers');
        var itemV = appryesDialog.itemV;
        var model = itemV.model;
        var originData = model.get("originData");
        var myId = currentUserData.employeeID; //我的id
        var sbEmployeeData = util.excludeContactData([myId, originData.sender.employeeID], 'p'),
                sbData = [{
                        "title": "同事",
                        "type": "p",
                        "list": sbEmployeeData //数据来源通过contactData获取
                    }];

        if (!appryesDialog.appersb) {
            appryesDialogRender();
        }
        //更新组件数据源
        appryesDialog.appersb.updateData(sbData);
        appryesDialog.ccersb.updateData(sbData);
        //修正默认审批人，filter掉发出审批的用户
        defaultApproveData[0].store = _.reject(defaultApproveData[0].store, function(itemData) {
            return itemData.id == originData.employeeID;
        });
        appryesDialog.appersb.setAcInitData(defaultApproveData);
    });
    /* 批复-同意窗口隐藏后数据清空 */
    appryesDialog.after('hide', function() {
        var elEl = appryesDialog.element,
                contentEl = $(".appryes-content-input", elEl),
                issendmsEl = $(".is-sendms", elEl);
        contentEl.val("同意。").css({
            'height': '90px'
        });
        appryesDialog.appersb.removeAllItem(); //清空选人组件数据  
        appryesDialog.ccersb.removeAllItem(); //清空选人组件数据        
        issendmsEl.prop("checked", false); //取消勾选
    });

    /* 批复-同意的确定按钮 */
    appryesDialog.element.on('click', '.appryes-btn', function() {
        var appersb = appryesDialog.appersb,
                ccersb = appryesDialog.ccersb,
                appersbData = appersb.getSelectedData(),
                approverid = appersbData.p || [], //p是人的数据g是部门的数据
                ccersbData = ccersb.getSelectedData(),
                employeeids = ccersbData.p || []; //p是人的数据g是部门的数据
        var elEl = this.element,
                issendEl = $('.is-sendms', elEl),
                contentEl = $('.appryes-content-input', elEl),
                issendsms = issendEl.is(':checked'),
                replycontent = contentEl.val();
        var itemV = appryesDialog.itemV,
                model = itemV.model,
                feedid = model.get("feedID");

        approverid = Number(approverid[0]);
        var operationtype = 1;

        var employeeNames = '';
        _.each(employeeids, function(employeeId) {
            employeeNames += '@' + util.getContactDataById(employeeId, 'p').name + ' ';
        });
        if (employeeNames) {
            replycontent += employeeNames;
        }
        if (isEmpty(contentEl)) { //如果为空暂定操作    
            appryesbtn(feedid, replycontent, approverid, operationtype, employeeids, issendsms);
        }
    });

    /* 批复-同意提交的操作 */
    var appryesbtn = function(feedid, replycontent, approverid, operationtype, employeeids, issendsms) {

        var surl = '/FeedApprove/ApproverSendFeedReply'; //批复同意接口地址
        var elEl = appryesDialog.element,
                contentEl = $('.appryes-content-input', elEl);
        if (approverid) {
            surl = '/FeedApprove/AgreeToNextApprover'; //批复同意并转发下一个审批人的接口地址
        }

        util.api({
            "url": surl,
            "type": 'post',
            "data": {
                "feedID": feedid, //信息源ID
                "replyContent": replycontent, //回复内容
                "approverID": approverid, //审批人ID，可以为0
                "operationType": operationtype, //操作类型：枚举FeedApproveOperationType 同意1，不同意2，取消3
                "employeeIDs": employeeids, //抄送员工ID
                "isSendSms": issendsms //是否发送短信
            },
            "dataType": 'json',
            "success": function(responseData) {
                if (responseData.success) {
                    contentEl.val("同意。");
                    appryesDialog.appersb.removeAllItem(); //清空选人组件数据
                    appryesDialog.ccersb.removeAllItem(); //清空选人组件数据
                    appryesDialog.hide(); //隐藏弹出层
                    appryesDialog.itemV.updateModel(); //刷新列表
                }
            }
        }, {
            "submitSelector": $('.appryes-btn', elEl)
        });
    };

    /* 批复-不同意的弹出层 */
    var apprnoDialog = new Dialog({
        width: '525',
        content: tplEl.filter('.apprno-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });
    apprnoDialog.after('show', function() {
        var myId = currentUserData.employeeID; //我的id
        var itemV = apprnoDialog.itemV;
        var model = itemV.model;
        var originData = model.get("originData");
        var sbEmployeeData = util.excludeContactData([myId, originData.sender.employeeID], 'p'),
                sbData = [{
                        "title": "同事",
                        "type": "p",
                        "list": sbEmployeeData //数据来源通过contactData获取
                    }];
        if (!apprnoDialog.sb) {
            apprnoDialogRender();
        }
        //更新组件数据
        apprnoDialog.sb.updateData(sbData);
    });
    /* 批复-不同意窗口隐藏后数据清空 */
    apprnoDialog.after('hide', function() {
        var elEl = apprnoDialog.element,
                contentEl = $(".apprno-content-input", elEl),
                issendmsEl = $(".is-sendms", elEl);
        contentEl.val("不同意。").css({
            'height': '90px'
        });
        apprnoDialog.sb.removeAllItem(); //清空选人组件数据        
        issendmsEl.prop("checked", false); //取消勾选
    });
    var apprnoDialogRender = function() { //批复-不同意添加选人组件
        var elEl = apprnoDialog.element;
        var el = $('.apprno-ccer', elEl);
        var sb = new SelectBar({
            "element": el,
            "data": [
                {
                    "title": "同事",
                    "type": "p",
                    "list": [] //数据来源通过contactData获取
                }
            ],
            "singleCked": false, //单选？
            "title": "添加抄送人",
            "autoCompleteTitle": "请输入姓名或拼音"
        });
        //at input
        apprnoDialog.atInput = new AtInput({
            "element": $('.apprno-content-input', elEl),
            "withAt": true
        });
        $('.close-btn', apprnoDialog.element).click(function() {
            apprnoDialog.hide();
        });
        //保存select bar引用
        apprnoDialog.sb = sb;
    };


    /* 批复-不同意的确定按钮 */
    apprnoDialog.element.on('click', '.apprno-btn', function() {
        var sb = apprnoDialog.sb,
                ccersbData = sb.getSelectedData(),
                employeeids = ccersbData.p || []; //p是人的数据g是部门的数据
        var elEl = apprnoDialog.element,
                issendEl = $('.is-sendms', elEl),
                contentEl = $('.apprno-content-input', elEl),
                issendsms = issendEl.is(':checked'),
                replycontent = contentEl.val();
        var itemV = apprnoDialog.itemV,
                model = itemV.model,
                feedid = model.get("feedID");


        var approverid = 0,
                operationtype = 2;

        var employeeNames = '';
        _.each(employeeids, function(employeeId) {
            employeeNames += '@' + util.getContactDataById(employeeId, 'p').name + ' ';
        });
        if (employeeNames) {
            replycontent += employeeNames;
        }
        if (isEmpty(contentEl)) {
            apprnobtn(feedid, replycontent, approverid, operationtype, employeeids, issendsms);
        }
    });

    /* 批复-不同意提交的操作 */
    var apprnobtn = function(feedid, replycontent, approverid, operationtype, employeeids, issendsms) {
        var elEl = apprnoDialog.element,
                contentEl = $('.apprno-content-input', elEl);
        util.api({
            "url": '/FeedApprove/ApproverSendFeedReply', //批复不同意接口地址
            "type": 'post',
            "data": {
                "feedID": feedid, //信息源ID
                "replyContent": replycontent, //回复内容
                "approverID": approverid, //审批人ID，可以为0
                "operationType": operationtype, //操作类型：枚举FeedApproveOperationType 同意1，不同意2，取消3
                "employeeIDs": employeeids, //抄送员工ID
                "isSendSms": issendsms //是否发送短信
            },
            "dataType": 'json',
            "success": function(responseData) {

                if (responseData.success) {
                    contentEl.val("不同意。");
                    apprnoDialog.sb.removeAllItem(); //清空选人组件数据
                    apprnoDialog.hide(); //隐藏弹出层
                    apprnoDialog.itemV.updateModel(); //刷新列表
                }
            }
        }, {
            "submitSelector": $('.apprno-btn', elEl)
        });
    };


    /* 批复-历史的弹出层 */
    var historyDialog = new Dialog({
        width: '580',
        content: tplEl.filter('.apprhis-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });


    /* 指令回复-执行中-普通回复的弹出层 */
    var workingNormDialog = new Dialog({
        width: '580',
        content: tplEl.filter('.working-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });

    /* 指令回复-执行中-普通回复的弹出层 */
    var workingFiniDialog = new Dialog({
        width: '580',
        content: tplEl.filter('.workingfini-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });

    /* 指令回复-发出的-未完成的弹出层 */
    var workUnFiniDialog = new Dialog({
        width: '580',
        content: tplEl.filter('.workunfini-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });

    /* 指令回复-发出的-已完成的弹出层 */
    var workFiniDialog = new Dialog({
        width: '580',
        content: tplEl.filter('.workfini-box').html(),
        className: 'common-style-richard fs-feed-comment-dialog'
    });

    //发出的指令回复-未完成继续执行
    var SwrUndoneDialog = Dialog.extend({
        "attrs": {
            itemV: null, //与dialog绑定的item view
            content: tplEl.filter('.swr-undone-tpl').html(),
            className: 'common-style-richard feed-swr-undone-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                    swrUndoneInputEl = $('.swr-undone-input', elEl);
            //标题不能为空
            if (requestData["replyContent"].length == 0) {
                util.showInputError(swrUndoneInputEl);
                passed = false;
            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var elEl = this.element,
                    swrUndoneInputEl = $('.swr-undone-input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            //feedid
            requestData["feedID"] = originData.feedID;
            //reply content
            requestData["replyContent"] = _.str.trim(swrUndoneInputEl.val());
            //操作类型
            requestData["operationType"] = 2; //设置为未完成
            //发送短信
            requestData["isSendSms"] = isSendSmsEl.prop('checked');
            //评分在这里没意义
            requestData["rate"] = 0;
            //抄送员工在这里没意义
            requestData["atEmployeeIDs"] = [];
            return requestData;
        },
        _renderCpt: function() {
            var elEl = this.element,
                    inputEl = $('.swr-undone-input', elEl);
            var atInput = new AtInput({
                "element": inputEl,
                "withAt": true
            });
            this.atInput = atInput;
        },
        "clearForm": function() {
            var elEl = this.element,
                    swrUndoneInputEl = $('.swr-undone-input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            swrUndoneInputEl.val("");
            isSendSmsEl.prop('checked', false);
        },
        "hide": function() {
            var result = SwrUndoneDialog.superclass.hide.apply(this, arguments);
            this.clearForm();
            return result;
        },
        "render": function() {
            var result = SwrUndoneDialog.superclass.render.apply(this, arguments);
            this._renderCpt();
            return result;
        },
        "_submit": function(evt) {
            var that = this;
            var requestData = this.getRequestData();
            var itemV = this.get('itemV');
            var itemEl = itemV.$el;
            var fsReply = itemEl.data('fsReply');
            var elEl = this.element;
            var swrUndoneInputEl = $('.swr-undone-input', elEl);

            if (this.isValid()) {

                if (swrUndoneInputEl.val().length > 2000) { //如果字数长度超过2000   
                    util.alert('请控制输入在2000字内');
                } else {

                    util.api({
                        type: 'post',
                        data: requestData,
                        url: '/FeedWork/AssignerSendFeedWorkReply',
                        success: function(responseData) {
                            if (responseData.success) {
                                //隐藏本身
                                that.hide();
                                that.clearForm();
                                //向回复列表里插入一条新数据
                                fsReply.addNewReply(responseData.value);
                                that.get('successCb').call(that, responseData, requestData);
                                itemV.updateModel(); //刷新列表
                            }
                        }
                    });
                }
            }

            evt.preventDefault();
        },
        "_cancel": function(evt) {
            this.clearForm();
            this.hide();
            evt.preventDefault();
        },
        "destroy": function() {
            var result;
            this.atInput && this.atInput.destroy();
            result = SwrUndoneDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    var swrUndoneDialog = new SwrUndoneDialog(); //创建实例
    //发出的指令回复-指令已完成点评结果
    var SwrDoneDialog = Dialog.extend({
        "attrs": {
            itemV: null, //与dialog绑定的item view
            content: tplEl.filter('.swr-done-tpl').html(),
            className: 'common-style-richard feed-swr-done-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = Dialog.superclass.render.apply(this, arguments);
            this._renderCpt();
            return result;
        },
        "show": function() {
            var elEl = this.element;
            var inputEl = $('.swr-done-input', elEl);
            var rateEl = $('.rate-wrapper select', elEl);
            var result = SwrDoneDialog.superclass.show.apply(this, arguments);
            inputEl.trigger('autosize.resize'); //重新调整输入框高度
            rateEl.val(3); //选择3星
            return result;
        },
        "hide": function() {
            var result = SwrDoneDialog.superclass.hide.apply(this, arguments);
            this.clearForm();
            return result;
        },
        _renderCpt: function() {
            var elEl = this.element,
                    copytoSbEl = $('.copyto-sb', elEl),
                    mediaEl = $('.media', elEl),
                    inputEl = $('.swr-done-input', elEl);
            var atInput = new AtInput({
                "element": inputEl
            });
            var sb = new SelectBar({
                "element": copytoSbEl,
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": contactData['p']
                    }
                ],
                "title": "添加抄送人",
                "acInitData": util.getPublishRange('work'),
                "singleCked": false, //可以多选
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            var media = new MediaMaker({
                "element": mediaEl,
                "action": ["at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    }
                }
            });
            copytoSbEl.data('sb', sb);
            this.media = media;
            this.atInput = atInput;
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                    swrDoneInputEl = $('.swr-done-input', elEl);
            //标题不能为空
            if (requestData["replyContent"].length == 0) {
                util.showInputError(swrDoneInputEl);
                passed = false;
            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var elEl = this.element,
                    swrDoneInputEl = $('.swr-done-input', elEl),
                    rateSelectEl = $('.rate', elEl),
                    copytoSbEl = $('.copyto-sb', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            var employeeAtNames = '';
            var sb = copytoSbEl.data('sb'),
                    sbData = sb.getSelectedData();
            //把抄送人的信息添加到内容中
            var memberData = sbData.p || []; //p是人的数据g是部门的数据
            _.each(memberData, function(memberId) {
                employeeAtNames += '@' + util.getContactDataById(memberId, 'p').name + ' ';
            });
            //feedid
            requestData["feedID"] = originData.feedID;
            //reply content
            requestData["replyContent"] = _.str.trim(swrDoneInputEl.val()) + ' ' + employeeAtNames;
            //操作类型
            requestData["operationType"] = 4; //设置为点评状态
            //发送短信
            requestData["isSendSms"] = isSendSmsEl.prop('checked');
            //评分
            requestData["rate"] = rateSelectEl.val();
            //抄送员工
            requestData["atEmployeeIDs"] = sbData['p'] || [];
            return requestData;
        },
        "clearForm": function() {
            var elEl = this.element,
                    copytoSbEl = $('.copyto-sb', elEl),
                    swrDoneInputEl = $('.swr-done-input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            var sb = copytoSbEl.data('sb');
            sb.removeAllItem(); //清空选人组件数据
            swrDoneInputEl.val("");
            isSendSmsEl.prop('checked', false);
        },
        "_submit": function(evt) {
            var that = this;
            var requestData = this.getRequestData();
            var itemV = this.get('itemV'),
                    itemEl = itemV.$el,
                    fsReply = itemEl.data('fsReply');
            var elEl = this.element;
            var blankReg = new RegExp('^\s*$'); //全是空格的正则
            var swrdoneInputEl = $('.swr-done-input', elEl);
            var swrdoneInputVal = swrdoneInputEl.val(); //点评的内容
            swrdoneInputVal = _.str.trim(swrdoneInputVal); //过滤前后空格和回车
            if (blankReg.test(swrdoneInputVal)) { //如果输入全是空格就把内容变成空
                swrdoneInputEl.val('');
            }
            if (this.isValid()) {
                if (swrdoneInputEl.val().length > 2000) { //如果字数长度超过2000   
                    util.alert('请控制输入在2000字内');
                } else {
                    if (isEmpty(swrdoneInputEl)) {
                        util.api({
                            type: 'post',
                            data: requestData,
                            url: '/FeedWork/AssignerSendFeedWorkReply',
                            success: function(responseData) {
                                if (responseData.success) {
                                    //隐藏本身
                                    that.hide();
                                    that.clearForm();
                                    //向回复列表里插入一条新数据
                                    fsReply.addNewReply(responseData.value);
                                    //刷新本条信息打开回复列表
                                    itemV.updateModel(function() {
                                        $('.aj-Reply', itemEl).click();
                                    });
                                    that.get('successCb').call(that, responseData, requestData);
                                }
                            }
                        });
                    }


                }
            }

            evt.preventDefault();
        },
        "_cancel": function(evt) {
            this.clearForm();
            this.hide();
            evt.preventDefault();
        },
        "destroy": function() {
            var result;
            this.media && this.media.destroy();
            this.media = null;
            this.atInput && this.atInput.destroy();
            this.atInput = null;
            result = Dialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    var swrDoneDialog = new SwrDoneDialog(); //创建实例
    //发出的指令回复-取消指令，转他人执行
    SwrCanceDialog = Dialog.extend({
        "attrs": {
            width: 675,
            itemV: null, //与dialog绑定的item view
            content: tplEl.filter('.swr-cancel-tpl').html(),
            className: 'common-style-richard feed-swr-cancel-dialog',
            successCb: function(responseData, requestData) { //提交成功后回调，默认调用feed的转他人执行回调
                var itemV = this.get('itemV'),
                        itemOpts = itemV.options;
                itemOpts.delegateOtherCb && itemOpts.delegateOtherCb.call(itemV, responseData, requestData);
            }
        },
        "events": {
            'click .sms-warn-radio input': '_smsWarnCounts',
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "_smsWarnCounts": function(e) { //监听短信提醒，动态设置短信提醒时间
            var elEl = this.element;
            var meVal = $(e.currentTarget).val();
            var smsWarnItemEl = $('.sms-warn-item', elEl); //短信提醒设置条数
            var smsWarnCountsVal = 0;
            switch (parseInt(meVal)) {
                case 1:
                    smsWarnItemEl.hide();
                    smsWarnCountsVal = 0;
                    break
                case 2:
                    smsWarnItemEl.hide();
                    smsWarnItemEl.eq(0).show();
                    smsWarnCountsVal = 1;
                    break
                case 3:
                    smsWarnItemEl.show();
                    smsWarnItemEl.eq(2).hide();
                    smsWarnCountsVal = 2;
                    break
                case 4:
                    smsWarnItemEl.show();
                    smsWarnCountsVal = 3;
                    break
            }
            this.smsWarnCountsVal = smsWarnCountsVal; //把当前短信提醒几次保存起来 为了后面做判断
        },
        "show": function() {
            var result = SwrCanceDialog.superclass.show.apply(this, arguments);
            var elEl = this.element;
            var swrDoneInputEl = $('.swr-cancel-input', elEl);
            var smsWarnCountsEl = $('.sms-warn-radio', elEl);
            var itemV = this.get('itemV');
            var model = itemV.model;
            var originData = model.get("originData");
            var feedContents = originData.feedContent;
            var formatText = '';
            _.each(feedContents, function(feedContent) {
                formatText += feedContent.text;
            });
            swrDoneInputEl.val(formatText);
            this._renderCopyto();
            this._renderWorkto();
            return result;
        },
        "hide": function() {
            var result = SwrCanceDialog.superclass.hide.apply(this, arguments);
            this.clearForm();
            return result;
        },
        "render": function() {
            var result = SwrCanceDialog.superclass.render.apply(this, arguments);
            this._renderMedia();
            this._renderCpt();
            this._renderSmsDataTime();
            return result;
        },
        "_renderCpt": function() { //指令完成时间-设置日期和时间选择框
            var elEl = this.element,
                    inputEl = $('.swr-cancel-input', elEl);
            var sDEl = $('.setother-selectdata', elEl);
            var sTEl = $('.setother-selecttime', elEl);
            var setotherSelectData = new DateSelect({
                "element": sDEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）"
            });
            var setotherSelectTime = new TimeSelect({
                "element": sTEl,
                "placeholder": "选择时间"
            });
            var atInput = new AtInput({
                "element": inputEl,
                "withAt": true
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            setotherSelectData.on('change', function() {
                if (setotherSelectTime.getValue() == "") {
                    setotherSelectTime.selector.select(0);
                }
            });
            this.setotherSelectData = setotherSelectData;
            this.setotherSelectTime = setotherSelectTime;
            this.atInput = atInput;
        },
        "_renderSmsDataTime": function() { //短信提醒次数-设置日期和时间选择框
            var elEl = this.element;
            var smsOneDataEl = $('.sms-one-selectdata', elEl);
            var smsOneTimeEl = $('.sms-one-selecttime', elEl);
            var smsTwoDataEl = $('.sms-two-selectdata', elEl);
            var smsTwoTimeEl = $('.sms-two-selecttime', elEl);
            var smsThreeDataEl = $('.sms-three-selectdata', elEl);
            var smsThreeTimeEl = $('.sms-three-selecttime', elEl);
            var smsOneData = new DateSelect({
                "element": smsOneDataEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）"
            });
            var smsOneTime = new TimeSelect({
                "element": smsOneTimeEl,
                "placeholder": "选择时间"
            });
            var smsTwoData = new DateSelect({
                "element": smsTwoDataEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）"
            });
            var smsTwoTime = new TimeSelect({
                "element": smsTwoTimeEl,
                "placeholder": "选择时间"
            });
            var smsThreeData = new DateSelect({
                "element": smsThreeDataEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）"
            });
            var smsThreeTime = new TimeSelect({
                "element": smsThreeTimeEl,
                "placeholder": "选择时间"
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            smsOneData.on('change', function() {
                if (smsOneTime.getValue() == "") {
                    smsOneTime.selector.select(0);
                }
            });
            smsTwoData.on('change', function() {
                if (smsTwoTime.getValue() == "") {
                    smsTwoTime.selector.select(0);
                }
            });
            smsThreeData.on('change', function() {
                if (smsThreeTime.getValue() == "") {
                    smsThreeTime.selector.select(0);
                }
            });
            this.smsOneData = smsOneData;
            this.smsOneTime = smsOneTime;
            this.smsTwoData = smsTwoData;
            this.smsTwoTime = smsTwoTime;
            this.smsThreeData = smsThreeData;
            this.smsThreeTime = smsThreeTime;


        },
        "_renderMedia": function() { //设置多媒体功能
            var elEl = this.element;
            var mediaEl = $('.swr-cancel-input-media', elEl);
            var inputEl = $('.swr-cancel-input', elEl);
            var media = new MediaMaker({
                "element": mediaEl,
                "action": ["at", "topic"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl,
                        "spOpts": {
                            "data": [
                                {
                                    "title": "同事",
                                    "type": "p",
                                    "list": contactData['p']
                                },
                                {
                                    "title": "部门",
                                    "type": "g",
                                    "list": contactData['g']
                                }
                            ]
                        }
                    },
                    "topic": {
                        "inputSelector": inputEl
                    }

                }
            });
        },
        _renderCopyto: function() { //设置抄送选人组件
            var elEl = this.element,
                    copytoSbEl = $('.copyto-sb', elEl);
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var feedRangeEntities = originData.feedRangeEntities;
            var defaultWorker = {//默认抄送人
                id: originData.work.executer.employeeID,
                name: 'sb',
                type: "p"
            };
            var sb = new SelectBar({
                "element": copytoSbEl,
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": contactData['p']
                    },
                    {
                        "title": "部门",
                        "type": "g",
                        "list": contactData['g']
                    }
                ],
                "title": "选择发送范围",
                "singleCked": false, //可以多选
                "acInitData": util.getPublishRange('work'),
                "autoCompleteTitle": "请输入部门或同事的姓名或拼音"
            });
            copytoSbEl.data('sb', sb);
            _.each(feedRangeEntities, function(feedRangeEntitie) {
                var type = feedRangeEntitie.isCircle;
                if (type) {
                    type = 'g';
                } else {
                    type = 'p';
                }
                defaultWorker = {//默认抄送人
                    id: feedRangeEntitie.dataID,
                    name: feedRangeEntitie.name,
                    type: type
                };
                /**
                 * addItem() 选人组件设置默认值，默认选择人
                 * @param {object}
                 * @example
                 * 自己
                 * currentUserData
                 * 他人
                 * {
                 *      id:12,
                 *      name:"",
                 *      type:"p"
                 *   }
                 */
                sb.addItem(defaultWorker);
            });
        },
        _renderWorkto: function() { //设置执行人选人组件
            var elEl = this.element,
                    worktoSbEl = $('.workto-sb', elEl);
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var defaultWorker = {
                id: originData.work.executer.employeeID,
                name: originData.work.executer.name,
                type: "p"
            };
            var myId = currentUserData.employeeID; //我的id

            /* 把自己排除 过滤 */
            /*for (var i = 0; i < contactData.p.length; i++) {
             if (contactData.p[i].id == myId) {
             contactData.p.splice(i, 1);
             }
             };*/
            var sbEmployeeData = util.excludeContactData([myId], 'p');
            var sb = new SelectBar({
                "element": worktoSbEl,
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": sbEmployeeData
                    }
                ],
                "title": "选择指令执行人（一个）",
                "acInitData": util.getPublishDefaultUser("workExecuters"),
                "singleCked": true, //可以多选
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            worktoSbEl.data('sb', sb);
            /**
             * addItem() 选人组件设置默认值，默认选择人
             * @param {object}
             * @example
             * 自己
             * currentUserData
             * 他人
             * {
             *      id:12,
             *      name:"",
             *      type:"p"
             *   }
             */
            sb.addItem(defaultWorker);
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                    InputErrorEl = $('.swr-cancel-input-wrapper', elEl),
                    dataErrorEl = $('.setother-selectdata input', elEl),
                    InputEl = $('.swr-cancel-input', elEl);

            var smsOneEl = $('.sms-one-selectdata input', elEl);
            var smsTwoEl = $('.sms-two-selectdata input', elEl);
            var smsThreeEl = $('.sms-three-selectdata input', elEl);
            //标题不能为空
            if (requestData["replyContent"].length == 0) {
                util.showInputError(InputErrorEl);
                util.showInputError(InputEl);
                passed = false;
            }
            //日期不能为空
            if (!requestData["deadline"]) {
                util.showInputError(dataErrorEl);
                passed = false;
            }
            //第1次提醒不能为空
            if (this.smsWarnCountsVal == 1) {
                if (smsOneEl.val() == '') {
                    util.showInputError(smsOneEl);
                    passed = false;
                }
            }
            //第2次提醒不能为空
            if (this.smsWarnCountsVal == 2) {
                if (smsOneEl.val() == '') {
                    util.showInputError(smsOneEl);
                    passed = false;
                }
                if (smsTwoEl.val() == '') {
                    util.showInputError(smsTwoEl);
                    passed = false;
                }
            }
            //第3次提醒不能为空
            if (this.smsWarnCountsVal == 3) {
                if (smsOneEl.val() == '') {
                    util.showInputError(smsOneEl);
                    passed = false;
                }
                if (smsTwoEl.val() == '') {
                    util.showInputError(smsTwoEl);
                    passed = false;
                }
                if (smsThreeEl.val() == '') {
                    util.showInputError(smsThreeEl);
                    passed = false;
                }
            }

//            if (!requestData["deadline"]) {
//                util.showInputError(dataErrorEl);
//                passed = false;
//            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var elEl = this.element,
                    swrCancelInputEl = $('.swr-cancel-input', elEl),
                    smsWarnRadioEl = $('.sms-warn-radio', elEl),
                    smsWarnRadioVal = $('input:checked', smsWarnRadioEl).val(),
                    rateSelectEl = $('.rate', elEl),
                    worktoSbEl = $('.workto-sb', elEl),
                    copytoSbEl = $('.copyto-sb', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            var sb = copytoSbEl.data('sb'),
                    sbData = sb.getSelectedData();
            var worksb = worktoSbEl.data('sb'),
                    worksbData = worksb.getSelectedData();
            var compDate = this.setotherSelectData.getValue(),
                    compTime = this.setotherSelectTime.getValue();
            var smsOneData = this.smsOneData.getValue();
            var smsOneTime = this.smsOneTime.getValue();
            var smsTwoData = this.smsTwoData.getValue();
            var smsTwoTime = this.smsTwoTime.getValue();
            var smsThreeData = this.smsThreeData.getValue();
            var smsThreeTime = this.smsThreeTime.getValue();
            var smsRemindTimes = [];
            var smsOneDataTime = {
                value: 1,
                value1: moment(smsOneData + " " + smsOneTime, 'YYYYMMDD HH:mm').unix()
            };
            var smsTwoDataTime = {
                value: 2,
                value1: moment(smsTwoData + " " + smsTwoTime, 'YYYYMMDD HH:mm').unix()
            };
            var smsThreeDataTime = {
                value: 3,
                value1: moment(smsThreeData + " " + smsThreeTime, 'YYYYMMDD HH:mm').unix()
            };
            if (!smsOneData) {
                smsOneDataTime = {};
            }
            if (!smsTwoData) {
                smsTwoDataTime = {};
            }
            if (!smsThreeData) {
                smsThreeDataTime = {};
            }
            smsRemindTimes.push(smsOneDataTime, smsTwoDataTime, smsThreeDataTime);
            //feedid
            requestData["feedID"] = originData.feedID;
            //string，回复内容，通常默认为取消该指令
            // requestData["replyContent"] = _.str.trim(swrCancelInputEl.val());
            requestData["replyContent"] = '取消该指令';
            //string，指令内容
            requestData["feedContent"] = _.str.trim(swrCancelInputEl.val());
            //部门ID集合
            requestData["circleIDs"] = sbData['g'] || [];
            //员工ID集合
            requestData["employeeIDs"] = sbData['p'] || [];
            //发出人员工ID
            requestData["assignerID"] = originData.sender.employeeID;
            //执行人员工ID
            requestData["executerID"] = parseInt(worksbData['p']) || [];
            //指定完成时间
            if (compDate.length > 0) {
                requestData["deadline"] = moment(compDate + " " + compTime, 'YYYYMMDD HH:mm').unix();
            } else {
                requestData["deadline"] = '';
            }
            //int，短信提醒类型
            requestData["smsRemindType"] = parseInt(smsWarnRadioVal);
            //短信提醒时间列表
            requestData["smsRemindTimes"] = smsRemindTimes;
            //bool，是否发短信
            requestData["isSendSms"] = isSendSmsEl.prop('checked');
            return requestData;
        },
        "clearForm": function() {
            var elEl = this.element,
                    swrDoneInputEl = $('.swr-cancel-input', elEl),
                    smsWarnRadioEl = $('.sms-warn-radio input:radio', elEl),
                    smsWarnItemEl = $('.sms-warn-item', elEl),
                    setWorkerdataEl = $('.setother-selectdata input', elEl),
                    setWorkertimeEl = $('.setother-selecttime input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            swrDoneInputEl.val("");
            setWorkerdataEl.val("");
            setWorkertimeEl.val("");
            isSendSmsEl.prop('checked', false);
            smsWarnRadioEl.prop('checked', false).eq(0).prop('checked', true);
            smsWarnItemEl.hide();
            smsWarnItemEl.find('input').val('');
        },
        "_submit": function(evt) {
            var that = this;
            var requestData = this.getRequestData();
            var itemV = this.get('itemV');
            var itemEl = itemV.$el;
            var bIsValid = this.isValid();
            var elEl = this.element;
            var swrcancelInputEl = $('.swr-cancel-input', elEl);

            if (bIsValid) {
                if (swrcancelInputEl.val().length > 2000) { //如果字数长度超过2000   
                    util.alert('请控制输入在2000字内');
                } else {
                    util.api({
                        type: 'post',
                        data: requestData,
                        url: '/FeedWork/ChangeOtherSendFeedWork',
                        success: function(responseData) {
                            if (responseData.success) {

                                //隐藏本身
                                that.hide();
                                that.clearForm();
                                //刷新本条信息打开回复列表
                                itemV.updateModel();
                                that.get('successCb').call(that, responseData, requestData);

                            }
                        }
                    });
                }
            }
            return false;

            evt.preventDefault();

        },
        "_cancel": function(evt) {
            this.clearForm();
            this.hide();
            evt.preventDefault();
        }
    });
    var swrCanceDialog = new SwrCanceDialog(); //创建实例
    //收到的指令回复-普通回复
    var RwrNormalDialog = Dialog.extend({
        "attrs": {
            itemV: null, //与dialog绑定的item view
            content: tplEl.filter('.rwr-normal-tpl').html(),
            className: 'common-style-richard feed-rwr-normal-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = Dialog.superclass.render.apply(this, arguments);
            this._initAtInput();
            this._renderMedia();
            return result;
        },
        /**
         * 初始化at input
         */
        "_initAtInput": function() {
            var elEl = this.element,
                    inputEl = $('.rwr-normal-input', elEl);
            new AtInput({
                "element": inputEl
            });
            inputEl.val('').trigger('autosize.resize');
        },
        "_renderMedia": function() {
            var elEl = this.element,
                    mediaEl = $('.media', elEl),
                    inputEl = $('.rwr-normal-input', elEl);
            //设置多媒体功能
            var media = new MediaMaker({
                "element": mediaEl,
                "limitUploadSingle": true,
                "action": ["h5imgupload", "h5attachupload", "at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl,
                        "spOpts": {
                            "data": [
                                {
                                    "title": "同事",
                                    "type": "p",
                                    "list": contactData['p']
                                },
                                {
                                    "title": "部门",
                                    "type": "g",
                                    "list": contactData['g']
                                }
                            ]
                        }
                    },
                    "h5imgupload": {
                        "limitUploadSingle": false //图片上传可以选多个，覆盖上面limitUploadSingle设置
                    }
                }
            });
            //保存media引用
            mediaEl.data('media', media);
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                    rwrNormalInputEl = $('.rwr-normal-input', elEl);
            //内容不能为空
            if (requestData["replyContent"].length == 0) {
                util.showInputError(rwrNormalInputEl.closest('.rwr-normal-input-wrapper'));
                passed = false;
            }
            if (requestData["replyContent"].length > 2000) { //回复2000字限制
                util.alert('请控制输入在2000字内');
                passed = false;
            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var elEl = this.element,
                    swrDoneInputEl = $('.rwr-normal-input', elEl),
                    mediaEl = $('.media', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            var media = mediaEl.data('media');

            requestData["feedID"] = originData.feedID;
            requestData["replyToReplyID"] = 0; //占位
            requestData["replyToEmployeeID"] = 0; //占位
            //reply content
            requestData["replyContent"] = _.str.trim(swrDoneInputEl.val());
            //操作类型
            //requestData["operationType"]=2; //设置为未完成状态
            //附件信息
            requestData["fileInfos"] = [];
            var files = media.getUploadValue();
            _.each(files, function(file) {
                if (file.uploadType == "img") {
                    requestData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                } else if (file.uploadType == "attach") {
                    requestData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                }
            });
            //发送短信
            requestData["isSendSms"] = isSendSmsEl.prop('checked');
            return requestData;
        },
        "clearForm": function() {
            var elEl = this.element,
                    swrDoneInputEl = $('.rwr-normal-input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl),
                    mediaEl = $('.media', elEl);
            var media = mediaEl.data('media');
            swrDoneInputEl.val("").trigger('autosize.resize');
            isSendSmsEl.prop('checked', false);
            //清空media
            media.resetAll();
            //重新开启上传
            media.enableAction('h5imgupload');
            media.enableAction('h5attachupload');
        },
        "_submit": function(evt) {
            var that = this;
            var elEl = this.element,
                    mediaEl = $('.media', elEl);
            var media = mediaEl.data('media'),
                    submitEl = $(evt.currentTarget);
            var requestData;
            var itemV = this.get('itemV'),
                    itemEl = itemV.$el,
                    fsReply = itemEl.data('fsReply');
            if (this.isValid()) {
                media.send(function(sendCb) {
                    requestData = that.getRequestData();
                    util.api({
                        type: 'post',
                        data: requestData,
                        url: '/Feed/SendFeedReply', //提交回复
                        success: function(responseData) {
                            if (responseData.success) {
                                //隐藏本身
                                that.hide();
                                //向回复列表里插入一条新数据
                                fsReply.addNewReply(responseData.value);
                                that.get('successCb').call(that, responseData, requestData);
                                that.clearForm();
                            }
                            sendCb(); //media send callback回调
                        }
                    }, {
                        "submitSelector": submitEl
                    });
                }, elEl);
            }
            evt.preventDefault();
        },
        "_cancel": function(evt) {
            this.clearForm();
            this.hide();
            evt.preventDefault();
        },
        "show": function() {
            var result;
            var itemV = this.get('itemV'),
                    model = itemV.model;
            result = RwrNormalDialog.superclass.show.apply(this, arguments);
            $('.user-name', this.element).text(model.get('originData').sender.name);
            return result;
        }
    });
    var rwrNormalDialog = new RwrNormalDialog(); //创建实例--收到的指令回复-汇报结果

    var RwrCompleteDialog = Dialog.extend({
        "attrs": {
            itemV: null, //与dialog绑定的item view
            content: tplEl.filter('.rwr-complete-tpl').html(),
            className: 'common-style-richard feed-rwr-complete-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = Dialog.superclass.render.apply(this, arguments);
            this._initAtInput();
            this._renderMedia();
            return result;
        },
        /**
         * 初始化at input
         */
        "_initAtInput": function() {
            var elEl = this.element,
                    inputEl = $('.rwr-complete-input', elEl);
            new AtInput({
                "element": inputEl
            });
        },
        "_renderMedia": function() {
            var elEl = this.element,
                    mediaEl = $('.media', elEl),
                    inputEl = $('.rwr-complete-input', elEl);
            //设置多媒体功能
            var media = new MediaMaker({
                "element": mediaEl,
                "action": ["h5imgupload", "h5attachupload", "at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl,
                        "spOpts": {
                            "data": [
                                {
                                    "title": "同事",
                                    "type": "p",
                                    "list": contactData['p']
                                },
                                {
                                    "title": "部门",
                                    "type": "g",
                                    "list": contactData['g']
                                }
                            ]
                        }
                    }
                }
            });
            //保存media引用
            mediaEl.data('media', media);
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                    rwrNormalInputEl = $('.rwr-complete-input', elEl);
            //内容不能为空
            if (requestData["replyContent"].length == 0) {
                util.showInputError(rwrNormalInputEl.closest('.rwr-complete-input-wrapper'));
                passed = false;
            }
            if (requestData["replyContent"].length > 2000) { //回复2000字限制
                util.alert('请控制输入在2000字内');
                passed = false;
            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var elEl = this.element,
                    swrDoneInputEl = $('.rwr-complete-input', elEl),
                    mediaEl = $('.media', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            var media = mediaEl.data('media');
            //feedid
            requestData["feedID"] = originData.feedID;
            //reply content
            requestData["replyContent"] = _.str.trim(swrDoneInputEl.val());
            //操作类型
            requestData["operationType"] = 1; //设置为已完成状态
            //附件信息
            var files = media.getUploadValue();
            requestData["fileInfos"] = [];
            _.each(files, function(file) {
                if (file.uploadType == "img") {
                    requestData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                } else if (file.uploadType == "attach") {
                    requestData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                }
            });
            //发送短信
            requestData["isSendSms"] = isSendSmsEl.prop('checked');
            return requestData;
        },
        "clearForm": function() {
            var elEl = this.element,
                    swrDoneInputEl = $('.rwr-complete-input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl),
                    mediaEl = $('.media', elEl);
            var media = mediaEl.data('media');
            swrDoneInputEl.val("").trigger('autosize.resize');
            isSendSmsEl.prop('checked', false);
            //清空media
            media.resetAll();
        },
        "_submit": function(evt) {
            var that = this;
            var requestData;
            var elEl = this.element,
                    mediaEl = $('.media', elEl),
                    submitEl = $(evt.currentTarget);
            var media = mediaEl.data('media');
            var itemV = this.get('itemV'),
                    itemEl = itemV.$el,
                    fsReply = itemEl.data('fsReply');
            var conEl = $('.con', itemEl);
            if (this.isValid()) {
                media.send(function(sendCb) {
                    requestData = that.getRequestData();
                    util.api({
                        type: 'post',
                        data: requestData,
                        url: '/FeedWork/ExecuterSendFeedWorkReply',
                        success: function(responseData) {
                            if (responseData.success) {
                                itemV.updateModel();
                                //隐藏本身
                                that.hide();
                                //向回复列表里插入一条新数据
                                /*fsReply.addNewReply(responseData.value);
                                 that.get('successCb').call(that, responseData, requestData);
                                 conEl.text('已完成');*/
                                //清空
                                that.clearForm();
                            }
                            sendCb();
                        }
                    }, {
                        "submitSelector": submitEl
                    });
                }, elEl);
            }
            evt.preventDefault();
        },
        "_cancel": function(evt) {
            this.clearForm();
            this.hide();
            evt.preventDefault();
        }
    });
    var rwrCompleteDialog = new RwrCompleteDialog(); //实例化指令 - 已完成，汇报结果
    //收到的批复-复议
    var SarNormalDialog = Dialog.extend({
        "attrs": {
            itemV: null, //与dialog绑定的item view
            content: tplEl.filter('.sar-normal-tpl').html(),
            className: 'common-style-richard feed-sar-normal-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = Dialog.superclass.render.apply(this, arguments);
            this._initAtInput();
            this._renderMedia();
            return result;
        },
        /**
         * 初始化at input
         */
        "_initAtInput": function() {
            var elEl = this.element,
                    inputEl = $('.sar-normal-input', elEl);
            this.atInput = new AtInput({
                "element": inputEl,
                "withAt": true
            });
        },
        "_renderMedia": function() {
            var elEl = this.element,
                    mediaEl = $('.media', elEl),
                    inputEl = $('.sar-normal-input', elEl);
            //设置多媒体功能
            var media = new MediaMaker({
                "element": mediaEl,
                "action": ["h5imgupload", "h5attachupload", "at"],
                "limitUploadSingle": true,
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl,
                        "spOpts": {
                            "data": [
                                {
                                    "title": "同事",
                                    "type": "p",
                                    "list": contactData['p']
                                },
                                {
                                    "title": "部门",
                                    "type": "g",
                                    "list": contactData['g']
                                }
                            ]
                        }
                    },
                    "h5imgupload": {
                        "limitUploadSingle": false //图片上传可以选多个，覆盖上面limitUploadSingle设置
                    }
                }
            });
            //保存media引用
            mediaEl.data('media', media);
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                    sarNormalInputEl = $('.sar-normal-input', elEl);
            //内容不能为空
            if (requestData["replyContent"].length == 0) {
                util.showInputError(sarNormalInputEl.closest('.sar-normal-input-wrapper'));
                passed = false;
                return passed;
            }
            if (requestData['replyContent'].length > 2000) {
                util.alert('发送内容不超过2000字，目前已超出<em>' + (requestData['replyContent'].length - 2000) + '</em>个字');
                passed = false;
                return passed;
            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var itemV = this.get('itemV'),
                    model = itemV.model,
                    originData = model.get('originData');
            var elEl = this.element,
                    sarNormalInputEl = $('.sar-normal-input', elEl),
                    mediaEl = $('.media', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl);
            var media = mediaEl.data('media');
            //feedid
            requestData["feedID"] = originData.feedID;
            requestData["replyToReplyID"] = 0;
            requestData["replyToEmployeeID"] = 0;
            //reply content
            requestData["replyContent"] = _.str.trim(sarNormalInputEl.val());
            //附件信息
            var files = media.getUploadValue();
            requestData["fileInfos"] = [];
            _.each(files, function(file) {
                if (file.uploadType == "img") {
                    requestData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                } else if (file.uploadType == "attach") {
                    requestData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                }
            });
            //发送短信
            requestData["isSendSms"] = isSendSmsEl.prop('checked');
            return requestData;
        },
        "clearForm": function() {
            var elEl = this.element,
                    sarNormalInputEl = $('.sar-normal-input', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl),
                    mediaEl = $('.media', elEl);
            var media = mediaEl.data('media');
            sarNormalInputEl.val("").trigger('autosize.resize');
            isSendSmsEl.prop('checked', false);
            //清空media
            media.resetAll();
        },
        "_submit": function(evt) {
            var that = this;
            var elEl = this.element,
                    mediaEl = $('.media', elEl);
            var media = mediaEl.data('media');
            var requestData;
            var itemV = this.get('itemV'),
                    itemEl = itemV.$el,
                    fsReply = itemEl.data('fsReply');
            if (this.isValid()) {

                media.send(function(sendCb) {
                    requestData = that.getRequestData();

                    util.api({
                        type: 'post',
                        data: requestData,
                        ///url: '/Feed/SendFeedReply',
                        url: '/FeedApprove/ApproverOnlySendFeedReply',
                        success: function(responseData) {
                            if (responseData.success) {

                                //隐藏本身
                                that.hide();
                                //向回复列表里插入一条新数据
                                fsReply.addNewReply(responseData.value);
                                that.get('successCb').call(that, responseData, requestData);
                            }
                            that.clearForm();
                            sendCb();
                        }
                    });
                }, elEl);
            }
            evt.preventDefault();
        },
        "_cancel": function(evt) {
            this.hide();
            evt.preventDefault();
        },
        "show": function() {
            var result;
            var itemV = this.get('itemV'),
                    model = itemV.model;
            result = RwrNormalDialog.superclass.show.apply(this, arguments);
            $('.user-name', this.element).text(model.get('originData').sender.name);
            //textarea auto height
            // this.atInput.element.trigger('autosize.resize');
            // this.atInput.element.get(0).focus();
            return result;
        },
        "hide": function() {
            var result;
            result = RwrNormalDialog.superclass.hide.apply(this, arguments);
            //垃圾清理
            this.clearForm();
            return result;
        }
    });
    var sarNormalDialog = new SarNormalDialog(); //创建实例

    //获取历史审批
    var ApproveHisDialog = Dialog.extend({
        "attrs": {
            hasMask: true,
            width: 580,
            height: 600,
            itemV: null,
            content: tplEl.filter('.approve-history-tpl').html(),
            className: 'common-style-richard feed-approve-history-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "render": function() {
            var result = ApproveHisDialog.superclass.render.apply(this, arguments);
            this._initFeedList();
            return result;
        },
        "_initFeedList": function() {
            var that = this;
            var FeedList = require('./feed-list');
            var elEl = this.element,
                    listEl = $('.feed-list', elEl),
                    pagEl = $('.feed-list-pagination', elEl);
            this.feedList = new FeedList({
                "element": listEl, //list selector
                "pagSelector": false, //不带分页
                "withLazyload": false, //关闭懒加载
                "withAvatar": false, //不显示头像
                "listPath": "/FeedApprove/GetSomeoneApproveHistroy", //获取历史审批接口
                "defaultRequestData": function() {
                    var itemV = that.get('itemV'),
                            model = itemV.model,
                            originData = model.get('originData');
                    return {
                        "employeeID": originData.employeeID,
                        "feedID": originData.feedID
                    };
                }
            });
        },
        "load": function() {
            this.feedList.load(requestData);
        },
        "reload": function() {
            this.feedList.reload();
        },
        "show": function() {
            var result = ApproveHisDialog.superclass.show.apply(this, arguments);
            var elEl = this.element,
                    userNameEl = $('.user-name', elEl),
                    itemV = this.get('itemV'),
                    model = itemV.model;
            userNameEl.text(model.get('originData').sender.name);
            return result;
        }
    });
    var approveHisDialog = new ApproveHisDialog(); //创建实例

    //打印预览窗口
    var PrintPreviewDialog = Dialog.extend({
        "attrs": {
            width: 787,
            height: 600,
            itemV: null,
            content: tplEl.filter('.print-preview-tpl').html(),
            className: 'common-style-richard feed-print-preview-dialog',
            successCb: FS.EMPTY_FN, //提交成功后回调
            zIndex: 1000
        },
        "events": {
            "click .f-sub": "_print",
            "click .f-cancel": "_cancel"
        },
        "render": function() {
            var result = PrintPreviewDialog.superclass.render.apply(this, arguments);
            return result;
        },
        "_initIframe": function() {
            var elEl = this.element,
                    bodyEl = $('.ui-dialog-body', elEl),
                    maskEl = $('.preview-mask', bodyEl), //预览遮罩
                    iframeEl;
            var itemV = this.get('itemV'),
                    model = itemV.model;
            //添加model=print请求参数是为了刷新主页面缓存，不然请求不会发生
            iframeEl = $('<iframe frameborder="0" scrolling="no" src="' + feedPrintUrl + model.get('feedID') + '/isprint-1" class="preview-ifr" width="787" height="500" />');
            //iframeEl=$('<iframe frameborder="0" scrolling="no" src="/" />');
            iframeEl.appendTo(bodyEl);
            //设置打印状态下的全局回调
            iframeEl.get(0).contentWindow.printModelCb = function() {
                maskEl.hide();
            };
            return iframeEl;
        },
        "show": function() {
            var result = PrintPreviewDialog.superclass.show.apply(this, arguments);
            var elEl = this.element,
                    bodyEl = $('.ui-dialog-body', elEl),
                    maskEl = $('.preview-mask', bodyEl), //预览遮罩
                    iframeEl = $('.preview-ifr', elEl),
                    itemV = this.get('itemV'),
                    model = itemV.model;
            if (iframeEl.length == 0) {
                this._initIframe();
            } else {
                iframeEl.attr('src', feedPrintUrl + model.get('feedID') + '/isprint-1');
            }
            //打开遮罩
            maskEl.show();
            return result;
        },
        "hide": function() {
            var result = PrintPreviewDialog.superclass.hide.apply(this, arguments);
            var elEl = this.element,
                    bodyEl = $('.ui-dialog-body', elEl),
                    iframeEl = $('.preview-ifr', elEl);
            if (iframeEl.length > 0) {
                iframeEl.attr('src', feedPrintUrl + 0 + '/isprint-1');
            }
            return result;
        },
        _print: function() {
            var elEl = this.element,
                    iframeEl = $('.preview-ifr', elEl);
            //调用浏览器打印接口
            iframeEl.get(0).contentWindow.focus();
            iframeEl.get(0).contentWindow.print();
            /*try{
             iframeEl.get(0).contentWindow.WebBrowser.ExecWB(6,1);
             }catch(e){
             iframeEl.get(0).contentWindow.print();
             }*/
            /*if(iframeEl.get(0).ExecWB){
             iframeEl.get(0).ExecWB(6,1);      //ie下打印预览
             }else{
             iframeEl.get(0).contentWindow.print();
             }*/

            //iframeEl.get(0).print();
        },
        _cancel: function() {
            this.hide();
        }
    });
    var printPreviewDialog = new PrintPreviewDialog(); //创建实例


    /* 定位信息-查看设备-弹出层 */
    var FeedLocationFnEquipmentDialog = Dialog.extend({
        "attrs": {
            width: 420,
            hasMask: false,
            content: tplEl.filter('.feedlocationfn-equipment-tpl').html(),
            className: 'common-style-richard feedlocationfn-equipment-dialog'
        },
        "events": {
            "click": "_stopBubbling", //阻止冒泡
            "click .equipment-tit-account": "_tabAccount", //请求账户信息
            "click .equipment-tit-equipment": "_tabEquipment", //请求设备信息
            "change .equipment-select-btn": "_pageSelect", //选择第几页信息
            "click .equipment-btn-l": "_pageBtnLeft", //向左翻页按钮
            "click .equipment-btn-r": "_pageBtnRight" //向右翻页按钮
        },
        "render": function() {
            var that = this;
            var result = FeedLocationFnEquipmentDialog.superclass.render.apply(this, arguments);
            //点击其他地方定位框消失
            util.regGlobalClick(this.element, function() {
                that.hide();
            });

            return result;
        },
        "hide": function() {
            var result = PrintPreviewDialog.superclass.hide.apply(this, arguments);
            var elEl = this.element;
            $('.equipment-tit-equipment', elEl).removeClass('cur');
            $('.equipment-tit-account', elEl).addClass('cur');
            $('.equipment-listwarp', elEl).html('');

            return result;
        },
        "_stopBubbling": function(evt) {
            evt.stopPropagation();
        },
        "_pageBtnLeft": function(e) { //向左翻页按钮
            var meEl = $(e.currentTarget);
            var equipmentPagewarpEl = $('.equipment-pagewarp', this.element);
            var pagewarpType = equipmentPagewarpEl.attr('type');
            var pageNumber = equipmentPagewarpEl.attr('pagenumber');
            if (meEl.is('.disable')) {
                return false;
            }
            pageNumber--;

            if (pagewarpType == 1) {
                this._accountAjax(pageNumber); //请求帐号信息
            } else {
                this._equipmentAjax(pageNumber); //请求设备信息
            }

        },
        "_pageBtnRight": function(e) { //向右翻页按钮
            var meEl = $(e.currentTarget);
            var equipmentPagewarpEl = $('.equipment-pagewarp', this.element);
            var pagewarpType = equipmentPagewarpEl.attr('type');
            var pageNumber = equipmentPagewarpEl.attr('pagenumber');
            if (meEl.is('.disable')) {
                return false;
            }
            pageNumber++;
            if (pagewarpType == 1) {
                this._accountAjax(pageNumber); //请求帐号信息
            } else {
                this._equipmentAjax(pageNumber); //请求设备信息
            }

        },
        "_pageSelect": function(e) { //选择第几页信息
            var meEl = $(e.currentTarget);

            var pageNumber = meEl.val();
            var equipmentPagewarpEl = $('.equipment-pagewarp', this.element);
            var pagewarpType = equipmentPagewarpEl.attr('type');
            if (pagewarpType == 1) {
                this._accountAjax(pageNumber); //请求帐号信息
            } else {
                this._equipmentAjax(pageNumber); //请求设备信息
            }

        },
        "_tabAccount": function(e) { //请求账户信息
            var meEl = $(e.currentTarget);
            var titwarpEl = $('.equipment-titwarp', this.element);
            $('a', titwarpEl).removeClass('cur');
            meEl.addClass('cur');
            this._accountAjax(1);
        },
        "_tabEquipment": function(e) { //请求设备信息
            var meEl = $(e.currentTarget);
            var titwarpEl = $('.equipment-titwarp', this.element);
            $('a', titwarpEl).removeClass('cur');
            meEl.addClass('cur');
            this._equipmentAjax(1);
        },
        /**
         * 拼HTML列表
         * @param config
         */
        "_createItem": function(item, type) {
            var country = item.country;
            var province = item.province;
            var city = item.city;
            var district = item.district;
            var street = item.street;
            var streetNumber = item.streetNumber;
            var LocationTextStr = country + province + city + district + street + streetNumber;
            var employeeName = item.employee.name;
            var profileImage = util.getAvatarLink(item.employee.profileImage, '3');
            var token = item.token; //设备号
            var tokenStr = '设备号：' + token + ' '; //设备号
            if (type == 1) {
                tokenStr = ''; //设备号
            }
            var createTime = moment.unix(item.createTime);//创建时间
//            var createTime = moment.unix(920397784);//1999年3月3日 2:03:04
            var serviceTime = moment.unix(this.serviceTime);//服务器时间
            var finalTime = util.getDateSummaryDesc(createTime, serviceTime, 1);//计算过的时间
            var itemStr = '<div class="equipment-listitem fn-clear"> <div class="equipment-listitem-l"> <img src="' + profileImage + '" alt="" class="equipment-listitem-l-img"></div> <div class="equipment-listitem-r"> <div class="equipment-listitem-r-top">' + employeeName + '：' + LocationTextStr + '</div> <div class="equipment-listitem-r-bottom">' +
                    tokenStr + finalTime + '</div> </div> </div>';
            return $(itemStr);
        },
        "_accountAjax": function(pageNumber) { //请求帐号信息
            var that = this;
            var itemV = this.itemV;
            var model = itemV.model;
            var originData = model.get("originData");
            var employeeID = originData.employeeID;
            var meEl = this.element;
            var topinfoEl = $('.equipment-topinfo', meEl);
            var employeeNameInfoEl = $('.employee-name-info', meEl);
            var listEl = $('.equipment-listwarp', meEl);
            var selectBtnEl = $('.equipment-select-btn', meEl);
            var equipmentPagewarpEl = $('.equipment-pagewarp', meEl);
            var pageBtnLeftEl = $('.equipment-btn-l', equipmentPagewarpEl);
            var pageBtnRightEl = $('.equipment-btn-r', equipmentPagewarpEl);
            this.serviceTime = originData.serviceTime;
            equipmentPagewarpEl.attr('type', '1');
            util.api({
                "url": '/Location/GetLocationInfosInOneEmployee', //请求帐号信息的接口地址
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "employeeID": employeeID, //该定位信息发送人 ID
                    "pageSize": 10,
                    "pageNumber": pageNumber
                },
                "success": function(responseData) {
                    var data = responseData.value;
                    var tokenCount = data.tokenCount;
                    var locationTokens = data.locationTokens;
                    var employeeName;
                    var totalCount = data.totalCount;
                    var pageNumber = data.pageNumber;
                    var selectorCount = parseInt(totalCount / 10);
                    var selectorStr = '';
                    if (selectorCount > 0) {
                        for (var i = 1; i <= selectorCount; i++) {
                            selectorStr += ('<option value ="' + i + '">第' + i + '页</option>');
                        }
                    } else {
                        selectorStr = ('<option value ="1">第1页</option>');
                    }
                    selectBtnEl.html(selectorStr); //把算出来多少页渲染出来
                    selectBtnEl.val(pageNumber); //显示当前的页号
                    if (locationTokens.length > 0) {
                        employeeName = locationTokens[0].employee.name;
                    } else {
                        employeeName = '';
                    }
                    if (responseData.success) {
                        topinfoEl.html('<span class="ml10">该帐号共使用<b class="red">' + tokenCount + '</b>个设备进行过签到（最近30次）</span>');
                        employeeNameInfoEl.text('帐号：' + employeeName);
                        listEl.empty();
                        _.each(locationTokens, function(item) {
                            var itemEl = that._createItem(item, 0);
                            itemEl.appendTo(listEl);
                        });
                        equipmentPagewarpEl.attr('pagenumber', pageNumber);

                        if (pageNumber <= 1) {
                            pageBtnLeftEl.addClass('disable');
                        } else {
                            pageBtnLeftEl.removeClass('disable');
                        }
                        if (pageNumber >= selectorCount) {
                            pageBtnRightEl.addClass('disable');
                        } else {
                            pageBtnRightEl.removeClass('disable');
                        }

                    }
                }
            });
        },
        "_equipmentAjax": function(pageNumber) { //请求设备信息
            var that = this;
            var meEl = this.element;
            var itemV = this.itemV;
            var model = itemV.model;
            var originData = model.get("originData");
            var feedID = originData.feedID;
            var topinfoEl = $('.equipment-topinfo', meEl);
            var topinfocontEl = $('.topinfo-cont', topinfoEl);
            var employeeNameInfoEl = $('.employee-name-info', meEl);
            var listEl = $('.equipment-listwarp', meEl);
            var selectBtnEl = $('.equipment-select-btn', meEl);
            var equipmentPagewarpEl = $('.equipment-pagewarp', meEl);
            var pageBtnLeftEl = $('.equipment-btn-l', equipmentPagewarpEl);
            var pageBtnRightEl = $('.equipment-btn-r', equipmentPagewarpEl);
            equipmentPagewarpEl.attr('type', '2');

            util.api({
                "url": '/Location/GetLocationInfosInOneToken', //请求设备信息的接口地址
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "feedID": feedID,
                    "pageSize": 10,
                    "pageNumber": pageNumber
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        var data = responseData.value;
                        var tokenCount = data.tokenCount;
                        var locationTokens = data.locationTokens;
                        var employeeCount = data.employeeCount;
                        var token = data.token;
                        var totalCount = data.totalCount;
                        var pageNumber = data.pageNumber;
                        var selectorCount = parseInt(totalCount / 10);
                        var employeeName;
                        var isTokenChengedStr = '';
                        var selectorStr = '';
                        if (employeeCount > 1) {
                            isTokenChengedStr = '，可能异常';
                        }
                        if (selectorCount > 0) {
                            for (var i = 1; i <= selectorCount; i++) {
                                selectorStr += ('<option value ="' + i + '">第' + i + '页</option>');
                            }
                        } else {
                            selectorStr = ('<option value ="1">第1页</option>');
                        }
                        selectBtnEl.html(selectorStr); //把算出来多少页渲染出来
                        selectBtnEl.val(pageNumber); //显示当前的页号
                        /* if (locationTokens.length > 0) {
                         employeeName = locationTokens[0].employee.name;
                         } else {
                         employeeName = '';
                         }*/
                        if (employeeCount > 1) {
                            employeeCount = '<b class="red">' + employeeCount + '</b>';
                        }
                        if (responseData.success) {
                            employeeNameInfoEl.text('设备ID：' + token);
                            topinfoEl.html('<span class="ml10">共' + employeeCount + '人通过该设备进行了签到（最近30次）' + isTokenChengedStr + '</span>');
                            listEl.empty();
                            _.each(locationTokens, function(item) {
                                var itemEl = that._createItem(item, 1);
                                itemEl.appendTo(listEl);
                            });
                            equipmentPagewarpEl.attr('pagenumber', pageNumber);

                            if (pageNumber <= 1) {
                                pageBtnLeftEl.addClass('disable');
                            } else {
                                pageBtnLeftEl.removeClass('disable');
                            }

                            if (pageNumber >= selectorCount) {
                                pageBtnRightEl.addClass('disable');
                            } else {
                                pageBtnRightEl.removeClass('disable');
                            }

                        }
                    }
                }
            });
        },
        "show": function() {
            var result = FeedLocationFnEquipmentDialog.superclass.show.apply(this, arguments);
            var meEl = this.element;
            var arrow = $('.equipment-arrow', meEl);
            var up = this.up;
            if (up) {
                arrow.addClass('up');
            } else {
                arrow.removeClass('up');
            }
            this._accountAjax(1); //请求帐号信息
            return result;
        },
        _cancel: function() {
            this.hide();
        }
    });
    var feedLocationFnEquipmentDialog = new FeedLocationFnEquipmentDialog(); //实例化

    //模板内容
    var feedShareTpl = _.template(tplEl.filter('.feed-list-share').html()),
            feedScheduleTpl = _.template(tplEl.filter('.feed-list-schedule').html()),
            feedScheduleTipTpl = _.template(tplEl.filter('.feed-list-schedule-tip').html()),
            feedVoteItemTpl = _.template(tplEl.filter('.feed-list-voteitem').html()),
            feedAnnounceTpl = _.template(tplEl.filter('.feed-list-announce').html()),
            feedAnnouncePageTpl = _.template(tplEl.filter('.feed-list-announce-page').html()),
            feedPlanTpl = _.template(tplEl.filter('.feed-list-plan').html()),
            feedWorkTpl = _.template(tplEl.filter('.feed-list-work').html()),
            feedApproveTpl = _.template(tplEl.filter('.feed-list-approve').html()),
            feedApprovePrintTpl = _.template(tplEl.filter('.feed-list-approve-print').html());

    /**
     * 定义itemv
     */
    var ItemV = Backbone.View.extend({
        tagName: "div",
        //template: _.template(),
        className: "list-item fn-clear",
        events: {
            "click .istimeshow": "istimeshow", //公告的时间显示
            "mouseenter .islike": "enterIsLike", // 赞的人员信息TIP 鼠标经过显示          
            "mouseleave .islike": "leaveIsLike", // 赞的人员信息TIP 鼠标离开隐藏
            //            "click .islike-btn": "sendIsLike", //提交赞功能
            //            "click .aj-modifyapprer": "sendmodifyapprer", //修改审批人按钮 
            //            "click .aj-modifyapproval": "modifyapprer", //修改审批人窗口
            //            "click .aj-working": "workingre", //执行中的指令回复
            //            "click .aj-sendwork": "sendworkre", //发出的指令回复
            //            "click .aj-working-normal": "workingnorm", //普通指令中回复
            //            "click .aj-working-finish": "workingfini", //已完成指令中回复
            //            "click .aj-work-unfinish": "workunfini", //未完成指令的回复
            //            "click .aj-work-finish": "workfini", //已完成指令的回复
            //            "click .swr-action-tbar .undone-btn": "_showSwrUndoneDialog", //指令未完成
            //            "click .swr-action-tbar .done-btn": "_showSwrDoneDialog", //已完成，点评结果
            //            "click .swr-action-tbar .cancel-btn": "_showSwrCancelDialog", //取消指令，转他人执行
            //            "click .rwr-action-tbar .normal-btn": "_showRwrNormalDialog", //收到的指令回复-汇报结果
            //            "click .rwr-action-tbar .complete-btn": "_showRwrCompleteDialog", //指令，已完成汇报结果
            //            "click .sar-action-tbar .aj-appr-re": "_showSarNormalDialog", //收到的指令回复-汇报结果
            //            "click .open-replies-imgorfile": "openRepliesImgorfile", //指令关键回复查看附件功能
            //            "click .aj-cc": "cc", //抄送
            //            "click .aj-cc-add": "ccadd", //抄送提交按钮
            //            "click .aj-approval": "approval", //批复
            //            "click .aj-appr-yes": "appryes", //批复-同意
            //            "click .aj-appr-no": "apprno", //批复-不同意
            //            "click .aj-Reply": "reply", //回复
            //            "click .sar-action-tbar .aj-appr-history": "_showApproveHisDialog", //查看历史审批

            "click .aj-commenton": "commen", //点评
            "click .aj-commenton-btn": "commenbtn", //点评按钮
            "click .item-func .more": "funcmore", //功能区更多按钮
            "click .feed-content-visible-h": "fcVisibleH", //展开收起正文
            "click .feed-topreply-content-visible-h": "fctrVisibleH", //关键回复的展开收起正文
            "click .unatt-bt": "unattbt", //取消关注的确定按钮
            "click .ar-modfiy": "modfiypof", //修改归档
            "click .aj-pending": "ped", //待办
            "click .aj-delete": "showDel", //显示删除确认框
            "click .aj-schedule-delete": "showScheduleDelBtn", //取消日程的删除按钮事件
            "click .submit-cancelschedule": "submitcancelschedule", //执行取消日程
            "click .cancelmenu-box .f-cancel": "cancel", //取消显示确认框
            "click .aj-unplaceonfile": "showunpof", //显示取消归档确认框
            "click .aj-open-vote-btn": "openvotebtn", //显示投票详情按钮
            "click .aj-close-vote-btn": "closevotebtn", //关闭投票详情按钮
            "click .aj-sendvote-btn": "sendvotebtn", //投票按钮
            "click .aj-seevote-btn": "seevotebtn", //查看投票结果按钮
            "click .aj-backvote-btn": "backvotebtn", //返回投票按钮
            "click .aj-seemore-info-btn": "seemoreinfobtn", //投票查看详情按钮
            "click .group": "groupbtn", //分享范围按钮
            "click .schedulesgroup": "groupbtn", //日程分享范围按钮
            "click .msmremaindcount": "msmremaindcount", //短信提醒几人的链接
            "click .receiptalertlist": "receiptalertlist", //回执信息的链接为了弹出框
            "click .aj-receipt-fn": "sendReceiptAJAX", //回执提交
            "click .item-media .feed-img": "_previewImg", //预览图片
            "click .item-media .feed-attach .attach-preview-l": "_previewAttach", //预览附件
            "click .item-media .feed-attach .attach-play-l": "_playAttach", //播放音频
            "click .printer": "_printFeed", //打印feed
            "click .feed-location-fn-map": "_showFeedLocation", //打开定位地图
            //            "click .print-del-pic-ico": "printdelpic", //点击隐藏审批打印模板下的图片
            //            "click .feedlist-open-ecrypt": "openEcrypt", //点击解密查看
            //            "click .feed-audio-open-btn": "audioBtn", //点击播放录音
            //            "click .feed-audio-close-btn": "audioCloseBtn", //关闭播放录音
            //            "click .feed-location-fn-equipment": "feedLocationFnEquipment", //feedlocation信息查看设备
            "click .aj-feed-fn-com-btn": "feedFnComBtns" //feed的功能按钮事件集合
        },
        feedFnComBtns: function(e) { //feed的功能按钮事件集合
            var meEl = $(e.currentTarget);
            var warpEl = meEl.closest('.fs-list-item');
            var targetEl;
            var contactEl;

            //开始
            if (meEl.is('.aj-appr-history')) { //查看历史审批
                this._showApproveHisDialog(e);
            }
            if (meEl.is('.aj-approval')) { //批复
                this.approval(e);
            }
            if (meEl.is('.aj-appr-yes')) { //批复-同意
                this.appryes(e);
            }
            if (meEl.is('.aj-appr-no')) { //批复-不同意
                this.apprno(e);
            }
            if (meEl.is('.aj-Reply')) { //回复
                this.reply(e);
            }
            if (meEl.is('.aj-cc-add')) { //抄送提交按钮
                warpEl = meEl.closest('.reply-cc');
                targetEl = $('.aj-selectccer .input-tip', warpEl);
                contactEl = $('.fs-contact-bar-list', warpEl);
                if (!contactEl.html()) {
                    targetEl.click(); //触发选择框的点击事件
                    return false;
                } else {
                    this.ccadd(e);
                }

            }
            if (meEl.is('.undone-btn')) { //指令未完成
                this._showSwrUndoneDialog(e);
            }
            if (meEl.is('.done-btn')) { //已完成，点评结果
                this._showSwrDoneDialog(e);
            }
            if (meEl.is('.cancel-btn')) { //取消指令，转他人执行
                this._showSwrCancelDialog(e);
            }
            if (meEl.is('.normal-btn')) { //收到的指令回复-汇报结果
                this._showRwrNormalDialog(e);
            }
            if (meEl.is('.complete-btn')) { //指令，已完成汇报结果
                this._showRwrCompleteDialog(e);
            }
            if (meEl.is('.aj-appr-re')) { //收到的指令回复-汇报结果
                this._showSarNormalDialog(e);
            }
            if (meEl.is('.open-replies-imgorfile')) { //指令关键回复查看附件功能
                this.openRepliesImgorfile(e);
            }
            if (meEl.is('.aj-cc')) { //抄送
                this.cc(e);
            }
            if (meEl.is('.aj-sendwork')) { //发出的指令回复
                this.sendworkre(e);
            }
            if (meEl.is('.aj-working-normal')) { //普通指令中回复
                this.workingnorm(e);
            }
            if (meEl.is('.aj-working-finish')) { //已完成指令中回复
                this.workingfini(e);
            }
            if (meEl.is('.aj-work-unfinish')) { //未完成指令的回复
                this.workunfini(e);
            }
            if (meEl.is('.aj-work-finish')) { //已完成指令的回复
                this.workfini(e);
            }
            if (meEl.is('.aj-modifyapproval')) { //修改审批人窗口
                this.modifyapprer(e);
            }
            if (meEl.is('.aj-modifyapprer')) { //修改审批人按钮
                warpEl = meEl.closest('.reply-modifyapprer');
                targetEl = $('.aj-selectapprer .input-tip', warpEl);
                contactEl = $('.fs-contact-bar-list', warpEl);
                if (!contactEl.html()) {
                    targetEl.click(); //触发选择框的点击事件
                    return false;
                } else {
                    this.sendmodifyapprer(e);
                }
            }
            if (meEl.is('.islike-btn')) { //提交赞功能
                this.sendIsLike(e);
            }
            //^ 11.26
            if (meEl.is('.feed-location-fn-equipment')) { //feedlocation信息查看设备
                this.feedLocationFnEquipment(e);
                return false;
            }
            if (meEl.is('.feed-audio-close-btn')) { //关闭播放录音
                this.audioCloseBtn(e);
            }
            if (meEl.is('.feed-audio-open-btn')) { //点击播放录音
                this.audioBtn(e);
            }
            if (meEl.is('.feedlist-open-ecrypt')) { //点击解密查看
                this.openEcrypt(e);
            }
            if (meEl.is('.print-del-pic-ico')) { //点击隐藏审批打印模板下的图片
                this.printdelpic(e);
            }
            if (meEl.is('.aj-attention')) { //关注
                this.att(e);
            }
            if (meEl.is('.aj-placeonfile')) { //归档
                this.pof(e);
            }
            if (meEl.is('.unpof-bt')) { //取消归档
                this.unpofbt(e);
            }
            if (meEl.is('.aj-unattention')) { //取消关注
                this.showunatt(e);
            }
            if (meEl.is('.aj-forward')) { //转发
                this.fwd();
            }
        },
        openRepliesImgorfile: function(e) { //指令关键回复查看附件功能
            var meEl = $(e.currentTarget);
            var warpEl = meEl.closest('.replies-imgorfile-warp');
            var imgorfileEl = $('.replies-imgorfile', warpEl);
            meEl.hide();
            imgorfileEl.show();
        },
        printdelpic: function(e) { //点击隐藏审批打印模板下的图片
            var meEl = $(e.currentTarget);
            var picwarpEl = meEl.closest('.print-img-warp');
            picwarpEl.hide();
        },
        openEcrypt: function(e) { //点击解密查看
            var meEl = $(e.currentTarget);
            var model = this.model;
            var originData = model.get("originData");
            var itemEl = meEl.closest('.list-item');
            var contnetIsencryptedEl = $('.contnet-isencrypted', itemEl);
            var contnetIsencryptedTxt = $('.isencrypted-tit', contnetIsencryptedEl).text();
            var infoAllContnetEl = $('.info-all-contnet', itemEl);
            var printerBtnEl = $('.printer', itemEl);
            var beforeEl = '<div class="info-all-contnet-unlocktit"><img src="../../html/fs/assets/images/lock_open.png" alt=""/>' + contnetIsencryptedTxt + '</div>';
            var feedId = $('.item-face', itemEl).attr('feedid');
            publish.showFeedPwdValid(function(responseData) {
                if (responseData.success) {
                    //验证成功处理
                    //一般是显示出隐藏的feed或附件信息  
                    contnetIsencryptedEl.hide();
                    infoAllContnetEl.before(beforeEl);
                    infoAllContnetEl.show();
                    printerBtnEl.show();
                }
            }, function() {
            }, {
                "feedID": feedId //对给后台对应的feedID
            });
        },
        _showFeedLocation: function(evt) {
            var model = this.model;
            var feedLocation = model.get('feedLocation');
            fsMapOverlay.fixLocation(feedLocation);
            evt.preventDefault();
        },
        /*关闭播放录音窗口*/
        audioCloseBtn: function(e) {
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.list-item');
            var audioBtnEl = $('.audio-btn', itemEl);
            var audioWarpEl = $('.audio-warp', itemEl);
            audioWarpEl.hide();
            audioBtnEl.show();
            if (meEl.hasClass('important-reply-audio')) {  //关键回复录音
                this.importantAudioPlayer && this.importantAudioPlayer.stop();
            } else {     //普通录音
                this.audioPlayer && this.audioPlayer.stop();
            }
        },
        /* 点击播放录音 */
        audioBtn: function(e) {
            var meEl = $(e.currentTarget);
            var audioEl = meEl.closest('.audio-el');
            var audioWarpEl = $('.audio-warp', audioEl);
            var model = this.model,
                    originData = model.get('originData');
            meEl.hide();
            audioWarpEl.show();
            var audioSrc;
            var attachSize;
            //如果不是feed的录音就是关键回复的录音
            if (meEl.hasClass('important-reply-audio')) {  //关键回复录音
                attachSize = meEl.data('attachsize');
                audioSrc = meEl.data('attachpath');
                //初始化audio
                if (!this.importantAudioPlayer) {
                    this.importantAudioPlayer = new AudioPlayer({
                        "element": $('.audio-box', audioWarpEl),
                        "audioSrc": audioSrc,
                        "length": attachSize
                    });
                    this.compStore.push(this.importantAudioPlayer); //放入组件存储供以后删除
                }
                this.importantAudioPlayer.play(); //打开直接播放
            } else {    //普通录音
                attachSize = originData.audio.attachSize;
                audioSrc = model.get('attachPath');
                //初始化audio
                if (!this.audioPlayer) {
                    this.audioPlayer = new AudioPlayer({
                        "element": $('.audio-box', audioWarpEl),
                        "audioSrc": audioSrc,
                        "length": attachSize
                    });
                    this.compStore.push(this.audioPlayer); //放入组件存储供以后删除
                }
                this.audioPlayer.play(); //打开直接播放
            }
            /*if (originData.audio) {
             attachSize = originData.audio.attachSize;
             audioSrc = model.get('attachPath');
             } else {
             attachSize = meEl.data('attachsize');
             audioSrc = meEl.data('attachpath');
             }
             */

        },
        /* 定位信息-查看设备 */
        feedLocationFnEquipment: function(e) {
            var meEl = $(e.currentTarget);
            feedLocationFnEquipmentDialog.itemV = this;
            feedLocationFnEquipmentDialog.up = false; //定义一个值区别是不是UP样式
            var meEloffset = meEl.offset().top; //按钮的高度
            var scrollTop = $(document).scrollTop(); //滚动条的高度
            var limitHeiht = 275; //限制高度
            var fixedHeiht = 280; //定位高度
            if ((meEloffset - scrollTop) < limitHeiht) {
                fixedHeiht = -30;
                feedLocationFnEquipmentDialog.up = true;
            }
            //定位
            feedLocationFnEquipmentDialog.set('align', {
                selfXY: [320, fixedHeiht], // element 的定位点，默认为左上角
                baseElement: meEl, // 基准定位元素，默认为当前可视区域
                baseXY: [0, 0] // 基准定位元素的定位点，默认为左上角
            });
            feedLocationFnEquipmentDialog.show();

            return false;
        },
        sendReceiptAJAX: function(e) { //回执提交
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.list-item');
            var feedId = $('.item-face', itemEl).attr('feedid');
            var receiptfnwarpEl = $('.handle .receiptfnwarp', itemEl);
            var feedOpts = this.options; //feed item options
            var originData = this.model.get('originData'),
                    receiptData = originData.receipt;
            util.api({
                "url": '/FeedExtend/SendReceipt', //回执提交的接口地址
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "feedID": feedId
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        //成功之后
                        receiptfnwarpEl.html('<a href="javascript:void(0);" class="disable"><img src="../../html/fs/assets/images/receipted.gif" alt="" class="vm">已回执</a><i class="S_txt3">|</i>');
                        //that.updateModel(); //刷新列表
                        that._updateReceiptData(receiptData.receiptedCount + 1);
                        feedOpts.receiptCb && feedOpts.receiptCb.call(that, responseData, {
                            "feedID": feedId
                        });
                    }
                }
            });
        },
        istimeshow: function(e) { //公告的时间显示
            var elEl = this.$el;
            var that = this;
            var istimeshowEl = $('.istimeshow', elEl);
            var model = this.model;
            var feedID = model.get("feedID");
            var isShowBl = istimeshowEl.text();
            if (isShowBl == '显示') {
                announceontimeDialog.show();
            } else {
                util.api({
                    "url": '/FeedAnnounce/SetAnnounceIsShow ', //公告不显示时间提交接口地址
                    "type": 'post',
                    "data": {
                        "feedID": feedID, //信息源ID
                        //"feedModelType": 1, //1,工作管理 2,客群管理
                        "isShow": false, //是否显示
                        "showtimeDataType": 0, //有效时间枚举
                        "time": 0 //公示期
                    },
                    "dataType": 'json',
                    "success": function(responseData) {
                        if (responseData.success) {
                            that.updateModel(); //刷新列表
                        }
                    }
                });
            }
            announceontimeDialog.itemV = this;
        },
        leaveIsLike: function() { // 赞的人员信息TIP 离开隐藏
            var elEl = this.$el;
            var delayhide = function(argument) {
                $('.islike-tip', elEl).hide();
            };
            this.likeTimer = setTimeout(delayhide, 200);
        },
        enterIsLike: function(e) { // 赞的人员信息TIP 鼠标经过显示
            var that = this;
            var meEl = $(e.currentTarget);
            var elEl = this.$el;
            var isliketipEl = $('.islike-tip', meEl);
            var likeStyle = this.options.likeStyle;
            var islikeEl = $('.islike', elEl);
            var likeMoreEl = $('.islike-more', islikeEl);
            var model = this.model;
            var originData = model.get("originData");
            var feedID = originData.feedID;
            var isLike = true;
            /*  util.api({
             "url": '/FeedExtend/SetFeedLike', //赞的接口地址
             "type": 'post',
             "data": {
             "feedID": feedID,
             "isLike": isLike
             },
             "dataType": 'json',
             "success": function (responseData) {
             if (responseData.success) {
             if (likeStyle == 2) { //如果是feed详情页的赞把tip去掉
             that.islikelistbtn(e); //调用详情页显示所有赞过的人的列表
             } else {
             that.renderIslikeList(meEl, isliketipEl); //渲染赞列表
             }
             }
             }
             });*/
            if (likeStyle != 2) { //如果不是详情页2
                //大于5个人隐藏后面并显示更多按钮
                var empidsEl = $('.js-empids', islikeEl);
                if (empidsEl.length > 5) {
                    empidsEl.show().eq(3).nextAll().hide();
                    likeMoreEl.show();
                } else {
                    likeMoreEl.hide();
                    empidsEl.show();
                }
                isliketipEl.show();
                clearTimeout(this.likeTimer);
            }
        },
        sendIsLike: function(e) { //提交赞
            var meEl = $(e.currentTarget);
            var that = this;
            var model = this.model;
            var elEl = this.$el;
            var likeStyle = this.options.likeStyle; //是列表的赞吗？
            var islikeEl = $('.islike', elEl);
            var isliketipEl = $('.islike-tip', islikeEl);
            var empidsEl = $('.js-empids', islikeEl);
            var islikebtnEl = $('.islike-btn', islikeEl);
            var likecountEl = $('.likecount', islikeEl);
            var likeCountNumEl = $('.likecountnum', islikeEl);
            var likeMoreEl = $('.islike-more', islikeEl);
            var likeCountNum = likeCountNumEl.text() || 0;
            var originData = model.get("originData");
            var feedID = originData.feedID;
            var isLike = true;
            var islikeCur = islikeEl.is('.cur');
            var employeeID = currentUserData.employeeID;
            var name = currentUserData.name;
            var profileImage = currentUserData.profileImage;

            //按钮状态
            if (islikeCur) {
                isLike = false;
                islikeEl.removeClass('cur');
                islikebtnEl.attr('title', '赞');
            } else {
                isLike = true;
                islikeEl.addClass('cur');
                islikebtnEl.attr('title', '取消赞');
            }
            //发请求
            util.api({
                "url": '/FeedExtend/SetFeedLike', //赞的接口地址
                "type": 'post',
                "data": {
                    "feedID": feedID,
                    "isLike": isLike
                },
                "dataType": 'json',
                "success": function(responseData) {
                    if (responseData.success) {
                        if (likeStyle == 2) { //如果是feed详情页的赞把tip去掉
                            // 小箭头控制
                            $('.fs-list-item .item-func a', elEl).removeClass('fl-common-up-arrow');
                            meEl.addClass('fl-common-up-arrow');

                            //调用详情页显示所有赞过的人的列表
                            that.islikelistbtn(e);
                        } else {
                            that.renderIslikeList(meEl, isliketipEl); //渲染赞列表
                        }
                    }
                }
            });
        },
        renderIslikeList: function(meEl, warp) {
            var elEl = this.$el;
            var warpEl = warp;
            var model = this.model;
            var originData = model.get("originData");
            var feedID = originData.feedID;
            var islikeEl = $('.islike', elEl);
            var likecountnumEl = $('.likecount', elEl); //赞的按钮后面的数字
            util.api({
                "url": '/FeedExtend/GetFeedLikersOfFeedID', //根据feedID获取赞列表的地址
                "type": 'get',
                "data": {
                    "feedID": feedID,
                    "pageSize": 50,
                    "pageNumber": 1
                },
                "dataType": 'json',
                "success": function(responseData) {
                    var likeEmployees = responseData.value.likers;
                    var likersLen = likeEmployees.length;
                    var htmlStr = '';
                    var morebtnStr = '';
                    var imgStr = '';
                    if (responseData.success) {
                        if (likersLen > 0) {
                            _.each(likeEmployees, function(likeEmployeesdata, index) {
                                var name = likeEmployeesdata.name;
                                var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, 2);
                                var empID = likeEmployeesdata.employeeID;
                                imgStr += '<a href="#profile/=/empid-' + empID + '" title="' + name + '" class="js-empids"><img alt="' + name + '" src="' + profileImage + '"></a>';
                                likecountnumEl.html('<span class="likecountnum">(' + likersLen + ')</span>');
                            });
                            //人数大于5个显示更多
                            if (likeEmployees.length > 5) {
                                morebtnStr = '<a href="#stream/showfeed/=/id-' + feedID + '/open-like" title="更多" class="islike-more"></a>';
                            } else {
                                morebtnStr = '<a href="#stream/showfeed/=/id-' + feedID + '/open-like" title="更多" class="islike-more hide"></a>';
                            }
                            if (islikeEl.children().is('.islike-tip')) { //如果有提示框就添加内容没有就创建
                                $('.islike-tip', elEl).html('<div class="toparrow"> <em>◆</em> <span>◆</span> </div>' + imgStr + morebtnStr);
                            } else {
                                islikeEl.append('<div class="islike-tip" style="display:block"><div class="toparrow"> <em>◆</em> <span>◆</span> </div>' + imgStr + morebtnStr + '</div>');
                            }
                            var likeMoreEl = $('.islike-more', islikeEl);
                            //大于5个人隐藏后面并显示更多按钮
                            var empidsEl = $('.js-empids', islikeEl);
                            if (empidsEl.length > 5) {
                                empidsEl.show().eq(3).nextAll().hide();
                                likeMoreEl.show();
                            } else {
                                likeMoreEl.hide();
                                empidsEl.show();
                            }
                            warpEl.show();
                        } else {
                            likecountnumEl.html('');
                            warpEl.remove();
                        }
                    }
                }
            });
        },
        islikelistbtn: function(e) { //详情页显示所有赞过的人的列表
            var elEl = this.$el;
            var model = this.model;
            var originData = model.get("originData");
            var feedID = originData.feedID;
            var sectionEl = $('.replay-section', elEl);
            var likecountnumEl = $('.likecount', elEl); //赞的按钮后面的数字
            var replyContentEl = $('.feed-reply', elEl);
            var htmlStr = '';
            var imgStr = '';
            replyContentEl.hide();
            util.api({
                "url": '/FeedExtend/GetFeedLikersOfFeedID', //根据feedID获取赞列表的地址
                "type": 'get',
                "data": {
                    "feedID": feedID,
                    "pageSize": 50,
                    "pageNumber": 1
                },
                "dataType": 'json',
                "success": function(responseData) {

                    var likeEmployees = responseData.value.likers;
                    var likersLen = likeEmployees.length;

                    if (likersLen > 0) {
                        _.each(likeEmployees, function(likeEmployeesdata, index) {
                            var name = likeEmployeesdata.name;
                            var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, 2);
                            var empID = likeEmployeesdata.employeeID;
                            imgStr += '<a href="#profile/=/empid-' + empID + '" class="js-empids" title="' + name + '"><img alt="' + name + '" src="' + profileImage + '"></a>';
                        });
                        htmlStr = '<div class="list-repeat"><div class="feedlike-list fn-clear">' + imgStr + '</div></div>';
                        likecountnumEl.html('<span class="likecountnum">(' + likersLen + ')</span>');

                    } else {
                        htmlStr = '<div class="list-repeat"><div style="display: block;" class="list-empty-tip"><img class="icon-empty" alt="loading" src="../../html/fs/assets/images/clear.gif">&nbsp;&nbsp;<span class="empty-text">该信息没有被赞过</span></div></div>';
                        likecountnumEl.html('');
                    }
                    sectionEl.html(htmlStr).show();
                }
            });

        },
        _printFeed: function(evt) { //打印
            printPreviewDialog.set('itemV', this);
            printPreviewDialog.show();
            evt.preventDefault();
        },
        /* 回执提醒几人的链接 */
        receiptalertlist: function(e) {
            var that = this;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            var model = this.model,
                    originData = model.get('originData'),
                    serviceTime = originData.serviceTime;
            $('.more-menu', itemEl).hide();//隐藏更多的弹出框
            util.showTip({
                baseElement: meEl,
                afterShow: function(cb) {
                    var mainEl = this.element;
                    mainEl.html("正在努力的请求数据中……");
                    /* 请求数据 */
                    var ajax = util.api({
                        "url": '/Feed/GetFeedReceiptRangesByFeedID', //回执提醒几人接口地址
                        "type": 'get',
                        "data": {
                            "feedID": feedId
                        },
                        "dataType": 'json',
                        "success": function(responseData) {
                            if (responseData.success) {
                                var data = responseData.value;
                                var employeeID = 0, //员工ID
                                        name = "", //姓名
                                        profileImage = "", //头像地址
                                        isSendReceipt = "", //是否已读
                                        source = "", //来源枚举函数util.getSourceNameFromCode(source)
                                        receiptTime = 0, //回执时间
                                        contentHtrs = "";
                                var formDataStr = '';
                                _.each(data, function(receiptdata) {
                                    var employee = receiptdata.employee;
                                    if (employee) {
                                        employeeID = employee.employeeID;
                                        name = employee.name;
                                        profileImage = util.getAvatarLink(receiptdata.employee.profileImage, '3');
                                        isSendReceipt = receiptdata.isSendReceipt;
                                        receiptTime = receiptdata.receiptTime;
                                        source = receiptdata.source;
                                        receiptTime = moment.unix(receiptTime);
                                        receiptTime = util.getDateSummaryDesc(receiptTime, moment.unix(serviceTime), 2);
                                        source = util.getSourceNameFromCode(source);
                                        if (isSendReceipt) {
                                            isSendReceipt = "已回执";
                                            formDataStr = '，' + receiptTime + '，通过' + source;
                                        } else {
                                            isSendReceipt = "未回执";
                                            formDataStr = '';
                                        }
                                        contentHtrs += '<div class="sms-isread-items fn-clear"> <a href="#profile/=/empid-' + employeeID + '" class="profileimage"><img src="' + profileImage + '" /></a> <a href="#profile/=/empid-' + employeeID + '" class="name" style="min-width:60px;">' + name + '</a> <span class="isread-receipt">' + isSendReceipt + formDataStr + '</span></div>';
                                    }

                                });
                                contentHtrs = '<div class="sms-isread-tpl"><div class="sms-isread-warp">' + contentHtrs + '</div><div class="sms-isread-countman">共<span class="num">' + data.length + '</span>人</div> </div>';
                                /* 渲染 */
                                mainEl.html(contentHtrs).show();
                                cb();
                                // that.updateModel(); //刷新列表
                            }
                        }
                    });
                }
            });
            return false;
        },
        /* 短信提醒几人的链接 */
        msmremaindcount: function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            util.showTip({
                baseElement: meEl,
                afterShow: function(cb) {
                    var mainEl = this.element;
                    mainEl.html("正在努力的请求数据中……");
                    /* 请求数据 */
                    var ajax = util.api({
                        "url": '/Feed/GetFeedSMSRangesByFeedID', //短信提醒几人接口地址
                        "type": 'get',
                        "data": {
                            "feedID": feedId
                        },
                        "dataType": 'json',
                        "success": function(responseData) {
                            if (responseData.success) {
                                var data = responseData.value;
                                var employeeID = 0,
                                        name = "",
                                        profileImage = "",
                                        isRead = "", //是否已读
                                        source = "", //来源枚举函数util.getSourceNameFromCode(source)
                                        contentHtrs = "";
                                _.each(data, function(smsdata) {
                                    employeeID = smsdata.employee.employeeID,
                                            name = smsdata.employee.name,
                                            profileImage = util.getAvatarLink(smsdata.employee.profileImage, '3');
                                    isRead = smsdata.infoType,
                                            source = smsdata.source;
                                    if (isRead) {
                                        isRead = "已读";
                                    } else {
                                        isRead = "未读";
                                    }
                                    source = util.getSourceNameFromCode(source);
                                    contentHtrs += '<div class="sms-isread-items fn-clear"> <a href="#profile/=/empid-' + employeeID + '" class="profileimage"><img src="' + profileImage + '" alt="" ></a> <a href="#profile/=/empid-' + employeeID + '" class="name">' + name + '</a> <span class="isread">' + isRead + '，通过' + source + '</span> </div>';
                                });
                                contentHtrs = '<div class="sms-isread-tpl"><div class="sms-isread-warp">' + contentHtrs + '</div><div class="sms-isread-countman">共<span class="num">' + data.length + '</span>人</div> </div>';
                                /* 渲染 */
                                mainEl.html(contentHtrs);
                                cb();
                            }
                        }
                    });
                }
            });
            return false;
        },
        /*分享范围按钮*/
        groupbtn: function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            /* 调用弹层组件 */
            util.showTip({
                baseElement: meEl,
                afterShow: function(cb) {
                    var mainEl = this.element;

                    // mainEl.html('<img src="../../html/fs/assets/images/loading.gif">');//loadding图片
                    mainEl.html('正在努力的请求数据中……'); //loadding文字
                    /* 请求数据 */
                    var ajax = util.api({
                        "url": '/Account/GetHistoryFeedRangeEmployeeInfos', //分享范围接口地址
                        "type": 'get',
                        "data": {
                            "feedID": feedId
                        },
                        "dataType": 'json',
                        "success": function(responseData) {

                            if (responseData.success) {
                                var data = responseData.value;
                                var employeeID = 0,
                                        name = "",
                                        profileImage = "",
                                        contentHtrs = "",
                                        infoType = "";
                                _.each(data, function(groupdate) {
                                    employeeID = groupdate.employee.employeeID,
                                            name = groupdate.employee.name,
                                            profileImage = util.getAvatarLink(groupdate.employee.profileImage, '2'),
                                            infoType = groupdate.infoType;
                                    if (infoType == 1) {
                                        infoType = "新增";
                                    } else {
                                        infoType = "";
                                    }
                                    contentHtrs += '<div class="share-group-items fn-clear"> <a href="#profile/=/empid-' + employeeID + '" class="profileimage"><img src="' + profileImage + '" alt="" ></a> <a href="#profile/=/empid-' + employeeID + '" class="name">' + name + '</a> <span class="infotype">' + infoType + '</span> </div>';
                                });
                                contentHtrs = '<div class="share-group-tpl"><div class="share-group-warp">' + contentHtrs + '</div><div class="share-group-countman">共<span class="num">' + data.length + '</span>人</div> </div>';
                                /* 渲染 */
                                mainEl.html(contentHtrs);
                                cb();
                            }
                        }
                    });

                }
            });


            return false;
        },
        /*日程列表分享范围按钮*/
        schedulesgroupbtn: function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            /* 调用弹层组件 */
            util.showTip({
                baseElement: meEl,
                afterShow: function(cb) {
                    var mainEl = this.element;
                    /* 请求数据 */
                    var ajax = util.api({
                        "url": '/Account/GetHistoryFeedRangeEmployeeInfos', //接口地址
                        // "url": '/Account/GetFeedRangeEmployeeInfos', //日程列表分享范围接口地址
                        "type": 'get',
                        "data": {
                            feedID: feedId
                        },
                        "dataType": 'json',
                        "success": function(responseData) {

                            if (responseData.success) {
                                var data = responseData.value;
                                var employeeID = 0,
                                        name = "",
                                        profileImage = "",
                                        contentHtrs = "";

                                _.each(data, function(groupdate) {
                                    employeeID = groupdate.employeeID,
                                            name = groupdate.name,
                                            profileImage = util.getAvatarLink(groupdate.profileImage, '3');

                                    contentHtrs += '<div class="share-group-items fn-clear"> <a href="#profile/=/empid-' + employeeID + '" class="profileimage"><img src="' + profileImage + '" alt="" ></a> <a href="#profile/=/empid-' + employeeID + '" class="name">' + name + '</a> </div>';
                                });
                                contentHtrs = '<div class="share-group-tpl"><div class="share-group-warp">' + contentHtrs + '</div><div class="share-group-countman">共<span class="num">' + data.length + '</span>人</div> </div>';
                                /* 渲染 */

                                mainEl.html(contentHtrs);
                                cb();

                            }
                        }
                    });
                }
            });
            return false;
        },
        _previewImg: function(evt) {
            var importantReplyEl = $(evt.currentTarget).closest('.replies-imgorfile-warp'); //关键回复
            var model = this.model,
                    originData = model.get("originData"),
                    pictures,
                    replies,
                    previewData = [];
            $('.show-slide-up-tip-warp').hide(); //确定删除的提示框隐藏            
            if (importantReplyEl.length > 0) { //关键回复中的预览
                replies = originData.replies;
                _.each(replies, function(replyData, i) {
                    var pictures = replyData.pictures;
                    _.each(pictures, function(picture) {
                        previewData.push({
                            "previewPath": picture.attachPath + '2',
                            "originPath": picture.attachPath + '1',
                            "thumbPath": picture.attachPath + '3',
                            "createTime": picture.createTime,
                            "fileName": picture.attachName,
                            "fileSize": picture.attachSize
                        });
                    });
                });
                attachPreviewer.preview({
                    "type": "img",
                    "data": previewData,
                    "refId": originData.feedID,
                    "belongToType": "reply"
                });
            } else { //普通feed中图片的预览
                pictures = originData.pictures;
                _.each(pictures, function(picture, i) {
                    previewData[i] = {
                        "previewPath": picture.attachPath + '2',
                        "originPath": picture.attachPath + '1',
                        "thumbPath": picture.attachPath + '3',
                        "createTime": picture.createTime,
                        "fileName": picture.attachName,
                        "fileSize": picture.attachSize
                    };
                });
                attachPreviewer.preview({
                    "type": "img",
                    "data": previewData,
                    "refId": originData.feedID,
                    "belongToType": "feed"
                });
            }

        },
        /**
         * 点击文件预览直接调出文件阅读展示方式
         * @param evt
         * @private
         */
        _previewAttach: function(evt) {
            var meEl = $(evt.currentTarget),
                    importantReplyEl = meEl.closest('.replies-imgorfile-warp'), //关键回复
                    netdiskfileEl = meEl.closest('.netdiskfile'); //网盘发同事带过来的附件
            var model = this.model,
                    originData = model.get("originData"),
                    feedFiles = originData.files,
                    replies,
                    feedNDFiles,
                    file;
            var curEl = $(evt.currentTarget),
                    itemEl = curEl.closest('dl'),
                    attachId = itemEl.attr('attachid');
            if (importantReplyEl.length > 0) { //关键回复里的附件预览
                replies = originData.replies;
                _.some(replies, function(replyData, i) {
                    var replyFiles = replyData.files;
                    file = _.find(replyFiles, function(itemData) {
                        return itemData.attachID == attachId;
                    });
                    if (file) {
                        return true;
                    }
                });
            } else if (netdiskfileEl.length > 0) {   //网盘发同事带过来的附件
                feedNDFiles = originData.feedNDFiles;
                file = _.find(feedNDFiles, function(itemData) {
                    return itemData.ndFileID == attachId;
                });
            } else { //普通feed里的预览
                file = _.find(feedFiles, function(itemData) {
                    return itemData.attachID == attachId;
                });
            }
            fileReader.readFile({
                "fileId": file.attachID || file.ndFileID,
                "fileName": file.attachName,
                "filePath": file.attachPath
            });
            evt.preventDefault();
        }, /**
         * 点击音频文件直接播放
         * @param evt
         * @private
         */
        _playAttach: function(evt) {
            var meEl = $(evt.currentTarget),
                    importantReplyEl = meEl.closest('.replies-imgorfile-warp'), //关键回复
                    netdiskfileEl = meEl.closest('.netdiskfile'); //网盘发同事带过来的附件
            var model = this.model,
                    originData = model.get("originData"),
                    feedFiles = originData.files,
                    replies,
                    feedNDFiles,
                    file;
            var curEl = $(evt.currentTarget),
                    itemEl = curEl.closest('dl'),
                    attachId = itemEl.attr('attachid');
            if (importantReplyEl.length > 0) { //关键回复里的附件预览
                replies = originData.replies;
                _.some(replies, function(replyData, i) {
                    var replyFiles = replyData.files;
                    file = _.find(replyFiles, function(itemData) {
                        return itemData.attachID == attachId;
                    });
                    if (file) {
                        return true;
                    }
                });
            } else if (netdiskfileEl.length > 0) {   //网盘发同事带过来的附件
                feedNDFiles = originData.feedNDFiles;
                file = _.find(feedNDFiles, function(itemData) {
                    return itemData.ndFileID == attachId;
                });
            } else { //普通feed里的预览
                file = _.find(feedFiles, function(itemData) {
                    return itemData.attachID == attachId;
                });
            }
            attachPreviewer.preview({
                "type": "audio",
                "data": [
                    {
                        "previewPath": FS.BLANK_IMG,
                        "originPath": file.attachPath,
                        "thumbPath": FS.BLANK_IMG,
                        "createTime": file.createTime,
                        "fileName": file.attachName,
                        "fileSize": file.attachSize,
                        "fileId": file.attachID || file.ndFileID,
                        "employeeName": originData.sender.name
                    }
                ],
                "refId": originData.feedID,
                "belongToType": util.getAttachSourceName(file.source)
            });
            evt.preventDefault();
        },
        /* 投票相关元素绑定 */
        getVoteEls: function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'), //列表元素
                    voteEl = meEl.closest('.item-vote'), //投票大父级
                    mainEl = $('.vote-main', voteEl), //投票信息主元素
                    inletEl = $('.vote-inlet', voteEl), //投票默认窗口元素（入口）
                    cantseeEl = $('.aj-cantsee-con', mainEl), //cantsee窗口
                    defEl = $('.aj-status-def', mainEl), //默认窗口
                    seevoteBtnEl = $('.aj-seevote-btn', mainEl), //查看投票结果按钮
                    statusEl = $('.aj-status-vote', mainEl), //查看投票结果窗口
                    downloadresultEl = $('.downloadresult', voteEl), //下载投票结果
                    resultEl = $('.aj-status-result', mainEl); //投票成功后窗口

            var feedId = $('.item-face', itemEl).attr('feedid'),
                    titleEl = $('.tit', mainEl), //投票标题
                    seleinfoEl = $('.seleinfo', mainEl), //最多选几项
                    inletTitEl = $('.tit', inletEl), //入口处标题
                    timeEl = $('.time', mainEl), //截止时间
                    selecterEl = $('.selecter', mainEl), //默认的选项容器
                    resultTableEl = $('.result-table', mainEl), //投票后的选项
                    statusTableEl = $('.status-table', mainEl); //查看结果的选项
            return {
                "defEl": defEl,
                "cantseeEl": cantseeEl,
                "statusEl": statusEl,
                "resultEl": resultEl,
                "downloadresultEl": downloadresultEl,
                "feedId": feedId,
                "inletEl": inletEl,
                "seleinfoEl": seleinfoEl,
                "timeEl": timeEl,
                "titleEl": titleEl,
                "mainEl": mainEl,
                "selecterEl": selecterEl,
                "resultTableEl": resultTableEl,
                "statusTableEl": statusTableEl,
                "seevoteBtnEl": seevoteBtnEl,
                "inletTitEl": inletTitEl
            };
        },
        /* 投票-查看详情 */
        "seemoreinfobtn": function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    voteOptionIdLineEL = meEl.closest('tr'),
                    voteOptionIdEL = $('.selertitle', voteOptionIdLineEL),
                    voteOptionID = voteOptionIdEL.attr("voteoptionid"),
                    feedId = $('.item-face', itemEl).attr('feedid');

            util.showTip({
                baseElement: meEl,
                afterShow: function(cb) {
                    var mainEl = this.element;
                    mainEl.html("正在努力的请求数据中……");
                    /* 请求数据 */
                    var ajax = util.api({
                        "url": '/FeedExtend/GetVoteEmployees', //获取某一选项的投票人接口地址
                        "type": 'get',
                        "data": {
                            "feedID": feedId,
                            "voteOptionID": voteOptionID
                        },
                        "dataType": 'json',
                        "success": function(responseData) {
                            if (responseData.success) {
                                var data = responseData.value;
                                var employeeID = 0,
                                        name = "",
                                        profileImage = "",
                                        voteTime = "", //是否已读
                                        contentHtrs = "";
                                _.each(data, function(votedata) {
                                    employeeID = votedata.employeeID,
                                            name = votedata.employee.name,
                                            profileImage = util.getAvatarLink(votedata.employee.profileImage, '3'),
                                            voteTime = votedata.voteTime;
                                    voteTime = moment.unix(voteTime).format('MMMDD日 HH:mm');
                                    contentHtrs += '<div class="sms-isread-items fn-clear"> <a href="#profile/=/empid-' + employeeID + '" class="profileimage"><img src="' + profileImage + '" alt="" ></a> <a href="#profile/=/empid-' + employeeID + '" class="name">' + name + '</a> <span class="isread">' + voteTime + '</span> </div>';
                                });
                                contentHtrs = '<div class="sms-isread-tpl"><div class="sms-isread-warp" style="width:220px">' + contentHtrs + '</div><div class="sms-isread-countman">共<span class="num">' + data.length + '</span>人</div> </div>';
                                /* 渲染 */
                                mainEl.html(contentHtrs);
                                cb();
                            }
                        }
                    });
                }
            });
            return false;
        },
        /* 投票按钮 */
        "sendvotebtn": function(e) {
            var that = this,
                    voteEls = this.getVoteEls(e),
                    inputids = [],
                    inputIdEl = $('input:checked', voteEls.selecterEl);
            var elEl = this.$el;
            var model = this.model,
                    originData = model.get('originData'),
                    receipt = originData.receipt;

            inputIdEl.each(function(i) {
                inputids[i] = $(this).val();
            });
            if (inputids.length > 0) {
                util.api({
                    "url": '/FeedExtend/SubmitVote', //投票提交接口地址
                    "type": 'post',
                    "data": {
                        "feedID": voteEls.feedId,
                        "voteOptionIDs": inputids //选择的选项ID串
                    },
                    "success": function(responseData) {
                        if (responseData.success) {
                            //投票完毕后自动回执
                            if (receipt && receipt.myReceiptStatus == 1) { //只在未回执的状态下发送
                                util.api({
                                    "url": '/FeedExtend/SendReceipt', //回执提交的接口地址
                                    "type": 'post',
                                    "dataType": 'json',
                                    "data": {
                                        "feedID": voteEls.feedId
                                    },
                                    "success": function(responseData) {
                                        if (responseData.success) {
                                            that.updateModel(function() {
                                                $('.aj-open-vote-btn', elEl).click();
                                            }); //刷新列表
                                        }
                                    }
                                });
                            } else {
                                that.updateModel(function() {
                                    $('.aj-open-vote-btn', elEl).click();
                                });
                            }
                        }

                    }
                });
            } else {
                if (!voteDialog.rendered) {
                    voteDialog.render();
                }

                voteDialog.show();
                $('.close-btn', voteDialog.element).click(function() {
                    voteDialog.hide();
                });
            }


            return false;
        },
        /* 返回投票按钮 */
        "backvotebtn": function(e) {
            var voteEls = this.getVoteEls(e);
            voteEls.statusEl.hide();
            voteEls.defEl.show();
            voteEls.resultEl.hide();
        },
        /* 查看投票结果按钮 */
        "seevotebtn": function(e) {
            var voteEls = this.getVoteEls(e);
            var canViewResult = voteEls.mainEl.data('canViewResult');
            voteEls.defEl.hide();
            voteEls.timeEl.show();
            if (!canViewResult) { //是否可以查看结果
                voteEls.cantseeEl.show();
                voteEls.resultEl.hide();
            } else {

                voteEls.statusEl.show();
                voteEls.cantseeEl.hide();
            }

            return false;
        },
        /* 显示投票详情 */
        "openvotebtn": function(e) {
            var voteEls = this.getVoteEls(e);
            util.api({
                "url": '/Feedextend/GetVoteItemByID', //显示投票详情接口地址
                "type": 'get',
                "data": {
                    "feedID": voteEls.feedId
                },
                "success": function(responseData) {
                    var data = responseData.value;

                    if (data) {
                        var title = data.title || "", //投票标题
                                canVote = data.canVote, //是否可以投票
                                canViewResult = data.canViewResult, //是否可以查看结果
                                voteCountNum = data.voteCount, //可选选项的数量
                                voteCount = '最多选择' + voteCountNum + '项',
                                voteEmpCount = Number(data.voteEmpCount), //已投票数
                                isAnoymouse = data.isAnoymouse, //是否匿名
                                deadline = moment.unix(data.deadline).format('MMMDD日 HH:mm:ss'), //截止时间
                                hVoteOptions = data.hVoteOptions, //选项组
                                barcolor = [' green', ' red', ' orange', ' pink', ' blue'],
                                selecterlist = "",
                                resultTablelist = '',
                                percent = "",
                                inputType = "checkbox";
                        var voteEmpCountStr = '';
                        voteEls.mainEl.data('canViewResult', canViewResult);
                    }
                    if (voteEmpCount > 0) {
                        voteEmpCountStr = voteEmpCount + '人已投票，';
                    } else {
                        voteEmpCountStr = '';
                    }
                    if (isAnoymouse) {
                        deadline = '提示：匿名投票，' + voteEmpCountStr + '截止时间' + deadline + '。';
                    } else {
                        deadline = '提示：' + voteEmpCountStr + '截止时间' + deadline + '。';
                    }

                    if (voteCountNum == 1) {
                        inputType = "radio";
                    }

                    var seemoreBtn = '';
                    _.each(hVoteOptions, function(voteseledata, index) {
                        var tit = voteseledata.optionTitle,
                                id = voteseledata.voteOptionID,
                                isSeemore = 'aj-seemore-info-btn',
                                selectedCount = Number(voteseledata.selectedCount); //选择数量

                        if (data.isAnoymouse || selectedCount == 0) {
                            seemoreBtn = '';
                        } else {
                            seemoreBtn = '<div class="seemore"> <span><a href="javascript:void(0);" class="' + isSeemore + '">查看详情</a></span> <div class="seemore-info"></div> </div>';
                        }
                        //selectedCount = 3, voteEmpCount = 11;
                        percent = Math.round(selectedCount / voteEmpCount * 100); //用四舍五入算百分比
                        if (selectedCount == 0) {
                            //                            isSeemore = '';
                            percent = 0;
                        }
                        //颜色条控制
                        if (index > (barcolor.length - 1)) {
                            index = index % barcolor.length;
                        }

                        selecterlist += '<label> <input type="' + inputType + '" value="' + id + '" name="voteinput">' + tit + '</label>';
                        resultTablelist += '<tr> <td width="112" align="right"><span class="selertitle" voteoptionid="' + id + '">' + tit + '</span></td> <td width="256"><span class="schedulebar' + barcolor[index] + '"><span class="othervotebar aj-barwidth" style="width:' + percent + '%"></span></span><span class="num">' + selectedCount + ' (' + percent + '%)</span></td> <td>' + seemoreBtn + '</td> </tr>';

                    });
                    if (responseData.success) {
                        voteEls.titleEl.text(title);
                        voteEls.seleinfoEl.text(voteCount);
                        voteEls.timeEl.text(deadline);
                        voteEls.selecterEl.html(selecterlist);
                        voteEls.resultTableEl.html(resultTablelist);
                        voteEls.statusTableEl.html(resultTablelist);
                        voteEls.mainEl.show();
                        voteEls.inletEl.hide();
                        voteEls.seevoteBtnEl.hide();
                        if (canVote) { //是否可以投票
                            voteEls.statusEl.hide();
                            voteEls.defEl.show();
                            voteEls.resultEl.hide();
                        } else {
                            voteEls.statusEl.hide();
                            voteEls.defEl.hide();
                            voteEls.resultEl.show();
                        }
                        if (isAnoymouse) { //是否可以下载投票结果
                            voteEls.downloadresultEl.hide();
                        }

                        if (!canViewResult) { //是否可以查看结果
                            voteEls.cantseeEl.show();
                            voteEls.seevoteBtnEl.hide();
                            voteEls.resultEl.hide();
                            voteEls.timeEl.hide();
                            if (canVote) {
                                voteEls.cantseeEl.hide();
                            }
                        } else {
                            voteEls.seevoteBtnEl.show();
                        }
                        if (data.voteEmpCount == 0) {
                            voteEls.seevoteBtnEl.hide();
                        }
                        /* 果选择的数量大于可选数量则弹出提示框 */
                        flutil.checkboxIsoverstep(voteEls.defEl, voteCountNum, function() {
                            if (!voteOverstepDialog.rendered) {
                                voteOverstepDialog.render();
                                $('.close-btn', voteOverstepDialog.element).click(function() {
                                    voteOverstepDialog.hide();
                                });
                            }
                            voteOverstepDialog.voteCountNum = voteCountNum;
                            voteOverstepDialog.show();
                        });
                    }
                }
            });
            // return false;
        },
        /* 关闭投票详情 */
        "closevotebtn": function(e) {
            var voteEls = this.getVoteEls(e);
            var meEl = $(e.currentTarget),
                    voteEl = meEl.closest('.item-vote'),
                    inletEl = $('.vote-inlet', voteEl),
                    mainEl = $('.vote-main', voteEl);
            inletEl.show();
            voteEls.cantseeEl.hide();
            mainEl.hide();
        },
        /* 执行中的指令回复 */
        "workingre": function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl),
                    boxEl = $('.reply-workingre', replyEl);
            var htmlStr = '<div class="list-repeat reply-workingre"><div class="LR-feed"><table width="100%" border="0" cellspacing="0" cellpadding="0" class=""><tbody><tr><td width="70">回复指令：</td><td width="90"><button type="submit" class="button-green place-btn aj-working-normal aj-feed-fn-com-btn" style="vertical-align:middle;">普通回复</button></td><td><button type="submit" class="button-green place-btn aj-working-finish aj-feed-fn-com-btn" style="vertical-align:middle;">已完成，汇报结果</button></td></tr></tbody></table></div></div>';
            if (!boxEl.is(':visible')) {
                replyEl.html('').html(htmlStr);
                boxEl.show();
            } else {
                boxEl.hide();
            }
        },
        /* 发出的指令回复 */
        "sendworkre": function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl),
                    boxEl = $('.reply-sendworkre', replyEl);
            var htmlStr = '<div class="list-repeat reply-sendworkre"><div class="LR-feed"><table width="100%" border="0" cellspacing="0" cellpadding="0" class=""><tbody><tr><td width="70">确认结果：</td><td width="90"><button type="submit" class="button-green place-btn aj-work-unfinish aj-feed-fn-com-btn" style="padding:6px 15px;line-height:16px;">未完成<br/>继续执行</button></td><td><button type="submit" class="button-green place-btn aj-work-finish aj-feed-fn-com-btn"  style="padding:6px 15px;line-height:16px;">已完成<br/>点评结果</button></td></tr></tbody></table></div></div>';
            if (!boxEl.is(':visible')) {
                replyEl.html('').html(htmlStr);
                boxEl.show();
            } else {
                boxEl.hide();
            }

        },
        /* 指令中-普通 */
        workingnorm: function() {
            if (!workingNormDialog.rendered) {
                workingNormDialog.render();

                $('.close-btn', workingNormDialog.element).click(function() {
                    workingNormDialog.hide();
                });
            }

            workingNormDialog.show();
        },
        /* 指令中-已完成 */
        workingfini: function() {
            if (!workingFiniDialog.rendered) {
                workingFiniDialog.render();

                $('.close-btn', workingFiniDialog.element).click(function() {
                    workingFiniDialog.hide();
                });
            }

            workingFiniDialog.show();
        },
        /* 指令的-未完成 */
        workunfini: function() {
            if (!workUnFiniDialog.rendered) {
                workUnFiniDialog.render();

                $('.close-btn', workUnFiniDialog.element).click(function() {
                    workUnFiniDialog.hide();
                });
            }
            workUnFiniDialog.show();
        },
        "workfiniDialogRender": function() { //点评指令已完成加选人组件
            var elEl,
                    forwarderEl;
            workFiniDialog.render();
            elEl = workFiniDialog.element;
            forwarderEl = $('.aj-addworker', elEl);

            var sb = new SelectBar({
                "element": forwarderEl,
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //可以多选
                "title": "添加抄送人", //默认文字内容
                "autoCompleteTitle": "请输入姓名或拼音"
            });

            $('.close-btn', workFiniDialog.element).click(function() {
                workFiniDialog.hide();
            });
        },
        /* 指令的-完成 */
        workfini: function() {
            if (!workFiniDialog.rendered) {
                this.workfiniDialogRender();
            }
            workFiniDialog.show();
        },
        "modifyapprerSelectBar": function() { //修改审批人加选人组件
            var elEl = this.modifyapprer.element,
                    forwarderEl = $('.aj-selectapprer', elEl);
            var model = this.model,
                    originData = model.get('originData'),
                    approve = originData.approve,
                    senderId = approve.senderID,
                    sbData;
            sbData = _.reject(contactData["p"], function(itemData) {
                return itemData.id == senderId;
            });
            var sb = new SelectBar({
                "element": forwarderEl, //容器
                "data": [
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": sbData //数据来源通过contactData获取
                    }
                ],
                "singleCked": true, //单选吗？
                "title": "选择审批人(一个)", //默认文字内容
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            this.modifyapprerSb = sb; //保存起来，为了避免多次渲染
            //this.compStore.push(sb); //注册到compStore数组，为了将来销毁
        },
        /* 修改审批人按钮 */
        "sendmodifyapprer": function(e) {
            //发送关注请求
            var that = this,
                    meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid'),
                    issendapper = $(".is-sendapper", itemEl),
                    issendsms = issendapper.is(':checked'),
                    replyEl = $('.replay-section', itemEl),
                    boxEl = $('.reply-modifyapprer', replyEl);
            var modifyapprerSb = this.modifyapprerSb,
                    sbData = modifyapprerSb.getSelectedData(), //取得选人组件的数据
                    memberData = sbData.p || []; //p是人的数据g是部门的数据
            memberData = Number(memberData[0]); //转整数
            if (memberData) {
                util.api({
                    "url": '/FeedApprove/ToNextApprover', //修改审批人接口地址
                    "type": 'post',
                    "data": {
                        "feedID": feedId,
                        "approverID": memberData,
                        "isSendSms": issendsms
                    },
                    "success": function(responseData) {
                        if (responseData.success) {
                            boxEl.hide();
                            that.updateModel(); //刷新列表
                        }
                    }
                });
            }
        },
        /* 修改审批人窗口 */
        "modifyapprer": function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl),
                    replyContentEl = $('.feed-reply', itemEl),
                    boxEl = $('.reply-modifyapprer', replyEl);
            replyContentEl.hide();
            var htmlStr = '<div class="list-repeat reply-modifyapprer"><div class="LR-feed"><table width="100%" border="0" cellspacing="0" cellpadding="0" class=""><tr><td colspan="2"><div class="aj-selectapprer selectapprer">选择审批人（一个）</div></td></tr><tr><td><span class="label-for fn-hide"><input name="" class="is-sendapper" type="checkbox" style="vertical-align:middle;margin-right:4px;" value=""/><label>立即发送短信息到审批人的手机上</label></span></td><td align="right"><button type="submit" class="button-green place-btn aj-modifyapprer aj-feed-fn-com-btn" style="vertical-align:middle;">修改审批人</button></td></tr></table></div></div>';
            if (!boxEl.is(':visible')) {
                replyEl.html(htmlStr).show();
                this.modifyapprerSelectBar();
                boxEl.show();
                $('.fs-list-item .item-func a', itemEl).removeClass('fl-common-up-arrow');
                $('.fs-list-item .item-func .islike-btn', itemEl).removeClass('fl-common-up-arrow');
                meEl.addClass('fl-common-up-arrow');
            } else {
                boxEl.hide();
                meEl.removeClass('fl-common-up-arrow');
            }
        },
        "ccSelectBar": function() { //抄送加选人组件
            var elEl = this.ccSelectBar.element,
                    forwarderEl = $('.aj-selectccer', elEl);
            var sb = new SelectBar({
                "element": forwarderEl, //容器
                "data": [
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //单选吗？
                "title": "添加抄送人（一个或多个）", //默认文字内容
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            this.ccSelectBarsb = sb; //保存起来，为了避免多次渲染
            this.compStore.push(sb); //注册到compStore数组，为了将来销毁
        },
        /* 抄送 */
        "cc": function(e) {
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl),
                    replyContentEl = $('.feed-reply', itemEl),
                    boxEl = $('.reply-cc', replyEl);
            replyContentEl.hide();
            var htmlStr = '<div class="list-repeat reply-cc"><div class="LR-feed"><table width="100%" border="0" cellspacing="0" cellpadding="0" class=""><tr><td><div class="aj-selectccer">添加抄送人</div></td></tr><tr><td align="right"><button type="submit" class="aj-feed-fn-com-btn button-green place-btn aj-cc-add marg10" style="vertical-align:middle;">添加抄送人</button></td></tr></table></div></div>';
            if (!boxEl.is(':visible')) {
                replyEl.html(htmlStr).show();
                boxEl.show();
                $('.fs-list-item .item-func a', itemEl).removeClass('fl-common-up-arrow');
                $('.fs-list-item .item-func .islike-btn', itemEl).removeClass('fl-common-up-arrow');
                meEl.addClass('fl-common-up-arrow');
                //if (!this.ccSelectBarsb) {
                this.ccSelectBar();
                //}
            } else {
                boxEl.hide();
                meEl.removeClass('fl-common-up-arrow');
            }

        },
        /* 抄送提交 */
        "ccadd": function(e) {
            var that = this,
                    meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl),
                    feedId = $('.item-face', itemEl).attr('feedid'),
                    boxEl = $('.reply-cc', replyEl);
            var ccSelectBarsb = this.ccSelectBarsb,
                    sbData = ccSelectBarsb.getSelectedData(), //取得选人组件的数据
                    memberData = sbData.p || [], //p是人的数据g是部门的数据
                    employeeAtNames = ''; //{String} eg. at+name+' '
            _.each(memberData, function(memberId) {
                employeeAtNames += '@' + util.getContactDataById(memberId, 'p').name + ' ';
            });
            util.api({
                "url": '/FeedApprove/SenderAddAtEmployees', //添加抄送人接口地址
                "type": 'post',
                "data": {
                    "feedID": feedId,
                    "employeeAtNames": employeeAtNames,
                    "employeeIDs": memberData
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        that.updateModel(); //刷新列表
                        boxEl.hide();
                    }
                }
            });
        },
        "approval": function(e) {
            var that = this;
            var elEl = this.$el;
            var model = this.model,
                    originData = model.get('originData'),
                    feedOpts = this.options;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyContentEl = $('.feed-reply', itemEl);
            var fsReply,
                    isSendSmsDisabled;
            var replyListOpts = _.extend({
                "listPath": "/Feed/GetFeedReplysByFeedID", //请求回复列表地址
                "withPagination": true //带分页
            }, feedOpts['replyListOpts']);

            var withMedia = !!this.options["replyWithMedia"];
            $('.fs-list-item .item-func a', itemEl).removeClass('fl-common-up-arrow');

            if (!itemEl.data('fsReply')) {
                if (currentUserData.id == originData.sender.employeeID) {
                    isSendSmsDisabled = true;
                } else {
                    isSendSmsDisabled = false;
                }
                fsReply = new FsReply({
                    "trigger": meEl,
                    "triggerText": "批复",
                    "element": replyContentEl,
                    "bbarTpl": '<span class="fs-reply-send-sms label-for fn-hide"><input type="checkbox" name="send_sms" class="is-send-sms" ' + (isSendSmsDisabled ? 'disabled="disabled"' : '') + ' /> <label>推送短信给：<em class="user-name">' + originData.sender.name + '</em></label></span>',
                    //请求回复列表附加请求参数
                    "defaultRequestData": function() {
                        return {
                            "feedID": model.get('feedID') //回复所属feedID
                        };
                    },
                    //发送回复附加请求参数
                    "replyDefaultRequestData": function() {
                        var feedSenderID = 0,
                                feedReceiverID = 0,
                                feedType = model.get('feedType');
                        if (feedType == 3) {
                            feedSenderID = originData.sender.employeeID;
                            feedReceiverID = originData.work.executerID;
                        } else if (feedType == 4) {
                            feedSenderID = originData.sender.employeeID;
                            feedReceiverID = originData.approve.currentApproverID;
                        }

                        return {
                            "feedType": feedType, //feedType参数
                            "replyToReplyID": 0, //feed的回复传0作为占位
                            "replyToEmployeeID": 0, //feed的回复传0作为占位
                            "feedSenderID": feedSenderID, //信息发出人ID（指令发出人或审批发出人），如 FeedType 既不是指令也不是审批，则不填此参数
                            "feedReceiverID": feedReceiverID, //信息接收人ID（指令执行人或审批人），如 FeedType 既不是指令也不是审批，则不填此参数
                            "isSendSms": $('.is-send-sms', replyContentEl).prop('checked') //是否发送短信
                        };
                    },
                    //请求一条回复内容时的附加参数
                    "detailDefaultRequestData": function() {
                        return {
                            "feedType": model.get('feedType'), //feedType参数
                            "feedID": originData.feedID
                        };
                    },
                    //发送回复成功后回调
                    "replyCb": function(responseData) {
                        if (responseData.success) {
                            if (feedOpts.reloadAfterReply) { //回复后整体刷新整个feed
                                that.updateModel();
                            } else {
                                //发送回复成功后取消发送短信选中
                                $('.is-send-sms', replyContentEl).prop('checked', false);
                                //如果带回复列表，自动添加一条新回复
                                if (responseData.success && this.get('listOpts')) {
                                    this.addNewReply(responseData.value);
                                }
                            }
                        }
                    },
                    "withMedia": withMedia,
                    "listOpts": replyListOpts
                });
                fsReply.show();
                this.compStore.push(fsReply);
                itemEl.data('fsReply', fsReply);
                //审批类型的回复特殊化
                this.approveReplyInit();
                //新增可视范围事件监听
                fsReply.on('addatrange', function(rangeData) {
                    var rangeNames = rangeData.rangeNames,
                            groupData = _.groupBy(rangeNames, function(groupItem) {
                                if (groupItem.value) {
                                    return "circle";
                                } else {
                                    return "employee";
                                }
                            }),
                            circleNum,
                            employeeNum,
                            tipArr = [],
                            titleTipArr = [];
                    circleNum = groupData["circle"] ? groupData["circle"].length : 0;
                    employeeNum = groupData["employee"] ? groupData["employee"].length : 0;
                    titleTipArr = titleTipArr.concat(_.map(groupData["employee"], function(itemData) {
                        return itemData.value2;
                    }));
                    titleTipArr = titleTipArr.concat(_.map(groupData["circle"], function(itemData) {
                        return itemData.value2;
                    }));

                    if (circleNum > 0) {
                        if (circleNum == 1) {
                            tipArr.push(groupData["circle"][0].value2);
                        } else {
                            tipArr.push(circleNum + '个部门');
                        }
                    }
                    if (employeeNum > 0) {
                        if (employeeNum == 1) {
                            tipArr.push(groupData["employee"][0].value2);
                        } else {
                            tipArr.push(employeeNum + '个同事');
                        }
                    }
                    if (circleNum + employeeNum > 0) {
                        $('.item-info .group a,.item-info .schedulesgroup a', elEl).html(tipArr.join('，')).attr('title', titleTipArr.join('，'));
                    }
                });
            }

            //判断什么时候显示箭头
            if (replyContentEl.is(':visible')) {
                meEl.addClass('fl-common-up-arrow');
            } else {
                meEl.removeClass('fl-common-up-arrow');
            }
        },
        approveReplyInit: function() {
            var elEl = this.$el,
                    model = this.model,
                    fsReply = elEl.data('fsReply'),
                    replyEl = fsReply.element,
                    submitBoxEl = $('.fs-reply-submit-box', replyEl); //主回复框
            var tbarEl = $('<div class="sar-action-tbar"></div>');
            var htmlStr = '<div class="list-repeat reply-approval"><table width="100%" border="0" cellspacing="0" cellpadding="0" class=""><tr><td width="65">批复意见：</td><td width="68"><button type="submit" class="button-green place-btn aj-appr-yes aj-feed-fn-com-btn" style="vertical-align:middle;">同意</button></td><td width="82"><button type="submit" class="button-green place-btn aj-appr-no aj-feed-fn-com-btn" style="vertical-align:middle;">不同意</button></td><td width="70"><button type="submit" class="aj-feed-fn-com-btn button-green place-btn aj-appr-re" style="vertical-align:middle;">复议</button></td><td><a href="javascript:void(0);" class="aj-feed-fn-com-btn aj-appr-history">查看历史</a></td></tr></table></div>';
            tbarEl.html(htmlStr);
            tbarEl.insertAfter(submitBoxEl);
            //隐藏默认发布框
            submitBoxEl.hide();
        },
        /* 批复-同意 */
        appryes: function() {
            appryesDialog.itemV = this;
            if (!appryesDialog.rendered) {
                appryesDialog.render();
            }
            appryesDialog.show();
        },
        /* 批复-不同意 */
        apprno: function() {
            apprnoDialog.itemV = this;
            if (!apprnoDialog.rendered) {
                apprnoDialog.render();
            }
            apprnoDialog.show();
        },
        /* 批复-查看历史 */
        apprrehistory: function() {
            historyDialog.itemV = this;
            if (!historyDialog.rendered) {
                historyDialog.render();
            }
            historyDialog.show();
        },
        _updateReceiptData: function(receiptedCount) {
            var elEl = this.$el,
                    receiptfnEl = $('.receiptfnBtnwarp', elEl),
                    receiptRemaindEl = $('.receiptfnwarp', elEl);
            var model = this.model;
            var originData = model.get('originData'),
                    receiptData = originData.receipt;
            var receiptfn,
                    receiptRemaind,
                    isSendSmsStr = '';
            if (receiptedCount == 0) {
                receiptfn = '<a href="javascript:void(0);" class="aj-receipt-fn">回执</a><i class="S_txt3">|</i>';
            } else {
                receiptfn = '<a href="javascript:void(0);" class="disable"><img src="' + FS.ASSETS_PATH + '/images/receipted.gif" alt="" class="vm">已回执</a><i class="S_txt3">|</i>';
            }
            if (receiptData.isSendSms) {
                isSendSmsStr = '已发短信，';
            }
            receiptRemaind = '<a href="#" class="receiptalertlist alertlistbtn">需要' + receiptData.requireReceiptCount + '人回执，' + isSendSmsStr + '已回执' + receiptedCount + '人</a>';
            //设置数据存储
            model.set({
                "receiptfn": receiptfn,
                "receiptRemaind": receiptRemaind,
                "receiptedCount": receiptedCount
            }, {
                "silent": true
            });
            //手动更新ui
            receiptfnEl.html(receiptfn);
            receiptRemaindEl.html(receiptRemaind);
        },
        /* 回复 */
        "reply": function(evt) {
            var that = this;
            var elEl = this.$el;
            var model = this.model,
                    originData = model.get('originData'),
                    feedId = model.get('feedID'),
                    feedOpts = this.options;
            var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl),
                    commenReplyEl = $('.commen-replay-section', itemEl),
                    replybtnEl = $('.aj-Reply', itemEl),
                    replyContentEl = $('.feed-reply', itemEl),
                    childReplyContentEl = $('.feed-reply', replyContentEl);
            var fsReply,
                    isSendSmsDisabled;
            var replyListOpts = _.extend({
                "listPath": "/Feed/GetFeedReplysByFeedID", //请求回复列表地址
                "withPagination": true //带分页
            }, feedOpts['replyListOpts']);
            var withMedia = !!this.options["replyWithMedia"];
            var itemfuncEl = meEl.closest('.item-func');
            var siblingfeedreplyEl = itemfuncEl.siblings('.feed-reply');
            $('.show-slide-up-tip-warp').hide(); //确定删除的提示框隐藏
            replyEl.hide();
            commenReplyEl.show();
            if (!itemEl.data('fsReply')) {
                if (currentUserData.id == originData.sender.employeeID) {
                    isSendSmsDisabled = true;
                } else {
                    isSendSmsDisabled = false;
                }
                fsReply = new FsReply({
                    "feedID": 457,
                    "trigger": meEl,
                    "element": replyContentEl,
                    "bbarTpl": '<span class="fs-reply-send-sms label-for fn-hide"><input type="checkbox" name="send_sms" class="is-send-sms" ' + (isSendSmsDisabled ? 'disabled="disabled"' : '') + ' /> <label>推送短信给：<em class="user-name">' + model.get('senderNameNoLink') + '</em></label></span>',
                    //请求回复列表附加请求参数
                    "defaultRequestData": function() {
                        return {
                            "feedID": feedId //回复所属feedID
                        };
                    },
                    //发送回复附加请求参数
                    "replyDefaultRequestData": function() {
                        var feedSenderID = 0,
                                feedReceiverID = 0,
                                feedType = model.get('feedType');
                        if (feedType == 3) {
                            feedSenderID = originData.sender.employeeID;
                            feedReceiverID = originData.work.executerID;
                        } else if (feedType == 4) {
                            feedSenderID = originData.sender.employeeID;
                            feedReceiverID = originData.approve.currentApproverID;
                        }
                        return {
                            "feedType": feedType, //feedType参数
                            "replyToReplyID": 0, //feed的回复传0作为占位
                            "replyToEmployeeID": 0, //feed的回复传0作为占位
                            "feedSenderID": feedSenderID, //信息发出人ID（指令发出人或审批发出人），如 FeedType 既不是指令也不是审批，则不填此参数
                            "feedReceiverID": feedReceiverID, //信息接收人ID（指令执行人或审批人），如 FeedType 既不是指令也不是审批，则不填此参数
                            "isSendSms": $('.is-send-sms', replyContentEl).prop('checked') //是否发送短信
                        };
                    },
                    //请求一条回复内容时的附加参数
                    "detailDefaultRequestData": function() {
                        return {
                            "feedType": model.get('feedType'), //feedType参数
                            "feedID": originData.feedID
                        };
                    },
                    //发送回复成功后回调
                    "replyCb": function(responseData) {
                        if (responseData.success) {
                            //如果是未回执的调用回执回调
                            var receiptData = originData.receipt;
                            if (receiptData && receiptData.myReceiptStatus == 1) { //未回执
                                //设置成回执状态
                                that._updateReceiptData(receiptData.receiptedCount + 1);
                                feedOpts.receiptCb && feedOpts.receiptCb.call(that, responseData, {
                                    "feedID": feedId
                                });
                            }
                            //刷新feed操作
                            if (feedOpts.reloadAfterReply) { //回复后整体刷新整个feed
                                that.updateModel();
                            } else {
                                //发送回复成功后取消发送短信选中
                                $('.is-send-sms', replyContentEl).prop('checked', false);
                                //如果带回复列表，自动添加一条新回复
                                if (responseData.success && this.get('listOpts')) {
                                    this.addNewReply(responseData.value);
                                }
                            }
                        }
                    },
                    "listOpts": replyListOpts,
                    "withMedia": withMedia
                });


                fsReply.show();
                this.compStore.push(fsReply);
                itemEl.data('fsReply', fsReply);
                //指令类型的回复特殊化
                if (model.get('feedType') == 3) {
                    this.workReplyInit();
                }
                //新增可视范围事件监听
                fsReply.on('addatrange', function(rangeData) {
                    var rangeNames = rangeData.rangeNames,
                            groupData = _.groupBy(rangeNames, function(groupItem) {
                                if (groupItem.value) {
                                    return "circle";
                                } else {
                                    return "employee";
                                }
                            }),
                            circleNum,
                            employeeNum,
                            tipArr = [],
                            titleTipArr = [];
                    circleNum = groupData["circle"] ? groupData["circle"].length : 0;
                    employeeNum = groupData["employee"] ? groupData["employee"].length : 0;
                    titleTipArr = titleTipArr.concat(_.map(groupData["employee"], function(itemData) {
                        return itemData.value2;
                    }));
                    titleTipArr = titleTipArr.concat(_.map(groupData["circle"], function(itemData) {
                        return itemData.value2;
                    }));

                    if (circleNum > 0) {
                        if (circleNum == 1) {
                            tipArr.push(groupData["circle"][0].value2);
                        } else {
                            tipArr.push(circleNum + '个部门');
                        }
                    }
                    if (employeeNum > 0) {
                        if (employeeNum == 1) {
                            tipArr.push(groupData["employee"][0].value2);
                        } else {
                            tipArr.push(employeeNum + '个同事');
                        }
                    }
                    if (circleNum + employeeNum > 0) {
                        $('.item-info .group a,.item-info .schedulesgroup a', elEl).html(tipArr.join('，')).attr('title', titleTipArr.join('，'));
                    }

                });
            }
            /* 回复的小箭头显示控制 */

            $('.fs-list-item .item-func .aj-cc', itemEl).removeClass('fl-common-up-arrow');
            $('.fs-list-item .item-func .aj-modifyapproval', itemEl).removeClass('fl-common-up-arrow');
            $('.fs-list-item .item-func .islike-btn', itemEl).removeClass('fl-common-up-arrow');

            if (siblingfeedreplyEl.is(':visible')) { //判断什么时候显示箭头
                meEl.addClass('fl-common-up-arrow');
            } else {
                meEl.removeClass('fl-common-up-arrow');

            }
            evt.preventDefault();
        },
        workReplyInit: function() {
            var elEl = this.$el,
                    model = this.model,
                    fsReply = elEl.data('fsReply'),
                    replyEl = fsReply.element,
                    submitBoxEl = $('.fs-reply-submit-box', replyEl); //主回复框
            var originData = model.get('originData'),
                    work = originData.work;
            var tbarEl;
            tbarEl = $('<div class="reply-tbar"></div>');
            tbarEl.insertAfter(submitBoxEl);
            //有点评的能力
            if (work.assignerID == currentUserData.id && work.canComment) {
                tbarEl.addClass('swr-action-tbar');
                tbarEl.html('<label>确认结果：</label><button type="button" class="aj-feed-fn-com-btn undone-btn button-green" style="padding:6px 15px;line-height:16px;">未完成<br/>继续执行</button>&nbsp;&nbsp;<button type="button" class="aj-feed-fn-com-btn cancel-btn button-green" style="padding:6px 15px;line-height:16px;">取消指令<br/>转他人执行</button>&nbsp;&nbsp;<button type="button" class="aj-feed-fn-com-btn done-btn button-green" style="padding:6px 15px;line-height:16px;">已完成<br/>点评结果</button>');
                //隐藏默认发布框
                submitBoxEl.hide();
            }
            //有回报结果的能力
            if (work.executerID == currentUserData.id && work.canSubmit) {
                tbarEl.addClass('rwr-action-tbar');
                tbarEl.html('<label>回复指令：</label><button type="button" class="aj-feed-fn-com-btn normal-btn button-green">普通回复</button>&nbsp;&nbsp;<button type="button" class="aj-feed-fn-com-btn complete-btn button-green">已完成，汇报结果</button>');
                //隐藏默认发布框
                submitBoxEl.hide();
            }

        },
        "_showSwrUndoneDialog": function() {
            swrUndoneDialog.set('itemV', this);
            swrUndoneDialog.show();
        },
        "_showSwrDoneDialog": function() {
            swrDoneDialog.set('itemV', this);
            swrDoneDialog.show();
        },
        "_showSwrCancelDialog": function() {
            swrCanceDialog.set('itemV', this);
            swrCanceDialog.show();
        },
        "_showRwrNormalDialog": function() {
            rwrNormalDialog.set('itemV', this);
            rwrNormalDialog.show();
        },
        "_showRwrCompleteDialog": function() {
            rwrCompleteDialog.set('itemV', this);
            rwrCompleteDialog.show();
        },
        "_showSarNormalDialog": function() {
            sarNormalDialog.set('itemV', this);
            sarNormalDialog.show();
        },
        "_showApproveHisDialog": function() {
            approveHisDialog.set('itemV', this);
            approveHisDialog.show();
            approveHisDialog.reload();
        },
        /* 功能区点击更多出现的下拉菜单 */
        "funcmore": function(e) {
            var meEl = $(e.currentTarget),
                    handleEl = meEl.closest('.handle'),
                    moreMenuEl = $('.more-menu', handleEl);
            if (moreMenuEl.is(':visible')) {
                moreMenuEl.hide();
            } else {
                $('.handle .more-menu').hide(); //隐藏其他的更多
                moreMenuEl.show();
            }
            $('.fs-tip').hide();
            return false;
        },
        /**
         * 关键回复的展开收起正文控制
         * @param evt
         */
        "fctrVisibleH": function(evt) {
            var meEl = $(evt.currentTarget);
            var elEl = meEl.closest('.comment-list');
            var model = this.model;
            var feedFormatContents = model.get('feedFormatContents');
            var btnIndex = meEl.data('index');
            var leftHtml = feedFormatContents[btnIndex].leftHtml;
            var summaryContentEl = $('.feed-topreply-summary-text', elEl),
                    leftContentEl = $('.feed-left-text', elEl),
                    visibleEl = $('.feed-topreply-content-visible-h', elEl),
                    ellipsisEl = $('.feed-content-ellipsis', elEl);

            if (leftContentEl.length == 0) { //第一次点击时创建剩余内容
                leftContentEl = $('<span class="feed-left-text">' + leftHtml + '</span>');
                leftContentEl.insertAfter(summaryContentEl);
                visibleEl.text('收起正文');
                ellipsisEl.hide();
            } else {
                if (leftContentEl.is(':visible')) {
                    leftContentEl.hide();
                    visibleEl.text('展开正文，（共' + feedFormatContents[btnIndex].feedWordNum + '个字）');
                    ellipsisEl.show();
                } else {
                    leftContentEl.show();
                    visibleEl.text('收起正文');
                    ellipsisEl.hide();
                }
            }
            evt.preventDefault();
        },
        /**
         * 展开收起正文控制
         * @param evt
         */
        "fcVisibleH": function(evt) {
            var model = this.model,
                    feedFormatContent = model.get('feedFormatContent'),
                    leftHtml = feedFormatContent.leftHtml;
            var elEl = $('.item-text', this.$el),
                    summaryContentEl = $('.feed-summary-text', elEl),
                    leftContentEl = $('.feed-left-text', elEl),
                    visibleEl = $('.feed-content-visible-h', elEl),
                    ellipsisEl = $('.feed-content-ellipsis', elEl);
            if (leftContentEl.length == 0) { //第一次点击时创建剩余内容
                leftContentEl = $('<span class="feed-left-text">' + leftHtml + '</span>');
                leftContentEl.insertAfter(summaryContentEl);
                visibleEl.text('收起正文');
                ellipsisEl.hide();
            } else {
                if (leftContentEl.is(':visible')) {
                    leftContentEl.hide();
                    visibleEl.text('展开正文，（共' + feedFormatContent.feedWordNum + '个字）');
                    ellipsisEl.show();
                } else {
                    leftContentEl.show();
                    visibleEl.text('收起正文');
                    ellipsisEl.hide();
                }
            }
            evt.preventDefault();
        },
        /* 点评 */
        "commen": function(e) {
            var that = this;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyEl = $('.replay-section', itemEl); //容器
            var model = this.model,
                    originData = model.get('originData'),
                    feedId = model.get('feedID'),
                    feedOpts = this.options;
            var boxEl = $('.reply-commen', replyEl); //点评按钮组容器
            var htmlStr = '<div class="list-repeat reply-commen"><div class="LR-feed"><table width="100%" border="0" cellspacing="0" cellpadding="0" class=""><tr><td width="70">选择操作：</td><td><button type="submit" class="button-green place-btn aj-commenton-btn">点评日志</button></td></tr></table></div><div class="commen-replylistwarp">这里面放回复列表</div></div>';
            if (!replyEl.children().is('.reply-commen')) { //如果没有就创建
                replyEl.append(htmlStr);
                meEl.addClass('fl-common-up-arrow');
            } else {
                if (!boxEl.is(':visible')) {
                    boxEl.show();

                    $('.fs-list-item .item-func a', itemEl).removeClass('fl-common-up-arrow');
                    meEl.addClass('fl-common-up-arrow');
                    //同时打开点评日志dialog
                    //this.showCommentDialog(true);
                } else {
                    boxEl.hide();
                    meEl.removeClass('fl-common-up-arrow');
                }
            }
            replyEl.addClass('commen-replay-section');

            /* 请求回复列表 */
            var fsReply;
            var isSendSmsDisabled = false;
            var replyListWarp = $('.commen-replylistwarp', itemEl); //容器
            var replyListOpts = _.extend({
                "listPath": "/Feed/GetFeedReplysByFeedID", //请求回复列表地址
                "withPagination": true, //带分页
                "replyListCb": function(responseData) {
                    var totalCount;
                    if (responseData.success) {
                        totalCount = responseData.value.totalCount;
                        if (totalCount == 0) { //请求回复数是0，直接打开点评窗口
                            that.showCommentDialog(true);
                        }
                    }
                }
            }, feedOpts['replyListOpts']);
            var withMedia = !!this.options["replyWithMedia"];
            var itemfuncEl = meEl.closest('.item-func');
            var siblingfeedreplyEl = itemfuncEl.siblings('.feed-reply');
            if (!itemEl.data('fsReply')) {
                fsReply = new FsReply({
                    "feedID": 457,
                    "trigger": meEl,
                    "element": replyListWarp,
                    "bbarTpl": '<span class="fs-reply-send-sms label-for fn-hide"><input type="checkbox" name="send_sms" class="is-send-sms" ' + (isSendSmsDisabled ? 'disabled="disabled"' : '') + ' /> <label>推送短信给：<em class="user-name">' + model.get('senderNameNoLink') + '</em></label></span>',
                    //请求回复列表附加请求参数
                    "defaultRequestData": function() {
                        return {
                            "feedID": feedId //回复所属feedID
                        };
                    },
                    //发送回复附加请求参数
                    "replyDefaultRequestData": function() {
                        var feedSenderID = 0,
                                feedReceiverID = 0,
                                feedType = model.get('feedType');
                        if (feedType == 3) {
                            feedSenderID = originData.sender.employeeID;
                            feedReceiverID = originData.work.executerID;
                        } else if (feedType == 4) {
                            feedSenderID = originData.sender.employeeID;
                            feedReceiverID = originData.approve.currentApproverID;
                        }
                        return {
                            "feedType": feedType, //feedType参数
                            "replyToReplyID": 0, //feed的回复传0作为占位
                            "replyToEmployeeID": 0, //feed的回复传0作为占位
                            "feedSenderID": feedSenderID, //信息发出人ID（指令发出人或审批发出人），如 FeedType 既不是指令也不是审批，则不填此参数
                            "feedReceiverID": feedReceiverID, //信息接收人ID（指令执行人或审批人），如 FeedType 既不是指令也不是审批，则不填此参数
                            "isSendSms": $('.is-send-sms', replyListWarp).prop('checked') //是否发送短信
                        };
                    },
                    //请求一条回复内容时的附加参数
                    "detailDefaultRequestData": function() {
                        return {
                            "feedType": model.get('feedType'), //feedType参数
                            "feedID": originData.feedID
                        };
                    },
                    //发送回复成功后回调
                    "replyCb": function(responseData) {
                        if (responseData.success) {
                            //如果是未回执的调用回执回调
                            var receiptData = originData.receipt;
                            if (receiptData && receiptData.myReceiptStatus == 1) { //未回执
                                feedOpts.receiptCb && feedOpts.receiptCb.call(that, responseData, {
                                    "feedID": feedId
                                });
                            }
                            //刷新feed操作
                            if (feedOpts.reloadAfterReply) { //回复后整体刷新整个feed
                                that.updateModel();
                            } else {
                                //发送回复成功后取消发送短信选中
                                $('.is-send-sms', replyListWarp).prop('checked', false);
                                //如果带回复列表，自动添加一条新回复
                                if (responseData.success && this.get('listOpts')) {
                                    this.addNewReply(responseData.value);
                                }
                            }
                        }
                    },
                    "listOpts": replyListOpts,
                    "withMedia": withMedia
                });
                fsReply.show();
                this.compStore.push(fsReply);
                itemEl.data('fsReply', fsReply);
            }

        },
        /**
         * 回复数加1
         */
        addReplyCountPlusOne: function() {
            var replyBtnEl = $('.aj-Reply', this.$el),
                    numEl = $('.num', replyBtnEl);
            if (numEl.length > 0) {
                numEl.text(parseInt(numEl.text()) + 1);
            } else {
                replyBtnEl.html('回复(<span class="num">1</span>)');
            }
        },
        /*点评按钮*/
        commenbtn: function() {
            commentDialog.itemV = this;
            if (!commentDialog.rendered) {
                commentDialog.render();
            }
            commentDialog.show();
        },
        /**
         * 打开点评窗口
         * @param openHistroy,true表示同时展开历史日志面板，false表示不展开历史面板
         */
        showCommentDialog: function(openHistroy) {
            var commentEl = commentDialog.element,
                    box,
                    lookHisEl;
            this.commenbtn();
            box = $('.dialog-right', commentEl);
            lookHisEl = $('.look-history', commentEl);
            if (openHistroy) {
                lookHisEl.text("收起历史日志<<");
                commentDialog.set('width', 909);
                box.show();
            } else {
                lookHisEl.text("查看历史日志>>");
                commentDialog.set('width', 458);
                box.hide();
            }
        },
        /* 归档 */
        "pof": function(e) {
            var that = this,
                    meEl = $(e.currentTarget);
            //            meEl.text("取消归档").attr("class", "aj-unplaceonfile");
            if (!pofDialog.rendered) {
                pofDialog.render();
            }
            pofDialog.itemV = this;
            pofDialog.show();
        },
        /* 修改归档 */
        "modfiypof": function(e) {
            var meEl = $(e.currentTarget),
                    remindEl = meEl.closest('.archive-remind'),
                    artipEl = $('.ar-tip a', remindEl);
            var thisTags = "";
            artipEl.each(function(i) {
                thisTags += artipEl.eq(i).text() + " ";
            });
            if (!pofDialog.rendered) {
                pofDialog.render();
            }
            var model = this.model;
            pofDialog.itemV = this;
            pofDialog.thisTags = thisTags;
            pofDialog.show();
        },
        showScheduleDelBtn: function(e) { //删除日程的按钮事件
            var that = this;
            var meEl = $(e.currentTarget);
            var model = this.model;
            var originData = model.get("originData");
            var senderId = originData.sender.employeeID; //发出人
            var currentUserId = util.getContactData()["u"].id; //我自己
            var rElength = originData.schedule.relateEmployees.length;
            var sUnfollowTpl = '<div><img src="../../html/fs/assets/images/tipconfirm.png" alt=""/>确定删除这条日程吗</div><div class="button-warp"><button class="f-sub button-green">确定</button>&nbsp;&nbsp;<button class="f-cancel button-green">取消</button></div>';

            this.cTipEl = $('.show-slide-up-tip-warp');

            if (currentUserId == senderId && rElength > 1) { //如果日程是我自己创建的并且范围不是私密时
                util.confirm('该日程共有' + rElength + '位参与者，删除日程将会删除所有参与者的日程，是否继续？', '确认删除', function() {
                    that.submitcancelschedule(e);
                });
            } else {
                var arr = [];
                if (this.cTipEl.length == 0) {
                    this.cTip = new flutil.showSlideUpTip({
                        "element": meEl,
                        "autohide": false, //自动隐藏吗？
                        "width": 175,
                        "height": 99,
                        "template": sUnfollowTpl,
                        "top": 15,
                        "callback": function() {
                            that.submitcancelschedule(e);
                        }
                    });
                } else {
                    this.cTipEl.remove();
                    this.cTip = new flutil.showSlideUpTip({
                        "element": meEl,
                        "autohide": false, //自动隐藏吗？
                        "width": 175,
                        "height": 99,
                        "template": sUnfollowTpl,
                        "top": 15,
                        "callback": function() {
                            that.submitcancelschedule(e);
                        }
                    });
                }
            }
        },
        /* 显示取消归档 */
        "showunpof": function(e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var sUnfollowTpl = '<div><img src="../../html/fs/assets/images/tipconfirm.png" alt=""/>确定要取消归档这条信息吗</div><div class="button-warp"><button class="f-sub button-green">确定</button>&nbsp;&nbsp;<button class="f-cancel button-green">取消</button></div>';

            this.cTipEl = $('.show-slide-up-tip-warp');

            if (this.cTipEl.length == 0) {
                this.cTip = new flutil.showSlideUpTip({
                    "element": meEl,
                    "autohide": false, //自动隐藏吗？
                    "width": 210,
                    "height": 99,
                    "template": sUnfollowTpl,
                    "top": 50,
                    "callback": function() {
                        that.unpofbt(e);
                    }
                });
            } else {
                this.cTipEl.remove();
                this.cTip = new flutil.showSlideUpTip({
                    "element": meEl,
                    "autohide": false, //自动隐藏吗？
                    "width": 210,
                    "height": 99,
                    "template": sUnfollowTpl,
                    "top": 50,
                    "callback": function() {
                        that.unpofbt(e);
                    }
                });
            }
        },
        /* 取消归档确定 */
        "unpofbt": function(e) {
            var that = this;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            var isInMyArchive = this.options.withArchive; //是否是我的归档页面
            util.api({
                "type": 'post',
                "data": {
                    "feedID": Number(feedId)
                },
                "url": '/FeedArchive/CancelFeedArchive', //接口地址
                "success": function(responseData) {
                    //如果在我的归档页面则删除当条feed以slideup的方式
                    if (isInMyArchive) {
                        itemEl.slideUp(250);
                    }
                    if (responseData.success) { //后台数据提交成功之后			

                        var unplaceonfileBtnEl = $('.aj-unplaceonfile', itemEl);
                        unplaceonfileBtnEl.text('归档').attr('class', 'aj-placeonfile aj-feed-fn-com-btn');
                        // that.updateModel(); //刷新列表
                        var o = new Dialog({
                            width: '',
                            closeTpl: '',
                            visibleWithAnimate: true, //淡出
                            content: '<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> 取消归档成功</div>',
                            className: 'common-style-richard fs-feed-comment-dialog'
                        }).render();
                        o.show();
                        setTimeout(function() {
                            o.hide();
                        }, 1500);
                    }
                }
            });
        },
        /* 取消关注确定 */
        "unattbt": function(e) {
            var that = this;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    myatt = $('.myatt', itemEl),
                    followEl = $('.follow-action-h', itemEl),
                    feedId = $('.item-face', itemEl).attr('feedid');
            var isWithFollowTime = this.options.withFollowTime; //是否是我的关注页面
            util.api({
                "url": '/Feed/CancelFeedFollow', //取消关注接口地址
                "type": 'post',
                "data": {
                    "feedID": feedId
                },
                "success": function(responseData) {
                    if (responseData.success) { //后台数据提交成功之后	
                        //如果在我的归档页面则删除当条feed以slideup的方式
                        if (isWithFollowTime) {
                            itemEl.slideUp(250);
                        }
                        //that.model.set('');
                        that.cancel(e); //隐藏确认窗口
                        if (myatt.length == 1) {
                            that.remove(); //移除
                        } else {
                            var o = new Dialog({
                                width: '',
                                closeTpl: '',
                                content: '<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> 取消关注成功</div>',
                                className: 'common-style-richard fs-feed-comment-dialog'
                            }).render();
                            o.show();
                            setTimeout(function() {
                                o.hide();
                            }, 1500);
                            //                            that.updateModel();
                            followEl.addClass("aj-attention").removeClass("aj-unattention").text("关注");
                        }
                    }
                }
            });
        },
        /* 关注 */
        "att": function(e) {
            //发送关注请求
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    that = this,
                    attentionBtn = $('.follow-action-h', itemEl),
                    feedId = $('.item-face', itemEl).attr('feedid');
            util.api({
                "url": '/Feed/AddFeedFollow', //关注接口地址
                "type": 'post',
                "data": {
                    "feedID": feedId
                },
                "dataType": 'json',
                "success": function(responseData) {
                    if (responseData.success) {
                        flutil.showAlertDialog('关注成功'); //dialog模拟alert
                        attentionBtn.addClass("aj-unattention").removeClass("aj-attention").text("取消关注");
                        // that.updateModel();
                    }
                }
            });
        },
        /* 显示取消关注 */
        "showunatt": function(e) {
            var meEl = $(e.currentTarget),
                    handleEl = meEl.closest('.handle'),
                    cancelmenuEl = $('.cancelmenu', handleEl),
                    cancelboxEl = $('.cancelmenu-box', handleEl),
                    cancelboxText = $('.cancel-text', handleEl),
                    cancelboxBtn = $('.f-submit', handleEl);
            cancelboxText.text('确定要取消关注这条信息吗');
            cancelboxBtn.attr("class", "f-submit button-green unatt-bt");
            cancelmenuEl.show();
            cancelboxEl.css({
                "top": "100px"
            }).animate({
                top: '15'
            }, 400);
        },
        /* 转发 */
        "fwd": function() {
            fwdDialog.itemV = this;
            if (fwdDialog.rendered) {
                fwdDialog.show();
            } else {
                fwdDialog.render().show();
            }
        },
        /* 待办 */
        "ped": function() {
            pedDialog.itemV = this;

            if (pedDialog.rendered) {
                pedDialog.show();
            } else {
                pedDialog.render().show();
            }
        },
        /* 显示删除 */
        "showDel": function(e) {
            var meEl = $(e.currentTarget);
            var model = this.model;
            var originData = model.get("originData");
            var that = this;
            var feedType = originData.feedType; //这条feed的类型
            var textinfo = '';
            var sendCallback;
            var top = 35; //弹框的位置高度，因为审批的按钮位置低所以要加个变量
            var width = 221; //弹框的位置高度，因为审批的按钮位置低所以要加个变量
            this.cTipEl = $('.show-slide-up-tip-warp');
            /* 不同的类型删除调用不同的接口 */
            switch (feedType) {
                case 101: //互动 （已废弃）
                case 1001: //客户轨迹 （已废弃）
                case 1: //分享
                    textinfo = '确定删除这条信息吗(信息仅限24小时内可以删除)';
                    sendCallback = this.del;
                    break;
                case 2: //日志
                    textinfo = '确定删除这条日志吗（日志点评人点评后不能删除）';
                    sendCallback = this.submitcancelplan;
                    break;
                case 3: //指令
                    textinfo = '确定取消这条指令吗';
                    sendCallback = this.submitcancelwork;
                    width = 175;
                    break;
                case 4: //审批
                    textinfo = '确定取消这条审批吗';
                    sendCallback = this.submitcancelappr;
                    top = 60;
                    width = 175;
                    break;
                default:
                    break;
            }


            var sUnfollowTpl = '<div><img src="../../html/fs/assets/images/tipconfirm.png" alt=""/>' + textinfo + '</div><div class="button-warp"><button class="f-sub button-green">确定</button>&nbsp;&nbsp;<button class="f-cancel button-green">取消</button></div>';

            if (this.cTipEl.length == 0) {
                this.cTip = new flutil.showSlideUpTip({
                    "element": meEl,
                    "autohide": false, //自动隐藏吗？
                    "width": width,
                    "height": 99,
                    "template": sUnfollowTpl,
                    "top": top,
                    "callback": function() {
                        sendCallback.call(that, e);
                    }
                });
            } else {
                this.cTipEl.remove();
                this.cTip = new flutil.showSlideUpTip({
                    "element": meEl,
                    "autohide": false, //自动隐藏吗？
                    "width": width,
                    "height": 99,
                    "template": sUnfollowTpl,
                    "top": top,
                    "callback": function() {
                        sendCallback.call(that, e);
                    }
                });
            }

        },
        /* 取消显示删除 */
        "cancel": function(e) {
            var meEl = $(e.currentTarget),
                    handleEl = meEl.closest('.handle'),
                    cancelboxEl = $('.cancelmenu-box', handleEl);
            cancelboxEl.animate({
                top: '120'
            }, 400);
        },
        /* 删除中的删除记录功能 */
        "del": function(e) {
            var that = this;
            var feedOpts = this.options;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            util.api({
                "url": '/Feed/DeleteFeedByID', //删除接口地址
                "type": 'post',
                "data": {
                    "feedID": feedId
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        itemEl.slideUp(250, function() {
                            that.destroy(); //销毁
                            feedOpts.deleteCb && feedOpts.deleteCb.call(that, responseData, {
                                "feedID": feedId
                            });
                        });
                    }
                }
            });
        },
        /* 取消日志 */
        "submitcancelplan": function(e) {
            var that = this;
            var feedOpts = this.options;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    feedId = $('.item-face', itemEl).attr('feedid');
            util.api({
                "url": '/FeedPlan/DeleteFeedPlanByID', //删除日志接口地址
                "type": 'post',
                "data": {
                    "feedID": feedId
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        itemEl.slideUp(250, function() {
                            that.destroy(); //销毁
                            feedOpts.deleteCb && feedOpts.deleteCb.call(that, responseData, {
                                "feedID": feedId
                            });
                        });
                    }
                }
            });
        },
        /* 取消指令 */
        "submitcancelwork": function(e) {
            var that = this;
            var myId = currentUserData.employeeID; //我的id
            var model = this.model;
            var originData = model.get("originData");
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    handleEl = meEl.closest('.handle'),
                    executerID = originData.work.executer.employeeID,
                    cancelboxEl = $('.cancelmenu-box', handleEl),
                    feedId = $('.item-face', itemEl).attr('feedid');

            var apiUrl = '/FeedWork/AssignerSendFeedWorkReply'; //发出人人回复接口
            var oData = {
                "feedID": feedId,
                "replyContent": "取消该指令",
                "operationType": 3,
                "fileInfos": [],
                "rate": 0,
                "isSendSms": false,
                "atEmployeeIDs": []
            };
            if (executerID == myId) {
                apiUrl = '/FeedWork/ExecuterSendFeedWorkReply'; //执行人回复接口
                oData = {
                    "feedID": feedId,
                    "replyContent": "取消该指令",
                    "operationType": 3,
                    "fileInfos": [],
                    "isSendSms": false
                };
            }
            util.api({
                "url": apiUrl,
                "type": 'post',
                "data": oData,
                "success": function(responseData) {
                    if (responseData.success) {

                        that.updateModel(); //刷新列表
                    }
                }
            });
        },
        /* 取消审批 */
        "submitcancelappr": function(e) {
            var that = this;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    handleEl = meEl.closest('.handle'),
                    approver = meEl.attr("approver"),
                    cancelboxEl = $('.cancelmenu-box', handleEl);
            var feedOpts = this.options;
            // var apiUrl = '/FeedApprove/SenderCancelApprove'; //发出人取消审批接口
            // if (approver == 1) {
            // 	apiUrl = '/FeedApprove/ApproverSendFeedReply'; //审批人取消审批接口
            // }
            var feedId = $('.item-face', itemEl).attr('feedid');
            util.api({
                "url": '/FeedApprove/ApproverSendFeedReply', //取消审批接口
                "type": 'post',
                "data": {
                    "feedID": feedId,
                    "replyContent": "取消该审批",
                    "operationType": 3,
                    "replyToReplyID": 0,
                    "replyToEmployeeID": 0,
                    "isSendSms": false
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        //审批取消后不直接销毁，而是改变状态
                        that.updateModel();
                        feedOpts.deleteCb && feedOpts.deleteCb.call(that, responseData, {
                            "feedID": feedId
                        });
                    }
                }
            });
        },
        /* 取消日程 */
        "submitcancelschedule": function(e) {
            var that = this,
                    model = this.model,
                    originData = model.get('originData'),
                    schedule = originData.schedule,
                    senderId = originData.sender.employeeID;
            var feedOpts = this.options;
            var requestPath;
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    handleEl = meEl.closest('.handle'),
                    cancelboxEl = $('.cancelmenu-box', handleEl);
            var feedId = $('.item-face', itemEl).attr('feedid');
            if (senderId == currentUserData.id) {
                requestPath = '/Feed/DeleteFeedByID';
            } else {
                requestPath = '/Schedule/CancelSchedule';
            }
            util.api({
                "url": requestPath, //取消日程接口地址
                "type": 'post',
                "data": {
                    "feedID": feedId
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        itemEl.slideUp(250, function() {
                            that.destroy(); //销毁
                            feedOpts.deleteCb && feedOpts.deleteCb.call(that, responseData, {
                                "feedID": feedId
                            });
                        });
                    }
                }
            });
        },
        /**
         * 更新model重新render
         * @param callback
         */
        "updateModel": function(callback) {
            var that = this;
            var model = this.model,
                    elEl = this.$el;
            var isOpenReply = $('.feed-reply', elEl).is(':visible');
            util.api({
                "url": "/Feed/GetFeedByFeedID",
                "type": "get",
                "data": {
                    "feedID": model.get('feedID')
                },
                "success": function(responseData) {
                    var tempListC = new ListC();
                    if (responseData.success) {
                        that.model.set(tempListC.parse(responseData)[0], {
                            "silent": true //不触发change事件
                        });
                        //手动调用渲染
                        that.render();
                        //是否打开回复列表
                        if (isOpenReply) {
                            if ($('.aj-Reply', elEl).length > 0) {
                                $('.aj-Reply', elEl).click();
                            }
                            if ($('.aj-approval', elEl).length > 0) {
                                $('.aj-approval', elEl).click();
                            }
                        }
                        callback && callback.call(that, responseData);
                    }
                }
            }, {
                "mask": elEl,
                "maskCls": "fs-feed-mask"
            });
        },
        initialize: function() {

            //设置内部组件引用容器，供以后删除调用
            this.compStore = [];
            var feedType = this.model.get('feedType');
            var schedule = this.model.get('schedule'); //日程
            var voteItem = this.model.get('voteItem'); //投票
            var announcement = this.model.get('announcement'); //公告
            // var scheduleStyle=2;//临时变量
            switch (feedType) {
                case 101: //互动 （已废弃）
                case 1001: //客户轨迹 （已废弃）
                case 1:

                    this.template = feedShareTpl; //分享
                    if (schedule) { //日程
                        //1为主列表，2为日程列表，3为弹出框
                        if (this.options.scheduleStyle == 1) {
                            this.template = feedScheduleTpl;
                        } else {
                            this.template = feedScheduleTipTpl;
                        }
                    }
                    if (voteItem) { //投票
                        this.template = feedVoteItemTpl;
                    }
                    if (announcement) { //公告
                        if (this.options.noticeStyle == 1) { //1为主列表形式，显示完整功能；2为公告列表展示方式
                            this.template = feedAnnounceTpl;
                        } else if (this.options.noticeStyle == 2) {
                            this.template = feedAnnouncePageTpl;
                        }

                    }
                    break;
                case 2:
                    this.template = feedPlanTpl; //日志
                    break;
                case 3:
                    this.template = feedWorkTpl; //指令
                    break;
                case 4:
                    if (this.options["detailStyle"] == 1) { //1为正常显示模式，2为打印模式，目前只对审批类的feed开放打印模式
                        this.template = feedApproveTpl; //审批
                    } else if (this.options["detailStyle"] == 2) {
                        this.template = feedApprovePrintTpl; //审批-打印
                    }
                    break;
                    //case 101: //互动 （已废弃）
                    //case 1001: //客户轨迹 （已废弃）
                    //    this.template =_.template(tplEl.filter('.feed-list-share').html());
                default:
                    break;
            }
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            var model = this.model,
                    originData = model.get('originData');
            var itemEl = this.$el;
            this.$el.addClass('fs-feed-item');

            //先清空
            this.empty();
            //再渲染

            this.$el.html(this.template(this.model.toJSON()));
            //判断是否显示归档信息
            if (this.options.withArchive) { //显示归档信息
                $('.archive-remind', this.$el).show();
                $('.aj-placeonfile', this.$el).text('取消归档').attr('class', 'aj-unplaceonfile');
            } else { //不显示归档信息
                $('.archive-remind', this.$el).hide();
            }

            //判断是否显示关注时间
            if (this.options.withFollowTime) {
                $('.followtimeinfo', this.$el).show();
            } else { //不显示归档信息
                $('.followtimeinfo', this.$el).hide();
            }
            //判断展开投票详情,默认不展开
            if (this.options.withShowBoteFeed && model.get('voteItem')) {
                //$('.vote-main', this.$el).show();
                //$('.vote-inlet', this.$el).hide();
                $('.aj-open-vote-btn', this.$el).click();
            }
            //判断是否显示头像,默认显示头像
            if (this.options.withAvatar === false) {
                $('.item-face', this.$el).hide();
                $('.item-detail', this.$el).css({
                    "margin-left": "0px"
                });
            }
            //判断是否显示功能键，默认显示
            var itemFuncEl = $('.item-func', this.$el);
            if (this.options.withActionBtn === false) {
                $('.handle', itemFuncEl).hide();
                $('<div class="action-btn-summary"><a href="#stream/showfeed/=/id-' + originData.feedID + '" class="to-detail-l">点击查看原文>></a></div>').appendTo(itemFuncEl);
            }

            /**
             * 日程弹出框重置DOM内容
             * 条件scheduleStyle == 3
             */
            var schedule = this.model.get('schedule'); //日程
            var scheduleStyle, feedRangeDescription, feedRangeDescriptionEl,
                    scheduleCreateTime, relateEmployees, schedulesDescription, schedulesEmployeesNames, rElength, scheduleCreateTimeEl;
            var currentUserId = util.getContactData()["u"].id; //我自己
            if (schedule) {
                scheduleStyle = this.options.scheduleStyle;
                feedRangeDescription = originData.feedRangeDescription;
                feedRangeDescriptionEl = $('.schedulesgroup a', itemEl);
                scheduleCreateTime = originData.schedule.startTime;
                scheduleCreateTimeEl = $('.rc-time', itemEl);
                if (scheduleStyle == 3) {
                    feedRangeDescriptionEl.text(feedRangeDescription);
                    scheduleCreateTimeEl.text(moment.unix(scheduleCreateTime).format('HH:mm'));

                    relateEmployees = schedule.relateEmployees;
                    rElength = relateEmployees.length;
                    _.each(relateEmployees, function(schedulesEmployees) {
                        var employeeID = schedulesEmployees.employeeID,
                                employeeName = schedulesEmployees.name,
                                profileImage = schedulesEmployees.profileImage;
                        schedulesEmployeesNames += employeeName + '，';

                        if (rElength == 1) {
                            schedulesDescription = schedulesEmployeesNames.substr(0, schedulesEmployeesNames.length - 1); //删掉末尾的逗号
                            if (employeeID == currentUserId) {
                                feedRangeDescriptionEl.text("个人日程");
                            }
                        } else {
                            feedRangeDescriptionEl.text('参与者共' + rElength + '人');
                        }

                    });
                }

            }
            /**
             * detailStyle为2则调用审批的打印模板
             */
            if (this.options["detailStyle"] == 2) {
                /* 请求回复列表数据 */
                util.api({
                    "url": '/Feed/GetFeedReplysByFeedID', //回复列表的接口地址
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        "feedID": originData["feedID"],
                        "pageNumber": 1,
                        "pageSize": 100
                    },
                    "success": function(responseData) {
                        var data = responseData.value;
                        var mainEl = $('.fs-list-item');
                        var printreplysEl = $('.printreplys', mainEl);
                        var printreplysIiemEl = '';
                        _.each(data.items, function(item) {
                            var replyContents = item.replyContent;
                            var pictures = item.pictures;
                            var replyContentStr = '';
                            var picturesStr = '';
                            /* 格式化回复的时间和出处 */
                            var source = '';
                            var ctime = util.getDateSummaryDesc(moment.unix(item.createTime), moment.unix(item.serviceTime), 1);
                            if (item.sourceDescription) {
                                if (item.source == 1) { //类型1：如果是来自纷享平台就为空不显示了
                                    source = '';
                                } else {
                                    source = '，来自' + util.getSourceNameFromCode(item.source);
                                }

                            } else {
                                source = "";
                            }
                            _.each(replyContents, function(replyContent) {
                                replyContentStr += replyContent.text;
                            });
                            _.each(pictures, function(picture) {
                                picturesStr += '<span class="print-img-warp"><img src="' + FS.API_PATH + '/df/get?id=' + picture.attachPath + '1.jpg" alt="" class="print-pictures"><img src="../../html/fs/assets/images/print-del-pic-ico.gif" title="不打印该图" class="print-del-pic-ico aj-feed-fn-com-btn" /></span>';
                            });

                            printreplysIiemEl = '<div class="printreplys-item"><div class="printreplys-item-txt"><i>' + item.sender.name + '</i>：' + replyContentStr + '(' + ctime + source + ')</div><div class="printreplys-item-media">' + picturesStr + '</div></div>';
                            if (data.items.length > 1) {
                                printreplysEl.append(printreplysIiemEl);
                            }


                        });
                    }
                });
            }
            return this;
        },
        reRenderArchive: function(archiveData) {
            var elEl = this.$el,
                    archiveRemindEl = $('.archive-remind', elEl);
            archiveRemindEl.replaceWith(archiveData);
        },
        empty: function() {
            var model = this.model,
                    feedId = model.get('feedID');
            //清空删除feed的确认弹框
            $('.show-slide-up-tip-warp').remove();
            //清空data meta
            this.$el.removeData();
            //尝试删除绑定的每个组件
            _.each(this.compStore, function(comp) {
                comp.destroy && comp.destroy();
            });
            //this.modifyapprerSb&&this.modifyapprerSb.destroy();
            if (this.audioRendered && this.audioRendered === "flash") {
                swfobject.removeSWF('audio-flash-player-' + feedId);
            }
            this.compStore = [];
        },
        destroy: function() {
            this.empty();
            //清空dom和内部绑定事件
            this.remove();
        }
    });
    exports.itemV = ItemV;
});