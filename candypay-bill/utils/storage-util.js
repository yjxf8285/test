
function clearTokenCache() {
    wx.setStorageSync('tokenTime', 0)
    wx.setStorageSync('token', '')
}


function isTokenValid() {
    let tokenTime = Number(wx.getStorageSync('tokenTime') || 0)
    let currentTime = new Date().valueOf();
    if ((currentTime - tokenTime) > (24 * 60 * 60 * 1000))
        return false
    else
        return true
}


function setCurrentTokenTime() {
    wx.setStorageSync('tokenTime', new Date().valueOf())
}


function setToken(token) {
    wx.setStorageSync('token', token)
}

function getTokenTime() {
    return Number(wx.getStorageSync('tokenTime') || 0)
}
function getToken() {
    
    return wx.getStorageSync('token') || ''
}

function setUserName(name) {
    wx.setStorageSync('userName', name)
}

function getUserName() {
    return wx.getStorageSync('userName') || ''

}

function setUserAvatar(avatar) {
    wx.setStorageSync('userAvatar', avatar)

}
function getUserAvatar() {
    return wx.getStorageSync('userAvatar') || ''
}

// function setWxLoginCode(code) {
//     wx.setStorageSync('wxLoginCode', code)
// }

// function getWxLoginCode() {
//     return wx.getStorageSync('wxLoginCode') || ''
// }

module.exports = {
    clearTokenCache,
    isTokenValid,
    setCurrentTokenTime,
    setToken,
    getTokenTime,
    getToken,
    setUserName,
    getUserName,
    setUserAvatar,
    getUserAvatar,
}