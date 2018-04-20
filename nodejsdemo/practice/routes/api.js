/**
 * Created by liuxiaofan on 2017/3/21.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(1)
    res.send('api');
});

module.exports = router;
