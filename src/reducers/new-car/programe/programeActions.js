/**
 * 订单详情
 */
const {
  GET_BRANDSREQUESTREQUEST,
  GET_BRANDSREQUESTSUCCESS,

  GET_SERISEBYBRANDREQUEST,
  GET_SERISEBYBRANDSUCCESS,

  GET_TYPESBYSERIESREQUEST,
  GET_TYPESBYSERIESSUCCESS,

  POST_CREATELOANPLANREQUEST,
  POST_CREATELOANPLANSUCCESS,

  POST_CREATEAMOUNTFIXPLANREQUEST,
  POST_CREATEAMOUNTFIXPLANSUCCESS,

  POST_CREATEAUTOTYPEREQUEST,
  POST_CREATEAUTOTYPESUCCESS,

  GET_MARKERTPLANALLLISTREQUEST,
  GET_MARKERTPLANALLLISTSUCCESS,

  POST_MARKETPLANEDITHOTREQUEST,
  POST_MARKETPLANEDITHOTSUCCESS,

  POST_MARKETPLANOFFLINEREQUEST,
  POST_MARKETPLANOFFLINESUCCESS,

  POST_MARKETPLANONLINEREQUEST,
  POST_MARKETPLANONLINESUCCESS,

  GET_PLANDETAILREQUEST,
  GET_PLANDETAILSUCCESS,

  POST_EDITAMOUNTFIXPLANREQUEST,
  POST_EDITAMOUNTFIXPLANSUCCESS,

  POST_EDITLOANPLANREQUEST,
  POST_EDITLOANPLANSUCCESS,

  SET_VEHICLESCHEME_PAGE,
  SET_FINANCIALPROGRAM_PAGE,

  GET_PRODUCTLISTALLREQUEST,
  GET_PRODUCTLISTALLSUCCESS,

  GET_PRODUCT_DETAIL_REQUEST,
  GET_PRODUCT_DETAIL_SUCCESS,
} = require('../../constants').default;

import { message } from 'antd';
import api from '../../../middleware/api';

import { createAction } from 'redux-actions';

/**
 * ## 获取所有的汽车品牌
 */
export const get_brandsRequest = createAction(GET_BRANDSREQUESTREQUEST);
export const get_brandsSuccess = createAction(GET_BRANDSREQUESTSUCCESS);

export function get_brands() {
  return dispatch => {
    dispatch(get_brandsRequest());
    api.ajax({ url: api.auto.getBrands() }, data => {
      dispatch(get_brandsSuccess(data.res));
    });
  };
}

// 获取车系

export const get_seriesByBrandRequest = createAction(GET_SERISEBYBRANDREQUEST);
export const get_seriesByBrandSuccess = createAction(GET_SERISEBYBRANDSUCCESS);

export function get_seriesByBrand(brandId) {
  return dispatch => {
    dispatch(get_seriesByBrandRequest());
    api.ajax({ url: api.auto.getSeriesByBrand(brandId) }, data => {
      console.log('branddata', data);
      dispatch(get_seriesByBrandSuccess(data.res));
    });
  };
}

// 获取车型

export const get_typesBySeriesRequest = createAction(GET_TYPESBYSERIESREQUEST);
export const get_typesBySeriesSuccess = createAction(GET_TYPESBYSERIESSUCCESS);

export function get_typesBySeries(brandId) {
  return dispatch => {
    dispatch(get_typesBySeriesRequest());
    api.ajax({ url: api.auto.getTypesBySeries(brandId) }, data => {
      dispatch(get_typesBySeriesSuccess(data.res));
    });
  };
}

// 创建金融方案

export const post_createLoanPlanRequest = createAction(POST_CREATELOANPLANREQUEST);
export const post_createLoanPlanSuccess = createAction(POST_CREATELOANPLANSUCCESS);

export function post_createLoanPlan(data) {
  return dispatch => {
    dispatch(post_createLoanPlanRequest());
    api.ajax({
      url: api.newCar.postCreateLoanPlan(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_createLoanPlanSuccess(data.res));
      dispatch(get_marketPlanAllList(0, 15, 0, '', 2, ''));
      message.success('创建金融方案成功');
    }, () => {
      message.error('失败！');
    });
  };
}

// 创建车型方案
export const post_createAmountFixPlanRequest = createAction(POST_CREATEAMOUNTFIXPLANREQUEST);
export const post_createAmountFixPlanSuccess = createAction(POST_CREATEAMOUNTFIXPLANSUCCESS);

export function post_createAmountFixPlan(data) {
  return dispatch => {
    dispatch(post_createAmountFixPlanRequest());
    api.ajax({
      url: api.newCar.postCreateAmountFixPlan(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_createAmountFixPlanSuccess(data.res));
      message.success('创建车型方案成功');
    }, () => {
      message.error('失败！');
    });
  };
}

// 创建自定义车型

export const post_createAutoTypeRequest = createAction(POST_CREATEAUTOTYPEREQUEST);
export const post_createAutoTypeSuccess = createAction(POST_CREATEAUTOTYPESUCCESS);

export function post_createAutoType(data, callback) {
  return dispatch => {
    dispatch(post_createAutoTypeRequest());
    api.ajax({
      url: api.newCar.postCreateAutoType(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_createAutoTypeSuccess(data.res));
      callback && callback(data.res.auto_type_id);
    });
  };
}

// 获取方案管理的列表

export const get_marketPlanAllListRequest = createAction(GET_MARKERTPLANALLLISTREQUEST);
export const get_marketPlanAllListSuccess = createAction(GET_MARKERTPLANALLLISTSUCCESS);

