
 /**
 * 使用方法
 *
 * 1.请确保只new一次，不要出现重复初始化
 * 2.无须传参数
    
3.使用的时候调用show（attachId,oldName）

 */
define(function(require,exports,module){
	var root = window,
	    FS = root.FS,
	    tpl = FS.tpl,
	    tplEvent = tpl.event;
    var Dialog = require("dialog"),
        SelectColleague=require('modules/crm-select-colleague/crm-select-colleague'),
	    util=require('util');
    
    var tpl = require('modules/crm-highsea-editsetting/crm-highsea-editsetting.html');
////    var tplStyle = require('modules/crm-highsea-editsetting/crm-highsea-editsetting.css');
    
	var Highseaedit= Dialog.extend({
		"attrs":{
			"content": tpl,
            "lisContent":'<li><div class="-highsea-info"><img class="-highsea-info-avatar" style="width:30px;height:30px;"></img><span class="-highsea-info-name"></span></div><div class="-highsea-checkbox-box fn-left"><span class="label-for"><span class="-highsea-checkbox-item"></span>&nbsp;<label>管理员</label></span></div><div class="-highsea-edit"><span class="-highsea-isnew"></span><a class="-highsea-delete">删除</a></div></li>',
			"width":590,
            "attachId":0,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
            "attachName":""
            //"align":{"selfXY":["50%","86%"]}
		},

        //==初始化选人组件
        _initSelect:function(){
            var that=this;
            var select=new SelectColleague({
                "isMultiSelect":true,
                "hasWorkLeaveBtn":false,
                "title":"选择员工"
            })
            select.on('selected',function(val){
                var array=[];
                var data;
                for(var i=0;i<val.length;i++){
                    data={
                        name:val[i].name,
                        id:val[i].employeeID,
                        img:util.getAvatarLink(val[i].profileImage, 4),
                        isnew:true
                    };
                    array.push(data);
                }
                that._addPersonMod(array);
            })
            this.set('select',select);
        },
        //==增加员工 可见公海
        _addDialog:function(){
        	var personMod=this.get('personMod');
        	var personArray=[];
        	var persons;
        	for(var i=0;i<personMod.length;i++){
        		personArray.push(personMod[i].id);
        	}
        	persons=personArray.join(',');
        	var select=this.get('select');
        	var condition=select.get('condition');
        	condition.exceptEmployeeIDs=persons;
        	select.set(condition);
        	select.show();
        },
        //==根据管理员是否勾选的情况 设置mod
        _setRootMod:function(e){
            var rootMod=this.get('rootMod');
            var $se=$(e.currentTarget);
            var id=$se.attr('data-id');

            if(_.contains(rootMod,id)){
                rootMod=_.without(rootMod,id);
            }else{
                rootMod.push(id);
            }
            this.set('rootMod',rootMod);
            this._refresh();
        },
        //生成一条员工数据并插入到dom中
        _addPersonMod:function(array){
            var personMod=this.get('personMod');
            personMod=personMod.concat(array);
            this.set('personMod',personMod);
            this._refresh();
        },
        //减少员工 不可见公海
        _deletePersonMod:function(e){
            var id=$(e.target).attr('data-id');
            var personMod=this.get('personMod');
            var rootMod=this.get('rootMod');

            var array=_.filter(personMod,function(data){return data.id!=id});
            var arrayb=_.without(rootMod,id);
            this.set('personMod',array);
            this.set('rootMod',arrayb);
            this._refresh();
        },
        //刷新渲染函数 主要渲染人员列表
        _refresh:function(){
            var personMod=this.get('personMod');
            var rootMod=this.get('rootMod');

            this.get('$numperson').text(personMod.length);
            this.get('$numroot').text(rootMod.length);

            var str=this.get('lisContent');
            this.get('$setcontent').empty();

            var $li;
            var data;
            for(var i=0;i<personMod.length;i++){
                data=personMod[i];
                $li=$(str);
                $li.find('.-highsea-info-avatar').attr('src',data.img);
                $li.find('.-highsea-info-name').text(data.name);
                $li.find('.-highsea-delete').attr('data-id',data.id);
                $li.find('.-highsea-checkbox-box').attr('data-id',data.id);
                if(data.isnew){$li.find('.-highsea-isnew').text('新增')};
                this.get('$setcontent').append($li);
            }
            for(var j=0;j<rootMod.length;j++){
                this.element.find('.-highsea-checkbox-box[data-id="'+rootMod[j]+'"]').addClass('-highsea-selected');
            }
            if(personMod.length>0){
                this.get('$setcontent').show();
                this.get('$titcontent').hide();
            }else{
                this.get('$setcontent').hide();
                this.get('$titcontent').show();
            }
        },
        //初次获取数据后 渲染整个列表
        _renderInfo:function(info){
            this.get('$name').val(info.name);
            this.get('$upnum').val(info.claimLimitNum);
            this.get('$recycle').val(info.claimReturnDays);
            var list=info.highSeasPermissions;

            var personArray=[],
                rootArray=[];
            for(var i=0;i<list.length;i++){
                personArray.push({
                    name:list[i].employee.name,
                    id:list[i].employeeID,
                    img:util.getAvatarLink(list[i].employee.profileImage, 4),
                    isnew:false
                })
                if(list[i].isAdmin){
                    rootArray.push(list[i].employeeID.toString())
                }
            }
            this.set('personMod',personArray)
            this.set('rootMod',rootArray);
            this._refresh();
        },
        //获取编辑后的所有信息数据
        "_getInfo":function(){
            var personMod=this.get('personMod');
            var rootMod=this.get('rootMod');

            var personarray=[];
            for(var i=0;i<personMod.length;i++){
                personarray.push(personMod[i].id);
            }

            return {
                employeeIDs:personarray.join(','),
                adminEmpIDs:rootMod.join(','),
                name:this.get('$name').val(),
                claimLimitNum:this.get('$upnum').val(),
                claimReturnDays:this.get('$recycle').val()
            }
        },

        //发送保存数据   新建/编辑的公海发送不同的api
        //若是新建的公海 信息中不包含higeseaid键值
        //若是编辑的公海 信息中包含highseaid键值
        "_save":function(){
            var info=this._getInfo();
            
            info.claimLimitNum=Number(info.claimLimitNum);
            info.claimReturnDays=Number(info.claimReturnDays);
            if(info.name==""){
                util.alert("公海名称不能为空");
                return;
            }else if(info.name.length>200){
                util.alert("公海名称字长不得大于200字");
                return;
            }
            //如果无法转换为数字 || 是小数 || 等于0
            //例如"1234abcd"
            if(isNaN(info.claimLimitNum) || (info.claimLimitNum.toString().indexOf('.')!=-1&&info.claimLimitNum.toString().indexOf('e')==-1) || info.claimLimitNum==0){
                console.log(info.claimLimitNum);
                util.alert("认领上限栏内请填写大于0的整数");
                return;
            }
            //同上
            if(isNaN(info.claimReturnDays) || (info.claimLimitNum.toString().indexOf('.')!=-1&&info.claimLimitNum.toString().indexOf('e')==-1) || info.claimReturnDays==0){
                util.alert("回收期限栏内请填写大于0的整数");
                return;
            }

            //认领上限和回收期限栏内的数字不能超过9999
            if(info.claimLimitNum>9999){
                util.alert("认领上限栏内的数字不能超过9999 请重新填写");
                return;
            }
            if(info.claimReturnDays>9999){
                util.alert("回收期限栏内的数字不能超过9999 请重新填写");
                return;
            }

            var highseaId=this.get('highseaId');
            var that=this;
            if(highseaId){
                info.highSeasID=highseaId;
                util.api({
                    type:"post",
                    url:"/HighSeas/ModifyHighSeas",
                    data:info,
                    success:function(data){
                        if(data.success){
                            that.trigger('modifySuccess',{'name':info.name,'id':highseaId});
                            that.hide();
                        }else{
                            return;
                        }
                    }
                },{mask:true})
            }else{
                util.api({
                    type:"post",
                    url:"/HighSeas/AddHighSeas",
                    data:info,
                    success:function(data){
                        if(data.success){
                            that.trigger('addSuccess',{'name':info.name,'id':data.value});
                            that.hide();
                        }else{
                            return;
                        }
                    }
                },{mask:true})
            }
        },
        //删除当前公海
        _delete:function(){
            var that=this;
            var highseaId=this.get('highseaId');
            if(!highseaId) return;
            util.confirm("1、删除后所有设置了跟进人的客户都会收回。</br>2、删除后该公海内的所有客户都成为未分配客户。</br>3、如果需要将当前公海客户分配到其他公海，请先移动客户</br>&nbsp;&nbsp;&nbsp;&nbsp;再删除当前公海。",
               "是否确定要删除当前公海", function(data){
                    util.api({
                        type:"post",
                        url:"/HighSeas/DeleteHighSeas",
                        data:{'highSeasID':highseaId},
                        success:function(){
                            that.trigger('deleteSuccess');
                            tplEvent.trigger('deleteHighSeasSuccess');
                            that.hide();
                        }
                    },{mask:true})
                })
        },
		setup:function(){
            var result=Highseaedit.superclass.setup.apply(this,arguments);
            return result;
        },
        //组件首次展现时 执行初始化设置
		"render": function () {
            var result = Highseaedit.superclass.render.apply(this, arguments);
            this._initSelect();
            this.set('$setcontent',$('.-highsea-setting-con',this.element));    //列表容器
            this.set('$titcontent',$('.-highsea-setting-title',this.element));  //列表为空时 提示元素
            this.set('$numperson',$('.-highsea-num-person',this.element));      //人数span
            this.set('$numroot',$('.-highsea-num-root',this.element));          //root人数span

            this.set('$name',$('.-highsea-name',this.element));
            this.set('$upnum',$('.-highsea-upnum',this.element));
            this.set('$recycle',$('.-highsea-recycle',this.element));

            this.set('personMod',[]);
            this.set('rootMod',[]);
            return result;
        },
        //隐藏
        "hide": function () {
            var result = Highseaedit.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (highseaId) {
            var result = Highseaedit.superclass.show.apply(this, arguments);
            var that=this;
            if(highseaId){
                that.element.find('.-highsea-btn-delete').show();
                that.set('highseaId',highseaId);
                util.api({
                    type:"get",
                    url:"/HighSeas/GetHighSeasByID",
                    data:{'highSeasID':highseaId},
                    success:function(info){
                        that._renderInfo(info.value.highSeas[0]);
                    }
                })
            }
            return result;
        },
        //dom事件添加
        "events":{
        	"click .-highsea-add":"_addDialog",
            "click .-highsea-delete":"_deletePersonMod",
            "click .-highsea-checkbox-box":"_setRootMod",
            "click .-highsea-btn-save":"_save",
            "click .-highsea-btn-cancel":"hide",
            "click .-highsea-btn-delete":"_delete"
        },
        //每次隐藏的时候进行dom重置 mod重置
        "reset":function(){
            this.element.find('.-highsea-btn-delete').hide();
            this.get('$name').val('');
            this.get('$upnum').val(20);
            this.get('$recycle').val(30);
           //mod清空
           this.set('personMod',[]);
           this.set('rootMod',[]);
           this.set('highseaId',false);
           //刷新
           this._refresh();
        },
        "destroy":function(){
            var result=Highseaedit.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = Highseaedit;
});