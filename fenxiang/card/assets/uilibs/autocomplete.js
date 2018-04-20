/**
 * 扩展Autocomplete
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var AutoCompleteCore=require('autocomplete_core'),
        filter=require('filter'),
        json=require('json');
    var classPrefix='ui-autocomplete';

    var AutoComplete=AutoCompleteCore.extend({
        attrs:{
            "matchModel":"global"    //匹配方式，default逐个匹配/global全局匹配
            /*"initDataSource":[{
                "parseData":function(data){
                    var acData=[];
                    var vals=data.value.split(','),
                        ids=data.id.split(',');
                    _.each(vals,function(val,i){
                        acData[i]={
                            "value":vals[i],
                            "id":ids[i]
                        };
                    });
                    return acData;
                },
                "createHtml":function(data){
                    var itemEl;
                    itemEl=$('<li class="'+classPrefix+'-item"><a href="javascript:;">'+data.value+'</a></li>');
                    return itemEl;
                },
                "eqFields":['id'],
                "store":[{
                    "value":"test1,test2",
                    "id":"1,13"  //其他自定义字段
                },{
                    "value":"test3,test4",
                    "id":"3,4"  //其他自定义字段
                }]
            },{
                "parseData":function(data){
                    var acData=[].concat(data);
                    return acData;
                },
                "createHtml":function(data){
                    var itemEl;
                    itemEl=$('<li class="'+classPrefix+'-item"><a href="javascript:;">'+data.name+'</a></li>');
                    return itemEl;
                },
                "eqFields":'all',
                "store":[{
                    "type":"p",
                    "name":"13",
                    "id":"13",
                    "spell":"qishuxu"
                }]
            }]*/
        },
        events:{
            "click .ui-autocomplete-init .ui-autocomplete-item": "_selectInitItem"
        },
        setup: function() {
            var result=AutoComplete.superclass.setup.apply(this,arguments);
            this.bindEvents();
            return result;
        },
        _initFilter: function() {
            var result=AutoComplete.superclass._initFilter.apply(this,arguments);
            if(this.get('matchModel')=="global"){
                this.set('filter',{
                    name: "stringMatch",
                    func: filter['stringMatch'],
                    options: {
                        key: "value"
                    }
                });
            }
            return result;
        },
        bindEvents:function(){
            var that=this;
            var elEl=this.element,
                initEl=$('.'+classPrefix+'-init',elEl);
            if(initEl.length>0){
                //点击trigger弹出初始面板
                this.get('trigger').focus(function(){
                    if($(this).val().length==0){
                        that._onRenderInputValue("");
                    }   
                });
            }
        },
        render:function(){
            var elEl=this.element,
                initEl=$('.'+classPrefix+'-init',elEl),
                emptyEl=$('.'+classPrefix+'-empty',elEl);
            var result=AutoComplete.superclass.render.apply(this,arguments);
            if(initEl.length>0){                
                initEl.hide();
            }
            if(emptyEl.length>0){
                emptyEl.hide();
            }
            return result;
        },
        _selectInitItem:function(e){
            var curEl=$(e.currentTarget),
                itemEl=curEl.closest('.'+classPrefix+'-item');
            var parseData=itemEl.data('parseData'),
                originData=itemEl.data('originData'),
                eqFields=itemEl.data('eqFields');   //筛选依赖字段，all关键字表示筛选全字段
            var dataSource=this.dataSource,
                that=this;
            var acData=parseData(originData);   //Array类型
            //逐个选中
            _.each(acData,function(val){
                var allData=dataSource.getData(), //获得所有的data
                    selectedData;
                if(val["validity"]=="no"){  //不进行数据有效性验证，直接返回
                    selectedData=json.parse(json.stringify(val));
                    that.trigger("itemSelect", selectedData);
                    that._clear();
                }else if(allData){
                    if(eqFields==="all"){
                        selectedData=_.find(allData,function(val2){
                            return _.isEqual(val2,val);
                        });
                    }else{
                        selectedData=_.find(allData,function(val2){
                            var eq=true;
                            _.find(eqFields,function(key){
                                if(val2[key]!=val[key]){    //采用非严格判定
                                    eq=false;
                                    return true;
                                }
                            });
                            return eq;
                        });
                    }
                    if(selectedData){
                        //that.get("trigger").val(val.value);
                        //that.set("inputValue", val.value);
                        that.trigger("itemSelect", selectedData);
                        that._clear();
                    }
                    
                }
            });
            //隐藏下拉面板
            this.hide();
            e.preventDefault();
        },
        // 1. 判断输入值，调用数据源
        _onRenderInputValue: function(val) {
            if (this._start && val) {
                var oldQueryValue = this.queryValue;
                this.queryValue = this.get("inputFilter").call(this, val);
                // 如果 query 为空或者相等则不处理
                if (this.queryValue && this.queryValue !== oldQueryValue) {
                    this.dataSource.abort();
                    this.dataSource.getData(this.queryValue);
                }
            } else {
                this.queryValue = "";
            }
            if (val === "" || !this.queryValue) {
                this.set("data", []);
                //this.hide();
                //切换面板
                this.switchTpl([]);
            }
            delete this._start;
        },
        // 2. 数据源返回，过滤数据
        _filterData: function(data) {
            var filter = this.get("filter"), locator = this.get("locator");
            // 获取目标数据
            data = locateResult(locator, data);
            // 进行过滤
            data = filter.func.call(this, data, this.queryValue, filter.options);
            this.set("data", data);
            //切换面板
            this.switchTpl(data);
        },
        // 3. 通过数据渲染模板
        _onRenderData: function(data) {
            // 清除状态
            this._clear();
            // 渲染下拉
            this.model.items = data;
            this.renderPartial("[data-role=items]");
            // 初始化下拉的状态
            this.items = this.$("[data-role=items]").children();
            this.currentItem = null;
            if (this.get("selectFirst")) {
                this.set("selectedIndex", 0);
            }
             // data-role=items 无内容才隐藏
            /*if ($.trim(this.$("[data-role=items]").text())) {
                this.show();
            } else {
                this.hide();
            }*/
        },
        _createInitDataPanel:function(dataList){
            var that=this;
            var elEl=this.element,
                initEl=$('.'+classPrefix+'-init',elEl),
                panelEl;
            if(initEl.length>0){
                panelEl=$('.'+classPrefix+'-init-panel',initEl);
                panelEl.empty();    //先清空
                _.each(dataList,function(sectionData){
                    var ulEl=$('<ul class="'+classPrefix+'-list-block"></ul>'),
                        parseData=sectionData.parseData,
                        createHtml=sectionData.createHtml,
                        eqFields=sectionData.eqFields||"all",
                        store=sectionData.store,
                        renderCb=sectionData.renderCb;   //所有item render后的回调
                    _.each(store,function(data){
                        var itemEl;
                        itemEl=createHtml(data);
                        itemEl.data('originData',data);
                        itemEl.data('parseData',parseData);
                        itemEl.data('createHtml',createHtml);
                        itemEl.data('eqFields',eqFields);
                        itemEl.appendTo(ulEl);

                    });
                    ulEl.appendTo(panelEl);
                    if(ulEl.text().length==0){  //空的ul隐藏起来
                        ulEl.hide();
                    }
                    renderCb&&renderCb.call(that,store,ulEl);
                });
            }
        },
        _onRenderInitDataSource:function(val){
            this._createInitDataPanel(val);
        },
        switchTpl:function(data){
            var elEl=this.element,
                initEl=$('.'+classPrefix+'-init',elEl),
                queryEl=$('.'+classPrefix+'-query',elEl),
                emptyEl=$('.'+classPrefix+'-empty',elEl);
            var queryValue=this.queryValue;
            if(queryEl.length>0){
                if(!this.queryValue){
                    initEl.show();
                    queryEl.hide();
                    emptyEl.hide();
                }else{
                    if(data.length==0){
                        initEl.hide();
                        queryEl.hide();
                        emptyEl.show();
                    }else{
                        initEl.hide();
                        queryEl.show();
                        emptyEl.hide();
                    }
                }
                this.show();
            }else{
                if(!this.queryValue||data.length==0){
                    this.hide();
                }else{
                    this.show();
                }
            }
            
        }
    });
    function isString(str) {
        return Object.prototype.toString.call(str) === "[object String]";
    }
    function locateResult(locator, data) {
        if (!locator) {
            return data;
        }
        if ($.isFunction(locator)) {
            return locator.call(this, data);
        } else if (isString(locator)) {
            var s = locator.split("."), p = data;
            while (s.length) {
                var v = s.shift();
                if (!p[v]) {
                    break;
                }
                p = p[v];
            }
            return p;
        }
        return data;
    }
    module.exports=AutoComplete;
});