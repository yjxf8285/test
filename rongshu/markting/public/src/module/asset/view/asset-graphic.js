/**
 * Created by AnThen on 2016-5-4.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/asset/graphic-tpl.html");
//组件
var Modals = require('component/modals.js');

var DragModel = require('module/asset/model/dragModel.js');
var Controller=require('module/asset/controller/controller.js');
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'图文资产'
});
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateSetuplist: _.template($(tpl).filter('#tpl-setuplist').html()),
        templateManagedAll: _.template($(tpl).filter('#tpl-managed-weixin').html() + $(tpl).filter('#tpl-managed-H5-maka').html()),
        templateH5New: _.template($(tpl).filter('#tpl-managed-H5-new').html()),
        templateH5MakaNew: _.template($(tpl).filter('#tpl-managed-H5-new').html() + $(tpl).filter('#tpl-managed-H5-maka').html()),
        templateWeixin: _.template($(tpl).filter('#tpl-managed-weixin').html()),
        templateH5Rabbitpre: _.template($(tpl).filter('#tpl-managed-H5-rabbitpre').html()),
        templateH5Eqxiu: _.template($(tpl).filter('#tpl-managed-H5-eqxiu').html()),
        templateH5Maka: _.template($(tpl).filter('#tpl-managed-H5-maka').html())
    },
    //设置响应事件
    events: {
        "click .qiehuanOption": "qiehuanOption",
        "click .managed-more": "setuplistShow",
        "click #phone-preview": "phonePreview",
        "click #delete-managed": "deleteManaged",
        "click #openOption": "openOption",
        "change #testUrl": "testUrl"
    },
    qiehuanOption: function(e){
        var that = this,
            thisType = $(e.currentTarget).attr('type'),
            liId = $('#managed-box').children('li');
        var icoText = "<span class='ico icon iconfont'>&#xe60d;</span>",
            allText = "<span class='text'>全部</span>",
            weixinText = "<span class='text'>微信</span>",
            H5Text = "<span class='text'>H5</span>",
            rabbitpreText = "<span class='text'>兔展</span>",
            eqxiuText = "<span class='text'>易企秀</span>",
            makaText = "<span class='text'>MAKA</span>",
            publicLeyouyunyingtongText = "<span class='text'>乐友孕婴童</span>";
        switch (thisType){
            case 'all':
                $('#headerText').html(allText);
                $('#managed-box', that.$el).html(that.template.templateManagedAll(that.model.toJSON()));
                break;
            case 'weixin-all':
                $('#headerText').html(allText + icoText + weixinText);
                $('#managed-box', that.$el).html(that.template.templateWeixin(that.model.toJSON()));
                break;
            case 'weixin-public-leyouyunyingtong':
                $('#headerText').html(allText + icoText + weixinText + icoText + publicLeyouyunyingtongText);
                $('#managed-box', that.$el).html(that.template.templateWeixin(that.model.toJSON()));
                break;
            case 'H5-all':
                $('#headerText').html(allText + icoText + H5Text);
                $('#managed-box', that.$el).html(that.template.templateH5Maka(that.model.toJSON()));
                break;
            case 'H5-rabbitpre':
                $('#headerText').html(allText + icoText + H5Text + icoText + rabbitpreText);
                $('#managed-box', that.$el).html(that.template.templateH5Rabbitpre(that.model.toJSON()));
                break;
            case 'H5-eqxiu':
                $('#headerText').html(allText + icoText + H5Text + icoText + eqxiuText);
                $('#managed-box', that.$el).html(that.template.templateH5Eqxiu(that.model.toJSON()));
                break;
            case 'H5-MAKA':
                $('#headerText').html(allText + icoText + H5Text + icoText + makaText);
                $('#managed-box', that.$el).html(that.template.templateH5Maka(that.model.toJSON()));
                break;
        }
        $('#setuplist-box', that.$el).html(that.template.templateSetuplist(that.model.toJSON()));
        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false,
                hover: false,
                gutter: 0,
                belowOrigin: false
            }
        );
    },
    setuplistShow: function(e){
        var that = $(e.currentTarget),
            thatTrIndex = that.parents('.managed').index();
        console.info(thatTrIndex)
        $('#setuplist').attr('trigger',thatTrIndex);
    },
    phonePreview: function(){
        var clipboard = "<div style='width:164px; height:164px; margin:auto;'><img src='../../img/data-access/clipboard.png'></div>";
        new Modals.Window({
            title:"",
            content:clipboard,
            width:'210',//默认是auto
            height:'284'//默认是auto
        })

    },
    deleteManaged: function(){
        var that = this;
        new Modals.Confirm({
            content:"您确实要删掉这条信息吗？",
            listeners:{
                close:function(type){
                    if(type){
                        var deleteIndex = parseInt($('#setuplist').attr('trigger'));
                        $('#managed-box').children('li').eq(deleteIndex).empty().remove();
                        $('#setuplist-box', that.$el).html(that.template.templateSetuplist(that.model.toJSON()));
                        $('.dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrain_width: false,
                            hover: false,
                            gutter: 0,
                            belowOrigin: false
                        });
                    }else{
                        //console.log("click cancel");
                    }
                }
            }
        });
    },
    openOption: function(e){
        var that= $(e.currentTarget),
            thisParents = that.parents('li.option'),
            optionContext = "<div class='change'><input type='text' class='validate' id='testUrl' placeholder='粘贴H5页面URL至此'/></div><div class='sign icon iconfont'></div><div class='tip'></div>";
        $('li.option').removeClass('hover');
        $('#optionContext').removeClass().addClass('context').html(optionContext);
        if(thisParents.hasClass('hover')){
            var thiscon = '<div class="change"><input type="text" class="validate" id="testUrl"/></div><div class="sign icon iconfont"></div><div class="tip"></div>';
            thisParents.removeClass('hover');
            thisParents.children('.con-box').children('.drag-box').children('.term:first').children('.context').empty().removeClass('wrong').removeClass('right').append(thiscon);
        }else{
            thisParents.addClass('hover');
        };

    },
    testUrl: function(e){
        var that = $(e.currentTarget),
            thisval = that.val(),
            type = that.parents('li.option').attr('thistype');

        switch (type){
            case "rabbitpre":
                test(thisval,'rabbitpre','com');
                break;
            case "eqxiu":
                test(thisval,'eqxiu','com');
                break;
            case "maka":
                test(thisval,'maka','im');
                break;
            default:
                break;
        };

        function test(url,field,suffix){
            var thisContextDiv = that.parents('.context'),
                thiscon = "";
            if(util.isFieldUrl(url,field,suffix)){
                var thiscon1 = "<div class='change'><div class='drag dom-dragable' attr-type='"+type+"'><div class='ico icon iconfont'>&#xe602;</div><div class='drag-text'>",
                    thiscon2 = "</div></div></div><div class='sign icon iconfont'>&#xe623;</div>";
                thisContextDiv.addClass('right');
                thisContextDiv.empty();
                thiscon = thiscon1 + url + thiscon2;
                thisContextDiv.append(thiscon);
            }else{
                thisContextDiv.addClass('wrong');
                thisContextDiv.children('.sign').html('&#xe604;');
                thisContextDiv.children('.tip').html('链接地址有误！');
            };
        };

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
        $('#page-body', this.$el).html(this.template.templateMain(this.model.toJSON()));
        $('#managed-box', this.$el).html(this.template.templateManagedAll(this.model.toJSON()));
        $('#setuplist-box', this.$el).html(this.template.templateSetuplist(this.model.toJSON()));
        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false,
                hover: false,
                gutter: 0,
                belowOrigin: false
            }
        );

        this.controller=new Controller();
        this.controller.config(this,new DragModel(this))
        return this;
    }
});
module.exports=Container;
