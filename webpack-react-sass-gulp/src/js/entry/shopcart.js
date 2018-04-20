/**
 * Created by ccq on 2016/3/2.
 */
var style = require('../../css/page/shop-cart.scss');

var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('../module/header');

//购物车view
var ShopcartV = React.createClass({
    render: function () {
        return (
            <div>
                <Header title="购物车" number ="14"/>
                <a href="/m/html/weal-list.html" className="shopcart-banner"></a>
                <Shopcart  url ="http://localhost:8000/json/shopcart.json" />
            </div>
        );
    }
});

//购物车
var Shopcart = React.createClass({
    getInitialState:function(){
        return {
            data:[],
            cartPriceAndNum:{

            },
            isChecked:1
        }
    },
    load: function () {
        var that = this;
        util.api({
            surl: this.props.url,
            success: function (resData) {
                var status = resData.status || 404,
                    result = resData.result || {};
                if (status === 200 && result.data.length >0) {
                    that.setState({
                        data : result.data,
                        cartPriceAndNum :result.cartPriceAndNum || {},
                        isChecked : result.isChecked || 1
                    });
                }
            }
        });
    },
    componentDidMount:function(){
        this.load();
    },
    //计算购物车选中商品的总价和总数量
    shopcartCount:function(storeData,shopcartTick){
        var globalNum = 0,
            globalPrice = 0,
            shopcartTick;
        storeData.forEach(function(m){
            globalNum += parseInt(m.goodsPriceAndNum.goodsNum);
            globalPrice += Number(m.goodsPriceAndNum.goodsPrice*100);
        });
        var isShopcartTick = storeData.every(function(m){
            return m.isChecked == 1;
        });
        if(isShopcartTick){
            shopcartTick =1;
        }else{
            shopcartTick = 0;
        }
        this.setState({
            data:storeData,
            cartPriceAndNum:{
                goodsNum:globalNum,
                goodsPrice:(globalPrice/100).toFixed(2),
            },
            isChecked:shopcartTick
        });
    },
    //全局钩子的勾选
    shopcartTick:function(){
        if(this.state.isChecked === 1){
            this.state.isChecked = 0;
            this.state.data.forEach(function(m){
                m.isChecked = 0;
                m.goods.forEach(function(m){
                    m.isChecked = 0;
                });
            });
        }else{
            this.state.isChecked = 1;
            this.state.data.forEach(function(m){
                m.isChecked = 1;
                m.goods.forEach(function(m){
                    m.isChecked = 1;
                });
            });
        }
        var storeData = this.state.data;
        this.shopcartCount(this.state.data);
    },
    render: function () {
        return (
            <div>
                <Stores data = {this.state.data} shopcartTick={this.state.isChecked} onShopcartCount = {this.shopcartCount}/>
                <ShopcartFt  tick = {this.state.isChecked} shopcart = {this.state.cartPriceAndNum} onShopcartTick = {this.shopcartTick}/>
            </div>
        );
    }
});

//店铺总数和总金额
var ShopcartFt = React.createClass({
    render: function () {
        return (
            <div className="shopcart-all-count">
                <div className="shopcart-all-left">
                    <i className={this.props.tick ===1 ?'tete-tick check-all-list black-color touch' :'tete-tick check-all-list gray-color touch'} onClick = {this.props.onShopcartTick}></i>
                    <span className="all-info">全部</span>

                    <div>
                        <p className="all-items-price">共：¥<span className="all-price">{this.props.shopcart && this.props.shopcart.goodsPrice}</span>（不含运费）</p>
                    </div>
                </div>
                <div className="go-count">去结算（<span className="go-count-num">{this.props.shopcart && this.props.shopcart.goodsNum}</span>）</div>
            </div>
        );
    }
});

