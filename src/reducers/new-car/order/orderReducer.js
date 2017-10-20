const InitialState = require('./orderInitialState').default;

const {
  SET_ORDER_KEY,
  SET_ORDER_PRODUCT_NAME,
  SET_ORDER_PROVINCE,
  SET_ORDER_CITY,
  SET_ORDER_COUNTY,
  SET_ORDER_COMPANY_NAME,
  SET_ORDER_START_DATE,
  SET_ORDER_END_DATE,
  SET_ORDER_TYPE,
  SET_ORDER_STATUS,

  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,

  GET_ORDERS_PROVINCES_REQUEST,
  GET_ORDERS_PROVINCES_SUCCESS,

  GET_ORDERS_REGIN_REQUEST,
  GET_ORDERS_REGIN_SUCCESS,

  GET_ORDERS_PRODUCT_LIST_REQUEST,
  GET_ORDERS_PRODUCT_LIST_SUCCESS,

  GET_ORDER_COMPANY_LIST_REQUEST,
  GET_ORDER_COMPANY_LIST_SUCCESS,

  SET_ORDERS_PAGE,
} = require('../../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_ORDERS_REQUEST:
    return state.set('isFetching', true);
  case GET_ORDERS_SUCCESS:
    const { list, total } = action.payload;
    return state.set('isFetching', false).set('list', list).set('total', parseInt(total, 10));
  case GET_ORDERS_FAILURE:
    return state.set('isFetching', false);

  case SET_ORDER_KEY:
    return state.set('searchKey', action.payload).set('page', 1);
  case SET_ORDER_PROVINCE:
    return state.set('province', action.payload);
  case SET_ORDER_CITY:
    return state.set('city', action.payload);
  case SET_ORDER_COUNTY:
    return state.set('country', action.payload).set('page', 1);
  case SET_ORDER_COMPANY_NAME:
    return state.set('companyId', action.payload).set('page', 1);
  case SET_ORDER_START_DATE:
    return state.set('startDate', action.payload);
  case SET_ORDER_END_DATE:
    return state.set('endDate', action.payload).set('page', 1);
  case SET_ORDER_PRODUCT_NAME:
    return state.set('productId', action.payload).set('page', 1);
  case SET_ORDER_TYPE:
    return state.set('type', action.payload).set('page', 1);
  case SET_ORDER_STATUS:
    return state.set('status', action.payload).set('page', 1);

  case GET_ORDERS_PROVINCES_REQUEST:
    break;
  case GET_ORDERS_PROVINCES_SUCCESS:
    return state.set('options', action.payload);

  case GET_ORDERS_REGIN_REQUEST:
    break;
  case GET_ORDERS_REGIN_SUCCESS:
    return state.set('options', [...state.options]);

  case GET_ORDERS_PRODUCT_LIST_REQUEST:
    break;
  case GET_ORDERS_PRODUCT_LIST_SUCCESS:
    return state.set('productList', action.payload);

  case GET_ORDER_COMPANY_LIST_REQUEST:
    break;
  case GET_ORDER_COMPANY_LIST_SUCCESS:
    return state.set('companyList', action.payload);

  case SET_ORDERS_PAGE:
    return state.set('page', action.payload);
  }

  return state;
}
