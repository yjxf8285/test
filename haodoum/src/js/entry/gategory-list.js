/**
 * Created by 晓帆 on 3/3 003.
 * 已废弃
 */
'use strict';
var style = require('../../css/page/gategory-list.scss');
var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('../module/header');

var TabBox = React.createClass({
    getInitialState: function () {
        return {
            goodsListData: []
        }
    },
    tab: function (i, id) {
        this.load(i, id);
    },
    load: function (i, id) {
        var that = this;
        var goodsListData = this.state.goodsListData;
        util.api({
            url: '/weixin/info/goods',
            data: {
                page: 1,
                pageSize: 10,
                cateId: id
            },
            success: function (responseData) {
                var data = responseData.result.data || [];
                that.setState({
                    goodsListData: that.state.goodsListData.concat(data)
                })
            }
        });
    },
    componentDidMount: function () {
        this.load(1, 1);
    },
    getCurClassName: function (i) {
        return i == this.state.curIndex ? 'cur' : '';
    },
    render: function () {
        var that = this;
        console.info(this.state.goodsListData, 'render')
        return (
            <div>
                <ul className="btn-wrap">
                    {this.props.tabData.map(function (m, i) {
                        return (
                            <li key={i} onClick={function(){that.tab(i+1,m.id)}}
                                className={that.getCurClassName(i+1)}>{m.name}</li>
                        )
                    })}
                </ul>
                {this.state.goodsListData.map(function (m, i) {
                    console.info(m);
                    return (
                        <GoodsList goodsListData={m} key={i}/>
                    )
                })}
            </div>
        )
    }
});
//
var GoodsList = React.createClass({
    render: function () {
        var that = this;
        return (
            <ul className="good-list-warp">
                {this.props.goodsListData.map(function (m, i) {
                    return (
                        <li key={i}>
                            <div className="tty-ico"></div>
                            <a href={"/m/html/goods-detail.html?goodsid="+m.goodsId} className="goods-img"
                               style={{backgroundImage: "url("+m.img+")"}}></a>
                            <div className="goods-tit"><a
                                href="/m/html/goods-detail.html?goodsid={{m.goodsId}}">{m.goodsName}</a></div>
                            <div className="goods-fnwarp clearfix">
                                <span className="l">￥{m.price}</span>
                                <div className="r">
                                    <div className="add-cart" goodsid="{{m.goodsId}}"></div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        );
    }
});
var Container = React.createClass({
    render: function () {
        return (
            <div>
                <Header/>
                <TabBox tabData={[
                {
                name:'111',
                id:1
                }, {
                name:'222',
                id:2
                }, {
                name:'333',
                id:3
                }, {
                name:'444',
                id:4
                }, {
                name:'555',
                id:5
                }
                ]}/>
            </div>
        )
    }
});


var Main = function () {
    this.init();
    this.listDatas = {};
};
$.extend(Main.prototype, {
    init: function () {
        console.info('init')
        this.loadNavData();
        this.events();
    },
    events: function () {
        var that = this;
        $('#container').on('click', '.btn-wrap li', function () {
            var meEl = $(this);
            var index = meEl.index();
            $('.btn-wrap li').removeClass('cur');
            meEl.addClass('cur');
            var id = meEl.data('id');
            if (that.listDatas[index]) {
                $('.good-list-warp').hide().eq(index).show();
            } else {
                that.loadListData(index, id);
            }
        })
    },
    loadListData: function (i, id) {
        var that = this;
        util.api({
            url: '/weixin/info/goods',
            data: {
                page: 1,
                pageSize: 10,
                cateId: id
            },
            success: function (responseData) {
                var data = responseData.result.data || [];
                that.renderList(i, data)
            }
        });
    },
    renderList: function (i, data) {

        var str = '';
        data.map(function (m, i) {
            var curClass = i == 0 ? 'cur' : '';
            str += ' <li  data-id="' + m.id + '">' + m.name + '</li>';
        });
        $('.boxwrap').append('<ul class="good-list-warp">' + str + '</ul>');
    },
    loadNavData: function () {
        var tabData = [
            {
                name: '111',
                id: 1
            }, {
                name: '222',
                id: 2
            }, {
                name: '333',
                id: 3
            }, {
                name: '444',
                id: 4
            }, {
                name: '555',
                id: 5
            }
        ];
        this.render(tabData)
    },
    render: function (data) {
        var str = '';
        data.map(function (m, i) {
            var curClass = i == 0 ? 'cur' : '';
            str += '<li class="' + curClass + '" data-id="' + m.id + '">' + m.name + '</li>';

        });
        $('#container').html('<ul class="btn-wrap">' + str + '</ul><div class="boxwrap"></div>')
    }
});
$(function () {
    //ReactDOM.render(
    //    <Container />,
    //    document.getElementById('container')
    //);
    var main = new Main({});
});

