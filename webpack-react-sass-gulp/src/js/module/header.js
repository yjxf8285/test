/**
 * Created by zhangfei on 2016/3/2.
 */
//header css 应该放在这边
var React = require('react');
var Header = React.createClass({
    getInitialState: function() {
        return {num: 0};
    },
    render:function(){
        return (
            <header>
                <a href="#" className="tete-homepage"></a>
                <p className="tete-title">{this.props.title}</p>
                <div className="header-right">
                    <a href="#" className="tete-personal"></a>
                    <div className="shopcart-warp">
                        <div className="shopccart-inner">
                            <a href="#" className="tete-shopcart"></a>
                            <i className="shopcarrt-icon">{this.props.num}</i>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
});


module.exports = Header;



