/*! 2018-3-2 author:liuxiaofan */
webpackJsonp([32],{574:function(e,t,a){a(712);var o=a(54)(a(688),a(728),"data-v-639ff5c3",null);e.exports=o.exports},606:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(35);t.default={data:function(){return{loading:!1,loadingInstance:null}},mounted:function(){this.$refs.loadingContainer||console.warn("你使用了loadingMixin，但没有指定ref=loadingContainer的DOM节点，系统会自动在body上启用加载效果",this)},watch:{loading:function(e){e?this.loadingInstance=o.Loading.service({target:this.$refs.loadingContainer}):this.loadingInstance&&(this.loadingInstance.close(),this.loadingInstance=null)}}}},607:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return{needReload:!0}},props:{options:{type:Object,default:{}},selected:{type:Boolean,default:!1}},watch:{options:{deep:!0,handler:function(e){console.log(e),this.needReload=!0,this.selected&&this._reload()}},selected:function(e){e&&this._reload()}},methods:{_reload:function(){this.needReload&&(this.reload(),this.needReload=!1)}}}},688:function(e,t,a){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(606),l=o(n),i=a(607),s=o(i),d=a(35);t.default={mixins:[l.default,s.default],data:function(){return{databaseRemoteDataList:[]}},components:{"el-table":d.Table,"el-table-column":d.TableColumn},methods:{reload:function(){this.getDatabaseRemoteData()},getDatabaseRemoteData:function(){var e=this;e.loading=!0,e.api.getSingleTransDatabaseRemoteDataList({data:{condition:e.options},success:function(t){0===t.code&&(e.databaseRemoteDataList=t.data)},complete:function(){e.loading=!1}})}}}},699:function(e,t,a){t=e.exports=a(566)(),t.push([e.i,".table-box[data-v-639ff5c3]{height:100%;overflow:auto;position:relative;padding:24px}",""])},712:function(e,t,a){var o=a(699);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);a(567)("7c6030ba",o,!0)},728:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{ref:"loadingContainer",staticClass:"table-box"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.databaseRemoteDataList,stripe:""}},[a("el-table-column",{attrs:{prop:"type",width:"200",label:"类型"}}),e._v(" "),a("el-table-column",{attrs:{prop:"callFrom",label:"调用来源"}}),e._v(" "),a("el-table-column",{attrs:{prop:"callTo",label:"调用去向"}}),e._v(" "),a("el-table-column",{attrs:{prop:"details",label:"详情"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticStyle:{"{\n               overflow":"hidden","text-overflow":"ellipsis","word-wrap":"break-word",display:"-webkit-box","-webkit-line-clamp":"3","-webkit-box-orient":"vertical"},attrs:{title:t.row.details}},[e._v(e._s(t.row.details)+"\n        ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"callCount",width:"100",label:"调用次数"}}),e._v(" "),a("el-table-column",{attrs:{prop:"elapsedTime",width:"100",label:"总耗时(ms)"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s((+t.row.elapsedTime).toFixed(2))+"\n      ")]}}])})],1)],1)},staticRenderFns:[]}}});