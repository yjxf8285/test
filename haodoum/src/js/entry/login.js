/**
 * Created by 仇昕
 *
 */
'use strict';

var style = require('../../css/page/login.scss');
var React = require('react');
var showPasswordImg = [require('../../img/ui/login/password_show.png'),require('../../img/ui/login/password_no_show.png')];
var ReactDOM = require('react-dom');
var LoginHeader = require('../module/login-header');
var Login = React.createClass({
    componentDidMount: function() {
        this.bindEvent();
    },
    bindEvent: function(){
        $(".inp span").on("click",this.getFocus);//文本框点击获得焦点
        $(".inp input").on("blur",this.getBlur);//文本框点击获得焦点
        $(".inp .show-password").on("click",this.showPassword);//文本框点击获得焦点
        $(".go-login").on("click",this.goLogin);//文本框点击获得焦点
    },
    getFocus: function (e) {
        var meEl = $(e.currentTarget);
        if (meEl.length > 0) {
            meEl.addClass("hov");
            meEl.next().focus();
        }
    },
    getBlur: function (e) {
        var spanEl = $(e.currentTarget).closest(".inp").find("span");
        if (spanEl.length > 0 && $(e.currentTarget).val() == "") {
            spanEl.removeClass("hov");
        }
    },
    showPassword: function (e) {
        var meEl = $(e.currentTarget);
        if (meEl.attr("show") == "show") {
            meEl.attr({"src": showPasswordImg[0], "show": ""});
            meEl.prev().attr("type", "password");
        } else {
            meEl.attr({"src":showPasswordImg[1], "show": "show"});
            meEl.prev().attr("type", "text");
        }
    },
    goLogin: function (e) {
        var meEl = $(e.currentTarget);
        var that = this;
        var paramsId = 100;
        var tel = meEl.closest(".login").find("#phone").val(); //获取手机号
        var pass = meEl.closest(".login").find("#password").val();
        var isPhone = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
        if (isPhone) {
            //调用登录接口
            util.api({
                url: "/weixin/user/login",
                type: "post",
                data: {
                    mobile: parseInt(tel),
                    password: pass,
                    id: paramsId
                },
                success: function (res) {
                    if (res.status == 200) {
                        alert("登录成功");
                        //dialog.alert({content:"登录成功！",hasSureHander:function(){
                        //    window.location.href="/m/index.html";
                        //}});
                    } else {
                        alert(res.result.msg);
                        //dialog.common({content:res.result.msg});
                    }
                }
            });
        } else {
            alert("手机号码格式不正确");
            //dialog.common({content:"手机号码格式不正确"});
        }
    },
    render: function () {
        return (
            <div className="login">
                <LoginHeader title="登录" linkText="注册" link="./regiest.html"/>
                <div className="login-content">
                    <div className="inp">
                        <span>请输入手机号</span>
                        <input id="phone" maxLength="11" />
                    </div>
                    <div className="inp">
                        <span>请输入密码</span>
                        <input id="password" type="password" maxLength="14" />
                        <img src={showPasswordImg[0]} className="show-password" />
                    </div>
                </div>
                <div className="login-btn go-login ">登录</div>
                <p className="reset-pass goto-reset"><a href="/m/html/reset-password.html">忘记密码</a></p>
            </div>
        );
    }
});
$(function () {
    ReactDOM.render(
        <Login />,
        document.getElementById('example')
    );
});

