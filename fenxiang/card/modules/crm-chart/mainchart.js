/**
 * main-chart
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS;

    //=====[[图表工具]]=====//
    var Ra=require('raphael');
    var Linechart=require('uilibs/chart/linechart');
    var Funnelchart=require('uilibs/chart/funnelchart_a');
    var Funnelchartb=require('uilibs/chart/funnelchart_b');
    var Bubblechart=require('uilibs/chart/bubblechart');
    var crmStyle=require('modules/crm-chart/crm-chart.css');
    var util=require('util');

    /*============================
    *图表基类,提供常用的转换函数
    ==============================*/
    var Chart=function(){
        this._init_.apply(this,arguments);
    };
    //backbone的扩展函数
    Chart.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };
    Chart.prototype={
        //根据arr数据 返回相应的month
        transMonth:function(arr){
            var month=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
            var start=arr[0]['monthNo']-1,
                length=arr.length,
                end=start+length;
            return month.slice(start,end);
        },
        getXaxis:function(timerange){
            var month=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            	start=0,
            	end=120;
            switch(timerange){
                case 1:
                    break;
                case 2:
                    month=month.slice(0,6);  end=60;
                    break;
                case 3:
                    month=month.slice(6,12); start=60;
                    break;
                case 4:
                    month=month.slice(0,3); end=30;
                    break;
                case 5:
                    month=month.slice(3,6); start=30; end=60;
                    break;
                case 6:
                    month=month.slice(6,9); start=60; end=90;
                    break;
                case 7:
                    month=month.slice(9,12); start=90; end=120;
                    break; 
            }
            return {'label':month,'start':start,'end':end}
        },
        //在arr数据中找到最大值
        maxY:function(arr){
            var maxa=_.max(arr,function(sale){return sale['salesTargetAmount']});
            var maxb=_.max(arr,function(sale){return sale['winAmount']});
            return _.max([maxa['salesTargetAmount'],maxb['winAmount']]);
        },
        //转换最大值
        transMax:function(num){
        	//大于1000的进行百位数上舍入
        	if(num>1000){
        		num=Math.ceil(num*1.1/100)*100;
        	//大于100的 进行十位数上舍入
        	}else if(num>100){
        		num=Math.ceil(num*1.1/10)*10;
        	//小于100的 进行个位数上舍入
        	}else{
        		num=Math.ceil(num*1.1);
        	}
        	return num;
        },
        //公共destory函数
        destory:function(){
            this.chart.destory();
            this.element.empty();
        },
        //不同阶段的展示数据
        colorlist:["#1ED2DC","#0BA6DA","#277EBF","#5153AA","#A434A6","#DC50AA","#EE5582","#F03C3C","#F3674C","#FF963C"],
        //
        getColor:function(num,total){
            var colorlist=this.colorlist,
                length=colorlist.length;

            var color="#ffffff"; //默认颜色

            switch(num){
                case 0:
                    color=colorlist[0];
                break;
                case total-1:
                    color=colorlist[length-1];
                break;
                default:
                    var jump=Math.floor(length/(total-1));
                    var index=num*jump;
                    if(index>length-1){index=length-1}
                    color=colorlist[index];
            }

            return color;
        },
        //api路径起始
        //apipath:FS.API_PATH
        apipath:'',
        //发送请求前 显示加载背景图
        beforeLoading:function(){
            this.element.parent().addClass('crm-chart-list-loadingcard');
        },
        //请求成功后 隐藏加载背景图
        unLoading:function(){
            this.element.parent().removeClass('crm-chart-list-loadingcard');
        },

        //默认同步请求
        ASYNC:false,
        //默认请求超时200ms
        TIMEOUT:200,
        //请求数据
        send:function(opts){
            var opts=_.extend({async:this.ASYNC,timeout:this.TIMEOUT},opts);
            util.api(opts,{loadingType:1});
        }
    };

    /**
    *图表类型A,显示任务完成情况
    **/
    var Typea=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Linechart({"element":element});
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.attr={
                path:this.apipath+'/SalesStatistic/GetSalesTargetChartOfEmployee'
            };
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var xAxis=this.transMonth(data);
            var max=this.transMax(this.maxY(data));

            var salesSeria=[],   //存储目标数据
                winSeria=[],     //存储已完成已达标数据
                winSeriat=[];    //存储已完成未达标数据

            var salesYear=0,     //存储全年目标
                winYear=0;       //存储全年已完成

            _.each(data,function(element){
                var data0=element['salesTargetAmount'],
                    datatemp=element['winAmount'],
                    dataa,
                    datab;

                salesYear=salesYear+data0; winYear=winYear+datatemp;

                //大于等于目标值时为达标
                if(datatemp>=data0){
                    dataa=datatemp;datab=0;
                }else{
                    dataa=0;datab=datatemp;
                }

                salesSeria.push(data0);
                winSeria.push(dataa);
                winSeriat.push(datab);
            })

            var percent;
            percent=salesYear ? Math.round(winYear/salesYear*100) : 0;  
            salesYear=Ra.fn.transNumber(salesYear); winYear=Ra.fn.transNumber(winYear);
          
            var info={
                'xAxis':xAxis,
                'yAxis':{
                    'max':max,
                    'linenum':4
                },
                title:"全年已完成￥"+ winYear +"("+percent+"%)"+"，目标￥"+salesYear,
                template:"{{num}}月已完成￥{{Raphael.fn.transNumber(dataa||datac)}} ({{ datab ? Math.round((dataa||datac)/datab*100):0 }}%) ,  目标￥{{Raphael.fn.transNumber(datab)}}",
                width:680,          //默认宽度 (px)
                height:340,         //默认高度 (px)
                topgutter:60,       //顶部边距 (px)
                bottomgutter:90,    //底部边距 (px)
                series:[
                    {
                        'name':'已完成已达标',
                        'mark':'dataa',
                        'type':'cube',
                        'data':winSeria,
                        'color':'#77cc77',
                        'width':28
                    },
                    {
                        'name':'已完成未达标',
                        'mark':'datac',
                        'type':'cube',
                        'data':winSeriat,
                        'color':'red',
                        'width':28
                    },
                    {
                        'name':'目标',
                        'mark':'datab',
                        'type':'line',
                        'data':salesSeria,
                        'color':'#1b9dde'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    var info=that.trans(data.value.salesTargetChartItems);
                    
                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();

                    //复制一份data 保存渲染的原始数据 
                    that.info=JSON.parse(JSON.stringify(info));


                    that.destory();
                    that.chart.render(info);
                    
                    //如果未绑定缩放事件 绑定缩放
                    //if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            })
        },
        /*====================================
        *窗口缩放时重绘 
        *当窗口缩放时会非常频繁的触发此函数 所以加个100ms延迟 当缩放后100ms内无再次缩放事件 则进行重绘 
        *====================================*/
        _resize:function(){
            var that=this;
            if(that._time){
                clearTimeout(that._time);
            }
            that._time=setTimeout(function(){
                var infotemp=JSON.parse(JSON.stringify(that.info));
                infotemp.width=that.element.width();
                that.chart.destory();
                that.chart.render(infotemp);
            },100)            
        }

    });
    
    /**
    *图表类型B,销售漏斗
    **/
    var Typeb=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Funnelchart({"element":element});
            this.attr={
                path:this.apipath+"/SalesStatistic/GetSalesFunnelDataOfEmployee",
                template:'<div class="crm-chart-b-text"><div class="crm-chart-b-text-first"><p> <b>最大成交金额</b><span>￥ {{max}}</span> </p></div> <div><p><b>预测总金额</b><span>￥ {{forecast}}</span></p></div><div><p><b>目标金额</b><span>￥ {{goal}}</span></p></div></div>'
            };
            this.template=_.template(this.attr.template);

            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var self=this;
        	var list=[];
        
        	var nametemp,numtemp,colortemp;

            var max=0;
        	for(var i=0;i<data.length;i++){
                //如果数据的名字过长 手动截取 增加...符号
                if(data[i]['name'].length>8){
                    data[i]['name']=data[i]['name'].slice(0,7)+'...';
                }
        		nametemp=data[i]['name']+'('+data[i]['winRate']+'%)';
        		numtemp=data[i]['amount'];
                colortemp=self.getColor(i,data.length);
                max +=numtemp;

        		list.push([nametemp,numtemp,colortemp]);
        	};

	        var info={
	           	width:450,                //宽度(em)
                height:267,               //
                toppadding:0,             //顶部边距(em)
                bottompadding:0,          //底部边距(em)
                rightpadding:300,         //右部边距(em)
                title:"Sales funnel",
                series:{
                    name:'Unique users',
                    label:function(val){return '￥'+val},
                    data:list
                },
                max:max
	        }
        	return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                	var info=that.trans(data.value.pipelineColumns);
                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();
                    //复制一份data 保存渲染的原始数据[=??=]此方法无法复制function
                    that.info=JSON.parse(JSON.stringify(info)); 
                    that.destory();
                    that.chart.render(info);
                    var text={
                        goal:that.chart.paper.transNum(data.value.salesTargetAmount,2),
                        max:that.chart.paper.transNum(info.max,2),
                        forecast:that.chart.paper.transNum(data.value.salesForecastAmount,2)
                    };
                    that.element.append(that.template(text));

                    //有的情况下图形错乱 window重绘后就好了
                    //$window.trigger('resize');
                    //如果未绑定缩放事件 绑定缩放
                    //if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            });
        },
        //窗口缩放时重绘
        _resize:function(){
            var that=this;
            if(that._time){
                clearTimeout(that._time);
            }
            that._time=setTimeout(function(){that._frame();},100)  
        },
        //重绘
        _frame:function(){
             var infotemp=JSON.parse(JSON.stringify(this.info));
                 infotemp.width=this.element.width();
            infotemp.series.label=function(val){return '￥'+val};
            this.chart.destory();
            this.chart.render(infotemp);
        }

    });
    /*
    *图表类型Ba,销售预测漏斗
    *获取数据的api不同 所以新建了一个
    */
    var Typeba=Chart.extend({
        _init_:function(element,data){
            this.element=$(element);
            this.chart=new Funnelchart({"element":element});
            this.attr={
                template:'<div class="crm-chart-b-text"><div class="crm-chart-b-text-first"><p> <b>最大成交金额</b><span>￥ {{max}}</span> </p></div> <div><p><b>预测总金额</b><span>￥ {{forecast}}</span></p></div><div><p><b>目标金额</b><span>￥ {{goal}}</span></p></div></div>'
            };
            this.template=_.template(this.attr.template);
            this._resizeState_=false;
            this.update(data);
        },
        //数据格式化
        trans:function(data){
            var data=data[data.length-1],
                columns=data['pipelineColumns'];

            var list=[];
            var colorlist=[
                "#1ed2dc",
                "#277ebf",
                "#a434a6",
                "#ee5582",
                "#f3674c",
                "#ff963c"
            ];

            var nametemp,numtemp;
            //成交金额总和
            var max=0;
            for(var i=0;i<columns.length;i++){

                //如果数据的名字过长 手动截取 增加...符号
                if(columns[i]['name'].length>8){
                    columns[i]['name']=columns[i]['name'].slice(0,7)+'...';
                }
                nametemp=columns[i]['name']+'('+columns[i]['winRate']+'%)';
                numtemp=columns[i]['amount'];
                max +=numtemp;
                list.push([nametemp,numtemp,colorlist[i]]);
            };
            //push入赢单
            max=max+data.winAmount;
            list.push(['赢单(100%)',data.winAmount,'#ff963b']);

            var info={
                width:450,                //宽度(em)
                height:267,               //
                toppadding:0,             //顶部边距(em)
                bottompadding:0,          //底部边距(em)
                rightpadding:300,         //右部边距(em)
                title:"Sales funnel",
                series:{
                    name:'Unique users',
                    label:function(val){return '￥'+val},
                    data:list
                },
                max:max
            }
            return info;
        },
        //更新函数
        update:function(data){
            var that=this;
            var $window=$(window);
            var rows=data.value.salesForecastDataRows;
            var info=that.trans(rows);
            //根据当前容器元素宽度设定宽度
            info.width=that.element.width();
            //复制一份data 保存渲染的原始数据[=??=]此方法无法复制function
            that.info=JSON.parse(JSON.stringify(info)); 
            that.destory();
            that.chart.render(info);

            var value=rows[rows.length-1];
            var text={
                goal:that.chart.paper.transNum(value.targetAmount,2),
                max:that.chart.paper.transNum(info.max,2),
                forecast:that.chart.paper.transNum(value.salesForecastAmount,2)
            };
            that.element.append(that.template(text));
            //如果未绑定缩放事件 绑定缩放
            //if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
        },
        _resize:function(){
            var that=this;
            if(that._time){
                clearTimeout(that._time);
            }
            that._time=setTimeout(function(){that._frame();},100)  
        },
        _frame:function(){
            var infotemp=JSON.parse(JSON.stringify(this.info));
                infotemp.width=this.element.width();
            infotemp.series.label=function(val){return '￥'+val};
            this.chart.destory();
            this.chart.render(infotemp);
        }
    })
    /**
    *图表类型C,未赢单机会赢率-时间分布
    **/
    var Typec=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Bubblechart({"element":element});
            this.attr={
                path:this.apipath+"/SalesStatistic/GetSalesOppNotWinChartOfEmployee"
            };
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.update(param);
        },
        //数据格式化
        trans:function(data,timerange,length){
            var that=this;
            timerange=parseInt(timerange);
            var info={
                width:525,          //宽度(em)
                height:270,         //高度(em)
                topgutter:30,       //顶部边距(em)
                bottomgutter:30,    //底部边距(em)
                rightgutter:0,     //右边距(em)
                tip:"{{name}}:共{{num}}单,合计￥{{amount}}",
                xAxis:this.getXaxis(timerange),
                yAxis:{
                    max:100,
                    linenum:2,
                    label:function(value){
                        return value+'%';
                    }
                }
                /*,
                series:[
                    {
                        type:'num',
                        name:'bubblec',
                        data:[[5,47,12],[15,12,12],[25,176,12],[35,30,12],[45,98,12],[55,117,12],[65,60,12],[75,78,12],[85,12,12],[95,77,12]],
                        color:'#5153aa'
                    },
                    {
                        type:'num',
                        name:'bubbled',
                        data:[[105,47,12],[115,12,12],[105,176,12],[95,30,12],[85,98,12],[75,17,12],[65,60,12],[55,78,12],[45,12,12],[35,77,12]],
                        color:'#277ebf'
                    }
                ]
                */
            }; 
            /*================================================
            进行第一次数据转化 相同stage的存储在同一个数组中  
            ==================================================*/
            var list=[]; //存储第一次转化的数据
            var stage;   //阶段缓存
            for(var i=0;i<data.length;i++){
                stage=data[i]['SalesStage']['salesStageNo'];
                if(!list[stage]){
                    list[stage]={type:'num'};
                    list[stage]['name']=data[i]['SalesStage']['name']+'('+data[i]['SalesStage']['winRate']+'%)';
                    list[stage]['data']=[];
                    list[stage]['color']=that.getColor(stage-1,length);
                }
                list[stage]['data'].push([data[i]['monthNo']*10-5,data[i]['SalesStage']['winRate'],parseFloat(data[i]['amount'])]);
            }
          	//再次转化数据
            for(var j=1;j<list.length;j++){
            	if(!list[j]) continue;
                list[j]['data']=that._transArray(list[j]['data']);
            }
            info.series=list;
            return info;  
        },
        //对array数据进行二次转化 合并有相同x y 坐标的 返回转化后的新array
        _transArray:function(arr){
            var newarr=[];
            for(var i=0;i<arr.length;i++){
                if(!arr[i].mark){
                    arr[i][3]={amount:arr[i][2]};
                    arr[i][2]=1;
                    for(var j=i+1;j<arr.length;j++){
                        if(arr[i][0]==arr[j][0] && arr[j].mark!=true){
                            arr[i][2]+=1;
                            arr[i][3]['amount']=arr[i][3]['amount']+arr[j][2];
                            arr[j].mark=true;
                        }    
                    }
                    arr[i][3]['amount']=Raphael.fn.transNum(arr[i][3]['amount'],2);
                    newarr.push(arr[i]);
                    arr[i].mark=true;  
                } 
            }
            return newarr;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            //that.chart.render(info);
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    that.destory();
                    var info=that.trans(data.value.salesOpportunitys,param.salesForecastTimeRange,data.value.salesStages.length);
                    that.chart.render(info);
                }
            });
        },
        //窗口缩放时重绘
        _resize:function(){
            
        }
    });
    /**
    *图表类型D,未赢单机会金额-时间分布
    **/
    var Typed=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Bubblechart({"element":element});
            this.attr={
                path:this.apipath+"/SalesStatistic/GetSalesOppNotWinChartOfEmployee"
            };
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.update(param);
        },
        //数据格式化
        trans:function(data,timerange,length){
            var that=this;
            timerange=parseInt(timerange);
            var info={
                width:525,          //宽度(em)
                height:270,         //高度(em)
                topgutter:30,       //顶部边距(em)
                bottomgutter:30,    //底部边距(em)
                rightgutter:0,     //右边距(em)
                tip:"{{mark}}\n预计成交日期 {{date}}\n预计成交金额 {{amount}}",
                xAxis:this.getXaxis(timerange),
                yAxis:{
                    max:that.getMaxy(data),
                    linenum:5
                }
                /*,
                series:[
                    {
                        type:'num',
                        name:'bubblec',
                        data:[[5,47,12],[15,12,12],[25,176,12],[35,30,12],[45,98,12],[55,117,12],[65,60,12],[75,78,12],[85,12,12],[95,77,12]],
                        color:'#5153aa'
                    },
                    {
                        type:'num',
                        name:'bubbled',
                        data:[[105,47,12],[115,12,12],[105,176,12],[95,30,12],[85,98,12],[75,17,12],[65,60,12],[55,78,12],[45,12,12],[35,77,12]],
                        color:'#277ebf'
                    }
                ]
                */
            }; 
            /*================================================
            进行数据转化 相同stage的存储在同一个数组中  
            ==================================================*/
            var list=[]; //存储第一次转化的数据
            var stage;   //阶段缓存
            for(var i=0;i<data.length;i++){
                stage=data[i]['SalesStage']['salesStageNo'];
                if(!list[stage]){
                    list[stage]={type:'normal'};
                    list[stage]['name']=data[i]['SalesStage']['name'];
                    list[stage]['data']=[];
                    list[stage]['color']=that.getColor(stage-1,length);
                }
                var time=that.getXmonth(data[i]['expectedDealTime']);
                var date=that.getDatestr(data[i]['expectedDealTime']);

                //console.log(Raphael.fn.transNum(data[i]['amount']));     
                list[stage]['data'].push([time,parseInt(data[i]['amount']),6,{'mark':data[i]['name'],'date':date,'amount':Raphael.fn.transNum(data[i]['amount'],2)}]);
            }
            info.series=list;
            return info;  
        },
        getMaxy:function(arrdata){
            var max=_.max(arrdata,function(arrdata){return arrdata['amount']})['amount'];
            return this.transMax(max);
        },
        getDatestr:function(time){
            time=time*1000;
            var date=new Date(time);
            var year=date.getFullYear(),
                month=date.getMonth()+1,
                day=date.getDate();

            if(month<10){month="0"+month;}
            if(day<10){day="0"+day;}

            return year+'-'+month+'-'+day;
        },
        getXmonth:function(time){
            time=time*1000;
            var date=new Date(time);
            var month=date.getMonth();
            var day=date.getDate();
            return month*10+(day/31*10);
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    that.destory();
                    var info=that.trans(data.value.salesOpportunitys,param.salesForecastTimeRange,data.value.salesStages.length);
                    that.chart.render(info);
                }
            });
        },
        //窗口缩放时重绘
        _resize:function(){
            
        }
    });
    /*
    *图表类型E,合同回款金额
    */
    var Typee=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Linechart({"element":element});
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.attr={
                path:this.apipath+'/SalesStatistic/GetContractPaymentChartOfRecord'
            };
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var seria=[];
            var max=0;
            var total=0;
            _.each(data,function(val){
                var data=Math.round(val.value1);
                seria.push(data);
                total +=data;
                if(data>max){max=data};
            });
            max=this.transMax(max);
            var info={
                'xAxis':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                'yAxis':{
                    'max':max,
                    'linenum':5
                },
                title:"全年已回款￥"+Raphael.fn.transNumber(total),
                template:"{{num}}月已回款￥ {{Raphael.fn.transNumber(payment)}}",
                width:680,          //默认宽度 (px)
                height:270,         //默认高度 (px)
                topgutter:50,       //顶部边距 (px)
                bottomgutter:30,    //底部边距 (px)
                legend:false,
                series:[
                    {
                        'name':'回款金额',
                        'mark':'payment',
                        'type':'cube',
                        'data':seria,
                        'color':'#77abdd'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    var info=that.trans(data.value.PaymentItems);
                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();

                    //复制一份data 保存渲染的原始数据 
                    that.info=JSON.parse(JSON.stringify(info));


                    that.destory();
                    that.chart.render(info);
                    
                    //如果未绑定缩放事件 绑定缩放
                    //if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            });
        },
        //缩放函数
        _resize:function(){

        }

    });
    /*
    *图表类型F,合同回款比例
    */
    var Typef=Chart.extend({
        _init_:function(element,param){ 
            this.element=$(element);
            this.chart=new Linechart({'element':element});
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.attr={
                path:this.apipath+'/SalesStatistic/GetPaymentInfoChartOfContract'
            };
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var that=this;
            var data=JSON.parse(JSON.stringify(data));
            var seria=[];

            var contractTotal=0;
            var paymentTotal=0;

            _.each(data,function(val){
                if(!val.contractPaymentItems.length){
                    seria.push([0,0]);
                }else{
                    var numarray=that._sum(val.contractPaymentItems);
                    seria.push(numarray);
                    contractTotal +=numarray[0];
                    paymentTotal +=numarray[1];
                }
            });

            //双层柱状 比较种柱状的最大值 取其最大值
            var maxa=_.max(seria, function(li){ return li[0]; })[0];
            var maxb=_.max(seria, function(li){ return li[1]; })[1];
			var max=maxa>maxb? maxa:maxb;
				max=this.transMax(max);

            var info={
                'xAxis':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                'yAxis':{
                    'max':max,
                    'linenum':5
                },
                title:"全年合同签约金额￥"+Raphael.fn.transNumber(contractTotal)+",已回款￥"+Raphael.fn.transNumber(paymentTotal),
                template:"{{num}}月合同签约金额￥ {{Raphael.fn.transNumber(paymentscale[0])}},  已回款￥ {{Raphael.fn.transNumber(paymentscale[1])}}",
                width:680,          //默认宽度 (px)
                height:270,         //默认高度 (px)
                topgutter:50,       //顶部边距 (px)
                bottomgutter:30,    //底部边距 (px)
                legend:false,
                series:[
                    {
                        'name':'合同金额,回款比例',
                        'mark':'paymentscale',
                        'type':'dbcube',
                        'data':seria,
                        'color':'#bbbbbb',
                        'lcolor':'#ff6600'
                    }
                ]
            };
            return info;
        },
        //计算数组总值
        _sum:function(arr){
            var a=0,
                b=0;
            _.each(arr,function(data){
                a +=data.contractAmount;
                b +=data.paymentAmount;
                //console.log(data.paymentAmount);
            });
            a=Math.round(a);
            b=Math.round(b);
            return [a,b];
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    var info=that.trans(data.value.paymentChartItems);
                    info.width=that.element.width();
                    //复制一份data 保存渲染的原始数据 
                    that.info=JSON.parse(JSON.stringify(info));
                    that.destory();
                    that.chart.render(info);
                }
            });
        }
    });
    /*
    *图表类型G,赢单数量时间分布
    */
    var Typeg=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Linechart({"element":element});
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.attr={
                path:this.apipath+'/SalesStatistic/GetWinOrderChartOfEmployee'
            };
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var seria=[];
            var max=0;
            var total=0;
            _.each(data,function(val){
                var data=Math.round(val.winOrderCount);
                seria.push(data);
                if(data>max){max=data};
                total +=data;
            });
            max=this.transMax(max);
            var info={
                'xAxis':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                'yAxis':{
                    'max':max,
                    'linenum':5
                },
                title:"全年已成交"+total+"单",
                template:"{{num}}月已成交{{Raphael.fn.transNumber(winamount)}}单",
                width:680,          //默认宽度 (px)
                height:250,         //默认高度 (px)
                topgutter:30,       //顶部边距 (px)
                bottomgutter:30,    //底部边距 (px)
                legend:false,
                series:[
                    {
                        'name':'赢单数量',
                        'mark':'winamount',
                        'type':'cube',
                        'data':seria,
                        'color':'#77abdd'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    var info=that.trans(data.value.winOrderChartItems);
                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();

                    //复制一份data 保存渲染的原始数据 
                    that.info=JSON.parse(JSON.stringify(info));

                    that.destory();
                    that.chart.render(info);
                    
                    //如果未绑定缩放事件 绑定缩放
                    //if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            });
        },
        //缩放函数
        _resize:function(){

        }

    });
    /*
    *图表类型H,新增客户联系人的数量-时间分布
    */
    var Typeh=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Linechart({"element":element});
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.attr={
                path:this.apipath+'/SalesStatistic/GetFCustomerContactNumChartOfEmployee'
            };
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var customerSeria=[];
            var linkmanSeria=[];

            var max=0;
            var customerTotal=0;
            var contractTotal=0;

            _.each(data,function(val){
                var customerData=Math.round(val.fCustomersCount);
                var linkData=Math.round(val.contactsCount);
                customerSeria.push(customerData);
                linkmanSeria.push(linkData);

                customerTotal +=customerData;
                contractTotal +=linkData;

                //找出最大值
                if(customerData>linkData){linkData=customerData};
                if(linkData>max){max=linkData};
            });
            max=this.transMax(max);
            var info={
                'xAxis':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                'yAxis':{
                    'max':max,
                    'linenum':5
                },
                title:"全年新增客户"+customerTotal+"个，新增联系人"+contractTotal+"个",
                template:"{{num}}月新增客户{{customer}}，新增联系人{{linkman}}",
                width:680,          //默认宽度 (px)
                height:290,         //默认高度 (px)
                topgutter:30,       //顶部边距 (px)
                bottomgutter:70,    //底部边距 (px)
                series:[
                    {
                        'name':'客户',
                        'mark':'customer',
                        'type':'line',
                        'data':customerSeria,
                        'color':'#3597bc'
                    },
                    {
                        'name':'联系人',
                        'mark':'linkman',
                        'type':'line',
                        'data':linkmanSeria,
                        'color':'#f99945'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            this.beforeLoading();
            that.send({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    that.unLoading();
                    var info=that.trans(data.value.fCustomerContactNumChartItems);
                    //console.log(info);
                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();

                    //复制一份data 保存渲染的原始数据 
                    that.info=JSON.parse(JSON.stringify(info));


                    that.destory();
                    that.chart.render(info);
                    
                    //如果未绑定缩放事件 绑定缩放
                    //if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            })
        },
        //缩放函数
        _resize:function(){

        }

    });
	/*
	*销售阶段简易图表
	*/
	var Salesstage=Chart.extend({
		_init_:function(element,stage){
			this.element=$(element);
			this.attr={
				'path':this.apipath+'/SalesStage/GetAllSalesStages'
			};
			this.update(stage);
		},
		update:function(stage){
			var that=this;
			var path=this.attr.path;
			util.api({
				type:"GET",
				url:path,
				success:function(data){
                    that.clear();
					var info=that._trans(data.value.salesStages);
                    //info.width=that.element.width();
                    info.width=336;
                    stage=that.getStage(stage);
					that.chart=new Funnelchartb({'element':that.element[0],'info':info},stage);
				}
			},{loadingType:1})
		},
        //转换数据
		_trans:function(val){
            var self=this;
			var arr=[];
            var map=this.map=[];
			var num=0;
            var color="#ff7e00";                //默认颜色
            var temparr=[];

            //不用的 和 输单模块剔除
			for(var i=0;i<val.length;i++){
				if(val[i].inUse==true&&val[i].name!="输单"){
                    temparr.push(val[i]);
				}
			};
            
            for(var j=0;j<temparr.length;j++){
                //如果数据的名字过长 手动截取 增加...符号
                if(temparr[j]['name'].length>5){
                    temparr[j]['name']=temparr[j]['name'].slice(0,4)+'...';
                }
                arr.push([temparr[j].name+'('+temparr[j].winRate+'%)',self.getColor(j,temparr.length)]);
                map[temparr[j].salesStageNo]=j;
            }
            
			var info={
	        	width:340,                //宽度(em)
	            toppadding:0,             //顶部边距(em)
	            bottompadding:0,          //底部边距(em)
	            rightpadding:175,         //右部边距(em)
	            title:"销售阶段",         //
	            series:{
	                name:'Salesstage',
	                data:arr
	            }
        	};
			return info;
		},
        //改变销售阶段
		changeStage:function(num){
            num=this.getStage(num);
			this.chart.activeStage(num);
		},
        getStage:function(num){
            num=parseInt(num);
            return this.map[num];
        },
        clear:function(){
            this.element.empty();
        }
	})
	
    exports.Typea=Typea;
    exports.Typeb=Typeb;
    exports.Typeba=Typeba;
    exports.Typec=Typec;
    exports.Typed=Typed;
    exports.Typee=Typee;
    exports.Typef=Typef;
    exports.Typeg=Typeg;
    exports.Typeh=Typeh;
    exports.Salesstage=Salesstage;
});
