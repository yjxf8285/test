/**
 * 体验页面逻辑
 * User: qisx
 * Date: 13-11-15
 * Time: 下午4:58
 */
(function($,root){
    var XK=root.XK,
        util=XK.util;
    var rootUrl = "../../..";   //请求地址前缀
    $(function(){
        var captchaImgKey= 0,  //保存图形验证码的key
            source=3; //指明请求来源，3表示网站首页
        var sysName=util.sysDetector();
        if (sysName=="ios") {
            source=1;
        } else if (sysName=="android") {
            source=2;
        }
        var sectionEl=$('#user-demo-tpl'),
            captchaImgEl=$('.captcha-img',sectionEl),
            captchaValEl=$('.ident-code',sectionEl),
            subBtnEl=$('.submit-fast-btn',sectionEl);
        /**
         * 更换图形验证码
         */
        var updateCaptchaImg=function(){
            var now=new Date();
            captchaImgKey=Math.ceil(now.getTime()/1000);
            captchaImgEl.attr('src',rootUrl + '/WebReg/GetCodeImg?key='+captchaImgKey);
        };
        //更换图形验证码
        sectionEl.on('click','.change-captcha-l,.captcha-img',function(evt){
            updateCaptchaImg();
            evt.preventDefault();
        });
        updateCaptchaImg();   //初次打开更换验证码
        //点击开始体验向后台发验证请求
        subBtnEl.click(function(){
            var captchaVal= $.trim(captchaValEl.val());
            captchaValEl.removeClass('reg-inp-fail');
            if(captchaVal.length==0){
                captchaValEl.addClass('reg-inp-fail');
                return;
            }
            util.ajax({
                "type":"get",
                "dataType":"json",
                "url":rootUrl+"/DemoAccount/LoginEx",
                "data":{
                    "key":captchaImgKey,
                    "code":captchaVal,
                    "source":source
                },
                "success":function(responseData){
                    var code;
                    if(responseData.success){
                        code=responseData.data;
                        util.externalExecute("DemoLogin",code);
                    }else{
                        updateCaptchaImg();   //业务失败更换验证码
                        util.alert('登录失败，'+responseData.error);
                    }
                },
                "error":function(){
                    updateCaptchaImg();   //请求失败更换验证码
                    util.alert('网络繁忙，请重试。');
                }
            });
        });
    });
}(Zepto,window));
