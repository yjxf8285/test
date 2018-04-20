/**
 * Created by lxf on 2016-8-31.
 * 左侧菜单
 */
import React from 'react';
import {Link} from 'react-router'
class Left extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="layout-left">
                <ul role="nav">
                    <li><Link to="/index">a</Link></li>
                    <li><Link to="/category-list">b</Link></li>
                    <li><Link to="/detail-page">c</Link></li>
                </ul>
            </div>
        )
    }
}
export default Left;