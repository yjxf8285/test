/**
 * Crm入口逻辑
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        store=tpl.store,
        list=tpl.list;
    var util = require('util'),
        Dialog=require('dialog');

    util.tplRouterReg('#customers/home');//客户列表
    util.tplRouterReg('#customers/home/=/:param-:value');//客户左侧菜单
    util.tplRouterReg('#customers/showcustomer/=/:param-:value');//客户明细
    util.tplRouterReg('#contacts/contact');//联系人列表
    util.tplRouterReg('#contacts/sharetome');//共享的联系人
    util.tplRouterReg('#contacts/contact/=/:tagtype-:value');//联系人左侧菜单
    util.tplRouterReg('#contacts/showcontact/=/:param-:value');//联系人明细 ?由/=/代替
    util.tplRouterReg('#opportunities/salesopportunity');
    util.tplRouterReg('#contracts/contract');//合同列表
    util.tplRouterReg('#salesperformances/salesperformance');
    util.tplRouterReg('#salestargets/salestarget');
    util.tplRouterReg('#salestargets/salestarget/=/:param-:value');//销售预测
    util.tplRouterReg('#crmsettings/leaderssetting');//设置同事上下级
    util.tplRouterReg('#crmsettings/allcustomers');//设置-全部客户
    util.tplRouterReg('#crmsettings/allcontacts');//设置-全部联系人
    util.tplRouterReg('#crmsettings/unallocatedcustomers');//设置-未分配客户
    util.tplRouterReg('#crmsettings/commoncustomers');//设置-已归属客户
    util.tplRouterReg('#crmsettings/businesstags');//设置标签
    util.tplRouterReg('#crmsettings/businesstags/=/:tagtype-:value');
    util.tplRouterReg('#products/product');//产品列表
    util.tplRouterReg('#products/product/=/:param-:value');//产品列表
    util.tplRouterReg('#products/showproduct/=/:param-:value');//产品明细 ?由/=/代替
    util.tplRouterReg('#competitors/competitor');//对手列表
    util.tplRouterReg('#competitors/competitor/=/:param-:value');//对手列表
    util.tplRouterReg('#competitors/showcompetitor/=/:param-:value');
    util.tplRouterReg('#salesclues/salesclue');//线索列表
    util.tplRouterReg('#salesclues/showsalesclue/=/:param-:value');
    util.tplRouterReg('#salesclues/salesclue/=/:tagtype-:value');//线索左侧菜单
    util.tplRouterReg('#marketings/marketing');//市场列表
    util.tplRouterReg('#marketings/showmarketing/=/:param-:value');//市场明细 ?由/=/代替
    util.tplRouterReg('#marketings/marketing/=/:tagtype-:value');//市场左侧菜单
    util.tplRouterReg('#contracts/contract');//合同列表
    util.tplRouterReg('#contracts/showcontract/=/:param-:value');//合同明细 ?由/=/代替
    util.tplRouterReg('#contracts/contract/=/:tagtype-:value');//合同左侧菜单
    util.tplRouterReg('#opportunities/salesopportunity');//机会列表
    util.tplRouterReg('#opportunities/showopportunity/=/:param-:value');//机会明细 ?由/=/代替
    util.tplRouterReg('#opportunities/salesopportunity/=/:tagtype-:value');//机会左侧菜单
    
    //for test
    util.tplRouterReg('#ligd');
    util.tplRouterReg('#zhangdl');

    exports.init = function () {
        var winEl=$(window),
            bodyEl=$('body'),
            tplNavListEl=$('.tpl-nav-list'),
            tplNavEl = $('a.tpl-nav-l',tplNavListEl);
        var appStore=FS.getAppStore('appStore'); //原始页面输出数据
        //页面打开或刷新时导航到当前子模板
        var navRouter = tpl.navRouter,
            locationHref=location.href,
            tplPath,    //页面默认请求地址
            routerPath; //待注册的路由
        //tplPath = root.location.hash.slice(1);
        var reged=false,
            queryParam,
            queryKeyArr;
        //显示公司名
        $('.company-name').html(appStore?appStore.companyName:"");
        //获取当前tpl地址
        if(locationHref.indexOf('#')!=-1){
            tplPath=locationHref.slice(locationHref.indexOf('#') + 1);
        }else{
            tplPath="";
        }
        //更多下拉
        tplNavListEl.on('click','.more-nav-link',function(evt){
            var listEl=$('.more-nav-list',this);
            listEl.is(':visible')?listEl.hide():listEl.show();
            evt.stopPropagation();
        }).on('click','.more-nav-item',function(evt){
            var currentLinkEl=$(this),
                moreNavLinkEl=$('.more-nav-link',tplNavListEl),
                prevNavLinkEl=moreNavLinkEl.prev(),
                moreNavListEl=$('.more-nav-list',moreNavLinkEl),
                lastMoreNavLinkEl=$('.more-nav-item',moreNavListEl).last();
            if($('a',lastMoreNavLinkEl).attr('id')!='tip-setting'){     //第一次点击，把设置追加到更多连接里
                $('<li class="more-nav-item"></li>').appendTo(moreNavListEl);
                $('a',prevNavLinkEl).appendTo($('.more-nav-item',moreNavListEl).last());
            }
            //替换链接
            prevNavLinkEl.empty();
            $('a',currentLinkEl).clone().appendTo(prevNavLinkEl);
            //设置选中样式
            $('.state-selected',moreNavListEl).removeClass('state-selected');
            $('a',currentLinkEl).addClass('state-selected');
        });
        util.regGlobalClick($('.more-nav-list',tplNavListEl));
        //高亮对应的头部导航
        util.regTplNav(tplNavEl,'tnavon state-active');
        if (tplPath.length > 0) {
            tplNavEl.each(function(){
                if($(this).attr('href').slice(1)==tplPath){
                    reged=true;
                    return false;
                }
            });
            routerPath=tplPath;
            if(!reged){
                //将实际地址替换成router路由配置
                if(routerPath.indexOf('/=/')!=-1){
                    queryParam=util.getTplQueryParams(routerPath);
                    queryKeyArr= _.keys(queryParam);
                    queryKeyArr=_.map(queryKeyArr,function(key){
                        return ':'+key+'-'+':value';
                    });
                    routerPath=routerPath.slice(0,routerPath.indexOf('/=/'))+'/=/'+queryKeyArr.join('/');
                }
                util.tplRouterReg('#'+routerPath);
            }
            navRouter.navigate('', {
                trigger: true
            });
            navRouter.navigate(tplPath, {
                trigger: true
            });
        }else{  //hash为空定位到我的客户页
            navRouter.navigate('customers/home', {
                trigger: true
            });
        }

        //切换tpl后scroll到顶部
        tpl.event.on('switched', function (tplName, tplEl) {
            winEl.scrollTop(0); //点击返回到顶部
        });
        //placeholder
        util.placeholder('input,textarea');
        bodyEl.on('click','.crm-prevent-default',function(evt){
            evt.preventDefault();
        }).on('click','.crm-switch-tpl-l',function(evt){
                Dialog.hideAll();
            }).on('keydown','textarea',function(evt){   //textarea下禁用esc键
                if(evt.keyCode==27){
                    evt.preventDefault();
                }
            });
        //本地生成enterpriseConfig
        util.fetchEnterpriseConfig();
    };
});