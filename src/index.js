import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import configureStore from './store/configureStore';

require('./config/userstatus');

/**
 * ## States
 * defines initial state
 *
 */
import authInitialState from './reducers/auth/authInitialState';
import activityInitialState from './reducers/activity/activityInitialState';

// 新车
import intentionInitialState from './reducers/new-car/order/intentionInitialState';
import orderInitialState from './reducers/new-car/order/orderInitialState';
import orderDetailInitailState from './reducers/new-car/order/detailInitialState';

import productDateInitialState from './reducers/new-car/product/productInitalState';
import postProductCreateRes from './reducers/new-car/product/productInitalState';
import postMarkertPeditRiskRes from './reducers/new-car/product/productInitalState';
import postMarkertDitAmountFixFinanceRes from './reducers/new-car/product/productInitalState';
import postMarkertEditLoanFinanceRes from './reducers/new-car/product/productInitalState';
import getMarketMaterialListData from './reducers/new-car/product/productInitalState';
import postMarketEditMaterialRes from './reducers/new-car/product/productInitalState';
import getMarketProAllListData from './reducers/new-car/product/productInitalState';
import postMarketProductOfflineRes from './reducers/new-car/product/productInitalState';
import postMarketProductOnlineRes from './reducers/new-car/product/productInitalState';
import getProductDetailRes from './reducers/new-car/product/productInitalState';

// 方案管理
import postFinancingInformationRes from './reducers/new-car/product/productInitalState';

import programeDataInitialState from './reducers/new-car/programe/programeInitalState';
import getBrandsData from './reducers/new-car/programe/programeInitalState';
import getSeriesByBrandData from './reducers/new-car/programe/programeInitalState';
import getTypesBySeriesData from './reducers/new-car/programe/programeInitalState';
import postCreateLoanPlanDataRes from './reducers/new-car/programe/programeInitalState';
import postMarketPlanEditHotRes from './reducers/new-car/programe/programeInitalState';
import postCreateAmountFixPlanDataRes from './reducers/new-car/programe/programeInitalState';
import postCreateAutoTypeDataRes from './reducers/new-car/programe/programeInitalState';
import getMarketPlanAllListData from './reducers/new-car/programe/programeInitalState';
import postMarketPlanOfflineRes from './reducers/new-car/programe/programeInitalState';
import postMarketPlanOnlineRes from './reducers/new-car/programe/programeInitalState';
import getPlanDetailData from './reducers/new-car/programe/programeInitalState';
import postEditAmountFixPlanRes from './reducers/new-car/programe/programeInitalState';
import postEditLoanPlanRes from './reducers/new-car/programe/programeInitalState';
import getProductListAllData from './reducers/new-car/programe/programeInitalState';
import isFetching from './reducers/new-car/programe/programeInitalState';


import qaInitailState from './reducers/new-car/qa/qaInitialState';
import newCarBannerInitailState from './reducers/new-car/banner/bannerInitialState';
import newCarResourceInitailState from './reducers/new-car/resource/resourceInitialState';
import newCarEarningsRecordInitailState from './reducers/new-car/earnings-record/earningsRecordInitialState';
import newCarMaterialInitailState from './reducers/new-car/material/materialInitialState';

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure in App
 * @returns {Object} object with 4 keys
 */
function getInitialState() {
  const _initState = {
    auth: new authInitialState,
    activity: new activityInitialState,

    intention: new intentionInitialState,
    order: new orderInitialState,
    orderDetail: new orderDetailInitailState,

    newCarQa: new qaInitailState,
    newCarBanner: new newCarBannerInitailState,
    newCarResource: new newCarResourceInitailState,
    newCarEarningsRecord: new newCarEarningsRecordInitailState,
    newCarMaterial: new newCarMaterialInitailState,

    productDate: new productDateInitialState,
    postProductCreateRes: new postProductCreateRes,
    postMarkertPeditRiskRes: new postMarkertPeditRiskRes,
    postMarkertDitAmountFixFinanceRes: new postMarkertDitAmountFixFinanceRes,
    postMarkertEditLoanFinanceRes: new postMarkertEditLoanFinanceRes,
    getMarketMaterialListData: new getMarketMaterialListData,
    postMarketEditMaterialRes: new postMarketEditMaterialRes,
    getMarketProAllListData: new getMarketProAllListData,
    postMarketProductOfflineRes: new postMarketProductOfflineRes,
    postMarketProductOnlineRes: new postMarketProductOnlineRes,
    postMarketPlanEditHotRes: new postMarketPlanEditHotRes,
    postMarketPlanOfflineRes: new postMarketPlanOfflineRes,
    postMarketPlanOnlineRes: new postMarketPlanOnlineRes,
    getProductDetailRes: new getProductDetailRes,
    getPlanDetailData: new getPlanDetailData,
    postEditAmountFixPlanRes: new postEditAmountFixPlanRes,
    postEditLoanPlanRes: new postEditLoanPlanRes,
    getProductListAllData:new getProductListAllData,
    isFetching:new isFetching,
    postCreateAutoTypeDataRes: new postCreateAutoTypeDataRes,
    getMarketPlanAllListData: new getMarketPlanAllListData,
    postFinancingInformationRes: new postFinancingInformationRes,

    programeData: new programeDataInitialState,
    getBrandsData: new getBrandsData,
    getSeriesByBrandData: new getSeriesByBrandData,
    getTypesBySeriesData: new getTypesBySeriesData,
    postCreateLoanPlanDataRes: new postCreateLoanPlanDataRes,
    postCreateAmountFixPlanDataRes: new postCreateAmountFixPlanDataRes,
  };
  return _initState;
}

const store = configureStore(getInitialState());

render(
  <Root store={store} />,
  document.getElementById('app'),
);
if (module.hot) {
  module.hot.accept();
}
