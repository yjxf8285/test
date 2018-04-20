/**
 * Author LLJ
 * Date 2016-5-11 11:24
 */
var boxTpls=require('../tpl/box-tpl.html');
var optionpls=require('../tpl/option-tpl.html');
var managed = require("html/asset/graphic-tpl.html");
function renderTpl(tps,selector,data){
   return _.template($(tps).filter(selector).html())(data||{})

}
function controller(){
    //  <div class="preloader-wrapper big active">
    this.config=function(view,drag){
        this.view=view;
        this.drag=drag;
    };
    this.showLoading=function(){
        var box=this.view.$el.find("#dispose-box");
        box.attr("class","dispose-box mouseup").html(renderTpl(boxTpls,'#loading',{}));
    };
    this.showBoxSuccess=function(){
        var box=this.view.$el.find("#dispose-box");
        box.attr("class","dispose-box success").html(renderTpl(boxTpls,"#success",{}));
    };
    this.showBoxDefault=function(){
        var box=this.view.$el.find("#dispose-box");
        box.attr("class","dispose-box init").html(renderTpl(boxTpls,"#init",{}));
    };
    this.showBoxEnter=function(type){
        var box=this.view.$el.find("#dispose-box");
        if(type){
            box.addClass("hover").children("div").hide();;
        }else{
            box.removeClass("hover").children("div").show();
        }
    };
    this.showBoxDragable=function(type){
        var box=this.view.$el.find("#dispose-box");
            type?box.addClass("ongoing"):box.removeClass("ongoing");
    };
    /**
     *  数据加载
     * @param type
     */
    this.loadListData=function(type){
        var templateH5New = renderTpl(managed,'#tpl-managed-H5-new',{}),
            templateH5MakaNew = renderTpl(managed,'#tpl-managed-H5-new',{}) + renderTpl(managed,'#tpl-managed-H5-maka',{}),
            templateSetuplist = renderTpl(managed,'#tpl-setuplist',{});
        console.log(templateH5New)
        //TODO::MOCK DATA
        if(type=="rabbitpre"){
            $('#managed-box').html(templateH5New);
            this.modifyManagedHeaderText("兔展");
        }else if(type=="eqxiu"){
            $('#managed-box').html(templateH5New);
            this.modifyManagedHeaderText("易企秀");
        }else if(type=="maka"){
            $('#managed-box').html(templateH5MakaNew);
            this.modifyManagedHeaderText("MAKA");
        }
        $('#setuplist-box').html(templateSetuplist);
        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false,
                hover: false,
                gutter: 0,
                belowOrigin: false
            }
        );
        $("#managed-box")
    };
    this.createTmpNode=function(itm){
        var outer= itm.outerHTML,_this=this,rect=itm.getBoundingClientRect();
        var tmp=$(outer).addClass("dom-dragable asset-graphic-drag tmp-drag draging")
            .css({
                left:rect.left,
                top:rect.top,
                width:rect.width,
                height:rect.height
            })
        this.view.$el.find(".content").append(tmp);
        return tmp;
    };
    this.modifyManagedHeaderText=function(text){
        var arrText=["<span class='text' id='headerText'>全部</span>"];
        if(text){
            arrText.push("<span class='ico icon iconfont'>&#xe60d;</span><span class='text'>H5</span><span class='ico icon iconfont'>&#xe60d;</span><span class='text'>"+text+"</span>")
        }
        $('#headerText').html(arrText.join(""));
    };
    this.optionInputInit=function(sel){
        this.view.$el.find('.option-area li[thistype="'+sel+'"] .context:first').html(renderTpl(optionpls,"#input-init",{}));
    }
}
module.exports=controller;
