/**
 * Created by 刘晓帆 on 2016-4-11.
 * 入口文件
 */
'use strict';
//noinspection JSUnresolvedFunction
var credentials = require('./credentials.js');//证书
var express = require('express');
var app = express();
var bodyParser = require('body-parser');//post的body实现插件
var formidable = require('formidable');//上传插件
var jqupload = require('jquery-file-upload-middleware');
var multipart = require('connect-multiparty');//主流的上传中间件
var multipartMiddleware = multipart();

//实例化handlebars
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        //段落
        section: function (name, options) {
            if (!this._sections)this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);//模板引擎
app.set('view engine', 'handlebars');

var fortunes = {
    "user_token": 1,
    "index": 1,
    "size": 7,
    "md_type": 4,
    "task_id": [1],
    "contact_ids": [],
    "customize_views": [],
    "ver": "1.0.1"
};
function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: '#',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54,1 F (12,3 C)'
            },
            {
                name: 'Bend',
                forecastUrl: '#',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '52,0 F (12,8 C)'
            },
            {
                name: 'Manzanita',
                forecastUrl: '#',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55,0 F (12,8 C)'
            }
        ]
    }
}

//中间件部分
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.use(function (req, res, next) {
    res.cookie('monster', 'nom');
    req.session.userName = 'lxf';
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    req.query.test === '1';

    next();
});

app.use(express.static(__dirname + '/public'));//中间件

app.use(function (req, res, next) {
    //如果有即显消息，把它传到上下文，然后清除
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.use(function (req, res, next) {
    if (!res.locals.partials)res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

//jquery-upload插件
app.use('/upload', function (req, res, next) {
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function () {
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function () {
            return '/uploads/' + now;
        }
    })(req, res, next);
});

//普通上传
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.info(files);
        res.redirect(303, '/thank-you');

    });
});
//路由部分
app.get('/newsletter', function (req, res) {
    res.render('newsletter', {
        csrf: 'csrf token goes here'
    })

});
//post的body实现
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.post('/process', function (req, res) {
    console.log(req.query.form);
    console.log(req.body.name);
    console.log(req.body.email);
    res.redirect(303, '/thank-you');//重定向到thank-you页面
});

//测试文件上传
app.post('/mcupload',multipartMiddleware, function (req, res) {
    console.log(req.body, req.files);
    res.send({
        code:200
    });
    // res.redirect(303, '/thank-you');//重定向到thank-you页面
});

app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) s += name + ':' + req.headers[name] + '\n';
    res.send(s);
});

app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    })
});


//首页
app.get('/', function (req, res) {
    res.render('home')
});
//关于
app.get('/about', function (req, res) {
    // var getData = querystring.parse(urlParsed.query);
    console.info(req.query,'取地址栏参数就这么简单');
    res.render('about', {
        fortune: fortunes,
        pageTestScript: '/qa/tests-about.js'
    })
});
//测试section页面
app.get('/jquerytest', function (req, res) {
    res.render('jquerytest', {})
});
app.get('/jqueryupload', function (req, res) {
    res.render('jqueryupload', {})
});
//谢谢
app.get('/thank-you', function (req, res) {
    res.render('thank-you', {
        fortune: fortunes,
        pageTestScript: '/qa/tests-about.js'
    })
});
app.get('/greeting', function (req, res) {
    res.render('about', {
        message: 'welcome',
        style: req.query.style
        //userid: req.cookie.userid,
        //username: req.session.username
    })
});
//404
app.use(function (req, res) {

    res.status(404);
    res.render('404')
});
//500
app.use(function (err, req, res, next) {
    console.info(err.stack);
    res.status(500);
    res.render('500')
});

app.listen(3000, function () {
    console.log('express started on http://localhost:3000');
});