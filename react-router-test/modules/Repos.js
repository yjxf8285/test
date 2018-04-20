/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
import React from 'react'
import NavLink from './NavLink'
import { browserHistory } from 'react-router'


export default React.createClass({

    handleSubmit(event) {
        event.preventDefault();
        const userName = event.target.elements[0].value;
        const repo = event.target.elements[1].value;
        const path = `/repos/${userName}/${repo}`;
        console.log(path);
        browserHistory.push(path);
    },
    test(){
        require.ensure(['./r2'], function (require) {
            var module2 = require("./r2");
            //require("./r");
        });
    },
    render() {
        return (
            <div>
                <h2 onClick={this.test}>报告</h2>
                <ul className="nav nav-pills nav-stacked">
                    <li><NavLink to="/repos/reactjs/react-router">子列表1</NavLink></li>
                    <li><NavLink to="/repos/facebook/react">子列表2</NavLink></li>
                    <li>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="用户名"/> / {' '}
                            <input type="text" placeholder="报告"/>{' '}
                            <button type="submit">提交</button>
                        </form>
                    </li>
                </ul>
                {this.props.children}
            </div>
        )
    }
})


