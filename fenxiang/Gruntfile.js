/**
 * The config for build Fxiaoke project base on grunt.
 * User: qisx
 * Date: 13-9-24
 * Time: 下午12:03
 */
module.exports = function(grunt) {
    var script = require('./libs/script').init(grunt);
    //所有文件类型
    //var allFileSrc=['**/*.css','**/*.html','**/*.js','**/*.swf','**/*.png','**/*.gif','**/*.jpg'];
    var allFileSrc=['**/*.*'];
    grunt.initConfig({
        "copy": {
            modules: {
                files: [{
                    expand: true,
                    cwd: 'card/modules/',
                    src: allFileSrc,
                    dest: 'card-dist/modules/'
                }]
            },
            tpls: {
                files: [{
                    expand: true,
                    cwd: 'card/tpls/',
                    src: allFileSrc,
                    dest: 'card-dist/tpls/'
                }]
            },
            assets:{
                files: [{
                    expand: true,
                    cwd: 'card/assets/',
                    src: allFileSrc,
                    dest: 'card-dist/assets/'
                }]
            }
        },
        "imagemin": {                          // Task
            assets: {                         // Another target
                options: {                       // Target options
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'card-dist/assets/images/',               // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}','!**/employee_default_120_120.png','!menu/attach_color.png','!menu/template_color.png'],   // employee_default_120_120.png.png无法压缩
                    dest: 'card-dist/assets/images/'                  // Destination path prefix
                }]
            }
        },
        "transport": {
            options: {
                // Task-specific options go here.
                debug:false,
                parsers: {
                    '.js': [script.jsParser]
                }
            },
            jslibs: {
                "options":{
                    "idleading":"jslibs/"
                },
                files: [{
                    expand:true,
                    cwd: 'card-dist/assets/js/',
                    src: 'util.js',
                    dest: 'card-dist/assets/js/'
                },{
                    expand:true,
                    cwd: 'card-dist/assets/js/',
                    src: 'app.js',
                    dest: 'card-dist/assets/js/'
                }]
            },
            base: {
                "options":{
                    "idleading":"jslibs/"
                },
                files: [{
                    expand:true,
                    cwd: 'card-dist/assets/datatable/js',
                    src: 'datatables.js',
                    dest: 'card-dist/assets/datatable/js/'
                },{
                    expand:true,
                    cwd: 'card-dist/assets/js/',
                    src: 'events.js',
                    dest: 'card-dist/assets/js/'
                },{
                    expand:true,
                    cwd: 'card-dist/assets/js/',
                    src: 'prepare.js',
                    dest: 'card-dist/assets/js/'
                }]
            },
            uilibs:{
                "options":{
                    "idleading":"uilibs/"
                },
                files: [{
                    expand:true,
                    cwd: 'card-dist/assets/uilibs/',
                    src: ['**/*.js','!**/all.js'],
                    dest: 'card-dist/assets/uilibs/'
                }]
            },
            modules: {
                "options":{
                    "idleading":"modules/"
                },
                files: [{
                    expand:true,
                    cwd: 'card-dist/modules/',
                    src: '**/*.js',
                    dest: 'card-dist/modules/'
                }]
            },
            tpls: {
                "options":{
                    "idleading":"tpls/"
                },
                files: [{
                    expand:true,
                    cwd: 'card-dist/tpls/',
                    src: '**/*.js',
                    dest: 'card-dist/tpls/'
                    //ext: '.min.js'     //组件内部实现导致此配置不起作用
                }]
            }
        },
        
//    	"cmd_handlebars": {
//		  modules: {
//		    options: {
//		      handlebars_id: 'handlebars',
//		      exports: 'this["fstpl"]'
//		    },
//		    files: {
//		      src: ['card-dist/modules/fs-select-contact/fs-select-contact-html.js'],
//		      dest: 'card-dist/modules/fs-select-contact/fs-select-contact-html.js'
//		    }
//		  }
//		},
        "uglify": {
            options: {
                /*beautify: true,
                 comments: true*/
            },
            assets: {
                options:{
                    banner: '/**\n' +
                        ' * 纷享资源脚本\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files: [{
                    src: 'card-dist/assets/js/underscore.js',
                    dest: 'card-dist/assets/js/underscore.js'
                },{
                    src: 'card-dist/assets/js/underscore.string.js',
                    dest: 'card-dist/assets/js/underscore.string.js'
                },{
                    src: 'card-dist/assets/js/backbone.js',
                    dest: 'card-dist/assets/js/backbone.js'
                },{
                    src: 'card-dist/assets/js/common.js',
                    dest: 'card-dist/assets/js/common.js'
                },{
                    src: 'card-dist/assets/js/util.js',
                    dest: 'card-dist/assets/js/util.js'
                },{
                    src: 'card-dist/assets/js/jquery.atwho.js',
                    dest: 'card-dist/assets/js/jquery.atwho.js'
                },{
                    src: 'card-dist/assets/js/store.js',
                    dest: 'card-dist/assets/js/store.js'
                },{
                    src: 'card-dist/assets/datatable/js/jquery.dataTables.js',
                    dest: 'card-dist/assets/datatable/js/jquery.dataTables.js'
                },{
                    src: 'card-dist/assets/datatable/js/datatables-plugin.js',
                    dest: 'card-dist/assets/datatable/js/datatables-plugin.js'
                },{
                    src: 'card-dist/assets/raphael/raphael.js',
                    dest: 'card-dist/assets/raphael/raphael.js'
                },{
                    src: 'card-dist/assets/swfupload/swfupload.js',
                    dest: 'card-dist/assets/swfupload/swfupload.js'
                },{
                    src: 'card-dist/assets/js/jquery.autosize.js',
                    dest: 'card-dist/assets/js/jquery.autosize.js'
                },{
                    src: 'card-dist/assets/js/position.js',
                    dest: 'card-dist/assets/js/position.js'
                },{
                    src: 'card-dist/assets/js/jquery.tinyscrollbar.js',
                    dest: 'card-dist/assets/js/jquery.tinyscrollbar.js'
                },{
                    src: 'card-dist/assets/js/prepare.js',
                    dest: 'card-dist/assets/js/prepare.js'
                },{
                    src: 'card-dist/assets/js/jquery.atwho.custom.js',
                    dest: 'card-dist/assets/js/jquery.atwho.custom.js'
                },{
                    src: 'card-dist/assets/js/events.js',
                    dest: 'card-dist/assets/js/events.js'
                },{
                    src: 'card-dist/assets/js/app.js',
                    dest: 'card-dist/assets/js/app.js'
                }]
            },
            uilibs:{
                files: [{
                    expand: true,
                    cwd: 'card-dist/assets/uilibs/',
                    src: ['**/*.js'],
                    dest: 'card-dist/assets/uilibs/'
                }]
            },
            modules: {
                options:{
                    banner: '/**\n' +
                    ' * 纷享模块逻辑\n'+
                    ' * @Author: 纷享网页前端部\n'+
                    ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                    ' */\n'
                },
                files: [{
                    expand: true,
                    cwd: 'card-dist/modules/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'card-dist/modules/'
                    //ext: '.min.js'
                }]
            },
            tpls: {
                options:{
                    banner: '/**\n' +
                        ' * 纷享页面逻辑\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files: [{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.js', '!**/*.min.js', '!**/*.html.js'],
                    dest: 'card-dist/tpls/'
                    //ext: '.min.js'
                },{
                    expand:true,
                    cwd: 'card/assets/seajs/sea-modules/arale/',
                    src: '**/*-debug.js',
                    dest: 'card-dist/assets/seajs/sea-modules/arale/'
                    //ext: '.min.js'     //组件内部实现导致此配置不起作用
                }
//                    {
//                        expand:true,
//                        cwd: 'card/assets/seajs/sea-modules/arale/',
//                        src: '**/*-debug.js',
//                        dest: 'card/assets/seajs/sea-modules/arale/',
//                        ext: '.js',
//                        rename: function(a,b,c){
////                            grunt.log.writeln('============================================'+a + b.replace('-debug', ''));
//                            return a + b.replace('-debug', '');
//                        }
//                    }
                ]
            }
        },
        "cssmin": {
            assets: {
                options:{
                    banner: '/**\n' +
                        ' * 纷享资源样式\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files: [{
                    src: 'card-dist/assets/style/base.css',
                    dest: 'card-dist/assets/style/base.css'
                },{
                    src: 'card-dist/assets/style/ui.css',
                    dest: 'card-dist/assets/style/ui.css'
                },{
                    src: 'card-dist/assets/style/common.css',
                    dest: 'card-dist/assets/style/common.css'
                },{
                    src: 'card-dist/assets/style/app.css',
                    dest: 'card-dist/assets/style/app.css'
                },{
                    src: 'card-dist/assets/style/ui-admin.css',
                    dest: 'card-dist/assets/style/ui-admin.css'
                },{
                    src: 'card-dist/assets/style/common-admin.css',
                    dest: 'card-dist/assets/style/common-admin.css'
                },{
                    src: 'card-dist/assets/style/admin.css',
                    dest: 'card-dist/assets/style/admin.css'
                },{
                    src: ['card-dist/modules/modules/crm-modules-all.css','card-dist/modules/modules/crm-modules-all2.css'],
                    dest: 'card-dist/modules/modules/crm-modules-all.css'
                }]
            },
            modules: {
                options:{
                    banner: '/**\n' +
                        ' * 纷享模块样式\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files: [{
                    expand: true,
                    cwd: 'card-dist/modules/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'card-dist/modules/'
                    //ext: '.min.css'
                }]
            },
            tpls: {
                options:{
                    banner: '/**\n' +
                        ' * 纷享页面样式\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files: [{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'card-dist/tpls/'
                    //ext: '.min.css'
                }]
            }
        },
        "htmlmin": {
            modules: {
                options:{
		        	removeComments: true,
		            collapseWhitespace: true
        		},
                files: [{
                    expand: true,
                    cwd: 'card-dist/modules/',
                    src: ['**/*.html', '!**/*.min.html'],
                    dest: 'card-dist/modules/'
                    //ext: '.min.html'
                },{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.html', '!**/*.min.html'],
                    dest: 'card-dist/tpls/'
                    //ext: '.min.html'
                },{
                    expand: true,
                    cwd: 'card-dist/assets/',
                    src: ['**/*.html', '!**/*.min.html'],
                    dest: 'card-dist/assets/'
                    //ext: '.min.html'
                }]
            },
            tpls: {
                options:{},
                files: [{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.html', '!**/*.min.html'],
                    dest: 'card-dist/tpls/'
                    //ext: '.min.html'
                }]
            }
        },
        "handlebars": {
        	options: {
	    	    namespace: 'fstpl',
	    	    processName: function(filePath) {
	    	    	return filePath.replace('card-dist/', '');  
	    	    }
	    	},
	    	stream: {
	    	    files: {  //dest任意，只缺
	    	        "card-dist/tpls/stream/stream.html.js": ["card-dist/modules/fs-qx/fs-qx.html","card-dist/modules/fs-attach/fs-attach.html","card-dist/modules/publish/publish.html","card-dist/modules/fs-map/fs-map.html","card-dist/modules/feed-list/feed-list.html","card-dist/tpls/stream/stream.html", "card-dist/modules/fs-reply/fs-reply.html", 
	    	                                                 "card-dist/modules/card-reply/reply.html", "card-dist/modules/fs-schedule/fs-schedule.html", "card-dist/modules/fs-createremind/fs-createremind.html", "card-dist/modules/crm-contact-view/crm-contact-view.html", "card-dist/modules/fs-select-contact/fs-select-contact.html", "card-dist/modules/fs-select-customer/fs-select-customer.html",
	    	                                                 "card-dist/tpls/stream/stream-common.html", "card-dist/modules/fs-search-select/fs-search-select.html", "card-dist/modules/fs-announcement/fs-announcement.html", "card-dist/modules/fs-select-city/fs-select-city.html", "card-dist/modules/fs-worktodo/fs-worktodo.html"]
	    	    }
	    	}
    	},
        "concat": {
            options: {
                stripBanners: true
            },
            seajs: {
                options: {
                    banner: '/**\n' +
                        ' * 纷享自定制版arale.js\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files: [{
//                    src: ['card-dist/assets/seajs/sea-modules/arale/**/*.js', '!card-dist/assets/seajs/sea-modules/arale/**/*-debug.js'],
                    src: ['card-dist/assets/seajs/sea-modules/arale/**/*-debug.js'],
                    dest: 'card-dist/assets/seajs/dist/all.js'
                }]
            },
            base: {
                options: {
                banner: '/**\n' +
	                    ' * 纷享自定制版\n'+
	                    ' * @Author: 纷享网页前端部\n'+
	                    ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
	                    ' */\n'
	            },
	            files: [{
	                src: ['card-dist/assets/datatable/js/jquery.dataTables.js', 'card-dist/assets/datatable/js/datatables-plugin.js', 'card-dist/assets/datatable/js/datatables.js'],
	                dest: 'card-dist/assets/datatable/js/datatables.js'
	            }]
	        },
	        uilibs:{
                options:{
                    banner: '/**\n' +
                        ' * aralejs组件包装\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files:[{
                    src: ['card-dist/assets/uilibs/**/*.js', '!card-dist/assets/uilibs/all.js'],
                    dest: 'card-dist/assets/uilibs/all.js'
                }]
            },
            assets:{
                options:{
                    banner: '/**\n' +
                        ' * 纷享资源文件\n'+
                        ' * @Author: 纷享网页前端部\n'+
                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        ' */\n'
                },
                files:[{
                    src: ['card-dist/assets/style/base.css','card-dist/assets/style/ui.css','card-dist/assets/style/ui-crm.css','card-dist/assets/style/common.css','card-dist/assets/style/common-crm.css','card-dist/assets/style/app.css','card-dist/assets/style/crm.css','card-dist/assets/style/crm-detail.css','card-dist/assets/style/crm-list-page.css', 'card-dist/assets/style/nprogress.css','card-dist/assets/style/jquery.atwho.css','card-dist/assets/style/scrollbar.css','card-dist/modules/modules/fs-modules-all.css'],
                    dest: 'card-dist/assets/style/all.css'
                },{
                    src: ['card-dist/assets/style/base.css','card-dist/assets/style/ui-admin.css','card-dist/assets/style/common-admin.css','card-dist/assets/style/admin.css', 'card-dist/modules/fs-qx/fs-qx.css'],
                    dest: 'card-dist/assets/style/all-admin.css'
                },{
                    src: ['card-dist/assets/seajs/sea.js',
                          'card-dist/assets/seajs/plugin-shim.js','card-dist/assets/seajs/plugin-text.js','card-dist/assets/seajs/plugin-style.js',
                          'card-dist/assets/js/underscore.js','card-dist/assets/js/underscore.string.js','card-dist/assets/js/backbone.js','card-dist/assets/js/common.js','card-dist/assets/uilibs/all.js'],
                    dest: 'card-dist/assets/js/all.js',
                    nonull: true
                }]
            },
