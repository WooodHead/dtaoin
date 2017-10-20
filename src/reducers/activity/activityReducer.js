/**
 * activity reducer
 */
const InitialState = require('./activityInitialState').default;

const {
  GET_ACTIVITIES_REQUEST,
  GET_ACTIVITIES_SUCCESS,
  GET_ACTIVITIES_FAILURE,

  ADD_ACTIVITY_REQUEST,
  ADD_ACTIVITY_SUCCESS,
  ADD_ACTIVITY_FAILURE,

  EDIT_ACTIVITY_REQUEST,
  EDIT_ACTIVITY_SUCCESS,
  EDIT_ACTIVITY_FAILURE,

  SET_ACTIVITY_PAGE,
} = require('../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_ACTIVITIES_REQUEST:
    return state.set('isFetching', true);
  case ADD_ACTIVITY_REQUEST:
    break;
  case EDIT_ACTIVITY_REQUEST:
    return state.set('isFetching', true);

  case GET_ACTIVITIES_SUCCESS:
    const { list, total } = action.payload;
    return state.set('isFetching', false).set('list', list).set('total', parseInt(total));

  case ADD_ACTIVITY_SUCCESS:
    return state.set('isFetching', false);

  case EDIT_ACTIVITY_SUCCESS:
    return state.set('isFetching', false);

  case GET_ACTIVITIES_FAILURE:
    break;
  case ADD_ACTIVITY_FAILURE:
    break;
  case EDIT_ACTIVITY_FAILURE:
    return state.set('isFetching', false).set('error', action.payload);

  case SET_ACTIVITY_PAGE:
    return state.set('page', action.payload);
  }

  return state;
}
