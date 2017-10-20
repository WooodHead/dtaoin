import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

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


/**
 * ## get Intentions list
 */
export const getIntentionsRequest = createAction(GET_INTENTIONS_REQUEST);
export const getIntentionsSuccess = createAction(GET_INTENTIONS_SUCCESS);
export const getIntentionsFailure = createAction(GET_INTENTIONS_FAILURE);

export function getIntentions(condition) {
  return dispatch => {
    dispatch(getIntentionsRequest());
    api.ajax({ url: api.newCar.marketOrderIntentionList(condition) }, data => {
      dispatch(getIntentionsSuccess(data.res));
    }, data => {
      dispatch(getIntentionsFailure(data.msg));
    });
  };
}

// 获取门店名称
export const getCompanyListRequest = createAction(GET_INTENTIONS_COMPANY_LIST_REQUEST);
export const getCompanyListSuccess = createAction(GET_INTENTIONS_COMPANY_LIST_SUCCESS);

export function getCompanyList() {
  return dispatch => {
    dispatch(getCompanyListRequest());
    api.ajax({ url: api.company.getAll() }, data => {
      dispatch(getCompanyListSuccess(data.res.list));
    });
  };
}

/*
* 获取省份
* */
export const getIntentionsProvincesRequest = createAction(GET_INTENTIONS_PROVINCES_REQUEST);
export const getIntentionsProvincesSuccess = createAction(GET_INTENTIONS_PROVINCES_SUCCESS);

export function getProvinces() {
  return dispatch => {
    dispatch(getIntentionsProvincesRequest());
    api.ajax({ url: api.system.getProvinces() }, data => {
      const provinces = data.res.province_list.map(item => {
        item.value = item.name;
        item.label = item.name;
        item.isLeaf = false;
        return item;
      });
      dispatch(getIntentionsProvincesSuccess(provinces));
    });
  };
}

/*
* 获取市县
* */

export const getIntentionsReginRequest = createAction(GET_INTENTIONS_REGIN_REQUEST);
export const getIntentionsReginSuccess = createAction(GET_INTENTIONS_REGIN_SUCCESS);

export function getRegin(selectedOptions) {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  return dispatch => {
    dispatch(getIntentionsReginRequest());
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

        dispatch(getIntentionsReginSuccess());
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
        dispatch(getIntentionsReginSuccess());
        /* this.setState({
          options: [...this.state.options],
        });*/
      });
    }
  };
}

// 获取产品名称

export const getProductListRequest = createAction(GET_INTENTIONS_PRODUCT_LIST_REQUEST);
export const getProductListSuccess = createAction(GET_INTENTIONS_PRODUCT_LIST_SUCCESS);

export function getProductListAll() {
  return dispatch => {
    dispatch(getProductListRequest());
    api.ajax({ url: api.newCar.getProductListAll() }, data => {
      dispatch(getProductListSuccess(data.res.list));
    });
  };
}

/**
 * ## setPage
 * */
export function setPage(page) {
  return dispatch => {
    dispatch(createAction(SET_INTENTIONS_PAGE)(page));
  };
}

export function setKey(key) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_KEY)(key));
    dispatch(setPage(1));
  };
}

export function setProvince(province) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_PROVINCE)(province));
  };
}

export function setCity(city) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_CITY)(city));
  };
}

export function setCountry(country) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_COUNTY)(country));
  };
}

export function setCompanyId(companyId) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_COMPANY_NAME)(companyId));
  };
}

export function setStartDate(startDate) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_START_DATE)(startDate));
  };
}

export function setEndDate(endDate) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_END_DATE)(endDate));
  };
}

export function setProductId(productId) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_PRODUCT_NAME)(productId));
  };
}

export function setFinancingType(financingType) {
  return dispatch => {
    dispatch(createAction(SET_INTENTION_FINANCING_TYPE)(financingType));
  };
}
