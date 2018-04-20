/**
 * 扩展Select
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var SelectCore=require('select_core'),
        Widget=require('widget');
    var Select=SelectCore.extend({
        attrs:{
            "autoWidth":true
        },
        initAttrs: function(config, dataAttrsConfig) {
            SelectCore.superclass.initAttrs.call(this, config, dataAttrsConfig);
            var trigger = this.get("trigger");
            if (trigger[0].tagName.toLowerCase() == "select") {
                // 初始化 name
                // 如果 select 的 name 存在则覆盖 name 属性
                var selectName = trigger.attr("name");
                if (selectName) {
                    this.set("name", selectName);
                }
                // 替换之前把 select 保存起来
                this.set("selectSource", trigger);
                // 替换 trigger
                var triggerTemplate = '<a href="#" class="' + this.get("classPrefix") + '-trigger"></a>';
                var newTrigger = $(triggerTemplate);
                this.set("trigger", newTrigger);
                trigger.after(newTrigger).hide();
                // trigger 如果为 select 则根据 select 的结构生成
                this.model = convertSelect(trigger[0], this.get("classPrefix"));
            } else {
                // 如果 name 存在则创建隐藏域
                var selectName = this.get("name");
                if (selectName) {
                    var input = $("input[name=" + selectName + "]").eq(0);
                    if (!input[0]) {
                        input = $('<input type="hidden" id="select-' + selectName + '" name="' + selectName + '" />').insertBefore(trigger);
                    }
                    this.set("selectSource", input);
                }
                // trigger 如果为其他 DOM，则由用户提供 model
                this.model = completeModel(this.model, this.get("classPrefix"));
            }
        },
        render: function() {
            var autoWidth=this.get('autoWidth');
            SelectCore.superclass.render.call(this);
            if(autoWidth){
                this._setTriggerWidth();
            }
            return this;
        },
        // set 后的回调
        // ------------
        _onRenderSelectedIndex: function(index) {
            if (index == -1) return;
            var selected = this.options.eq(index), currentItem = this.currentItem, value = selected.attr("data-value");
            // 如果两个 DOM 相同则不再处理
            if (currentItem && selected[0] == currentItem[0]) {
                return;
            }
            // 设置原来的表单项
            var source = this.get("selectSource");
            source && (source[0].value = value);
            // 处理之前选中的元素
            if (currentItem) {
                currentItem.attr("data-selected", "false").removeClass(this.get("classPrefix") + "-selected");
            }
            // 处理当前选中的元素
            selected.attr("data-selected", "true").addClass(this.get("classPrefix") + "-selected");
            this.set("value", value);
            // 填入选中内容，位置先找 "data-role"="trigger-content"，再找 trigger
            var trigger = this.get("trigger");
            var triggerContent = trigger.find("[data-role=trigger-content]");
            if (triggerContent.length) {
                triggerContent.html(selected.html());
            } else {
                if(trigger.is(':text,textarea,select')){
                    trigger.val(selected.text());
                }else{
                    trigger.html(selected.html());
                }
            }
            this.currentItem = selected;
        }
    });

    // 补全 model 对象
    function completeModel(model, classPrefix) {
        var i, j, l, ll, newModel = [], selectIndexArray = [];
        for (i = 0, l = model.length; i < l; i++) {
            var o = model[i];
            if (o.selected) {
                o.selected = o.defaultSelected = "true";
                selectIndexArray.push(i);
            } else {
                o.selected = o.defaultSelected = "false";
            }
            newModel.push(o);
        }
        if (selectIndexArray.length > 0) {
            // 如果有多个 selected 则选中最后一个
            selectIndexArray.pop();
            for (j = 0, ll = selectIndexArray.length; j < ll; j++) {
                newModel[j].selected = "false";
            }
        } else {
            //取消默认选择第一项这么二的想法，如果想选中第一项，手动设置
            
            //当所有都没有设置 selected 则默认设置第一个
            //newModel[0].selected = "true";
        }
        return {
            select: newModel,
            classPrefix: classPrefix
        };
    }

    tplEvent.on('switch', function (tplName, tplSelector) {
        //用户切换行为会隐藏所有预览组件
        $('.ui-select').each(function(){
            Widget.query(this).hide();
        });
    });
    module.exports=Select;
});