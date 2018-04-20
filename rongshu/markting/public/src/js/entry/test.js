/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';

import pagination from 'plugins/pagination.js'
//组件
var Modals = require('component/modals.js');
$(function () {
    function createDemo(name, sum) {
        var sources = function () {
            var result = [];
            for (var i = 1; i < sum; i++) {
                result.push(i);
            }
            return result;
        }();
        var container = $('.pagination-' + name);
        var options = {
            className: 'paginationjs-theme-blue',
            dataSource: sources,
            pageSize: 5,//一页显示多少条数据
            autoHidePrevious: true,
            autoHideNext: true,
            callback: function (response, pagination) {
                console.info(pagination.pageNumber)
            }
        };
        $.pagination(container, options);
    }

    createDemo('demo1', 100);


    $('#test-window').click(function(){

          new Modals.Window({
              title:"Window",
              content:"<div>11111</div>",
              //height:'auto',默认是auto
              //width:'auto',默认是auto
              buttons:[{
                      text: '自定义1',
                      cls:'accept',
                      handler: function (self) {
                          self.close();
                      }
                  },
                  {
                      text: '自定义2',
                      cls:'decline',
                      handler: function (self) {
                          self.close();
                      }
                  }
              ],
              listeners:{//window监听事件事件
                  open:function(){
                      console.log("open")
                  },
                  close:function(){
                      console.log("close")
                  },
                  beforeRender:function(){
                      alert("beforeRender")
                  },
                  afterRender:function(){
                      alert("afterRender")
                  }
              }

          })
    });
    $('#test-alert').click(function(){
        new Modals.Alert("I am Alert !");
    });
    $('#test-confirm').click(function(){
        new Modals.Confirm({
            content:"I am Confirm !",
            listeners:{
                close:function(type){
                    if(type){
                      alert("click Ok ")
                    }else{
                        alert("click cancel ")
                    }
                }
            }
        });
    });

});

