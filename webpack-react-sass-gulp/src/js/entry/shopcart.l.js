/**
 * Created by 晓帆 on 10/8 008.
 * 购物车
 */
'use strict';
var style = require('../../css/page/shop-cart.scss');
var React = require('react');
var ReactDOM = require('react-dom');
//底部菜单
var BottomMenu = React.createClass({
    render: function () {
        var tickClass = this.props.data.isCheckedAll ? 'tete-tick black-color check-all-shopcart touch' : 'tete-tick gray-color check-all-shopcart touch';
        return (
            <div className="shopcart-all-count">
                <div className="shopcart-all-left">
                    <i className={tickClass} onClick={this.props.selectAllStore}></i>
                    <span className="all-info">全部</span>
                    <div>
                        <p className="all-items-price">共{this.props.data.allNum || 0}件，总价：¥<span
                            className="all-price">{this.props.data.allPrice || 0}</span>（不含运费）</p>
                    </div>
                </div>
                <div className="go-count">去结算（<span className="go-count-num">0</span>）</div>
            </div>
        );
    }
});
// 商品
var Goods = React.createClass({
    render: function () {
        var that = this;
        var goods = that.props.goods || {};
        var tickClass = goods.isChecked ? "tete-tick check-all-list black-color touch" : "tete-tick check-all-list gray-color touch";
        return (
            <div className="shopcart-list-bd">
                <div className="shopcart-single-list">
                    <i className={tickClass} name="chageIcon"
                       onClick={function(){that.props.selectGoods(goods.goodsId)}}></i>
                    <img src={goods.imgUrls[0]}/>
                    <div className="shopcart-single-right">
                        <div className="shopcart-single-right-top">
                            <p className="single-list-title"><a href=""> {goods.goodsName} </a></p>
                            <p className="single-list-num">￥<span className="single-price">{goods.price}</span></p>
                        </div>
                        <div className="shopcart-single-right-bottom">
                            <div className="single-list-calc" data-limit="">
                                <span className="minus touch"
                                      onClick={function(){that.props.subtract(goods.goodsId)}}>-</span>
                                <input type="text" value={goods.cartNum||1} readOnly/>
                                <span className="plus touch"
                                      onClick={function(){that.props.plus(goods.goodsId)}}>+</span>
                            </div>
                            <i className="single-list-delete touch"
                               onClick={function(){that.props.remove(goods.goodsId)}}></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
// 店铺
var StoreItem = React.createClass({
    removeGoods: function (goodsId) {
        var fData = $.extend({}, this.props.data);
        fData.goods.map(function (m, i) {
            if (m.goodsId === goodsId) fData.goods.splice(i, 1);
        });
        this.totoCount(fData);
    },
    plus: function (goodsId) {
        var fData = $.extend({}, this.props.data);
        fData.goods.map(function (m, i) {
            if (m.goodsId === goodsId) {
                if (m.cartNum < 10) m.cartNum++;
                m.isChecked = 1;
            }
        });
        this.totoCount(fData);
    },
    subtract: function (goodsId) {
        var fData = $.extend({}, this.props.data);
        fData.goods.map(function (m, i) {
            if (m.goodsId === goodsId) {
                if (m.cartNum > 1) m.cartNum--;
                m.isChecked = 1;
            }
        });
        this.totoCount(fData);
    },
    selectGoods: function (goodsId) {
        var fData = $.extend({}, this.props.data);
        fData.goods.map(function (m, i) {
            if (m.goodsId === goodsId) m.isChecked ? m.isChecked = 0 : m.isChecked = 1;
        });
        this.totoCount(fData);
    },
    selectStore: function () {
        var fData = $.extend({}, this.props.data);
        if (fData.isChecked) {
            fData.goods.map(function (m, i) {
                m.isChecked = 0
            });
            fData.isChecked = 0
        } else {
            fData.goods.map(function (m, i) {
                m.isChecked = 1
            });
            fData.isChecked = 1
        }
        this.totoCount(fData);
    },
    totoCount: function (fData) {
        var goodsNum = 0;
        var price = 0;
        fData.goods.map(function (m) {
            if (m.isChecked) {
                goodsNum += Number(m.cartNum);
                price += m.cartNum * (m.price * 100);
            }
        });
        fData.isChecked = fData.goods.every(function (m) {
            return m.isChecked;
        });
        fData.goodsPriceAndNum.goodsNum = goodsNum;
        fData.goodsPriceAndNum.goodsPrice = (price / 100).toFixed(2);
        this.props.onStoreChange(fData);
    },
    render: function () {
        var that = this;
        var data = this.props.data || {};
        var goods = data.goods || [];
        var tickClass = data.isChecked ? "tete-tick check-all-list black-color touch" : "tete-tick check-all-list gray-color touch";
        return (
            <div>
                <div className="shopcart-list-hd">
                    <i className={tickClass} name="chageIcon"
                       onClick={this.selectStore}></i>
                    <div className="shopcart-list-shop">
                        <i className="shopcart-shop-icon"></i>
                        <p className="shopcart-shop-title">{data.shopName}</p>
                    </div>
                </div>
                {goods.map(function (m, i) {
                    return (
                        <Goods goods={m} key={i} remove={that.removeGoods} plus={that.plus}
                               subtract={that.subtract} selectGoods={that.selectGoods}/>
                    )
                })}
                <div className="shopcart-list-ft">
                    <p className="mr15">
                        共<span className="shopcart-all-num"> {data.goodsPriceAndNum.goodsNum} </span>件
                    </p>
                    <p>
                        小计：￥<span className="shopcart-all-price">{data.goodsPriceAndNum.goodsPrice}</span>
                    </p>
                </div>
            </div>
        )
    }
});

//容器
var Container = React.createClass({
    getInitialState: function () {
        return {
            isCheckedAll: 1,
            "data": []
        }
    },
    componentDidMount: function () {
        this.load();
    },
    onStoreChange: function (data) {
        var fData = this.state.data || [];
        fData.map(function (m, i) {
            if (data.shopId === m.shopId) {
                $.extend(m, data);
            }
        });
        this.countAll(fData);
    },
    selectAllStore: function () {
        var fData = this.state.data || [];
        if (fData.isCheckedAll) {
            fData.isCheckedAll = 0;
            fData.map(function (m, i) {
                m.goods.map(function (mm, i) {
                    mm.isChecked = 0
                });
                m.isChecked = 0
            });
        } else {
            fData.isCheckedAll = 1;
            fData.map(function (m, i) {
                m.goods.map(function (mm, i) {
                    mm.isChecked = 1
                });
                m.isChecked = 1
            });
        }
        this.countAll(fData);
    },
    //dispatcher
    countAll: function (fData) {
        var allNum = 0;
        var allPrice = 0;
        var isCheckedAll = fData.every(function (m) {
            return m.isChecked;
        });
        fData.map(function (m) {
            if (m.isChecked) {
                allNum += Number(m.goodsPriceAndNum.goodsNum);
                allPrice += (m.goodsPriceAndNum.goodsPrice * 100);
            }
        });
        fData.map(function (m, i) {
            if (m.goods.length <= 0) {
                fData.splice(i, 1);
            }
        });
        $.extend(fData, {
            isCheckedAll: isCheckedAll,
            allNum: allNum,
            allPrice: (allPrice / 100).toFixed(2)
        });
        this.setState({data: fData});
    },
    load: function () {
        var that = this;
        util.api({
            surl: this.props.url,
            success: function (resData) {
                var result = resData.result || {};
                var data = result.data || [];
                if (resData.status !== 200) {
                    console.info('接口不通');
                } else {
                    if (data && data.length > 0) {
                        that.countAll(data);
                    } else {
                        console.info('您的购物车列表为空！')
                    }
                }
            }
        });
    },
    render: function () {
        var that = this;
        var data = this.state.data;
        return (
            <div className="shopcart-alls-list">
                {data.map(function (m, i) {
                    return (
                        <StoreItem data={m} key={i} onStoreChange={that.onStoreChange}/>
                    );
                })}
                <BottomMenu data={data} selectAllStore={this.selectAllStore}/>
            </div>
        )
    }
});


ReactDOM.render(
    <Container url="/json/shopcart.json"/>,
    document.getElementById('container')
);

