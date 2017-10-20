const InitialState = require('./earningsRecordInitialState').default;

const {
  GET_NEWCAR_EARNINGSRECORD_REQUEST,
  GET_NEWCAR_EARNINGSRECORD_SUCCESS,
  GET_NEWCAR_EARNINGSRECORD_FAILURE,

  GET_NEWCAR_EARNINGSRECORD_REGIN_REQUEST,
  GET_NEWCAR_EARNINGSRECORD_REGIN_SUCCESS,

  GET_NEW_CAR_EARNINGS_PROVINCES_REQUEST,
  GET_NEW_CAR_EARNINGS_PROVINCES_SUCCESS,

  GET_NEWCAR_EARNINGS_RESOURCE_REQUEST,
  GET_NEWCAR_EARNINGS_RESOURCE_SUCCESS,

  SET_NEWCAR_PROVINCE,
  SET_NEWCAR_CITY,
  SET_NEWCAR_COUNTRY,
  SET_NEWCAR_EARNING_RESOURCEID,

  SET_NEWCAR_EARNINGS_START_DATE,
  SET_NEWCAR_EARNINGS_END_DATE,

  SET_NEWCAR_EARNINGSRECORD_PAGE,
} = require('../../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_NEWCAR_EARNINGSRECORD_REQUEST:
    return state.set('isFetching', true);

  case GET_NEWCAR_EARNINGSRECORD_SUCCESS:
    const { list, total } = action.payload;
    return state.set('isFetching', false).set('list', list).set('total', parseInt(total, 10));
  case GET_NEWCAR_EARNINGSRECORD_FAILURE:
    return state.set('isFetching', false);

  case GET_NEWCAR_EARNINGS_RESOURCE_REQUEST:
    break;
  case GET_NEWCAR_EARNINGS_RESOURCE_SUCCESS:
    return state.set('resourceList', action.payload);

  case SET_NEWCAR_EARNINGSRECORD_PAGE:
    return state.set('page', action.payload);

  case GET_NEWCAR_EARNINGSRECORD_REGIN_REQUEST:
    break;
  case GET_NEWCAR_EARNINGSRECORD_REGIN_SUCCESS:
    return state.set('options', [...state.options]);

  case SET_NEWCAR_PROVINCE:
    return state.set('province', action.payload);
  case SET_NEWCAR_CITY:
    return state.set('city', action.payload);
  case SET_NEWCAR_COUNTRY:
    return state.set('country', action.payload).set('page', 1);
  case SET_NEWCAR_EARNING_RESOURCEID:
    return state.set('resourceId', action.payload).set('page', 1);

  case GET_NEW_CAR_EARNINGS_PROVINCES_REQUEST:
    break;
  case GET_NEW_CAR_EARNINGS_PROVINCES_SUCCESS:
    return state.set('options', action.payload);

  case SET_NEWCAR_EARNINGS_START_DATE:
    return state.set('startDate', action.payload);
  case SET_NEWCAR_EARNINGS_END_DATE:
    return state.set('endDate', action.payload).set('page', 1);
  }

  return state;
}
