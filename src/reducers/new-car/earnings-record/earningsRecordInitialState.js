const { Record } = require('immutable');
import DateFormatter from '../../../utils/DateFormatter';

const InitialState = Record({
  isFetching: false,
  page: 1,
  list: [],
  total: 0,
  error: null,

  startDate: DateFormatter.day(DateFormatter.getLatestMonthStart()),
  endDate: DateFormatter.day(new Date()),
  province: '',
  city: '',
  country: '',
  options: [],
  resourceList: [],
  resourceId: '',
});

export default InitialState;

