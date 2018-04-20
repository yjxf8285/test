/**
 * Created by lxf on 2016-8-31.
 * Link封装
 */
import React from 'react';
import {Link} from 'react-router';

class NavLink extends React.Component {
    render() {
        return <Link {...this.props} activeClassName="active"  onlyActiveOnIndex={true}/>
    }
}
export default NavLink;