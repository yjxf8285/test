/**
 * Author LLJ
 * Date 2016-5-3 9:33
 */

var nodeTpl=require('../tpl/node-tpl.html');
var modalTpls=require('../tpl/modal-tpl.html');
var tooblarTpls=require('../tpl/toolbar.html');
var Modals = require('component/modals.js');
var nodeFormatter=require('../utils/node-formatter.js');
var Mock=require('../mock/mock.js');
var NodeDataModel=require('../model/nodeDataModel.js');
var layer = require('plugins/layer.js');//弹窗插件
var isDraw=false;
var drawOriginal={};
var startNode=null;
var currentDrawLineType="output-dot";//output ,yes-output-dot,no-output-dot
var DRAWTYPE='curveTriangle';
var currentTipsType=null;
var currentNodeId=null;
var TipsUtils=require('../utils/tips-utils.js');
var URL={
    save:'savePlan'
};
var GROUPURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
function getDateStr(){
    var date = new Date(); //日期对象
    var now = "";
    now = date.getFullYear()+"-";
    now = now + (date.getMonth()+1)+"-";
    now = now + date.getDate()+" ";
    now = now + date.getHours()+":";
    now = now + date.getMinutes()+":";
    now = now + date.getSeconds()+"";
    return now;
}
function save2Storage(v){
    window.localStorage.setItem("planNodesData",JSON.stringify(v));
}
function controller(){
    var events={};
    var _this=this;
    //发布
    function doRelease(){
        $('#plan-edit').hide();
        $('#plan-save').addClass("rui-disabled");
    }
    function changeAudienceTitle(title){
        var release= $('#plan-release')[0]&&$('#plan-release')[0].checked;
        var name= title||$('#plan-name').val();
        if($.trim(name)){
            var dateTime =getDateStr();
            var html=_.template($(tooblarTpls).filter("#toolbar").html())({name:name,release:release,dateTime :dateTime });
            $('#plan-edit-result').html(html);
        }

    };
    /**
     * 发布流程图
     * @param release
     */
    function releaseFlowChart(){
             doRelease();
            _this.view.$el.find('.menubar').hide();
            _this.dragModel.dragDisable(true);
    }
    function  activeFlowChart(){
          _this.view.$el.find(".plan-node").addClass("work");
    }
    function getNodeShowData(name,desc){
      return {name:name,desc:desc};
    }
    function getColorByType(type){
        var obj={
            trigger:'#3b82c3',
            audiences:'#37baac',
            decisions:'#d98d4f',
            activity:'#ab6ce1'
        };
        return obj[type]||'#3b82c3';
    }
    function getTpl(tpls,selector,data){
        return _.template( $(tpls).filter(selector).html())(data||{});
    }
    this.createTmpNode=function(itm,data){
       var inner= itm.innerHTML,_this=this,type=_this.getMenuItemData(itm).type;
        var tmp=$('<div></div>').html(inner)
            .addClass(itm.className+" plan-drag tmp-drag dragging "+type)
            .css({ 'zIndex':198910180})
            .attr({
                'attr-name':data.name,
                'attr-type':data.type,
                'attr-icon':data.icon,
                'attr-url':data.url,
                'attr-item-type':data.itemType
            })
        _this.view.$el.find(".content").append(tmp);
        return tmp;
    };
    /**
     * 根据数据展示节点
     * @param data
     */
    this.displayNodeByData=function(data){

    };
    this.createFlowNode=function(itm){
          var data=this.getMenuItemData(itm);
        data.id=new Date().getTime();
          var html=getTpl(nodeTpl,'#node',data);
          var scllTop=this.drawBox.scrollTop,
              scllFelt=this.drawBox.scrollLeft,
              itmRect=itm.getBoundingClientRect(),
              drawBoxRect=this.drawBox.getBoundingClientRect(),
              top=itmRect.top-drawBoxRect.top+scllTop,
              left=itmRect.left-drawBoxRect.left+scllFelt;
          var node=$(html).css({
              top:top,
              left:left
          })
          this.$drawBox.append(node);
          node.removeClass("dragging");
          NodeDataModel.setNode({
              id:data.id,
              nodeType:data.type,
              itemType:data.itemType,
              url:data.url,
              x:left,
              y:top
          })
    };
    this.getMenuItemData=function(itm){
        var $tag= $(itm);
        console.log("getMenuItemData",{
            type:$tag.attr('attr-type'),
            name:$tag.attr('attr-name'),
            icon:JSON.stringify($tag.attr('attr-icon')),
            url:$tag.attr('attr-url'),
            itemType:$tag.attr('attr-item-type'),
            desc:"",
            num:0
        })
        return {
           type:$tag.attr('attr-type'),
           name:$tag.attr('attr-name'),
           icon:$tag.attr('attr-icon'),
            url:$tag.attr('attr-url'),
            itemType:$tag.attr('attr-item-type'),
           desc:"",
           num:0
        };
    };
    this.limitTmpNodePos=function(tmp){
        var dbRect= this.drawBox.getBoundingClientRect(),
            drgRect= tmp.getBoundingClientRect(),
            left=Math.max(drgRect.left-dbRect.left,0),
            top=Math.max(drgRect.top-dbRect.top,0),
            isTmpDrag=tmp.className.indexOf('tmp-drag')>-1;
            if(dbRect.width-left-drgRect.width-44<0){
                left=dbRect.width-drgRect.width-44;
            }
            if(dbRect.height-top-drgRect.height-44<0){
                top=dbRect.height-drgRect.height-44;
            }
        $(tmp).css({
            left:left,
            top:top+(isTmpDrag?-8:0)
        })
    };
    this.limitFlowNodePos=function(drag){
       var dbRect= this.drawBox.getBoundingClientRect(),
           drgRect= drag.getBoundingClientRect(),
           scllTop=this.drawBox.scrollTop,
           scllLeft=this.drawBox.scrollLeft,
           left=Math.max(drgRect.left-dbRect.left,0),
           top=Math.max(drgRect.top-dbRect.top,0),
           isTmpDrag=drag.className.indexOf('tmp-drag')>-1;
        if(dbRect.width-left-drgRect.width-24<0){
            left=dbRect.width-drgRect.width-24;
        }
        if(dbRect.height-top-drgRect.height-24<0){
            top=dbRect.height-drgRect.height-34;
        }
        $(drag).css({
            left:left+scllLeft,
            top:top+scllTop+(isTmpDrag?-8:0)
        })
    };
    this.saveNodePos=function($tag){
          NodeDataModel.setNode({
              id:$tag.attr('id'),
              x:$tag.css("left"),
              y:$tag.css("top")
          })
    };
    this.changeChart=function(url){
        document.querySelector("#plan-chart").src=url;
    };
    this.initEvent=function(){
        var _this=this;
         events={
             "mousemove":function(e){
                 if(isDraw){
                     var endPos=_this.getDrawPosByEvent(e);
                     _this.renderCanvas();
                     _this.view.painter.draw({
                         type:DRAWTYPE,
                         strokeStyle:_this.getDrawColorByType(currentDrawLineType),
                        startX: drawOriginal.x,
                        startY: drawOriginal.y,
                        endX: endPos.x,
                        endY: endPos.y
                     })
                     //_this.view.controller.isEnterInputDot({x:endPos.x+_this.drawBox.scrollTop,y:endPos.y+_this.drawBox.scrollLeft})
                     _this.view.controller.isEnterInputDot({x:endPos.x,y:endPos.y})
                 }

             },
             "mouseup":function(e){
                 isDraw=false;
                 startNode=null;
                 _this.setDrawCursor(false);
                 _this.renderCanvas();
             },
             "mouseup .plan-node":function(e){
                 if(!startNode){ return;}
                 var $tar=$(e.currentTarget),type=$tar.attr('attr-type'),id=$tar.attr('id')||$tar.parents('.plan-node').attr('id');
                 if(!id){ return; }

                 if(e.target.id!=startNode.id&&type!='trigger'){
                     var enode={};
                     enode[id]= {id:id,"drawType":DRAWTYPE,drawColor:_this.getDrawColorByType(currentDrawLineType) };
                     var node= NodeDataModel.getNode(startNode.id);
                     var switchNode={id:id,"drawType":DRAWTYPE,drawColor:_this.getDrawColorByType(currentDrawLineType)};
                     if(currentDrawLineType=="no-output-dot"){
                         if(!node.switch[0]||(node.switch[0].id!=id)){
                             node.switch[1]=switchNode;
                             NodeDataModel.setNode({
                                 id:startNode.id,
                                 switch:node.switch
                             })
                         }

                     }else if(currentDrawLineType=="yes-output-dot"){
                         if(!node.switch[1]||node.switch[1].id!=id){
                             node.switch[0]=switchNode;
                             NodeDataModel.setNode({
                                 id:startNode.id,
                                 switch:node.switch
                             })
                         }

                     }else{
                         NodeDataModel.setNode({
                             id:startNode.id,
                             ends:enode
                         })
                     }
                     $(e.currentTarget).find(".input-dot").removeClass('hover');

                 }
             },
             "mousedown .plan-node":function(e){
                 _this.dragDisabled(false);

             },
             "mousedown .output-dot,.yes-output-dot,.no-output-dot":function(e){
                 var start=_this.getDrawPosByDot(e.target,'out');
                 drawOriginal={
                     x: start.x,
                     y: start.y
                 };
                 _this.setDrawCursor(true);
                 _this.dragDisabled(true);
                 isDraw=true;
                 startNode=e.target.parentNode;
                 currentDrawLineType=e.target.className;
                 e.stopPropagation();

             },

             "click .plan-node":function(e){//节点单击
                 var node=$(e.currentTarget);
                 if(!node.hasClass("active")){
                     node.addClass("active").siblings('div').removeClass("active");
                     var nodeData=node.data("data"),itemType=node.attr('attr-type');
                     if(itemType=='audiences'){//人群节点
                         if(nodeData&&nodeData.desc){
                             _this.changeChart(node.attr("attr-url"));
                         }
                     }else{
                         _this.changeChart(node.attr("attr-url"));
                     }
                 }
             },
             "click #plan-edit":function(){//toolbar 编辑
                 var name=$("#toolbar-title").text();
                 new Modals.Window({
                     id: "plan-edit-win",
                     title: '活动信息编辑',
                     content: _.template($(modalTpls).filter('#tpl-modal-edit').html())({name:name}),
                     width: 384,
                     buttons:[{text:'保存',cls:'accept',handler:function(thiz){
                             changeAudienceTitle();
                             var release= $('#plan-release')[0].checked;
                             if(release){
                                 releaseFlowChart();
                             }
                            thiz.close();
                     }},{text:'取消',cls:'decline',handler:function(thiz){
                         thiz.close();
                     }}],
                     listeners: {
                         afterRender: function (thiz) {
                         },
                         close: function () {

                         }
                     }
                 })
             },
             "click #plan-save":function(e){//toolbar 保存
                 if(!$(e.target).hasClass("rui-disabled")){
                     var txt=getDateStr();
                     changeAudienceTitle("未命名-"+txt);
                     Materialize.toast("保存成功！", 3000);
                     console.log(JSON.stringify(NodeDataModel.getAll()));
                     //save2Storage(NodeDataModel.getAll());
                 }

             },
             "click .remove-node":function(e){
                 var node=$(e.target).parent();
                 NodeDataModel.delNode(node[0].id)
                 node.remove();
                 _this.renderCanvas();
                 e.stopPropagation();
             },
             "click #openMacket": function(e){
                 var openMacketID = $('#openMacket'),
                     openMacketDrawAnimateID = $('#openMacket-draw-animate'),
                     openMacketMacktAnimateID = $('#openMacket-mackt-animate');
                     openMacketID.hide();
                     openMacketID.addClass('show');
                     openMacketDrawAnimateID.addClass('trigger-animate');
                     openMacketMacktAnimateID.addClass('trigger-animate');
                     openMacketMacktAnimateID.children('.mackt').addClass('trigger-animate');
                 e.stopPropagation();
             },
             "click #mackt-close":function(e){
                 var openMacketID = $('#openMacket'),
                     openMacketDrawAnimateID = $('#openMacket-draw-animate'),
                     openMacketMacktAnimateID = $('#openMacket-mackt-animate');
                     openMacketID.removeClass('show');
                     openMacketDrawAnimateID.removeClass('trigger-animate');
                     openMacketMacktAnimateID.removeClass('trigger-animate');
                     openMacketMacktAnimateID.children('.mackt').removeClass('trigger-animate');
                 setTimeout(function(){
                     openMacketID.show();
                 },300)
                 e.stopPropagation();
             },
             'click .plan-more-menu-item':function(e){
                 if($(e.currentTarget).hasClass("manual-trigger")){
                     Materialize.toast("活动已开始！", 3000);
                 }
             },
             'click .plan-num':function(e){//展开右侧人群搜索框
                 var $tar=$(e.target),num=$tar.text();
                 _this.layout.showgrouplist(e);
                 $("#groupuser-list .num").html("总计"+(num||0)+"人");
             }

         };
    };
    this.bindLayerCloseEvnt=function(){
        var _this=this;
        //点击非弹窗区域关闭弹窗
        $('#container').on('click', function (e) {
            console.log("click currentTipsType",currentTipsType)
            if(currentTipsType){
                   var data= TipsUtils.getDataByType(currentTipsType,"#"+currentTipsType+"-tips")
                    _this.setNodeDataByType(currentNodeId,currentTipsType,data);
                    _this.setNodeInfo({
                        id:currentNodeId,
                        info:data
                    })
            }
            _this.setCurrentTipsType(null);
            layer.closeAll();

        })
    };
    this.setNodeDataByType=function(id,type,data){
       var $node=$("#"+id),data,html="",tmpData,
        title=data.name||this.menuDataModel.getNameByItemType(type);
        console.log(title)
        tmpData=getNodeShowData(title,data.desc);
        $node.find(".content-wrap") .html(getTpl(nodeTpl,"#node-content",tmpData));
        $node.data("data",data);
    };
    /**
     * 根据点获取拖拽对象
     * @param dot
     * @returns {*}
     */
    this.getDragByDot=function(dot){
       return dot.parentNode;
    };
    this.getDrawPosByDot=function(dot,type){
        var drag=this.getDragByDot(dot),
            offsetY=type=='out'?5:0;
        return {
            x:dot.offsetLeft+drag.offsetLeft+dot.offsetWidth/2+5,
            y:dot.offsetTop+drag.offsetTop+dot.offsetHeight/2+offsetY
        };
    }
    this.getDrawPosByEvent=function(e){
        var draw=document.querySelector("#openMacket-draw-animate"),
            cavsRect=draw.getBoundingClientRect();
        return {
            x:e.clientX-cavsRect.left+draw.scrollLeft,
            y:e.clientY-cavsRect.top+draw.scrollTop
        };
    }
    this.showFlowNode=function(data){
        var html=getTpl(nodeTpl,'#node',data);
        var node=$(html).css({
            top:data.y,
            left:data.x
        });
        node.data("data",data.info);
        this.$drawBox.append(node);
    };
    this.loadNodesData=function(status){
        //创建状态
        if(status=='create'){ return;}
        var params= util.getLocationParams();
        var data="{}";
        if(params&&params['planId']=="1"){
           data='{"1463568158807":{"switch":[],"ends":{},"id":"1463568158807","nodeType":"audiences","itemType":"target-group","url":"'+GROUPURL+'","x":"565px","y":"92px","info":{"name":"","select":"1","selectText":"乐友母婴童测试白名单","newSelect":"1","refresh1":"1","refresh2":"hour","desc":"乐友母婴童测试白名单"}}}';
        }else if(params&&params['planId']=="2"){//完成
            changeAudienceTitle('周末促销活动测试');
            data=JSON.stringify(Mock.data2)
        }else if(params&&params['planId']=="3"){//周末促销活动
            changeAudienceTitle('周末促销活动');
            data=JSON.stringify(Mock.data3);
        }else if(params&&params['planId']=="4"){//新品上市推广活动销活动
            changeAudienceTitle('新产品上市推广活动');
            data=JSON.stringify(Mock.data4);
        }  else{
           data=window.localStorage.getItem("planNodesData")||"{}";
        }
        data=JSON.parse(data);
        if(data){
            for(var id in data){
                var rec=data[id];
                var menuItmData=_this.menuDataModel.getDataByItemType(rec.itemType);
                _this.showFlowNode(nodeFormatter.showData(rec,menuItmData[1],menuItmData[0]));
            }
            NodeDataModel.setData(data||{});
            this.renderCanvas();
        }
        if(params&&params['status']){
            this.changePlanStatus(params['status']);
        }
        if(params&&params['returnurl']){
            this.changeHomeIcon(params['returnurl']);
        }
    };
    this.init=function(){
        document.querySelector('body').classList.add('activity-plan');
        var _this=this;
        this.initEvent();
        this.bindLayerCloseEvnt();
    };
    this.config=function(view,drag,menuDataModel,layout){
        this.view=view;
        this.dragModel=drag;
        this.menuDataModel=menuDataModel;
        this.$drawBox=this.view.$el.find('.draw-box');
        this.drawBox=this.$drawBox[0];
        this.layout=layout;

    };
    this.bindEvent=function(){
        return events;
    }
    this.setDrawCursor=function(type){
       $('#openMacket-draw-animate').css({
           cursor:type?'default':'auto'
       })
        type?$('.plan-node').addClass("drawing"):$('.plan-node').removeClass("drawing");
        //$('.plan-node').css({
        //    cursor:type?'default':'auto'
        //})
    };
    /**
     * 拖拽失效
     * @param type
     */
    this.dragDisabled=function(type){
       var drags=this.view.$el.find('.plan-node');
       type?drags.removeClass('dome-drag'):drags.addClass('dome-drag');
    };
    this.getOutDotById=function(id,type){
      return $('#'+id).find(type=='decisions'?'.no-output-dot,.yes-output-dot':'.output-dot');
    };
    this.getInDotById=function(id){
        return $('#'+id).find('.input-dot');
    };
    this.renderCanvas=function(){
        var nodes=NodeDataModel.getAll(),_this=this;
        this.view.painter.clearAll();
        for(var k in nodes){
           var node=nodes[k],type=node.nodeType;
            if(type=='decisions'){
                var outDots=this.getOutDotById(node.id,'decisions');
                $.each(outDots,function(i,dot){
                    var sw= node.switch[i];
                    if(sw&&sw.id&& $('#'+sw.id)[0]){
                        var outDot=_this.getOutDotById(node.id,'');
                        _this.drawLineByDot(node,dot,i);
                    }
                })
            }else{
                var outDot=this.getOutDotById(node.id,'');
                this.drawLineByDot(node,outDot[0]);
            }
        }
    };
    this.drawLineByDot=function(node,dot,index){
        var startPos=this.getDrawPosByDot(dot,'out');
        $.each(node.nodeType=="decisions"?node.switch:node.ends,function(i,itm){
            if((node.nodeType=="decisions"&&index==i)||node.nodeType!="decisions"){
                var inDot=_this.getInDotById(itm.id);
                if(inDot[0]){
                    var endPos=_this.getDrawPosByDot(inDot[0],'in');
                    _this.view.painter.draw({
                        type:itm.drawType,
                        strokeStyle:itm.drawColor,
                        startX:startPos.x,
                        startY:startPos.y,
                        endX:endPos.x,
                        endY:endPos.y
                    })
                }
            }
        })
    };
    this.isEnterInputDot=function(pos){
        var dBRect=this.drawBox.getBoundingClientRect(),_this=this;
        this.view.$el.find(".input-dot").each(function(i,itm){
            var rect=itm.getBoundingClientRect();
            if((pos.x>rect.left-dBRect.left+_this.drawBox.scrollLeft)&&(pos.x<rect.left+rect.width-dBRect.left+_this.drawBox.scrollLeft)&&(pos.y>rect.top-dBRect.top+_this.drawBox.scrollTop)&&(pos.y<rect.top+rect.height-dBRect.top+_this.drawBox.scrollTop)){
                itm.classList.add('hover');
            }else{
                if( itm.className.indexOf('hover')>-1){
                    itm.classList.remove('hover');
                }
            }
        })
    };
    this.getDrawColorByType=function(type){
        var obj={
            'output-dot':'#787878',
            'yes-output-dot':'#65bb43',
            'no-output-dot':'#e64646'
        };
        return obj[type]?obj[type]:obj['output-dot'];
    };
    /**
     * 活动编排状态切换(暂未用)
     * @param status
     */
    this.changePlanStatus=function(status){
        if(status=="edit"){

        }else if(status=="released"){
           releaseFlowChart();
        }else if(status=="active"){
           releaseFlowChart();
           activeFlowChart();

        }else if(status=='unreleased'){

        }

    };
    this.changeHomeIcon=function(url){
        var header=$('#page-body-header')
        header.addClass('return-url');
        header.find(".return-pages").attr("href",BASE_PATH+url);
    };
    this.setCurrentTipsType=function(type){
        currentTipsType=type;
    };
    this.setCurrentNodeId=function(id){
        currentNodeId=id;
    };
    this.setNodeInfo=function(arg){
        NodeDataModel.setNode({
            id:arg.id,
            info:arg.info
        })

    };
    this.init();
}

module.exports=controller;