/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/crm-product-edit/crm-product-edit",["modules/crm-product-edit/crm-product-edit.html","dialog","util","modules/publish/publish-helper","uilibs/currency-input","moment"],function(a,b,c){var d=window,e=d.FS,f=e.tpl;f.store,f.list;var g=a("modules/crm-product-edit/crm-product-edit.html"),h=a("dialog"),i=a("util"),j=a("modules/publish/publish-helper"),k=a("uilibs/currency-input");a("moment");var l=h.extend({attrs:{width:760,content:$(g).filter(".dialog-product-template").html(),closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",className:"dialog-crm",productData:void 0,productID:void 0},events:{"click .dialog-button-submit":"submit","click .dialog-button-cancel":"hide"},render:function(){var a=l.superclass.render.apply(this,arguments);return this.setupDoms(),this.setupComponent(),a},hide:function(){var a=l.superclass.hide.apply(this,arguments);return this.reset(),a},reset:function(){$(".dialog-input-text",this.element).val(""),$(".area-auto-height",this.element).val("").removeAttr("style"),this.currencyInput.reset(),$(".mn-select-box",this.element).each(function(){i.mnReset($(this))})},show:function(){var a=this,b=l.superclass.show.apply(this,arguments),c=this.get("productID")?this.get("productID"):void 0;return c&&i.api({url:"/Product/GetProductByID",type:"get",dataType:"json",data:{productID:c},success:function(b){b.success&&b.value&&b.value.products&&b.value.products.length>0&&(a.set("productData",b.value.products[0]),a.fillFormData())}},{submitSelector:""}),b},submit:function(a){var b=this,c=this.get("productData")?this.get("productData"):void 0,d=this.get("productID")?this.get("productID"):void 0,e=$(a.currentTarget),f=this.element,g=$(".product-name",f).val(),h=this.currencyInput.val()||0,j=$(".product-unit",f).val(),k=$(".product-description",f).val(),l=[],m=$(".product-tags-list-warp > li",f);m.each(function(){var a=$(".f-business-tag-id",$(this)).data("fbusinesstagid"),b=$(".mn-select-box",$(this)),c=i.mnGetter(b)||0;l.push(a+","+c)}),c?i.api({url:"/Product/UpdateProduct",type:"post",dataType:"json",errorMsgTitle:"修改客户发生错误，原因：",data:{productID:d,name:g,unitAmount:h,unit:j,description:k,listTagOptionID:l},success:function(a){a.success&&(b.hide(),i.remind(2,"保存成功"),b.v&&b.v.refresh&&b.v.refresh(),b.trigger("success"))}},{submitSelector:e}):i.api({url:"/Product/AddProduct",type:"post",dataType:"json",data:{name:g,unitAmount:h,unit:j,description:k,listTagOptionID:l},success:function(a){a.success&&(b.hide(),i.remind(2,"添加成功"),b.v.refresh&&b.v.refresh())}},{submitSelector:e})},setupDoms:function(){var a=this.element;this.conTextareaEl=$(".area-auto-height",a)},setupComponent:function(){var a=this.element,b=$(".product-tags-list-warp",a);j.AdjustTextAreaSize({element:this.conTextareaEl}),this.currencyInput=new k({element:$(".product-unit-amount",a)});var c=i.getCrmData(),d=c.fBusinessTags,e=[];_.each(d,function(a){a.type===i.CONSTANT.TAG_TYPE.PRODUCT&&e.push(a)}),_.each(e,function(a){var c=a.name,d=a.options,e="",f="";d.length>0?_.each(d,function(a){var b=a.isDefault;b?(f=a.name,e+='<ul class="mn-select-list"><li class="mn-select-item" data-value="'+a.fBusinessTagOptionID+'" data-selected="'+b+'">'+a.name+"</li></ul>"):e+='<ul class="mn-select-list"><li class="mn-select-item" data-value="'+a.fBusinessTagOptionID+'">'+a.name+"</li></ul>"}):e='<ul class="mn-select-list"><li class="mn-select-item" data-value="0"></li></ul>',b.append('<li class="fn-clear"> <div class="selects-tit inputs-tit f-business-tag-id" data-fbusinesstagid="'+a.fBusinessTagID+'"> '+c+' </div> <div class="selects-warp"> <span select-cls="" class="mn-select-box "><span class="mn-select-title-wrapper select-for-dialog"><span class="mn-select-title ">'+f+'</span><span class="title-icon"></span></span>'+e+"</span> </div> </li>")})},fillFormData:function(){var a=this.get("productData")&&this.get("productData"),b=this.element;a&&($(".product-name",b).val(a.name),this.currencyInput.setValue(a.unitAmount),$(".product-unit",b).val(a.unit),$(".product-description",b).val(a.description),_.map(a.fBusinessTagRelations,function(a){a.fBusinessTagOptionID&&i.mnSetter($("[data-fbusinesstagid="+a.fBusinessTagID+"]",b).next().children(".mn-select-box"),a.fBusinessTagOptionID)}),this.conTextareaEl.trigger("autosize.resize"))}});c.exports=l});