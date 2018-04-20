var React = require('react');
var Hello = React.createClass({
    getInitialState: function () {
        return {name: "点我啊aa"};
    },
    onClick: function () {
        this.setState({name: "点过了啊"});
    },
    render: function () {
        return <div onClick={ this.onClick }>{this.state.name}</div>;
    }
});

module.exports = Hello;
