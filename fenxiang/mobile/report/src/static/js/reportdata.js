;(function (w, $, r, u) {

    var routie = r,
        doc = document,
        location = w.location,
        unit = w.unit,
        Datepicker = w.Datepicker,
        referrer = '';

        
    /**
     * @description 列表构造函数
     * @constructor
     *
     */
    function List(opt) {
    
        this.opt = $.extend({
            wrapper: '#js_list'
        }, opt);

        this.wrapper = $(this.opt.wrapper);

        this._bindEvents();
    };
    
    
    List.prototype = {
        
        constructor: List,
        
        // 渲染模板
        _template: '<li class="{{SenderStatus}}" data-id="{{TemplateID}}" data-reportday="{{ReportDay}}"><i></i><h3>{{TemplateName}}</h3><p>{{SendDeadLine}}:00 截止</p></li>',
        
        _bindEvents: function () {
            var me = this;
            me.wrapper.on('click', 'li', function () {
                $(this).removeClass('unrep');
                referrer = 'list';
                routie('detail/' + $(this).data('id') + '/' + $(this).data('reportday'));
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
                'url': '/W/Baoshu/GetDataReportSenderTemplates',
                'data': {},
                'success': function(data) {
                    console.log(data)
                    that.listData = data.Value.TemplateInfos;
                    that.render();
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
                len = listData.length,
                html = '<ul>';
            
            if (len <= 0) {
                $('.g-ld').hide();
                $('.g-no-data', $wrapper).show();
                return;
            }
            
            $.each(listData, function(index, item) {
                item.SenderStatus = item.SenderStatus == 2 ? 'unrep' : '';
                html += unit.render(that._template, item);                
            });
            
            $wrapper.append(html + '</ul>');
               
            // 记录渲染状态
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
            doc.title = "上报数据";
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
     * @description 详情 编辑 选择审核人 构造函数
     * @constructor
     *
     */    
    function Detail(opt){
    
        this.opt = $.extend({
            wrapper: '#js_detail',
            editeWrapper: '#js_edite',
            aWrapper: '#js_approver'
        }, opt);
        
        // 编辑 和详情 审核人最外层元素
        this.wrapper = $(this.opt.wrapper);
        this.editeWrapper = $(this.opt.editeWrapper);
        this.aWrapper = $(this.opt.aWrapper);
        
        this.templateId = '';
        
        // 记录状态
        this.statusChange = false;         // 数据改变
        this.statusSub = false;            // 提交状态
        
        this._bindEvents();
    };
    
    Detail.prototype = {
        
        constructor: Detail,
        
        /**
         * @description 绑定事件
         * 详情页面 和 编辑页面
         *
         */
        _bindEvents: function () {
            var that = this,
                $el = that.wrapper,
                $eEl = that.editeWrapper,
                $aEl = that.aWrapper;
            
            $el.on('click', '.data-wrapper tbody tr', function () { // 查看详情信息
                var $this = $(this);
                if ($this.hasClass('no-data')) { return;}
                that.curItemIndex = $this.index(); // 记录当前记录索引
                routie('edite/item');
            })
            .on('click', '.js_add', function () {  // 添加一行按钮
                that.renderLayers();
            })
            .on('click', '.js_sub', function () {  // 提交按钮
                that.checkNeedApprove();
            }); 

            $eEl.on('click', '.js_layers', function() {
                that.renderLayers();
            })
            .on('click', '.js_back', function() {  // 页面返回按钮
                routie('detail/' + that.templateId + '/' + that.templateDate);
            })
            .on('click', '.js_del', function() { // 删除并返回按钮
                that.changeDetailData('del');
                routie('detail/' + that.templateId + '/' + that.templateDate);
            })
            .on('click', '.js_center', function() { // 页面确定按钮
                if (that.isValide()) {
                    that.changeDetailData('center');
                    routie('detail/' + that.templateId + '/' + that.templateDate);
                }
            });

            
            $aEl.on('click', 'li', function() {
                var $this = $(this)
                if ($this.hasClass('checked')) {
                    $this.removeClass('checked');
                } else {
                    $this.addClass('checked').siblings().removeClass('checked');;
                }
                that.approverID = $this.data('employeeid');
            })
            .on('click', '.js_center', function() {
                if ($('.checked', $aEl).length <= 0) {
                    unit.showToast('请选择审核人');
                } else {
                    that.submit();
                }
            });
        },
        
        
        /**
         * @desc获取详情数据
         * 
         */
        getDetailData: function() {
            var that = this;
            unit.api({
                'type': 'get',
                'url': '/W/Baoshu/GetTemplateitems',
                'data': {
                    'templateId': that.templateId,
                    'reportDay': that.templateDate
                },
                'success': function(data) {
                    data = data.Value;
                    that.colsData = data.TemplateItems;
                    that.rowsData = data.DataDetailRows;
                    that.layersData = data.Senders;          // 所有的节点列表
                    that.titleName = data.TemplateName;      // 设置标题
                    that.render();
                }
            });
        },        
        
        
		/**
		 * @desc判断是否需要补报
		 */
		checkNeedApprove: function() {
			var that = this;
            
            unit.api({
                'type': 'get',
                'url': '/W/Baoshu/CheckIsNeedBak',
                'data': {
                    'templateId': that.templateId,
                    'reportDay': that.templateDate
                },
                'success': function(data) {
                    data = data.Value;
                    that.isNeedApprove = data.IsNeedApprove; // 是否需审核
                    that.isBak = data.IsBak; // 是否补报
                    if (that.isNeedApprove) {
                        routie('approver');
                    } else {
                        that.submit();
                    }
                }
            });
		},
        
        
        /**
         * @desc获取审批人数据
         */
        getEmployeesData: function() {
            var that = this;
            unit.api({
                'type': 'get',
                'url': '/W/Baoshu/GetApproveEmployees',
                'data': {
                    'TemplateID': that.templateId
                },
                'loadingText': '正在提交',
                'success': function(data) {
                    that.employeesData = data.Value.DRApproveEmployees;
                    that.renderApprover();
                }
            });            
        },         
        
        
        /**
         * @desc提交报表数据
         */
        submit: function() {
            var that = this,
                postData = [];
                
            $.each(that.rowsData, function(index, item){
                postData.push({
                    drtID: item.CommonDataDetail.DrtID,
                    nodeID: item.CommonDataDetail.NodeID,
                    DataItems: item.DataItems
                });
            });
            
            unit.api({
                'type': 'post',
                'url': '/W/Baoshu/' + (that.isBak ? 'DataReportBak' : 'DataReportEdit'),
                'data': {
                    'TemplateID': that.templateId,
                    'ReportDay': that.templateDate,
                    'ApproverID': that.approverID || 0, 
                    'JsonData': JSON.stringify(postData)
                },
                'loadingText': '正在提交',
                'success': function(data) {
                    that.statusSub = true;
                    routie('subok');
                }
            });            
        },        
        

        /**
         * @desc 修改时验证数据格式
         * 并设置最终数据
         */
        isValide: function() {
            var that = this,
                $inps = $('input', this.editeWrapper),
                dataItems = [];
                
            $inps.each(function(index, item) {
                var $item = $(item),
                    type = $item.data('itemtype') * 1,
                    val = $item.val();
                    
                if (type == 1) {
                    if (parseInt(val) != val) {
                        unit.showToast('请填写整数');
                        $item.focus();
                        return false;
                    }
                    val = val * 1;
                    if (Math.abs(val) > 99999999) {
                        unit.showToast('整数类型范围：-99999999到99999999');
                        $item.focus();
                        return false;                        
                    }
                }
                if (type == 2) {
                    if (parseFloat(val) != val) {
                        unit.showToast('请填写小数');
                        $item.focus();
                        return false;
                    }
                    var point = val.split('.')[1];
                    if (point && point.length > 2) {
                        unit.showToast('小数点后保留2位');
                        $item.focus();
                        return false;                        
                    }
                    val = (val * 1).toFixed(2);
                    if (Math.abs(val) > 99999999.99) {
                        unit.showToast('小数类型范围：-99999999.99到99999999.99');
                        $item.focus();
                        return false;                        
                    } 
                }
                if (type == 3 && (val.length == 0 || val.length > 100)) {
                    unit.showToast('文本100个字之间');
                    $item.focus();
                    return false; 
                }
                
                dataItems.push(val);
            });
            
            that.editeData = {
                'layers': {
                    NodeID: $('.js_layers').data('id'),
                    NodeName: $('.js_layers span').text()
                },
                'itemsVal': dataItems
            }
            return ($inps.length == dataItems.length);
        },
        
        
        /**
         * @description 删除或修改时 变更数据
         * 变更 that.rowsData的数据
         * @param {Sting} del 删除 cneter确定
         */
        changeDetailData: function(status) {
            var that = this,
                rowsData = that.rowsData,
                editeData = that.editeData,
                curItemIndex = that.curItemIndex;

            if (status == 'del') { // 删除
                if (that.editeOperateStatus == 'item') {
                    rowsData.splice(curItemIndex, 1);
                    that.statusChange = true;
                }
                return;
            }

            if (status == 'center') { // 确定
                if (that.editeOperateStatus == 'item') {
                    var curEditeData = rowsData[curItemIndex],
                        changSign = 0; // 编辑是否有更改

                    $.extend(curEditeData.CommonDataDetail, editeData.layers); // 更改层次数据
                    $.each(curEditeData.DataItems, function(index, item) { // 更改值数据
                        if (item.Value != editeData.itemsVal[index]) {
                            item.Value = editeData.itemsVal[index];
                            changSign++;
                        }
                    });
                    
                    if (changSign > 0) {
                        if (!curEditeData.StatusText) {
                            curEditeData.StatusText = '改';
                        }
                        that.statusChange = true;
                    }
                    
                    that.editeData = null;

                } else { // 添加数据操作
                    rowsData.push($.extend(true, {}, {
                        StatusText: '新',
                        CommonDataDetail: {
                            NodeID: editeData.layers.NodeID,
                            NodeName: editeData.layers.NodeName,
                            DrtID: 0
                        },
                        DataItems: $.map(that.colsData, function(item, index) {
                            item.Value = editeData.itemsVal[index];
                            return item;
                        })
                    }));
                    that.statusChange = true;
                    that.editeData = null;
                }
            }
        },
        
        
        /**
         * @description  渲染层级
         * 
         */
        renderLayers: function() {
            var that = this,
                htmlStr = '',
                tpl = '<li data-id="{{NodeID}}">{{NodeName}}</li>';
            
            if (that.layerRendered) {
                that.showLayers();
                return;
            }

            $.each(that.layersData, function(index, item) {
                htmlStr += unit.render(tpl, item);
            });
            $('.layers-box ul').html(htmlStr);
            
            // 绑定事件
            $('.layers-box').on('click', 'li', function() {
            
                $(this).addClass('cur-layers')
                       .siblings()
                       .removeClass('cur-layers');
                
                that.curLayersId = $(this).data('id');
                that.curLayersName = $(this).text();
                $('.js_layers').data('id', that.curLayersId);
                $('.js_layers span').text(that.curLayersName);
                $('.layers-box').hide();
                
                if (location.hash.indexOf('#edite') == -1) {
                    routie('edite/add');
                }          
            });

            // 点击空区域隐藏
            $('.layers-box').on('click', function(e) {
                if (e.target == this) {
                    $(this).hide();
                }
            });

            that.showLayers();
            that.layerRendered = true;
        },


        /**
         * @description渲染thead
         *
         */
        renderCols: function() {
            var cols = '<tr><th class="-upload-order"></th><th width="80">层级</th>'

            $.each(this.colsData, function(i, item) {
                cols += '<th>' + item.ItemName + '</th>';
            });
            
            $('.m-datatable thead', this.wrapper).html(cols + '</tr>'); 
        },
        
        
        /**
         * @description 渲染行tbody
         *
         */
        renderRows: function() {
            var rows = [],
                row = '';
   
            $.each(this.rowsData, function(index, item) {
                if (item.StatusText) {
                    row = '<tr data-index="'+ index +'"><td class="changed">'+ item.StatusText +'</td>';
                } else {
                    row = '<tr data-index="'+ index +'"><td>' + (index + 1) + '</td>';
                }
                row += '<td>' + item.CommonDataDetail.NodeName + '</td>';
                $.each(item.DataItems, function(i, mItem) {
                    row += '<td>' + mItem.Value + '</td>'
                });
                rows.push(row);
            });
            
            if (rows.length <= 0) {
                rows.push('<tr class="no-data"><td colspan="' + (this.colsData.length + 2) +'">暂无数据</td></tr>');
            }
            
            $('.m-datatable tbody', this.wrapper).html(rows.join(''));
        },
        
        
        /**
         * @desc渲染编辑状态下的 编辑 edite页面
         * 
         */
        renderEditeItem: function() {
            var that = this;
            var index = that.curItemIndex,
                item = that.rowsData[index],
                lis = '<ul>' + 
                        '<li class="js_layers layers-select" data-id="'+ item.CommonDataDetail.NodeID +'" >' +
                            '<span>' + item.CommonDataDetail.NodeName + '</span>' + 
                        '</li>';
            
            $.each(item.DataItems, function(i, mItem) {
                itemTypeArr = ['0', '0.00', '最多输入100个字'];
                lis += '<li>' +
                            '<span>' + mItem.ItemName + '<em>(必填)</em></span>' +
                            '<input data-itemtype="'+ mItem.ItemType +'" placeholder="'+ itemTypeArr[mItem.ItemType*1-1] +'" value="' + mItem.Value + '" />' +
                       '</li>';
            });
            
            $('.footer', that.editeWrapper).show();
            $('.edite-list').html(lis + '</ul>');
        },
        
        /**
         * @desc渲染编辑状态下 添加 的edite页面
         * 
         */
        renderEditeAdd: function() {
            var that = this,
                itemTypeArr;
                
            var lis = '<ul>' + 
                        '<li class="js_layers layers-select" data-id="'+ that.curLayersId +'">' + 
                            '<span>'+ that.curLayersName +'</span>' + 
                        '</li>';
            
            $.each(that.colsData, function(i, mItem) {
                itemTypeArr = ['0', '0.00', '最多输入100个字'];
                lis += '<li>' +
                            '<span>' + mItem.ItemName + '<em>(必填)</em></span>' +
                            '<input data-itemtype="'+ mItem.ItemType +'" placeholder="'+ itemTypeArr[mItem.ItemType*1-1] +'"/>' +
                       '</li>';
            });
            
            $('.footer', that.editeWrapper).show();
            $('.edite-list').html(lis + '</ul>');
        },
        
        
        /**
         *  @description 渲染编辑模块
         */
         renderEdite: function(operate) {
            var that = this;
            that.editeOperateStatus = operate;
            switch (operate) {
                case 'add': 
                that.renderEditeAdd();
                break;
                
                case 'item': 
                that.renderEditeItem();
                break;
                
                default:
                that.renderEditeItem();
                break; 
            }
            // 显示
            this.showEdite();
         },
         
         
         /**
          * @description 渲染审核人
          *
          */
        renderApprover: function() {
            var that = this,
                $aWrapper = that.aWrapper,
                employeesData = that.employeesData,
                ul = '<ul>';
                
            $.each(employeesData, function(index, item) {
                ul += '<li data-employeeid="' + item.EmployeeID + '">' +
                        '<div class="a-con">' +
                            '<div class="img-box"><img src="#" /></div>' +
                            '<strong>' + item.EmployeeName + '</strong>' +
                            '<span>'+ item.Post + '</span>' +
                        '</div>' +
                        '<span class="ico-checked"></span>' +
                      '</li>'
            });
            
            $('.a-list', $aWrapper).append(ul+'</ul>');
            
            // 记录渲染状态
            if (!$aWrapper.attr('hasRender')) {
               $aWrapper.attr('hasRender', true);
            }
            
            // 显示
            this.showApprover();
        },

        
        /**
         * @description 渲染页面
         *
         */
        render: function () {
            this.renderCols();
            this.renderRows();
            if (this.colsData.length <= 0) {
                $('.footer', this.wrapper).hide();
            } else {
                $('.footer', this.wrapper).show();
            }
            this.show();
        },

        
        /**
         * @description 显示详情页面
         *
         */
        show: function() {
            $('.sec').hide(); // 隐藏其他页面
            doc.title = this.titleName;
            this.wrapper.show().find('.data-wrapper')
                        .removeClass('slidein')
                        .show()
                        .addClass('slidein')      
        },


        /**
         * @description 显示编辑页面
         * 
         */
        showEdite: function() {
            $('.sec').hide(); // 隐藏其他页面
            this.editeWrapper.show().find('.edite-list')
                             .removeClass('slidein')
                             .show()
                             .addClass('slidein')             

        },

        /**
         * @description 显示编审核人
         * 
         */
        showApprover: function() {
            $('.sec').hide(); // 隐藏其他页面
            this.aWrapper.show().find('.a-list')
                         .removeClass('slidein')
                         .show()
                         .addClass('slidein');                    

        },
        
        /**
         * @description 显示层级
         * 
         */
        showLayers: function() {
            $('.layers-box').show().find('.layers-con')
                            .removeClass('slideup')
                            .show()
                            .addClass('slideup');
        },

        
        /**
         * @description 重置页面
         *
         */
        reset: function() {
            this.statusChange = false;
            this.statusSub = false;
            referrer = '';
        },
        
        
        /**
         * @description
         * 根据状态 局部修改页面
         *
         */
        renderByStatus: function() {
            var $el = $('.footer', this.wrapper);
                
            if (this.statusChange) {
                $el.addClass('sub-on');
                this.renderRows();
            }
        },
        
        
        /**
         * @description 重新渲染
         */
        refresh: function(id, date) {
            this.reset();
            this.templateId = id;
            this.templateDate = date;
            // 重置按钮区域为默认状态
            $('.footer', this.wrapper).attr('class', 'footer');
            $('.footer .js_edite', this.wrapper).text('编辑');
            this.getDetailData();
        },
        
        
        /**
         * @desc初始化审核人列表
         */
        approverInit: function() {
            this.aWrapper.attr('hasRender') ? this.showApprover() : this.getEmployeesData();
        },
        
        
        /**
         * @description初始化
         *
         */
        init: function(id, date) {
            if (this.templateId == id && this.templateDate == date && !this.statusSub && referrer != 'list') { // id无变化并没有提交 读取缓存
                this.renderByStatus();
                this.show();
                return;
            }
            this.refresh(id, date);
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
                    'detail/:id/:date': function (id, date) {
                        if (!id || !date) {
                            location.hash = '';
                            return;
                        }
                        detail.init(id, date);
                    },

                    /*
                     * @desc 编辑页面
                     * operate   item: 编辑页面  add: 添加页面  show 展现页面
                     */
                    'edite/:operate': function(operate) {
                        if (!detail.templateId 
                            || (operate == "item" && !('curItemIndex' in detail))
                            || (operate == "add" && !('curLayersId' in detail))) {

                            location.hash = '';
                            return;
                        }
                        
                        detail.renderEdite(operate);
                    },
                    
                    // 选择审核人
                    'approver': function() {
                        if (!detail.templateId) {
                            location.hash = '';
                            return;
                        }
                        detail.approverInit();
                    },
                    
                    // 上报成功
                    'subok': function() {
                        $('.sec').hide();
                        $('.g-sub-ok').show();
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