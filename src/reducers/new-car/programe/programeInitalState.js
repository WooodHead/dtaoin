const { Record } = require('immutable');

const InitialState = Record({
  getBrandsData: [],
  getSeriesByBrandData: [],
  getTypesBySeriesData: [],
  postCreateLoanPlanDataRes: [],
  postCreateAmountFixPlanDataRes: [],
  postCreateAutoTypeDataRes: [],
  getMarketPlanAllListData: [],
  postMarketPlanEditHotRes: [],
  postMarketPlanOfflineRes: [],
  postMarketPlanOnlineRes: [],
  getPlanDetailData: [],
  postEditAmountFixPlanRes: [],
  postEditLoanPlanRes: [],
  getProductListAllData: [],

  vehicleschemePage: 1,
  financialProgramPage: 1,
  productDetail: {},
  isFetching:true,
});

export default InitialState;