//            modules: {
//            	files:[{
//                    src: ['card-dist/modules/fs-select-contact/fs-select-contact.html.js', 'card-dist/modules/fs-select-contact/fs-select-contact.js'],
//                    dest: 'card-dist/modules/fs-select-contact/fs-select-contact.js'
//                }]
//            },
            stream: {
            	files:[{
            		src: ['card-dist/tpls/stream/stream.html.js', 'card-dist/modules/fs-qx/fs-qx.js', 'card-dist/modules/fs-attach/fs-attach-preview.js', 'card-dist/modules/fs-attach/fs-attach-file-preview.js', 'card-dist/modules/fs-map/fs-map.js', 'card-dist/modules/fs-select-city/fs-select-city.js', 
            		      'card-dist/modules/publish/publish.js', 'card-dist/modules/publish/publish-helper.js', 'card-dist/modules/fs-select-customer/fs-select-customer.js', 'card-dist/modules/fs-select-contact/fs-select-contact.js', 
            		      'card-dist/modules/fs-qx/fs-qx-helper.js', 'card-dist/modules/feed-list/feed-list-c.js', 'card-dist/modules/feed-list/feed-list-v.js', 'card-dist/modules/feed-list/feed-fns.js', 'card-dist/modules/feed-list/preview-feed-v.js', 'card-dist/modules/feed-list/feed-list-m.js', 'card-dist/modules/feed-list/fl-util.js','card-dist/modules/feed-list/feed-list-helper.js','card-dist/modules/feed-list/feed-list.js',
            		      'card-dist/modules/fs-schedule/fs-schedule.js', 'card-dist/modules/fs-schedule/fs-schedule.js', 'card-dist/modules/fs-createremind/fs-createremind.js', 'card-dist/modules/fs-announcement/fs-announcement.js', 'card-dist/modules/fs-worktodo/fs-worktodo.js', 'card-dist/modules/fs-search-select/fs-search-select.js',
            		      'card-dist/modules/fs-reply/fs-reply.js', 'card-dist/modules/card-reply/feed-reply.js', 'card-dist/modules/fs-reply/fs-reply-list.js', 'card-dist/modules/fs-lazyload/fs-lazyload.js', 'card-dist/modules/crm-contact-view/crm-contact-view.js',
            		      'card-dist/tpls/stream/stream-common.js', 'card-dist/tpls/stream/stream.js','card-dist/assets/js/app.js'],
            		dest: 'card-dist/assets/js/app.js',
            		nonull: true
            	}]
            }
