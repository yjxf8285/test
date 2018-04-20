/**
 * 分页组件
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var Widget=require('widget');
    var Pagination = Widget.extend({
        attrs: {
            "pageSize":45,
            "totalSize":-1,
            "visiblePageNums":7,   //最小可见页码 >3,第一页和末页为保留页码
            "activePageNumber":1,
            "pageNums":{
                "value":0,
                "getter":function(){
                    return this._pageNums;
                }
            },
            "style":"normal"    //normal or simple
        },
        events: {
            'click .ui-pagination-num': '_numClick',
            'click .ui-pagination-prev': '_prevClick',
            'click .ui-pagination-next': '_nextClick'
        },
        setup:function(){
            var result=Pagination.superclass.setup.apply(this,arguments);
            this._setupPageNums();
            return result;
        },
        render:function(){
            var result=Pagination.superclass.render.apply(this,arguments);
            this.element.addClass('ui-pagination fn-clear');
            return result;
        },
        _prevClick:function(){
            var activePn=this.get('activePageNumber');
            if(activePn>1){
                activePn--;
                this.jump(activePn);
            }
        },
        _nextClick:function(){
            var activePn=this.get('activePageNumber'),
                pageNums=this._pageNums;
            if(activePn<pageNums){
                activePn++;
                this.jump(activePn);
            }
        },
        _numClick:function(e){
            var curEl=$(e.currentTarget),
                pageNumber=parseInt(curEl.text());
            if(!curEl.hasClass('ui-pagination-active')){
                this.jump(pageNumber);
            }
        },
        jump:function(pageNumber){
            this.set('activePageNumber',pageNumber);
            //触发page事件
            this.trigger('page',pageNumber);
        },
        show:function(){
            this.element.show();
        },
        hide:function(){
            this.element.hide();
        },
        destroy:function(){
            var result;
            this.element.removeClass('ui-pagination');
            result=Pagination.superclass.destroy.apply(this,arguments);
            return result;
        },
        _setupPageNums:function(){
            this._pageNums=Math.ceil(this.get('totalSize')/this.get('pageSize'));
        },
        /**
         * 更新分页状态，包括高亮当前页，上一页/下一页状态调整
         * @private
         */
        _updateState:function(){
            var activePn=this.get('activePageNumber');
            var elEl=this.element,
                prevEl=$('.ui-pagination-prev',elEl),
                nextEl=$('.ui-pagination-next',elEl),
                numEl=$('.ui-pagination-num',elEl);
            numEl.removeClass('ui-pagination-active');
            prevEl.removeClass('ui-pagination-disabled');
            nextEl.removeClass('ui-pagination-disabled');

            numEl.each(function(){
                var meEl=$(this);
                if(parseInt(meEl.text())==activePn){
                    meEl.addClass('ui-pagination-active');
                    return false;
                }
            });
            if(activePn==1){
                prevEl.addClass('ui-pagination-disabled');
            }
            if(activePn==this._pageNums){
                nextEl.addClass('ui-pagination-disabled');
            }
            //如果只有一页，隐藏上一页和下一页,disable第一页
            if(numEl.length<=1){
                prevEl.hide();
                nextEl.hide();
                numEl.addClass('ui-pagination-disabled');
            }else{
                prevEl.show();
                nextEl.show();
            }
            //如果是极简风格，隐藏页数
            if(this.get('style')=="simple"){
                $('.ui-pagination-num,.ui-pagination-ellipsis',elEl).hide();
            }
        },
        /**
         * 构建html结构
         * @param activePn
         * @private
         */
        _updateHtml:function(activePn){
            var elEl=$(this.element),
                pageNums=this._pageNums,
                visiblePageNums=this.get('visiblePageNums');
            var htmlStr='',
                i= 0,
                dynNums=visiblePageNums- 3, //动态调整的页码==visiblePageNums-1(当前页)-2(第一页和第二页)
                prevNums= 0,
                nextNums= 0,
                refNum=0;   //参考点
            if(pageNums>0){
                if(pageNums<visiblePageNums){
                    for (i = 0; i <pageNums; i++) {
                        htmlStr+='<li class="ui-pagination-item ui-pagination-num">'+(i+1)+'</li>';
                    }
                }else{
                    //保证 prevNums+nextNums==dynNums
                    prevNums=Math.floor(dynNums/2.0);
                    nextNums=Math.ceil(dynNums/2.0);
                    if(activePn>1&&activePn<pageNums){
                        htmlStr='<li class="ui-pagination-item ui-pagination-num">'+activePn+'</li>';
                    }
                    refNum=activePn-prevNums;
                    if(refNum<2){
                        refNum=2;
                    }
                    for(i=activePn-1;i>=refNum;i--){
                        htmlStr='<li class="ui-pagination-item ui-pagination-num">'+i+'</li>'+htmlStr;  //注意向前追加
                    }
                    i++;    //保留最后的页码
                    //添加前省略号
                    if(i>2){
                        htmlStr='<li class="ui-pagination-item ui-pagination-ellipsis">&#8230;</li>'+htmlStr;
                    }
                    refNum=activePn+nextNums;
                    if(refNum>(pageNums-1)){
                        refNum=pageNums-1;
                    }
                    for(i=activePn+1;i<=refNum;i++){
                        htmlStr=htmlStr+'<li class="ui-pagination-item ui-pagination-num">'+i+'</li>';  //注意向后追加
                    }
                    i--;    //保留最后的页码
                    //添加后省略号
                    if(i<(pageNums-1)){
                        htmlStr=htmlStr+'<li class="ui-pagination-item ui-pagination-ellipsis">&#8230;</li>';
                    }
                    //追加第一页和第二页
                    htmlStr='<li class="ui-pagination-item ui-pagination-num ui-pagination-first">1</li>'+htmlStr+'<li class="ui-pagination-item ui-pagination-num ui-pagination-last">'+pageNums+'</li>';
                }
                htmlStr='<li class="ui-pagination-item ui-pagination-prev">上一页</li>'+htmlStr+'<li class="ui-pagination-item ui-pagination-next">下一页</li>';
                elEl.html('<ul class="ui-pagination-list fn-clear fn-right">'+htmlStr+'</ul>');

                this._updateState();
            }else{
                elEl.empty();
            }
        },
        /**
         * 设置分页总数
         * @param totalSize
         */
        setTotalSize:function(totalSize){
            var activePageNumber=this.get('activePageNumber');
            this.set('totalSize',totalSize);
            this._setupPageNums();
            //重新渲染组件并刷新当前页
            this.set('activePageNumber',0);
            this.set('activePageNumber',activePageNumber);
        },
        /**
         * 重置状态
         */
        reset:function(){
            var elEl=$(this.element);
            //设置分页总数为-1
            this.set('totalSize',-1);
            //设置为第一页
            this.set('activePageNumber',1);
            elEl.empty();
        },
        _onRenderActivePageNumber:function(val){
            if(val>0){
                this._updateHtml(val);
            }
        },
        "destroy":function(){
            var result;
            this.element.empty();
            result=Pagination.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports=Pagination;
});