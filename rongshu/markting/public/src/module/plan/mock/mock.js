/**
 * Author LLJ
 * Date 2016-5-13 13:46
 */
function randomNum() {
    return Math.random() > 0.5 ? Math.ceil(Math.random() * 10) : Math.ceil(Math.random() * 50);
}
var DEFAULTURL = BASE_PATH + '/html/activity/plan-iframe.html';
var GROUPURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';

var data1 = {
    "1463119297731": {
        "switch": [],
        "ends": {"1463119300812": {"id": "1463119300812", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463119297731",
        "nodeType": "trigger",
        "itemType": "timer-trigger",
        "icon": "&#xe63f;",
        "url": TRIGGERURL,
        "x": "269px",
        "y": "8px",
        "info": {
            "name": "ddddd",
            "startDate": "5 五月, 2016",
            "startTime": "3:57 PM",
            "endDate": "14 五月, 2016",
            "endTime": "3:57 PM",
            "desc": "5 五月, 2016 3:57 PM"
        }
    },
    "1463119300812": {
        "switch": [],
        "ends": {"1463119319114": {"id": "1463119319114", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463119300812",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "icon": "&#xe63f;",
        "x": "122px",
        "y": "183px",
        "info": {
            "name": "ddddd",
            "select": "1",
            "selectText": "人群1",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "人群1"
        }
    },
    "1463119314665": {
        "switch": [{
            "id": "1463119329065",
            "drawType": "curveTriangle",
            "drawColor": "#65bb43"
        }, {"id": "1463119330643", "drawType": "curveTriangle", "drawColor": "#e64646"}],
        "ends": {},
        "id": "1463119314665",
        "nodeType": "decisions",
        "itemType": "wechat-send",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "160px",
        "y": "392px",
        "info": {
            "name": "ddddd",
            "publicNumber": "1",
            "publicNumberText": "wxgzh2016",
            "img": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "wxgzh2016"
        }
    },
    "1463119319114": {
        "switch": [{
            "id": "1463119327786",
            "drawType": "curveTriangle",
            "drawColor": "#65bb43"
        }, {"id": "1463119314665", "drawType": "curveTriangle", "drawColor": "#e64646"}],
        "ends": {},
        "id": "1463119319114",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "471px",
        "y": "79px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "wxgzh2016",
            "img": "1",
            "time": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "wxgzh2016"
        }
    },
    "1463119327786": {
        "switch": [],
        "ends": {},
        "id": "1463119327786",
        "nodeType": "activity",
        "itemType": "wait-set",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "332px",
        "y": "543px",
        "info": {
            "name": "dddddd",
            "desc": "1小时",
            "refresh1": "1",
            "refresh2": "hour",
            "refresh2Text": "小时",
            "radio": "relative",
            "date": "",
            "setTime": ""
        }
    },
    "1463119329065": {
        "switch": [],
        "ends": {},
        "id": "1463119329065",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "54px",
        "y": "640px",
        "info": {"name": "dddd", "group": "0", "groupText": "人群1", "desc": "人群1"}
    },
    "1463119330643": {
        "switch": [],
        "ends": {},
        "id": "1463119330643",
        "nodeType": "activity",
        "itemType": "set-tag",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "725px",
        "y": "445px",
        "info": {"name": "rrrrr", "desc": "eeeeeeee"}
    }
};
var tar = [
    {
        "result": [
            "男",
            "女",
            "无值",
            "不限"
        ],
        "name": "性别"
    },
    {
        "result": [
            "小于18",
            "18-25",
            "26-30",
            "31-35",
            "35-40",
            "41-50",
            "51-60",
            "60+",
            "无值",
            "不限"
        ],
        "name": "年龄"
    },
    {
        "result": [
            "父亲",
            "母亲",
            "(外)祖父母",
            "其他",
            "无值",
            "不限"
        ],
        "name": "家庭角色"
    },
    {
        "result": [
            "已婚",
            "单身",
            "无值",
            "不限"
        ],
        "name": "婚姻状况"
    },
    {
        "result": [
            "0-5万",
            "5-10万",
            "10-20万",
            "20-40万",
            "40万以上",
            "无值",
            "不限"
        ],
        "name": "个人年收入范围"
    },
    {
        "result": [
            "1",
            "2",
            "3",
            "4~5",
            "6及以上",
            "无值",
            "不限"
        ],
        "name": "家庭人口数量"
    },
    {
        "result": [
            "0-5万",
            "5-10万",
            "10-20万",
            "20-40万",
            "40万以上",
            "无值",
            "不限"
        ],
        "name": "家庭收入范围"
    },
    {
        "result": [
            "备孕",
            "孕早期",
            "孕中期",
            "孕晚期",
            "已育",
            "无值",
            "不限"
        ],
        "name": "孕产状态"
    },
    {
        "result": [
            "1",
            "2",
            "3及以上",
            "无值",
            "不限"
        ],
        "name": "宝宝数量"
    },
    {
        "result": [
            "0-6月",
            "7-12月",
            "1-2岁",
            "2-3岁",
            "4-6岁",
            "6岁及以上",
            "无值",
            "不限"
        ],
        "name": "宝宝年龄"
    },
    {
        "result": [
            "男",
            "女",
            "无值",
            "不限"
        ],
        "name": "宝宝性别"
    },
    {
        "result": [
            "VIP",
            "高级",
            "普通",
            "无值",
            "不限"
        ],
        "name": "会员级别"
    },
    {
        "result": [
            "新",
            "活跃",
            "睡眠",
            "流失",
            "无值",
            "不限"
        ],
        "name": "会员生命周期定义"
    },
    {
        "result": [
            "0-100",
            "100-500",
            "500-1000",
            "1000-5000",
            "5000-10000",
            "10000+",
            "无值",
            "不限"
        ],
        "name": "会员积分余额"
    },
    {
        "result": [
            "1000积分兑换奶瓶",
            "2000积分兑换高级奶粉",
            "5000积分兑换儿童汽车",
            "无值",
            "不限"
        ],
        "name": "会员可兑换权益"
    },
    {
        "result": [
            "是",
            "否",
            "无值",
            "不限"
        ],
        "name": "是否曾兑换过积分"
    },
    {
        "result": [
            "北京市",
            "上海市",
            "天津市",
            "河北省石家庄",
            "河北省秦皇岛岁",
            "河北省廊坊",
            "辽宁省沈阳",
            "陕西省西安",
            "陕西省咸阳",
            "四川省成都",
            "四川省绵阳",
            "山东省青岛",
            "山东省潍坊",
            "山东省济南",
            "湖北省武汉",
            "无值",
            "不限"
        ],
        "name": "居住位置"
    },
    {
        "result": [
            "北京市",
            "上海市",
            "天津市",
            "河北省石家庄",
            "河北省秦皇岛岁",
            "河北省廊坊",
            "辽宁省沈阳",
            "陕西省西安",
            "陕西省咸阳",
            "四川省成都",
            "四川省绵阳",
            "山东省青岛",
            "山东省潍坊",
            "山东省济南",
            "湖北省武汉",
            "无值",
            "不限"
        ],
        "name": "工作位置"
    },
    {
        "result": [
            "北京市天香居",
            "上海市听雨轩",
            "天津市缥缈楼",
            "河北省石家庄卧龙居",
            "河北省秦皇岛神凤阁",
            "河北省廊坊玄武厅",
            "辽宁省沈阳轩辕居",
            "陕西省西安倚天阁",
            "陕西省咸阳闻香楼",
            "四川省成都静雅斋",
            "四川省绵阳明月厅",
            "山东省青岛清风店",
            "山东省潍坊蕴英阁",
            "山东省济南晨露居",
            "湖北省武汉童心坊",
            "无值",
            "不限"
        ],
        "name": "距离最近的接触点"
    },
    {
        "result": [
            "孕妇及妈妈用品-妈妈营养",
            "孕妇及妈妈用品-妈妈护肤",
            "孕妇及妈妈用品-妈妈用品",
            "孕妇及妈妈用品-哺乳用品",
            "孕妇及妈妈用品-服装服饰",
            "宝宝营养品-奶粉",
            "宝宝营养品-辅食",
            "宝宝营养品-营养品",
            "宝宝穿靓装-婴装",
            "宝宝穿靓装-童装",
            "宝宝穿靓装-童袜",
            "宝宝穿靓装-童鞋",
            "无值",
            "不限"
        ],
        "name": "曾购买的品类"
    },
    {
        "result": [
            "惠氏",
            "美赞臣",
            "雀巢",
            "伊利",
            "雅培",
            "十月天使",
            "开丽",
            "美德乐",
            "大卫",
            "纽澈",
            "嘉宝",
            "英氏",
            "歌瑞贝儿",
            "歌瑞贝儿",
            "韦特儿vitalBaby",
            "无值",
            "不限"
        ],
        "name": "曾购买的品牌"
    },
    {
        "result": [
            "官网",
            "APP",
            "wechat微店",
            "乐海淘",
            "京东",
            "亚马逊",
            "其他电商平台",
            "乐友孕婴童连锁店（自营）",
            "乐友孕婴童连锁店（加盟）",
            "无值",
            "不限"
        ],
        "name": "曾购买的渠道"
    },
    {
        "result": [
            "1周内",
            "1-3周",
            "3-4周",
            "一月以上",
            "无值",
            "不限"
        ],
        "name": "最近一次购买间隔"
    },
    {
        "result": [
            "孕妇及妈妈用品-妈妈营养",
            "孕妇及妈妈用品-妈妈护肤",
            "孕妇及妈妈用品-妈妈用品",
            "孕妇及妈妈用品-哺乳用品",
            "孕妇及妈妈用品-服装服饰",
            "宝宝营养品-奶粉",
            "宝宝营养品-辅食",
            "宝宝营养品-营养品",
            "宝宝穿靓装-婴装",
            "宝宝穿靓装-童装",
            "宝宝穿靓装-童袜",
            "宝宝穿靓装-童鞋",
            "无值",
            "不限"
        ],
        "name": "最近一次购买的品类"
    },
    {
        "result": [
            "惠氏",
            "美赞臣",
            "雀巢",
            "伊利",
            "雅培",
            "十月天使",
            "开丽",
            "美德乐",
            "大卫",
            "纽澈",
            "嘉宝",
            "英氏",
            "歌瑞贝儿",
            "歌瑞贝儿",
            "韦特儿vitalBaby",
            "无值",
            "不限"
        ],
        "name": "最近一次购买的品牌"
    },
    {
        "result": [
            "官网",
            "APP",
            "wechat微店",
            "乐海淘",
            "京东",
            "亚马逊",
            "其他电商平台",
            "乐友孕婴童连锁店（自营）",
            "乐友孕婴童连锁店（加盟）",
            "无值",
            "不限"
        ],
        "name": "最近一次购买的渠道"
    },
    {
        "result": [
            "0-5K",
            "5k-10K",
            "1W-2W",
            "2W-5W",
            "5W以上",
            "无值",
            "不限"
        ],
        "name": "总交易金额"
    },
    {
        "result": [
            "高",
            "中",
            "低",
            "无值",
            "不限"
        ],
        "name": "总交易频次"
    },
    {
        "result": [
            "0-10次",
            "10次-20次",
            "20-50次",
            "50-100次",
            "100次以上",
            "无值",
            "不限"
        ],
        "name": "总交易数量"
    },
    {
        "result": [
            "0-50元",
            "50-100元",
            "100-200元",
            "200-500元",
            "500-1000元",
            "1000元以上",
            "无值",
            "不限"
        ],
        "name": "客单价"
    },
    {
        "result": [
            "1K以下",
            "1K-2K",
            "2K-5K",
            "5K以上",
            "无值",
            "不限"
        ],
        "name": "年均交易金额"
    },
    {
        "result": [
            "高",
            "中",
            "低",
            "无值",
            "不限"
        ],
        "name": "年均交易频次"
    },
    {
        "result": [
            "50次以下",
            "50-100次",
            "100-150次",
            "150-200次",
            "200-300次",
            "300次以上",
            "无值",
            "不限"
        ],
        "name": "年均交易数量"
    },
    {
        "result": [
            "孕妇及妈妈用品-妈妈营养",
            "孕妇及妈妈用品-妈妈护肤",
            "孕妇及妈妈用品-妈妈用品",
            "孕妇及妈妈用品-哺乳用品",
            "孕妇及妈妈用品-服装服饰",
            "宝宝营养品-奶粉",
            "宝宝营养品-辅食",
            "宝宝营养品-营养品",
            "宝宝穿靓装-婴装",
            "宝宝穿靓装-童装",
            "宝宝穿靓装-童袜",
            "宝宝穿靓装-童鞋",
            "无值",
            "不限"
        ],
        "name": "购买品类偏好"
    },
    {
        "result": [
            "惠氏",
            "美赞臣",
            "雀巢",
            "伊利",
            "雅培",
            "十月天使",
            "开丽",
            "美德乐",
            "大卫",
            "纽澈",
            "嘉宝",
            "英氏",
            "歌瑞贝儿",
            "歌瑞贝儿",
            "韦特儿vitalBaby",
            "无值",
            "不限"
        ],
        "name": "购买品牌偏好"
    },
    {
        "result": [
            "官网",
            "APP",
            "wechat微店",
            "乐海淘",
            "京东",
            "亚马逊",
            "其他电商平台",
            "乐友孕婴童连锁店（自营）",
            "乐友孕婴童连锁店（加盟）",
            "无值",
            "不限"
        ],
        "name": "渠道偏好"
    },
    {
        "result": [
            "高",
            "中",
            "低",
            "无值",
            "不限"
        ],
        "name": "购买产品档次偏好"
    },
    {
        "result": [
            "移动端",
            "PC端",
            "无值",
            "不限"
        ],
        "name": "设备偏好"
    },
    {
        "result": [
            "优惠券",
            "买赠",
            "折扣",
            "包邮",
            "其他电商平台",
            "无值",
            "不限"
        ],
        "name": "促销机制偏好"
    },
    {
        "result": [
            "是",
            "否",
            "无值",
            "不限"
        ],
        "name": "曾经投诉"
    },
    {
        "result": [
            "是",
            "否",
            "无值",
            "不限"
        ],
        "name": "曾经退换货"
    },
    {
        "result": [
            "十月天使",
            "开丽",
            "纽澈",
            "惠氏",
            "美赞臣",
            "雀巢",
            "无值",
            "不限"
        ],
        "name": "曾经中/差评的品牌"
    },
    {
        "result": [
            "短信",
            "EDM",
            "直邮",
            "官网",
            "APP",
            "乐友孕婴童企业服务号",
            "乐友孕婴童订阅号(各分公司)",
            "乐友导购自营微信群",
            "乐友孕婴童官方微博",
            "淘宝旺旺",
            "媒体投放",
            "无值",
            "不限"
        ],
        "name": "可选择的接触点"
    },
    {
        "result": [
            "短信",
            "EDM",
            "直邮",
            "官网",
            "APP",
            "乐友孕婴童企业服务号",
            "乐友孕婴童订阅号(各分公司)",
            "乐友导购自营微信群",
            "乐友孕婴童官方微博",
            "淘宝旺旺",
            "媒体投放",
            "无值",
            "不限"
        ],
        "name": "用户招募来源"
    },
    {
        "result": [
            "短信",
            "EDM",
            "直邮",
            "官网",
            "APP",
            "乐友孕婴童企业服务号",
            "乐友孕婴童订阅号(各分公司)",
            "乐友导购自营微信群",
            "乐友孕婴童官方微博",
            "淘宝旺旺",
            "媒体投放",
            "无值",
            "不限"
        ],
        "name": "曾经互动的平台"
    },
    {
        "result": [
            "周末大促销",
            "国庆狂欢",
            "满月宴请",
            "中秋团圆",
            "合家欢乐年",
            "无值",
            "不限"
        ],
        "name": "曾经参与的活动"
    },
    {
        "result": [
            "短信",
            "EDM",
            "直邮",
            "官网",
            "APP",
            "乐友孕婴童企业服务号",
            "乐友孕婴童订阅号(各分公司)",
            "乐友导购自营微信群",
            "乐友孕婴童官方微博",
            "淘宝旺旺",
            "媒体投放",
            "无值",
            "不限"
        ],
        "name": "最近一次互动的平台"
    },
    {
        "result": [
            "周末大促销",
            "国庆狂欢",
            "满月宴请",
            "中秋团圆",
            "合家欢乐年",
            "无值",
            "不限"
        ],
        "name": "最近一次参与的活动"
    },
    {
        "result": [
            "高",
            "中",
            "低",
            "沉睡",
            "无值",
            "不限"
        ],
        "name": "用户活跃度"
    },
    {
        "result": [
            "短信",
            "EDM",
            "直邮",
            "官网",
            "APP",
            "乐友孕婴童企业服务号",
            "乐友孕婴童订阅号(各分公司)",
            "乐友导购自营微信群",
            "乐友孕婴童官方微博",
            "淘宝旺旺",
            "媒体投放",
            "无值",
            "不限"
        ],
        "name": "触达渠道偏好"
    },
    {
        "result": [
            "短信",
            "EDM",
            "直邮",
            "官网",
            "APP",
            "乐友孕婴童企业服务号",
            "乐友孕婴童订阅号(各分公司)",
            "乐友导购自营微信群",
            "乐友孕婴童官方微博",
            "淘宝旺旺",
            "媒体投放",
            "无值",
            "不限"
        ],
        "name": "互动渠道偏好"
    },
    {
        "result": [
            "移动端",
            "PC端",
            "无值",
            "不限"
        ],
        "name": "设备偏好"
    },
    {
        "result": [
            "讲座",
            "优惠促销",
            "宝宝玩",
            "家长线下联谊会",
            "无值",
            "不限"
        ],
        "name": "互动机制偏好"
    },
    {
        "result": [
            "高",
            "中",
            "低",
            "无值",
            "不限"
        ],
        "name": "交易价值细分"
    },
    {
        "result": [
            "成为会员",
            "购物",
            "听微信讲座",
            "反馈产品使用效果",
            "无值",
            "不限"
        ],
        "name": "用户行为细分"
    },
    {
        "result": [
            "高",
            "中",
            "低",
            "无值",
            "不限",
            "无值",
            "不限"
        ],
        "name": "用户口碑价值细分"
    },
    {
        "result": [
            "孕妇及妈妈用品-服装服饰",
            "宝宝营养品-奶粉",
            "宝宝用什么-寝具用品",
            "无值",
            "不限"
        ],
        "name": "很可能购买的品类"
    },
    {
        "result": [
            "伊利",
            "嘉宝",
            "歌瑞贝儿",
            "无值",
            "不限"
        ],
        "name": "很可能购买的品牌"
    },
    {
        "name": "自定义",
        "result": [
            "新产品尝鲜用户",
            "口碑传播用户",
            "新产品首发购买用户",
            "新产品满意用户"
        ]
    }
];
//完成
var data2 = {
    "1463568158807": {
        "switch": [],
        "ends": {
            "1463724617708": {"id": "1463724617708", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463724619406": {"id": "1463724619406", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463724621612": {"id": "1463724621612", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463724623703": {"id": "1463724623703", "drawType": "curveTriangle", "drawColor": "#787878"}
        },
        "id": "1463568158807",
        "num": 0,
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "693px",
        "y": "130px",
        "info": {
            "name": "",
            "select": "1",
            "selectText": "乐友母婴童测试白名单",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "乐友母婴童测试白名单"
        }
    },
    "1463724545877": {
        "num": 5,
        "switch": [],
        "ends": {"1463568158807": {"id": "1463568158807", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463724545877",
        "nodeType": "trigger",
        "itemType": "manual-trigger",
        "url": TRIGGERURL,
        "x": "693px",
        "y": "28px"
    },
    "1463724617708": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724617708",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "373px",
        "y": "258px",
        "info": {
            "name": "",
            "imgSelect": "1",
            "imgSelectText": "待产商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "待产商品促销"
        }
    },
    "1463724619406": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724619406",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "602px",
        "y": "340px",
        "info": {
            "name": "",
            "imgSelect": "2",
            "imgSelectText": "准妈妈商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "准妈妈商品促销"
        }
    },
    "1463724621612": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724621612",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "837px",
        "y": "345px",
        "info": {
            "name": "",
            "imgSelect": "3",
            "imgSelectText": "新生宝宝商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新生宝宝商品促销"
        }
    },
    "1463724623703": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724623703",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "1085px",
        "y": "256px",
        "info": {
            "name": "",
            "imgSelect": "4",
            "imgSelectText": "宝宝用品玩具促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "宝宝用品玩具促销"
        }
    }
};
var data3 = {
    "1463726083810": {
        "num": 4,
        "switch": [],
        "ends": {
            "1463726102348": {"id": "1463726102348", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463726104204": {"id": "1463726104204", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463726106286": {"id": "1463726106286", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463726108558": {"id": "1463726108558", "drawType": "curveTriangle", "drawColor": "#787878"}
        },
        "id": "1463726083810",
        "nodeType": "trigger",
        "itemType": "timer-trigger",
        "url": TRIGGERURL,
        "x": "689px",
        "y": "65px",
        "info": {
            "name": "",
            "startDate": "27 五月, 2016",
            "startTime": "12:00 AM",
            "endDate": "5 六月, 2016",
            "endTime": "12:00 PM",
            "desc": "27 五月, 2016 12:00 AM"
        }
    },
    "1463726102348": {
        "num": 15,
        "switch": [],
        "ends": {"1463726133770": {"id": "1463726133770", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726102348",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "385px",
        "y": "176px",
        "info": {
            "name": "",
            "select": "5",
            "selectText": ">8个月孕龄的孕期准妈妈",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": ">8个月孕龄的孕期准妈妈",
            "BASEPATH": ""
        }
    },
    "1463726104204": {
        "num": 10,
        "switch": [],
        "ends": {"1463726136268": {"id": "1463726136268", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726104204",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "614px",
        "y": "175px",
        "info": {
            "name": "",
            "select": "6",
            "selectText": "<8个月孕龄的孕期准妈妈",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "<8个月孕龄的孕期准妈妈",
            "BASEPATH": ""
        }
    },
    "1463726106286": {
        "num": 5,
        "switch": [],
        "ends": {"1463726138686": {"id": "1463726138686", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726106286",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "836px",
        "y": "175px",
        "info": {
            "name": "",
            "select": "7",
            "selectText": "0~6个月新妈妈爸爸",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "0~6个月新妈妈爸爸",
            "BASEPATH": ""
        }
    },
    "1463726108558": {
        "num": 1,
        "switch": [],
        "ends": {"1463726141453": {"id": "1463726141453", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726108558",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "1065px",
        "y": "173px",
        "info": {
            "name": "",
            "select": "8",
            "selectText": "6~24个月宝宝父母",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "6~24个月宝宝父母",
            "BASEPATH": ""
        }
    },
    "1463726133770": {
        "num": 4,
        "switch": [],
        "ends": {"1463726152804": {"id": "1463726152804", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726133770",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "429px",
        "y": "300px",
        "info": {
            "name": "",
            "imgSelect": "1",
            "imgSelectText": "待产商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "待产商品促销"
        }
    },
    "1463726136268": {
        "num": 1,
        "switch": [],
        "ends": {"1463726155336": {"id": "1463726155336", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726136268",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "662px",
        "y": "310px",
        "info": {
            "name": "",
            "imgSelect": "2",
            "imgSelectText": "准妈妈商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "准妈妈商品促销"
        }
    },
    "1463726138686": {
        "num": 33,
        "switch": [],
        "ends": {"1463726157652": {"id": "1463726157652", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726138686",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "896px",
        "y": "308px",
        "info": {
            "name": "",
            "imgSelect": "3",
            "imgSelectText": "新生宝宝商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新生宝宝商品促销"
        }
    },
    "1463726141453": {
        "num": 5,
        "switch": [],
        "ends": {"1463726160510": {"id": "1463726160510", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726141453",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "1131px",
        "y": "310px",
        "info": {
            "name": "",
            "imgSelect": "4",
            "imgSelectText": "宝宝用品玩具促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "宝宝用品玩具促销"
        }
    },
    "1463726152804": {
        "num": 2,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726152804",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "382px",
        "y": "413px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "待产商品促销"
        }
    },
    "1463726155336": {
        "num": 9,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726155336",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "621px",
        "y": "410px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "准妈妈商品促销"
        }
    },
    "1463726157652": {
        "num": 6,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726157652",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "845px",
        "y": "409px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "新生宝宝商品促销"
        }
    },
    "1463726160510": {
        "num": 1,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726160510",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "1079px",
        "y": "413px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "宝宝用品玩具促销"
        }
    },
    "1463726165888": {
        "num": 2,
        "switch": [],
        "ends": {"1463726173460": {"id": "1463726173460", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726165888",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "711px",
        "y": "549px",
        "info": {
            "name": "",
            "desc": "28 五月, 201612:00 AM",
            "refresh1": "1",
            "refresh2": "no-sel",
            "refresh2Text": "请选择",
            "radio": "specify",
            "date": "28 五月, 2016",
            "setTime": "12:00 AM"
        }
    },
    "1463726173460": {
        "num": 3,
        "switch": [{"id": "1463726191110", "drawType": "curveTriangle", "drawColor": "#65bb43"}, {
            "id": "1463726193945",
            "drawType": "curveTriangle",
            "drawColor": "#e64646"
        }],
        "ends": {},
        "id": "1463726173460",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "714px",
        "y": "650px",
        "info": {
            "name": "",
            "fitSelect": "0",
            "fitSelectText": "",
            "tags": ["1周内", "孕妇及妈妈用品-哺乳用品", "惠氏"],
            "desc": "1周内..."
        }
    },
    "1463726191110": {
        "num": 4,
        "switch": [],
        "ends": {},
        "id": "1463726191110",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "url": "/html/activity/plan-iframe.html",
        "x": "547px",
        "y": "736px",
        "info": {"name": "", "group": "1", "groupText": "周末促销消费会员", "desc": "周末促销消费会员"}
    },
    "1463726193945": {
        "num": 1,
        "switch": [],
        "ends": {},
        "id": "1463726193945",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "url": "/html/activity/plan-iframe.html",
        "x": "870px",
        "y": "736px",
        "info": {"name": "", "group": "2", "groupText": "周末促销未消费会员", "desc": "周末促销未消费会员"}
    }
};
var data4 = {
    "1463726438304": {
        "num": 18,
        "switch": [],
        "ends": {"1463726443230": {"id": "1463726443230", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726438304",
        "nodeType": "trigger",
        "itemType": "timer-trigger",
        "url": TRIGGERURL,
        "x": "690px",
        "y": "14px",
        "info": {
            "name": "",
            "startDate": "1 七月, 2016",
            "startTime": "12:00 AM",
            "endDate": "15 七月, 2016",
            "endTime": "12:00 PM",
            "desc": "1 七月, 2016 12:00 AM"
        }
    },
    "1463726443230": {
        "num": 48,
        "switch": [],
        "ends": {"1463726460926": {"id": "1463726460926", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726443230",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": "http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated",
        "x": "692px",
        "y": "101px",
        "info": {
            "name": "",
            "select": "9",
            "selectText": "7-12个月宝宝的会员",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "7-12个月宝宝的会员",
            "BASEPATH": ""
        }
    },
    "1463726460926": {
        "num": 46,
        "switch": [{"id": "1463726468554", "drawType": "curveTriangle", "drawColor": "#65bb43"}, {
            "id": "1463726471535",
            "drawType": "curveTriangle",
            "drawColor": "#e64646"
        }],
        "ends": {},
        "id": "1463726460926",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "701px",
        "y": "198px",
        "info": {"name": "", "fitSelect": "0", "fitSelectText": "", "tags": ["宝宝营养品-营养品"], "desc": "宝宝营养品-营养品"}
    },
    "1463726468554": {
        "num": 7,
        "switch": [],
        "ends": {"1463726474944": {"id": "1463726474944", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726468554",
        "nodeType": "activity",
        "itemType": "send-h5",
        "url": "/html/activity/plan-iframe.html",
        "x": "570px",
        "y": "294px",
        "info": {
            "name": "",
            "h5Select": "1",
            "h5SelectText": "婴儿辅食产品试用装赠送",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "perSelect": "no-sel",
            "perSelectText": "请选择",
            "groupSelect": "1",
            "groupSelectText": "不限",
            "desc": "婴儿辅食产品试用装赠送"
        }
    },
    "1463726471535": {
        "num": 5,
        "switch": [],
        "ends": {"1463726477339": {"id": "1463726477339", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726471535",
        "nodeType": "activity",
        "itemType": "send-h5",
        "url": "/html/activity/plan-iframe.html",
        "x": "829px",
        "y": "290px",
        "info": {
            "name": "",
            "h5Select": "2",
            "h5SelectText": "3~24个月宝宝营养搭配微信群讲座",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "perSelect": "no-sel",
            "perSelectText": "请选择",
            "groupSelect": "1",
            "groupSelectText": "不限",
            "desc": "3~24个月宝宝营养搭配微信群讲座"
        }
    },
    "1463726474944": {
        "num": 3,
        "switch": [],
        "ends": {"1463726484326": {"id": "1463726484326", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726474944",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "577px",
        "y": "381px",
        "info": {
            "name": "",
            "desc": "3天",
            "refresh1": "3",
            "refresh2": "day",
            "refresh2Text": "天",
            "radio": "relative",
            "date": "",
            "setTime": ""
        }
    },
    "1463726477339": {
        "num": 3,
        "switch": [],
        "ends": {"1463726488028": {"id": "1463726488028", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726477339",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "834px",
        "y": "384px",
        "info": {
            "name": "",
            "desc": "5天",
            "refresh1": "5",
            "refresh2": "day",
            "refresh2Text": "天",
            "radio": "relative",
            "date": "",
            "setTime": ""
        }
    },
    "1463726484326": {
        "num": 49,
        "switch": [],
        "ends": {"1463726492755": {"id": "1463726492755", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726484326",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "567px",
        "y": "479px",
        "info": {
            "name": "",
            "imgSelect": "5",
            "imgSelectText": "婴儿辅食产品试用装赠送",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "婴儿辅食产品试用装赠送"
        }
    },
    "1463726488028": {
        "num": 4,
        "switch": [],
        "ends": {"1463726492755": {"id": "1463726492755", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726488028",
        "nodeType": "activity",
        "itemType": "send-msg",
        "url": "/html/activity/plan-iframe.html",
        "x": "839px",
        "y": "485px",
        "info": {"name": "", textarea:"新产品电子券 H5Z900201X007","desc": "新产品电子券 H5Z900201X007"}
    },
    "1463726492755": {
        "num": 32,
        "switch": [],
        "ends": {"1463726499074": {"id": "1463726499074", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726492755",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "712px",
        "y": "572px",
        "info": {
            "name": "",
            "desc": "14 七月, 201612:00 AM",
            "refresh1": "1",
            "refresh2": "no-sel",
            "refresh2Text": "请选择",
            "radio": "specify",
            "date": "14 七月, 2016",
            "setTime": "12:00 AM"
        }
    },
    "1463726499074": {
        "num": 7,
        "switch": [{"id": "1463726504429", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726499074",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "715px",
        "y": "655px",
        "info": {"name": "", "fitSelect": "no-sel", "fitSelectText": "", "tags": ["新产品首发购买用户"], "desc": "新产品首发购买用户"}
    },
    "1463726504429": {
        "num": 5,
        "switch": [],
        "ends": {"1463726518064": {"id": "1463726518064", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726504429",
        "nodeType": "activity",
        "itemType": "set-tag",
        "url": "/html/activity/plan-iframe.html",
        "x": "708px",
        "y": "750px",
        "info": {"name": "", "desc": "新产品尝鲜者"}
    },
    "1463726518064": {
        "num": 10,
        "switch": [],
        "ends": {"1463726528393": {"id": "1463726528393", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726518064",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "707px",
        "y": "836px",
        "info": {
            "name": "",
            "imgSelect": "9",
            "imgSelectText": "新产品满意度调查",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新产品满意度调查"
        }
    },
    "1463726528393": {
        "num": 17,
        "switch": [{"id": "1463726543107", "drawType": "curveTriangle", "drawColor": "#65bb43"}, {
            "id": "1463726554513",
            "drawType": "curveTriangle",
            "drawColor": "#e64646"
        }],
        "ends": {},
        "id": "1463726528393",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "708px",
        "y": "915px",
        "info": {"name": "", "fitSelect": "no-sel", "fitSelectText": "", "tags": ["新产品满意用户"], "desc": "新产品满意用户"}
    },
    "1463726543107": {
        "num": 2,
        "switch": [],
        "ends": {"1463726566844": {"id": "1463726566844", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726543107",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "573px",
        "y": "1013px",
        "info": {
            "name": "",
            "imgSelect": "10",
            "imgSelectText": "新产品品牌传播图文",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新产品品牌传播图文"
        }
    },
    "1463726554513": {
        "num": 18,
        "switch": [],
        "ends": {},
        "id": "1463726554513",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "url": "/html/activity/plan-iframe.html",
        "x": "832px",
        "y": "1013px",
        "info": {"name": "", "group": "3", "groupText": "新产品回访用户", "desc": "新产品回访用户"}
    },
    "1463726566844": {
        "num": 6,
        "switch": [{"id": "1463726572873", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726566844",
        "nodeType": "decisions",
        "itemType": "wechat-forwarded",
        "url": "/html/activity/plan-iframe.html",
        "x": "570px",
        "y": "1099px",
        "info": {
            "name": "",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "imgSelect": "10",
            "imgSelectText": "新产品品牌传播图文",
            "numSelectText": "",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "乐友孕婴童 "
        }
    },
    "1463726572873": {
        "num": 3,
        "switch": [],
        "ends": {},
        "id": "1463726572873",
        "nodeType": "activity",
        "itemType": "set-tag",
        "url": "/html/activity/plan-iframe.html",
        "x": "569px",
        "y": "1191px",
        "info": {"name": "", "desc": "口碑传播者"}
    }
};
module.exports.data1 = data1;
module.exports.data2 = data2;
module.exports.data3 = data3;
module.exports.data4 = data4;
module.exports.tar = tar;