//店铺
var Stores = React.createClass({
    storesTick:function(storeData){
        if(storeData.isChecked == 1){
            storeData.isChecked = 0;
            storeData.goods.forEach(function(m){
                m.isChecked = 0;
            });
        }else{
            storeData.isChecked = 1;
            storeData.goods.forEach(function(m){
                m.isChecked = 1;
            });
        }
        this.storeCount(storeData);
    },

    //店铺价格和数量
    storeCount:function(storeData){
        var shopNum = 0,
            shopPrice = 0;
        storeData.goods.forEach(function(m){
            if(m.isChecked ===0){
                return false;
            }
            shopNum += parseInt(m.cartNum);
            shopPrice += parseInt(m.cartNum) * parseInt(parseFloat(m.price)*100);
        });
        storeData.goodsPriceAndNum.goodsNum = shopNum;
        storeData.goodsPriceAndNum.goodsPrice = (shopPrice/100).toFixed(2);

        var isShopTick = storeData.goods.every(function(m){
            return m.isChecked == 1;
        })

        //判断当前店铺勾选状态
        if(isShopTick){
            storeData.isChecked = 1;
        }else{
            storeData.isChecked = 0;
        }
        this.props.onShopcartCount(this.props.data);
    },
    render: function () {
        var that = this;
        var storeV = this.props.data.map(function(m){
            return (
                <div key={m.shopId}>
                    <div className="shopcart-list-hd">
                        <i className={m.isChecked ==1 ?'tete-tick check-all-list black-color touch' :'tete-tick check-all-list gray-color touch'} name="chageIcon"
                           onClick={that.storesTick.bind(null,m)}></i>
                        <div className="shopcart-list-shop">
                            <i className="shopcart-shop-icon"></i>
                            <p className="shopcart-shop-title">{m.shopName}</p>
                        </div>
                    </div>
                    <Goods data={m} onStoreCount = {that.storeCount} storesData ={that.props.data} storesKey={m.shopId} shopcartTick={that.props.shopcartTick}/>
                    <div className="shopcart-list-ft">
                        <p className="mr15">
                            共<span className="shopcart-all-num">{m.goodsPriceAndNum.goodsNum}</span>件
                        </p>
                        <p>
                            小计：￥<span className="shopcart-all-price">{m.goodsPriceAndNum.goodsPrice}</span>
                        </p>
                    </div>
                </div>
            );
        })
        return (
            <div className ="shopcart-alls-list">
                {storeV}
            </div>
        );
    }
});

//商品
var Goods = React.createClass({
    tickGoods:function(goodsData){
        if(goodsData.isChecked ==1){
            goodsData.isChecked = 0;
        }else{
            goodsData.isChecked = 1;
        }
        this.props.onStoreCount(this.props.data);
    },
    plusGoods:function(goodsData){
        if(goodsData.isChecked == 0){
            goodsData.isChecked = 1;
        }
        goodsData.cartNum =parseInt(goodsData.cartNum)+ 1;
        this.props.onStoreCount(this.props.data);
    },
    minusGoods:function(goodsData){
        if(goodsData.isChecked == 0){
            goodsData.isChecked = 1;
        }
        if(parseInt(goodsData.cartNum)> 1){
            goodsData.cartNum =parseInt(goodsData.cartNum)-1;
        }
        this.props.onStoreCount(this.props.data);
    },
    deleteGoods:function(goodsId){
        var that = this;
        this.props.data.goods.forEach(function(m,i){
            if(m.goodsId ==goodsId){
                if(that.props.data.goods.length>1){
                    that.props.data.goods.splice(i,1);
                    return;
                }else{
                    that.props.storesData.forEach(function(m1,i1){
                        if(m1.shopId == that.props.storesKey){
                            that.props.storesData.splice(i1,1);
                            return;
                        }
                    })
                }
            }
        })
        this.props.onStoreCount(this.props.data);
    },
    render: function () {
        var that = this;
        var goodsV= this.props.data.goods.map(function(m){
            return (
                <div className="shopcart-list-bd" key = {m.goodsId}>
                    <div className="shopcart-single-list">
                        <i className={m.isChecked ==1 ?'tete-tick check-all-list black-color touch' :'tete-tick check-all-list gray-color touch'} name="chageIcon"
                           onClick={that.tickGoods.bind(null,m)}></i>
                        <img src={m.imgUrls[0]}/>
                        <div className="shopcart-single-right">
                            <div className="shopcart-single-right-top">
                                <p className="single-list-title">
                                    <a href="">
                                        {m.goodsName}
                                    </a>
                                </p>
                                <p className="single-list-num">￥<span className="single-price">{m.price}</span></p>
                            </div>
                            <div className="shopcart-single-right-bottom">
                                <div className="single-list-calc" data-limit="">
                                <span className="minus touch"
                                      onClick={that.minusGoods.bind(null,m)}>-</span>
                                    <input type="text" value={m.cartNum ||1} readOnly/>
                                <span className="plus touch"
                                      onClick={that.plusGoods.bind(null,m)}>+</span>
                                </div>
                                <i className="single-list-delete touch"
                                   onClick={that.deleteGoods.bind(null,m.goodsId)}></i>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
        return (
            <div>
                {goodsV}
            </div>
        );
    }
});

ReactDOM.render(
    <ShopcartV />,
    document.getElementById('container')
);

