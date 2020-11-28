/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-11-07 10:28:22
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-08 11:02:46
 */
import user from './user';
import transaction from './transaction';
import constants from './constants';
import card from './card';
import account from './account'
import vendor from './vendor'
import device from './device'
import statement from './statement'
import member from './member'
import ad from './ad'
import recommend from './recommend'
import repayment from './repayment'
import plan from './plan'
import test from './test'
// 这里添加Model
let ma = [
    user,
    transaction,
    constants,
    card,
    account,
    vendor,
    device,
    statement,
    member,
    ad,
    recommend,
    repayment,
    plan,
    test
]

let isRepeat = arr => {
    let h = {},
        r = [],
        k = []
    arr.forEach(m => {
        k.push(...Object.keys(m))
    })
    k.forEach((m, i) => {
        if (h[m]) {
            r.push(m)
        } else {
            h[m] = m
        }
    })
    if (r.length > 0) {
        console.error('发现重复的API定义:', r)
        throw new Error('代码打断');
    }
}
isRepeat(ma)
export default Object.assign({}, ...ma)