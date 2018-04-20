/***
* 报表记录-列表
* 叶子节点显示逻辑
* 如果一开始就是叶子节点怎么显示??
* 表格删减列 怎么显示
*/
define(function (require, exports, module) {

    var util=require('util'),
        templateStr=require('./app-reportrecord-infochart.html'),
        style=require('./app-reportrecord-infochart.css');
    /*
    *树形组件
    */
    var zTree = require('ztree_core');
    require('assets/ztree/css/ztree.css');
    
    /*
    *日历相关
    */ 
    var publishHelper=require('modules/publish/publish-helper');
    var DateSelect=publishHelper.DateSelect;
    var Calender=require('calendar');
    var RecordCalendar=require('./recordcalendar');
    var moment=require('moment');

    /*
    *图表相关
    */
    var Highcharts=require('highcharts');
    var Theme=require('highchartsTheme');
    //加载主题
    Highcharts.setOptions(Theme);

    var RecordInfoChart = Backbone.View.extend({
        template:_.template(templateStr),
        className:'reportrecord-infochart',
        events:{
            "click .-infochart-select-treewrapper":"_stopPro",
            "click .-infochart-select-year-wrapper":"_stopPro"
        },
        options:{
            wrapperEl:null,             //外层容器
            templateId:null,            //
            nodeId:999999999,           //默认层级id
            dateType:1,                 //日1 月3 年4
            time:null,                  //已选择的日期
            isRender:false,             //是否已经渲染了一次
            itemsName:'FN1',            //已选列name
            isBottom:false              //是否是叶子节点
        },
        //初始化
        initialize:function(options){
            var self=this;

            self.model=new Model({
                'items':null,   //表格的列选项
                'nodes':null    //树形列表节点
            })

            self.$el.html(self.template({}));
            self.initLinkDom();

            var list=self.getNowTime();

            self.options.time=list.time;

            //日历
            self.dayDate=new Calender({"trigger": self.$day});
           
            self.$day.val(list.year+'-'+list.month+'-'+list.date);
            
            //月历
            self.monthDate=new RecordCalendar({'trigger':self.$month});

            //初始化树形选择
            self.initTree();
            self.initEvent();
        },
        /**
        *注册其他事件
        */
        initEvent:function(){
            var self=this;

            $('body').on('click',function(e){
                if(e.target==self.$treeSelect[0]){
                    self.$treeWrapper.toggle();
                }else if(e.target==self.$yearSelect[0]){
                    self.$yearWrapper.show();
                }else{
                    self.$treeWrapper.hide();
                    self.$yearWrapper.hide();
                }   
            });

            /***
            *日期选择相关事件处理
            */
            util.mnEvent(self.$('.reportrecord-infochart-selectlist'), 'change', function (val, text) {
                var list=self.getNowTime();
                self.options.time=list.time;
                switch(val){
                    case 1:
                    self.$day.val(list.year+'-'+list.month+'-'+list.date);
                    self.$day.show();
                    self.$month.hide();
                    self.$year.hide();
                    self.options.dateType=1;
                    break;
                    case 3:
                    self.$day.hide();
                    self.monthDate.set(list.year+'-'+list.month,true);
                    self.$month.show();
                    self.$year.hide();
                    self.options.dateType=3;
                    break;
                    case 4:
                    self.$day.hide();
                    self.$month.hide();
                    self.$yearSelect.val(list.year);
                    self.$year.show();
                    self.options.dateType=4;
                    break;
                }
                self.refresh();
            });

            self.dayDate.on('selectDate',function(date){
                self.options.time=date.unix();
                self.refresh();
            });
            self.monthDate.on('change',function(time){
                self.options.time=Math.floor(time.getTime()/1000);
                self.refresh();
            });
            self.$('.-infochart-select-year-wrapper span').on('click',function(e){
                var $se=$(e.target)
                if($se.hasClass('deactive'))
                    return;
                var text=$se.text();
                self.$yearSelect.val(text);
                self.$yearWrapper.hide();
                var now=new Date();
                    now.setFullYear(text);
                self.options.time=Math.floor(now.getTime()/1000);
                self.refresh();
            });
        },
        /**
        *链接dom元素
        */
        initLinkDom:function(){
            var self=this;

            self.$date=self.$('.-infochart-select-date');
            self.$day=self.$('.-infochart-select-day-input');
            self.$month=self.$('.-infochart-select-month-input');
            self.$year=self.$('.-infochart-select-year');

            self.$treeWrapper=self.$('.-infochart-select-treewrapper');
            self.$treeSelect=self.$('.-infochart-select-tree');

            self.$yearSelect=self.$('.-infochart-select-year-input');
            self.$yearWrapper=self.$('.-infochart-select-year-wrapper');

            //图表下拉框
            self.$rangeSelect=self.$('.-infochart-range-select');

            //上报率显示
            self.$rate=self.$('.-infochart-select-rate');
            
            //常规表格
            self.$list=self.$('.-infochart-list');
            self.$theadtr=self.$list.find('.report-tb thead tr');
            self.$tbody=self.$list.find('.report-tb tbody');

            //详细表格
            self.$listDetail=self.$('.-infochart-listdetail');
            self.$detailThead=self.$listDetail.find('.report-tb thead tr');
            self.$detailTbody=self.$listDetail.find('.report-tb tbody');


            //图表容器
            self.$chartBox=self.$('.-infochart-chartbox');
            self.$pieChart=self.$('.-infochart-chart-pie');
            self.$lineChart=self.$('.-infochart-chart-line');
            self.$tbBarChart=self.$('.-infochart-chart-bar-tb');
            self.$hbBarChart=self.$('.-infochart-chart-bar-hb');

            //提示
            self.$tip=self.$('.-infochart-tip');
        },

        //获取层级数并渲染
        initTree:function(){
            var self=this;


            var setting = {
                data: { 
                    key: {
                        name: 'nodeName',
                        checked:'isRoot'
                    },
                    simpleData: {
                        enable: true,
                        idKey:'nodeID',
                        pIdKey:'parentID',
                        rootPId:0
                    }
                },
                view:{
                    showIcon: false,
                    /** 
                     * HACK {qigb}
                     * 解决新ui 与 差价不兼容问题
                     */
                    addDiyDom: function(treeId, treeNode) {
                        var $switch = $('#' + treeNode.tId + '_switch');
                        if (treeNode.isParent && (!treeNode.children || treeNode.children.length <= 0)) {
                            var curClass = $switch.attr('class');
                            $switch.attr('class', 'hack-switch ' + curClass);
                        }
                    }
                },
                callback:{
                    onClick:function(e,treeId,treeNode){
                        self.$treeSelect.text(treeNode.nodeName);
                        self.options.nodeId=treeNode.nodeID;
                        self.$treeWrapper.hide();
                        
                        /*
                        *判断是否是最低层元素
                        */
                        if(treeNode.isBottom){
                            self.options.isBottom=true;
                        }else{
                            self.options.isBottom=false;
                        }

                        self.refresh();
                    }
                }
            };
            util.api({ 
                'type':'get',
                'url':'/DataReporting/GetMyBrowserNodes',
                'data':{
                    'templateID':self.options.templateId
                },
                'success':function(data){
                    if(data.success){
                        var zTree=$.fn.zTree.init(self.$("#select_tree"),setting,data.value.nodes);
                        var nodes=zTree.getNodes();
                        self.model.set('nodes',nodes);
                        self.zTree=zTree;

                        zTree.selectNode(nodes[0]);
                        zTree.expandNode(nodes[0], true);
                        self.$treeSelect.text(nodes[0].nodeName);
                        self.options.nodeId=nodes[0].nodeID;
                    }
                }
            })
        },
        //渲染至页面
        render:function(){
            var self=this;

            
            if(self.options.isRender){
                self.refresh();
            }else{
                self.options.wrapperEl.empty().append(self.$el);
                self.refresh();
                self.options.isRender=true;
            }
        },
        //获取数据刷新
        refresh:function(){
            var self=this;

            self.$tip.hide();           //无数据提示
            self.$chartBox.hide();      //图表容器
            self.$list.hide();          //表格容器
            self.$listDetail.hide();    //详细表格容器
            self.$rate.hide();          //上报率

            self.$el.addClass('reportrecord-infochart-loading');
            
            if(self.options.isBottom){

                self.refreshTable();
            }else{

                self.refreshTable();
                self.refreshChart(true);
            }
        },
        /**
        *渲染表格
        */
        refreshTable:function(){
            var self=this;

            if(self.options.isBottom){
                var urlStr;
                if(self.options.dateType==1){
                    urlStr='/DataReporting/GetDataReportDataDetail';
                }else{
                    urlStr='/DataReporting/GetDataReportDataPersonal';
                }
                util.api({
                    type:'get',
                    url:urlStr,
                    data:{
                        'templateID':self.options.templateId,
                        'nodeID':self.options.nodeId,
                        'reportDay':self.options.time,
                        'dayType':self.options.dateType
                    },
                    success:function(data){
                        if(data.success){
                            self.$el.removeClass('reportrecord-infochart-loading');
                            /*
                            *如果数据为空
                            *直接返回????
                            */
                            self.model.set('detailItems',data.value.templateItems);
                            self.model.set('detailRows',data.value.drtDataDetailRows);
                            self.renderDetail();
                        }
                    }
                });

            }else{
                /**
                *获取表格数据
                */
                util.api({
                    type:'get',
                    url:'/DataReporting/GetDataReportDatas',
                    data:{
                        'templateID':self.options.templateId,
                        'nodeID':self.options.nodeId,
                        'reportDay':self.options.time,
                        'dayType':self.options.dateType
                    },
                    success:function(data){
                        if(data.success){
                            self.$el.removeClass('reportrecord-infochart-loading');
                            /*
                            *如果数据为空
                            *直接返回
                            */
                            if(data.value.templateItems.length==0){
                                self.$tip.fadeIn('fast');
                                return;
                            }else{
                                self.model.set('tableItems',data.value.templateItems);
                                self.model.set('tableRows',data.value.drtDataRows);
                                self.renderTable();
                            }
                        }
                    }
                });
            }

        },
        //渲染常规表格
        renderTable:function(){
            var self=this;

            //渲染表头
            var thstr='<th width="50">序号</th><th width="120">层级</th>';
            _.each(self.model.get('tableItems'),function(value){
                var tipStr='';
                var str;
                if(value.isDeleted){
                    str=value.deleteCurrentDay.toString();
                    str=str.slice(0,4)+'-'+str.slice(4,6)+'-'+str.slice(6);
                    str=str+" 删除此报表项";
                    tipStr='<span><p>'+str+'</p></span>';
                }
                thstr=thstr+'<th>'+value.itemName+tipStr+'</th>';
            })
            self.$theadtr.empty().append(thstr);

            //渲染表
            var tbodyStr="";
            _.each(self.model.get('tableRows'),function(value,index){

                if(index==self.model.get('tableRows').length-1){
                    index='';
                }else{
                    index=index+1;
                }

                var trStr='<tr><td>'+index+'</td><td>'+value.nodeName+'</td>';
                _.each(value.dataItems,function(value,index){
                    var num=value.value || '--';
                    trStr=trStr+'<td>'+num+'</td>'
                });

                trStr=trStr+'</tr>';
                tbodyStr=tbodyStr+trStr;
            })
            self.$tbody.empty().append(tbodyStr);
            self.$list.fadeIn('fast');
        },
        //渲染细节表格
        renderDetail:function(){
            var self=this;
            
            var thstr='<th width="50">序号</th><th width="120">上报人</th>';
            _.each(self.model.get('detailItems'),function(value){
                thstr=thstr+'<th>'+value.itemName+'</th>';
            })
            self.$detailThead.empty().append(thstr);

            var tbodyStr="";
            if(self.model.get('detailRows').length>0){

                _.each(self.model.get('detailRows'),function(value,index){

                    var trStr='<tr><td>'+(index+1)+'</td><td>'+value['drtCommonDataDetail']['employee']['name']+'</td>';
                    _.each(value.dataItems,function(value,index){
                        var num=value.value || '--';
                        trStr=trStr+'<td>'+num+'</td>'
                    });

                    trStr=trStr+'</tr>';
                    tbodyStr=tbodyStr+trStr;
                })
            }else{

                tbodyStr="<tr><td colspan='"+(self.model.get('detailItems').length+2)+"'>暂无数据</td></tr>";
            }
            self.$detailTbody.empty().append(tbodyStr);
            self.$listDetail.fadeIn('fast');

        },
        /**
        *渲染图表总函数
        *@bool 为true时
        *重新获取选择框
        *然后初始化图表
        */
        refreshChart:function(bool){
            var self=this;

            if(bool){
                if(self.options.dateType==1 || self.options.dateType==4){
                    self.$pieChart.show();
                    self.$lineChart.show();
                    self.$tbBarChart.hide();
                    self.$hbBarChart.hide();
                }else if(self.options.dateType==3){
                    self.$pieChart.show();
                    self.$lineChart.show();
                    self.$tbBarChart.show();
                    self.$hbBarChart.show();
                }
                util.api({
                    type:'get',
                    url:'/DataReporting/GetTemplateItemsByTemplateID',
                    data:{
                        'templateID':self.options.templateId,
                        'reportDay':self.options.time,
                        'dayType':self.options.dateType
                    },
                    success:function(data){
                        if(data.success){
                            self.$el.removeClass('reportrecord-infochart-loading');
                            /*
                            *如果数据为空
                            *直接返回
                            */
                            if(self.isEmpty(data.value)){
                                return;
                            }else{
                                self.$chartBox.fadeIn('fast');
                                self.model.set('items',data.value.templateItems);
                                self.renderItem();
                                self.refreshPieChart();
                                self.refreshLineChart();
                                /**
                                *如果日期类型是月
                                *获取同比数据
                                */
                                if(self.options.dateType==3){
                                    self.refreshtongbiChart();
                                    self.refreshhuanbiChart();    
                                }        
                            }
                        } 
                    }
                })
            }else{
                self.refreshPieChart();
                self.refreshLineChart();
                if(self.options.dataType==3){
                    self.refreshtongbiChart();
                    self.refreshhuanbiChart();
                }
            }
            

        },
        /**
        *渲染下拉框
        */
        renderItem:function(){
            var self=this;

            var selectArray=[];
            _.each(self.model.get('items'),function(value){
                /*
                *1数字2小数3字符串
                */
                if(value.itemType!=3){
                    selectArray.push({
                        "text":value.itemName,
                        "value":value.fieldName
                    })
                }
            });


            self.options.itemsName=selectArray[0]['value'];
            util.mnSelect(self.$rangeSelect, 'syncModel', selectArray);

            util.mnEvent(self.$rangeSelect, 'change', function (val, text) {
                self.options.itemsName=val;
                self.refreshChart();
            }); 
        },
        /**
        *渲染饼图
        */
        refreshPieChart:function(){
            var self=this;
            util.api({
                type:'get',
                url:'/DataReporting/GetDataReportDatas',
                data:{
                    'templateID':self.options.templateId,
                    'nodeID':self.options.nodeId,
                    'reportDay':self.options.time,
                    'dayType':self.options.dateType
                },
                beforeSend:function(){
                    self.$pieChart.addClass('reportrecord-infochart-loading');
                },
                success:function(data){
                    if(data.success){
                        self.$pieChart.removeClass('reportrecord-infochart-loading');
                        self.model.set('pieItems',data.value.templateItems);
                        self.model.set('pieRows',data.value.drtDataRows);
                        self.renderPieChart();
                    }
                }

            });
        },
        renderPieChart:function(){
            var self=this;
                self.$pieChart.empty();

            var series=self.model.getSeries();
            var serie=series[self.options.itemsName];
            var options={
                title:{
                    text:'层级占比',
                    margin:10
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        showInLegend:true
                    }
                },
                legend:{
                    align: 'center',
                    verticalAlign: 'bottom',
                    itemMarginTop:6,
                    itemMarginBottom:20, 
                    borderWidth: 0
                },
                chart:{
                    renderTo:self.$pieChart[0],
                    type:'pie'
                }
                /*,
                series: [{
                    name: '销量',
                    data:[['山西省',22],['山东省',33],['湖北省',44],['湖南省',55],['西藏壮族自治区',66],['新疆维吾尔族自治区',77],['海南省',88],['台湾省',99]],
                    size: '80%',
                    innerSize:'50%'    
                }]
                */
            }

            var value={
                size:'80%',
                innerSize:'50%',
                name:serie.name,
                data:serie.data
            }

            //判断数据是否全部为空
            var isNull=true;
            var i;
            for(i=0;i<value.data.length;i++){
                if(value.data[i][1] != 0){
                    isNull=false;
                    break;
                }
            }
            //
            if(isNull){
                self.$pieChart.html("<h2>层级占比</h2><p>无数据 暂无图表显示</p>");
            }else{
                options.series=[value];
                self.pieChart=new Highcharts.Chart(options);
            }

        },
        /**
        *渲染折线图
        */
        refreshLineChart:function(){
            var self=this;

            util.api({
                type:'get',
                url:'/DataReporting/GetTrendAnalysisData',
                data:{
                    'templateID':self.options.templateId,
                    'nodeID':self.options.nodeId,
                    'time':self.options.time,
                    'dayType':self.options.dateType,
                    'fieldName':self.options.itemsName
                },
                beforeSend:function(){
                    self.$lineChart.addClass('reportrecord-infochart-loading');
                },
                success:function(data){
                    if(data.success){
                        self.$lineChart.removeClass('reportrecord-infochart-loading');
                        self.model.set('lineItems',data.value.items);
                        self.renderLineChart();

                        var rate=data.value.completionRate || 0;
                        self.$rate.find('span').html(rate);
                        self.$rate.fadeIn('fast');
                    }
                }
            });
        },
        renderLineChart:function(){
            var self=this;
            var series=self.model.getLineSeries();
            var options={
                colors:["#2da9fc"],
                chart:{
                    renderTo:self.$lineChart[0]
                },
                title: {
                    text: '趋势图',
                    margin: 22 //center
                },
                xAxis: {
                    categories: ['2014-1-1', '2014-2-1', '2014-3-1', '2014-4-1', '2014-5-1', '2014-6-1','2014-7-1', '2014-8-1', '2014-9-1', '2014-10-1', '2014-11-1', '2014-12-1'],
                    labels:{
                        rotation:-20,
                        x:20
                    },
                    title:{
                        text:''
                    }
                },
                yAxis: {
                    min:0,
                    title: {
                        text: ''
                    },
                    lineWidth:1,
                    labels:{
                        formatter:function(){
                            return this.value.toLocaleString();
                        }
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    itemMarginTop:6,
                    itemMarginBottom:20,  
                    borderWidth: 0
                },
                tooltip: {
                    valueSuffix: ''
                },
                series: [{
                    name: '合计',
                    data: [111,222,333,444,555,666,777,888,999,1000,2000]
                }]
            }
            /**
            *如果数据为空 显示提示
            */
            if(series.categories.length>0){
                options.xAxis.categories=series.categories;
                options.series[0].data=series.data;

                self.lineChart=new Highcharts.Chart(options);
            }else{
                self.$lineChart.html("<h2>趋势图</h2><p>无数据 暂无图表显示</p>");
            }

        },
        /**
        *渲染同比图
        */
        refreshtongbiChart:function(){
            var self=this;

            util.api({ 
                'type':'get',
                'url':'/DataReporting/GetDataReportDatasChartYearOnYear',
                'data':{
                    'templateID':self.options.templateId,
                    'nodeID': self.options.nodeId,
                    'reportDay': self.options.time
                },
                beforeSend:function(){
                    self.$tbBarChart.addClass('reportrecord-infochart-loading');
                },
                'success':function(data){
                    if(data.success){
                        self.$tbBarChart.removeClass('reportrecord-infochart-loading');
                        self.model.set('tongbiItems',data.value);
                        self.rendertongbiChart();
                    }
                }
            });
        },
        rendertongbiChart:function(){
            var self=this;

            if(self.model.isTongbiEmpty()){
                self.$tbBarChart.html("<h2>同比</h2><p>无数据 暂无图表显示</p>");
                return;
            }
            var tongbiItems=self.model.get('tongbiItems');
            /**
            *如果没有数据
            *显示提示????
            */
            var categories = [],
                drtDataRowsCurrent =tongbiItems.drtDataRowsCurrent,
                drtDataRows = tongbiItems.drtDataRows,
                fieldName = self.options.itemsName,
                curvals = [],
                vals = [];
            $.each(drtDataRowsCurrent, function(idx, item){
                if(item.nodeID != 0) {
                    categories.push(item.nodeName);
                    curvals.push(self.getValByfieldName(fieldName, item.dataItems));
                }
            });
            $.each(drtDataRows, function(idx, item){
                if(item.nodeID != 0) {
                    vals.push(self.getValByfieldName(fieldName, item.dataItems));
                }
            });

            var now=new Date(self.options.time*1000);
            var stra=(now.getFullYear()-1)+'年'+(now.getMonth()+1)+'月';
            var strb=now.getFullYear()+'年'+ (now.getMonth()+1)+'月';
            var options={
                title:{
                    text:'同比',
                    margin:22
                },
                colors:["#3295ed","#88d2ff"],
                chart:{
                    type:'column',
                    renderTo:self.$('.-infochart-chart-bar-tb')[0]
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    itemMarginTop:6,
                    itemMarginBottom:20,  
                    borderWidth: 0
                },
                yAxis: {
                    min:0,
                    title: {
                        text: ''
                    },
                    lineWidth:1,
                    labels:{
                        formatter:function(){
                            return this.value.toLocaleString();
                        }
                    }
                },
                xAxis:{
                    categories: categories,
                    labels:{
                        formatter:function(){
                            var name=this.value;
                            if(name.length>10){
                                name=name.slice(0,10)+'...';
                            }
                            return name;
                        }
                    }
                },
                series:[{
                    name: stra,
                    data: vals
                    }, {
                    name: strb,
                    data: curvals
                    }
                ]
            };
          

            self.tongbiChart=new Highcharts.Chart(options);
        },
        /**
        *渲染环比图
        */
        refreshhuanbiChart:function(){
            var self=this;
            util.api({
                'type':'get',
                'url':'/DataReporting/GetDataReportDatasChartMonthOnMonth',
                'data':{
                    'templateID':self.options.templateId,
                    'nodeID': self.options.nodeId,
                    'reportDay': self.options.time
                },
                beforeSend:function(){
                    self.$hbBarChart.addClass('reportrecord-infochart-loading');
                },
                'success':function(data){
                    if(data.success){
                        self.$hbBarChart.removeClass('reportrecord-infochart-loading');
                        self.model.set('huanbiItems',data.value);
                        self.renderhuanbiChart();
                    }
                }
            });
        },
        renderhuanbiChart:function(){
            var self=this;

            if(self.model.isHuanbiEmpty()){
                self.$hbBarChart.html("<h2>环比</h2><p>无数据 暂无图表显示</p>");
                return;
            }
            var huanbiItems=self.model.get('huanbiItems');
            /**
            *如果没有数据
            *显示提示????
            */
            var categories = [],
                templateItems = huanbiItems.templateItems,
                drtDataRowsCurrent = huanbiItems.drtDataRowsCurrent,
                drtDataRows = huanbiItems.drtDataRows,
                fieldName = self.options.itemsName,
                curvals = [],
                vals = [];
            $.each(drtDataRowsCurrent, function(idx, item){
                if(item.nodeID != 0) {
                    categories.push(item.nodeName);
                    curvals.push(self.getValByfieldName(fieldName, item.dataItems));
                }
            });
            $.each(drtDataRows, function(idx, item){
                if(item.nodeID != 0) {
                    vals.push(self.getValByfieldName(fieldName, item.dataItems));
                }
            });
            
            var now=new Date(self.options.time*1000);
            var stra=now.getFullYear()+'年'+(now.getMonth())+'月';
            var strb=now.getFullYear()+'年'+ (now.getMonth()+1)+'月';

            var options={
                title:{
                    text:'环比',
                    margin:22
                },
                colors:["#3295ed","#f49abe"],
                chart:{
                    type:'column',
                    renderTo:self.$('.-infochart-chart-bar-hb')[0]
                },
                legend: {
                     align: 'center',
                    verticalAlign: 'bottom',
                    itemMarginTop:6,
                    itemMarginBottom:20,  
                    borderWidth: 0
                },
                yAxis: {
                    min:0,
                    title: {
                        text: ''
                    },
                    lineWidth:1,
                    labels:{
                        formatter:function(){
                            return this.value.toLocaleString();
                        }
                    }
                },
                xAxis:{
                    categories: categories,
                    labels:{
                        formatter:function(){
                            var name=this.value;
                            if(name.length>10){
                                name=name.slice(0,10)+'...';
                            }
                            return name;
                        }
                    }
                },
                series:[{
                    name: stra,
                    data: vals
                    }, {
                    name: strb,
                    data: curvals
                    }
                ]
            };
            self.huanbiChart=new Highcharts.Chart(options);
        },
        /**
        *获取当前时间的前一天日期
        */
        getNowTime:function(){
            var now=new Date();
                now.setDate(now.getDate()-1);
            var year=now.getFullYear(),
                month=now.getMonth()+1,
                date=now.getDate();
            return {
                'time':Math.floor(now.getTime()/1000),
                'year':year,
                'month':month,
                'date':date
            }
        },
        /**
        *判断一个对象
        *是否是空对象
        */
        isEmpty:function(o){
            var hasProp = true;  
            for (var prop in o){  
                hasProp = false;  
                break;  
            } 
            return hasProp; 
        },
        /**
        *树形层防止click事件
        *冒泡到body触发body click事件
        */
        _stopPro:function(e){
            e.stopPropagation();
        },
        /**
         * 渲染同比图环比图 工具函数
         * 根据fieldName获取值
         */
        getValByfieldName: function(fieldName, dataItems) {
        	var obj = {};
        	for(var i=0,len=dataItems.length; i<len; i++) {
        		if(fieldName == dataItems[i].fieldName) {
        			obj = dataItems[i];
        			break;
        		}
        	}
        	return (obj.value && parseFloat(obj.value)) || 0;
        },
        /**
        *销毁
        */
        destory:function(){
            this.monthDate.destory();
            this.$el.remove();
        }

    });
    /*
    * items  表列
    * nodes  树节点
    * rows   表格数据
    * lineItems    折线图数据
    * 
    */
    function Model(attr){
        this.attr=attr;
    }
    Model.prototype={
        get:function(key){
            return this.attr[key];
        },
        set:function(key,value){
            this.attr[key]=value;
            return value;
        },
        /**
        *接口表格数据转化为饼图数据
        */
        getSeries:function(){
            var self=this;
            
            var items=self.get('pieItems');
            var rows=self.get('pieRows');
            var series={};
            
            
            _.each(items,function(value){
                /*
                *1数字2小数3字符串
                */
                if(value.itemType!=3){
                    series[value.fieldName]={
                        'name':value.itemName,
                        'data':[],
                        'fieldName':value.fieldName
                    }
                }
            });
            
            _.each(rows,function(row,index){
                if(index==(rows.length-1)){
                    return;
                }
                var nodeName=row.nodeName;
                if(nodeName.length>10){
                    nodeName=nodeName.slice(0,10)+'...'
                }
                _.each(row.dataItems,function(value,index){
                    var num=value.value || 0;
                    series[value.fieldName].data.push([nodeName,parseFloat(num)]);
                })
            });

            return series;
        },
        /**
        *接口数据转化为折线数据
        */
        getLineSeries:function(){
            var self=this;

            var lineItems=self.get('lineItems');
            var series={
                categories:[],
                data:[]
            };
            _.each(lineItems,function(data){
                var timeStr=data.value.toString();
                var timeValue;
                switch(timeStr.length){
                    case 4:
                    timeValue=timeStr;
                    break;
                    case 6:
                    timeValue=timeStr.slice(0,4)+'-'+timeStr.slice(4,6);
                    break;
                    case 8:
                    timeValue=timeStr.slice(0,4)+'-'+timeStr.slice(4,6)+'-'+timeStr.slice(6);
                    break;
                }
                series.categories.push(timeValue);
                series.data.push(data.value1);
            })
            return series;
        },
        /**
        *判断同比返回数据是否为空
        */
        isTongbiEmpty:function(){
            var self=this;
            var tongbiItems=self.get('tongbiItems');

            var oldItems=tongbiItems.drtDataRows;
            var newItems=tongbiItems.drtDataRowsCurrent;

            var isNull=true;
            _.each(oldItems,function(value,index){
                if(value.dataItems.length>0){
                    isNull=false;
                }
            });
            _.each(newItems,function(value,index){
                if(value.dataItems.length>0){
                    isNull=false;
                }
            });

            return isNull;
        },
        /**
        *判断环比返回数据是否为空
        */
        isHuanbiEmpty:function(){
            var self=this;
            var huanbiItems=self.get('huanbiItems');

            var oldItems=huanbiItems.drtDataRows;
            var newItems=huanbiItems.drtDataRowsCurrent;

            var isNull=true;
            _.each(oldItems,function(value,index){
                if(value.dataItems.length>0){
                    isNull=false;
                }
            });
            _.each(newItems,function(value,index){
                if(value.dataItems.length>0){
                    isNull=false;
                }
            });

            return isNull;
        }

    }


    module.exports = RecordInfoChart;
});
