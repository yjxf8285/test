;(function(win, $, u) {
    
    var doc = win.document;

    /*
     * underscore 设置
     */
    _.templateSettings = _.extend(_.templateSettings, {
        evaluate: /##([\s\S]+?)##/g,
        interpolate: /\{\{(.+?)\}\}/g,
        escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
    });
	

    /**
     * @description工具类对象
     */    
    var unit = {
    
        /**
         * @desc 替换字符串中{{name}}为object中key为name的值
         * @param {String} str
         * @param {Object} obj
         *
         */
        render: function(str, obj) {
            return str.replace(/\{\{(.*?)\}\}/g, function(m, k){
                return obj[k] === u ? m : obj[k];
            });
        },

        
        /**
         * @desc 显示网络出错误页面  
         *
         */
        showErrorPage: function() {
            $('.sec').hide();
            $('.g-p-error').show();
        },
        
        
        /**
         * @desc 显示toast 
         *
         */
        showToast: function(msg) {
            var $toast = $('.g-toast'),
                timer = null;
            $toast.html(msg)
                  .removeClass('slideupdown')
                  .show()
                  .addClass('slideupdown');
            
            if (timer) {
                win.clearTimeout(timer);
            }
            timer = win.setTimeout(function() {
                $toast.hide();
            }, 1000);
        },
        
        
        /**
         * @desc显示请求loading
         * @param {String} 默认加载中..
         */
        showLoading: function(msg) {
            var $el = $('.g-req-ld'),
                msg = msg || '加载中';
            
            $('span', $el).text(msg);        
            $el.show();
        },
        
        /**
         * @desc隐藏loading
         */
        hideLoading: function() {
            var $el = $('.g-req-ld');
            $('span', $el).text('加载中');        
            $el.hide();        
        }, 
         

        /**
         * @desc数据请求接口
         * @param {Object} opt
         *
         */        
        api: function(opt) {
        
            var that = this;
            
            opt = $.extend({
                keepLoading: true
            }, opt);
            
            return $.ajax({
                type: opt.type || 'GET',
                url:  opt.url  || '',
                data: opt.data || {},
                dataType: 'json',
                timeout:   10000,
                beforeSend: function() {
                    if (that.loading) {
                        return false;
                    }
                    that.loading = true;
                    opt.keepLoading && that.showLoading(opt.loadingText);
                },
                success: function(data) {
                    if (data.Success) {
                        opt.success && opt.success(data);
                    } else {
                        that.showToast(data.Message);
                    }
                },
                error: function() {
                    if (opt.error) {
                        opt.error();
                    } else {
                        routie('error')
                    }
                },
                complete: function() {
                    that.loading = false;
                    opt.keepLoading && that.hideLoading();
                    opt.complete && opt.complete();
                }
            });
        },
        
        
        /**
         * @desc 数字补零
         * @param {Number}  数字
         * @return {Number} 补零位数
         *
         */
        addZero : function(num,n) {
            if (!n) n = 2;
            return Array(Math.abs(('' + num).length - (n + 1))).join(0) + num;
        },

        
        /**
         * @desc格式化时间对象
         * @param {Object} Object 时间对象
         * @param {String} String 时间格式 YYYY-MM-dd HH:mm:ss
         *
         */
        formatDate : function(date, f) {
            var F = f.replace(/\W/g, ',').split(','),
                format = ['YYYY','MM','dd','HH','mm','ss','ww'];
            date = {
                Y : date.getFullYear(),
                M : date.getMonth() + 1,
                d : date.getDate(),
                H : date.getHours(),
                m : date.getMinutes(),
                s : date.getSeconds(),
                w : date.getDay()
            };
            
            for (var i = 0, num = F.length; i < num; i++) {
                var o = F[i];
                for (var j = 0;j < 7;j++) {
                    var S = format[j].slice(-1);
                    if (o.indexOf(S) != -1) {
                        if (S == 'w' && date[S] == 0) {
                            date[S] = 7;
                        }
                        if (o.indexOf(format[j]) != -1) {
                            f = f.replace(RegExp(format[j], 'g'), this.addZero(date[S]));
                        } else {
                            f = f.replace(RegExp(format[j].slice(format[j].length/2), 'g'), date[S]);
                        }
                    }
                }
            }
            return f;
        } 
    }; 
    
    
    win.unit = unit;
    
    
    /*=========================================================================*/
    
    
    /**
     * @desc 构造函数
     * @param {Object}
     * 时间显示的元素 
     */
    function Datepicker(opt) {
        this._target = opt.target; 
        this._callBack = opt.callBack || null;
        this._date = new Date();
        this.initialised = false;
        this._init();
    }
    
    Datepicker.prototype = {
        
        constructor: Datepicker,
        
        /**
         * @desc创建外层Dom 并绑定事件
         * 
         */
        _bind: function() {
            
            this._picker = (function() { 
                var arr = [];  
                arr.push('<div class="datepicker-box"><div class="datepicker-con">');  
                arr.push('  <div class="datepicker-header">');  
                arr.push('      <span class="datepicker-pre"><b></b></span>');  
                arr.push('      <span class="datepicker-next"><b></b></span>');  
                arr.push('      <h4></h4>');  
                arr.push('  </div>');
                arr.push('  <table class="datepicker-body">');  
                arr.push('      <thead>');  
                arr.push('          <tr>');  
                arr.push('              <th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="datepicker-weekend">六</th><th class="datepicker-weekend">日</th>');  
                arr.push('          </tr>'); 
                arr.push('      </thead>'); 
                arr.push('      <tbody>'); 
                arr.push('      </tbody>');  
                arr.push('  </table>');
                arr.push('</div></div>');
                return $(arr.join(''));  
            })();

            this._generateDays();
            var p = this;  
            this._picker.find('span').on('touchstart', function(){  
                $(this).addClass('hover');  
            }).on('touchend', function(){  
                $(this).removeClass('hover');  
            }).click(function(){  
                if($(this).hasClass('datepicker-pre')){  
                    p._date.setMonth(p._date.getMonth() - 1);  
                } else {  
                    p._date.setMonth(p._date.getMonth() + 1);  
                }                 
                p._generateDays();  
            });
              
            this._picker.click(function(e){  
                e.preventDefault();  
                e.stopPropagation();

                if (e.target == this) {
                    p._picker.hide();
                }
                
            });  
            
            return this;  
        }, 
        

        /**
         *  
         *  @description 判断是否为当天
         */
        _isToday: function(y, m, d) {
            var date = new Date(),
                year = date.getFullYear(), 
                month = date.getMonth() + 1,  
                day = date.getDate();

            return (year == y && month == m && day == d);    
        },


        /**
         *  
         *  @description 判断是否为将来的时间
         */
        _isAfterDay: function(y, m, d) {
            var date = new Date(),
                year = date.getFullYear(), 
                month = date.getMonth() + 1,  
                day = date.getDate();

            return new Date(year, month, day).getTime() < new Date(y, m, d).getTime();    
        },

        /**
         * 创建天数Dom
         */
        _generateDays : function(){  
            var year = this._date.getFullYear()  
                , month = this._date.getMonth() + 1  
                , day = this._date.getDate()  
                , days = new Date(new Date(year, month, 1) - 24*60*60*1000).getDate()  
                , week = (function(){  
                        var tDate = new Date(year, month-1, 1);  
                        var week = tDate.getDay();  
                        if(week == 0){  
                            week = 7;  
                        }  
                        return week;  
                    })();  
                      
            this._picker.find('h4').html(year + ' 年 ' + month + ' 月');  
      
            var arr = []  
                , d = 1;  
                  
            arr.push('<tr>');  
            for(var j = 1; j < week; j ++){  
                arr.push('<td>&nbsp;</td>');  
            }  
            for(var j = week; j < 8; j ++, d ++){  
                arr.push('<td class="datepicker-td');  
                if(this._isToday(year, month, d)){  
                    arr.push(' cur today');
                } 
                if(this._isAfterDay(year, month, d)){  
                    arr.push(' afterday');
                }                  
                if(j >= 6){  
                    arr.push(' datepicker-weekend');  
                }  
                arr.push('">');
                arr.push(d);
                arr.push('</td>');  
            }  
            arr.push('</tr>');  
              
            for(var i = 0, l = Math.ceil((days + week) / 7) - 2; i < l; i ++){             
                arr.push('<tr>');  
                for(var j = 1; j < 8; j ++, d ++){  
                    arr.push('<td class="datepicker-td');  
                    if(this._isToday(year, month, d)){  
                        arr.push(' cur today');
                    }
                    if(this._isAfterDay(year, month, d)){  
                        arr.push(' afterday');
                    }                         
                    if(j >= 6){  
                        arr.push(' datepicker-weekend');  
                    }  
                    arr.push('">');
                    arr.push(d);
                    arr.push('</td>');  
                }  
                arr.push('</tr>');  
            }  
              
            var l = days - d + 1;  
            if(l != 0){  
                arr.push('<tr>');  
                for(var i = 0; i < l; i ++, d ++){  
                    arr.push('<td class="datepicker-td');  
                    if(this._isToday(year, month, d)){  
                        arr.push(' cur today');
                    } 
                    if(this._isAfterDay(year, month, d)){  
                        arr.push(' afterday');
                    }                       
                    if(i >= 6){  
                        arr.push(' datepicker-weekend');  
                    }
                    arr.push('">');
                    arr.push(d);
                    arr.push('</td>');  
                }  
                for(var i = l + 1; i < 8; i ++){  
                    arr.push('<td>&nbsp;</td>');  
                }  
                arr.push('</tr>');  
            }  
            this._picker.find('tbody')[0].innerHTML = arr.join('');  
            var p = this; 

            this._picker.find('.datepicker-td').unbind().on('touchstart', function(){  
                $(this).addClass('hover');  
            }).on('touchend', function(){  
                $(this).removeClass('hover');  
            }).click(function(){  
                if ($(this).hasClass('afterday')) {
                    return;
                }
                if ($(this).hasClass('cur')) {
                    p.hide();
                    return;
                }
                p._picker.find('.datepicker-td').removeClass('cur');  
                $(this).addClass('cur');  
                var day = parseInt($(this).text(), 10);  
                p._date = new Date(year, month - 1, day);  
                p.hide();
                p._target.text(p.getDate());
                p._callBack && p._callBack();  
            });
        },

        _init: function() {
            var that = this;
            this._target.text(this.getDate());
            this._target.on('click', function() {
                // HACK: 此处应该抽离到编辑对象中
                // 数据修改了不允许 选择时间了
                if ($(this).hasClass('data-change')) {
                    unit.showToast('已有数据修改，请提交！')
                    return;
                }
                if (!that.initialised) {
                    that._bind();
                    that._picker.insertAfter(that._target);
                    that.show();
                    that.initialised = true;
                } else {
                    that.show();
                }
            });
        },
        
        /**
         * @desc获取时间接口
         */
        getDate: function() {
            return this._date.getFullYear()
                   + '-'
                   + unit.addZero((this._date.getMonth() + 1))
                   + '-'
                   + unit.addZero(this._date.getDate())
        },
        
        reset: function() {
            this._date = new Date();
            this.initialised = false;
            this._target.text(this.getDate());
            this.hide();
        },
        
        show : function() {  
            this._picker.show()
                        .find('.datepicker-con')
                        .removeClass('slidedown')
                        .show()
                        .addClass('slidedown');  
        },
        
        hide : function(){  
            this._picker && this._picker.hide();  
        }
    };
    
    win.Datepicker = Datepicker;

}(window, Zepto));