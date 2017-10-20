/**
 * authInitialState
 */
const { Record } = require('immutable');

const InitialState = Record({
  isFetching: false,
  isLogin: false,
  reload: false,
  error: null,
  currentUser: {},
  userPermissions: [],
});

export default InitialState;

