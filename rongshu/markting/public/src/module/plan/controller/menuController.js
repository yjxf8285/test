/**
 * Author LLJ
 * Date 2016-5-3 9:33
 */

var menuTpl=require('../tpl/menu-tpl.html');
var DEFAULTURL=BASE_PATH+'/html/activity/plan-iframe.html';
var GROUPURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';

function controller(view){
    this.view=view;
    this.setComponent=function(){
        var menubarTipTpl = _.template($(menuTpl).filter("#menu").html());
        var menubarTipData = {
            listType: 'one',
            listData: [
                ['&#xe63f;', '定时触发',"trigger",TRIGGERURL,"timer-trigger"],
                ['&#xe63d;', '事件触发',"trigger",TRIGGERURL,"event-trigger"],
                ['&#xe63e;', '手动触发',"trigger",TRIGGERURL,"manual-trigger"]
            ]
        };
        this.view.$el.on('click', '.menubar .btn-floating', function (e) {
            var me = this;
            if ($(me).is('.one')) {
                menubarTipData.listType = 'one';
                menubarTipData.listData = [
                    ['&#xe63f;', '定时触发',"trigger",TRIGGERURL,"timer-trigger"],
                    ['&#xe63d;', '事件触发',"trigger",TRIGGERURL,"event-trigger"],
                    ['&#xe63e;', '手动触发',"trigger",TRIGGERURL,"manual-trigger"]
                ];
            }

            if ($(me).is('.two')) {
                menubarTipData.listType = 'two';
                menubarTipData.listData = [
                    ['&#xe639;', '目标人群','audiences',GROUPURL,"target-group"],
                    ['&#xe66f;', '事件人群','audiences',GROUPURL,"event-group"],
                ];
            }
            if ($(me).is('.three')) {
                menubarTipData.listType = 'three';

                menubarTipData.listData = [
                    ['&#xe66e;', '联系人属性比较','decisions',DEFAULTURL,"attr-comparison"],
                    ['&#xe66d;', '微信图文是否发送','decisions',DEFAULTURL,"wechat-send"],
                    ['&#xe66c;', '微信图文是否查看','decisions',DEFAULTURL,"wechat-check"],
                    ['&#xe673;', '微信图文是否转发','decisions',DEFAULTURL,"wechat-forwarded"],
                    ['&#xe66b;', '是否订阅公众号','decisions',DEFAULTURL,"subscriber-public"],
                    ['&#xe66a;', '是否个人号好友','decisions',DEFAULTURL,"personal-friend"],
                    ['&#xe671;', '标签判断','decisions',DEFAULTURL,"label-judgment"],
                ];
            }
            if ($(me).is('.four')) {
                menubarTipData.listType = 'four';
                menubarTipData.listData = [
                    ['&#xe670;', '等待','activity',DEFAULTURL,"wait-set"],
                    ['&#xe669;', '保存当前人群','activity',DEFAULTURL,"save-current-group"],
                    ['&#xe668;', '设置标签','activity',DEFAULTURL,"set-tag"],
                    ['&#xe667;', '添加到其他活动','activity',DEFAULTURL,"add-activity"],
                    ['&#xe666;', '转移到其他活动','activity',DEFAULTURL,"move-activity"],
                    ['&#xe63a;', '发送微信图文','activity',DEFAULTURL,"send-img"],
                    ['&#xe63c;', '发送H5活动','activity',DEFAULTURL,"send-h5"],
                    ['&#xe665;', '发送个人号消息','activity',DEFAULTURL,"send-msg"]
                ];

            }
            layer.open({
                //area: '500px',//宽高area: ['500px', '300px']
                shade: 0,//不要遮罩
                closeBtn: 0,//不要关闭按钮
                type: 4,//tip类型
                shift: 5,//动画类型0-6 默认0
                //tips: [4, '#fff'],//方向1-4，背景色
                content: [menubarTipTpl(menubarTipData), me], //数组第二项即吸附元素选择器或者DOM
                success: function (layero, index) {
                }
            });
            e.stopPropagation();
        });
    }
    this.init=function(){
         this.setComponent();
    };
    this.init();
}

module.exports=controller;