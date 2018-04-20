/**
 * HTTP响应状态枚举
 *
 * @author qiuwei
 * @date 2016年09月10日
 */
const HTTP_RESPONSE_STATE = {
    SUCCESS: 0,
    // Others failure state
    // ...
};

const HTTP_METHOD = {
    OPTIONS: 'OPTIONS',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};


module.exports = {
    HTTP_RESPONSE_STATE,
    HTTP_METHOD,
};

