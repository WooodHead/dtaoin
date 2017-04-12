import keyMirror from 'key-mirror';

export default keyMirror({
  SET_PLATFORM: null,
  SET_VERSION: null,
  SET_APP_VERSION: null,

  SET_USER: null,
  SET_LOGIN: null,
  SET_IS_FIRST_LOGIN: null,

  SET_STATE: null,
  GET_STATE: null,
  SET_STORE: null,

  // 获取验证码
  GET_VERIFICATION_CODE: null,
  VERIFICATION_CODE_REQUEST: null,
  VERIFICATION_CODE_SUCCESS: null,
  VERIFICATION_CODE_FAILURE: null,

  // 登录
  LOGIN_REQUEST: null,
  LOGIN_SUCCESS: null,
  LOGIN_FAILURE: null,

  // 登录
  LOGOUT_REQUEST: null,
  LOGOUT_SUCCESS: null,
  LOGOUT_FAILURE: null,

  // 登录客户信息
  GET_CUSTOMER_REQUEST: null,
  GET_CUSTOMER_SUCCESS: null,
  GET_CUSTOMER_FAILURE: null,

  // 获取用户全部权限
  GET_USER_PERMISSIONS_SUCCESS: null,
  GET_USER_PERMISSIONS_FAILURE: null,

  // 保存到state
  SET_USER_PERMISSIONS: null,

  // 活动管理
  GET_ACTIVITIES_REQUEST: null,
  GET_ACTIVITIES_SUCCESS: null,
  GET_ACTIVITIES_FAILURE: null,

  ADD_ACTIVITY_REQUEST: null,
  ADD_ACTIVITY_SUCCESS: null,
  ADD_ACTIVITY_FAILURE: null,

  EDIT_ACTIVITY_REQUEST: null,
  EDIT_ACTIVITY_SUCCESS: null,
  EDIT_ACTIVITY_FAILURE: null,
});
