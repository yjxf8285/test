/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/crm-object-import/crm-object-import",["dialog","util","modules/crm-object-import/crm-object-import.html","modules/fs-qx/fs-qx-helper"],function(a,b,c){var d=a("dialog"),e=window,f=e.FS;util=a("util");var g=a("modules/crm-object-import/crm-object-import.html"),h=a("modules/fs-qx/fs-qx-helper"),i=h.Uploader,j=d.extend({attrs:{content:g,width:550,title:"",downloadApi:"",downloadText:"",importApi:"",uploader:null,closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",returnFilePath:""},setup:function(){var a=j.superclass.setup.apply(this,arguments);return a},render:function(){var a=j.superclass.render.apply(this,arguments);return this._init(),a},_init:function(){var a=this.get("title"),b=this.get("downloadText"),c=f.API_PATH+"/df/"+this.get("downloadApi");$(".crm-object-import-title",this.element).text(a),$(".crm-object-import-link",this.element).attr("href",c),$(".crm-object-import-link",this.element).text("点击下载《"+b+"》"),this._initUploader()},_showLoading:function(){var a='<div class="crm-import-loading"><span></span></div>';this.element.append(a)},_hideLoading:function(){$(".crm-import-loading",this.element).remove()},_setFileInputPosition:function(){if("undefined"==typeof Worker){var a=$(".crm-object-import-file-div object",this.element),b=$(".crm-object-import-file-div",this.element),c=$(".crm-object-import-button-select",this.elment).last();b.show(),a.css({width:c.width()+50,height:c.height()+2,left:c.position().left,top:c.position().top})}},_initUploader:function(){var a=this,b=new i({element:$(".crm-object-import-file-input",this.element),h5Opts:{multiple:!1,accept:"excel/*",filter:function(a){var b=[];return _.each(a,function(a){"xls"==util.getFileType(a)?b.push(a):util.alert("请选择excel格式的文件")}),b}},flashOpts:{file_types:"*.xls;*.xlsx",file_types_description:"Excel文件"},onSuccess:function(b,c){var d=a.get("returnFilePath"),e=JSON.parse(c).value;d=e.filePath,a.set("returnFilePath",d)},onFailure:function(){a._hideLoading()},onSelect:function(b){$(".crm-object-import-file-name",a.element).text(b.name),$(".crm-object-import-button-import",a.element).removeClass("crm-button-disable")},onComplete:function(){a._postData(),a.get("uploader").removeAllFile(),$(".crm-object-import-file-name",a.element).text(""),$(".crm-object-import-button-import",a.element).addClass("crm-button-disable")}});this.set("uploader",b)},hide:function(){var a=j.superclass.hide.apply(this,arguments);return this.reset(),a},show:function(){var a=j.superclass.show.apply(this,arguments);return"undefined"==typeof Worker&&this._setFileInputPosition(),a},events:{"click .crm-object-import-button-select":"_fileSelect","click .crm-object-import-button-import":"_import"},_fileSelect:function(){var a=$(".crm-object-import-file-input",this.element);"undefined"!=typeof Worker?a.click():util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器")},_import:function(a){var b=$(a.currentTarget);b&&!b.hasClass("crm-button-disable")&&(this._showLoading(),this.get("uploader").startUpload(),$(".crm-object-import-button-import",self.element).addClass("crm-button-disable"))},_postData:function(){var a=this,b=a.get("importApi");util.api({url:b,type:"post",dataType:"json",timeout:12e4,data:{path:a.get("returnFilePath")},success:function(b){a._hideLoading(),b.success&&(b.value.importSucceed?(a.set("returnFilePath",""),util.remind(2,"导入成功"),a.trigger("uploaded"),a.hide()):a._showError(b.value.importEmployeePropertys))},error:function(){a._hideLoading()}})},_showError:function(a){if(!a||a.length<1)return util.alert("导入失败"),void 0;var b=$(".crm-object-import-error-info3",this.element);b.empty(),_.each(a,function(a){a.isError&&b.append("<div>第"+a.rowNo+"行："+a.errorMessage+"</div")}),$(".crm-object-import-error-container",this.element).show()},reset:function(){$(".crm-object-import-file-name",this.element).text(""),$(".crm-object-import-button-import",this.element).addClass("crm-button-disable"),this.get("uploader").removeAllFile(),$(".crm-object-import-error-container",this.element).hide()},destroy:function(){var a=j.superclass.destroy.apply(this,arguments);return a}});c.exports=j});