/**
 * Author LLJ
 * Date 2016-5-10 9:53
 */
    var tipsUtils=require('./tips-utils.js');
var format= {
    showData:function(data,defaultTitle,icon){
      var res=  $.extend(true,{
          url:'',
          info:{},
          num:0
      },data);
        res.type=data.nodeType;
        res.info=$.extend(true,tipsUtils.getDataByType(data.itemType,""),res.info);
        res.name=res.info.name||defaultTitle;
        res.icon=icon||'&#xe62e;';
        res.desc= res.info.desc;
        return  res;
    }
};
module.exports = format;
