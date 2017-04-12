import moment from 'moment';

let now = new Date();

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
    return moment(date, DateFormatter.pattern.date);
  }

  // 获取近一个月的开始时间
  static getMomentDateAMonthStart(date = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0)) {
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

}
