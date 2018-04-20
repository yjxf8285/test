/**
 * @description 创建外部上报人弹框 
 * @return {Object} 
 * @example 
 *      seajs.use('modules/app-reportother-dialog/app-reportother-dialog', function(module) {
            var dialog  = new module.Dialog;
            dialog.show();
        });  // 异步调用
 * 
 */
define(function(require, exports, module) {
    
    var win = window,
        doc = win.document,
        util = require('util'),
        Dialog = require("dialog"),
        htmlTpl = require('./app-reportother-dialog.html') ;
    
    require('./app-reportother-dialog.css');
    

    /**
     * @Constructor
     * 构造函数
     */
    ReportotherDialog = Dialog.extend({

        attrs: {
            className: 'add-reportother-dialog',
            width: 490,
            title: '新增上报人',
            showauthorize: false
        },
        
        lastData: {},
        
        // 模板数据格式
        templateData: {
            UserId: '',
            Name: '',
            Mobile: '',
            WeiXinId: '',
            Email: '',
            Company: '',
            Position: ''
        },
        
        /**
         * 获取模板
         */
        _getCon: _.template($(htmlTpl).filter('.m-reportother-tpl').html()),

    
        /**
         * @desc绑定事件
         */    
        events: {
            'click .j-btn-enter':  '_enterHandle',
            'click .j-btn-cancel': '_cancelHandle'
        },
        
        
        /**
         * @desc取消按钮监听事件
         *
         */
        _cancelHandle: function() {
            var that = this;
            that.trigger('cancel');
            that.hide();
        },
        
        
        /**
         * @desc确定按钮监听事件
         *
         */
        _enterHandle: function(evt) {
            var that = this;
            
            if (that.isValid()) {            
                that.trigger('enter', {
                    'btnEl': $(evt.target), // 按钮
                    'data': that.lastData
                });
            }
        },
        
        
        /**
         * 验证必填字段
         * 记录填写的值
         */
        isValid: function() {
            
            var that = this,
                $el = this.element,
                num = 0;
            
            // 验证规则
            var spaceReg = /^\S{1,}$/,
                emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                mobileReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
            
            // 表单元素
            var $name, $mobile, $weixin, $email, $company, $position;
            var nameVal, mobileVal, weixinVal, emailVal, companyVal, positionVal;
            

            // 验证姓名
            $name = $('#name', $el);
            nameVal = $name.val();
            if (!spaceReg.test(nameVal)) {
            
                util.showInputError($name);
                return false;
            }
            
            
            // 验证手机
            $mobile = $('#mobile', $el);
            mobileVal = $mobile.val();
            if (spaceReg.test(mobileVal)) {
            
                if (!mobileReg.test(mobileVal)) {
                
                    util.showInputError($mobile);
                    return false;
                }
            } else {
            	util.showInputError($mobile);
            	return false;
            }

            
            // 验证微信号
            $weixin = $('#weixin', $el);
            weixinVal = $weixin.val();
            if (!spaceReg.test(weixinVal)) {
            	util.showInputError($weixin);
            	return false;
            }

            
            // 验证email
            $email = $('#email', $el);
            emailVal = $email.val();
            if (spaceReg.test(emailVal)) {
            
                if (!emailReg.test(emailVal)) {
                
                    util.showInputError($email);
                    return false;
                }
            } else {
            	util.showInputError($email);
                return false;
            }
            
            //验证公司
            $company = $('#company', $el);
            companyVal = $company.val();
            if (!spaceReg.test(companyVal)) {
            	util.showInputError($company);
            	return false;
            }
            
            //验证职位
            $position = $('#position', $el);
            positionVal = $position.val();
            if (!spaceReg.test(positionVal)) {
            	util.showInputError($position);
            	return false;
            }
            
            that.lastData.name = nameVal;
            that.lastData.mobile = mobileVal;
            that.lastData.weixinId = weixinVal;
            that.lastData.email = emailVal;
            that.lastData.company = $('#company', $el).val();
            that.lastData.position = $('#position', $el).val();
            that.lastData.userId = $('#userid', $el).val();

            if (that.get('showauthorize')) {
                var checkedItem = [];
                $('input[type=checkbox]', $el).each(function(){
                    if (this.checked) {
                        checkedItem.push(this.value);
                    }
                });
                that.lastData.agentTypes = checkedItem.join(',');
            }
            
            return true;
        },        
        
        
        /**
         * 清除表单的值
         */
        clear: function() {
        
            this.set('content', '');
        },
        
        
        hide: function() {
        
            this.clear();
            return ReportotherDialog.superclass.hide.call(this);
        },
        
        /**
         * @desc显示
         * @param {Object} 模板显示用到的数据
         */        
        show: function (data) { 
            var that = this,
                $html = $(this._getCon(data || that.templateData));
            
            // 设置标题
            $html.find('h3').html(this.get('title'));
            if (this.get('showauthorize')) {
                $html.find('.showauthorize').show();
            }
            
            // 设置数据
            this.set('content', $html);
            return ReportotherDialog.superclass.show.call(this);
        },
        
        
        /**
         * @desc销毁对象
         */
        destroy: function() {
            var result = ReportotherDialog.superclass.destroy.apply(this, arguments);
            return result;        
        }
    });
    
    
    // 异步调用接口
    module.exports = {
        dialog: ReportotherDialog
    };
});