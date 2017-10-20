import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

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


/**
 * ## get activity list
 */
export const getOrdersRequest = createAction(GET_ORDERS_REQUEST);
export const getOrdersSuccess = createAction(GET_ORDERS_SUCCESS);
export const getOrdersFailure = createAction(GET_ORDERS_FAILURE);

export function getOrders(condition) {
  return dispatch => {
    dispatch(getOrdersRequest());
    api.ajax({ url: api.newCar.marketOrderList(condition) }, data => {
      dispatch(getOrdersSuccess(data.res));
    }, data => {
      dispatch(getOrdersFailure(data.msg));
    });
  };
}

/*
* 获取省份
* */
export const getOrderProvincesRequest = createAction(GET_ORDERS_PROVINCES_REQUEST);
export const getOrderProvincesSuccess = createAction(GET_ORDERS_PROVINCES_SUCCESS);

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

export const getOrderReginRequest = createAction(GET_ORDERS_REGIN_REQUEST);
export const getOrderReginSuccess = createAction(GET_ORDERS_REGIN_SUCCESS);

export function getRegin(selectedOptions) {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  return dispatch => {
    dispatch(getOrderReginRequest());
    if (Number(selectedOptions.length) === 2) {
      // 获取县
      api.ajax({ url: api.system.getCountries(selectedOptions[0].name, selectedOptions[1].name) }, data => {
        targetOption.loading = false;
        targetOption.children = [];
        data.res.country_list.map(item => {
          item.value = item.name;
          item.label = item.name;
          targetOption.children.push(item);
        });

        dispatch(getOrderReginSuccess());
        /*  this.setState({
            options: [...this.state.options],
          });*/
      });
    } else {
      // 获取市
      api.ajax({ url: api.system.getCities(targetOption.name) }, data => {
        targetOption.loading = false;
        targetOption.children = [];
        data.res.city_list.map(item => {
          item.value = item.name;
          item.label = item.name;
          item.isLeaf = false;
          targetOption.children.push(item);
        });
        dispatch(getOrderReginSuccess());
        /* this.setState({
          options: [...this.state.options],
        });*/
      });
    }
  };
}

// 获取产品名称

export const getProductListRequest = createAction(GET_ORDERS_PRODUCT_LIST_REQUEST);
export const getProductListSuccess = createAction(GET_ORDERS_PRODUCT_LIST_SUCCESS);

export function getProductListAll() {
  return dispatch => {
    dispatch(getProductListRequest());
    api.ajax({ url: api.newCar.getProductListAll() }, data => {
      dispatch(getProductListSuccess(data.res.list));
    });
  };
}

// 获取门店名称
export const getCompanyListRequest = createAction(GET_ORDER_COMPANY_LIST_REQUEST);
export const getCompanyListSuccess = createAction(GET_ORDER_COMPANY_LIST_SUCCESS);

export function getCompanyList() {
  return dispatch => {
    dispatch(getCompanyListRequest());
    api.ajax({ url: api.company.getAll() }, data => {
      dispatch(getCompanyListSuccess(data.res.list));
    });
  };
}

/**
 * ## setPage
 * */
export function setPage(page) {
  return dispatch => {
    dispatch(createAction(SET_ORDERS_PAGE)(page));
  };
}

export function setKey(key) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_KEY)(key));
    dispatch(setPage(1));
  };
}

export function setProvince(province) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_PROVINCE)(province));
  };
}

export function setCity(city) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_CITY)(city));
  };
}

export function setCountry(country) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_COUNTY)(country));
  };
}

export function setCompanyId(companyId) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_COMPANY_NAME)(companyId));
  };
}

export function setStartDate(startDate) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_START_DATE)(startDate));
  };
}

export function setEndDate(endDate) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_END_DATE)(endDate));
  };
}

export function setProductId(productId) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_PRODUCT_NAME)(productId));
  };
}

export function setType(type) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_TYPE)(type));
  };
}

export function setStatus(status) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_STATUS)(status));
  };
}
