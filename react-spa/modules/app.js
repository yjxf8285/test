/**
 * Created by lxf on 2016-8-31.
 * 框架
 */
import React from 'react'
import Header from '../modules/layout/header';
import Home from '../modules/home/home';

class App extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                {this.props.children || Home}
            </div>
        )
    }
}

export default  App;