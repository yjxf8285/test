/**********
 * chart demo页
 **********/
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;

    var Highcharts=require('highcharts');
    var Theme=require('highchartsTheme');

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        
        //加载主题
	    Highcharts.setOptions(Theme);

	    /*
	    *折线图
	    */
	    $('.-hichart-line',tplEl).highcharts({
            title: {
                text: '这是标题',
                x: -20 //center
            },
            subtitle: {
                text: '这是副标题',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (oC)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 'C'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: [{
                name: '东京',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: '纽约',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: '柏林',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: '伦敦',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
	 	});
    	
    	/*
    	*饼状图
    	*/
    	var colors = Highcharts.getOptions().colors,
        categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
        name = 'Browser brands',
        data = [{
                y: 55.11,
                color: colors[0],
                drilldown: {
                    name: 'MSIE versions',
                    categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0'],
                    data: [10.85, 7.35, 33.06, 2.81],
                    color: colors[0]
                }
            }, {
                y: 21.63,
                color: colors[1],
                drilldown: {
                    name: 'Firefox versions',
                    categories: ['Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'Firefox 4.0'],
                    data: [0.20, 0.83, 1.58, 13.12, 5.43],
                    color: colors[1]
                }
            }, {
                y: 11.94,
                color: colors[2],
                drilldown: {
                    name: 'Chrome versions',
                    categories: ['Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
                        'Chrome 10.0', 'Chrome 11.0', 'Chrome 12.0'],
                    data: [0.12, 0.19, 0.12, 0.36, 0.32, 9.91, 0.50, 0.22],
                    color: colors[2]
                }
            }, {
                y: 7.15,
                color: colors[3],
                drilldown: {
                    name: 'Safari versions',
                    categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
                        'Safari 3.1', 'Safari 4.1'],
                    data: [4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14],
                    color: colors[3]
                }
            }, {
                y: 2.14,
                color: colors[4],
                drilldown: {
                    name: 'Opera versions',
                    categories: ['Opera 9.x', 'Opera 10.x', 'Opera 11.x'],
                    data: [ 0.12, 0.37, 1.65],
                    color: colors[4]
                }
            }];

		// Build the data arrays
		var browserData = [];
		var versionsData = [];
		for (var i = 0; i < data.length; i++) {

		    // add browser data
		    browserData.push({
		        name: categories[i],
		        y: data[i].y,
		        color: data[i].color
		    });

		    // add version data
		    for (var j = 0; j < data[i].drilldown.data.length; j++) {
		        var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
		        versionsData.push({
		            name: data[i].drilldown.categories[j],
		            y: data[i].drilldown.data[j],
		            color: Highcharts.Color(data[i].color).brighten(brightness).get()
		        });
		    }
		}

		// Create the chart

		$('.-hichart-pie',tplEl).highcharts({
		    chart: {
		        type: 'pie'
		    },
		    title: {
		        text: 'Browser market share, April, 2011'
		    },
		    yAxis: {
		        title: {
		            text: 'Total percent market share'
		        }
		    },
		    plotOptions: {
		        pie: {
		            shadow: false,
		            center: ['50%', '50%']
		        }
		    },
		    tooltip: {
			    valueSuffix: '%'
		    },
		    series: [ {
		        name: 'Versions',
		        data: versionsData,
		        size: '80%',
		        innerSize: '50%',
		        dataLabels: {
		            formatter: function() {
		                // display only if larger than 1
		                return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y +'%'  : null;
		            }
		        }
		    }]
		});

    };
});   
