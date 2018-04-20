/**
 * 报表记录-列表
 */
define(function (require, exports, module) {
    
    var util=require('util'),
        templateStr=require('./app-reportrecord-list.html'),
        trStr=require('./app-reportrecord-listtable.html'),
        style=require('./app-reportrecord-list.css');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');
    
    var RecordList = Backbone.View.extend({
        template:_.template(templateStr),
        trTemplate:_.template(trStr),
        options:{
            keyword:'',
            pageSize:10,
            pageNumber:1,
            totalCount:null,
            tables:null
        },
        //初始化
        initialize:function(options){
            var self=this;
            self.$el.html(self.template({}));
            self.bindEvents();
        },
        //渲染
        render:function(){
            var self=this;
            self.options.wrapperEl.empty().append(self.$el);
            self.refresh(true);
            //实例化搜索框
            this.searchBox = new SearchBox({
                "element": $('.search-warp'),
                "placeholder": "搜索"
            });
            this.searchBox.on('search', function (queryValue) {
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    self.options.keyword=queryValue;
                    self.refresh();
                }

            });
        },
        /*
        *参数为true
        *渲染页数
        */
        refresh:function(bool){
            var self=this;
            util.api({
                type:'get',
                url:'/DataReporting/GetDataReportBrowserTemplates',
                data:{
                    status:self.options.status||0,
                    'keyword':self.options.keyword,
                    'pageSize':self.options.pageSize,
                    'pageNumber':self.options.pageNumber
                },
                "beforeSend": function () {
                    var loadingEl = '<tr><td colspan="6"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    self.$('tbody').html(loadingEl);
                },
                success:function(data){
                    if(data.success){
                        self.options.totalCount=data.value.totalCount;
                        self.options.tables=data.value.dRTemplates;
                        self.pagination&&self.pagination.setTotalSize(data.value.totalCount);//设置分页总数
                        self._renderTable();
                        if(bool){
                            self._renderPage();
                        }
                    }
                }
            })

        },
        _renderTable:function(){
            var self=this;
            var str="";
            if(self.options.tables.length>0){
                _.each(self.options.tables,function(element,index){
                    var timeStr=element.createTime.split('T');
                    element.timeStr=timeStr[0]+" "+timeStr[1].slice(0,5);
                    element.statusCss='';
                    switch(element.status){
                        case 1:
                        element.statusStr="未启用";
                        break;
                        case 2:
                        element.statusStr="暂停";
                        element.statusCss='f-gray';
                        str=str+self.trTemplate({'ob':element,'index':index});

                        break;
                        case 3:
                        element.statusStr="已启用";
                        element.statusCss='f-green';
                        str=str+self.trTemplate({'ob':element,'index':index});
                        break;
                    }
                });
            }else{
                if(self.options.keyword.length>0){
                    str="<tr><td colspan='5' class='empty-tip'>未搜索到符合条件的结果</td></tr>"
                }else{
                    str="<tr><td colspan='5' class='empty-tip'>没有任何报表的查看权限,如有需要请联系管理员</td></tr>"
                }
            }

            self.$('tbody').html(str);
        },
        /**
        *查看paginationapi
        *?????现在写法太挫
        */
        _renderPage:function(){
            var self=this;

            if(self.pagination){
                self.$('.reportrecord-page').empty();
            }
            self.pagination = new Pagination({
                "element":self.$('.reportrecord-page'),
                "pageSize":self.options.pageSize,
                "totalSize":self.options.totalCount
            });
            self.pagination.render();

            self.pagination.on('page', function (pageNumber) {
                self.options.pageNumber=pageNumber;
                self.refresh();
            });     

        },
        bindEvents: function () {
            var me = this;
            var elEl=this.$el;
            var that=this;
            $("#report-reportrecord").on('click', '.reportrecord-list-view', function (e) {
                me.linkView(e);
                return false;
            }).on('click', '.report-record-link', function () {
                me.refresh();
            }).on('click', '.reportrecord-list-search-wrap .btn-search', function () {
                me.search();
            }).on('keydown', '.reportrecord-list-search-wrap .ipt-search', function (e) {
                me._keydown(e)
            });
            //点击TR进入查看
            $("#report-reportrecord").on('click','.reportrecord-list tr',function(){
                if($(this).length>0){
                    $(this).find('.reportrecord-list-view').trigger('click');
                    return false;
                }
            });
            util.mnEvent($('.states-list-select-list', elEl), 'change', function(val, text) {
                that.options.status=val;
                that.refresh();
            });
        },
        _keydown: function(e){
        	var that = this;
        	if(e.keyCode == 13) {
        		that.search();
        	}
        },
        search:function(){
            var self=this;
            self.options.keyword=self.$('.ipt-search').val();
            self.options.pageNumber=1;
            self.refresh(true);
        },
        linkView:function(e){
            var self=this;

            var $se=$(e.target);

            var status=$se.attr('data-status');
            if(status==2){
                util.alert('报表已暂停使用 暂无法查看');
            }else{
                self.trigger('view',$se.attr('data-tableid'),$se.attr('data-tablename'));
            }    
        },
        destory:function(){
            //remove会同时清除绑定的事件
            this.$el.remove();
        },
        show:function(){
            this.options.wrapperEl.empty().append(this.$el);
        },
        hide:function(){
            this.$el.detach();
        }

    });

    module.exports = RecordList;
});