/*! 2018-3-2 author:liuxiaofan */
webpackJsonp([28],{603:function(t,e,i){i(882);var n=i(54)(i(812),i(937),"data-v-dbd3ccca",null);t.exports=n.exports},754:function(t,e,i){t.exports={default:i(755),__esModule:!0}},755:function(t,e,i){i(757),t.exports=i(24).Object.values},756:function(t,e,i){var n=i(67),a=i(58),o=i(73).f;t.exports=function(t){return function(e){for(var i,c=a(e),r=n(c),s=r.length,l=0,d=[];s>l;)o.call(c,i=r[l++])&&d.push(t?[i,c[i]]:c[i]);return d}}},757:function(t,e,i){var n=i(65),a=i(756)(!1);n(n.S,"Object",{values:function(t){return a(t)}})},812:function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var a=i(754),o=n(a),c=i(201),r=n(c),s=i(91),l=n(s),d=i(202),u=i(35);e.default={name:"instance-list",components:{"el-button":u.Button,"el-table":u.Table,"el-table-column":u.TableColumn,"el-input":u.Input,"el-form":u.Form,"el-form-item":u.FormItem,"el-dialog":u.Dialog,"el-pagination":u.Pagination,"el-breadcrumb":u.Breadcrumb,"el-breadcrumb-item":u.BreadcrumbItem,"el-switch":u.Switch,"el-tooltip":u.Tooltip,"el-tag":u.Tag,"el-checkbox":u.Checkbox},mounted:function(){this.getInstanceList()},data:function(){return{statusMap:{"-3":{text:"错误",color:"danger"},"-2":{text:"失联",color:"danger"},"-1":{text:"禁用",color:"gray"},0:{text:"初始化",color:"warning"},1:{text:"活跃",color:"success"}},originInstanceList:[],mutiConfig:!1,isAllChecked:!1,dialogSearchName:"",tempModifyingName:"",allDialogInstanceSelected:!1,paginator:{currentPage:1,total:50},searchName:"",configDialogVisible:!1,appConfig:_.cloneDeep(d.appConfig),configIndexMap:_.cloneDeep(d.configIndexMap),currentInsConfig:_.cloneDeep(d.appConfig),confirmConfigLoading:!1,tempActiveStatus:!1,configItemValidators:d.configItemValidators}},watch:{configDialogVisible:function(t){t||(this.originInstanceList.forEach(function(t){return t.selected=!1}),this.isAllChecked=!1)}},computed:{instanceList:function(){var t=this;return this.originInstanceList.filter(function(e){return!t.searchName||-1!==e.name.indexOf(t.searchName)})},dialogInstanceList:function(){var t=this,e=this.originInstanceList.filter(function(e){return!t.dialogSearchName||-1!==e.name.indexOf(t.dialogSearchName)});return this.$nextTick(function(){t.toggleInstanceSelected()}),e},configTableList:function(){var t=[];for(var e in this.configIndexMap)this.currentInsConfig[this.configIndexMap[e]]&&t.push({configName:this.appConfig[this.configIndexMap[e]].name,appConfig:this.appConfig[this.configIndexMap[e]].value,key:this.configIndexMap[e]});return t}},methods:{getInstanceList:function(){var t=this,e=null;t.api.getInstanceList({data:{tierId:this.$route.query.tierId},beforeSend:function(){e=u.Loading.service({target:t.$refs.tableContainer})},complete:function(){e.close()},success:function(e){0===e.code&&(t.originInstanceList=e.data.map(function(t,e){return(0,l.default)({index:e,modifying:!1,tempName:"",loading:!1,correct:!0,warning:"",selected:!1},t)}))}})},intoModifying:function(t){t.row.modifying=!0,t.row.tempName=t.row.name,this.$nextTick(function(){$($(".instance-name-modifying")[t.$index]).find("input")[0].focus()})},cancelModify:function(t){t.row.modifying=!1,t.row.correct=!0},validateName:function(t){return(0,d.nameValidator)({},t.row.tempName,function(e){return e instanceof Error?(t.row.warning=e.toString().substring(7),t.row.correct=!1):t.row.correct=!0})},confirmModify:function(t){var e=this;e.validateName(t)&&e.api.updateInstanceName({data:{id:t.row.id,name:t.row.tempName},beforeSend:function(){t.row.loading=!0},complete:function(){t.row.loading=!1},success:function(e){0===e.code?(t.row.modifying=!1,t.row.name=t.row.tempName,(0,u.Notification)({title:"修改成功",type:"success"})):(0,u.Notification)({title:"修改失败",message:e.message,type:"error"})}})},getInstanceConfig:function(t){var e=this;e.mutiConfig=!1,e.configDialogVisible=!0;var i=0,n=null;e.api.getAppConf({data:{applicationId:e.$route.query.applicationId},beforeSend:function(){i++,n||(n=u.Loading.service())},complete:function(){--i<=0&&n.close()},success:function(t){0===t.code&&t.data.forEach(function(t){var i=t.key.replace(/\./g,"_");e.appConfig[i]=(0,l.default)({},e.appConfig[i],t)})}}),e.api.getInsConfig({data:{id:t.row.id,type:t.row.type},beforeSend:function(){i++,n||(n=u.Loading.service())},complete:function(){--i<=0&&n.close()},success:function(t){if(0===t.code){var i={};t.data.forEach(function(t){var n=t.key.replace(/\./g,"_");i[n]={};for(var a in t)i[n][a]=t[a];e.appConfig[n]&&(i[n].type=e.appConfig[n].type,i[n].isBoolean=e.appConfig[n].isBoolean,e.appConfig[n].isBoolean&&(i[n].value="true"===t.value))}),e.currentInsConfig=i}}})},getMutiInstancesConfig:function(){var t=this;t.mutiConfig=!0,t.configDialogVisible=!0;var e=0,i=null;t.api.getAppConf({data:{applicationId:t.$route.query.applicationId,type:t.$route.query.tierType},beforeSend:function(){e++,i||(i=u.Loading.service())},complete:function(){--e<=0&&i.close()},success:function(e){0===e.code&&e.data.forEach(function(e){var i=e.key.replace(/\./g,"_");t.appConfig[i]=(0,l.default)({},t.appConfig[i],e);var n=_.cloneDeep(t.appConfig);(0,r.default)(n).forEach(function(t){n[t].value=""}),t.currentInsConfig=n})}})},confirmConfig:function(){var t=this;if(t.validateAllConfig()){if(t.mutiConfig){var e=[];return this.originInstanceList.forEach(function(t){t.selected&&e.push(t.id)}),0===e.length?void(0,u.Notification)({title:"提示",message:"请选择要更新的实例",type:"warning"}):void t.api.updateMutiInsConf({data:{type:t.$route.query.tierType,configurations:(0,o.default)(t.currentInsConfig).filter(function(t){return""!==t.value}),instanceIds:e},beforeSend:function(){t.confirmConfigLoading=!0},complete:function(){t.confirmConfigLoading=!1},success:function(e){0===e.code?(t.configDialogVisible=!1,(0,u.Notification)({title:"批量修改成功",type:"success"})):(0,u.Notification)({title:"批量修改失败",message:e.message,type:"error"})}})}t.api.updateInsConf({data:{configurations:(0,o.default)(t.currentInsConfig)},beforeSend:function(){t.confirmConfigLoading=!0},complete:function(){t.confirmConfigLoading=!1},success:function(e){0===e.code?(t.configDialogVisible=!1,(0,u.Notification)({title:"修改成功",type:"success"})):(0,u.Notification)({title:"修改失败",message:e.message,type:"error"})}})}},validateConfigItem:function(t){var e=this;if(!e.currentInsConfig[t].value)return e.currentInsConfig[t].correct=!0;if("kepler_data_buffer_size"===t||"kepler_data_send_period"===t||"kepler_data_send_batch_size"===t)return!0;var i=e.configItemValidators[t]?e.configItemValidators[t][1]:null;return i&&"function"==typeof i.validator?i.validator({},e.currentInsConfig[t].value,function(i){return i instanceof Error?(e.currentInsConfig[t].warning=i.toString().substring(7),e.currentInsConfig[t].correct=!1):e.currentInsConfig[t].correct=!0,e.currentInsConfig[t].correct}):(e.currentInsConfig[t].correct=!0,e.currentInsConfig[t].correct)},validateAllConfig:function(){var t=!0;for(var e in this.currentInsConfig)if(this.mutiConfig){if(this.currentInsConfig[e].value&&!(t=this.validateConfigItem(e)))return console.log("校验失败："+e),t}else if(!(t=this.validateConfigItem(e)))return console.log("校验失败："+e),t;return t},toggleInstance:function(t){this.api.updateInstanceEnabled({data:{id:t.id,enabled:t.enabled},beforeSend:function(){t.loading=!0},complete:function(){t.loading=!1},success:function(e){0===e.code?(0,u.Notification)({title:t.enabled?"启用成功":"禁用成功",type:"success"}):((0,u.Notification)({title:t.enabled?"启用失败":"禁用失败",message:e.message,type:"error"}),t.enabled=!t.enabled)},error:function(){t.enabled=!t.enabled}})},toggleInstanceSelected:function(){this.dialogInstanceList.length>0?this.isAllChecked=this.dialogInstanceList.reduce(function(t,e){return e.selected&&t},!0):this.isAllChecked=!1},toggleAllDialogInstanceSelected:function(t,e){var i=this.dialogInstanceList.map(function(t){return t.id});this.originInstanceList.forEach(function(e){i.indexOf(e.id)>-1&&(e.selected=t)})}}}},848:function(t,e,i){e=t.exports=i(566)(),e.push([t.i,".add-btn[data-v-dbd3ccca]{position:relative;float:right;margin-left:10px}.el-button--small[data-v-dbd3ccca]{padding:5px 9px 6px}.mutiple-setting-btn[data-v-dbd3ccca]{position:relative;margin-right:10px;float:right}.search-input[data-v-dbd3ccca]{position:relative;width:250px;float:right}.paginator[data-v-dbd3ccca]{margin-top:10px;text-align:right}.breadcrumb[data-v-dbd3ccca]{display:inline-block;position:relative;bottom:-7px}.instance-name-modifying[data-v-dbd3ccca]{padding-top:5px}.instance-name-modify-input[data-v-dbd3ccca]{width:200px}.modifying-confirm-btn[data-v-dbd3ccca]{margin-left:5px}.modifying-cancel-btn[data-v-dbd3ccca]{position:relative;left:-5px}.config-table-container[data-v-dbd3ccca]{position:relative}.warning[data-v-dbd3ccca]{transition-property:opacity,transform;transition-duration:.3s;transition-timing-function:ease-in-out}.slide-enter-active[data-v-dbd3ccca],.slide-leave-active[data-v-dbd3ccca]{transform:translateY(0);opacity:1}.slide-enter[data-v-dbd3ccca],.slide-leave-active[data-v-dbd3ccca],.slide-leave-to[data-v-dbd3ccca]{transform:translateY(-6px);opacity:0}.switch-container[data-v-dbd3ccca]{position:relative}.setting-layout[data-v-dbd3ccca]{position:static;display:flex;width:100%}.setting-layout .instance-list[data-v-dbd3ccca]{width:300px;padding-right:5px}.setting-layout .instance-list .el-table[data-v-dbd3ccca]{border:1px solid #dcdcdc;border-width:0 1px}.setting-layout .instance-list .instance-list-footer[data-v-dbd3ccca]{height:36px;line-height:36px;border:1px solid #dcdcdc;border-top:0}.setting-layout .instance-list .instance-list-footer .check-all[data-v-dbd3ccca]{margin-left:10px}.setting-layout .instance-list .instance-list-footer span[data-v-dbd3ccca]{float:right;height:36px;line-height:36px;margin-right:10px}.setting-layout .config-table[data-v-dbd3ccca]{flex:1;width:100%}.setting-layout .mutiple-style[data-v-dbd3ccca]{height:500px;overflow:auto}",""])},882:function(t,e,i){var n=i(848);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i(567)("9fb3e8e0",n,!0)},937:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"common-container"},[i("div",{staticClass:"instance-list content"},[i("div",{staticClass:"operation-bar theme-border-color-base"},[i("el-breadcrumb",{staticClass:"breadcrumb"},[i("el-breadcrumb-item",{attrs:{to:{name:"settings-app-list",query:{applicationFilterName:t.$route.applicationFilterName}}}},[t._v(t._s(t.$route.query.applicationName)+"\n\n        ")]),t._v(" "),i("el-breadcrumb-item",{attrs:{to:{name:"settings-tier-list",query:{tierFilterName:t.$route.query.tierFilterName,applicationId:t.$route.query.applicationId,applicationName:t.$route.query.applicationName,applicationFilterName:t.$route.query.applicationFilterName}}}},[t._v(t._s(t.$route.query.tierName)+"\n\n        ")]),t._v(" "),i("el-breadcrumb-item",[t._v("实例列表")])],1),t._v(" "),i("el-input",{staticClass:"search-input",attrs:{placeholder:"请输入实例名称","prefix-icon":"el-icon-search",size:"small"},model:{value:t.searchName,callback:function(e){t.searchName=e},expression:"searchName"}}),t._v(" "),i("el-button",{staticClass:"mutiple-setting-btn",attrs:{type:"primary",size:"small"},on:{click:function(e){t.getMutiInstancesConfig()}}},[i("i",{staticClass:"ion-gear-b"}),t._v("批量配置\n      ")])],1),t._v(" "),i("div",{ref:"tableContainer",staticStyle:{position:"relative"}},[i("el-table",{staticClass:"list-table",staticStyle:{width:"100%"},attrs:{data:t.instanceList}},[i("el-table-column",{attrs:{label:"实例"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"点击修改实例名称",placement:"right"}},[i("span",{directives:[{name:"show",rawName:"v-show",value:!e.row.modifying,expression:"!scope.row.modifying"}],staticClass:"theme-font-color-primary",on:{click:function(i){t.intoModifying(e)}}},[t._v(t._s(e.row.name))])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.row.modifying,expression:"scope.row.modifying"}],staticClass:"instance-name-modifying"},[i("el-input",{staticClass:"instance-name-modify-input",attrs:{size:"mini"},on:{change:function(i){t.validateName(e)}},model:{value:e.row.tempName,callback:function(i){t.$set(e.row,"tempName",i)},expression:"scope.row.tempName"}}),t._v(" "),i("el-button",{staticClass:"modifying-confirm-btn",attrs:{type:"primary",size:"mini",loading:e.row.loading,disabled:!e.row.tempName.length},on:{click:function(i){t.confirmModify(e)}}},[i("i",{staticClass:"ion-checkmark-round"})]),t._v(" "),i("el-button",{staticClass:"modifying-cancel-btn",attrs:{size:"mini"},on:{click:function(i){t.cancelModify(e)}}},[i("i",{staticClass:"ion-close-round"})]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!e.row.correct,expression:"!scope.row.correct"}],staticClass:"theme-font-color-danger"},[t._v(t._s(e.row.warning))])],1)]}}])}),t._v(" "),i("el-table-column",{attrs:{prop:"address",label:"主机:端口"}}),t._v(" "),i("el-table-column",{attrs:{width:"120",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-tag",{attrs:{type:t.statusMap[e.row.status].color}},[t._v(t._s(t.statusMap[e.row.status].text))])]}}])}),t._v(" "),i("el-table-column",{attrs:{width:"120",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{type:"text",size:"small"},on:{click:function(i){t.getInstanceConfig(e)}}},[t._v("配置")])]}}])}),t._v(" "),i("el-table-column",{attrs:{width:"120",label:"禁用/启用"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{ref:"switchContainer",staticClass:"switch-container"},[i("el-switch",{attrs:{"active-text":e.row.loading?"...":void 0,"inactive-text":e.row.loading?"...":void 0},on:{change:function(i){t.toggleInstance(t.originInstanceList[e.row.index])}},model:{value:t.originInstanceList[e.row.index].enabled,callback:function(i){t.$set(t.originInstanceList[e.row.index],"enabled",i)},expression:"originInstanceList[scope.row.index].enabled"}})],1)]}}])})],1)],1),t._v(" "),i("el-dialog",{attrs:{width:t.mutiConfig?"80%":"50%",title:"实例配置",visible:t.configDialogVisible},on:{"update:visible":function(e){t.configDialogVisible=e}}},[i("div",{ref:"configContainer",staticClass:"setting-layout",class:{"mutiple-style":t.mutiConfig}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.mutiConfig,expression:"mutiConfig"}],staticClass:"instance-list"},[i("div",{staticClass:"toolbar"},[i("el-input",{staticClass:"apm-input-border-radius__4-4-0-0",attrs:{placeholder:"请输入要检索的实例名称","prefix-icon":"el-icon-search"},model:{value:t.dialogSearchName,callback:function(e){t.dialogSearchName=e},expression:"dialogSearchName"}})],1),t._v(" "),i("el-table",{ref:"instanceTable",staticStyle:{width:"100%"},attrs:{data:t.dialogInstanceList,height:"428","show-header":!1}},[i("el-table-column",{attrs:{width:"50",label:"全选"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-checkbox",{on:{change:function(i){t.toggleInstanceSelected(e.row)}},model:{value:e.row.selected,callback:function(i){t.$set(e.row,"selected",i)},expression:"scope.row.selected"}})]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"请选择要更新的实例",prop:"name"}})],1),t._v(" "),i("div",{staticClass:"instance-list-footer"},[i("el-checkbox",{staticClass:"check-all",attrs:{label:"全选"},on:{change:t.toggleAllDialogInstanceSelected},model:{value:t.isAllChecked,callback:function(e){t.isAllChecked=e},expression:"isAllChecked"}}),t._v(" "),i("span",{staticStyle:{float:"right"}},[t._v("\n                  当前选中"+t._s(t.originInstanceList.filter(function(t){return t.selected}).length)+"个\n                ")])],1)],1),t._v(" "),i("div",{staticClass:"config-table"},[i("el-table",{staticClass:"apm-table-bordered",staticStyle:{width:"100%"},attrs:{data:t.configTableList,height:t.mutiConfig?504:""}},[i("el-table-column",{attrs:{property:"configName",label:"配置名称",width:"150"}}),t._v(" "),i("el-table-column",{attrs:{property:"appConfig",label:"应用配置",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                  "+t._s("boolean"==typeof e.row.appConfig?e.row.appConfig?"ON":"OFF":e.row.appConfig)+"\n                ")]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"实例配置",property:"key"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticStyle:{"padding-top":"5px"}},[t.currentInsConfig[e.row.key].isBoolean?t._e():i("el-input",{staticClass:"config-input",attrs:{size:"mini"},on:{change:function(i){t.validateConfigItem(e.row.key)}},model:{value:t.currentInsConfig[e.row.key].value,callback:function(i){t.$set(t.currentInsConfig[e.row.key],"value",i)},expression:"currentInsConfig[scope.row.key].value"}}),t._v(" "),t.currentInsConfig[e.row.key].isBoolean?i("el-switch",{staticClass:"config-switch",model:{value:t.currentInsConfig[e.row.key].value,callback:function(i){t.$set(t.currentInsConfig[e.row.key],"value",i)},expression:"currentInsConfig[scope.row.key].value"}}):t._e(),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.currentInsConfig[e.row.key].correct,expression:"!currentInsConfig[scope.row.key].correct"}],staticClass:"warning theme-font-color-danger"},[t._v("\n                        "+t._s(t.currentInsConfig[e.row.key].warning)+"\n                      ")])],1)]}}])})],1)],1)]),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"mini"},on:{click:function(e){t.configDialogVisible=!1}}},[t._v("取消")]),t._v(" "),i("el-button",{attrs:{type:"primary",loading:t.confirmConfigLoading,size:"mini"},on:{click:t.confirmConfig}},[t._v("确定")])],1)])],1)])},staticRenderFns:[]}}});