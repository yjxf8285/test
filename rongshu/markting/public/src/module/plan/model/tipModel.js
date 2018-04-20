/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
require('component/index.js');
var layer = require('plugins/layer.js');//弹窗插件
var tps=require('../tpl/tip-tpl.html');
var tipsUtils=require('../utils/tips-utils.js');
var sugTpls = require('../tpl/suggest-tpl.html');
var Mock=require('../mock/mock.js');
var AOP=require('../utils/aop.js');
var SAVECURGROUP=[{val:"0",text:"乐友孕婴童-测试白名单"},
    {val:"1",text:"周末促销消费会员"},
    {val:"2",text:"周末促销未消费会员"},
    {val:"3",text:"新产品回访用户"}];

function updateGroup(txt){
    if($.trim(txt)!=""){
        SAVECURGROUP.push({
            val:new Date().getTime(),
            text:txt
        })
        var html= _.template($(tps).filter("#save-current-group-opt").html())({group:SAVECURGROUP});
        $('#save-current-group-select').html(html);
        $('#save-current-group-select').material_select();
        $('#save-current-group-select').parent().hide();

    }

}
function bindKeydown(type){
    if(type){
        document.onkeydown = function(e){
            e =e|| window.event;
            if((e.keyCode || e.which) == 13){
                var editNameInput=$('#save-current-group-edit-name');
                updateGroup(editNameInput.val());
            }
        }
    }else{
        document.onkeydown=null;
    }
}
function getSuggestDataByKey(k){
    var res=[];
    Mock.tar.forEach(function(itm,i){
        if(itm.name.indexOf(k)>-1){
            res.push(itm);
        }
    })
    return res;
}
//拖动对象原始坐标
function model(view){
    var _this=this;
    _this.view=view;
    _this.$content= view.$el.find('.content');
    var cfg={};
    function addTag(val){
        if($.trim(val)){
            var html= '<div class="active-tag" attr-val="'+val+'">'+val+'<i class="icon iconfont active-tag-close">&#xe622;</i></div>';
            $('#label-judgment-tag-content').append(html);
        }

    }
    function queryTpls(tps,sel){
        return $(tps).filter(sel).length?$(tps).filter(sel).html():"";
    }
    function  renderTpl(tps,sel,data){
       var tpl= queryTpls(tps,sel);
       return tpl?_.template(queryTpls(tps,sel))(data):"";
    }
    function getLagerCallBack(type,selector){
       return tipsUtils.getEventByType(type,selector);
    }
    this.showSuggest=function(v){
        var list=$("#label-judgment-tag-suggest");
        if(v){
            var res=getSuggestDataByKey(v);
            var tpl= _.template($(sugTpls).filter("#suggest").html())({
                data:res
            });
            list.show();
            list.html(tpl)
        }else{
            list.hide();
        }
    };
    function setInput(sel,v){
       $(sel).val(v);
    }
    $('body').on("click.plan",function(e){
           var tar= e.target,$tar=$(tar),cls=tar.className;
           if($tar.hasClass("active-tag-close")){//标签关闭 触发事件
               $tar.parent().remove();
           }else if($tar.hasClass("plan-suggest-trigger")){//suggest 触发事件
               var txt=$tar.text();
               setInput("#label-judgment-tag",txt);
               addTag(txt);
               _this.showSuggest(false)

           }else if(tar.id=='save-current-group-edit'){ //保存当前人群编辑
               var editNameInput=$('#save-current-group-edit-name'),
                   isDisplay=editNameInput.attr('attr-display');
               if(isDisplay=="true"){
                   updateGroup(editNameInput.val());
                   editNameInput.hide();
                   $('#save-current-group-select').parent().show();
                   isDisplay='false';
               }else{
                   editNameInput.val("").show();
                   $('#save-current-group-select').parent().hide();
                   isDisplay='true';
               }
               editNameInput.attr('attr-display',isDisplay)

           }

    }).on("keyup.plan",function(e){
        var tar= e.target,$tat=$(tar);
        if(tar.id=='label-judgment-tag'){
            var v=$tat.val(),vTrim= $.trim(v);
            _this.showSuggest(vTrim)
        }
    })
    _this.view.$el.on('dblclick', '.plan-node', function (e) {
        var me = this,$tar=$(me);
        if($tar.hasClass("dom-dragdisable")){
            return;
        }
        var data=_this.view.controller.getMenuItemData(me);
        if(data.itemTyp=="manual-trigger"){//手动触发不可编辑
            return;
        }
        var tipsData=tipsUtils.getDataByType(data.itemType,"#"+data.itemType+"-tips");
        if(!tipsData){
            return;
        }
        _this.view.controller.setCurrentTipsType(data.itemType);
        _this.view.controller.setCurrentNodeId(me.id);
        var nodeData=$tar.data("data");
        var content=renderTpl(tps, data.itemType?"#" + data.itemType: '#target-group', nodeData?nodeData:tipsData);
        if(content){
            var opts= {
                //area: '500px',//宽高area: ['500px', '300px']
                shade: 0,//不要遮罩
                closeBtn: 0,//不要关闭按钮
                type: 4,//tip类型
                shift: 5,//动画类型0-6 默认0
                //tips: [4, '#fff'],//方向1-4，背景色
                content: [content, me]
            };
            var callBack=getLagerCallBack(data.itemType,"#"+data.itemType+"-tips");
            for(var cb in callBack){
                opts[cb]=callBack[cb];
            }
            var meRect=me.getBoundingClientRect();
            if((window.innerHeight-meRect.top)<424){
                opts['tips']=1;
            }
            //对保存当前用户做特殊处理
            if(data.itemType=='save-current-group'){
                AOP.before(opts,"success",function(){
                      bindKeydown(true);
                })
                AOP.before(opts,"end",function(){
                    bindKeydown(false);
                })
            }
            layer.open(opts);
        }
        e.stopPropagation();
    });

}

module.exports=model;