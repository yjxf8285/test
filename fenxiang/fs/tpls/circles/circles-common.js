/**
 * 同事列表页
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
        leftTpl=require('./circles-common.html'),
        leftTplEl=$(leftTpl);
    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData();
        //render左边栏信息
        var currentMember=contactData["u"],
            currentUserGroupIds=currentMember.groupIDs,
            groupsData=contactData["g"];
        var renderData={},
            groups=[];
        var leftCompiled=_.template(leftTplEl.filter('.circles-tpl-left').html()); //模板编译方法
        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });
        //组织group数据
        /*_.each(currentUserGroupIds,function(groupId){
            var groupData=_.find(groupsData,function(data){
                return data.id==groupId;
            });
            if(groupData){
                groups.push({
                    groupName:groupData.name,
                    groupID:groupData.id,
                    cTitle:groupData.name
                });
            }
        });*/
        //显示全部部门,exclude "全公司"
        groupsData= _.filter(groupsData,function(groupData){
            return groupData.id!="999999";
        });
        _.each(groupsData,function(groupData){
            if(groupData){
                groups.push({
                    groupNameEncoded:encodeURIComponent(groupData.name),
                    groupName:groupData.name,
                    groupID:groupData.id,
                    cTitle:groupData.name
                });
            }
        });
        renderData.groups=groups;
        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));
        //注册高亮导航
        util.regTplNav($('.circles-nav-list .files-nav-item a',tplLeftEl));
    };
});