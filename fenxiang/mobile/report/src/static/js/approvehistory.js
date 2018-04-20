;(function (w, $, r, u) {
    
    var routie = r,
        doc = w.document,
        location = w.location,
        unit = w.unit;

    /**
     * @description历史列表构造函数
     * @constructor
     *
     */
    function List(opt) {
    
        this.opt = $.extend({
        
            wrapper: '#js_arv_l'
            
        }, opt);
        
        this.keyword = '';
        this.pageSize = 10;
        this.pageNumber = 1;
        
        this.clsItems = ['list-trwait', 'list-trpass', 'list-trreject'];
        this.txtItems = ['待审核', '已通过', '驳回'];

        this.wrapper = $(this.opt.wrapper);
        
        this.template = _.template($('#arv-l-tpl').html()); // 渲染模板
        
        this._bindEvents();
    };
    
    
    List.prototype = {
        
        
        constructor: List,
        
        
        /**
         * @description 模板
         * @param {Object}
         * @renturn {String}
         */
        template: _.template($('#arv-l-tpl').html()),
        
        
        /**
         * 绑定事件
         */
        _bindEvents: function () {
            var that = this;
            
            that.wrapper.on('click', 'tr', function() {
                            var $this = $(this),
                                templateId = $this.data('templateid'),
                                batchNo = $this.data('batchno');
                                
                            routie('detail/' + templateId + '/' + batchNo);
                        })
                        .on('click', '.load-more', function() {
                            that.loadMore = true;
                            that.pageNumber = that.pageNumber + 1;
                            that._getListData();
                        });
        },
        
        
        /**
         * @description 获取历史数据
         *
         */
        _getListData: function() {
            var that = this;
            
            unit.api({
                'type': 'get',
                'url': '/W/Baoshu/GetMySendDrtBakData',
                'keepLoading': false,
                'data': {
                    'keyword':  that.keyword,
					'pageSize': that.pageSize,
					'pageNumber': that.pageNumber
                },
                'beforeSend': function() {
                    if (that.loadMore) {
                        $('.load-more', that.wrapper).addClass('start'); 
                    }
                },
                'success': function(data) {
                    that.listData = data.Value.Items;
                    that.PageCount = data.Value.Paging.PageCount;
                    console.log(data);
                    /*that.PageCount = 3;
                    that.listData = [{
                        'DataApproveStatus': 1, // 1：未审核；2：通过；3：不通过
                        'TemplateName': '测试数据',
                        'DataApproverName': '齐观斌',
                        'UpdateTime': 1415871960,
                        'TemplateID': 453,
                        'BatchNo': 125
                    },{
                        'DataApproveStatus': 2,
                        'TemplateName': '天琴星海底探索量1',
                        'DataApproverName': '马锡月',
                        'UpdateTime': 1415871960,
                        'TemplateID': 343,
                        'BatchNo': 124
                    },{
                        'DataApproveStatus': 3,
                        'TemplateName': '天琴星海底探索量2',
                        'DataApproverName': '李国栋',
                        'UpdateTime': 1415871960,
                        'TemplateID': 564,
                        'BatchNo': 1244
                    },{
                        'DataApproveStatus': 1,
                        'TemplateName': '天琴星海底探索量3',
                        'DataApproverName': '刘晓帆',
                        'UpdateTime': 1415871960,
                        'TemplateID': 4523,
                        'BatchNo': 128
                    },{
                        'DataApproveStatus': 1,
                        'TemplateName': '天琴星海底探索量4',
                        'DataApproverName': '窦海鹏',
                        'UpdateTime': 1415871960,
                        'TemplateID': 2323,
                        'BatchNo': 1254
                    },{
                        'DataApproveStatus': 1,
                        'TemplateName': '测试数据',
                        'DataApproverName': '齐观斌',
                        'UpdateTime': 1415871960,
                        'TemplateID': 453,
                        'BatchNo': 125
                    },{
                        'DataApproveStatus': 2,
                        'TemplateName': '天琴星海底探索量1',
                        'DataApproverName': '马锡月',
                        'UpdateTime': 1415871960,
                        'TemplateID': 343,
                        'BatchNo': 124
                    },{
                        'DataApproveStatus': 3,
                        'TemplateName': '天琴星海底探索量2',
                        'DataApproverName': '李国栋',
                        'UpdateTime': 1415871960,
                        'TemplateID': 564,
                        'BatchNo': 1244
                    },{
                        'DataApproveStatus': 1,
                        'TemplateName': '天琴星海底探索量3',
                        'DataApproverName': '刘晓帆',
                        'UpdateTime': 1415871960,
                        'TemplateID': 4523,
                        'BatchNo': 128
                    },{
                        'DataApproveStatus': 1,
                        'TemplateName': '天琴星海底探索量4',
                        'DataApproverName': '窦海鹏',
                        'UpdateTime': 1415871960,
                        'TemplateID': 2323,
                        'BatchNo': 1254
                    }];*/

                    that.render();
                },
                'complete': function() {
                    if (that.pageNumber == that.PageCount) {
                       $('.load-more', that.wrapper).hide();
                    }
                    $('.load-more', that.wrapper).removeClass('start');
                    that.loadMore = false;
                }
            });
        },
        
        /**
         * @desc 渲染数据到页面
         *
         */
        render: function() {
            var that = this,
                $wrapper = that.wrapper,
                listData = that.listData,
                len = listData.length;
            
            if (len <= 0) {
                $('.g-ld').hide();
                $('.g-no-data').show();
                return;
            }
            
            _.each(listData, function(item) {
                var index = item.DataApproveStatus-1;
                item.Cls = that.clsItems[index];
                item.Txt = that.txtItems[index];
                item.UpdateTime = unit.formatDate(new Date(item.UpdateTime * 1000), 'YYYY-MM-dd HH:mm');
            });

            $('tbody', $wrapper).append(that.template({data: listData}));
            
            // 隐藏加载更多
            if (that.PageCount - 1 <= 1) {
                $('.load-more', that.wrapper).hide();
            }
            
            if (!$wrapper.attr('hasRender')) {
                $wrapper.attr('hasRender', true);
                that.show();
            }
        },
        
        
        /**
         * @desc 显示
         */        
        show: function () {
            $('.sec').hide(); // 隐藏其他页面
            doc.title = "审核记录";
            this.wrapper.removeClass('slidein')
                        .show()
                        .addClass('slidein');
        },

        
        /**
         * @desc初始化
         */
        init: function() {
            
            this.wrapper.attr('hasRender') ? this.show() : this._getListData();
        }
    };

    
    
    /*=========================================================================*/
    
    

    /**
     * @description 详情
     * @constructor
     *
     */    
    function Detail(opt) {
    
        this.opt = $.extend({
            wrapper: '#js_arv_d'
        }, opt);
        
        this.templateId = '';
        this.txtItems = ['待审核', '已通过', '驳回'];
        
        this.wrapper = $(this.opt.wrapper);
    };
    
    Detail.prototype = {

        constructor: Detail,

        /**
         * @description 模板
         * @param {Object}
         * @renturn {String}
         */
        template: _.template($('#arv-d-tpl').html()),

        
        /**
         * @desc获取详情数据
         * 
         */
        _getDetailData: function() {
            var that = this;
            
            unit.api({
                'type': 'get',
                'url': '/W/Baoshu/GetBatchDrtBakCompare',
                'data': {
                    'templateId': that.templateId,
                    'batchNO': that.batchNo
                },
                'success': function(data) {
                    console.log(data);
                    that.infoData = data.Value.BaseInfo;
                    that.itemsData = data.Value.Items;
                    that.titleName = that.infoData.TemplateName;
                    that.render();
                }
            });
            /*
            unit.showLoading();
            setTimeout(function() {
                
                that.infoData = {
                    'Employee': {
                        'Name': '王佳伟'
                    },
                    'DataApproveStatus': 1,
                    'DataApproverName': '闫丽君',
                    'CreateTime': 1416281301,
                    'UpdateTime': 1416288301,
                    'TemplateName': 'title名称'
                };
                
                that.titleName = that.infoData.TemplateName;
                
                that.itemsData = [{
                    "NodeName": "朝阳",
                    "CompareInfos": [{
                        "FieldName": "FD1",
                        "FieldDesc": "单价",
                        "ValueBefore": "1111",
                        "ValueAfter": ""
                    },{
                        "FieldName": "FN2",
                        "FieldDesc": "数量",
                        "ValueBefore": "23213",
                        "ValueAfter": "232"
                    },{
                        "FieldName": "FN3",
                        "FieldDesc": "备注",
                        "ValueBefore": "121212",
                        "ValueAfter": ""
                    }]
                },{
                    "NodeName": "大兴",
                    "CompareInfos": [{
                        "FieldName": "FD1",
                        "FieldDesc": "单价",
                        "ValueBefore": "",
                        "ValueAfter": "11111"
                    },{
                        "FieldName": "FN2",
                        "FieldDesc": "数量",
                        "ValueBefore": "",
                        "ValueAfter": "0"
                    },{
                        "FieldName": "FN3",
                        "FieldDesc": "备注",
                        "ValueBefore": "",
                        "ValueAfter": "0"
                    }]
                },{
                    "NodeName": "大兴",
                    "CompareInfos": [{
                        "FieldName": "FD1",
                        "FieldDesc": "单价",
                        "ValueBefore": "111",
                        "ValueAfter": "222222"
                    },{
                        "FieldName": "FN2",
                        "FieldDesc": "数量",
                        "ValueBefore": "",
                        "ValueAfter": "0"
                    },{
                        "FieldName": "FN3",
                        "FieldDesc": "备注",
                        "ValueBefore": "",
                        "ValueAfter": "0"
                    }]
                }];
                unit.hideLoading();
                that.render();
            }, 500);*/
        },
        
        /**
         * @description 渲染页面
         *
         */
        render: function () {
        
            var that = this,
                infoData = that.infoData,
                itemsData = that.itemsData;
            
            // 增加 statusText  statusCls 字段
            _.each(itemsData, function(item) {
                var bvs = '', avs = '';
                _.each(item.CompareInfos, function(info) {
                    var bv = info.ValueBefore;
                        av = info.ValueAfter ;    
                    if (bv != av && av != '') {
                        info.status = (bv == '') ? 1: 2;
                    } else {
                        info.status = 0;
                    }
                    bvs += bv;
                    avs += av;
                });
                
                if (bvs != avs && avs != '') {
                    item.statusText = (bvs == '') ? '新': '改';
                    item.statusCls = 'changed'; 
                } else {
                    item.statusText = '';
                    item.statusCls = '';
                } 
            });
            
            // 添加到页面中去 
            that.wrapper.html(that.template({
                'info': {
                    'name': infoData.Employee.Name,
                    'status': that.txtItems[infoData.DataApproveStatus -1],
                    'approverName': infoData.DataApproverName,
                    'createTime': unit.formatDate(new Date(infoData.CreateTime * 1000), 'YYYY-MM-dd HH-mm'),
                    'updateTime': unit.formatDate(new Date(infoData.UpdateTime * 1000), 'YYYY-MM-dd HH-mm')
                },
                'items': itemsData
            }));

            that.show();
        },

        
        /**
         * @description 显示详情页面
         *
         */
        show: function() {   
            $('.sec').hide(); // 隐藏其他页面
            doc.title = this.titleName;
            this.wrapper.removeClass('slidein')
                        .show()
                        .addClass('slidein')      
        },


        /**
         * @description初始化
         *
         */
        init: function(id, batchNo) {
            if (this.templateId == id) { // id无变化并没有提交 读取缓存
                this.show();
                return;
            }
            this.templateId = id;
            this.batchNo = batchNo;
            this._getDetailData();
        }
    };    
    
    
    
   /*=========================================================================*/

   
    /**
     * 入口
     */
    var App = (function () {
        
        var list = new List(),
            detail = new Detail();

        return {
            init: function () {
                routie({
                    
                    // 列表页面
                    '': function () {
                        list.init();
                    },
                    
                    // 详情页面
                    'detail/:id/:batchno': function (id, batchNo) {
                        if (!id || !batchNo) {
                            routie('');
                            return;
                        }
                        detail.init(id, batchNo);
                    },
                    
                    // 网络出错
                    'error': function() {
                        unit.showErrorPage();
                    },
                    
                    // 不合法hash
                    '*': function() {
                        location.hash = '';
                    }
                });
            }
        }
    })().init();
    
})(window, Zepto, routie);
