/**
 * Created by 仇昕
 *
 */
'use strict';
var React = require('react');
var img = require('../../img/ui/good-detail/good-img.png');
var GoodsLists = React.createClass({
    render: function () {
        var goodsList = this.props.data.map(function (data,i) {
            return (
                <div className="goods-lists" key={i} style={{display:data.display}}>
                    {
                        data.goodsList.map(function (m) {
                            return (
                                <div className="goods" key={m.goodsId}>
                                    <div className="goods-img"><img src={img}/></div>
                                    <div className="goods-right">
                                        <p><span>{m.goodsName}</span></p>

                                        <p><span>{m.marketPrice}</span></p>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            );
        });
        return (
            <div className="goodslist">{goodsList}</div>
        );
    }
});


module.exports = GoodsLists;