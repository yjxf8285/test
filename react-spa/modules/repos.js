/**
 * Created by lxf on 2016-8-31.
 */
import React from 'react'
import NavLink from '../modules/nav-link';
import { hashHistory } from 'react-router'
export default React.createClass({

    handleSubmit(event) {
        event.preventDefault()
        const userName = event.target.elements[0].value
        const repo = event.target.elements[1].value
        const path = `/repos/${userName}/${repo}`
        hashHistory.push(path)
        console.log(path)
    },

    render() {
        return (
            <div>
                <h2>Repos</h2>
                <ul>
                    <li><NavLink to="/repos/react-router">React Router</NavLink></li>
                    <li><NavLink to="/repos/react">React</NavLink></li>
                    <li>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="userName"/> / {' '}
                            <input type="text" placeholder="repo"/>{' '}
                            <button type="submit">Go</button>
                        </form>
                    </li>
                </ul>
                {this.props.children}
            </div>
        )
    }
})
