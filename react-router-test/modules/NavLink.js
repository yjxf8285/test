/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
    render() {
        return <Link {...this.props} activeClassName="active"/>
    }
})