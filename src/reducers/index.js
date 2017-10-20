import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import auth from './auth/authReducer';
import activity from './activity/activityReducer';

// 新车
import intention from './new-car/order/intentionReducer';
import order from './new-car/order/orderReducer';
import orderDetail from './new-car/order/detailReducer';
import productDate from './new-car/product/productReducer';
import postProductCreateRes from './new-car/product/productReducer';
import postMarkertPeditRiskRes from './new-car/product/productReducer';
import postMarkertDitAmountFixFinanceRes from './new-car/product/productReducer';
import postMarkertEditLoanFinanceRes from './new-car/product/productReducer';
import getMarketMaterialListData from './new-car/product/productReducer';
import postMarketEditMaterialRes from './new-car/product/productReducer';
import postMarketProductOfflineRes from './new-car/product/productReducer';
import postMarketProductOnlineRes from './new-car/product/productReducer';
import getProductDetailRes from './new-car/product/productReducer';


import getMarketProAllListData from './new-car/product/productReducer';
import postFinancingInformationRes from './new-car/product/productReducer';

// 方案管理
import programeData from './new-car/programe/programeReducer';
import getBrandsData from './new-car/programe/programeReducer';
import getSeriesByBrandData from './new-car/programe/programeReducer';
import getTypesBySeriesData from './new-car/programe/programeReducer';
import postCreateLoanPlanDataRes from './new-car/programe/programeReducer';
import postMarketPlanEditHotRes from './new-car/programe/programeReducer';
import postCreateAmountFixPlanDataRes from './new-car/programe/programeReducer';
import postCreateAutoTypeDataRes from './new-car/programe/programeReducer';
import getMarketPlanAllListData from './new-car/programe/programeReducer';
import postMarketPlanOfflineRes from './new-car/programe/programeReducer';
import postMarketPlanOnlineRes from './new-car/programe/programeReducer';
import getPlanDetailData from './new-car/programe/programeReducer';
import postEditAmountFixPlanRes from './new-car/programe/programeReducer';
import postEditLoanPlanRes from './new-car/programe/programeReducer';
import getProductListAllData from './new-car/programe/programeReducer';
import isFetching from './new-car/programe/programeReducer';

import newCarQa from './new-car/qa/qaReducer';
import newCarBanner from './new-car/banner/bannerReducer';
import newCarResource from './new-car/resource/resourceReducer';
import newCarMaterial from './new-car/material/materialReducer';

import newCarEarningsRecord from './new-car/earnings-record/earningsRecordReducer';

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const rootReducer = combineReducers({
  routing,

  auth,
  activity,

  intention,
  order,
  orderDetail,

  newCarQa,
  newCarBanner,
  newCarResource,
  newCarEarningsRecord,
  newCarMaterial,

  productDate,
  postProductCreateRes,
  postMarkertPeditRiskRes,
  postMarkertDitAmountFixFinanceRes,
  postMarkertEditLoanFinanceRes,
  getMarketMaterialListData,
  postMarketEditMaterialRes,
  getMarketProAllListData,
  getMarketPlanAllListData,
  postFinancingInformationRes,
  postMarketProductOfflineRes,
  postMarketProductOnlineRes,
  postMarketPlanEditHotRes,
  postMarketPlanOfflineRes,
  postMarketPlanOnlineRes,
  getProductDetailRes,
  getPlanDetailData,
  postEditAmountFixPlanRes,
  postEditLoanPlanRes,
  getProductListAllData,
  isFetching,

  programeData,
  getBrandsData,
  getSeriesByBrandData,
  getTypesBySeriesData,
  postCreateLoanPlanDataRes,
  postCreateAmountFixPlanDataRes,
  postCreateAutoTypeDataRes,
});

export default rootReducer;
