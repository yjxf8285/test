/**
 * Created by lxf on 2016-8-31.
 */
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
