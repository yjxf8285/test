/**
 * Created by 晓帆 on 10/25 025.
 * 首页
 */
'use strict';

var style = require('../../css/page/index.scss');
var React = require('react');
var ReactDOM = require('react-dom');

var MainWarp = React.createClass({
    getInitialState: function () {
        return {
            currentIndex: 0,
        }
    },
    setTabIndex: function (i) {
        this.setState({currentIndex: i});
    },
    getBtnCurClass: function (i) {
        return i === this.state.currentIndex ? "bar-btn cur" : "bar-btn";
    },
    getConCurClass: function (i) {
        return i === this.state.currentIndex ? "tabcon" : "tabcon fn-hide";
    },
    render: function () {
        return (
            <div>
                <Menubar setTabIndex={this.setTabIndex} getBtnCurClass={this.getBtnCurClass}/>
                <Active apiUrl="/weixin/info/getAdvertList" getConCurClass={this.getConCurClass}/>
                <Gategory apiUrl="/weixin/info/getCategory" getConCurClass={this.getConCurClass}/>
            </div>
        );
    }
});
var Menubar = React.createClass({
    render: function () {
        var that = this;
        return (
            <div className="menubar">
                {['活动', '分类'].map(function (m, i) {
                    return (
                        <div className={that.props.getBtnCurClass(i)} key={i}
                             onClick={function(e){ that.props.setTabIndex(i)}}> {m}</div>
                    )
                })}
            </div>
        );
    }
});
var ActiveItem = React.createClass({
    render: function () {
        var data = this.props.data || [];
        var liStr = data.map(function (m, i) {
            return (
                <li key={i}>
                    <a href="html/weal-list.html" className="bg"
                       style={{backgroundImage: "url('https://img.alicdn.com/tps/TB1lBj5LVXXXXaiXXXXXXXXXXXX-520-280.jpg')"}}></a>
                </li>
            );
        });
        return (
            <ul className="active-list-warp">{liStr}</ul>
        );
    }
});
var Active = React.createClass({
    getInitialState: function () {
        return {
            data: []
        }
    },
    componentDidMount: function () {
        var that = this;
        util.api({
            url: this.props.apiUrl,
            data: {},
            success: function (resData) {
                var result = resData.result;
                that.setState({data: result.data});
            }
        });
    },
    render: function () {
        return (
            <div className={this.props.getConCurClass(0)}>
                <div className="content active">
                    <a className="search-btn" href="/html/search.html"><span className="ico">搜索</span></a>
                    <a href="/html/weal-list.html" className="weal-banner"></a>
                    <ActiveItem data={this.state.data}/>
                </div>
            </div>
        );
    }
});
var GategoryItem = React.createClass({
    render: function () {
        var data = this.props.data || [];
        var liStr = data.map(function (m, i) {
            return (
                <li key={i}>
                    <a href={"html/gategory-list.html?cateid="+m.cateId+"&catename="+m.cateName} className="bg"
                       style={{backgroundImage: 'url('+require('../../img/ui/gategory/'+(i+1)+'.png')+')'}}></a>
                    <div className=" tit">烘焙甜点</div>
                </li>
            );
        });
        return (
            <ul className="active-list-warp">{liStr}</ul>
        );
    }
});
var Gategory = React.createClass({
    getInitialState: function () {
        return {
            data: []
        }
    },
    componentDidMount: function () {
        var that = this;
        util.api({
            url: this.props.apiUrl,
            data: {},
            success: function (resData) {
                var result = resData.result;
                that.setState({data: result.data});
            }
        });
    },
    render: function () {
        return (
            <div className={this.props.getConCurClass(1)}>
                <div className=" content gategory">
                    <ul className=" gategory-list-warp">
                        <GategoryItem data={this.state.data}/>
                    </ul>
                </div>
            </div>
        );
    }
});
var Footer = React.createClass({
    render: function () {
        return (
            <ul className=" footer">
                <li><a href="/html/login.html">登录</a> | <a href="/html/regiest.html">注册</a><a
                    href="/html/feedback.html" className=" ml20">反馈</a></li>
                <li><a href=" http://a.app.qq.com/o/simple.jsp?pkgname=com.android_framework">手机版</a><span
                    className="gray">触屏版</span>
                </li>
                < li >©2009 - 2016 巧手特特 All right Reserved</li>
            </ul>
        )
    }
});
var BottomBtn = React.createClass({
    showBtn: function (e) {
        var wEl = $('.bottom-btn-warp');
        var profileBtn = $('.btn-profile',wEl);
        var shoppingBtn = $('.btn-shopping',wEl);

        if (profileBtn.is('.show')) {
            profileBtn.removeClass('show');
            shoppingBtn.removeClass('show');
        } else {
            profileBtn.addClass('show');
            shoppingBtn.addClass('show');
        }
        e.stopPropagation();
    },
    render: function () {
        return (
            <div className="bottom-btn-warp">
                <div className="bbtn-c">
                    <div className="btn-qiao" onClick={this.showBtn}></div>
                    <a href="/m/html/personal.html" className="btn-profile"></a>
                    <a href="/m/html/shop-cart.html" className="btn-shopping"></a>
                    <div className="btn-scrolltop"></div>
                </div>
            </div>
        );
    }
});

$(function () {

    ReactDOM.render(
        <div>
            <MainWarp />
            <Footer />
            <BottomBtn />
        </div>,
        document.getElementById('container')
    );
    $(window).on('scroll', function (e) {
        var scrollTop = $(window).scrollTop();
        if (scrollTop >= 150) {
            $('.btn-scrolltop').addClass('show');
        } else {
            $('.btn-scrolltop').removeClass('show');
        }
    });
});
