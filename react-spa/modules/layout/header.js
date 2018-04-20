/**
 * Created by lxf on 2016-8-30.
 * 头部
 */
import React from 'react';
import NavLink from '../../modules/nav-link';
class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="header">
                <ul role="nav" className="clearfix">
                    <li><NavLink to="/">首页</NavLink ></li>
                    <li><NavLink to="/repos">dmp</NavLink></li>
                    <li><NavLink to="/category-list">列表页</NavLink ></li>
                    <li><NavLink to="/detail-page">详情页</NavLink ></li>
                </ul>
            </div>
        )
    }
}
export default Header;
