/**
 * authInitialState
 */
const {Record} = require('immutable');

let InitialState = Record({
  isFetching: false,
  isLogin: false,
  error: null,
  currentUser: {},
  userPermissions: [],
});

export default InitialState;

