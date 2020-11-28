/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2019-11-11 12:03:07
 */
//链表数据结构，方便快速添加删除
var node = {

};

function wxRelaunch(url, callback) {
    let id = generateParamId(callback)
    wx.reLaunch({
        url: url + '?id=' + id
    })
}

function generateParamId(callback) {
    let currentNode = node;
    while (currentNode.next != null && currentNode.next != undefined) {
        currentNode = currentNode.next
    }
    let id = Math.round(new Date().getTime() / 1000)
    currentNode.id = id
    currentNode.value = callback
    return id
}

function wxRelaunchPageFinish(id, result) {
    // console.log('wxRelaunchPageFinish id = ' + id)
    let currentNode = node;
    do {
        // console.log('current id = ' + currentNode.id)
        if (currentNode.id == id) {
            let callback = currentNode.value
            callback(result)
            //搞定之后删除节点
            if (currentNode.next != undefined && currentNode.next != null) {
                currentNode.id = currentNode.next.id
                currentNode.value = currentNode.next.value
                currentNode.next = currentNode.next.next
            }
            break;
        }
        currentNode = currentNode.next
    }
    while (currentNode != null && currentNode != undefined && currentNode.next != null && currentNode.next != undefined)

}

module.exports = {
    wxRelaunch,
    wxRelaunchPageFinish
}
