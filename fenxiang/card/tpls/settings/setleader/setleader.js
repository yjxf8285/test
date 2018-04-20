/**
 * 设置上级
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var Tabs=require('tabs'),
        util=require('util'),
        tplCommon = require('../settings-common');
    var contactData=util.getContactData(),
        currentUserData=contactData["u"],
        SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;


        var currentEmpID = util.getCurrentEmp().employeeID;
        var selectedEmpID;
        var leaderBox = $('.set-leader-box', tplEl);
        var selectColleague = new SelectColleague({
            //"element":$('.select-colleague',tplEl)
            "isMultiSelect": false,
            "hasWorkLeaveBtn": false,
            "title": "选择上级"
        });
        selectColleague.on("selected", function (obj) {

            util.confirm('是否确定要将您的上级设置为【' + obj.name + '】吗?设置后他（她）将可以看到您及您下属的全部客户数据。', ' ', function () {
                util.api({
                    "url": '/Employee/SetEmployeeLeader',
                    "type": 'post',
                    "dataType": 'json',
                    'errorMsgTitle': '设置我的上级时发生错误。原因：',
                    "data": {
//                        customerID: obj.id,
                        leaderID: obj.employeeID
                    },
                    "success": function (data) {
                        if(data.success){
                            selectedEmpID = obj.employeeID
                            fillLeaderBox(obj);
                        }

                    }
                });
            });
        });


        $('.add-leader', tplEl).on('click', function(){
            selectColleague.show({
                "exceptEmployeeIDs":currentEmpID+''
            });
        });
        $('.leader-box-inner', tplEl).on('click', function(){var ids = [];
            ids.push(currentEmpID);
            if(selectedEmpID){
                ids.push(selectedEmpID)
            }
            selectColleague.show({
                "exceptEmployeeIDs":ids.join(',')
            });
        });
        $('.modify-leader', tplEl).on('click', function(){
            var ids = [];
            ids.push(currentEmpID);
            if(selectedEmpID){
                ids.push(selectedEmpID)
            }
            selectColleague.show({
                "exceptEmployeeIDs":ids.join(',')
            });
        });
        $('.cancel-leader', tplEl).on('click', function(){

            util.confirm('是否确定不设置上级？在销售团队中，一般是只有最高负责人不需要设置上级', ' ', function () {
                util.api({
                    "url": '/Employee/CancelEmployeeLeader',
                    "type": 'post',
                    "dataType": 'json',
                    'errorMsgTitle': '取消我的上级时发生错误。原因：',
                    "data": {},
                    "success": function (data) {
                        selectedEmpID = undefined;
                        $('.set-leader-box', tplEl).addClass('set-leader-box-border').find('.leader-box-inner').hide();
                        $('.set-leader-box', tplEl).children('span').show();
                        $('.set-leader-bar', tplEl).hide();
                    }
                }, {
                    "submitSelector": ''
                });
            });
        });

        util.api({
            "url": '/Employee/GetEmployeeLeader',
            "type": 'post',
            "dataType": 'json',
            'errorMsgTitle': '',
            "data": {},
            "success": function (data) {
                if(data.success){
                    fillLeaderBox(data.value);
                }
            }
        }, {
            "submitSelector": ''
        });


        function fillLeaderBox(obj){
            if(obj && obj.employeeID){
                selectedEmpID = obj.employeeID;
                $('.set-leader-bar', tplEl).show();
                leaderBox.attr('data-id', obj.employeeID).find('.leader-box-inner').show();
                leaderBox.children('span').hide();
                if(obj.profileImage){
                    leaderBox.find('img').attr('src', util.getAvatarLink(obj.profileImage, '2'));
                }else{
                    leaderBox.find('img').attr('src', util.getAvatarLink());
                }
                leaderBox.find('.colleague-spell').text(obj.name);
                leaderBox.removeClass('set-leader-box-border');
            }else{
                selectedEmpID = undefined;
                leaderBox.children('span').show();
                leaderBox.children('.leader-box-inner').hide();
                $('.set-leader-bar', tplEl).hide();
                leaderBox.addClass('set-leader-box-border');
            }
        }


        if(FS.getAppStore('contactData') && FS.getAppStore('contactData').isAllowSetOwnLeader){
        }else{
            setTimeout(function(){
                util.alert('没有权限，即将自动跳转个人信息页面');
                setTimeout(function(){
                    tpl.navRouter.navigate('#settings/personalsetting', { trigger: true });
                }, 1000);
            }, 200);
        }
		//tab部分
		tplCommon.init(tplEl,tplName);
    };
});