/*
 * @Author: wuyulong
 * @Date: 2020-02-12 13:11:59
 * @LastEditTime : 2020-02-13 14:43:54
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/login.js
 */
import "@/style/login.scss";
import Vue from 'vue/dist/vue.esm.js'
import Element from 'element-ui'
import '../element-variables.scss'
import '../plugins/element.js'

import icon_brand from "@/assets/icon_brand@2x.png";
import DIANPAY from "@/assets/icon_DIANPAY_pre@2x.png";
import QUPAY_D from "@/assets/icon_QUPAY-D_pre@2x.png";
import QUPAY_T from "@/assets/icon_QUPAY-T_pre@2x.png";
import KSHUA from "@/assets/icon_KSHUA_pre@2x.png";

Vue.use(Element)



new Vue({
    el:"#app",
    data:{
        dialogVisible:false,
        form:{},
        showLogin:true,
        icon_brand:icon_brand,
        posArray:[{
            name:"点付",
            code:"DIANPAY",
            src:DIANPAY,
            checked:true
        },{
            name:"趣付-电签版",
            code:"QUPAY-D",
            src:QUPAY_D,
            checked:false
        },{
            name:"趣付-传统POS",
            code:"QUPAY-T",
            src:QUPAY_T,
            checked:false
        },{
            name:"开刷",
            code:"KSHUA",
            src:KSHUA,
            checked:false
        }]
    },
    methods: {
        handleClose(){
            this.dialogVisible = false
        },
        choosePos(i){
            this.posArray.map((el)=>{
                this.$set(el,"checked",false)
            });
            i.checked = true;
        },
        chooseBrand(){
            this.showLogin = false;
        },
        gotoIndex(){
            let brand = this.posArray.filter((el)=>{
                return el.checked;
            });
            window.location.href = "./index.html?brandCode="+brand[0]["code"]
        }
    }
})

// new Vue({
//     data:{
//         dialogVisible:true
//     }
// }).$mount('#app')