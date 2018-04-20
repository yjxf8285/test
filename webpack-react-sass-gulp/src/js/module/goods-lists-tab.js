/**
 * Created by 仇昕
 *
 */
'use strict';

var React = require('react');
var GoodsListTab = React.createClass({
    goClick:function(e){
        var meEl = $(e.currentTarget);
        this.props.onTabClick(meEl.index());
    },
    render: function () {
        var tabNodes = this.props.data.map(function (data,i) {
            var hov = data.isHov ? "hov" : "";
            return (
                <div key={i} data-id={data.id} onClick={this.goClick} className={hov}>
                    {data.name}
                </div>
            );
        }.bind(this));
        return (
            <div className="goods-list-tab">
                {tabNodes}
            </div>
        );
    }
});

