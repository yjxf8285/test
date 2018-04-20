/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
import React from 'react'

export default React.createClass({
    test(a){
        require.ensure(['./r'], function (require) {
            var module = require("./r");
            //require("./r");
        });
    },

    //114444
    test2(){

    },

    render() {
        var a = 1;
        return (
            <div>
                <div onClick={this.test.bind(this,a)}>关于我</div>
                <div onClick={this.test2}>r2</div>
            </div>
        )
    }
})



