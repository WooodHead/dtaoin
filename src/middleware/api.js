import {message} from 'antd';
import config from 'config';

const API_HOST = config.baseHost + '/v1/';

function getUserSession() {
  let USER_SESSION = sessionStorage.getItem('USER_SESSION');
  if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);
  return USER_SESSION;
}
// App.page = 1;

// -2:管理员
// 0:无权限
// 1:总经办
// 2:售前
// 3:售后

const api = {
  config: {
    limit: 10,
    halfLimit: 5,
    skip: 0
  },

  getHash(){
    return location.hash.replace(/#\//, '').replace(/[&]*_k=[\w]*/, '');
  },

  hasPresalesSuperPermission(){
    let USER_SESSION = getUserSession();
    let has_purchase = USER_SESSION && USER_SESSION.has_purchase;
    let department = USER_SESSION && USER_SESSION.department;
    let role = USER_SESSION && USER_SESSION.role;
    if (!has_purchase || has_purchase === '0') return false;

    return ['-3', '-2', '-1', '1'].indexOf('' + department) > -1 || (['2'].indexOf('' + department) > -1 && role === '200');
  },

  hasPresalesPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    if (!department || department === '0') return false;

    return ['-3', '-2', '-1', '1', '2'].indexOf('' + department) > -1;
  },

  hasAftersalesSuperPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    let role = USER_SESSION && USER_SESSION.role;
    return ['-3', '-2', '-1', '1'].indexOf('' + department) > -1 || (['3'].indexOf('' + department) > -1 && role === '300');
  },

  hasAftersalesPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return ['-3', '-2', '-1', '1', '3'].indexOf('' + department) > -1;
  },

  hasPersonnelPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return ['-3', '-2', '-1', '1'].indexOf('' + department) > -1;
  },

  hasSuperFinancePermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return ['-3', '-2', '-1'].indexOf('' + department) > -1;
  },

  ajax: function (options, successCallback, errorCallback) {
    let USER_SESSION = getUserSession();
    let uid = USER_SESSION && USER_SESSION.department;
    if (options.permission !== 'no-login' && !uid) {
      location.href = '#/login';
      return;
    }
    //if (!uid) {
    //  location.href = '#/login';
    //}

    if (typeof options !== 'object') {
      return;
    }

    $.ajax({
      url: options.url,
      type: options.type || 'GET',
      header: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      data: options.data,
      success: function (data) {
        if (data.code !== 0) {
          typeof(errorCallback) == 'function' ? errorCallback(data.msg) : message.error(data.msg);
        } else {
          typeof(successCallback) == 'function' && successCallback(data);
        }
      },
      error: function (data) {
        typeof(errorCallback) == 'function' ? errorCallback(data) : message.error(data);
      }
    });
  },

  //Login register
  getVerifyCode() {
    return API_HOST + 'user/get-code';
  },
  register() {
    return API_HOST + 'user/register';
  },
  login() {
    return API_HOST + 'user/login';
  },
  logout() {
    return API_HOST + 'user/logout';
  },

  //qiniu
  uploadURl: 'https://up.qbox.me',

  advert: {
    add (){
      return API_HOST + 'advert/create';
    },
    edit() {
      return API_HOST + 'advert/edit';
    },
    offline() {
      return API_HOST + 'advert/offline';
    },
    list(condition) {
      return API_HOST + `advert/list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  activity: {
    add() {
      return API_HOST + 'activity/create';
    },
    edit() {
      return API_HOST + 'activity/edit';
    },
    offline() {
      return API_HOST + 'activity/offline';
    },
    list(condition) {
      return API_HOST + `activity/list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  comment: {
    list(condition) {
      return API_HOST + `comment/list?comment_date=${condition.comment_date}&company_id=${condition.company_id}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 售后项目
  maintain: {
    getItems(condition) {
      return API_HOST + `maintain/item-list?name=${condition.name}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
    },
    addItem(){
      return API_HOST + 'maintain/add-item'
    },
    editItem(){
      return API_HOST + 'maintain/edit-item'
    },

  },

  // 仓库
  warehouse: {
    getParts(condition){
      return API_HOST + `part/part-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
    },
    getPart(partId){
      return API_HOST + `part/part-detail?part_id=${partId}`
    },
    searchPart(keyword){
      return API_HOST + `part/part-search?keyword=${keyword}`
    },
    addPart(){
      return API_HOST + 'part/add-part'
    },
    editPart(){
      return API_HOST + 'part/edit-part'
    },

    getSuppliers(condition){
      return API_HOST + `part/supplier-list?company=${condition.company}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
    },
    addSupplier(){
      return API_HOST + 'part/add-supplier'
    },
    editSupplier(){
      return API_HOST + 'part/edit-supplier'
    },
    getGodownEntryLog(condition) {
      return API_HOST + `part/godown-entry-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
    },
    getSupplierEntryLog(supplierId, page) {
      return API_HOST + `part/godown-entry-list-by-supplier-id?supplier_id=${supplierId}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
    },
    getCategories(condition){
      return API_HOST + `part/part-type-list?name=${condition.name}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
    },
    addCategory(){
      return API_HOST + 'part/add-part-type'
    },
    editCategory(){
      return API_HOST + 'part/edit-part-type'
    },
    searchCategory(keyword){
      return API_HOST + `part/search-part-type?keyword=${keyword}`
    },
  },

  // 系统
  system: {
    getProvinces() {
      return API_HOST + 'system/province-list';
    },
    getCities(province) {
      return API_HOST + `system/city-list?province=${province}`;
    },
    getCountries(province, city) {
      return API_HOST + `system/country-list?province=${province}&city=${city}`;
    },
    getPublicPicUploadToken(file_type) {
      return API_HOST + `system/get-public-pic-upload-token?file_type=${file_type}`;
    },
    getPublicPicUrl(file_name) {
      if (file_name.length == 0) return '';
      return API_HOST + `system/get-public-pic-url?file_name=${file_name}`;
    },
    getPrivatePicUploadToken(file_type) {
      return API_HOST + `system/get-private-pic-upload-token?file_type=${file_type}`;
    },
    getPrivatePicUrl(file_name) {
      if (file_name.length == 0) return '';

      return API_HOST + `system/get-private-pic-url?file_name=${file_name}`;
    },
    getAppTobDownloadUrl() {
      return API_HOST + 'system/get-app-tob-download-url';
    },
  },

  // 公司
  company: {
    add() {
      return API_HOST + 'company/create';
    },
    edit() {
      return API_HOST + 'company/edit';
    },
    list() {
      return API_HOST + 'company/company-list';
    },
    switch() {
      return API_HOST + 'company/switch-company';
    },

    getCommissionRate(){
      return API_HOST + 'company/commission-rate-detail';
    },
    editCommissionRate(){
      return API_HOST + 'company/edit-commission-rate';
    },
  },

  // 身份证及驾驶证
  getCustomerUploadToken (customer_id, file_type) {
    return API_HOST + `customer/get-upload-token?customer_id=${customer_id}&file_type=${file_type}`;
  },
  getCustomerFileUrl (customer_id, file_type) {
    return API_HOST + `customer/get-file-url?customer_id=${customer_id}&file_type=${file_type}`;
  },

  // 行驶证
  getAutoUploadToken (customerId, userAutoId, fileType) {
    return API_HOST + `auto/get-user-auto-upload-token?customer_id=${customerId}&user_auto_id=${userAutoId}&file_type=${fileType}`;
  },
  getAutoFileUrl (customerId, userAutoId, fileType) {
    return API_HOST + `auto/get-user-auto-file-url?customer_id=${customerId}&user_auto_id=${userAutoId}&file_type=${fileType}`;
  },

  //售后工单
  getOptRecordUploadToken (customerId, intentionId, fileType) {
    return API_HOST + `maintain/get-operation-record-upload-token?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
  },
  getOptRecordFileUrl (customerId, intentionId, fileType) {
    return API_HOST + `maintain/get-operation-record-file-url?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`
  },

  //warehouse parts
  getPartsEntryUploadToken(id, type){
    return API_HOST + `part/get-godown-entry-upload-token?godown_entry_id=${id}&file_type=${type}`;
  },

  getPartsEntryFileUrl(id, type){
    return API_HOST + `part/get-godown-entry-url?godown_entry_id=${id}&file_type=${type}`;
  },

  // common
  getAutoBrands () {
    return API_HOST + 'system/auto-brand-list';
  },
  getAutoByGuidePrice (guidePrice) {
    return API_HOST + `system/search-auto-type?price=${guidePrice}`;
  },
  getAutoSeriesByBrand (brandId) {
    return API_HOST + `system/series-list-by-brand?auto_brand_id=${brandId}`;
  },
  getAutoTypesBySeries (seriesId) {
    return API_HOST + `system/type-list-by-series?auto_series_id=${seriesId}`;
  },
  getAutoOutColorBySeries (seriesId) {
    return API_HOST + `system/out-color-by-series?auto_series_id=${seriesId}`;
  },

  getInsuranceCompanies () {
    return API_HOST + 'financial/get-insurance-company-list';
  },
  getGuaranteeCompanies () {
    return API_HOST + 'financial/get-guarantee-company-list';
  },

  getDepartmentUsers (departmentId, role) {
    return API_HOST + `user/user-list?department=${departmentId}&role=${role}`;
  },

  //新增
  generateNewCustomerId () {
    return API_HOST + 'customer/gen-new-id';
  },
  getSourceTypes (sourceDeal) {
    return API_HOST + `customer/source-types?source_deal=${sourceDeal}`;
  },

  getIntentionFailTypes () {
    return API_HOST + 'purchase/intention-fail-types';
  },

  generateNewAutoId () {
    return API_HOST + 'auto/gen-new-user-auto-id';
  },


  getMemberConfig() {
    return API_HOST + 'customer/member-level-config';
  },

  // 新增表单-售前
  addCustomer () {
    return API_HOST + 'customer/create';
  },
  addCustomerAndAuto () {
    return API_HOST + 'customer/create-customer-and-auto';
  },
  addIntention () {
    return API_HOST + 'purchase/create-intention';
  },
  addAuto () {
    return API_HOST + 'auto/create-user-auto';
  },
  addPurchaseDeal () {
    return API_HOST + 'purchase/create-auto-deal';
  },
  addPurchaseLoan () {
    return API_HOST + 'financial/create-loan-log';
  },
  addPurchaseInsurance () {
    return API_HOST + 'financial/create-insurance-log';
  },
  addPurchaseDecoration () {
    return API_HOST + 'purchase/create-decoration-log';
  },
  lostCustomerIntention () {
    return API_HOST + 'purchase/intention-fail';
  },

  // 修改
  editCustomer () {
    return API_HOST + 'customer/edit';
  },
  editIntention () {
    return API_HOST + 'purchase/edit-intention'
  },
  editAuto () {
    return API_HOST + 'auto/edit-user-auto';
  },
  editPurchaseAutoDeal () {
    return API_HOST + 'purchase/edit-auto-deal';
  },
  editPurchaseLoan () {
    return API_HOST + 'financial/edit-loan-log';
  },
  editPurchaseInsurance () {
    return API_HOST + 'financial/edit-insurance-log';
  },
  editPurchaseDecoration () {
    return API_HOST + 'purchase/edit-decoration-log';
  },

  // 详情
  getCustomerDetail (customerId) {
    return API_HOST + `customer/info?customer_id=${customerId}`;
  },
  getCustomerIntentions (customerId) {
    return API_HOST + `purchase/intention-list?customer_id=${customerId}`;
  },
  getIntentionDetail (customerId, intentionId) {
    return API_HOST + `purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
  },
  getAutoDetail (customerId, userAutoId) {
    return API_HOST + `auto/user-auto-detail?customer_id=${customerId}&user_auto_id=${userAutoId}`;
  },
  getPurchaseDealDetail (customerId, userAutoId) {
    return API_HOST + `purchase/auto-deal-detail?customer_id=${customerId}&user_auto_id=${userAutoId}`;
  },
  getPurchaseLoanDetail (customerId, userAutoId) {
    return API_HOST + `financial/loan-log-detail?customer_id=${customerId}&user_auto_id=${userAutoId}`;
  },
  getPurchaseInsuranceDetail (customerId, userAutoId) {
    return API_HOST + `financial/insurance-log-detail?customer_id=${customerId}&user_auto_id=${userAutoId}`;
  },
  getPurchaseDecorationDetail (customerId, userAutoId) {
    return API_HOST + `purchase/decoration-log-detail?customer_id=${customerId}&user_auto_id=${userAutoId}`;
  },

  getAutoPurchaseDetail(userAutoId){
    return API_HOST + `financial/purchase-detail?user_auto_id=${userAutoId}`;
  },

  editPurchaseIncome(userAutoId){
    return API_HOST + `financial/edit-purchase-income?user_auto_id=${userAutoId}`;
  },

  checkPurchaseIncome(userAutoId){
    return API_HOST + `financial/check-purchase-income?user_auto_id=${userAutoId}`;
  },

  //list
  autoSellPotentialList (condition) {
    return API_HOST + `purchase/potential-list?source=${condition.source}&intention_level=${condition.intention_level}&create_day=${condition.create_day}&intention_brand=${condition.intention_brand}&budget_level=${condition.budget_level}&is_mortgage=${condition.is_mortgage}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
  },
  autoSellCustomerList (condition) {
    return API_HOST + `purchase/customer-list?source=${condition.source}&create_day=${condition.create_day}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`
  },

  // 搜索
  // 搜索购车客户
  searchAutoCustomers () {
    return API_HOST + 'customer/search-customers?key=';
  },
  // 搜索车信息
  searchCustomerAutos (key) {
    return API_HOST + `customer/search-autos?key=${key}`;
  },
  searchAutoPotentialCustomerList () {
    return API_HOST + 'purchase/search-potential-list?key=';
  },
  searchAutoCustomerList () {
    return API_HOST + 'purchase/customer-list?key=';
  },

  //detail
  purchasedAutoList (id) {
    return API_HOST + `auto/user-auto-list?customer_id=${id}`
  },

  autoIntentionDetail (customerId, intentionId) {
    return API_HOST + `purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
  },
  autoDealInfo (customer_id, auto_id) {
    return API_HOST + `purchase/auto-deal-detail?customer_id=${customer_id}&user_auto_id=${auto_id}`
  },
  autoInsuranceInfo (customer_id, auto_id) {
    return API_HOST + `financial/insurance-log-detail?customer_id=${customer_id}&user_auto_id=${auto_id}`
  },
  autoMortgageInfo (customer_id, auto_id) {
    return API_HOST + `purchase/loan-log-detail?customer_id=${customer_id}&user_auto_id=${auto_id}`
  },
  autoDecorationInfo (customer_id, auto_id) {
    return API_HOST + `purchase/decoration-log-detail?customer_id=${customer_id}&user_auto_id=${auto_id}`
  },
  autoIntentionInfo (customer_id, auto_id) {
    return API_HOST + `purchase/intention-detail-by-auto-id?customer_id=${customer_id}&user_auto_id=${auto_id}`
  },

  getIntentionAutoInfo (customerId, intentionId) {
    return API_HOST + `auto/user-auto-detail-by-intention?customer_id=${customerId}&intention_id=${intentionId}`;
  },

  //maint list
  maintPotencialCustomerList (condition) {
    return API_HOST + `maintain/potential-customer-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`
  },
  maintCustomerList (condition) {
    return API_HOST + `maintain/customer-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`
  },
  maintProjectList (condition) {
    return API_HOST + `maintain/intention-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`
  },

  //售后搜索
  searchMaintainPotentialCustomerList () {
    return API_HOST + `maintain/search-potential-customer-list?skip=${api.config.skip}&limit=${api.config.limit}&key=`
  },
  searchMaintainCustomerList () {
    return API_HOST + `maintain/search-customer-list?skip=${api.config.skip}&limit=${api.config.limit}&key=`
  },
  searchMaintainProjectList () {
    return API_HOST + `maintain/search-intention-list?skip=${api.config.skip}&limit=${api.config.limit}&key=`
  },

  maintPayProject () {
    return API_HOST + 'maintain/intention-payed'
  },
  payProjectByPOS () {
    return API_HOST + 'maintain/intention-pay-by-pos'
  },
  payProjectOnAccount () {
    return API_HOST + 'maintain/intention-pay-on-account'
  },


  maintPayWare () {
    return API_HOST + 'financial/pay-expenditure-sheet'
  },

  //maint project detail
  maintProjectByProjectId (customer_id, project_id) {
    return API_HOST + `maintain/intention-detail?_id=${project_id}&customer_id=${customer_id}`
  },
  maintProjectsByAutoId (customer_id, auto_id) {
    return API_HOST + `maintain/intention-list-by-auto-id?user_auto_id=${auto_id}&customer_id=${customer_id}&skip=${api.config.skip}&limit=${api.config.limit}`
  },

  getMaintainItems () {
    return API_HOST + 'maintain/item-list';
  },

  searchMaintainItems (keyword) {
    return API_HOST + `maintain/item-search?keyword=${keyword}`;
  },

  getMaintainItemTypes() {
    return API_HOST + 'maintain/type-list';
  },
  addMaintainItem () {
    return API_HOST + 'maintain/add-item';
  },

  addMaintainIntention () {
    return API_HOST + 'maintain/create-intention';
  },

  editMaintainIntention () {
    return API_HOST + 'maintain/edit-intention';
  },

  getItemListOfMaintProj(id){
    return API_HOST + `maintain/intention-item-list?intention_id=${id}`;
  },

  getPartListOfMaintProj(id){
    return API_HOST + `maintain/intention-part-list?intention_id=${id}`;
  },

  getMaintProjPayURL(id){
    return API_HOST + `maintain/get-wechat-pay-url?intention_id=${id}`
  },

  //warehouse
  generateNewEntryId(){
    return API_HOST + 'part/gen-new-entry-id';
  },

  addPartsSupplier(){
    return API_HOST + 'part/add-supplier';
  },

  getPartsSupplierList(){
    return API_HOST + `part/supplier-list?&skip=${api.config.skip}&limit=1000`;
  },

  generatorExpenditureSheet(){
    return API_HOST + 'financial/gen-expenditure-sheet';
  },

  addNewParts(){
    return API_HOST + 'part/add-part';
  },

  addOldParts(){
    return API_HOST + 'part/stock-part';
  },

  editParts(){
    return API_HOST + 'part/edit-part';
  },

  getPartsDetail(id){
    return API_HOST + `part/part-detail?part_id=${id}`;
  },

  getPartsEntryList(id, page){
    return API_HOST + `part/godown-entry-list-by-part-id?part_id=${id}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  searchParts(key, part_type_id){
    part_type_id = part_type_id ? part_type_id : 0;
    return API_HOST + `part/part-search?keyword=${key}&part_type_id=${part_type_id}`;
  },

  searchPartTypes(key){
    return API_HOST + `part/search-part-type?keyword=${key}`;
  },


  getPartEntryImgUrl (id, fileType) {
    return API_HOST + `part/get-godown-entry-url?godown_entry_id=${id}&file_type=${fileType}`;
  },

  //finance
  getIncomeList(condition){
    return API_HOST + `financial/income-list?start_time=${condition.start_time}&end_time=${condition.end_time}&account_type=${condition.account_type}&status=${condition.status}&transfer_status=${condition.transfer_status}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  getPresalesIncomeList(condition){
    return API_HOST + `financial/purchase-income-list?start_date=${condition.start_date}&end_date=${condition.end_date}&from_type=${condition.pay_type}&plate_num=${condition.plate_num}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  newIncomeStatement(){
    return API_HOST + `financial/create-check-sheet`;
  },

  getIncomeStatementDetail(id){
    return API_HOST + `financial/check-sheet-detail?_id=${id}`;
  },

  scanQRCodeToVerify(id, type){
    return API_HOST + `financial/confirm-check-sheet-user?_id=${id}&user_type=${type}`;
  },

  confirmIncomeStatement(){
    return API_HOST + `financial/confirm-check-sheet`;
  },

  getIncomeTransferList(condition){
    return API_HOST + `financial/income-transfer-list?end_date=${condition.end_date}&company_id=${condition.company_id}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  genIncomeUntransfer(company_id, end_date){
    return API_HOST + `financial/gen-income-untransfer?end_date=${end_date}&company_id=${company_id}`;
  },

  setIncomeTransfered(){
    return API_HOST + `financial/set-income-transfered`;
  },

  incomeListByTransferId(transfer_id){
    return API_HOST + `financial/income-list-by-transfer-id?transfer_id=${transfer_id}`;
  },

  getExpenseList(condition){
    return API_HOST + `financial/expenditure-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  newDailyExpense(){
    return API_HOST + `financial/create-expenditure`;
  },

  newExpenseType(){
    return API_HOST + `financial/create-expenditure-type`;
  },

  getExpenseTypeList(){
    return API_HOST + `financial/expenditure-type-list`;
  },


  potentialAutoCustomer: API_HOST + 'customer/potential-list',

  statistics: {
    // 售前
    getPurchaseSummary(startTime, endTime){
      return API_HOST + `statistic/purchase-summary?start_time=${startTime}&end_time=${endTime}`;
    },

    getNewPotentialDaysData(startTime, endTime){
      return API_HOST + `statistic/purchase-potential-customers-days?start_time=${startTime}&end_time=${endTime}`;
    },
    getNewDealDaysData(startTime, endTime){
      return API_HOST + `statistic/purchase-auto-deals-days?start_time=${startTime}&end_time=${endTime}`;
    },
    getIncomesDaysData(startTime, endTime){
      return API_HOST + `statistic/purchase-incomes-days?start_time=${startTime}&end_time=${endTime}`;
    },

    getPurchaseIncomeInfo(startTime, endTime){
      return API_HOST + `statistic/purchase-incomes?start_time=${startTime}&end_time=${endTime}`;
    },

    getIntentionLostInfo(startTime, endTime){
      return API_HOST + `statistic/purchase-fail-types?start_time=${startTime}&end_time=${endTime}`;
    },

    getIntentionInfo(startTime, endTime){
      return API_HOST + `statistic/purchase-intentions?start_time=${startTime}&end_time=${endTime}`;
    },

    getCustomerSource(startTime, endTime){
      return API_HOST + `statistic/purchase-customers?start_time=${startTime}&end_time=${endTime}`;
    },

    //售后
    getMaintainSummary(startTime, endTime){
      return API_HOST + `statistic/maintain-summary?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainCountDaysData(startTime, endTime){
      return API_HOST + `statistic/maintain-count-days?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainWashAndDecorationDaysData(startTime, endTime){
      return API_HOST + `statistic/maintain-beauty-count-days?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainIncomeDaysData(startTime, endTime){
      return API_HOST + `statistic/maintain-incomes-days?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainMembersDaysData(startTime, endTime){
      return API_HOST + `statistic/maintain-members-days?start_time=${startTime}&end_time=${endTime}`;
    },
    getMeberDetail(customerId) {
      return API_HOST + `coupon/member-coupon-list?customer_id=${customerId}&is_show_detail=0&is_filter_remain=0`;
    },

    // 产值分类统计
    getMaintainIncomeByCategory(startTime, endTime){
      return API_HOST + `statistic/maintain-incomes?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainIncomeByProject(startTime, endTime){
      return API_HOST + `statistic/maintain-type-incomes?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainIncomeByPayType(startTime, endTime){
      return API_HOST + `statistic/maintain-income-pay-types?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainIncomeByStatus(startTime, endTime){
      return API_HOST + `statistic/maintain-income-check-status?start_time=${startTime}&end_time=${endTime}`;
    },
    getMaintainIncomeByAccident(startTime, endTime){
      return API_HOST + `statistic/maintain-income-accident?start_time=${startTime}&end_time=${endTime}`;
    },

    getMaintainMembersByLevel(startTime, endTime){
      return API_HOST + `statistic/maintain-members?start_time=${startTime}&end_time=${endTime}`;
    },

    getMaintainWarehouseByStatus(startTime, endTime){
      return API_HOST + `statistic/maintain-parts?start_time=${startTime}&end_time=${endTime}`;
    }
  },

  user: {
    genNewId(){
      return API_HOST + 'user/gen-user-new-id';
    },
    getUploadToken(userId, fileType){
      return API_HOST + `user/get-user-upload-token?user_id=${userId}&file_type=${fileType}`;
    },
    getFileUrl(userId, fileType){
      return API_HOST + `user/get-user-file-url?user_id=${userId}&file_type=${fileType}`;
    },
    add(){
      return API_HOST + 'user/create';
    },
    edit(){
      return API_HOST + 'user/edit';
    },
    fire(){
      return API_HOST + 'user/fire';
    },
    getList(condition){
      return API_HOST + `user/user-full-list?company_id=&department=${condition.department}&salary_group=${condition.salaryGroup}&keyword=${condition.key}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getDetail(userId){
      return API_HOST + `user/user-full-detail?_id=${userId}`;
    },

    // certificate
    genCaNewId(){
      return API_HOST + 'user/gen-user-ca-new-id';
    },
    getCaUploadToken(userCaId, fileType){
      return API_HOST + `user/get-user-ca-upload-token?user_ca_id=${userCaId}&file_type=${fileType}`;
    },
    getCaFileUrl(userCaId, fileType){
      return API_HOST + `user/get-user-ca-file-url?user_ca_id=${userCaId}&file_type=${fileType}`;
    },
    getCaList(userId){
      return API_HOST + `user/user-ca-list?user_id=${userId}`;
    },
    deleteUserCertificate(userId, userCaId){
      return API_HOST + `user/user-ca-delete?user_id=${userId}&_id=${userCaId}`;
    },

    // salary
    getSalaryGroups(){
      return API_HOST + 'user/salary-group-list';
    },
    getSalaryItems(userId){
      return API_HOST + `user/user-salary-items?user_id=${userId}`;
    },
    updateSalaryInfo(){
      return API_HOST + 'user/edit-salary';
    },
    prepareCalculateSalary(userId, month){
      return API_HOST + `user/prepare-calculate-salary?user_id=${userId}&month=${month}`;
    },
    calculateSalary(userId, month){
      return API_HOST + `user/calculate-salary?user_id=${userId}&month=${month}`;
    },
    getSalaryHistory(userId){
      return API_HOST + `user/self-salary-list?user_id=${userId}`;
    },
    calculateTax(){
      return API_HOST + 'user/calculate-tax';
    },
    freezeSalary(){
      return API_HOST + 'user/freeze-salary';
    },
    getSalaryList(condition) {
      return API_HOST + `user/salary-list?salary_group=${condition.salaryGroup}&department=${condition.department}&start_month=${condition.startMonth}&end_month=${condition.endMonth}&keyword=${condition.key}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    getDepartmentRoles(departmentId){
      return API_HOST + `user/department-roles?department=${departmentId}`;
    },
    getPurchaseUsers(isLeader){
      return API_HOST + `user/purchase-user-list?is_leader=${isLeader}`;
    },
    getMaintainUsers(isLeader){
      return API_HOST + `user/maintain-user-list?is_leader=${isLeader}`;
    },

  },


  coupon: {
    //获取优惠
    getCouponList(condition) {
      return API_HOST + `coupon/coupon-item-list?skip=${api.config.skip}&limit=${api.config.limit}&keyword=${condition.key}&status=${condition.status}&type=${condition.type}`
    },
    //创建优惠
    createCouponItem() {
      return API_HOST + `coupon/create-coupon-item`
    },
    //优惠状态变更
    updataCouponStatus() {
      return API_HOST + `coupon/update-coupon-item-status`
    },


    //会员卡相关
    //创建会员卡类型
    addMemberCardType() {
      return API_HOST + `coupon/create-member-card-type`
    },

    //会员卡类型列表
    getMemberCardTypeList(keyword, status, skip = null, limit = null) {
      return API_HOST + `coupon/member-card-type-list?skip=${skip || api.config.skip}&limit=${limit || api.config.limit}&keyword=${keyword}&status=${status}`
    },

    //会员卡详情
    getMemberCardTypeInfo(memberCardTypeId) {
      return API_HOST + `coupon/member-card-type-detail?member_card_type=${memberCardTypeId}`
    },

    //生成会员卡，发卡
    genMemberCard() {
      return API_HOST + `coupon/gen-member-card`
    },

    //发卡历史
    getGenMemberCardLog(memberCardTypeId){
      return API_HOST + `coupon/member-card-gen-log-list?member_card_type_id=${memberCardTypeId}&skip=${api.config.skip}&limit=${api.config.limit}`
    },

    //更改会员卡状态
    updateMemberCardTypeStatus() {
      return API_HOST + `coupon/update-member-card-type-status`
    },

    //会员卡导出
    exportMemberCardDistributeLog(memberCardTypeId, logId) {
      return API_HOST + `coupon/export-member-card?member_card_type_id=${memberCardTypeId}&member_card_gen_log_id=${logId}`
    },

    //会员卡验证
    checkMemberCard() {
      return API_HOST + `coupon/check-member-card`
    },

    //会员卡激活
    activateMemberCard() {
      return API_HOST + `coupon/activate-member-card`
    },

    //会员卡销售记录
    getMemberOrderList(keyword, memberCardTypeId, startDate = '', endDate = '') {
      return API_HOST + `coupon/member-order-list?skip=0&limit=10&keyword=${keyword}&member_card_type=${memberCardTypeId}&member_start_date_begin=${startDate}&member_start_date_end=${endDate}`
    },

    //会员卡(单)结算
    payMemberOrder() {
      return API_HOST + `coupon/pay-member-order`
    },

  },

};

export default api
