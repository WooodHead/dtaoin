import { createAction } from 'redux-actions';
import api from '../../../middleware/api';

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


/**
 * ## get earningsRecord list
 */
export const getBannersRequest = createAction(GET_NEWCAR_EARNINGSRECORD_REQUEST);
export const getBannersSuccess = createAction(GET_NEWCAR_EARNINGSRECORD_SUCCESS);
export const getBannersFailure = createAction(GET_NEWCAR_EARNINGSRECORD_FAILURE);

export function getEarningsRecordList(condition) {
  return dispatch => {
    dispatch(getBannersRequest());
    api.ajax({ url: api.newCar.marketOrderFinanceList(condition) }, data => {
      dispatch(getBannersSuccess(data.res));
    }, data => {
      dispatch(getBannersFailure(data.msg));
    });
  };
}

/**
 * ## get resource list
 */
export const getResourcesRequest = createAction(GET_NEWCAR_EARNINGS_RESOURCE_REQUEST);
export const getResourcesSuccess = createAction(GET_NEWCAR_EARNINGS_RESOURCE_SUCCESS);

export function getResourceList() {
  return dispatch => {
    dispatch(getResourcesRequest());
    api.ajax({ url: api.newCar.marketResourceListAll() }, data => {
      dispatch(getResourcesSuccess(data.res.list));
    });
  };
}

/*
* 获取省份
* */
export const getOrderProvincesRequest = createAction(GET_NEW_CAR_EARNINGS_PROVINCES_REQUEST);
export const getOrderProvincesSuccess = createAction(GET_NEW_CAR_EARNINGS_PROVINCES_SUCCESS);

export function getProvinces() {
  return dispatch => {
    dispatch(getOrderProvincesRequest());
    api.ajax({ url: api.system.getProvinces() }, data => {
      const provinces = data.res.province_list.map(item => {
        item.value = item.name;
        item.label = item.name;
        item.isLeaf = false;
        return item;
      });
      dispatch(getOrderProvincesSuccess(provinces));
    });
  };
}

/*
* 获取市县
* */
export const getOrderReginRequest = createAction(GET_NEWCAR_EARNINGSRECORD_REGIN_REQUEST);
export const getOrderReginSuccess = createAction(GET_NEWCAR_EARNINGSRECORD_REGIN_SUCCESS);

export function getRegin(selectedOptions) {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  return dispatch => {
    dispatch(getOrderReginRequest());
    // 获取市
    api.ajax({ url: api.system.getCities(targetOption.name) }, data => {
      targetOption.loading = false;
      targetOption.children = [];
      data.res.city_list.map(item => {
        item.value = item.name;
        item.label = item.name;
        item.isLeaf = true;
        targetOption.children.push(item);
      });
      dispatch(getOrderReginSuccess());
    });
  };
}

export function setProvince(province) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_PROVINCE)(province));
  };
}

export function setCity(city) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_CITY)(city));
  };
}

export function setCounty(county) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_COUNTRY)(county));
  };
}

export function setResourceId(id) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_EARNING_RESOURCEID)(id));
  };
}

/**
 * ## setPage
 * */
export function setPage(page) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_EARNINGSRECORD_PAGE)(page));
  };
}

export function setStartDate(startDate) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_EARNINGS_START_DATE)(startDate));
  };
}

export function setEndDate(endDate) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_EARNINGS_END_DATE)(endDate));
  };
}