export function get_marketPlanAllList(data) {
  return dispatch => {
    dispatch(get_marketPlanAllListRequest());
    api.ajax({
      url: api.newCar.getMarketPlanAllList(data),
    }, data => {
      dispatch(get_marketPlanAllListSuccess(data.res));
    });
  };
}

// 设置热门——车型方案

export const post_marketPlanEditHotRequest = createAction(POST_MARKETPLANEDITHOTREQUEST);
export const post_marketPlanEditHotSuccess = createAction(POST_MARKETPLANEDITHOTSUCCESS);

export function post_marketPlanEditHot(data, callback) {
  return dispatch => {
    dispatch(post_marketPlanEditHotRequest());
    api.ajax({
      url: api.newCar.postMarketPlanEditHot(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_marketPlanEditHotSuccess(data.res));
      message.success('已设置热门！');
      callback && callback();
    }, () => {
      message.error('失败！');
    });
  };
}

// 设置下架

export const post_marketPlanOfflineRequest = createAction(POST_MARKETPLANOFFLINEREQUEST);
export const post_marketPlanOfflineSuccess = createAction(POST_MARKETPLANOFFLINESUCCESS);

export function post_marketPlanOffline(data, callback) {
  return dispatch => {
    dispatch(post_marketPlanOfflineRequest());
    api.ajax({
      url: api.newCar.postMarketPlanOffline(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_marketPlanOfflineSuccess(data.res));
      message.success('下架成功');
      callback();
    }, () => {
      message.error('失败！');
    });
  };
}

// ——上架

export const post_marketPlanOnlineRequest = createAction(POST_MARKETPLANONLINEREQUEST);
export const post_marketPlanOnlineSuccess = createAction(POST_MARKETPLANONLINESUCCESS);

export function post_marketPlanOnline(data, callback) {
  return dispatch => {
    dispatch(post_marketPlanOnlineRequest());
    api.ajax({
      url: api.newCar.postMarketPlanOnline(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_marketPlanOnlineSuccess(data.res));
      message.success('上架成功');
      callback();
    }, () => {
      message.error('失败！');
    });
  };
}

// 获取方案的详情

export const get_planDetailRequest = createAction(GET_PLANDETAILREQUEST);
export const get_planDetailSuccess = createAction(GET_PLANDETAILSUCCESS);

export function get_planDetail(plan_id, callback) {
  return dispatch => {
    dispatch(get_planDetailRequest());
    api.ajax({
      url: api.newCar.getPlanDetail(plan_id),
    }, data => {
      const { detail } = data.res;
      dispatch(get_planDetailSuccess(detail));

      dispatch(get_seriesByBrand(detail.auto_brand_id));
      dispatch(get_typesBySeries(detail.auto_series_id));

      callback && callback(data.res);
    });
  };
}

// 编辑车型方案
export const post_editAmountFixPlanRequest = createAction(POST_EDITAMOUNTFIXPLANREQUEST);
export const post_editAmountFixPlanSuccess = createAction(POST_EDITAMOUNTFIXPLANSUCCESS);

export function post_editAmountFixPlan(data) {
  return dispatch => {
    dispatch(post_editAmountFixPlanRequest());
    api.ajax({
      url: api.newCar.postEditAmountFixPlan(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_editAmountFixPlanSuccess(data.res));
      message.success('成功！');
    }, () => {
      message.error('失败！');
    });
  };
}

// 编辑金融方案

export const post_editLoanPlanRequest = createAction(POST_EDITLOANPLANREQUEST);
export const post_editLoanPlanSuccess = createAction(POST_EDITLOANPLANSUCCESS);

export function post_editLoanPlan(data) {
  return dispatch => {
    dispatch(post_editLoanPlanRequest());
    api.ajax({
      url: api.newCar.postEditLoanPlan(data),
      type: 'post',
      data,
    }, data => {
      dispatch(post_editLoanPlanSuccess(data.res));
      message.success('成功！');
    }, () => {
      message.error('失败！');
    });
  };
}

/*
* 车型方案分页
* */
export function setVehicleSchemePage(page) {
  return dispatch => {
    dispatch(createAction(SET_VEHICLESCHEME_PAGE)(page));
  };
}

/*
* 金融方案分页
* */

export function setFinancialProgramPage(page) {
  return dispatch => {
    dispatch(createAction(SET_FINANCIALPROGRAM_PAGE)(page));
  };
}

// 获取所有的产品列表

export const get_productListAllRequest = createAction(GET_PRODUCTLISTALLREQUEST);
export const get_productListAllSuccess = createAction(GET_PRODUCTLISTALLSUCCESS);

export function get_productListAll(type) {
  return dispatch => {
    dispatch(get_productListAllRequest());
    api.ajax({
      url: api.newCar.getProductListAllType(type),
    }, data => {
      dispatch(get_productListAllSuccess(data.res));
    });
  };
}

/*
* 获取选中产品详情
* */

export const getProductDetailRequest = createAction(GET_PRODUCT_DETAIL_REQUEST);
export const getProductDetailSuccess = createAction(GET_PRODUCT_DETAIL_SUCCESS);

export function getProductDetail(id, callback) {
  return dispatch => {
    dispatch(getProductDetailRequest());
    api.ajax({
      url: api.newCar.getProductDetail(id),
    }, data => {
      dispatch(getProductDetailSuccess(data.res));
      callback(data.res);
    });
  };
}
