define(function(require, exports, module) {
    /*
     * 网页中实现右键功能菜单
     * menuObj参数传进来为了应对不同的地方显示不同的菜单
     *
     */

    $.fn.showRMenu = function(menuObj) {
        var _self = this;
        var mH = $(menuObj).height(),
            mW = $(menuObj).width();
        var dH = $(document).height(),
            dW = $(document).width() - 15;
        _self.each(function() {
            this.oncontextmenu = function(event) {
                var site_x, site_y;
                if (!document.all) { //兼容获取鼠标当前位置
                    site_x = event.pageX;
                    site_y = event.pageY;
                } else {
                    site_x = document.documentElement.scrollLeft + window.event.clientX;
                    site_y = document.documentElement.scrollTop + window.event.clientY;
                }
                //定位右键菜单坐标值，与页面整体宽高做比较，以定位具体位置
                var h = site_y + mH,
                    w = site_x + mW;
                site_y = (dH < h) ? (site_y - mH) : site_y;
                site_x = (dW < w) ? (site_x - mW - 15) : site_x;
               
                //css赋值，并显示出来
                $(menuObj).css({
                    'top': (site_y),
                    'left': (site_x + 10)
                }).show();

                if (document.all) {
                    window.event.returnValue = false;
                } // for IE 中断正常网页右键菜单行为
                else {
                    event.preventDefault();
                }
            };
            // $(menuObj).mouseleave(function() {//鼠标离开菜单区域时隐藏
            //     $(this).hide();
            // });
            $(menuObj).find('ul').prev('a').addClass('a_noF').click(function() { //带有子菜单的a点击返回无效
                return false;
            });
            $('a:not(.a_noF)', menuObj).click(function() { //点击a链接执行时，隐藏菜单
                
                $(menuObj).hide();
                return false;
            });
        });
        return _self;
    };
    module.exports = $.fn.showRMenu;
});