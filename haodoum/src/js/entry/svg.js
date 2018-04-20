/**
 * Created by 晓帆 on 3/21 021.
 *
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var style = require('../../css/page/svg.scss');
var Controller = React.createClass({
    getInitialState: function () {
        return {name: "click me"};
    },
    onClick: function () {
        this.setState({name: "clicked"});
    },
    render: function () {
        return <div onClick={ this.onClick }>{this.state.name}</div>;
    }
});
$(function () {
    ReactDOM.render(
        <Controller />,
        document.getElementById('container')
    );
    console.info(111)
});

module.exports = {};