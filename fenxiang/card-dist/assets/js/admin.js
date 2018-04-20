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
    util.tplRouterReg('#datamanage/resetcrm');
    util.tplRouterReg('#datamanage/smsstatisticsdetail/=/:id-:value/:name-:value');
    util.tplRouterReg('#circles/importemployeeseditor');
    util.tplRouterReg('#kingsoft');

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
                        //只有fs帐号才可以看见企业邮箱
                        if(requestData.enterprise=="fs"||requestData.enterprise=="ausbio"||requestData.enterprise=="villawl"){
                            $('.hd .tpl-exmails-l-wrapper').show();
                        }else{
                            $('.hd .tpl-exmails-l-wrapper').hide();
                        }
                        //是否允许进入
                        getIsAgreementSigned(function () {
                            //跳转到内页
                            if (currentTplPath.length > 0) {
                                navRouter.navigate('', {
                                    trigger: true
                                });
                                navRouter.navigate(currentTplPath, {
                                    trigger: true
                                });
                            } else {  //hash为空定位到stream页
                                navRouter.navigate('index', {
                                    trigger: true
                                });
                            }
                            login.hide();
                        });
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
                                        message = '<p>管理员密码输入错误</p><ul style="color:#444444;list-style:none;line-height: 1.7em;"><li>1、检查帐号是否正确</li><li>2、检查密码大小写是否正确</li></ul>';
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
        if(currentTplPath == 'kingsoft') {
        	//跳转到内页
            if (currentTplPath.length > 0) {
                navRouter.navigate('', {
                    trigger: true
                });
                navRouter.navigate(currentTplPath, {
                    trigger: true
                });
            }
        } else {
        //实例化登录弹框
        var login=new Login();
        //直接登录
        login.show();
        }

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

        /**
         * 管理员第一次进入时的逻辑(弹出用户协议，同意后才能继续)
         * @author liuxf
         */
        var agreementEl = $('.admin-agreement-tpl');
        var agreementMaskEl = $('.admin-agreement-mask');
        var agreementStr = ' <!-- 管理员协议遮罩 --> <div class="admin-agreement-mask"></div> <!-- 管理员协议模板 start --> <div class="admin-agreement-tpl"><div class="admin-agreement-background"> <div class="content"> <div class="tit"> 纷享销客”平台用户服务协议 </div> <p class="t">重要提示：</p> <p> 北京易动纷享科技有限责任公司（以下简称“纷享科技”）在此特别提醒用户：您务必仔细阅读本用户服务协议中的各个条款，本协议为您使用平台服务时所应遵守的各项规定，在本协议中明确了您可以和不可以利用平台服务所进行的各项行动，作为企业用户，您应同意本协议中的各个条款，方可享受服务，并应督促您企业所属员工在接受纷享科技提供的服务时遵守本服务协议之规定。</p> <p>“纷享销客”平台（简称“纷享销客”）系北京易动纷享科技有限责任公司开发、研制的为企业提供【企业协同及营销管理应用】服务的网络技术服务平台。</p> <p class="t">1、知识产权</p> <p>1)纷享销客的应用程序、源代码、LOGO、界面设计、应用程序编程接口（API）所关联的所有知识产权均归属纷享科技。</p> <p class="t">2、数据归属权</p> <p>1用户在纷享销客创建的数据归属用户企业所有，在服务期内企业用户有权进行任何形 式的处置，包括从平台中复制，导出和删除。</p> <p class="t">3、用户使用约定</p> <p> 1)用户不得进行任何侵犯本网络服务平台或其要素作品的知识产权的行为，或者进行其他的有损于纷享科技或其他用户合法权益的行为。如用户存在此种行为，纷享科技将采取技术措施防止用户从事下述行为，包括但不限于：</p> <p> a)删除或修改本网络服务平台上的版权信息，或者伪造ICP/IP地址或者数据包的名称</p> <p> b)进行编译、反编译、反向工程或者以其他方式破解本网络服务平台的行为</p> <p> c)进行任何破坏本网络服务平台使用公平性或者其他影响其正常使用秩序的行为，如利用BUG（又叫“漏洞”或者“缺陷”）来获得不正当的非法利益；</p> <p> d)利用技术非法侵入、破坏本网络服务平台之服务器系统，或者修改、增加、删除、窃取、截留、替换本网络服务平台之客户端或服务器系统中的数据，或者非法挤占本网络服务平台之服务器空间，或者实施其他的使之超负荷运行的行为；</p> <p> e)发布任何诈骗或虚假信息；</p> <p> f)发表、转发、传播含有谩骂、诅咒、诋毁、攻击、诽谤纷享科技和/或第三方内容的，或者含有封建迷信、淫秽、色情、下流、恐怖、暴力、凶杀、赌博、反动、煽动民族仇恨、危害祖国统一、颠覆国家政权等让人反感、厌恶的内容的非法言论；</p> <p> g)利用本网络服务平台故意传播恶意程序或计算机病毒，或者利用本网络服务平台发表、转发、传播侵犯第三方知识产权、肖像权、姓名权、名誉权、隐私或其他合法权益的文字、图片、照片、程序、视频和/或动画等资料；</p> <p> h)通过纷享销客进行垃圾信息发送（本协议所指垃圾短信定义为用户使用本平台功能对陌生客户及不同意接收信息的客户、人员进行短信发送等行为） </p> <p class="t">4、隐私政策</p> <p> 1)纷享科技负有保护与用户有关的资料、数据、作品或其他资料的义务，但因下列原因而披露给第三方的除外：</p> <p>a)基于国家法律法规的规定而对外披露；</p> <p>b)应国家司法机关及其他有关机关基于法定程序的要求而披露；</p> <p> c)为保护纷享科技、合作单位或您的合法权益而披露；</p> <p>d)在紧急情况，为保护其他用户及第三人人身安全而披露； e)经用户本人同意或应用户的要求而披露。</p> <p> 2)纷享销客保留使用汇总统计性信息的权利，并且完全通过匿名统计方式，并且不是针对特定用户分析。 </p> <p class="t">5、使用限制</p> <p>1)用户如有本《协议》第3条第1款所列行为之一的，纷享科技有权采取下列措施当中的一种或几种并无需通知用户：</p> <p>a)断开用户当前使用的计算机与本网络服务平台服务器之间的网络连接；</p> <p>b)暂时禁止用户凭借当前使用的网络服务平台服务帐号享有服务；</p> <p>c)禁止用户使用本网络服务平台当中某一要求付费的功能，直至清偿所欠费用并为继续使用上述付费功能而预先支付相应的费用之日止；</p> <p>d)采取上列措施之外的其他的措施。</p> <p class="t">6、其他约定</p> <p>1)纷享科技有权对本合约的条款进行修订并在修订生效日前一个工作日将更新公开公布在纷享科技网站【www.fxiaoke.com】。</p> <p>2)本《协议》各条款是可分的，所约定的任何条款如果部分或者全部无效，不影响该条款其他部分及本协议其他条款的法律效力。</p> <p>3)本《协议》各条款的标题只是为了方便用户阅读而起到提示、醒目的作用，对本《协议》的解释及适用没有任何指引作用。</p> <p>4)纷享科技基于本协议及其补充协议的有效的弃权必须是书面的，并且该弃权不能产生连带的相同或者类似的弃权。</p> <p>5)用户与纷享科技因本协议或其补充协议所涉及的有关事宜发生争议或者纠纷，双方可以友好协商解决；协商不成的，任何一方均可以将其提交原告方所在地有管辖权的人民法院诉讼解决。</p> <p>6)本协议及其补充协议签订地为北京市，均受中华人民共和国法律、法规管辖。</p> <p>7)纷享科技将会将本协议以新闻的形式于【www.fxiaoke.com】发布。</p> <p>8)用户给客户发送垃圾短信，经电信运营商或其他监督部门查实的，纷享科技将视情况给予违规用户年服务费1倍至5倍标准的违约罚款。</p> <p>用户发送垃圾短信给纷享销客造成的运维损失，如通信平台停用，行政主管部门对平台的行政处罚或其他正常用户因平台停用申请的损失赔偿等，由违规用户承担。 《“纷享销客”平台用户服务协议》所述内容已经全部浏览及阅读，本公司承诺按照北京易动纷享科技有限责任公司公开发布的《“纷享销客”平台用户服务协议》规定的内容使用“纷享销客”平台提供的服务。</p> </div> <div class="admin-agreement-fn-warp fn-clear"> <div class="l"><span class="label-for"><input type="checkbox" class="is-agreed" name="is_agreed"><label>我已经认真阅读，并同意（签署）</label></span> </div> <div class="r"> <button class="admin-agreement-submit disabled">同意</button> </div> </div></div> </div> <!-- 管理员协议模板 end -->';
        if (!agreementEl[0]) {
            $('body').append(agreementStr);
        }
        var getIsAgreementSigned = function (callback) {
            var agreementEl = $('.admin-agreement-tpl');
            var agreementMaskEl = $('.admin-agreement-mask');
            util.api({
                "url": '/Management/GetIsAgreementSigned', //是否签署过协议
                "type": 'get',
                "dataType": 'json',
                "success": function (responseData) {
                    if (responseData.success) {
                        if (responseData.value == 0) {//0代表没有签署过协议
                            agreementEl.show();
                            agreementMaskEl.show();
                        } else {
                            callback();
                        }
                    }
                }
            });
            agreementEl.on('click', '.admin-agreement-submit', function (e) {//提交
                var isAgreedEl = agreementEl.find('.is-agreed');
                if (isAgreedEl.is(':checked')) {
                    util.api({
                        "url": '/Management/SetIsAgreementSigned', //是否签署过协议
                        "type": 'post',
                        "dataType": 'json',
                        "success": function (responseData) {
                            if (responseData.success) {
                                callback();
                                agreementEl.hide();
                                agreementMaskEl.hide();
                            }
                        }
                    });
                }
            }).on('click','.label-for',function(){//判断按钮置灰逻辑
                var isAgreedEl = agreementEl.find('.is-agreed');
                var btnEl = agreementEl.find('.admin-agreement-submit');

                if (isAgreedEl.is(':checked')) {
                    btnEl.removeClass('disabled');

                }else{
                    btnEl.addClass('disabled');
                }

            });
        };


    };
});