/**
 * 活动
 */
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

} = require('../../config/constants').default;

import server from '../../middleware/server';
import api from '../../middleware/api';

/**
 * ## get activity list
 */
export function getActivitiesRequest() {
  return {
    type: GET_ACTIVITIES_REQUEST,
  };
}

export function getActivitiesSuccess(json) {
  return {
    type: GET_ACTIVITIES_SUCCESS,
    payload: json,
  };
}

export function getActivitiesFailure(error) {
  return {
    type: GET_ACTIVITIES_FAILURE,
    payload: error,
  };
}

export function getActivities(condition) {
  return dispatch => {
    dispatch(getActivitiesRequest());

    server.get(api.activity.list(condition))
      .then(data => {
        if (data.code === 0) {
          dispatch(getActivitiesSuccess(data.res));
        } else {
          dispatch(getActivitiesFailure(data.msg));
        }
      })
      .catch(error => {
        dispatch(getActivitiesFailure(error));
      });
  };
}

/**
 * ## add activity
 */
export function addActivityRequest() {
  return {
    type: ADD_ACTIVITY_REQUEST,
  };
}

export function addActivitySuccess(user) {
  return {
    type: ADD_ACTIVITY_SUCCESS,
    payload: user,
  };
}

export function addActivityFailure(error) {
  return {
    type: ADD_ACTIVITY_FAILURE,
    payload: error,
  };
}

export function add(params) {
  return dispatch => {
    dispatch(addActivityRequest());

    server.post(api.activity.add(), params)
      .then(data => {
        if (data.code === 0) {
          dispatch(addActivitySuccess(data.res));
        } else {
          dispatch(addActivityFailure(data.msg));
        }
      })
      .catch(error => {
        dispatch(addActivityFailure(error));
      });
  };
}

/**
 * ## edit activity
 */
export function editActivityRequest() {
  return {
    type: EDIT_ACTIVITY_REQUEST,
  };
}

export function editActivitySuccess(user) {
  return {
    type: EDIT_ACTIVITY_SUCCESS,
    payload: user,
  };
}

export function editActivityFailure(error) {
  return {
    type: EDIT_ACTIVITY_FAILURE,
    payload: error,
  };
}

export function edit(params) {
  return dispatch => {
    dispatch(editActivityRequest());

    server.post(api.activity.edit(), params)
      .then(data => {
        if (data.code === 0) {
          dispatch(editActivitySuccess(data.res));
        } else {
          dispatch(editActivityFailure(data.msg));
        }
      })
      .catch(error => {
        dispatch(editActivityFailure(error));
      });
  };
}

