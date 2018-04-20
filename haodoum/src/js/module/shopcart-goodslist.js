/**
 * Created by 仇昕
 * 购物车店铺列表
 */
'use strict';
var React = require('react');
var img = require('../../img/ui/good-detail/good-img.png');

var ShopCartBrand = React.createClass({
    checkOnOrOff: function (parentIndex, index) {
        this.props.checkHandle(parentIndex, index);
    },
    render: function () {
        var that = this;
        var goodsListTop = this.props.goodsList.map(function (m, i) {
            var price = 0, num = 0;
            var isCheckClass = "tete-tick black-color";
            m.goods.map(function (goods) {
                if (goods.isChecked == 0) {
                    isCheckClass = "tete-tick gray-color";
                }else{
                    num += Number(goods.cartNum);
                    price += Number(goods.cartNum) * (Number(goods.price) * 100);
                }
            });
            return (
                <div key={i}>
                    <div className="shopcart-list-hd">
                        <i className={isCheckClass} name="chageIcon"
                           onClick={function(){that.checkOnOrOff(i)}}></i>

                        <div className="shopcart-list-shop">
                            <i className="shopcart-shop-icon"></i>

                            <p className="shopcart-shop-title">{m.shopName}</p>
                        </div>
                    </div>
                    <ShopCartGoods goods={m.goods} index={i} isCheck={that.checkOnOrOff}
                                   isDelete={function(index){that.props.delete(i,index);}}
                                   setNum={function(index,handel){that.props.setGoodsCount(i,index,handel);}}/>

                    <div className="shopcart-list-ft">
                        <p className="mr15">
                            共<span className="shopcart-all-num">{num}</span>件
                        </p>

                        <p>
                            小计：￥<span className="shopcart-all-price">{parseFloat(price / 100).toFixed(2)}</span>
                        </p>
                    </div>
                </div>
            );
        });
        return (
            <div>
                {goodsListTop}
            </div>
        );
    }
});


var ShopCartGoods = React.createClass({
    render: function () {
        var that = this;
        return (
            <div>
                {
                    this.props.goods.map(function (m, i) {
                        var isCheckClass = "tete-tick black-color";
                        if (m.isChecked == 0) {
                            isCheckClass = "tete-tick gray-color";
                        }
                        return (
                            <div className="shopcart-list-bd" key={i}>
                                <div className="shopcart-single-list">
                                    <i className={isCheckClass} data-index={i} name="chageIcon"
                                       onClick={function(){that.props.isCheck(that.props.index,i)}}></i>
                                    <img src={img}/>

                                    <div className="shopcart-single-right">
                                        <div className="shopcart-single-right-top">
                                            <p className="single-list-title">
                                                <a href="">
                                                    {m.goodsName}
                                                </a>
                                            </p>

                                            <p className="single-list-num">￥<span
                                                className="single-price">{parseFloat(m.price).toFixed(2)}</span></p>
                                        </div>
                                        <div className="shopcart-single-right-bottom">
                                            <div className="single-list-calc" data-limit="">
                                                <span className="minus"
                                                      onClick={function(){that.props.setNum(i,"-")}}>-</span>
                                                <input type="text" value={m.cartNum} readOnly/>
                                                <span className="plus"
                                                      onClick={function(){that.props.setNum(i,"+")}}>+</span>
                                            </div>
                                            <i className="single-list-delete"
                                               onClick={function(){that.props.isDelete(i)}}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
});


module.exports = ShopCartBrand;