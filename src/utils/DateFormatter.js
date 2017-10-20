import moment from 'moment';

const now = new Date();

export default class DateFormatter {
  static pattern = {
    date: 'YYYY-MM-DD HH:mm:ss',
    minute: 'YYYY-MM-DD HH:mm',
    hour: 'YYYY-MM-DD HH:mm',
    day: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    HHmm: 'HH:mm',
  };

  /**
   * 日期格式化
   * @param date
   * @return {string}
   */
  static date(date) {
    return moment(date).format(DateFormatter.pattern.date);
  }

  static minute(date) {
    return moment(date).format(DateFormatter.pattern.minute);
  }

  static hour(date) {
    return moment(date).format(DateFormatter.pattern.hour);
  }

  static day(date) {
    return moment(date).format(DateFormatter.pattern.day);
  }

  static month(date) {
    return moment(date).format(DateFormatter.pattern.month);
  }

  static time(date, format) {
    return moment(date).format(format);
  }

  static getLatestMonthStart() {
    return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0);
  }

  /**
   * 获取moment类型的数据
   */

  static getMomentDate(date = new Date()) {
    // 处理无效日期，否则在初始化DatePicker时报错
    if (typeof date === 'string' && date.indexOf('0000') > -1) {
      date = new Date();
    }
    return moment(date, DateFormatter.pattern.date);
  }

  // 获取近一个月的开始时间
  static getMomentDateAMonthStart(date = new Date(now.getFullYear(), now.getMonth() -
    1, now.getDate(), 0, 0, 0)) {
    return moment(date, DateFormatter.pattern.date);
  }

  // 获取近一个月的当前(结束)时间
  static getMomentDateAMonthEnd(date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)) {
    return moment(date, DateFormatter.pattern.date);
  }

  static getMomentMonth(month = new Date()) {
    return moment(month, DateFormatter.pattern.month);
  }

  static getMoumentDay(day = new Date()) {
    return moment(day, DateFormatter.pattern.day);
  }

  static getMomentHHmm(HHmm = new Date()) {
    return moment(HHmm, DateFormatter.pattern.HHmm);
  }

  /**
   * 从当前时间计算，前一个月
   * @param date 非自然月
   * @return {Moment}
   */
  static getMomentPreviousMonth(date = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() - 30,
  )) {
    return moment(date, DateFormatter.pattern.day);
  }

  /**
   *  从当前时间计算，后一个月
   * @param date 非自然月
   * @return {Moment}
   */
  static getMomentNextMonth(date = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + 30,
  )) {
    return moment(date, DateFormatter.pattern.day);
  }

  /**
   * 计算从某天开始，到另外一天的天数
   * @param Date date 格式为'yyyy-MM-dd'
   * @return {Number}
   */
  static calculateDays(date) {
    const forceExpireTimeStamp = Date.parse(new Date(date));
    const todayTimeStamp = new Date().getTime();
    const dueDateStamp = forceExpireTimeStamp - todayTimeStamp;
    return parseInt(dueDateStamp / 1000 / 60 / 60 / 24, 10);
  }

  /**
   * 格式化输出时间    去除yyyy-mm-dd hh-mm-ss 中和 ss
   * @param value
   * @returns {string}
   */
  static getFormatTime(value) {
    if (!value) {
      return '';
    }
    const time = value.split(':');
    // let removeYearTime = time.splice(1, time.length - 1).join('-');
    // time = removeYearTime.split(':');
    return time.splice(0, time.length - 1).join(':');
  }

  /**
   *将字符串日期格式格式化未Date类型，主要兼容safari
   * @param dateStr
   * @returns {Date}
   */
  static getDate(dateStr) {
    if (!dateStr) {
      return '';
    }
    const dateArr = dateStr.split(/[- : \/]/);
    if (!!dateArr[3]) {
      return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
    }
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
  }
}
