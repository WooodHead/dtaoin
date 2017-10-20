import { message } from 'antd';
import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

const {
  GET_ORDERS_DETAIL_REQUEST,
  GET_ORDERS_DETAIL_SUCCESS,

  GET_ORDERS_OUTCOLOR_REQUEST,
  GET_ORDERS_OUTCOLOR_SUCCESS,

  SET_ORDERS_APPLICATION_DOWNLOAD_INFO,

  SET_ORDERS_DEAL_DOWNLOAD_INFO,

  GET_ORDER_INSURANCE_COMPANY_REQUEST,
  GET_ORDER_INSURANCE_COMPANY_SUCCESS,

  GET_ORDER_INSURANCE_CONFIG_REQUEST,
  GET_ORDER_INSURANCE_CONFIG_SUCCESS,

  GET_INSURANCE_LOG_DETAIL_REQUEST,
  GET_INSURANCE_LOG_DETAIL_SUCCESS,

  GET_PROFIT_DETAIL_REQUEST,
  GET_PROFIT_DETAIL_SUCCESS,

  SET_ORDER_INSRUANCE_DETAIL_MAP,
} = require('../../constants').default;


/**
 * 订单操作
 * */
export function jinJian(id) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderJinJian(),
      type: 'POST',
      data: {
        order_id: id,
      },
    }, () => {
      message.success('进件成功');
      dispatch(getOrdersDetail(id));
    });
  };
}

export function jinJianReject(id, reason) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderJinJianReject(),
      type: 'POST',
      data: {
        order_id: id,
        reject_reason: reason,
      },
    }, () => {
      message.success('驳回成功');
      dispatch(getOrdersDetail(id));
    });
  };
}

export function jinJianPass(id) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderJinJianPass(),
      type: 'POST',
      data: {
        order_id: id,
      },
    }, () => {
      message.success('进件通过');
      dispatch(getOrdersDetail(id));
    });
  };
}

export function jinJianFail(id, reason) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderJinJianFail(),
      type: 'POST',
      data: {
        order_id: id,
        fail_reason: reason,
      },
    }, () => {
      message.success('进件失败');
      dispatch(getOrdersDetail(id));
    });
  };
}

export function qianDan(id) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderJinJianQianDan(),
      type: 'POST',
      data: {
        order_id: id,
      },
    }, () => {
      message.success('签单成功');
      dispatch(getOrdersDetail(id));
    });
  };
}

export function orderFinish(id) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderJinJianFinish(),
      type: 'POST',
      data: {
        order_id: id,
      },
    }, () => {
      message.success('交易终止');
      dispatch(getOrdersDetail(id));
    });
  };
}

export function getPic(pic, callback, title) {
  return () => {
    api.ajax({
      url: api.system.getPrivatePicUrl(pic),
    }, data => {
      callback(data.res.url, title);
    });
  };
}

/**
 * ## 获取订单详情
 */
export const getOrdersDetailRequest = createAction(GET_ORDERS_DETAIL_REQUEST);
export const getOrdersDetailSuccess = createAction(GET_ORDERS_DETAIL_SUCCESS);

export function getOrdersDetail(id) {
  return dispatch => {
    dispatch(getOrdersDetailRequest());
    api.ajax({ url: api.newCar.marketOrderDetail(id) }, data => {
      dispatch(getOrdersDetailSuccess(data.res));

      // 获取保险信息
      dispatch(getInsuranceLogDetail(data.res.detail._id));
      //  获取收益信息
      dispatch(getProfitDetail(data.res.detail._id));

      //  获取车辆外观颜色
      dispatch(getOutColors(data.res.detail.auto_series_id));
    });
  };
}

/**
 * 车辆信息
 * */

export const getOrdersOutColorRequest = createAction(GET_ORDERS_OUTCOLOR_REQUEST);
export const getOrdersOutColorSuccess = createAction(GET_ORDERS_OUTCOLOR_SUCCESS);

export function getOutColors(seriesId) {
  return dispatch => {
    dispatch(getOrdersOutColorRequest());
    api.ajax({ url: api.auto.getOutColorBySeries(seriesId) }, data => {
      dispatch(getOrdersOutColorSuccess(data.res.out_colors));
    });
  };
}

