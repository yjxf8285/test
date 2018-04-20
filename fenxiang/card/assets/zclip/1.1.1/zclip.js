define(function(require, exports, module) {
    var zclip = require('zclip_core');
    
    var FS= window.FS;

    /**
     * Zclip ���캯��
     */     
    function Zclip(element, config) {
    
        this.$el = $(element);
        
        this.config = $.extend({
            path: FS.ASSETS_PATH + '/zclip/1.1.1/ZeroClipboard.swf',
            copy: '',
            beforeCopy: function() {},
            afterCopy: function() {}
        }, config);
        
        if (this.$el.length > 0) {
            this.init();
        }
    }
    
    /**
     *  ԭ�ͷ���
     */
    Zclip.prototype = {
        constructor: Zclip,
        init: function() {
            this.$el.zclip(this.config);
        }
    };
    
    module.exports = Zclip;
    
});