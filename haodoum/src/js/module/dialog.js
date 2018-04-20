/**
 * Created by 仇昕
 * 首页
 */
'use strict';
var React = require('react');
var dialogStyle = require('../../css/page/dialog.scss');

var Dialog = React.createClass({
    getInitialState: function () {
        return {
            data: {}
        }
    },
    componentWillMount: function () {
        this.setState({data: this.props.data});
    },
    componentDidMount: function () {
        this.showDialogHandel();
    },
    showDialogDom(){
        if (!this.state.data.type) {
            return (
                <div className="dialog-common">
                    <div className="dialog-common-content">{this.state.data.content}</div>
                </div>
            );
        } else if (this.state.data.type == 1) {
            return this.showDialogChoice();
        }
    },
    showDialogChoice:function(){
        return (
            <div>
                <div className="dialog-choice"></div>
                <div className="dialog-choice-content">
                    <div className="choice" style={{width:(this.state.data.width == "0")?"auto":this.state.data.width}}>
                        <div className="choice-top">{this.state.data.title}</div>
                        <div className="choice-content">{this.state.data.content}</div>
                        {
                            (this.state.data.cancelBtn)? <div className="choice-btn">
                                <div className="choice-confirm" onClick={this.confirmBind}>{this.state.data.confirmBtn}</div>
                                <div className="choice-cancel" onClick={this.cancelBind}>{this.state.data.cancelBtn}</div>
                            </div> : <div className="choice-confirm" onClick={this.confirmBind}>{this.state.data.confirmBtn}</div>
                        }
                    </div>
                </div>
            </div>
        );
    },
    confirmBind:function(){
        this.hideDialogHandel();
        if (this.state.data.confirmHandel) {
            this.state.data.confirmHandel();
        }
    },
    cancelBind:function(){
        this.hideDialogHandel();
        if (this.state.data.cancelHandel) {
            this.state.data.cancelHandel();
        }
    },
    showDialogHandel(){
        var that = this;
        if (!this.state.data.type && this.state.data.display == "block") {
            $(this.refs.dialogs).animate({opacity: "0"}, that.state.data.showTime, function () {
                that.hideDialogHandel();
                if (that.state.data.commonHandel) {
                    that.state.data.commonHandel();
                }
            })
        }
    },
    hideDialogHandel(){
        var data = this.state.data;
        data.display = "none";
        this.setState({data: data});
    },
    render: function () {
        return (
            <div className="dialog-main" ref="dialogs" style={{opacity:1,display:this.state.data.display}}>
                {this.showDialogDom()}
            </div>
        );
    }
});


module.exports = Dialog;