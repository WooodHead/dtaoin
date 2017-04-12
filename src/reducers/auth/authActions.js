/**
 * authAction
 */
const {
  VERIFICATION_CODE_REQUEST,
  VERIFICATION_CODE_SUCCESS,
  VERIFICATION_CODE_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  // LOGOUT_REQUEST,
  // LOGOUT_SUCCESS,
  // LOGOUT_FAILURE,


  GET_USER_PERMISSIONS_SUCCESS,
  GET_USER_PERMISSIONS_FAILURE,

  SET_USER_PERMISSIONS,

  // GET_CUSTOMER_REQUEST,
  // GET_CUSTOMER_SUCCESS,
  // GET_CUSTOMER_FAILURE,
  //
  // UPDATE_CUSTOMER_REQUEST,
  // UPDATE_CUSTOMER_SUCCESS,
  // UPDATE_CUSTOMER_FAILURE,
  //
  // SET_USER,
  // SET_LOGIN,
  // SET_IS_FIRST_LOGIN,

} = require('../../config/constants').default;

import server from '../../middleware/server';
import api from '../../middleware/api';

/**
 * ## 获取验证码
 */
function getVerificationCodeRequest() {
  return {
    type: VERIFICATION_CODE_REQUEST,
  };
}

function getVerificationCodeSuccess(json) {
  return {
    type: VERIFICATION_CODE_SUCCESS,
    payload: json,
  };
}

function getVerificationCodeFailure(error) {
  return {
    type: VERIFICATION_CODE_FAILURE,
    payload: error,
  };
}

export function getVerificationCode(phone) {
  return dispatch => {
    dispatch(getVerificationCodeRequest());

    server.post(api.system.getVerifyCode(), {phone: phone})

      .then(data => {
        dispatch(getVerificationCodeSuccess(data.res));
      })

      .catch((error) => {
        dispatch(getVerificationCodeFailure(error));
      });
  };
}


function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}

function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
}

function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
}

/**
 * ## 登录
 * @param {string} phone
 * @param {string} code
 * @param {string} codeId
 */
export function login(phone, code, codeId) {
  return dispatch => {
    dispatch(loginRequest());

    server.post(api.system.login(), {
      phone: phone,
      code: code,
      code_id: codeId,
    })
      .then(function (data) {
        if (data.code === 0) {
          let loginInfo = data.res.info;

          dispatch(loginSuccess(loginInfo));
        } else {
          dispatch(loginFailure(data.msg));
        }
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
}

/**
 * 获取当前登录用户的全部权限
 */

function getUserPermissionsSuccess(permissions) {
  return {
    type: GET_USER_PERMISSIONS_SUCCESS,
    payload: permissions,
  };
}

function getUserPermissionsFailure(error) {
  return {
    type: GET_USER_PERMISSIONS_FAILURE,
    payload: error,
  };
}

export function getUserPermissions() {
  return dispatch => {
    server.get(api.user.getAllPermission())
      .then(data => {
        if (data.code === 0) {
          dispatch(getUserPermissionsSuccess(data.res.list));
        } else {
          dispatch(getUserPermissionsFailure(data.msg));
        }
      })
      .catch(error => {
        dispatch(getUserPermissionsFailure(error));
      });
  };
}

function setUserPermission(permission) {
  return {
    type: SET_USER_PERMISSIONS,
    payload: permission,
  };
}

export function setUserPermissions(permissions) {
  return dispatch => {
    dispatch(setUserPermission(permissions));
  };
}
