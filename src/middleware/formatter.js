const moment = require('moment');

const formatter = {
  date(date){
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },

  minute(date){
    return moment(date).format('YYYY-MM-DD HH:mm');
  },

  hour(date){
    return moment(date).format('YYYY-MM-DD HH:mm');
  },

  day(date){
    return moment(date).format('YYYY-MM-DD');
  },

  month(date){
    return moment(date).format('YYYY-MM');
  },

  time(date, format){
    return moment(date).format(format);
  }
};

export default formatter;
