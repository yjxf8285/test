/**
 * Created by 刘晓帆 on 2016-4-11.
 * 主数据管理
 */
'use strict';

var tpl = require("html/data-supervise/master-data-tpl.html");//模板
var Modals = require('component/modals.js');
var Layout = require('module/layout/layout');
var TableList = require('module/table-list/table-list');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName: '主数据管理'
});

//布局视图
var MasterData = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        listData: [{
            listName: '',
            listNum: '',
            groupData: []
        }]
    }),
    template: _.template($(tpl).filter('#tpl-layout').html()),
    events: {
        "click .seemore-btn": "seemore",
        "click .itemlistwrap li": "switchItem",
        "click .fnbtn-screen": "screen",
        "click .fnbtn-customview": "customview",
        "click .fnbtn-down": "down"
    },
    switchItem: function (e) {
        var that = this;
        var meEl = $(e.currentTarget);
        var meStr = meEl.html();
        var targetEl = $('.mainitem', this.el);
        var targetStr = targetEl.html();
        var indexId = meEl.data('id');
        targetEl.html(meStr);
        $('.itemlistwrap li', this.el).show();
        meEl.hide();
        this.tableList.model.set({
            listData: that.model.get('listData')[indexId]
        })
    },
    seemore: function () {
        var meEl = $('.seemore-btn', this.el);
        var itemlistwrapEl = $('.itemlistwrap ', this.el);
        if (meEl.is('.up')) {
            meEl.removeClass('up').find('.icon').html('&#xe662;');
            itemlistwrapEl.slideUp(200);
        } else {
            meEl.addClass('up').find('.icon').html('&#xe661;');
            itemlistwrapEl.slideDown(200);
        }
    },
    down: function () {
        window.location.href = 'http://dldir1.qq.com/qqfile/qq/QQ8.2/17720/QQ8.2.exe';
    },
    customview: function () {
        var that = this;
        var mdtData = [];
        util.api({
            surl: '/apidata/masterdatatwo.json',
            async: false,
            success: function (resData) {
                mdtData = resData;
            }
        });
        var thisTplfn = _.template($(tpl).filter('#tpl-modal-customview').html());

        new Modals.Window({
            title: "自定义视图",
            content: thisTplfn({
                data: mdtData
            }),

            //height:'auto',默认是auto
            //width:'auto',默认是auto
            buttons: [{
                text: '取消',
                cls: 'decline',
                handler: function (self) {
                    self.close();
                }
            },
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        self.close();
                        if($('#group20', this.$el).prop('checked')&&$('#group21', this.$el).prop('checked')){
                            that.tableList.model.set({
                                listData: mdtData[0]
                            })
                        }
                    }
                }
            ],
            listeners: {
                beforeRender: function () {
                    $('ul.tabs', this.$el).tabs();
                    $('.indicator', this.$el).css({
                        "right": "728px",
                        "left": "0px"
                    });
                    $('select').material_select();
                }
            }
        })

    },
    //快捷筛选弹框
    screen: function () {
        var that = this;
        var mainData = this.model.get('listData')[0];//主数据的数据
        var screenData = []; //筛选后的数据
        _.each(mainData, function (m) {
            _.each(m, function (mm) {
                if (mm.name == '手机' && mm.value != '未知') {
                    screenData.push(m)
                }
            })
        });

        new Modals.Window({
            title: "快捷筛选",
            content: $(tpl).filter('#tpl-modal-screen').html(),
            //height:'auto',默认是auto
            //width:'auto',默认是auto
            buttons: [{
                text: '取消',
                cls: 'decline',
                handler: function (self) {
                    self.close();
                }
            },
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        self.close();
                        if ($('#sr1', this.$el).prop('checked')) {
                            that.tableList.model.set({
                                listData: screenData
                            })
                        } else {
                            that.tableList.model.set({
                                listData: mainData
                            })
                        }
                    }
                }
            ],
            listeners: {
                beforeRender: function () {
                    $('select').material_select();
                }
            }
        })
    },
    //
    loadJson: function () {
        var that = this;
        util.api({
            surl: '/apidata/masterdata.json',
            success: function (resData) {
                that.model.set({
                    listData: resData
                })
            }
        });
        //

    },
    initialize: function (options) {
        var that = this;
        this.options = _.extend({}, options);
        this.loadJson();
        this.model.on('change', function (m) {
            that.render();
        });

    },
    afterRender: function () {
        var that = this;
        if ($('#mymodal').length == 0) {
            $('body').append(' <div id="mymodal" class="modal"></div>');
        }
        this.tableList = new TableList({
            el: $('.table-list-wrap', that.$el)
        });
        this.tableList.model.set({
            listData: that.model.get('listData')[0]
        })
    },
    render: function () {

        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});

var masterData = new MasterData({
    el: '#page-body'
});


