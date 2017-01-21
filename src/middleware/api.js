import {message} from 'antd';

const API_HOST = window.baseURL + '/v1/';

function getUserSession() {
  let USER_SESSION = sessionStorage.getItem('USER_SESSION');
  USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
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
    skip: 0,
  },

  hasPresalesSuperPermission(){
    let USER_SESSION = getUserSession();
    let has_purchase = USER_SESSION && USER_SESSION.has_purchase;
    let department = USER_SESSION && USER_SESSION.department;
    let role = USER_SESSION && USER_SESSION.role;
    if (!has_purchase || has_purchase === '0') return false;

    return [-3, -2, -1, 1].indexOf(department) > -1 || ([2].indexOf(department) > -1 && role === 200);
  },

  hasPresalesPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    if (!department || department === 0) return false;

    return [-3, -2, -1, 1, 2].indexOf(department) > -1;
  },

  hasAftersalesSuperPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    let role = USER_SESSION && USER_SESSION.role;
    return [-3, -2, -1, 1].indexOf(department) > -1 || ([3].indexOf(department) > -1 && role === 300);
  },

  hasAftersalesPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return [-3, -2, -1, 1, 3].indexOf(department) > -1;
  },

  hasPersonnelPermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return [-3, -2, -1, 1].indexOf(department) > -1;
  },

  hasSuperFinancePermission(){
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return [-3, -2, -1].indexOf(department) > -1;
  },

  hasMarketingPermission() {
    let USER_SESSION = getUserSession();
    let department = USER_SESSION && USER_SESSION.department;
    return [-3, -2, -1, 3].indexOf(department) > -1;
  },

  ajax: function (options, successCallback, errorCallback) {
    let USER_SESSION = getUserSession();
    let uid = USER_SESSION && USER_SESSION.department;
    if (options.permission !== 'no-login' && !uid) {
      location.href = '/login';
      return;
    }

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
        withCredentials: true,
      },
      dataType: 'json',
      data: options.data,
      success: function (data) {
        if (data.code !== 0) {
          if (data.code == 1001) {
            sessionStorage.clear();
            setTimeout(() => {
              location.reload();
            }, 0);
          } else {
            typeof(errorCallback) == 'function' ? errorCallback(data.msg) : message.error(data.msg);
          }
        } else {
          typeof(successCallback) == 'function' && successCallback(data);
        }
      },
      error: function (data) {
        typeof(errorCallback) == 'function' ? errorCallback(data) : message.error(data);
      },
    });
  },

  //七牛
  uploadURl: 'https://up.qbox.me',

  // 系统通用接口
  system: {
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
    getAppTocDownloadUrl() {
      return API_HOST + 'system/get-app-toc-download-url';
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
    list(page) {
      return API_HOST + `company/company-list?skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    keyList(key) {
      return API_HOST + `company/company-list?skip=0&limit=20&key=${key}`;
    },
    detail() {
      return API_HOST + 'company/detail?company_id=';
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

  // 车辆信息
  auto: {
    genNewId () {
      return API_HOST + 'auto/gen-new-auto-id';
    },
    add () {
      return API_HOST + 'auto/create-auto';
    },
    edit () {
      return API_HOST + 'auto/edit-auto';
    },
    detail (customerId, autoId) {
      return API_HOST + `auto/auto-detail?customer_id=${customerId}&auto_id=${autoId}`;
    },
    getUploadToken (customerId, userAutoId, fileType) {
      return API_HOST + `auto/get-auto-upload-token?customer_id=${customerId}&auto_id=${userAutoId}&file_type=${fileType}`;
    },
    getFileUrl (customerId, userAutoId, fileType) {
      return API_HOST + `auto/get-auto-file-url?customer_id=${customerId}&auto_id=${userAutoId}&file_type=${fileType}`;
    },
    getBrands () {
      return API_HOST + 'system/auto-brand-list';
    },
    getByGuidePrice (guidePrice) {
      return API_HOST + `system/search-auto-type?price=${guidePrice}`;
    },
    getSeriesByBrand (brandId) {
      return API_HOST + `system/series-list-by-brand?auto_brand_id=${brandId}`;
    },
    getTypesBySeries (seriesId) {
      return API_HOST + `system/type-list-by-series?auto_series_id=${seriesId}`;
    },
    getOutColorBySeries (seriesId) {
      return API_HOST + `system/out-color-by-series?auto_series_id=${seriesId}`;
    },
  },

  // 客户信息
  customer: {
    genNewId () {
      return API_HOST + 'customer/gen-new-id';
    },
    add () {
      return API_HOST + 'customer/create';
    },
    edit () {
      return API_HOST + 'customer/edit';
    },
    detail (customerId) {
      return API_HOST + `customer/info?customer_id=${customerId}`;
    },
    addCustomerAndAuto () {
      return API_HOST + 'customer/create-customer-and-auto';
    },
    getSourceTypes (sourceDeal) {
      return API_HOST + `customer/source-types?source_deal=${sourceDeal}`;
    },
    getMemberConfig() {
      return API_HOST + 'customer/member-level-config';
    },

    // 七牛上传token
    getUploadToken (customer_id, file_type) {
      return API_HOST + `customer/get-upload-token?customer_id=${customer_id}&file_type=${file_type}`;
    },
    getFileUrl (customer_id, file_type) {
      return API_HOST + `customer/get-file-url?customer_id=${customer_id}&file_type=${file_type}`;
    },
  },

  // 1. 首页
  index: {},

  // 2. 售前
  presales: {
    // 意向
    intention: {
      getFailTypes () {
        return API_HOST + 'purchase/intention-fail-types';
      },
      getListByCustomerId (customerId) {
        return API_HOST + `purchase/intention-list?customer_id=${customerId}`;
      },

      add () {
        return API_HOST + 'purchase/create-intention';
      },
      edit () {
        return API_HOST + 'purchase/edit-intention';
      },
      lost () {
        return API_HOST + 'purchase/intention-fail';
      },
      detail (customerId, intentionId) {
        return API_HOST + `purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
      },
    },

    // 交易
    deal: {
      addAuto () {
        return API_HOST + 'purchase/create-auto-deal';
      },
      editAuto () {
        return API_HOST + 'purchase/edit-auto-deal';
      },
      detail (customerId, autoId) {
        return API_HOST + `purchase/auto-deal-detail?customer_id=${customerId}&auto_id=${autoId}`;
      },

      addLoan () {
        return API_HOST + 'financial/create-loan-log';
      },
      editLoan () {
        return API_HOST + 'financial/edit-loan-log';
      },

      addInsurance () {
        return API_HOST + 'financial/create-insurance-log';
      },
      editInsurance () {
        return API_HOST + 'financial/edit-insurance-log';
      },

      addDecoration () {
        return API_HOST + 'purchase/create-decoration-log';
      },
      editDecoration () {
        return API_HOST + 'purchase/edit-decoration-log';
      },

      getInsuranceCompanies () {
        return API_HOST + 'financial/get-insurance-company-list';
      },
      getGuaranteeCompanies () {
        return API_HOST + 'financial/get-guarantee-company-list';
      },

      getLoanDetail (customerId, userAutoId) {
        return API_HOST + `financial/loan-log-detail?customer_id=${customerId}&auto_id=${userAutoId}`;
      },
      getInsuranceLogDetail (customerId, userAutoId) {
        return API_HOST + `financial/insurance-log-detail?customer_id=${customerId}&auto_id=${userAutoId}`;
      },
      getDecorationLogDetail (customerId, userAutoId) {
        return API_HOST + `purchase/decoration-log-detail?customer_id=${customerId}&auto_id=${userAutoId}`;
      },
    },
  },

  // 3. 售后
  aftersales: {
    maintain: {
      getUploadToken (customerId, intentionId, fileType) {
        return API_HOST + `maintain/get-operation-record-upload-token?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
      },
      getFileUrl (customerId, intentionId, fileType) {
        return API_HOST + `maintain/get-operation-record-file-url?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
      },
    },
    customer: {},
  },

  // 4. 仓库
  warehouse: {
    part: {
      list(condition){
        return API_HOST + `part/part-list?keyword=${condition.key}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      detail(partId){
        return API_HOST + `part/part-detail?part_id=${partId}`;
      },
      search(keyword){
        return API_HOST + `part/part-search?keyword=${keyword}`;
      },
      add(){
        return API_HOST + 'part/add-part';
      },
      edit(){
        return API_HOST + 'part/edit-part';
      },
      entryDocumentToken(id, type){
        return API_HOST + `part/get-godown-entry-upload-token?godown_entry_id=${id}&file_type=${type}`;
      },
      entryDocumentUrl(id, type){
        return API_HOST + `part/get-godown-entry-url?godown_entry_id=${id}&file_type=${type}`;
      },
    },

    category: {
      list(condition){
        return API_HOST + `part/part-type-list?name=${condition.name}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      add(){
        return API_HOST + 'part/add-part-type';
      },
      edit(){
        return API_HOST + 'part/edit-part-type';
      },
      search(keyword){
        return API_HOST + `part/search-part-type?keyword=${keyword}`;
      },
    },

    purchase: {
      list(condition) {
        let {page, startDate, endDate, supplierId, type, status, payStatus} = condition;
        return API_HOST + `part/purchase-list?start_date=${startDate}&end_date=${endDate}&supplier_id=${supplierId}&type=${type}&status=${status}&pay_status=${payStatus}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return API_HOST + 'part/create-purchase';
      },
      edit() {
        return API_HOST + 'part/edit-purchase';
      },
      cancel() {
        return API_HOST + 'part/cancel-purchase';
      },
      import() {
        return API_HOST + 'part/import-purchase';
      },
      pay() {
        return API_HOST + 'part/pay-purchase';
      },
      detail(id) {
        return API_HOST + `part/purchase-detail?purchase_id=${id}`;
      },
      parts(id, page) {
        return API_HOST + `part/purchase-item-list?purchase_id=${id}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      getPartLogsBySupplier(partId, supplierId, page) {
        return API_HOST + `part/purchase-item-list-by-supplier-part?part_id=${partId}&supplier_id=${supplierId}&skip=${(page - api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
      },
    },

    reject: {
      list(condition) {
        let {page, startDate, endDate, supplierId, status, payStatus} = condition;
        return API_HOST + `part/reject-list?start_date=${startDate}&end_date=${endDate}&supplier_id=${supplierId}&status=${status}&pay_status=${payStatus}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return API_HOST + 'part/create-reject';
      },
      edit() {
        return API_HOST + 'part/edit-reject';
      },
      cancel() {
        return API_HOST + 'part/cancel-reject';
      },
      export() {
        return API_HOST + 'part/export-reject';
      },
      pay() {
        return API_HOST + 'part/pay-reject';
      },
      pay(id) {
        return API_HOST + `part/reject-detail?reject_id=${id}`;
      },
      parts(id, page) {
        return API_HOST + `part/reject-item-list?reject_id=${id}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
    },

    stocktaking: {
      list(page, startDate, endDate){
        return API_HOST + `part/stocktaking-list?start_date=${startDate}&end_date=${endDate}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      parts(id, page){
        return API_HOST + `part/stocktaking-item-list?stocktaking_id=${id}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      getAllParts(id) {
        return API_HOST + `part/stocktaking-item-list?stocktaking_id=${id}&skip=0&limit=1000000`;
      },
      new() {
        return API_HOST + 'part/create-stocktaking';
      },
      edit() {
        return API_HOST + 'part/update-stocktaking-items';
      },
      cancel() {
        return API_HOST + 'part/cancel-stocktaking';
      },
      detail(id) {
        return API_HOST + `part/get-stocktaking-detail?stocktaking_id=${id}`;
      },
      auth() {
        return API_HOST + 'part/authorize-stocktaking';
      },
      import() {
        return API_HOST + 'part/import-stocktaking';
      },
      updateParts() {
        return API_HOST + 'part/update-stocktaking-items';
      },

      logs(page, startDate, endDate, type, fromType) {
        return API_HOST + `part/stock-log-list?start_date=${startDate}&end_date=${endDate}&type=${type}&from_type=${fromType}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
    },

    supplier: {
      list(condition){
        return API_HOST + `part/supplier-list?company=${condition.company}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      add(){
        return API_HOST + 'part/add-supplier';
      },
      edit(){
        return API_HOST + 'part/edit-supplier';
      },
      entryLogs(supplierId, page) {
        return API_HOST + `part/godown-entry-list-by-supplier-id?supplier_id=${supplierId}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      search(companyName) {
        return API_HOST + `part/supplier-list?company=${companyName}&skip=0&limit=-1`;
      },
      getAll() {
        return API_HOST + 'part/supplier-list?company=&skip=0&limit=-1';
      },
    },
  },

  // 5. 项目
  maintainItem: {
    list(condition) {
      return API_HOST + `maintain/item-list?name=${condition.name}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    add(){
      return API_HOST + 'maintain/add-item';
    },
    edit(){
      return API_HOST + 'maintain/edit-item';
    },
  },

  // 6. 报表 TODO 分类
  statistics: {
    // 售前
    getPurchaseSummary(startTime, endTime){
      return API_HOST + `statistic/purchase-summary?start_date=${startTime}&end_date=${endTime}`;
    },

    getNewPotentialAndIntentionDaysData(startTime, endTime){
      return API_HOST + `statistic/purchase-potential-summary-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getNewDealDaysData(startTime, endTime){
      return API_HOST + `statistic/purchase-auto-deals-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getPurchaseFailDays(startTime, endTime) {
      return API_HOST + `statistic/purchase-fail-days?start_date=${startTime}&end_date=${endTime}`;
    },

    getPurchaseIncomeInfo(startTime, endTime){
      return API_HOST + `statistic/purchase-incomes?start_date=${startTime}&end_date=${endTime}`;
    },

    getIntentionLostInfo(startTime, endTime){
      return API_HOST + `statistic/purchase-fail-types?start_date=${startTime}&end_date=${endTime}`;
    },

    getIntentionInfo(startTime, endTime){
      return API_HOST + `statistic/purchase-intentions?start_date=${startTime}&end_date=${endTime}`;
    },


    //售后
    getMaintainTypeCount(startTime, endTime) {
      return API_HOST + `statistic/maintain-type-count?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainTypeIncomes(startTime, endTime) {
      return API_HOST + `statistic/maintain-type-incomes?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainPayTypes(startTime, endTime) {
      return API_HOST + `statistic/maintain-income-pay-types?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainIncomeUnpay(startTime, endTime) {
      return API_HOST + `statistic/maintain-income-unpay?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainMembersByLevel(startTime, endTime){
      return API_HOST + `statistic/maintain-members?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainSummary(startTime, endTime){
      return API_HOST + `statistic/maintain-summary?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainCountDaysData(startTime, endTime){
      return API_HOST + `statistic/maintain-count-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainIncomeDaysData(startTime, endTime){
      return API_HOST + `statistic/maintain-incomes-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainParts(startTime, endTime) {
      return API_HOST + `statistic/maintain-parts?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainAccident(startTime, endTime) {
      return API_HOST + `statistic/maintain-accident?start_date=${startTime}&end_date=${endTime}`;
    },
    getMemberDetail(customerId, is_show_detail, is_filter_remain) {
      return API_HOST + `coupon/member-coupon-list?customer_id=${customerId}&is_show_detail=${is_show_detail}&is_filter_remain=${is_filter_remain}`;
    },
    getConsumableList(key, page, startTime, endTime, status) {
      return API_HOST + `part/consumable-list?key=${key}&start_date=${startTime}&end_date=${endTime}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}&status=${status}`;
    },
    createConsumable() {
      return API_HOST + 'part/create-consumable';
    },
    authorizeConsumable() {
      return API_HOST + 'part/authorize-consumable';
    },
    getConsumableDetail(_id) {
      return API_HOST + `part/consumable-detail?consumable_id=${_id}`;
    },
    deleteConsumable() {
      return API_HOST + 'part/delete-consumable';
    },
    editConsumable() {
      return API_HOST + 'part/edit-consumable';
    },
  },

  // 7. 财务

  // 8. 人事
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
    info() {
      return API_HOST + 'user/info';
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

    getUsersByDeptAndRole (departmentId = '', role = '') {
      return API_HOST + `user/user-list?department=${departmentId}&role=${role}`;
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
      return API_HOST + `user/salary-list?salary_group=${condition.salaryGroup}&department=${condition.department}&start_month=${condition.startMonth}&end_month=${condition.endMonth}&keyword=${condition.name}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    getDepartmentRoles(departmentId){
      return API_HOST + `user/department-roles?department=${departmentId}`;
    },

    getUsers() {
      return API_HOST + 'user/user-list';
    },

    getPurchaseUsers(isLeader){
      return API_HOST + `user/purchase-user-list?is_leader=${isLeader}`;
    },
    getMaintainUsers(isLeader){
      return API_HOST + `user/maintain-user-list?is_leader=${isLeader}`;
    },
  },

  // 9. 营销
  coupon: {
    //获取优惠
    getCouponList(condition, page) {
      return API_HOST + `coupon/coupon-item-list?skip=${((parseInt(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}&keyword=${condition.key}&status=${condition.status}&type=${condition.type}`;
    },
    //创建优惠
    createCouponItem() {
      return API_HOST + 'coupon/create-coupon-item';
    },
    //优惠状态变更
    updataCouponStatus() {
      return API_HOST + 'coupon/update-coupon-item-status';
    },


    //会员卡相关
    //创建会员卡类型
    addMemberCardType() {
      return API_HOST + 'coupon/create-member-card-type';
    },

    //会员卡类型列表
    getMemberCardTypeList(keyword, status, pageSetting = {}) {
      if (!pageSetting.page || pageSetting.page < 1) {
        pageSetting.page = 1;
      }
      if (!pageSetting.pageSize || pageSetting.pageSize < 0) {
        pageSetting.pageSize = api.config.limit;
      }
      let skip = (pageSetting.page - 1) * pageSetting.pageSize;
      let limit = pageSetting.pageSize;
      return API_HOST + `coupon/member-card-type-list?skip=${skip}&limit=${limit}&keyword=${keyword}&status=${status}`;
    },

    //会员卡详情
    getMemberCardTypeInfo(memberCardTypeId) {
      return API_HOST + `coupon/member-card-type-detail?member_card_type=${memberCardTypeId}`;
    },

    //生成会员卡，发卡
    genMemberCard() {
      return API_HOST + 'coupon/gen-member-card';
    },

    //发卡历史
    getGenMemberCardLog(memberCardTypeId){
      return API_HOST + `coupon/member-card-gen-log-list?member_card_type_id=${memberCardTypeId}&skip=${api.config.skip}&limit=${api.config.limit}`;
    },

    //更改会员卡状态
    updateMemberCardTypeStatus() {
      return API_HOST + 'coupon/update-member-card-type-status';
    },

    //会员卡导出
    exportMemberCardDistributeLog(memberCardTypeId, logId) {
      return API_HOST + `coupon/export-member-card?member_card_type_id=${memberCardTypeId}&member_card_gen_log_id=${logId}`;
    },

    //会员卡验证
    checkMemberCard() {
      return API_HOST + 'coupon/check-member-card';
    },

    //会员卡激活
    activateMemberCard() {
      return API_HOST + 'coupon/activate-member-card';
    },

    //会员卡销售记录
    getMemberOrderList(keyword, memberCardTypeId, startDate = '', endDate = '', pageSetting = {}) {
      if (!pageSetting.page || pageSetting.page < 1) {
        pageSetting.page = 1;
      }
      if (!pageSetting.pageSize || pageSetting.pageSize < 0) {
        pageSetting.pageSize = api.config.limit;
      }
      let skip = (pageSetting.page - 1) * pageSetting.pageSize;
      let limit = pageSetting.pageSize;
      return API_HOST + `coupon/member-order-list?skip=${skip}&limit=${limit}&keyword=${keyword}&member_card_type=${memberCardTypeId}&member_start_date_begin=${startDate}&member_start_date_end=${endDate}`;
    },

    //会员卡(单)结算
    payMemberOrder() {
      return API_HOST + 'coupon/pay-member-order';
    },
  },

  // 10. 任务
  task: {
    //获取续保任务列表
    getRenewalTaskList(between, status, page) {
      return API_HOST + `task/insurance-list?between=${between}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    //获取年检任务列表
    getYearlyInspectionTaskList(between, status, page) {
      return API_HOST + `task/inspection-list?between=${between}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    //获取顾客任务列表
    getCustomerTask(type, status, page) {
      return API_HOST + `task/common-list?type=${type}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    //创建顾客任务
    createCustomerTask() {
      return API_HOST + 'task/create-common-task';
    },
    //任务跟进
    taskFollowUp() {
      return API_HOST + 'task/follow-up';
    },
    //任务跟进历史
    taskFollowHistory(taskId) {
      return API_HOST + `task/follow-up-list?task_id=${taskId}`;
    },
    //获取顾客任务类型列表
    commonTaskTypeList() {
      return API_HOST + 'task/common-task-type-list';
    },
    //创建顾客任务类型列表
    createCommonTaskType() {
      return API_HOST + 'task/create-common-task-type';
    },
    //任务状态概要
    tastSummary() {
      return API_HOST + 'task/task-summary';
    },
  },


  // TODO 继续重构下面代码 ====
  getInsuranceDetail(customerId, userAutoId) {
    return API_HOST + `auto/get-insurance-info?customer_id=${customerId}&auto_id=${userAutoId}`;
  },
  getAutoPurchaseDetail(userAutoId){
    return API_HOST + `financial/purchase-detail?auto_id=${userAutoId}`;
  },
  editPurchaseIncome(userAutoId){
    return API_HOST + `financial/edit-purchase-income?auto_id=${userAutoId}`;
  },

  checkPurchaseIncome(userAutoId){
    return API_HOST + `financial/check-purchase-income?auto_id=${userAutoId}`;
  },

  //list
  autoSellPotentialList (condition) {
    return API_HOST + `purchase/potential-list?source=${condition.source}&intention_level=${condition.intention_level}`
      + `&create_day=${condition.create_day}&intention_brand=${condition.intention_brand}`
      + `&budget_level=${condition.budget_level}&is_mortgage=${condition.is_mortgage}`
      + `&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}&key=`;
  },
  autoSellCustomerList (condition) {
    return API_HOST + `purchase/customer-list?source=${condition.source}&create_day=${condition.create_day}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
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
  // searchAutoPotentialCustomerList () {
  //   return API_HOST + 'purchase/search-potential-list?key=';
  // },
  searchAutoCustomerList () {
    return API_HOST + 'purchase/customer-list?key=';
  },

  userAutoList (id) {
    return API_HOST + `auto/auto-list?customer_id=${id}`;
  },

  superUserAutoList (id) {
    return API_HOST + `auto/super-auto-list?customer_id=${id}`;
  },

  autoIntentionDetail (customerId, intentionId) {
    return API_HOST + `purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
  },
  autoDealInfo (customer_id, auto_id) {
    return API_HOST + `purchase/auto-deal-detail?customer_id=${customer_id}&auto_id=${auto_id}`;
  },
  autoInsuranceInfo (customer_id, auto_id) {
    return API_HOST + `financial/insurance-log-detail?customer_id=${customer_id}&auto_id=${auto_id}`;
  },
  autoMortgageInfo (customer_id, auto_id) {
    return API_HOST + `purchase/loan-log-detail?customer_id=${customer_id}&auto_id=${auto_id}`;
  },
  autoDecorationInfo (customer_id, auto_id) {
    return API_HOST + `purchase/decoration-log-detail?customer_id=${customer_id}&auto_id=${auto_id}`;
  },
  autoIntentionInfo (customer_id, auto_id) {
    return API_HOST + `purchase/intention-detail-by-auto-id?customer_id=${customer_id}&auto_id=${auto_id}`;
  },

  getIntentionAutoInfo (customerId, intentionId) {
    return API_HOST + `auto/auto-detail-by-intention?customer_id=${customerId}&intention_id=${intentionId}`;
  },

  //maint list
  maintPotencialCustomerList (condition) {
    return API_HOST + `maintain/potential-customer-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
  },
  maintCustomerList (condition) {
    return API_HOST + `maintain/customer-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
  },
  maintProjectList (condition) {
    return API_HOST + `maintain/intention-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
  },

  //售后搜索
  searchMaintainPotentialCustomerList () {
    return API_HOST + `maintain/search-potential-customer-list?skip=${api.config.skip}&limit=${api.config.limit}&key=`;
  },

  searchMaintainCustomerList (condition = {}) {
    return API_HOST + `maintain/search-customer-list?skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}&key=${condition.key}`;
  },

  searchMaintainProjectList (condition) {
    return API_HOST + `maintain/search-intention-list?key=${condition.key}&skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
  },

  maintPayProject () {
    return API_HOST + 'maintain/intention-payed';
  },
  payProjectByPOS () {
    return API_HOST + 'maintain/intention-pay-by-pos';
  },
  payProjectOnAccount () {
    return API_HOST + 'maintain/intention-pay-on-account';
  },


  maintPayWare () {
    return API_HOST + 'financial/pay-expenditure-sheet';
  },

  //maint project detail
  maintProjectByProjectId (customer_id, project_id) {
    return API_HOST + `maintain/intention-detail?_id=${project_id}&customer_id=${customer_id}`;
  },
  maintProjectsByAutoId (customer_id, auto_id) {
    return API_HOST + `maintain/intention-list-by-auto-id?auto_id=${auto_id}&customer_id=${customer_id}&skip=${api.config.skip}&limit=${api.config.limit}`;
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
    return API_HOST + `maintain/get-wechat-pay-url?intention_id=${id}`;
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
    return API_HOST + `part/godown-entry-list-by-part-id?part_id=${id}&skip=${((page - 1) || 0) * api.config.halfLimit}&limit=${api.config.halfLimit}`;
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

  getFinancialSummary(month) {
    return API_HOST + `financial/financial-summary?month=${month}`;
  },

  getPresalesIncomeList(condition){
    return API_HOST + `financial/purchase-income-list?start_date=${condition.start_date}&end_date=${condition.end_date}&from_type=${condition.pay_type}&plate_num=${condition.plate_num}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  newIncomeStatement(){
    return API_HOST + 'financial/create-check-sheet';
  },

  getIncomeStatementDetail(id){
    return API_HOST + `financial/check-sheet-detail?_id=${id}`;
  },

  scanQRCodeToVerify(id, type){
    return API_HOST + `financial/confirm-check-sheet-user?_id=${id}&user_type=${type}`;
  },

  confirmIncomeStatement(){
    return API_HOST + 'financial/confirm-check-sheet';
  },

  getIncomeTransferList(condition){
    return API_HOST + `financial/income-transfer-list?end_date=${condition.end_date}&company_id=${condition.company_id}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
  },

  genIncomeUntransfer(company_id, end_date){
    return API_HOST + `financial/gen-income-untransfer?end_date=${end_date}&company_id=${company_id}`;
  },

  setIncomeTransfered(){
    return API_HOST + 'financial/set-income-transfered';
  },

  incomeListByTransferId(transfer_id){
    return API_HOST + `financial/income-list-by-transfer-id?transfer_id=${transfer_id}`;
  },

  getExpenseList(page, startTime, endTime, type, sub_type){
    return API_HOST + `financial/journal-list?skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}&start_date=${startTime}&end_date=${endTime}&type=${type}&sub_type=${sub_type}`;
  },

  newDailyExpense(){
    return API_HOST + 'financial/create-journal';
  },

  newExpenseType(){
    return API_HOST + 'financial/create-journal-sub-type';
  },

  getProjectTypeList(type){
    return API_HOST + `financial/journal-sub-type-list?type=${type}&key&skip=0&limit=-1`;
  },


  potentialAutoCustomer: API_HOST + 'customer/potential-list',

  fixedAssets: {
    list(name, page) {
      return API_HOST + `fixed-assets/fixed-assets-list?key=${name}&skip=${((parseInt(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    add() {
      return API_HOST + 'fixed-assets/add-assets';
    },
    editStatus() {
      return API_HOST + 'fixed-assets/change-status';
    },
    useLogs(fixedAssetsId) {
      return API_HOST + `fixed-assets/fixed-assets-log-list?fixed_assets_id=${fixedAssetsId}`;
    },
  },

  // 广告
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

  // 活动
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

  // 评论
  comment: {
    list(condition) {
      return API_HOST + `comment/list?comment_date=${condition.comment_date}&company_id=${condition.company_id}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

};

export default api;