export function submitCarInfo(values) {
  return dispatch => {
    api.ajax({
      url: api.newCar.marketOrderEditAuto(),
      type: 'POST',
      data: values,
    }, () => {
      message.success('提交车型信息成功');
      dispatch(getOrdersDetail(values.order_id));
    });
  };
}

/**
 * 融资信息
 * */

export function submitFinancingInfo(values) {
  return () => {
    api.ajax({
      url: api.newCar.marketOrderEditLoan(),
      type: 'POST',
      data: values,
    }, () => {
      message.success('提交融资信息成功');
    });
  };
}

/**
 * 申请材料
 * */

export function setApplicationDownloadInfo(selectedRows) {
  return dispatch => {
    dispatch(createAction(SET_ORDERS_APPLICATION_DOWNLOAD_INFO)(selectedRows));
  };
}

/**
 * 交车材料
 * */

export function setDealDownloadInfo(selectedRows) {
  return dispatch => {
    dispatch(createAction(SET_ORDERS_DEAL_DOWNLOAD_INFO)(selectedRows));
  };
}

/**
 * 保险信息
 * */
export const getInsurceCompanyRequest = createAction(GET_ORDER_INSURANCE_COMPANY_REQUEST);
export const getInsurceCompanySuccess = createAction(GET_ORDER_INSURANCE_COMPANY_SUCCESS);

export function getInsurceCompany() {
  return dispatch => {
    dispatch(getInsurceCompanyRequest());
    api.ajax({ url: api.presales.deal.getInsuranceCompanies() }, data => {
      dispatch(getInsurceCompanySuccess(data.res.company_list));
    });
  };
}

export function submitInsuranceInfo(data) {
  return () => {
    api.ajax({
      url: api.newCar.marketOrderEditInsuranceLog(),
      type: 'POST',
      data,
    }, () => {
      message.success('提交保险信息成功');
    });
  };
}

export function setInsuranceListMap(map) {
  return dispatch => {
    dispatch(createAction(SET_ORDER_INSRUANCE_DETAIL_MAP)(map));
  };
}

const getInsuranceConfigRequest = createAction(GET_ORDER_INSURANCE_CONFIG_REQUEST);
const getInsuranceConfigSuccess = createAction(GET_ORDER_INSURANCE_CONFIG_SUCCESS);

export function getInsuranceConfig() {
  return dispatch => {
    dispatch(getInsuranceConfigRequest());
    api.ajax({ url: api.newCar.marketOrderGetInsuranceConfig() }, data => {
      dispatch(getInsuranceConfigSuccess(data.res.insurance_config));
    });
  };
}

/* 保险详情*/
const getInsuranceLogDetailRequest = createAction(GET_INSURANCE_LOG_DETAIL_REQUEST);
const getInsuranceLogDetailSuccess = createAction(GET_INSURANCE_LOG_DETAIL_SUCCESS);

export function getInsuranceLogDetail(id) {
  return dispatch => {
    dispatch(getInsuranceLogDetailRequest());
    api.ajax({ url: api.newCar.marketOrderGetInsuranceLogDetail(id) }, data => {
      dispatch(getInsuranceLogDetailSuccess(data.res.detail));
    });
  };
}

/**
 * 收益信息
 * */

export function submitProfitInfo(data) {
  return () => {
    api.ajax({
      url: api.newCar.marketOrderEditFinance(),
      type: 'POST',
      data,
    }, () => {
      message.success('提交收益信息成功');
    });
  };
}

const getProfitDetailRequest = createAction(GET_PROFIT_DETAIL_REQUEST);
const getProfitDetailSuccess = createAction(GET_PROFIT_DETAIL_SUCCESS);

export function getProfitDetail(id) {
  return dispatch => {
    dispatch(getProfitDetailRequest());
    api.ajax({ url: api.newCar.marketOrderGetFinanceDetail(id) }, data => {
      dispatch(getProfitDetailSuccess(data.res.detail || {}));
    });
  };
}
