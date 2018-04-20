/**
 * Admin入口逻辑
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var util=require('util'),
        Dialog=require('dialog');
    //预设路由
    util.tplRouterReg('#index');
    util.tplRouterReg('#departmentstaff');
    util.tplRouterReg('#departmentstaff/=/:create-:value');
    util.tplRouterReg('#departmentstaff/=/:filterid-:value');
    util.tplRouterReg('#departmentstaff/=/:enter-:value');

    util.tplRouterReg('#employeemgtformarketing/=/:create-:value');
    util.tplRouterReg('#employeemgtformarketing');
    util.tplRouterReg('#funcpermission');
    util.tplRouterReg('#entinfomgt');
    util.tplRouterReg('#datamanage/smsstatistics');
    util.tplRouterReg('#exmails');
    util.tplRouterReg('#datamanage/feedplanmanages');
//    util.tplRouterReg('#datamanage/feedworkmanages');
    util.tplRouterReg('#datamanage');
    util.tplRouterReg('#datamanage/managesLogs');
    util.tplRouterReg('#datamanage/locationmanages');
    util.tplRouterReg('#datamanage/networkdiskmanage');
    util.tplRouterReg('#datamanage/smsstatisticsdetail/=/:id-:value/:name-:value');
    util.tplRouterReg('#circles/importemployeeseditor');

    /**
     * 修改管理员密码
     * @type {*}
     */
    var ChangePwd=Dialog.extend({
        "attrs": {
            content: '<div class="ui-dialog-title">修改管理员密码</div>'+
                '<div class="ui-dialog-body">'+
                '<div class="field-container">'+
                '<div class="pwd-field-wrapper f-field fn-clear">'+
                    '<div class="ff-label fn-left">当前密码：</div>'+
                    '<div class="ff-value fn-left"><input type="password" class="pwd-field fs-validate-field textfield auto-focus" emptytip="请输入当前密码" inputtip="请输入当前密码" /></div>'+
                '</div>'+
                '<div class="new-pwd-field-wrapper f-field fn-clear">'+
                    '<div class="ff-label fn-left">新密码：</div>'+
                    '<div class="ff-value fn-left"><input type="password" class="new-pwd-field fs-validate-field textfield" emptytip="请输入新密码" inputtip="密码由6-20个半角字符（字母、数字、符号）组成，区分大小写" /></div>'+
                '</div>'+
                '<div class="pwd-field-wrapper f-field fn-clear">'+
                    '<div class="ff-label fn-left">确认密码：</div>'+
                    '<div class="ff-value fn-left"><input type="password" class="confirm-pwd-field fs-validate-field textfield auto-focus" inputtip="请输入确认密码" emptytip="请输入确认密码" /></div>'+
                '</div>'+
                '</div>'+
                '<div class="ui-dialog-bbar fn-clear">'+
                    '<div class="bbar-inner fn-right"><button class="f-sub button-submit">确定</button>&nbsp;&nbsp;<button class="f-cancel button-cancel">取消</button></div>'+
                '</div>'+
                '</div>',
            className:'fs-admin-change-pwd fs-validate',
            width:600,
            data:null,
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function () {
            var result = ChangePwd.superclass.render.apply(this, arguments);
            return result;
        },
        "clear": function () {
            var elEl = this.element,
                pwdEl=$('.pwd-field',elEl),
                newPwdEl=$('.new-pwd-field',elEl),
                confirmPwdEl=$('.confirm-pwd-field',elEl);
            pwdEl.val("");
            newPwdEl.val("");
            confirmPwdEl.val("");
            $('.fs-validate-empty-tip,.fs-validate-input-tip',elEl).hide();
            $('.field-state-empty,.field-state-input',elEl).removeClass('field-state-empty field-state-input');
        },
        "isValid": function () {
            var passed = true;
            var requestData=this.getRequestData();
            if(requestData["oldPassword"].length==0||requestData["newPassword"].length==0){
                return false;
            }
            if(requestData["newPassword"]!=requestData["confirmPassword"]){
                util.alert("两次输入密码不一致，请重新输入");
                return false;
            }
            return passed;
        },
        "getRequestData": function () {
            var requestData = {};
            var elEl = this.element,
                pwdEl=$('.pwd-field',elEl),
                newPwdEl=$('.new-pwd-field',elEl),
                confirmPwdEl=$('.confirm-pwd-field',elEl);

            requestData["oldPassword"]= _.str.trim(pwdEl.val());
            requestData["newPassword"]= _.str.trim(newPwdEl.val());
            requestData["confirmPassword"]= _.str.trim(confirmPwdEl.val());
            return requestData;
        },
        "_submit": function (evt) {
            var that=this;
            var submitEl=$(evt.currentTarget);
            var successCb=this.get('successCb'),
                requestData=this.getRequestData();
            if(this.isValid()){
                util.api({
                    type: 'post',
                    data: requestData,
                    url: '/Management/AdminChangePassword',
                    success: function (responseData) {
                        successCb&&successCb.call(that,responseData,requestData);
                    }
                },{
                    "submitSelector":submitEl
                });
            }
            evt.preventDefault();
        },
        "hide":function(){
            var result = ChangePwd.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "_cancel": function (evt) {
            this.hide();
            evt.preventDefault();
        },
        "destroy":function(){
            var result;
            result = ChangePwd.superclass.destroy.apply(this, arguments);
            return result;
        }
    });

    exports.init = function () {
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var navRouter = tpl.navRouter;
        var loginTpl=$('.admin-login-form-tpl',tplEl).html();
        //获取当前tpl地址
        var currentTplPath,
            locationHref=location.href;
        if(locationHref.indexOf('#')!=-1){
            currentTplPath=locationHref.slice(locationHref.indexOf('#') + 1);
        }else{
            currentTplPath="";
        }
        /**
         * 更新并渲染账户信息
         */
        var updateAccountInfo=function(responseData,requestData){
            var accountEl=$('.account-info'),
                logoEl=$('.logo-img',accountEl),
                userNameEl=$('.user-name',accountEl);
            //设置logo地址
            logoEl.attr('src',FS.API_PATH+'/Authorize/GetLogoImg?type=1&ent='+requestData.enterprise);
            //设置用户名
            userNameEl.html('<span class="enterprise-name">'+responseData.value.value4+'</span>，'+responseData.value.value1);
            accountEl.css('visibility','visible');
            //获取全局数据
            util.api({
                type: 'get',
                url: '/Management/GetGlobalInfo',
                success: function (responseData2) {
                    var dataRoot;
                    if (responseData2.success) {
                        dataRoot=responseData2.value;
                        //设置全局存储
                        FS.setAppStore("globalData", _.extend(dataRoot,{
                            "model":responseData.value.value5,
                            "enterprise":requestData.enterprise,
                            "account":requestData.account
                        }));
                        //设置促销宝的部门与权限页路由
                        if(responseData.value.value5==2){   //2表示为促销宝
                            $('.tpl-departmentstaff-l').text('员工管理').attr('href','#employeemgtformarketing');
                        }
                        //高亮对应的页面导航
                        util.regTplNav($('.tpl-nav-l'),'state-active');
                        //修改管理员密码
                        if(requestData.account=="admin"){
                            $('.hd .change-admin-l-wrapper').show();
                        }
                        //只有fs账号才可以看见企业邮箱
                        if(requestData.enterprise=="fs"||requestData.enterprise=="ausbio"){
                            $('.hd .tpl-exmails-l-wrapper').show();
                        }else{
                            $('.hd .tpl-exmails-l-wrapper').hide();
                        }
                        //跳转到内页
                        if (currentTplPath.length > 0) {
                            navRouter.navigate('', {
                                trigger: true
                            });
                            navRouter.navigate(currentTplPath, {
                                trigger: true
                            });
                        }else{  //hash为空定位到stream页
                            navRouter.navigate('index', {
                                trigger: true
                            });
                        }
                        login.hide();
                    }
                }
            });
        };
        /**
         * 扩展login登录弹框
         * @type {*}
         */
        var Login=Dialog.extend({
            "attrs": {
                itemV: null, //与dialog绑定的item view
                content: loginTpl,
                className:'admin-login-form',
                closeTpl:'',
                width:374,
                successCb: FS.EMPTY_FN, //提交成功后回调
                enableDrag:false  //禁止拖拽
            },
            "events": {
                'click .change-captcha-l,.captcha-img':'_clickChangeCaptcha',
                'click .error-tip .close-l':'_clickCloseErrorTip',
                'click .help-tip .close-l':'_clickCloseHelpTip',
                'click .help-tip-l':'_clickHelpTipLink',
                'focus .textfield':'_focusField',
                'click .f-sub': '_submit',
                'click .f-cancel': '_cancel',
                'keyup .textfield':'_keyupInput'
            },
            "render": function () {
                var result = Login.superclass.render.apply(this, arguments);
                util.placeholder($('.textfield',this.element));
                return result;
            },
            "isValid": function () {
                var passed = true;
                var elEl=this.element,
                    enterpriseEl=$('.enterprise-field',elEl),
                    accountEl=$('.account-field',elEl),
                    pwdEl=$('.pwd-field',elEl),
                    captchaEl=$('.captcha-field',elEl),
                    errorTipEl=$('.error-tip',elEl),
                    errorTipContentEl=$('.error-content',errorTipEl);
                var requestData=this.getRequestData();
                errorTipEl.hide();
                errorTipEl.height(40);
                //清除error标记
                enterpriseEl.data('isError',false);
                accountEl.data('isError',false);
                pwdEl.data('isError',false);
                captchaEl.data('isError',false);

                if(requestData["enterprise"].length==0){
                    errorTipContentEl.html('请输入企业帐号');
                    errorTipEl.css({
                        "top":'20px',
                        "left":'100px'
                    }).show();
                    enterpriseEl.data('isError',true);
                    return false;
                }
                if(requestData["account"].length==0){
                    errorTipContentEl.html('请输入个人帐号');
                    errorTipEl.css({
                        "top":'60px',
                        "left":'100px'
                    }).show();
                    accountEl.data('isError',true);
                    return false;
                }
                if(requestData["password"].length==0){
                    errorTipContentEl.html('请输入密码');
                    errorTipEl.css({
                        "top":'104px',
                        "left":'100px'
                    }).show();
                    pwdEl.data('isError',true);
                    return false;
                }
                if(requestData["imgCode"].length==0&&captchaEl.is(':visible')){
                    errorTipContentEl.html('请输入验证码');
                    errorTipEl.css({
                        "top":'144px',
                        "left":'100px'
                    }).show();
                    captchaEl.data('isError',true);
                    return false;
                }
                return passed;
            },
            "getRequestData": function () {
                var requestData = {};
                var elEl=this.element,
                    enterpriseEl=$('.enterprise-field',elEl),
                    accountEl=$('.account-field',elEl),
                    pwdEl=$('.pwd-field',elEl),
                    captchaEl=$('.captcha-field',elEl);
                requestData["enterprise"]= _.str.trim(enterpriseEl.val());
                requestData["account"]= _.str.trim(accountEl.val());
                requestData["password"]= _.str.trim(pwdEl.val());
                requestData["imgCode"]= _.str.trim(captchaEl.val());
                return requestData;
            },
            "clear": function () {

            },
            /**
             * 更新图形验证码
             */
            "_updateCaptcha":function(){
                var elEl = this.element,
                    captchaFieldWEl=$('.captcha-field-wrapper',elEl),
                    captchaImgEl=$('.captcha-img',elEl);
                var randomCode=Math.ceil(new Date()/1);
                if(captchaFieldWEl.is(':hidden')){
                    captchaFieldWEl.show();
                }
                captchaImgEl.attr('src',FS.API_PATH+'/Authorize/GetCodeImg?'+randomCode);
            },
            "_clickChangeCaptcha":function(evt){
                this._updateCaptcha();
                evt.preventDefault();
            },
            "_clickCloseErrorTip":function(evt){
                this._hideErrorTip();
            },
            "_clickCloseHelpTip":function(evt){
                this._hideHelpTip();
            },
            "_clickHelpTipLink":function(){
                this._showHelpTip();
            },
            "_focusField":function(evt){
                var fieldEl=$(evt.currentTarget);
                if(fieldEl.data('isError')){
                    this._hideErrorTip();
                }
            },
            "_keyupInput":function(evt){
                if(evt.keyCode==13){    //回车提交
                    $('.f-sub',this.element).click();
                }
            },
            "_hideErrorTip":function(){
                var elEl=this.element,
                    errorTipEl=$('.error-tip',elEl);
                errorTipEl.hide();
            },
            "_hideHelpTip":function(){
                var elEl=this.element,
                    helpTipEl=$('.help-tip',elEl);
                helpTipEl.hide();
            },
            "_showHelpTip":function(){
                var elEl=this.element,
                    helpTipEl=$('.help-tip',elEl);
                helpTipEl.show();
            },
            "_submit": function (evt) {
                var that = this;
                var requestData;
                var elEl = this.element,
                    errorTipEl=$('.error-tip',elEl),
                    errorTipContentEl=$('.error-content',errorTipEl),
                    submitEl=$(evt.currentTarget);
                errorTipEl.height(40);
                var requestData=this.getRequestData();
                if (this.isValid()) {
                    util.api({
                        type: 'post',
                        data: requestData,
                        url: '/Authorize/AdminLoginForAllUser',
                        success: function (responseData) {
                            var errorCode,
                                message;
                            if (responseData.success) {
                                updateAccountInfo(responseData,requestData);
                            }else{
                                errorCode=responseData.message;
                                switch (errorCode) {
                                    case "000":
                                        message = "企业帐号错误";
                                        errorTipContentEl.html(message);
                                        errorTipEl.css({
                                            "top":'20px',
                                            "left":'100px'
                                        }).show();
                                        break;
                                    case "001":
                                        message = "企业服务已终止";
                                        errorTipContentEl.html(message);
                                        errorTipEl.css({
                                            "top":'20px',
                                            "left":'100px'
                                        }).show();
                                        break;
                                    case "002":
                                        that._updateCaptcha();  //更新验证码信息
                                        errorTipContentEl.html('验证码输入错误');
                                        errorTipEl.css({
                                            "top":'144px',
                                            "left":'100px'
                                        }).show();
                                        break;
                                    case "003":
                                        message = "手机号输入错误或未绑定";
                                        errorTipContentEl.html(message);
                                        errorTipEl.css({
                                            "top":'60px',
                                            "left":'100px'
                                        }).show();
                                        break;
                                    case "005":
                                        message = "已超过企业可登录的最大人数";
                                        errorTipContentEl.html(message);
                                        errorTipEl.css({
                                            "top":'20px',
                                            "left":'100px'
                                        }).show();
                                        break;
                                    case "004":
                                    default:
                                        message = '<p>管理员密码输入错误</p><ul style="color:#444444;list-style:none;line-height: 1.7em;"><li>1、检查账号是否正确</li><li>2、检查密码大小写是否正确</li></ul>';
                                        errorTipContentEl.html(message);
                                        errorTipEl.css({
                                            "top":'55px',
                                            "left":'100px',
                                            "height":"90px"
                                        }).show();
                                        break;
                                }
                                if($('.captcha-field-wrapper',elEl).is(':visible')){
                                    that._updateCaptcha();  //更新验证码信息
                                }

                            }
                        }
                    }, {
                        "errorAlertModel":1,    //不alert提示业务失败错误
                        "submitSelector": submitEl,
                        "authorizedJump":false  //登录失败不进行跳转，手动控制
                    });
                }
                evt.preventDefault();
            },
            "hide":function(){
                var result = Login.superclass.hide.apply(this, arguments);
                this.clear();
                return result;
            },
            "_cancel": function (evt) {
                this.hide();
                evt.preventDefault();
            },
            /**
             * 设置登录表单数据
             */
            "_setFormData":function(){
                var elEl=this.element,
                    enterpriseEl=$('.enterprise-field',elEl),
                    accountEl=$('.account-field',elEl);
                var urlSearch=location.search.slice(1),
                    searchArr=urlSearch.split('&');
                _.each(searchArr,function(searchPart){
                    var partArr=searchPart.split('='),
                        partKey=partArr[0],
                        partValue=partArr[1];
                    if(partKey=="enterprise"){  //企业号
                        enterpriseEl.val(partValue);
                    }else if(partKey=="account"){
                        accountEl.val(decodeURIComponent(partValue));
                    }
                });

            },
            "show":function(evt){
                var result = Login.superclass.show.apply(this, arguments);
                this._setFormData();
                return result;
            }
        });
        //修改管理员密码实例化
        var changePwd=new ChangePwd({
            "successCb":function(responseData){
                if(responseData.success){
                    this.hide();
                }
            }
        });
        $('.hd .change-pwd-l').click(function(evt){
            changePwd.show();
            evt.preventDefault();
        });
        //实例化登录弹框
        var login=new Login();
        //直接登录
        login.show();

        //阻止导航跳转
        $('.tpl-nav-list').on('click','a.state-active',function(evt){
            var aEl=$(this),
                aHref=aEl.attr('href');
            var currentTplName=util.getCurrentTplName();
            if(aHref.search(currentTplName.split('-').join('/'))!=-1){   //判断点击链接的地址和location指示的是否相同
                evt.preventDefault();
            }
        });

        //退出系统
        $('.logout-l').on('click',function(evt){
            util.api({
                type: 'post',
                url: '/Authorize/LogOff',
                success: function (responseData) {
                    if(responseData.success){
                        location.reload();
                    }
                }
            });
            evt.preventDefault();
        });


        //验证公共处理方式
        $('body').on('focus','.fs-validate .fs-validate-field',function(evt){
            var inputEl=$(evt.currentTarget),
                emptyTipEl=inputEl.next('.fs-validate-empty-tip'),
                inputTipEl=inputEl.next('.fs-validate-input-tip');
            var inputTip=inputEl.attr('inputtip');
            if(inputTip){
                if(inputTipEl.length==0){
                    inputTipEl=$('<span class="fs-validate-input-tip"><span class="tip-content"></span></span>');
                    inputTipEl.insertAfter(inputEl);
                }
                $('.tip-content',inputTipEl).text(inputTip);
                inputTipEl.show();
                inputEl.addClass('field-state-input');
            }
            inputEl.removeClass('field-state-empty');
            emptyTipEl.hide();
        }).on('blur','.fs-validate .fs-validate-field',function(evt){
            var inputEl=$(evt.currentTarget),
                emptyTipEl=inputEl.next('.fs-validate-empty-tip'),
                inputTipEl=inputEl.next('.fs-validate-input-tip');
            var emptyTip=inputEl.attr('emptytip'),
                regStr=inputEl.attr('regstr'),    //支持正则
                allowBlank=inputEl.attr('allowblank'),  //是否允许为空
                reg,
                val= _.str.trim(inputEl.val());

            inputEl.removeClass('field-state-input');
            inputTipEl.hide();

            if(emptyTip){
                if(emptyTipEl.length==0){
                    emptyTipEl=$('<span class="fs-validate-empty-tip fn-clear"><img src="'+FS.BLANK_IMG+'" alt="" class="icon-error fn-left" /><span class="tip-content"></span></span>');
                    emptyTipEl.insertAfter(inputEl);
                }
                if(val.length==0&&allowBlank=="true"){
                    emptyTipEl.hide();
                    return;
                }
                if(regStr){
                    reg=new RegExp(regStr); //转换成正则表达式
                    if(!reg.test(val)){
                        $('.tip-content',emptyTipEl).text(emptyTip);
                        emptyTipEl.show();
                        inputEl.addClass('field-state-empty');
                    }else{
                        emptyTipEl.hide();
                    }
                    return;
                }
                if(val.length==0){
                    $('.tip-content',emptyTipEl).text(emptyTip);
                    emptyTipEl.show();
                    inputEl.addClass('field-state-empty');
                }else{
                    emptyTipEl.hide();
                }
            }

        });
        //label for checkbox or radio的绑定
        var labelIndex=0;   //label增量
        $('body').on('click','.label-for label',function(){
            var labelEl=$(this),
                labelForEl=labelEl.closest('.label-for'),
                elEl=$('[type="checkbox"],[type="radio"]',labelForEl);
            var checkId=elEl.attr('id');
            //如果label没有设置for属性手动模拟checkbox或radio触发
            if(!labelEl.attr('for')){
                if(!checkId){
                    checkId='fs-label-'+labelIndex;
                    labelIndex++;
                }
                elEl.attr('id',checkId);
                labelEl.attr('for',checkId);
            }
        }).on('focus','input,textarea',function(){
            var inputEl=$(this);
            inputEl.addClass('fs-input-focus');
        }).on('blur','input,textarea',function(){
            var inputEl=$(this);
            inputEl.removeClass('fs-input-focus');
        });
        //跳转到内页
         /*if (currentTplPath.length > 0) {
         navRouter.navigate('', {
         trigger: true
         });
         navRouter.navigate(currentTplPath, {
         trigger: true
         });
         }else{  //hash为空定位到stream页
         navRouter.navigate('index', {
         trigger: true
         });
         }*/
    };
});