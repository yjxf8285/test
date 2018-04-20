/**
 * 扩展aralejs Tabs，可手动添加，删除Tab item
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var TabsCore=require('tabs_core');
    var Tabs=TabsCore.extend({
        "attrs":{
            "withTabEffect":true,
            "triggerBgTop":0,   //手动设置triggerBg的top，如果不设置，默认值是导航top-2
            "triggerBgLeft":0,  //手动设置triggerBg的left，如果不设置，默认值是导航left
            "triggerBgCls":""   //triggerBg附加cls
        },
        setup: function() {
            var result;
            this._setupTabEffect();
            result=Tabs.superclass.setup.apply(this,arguments);
            return result;
        },
        render:function(){
            var result=Tabs.superclass.render.apply(this,arguments);
            //this._setupTabEffect();
            return result;
        },
        _setupTabEffect:function(){
            var that=this;
            var withTabEffect=this.get("withTabEffect"),
                triggerParentEl=this.get('triggers').parent(),
                effectEl;
            if(withTabEffect){
                effectEl=$('<div class="ui-tab-trigger-bg"></div>');
                triggerParentEl.wrap('<div class="'+this.get('triggerBgCls')+' ui-tab-trigger-wrapper"></div>');
                effectEl.insertAfter(triggerParentEl);
                this._adjustTriggerBg();
                /*this.on('switched',function(){
                    that._adjustTriggerBg();
                    console.info(1);
                });*/
            }
        },
        /**
         * 调整trigger shadow的尺寸
         * @private
         */
        _adjustTriggerBg:function(){
            var activeIndex=this.get('activeIndex'),
                curTriggerEl=this.get('triggers').eq(activeIndex),
                triggerBgEl=curTriggerEl.closest('.ui-tab-trigger-wrapper').find('.ui-tab-trigger-bg'),
                pos=curTriggerEl.position();
            var triggerBgTop=this.get('triggerBgTop'),
                triggerBgLeft=this.get('triggerBgLeft');
            triggerBgEl.width(curTriggerEl.outerWidth());
            triggerBgEl.css({
                "left":pos.left+triggerBgLeft,
                "top":triggerBgTop?triggerBgTop:(pos.top-2) //2px是修正参数
            });
        },
        /**
         * 提供外部调用
         */
        adjustTriggerBg:function(){
            this._adjustTriggerBg();
        },
        "addTabs":function(items){
            var that=this,
                len=this.triggers.length;
            items=[].concat(items);
            _.each(items,function(item,i){
                var triggerEl=$(item.trigger),
                    panelEl=$(item.panel);
                triggerEl.addClass(this.CONST.TRIGGER_CLASS);
                triggerEl.data("value", len+i);
                that._bindTriggersFormArgs(triggerEl);
                
                panelEl.addClass(that.CONST.PANEL_CLASS);
                //重新设置triggers和panels
                that.set("triggers",that.get("triggers").add(triggerEl));
                that.set("panels",that.get("panels").add(panelEl));
            });
        },
        _bindTriggers: function() {
            var that = this;
            var triggerBgTop=this.get('triggerBgTop'),
                triggerBgLeft=this.get('triggerBgLeft');
            var withTabEffect=this.get("withTabEffect"),
                triggerBgEl;

            if (this.get('triggerType') === 'click') {
                this.triggers.click(focus);
            }
            // hover
            else {
                this.triggers.hover(focus, leave);
            }

            function focus(ev) {
                var toEl=$(this),
                    pos=toEl.position();
                if(withTabEffect){
                    triggerBgEl=that.get('triggers').closest('.ui-tab-trigger-wrapper').find('.ui-tab-trigger-bg');
                    triggerBgEl.stop(true,true).animate({
                        "left":pos.left+triggerBgLeft,
                        "top":triggerBgTop?triggerBgTop:(pos.top-2) //2px是修正参数
                    },300,'swing',function(){
                        that._onFocusTrigger(ev.type, toEl.data('value'));
                        that._adjustTriggerBg();
                    });
                }else{
                    that._onFocusTrigger(ev.type, toEl.data('value'));
                }

            }

            function leave() {
                clearTimeout(that._switchTimer);
            }
        },
        _switchTrigger: function(toIndex, fromIndex) {
            var result=Tabs.superclass._switchTrigger.apply(this,arguments);
            var triggerBgEl=this.get('triggers').closest('.ui-tab-trigger-wrapper').find('.ui-tab-trigger-bg'),
                curTriggerEl=this.get('triggers').eq(this.get('activeIndex')),
                pos=curTriggerEl.position();
            var triggerBgTop=this.get('triggerBgTop'),
                triggerBgLeft=this.get('triggerBgLeft');
            triggerBgEl.css({
                "left":pos.left+triggerBgLeft,
                "top":triggerBgTop?triggerBgTop:(pos.top-2) //2px是修正参数
            });
            return result;
        },
        "_bindTriggersFormArgs": function(triggerSelector) {
            var that = this;
            var triggerEl=$(triggerSelector);
            if (this.get("triggerType") === "click") {
                triggerEl.click(focus);
            } else {
                triggerEl.hover(focus, leave);
            }
            function focus(ev) {
                that._onFocusTrigger(ev.type, $(this).data("value"));
            }
            function leave() {
                clearTimeout(that._switchTimer);
            }
        }
    });
    module.exports=Tabs;
});
