/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-08-21 16:38:54
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-13 17:05:28
 */
export default {
    //不能是纯英文+数字（必须包含中文）
    chineseCharacter(str) {
        var reg = /[\u4E00-\u9FA5]/g;
        // console.info('test', str, ':', reg.test(str))
        return reg.test(str)
    },
    //非特殊字符和空格（只能是中英数）
    specialCharacter(str) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5·]*$/;

        return reg.test(str)
    },
    //英文或数字
    letterOrNumber(str) {
        var reg = /^[A-Za-z0-9]*$/;

        return reg.test(str)
    },
    // 中文姓名
    checkChineseName(name) {
          // let regName = /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/ //包含特殊字符
        let regName = /^([\u4e00-\u9fa5]|([\u4e00-\u9fa5]+([\u4e00-\u9fa5]|·)*[\u4e00-\u9fa5])+$)/;
      
        return regName.test(name)
    },
    // 银行卡
    luhnCheck(bankno) {
        bankno = bankno || ''
        if (!bankno) {
            return false;
        }
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
                else arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;

        if (lastNum == luhn) {
            return true;
        } else {
            return false;
        }
    },
    // 手机号
    isPhoneAvailable(phone) {
        // var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/; //2020.3.4 陆萌：这个199的号段限制需要去掉，如果还有别的号段限制也需要去掉，只要是1开头的11位数字都可以
        var myreg = /^[1][0-9]{10}$/;
        if (!myreg.test(phone)) {
            return false;
        } else {
            return true;
        }
    },
    //身份证号
    isIdCardNo(card) {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(card)
    },
   
}