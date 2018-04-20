/**
 * Created by ccq on 2016/3/8.
 * react index
 */
'use strict';

var style = require('../../css/page/index.scss');
var React = require('react');
var ReactDOM = require('react-dom');

//顶层容器
var Index = React.createClass({
    getInitialState: function () {
        return {
            switchBox: [true, false],
            switchBd:[true,true],
            "activeData": [
                {
                    "linkParam": "",
                    "img": '',
                    advertId:0,
                    "shopName": "",
                }
            ],
            "gategoryData":[
                {
                    "cateId" :0,
                    "catename" :'',
                    "cateName":''
                }
            ]
        }
    },
    handleSwitch: function (data) {
        var switchBox = [false, false];
        switchBox[data] = true;
       var that = this;
        if(switchBox[1] && this.state.switchBd[data]){
            that.loadGategory();
            this.state.switchBd[data] = false;
        }
        this.setState({
            switchBox: switchBox
        })
    },
    loadActivity:function(){
        var that = this;
        util.api({
            url: '/weixin/info/getAdvertList',
            success: function (resData) {
                var status = resData.status || 404,
                    data=(resData.result && resData.result.data) || [];
                if(status === 200){
                    that.setState({
                        activeData:data
                    })
                }

            }
        });
    },
    loadGategory:function(){
        var that = this;
        util.api({
            url: '/weixin/info/getCategory',
            success: function (resData) {
                var status = resData.status || 404,
                    data=(resData.result && resData.result.data) || [];
                if(status === 200){
                    that.setState({
                        gategoryData:data
                    });

                }

            }
        });
    },
    componentDidMount:function(){
        this.loadActivity();
    },
    render: function () {
        var tabBd,
            tabArr = [<IndexTabBdL sorce = "/weixin/info/getAdvertList"  data={this.state.activeData}/>, <IndexTabBdR data={this.state.gategoryData} />];
        this.state.switchBox.forEach(function (m, i) {
            if (m) {
                tabBd = tabArr[i]
            }
        });
        return (
            <div>
                <IndexTabHd switchBox={this.state.switchBox} onSwitch={this.handleSwitch}/>
                {tabBd}
                <Footer />
                <NavIndex />
            </div>
        );
    }
});

//选项卡顶部切换
var IndexTabHd = React.createClass({
    render: function () {
        var eleArr = [];
        this.props.switchBox.forEach(function (m, i) {
            if (m) {
                eleArr[i] = "bar-btn cur";
            } else {
                eleArr[i] = "bar-btn";
            }
        })
        return (
            <div className="menubar">
                <div className={eleArr[0]} onClick={this.props.onSwitch.bind(null,0)}>活动</div>
                <div className={eleArr[1]} onClick={this.props.onSwitch.bind(null,1)}>分类</div>
            </div>
        );
    }
});

//选项卡左侧内容
var IndexTabBdL = React.createClass({

        render: function () {
            var BdLStr = this.props.data.map(function(m){
                return (
                    <li key={m.advertId}>
                        <a href={m.linkParam} className="bg" >
                            <img src={m.img} />
                        </a>
                    </li>
                );
            });
            return (
                <div>
                    <div className="content active">
                        <a className="search-btn" href="/m/html/search.html"><span className="ico">搜索</span></a>
                        <a href="/m/html/weal-list.html" className="weal-banner"></a>
                        <ul className="active-list-warp">
                            {BdLStr}
                        </ul>
                    </div>
                </div>
            );
        }
    });

//选项卡右侧内容
var IndexTabBdR = React.createClass({
    render: function () {
        var gategoryImg = '';
        var BdRStr = this.props.data.map(function(m){
            return (
                <li key={m.cateId}>
                    <a href="/m/html/gategory-list.html?cateid={m.cateId}&catename={m.cateName}" className="bg">
                        <img src="/img/ui/gategory/{m.cateId}.png" alt=""/>
                    </a>
                    <div className="tit">{m.cateName}</div>
                </li>
            );
        });
        return (
            <div className="content gategory">
                <ul className="gategory-list-warp" >
                    {BdRStr}
                </ul>
            </div>
        );
    }
});

//回到顶部和跳转购物车
var NavIndex = React.createClass({
    showBtn:function(e){
        var profileBtn = $(this.refs.btnprofile);
        var shoppingBtn = $(this.refs.btnshopping);
        if (profileBtn.is('.show')) {
            profileBtn.removeClass('show');
            shoppingBtn.removeClass('show');
        } else {
            profileBtn.addClass('show');
            shoppingBtn.addClass('show');
        }
        e.stopPropagation();
        return false;
    },
    scrollTop:function(e){
        $('body,html').animate({scrollTop: 0}, 300);
        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    componentDidMount:function(){
        var that = this;
        $(window).on('scroll',function(){
            var scrollTop = $(window).scrollTop();
            if (scrollTop >= 150) {
                $(that.refs.btnScrolltop).addClass('show');
            } else {
                $(that.refs.btnScrolltop).removeClass('show');
            }
        })
    },
    render: function () {
        return (
            <div className="bottom-btn-warp" ref="ccq">
                <div className="bbtn-c">
                    <div className="btn-qiao" onClick={this.showBtn}></div>
                    <a href="/m/html/personal.html" className="btn-profile" ref="btnprofile"></a>
                    <a href="/m/html/shop-cart.html" className="btn-shopping" ref="btnshopping"></a>
                    <div className="btn-scrolltop" onClick = {this.scrollTop} ref="btnScrolltop" onClick ={this.scrollTop}></div>
                </div>
            </div>
        );
    }
});

//页尾
var Footer = React.createClass({
    render: function () {
        return (
            <ul className="footer">
                <li><a href="/m/html/login.html">登录</a> | <a href="/m/html/regiest.html">注册</a><a
                    href="/m/html/feedback.html" className="ml20">反馈</a></li>
                <li><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.android_framework">手机版</a><span
                    className="gray">触屏版</span></li>
                <li>©2009-2016 巧手特特 All right Reserved</li>
            </ul>
        );
    }
});
ReactDOM.render(
    <Index />,
    document.getElementById('container')
);

