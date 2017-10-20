/**
 * order detail reducer
 */
const InitialState = require('./productInitalState').default;

const {
  GET_MARKETLISTSUCCESS,
  GET_MARKETLISTREQUEST,
  POST_MARKERTPRODUCTCREATEREQUEST,
  POST_MARKERTPRODUCTCREATERESUCCESS,
  POST_MARKERTPRODUCTRISKREQUEST,
  POST_MARKERTPRODUCTRISKSUCCESS,
  POST_MARKERTDITAMOUNTFIXFINANCEREQUEST,
  POST_MARKERTDITAMOUNTFIXFINANCESUCCESS,
  GET_MARKERTMATERIALLISTDATAREQUEST,
  GET_MARKERTMATERIALLISTDATASUCCESS,
  POST_MARKERTEDITMATERIALREQUESTREQUEST,
  POST_MARKERTEDITMATERIALREQUESTSUCCESS,
  GET_MARKERTPROALLLISTREQUEST,
  GET_MARKERTPROALLLISTSUCCESS,
  POST_MARKERTRESOURCECREATEREQUEST,
  POST_MARKERTRESOURCECREATESUCCESS,
  POST_MARKERTEDITLOANFINANCEREQUEST,
  POST_MARKERTEDITLOANFINANCESUCCESS,
  POST_MARKERTPRODUCTOFFLINEREQUEST,
  POST_MARKERTPRODUCTOFFLINESUCCESS,
  POST_MARKERTPRODUCTONLINEREQUEST,
  POST_MARKERTPRODUCTONLINESUCCESS,
  GET_PRODUCTDETAILREQUEST,
  GET_PRODUCTDETAILSUCCESS,

  SET_CARPRO_PAGE,
  SET_FINANCIALPRO_PAGE,
  GET_NEWCAR_MATERIAL_FAILURE,
} = require('../../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
  case GET_MARKETLISTREQUEST:
    break;
  case GET_MARKETLISTSUCCESS:
    return state.set('getMarketListData', action.payload).set('isFetching', false);
  case POST_MARKERTPRODUCTCREATEREQUEST:
    break;
  case POST_MARKERTPRODUCTCREATERESUCCESS:
    return state.set('postProductCreateRes', action.payload);
  case POST_MARKERTPRODUCTRISKREQUEST:
    break;
  case POST_MARKERTPRODUCTRISKSUCCESS:
    return state.set('postMarkertPeditRiskRes', action.payload);
  case POST_MARKERTEDITLOANFINANCEREQUEST:
    break;
  case POST_MARKERTEDITLOANFINANCESUCCESS:
    return state.set('postFinancingInformationRes', action.payload);
  case POST_MARKERTDITAMOUNTFIXFINANCEREQUEST:
    break;
  case POST_MARKERTDITAMOUNTFIXFINANCESUCCESS:
    return state.set('postFinancingInformationRes', action.payload);
  case GET_MARKERTMATERIALLISTDATAREQUEST:
    break;
  case GET_MARKERTMATERIALLISTDATASUCCESS:
    return state.set('getMarketMaterialListData', action.payload);
  case POST_MARKERTEDITMATERIALREQUESTREQUEST:
    break;
  case POST_MARKERTEDITMATERIALREQUESTSUCCESS:
    return state.set('postMarketEditMaterialRes', action.payload);
  case GET_MARKERTPROALLLISTREQUEST:
    break;
  case GET_MARKERTPROALLLISTSUCCESS:
    return state.set('getMarketProAllListData', action.payload);
  case POST_MARKERTRESOURCECREATEREQUEST:
    break;
  case POST_MARKERTRESOURCECREATESUCCESS:
    return state.set('postMarkertResourceCreateRes', action.payload);
  case POST_MARKERTPRODUCTOFFLINEREQUEST:
    break;
  case POST_MARKERTPRODUCTOFFLINESUCCESS:
    return state.set('postMarketProductOfflineRes', action.payload);
  case POST_MARKERTPRODUCTONLINEREQUEST:
    break;
  case POST_MARKERTPRODUCTONLINESUCCESS:
    return state.set('postMarketProductOnlineRes', action.payload);
  case GET_PRODUCTDETAILREQUEST:
    break;
  case GET_PRODUCTDETAILSUCCESS:
    const detail = action.payload.detail;
    return state.set('getProductDetailRes', detail).set('productInfo', action.payload);

  case SET_CARPRO_PAGE:
    return state.set('carProPage', action.payload);
  case SET_FINANCIALPRO_PAGE:
    return state.set('financialProPage', action.payload);

  case GET_NEWCAR_MATERIAL_FAILURE:
    return state.set('isFetching', false);
  }
  return state;
}
