/**
 * Created by 刘晓帆 on 2016-4-11.
 *
 */
'use strict';
import React from 'react'
import NavLink from './NavLink'
import { IndexLink, Link } from 'react-router'
export default React.createClass({
    render() {

        return (
            <div>
                <ul role="nav" className="nav nav-pills">
                    <li><NavLink to="/" onlyActiveOnIndex>首页</NavLink></li>
                    <li><NavLink to="/repos">列表页</NavLink></li>
                    <li><NavLink to="/about">关于我</NavLink></li>
                </ul>
                {this.props.children }
            </div>
        )
    }
})






