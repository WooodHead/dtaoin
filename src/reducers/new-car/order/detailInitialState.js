const { Record } = require('immutable');

const InitialState = Record({
  detail: {},
  outColor: [],

  // 申请材料相关
  applicationDownloadInfo: [],
  applicationMaterialList: [],

  //  交车材料相关
  dealDownloadInfo: [],
  pickupMaterialList: [],

  //  收益信息:
  profitDetail: {},

  // 保险信息
  insuranceCompanys: [],
  insuranceListMap: new Map(),
  insuranceConfigMap: new Map(),
  insuranceDetail: {},
});

export default InitialState;

