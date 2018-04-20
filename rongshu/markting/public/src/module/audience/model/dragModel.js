/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
var Drag=require('component/drag.js');

//拖动对象原始坐标
var dragTarOriginal={};
var TmpDrag=null;
var tpl=require('../tpl/left-tpl.html');
var groupTpl=require('../tpl/group-tpl.html');
var tmpNumber=1;
var tmpGroupId=null;
function model(view){
    var _this=this;
    _this.view=view;
    _this.$content= view.$el.find('.content');
    var cfg={
        root:_this.$content[0].id,
        listeners:{
            beforedrag:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag);
                _this.isEnter=false;
                tmpGroupId=_this.getGroupId();
                if(!_this.view.controller.isGroupLimit()){
                    _this.addGroupCondition(tmpGroupId);
                }
                _this.view.controller.addDragTarAbleCls(true);
                var $target=_this.view.$el.find('.segment-target');
                dragTarOriginal={
                    x:drag.offsetLeft,
                    y:drag.offsetTop
                };

                $drag.addClass("segment-drag")
                TmpDrag=null;
                if($drag.hasClass('result')){
                    $drag.css({
                        left:drag.offsetLeft,
                        top:drag.offsetTop,
                        zIndex:100,
                        cursor:'move'
                    })
                    if(TmpDrag){
                        TmpDrag.remove();
                        TmpDrag=null;
                    }
                    $drag.removeClass("segment-drag")
                    TmpDrag=$($drag[0].outerHTML);
                    TmpDrag.addClass('result-clone segment-drag');
                    _this.view.$el.find('#page-body').append(TmpDrag);
                    TmpDrag.css({left: dragTarOriginal.x,
                        top:dragTarOriginal.y
                    })
                    e.target.dragTarget=TmpDrag[0];
                }else{
                    var top=_this.view.$el.find('.actions-box').get(0).scrollTop;
                    $drag.css({
                        left:drag.offsetLeft,
                        top:drag.offsetTop-top,
                        zIndex:100,
                        cursor:'move'
                    })
                }
            },
            dragging:function(e,domDrag){
                var drag=this.getDragTarget(e),$drag=$(drag),self=this;
                var $target=_this.view.$el.find('.segment-target'),
                    target=$target[0];
                _this.isEnter=false;
                if(!self.isEnterElement(document.querySelector('.config-area'),drag)){
                    _this.view.controller.switchConfigArea(false)
                }
                $target.each(function(i,item){
                    //if( self.isEnterElement(item,drag)){
                    if( domDrag.isEnterRect(item.getBoundingClientRect())){
                        _this.enterTarget=$(item).parent().addClass('enter');
                        _this.isEnter=true;
                        return false;
                    }else{
                        _this.enterTarget&&_this.enterTarget.removeClass('enter')

                    }
                })


            },
            drop:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag),self=this,group,gId;
                _this.enterTarget&&_this.enterTarget.removeClass('enter');
               if( _this.isEnter){
                   var textType=TmpDrag?"result":"condition";
                   var text=_this.getText($drag,textType);
                   var inputTxt=$("#aud-tag-search").val();
                   group=_this.enterTarget.parent();
                   gId=group.attr('id');
                   var isSameCondition=_this.view.controller.validateCondition(inputTxt+"-"+text,gId);
                   if(!isSameCondition){
                       _this.createConditionInput(_this.enterTarget,text,inputTxt+"-"+text);
                       _this.view.controller.loadChartByGroup(gId,null,text);
                   }
                   if(TmpDrag){
                       $drag.remove();
                   }else{
                       if(!isSameCondition){
                           group=$drag.parent().parent();
                           gId=group.attr('id');
                           $drag.parent().remove();
                           _this.view.controller.loadChartByGroup(gId,null,text);
                       }else{
                           $drag.css({
                               left:dragTarOriginal.x,
                               top:dragTarOriginal.y,
                               zIndex:0,
                               cursor:'auto'
                           })
                           $drag.removeClass("segment-drag");
                           if(TmpDrag) $drag.remove();
                       }
                   }
               }else{
                   $drag.css({
                       left:dragTarOriginal.x,
                       top:dragTarOriginal.y,
                       zIndex:0,
                       cursor:'auto'
                   })
                   $drag.removeClass("segment-drag");
                   if(TmpDrag) $drag.remove();
               }
                _this.view.controller.checkoutGroup();
                var chartId=_this.view.controller.getChartIdByGId(gId)
                _this.view.controller.resizeFunnelChart(chartId)
                _this.view.controller.addDragTarAbleCls(false);

            }
        }
    };
    this.createConditionInput=function($con,text,showText){
        var hml= _.template(RUI.queryTpl(tpl,"#action-input"))({showCondition:showText,condition:text,id:'input-'+tmpNumber});
        $con.before(hml)
        tmpNumber++;
    };
    this.addGroupCondition=function(gId){
        var hml= _.template(RUI.queryTpl(groupTpl,"#segment-group"))({groupId:gId});
         this.view.$el.find('.actions-box').append(hml);
    };
    this.delLastGroup=function(){
        this.view.$el.find('.actions-box .prerequisite-box').last().remove();
    };
    this.delGroupById=function(id){
        this.view.$el.find('.actions-box #'+id).parent().parent().remove();
    };
    this.getGroupId=function(){
        var cod=this.view.$el.find('.actions-box .prerequisite-box:last .group-box');
        var num=cod.attr('id').substring(5);
        return 'group'+(++num);
    };
    this.getText=function($el,type){
        return type=='result'?$el.find('.text').text():$el.find('.input').text();
    };
    this.addDragTarAbleCls=function(type){
            type?this.view.$el.find('.actions-box .term-box:not(".init")').addClass('hover'):this.view.$el.find('.actions-box .term-box:not(".init")').removeClass('hover');
    };

    this.isGroupEmpty=function(gId){
       return !this.view.$el.find('.actions-box #'+gId).children('.init').length;
    };

    new Drag.Base(cfg);

}

module.exports=model;