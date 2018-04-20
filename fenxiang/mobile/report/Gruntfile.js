module.exports = function (grunt) {

    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        concat: {
          basic_and_extras:{
          
            files: {
            
              'dist/static/css/common.css': ['static/css/*.css'],
              
              'dist/static/js/lib/common.js': [
                'static/js/lib/underscore-min.js',
                'static/js/lib/zepto.min.js',
                'static/js/lib/util.js'
               ]
            }
          }
        },        

        
        cssmin: {
            options: {
                keepSpecialComments: 0 // 移除 CSS文件中的所有注释
            },
            minify: {
                files: [{
                    expand: true,
                    cwd: 'dist/static/css',
                    src: ['*.css'],
                    dest: 'dist/static/css',
                    ext: '.css'
                }]
            }
        },
        
        uglify: {

            options: {
                mangle: false
            },
            minjs: { 
                files: [{
                    'dist/static/js/lib/common.js': 'dist/static/js/lib/common.js'
                },{
                    expand: true,
                    cwd: 'dist/static/js/',
                    src: ['*.js'],
                    dest: 'dist/static/js/',
                    ext: '.js'
                }]
            }
        },       
        
        replace: {
            dev: {
                src: ['html/*.html'],
                dest: 'dist/html/',
                replacements: [{  // 替换为开发环境的地址
                  from: '{{host}}',
                  to: '<%= pkg.devhost %>'
                }, {
                  from: '{{version}}', // 版本号
                  to: '<%= pkg.version %>'
                }]
            },
            release: {
                src: ['html/*.html'],
                dest: 'dist/html/',
                replacements: [{
                  from: '{{host}}',
                  to: '<%= pkg.releasehost %>'
                }, {
                  from: '{{version}}',
                  to: '<%= pkg.version %>'
                }]
            }         
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist/html/',
                    src: ['*.html'],
                    dest: 'dist/html/',
                    ext:'.html'                    
                }]
            }
        },        
        
        
        less: {
            development: {
                files: {
                    "src/static/css/reporthistory.css": "src/static/less/reporthistory.less",
                    "src/static/css/approvehistory.css": "src/static/less/approvehistory.less",
                    "src/static/css/reportdata.css": "src/static/less/reportdata.less"
                }
            }
        }, 
       

        watch: {
            less: {
                files: ['src/static/**/*.less'],
                tasks: ['less:development']
            }
        },
        
        copy: {
          main: {
            files: [{
                expand: true,
                cwd: 'static/css/img',
                src: ['**/*.*'],
                dest: "dist/static/css/img/"
            },{
                expand: true,
                cwd: 'static/image',
                src: ['**/*.*'],
                dest: "dist/static/image/"
            },{
                expand: true,
                cwd: 'static/js/',
                src: ['*.js'],
                dest: 'dist/static/js/'
            }]
          }
        },
        
        clean: {
            all: ['dist/*']
        }
    });
    

    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    
    
    // 定义默认任务
    grunt.registerTask('default', ['less:development', 'watch']);
    grunt.registerTask('release', ['clean', 'copy', 'less', 'cssmin', 'uglify', 'replace:release', 'htmlmin']);
};