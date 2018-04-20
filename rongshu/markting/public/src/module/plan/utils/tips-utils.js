/**
 * Author LLJ
 * Date 2016-5-10 9:53
 */
function getVal(v) {
    return v || "";
}
function getSelectText(v){
    return v=="请选择"?"":v;
}
var DEFAULTURL = BASE_PATH + '/html/activity/plan-iframe.html';
var GROUPURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';

var typeMap = {
    //定时触发
    'timer-trigger': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find(".datepick").pickadate({
                        selectMonths: true, // Creates a dropdown to control month
                        selectYears: 5 // Creates a dropdown of 15 years to control year
                    });

                    $(sel).find("#timer-trigger-start-time").lolliclock({
                        autoclose: true,
                        //hour24: true,//24小时制
                        afterHide: function () {
                            // console.info('小时：' + $('#start-time').data('lolliclock').hours)
                        }
                    });
                    $(sel).find("#timer-trigger-end-time").lolliclock({
                        autoclose: true,
                        //hour24: true,//24小时制
                        afterHide: function () {
                            //console.info('小时：' + $('#end-time').data('lolliclock').hours)
                        }
                    });
                },
                end: function () {
                    $('.lolliclock-popover').remove();//注意这个坑，弹窗销毁后，里面NEW的东西一定要销毁
                }
            };

        },
        'getDataByType': function (sel) {
            var name = $("#timer-trigger-name").val(),
                startDate = $("#timer-trigger-start-date").val(),
                startTime = $("#timer-trigger-start-time").val(),
                endDate = $("#timer-trigger-end-date").val(),
                endTime = $("#timer-trigger-end-time").val(),
                desc = $.trim([startDate, startTime].join(" "));
            return {
                name: getVal(name),
                startDate: getVal(startDate),
                startTime: getVal(startTime),
                endDate: getVal(endDate),
                endTime: getVal(endTime),
                desc: getVal(desc != desc ? "" : desc)
            };
        }

    },
    //目标人群
    'target-group': {
        'getEventByType': function (sel) {
            return {
                success: function () {
                    $(sel).find("select").material_select();
                    $("#target-group-select").off().on("change",function(e){
                          var $tar=$(this),val=$tar.val();
                           document.querySelector("#plan-chart").src=val!='no-sel'?GROUPURL:DEFAULTURL;
                    })
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#target-group-name").val(),
                select = $("#target-group-select").val(),
                selectText = $("#target-group-select").find("option:selected").text(),
                newSelect = $("#target-group-new-select").val(),
                refresh1 = $("#target-group-refresh-select1").val(),
                refresh2 = $("#target-group-refresh-select2").val();
            return {
                name: getVal(name),
                select: getVal(select),
                selectText: getSelectText(selectText),
                newSelect: getVal(newSelect),
                refresh1: getVal(refresh1),
                refresh2: getVal(refresh2),
                desc: getSelectText(selectText),
                BASEPATH: BASE_PATH
            };
        }
    },
    //微信发送
    'wechat-send': {
        'getEventByType': function (sel) {
            return {//wechat-send
                success: function () {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#wechat-send-name").val(),
                select = $("#wechat-send-public-number").val(),
                selectText = $("#wechat-send-public-number").find("option:selected").text(),
                img = $("#wechat-send-img").val(),
                refresh1 = $("#wechat-send-refresh1").val(),
                refresh2 = $("#wechat-send-refresh2").val();
            return {
                name: getVal(name),
                publicNumber: getVal(select),
                publicNumberText: getSelectText(selectText),
                img: getVal(img),
                refresh1: getVal(refresh1),
                refresh2: getVal(refresh2),
                desc: getSelectText(selectText)
            };
        }
    },
    //微信查看
    'wechat-check': {
        'getEventByType': function (sel) {
            //wechat-check
            return {
                success: function () {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#wechat-check-name").val(),
                select = $("#wechat-check-public-number").val(),
                selectText = $("#wechat-check-public-number").find("option:selected").text(),
                img = $("#wechat-check-img").val(),
                time = $("#wechat-check-time").val(),
                completed = $("#wechat-check-complete").val(),
                refresh1 = $("#wechat-check-refresh1").val(),
                refresh2 = $("#wechat-check-refresh2").val();
            return {
                name: getVal(name),
                publicNumber: getVal(select),
                publicNumberText: getSelectText(selectText),
                img: getVal(img),
                time: getVal(time),
                completed: getVal(completed),
                refresh1: getVal(refresh1),
                refresh2: getVal(refresh2),
                desc: getSelectText(selectText)
            };
        }
    },
    //保存当前人群
    'save-current-group': {
        'getEventByType': function (sel) {
            //save-current-group
            return {
                success: function () {//保存当前人群 打开时要增加回车事件 在tipModel 中完成
                    $(sel).find("select").material_select();
                },
                end:function(){//保存当前人群 关闭时要销毁回车事件  在tipModel 中完成

                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#save-current-group-name").val(),
                group = $("#save-current-group-select").val(),
                groupText = $("#save-current-group-select").find("option:selected").text();
            return {
                name: getVal(name),
                group: getVal(group),
                groupText: getVal(groupText),
                desc: getSelectText(groupText)
            };
        }
    },
    //设置标签
    'set-tag': {
        'getEventByType': function (sel) {
            return {};
        },
        'getDataByType': function (sel) {
            var name = $("#set-tag-name").val(),
                desc = $("#set-tag-textarea").val();
            return {
                name: getVal(name),
                desc: getVal(desc)
            };
        }
    },
    //等待设置
    'wait-set': {
        'getEventByType': function (sel) {
            //wait-set
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                    $(sel).find("#wait-set-date").pickadate({
                        selectMonths: true, // Creates a dropdown to control month
                        selectYears: 5 // Creates a dropdown of 15 years to control year
                    });
                    $(sel).find("#wait-set-time").lolliclock({
                        autoclose: true,
                        //hour24: true,//24小时制
                        afterHide: function () {
                        }
                    });
                },
                end: function () {
                    $('.lolliclock-popover').remove();//注意这个坑，弹窗销毁后，里面NEW的东西一定要销毁
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#wait-set-name").val(),
                date = $("#wait-set-date").val(),
                setTime = $("#wait-set-time").val(),
                radio = $(sel).find("input[type='radio']:checked").val(),
                refresh1 = $("#wait-set-refresh1").val(),
                refresh2 = $("#wait-set-refresh2").val(),
                refresh2Text = $("#wait-set-refresh2").find("option:selected").text(),
                desc = "";
            if (radio == 'relative') {
                desc = refresh1 + refresh2Text + "";
            } else if (radio == 'specify') {
                desc = date + setTime + "";
            }
            return {
                name: getVal(name),
                desc: getVal(desc),
                refresh1: getVal(refresh1),
                refresh2: getVal(refresh2),
                refresh2Text: getVal(refresh2Text),
                radio: getVal(radio),
                date: getVal(date),
                setTime: getVal(setTime)

            };
        }
    },
    'label-judgment': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $('#label-judgment-tag').dropdown({
                        constrain_width: true,
                        belowOrigin: true
                    });
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#label-judgment-name").val(),
                fitSelect = $("#label-judgment-select").val(),
                fitSelectText = $("#label-judgment-number").find("option:selected").text(),
                $tags = $("#label-judgment-tag-content .active-tag"),
                desc = "",
                tags = [];
            if ($tags.length) {
                $tags.each(function (i, itm) {
                    var $thiz = $(itm), val = $thiz.attr("attr-val") || "";
                    tags.push(val);
                })
            }
            desc = tags.length ? (tags.length>1?tags[0]+"...":tags[0]): "";
            return {
                name: getVal(name),
                fitSelect: getVal(fitSelect),
                fitSelectText: getVal(fitSelectText),
                tags: getVal(tags),
                desc: getVal(desc)
            };
        }
    },
    'send-h5': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#send-h5-name").val(),
                h5Select = $("#send-h5-h5-select").val(),
                h5SelectText = $("#send-h5-h5-select").find("option:selected").text(),
                publicSelect = $("#send-h5-public-select").val(),
                publicSelectText = $("#send-h5-public-select").find("option:selected").text(),
                perSelect = $("#send-h5-per-select").val(),
                perSelectText = $("#send-h5-per-select").find("option:selected").text(),
                groupSelect = $("#send-h5-group-select").val(),
                groupSelectText = $("#send-h5-group-select").find("option:selected").text();
            return {
                name: getVal(name),
                h5Select: h5Select,
                h5SelectText: h5SelectText,
                publicSelect: publicSelect,
                publicSelectText: publicSelectText,
                perSelect: perSelect,
                perSelectText: perSelectText,
                groupSelect: groupSelect,
                groupSelectText: groupSelectText,
                desc: getSelectText(h5SelectText)
            };
        }
    },
    'send-img': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function () {
            var name = $("#send-img-name").val(),
                imgSelect = $("#send-img-img-select").val(),
                imgSelectText = $("#send-img-img-select").find("option:selected").text(),
                publicSelect = $("#send-img-public-select").val(),
                publicSelectText = $("#send-img-public-select").find("option:selected").text();
            return {
                name: getVal(name),
                imgSelect: imgSelect,
                imgSelectText: imgSelectText,
                publicSelect: publicSelect,
                publicSelectText: publicSelectText,
                desc: getSelectText(imgSelectText)
            };
        }
    },
    'send-msg': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function () {
            var name = $("#send-msg-name").val(),
                perSelect = $("#send-msg-select").val(),
                perSelectText = $("#send-msg-select").find("option:selected").text(),
                grpSelect = $("#send-msg-group-select").val(),
                grpSelectText = $("#send-msg-group-select").find("option:selected").text(),
                textarea = $("#send-msg-textarea").val();
            return {
                name: getVal(name),
                perSelect: perSelect,
                perSelectText: perSelectText,
                groupSelect: grpSelect,
                groupSelectText: grpSelectText,
                textarea: textarea,
                desc: getVal(textarea)
            };
        }
    },

    'add-activity': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'move-activity': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'move-activity': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'event-group': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'event-trigger': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'manual-trigger': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: '请手动开启'
            }
        }
    },
    'attr-comparison': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'wechat-forwarded': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function () {
            var name = $("#wechat-forwarded-name").val(),
                publicSelect = $("#wechat-forwarded-public-select").val(),
                publicSelectText = $("#wechat-forwarded-public-select").find("option:selected").text(),
                imgSelect = $("#wechat-forwarded-img-select").val(),
                imgSelectText = $("#wechat-forwarded-img-select").find("option:selected").text(),
                numSelect = $("#wechat-forwarded-num-select").val(),
                numSelectText = $("#wechat-forwarded-num-select").find("option:selected").text(),
                refresh1 = $("#wechat-forwarded-refresh1").val(),
                refresh2 = $("#wechat-forwarded-refresh2").val();
            return {
                name: getVal(name),
                publicSelect: publicSelect,
                publicSelectText: publicSelectText,
                imgSelect: imgSelect,
                imgSelectText: imgSelectText,
                numSelect: numSelect,
                numSelectText: numSelectText,
                refresh1: refresh1,
                refresh2: refresh2,
                desc: getSelectText(publicSelectText)
            };
        }
    },
    'subscriber-public': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'personal-friend': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    }
};
function switchFun(type, selector, funName) {
    return typeMap[type] && typeMap[type][funName] && typeMap[type][funName](selector);
}
var utils = {
    //根据类型获取tips 事件
    getEventByType: function (type, selector) {
        return switchFun(type, selector, "getEventByType");
    },
    //根据类型获取tips 数据
    getDataByType: function (type, selector) {
        return switchFun(type, selector, "getDataByType");
    }
};
module.exports = utils;
