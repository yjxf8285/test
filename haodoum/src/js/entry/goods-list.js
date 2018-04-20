/**
 * Created by 仇昕
 * 商品列表
 */
'use strict';

var style = require('../../css/page/goodlist.scss');
var React = require('react');
var ReactDOM = require('react-dom');
var GoodsLists = require('../module/goods-lists');
var tabList = [
    {name: "分类一", id: "1", isHov: "hov"},//todo  命名hov?
    {name: "分类二", id: "2", isHov: ""},
    {name: "分类三", id: "3", isHov: ""},
    {name: "分类四", id: "4", isHov: ""},
    {name: "分类五", id: "5", isHov: ""}
];
var GoodsList = React.createClass({
    getInitialState: function () {
        return {
            tab: []
        };
    },
    //todo  绕圈
    componentWillMount: function () {
        this.setState({tab: this.props.tabList});
    },
    tabClick: function (index) {
        var that = this, tabs = [], displayList = [];//todo 无用
        this.state.tab.map(function (m, i) {
            m.isHov = "";
            if (i == index) {
                m.isHov = "hov"
            }
            tabs = tabs.concat(m);
        });
        that.setState({tab: tabs});
    },
    render: function () {
        return (
            <GoodsListTab tabList={this.state.tab} onTabClick={this.tabClick}/>
        );
    }
});

var GoodsListTab = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    goClick: function (e) {
        var meEl = $(e.currentTarget), gList = this.state.data[meEl.index()], list;//todo 无用
        list = this.state.data;
        list.map(function (m, i) {
            list[i].display = "none";
        });
        this.setState({data: list});
        if (gList) {
            list[meEl.index()].display = "block";
            this.setState({data: list});
        } else {
            this.load(meEl.index(), this.props.tabList[meEl.index()].id, 1);
        }
        this.props.onTabClick(meEl.index());
    },
    componentWillMount: function () {
        this.setComp();
        this.scroll();
    },
    scroll:function(){
        var i,that = this,gList,id;
        util.scrollB(function(){
            that.props.tabList.map(function(m,index){
                if(m.isHov == "hov"){
                    i = index;
                }
            });
            gList = that.state.data[i];
            id = that.props.tabList[i].id;
            if(gList.totalCount > gList.goodsList.length){
                that.load(i, id, (gList.goodsList.length/10)+1);
            }else{
                if ($("body").find('.no-list-data').length > 0) {
                    $("body").find('.no-list-data').html("没有更多了...").removeAttr("no-more");
                }
            }
        });
    },
    setComp: function () {
        var that = this;
        that.load(0, this.props.tabList[0].id, 1);
    },
    load: function (i, id, page) {
        var that = this;
        util.api({
            url: "/weixin/info/goods",
            data: {
                page: page,
                pageSize: 10,
                cateId: id
            },
            success: function (resData) {
                var data = resData.result.data;
                var list, newList;
                if (this.state.data[i]) {
                    list = this.state.data;
                    list[i].goodsList = list[i].goodsList.concat(data);
                    this.setState({data: list});
                } else {
                    list = this.state.data;
                    list[i] = {goodsList: data, display: "block", totalCount: resData.result.total_count};
                    this.setState({data: list});
                }
            }.bind(this)//todo 重复功能
        });
    },
    render: function () {
        var tabNodes = this.props.tabList.map(function (data, i) {
            var hov = data.isHov ? "hov" : "";
            return (
                <div key={i} data-id={data.id} onClick={this.goClick} className={hov}>
                    {data.name}
                </div>
            );
        }.bind(this));
        return (
            <div>
                <div className="goods-list-tab">
                    {tabNodes}
                </div>
                <GoodsLists data={this.state.data}/>
            </div>
        );
    }
});


$(function () {
    ReactDOM.render(
        <GoodsList tabList={tabList}/>,
        document.getElementById('goods-list')
    );
});

