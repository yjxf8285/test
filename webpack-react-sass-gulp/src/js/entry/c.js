/**
 * Created by 晓帆 on 3/18 018.
 *
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var style = require('../../css/page/c.scss');
var SeachBar = React.createClass({
    getInitialState: function () {
        return {
            val: ''
        };
    },
    handleChange: function (e) {
        this.setState({val: e.target.value});
    },
    handleSeach: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        event.preventDefault();
        var val = this.state.val.trim();
        if (val) {
            this.props.seachList(val);
            this.setState({val: ''});
        }
    },
    render: function () {
        return (
            <header className="header">
                <input
                    className="new-todo"
                    placeholder="搜索"
                    value={this.state.val}
                    onKeyDown={this.handleSeach}
                    onChange={this.handleChange}
                    autoFocus={true}
                />
            </header>
        )
    }
});
var MenuBar = React.createClass({
    getInitialState: function () {
        return {
            curIndex: 0
        }
    },
    tabClick: function (i) {
        this.setState({
            curIndex: i
        });
        this.props.getIndex(i)
    },
    render: function () {
        var that = this;
        return (
            <ul className="menu-wrap">
                {[1, 2, 3, 4, 5].map(function (m, i) {
                    return (
                        <li className={that.state.curIndex==i?'cur':''} onClick={that.tabClick.bind(that,i)}
                            key={i}>{m}</li>
                    )
                })}
            </ul>
        )
    }
});
var List = React.createClass({
    render: function () {
        var that = this;
        return (
            <div>
                {this.props.models.map(function (m, i) {
                    return (
                        <ul key={i} className={that.props.curIndex==i?'list-wrap show':'list-wrap'}>
                            {m.map(function (mm, ii) {
                                return (
                                    <li key={mm.goodsId}>{mm.goodsName}</li>
                                );
                            })}
                        </ul>
                    )
                })}
            </div>
        )
    }
});
var Controller = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            models: [],
            curIndex: 0,
            pageNums: []
        };
    },
    componentDidMount: function () {
        this.load(0, 1, 1);
        this.events();
    },
    events: function () {
        var that = this;
        var resizeTimer = null;
        $(window).on('scroll', function () {
            if (resizeTimer) {
                clearTimeout(resizeTimer)
            }
            resizeTimer = setTimeout(function () {
                var i = that.state.curIndex;
                var pageNums = that.state.pageNums;
                var triggerSize = 200;
                var winH = $(window).height();
                var docH = $(document).height();
                var scrollTop = $(window).scrollTop();
                if (winH + scrollTop + triggerSize >= docH) {
                    that.load(i, i + 1, pageNums[i] + 1);
                }
            }, 700);
        });
    },
    load: function (i, id, page) {
        var that = this;
        var nModels = this.state.models || [];
        var pageNums = this.state.pageNums || [];
        util.api({
            url: '/weixin/info/goods',
            data: {
                page: page,
                pageSize: 30,
                cateId: id
            },
            beforeSend: function () {
                that.setState({
                    loading: true
                });
            },
            success: function (responseData) {
                var data = responseData.result.data || [];
                var cur_page = Number(responseData.result.cur_page);
                pageNums[i] = cur_page;
                if (!nModels[i]) {
                    nModels[i] = data;
                } else {
                    nModels[i] = nModels[i].concat(data);
                }
                that.setState({
                    models: nModels,
                    loading: false,
                    pageNums: pageNums
                })
            }
        });
    },
    getIndex: function (i) {
        var models = this.state.models;
        if (i != this.state.curIndex && !models[i]) {
            this.load(i, i + 1, 1)
        }
        this.setState({
            curIndex: i
        });
    },
    seachList: function (keyWorld) {
        console.log(keyWorld)
    },
    render: function () {
        return (
            <div >
                <SeachBar seachList={this.seachList}/>
                <MenuBar getIndex={this.getIndex}/>
                <List models={this.state.models} curIndex={this.state.curIndex}/>
                {this.state.loading && <div className="loading-wrap"><div className="loading"></div></div>}
            </div>
        );
    }
});

$(function () {
    ReactDOM.render(
        <Controller />,
        document.getElementById('container')
    );
});
module.exports = {};
