/**
 * Created by 晓帆 on 2/26 026.
 *
 */
'use strict';
import util from '../util';
console.info('page33eee3')
var a = 333333;
$('.content').text(a)
util.api({
    url: '/recmmend/recList',
    data: {
        page: 1,
        pageSize: 10
    },
    success: function (resData) {
        console.info(resData, 'aaa')
    }
});