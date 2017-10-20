const InitialState = require('./intentionInitialState').default;

const {
  SET_INTENTION_KEY,
  SET_INTENTION_PROVINCE,
  SET_INTENTION_CITY,
  SET_INTENTION_COUNTY,
  SET_INTENTION_COMPANY_NAME,
  SET_INTENTION_START_DATE,
  SET_INTENTION_END_DATE,
  SET_INTENTION_PRODUCT_NAME,
  SET_INTENTION_FINANCING_TYPE,

  GET_INTENTIONS_REQUEST,
  GET_INTENTIONS_SUCCESS,
  GET_INTENTIONS_FAILURE,

  GET_INTENTIONS_PROVINCES_REQUEST,
  GET_INTENTIONS_PROVINCES_SUCCESS,

  GET_INTENTIONS_REGIN_REQUEST,
  GET_INTENTIONS_REGIN_SUCCESS,

  GET_INTENTIONS_PRODUCT_LIST_REQUEST,
  GET_INTENTIONS_PRODUCT_LIST_SUCCESS,

  GET_INTENTIONS_COMPANY_LIST_REQUEST,
  GET_INTENTIONS_COMPANY_LIST_SUCCESS,

  SET_INTENTIONS_PAGE,
} = require('../../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_INTENTIONS_REQUEST:
    return state.set('isFetching', true);
  case GET_INTENTIONS_SUCCESS:
    const { list, total } = action.payload;
    return state.set('isFetching', false).set('list', list).set('total', parseInt(total, 10));
  case GET_INTENTIONS_FAILURE:
    return state.set('isFetching', false);

  case SET_INTENTION_KEY:
    return state.set('searchKey', action.payload).set('page', 1);
  case SET_INTENTION_PROVINCE:
    return state.set('province', action.payload);
  case SET_INTENTION_CITY:
    return state.set('city', action.payload);
  case SET_INTENTION_COUNTY:
    return state.set('country', action.payload).set('page', 1);
  case SET_INTENTION_COMPANY_NAME:
    return state.set('companyId', action.payload).set('page', 1);
  case SET_INTENTION_START_DATE:
    return state.set('startDate', action.payload);
  case SET_INTENTION_END_DATE:
    return state.set('endDate', action.payload).set('page', 1);
  case SET_INTENTION_PRODUCT_NAME:
    return state.set('productId', action.payload).set('page', 1);
  case SET_INTENTION_FINANCING_TYPE:
    return state.set('financingType', action.payload).set('page', 1);

  case GET_INTENTIONS_PROVINCES_REQUEST:
    break;
  case  GET_INTENTIONS_PROVINCES_SUCCESS:
    return state.set('options', action.payload);

  case GET_INTENTIONS_PRODUCT_LIST_REQUEST:
    break;
  case GET_INTENTIONS_PRODUCT_LIST_SUCCESS:
    return state.set('productList', action.payload);

  case GET_INTENTIONS_REGIN_REQUEST:
    break;
  case GET_INTENTIONS_REGIN_SUCCESS:
    return state.set('options', [...state.options]);

  case GET_INTENTIONS_COMPANY_LIST_REQUEST:
    break;
  case GET_INTENTIONS_COMPANY_LIST_SUCCESS:
    return state.set('companyList', action.payload);

  case SET_INTENTIONS_PAGE:
    return state.set('page', action.payload);
  }

  return state;
}
