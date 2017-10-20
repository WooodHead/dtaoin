const { Record } = require('immutable');

const InitialState = Record({
  isFetching: false,
  page: 1,
  list: [],
  total: 0,
  error: null,
});

export default InitialState;

