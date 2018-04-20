/**
 * Created by 仇昕
 * 购物车
 */
'use strict';

var style = require('../../css/page/shop-cart-xfx.scss');
var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('../module/header');
var ShopCartGoodsList = require('../module/shopcart-goodslist');
var Dialog = require('../module/dialog');
var ShopCart = React.createClass({
    getInitialState: function () {
        return {
            num: ""
        };
    },
    setNum: function (num) {
        this.setState({num: num});
    },
    render: function () {
        return (
            <div>
                <Header title="购物车" num={this.state.num}/>
                <ShopCartBox data={this.state.data} onload={this.setNum}/>
            </div>
        );
    }
});

var ShopCartBox = React.createClass({
    getInitialState: function () {
        return {
            goodsList: [],
            dialogData:{
                type:1,
                title:"弹出头部",
                content:"这是弹出内容",
                confirmBtn:"确定",
                cancelBtn:"取消",
                showTime: 2000,
                width:"80%",
                display:"block",
                commonHandel:null,
                confirmHandel:null,
                cancelHandel:null
            }
        };
    },
    componentWillMount: function () {
        this.load();
    },
    load: function () {
        var that = this;
        util.api({
            surl: 'http://localhost:8000/json/shopcart.json',
            success: function (resData) {
                var data = resData.result.data, num = 0;
                that.setState({goodsList: data});
                data.map(function (m) {
                    m.goods.map(function (goods) {
                        num += Number(goods.cartNum);
                    });
                });
                that.props.onload(num);
            }
        });
    },
    setAllCheck: function () {
        var gList = this.state.goodsList, isCheck = 1;
        gList.map(function (m, i) {
            gList[i].goods.map(function (m, j) {
                if (gList[i].goods[j].isChecked == 0)
                    isCheck = 0;
            });
        });
        gList.map(function (m, i) {
            gList[i].goods.map(function (m, j) {
                isCheck ? m.isChecked = 0 : m.isChecked = 1;
            });
        });
        this.setState({goodsList: gList});
    },
    setCheck: function (parentIndex, childIndex) {
        var gList = this.state.goodsList, isCheck = 1, goods;
        if (childIndex != undefined) {
            goods = gList[parentIndex].goods[childIndex];
            goods.isChecked ? goods.isChecked = 0 : goods.isChecked = 1;
        } else {
            gList[parentIndex].goods.map(function (m, i) {
                if (m.isChecked == 0){
                    isCheck = 0;
                    return false;
                }
            });
            gList[parentIndex].goods.map(function (m, i) {
                isCheck ? m.isChecked = 0 : m.isChecked = 1;
            });
        }
        this.setState({goodsList: gList});
    },
    deleteHandle: function (parentIndex, childIndex) {
        var gList = this.state.goodsList;
        if (parentIndex != undefined && childIndex != undefined) {
            if (gList[parentIndex].goods.length == 1) {
                gList.splice(parentIndex, 1);
            } else {
                gList[parentIndex].goods.splice(childIndex, 1);
            }
        }
        this.setState({goodsList: gList});
    },
    setGoodsCountHandel: function (parentIndex, childIndex, handel) {
        var gList = this.state.goodsList, goods, goodsEl = gList[parentIndex].goods[childIndex];
        if (handel == "-") {
            if (goodsEl.cartNum > 1) {
                goodsEl.cartNum = Number(goodsEl.cartNum) - 1;
            }
        } else if (handel == "+") {
            if (goodsEl.cartNum < 50) {
                goodsEl.cartNum = Number(goodsEl.cartNum) + 1;
            }
        }
        goods = gList[parentIndex].goods[childIndex];
        goods.isChecked = 1;
        this.setState({goodsList: gList});
    },
    render: function () {
        return (
            <div>
                <ShopCartGoodsList goodsList={this.state.goodsList} checkHandle={this.setCheck}
                                   delete={this.deleteHandle} setGoodsCount={this.setGoodsCountHandel}/>
                <ShopCartBottom goodsList={this.state.goodsList} checkHandle={this.setAllCheck}/>
                <Dialog data={this.state.dialogData} />
            </div>
        );
    }
});


//shopcart全部数量和金额显示计算
var ShopCartBottom = React.createClass({
    render: function () {
        var isCheckClass = "tete-tick black-color", that = this, price = 0, num = 0;
        this.props.goodsList.map(function (m) {
            m.goods.map(function (goods) {
                if (goods.isChecked == 0) {
                    isCheckClass = "tete-tick gray-color";
                    return false;
                }
            });
        });
        this.props.goodsList.map(function (m) {
            m.goods.map(function (goods) {
                if (goods.isChecked == 1) {
                    num += Number(goods.cartNum);
                    price += Number(goods.cartNum) * (Number(goods.price) * 100);
                }
            });
        });
        return (
            <div className="shopcart-all-count">
                <div className="shopcart-all-left">
                    <i className={isCheckClass}
                       onClick={function(){that.props.checkHandle()}}></i>
                    <span className="all-info">全部</span>

                    <div>
                        <p className="all-items-price">共：¥<span
                            className="all-price">{parseFloat(price / 100).toFixed(2)}</span>（不含运费）
                        </p>
                    </div>
                </div>
                <div className="go-count">去结算（<span className="go-count-num">{num}</span>）</div>
            </div>
        );
    }
});


$(function () {
    ReactDOM.render(
        <ShopCart />,
        document.getElementById('shopcart')
    );
});

