/**
 * 分段式列表懒加载helper组件
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS;
    var Events=require('events');
    var FsLazyload=function(opts){
        opts= _.extend({
            "triggerSize":0,    //滚动条距离window底部的长度作为executeHandler的执行点
            "executeHandler": FS.EMPTY_FN,
            "circleCount":3   //每次循环执行次数
        },opts||{});
        this.opts=opts;
        this._locked=true;
        this._activeIndex=0;
        this.init();
    };
    _.extend(FsLazyload.prototype,{
        "init":function(){
            var that=this;
            var opts=this.opts,
                triggerSize=opts.triggerSize;
            //滚动到底部执行handler
            $(root).scroll(function(){
                var winH,
                    docH,
                    scrollTop;
                if(!that._locked){
                    winH=$(root).height();
                    docH=$(document).height();
                    scrollTop=$(root).scrollTop();
                    if(winH+scrollTop+triggerSize>=docH){
                        that._exec(function(){
                            //手动调整滚动条位置为上一次滚动位置
                            $(root).scrollTop(scrollTop);
                        });
                    }
                }
            });
        },
        "_exec":function(callback){
            var that=this;
            var opts=this.opts,
                executeHandler=opts.executeHandler;
            this._locked=true;
            executeHandler.call(that,that._activeIndex,function(isDone){
                that._counting(isDone);
                callback.call(that);
            });
        },
        /**
         * 开启懒执行，被stop后可继续执行
         * @param reset 是否绕过界限判定直接执行，默认为否
         */
        "start":function(reset){
            this._locked=false;
            if(reset){
                this._exec(function(){
                    $(root).scrollTop(0);
                });
            }else{
                $(root).scrollTop(0).trigger('scroll');   //给个极大值触发加载开始
            }
            this.trigger('start');
        },
        "stop":function(){
            this._locked=true;
            this.trigger('stop');
        },
        "kill":function(){
            this.stop();
            //重置为0
            this._activeIndex=0;
        },
        "getActiveIndex":function(){
            return this._activeIndex;
        },
        "_counting":function(isDone){
            var opts=this.opts,
                circleCount=opts.circleCount;
            if(isDone){
                this._activeIndex++;
                if(this._activeIndex==circleCount){
                    this._activeIndex=0;    //设回初始值
                    this.stop();    //达到界限条件后锁定，等待下次开启进入下次循环
                }else{
                    this._locked=false;   //单次执行成功后解锁，继续下次执行
                }
            }else{  //单次执行失败后解锁，尝试下次执行
                this._locked=false;
            }
        },
        "destroy":function(){
            this.off();
            this.kill();
            this.executeHandler=FS.EMPTY_FN;
            return this;
        }
    });
    Events.mixTo(FsLazyload);
    module.exports=FsLazyload;
});

