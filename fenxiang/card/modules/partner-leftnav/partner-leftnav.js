/*
 * 代理商左侧导航
 * 
 */
 
define(function(require, exports, module) {
    var util = require('util'),
        navRouter = FS.tpl.navRouter,
        navHtml = require('./partner-leftnav.html'),
        navStyle = require('./partner-leftnav.css');
    // navHtml中的数据
    var tplData = {
        permissions: false
    };
    var leftNav = _.extend({
        // 包含元素
        wrapEl: null,
        // 获取权限
        getPermissions: function() {
            var that = this,
            	contactData = util.getContactData(),
            	currentMember=contactData['u'];
            if(_.some(currentMember.functionPermissions,function(permission){
                return permission.value==41;    //权限41表示具有报数管理员权限
            })){
            	this.trigger('permissions');
            }else{
            	this.trigger('nopermissions');
            }
            /*
            util.api({
                'type': 'get',
                'dataType': "json",
                'url': '',
                'data': {},
                'success': function(rep) {
                    if (rep.success) {
                        that.trigger('permissions');
                        retrun;
                    }
                    that.trigger('nopermissions');
                }
            });
            */
        },
        /*
         * 设置头像
         */
        setPhotoData: function() {
            var contactData = util.getContactData(),
                currentMember = contactData["u"];
            tplData.profileImage = currentMember.profileImage;
            tplData.userName = currentMember.name; 
        },
        /**
         * 渲染
         */
        render: function() {
            this.wrapEl.html(_.template(navHtml)(tplData));
            // 添加当前状态显示
            var hash = location.hash;
            $('.report-left-nav a', this.wrapEl).each(function() {
                var itemHash = $(this).attr('href').split('#')[1];
                if (hash.indexOf(itemHash) != -1) {
                    $(this).addClass('state-active');
                } else {
                    $(this).removeClass('state-active');
                }
            });
        },
        /*
         * 添加有权限才能访问的导航 
         *上报管理 外部人员报表
         *
         */
        init: function($elem) {
            this.wrapEl = $elem;
            this.setPhotoData();
            this.getPermissions();  
        }        
    }, Backbone.Events);

    // 没有权限
    leftNav.on('nopermissions', function() {
        tplData.permissions = false;
        // 需要权限的页面
        var needPermissionsHash = '#app/reportmanage|#app/reportother';
        if (needPermissionsHash.indexOf(location.hash) != -1) {
            navRouter.navigate('#app/reportdata', {
                trigger: true
            });
            return;
        }
        this.render();
    });

    // 有权限
    leftNav.on('permissions', function() {
        tplData.permissions = true;
        this.render();
    });
    module.exports = leftNav;
});