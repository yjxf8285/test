/**
 * 扩展Dialog
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var DialogCore=require('dialog_core'),
        Dnd=require('dnd'),
        mask=require('mask');
    var EVENT_NS = ".dialog";

    var visibleDiaStore=[];
    var dragProxyEl;
    $(function(){
        dragProxyEl=$('<div class="ui-dialog-drag-proxy fn-hide-abs"></div>');
        dragProxyEl.appendTo('body');
    });
    var Dialog=DialogCore.extend({
        attrs: {
            "enableDrag":true,    //是否开启拖拽，默认是true，开启
            "visibleWithAnimate":false,   //弹框的显隐默认加入fadeOut和fadeIn动画,默认不带动画
            "hideWithEsc":false //是否通过按esc键退出弹框，默认不启用
        },
        _onRenderVisible: function(val) {
            var visibleWithAnimate=this.get('visibleWithAnimate');
            if(visibleWithAnimate){
                if(val){
                    this.element.fadeIn(200);
                }else{
                    this.element.fadeOut(200);
                }
            }else{
                this.element[val ? "show" : "hide"]();
            }
        },
        _onRenderZIndex: function(val) {
            this.get('hasMask')&&mask.set("zIndex", parseInt(val, 10) - 1);
            return DialogCore.superclass._onRenderZIndex.call(this, val);
        },
        // 覆盖_setupMask方法，去掉after('hide')绑定，在hide方法里已提供处理机制
        _setupMask: function() {
            this.before("show", function() {
                this.get("hasMask") && mask.show();
            });
        },
        // 绑定键盘事件，ESC关闭窗口
        _setupKeyEvents: function() {
            var that = this;
            var hideWithEsc=this.get('hideWithEsc');
            if(hideWithEsc){
                $(document).on("keyup." + EVENT_NS + this.cid, function(e) {
                    if (e.keyCode === 27) {
                        that.get("visible") && that.hide();
                    }
                });
            }
        },
        //覆盖_setPosition方法，对标记为auto-focus class的内容dom自动focus
        /*"_setPosition":function(){
            var result=Dialog.superclass._setPosition.apply(this,arguments);
            var autoFocusEl=$('.auto-focus',this.element);
            if(autoFocusEl.length>0){
                autoFocusEl.get(0).focus();
            }
            return result;
        },*/
        // 绑定元素聚焦状态
        _setupFocus: function() {
            this.after("show", function() {
                var autoFocusEl=$('.auto-focus',this.element); //自动聚焦具有auto-focus class的dom
                if(autoFocusEl.length>0){
                    autoFocusEl.get(0).focus();
                }else{
                    this.element.focus();
                }

            });
            this.after("hide", function() {
                // 关于网页中浮层消失后的焦点处理
                // http://www.qt06.com/post/280/
                this.activeTrigger && this.activeTrigger.focus();
            });
        },
        render: function() {
            var result;
            result=Dialog.superclass.render.apply(this,arguments);
            return result;
        },
        //动态修正mask全局遮罩zIndex值
        show:function(){
        	var result,
                dragEl;
            var enableDrag=this.get('enableDrag');
            var elEl=this.element;
        	result=Dialog.superclass.show.apply(this,arguments);
        	visibleDiaStore.push(this);
        	this._setMaskStatus();

            dragEl=$('.ui-dialog-title',this.element);
            if(!this.dnd&&dragEl.length>0&&enableDrag){      //只有存在title的弹框才可以拖拽
                this.dnd = new Dnd(elEl,{
                    "drag": dragEl,
                    "proxy":dragProxyEl,
                    "containment":'body'
                });   //设置弹框可拖拽
                this.dnd.on('dragstart',function(dataTransfer, dragging){
                    dragging.width(elEl.width());
                    dragging.height(elEl.height());
                    //模拟点击事件触发
                    dragEl.click(); //保证冒泡到document层触发其他reset
                });
            }
            //ie10 placeholder fix
            $('textarea',this.element).each(function(){
                var meEl=$(this);
                var val= _.str.trim(meEl.val()),
                    placeHolder=meEl.attr('placeholder');
                if(val==placeHolder){
                    meEl.val("").trigger('autosize.resize');
                }
            });
        	return result;
        },
        hide:function(){
        	var result;
        	var that=this;
        	result=Dialog.superclass.hide.apply(this,arguments);
        	visibleDiaStore=_.filter(visibleDiaStore,function(v){
        		return v!==that;
        	});
        	this._setMaskStatus();
        	return result;
        },
        _setMaskStatus:function(){
        	var zIndex=-1;
        	_.each(visibleDiaStore,function(dialog){
        		if(dialog.get('hasMask')){
        			if(dialog.get('zIndex')>zIndex){
        				zIndex=dialog.get('zIndex');
        			}
        		}
        	});
        	if(zIndex!=-1){
        		mask.set('zIndex',zIndex-1)
                mask.show();
        	}else{
        		mask.hide();
        	}
        },
        destroy: function() {
            if (this.get("trigger")) {
                this.get("trigger").off("click" + EVENT_NS + this.cid);
            }
            $(document).off("keyup." + EVENT_NS + this.cid);
            this.dnd&&this.dnd.destroy(); //拖拽组件销毁
            this.element&&this.element.remove();
            this._setMaskStatus();	//更新mask状态
            clearInterval(this._interval);
            return DialogCore.superclass.destroy.call(this);
        }
    });
    /**
     * 隐藏所有弹框，静态方法
     */
    Dialog.hideAll=function(elSelector){
        if(elSelector){
            _.each(visibleDiaStore,function(dialogItem){
                if(dialogItem.element.is(elSelector)){
                    dialogItem.hide();
                }
            });
        }else{  //留空表示隐藏全部弹框
            _.each(visibleDiaStore,function(dialogItem){
                dialogItem.hide();
            });
        }
    };
    module.exports=Dialog;
});