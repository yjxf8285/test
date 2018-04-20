const util = {
  interval(fn, time = 60000){
    return setInterval(() => {
      fn();
    }, time)
  },
  uuid () {
    let i, random;
    let uuid = '';
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16);
    }
    return uuid;
  },
  getChartColors () {
    return ['#5bd4c7', '#62a9ed', '#8bc34a', '#fabb3d', '#c090ec', '#67c2ef', '#fcdd5f', '#fd7979', '#7381ce'];
  },
  /**
   * 保留n位小数
   * @param srcNumber
   * @param n
   * @param isPad
   * @returns {*}
   */
  toDecimal(srcNumber, n = 3, isPad) {
    let dstNumber = parseFloat(srcNumber);
    if (isNaN(dstNumber)) {
      return srcNumber;
    }
    if (dstNumber >= 0) {
      dstNumber = parseInt(dstNumber * Math.pow(10, n) + 0.5) / Math.pow(10, n);
    } else {
      let tmpDstNumber = -dstNumber;
      dstNumber = parseInt(tmpDstNumber * Math.pow(10, n) + 0.5) / Math.pow(10, n);
    }
    let dstStrNumber = dstNumber.toString();
    let dotIndex = dstStrNumber.indexOf('.');
    //是否补0
    if (isPad) {
      if (dotIndex < 0) {
        dotIndex = dstStrNumber.length;
        dstStrNumber += '.';
      }
      while (dstStrNumber.length <= dotIndex + n) {
        dstStrNumber += '0';
      }
    }

    return dstStrNumber;
  },
  /**
   * 补零
   * @param num
   * @returns {string}
   */
  pad (num) {
    return new Array(2 - ('' + num).length + 1).join(0) + num;
  },
  /**
   * 格式化日期
   * @param val 时间戳（例如：1477363297）
   * @param type 1：完整显示，2：不显示年,3:不显示分秒
   */
  formatDate (val, type = 1) {
    let result = '';
    let timestamp = val;
    let d = new Date();
    //d.setTime(timestamp * 1000);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let housrs = this.pad(d.getHours());
    let minutes = this.pad(d.getMinutes());
    let seconds = this.pad(d.getSeconds());
    switch (type) {
      case 1:
        result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes + ':' + seconds;
        break;
      case 2:
        result = month + '-' + day + ' ' + housrs + ':' + minutes;
        break;
      case 3:
        result = year + '-' + month + '-' + day;
        break;
      case 4:
        result = minutes + ':' + seconds;
        break;
      case 5:
        result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes;
        break;
      default:
        result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes + ':' + seconds;
        break
    }
    return result;
  },
  /**
   * 计算传入日期N天前的日期
   * @param day 传入的日期(如：2017-8-28)，字符串类型
   * @param num 想要获得向前推多少天的值，数字类型
   * 注：两个值为都是为必填值
   */
  longLongAgo (day,num) {
    let date = new Date(day)
    let yearNum
    let monthNum
    let dayNum
    let reDate
    date.setDate(date.getDate() - parseInt(num))
    yearNum = date.getFullYear()
    monthNum = date.getMonth() + 1
    dayNum = date.getDate()
    reDate = yearNum+'-'+monthNum+'-'+dayNum
    return reDate
  },
  /**
   * 计算传入两日期之间相隔的天数
   * @param start 计算日期的开始日期(如：2017-7-28)
   * @param end 计算日期的结束日期(如：2017-8-28)
   * 注：1.两个值为都是为必填值且为字符串类型。
   * 2.返回数据为对象类型，其中num为两日期之间相隔日期(正整数)；type为布尔值(true为start日期在end之后，反之亦然)
   */
  calculateRegion (start,end) {
    let startDate = new Date(Date.parse((start).replace(/-/g,"/"))).getTime()
    let endDate = new Date(Date.parse((end).replace(/-/g,"/"))).getTime()
    let region = (startDate - endDate)/(1000*60*60*24)
    let re
    if (region==Math.abs(region)) {
      re = {
        num: Math.abs(region),
        type: true
      }
    } else {
      re = {
        num: Math.abs(region),
        type: false
      }
    }
    return re
  }
};
export default util;
