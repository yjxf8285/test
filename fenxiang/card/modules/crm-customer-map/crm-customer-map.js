/**
 * 客户联系地址
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

define(function(require,exports,module){
	var Widget=require('widget'),
        root = window,
        FS = root.FS,
	    util=require('util');
    var tpl = require('modules/crm-customer-map/crm-customer-map.html');
////    var tplStyle = require('modules/crm-customer-map/crm-customer-map.css');

	var Address = Widget.extend({
		"attrs":{
            "element":null,
            "address":"",
            "mapWidth":320
		},

		"setup":function(){
            var result=Address.superclass.setup.apply(this,arguments);
            this._init();
            return result;
        },

        "_init":function(){
            this.element.html(tpl);
            var address = this.get("address");
            this.refresh(address);
        },

        "refresh":function(address){
            if(!address){
                this.element.hide();
                return;
            }else{
                this.element.show();
            }
            var protocol = window.location.protocol;
            var mapWidth = this.get("mapWidth");
            var trimAddress =address.split(" ").join("");
            //var mapImage = protocol+"//maps.google.com/maps/api/staticmap?center="+address+"&markers="+address+"&size="+mapWidth+"x280&zoom=15&sensor=false";
            var mapImage = "http://api.map.baidu.com/staticimage?center="+trimAddress+"&markers="+trimAddress+"&width="+mapWidth+"&height=280&zoom=15";
            //var mapLink = protocol+"//maps.google.com/maps?expflags=enable_star_based_justifications:true&ie=UTF8&q="+address+"&iwloc=A&gl=US&hl=zh-CN";
            var mapLink = "http://api.map.baidu.com/geocoder?address="+address+"&output=html";
            var imageContainer = $(".crm-customer-map-image-container",this.element);
            $(".crm-customer-map-image",this.element).attr("src",mapImage);
            $(".crm-customer-map-image-link",this.element).text(address);
            $(".crm-customer-map-image-link",this.element).attr("href",mapLink);
            $(".crm-customer-map-image-link",this.element).attr("title",address);
            $(".crm-customer-map-image-info",this.element).css({"left":(mapWidth-270)/2});
        },
       
        "destroy":function(){
            var result=Address.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = Address;
});