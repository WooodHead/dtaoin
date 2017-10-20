const { Record } = require('immutable');

const InitialState = Record({
  getMarketListData: [],
  postProductCreateRes: '',
  postMarkertPeditRiskRes: [],
  postMarkertDitAmountFixFinanceRes: [],
  getMarketMaterialListData: [],
  postMarketEditMaterialRes: [],
  getMarketProAllListData: [],
  postMarkertResourceCreateRes: '',
  postFinancingInformationRes: [],
  postMarketProductOfflineRes: [],
  postMarketProductOnlineRes: [],
  getProductDetailRes: [],

  productInfo: {},

  carProPage: 1,
  financialProPage: 1,
  isFetching: true,
});
export default InitialState;

