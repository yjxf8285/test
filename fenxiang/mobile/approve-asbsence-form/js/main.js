jQuery(function($){
    var XK=window.XK,
        util=XK.util;
    var absWrap=$('.abs-wrap'),
        leaveTableEl=$('.leave',absWrap),
        tbodyRowTpl=$('.tbody-row',absWrap),
        cateSelEl=$('.cate-wrapper',absWrap).find('.cate'),
        timeSpanEditEl=$('.time-span-edit',absWrap);
    var leaveSummaryWrap=$('.leave-summary',absWrap),
        numTotalEl=$('.num',leaveSummaryWrap);
    var sysName=util.sysDetector();
    var tbodyRowHtml='<tr class="tbody-row">'+
        '<td class="cate-wrapper">'+
        '<select name="cate" class="sel-pub cate">'+
        '<option value="0" selected="selected"></option>'+
        '<option value="1">事假</option>'+
        '<option value="2">病假</option>'+
        '<option value="3">调休</option>'+
        '<option value="4">年休假</option>'+
        '<option value="5">婚假</option>'+
        '<option value="6">生育假</option>'+
        '<option value="7">丧假</option>'+
        '<option value="8">加班</option>'+
        '<option value="9">外勤</option>'+
        '<option value="10">出差</option>'+
        '<option value="11">其他</option>'+
        '</select>'+
        '</td>'+
        '<td class="start-date-wrapper">'+
        '<span class="date-inner"><input type="text" class="inp-text" placeholder="选择日期" readonly="readonly" /><span class="date-input-overlay"></span></span>'+
        '</td>'+
        '<td class="end-date-wrapper">'+
        '<span class="date-inner"><input type="text" class="inp-text" placeholder="选择日期" readonly="readonly" /><span class="date-input-overlay"></span></span>'+
        '</td>'+
        '<td class="time-span"><div style="padding-right:1px;" class="time-close-wrap"><input type="number" class="text-edit time-span-edit" maxlength="12" /><a href="javascript:;" class="close">清空</a></div></td>'+
        '</tr>';
    var tbodyRowHtmlAd='<tr class="tbody-row">'+
        '<td class="cate-wrapper">'+
        '<input type="text" class="inp-text text-sel" rtype="0" readonly="readonly" />'+
        '</td>'+
        '<td class="start-date-wrapper">'+
        '<span class="date-inner"><input type="text" class="inp-text" placeholder="选择日期" readonly="readonly" /><span class="date-input-overlay"></span></span>'+
        '</td>'+
        '<td class="end-date-wrapper">'+
        '<span class="date-inner"><input type="text" class="inp-text" placeholder="选择日期" readonly="readonly" /><span class="date-input-overlay"></span></span>'+
        '</td>'+
        '<td class="time-span"><div class="time-close-wrap"><input type="text" class="text-edit time-span-edit" maxlength="12" /><a href="javascript:;" class="close">清空</a></div></td>'+
        '</tr>';

    var formatZhDate=function(dateStr,formatType){
        if(formatType=="date"){
            return moment(dateStr, "YYYY-MM-DD").format("YYYY年MM月DD日");
        }else{
            return moment(dateStr, "YYYY-MM-DD HH:mm").format("YYYY年MM月DD日 HH:mm");
        }
    };
    var calculateLeaveSummary=function(){
        var timeSpanEl = $('input.time-span-edit', absWrap),
            totalTime = 0;
        timeSpanEl.each(function () {
            var meEl = $(this),
                v = $.trim(meEl.val());
            if (v.length > 0) {
                v = parseFloat(v);
                if (!isNaN(v)) {
                    v = parseFloat(v.toFixed(1));
                    totalTime += v;
                    meEl.val(v);
                } else {
                    meEl.val('0');
                }
            }
        });
        numTotalEl.text(totalTime.toFixed(1));
    };
    var initLeave=function(initLeaveData){
        var originLen=0;
        var blankLeaveData=(function(){
            return {
                "reasonType":0,
                "reasonTypeDesc":"",
                "startDate":"",
                "startTime":"",
                "stopDate":"",
                "stopTime":"",
                "hours":""
            };
        }());
        if(_.isUndefined(initLeaveData)){
            initLeaveData=util.externalExecute('initLeaveData')||"";
        }
        //先解码
        initLeaveData=decodeURIComponent(initLeaveData);

        if(initLeaveData.length==0){
            initLeaveData=[blankLeaveData,blankLeaveData,blankLeaveData];
        }else{
            initLeaveData=JSON.parse(initLeaveData);
            originLen=initLeaveData.length;
            if(originLen<3){
                for(var i=1;i<=3-originLen;i++){
                    initLeaveData.push(blankLeaveData);
                }
            }else{
                initLeaveData.push(blankLeaveData);
            }
        }
        _.each(initLeaveData,function(itemData){
            var cateEl,
                cateInpEl,
                startDateEl,
                endDateEl,
                timeSpanEl;
            var itemEl;
            if(sysName=="android"){
                itemEl=$(tbodyRowHtmlAd);
            }else if(sysName=="ios"){
                itemEl=$(tbodyRowHtml);
            }
            itemEl.appendTo(leaveTableEl);
			//低版本ios number转换成text
			util.numberToTextInIos($('.time-span-edit',itemEl));
			
            cateEl=$('.cate-wrapper select',itemEl);
            cateInpEl=$('.cate-wrapper input',itemEl);
            startDateEl=$('.start-date-wrapper input',itemEl);
            endDateEl= $('.end-date-wrapper input',itemEl);
            timeSpanEl= $('.time-span input',itemEl);
            //填充数据
            if(sysName=="android"){
                cateInpEl.val(itemData.reasonTypeDesc);
                cateInpEl.attr('rtype',itemData.reasonType)
            }else if(sysName=="ios"){
                cateEl.val(itemData.reasonType);
            }

            if(itemData.startDate.length>0){
                startDateEl.val(formatZhDate(itemData.startDate,'date')+' '+itemData.startTime);
            }else{
                startDateEl.val("");
            }
            if(itemData.stopDate.length>0){
                endDateEl.val(formatZhDate(itemData.stopDate,'date')+' '+itemData.stopTime);
            }else{
                endDateEl.val("");
            }
            timeSpanEl.val(itemData.hours);
        });

        //$('.tbody-row',absWrap).slice(0,3).find('.close').hide();
        calculateLeaveSummary();
    };
    //android需要初始化初始化数据填充表单,ios通过回调获取
    if(absWrap.length>0){
        util.regInterceptor('initLeaveCallback',function(initData){
            initLeave(initData);
        });
        if(sysName=="android"){
            //cateSelEl.unbind('change');
            absWrap.on('change','input.text-sel:last',function(){
				var rowEl;
                if($(this).val() !== ''){
					rowEl=$(tbodyRowHtmlAd);
                    leaveTableEl.append(rowEl);
                }
            });
        }else if(sysName=="ios"){
            //cateSelEl.unbind('change');
            absWrap.on('change','select.cate:last',function(){
				var rowEl;
                if($(this).val() !== 0){
					rowEl=$(tbodyRowHtml);
                    leaveTableEl.append(rowEl);
					//低版本ios number转换成text
					util.numberToTextInIos($('.time-span-edit',rowEl));
                }
            });
        }
    }
    //清空行
    absWrap.on('click','.close',function(){
        $(this).parents('.tbody-row').find('input').val('');
		if(sysName=="android"){
            $(this).parents('.tbody-row').find('input.text-sel').attr('rtype','0');
        }else if(sysName=="ios"){
            $(this).parents('.tbody-row').find('select').val(0);
        }
		calculateLeaveSummary();
    });
    //请假单效果
    absWrap.on('blur', 'input.time-span-edit', function () {
        calculateLeaveSummary();
    }).on('input','input.time-span-edit',function(){
            //alert(1);
            var meEl=$(this);
            var val=$.trim(meEl.val());
            var oldValue=meEl.data('oldValue');
            val=val.replace(/[^0-9\.]/g,'');
            if(parseFloat(val) > 999999999999){
                val=oldValue;
                meEl.val(val);
            }else{
                meEl.val(val);
            }
            meEl.data('oldValue',val);
			//calculateLeaveSummary();
        });;

    //日历组件调用
    absWrap.on('click','.start-date-wrapper .date-input-overlay,.end-date-wrapper .date-input-overlay',function(evt){
        var meEl=$(this),
            wEl=meEl.closest('td'),
            inputEl=$('input',wEl),
            labelText;
        $('.start-date-wrapper input,.end-date-wrapper input',absWrap).removeClass('state-input-focus');
        inputEl.addClass('state-input-focus');
        if(wEl.hasClass('start-date-wrapper')){
            labelText="start";
        }else if(wEl.hasClass('end-date-wrapper')){
            labelText="end";
        }
        util.externalExecute("showCalendar",labelText);
    });
    //日历选择完毕后的回调注册
    util.regInterceptor('calendarCallback',function(dateStr){
        var currentInputEl=$('.state-input-focus',absWrap);
        currentInputEl.val(formatZhDate(dateStr)).removeClass('state-input-focus');
    });

    //SELECT组件调用
    absWrap.on('click','.cate-wrapper input',function(evt){
        var meEl=$(this),
            wEl=meEl.closest('td'),
            labelText='';
        $('.cate-wrapper input',absWrap).removeClass('state-input-focus1');
        meEl.addClass('state-input-focus1');
        util.externalExecute("showMatter");
    });
    //SELECT选择完毕后的回调注册
    util.regInterceptor('matterCallback',function(selVal,selStr){
        var currentInputEl=$('.state-input-focus1',absWrap);
        currentInputEl.val(selStr).attr('rtype',selVal).removeClass('state-input-focus1').change();
    });

    //点击确定将参数传给系统
    util.regInterceptor('leaveSubmitCallback',function(){
        var formData=[],
            saveData=[],
            isPassed=true;
		//先计算下请假时间，保证四舍五入正确
		calculateLeaveSummary();
        $('.leave .tbody-row',absWrap).each(function(){
            if(sysName=="android"){
                var cateSelectEl=$('.cate-wrapper input',this);
                var cate=cateSelectEl.attr('rtype');
                var reasonTypeDesc=cateSelectEl.val();
            }else if(sysName=="ios"){
                var cateSelectEl=$('.cate-wrapper select',this);
                var cate=parseInt(cateSelectEl.val());
                var reasonTypeDesc=$('option[value="'+cate+'"]',cateSelectEl).text();
            }
            var startTime= $.trim($('.start-date-wrapper input',this).val()),
                endTime= $.trim($('.end-date-wrapper input',this).val()),
                timeSpan= $.trim($('.time-span input',this).val());
            formData.push({
                "cate":cate,
                "reasonTypeDesc":reasonTypeDesc,
                "startTime":startTime,
                "endTime":endTime,
                "timeSpan":timeSpan
            });
        });
        //过滤掉全空的数据
        formData= _.reject(formData,function(itemData){
            return itemData.cate==0&&itemData.startTime.length==0&&itemData.endTime.length==0&&itemData.timeSpan.length==0;
        });
        //数据验证
        if(formData.length==0){
            isPassed=false;
            util.alert("请填写请假单");
            return isPassed;
        }
        _.some(formData,function(itemData){
            if(itemData.cate==0){
                isPassed=false;
                util.alert("请选择请假事项");
                return true;
            }
            if(itemData.startTime.length==0){
                isPassed=false;
                util.alert("请填写开始日期");
                return true;
            }
            if(itemData.endTime.length==0){
                isPassed=false;
                util.alert("请填写结束日期");
                return true;
            }
            if(itemData.timeSpan.length==0 || parseFloat(itemData.timeSpan)==0){
                isPassed=false;
                util.alert("请填写请假小时数");
                return true;
            }
            //判断结束时间大于开始时间
            if(moment(itemData.endTime, "YYYY-MM-DD HH:mm").isBefore(moment(itemData.startTime, "YYYY-MM-DD HH:mm"))||moment(itemData.endTime, "YYYY-MM-DD HH:mm").isSame(moment(itemData.startTime, "YYYY-MM-DD HH:mm"))){
                isPassed=false;
                util.alert("结束时间需要大于开始时间");
                return true;
            }
        });
        //整合数据
        _.each(formData,function(itemData){
            var startTime=itemData.startTime.split(' '),
                endTime=itemData.endTime.split(' ');
            saveData.push({
                "reasonType":itemData.cate,
                "reasonTypeDesc":itemData.reasonTypeDesc,
                "startDate":startTime[0],
                "stopDate":endTime[0],
                "startTime":startTime[1],
                "stopTime":endTime[1],
                "beginTime":moment(itemData.startTime, "YYYY-MM-DD HH:mm").unix(),
                "endTime":moment(itemData.endTime, "YYYY-MM-DD HH:mm").unix(),
                "hours":parseFloat(itemData.timeSpan)
            });
        });
        if(!isPassed){
            return isPassed;
        }else{
            //这里传给后台数据
            util.externalExecute('saveLeaveData',encodeURIComponent(JSON.stringify(saveData)));
            return true;
        }
    });

    //报销单
    var expWrap=$('.exp-wrap'),
        baoxiaoEl = $('.baoxiao', expWrap),
        baoxiaoRowTpl = $('.baoxiao-row-tpl', expWrap).html(),
        baoxiaoSummaryEl = $('.baoxiao-summary', expWrap),
        baoxiaoUpperEl = $('.upper-text', baoxiaoSummaryEl),
        baoxiaoTjEl = $('.num-text', baoxiaoSummaryEl);
		
	if(sysName=="android"){
		baoxiaoRowTpl = $('.baoxiao-row-ad-tpl', expWrap).html();
	}else if(sysName=="ios"){
		baoxiaoRowTpl = $('.baoxiao-row-tpl', expWrap).html();
	}	
		
    /**
     * 动态生成一条报销单
     * @param {[type]} rowTpl [description]
     */
    var addBaoxiaoRow = function (rowTpl) {
        var rowEl = $(rowTpl || baoxiaoRowTpl);
        rowEl.appendTo(baoxiaoEl);
        //清空input change事件
        $('input', baoxiaoEl).unbind('change');
        $('input', rowEl).change(function () {
            addBaoxiaoRow();
        });
		//低版本ios number转换成text
		util.numberToTextInIos($('.amount',rowEl));
        return rowEl;
    };	
    var calculateBaoxiaoSummary=function(){
        var amountEl = $('input.amount', baoxiaoEl),
            totalAmount = 0;
        amountEl.each(function () {
            var meEl = $(this),
                v = $.trim(meEl.val());
            if (v.length > 0) {
				//alert(v);
                v = parseFloat(v);
                if (!isNaN(v)) {
                    v = parseFloat(v.toFixed(2));
                    totalAmount += v;
                    meEl.val(v);
                } else {
                    meEl.val('非有效数字');
                }
            }
        });
        //截取小数点后两位
        totalAmount=parseFloat(totalAmount.toFixed(2));
        baoxiaoUpperEl.text(util.digitUppercase(totalAmount));
        baoxiaoTjEl.text(totalAmount.toFixed(2));
    };
    //报销单统计
    baoxiaoEl.on('blur', 'input.amount', function () {
        calculateBaoxiaoSummary();
    }).on('input','input.amount',function(){
            //alert(1);
            var meEl=$(this);
            var val=$.trim(meEl.val());
            var oldValue=meEl.data('oldValue');
            val=val.replace(/[^0-9\.]/g,'');
            if(parseFloat(val) > 999999999999){
                val=oldValue;
                meEl.val(val);
            }else{
                meEl.val(val);
            }
            meEl.data('oldValue',val);
			//calculateBaoxiaoSummary();
        });
    /**
     * 初始化报销单
     */
    var initBaoxiao=function(initData){
		var originLen=0;
        var blankData=(function(){
            return {
                "title":"",
                "amount":"",
                "remark":""
            };
        }());
        if(_.isUndefined(initData)){
            initData=util.externalExecute('initBaoxiaoData')||"";
        }
        initData=decodeURIComponent(initData);
        if(initData.length==0){
            initData=[blankData,blankData,blankData];
        }else{
            initData=JSON.parse(initData);
			originLen=initData.length;
            if(originLen<3){
                for(var i=1;i<=3-originLen;i++){
                    initData.push(blankData);
                }
            }else{
                initData.push(blankData);
            }
        }
        _.each(initData,function(itemData){
            var cateEl,
                amountEl,
                markEl;
            /*var itemEl=$(baoxiaoRowTpl);

             itemEl.appendTo(baoxiaoEl);*/
            var itemEl=addBaoxiaoRow();
            cateEl=$('.cate-wrapper input',itemEl);
            amountEl=$('.amount-wrapper input',itemEl);
            markEl=$('.mark-wrapper input',itemEl);
            //填充数据
            cateEl.val(itemData.title);
            amountEl.val(itemData.amount);
            markEl.val(itemData.remark);
			//
        });
		//$('.row-tr',expWrap).slice(0,3).find('.close').hide();
        calculateBaoxiaoSummary();
    };
    //android需要初始化初始化数据填充表单,ios通过回调获取
    //统一改成回调方式调用
    if(expWrap.length>0){
        util.regInterceptor('initBaoxiaoCallback',function(initData){
            initBaoxiao(initData);
        });
    }

	//清空行
    expWrap.on('click','.close',function(){
        $(this).parents('tr.row-tr').find('input').val('');
		calculateBaoxiaoSummary();
    });
	
    //报销单 点击确定将参数传给系统
    util.regInterceptor('baoxiaoSubmitCallback',function(){
        var formData=[],
            isPassed=true;
		//先计算下金额，保证四舍五入正确
		calculateBaoxiaoSummary();
        $('.baoxiao .row-tr',expWrap).each(function(){
            var cate= $.trim($('.cate-wrapper input',this).val()),
                amount= $.trim($('.amount-wrapper input',this).val()),
                mark=$.trim($('.mark-wrapper input',this).val());
            formData.push({
                "title":cate,
                "amount":amount,
                "remark":mark
            });
        });
        //过滤掉全空的数据
        formData= _.reject(formData,function(itemData){
            return itemData.title.length==0&&itemData.amount.length==0&&itemData.remark.length==0;
        });
        //数据验证
        if(formData.length==0){
            isPassed=false;
            util.alert("请填写报销单");
            return isPassed;
        }
        _.some(formData,function(itemData){
            if(itemData.title.length==0){
                isPassed=false;
                util.alert("请填写报销项名称");
                return true;
            }
            if(itemData.amount.length==0){
                isPassed=false;
                util.alert("请填写报销金额");
                return true;
            }
            if(parseFloat(itemData.amount) <= 0 ){
                isPassed=false;
                util.alert("请填写正确的报销金额");
                return true;
            }
			//var regNub = new RegExp(".","g")
			//if(itemData.amount.match(regNub) > 1){
				//isPassed=false;
                //util.alert("请填写正确的报销金额");
                //return true;
			//}	
            if(isNaN(parseFloat(itemData.amount))){
				isPassed=false;
                util.alert("请输入有效的报销金额");
                return true;
            }
			//保证amout是数值
			itemData.amount=parseFloat(itemData.amount);
        });
        if(!isPassed){
            return isPassed;
        }else{
            //这里传给后台数据
            util.externalExecute('saveBaoxiaoData',encodeURIComponent(JSON.stringify(formData)));
            return true;
        }
    });
});