//            crmtpls:{
//                options:{
//                    banner: '/**\n' +
//                        ' * aralejs组件包装\n'+
//                        ' * @Author: 纷享网页前端部\n'+
//                        ' * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
//                        ' */\n'
//                },
//                files:[{
//                    src: ['card-dist/modules/crm-attachment/crm-attachment.css'],
//                    dest: 'card-dist/modules/crm-tpls-all.css'
//                }]
//            }
        },
        "clean": {
            modules: {
                files: [{
                    expand: true,
                    cwd: 'card-dist/modules/',
                    src: ['**/*.css', '!**/*.min.css']
                },{
                    expand: true,
                    cwd: 'card-dist/modules/',
                    src: ['**/*.html', '!**/*.min.html']
                },{
                    expand: true,
                    cwd: 'card-dist/modules/',
                    src: ['**/*.js', '!**/*.min.js']
                }]
            },
            tpls: {
                files: [{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.css', '!**/*.min.css']
                },{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.html', '!**/*.min.html']
                },{
                    expand: true,
                    cwd: 'card-dist/tpls/',
                    src: ['**/*.js', '!**/*.min.js']
                }]
            },
            all:{      //清理所有dist文件
                files: [{
                    src: ['fs-dist/**','card-dist/**']
                }]
            }
        }
    });
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-cmd-handlebars');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-cmd-concat');

    //grunt.registerTask('default', ['copy','imagemin','transport','uglify','cssmin','htmlmin','concat']);
//    grunt.registerTask('default', ['handlebars']);
    grunt.registerTask('default', ['copy','transport','uglify','cssmin','htmlmin','handlebars','concat']);
    grunt.registerTask('clean-all', ['clean:all']);
};
