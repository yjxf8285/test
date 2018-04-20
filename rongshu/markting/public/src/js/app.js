/**
 * Created by 刘晓帆 on 2016-4-11.
 * 全局js
 */
'use strict';
var app = {
    start: function () {
        console.log('app is start..')
    }
}
app.start();
window.app = app;
module.exports = app;
