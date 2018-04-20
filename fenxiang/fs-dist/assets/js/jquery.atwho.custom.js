(function ($) {
    var DEFAULT_TPL = "<li data-value='${name}'>${name}</li>";
    $.fn.atwho.View.prototype.create_view = function () {
        var $menu, tpl,
          _this = this;
        var emptyTip;
        if (this.exist()) {
            return;
        }
        emptyTip="<div class='tip'>轻敲空格完成输入</div>";
        tpl = "<div id='" + this.id + "' class='at-view'>"+emptyTip+"<ul id='" + this.id + "-ul'></ul></div>";
        $("body").append(tpl);
        this.$el = $("#" + this.id);
        $menu = this.$el.find('ul');
        return $menu.on('mouseenter.view', 'li', function (e) {
            $menu.find('.cur').removeClass('cur');
            return $(e.currentTarget).addClass('cur');
        }).on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            return _this.$el.data("_view").choose();
        });
    };
    $.fn.atwho.View.prototype.render = function (list) {
        var $ul, tpl,
          _this = this;
        if (!$.isArray(list)) {
            return false;
        }
        //if (list.length <= 0) {
        //    this.hide();
        //    return true;
        //}
        this.clear();
        this.$el.data("_view", this);
        $ul = this.$el.find('ul');
        tpl = this.controller.get_opt('tpl', DEFAULT_TPL);
        $.each(list, function (i, item) {
            var $li, li;
            li = _this.controller.callbacks("tpl_eval").call(_this.controller, tpl, item);
            $li = $(_this.controller.callbacks("highlighter").call(_this.controller, li, _this.controller.query.text));
            $li.data("info", item);
            return $ul.append($li);
        });
        var emptyTipTpl=this.controller.get_opt('emptyTipTpl', '轻敲空格完成输入');
        var withEmptyTip=this.controller.get_opt('withEmptyTip', true);
        this.$el.find('.tip').html(emptyTipTpl);
        if (list.length <= 0) {
            if(withEmptyTip){
                this.$el.find('.tip').show();
            }else{
                this.hide();
            }
        } else {
            this.show();
            this.$el.find('.tip').hide();
        }
        return $ul.find("li:eq(0)").addClass("cur");
    };
}(jQuery));