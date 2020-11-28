/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-07 16:20:58
 */
export default {
    signin: {
        url: 'user/signin',
        method: 'post',
        block: 'beforeSignin'
    },
    signup: {
        url: 'user/signup',
        method: 'post',
        block: 'beforeSignin'
    },
    verification: {
        url: 'user/verification/',
        method: 'get',
        block: 'beforeSignin'

    }
    ,
    ticket: {
        url: 'user/ticket/',
        method: 'get',
        block: 'beforeSignin'
    },
    binding: {
        url: 'user/binding',
        method: 'post',
        block: 'beforeSignin'
    },
    switchModeType: {
        url: 'user/switchModeType',
        method: 'post'
    },
    userDetail:{
        url: 'user/detail',
    },
    realNameAuthentication:{
        url: 'user/verdify',
        method: 'post'
    }
}
