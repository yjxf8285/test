/**
 * Audio player，不支持audio标签的浏览器采用flash fallback方案
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS;
    var swfobject=require('swfobject'),
        tplHelper=require('assets/html/helper.html');

    var AUDIO_PLAYER_INDEX=0;
    var defaultAudioSrc=FS.ASSETS_PATH+"/sound/notification.mp3", //默认音频播放地址
        testAudioSrc=FS.ASSETS_PATH+"/sound/test.mp3";

    var player, //创建播放器
        playerCore,
        playShadowStore=[],
        flashTid; //flash播放器计时器，控制播放状态改变
    var audioTpl1=$(tplHelper).filter('.audio-player-tpl-1').html(),
        audioHtml1=_.template(audioTpl1, {
            "blankImage":FS.BLANK_IMG
        }),
        audioHtml2=$(tplHelper).filter('.audio-player-tpl-2').html(),
        audioHtml3=$(tplHelper).filter('.audio-player-tpl-3').html();
    if(!(document.createElement('audio').canPlayType)){ //flash模式
        var attrs={
            "data":FS.ASSETS_PATH+"/dewplayer/dewplayer-vol.swf"
        },params={
            "flashvars":"mp3="+defaultAudioSrc+"&javascript=on",
            //"flashvars":"mp3="+FS.ASSETS_PATH+"/dewplayer/mp3/test1.mp3&javascript=on",
            "wmode": "transparent"
        };
        $('<span class="fn-hide-abs"><span id="fs-audio-flash-player" class="fn-hide-abs"></span></span>').appendTo('body');
        if (swfobject.hasFlashPlayerVersion("9.0.0")) {
            player={
                "core":swfobject.createSWF(attrs, params, 'fs-audio-flash-player'),
                "audioType":"flash"
            };
        }else {
            $('#fs-audio-flash-player').html('对不起，您的浏览器不支持录音播放。');
        }
    }else{    //h5模式
        playerCore= document.createElement("audio");
        playerCore.src=defaultAudioSrc;    //ie下需要有音频设备才可以播放，不然会提示"无效源"或"音频类型不受支持或文件路径无效"
        playerCore.setAttribute("controls","controls");
        $(playerCore).addClass('fn-hide-abs').appendTo('body');

        player={
            "core":playerCore,
            "audioType":"h5"
        };
    }
    //更新audio状态
    var ctrAudioStatus=function(id,action){
        if(!action){    //更新全部状态
            action=id;
            _.each(playShadowStore,function(audio){
                audio[action]();
            });
        }else{
            _.some(playShadowStore,function(audio){
                if(audio.id==id){
                    audio[action]();
                    return true;
                }
            });
        }
    };
    //清除对应的audio存储
    var deleteAudioStore=function(id){
        playShadowStore= _.reject(playShadowStore,function(audio){
            return audio.id==id;
        });
    };
    var AudioPlayer=function(opts){
        opts= _.extend({
            "themeStyle":1, //1、2、3三种风格，默认是1风格
            "element":null,
            "audioSrc":"",
            "length":0,  //时长
            "defaultVolume":50 //默认音量
        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this._status="stop";    //追踪状态
        this._volume=opts.defaultVolume;    //默认音量
        this.id='fs-audio-shadow-player-'+AUDIO_PLAYER_INDEX;
        AUDIO_PLAYER_INDEX++;
        this.init();
    };
    _.extend(AudioPlayer.prototype,{
        "init":function(){
            var elEl=this.element,
                opts=this.opts;
            if(player){     //存在播放器的条件下
                //设置cls
                elEl.addClass('fs-audio');
                if(opts.themeStyle==1){
                    elEl.addClass('fs-audio-1');
                    elEl.html(audioHtml1);
                }else if(opts.themeStyle==2){
                    elEl.addClass('fs-audio-2');
                    elEl.html(audioHtml2);
                }else if(opts.themeStyle==3){
                    elEl.addClass('fs-audio-3');
                    elEl.html(audioHtml3);
                }
                //存储引用
                playShadowStore.push(this);
                this._bindEvents();
            }
        },
        "_bindEvents":function(){
            var that=this;
            var core=player.core;
            var elEl=this.element,
                volItemsEl=$('.mic-vol',elEl);
            elEl.on('click','.mc-play',function(evt){
                that.play();
            }).on('click','.mc-pause',function(evt){
                that.pause();
            }).on('click','.mic-vol',function(evt){  //音量控制
                var volEl=$(evt.currentTarget);
                var volIndex=volItemsEl.index(volEl);
                if(volIndex>0){
                    that.setVolume(volIndex*16.67);
                }

            });
            var playHandler=function(){
                if(that._status=="playing"){
                    that._updateStatus('pausing');
                }
            };
            if(player.audioType=="h5"){
                core.addEventListener("ended", playHandler, true);
            }else if(player.audioType=="flash"){

            }
            this._playHandler=playHandler;
        },
        /**
         * 更新状态,分派入口
         * @param status play/pause
         * @private
         */
        _updateStatus:function(status){
            var opts=this.opts,
                themeStyle=opts.themeStyle;
            this["_updateStatus"+themeStyle](status);
        },
        _updateStatus1:function(status){
            var elEl=this.element,
                tipEl=$('.mic-content',elEl),
                ctrBtnEl=$('.ctr-btn',elEl);
            var opts=this.opts;
            if(status=="playing"){
                this._status="playing";
                tipEl.html('正在播放...时长：'+this._getFormatLength(opts.length));
                ctrBtnEl.removeClass('mc-play').addClass('mc-pause');
            }else if(status=="pausing"){
                this._status="pausing";
                tipEl.html('已停止，时长：'+this._getFormatLength(opts.length));
                ctrBtnEl.removeClass('mc-pause').addClass('mc-play');
            }
        },
        _updateStatus2:function(status){
            var elEl=this.element,
                audioWEl=$('.voice-green-wrapper',elEl),
                ctrBtnEl=$('.ctr-btn',elEl);
            if(status=="playing"){
                this._status="playing";
                audioWEl.addClass('vg-on');
                ctrBtnEl.removeClass('mc-play').addClass('mc-pause');
            }else if(status=="pausing"){
                this._status="pausing";
                audioWEl.removeClass('vg-on');
                ctrBtnEl.removeClass('mc-pause').addClass('mc-play');
            }
        },
        _updateStatus3:function(status){
            var elEl=this.element,
                audioWEl=$('.voice-grey-wrapper',elEl),
                ctrBtnEl=$('.ctr-btn',elEl);
            if(status=="playing"){
                this._status="playing";
                audioWEl.addClass('vy-on');
                ctrBtnEl.removeClass('mc-play').addClass('mc-pause');
            }else if(status=="pausing"){
                this._status="pausing";
                audioWEl.removeClass('vy-on');
                ctrBtnEl.removeClass('mc-pause').addClass('mc-play');
            }
        },
        /**
         * 获取格式化的时长
         * @param len
         */
        "_getFormatLength":function(second){
            return [parseInt(second / 60 / 60), parseInt(second / 60 % 60), parseInt(second % 60)].join(":")
                .replace(/\b(\d)\b/g, "0$1");
        },
        "flashReadyCb":function(fnName){
            var args=[].slice.call(arguments,1);
            var core=player.core;
            var i=0;
            var tId=setInterval(function(){
                if(core[fnName]||i>16){ //最大延迟1s左右
                    clearInterval(tId);
                    core[fnName]&&core[fnName].apply(core,args);
                }else{
                    i++;
                }
            },60);
        },
        "play":function(){
            var that=this;
            var core=player.core;
            var opts=this.opts,
                audioSrc=opts.audioSrc;
            var secondIndex=0;
            //将其他audio状态变更为pausing
            ctrAudioStatus('pause');
            this._updateStatus('playing');
            //设置音量
            this.setVolume(this._volume);
            //播放
            if(player.audioType=="h5"){
                core.src=audioSrc;
                //core.src=testAudioSrc;
                core.play();
            }else if(player.audioType=="flash"){
                this.flashReadyCb("dewset",audioSrc);
                //this.flashReadyCb("dewset",testAudioSrc);
                this.flashReadyCb("dewplay");
                clearInterval(flashTid);
                //开启计时
                flashTid=setInterval(function(){
                    var pos=core.dewgetpos();
                    if(opts.length<=1){   //处理不足1s的播放情况
                        clearInterval(flashTid);
                        return;
                    }
                    if(pos>=(opts.length*1000)||(secondIndex>opts.length)){    //
                        clearInterval(flashTid);
                        that._updateStatus('pausing');
                    }
                    secondIndex++;
                },1000);     //最少间隔1s
            }
        },
        "stop":function(){
            var core=player.core;
            if(player.audioType=="h5"){
                try{
                    core.currentTime = 0;
                    core.pause();
                }catch(evt){}
            }else if(player.audioType=="flash"){
                this.flashReadyCb("dewstop");
            }

        },
        "pause":function(){
            var core=player.core;
            if(player.audioType=="h5"){
                core.pause();
            }else if(player.audioType=="flash"){
                this.flashReadyCb("dewpause");
            }
            this._updateStatus('pausing');
        },
        /**
         * 设置音量大小
         * @param volume
         */
        "setVolume":function(volume){
            var core=player.core,
                audioType=player.audioType;
            var elEl=this.element,
                volItemsEl=$('.mic-vol',elEl);
            var volIndex=Math.ceil(volume/16.67); //向上取

            volItemsEl.removeClass('mic-aon');
            if(volIndex>0){
                volItemsEl.slice(0,volIndex+1).addClass('mic-aon');
            }
            if(audioType=="h5"){
                core.volume = parseFloat(volume/100);
            }else if(audioType=="flash"){
                this.flashReadyCb("dewvolume",volume);
            }
            //存储音量值
            this._volume=volume;
        },
        "destroy":function(){
            var elEl=this.element;
            var core=player.core;
            elEl.removeClass('fs-audio fs-audio-1 fs-audio-2 fs-audio-3').empty();
            if(player.audioType=="h5"){
                core.removeEventListener("playing", this._playHandler, true);
                this._playHandler=null;
            }else if(player.audioType=="flash"){

            }
            deleteAudioStore(this.id);
            this.element=null;
        }
    });
    module.exports=AudioPlayer;
});
