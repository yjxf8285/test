/**
 * 自定义seajs打包工具
 * User: qisx
 * Date: 13-6-8
 * Time: 下午2:08
 */

var fs=require("fs"),
    _=require('underscore'),
    path=require("path");

function getAllFiles(root,deepLevel){
    var result = [],
        files = fs.readdirSync(root);
    var level=1;
    files.forEach(function(file) {
        var pathname = root+ "/" + file,
            stat = fs.lstatSync(pathname);
        if (stat === undefined) return;

        // 不是文件夹就是文件
        if (!stat.isDirectory()) {
            result.push(pathname);
            // 递归自身
        } else {
            if(deepLevel){
                if(deepLevel>level){
                    result = result.concat(getAllFiles(pathname));
                    level++;
                }
            }else{
                result = result.concat(getAllFiles(pathname));
                level++;
            }
        }
    });
    return result;
}

var core={
    "build":function(config){
        config= _.extend({
            "sourcePath":"../../sea-modules",
            "buildPath":"../../build"
        },config||{});
        var sourcePath=config.sourcePath,
            buildPath=config.buildPath;
        sourcePath=path.normalize(__dirname+'/'+sourcePath);
        buildPath=path.normalize(__dirname+'/'+buildPath);

        //获取sourcePath下对应额组件库
        var cptPackages = fs.readdirSync(sourcePath);

        cptPackages.forEach(function(cptPackage){
            var pathname = sourcePath+ "/" + cptPackage;
            var cpts=fs.readdirSync(pathname);  //获取组件包
            //创建目录
            if(!fs.existsSync(path.resolve(buildPath+'/'+cptPackage))){
                fs.mkdirSync(path.resolve(buildPath+'/'+cptPackage));
            }
            var cptBuildPath=path.resolve(buildPath+'/'+cptPackage+'/'+cptPackage+'.js');
            if(!fs.existsSync(cptBuildPath)){
                fs.writeFileSync(cptBuildPath, '', "utf8");
            }
            cpts.forEach(function(cpt){
                var pathname2 = path.resolve(pathname+ "/" + cpt),
                    stat = fs.lstatSync(pathname2);
                var files,
                    buildFiles;


                if (stat.isDirectory()) {
                    files=getAllFiles(pathname+'/'+cpt);
                    //筛选出和组件包同名的js文件合并成单一build文件
                    buildFiles=_.filter(files,function(filePath){
                        return path.basename(filePath,'.js')==cpt;
                    });

                    buildFiles.forEach(function(filePath){
                        var readyContent=fs.readFileSync(cptBuildPath,"utf8");
                        //append后重新覆盖
                        fs.writeFileSync(cptBuildPath, readyContent+fs.readFileSync(filePath,"utf8"), "utf8");
                    });
                    //console.log(buildFiles);
                    return;
                }
            });
        });
    }
};
module.exports=exports=core;