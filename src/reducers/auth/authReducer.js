/**
 * # authReducer.js
 *
 * The reducer for all the actions from the various log states
 */
'use strict';

const InitialState = require('./authInitialState').default;

/**
 * ## Auth actions
 */
const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  VERIFICATION_CODE_REQUEST,
  VERIFICATION_CODE_SUCCESS,
  VERIFICATION_CODE_FAILURE,

  GET_USER_PERMISSIONS_SUCCESS,
  GET_USER_PERMISSIONS_FAILURE,

  SET_USER_PERMISSIONS,

  GET_CUSTOMER_REQUEST,
  GET_CUSTOMER_SUCCESS,
  GET_CUSTOMER_FAILURE,

  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAILURE,

  SET_USER,
  SET_LOGIN,
  // SET_IS_FIRST_LOGIN,

} = require('../constants').default;

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case LOGIN_REQUEST:
  case LOGOUT_REQUEST:
  case VERIFICATION_CODE_REQUEST:
  case GET_CUSTOMER_REQUEST:
  case UPDATE_CUSTOMER_REQUEST:
    return state.set('isFetching', true);

  case VERIFICATION_CODE_SUCCESS:
    return state
        .set('isFetching', false)
        .set('error', null);

  case LOGIN_SUCCESS:
    return state
        .set('isFetching', false)
        .set('isLogin', true)
        .set('error', null);

  case LOGOUT_SUCCESS:
    return state
        .set('isFetching', false)
        .set('isLogin', false)
        .set('currentUser', {})
        .set('error', null);

  case GET_CUSTOMER_SUCCESS:
    return state
        .set('isFetching', false)
        .set('currentUser', action.payload)
        .set('error', null);

  case UPDATE_CUSTOMER_SUCCESS:
    return state
        .set('isFetching', false)
        .set('error', null);


  case LOGIN_FAILURE:
    return state
        .set('isFetching', false)
        .set('isLogin', false);

  case LOGOUT_FAILURE:
  case VERIFICATION_CODE_FAILURE:
  case GET_CUSTOMER_FAILURE:
  case UPDATE_CUSTOMER_FAILURE:
    return state
        .set('isFetching', false)
        .set('error', action.payload);

  case SET_USER:
    return state.set('currentUser', action.payload);
  case SET_LOGIN:
    return state.set('isLogin', action.payload.isLogin);


  case GET_USER_PERMISSIONS_SUCCESS:
    return state.set('userPermissions', action.payload);
  case GET_USER_PERMISSIONS_FAILURE:
    return state.set('error', action.payload);

  case SET_USER_PERMISSIONS:
      // TODO 从Route中能获取到state时，取消localStorage方式的存储
    localStorage.setItem('user_permission', window.btoa(window.encodeURIComponent(JSON.stringify(action.payload))));
    return state.set('userPermissions', action.payload);
  }

  return state;
}
