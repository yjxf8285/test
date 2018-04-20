/*
*main
*/
(function(){
    /*
    var href=location.href;
    var info=href.split('?info=')[1];

    info=decodeURI(info);
    info=JSON.parse(info);

    console.log(info);
    */
    var chart;
    var $container=$('#container');
    window.renderChart=function(info){
        $container.empty();
        switch(info.type){
            case "a":
            chart=new app.Typea($container,info);
            break;
            case "b":
            chart=new app.Typeb($container,info);
            break;
            case "c":
            chart=new app.Typec($container,info);
            break;
            case "d":
            chart=new app.Typed($container,info);
            break;
        }
    };
})();

