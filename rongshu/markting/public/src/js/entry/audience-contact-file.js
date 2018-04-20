/**
 * Created by AnThen on 2016-5-13.
 */
/*加载模块*/
//加载本页模块
var tpl = require("html/audience/contact-file-tpl.html");
//组件
var Modals = require('component/modals.js');

var option = option = {
    title: {
        text: '基础雷达图',
        x: 'center',
        textStyle:{
            color:'#5a5a5a'
        }

    },
    color: util.getChartColors(),
    legend: {
        data: ['赵英', '平均'],
        y: '10%',
    },
    radar: {
        //shape: 'circle',//圆形
        center: ['50%', '60%'],
        radius: '60%',
        indicator: [
            {name: '最近消费时间', max: 6},
            {name: '购买商品品类数', max: 6},
            {name: '单次最高交易额', max: 6},
            {name: '平均交易金额', max: 6},
            {name: '消费频率', max: 6}
        ]
    },
    series: [{
        name: '',
        type: 'radar',
        //areaStyle: {normal: {}},//实心
        data: [
            {
                value: [4, 2, 5, 6, 2],
                name: '赵英'
            },
            {
                value: [3, 6, 3, 2, 5],
                name: '平均'
            }
        ]
    }]
};
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html())
    },
    //设置响应事件
    events: {
        "click #user-info-edit": "userInfoEdit",
        "click #label-edit-but": "labelEdit"
    },
    userInfoEdit: function () {
        var thatTemplate = $(tpl).filter('#tpl-modal2').html();
        new Modals.Window(
            {
                id: "tpl-modal2",
                title: "联系人基本信息编辑",
                content: thatTemplate,
                width: '434',//默认是auto
                height: '566',//默认是auto
                buttons: [{
                    text: '保存',
                    cls: 'accept',
                    handler: function (self) {
                        var originalName = $('#user-name').text(),
                            originalGender = $('#user-gender').text(),
                            originalAge = $('#user-age').text(),
                            originaladd = $('#user-add').text(),
                            originalPhonenum = $('#user-phonenum').text(),
                            originalEmail = $('#user-email').text(),
                            originalWeixin = $('#user-weixin').text();
                        var name = $.trim($('.modal2-user-name').val()) || originalName,
                            gender = $.trim($('.modal2-user-gender').val()) || originalGender,
                            age = $.trim($('.modal2-user-age').val()) || originalAge,
                            homeadd = $.trim($('.modal2-user-home-add').val()) || originaladd,
                            phonenum = $.trim($('.modal2-user-phonenum').val()) || originalPhonenum,
                            email = $.trim($('.modal2-user-email').val()) || originalEmail,
                            weixin = $.trim($('.modal2-user-weixin').val()) || originalWeixin;
                        $('#user-name').text(name);
                        $('#user-gender').text(gender);
                        $('#user-age').text(age);
                        $('#user-home-add').text(homeadd);
                        $('#user-phonenum').text(phonenum);
                        $('#user-email').text(email);
                        $('#user-weixin').text(weixin);
                        self.close();
                    }
                }, {
                    text: '取消',
                    cls: 'decline',
                    handler: function (self) {
                        self.close();
                    }
                }
                ],
                listeners: {//window监听事件事件
                    open: function () {
                        //console.log("open")
                    },
                    close: function () {
                        //console.log("close")
                    },
                    beforeRender: function () {
                        //console.log("beforeRender")
                        var userName = $('#user-name').text().trim(),
                            userGender = $('#user-gender').text().trim(),
                            userAge = $('#user-age').text().trim(),
                            userHomeAdd = $('#user-home-add').text().trim(),
                            userPhonenum = $('#user-phonenum').text().trim(),
                            userEmail = $('#user-email').text().trim(),
                            userWeixin = $('#user-weixin').text().trim();
                        $('.modal2-user-name').val(userName);
                        $('.modal2-user-name').next('label').addClass('active');
                        if(userGender=='男'){$('.modal2-user-gender').find("option:selected").text('男')}else{$('.modal2-user-gender').find("option:selected").text('女')};
                        $('.modal2-user-age').val(userAge);
                        $('.modal2-user-age').next('label').addClass('active');
                        $('.modal2-user-home-add').val(userHomeAdd);
                        $('.modal2-user-home-add').next('label').addClass('active');
                        $('.modal2-user-phonenum').val(userPhonenum);
                        $('.modal2-user-phonenum').next('label').addClass('active');
                        $('.modal2-user-email').val(userEmail);
                        $('.modal2-user-email').next('label').addClass('active');
                        $('.modal2-user-weixin').val(userWeixin);
                        $('.modal2-user-weixin').next('label').addClass('active');
                    },
                    afterRender: function () {
                        $('select').material_select();
                        //console.log("afterRender")
                    }
                }

            })
    },
    labelEdit: function () {
        var thatTemplate = $(tpl).filter('#tpl-modal1').html();
        new Modals.Window({
            id: "tpl-modal1",
            title: "细分人群标签",
            content: thatTemplate,
            //width:'auto',//默认是auto
            //height:'auto',//默认是auto
            buttons: [
                {
                    text: '保存',
                    cls: 'accept',
                    handler: function (self) {
                        var list = "",
                            list1 = "<div class='list'>",
                            list2 = "</div>";
                        var form = $('#lable-wrap').children('.segment-tag'),
                            to = $('#list-box');
                        to.empty();
                        $.each(form, function () {
                            var text = $(this).children('.text').text();
                            console.log(text)
                            list = list1 + text + list2;
                            to.append(list);
                        });
                        self.close();
                    }
                }, {
                    text: '取消',
                    cls: 'decline',
                    handler: function (self) {
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件
                open: function () {
                    //console.log("open");
                    var lable = "",
                        lable1 = "<div class='segment-tag'><span class='text'>",
                        lable2 = "</span><i class='icon iconfont rui-close'>&#xe637;</i></div>";
                    var form = $('#list-box').children('.list'),
                        to = $('#lable-wrap');
                    $.each(form, function () {
                        var text = $(this).text();
                        lable = lable1 + text + lable2;
                        to.append(lable);
                    });
                },
                close: function () {
                    //console.log("close");
                },
                beforeRender: function () {
                    //console.log("beforeRender");
                },
                afterRender: function () {
                    var lable = "",
                        lable1 = "<div class='segment-tag'><span class='text'>",
                        lable2 = "</span><i class='icon iconfont rui-close'>&#xe637;</i></div>";
                    $('#lable-input').change(function () {
                        var thisVal = $(this).val();
                        lable = lable1 + thisVal + lable2;
                        $('#lable-wrap').append(lable);
                    });
                    $('.rui-close').click(function () {
                        $(this).parents('.segment-tag').empty().remove();
                    });
                }
            }
        });
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template.templateMain(this.model.toJSON()));
        this.myChart1 = echarts.init(document.getElementById('contact-charst1'), 'macarons');
        this.myChart1.setOption(option);
        return this;
    }
});

/************生成页面************/
var container = new Container({
    el: '#alone'
});