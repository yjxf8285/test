#!/usr/bin/env node
var core=require("../src/core"),
    path=require("path");
var args=process.argv.slice(0),
    command=args[0];

//args[0]=path.resolve(args[0]);
//core[command].apply(core,args);
core["build"].apply(core);
