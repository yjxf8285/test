/*! 2018-3-2 author:liuxiaofan */
webpackJsonp([0],{219:function(t,e,a){a(876);var r=a(54)(a(792),a(929),"data-v-9cb0076c",null);t.exports=r.exports},608:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{chartColors:["#a8d96f","#85cae6","#fab421","#f38211","#49a778","#e66a3e","#9d6858","#83bc1c","#4d6e83","#bac1c8"]}},created:function(){$(window).on("resize",this.change)},destroyed:function(){$(window).off("resize",this.change)},methods:{change:function(){this.chart&&this.chart.resize()}}}},609:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a(140),n=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default={data:function(){return{topBarQueryData:{}}},props:{},watch:{},computed:{appId:function(){return this.topBarQueryData.system.id},startTime:function(){return Number(this.topBarQueryData.time.startTime)},endTime:function(){return n.default.cutEndTime(Number(this.topBarQueryData.time.endTime))},aggrInterval:function(){return n.default.intervalToGranularity(this.endTime-this.startTime)},interval:function(){return""}},methods:{}}},610:function(t,e,a){a(614);var r=a(54)(a(611),a(615),"data-v-79cbf3c8",null);t.exports=r.exports},611:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{headerHeight:50}},props:{showBorder:{required:!1,default:!1},showHeader:{required:!1,default:!1},title:{default:""},isEmpty:{default:!0},isLoading:{default:!1},height:{default:350,required:!1}}}},613:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".chart-container[data-v-79cbf3c8]{position:relative;border:0 solid;margin-bottom:16px;border-radius:2px;width:100%;height:100%}.chart-title[data-v-79cbf3c8]{width:100%;padding:0 16px;box-sizing:border-box;font-size:14px;color:#666!important}.chart-title .title-icon[data-v-79cbf3c8]{font-size:18px;margin-right:12px}.chart-placeholder[data-v-79cbf3c8]{position:relative;z-index:1;width:100%;height:100%;text-align:center}.chart-placeholder span[data-v-79cbf3c8]{position:absolute;top:50%;margin-top:-7px}.chart-header-hide[data-v-79cbf3c8]{display:none}.chart-border-hide[data-v-79cbf3c8]{border:0}",""])},614:function(t,e,a){var r=a(613);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("a7f96c48",r,!0)},615:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chart-container theme-backgroung-color-white theme-border-color-base",class:{"chart-border-hide":!t.showBorder},style:{height:t.height+"px"}},[a("div",{staticClass:"chart-title theme-font-color-base theme-background-color-normal",class:{"chart-header-hide":!t.showHeader},style:{height:t.headerHeight+"px",lineHeight:t.headerHeight+"px"}},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v("\n    "+t._s(t.title)+"\n  ")]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.isEmpty&&!t.isLoading,expression:"isEmpty && !isLoading"}],staticClass:"chart-placeholder theme-background-color-normal-1",style:{height:(t.showHeader?t.height-t.headerHeight:t.height)+"px"}},[a("span",{staticClass:"theme-font-color-weaken"},[t._v("暂无数据")])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.isEmpty,expression:"!isEmpty"}],staticClass:"chart-content",style:{height:(t.showHeader?t.height-t.headerHeight:t.height)+"px"}},[t._t("default")],2)])},staticRenderFns:[]}},658:function(t,e,a){a(675);var r=a(54)(a(660),a(678),"data-v-9e92d55c",null);t.exports=r.exports},659:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(201),i=r(n),o=a(140),s=r(o),c=a(608),l=r(c);e.default={mixins:[l.default],props:{optionData:{type:Object,default:{}}},data:function(){return{defOption:{}}},computed:{noData:function(){return(0,i.default)(this.optionData).length<=0}},watch:{optionData:{deep:!0,handler:function(t){this.resetDefData(),this.renderChart()}}},mounted:function(){},methods:{resetDefData:function(){this.defOption={color:this.chartColors,legend:{orient:"vertical",x:"200",y:"middle",data:[],formatter:function(t){return t}},tooltip:{trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},series:[{name:"容忍度",type:"pie",radius:["50%","70%"],center:["40%","50%"],label:{normal:{show:!1,position:"center"},emphasis:{show:!1,textStyle:{fontSize:"30",fontWeight:"bold"}}},labelLine:{normal:{show:!1}},data:[]}]}},renderChart:function(){this.chart||(this.chart=echarts.init(this.$refs.chart)),this.chart.resize();var t=s.default.extend({},this.defOption,this.optionData);this.chart.setOption(t,!0),0===t.series[0].data.length&&this.chart.clear()}}}},660:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(91),i=r(n),o=a(608),s=r(o),c=a(610),l=r(c);e.default={name:"chart-stacked-bar",mixins:[s.default],components:{chartContainer:l.default},data:function(){return{chart:null,localOptions:{title:{text:this.title},grid:{left:"5%",right:"5%",bottom:20,top:40},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c}%",confine:!0},legend:{bottom:0,data:[]},calculable:!0,xAxis:[{type:"value"}],yAxis:[{type:"category",data:[]}],series:[]},legends:[],selectedLegends:{}}},props:{title:String,height:{required:!1,default:200},showHeader:{required:!1,default:!0},showBorder:{required:!1,default:!0},yAxisCategoryText:{required:!0,default:"耗时"},stackText:{required:!1,default:"time"},data:{type:Array,required:!0},loading:!1,options:Object,isAutoHeight:!1},watch:{data:{deep:!0,handler:function(t){this.renderChart()}},loading:function(t){t?this.chart.showLoading({color:"#cccccc",text:" "}):this.chart.hideLoading()}},mounted:function(){var t=this;t.chart=echarts.init(t.$refs.chart),t.renderChart(),t.chart.on("legendselectchanged",function(e){t.selectedLegends=e.selected})},methods:{renderChart:function(){var t=this;if(console.log(this),this.localOptions.series=[],this.localOptions.legend.data=[],this.legends=[],this.selectedLegends={},!_.isEmpty(this.data)){this.localOptions.yAxis[0].data=[this.yAxisCategoryText];var e=0;this.data.forEach(function(a){e+=a.name.length,t.localOptions.series.push({name:a.name,type:"bar",stack:t.stackText,itemStyle:{normal:{label:{show:!1,position:"insideRight"}}},data:[a.value]}),t.localOptions.legend.data.push(a.name)}),this.localOptions.legend.show=!1,this.localOptions.legend.formatter=e>200?function(t){return echarts.format.truncateText(t,80,"12px Microsoft Yahei","…")}:null,this.localOptions.legend.tooltip={show:e>200},this.localOptions.legend.top="bottom",this.chart.setOption((0,i.default)({color:this.chartColors},this.localOptions,this.options),!0);var a=this.chart.getOption(),r=a.color;this.legends=a.series.map(function(e,a){return t.selectedLegends[e.name]=!0,{color:r[a],name:e.name}}),this.$nextTick(function(){t.chart.resize()})}},selectLegend:function(t,e){this.chart.dispatchAction({type:"legendToggleSelect",name:t.name})}}}},672:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".chart[data-v-3ab9747e]{height:100%;display:flex;align-items:center;justify-content:center}",""])},673:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".chart[data-v-9e92d55c]{width:100%;height:100%}.chart-legends[data-v-9e92d55c]{text-align:center}.chart-legends li[data-v-9e92d55c]{display:inline-block;padding-left:5px;padding-bottom:5px;position:relative;cursor:pointer}.chart-legends li i[data-v-9e92d55c]{float:left;width:20px;line-height:16px;height:16px;border-radius:5px}.chart-legends li i.selected[data-v-9e92d55c]{background-color:#ccc!important}.chart-legends li span[data-v-9e92d55c]{display:inline-block;margin-left:4px;line-height:18px}",""])},674:function(t,e,a){var r=a(672);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("2f744798",r,!0)},675:function(t,e,a){var r=a(673);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("383ab79a",r,!0)},676:function(t,e,a){a(674);var r=a(54)(a(659),a(677),"data-v-3ab9747e",null);t.exports=r.exports},677:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{ref:"chart",staticClass:"chart"},[a("i",{staticClass:"el-icon-loading"})])},staticRenderFns:[]}},678:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chart-stacked-bar"},[a("chart-container",{attrs:{height:t.height,"show-header":t.showHeader,"show-border":t.showBorder,title:t.title,isLoading:t.loading,"is-empty":!(t.data&&t.data.length),isAutoHeight:t.isAutoHeight}},[a("div",{ref:"chart",staticClass:"chart"})]),t._v(" "),a("ul",{staticClass:"chart-legends"},t._l(t.legends,function(e,r){return a("li",{key:r},[a("a",{attrs:{href:"javascript:void(0);"},on:{click:function(a){t.selectLegend(e,r)}}},[a("i",{class:{selected:!t.selectedLegends[e.name]},style:{backgroundColor:e.color}}),t._v(" "),a("span",[t._v(t._s(e.name))])])])}))],1)},staticRenderFns:[]}},679:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(201),i=r(n),o=a(140),s=r(o),c=a(608),l=r(c);e.default={name:"chart-area-graph",mixins:[l.default],props:{optionData:{type:Object,default:{}}},data:function(){return{defOption:{}}},computed:{noData:function(){return(0,i.default)(this.optionData).length<=0}},watch:{optionData:{deep:!0,handler:function(t){this.resetDefData(),this.renderChart()}}},methods:{resetDefData:function(){this.defOption={noDataLoadingOption:{text:"暂无数据",effect:"bubble",effectOption:{effect:{n:0}}},tooltip:{trigger:"axis"},color:{type:"radial",x:.5,y:.5,r:.5,colorStops:[{offset:0,color:"red"},{offset:1,color:"blue"}],globalCoord:!1},grid:{top:"5",left:"10",right:"15",bottom:"8",containLabel:!0},xAxis:{type:"category",boundaryGap:!1,data:[]},yAxis:{type:"value",splitLine:{show:!1}},series:[{name:"",type:"line",smooth:!0,sampling:"average",hoverAnimation:!0,itemStyle:{normal:{color:this.chartColors[0]}},areaStyle:{normal:{}},data:[]}]}},renderChart:function(){if(this.chart||(this.chart=echarts.init(this.$refs.chart)),this.noData)this.chart.clear();else{this.chart.resize();var t=s.default.extend(this.defOption,this.optionData);this.chart.setOption(t,!0)}}}}},681:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{barData:{type:Array,validator:function(t){return t.length<5},default:[3,3,3]}},data:function(){return{colorsF:["#a8d96f","#85cae6","#fab421","#f38211"],colorsT:["#a8d96f","#85cae6","#f38211"]}},computed:{titleCount:function(){return new Function("return "+this.barData.join("+"))()},percents:function(){var t=this;return this.barData.map(function(e){return e>0?e/t.titleCount*100:0})}}}},700:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".chart[data-v-65382739]{height:100%;display:flex;align-items:center;justify-content:center}",""])},704:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".percent-bar[data-v-dd29795a]{background:#eee;display:flex}.percent-bar .item[data-v-dd29795a]{height:6px}",""])},713:function(t,e,a){var r=a(700);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("d97534de",r,!0)},717:function(t,e,a){var r=a(704);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("0df310b5",r,!0)},718:function(t,e,a){a(713);var r=a(54)(a(679),a(729),"data-v-65382739",null);t.exports=r.exports},720:function(t,e,a){a(717);var r=a(54)(a(681),a(733),"data-v-dd29795a",null);t.exports=r.exports},729:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{ref:"chart",staticClass:"chart"},[a("i",{staticClass:"el-icon-loading"})])},staticRenderFns:[]}},733:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"percent-bar"},[t._l(t.percents,function(e,r){return 3===t.percents.length?a("div",{key:r,staticClass:"item",style:{width:e+"%",background:t.colorsT[r]}}):t._e()}),t._v(" "),t._l(t.percents,function(e,r){return 4===t.percents.length?a("div",{key:r,staticClass:"item",style:{width:e+"%",background:t.colorsF[r]}}):t._e()})],2)},staticRenderFns:[]}},734:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(201),i=r(n),o=a(140),s=r(o),c=a(608),l=r(c);e.default={mixins:[l.default],props:{optionData:{type:Object,default:{}}},data:function(){return{defOption:{}}},computed:{noData:function(){return(0,i.default)(this.optionData).length<=0}},watch:{optionData:{deep:!0,handler:function(t){this.resetDefData(),this.renderChart()}}},mounted:function(){},methods:{resetDefData:function(){this.defOption={color:this.chartColors,tooltip:{trigger:"axis",axisPointer:{type:"cross",crossStyle:{color:"#999"}}},legend:{bottom:"10",data:[]},grid:{top:30,left:80,right:70},xAxis:[{type:"category",data:[],axisPointer:{type:"shadow"}}],yAxis:[{type:"value"}],series:[{name:"",type:"bar",data:[]}]}},renderChart:function(){this.chart||(this.chart=echarts.init(this.$refs.chart));var t=this.optionData.xAxis[0].data.length;this.chart.resize(),this.optionData.series.forEach(function(t){for(var e in t.data)"NaN"===t.data[e]&&(t.data[e]=0)});var e=s.default.extend({},this.defOption,this.optionData);this.chart.setOption(e,!0),0===t&&this.chart.clear()}}}},738:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".chart[data-v-11d02004]{height:100%;display:flex;align-items:center;justify-content:center}",""])},740:function(t,e,a){var r=a(738);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("5c741017",r,!0)},743:function(t,e,a){a(740);var r=a(54)(a(734),a(745),"data-v-11d02004",null);t.exports=r.exports},745:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{ref:"chart",staticClass:"chart"},[a("i",{staticClass:"el-icon-loading"})])},staticRenderFns:[]}},749:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{needReload:!1}},props:{condition:Object,selected:Boolean},watch:{condition:{deep:!0,handler:function(t){this.needReload=!0,this.selected&&this._reload()}},selected:{deep:!0,handler:function(t){t&&this._reload()}}},methods:{_reload:function(){this.needReload&&(this.reload(),this.needReload=!1)}}}},792:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(35),i=a(212),o=r(i),s=a(720),c=r(s),l=a(895),d=r(l),u=a(894),h=r(u),p=a(896),f=r(p),m=a(609),v=r(m);e.default={components:{"el-pagination":n.Pagination,"el-table":n.Table,"el-table-column":n.TableColumn,"el-tabs":n.Tabs,"el-tab-pane":n.TabPane,"el-input":n.Input,FilterBarComplex:o.default,Popover:n.Popover,PercentBar:c.default,RemotePerformance:d.default,RemoteError:h.default,RemoteSnapshot:f.default},mixins:[v.default],data:function(){return{title:"远程调用",url:"",queryData:this.$route.query,currentTab:"performance",fiterBarData:[],topBarData:[],condition:{},filterListData:[{text:"调用者",disable:!1,type:1,itemId:"invokerArray",listData:[]},{text:"错误类型",disable:!1,type:1,itemId:"errorArray",listData:[]}]}},computed:{errorArray:function(){return this.fiterBarData.find(function(t){return"errorArray"===t.itemId})&&this.fiterBarData.find(function(t){return"errorArray"===t.itemId}).infoData.map(function(t){return t.value})||[]},invokerArray:function(){return this.fiterBarData.find(function(t){return"invokerArray"===t.itemId})&&this.fiterBarData.find(function(t){return"invokerArray"===t.itemId}).infoData.map(function(t){return t.value})||[]},responseTime:function(){return this.fiterBarData.find(function(t){return"responseTime"===t.itemId})&&this.fiterBarData.find(function(t){return"responseTime"===t.itemId}).infoData.map(function(t){return t.value})||[]}},mounted:function(){this.url=this.queryData.address,this.title="远程调用 > "+this.queryData.address},methods:{barChange:function(t){this.topBarQueryData=t,this.initFilterBar(),this.reload()},filterbarChange:function(t){this.fiterBarData=t,this.reload()},initFilterBar:function(){this.getRemoteInitiators(),this.getRemoteErrorTypes()},getRemoteInitiators:function(){var t=this;return t.api.getRemoteInitiators({data:{condition:{appId:this.appId,startTime:this.startTime,endTime:this.endTime,type:3,size:100}}}).then(function(e){if(e.success){var a=e.data||[];t.filterListData[0].listData=[],a.forEach(function(e){t.filterListData[0].listData.push({id:e,name:e})})}})},getRemoteErrorTypes:function(){var t=this;return t.api.getRemoteErrorTypes({data:{condition:{appId:this.appId,startTime:this.startTime,endTime:this.endTime,type:3,size:100}}}).then(function(e){if(e.success){var a=e.data||[];t.filterListData[1].listData=[],a.forEach(function(e){t.filterListData[1].listData.push({id:e,name:e})})}})},reload:function(){var t={appId:this.appId,interval:this.interval,aggrInterval:this.aggrInterval,startTime:this.startTime,endTime:this.endTime,minResponseTime:this.responseTime[0],maxResponseTime:this.responseTime[1],spanTransaction:this.invokerArray,transaction:this.invokerArray,error:this.errorArray,callers:this.invokerArray,errorTypes:this.errorArray,uri:this.url,address:this.url};this.condition=t}}}},793:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(140),i=r(n),o=a(718),s=r(o),c=a(676),l=r(c),d=a(658),u=r(d),h=a(749),p=r(h),f=a(35);e.default={name:"remote-error",components:{"el-pagination":f.Pagination,"el-table":f.Table,"el-table-column":f.TableColumn,ChartAreaGraph:s.default,ChartPie:l.default,StackedBarChart:u.default},mixins:[p.default],data:function(){return{legentMaxLength:10,totalCount:0,errorSectionsOption:{},topNErrorOption:{},chartData:[],invokerErrorCountData:[]}},methods:{getRemoteErrorSectionsData:function(){var t=this;this.api.getRemoteErrorSectionsData({data:{condition:this.condition}}).then(function(e){if(0===e.code){var a=e.data.bar||[],r=a.map(function(t){return i.default.formatDate(t.time,2)}),n=a.map(function(t){return t.errorCount});t.errorSectionsOption={formatter:function(t,e,r){var n="";return t.map(function(t){var e=a[t.dataIndex];e&&(n="\n                      标题：错误<br>\n                      时间："+i.default.formatDate(e.time,2)+"<br>\n                      错误数："+e.errorCount+"<br>\n                      请求次数："+e.reqCount+"<br>\n                      ")}),n},xAxis:{data:r},series:[{data:n}]}}})},getRemoteErrorTopNData:function(){var t=this;this.api.getRemoteErrorTopNData({data:{condition:this.condition,topN:5}}).then(function(e){if(0===e.code){var a=e.data.pie||[];t.topNErrorOption={legend:{orient:"vertical",x:"340",y:"middle",data:a.map(function(t){return t.error}),formatter:function(t){return t}},series:[{name:"错误信息",data:a.map(function(t){return{value:t.errorCount,name:t.error}})}]}}})},getRemoteErrorcountPercentage:function(){var t=this;return t.api.getRemoteErrorcountPercentage({data:{condition:t.condition}}).then(function(e){if(0===e.code){var a=e.data.spanTransactionBar||[];t.chartData=t.getChartData(a),t.invokerErrorCountData=e.data.spanTransactionList||[]}})},getChartData:function(t){var e=this,a=[],r={name:"其他",value:0};return e.totalCount=0,t&&t.length>0&&(t.forEach(function(t,n){n<e.legentMaxLength?a.push({name:t.spanTransaction,value:t.errorCount}):r.value+=t.errorCount,e.totalCount+=t.errorCount}),r.value>0&&a.unshift(r),a=_.sortBy(a,["value"]).reverse(),a.forEach(function(t){t.value=Math.floor(t.value/e.totalCount*1e4)/100})),a},reload:function(){this.getRemoteErrorSectionsData(),this.getRemoteErrorTopNData(),this.getRemoteErrorcountPercentage()}}}},795:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(140),i=r(n),o=a(658),s=r(o),c=a(743),l=r(c),d=a(749),u=r(d),h=a(35);e.default={name:"remote-performance",components:{"el-pagination":h.Pagination,"el-table":h.Table,"el-table-column":h.TableColumn,ChartLineBar:l.default,StackedBarChart:s.default},mixins:[u.default],data:function(){return{legentMaxLength:10,throughputAndTimeTrendOptions:{},invokerElaseTimeData:[],InvokerListData:[]}},methods:{getThroughputAndTimeTrend:function(t){var e=this;return e.api.getThroughputAndTimeTrend({data:{condition:t}}).then(function(t){if(0===t.code){var a=t.data.map(function(t){return{time:t.startTime,value:t.responseTime}}),r=t.data.map(function(t){return{time:t.startTime,value:t.throughput}});e.throughputAndTimeTrendOptions={color:["#5b97fb","#79e216"],grid:{left:"80px"},legend:{data:["吞吐率","响应时间"]},xAxis:[{data:r.map(function(t){return i.default.formatDate(t.time,2)})}],yAxis:[{type:"value",name:"",axisLabel:{formatter:"{value} rpm"}},{type:"value",name:"",axisLabel:{formatter:"{value} ms"}}],series:[{name:"吞吐率",type:"bar",stack:"吞吐率",data:r.map(function(t){return t.value})},{name:"响应时间",type:"line",smooth:!0,yAxisIndex:1,data:a.map(function(t){return t.value})}]}}})},getInvokerElapsedTimePercentage:function(t){var e=this;return this.api.getInvokerElapsedTimePercentage({data:{condition:t}}).then(function(t){if(0===t.code){var a=t.data||[];e.invokerElaseTimeData=a.map(function(t){return{name:t.callerName,value:t.percentage}})}})},getInvokerList:function(t){var e=this;return this.api.getInvokerList({data:{condition:t}}).then(function(t){if(0===t.code){var a=t.data||[];e.InvokerListData=a}})},reload:function(){this.getThroughputAndTimeTrend(this.condition),this.getInvokerElapsedTimePercentage(this.condition),this.getInvokerList(this.condition)}}}},796:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(91),i=r(n),o=a(140),s=r(o),c=a(749),l=r(c),d=a(35);e.default={name:"remote-snapshot",components:{"el-pagination":d.Pagination,"el-table":d.Table,"el-table-column":d.TableColumn,"el-input":d.Input},mixins:[l.default],data:function(){return{snapshotListData:[],snapshotListDataTotal:0,snapshotListDataLoading:!1,searchName:"",pageIndex:0,sortField:"startTime",sortOrder:"asc",timer:null}},methods:{handleGetRemoteSnapshotList:function(){var t=this;this.timer&&(clearTimeout(this.timer),this.timer=null),this.timer=setTimeout(function(){t.timer&&(t.getRemoteSnapshotList(),t.timer=null)},300)},handleCurrentChange:function(t){this.pageIndex=t-1,this.getRemoteSnapshotList()},sortChange:function(t){this.sortField=t.prop||"startTime","ascending"===t.order&&(this.sortOrder="asc"),"descending"===t.order&&(this.sortOrder="desc"),this.getRemoteSnapshotList()},getRemoteSnapshotList:function(){var t=this;return this.snapshotListDataLoading=!0,this.api.getRemoteSnapshotList({data:{condition:(0,i.default)({},this.condition,{transactionFilter:this.searchName}),page:{index:this.pageIndex,size:10},sort:{field:this.sortField,order:this.sortOrder}}}).then(function(e){0===e.code&&(t.snapshotListData=e.data.info||[],t.snapshotListData.forEach(function(t){t.startTime=s.default.formatDate(t.startTime)}),t.snapshotListDataTotal=e.data.totalCount)}).always(function(){t.snapshotListDataLoading=!1})},redirectToSingleComponent:function(t){this.$root.eventBus.openTab({name:t.traceId,type:"single-trans-snapshot",options:{traceId:t.traceId,appId:t.appId,queryStr:t.transaction}})},reload:function(){this.getRemoteSnapshotList()}}}},817:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".remote-performance[data-v-005b6d87]{margin-top:15px}.remote-performance .chart-wrap[data-v-005b6d87]{width:100%;height:300px}.remote-performance .content[data-v-005b6d87]{border-bottom:1px solid #dcdcdc;margin-bottom:16px}.remote-performance .content[data-v-005b6d87]:last-child{border-bottom-width:0}",""])},826:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".remote-error .content[data-v-3c553e9f]{margin-bottom:16px;border-bottom:1px solid #dcdcdc}.remote-error .content[data-v-3c553e9f]:last-child{border-bottom-width:0}.remote-error .multiple[data-v-3c553e9f]{display:flex}.remote-error .multiple .l[data-v-3c553e9f]{flex:1;padding-top:15px}.remote-error .multiple .l .content[data-v-3c553e9f]{margin-bottom:16px;border-bottom:1px solid #dcdcdc}.remote-error .multiple .r[data-v-3c553e9f]{padding-top:15px;width:540px}.remote-error .multiple .r .content[data-v-3c553e9f]{margin-bottom:16px;border-bottom:1px solid #dcdcdc;border-left:1px solid #dcdcdc}.remote-error .search-input[data-v-3c553e9f]{float:right;width:200px;margin:11px}.remote-error .chart-wrap[data-v-3c553e9f]{height:300px}",""])},830:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".remote-snapshot[data-v-61045806]{margin-top:15px}.remote-snapshot .chart-wrap[data-v-61045806]{width:100%;height:300px}.search-input[data-v-61045806]{float:right;width:200px;margin:11px 24px}",""])},842:function(t,e,a){e=t.exports=a(566)(),e.push([t.i,".remote-detail .common-container .content[data-v-9cb0076c]{padding:0}.remote-detail .el-tabs__header[data-v-9cb0076c]{margin:0}.remote-detail .f-r[data-v-9cb0076c]{float:right}",""])},851:function(t,e,a){var r=a(817);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("54fcac14",r,!0)},860:function(t,e,a){var r=a(826);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("05e2e3d1",r,!0)},864:function(t,e,a){var r=a(830);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("1bc9b5de",r,!0)},876:function(t,e,a){var r=a(842);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(567)("0609b34d",r,!0)},894:function(t,e,a){a(860);var r=a(54)(a(793),a(910),"data-v-3c553e9f",null);t.exports=r.exports},895:function(t,e,a){a(851);var r=a(54)(a(795),a(897),"data-v-005b6d87",null);t.exports=r.exports},896:function(t,e,a){a(864);var r=a(54)(a(796),a(914),"data-v-61045806",null);t.exports=r.exports},897:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"remote-performance"},[t._m(0),t._v(" "),a("div",{staticClass:"content chart-wrap"},[a("ChartLineBar",{ref:"chartLineBar",attrs:{optionData:t.throughputAndTimeTrendOptions}})],1),t._v(" "),t._m(1),t._v(" "),a("div",{staticClass:"content"},[a("StackedBarChart",{ref:"chartStackedBar",attrs:{height:150,"show-header":!1,yAxisCategoryText:"慢元素",data:t.invokerElaseTimeData}})],1),t._v(" "),t._m(2),t._v(" "),a("div",{staticClass:"content"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.InvokerListData,stripe:""}},[a("el-table-column",{attrs:{prop:"transName",label:"调用者事务"}}),t._v(" "),a("el-table-column",{attrs:{prop:"tierName",label:"Tier"}}),t._v(" "),a("el-table-column",{attrs:{prop:"responseTimePercentage",sortable:"",label:"响应时间占比"}}),t._v(" "),a("el-table-column",{attrs:{prop:"responseTimeAvg",sortable:"",label:"平均响应时间 (ms)"}}),t._v(" "),a("el-table-column",{attrs:{prop:"throughput",label:"吞吐率"}}),t._v(" "),a("el-table-column",{attrs:{prop:"requestCount",label:"请求次数"}})],1)],1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("吞吐率及响应时间趋势")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("调用者耗时百分比")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("远程调用列表")])])}]}},910:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"remote-error"},[a("div",{staticClass:"multiple"},[a("div",{staticClass:"l"},[t._m(0),t._v(" "),a("div",{staticClass:"content"},[a("div",{staticClass:"chart-wrap"},[a("ChartAreaGraph",{attrs:{optionData:t.errorSectionsOption}})],1)])]),t._v(" "),a("div",{staticClass:"r"},[t._m(1),t._v(" "),a("div",{staticClass:"content"},[a("div",{staticClass:"chart-wrap"},[a("ChartPie",{attrs:{optionData:t.topNErrorOption}})],1)])])]),t._v(" "),t._m(2),t._v(" "),a("div",{staticClass:"content"},[a("StackedBarChart",{ref:"chartStackedBar",attrs:{height:150,"show-header":!1,yAxisCategoryText:"慢元素",data:t.chartData}})],1),t._v(" "),t._m(3),t._v(" "),a("div",{staticClass:"content"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.invokerErrorCountData,stripe:""}},[a("el-table-column",{attrs:{prop:"spanTransaction",label:"调用者事务"}}),t._v(" "),a("el-table-column",{attrs:{prop:"tierName",label:"Tier"}}),t._v(" "),a("el-table-column",{attrs:{prop:"agentName",label:"实例"}}),t._v(" "),a("el-table-column",{attrs:{prop:"errorCount",sortable:"",label:"错误次数"}}),t._v(" "),a("el-table-column",{attrs:{prop:"reqCount",sortable:"",label:"请求次数"}})],1)],1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("错误数趋势")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle",staticStyle:{"border-left":"solid 1px #dcdcdc"}},[a("i",{staticClass:"title-icon icon ion-document-text"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("错误信息（TOP 5）")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("调用者耗时百分比")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("远程调用列表")])])}]}},914:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"remote-snapshot"},[a("div",{staticClass:"header-title tabstyle"},[a("i",{staticClass:"title-icon icon ion-podium"}),t._v(" "),a("span",{staticClass:"title-name"},[t._v("调用者快照列表")]),t._v(" "),a("el-input",{staticClass:"search-input",attrs:{placeholder:"请输入名称",size:"small"},on:{change:t.handleGetRemoteSnapshotList},model:{value:t.searchName,callback:function(e){t.searchName=e},expression:"searchName"}})],1),t._v(" "),a("div",{staticClass:"content"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.snapshotListDataLoading,expression:"snapshotListDataLoading"}],attrs:{data:t.snapshotListData,stripe:""},on:{"sort-change":t.sortChange}},[a("el-table-column",{attrs:{prop:"transaction",width:"120",label:"调用者事务"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("a",{staticClass:"theme-font-color-primary",attrs:{href:"javascript:void(0);"},on:{click:function(a){t.redirectToSingleComponent(e.row)}}},[t._v(t._s(e.row.transaction))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"tierName",label:"Tier"}}),t._v(" "),a("el-table-column",{attrs:{prop:"instanceName",label:"实例"}}),t._v(" "),a("el-table-column",{attrs:{prop:"startTime",label:"发生时间",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n          "+t._s(e.row.startTime)+"\n        ")]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"elapsed",label:"响应时间",sortable:"custom"}}),t._v(" "),a("el-table-column",{attrs:{prop:"errorName",label:"错误类型"}})],1),t._v(" "),a("div",{staticClass:"pag-wrap"},[a("el-pagination",{attrs:{layout:"total, prev, pager, next","page-size":10,total:t.snapshotListDataTotal},on:{"current-change":t.handleCurrentChange}})],1)],1)])},staticRenderFns:[]}},929:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"remote-detail"},[a("top-bar",{attrs:{title:t.title,showBack:!0},on:{barChange:t.barChange}}),t._v(" "),t.filterListData.length>0?a("FilterBarComplex",{staticStyle:{"margin-top":"1px"},attrs:{filterList:t.filterListData},on:{fbarChange:t.filterbarChange}}):t._e(),t._v(" "),a("div",{staticClass:"common-container tab"},[a("div",{staticClass:"content"},[a("el-tabs",{staticClass:"header-margin0",model:{value:t.currentTab,callback:function(e){t.currentTab=e},expression:"currentTab"}},[a("el-tab-pane",{attrs:{label:"性能分析",name:"performance"}},[a("RemotePerformance",{attrs:{condition:t.condition,selected:"performance"===t.currentTab}})],1),t._v(" "),a("el-tab-pane",{attrs:{label:"错误分析",name:"error"}},[a("RemoteError",{attrs:{condition:t.condition,selected:"error"===t.currentTab}})],1),t._v(" "),a("el-tab-pane",{attrs:{label:"快照分析",name:"snapshot"}},[a("RemoteSnapshot",{attrs:{condition:t.condition,selected:"snapshot"===t.currentTab}})],1)],1)],1)])],1)},staticRenderFns:[]}}});