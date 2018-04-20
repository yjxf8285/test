/**
 * 历史日程列表
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;

    var util=require('util');
    var chart=require('modules/crm-chart/mainchart');
    var Subordinate=require('modules/crm-subordinate-select/crm-subordinate-select');
    var Setting = require('modules/crm-salestarget-setting/crm-salestarget-setting');
    
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;

        /**
        *图表关键数字
        */
        var eles=$('.crm-chart-header-spanc span',tplEl);
        var chart0={
            'xiashu':$('.crm-chart-setting-checkbox',tplEl),       //
            'path':/*FS.API_PATH+*/'/SalesStatistic/GetSalesKeyNumbersOfEmployee',
            'monthTarget':eles.eq(2),   //月目标金额
            'monthWin':eles.eq(0),      //月已完成
            'monthRate':eles.eq(1),     //月完成率
            'payMent':eles.eq(3),       //回款金额
            'remaidDay':eles.eq(4),     //剩余天数
            init:function(perid){
                this.perid=perid;
                var xiashu=!!util.mnGetter(this.xiashu);
                this.addEvent();
                this.update(true);
            },
            update:function(bool){
                var that=this;
                var contain;

                if(bool){contain=!!util.mnGetter(this.xiashu)[0];}
                else{contain=!util.mnGetter(this.xiashu)[0];}

                var param={
                    'employeeID':that.perid,
                    'containSubordinate':contain
                };
                var transNumber=Raphael.fn.transNumber;
                util.api({
                    type:"GET",
                    url:this.path,
                    data:param,
                    success:function(data){
                        var value=data.value;
                        var rate;
                        if(value.monthSalesTargetAmount==0){
                            that.monthRate.text('--');
                        }else{
                            that.monthRate.text(Math.round(value.monthWinAmount/value.monthSalesTargetAmount*100)+'%');
                        }

                        that.monthWin.text(transNumber(value.monthWinAmount));
                        that.monthTarget.text(transNumber(value.monthSalesTargetAmount));
                        that.payMent.text(transNumber(value.paymentAmount));
                        that.remaidDay.text(value.remaidDays);
                    }
                })
            },
            addEvent:function(){
                var that=this;
                util.mnEvent(this.xiashu,'change',function (val) {
                    that.update(false);
                });
            },
            changeId:function(perid){
                this.perid=perid;
                this.update(true);
            }
        };
        /**
         *图表A
         *任务完成情况
         */
        var charta={
            'year':$('#crm-chart-a-year',tplEl),
            'month':$('#crm-chart-a-time',tplEl),
            'xiashu':$('#crm-chart-a-involve',tplEl),
            //图表a初始化 初始化元素 绑定事件
            init:function(perid){
                var that=this;

                this.perid=perid;

                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu=!!util.mnGetter(this.xiashu);

                this.chart=new chart.Typea('#crm-chart-a',{salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu})
                this.addEvent();
            },
            addEvent:function(){
                var that=this;
                 $('.crm-chart-a',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                        that._infochange(true);
                    });
                });
                $('.crm-chart-a-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                        that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu;
                var perid=this.perid;
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
            },
            //变换相关人id
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            //销毁图表a 取消注册事件
            destory:function(){

            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
         *图表B
         *销售漏斗
         */
        var chartb={
            'year':$('#crm-chart-b-year',tplEl),
            'month':$('#crm-chart-b-time',tplEl),
            'xiashu':$('#crm-chart-b-involve',tplEl),
            //图表b初始化 初始化元素 绑定事件
            init:function(perid){
                var that=this;

                this.perid=perid;

                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu=!!util.mnGetter(this.xiashu);

                this.chart=new chart.Typeb('#crm-chart-b',{salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu,monthNo:0})
                this.addEvent();
            },
            addEvent:function(){
                var that=this;
                $('.crm-chart-b',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                $('.crm-chart-b-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu,monthNo:0})
            },
            //变换相关人id
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            //销毁图表b 取消注册事件
            destory:function(){
                
            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
        *图表C
        *未赢单机会赢率
        */
        var chartc={
            'year':$('#crm-chart-c-year',tplEl),
            'month':$('#crm-chart-c-time',tplEl),
            'xiashu':$('#crm-chart-c-involve',tplEl),
            //图表b初始化 初始化元素 绑定事件
            init:function(perid){
                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu=!!util.mnGetter(this.xiashu);

                this.perid=perid;

                this.chart=new chart.Typec('#crm-chart-c',{salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu,monthNo:0,dataType:1})
                this.addEvent();
            },
            addEvent:function(){
                var that=this;

                $('.crm-chart-c',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                
                $('.crm-chart-c-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu,monthNo:0,dataType:1})
            },
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            //销毁图表b 取消注册事件
            destory:function(){

            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
        *图表D
        *未赢单机会金额
        */
        var chartd={
            'year':$('#crm-chart-d-year',tplEl),
            'month':$('#crm-chart-d-time',tplEl),
            'xiashu':$('#crm-chart-d-involve',tplEl),
            //图表d初始化 初始化元素 绑定事件
            init:function(perid){
                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu=!!util.mnGetter(this.xiashu);

                this.perid=perid;

                this.chart=new chart.Typed('#crm-chart-d',{salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu,monthNo:0,dataType:2})
                this.addEvent();
            },
            addEvent:function(){
                var that=this;

                $('.crm-chart-d',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                
                $('.crm-chart-d-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    month=util.mnGetter(this.month),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({salesForecastTimeRange:month,fiscalYear:year,employeeID:perid,containSubordinate:xiashu,monthNo:0,dataType:2})
            },
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
        *图表E
        *合同回款金额-时间分布
        */
        var charte={
            'year':$('#crm-chart-e-year',tplEl),
            'xiashu':$('#crm-chart-e-involve',tplEl),
            init:function(perid){
                var year=util.mnGetter(this.year),
                    xiashu=!!util.mnGetter(this.xiashu);

                this.perid=perid;

                this.chart=new chart.Typee('#crm-chart-e',{fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
                this.addEvent();
            },
            addEvent:function(){
                var that=this;

                $('.crm-chart-e',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                
                $('.crm-chart-e-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
            },
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
        *图表F
        *合同回款金额比例-时间分布
        */
        var chartf={
            'year':$('#crm-chart-f-year',tplEl),
            'xiashu':$('#crm-chart-f-involve',tplEl),
            init:function(perid){
                var year=util.mnGetter(this.year),
                    xiashu=!!util.mnGetter(this.xiashu);
                
                this.perid=perid;
                this.chart=new chart.Typef('#crm-chart-f',{fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
                this.addEvent();
            },
            addEvent:function(){
                var that=this;

                $('.crm-chart-f',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                
                $('.crm-chart-f-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
            },
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
        *图表G
        *赢单数量-时间分布
        */
        var chartg={
            'year':$('#crm-chart-g-year',tplEl),
            'xiashu':$('#crm-chart-g-involve',tplEl),
            init:function(perid){
                var year=util.mnGetter(this.year),
                    xiashu=!!util.mnGetter(this.xiashu);
                
                this.perid=perid;
                this.chart=new chart.Typeg('#crm-chart-g',{fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
                this.addEvent();
            },
            addEvent:function(){
                var that=this;

                $('.crm-chart-g',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                
                $('.crm-chart-g-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
            },
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            update:function(){
                this._infochange(true);
            }
        };
        /**
        *图表H
        *新增客户联系人的数量-时间分布
        */
        var charth={
            'year':$('#crm-chart-h-year',tplEl),
            'xiashu':$('#crm-chart-h-involve',tplEl),
            init:function(perid){
                var year=util.mnGetter(this.year),
                    xiashu=!!util.mnGetter(this.xiashu);
                this.perid=perid;
                this.chart=new chart.Typeh('#crm-chart-h',{fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
                this.addEvent();
            },
            addEvent:function(){
                var that=this;

                $('.crm-chart-h',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(true);
                    });
                });
                
                $('.crm-chart-h-chekbox',tplEl).each(function(){
                    util.mnEvent(this,'change',function(val,text){
                       that._infochange(false);
                    });
                });
            },
            _infochange:function(bool){
                var year=util.mnGetter(this.year),
                    xiashu;
                var perid=this.perid;
                
                if(bool){xiashu=!!util.mnGetter(this.xiashu)[0];}
                else{xiashu=!util.mnGetter(this.xiashu)[0];}
                this.chart.update({fiscalYear:year,employeeID:perid,containSubordinate:xiashu});
            },
            changeId:function(perid){
                this.perid=perid;
                this._infochange(true);
            },
            update:function(){
                this._infochange(true);
            }
        };

        
        $('.sub-tpl-switch-mask').hide();
        $('.crm-chart-list',tplEl).children().addClass('crm-chart-list-loadingcard');
        /*========选人初始化及绑定事件========*/
        var employee=util.getCrmData().currentEmp;

        /*============图表依次初始化==========*/
        chart0.init(employee.employeeID);
        charta.init(employee.employeeID);
        chartb.init(employee.employeeID);
        chartc.init(employee.employeeID);
        chartd.init(employee.employeeID);
        charte.init(employee.employeeID);
        chartf.init(employee.employeeID);
        chartg.init(employee.employeeID);
        charth.init(employee.employeeID);
        //debugger;
        var subordinate = new Subordinate({
            "element":$(".crm-chart-settingperson-wrapper",tplEl),
            "employeeName":employee.name,
            "imageSrc":util.getAvatarLink(employee.profileImage, '2'),
            "canSelect":employee.subEmployees &&employee.subEmployees.length > 0
        });
        subordinate.on("selected",function(val){
            employee=val;
            var curEmp = util.getCrmData().currentEmp;
            $(".crm-chart-setting-target", tplEl).html('设置' + ((curEmp.employeeID==employee.employeeID)?'我':employee.name) + '的业务目标');
            chart0.changeId(employee.employeeID);
            charta.changeId(employee.employeeID);
            chartb.changeId(employee.employeeID);
            chartc.changeId(employee.employeeID);
            chartd.changeId(employee.employeeID);
            charte.changeId(employee.employeeID);
            chartf.changeId(employee.employeeID);
            chartg.changeId(employee.employeeID);
            charth.changeId(employee.employeeID);
        });

        /*=======头部是否包含下属绑定事件======*/
        /*
        util.mnEvent($(".crm-chart-setting-checkbox",tplEl),'change',function (val) {
            var checked = false;
            if(val.length < 1){
                checked = true;
            }
            console.log(val);
        });
        */
        /*========设置目标初始化及绑定事件====*/
        var setting=new Setting({});
        $(".crm-chart-setting-target",tplEl).on("click",function(){
            setting.show(employee);
        });
        setting.on("saved",function(){
            chart0.update();
            charta.update();
        });
        //console.log(util.getCrmData());
        //console.log(imgsrc);
    };

});
