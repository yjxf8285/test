/**
 * Search模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        moment=require('moment'),
        MapList = require('modules/fs-map/fs-map-list'),
        publish=require('modules/publish/publish'),
        fsMapModule=require('modules/fs-map/fs-map');

    var DateSelect=publish.dateSelect,
        FsMap=fsMapModule.FsMap;

    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var tplLeftEl=$('.tpl-l',tplEl),
            listWEl=$('.location-list-wrapper',tplLeftEl),
            listEl=$('.location-list',tplLeftEl),
            pagEl=$('.location-list-pagination',tplLeftEl),
            avatarWEl=$('.avatar-wrapper',tplLeftEl),
            employeeNameEl=$('.employee-name',tplLeftEl),
            locationNumEl=$('.location-info .num',tplLeftEl),
            startDateEl=$('.start-date',tplLeftEl),
            endDateEl=$('.end-date',tplLeftEl),
            mapWEl=$('.map-wrapper',tplEl),
            queryBtnEl=$('.query-btn',tplLeftEl),
            clearBtnEl=$('.clear-btn-map',tplLeftEl);

        var sd= new DateSelect({
            "element": startDateEl,
            "placeholder": "选择日期"
        }),ed=new DateSelect({
            "element": endDateEl,
            "placeholder": "选择日期"
        });
        /**
         * 根据locationData构建地址
         * @private
         */
        var addressHelper=function(locationData){
            var address='';
            if(locationData.country!="中国"){
                address+=locationData.country;
            }
            //是否是直辖市
            if(locationData.province!=locationData.city){
                address+=locationData.province;
            }
            //过滤部分为空的地址片段
            _.each([locationData.city,locationData.district,locationData.street,locationData.streetNumber],function(partAddr){
                if(partAddr.length>0){
                    address+=partAddr;
                }
            });
            return address;
        };
        var map=new FsMap({
            "element":mapWEl,
            "autoOpenTip":false,
            "tipTpl":function(itemData){
                var address=addressHelper(itemData);
                return '<h3 style="margin-bottom: 30px;">'+address+'</h3><p style="color:#999999;width:230px;" class="fn-clear">'+util.getDateSummaryDesc(moment.unix(itemData.createTime),new Date(),2)+'<a href="#" onclick="showDescDialog('+itemData.feedID+');return false;" style="float:right;color:#0082CB;">详情</a></p>';
            }
        });
        map.on('mapinit',function(rootNs){
            rootNs.showDescDialog=function(feedId){
                $('.map-showdetail',listEl).filter('[feedid="'+feedId+'"]').click();
            };
        });
        //创建列表
        var mapList = new MapList({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "listPath": "/Location/GetLocationInfosByIDAndTimeRange", //map列表接口地址
            "pagOpts": { //分页配置项
                "pageSize":10,
                "visiblePageNums":5,
                "style":"simple" //极简风格
            },
            "defaultRequestData": function(){
                var queryParams=util.getTplQueryParams();   //传给模板的参数
                var employeeId=queryParams? queryParams.id:""; //获取employeeId
                var startDate=sd.getValue(true),
                    endDate=ed.getValue(true);
                return {
                    "employeeID": employeeId,
                    "startTime": startDate?startDate.unix():0,
                    "endTime": endDate?endDate.add('days', 1).subtract('seconds', 1).unix():0
                };
            },
            "listCb": function(responseData) { //列表数据请求后的回调
                var dataRoot,
                    employeeInfo;
                if(responseData.success){
                    dataRoot=responseData.value;
                    employeeInfo=dataRoot.employeeInfo;
                    //创建员工信息
                    avatarWEl.html('<img src="'+util.getAvatarLink(employeeInfo["profileImage"],2)+'" alt="'+employeeInfo["name"]+'" />');
                    employeeNameEl.text(employeeInfo["name"]);
                    //设置签到次数
                    locationNumEl.text(dataRoot.totalCount);
                    //设置地图定位信息
                    map.setLocation(dataRoot.locations);
                }
            },
            "selectCb":function(locationData){
                var pointers=map.pointers;
                _.some(pointers,function(pointerData){
                    var itemData=pointerData.data;
                    if(itemData["feedID"]==locationData["feedID"]){
                        map.AMap.event.trigger(pointerData.pointer,'click');
                        return true;
                    }
                });
            },
            "listEmptyText":"没有签到信息"
        });
        //设置地图显示区尺寸
        var resizeTid;
        $(root).resize(function(){
            if(mapWEl.is(':visible')){
                clearTimeout(resizeTid);
                resizeTid=setTimeout(function(){
                    var mapWOffset=mapWEl.offset(),
                        listWOffset=listWEl.offset(),
                        winH=$(root).height(),
                        mapWH=winH-mapWOffset.top,
                        listWH=winH-listWOffset.top-20;
                    listWEl.height(listWH>0?listWH:0);
                    mapWEl.height(mapWH>0?mapWH:0);
                    map.adjustSize();
                },300);
            }
        });
        //查询
        queryBtnEl.click(function(){
            mapList.reload();
        });
        //清空时间控件
        clearBtnEl.click(function(evt){
            sd.clear();
            ed.clear();
            mapList.reload();
        });
        //原始sub-tpl宽度
        var subTplEl=$('#sub-tpl'),
            subTplWidth=subTplEl.width();
        tplEvent.on('switched', function (tplName2, tplEl) {
            if (tplName2 == tplName) {
                subTplEl.css('width','100%');
                util.setFullScreen(true);
                //隐藏在线qq
                $('.right-qq-apv').hide();
                clearBtnEl.click(); //触发清空点击事件，重新请求列表
            }else{
                subTplEl.width(subTplWidth);
                util.setFullScreen(false);
                //显示在线qq
                $('.right-qq-apv').show();
            }
        });
    };
});