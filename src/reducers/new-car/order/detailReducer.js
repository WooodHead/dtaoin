const InitialState = require('./detailInitialState').default;

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

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_ORDERS_DETAIL_REQUEST:
    break;
  case GET_ORDERS_DETAIL_SUCCESS:
    const { detail, application_material_list, pickup_material_list } = action.payload;
    return state.set('detail', detail).set('applicationMaterialList', application_material_list).
        set('pickupMaterialList', pickup_material_list);

  case GET_ORDERS_OUTCOLOR_REQUEST:
    break;
  case GET_ORDERS_OUTCOLOR_SUCCESS:
    return state.set('outColor', action.payload);

  case SET_ORDERS_APPLICATION_DOWNLOAD_INFO:
    return state.set('applicationDownloadInfo', action.payload);

  case SET_ORDERS_DEAL_DOWNLOAD_INFO:
    return state.set('dealDownloadInfo', action.payload);
  case GET_ORDER_INSURANCE_COMPANY_REQUEST:
    break;
  case GET_ORDER_INSURANCE_COMPANY_SUCCESS:
    return state.set('insuranceCompanys', action.payload);

  case SET_ORDER_INSRUANCE_DETAIL_MAP:
    return state.set('insuranceListMap', action.payload);

  case GET_ORDER_INSURANCE_CONFIG_REQUEST:
    break;
  case GET_ORDER_INSURANCE_CONFIG_SUCCESS:
    const insuranceConfig = action.payload;
    const insuranceConfigMap = new Map();

    insuranceConfig.forEach(item => {
      insuranceConfigMap.set(item._id, item);
    });

    return state.set('insuranceConfigMap', insuranceConfigMap);

  case GET_INSURANCE_LOG_DETAIL_REQUEST:
    break;
  case GET_INSURANCE_LOG_DETAIL_SUCCESS:
    const insuranceDetail = action.payload;

    const insuranceListMap = new Map();
    if (!!insuranceDetail) {
      try {
        const insuranceList = JSON.parse(insuranceDetail.content);
        insuranceList.forEach(item => {
          insuranceListMap.set(item._id, item);
        });
      } catch (e) {
      }
    }
    return state.set('insuranceDetail', insuranceDetail || {}).
        set('insuranceListMap', insuranceListMap);

  case GET_PROFIT_DETAIL_REQUEST:
    break;
  case GET_PROFIT_DETAIL_SUCCESS:
    return state.set('profitDetail', action.payload);
  }
  return state;
}
