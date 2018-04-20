/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/crm-customer-timeline/crm-customer-timeline",["modules/crm-customer-timeline/crm-customer-timeline.html","dialog","util","modules/publish/publish-helper","datatable","moment","uilibs/search-box","uilibs/pagination2","modules/crm-attachment-simple/crm-attachment-simple","modules/crm-contact-box/crm-contact-box","uilibs/tabs","modules/feed-list/feed-list","modules/crm-publish/crm-publish","modules/crm-customer-map/crm-customer-map","modules/crm-follow-up/crm-follow-up"],function(a,b,c){var d=window,e=d.FS,f=e.tpl;f.store,f.list;var g=a("modules/crm-customer-timeline/crm-customer-timeline.html");a("dialog");var h=a("util");a("modules/publish/publish-helper"),a("datatable"),a("moment"),a("uilibs/search-box"),a("uilibs/pagination2");var i=a("modules/crm-attachment-simple/crm-attachment-simple"),j=a("modules/crm-contact-box/crm-contact-box"),k=a("uilibs/tabs"),l=a("modules/feed-list/feed-list"),m=a("modules/crm-publish/crm-publish"),n=a("modules/crm-customer-map/crm-customer-map"),o=a("modules/crm-follow-up/crm-follow-up"),p=Backbone.View.extend({tagName:"div",className:"",template:_.template($(g).filter(".crm-customer-timeline-template").html()),options:{warpEl:null,customerData:null},events:{"click .add-opp-in-customer":"addOpp","click .add-contracts-in-customer":"addContracts","click .add-product-in-customer":"addProduct","click .modify-product-in-opp":"modifyProduct","click .modify-opp-in-opp":"modifyOpp","click .modify-contracts-in-opp":"modifyContracts"},destroy:function(){this.feedpublish&&this.feedpublish.destroy(),this.contactBox&&this.contactBox.destroy()},addOpp:function(){this.v.addOppDialog.show()},addContracts:function(){this.v.addContractDialog.show()},addProduct:function(){this.v.addProductDialog.show()},modifyProduct:function(a){var b=$(a.currentTarget);this.v.addProductDialog.show({oppProductRelationID:b.parent().parent().data("id")})},modifyOpp:function(a){this.v.modifyOppDialog.show({salesOpportunityID:$(a.target).parent().parent().attr("data-id")})},modifyContracts:function(a){this.v.modifyContractDialog.show({contractID:$(a.target).parent().parent().attr("data-id")})},initialize:function(){this.loadData()},render:function(){var a=this.$el,b=this.template,c=this;a.html(b({value:{employees:{}}})),this.options.warpEl.html(a);var d=this.options.customerData.value.FCustomer;$(".customer-no",a).text(d.fCustomerNo||""),$(".customer-addr",a).text(d.address),$(".customer-site",a).html("").html($("<a>").attr("target","_blank").attr("href",d.webSite.indexOf("http://")>-1?d.webSite:"http://"+d.webSite).text(d.webSite));var e=c.responseData.value.OppProductRelations||null,f=c.responseData.value.Opportunitys||null,g=c.responseData.value.Contracts||null,h="",i="",j="";$(".jdata-name",a).text(d.name),e&&e.length>0?(_.each(e,function(a){h+=' <li data-id="'+a.oppProductRelationID+'"> <span class="tit"><a href="javascript:;" class="modify-product-in-opp">'+a.productName+'</a></span> <span class="value" title="单价 '+a.unitAmount+" 数量 "+a.count+'">￥'+a.totalAmount+"</span> </li>"}),$(".detail-left-list-product",a).html('<ul class="detail-left-list-ul">'+h+"</ul>")):$(".detail-left-list-product",a).html('<div class="text-align-c"> 当前客户下没有产品，请在机会下添加</div>'),f&&f.length>0?(_.each(f,function(a){i+=' <li data-id="'+a.salesOpportunityID+'"> <span class="tit"><a href="javascript:;" class="modify-opp-in-opp">'+a.name+'</a></span> <span class="value">'+a.salesStage.winRate+"%</span> </li>"}),$(".detail-left-list-opportunitys",a).html('<ul class="detail-left-list-ul">'+i+"</ul>"),$(".detail-left-list-opportunitys",a).parent().find(".fn-right").css("display","")):$(".detail-left-list-opportunitys",a).html('<div class="text-align-c"> 当前客户下没有机会，<a href="javascript:;" class="add-opp-in-customer">立即添加</a></div>'),g&&g.length>0?(_.each(g,function(a){j+=' <li data-id="'+a.contractID+'"> <span class="tit"><a href="javascript:;" class="modify-contracts-in-opp">'+a.title+'</a></span> <span class="value">'+a.statesDesc+"</span> </li>"}),$(".detail-left-list-contracts",a).html('<ul class="detail-left-list-ul">'+j+"</ul>"),$(".detail-left-list-contracts",a).parent().find(".fn-right").css("display","")):$(".detail-left-list-contracts",a).html('<div class="text-align-c"> 当前客户下没有合同，<a href="javascript:;" class="add-contracts-in-customer">立即添加</a></div>'),this.setCrmAttachment()},refresh:function(){var a=this.options.customerData.value.FCustomer.customerID,b=this,c=this;h.api({url:"/FCustomer/GetFCustomerDetailByID",type:"get",dataType:"json",data:{customerID:a,attachNum:6},success:function(a){if(a.success){b.responseData=a,b.contactBox.reload(b.responseData.value.Contacts||[]);var e=c.responseData.value.OppProductRelations||null,f=c.responseData.value.Opportunitys||null,g=c.responseData.value.Contracts||null,h="",i="",j="";e&&e.length>0?(_.each(e,function(a){h+=' <li data-id="'+a.oppProductRelationID+'"> <span class="tit"><a href="javascript:;" class="modify-product-in-opp">'+a.productName+'</a></span> <span class="value" title="单价 '+a.unitAmount+" 数量 "+a.count+'">￥'+a.totalAmount+"</span> </li>"}),$(".detail-left-list-product",d).html('<ul class="detail-left-list-ul">'+h+"</ul>")):$(".detail-left-list-product",d).html('<div class="text-align-c"> 当前客户下没有产品，请在机会下立即添加</div>'),f&&f.length>0?(_.each(f,function(a){i+=' <li data-id="'+a.salesOpportunityID+'"> <span class="tit"><a href="javascript:;" class="modify-opp-in-opp">'+a.name+'</a></span> <span class="value">'+a.salesStage.winRate+"%</span> </li>"}),$(".detail-left-list-opportunitys",d).html('<ul class="detail-left-list-ul">'+i+"</ul>"),$(".detail-left-list-opportunitys",d).parent().find(".fn-right").css("display","")):$(".detail-left-list-opportunitys",d).html('<div class="text-align-c"> 当前客户下没有机会，<a href="javascript:;" class="add-opp-in-customer">立即添加</a></div>'),g&&g.length>0?(_.each(g,function(a){j+=' <li data-id="'+a.contractID+'"> <span class="tit"><a href="javascript:;" class="modify-contracts-in-opp">'+a.title+'</a></span> <span class="value">'+a.statesDesc+"</span> </li>"}),$(".detail-left-list-contracts",d).html('<ul class="detail-left-list-ul">'+j+"</ul>"),$(".detail-left-list-contracts",d).parent().find(".fn-right").css("display","")):$(".detail-left-list-contracts",d).html('<div class="text-align-c"> 当前客户下没有合同，<a href="javascript:;" class="add-contracts-in-customer">立即添加</a></div>')}}});var d=this.$el,e=this.v.options.customerData.value.FCustomer;$(".jdata-name",d).text(e.name),$(".customer-no",d).text(e.fCustomerNo||""),$(".customer-addr",d).text(e.address),this.customerMapBox.refresh(e.address),$(".customer-site",d).html("").html($("<a>").attr("target","_blank").attr("href",e.webSite.indexOf("http://")>-1?e.webSite:"http://"+e.webSite).text(e.webSite))},loadData:function(){var a=this,b=this.options.customerData.value.FCustomer.customerID;h.api({url:"/FCustomer/GetFCustomerDetailByID",type:"get",dataType:"json",data:{customerID:b,attachNum:6},success:function(b){b.success&&(a.responseData=b,a.render())}})},setFeedList:function(){var a=$(this.$el),b=$(".search-inp",a),c=$(".search-btn",a),d=this,e=this.options.customerData.value.FCustomer.customerID,f=$(".feed-tabs",this.$el);this.feedTabs=new k({element:f,triggers:$(".ui-tab-item",f),panels:$(".ui-tab-panel",f),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render(),this.feedTabs.on("switched",function(a){var f=this.get("panels").eq(a);d.feedList=new l({element:$(".crm-feed-list-warp",f),pagSelector:$(".feed-list-pagination",f),pagOpts:{pageSize:16,visiblePageNums:3},GetBatchFilesSource:1,crmParam:{type:"customer",id:e},listPath:"/CrmFeed/GetFeeds",defaultRequestData:function(){return{feedType:a,fbrType:1,dataID:e,type:1,keyword:_.str.trim(b.val())}},listEmptyText:"暂无记录",searchOpts:{inputSelector:b,btnSelector:c}}),d.feedList.load()}),this.feedTabs.trigger("switched",0,-1),c.on("click",function(a){d.feedList.reload({keyword:_.str.trim(b.val())}),a.preventDefault()})},setPublish:function(){var a=this,b=this.$el,c=this.options.customerData.value.FCustomer.customerID;$(".search-inp",this.$el),$(".empty-h",this.$el);var d=[],e=a.responseData.value.Contacts;_.each(e,function(a){d.push(a.contactID)}),this.feedpublish=new m({element:$(".feed-submit-box-warp",b),title:"新建销售记录",placeholder:"发布新销售记录",type:"event",customerInfo:a.responseData.value.FCustomer,condition:{associationContactIDs:"",fileInfos:[],isAllDayEvent:!1,startTime:0,remindType:1,isSentSms:!1,feedContent:"",parentFeedID:0,listTagOptionID:[],fbrType:1,customerID:c,contactIDs:d.join(","),salesOpportunityID:0},display:["time","contact","picture","attach","tag","at","topic"]}),this.feedpublish.on("post",function(){a.feedList.load({keyword:""}),a.feedTabs.switchTo(0)})},setCrmAttachment:function(){var a=this.options.customerData.value.FCustomer.customerID,b=this.$el,c=this,d=this,e=$(".crm-attachment-simple-warp",this.$el);this.responseData.value.feedAttachEntitys,this.attachment=new i({element:e,condition:{dataID:a,fbrType:1}}),this.attachment.render(),this.attachment.on("toAll",function(){c.options.detail.tab.select("tab-files")}),this.attachment.on("uploaded",function(){c.v.attachmentList.reload()});var f=void 0;f=d.options.customerData.value.FCustomer.ownerID==h.getCurrentEmp().employeeID?!0:!1,this.contactBox=new j({hasOperation:f,element:$(".left-list-contacts",b),showTabContactNumEl:$(".crm-tab-btn[data-value=tab-contacts]",$("#customers-showcustomer")),items:d.responseData.value.Contacts||[],combineApi:"/Contact/BatchCombineContactAndFCustomer",parameter:{customerID:a,contactIDs:""},canEdit:!0}),this.contactBox.on("onNew",function(){d.v.addContactDialog.show({customerID:d.options.customerData.value.FCustomer.customerID,customerName:d.options.customerData.value.FCustomer.name})}),this.contactBox.on("updateSuccess",function(){c.refresh()}),c.setPublish(),c.setFeedList(),this.customerMapBox=new n({element:$(".crm-customer-map",b),address:c.responseData.value.FCustomer.address,mapWidth:320});var g=[];_.map(d.responseData.value.FCustomer.fcustomerCombineSalers,function(a){g.push(a.employee)}),this.followUpBox=new o({element:$(".crm_follow_up",b),addApi:"/FCustomer/AddFCustomerCombineSalers",deleteApi:"/FCustomer/DeleteFCustomerCombineSaler",parameter:{customerID:d.options.customerData.value.FCustomer.customerID,employeeIDs:""},selectColleagueS:d.options.selectColleagueS,ownerID:d.options.customerData.value.FCustomer.ownerID,items:g,title:"联合跟进人",typeName:"客户",name:"联合跟进人"})}});c.exports=p});