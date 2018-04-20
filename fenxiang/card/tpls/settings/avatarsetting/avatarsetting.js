/**
 * 我的归档
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var util=require('util'),
        tplCommon = require('../settings-common');
    var AVATAR_SWF_PATH=FS.ASSETS_PATH+"/avatar/avatarUpload.swf",
        EI_SWF_PATH=FS.ASSETS_PATH+"/avatar/expressInstall.swf";
    //联系人信息
    var contactData=util.getContactData(),
        currentUserData=contactData["u"];
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
		//avatar plugin初始化
        var flashvars = {
            js_handler:"avatarCb",
            swfID:"avatar-edit",
            sourceAvatar:util.getDfLink(currentUserData.profileImagePath+'1',currentUserData.name,false,'jpg'),
            avatarLabel:"您上传的头像会自动生成三种尺寸，请注意小尺寸的头像是否清晰",
            sourceLabel:"仅支持JPG、PNG图片文件，且文件小于2M",
            sourcePicAPI:FS.API_PATH+"/",
            avatarAPI:FS.API_PATH+"/File/UploadFile",
            avatarSize:"180,180|50,50|30,30",
            avatarSizeLabel:"大尺寸150x150|中尺寸50x50|小尺寸30x30"
        };
        var params = {
            menu: "false",
            scale: "noScale",
            allowFullscreen: "true",
            allowScriptAccess: "always",
            bgcolor: "",
            //wmode: "direct" // can cause issues with FP settings & webcam
            wmode: "opaque" //设置成opaque模式，当遮罩层设置opacity时才可以被遮住
        };
        var attributes = {
            id:"AvatarUpload"
        };
        swfobject.embedSWF(
            AVATAR_SWF_PATH,
            "settings-avatarsetting-avatar", "100%", "100%", "10.0.0",
            EI_SWF_PATH,
            flashvars, params, attributes);

        //定义avatar回调函数，需挂载到global作用域下
        root.avatarCb=function(obj){
            /*if(obj.type == "sourcePicSuccess") alert("原图上传成功");
             if(obj.type == "sourcePicError") alert("原图上传失败");
             if(obj.type == "avatarSuccess") alert("头像上传成功");
             if(obj.type == "avatarError") alert("头像上传失败");
             //if(obj.type == "init") alert("flash初始化完成");
             if(obj.type == "cancel") alert("取消编辑头像");
             if(obj.type == "FileSelectCancel") alert("取消选取本机图片");

             console.log(obj);*/
            var responseData=obj.data,
                dataRoot,
                filePath;
            if(responseData.success){   //上传成功后提交
                dataRoot=responseData.value;
                filePath=dataRoot.filePath;
                util.api({
                    "type":"post",
                    "url":"/Account/UploadAvatar",
                    "data":{
                        "path":filePath
                    },
                    "success":function(responseData){
                        if(responseData.success){
                            util.alert("保存头像成功",function(){
                                location.reload();
                            });
                        }
                    }
                });
            }
        }

		//tab部分
		tplCommon.init(tplEl,tplName);
    };
});