/**
 * Created by 仇昕
 * 登录注册公共头部
 */
'use strict';

var React = require('react');
var LoginHeader = React.createClass({
    render: function () {
        return (
            <p className="login-title">
                {this.props.title}
                <a href="{this.props.link}">{this.props.linkText}</a>
            </p>
        );
    }
});

module.exports = LoginHeader;
