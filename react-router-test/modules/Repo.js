/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
import React from 'react'

export default React.createClass({
    render() {
        return (
            <div>
                <h2>{this.props.params.repoName}</h2>
            </div>
        )
    }
})