import {message} from 'antd';

const API_HOST = window.baseURL + '/v1/';
const API_HOST_ADMIN = window.baseURL + '/admin/';

function getUserSession() {
  let USER_SESSION = localStorage.getItem('USER_SESSION') ? window.decodeURIComponent(window.atob(localStorage.getItem('USER_SESSION'))) : '';
  USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
  return USER_SESSION;
}

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

  getLoginUser() {
    let USER_SESSION = localStorage.getItem('USER_SESSION') ? window.decodeURIComponent(window.atob(localStorage.getItem('USER_SESSION'))) : '';
    if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);
    const uid = USER_SESSION && USER_SESSION.uid || null;
    const companyId = USER_SESSION && USER_SESSION.company_id || null;
    const name = USER_SESSION && USER_SESSION.name || null;
    const department = USER_SESSION && USER_SESSION.department;
    const departmentName = USER_SESSION && USER_SESSION.department_name;
    const companyName = USER_SESSION && USER_SESSION.company_name || null;
    const companyNum = USER_SESSION && USER_SESSION.company_num || null;
    const hasPurchase = USER_SESSION && USER_SESSION.has_purchase || null;
    const role = USER_SESSION && USER_SESSION.role || null;
    const userType = USER_SESSION && USER_SESSION.user_type || null;
    const isPosDevice = USER_SESSION && USER_SESSION.is_pos_device || null;
    const cooperationTypeName = USER_SESSION && USER_SESSION.cooperation_type_name;
    const cooperationTypeShort = USER_SESSION && USER_SESSION.cooperation_type_short;
    const operationName = USER_SESSION && USER_SESSION.operation_name;
    const operationPhone = USER_SESSION && USER_SESSION.operation_phone;

    return {
      uid,
      name,
      department,
      departmentName,
      companyId,
      companyName,
      companyNum,
      hasPurchase,
      role,
      userType,
      isPosDevice,
      cooperationTypeName,
      cooperationTypeShort,
      operationName,
      operationPhone,
    };
  },

  getUserPermissions() {
    let userPermission = localStorage.getItem('user_permission') ? window.decodeURIComponent(window.atob(localStorage.getItem('user_permission'))) : [];
    return userPermission;
  },

  isLogin() {
    return !!api.getLoginUser().uid;
  },

  isHeadquarters() {
    return Number(api.getLoginUser().companyId) === 1;
  },

  isSuperAdministrator() {
    return Number(api.getLoginUser().userType) === 3;
  },

  isChainAdministrator() {
    return Number(api.getLoginUser().userType) === 1;
  },

  isStoreGeneralManager() {
    return Number(api.getLoginUser().userType) === 0 && Number(api.getLoginUser().department) === 1 && Number(api.getLoginUser().role) === 100;
  },

  checkPermission(path) {
    return new Promise((resolve, reject) => {
      if (api.isSuperAdministrator() || api.isChainAdministrator() || api.isStoreGeneralManager()) {
        resolve(true);
      }
      api.ajax({url: api.user.checkPermission(path)}, () => {
        resolve(true);
      }, () => {
        reject(false);
      });
    });
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
            localStorage.clear();
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

    //七牛
    uploadURl: 'https://up.qbox.me',

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

  //总公司后台接口
  // 1、总公司管理员
  admin: {
    account: {
      list(condition) {
        return API_HOST_ADMIN + `user/super-user-list?keyword=${condition.key}&user_type=${condition.userType}&skip=${(condition.page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return API_HOST_ADMIN + 'user/create-super-user';
      },
      edit() {
        return API_HOST_ADMIN + 'user/edit-super-user';
      },
      detail(id) {
        return API_HOST_ADMIN + `user/super-user-detail?_id=${id}`;
      },
      modifyStatus() {
        return API_HOST_ADMIN + 'user/update-login-status';
      },
    },

    permission: {
      list(parentId) {
        return API_HOST_ADMIN + `auth/item-list?parent_id=${parentId}`;
      },
      add() {
        return API_HOST_ADMIN + 'auth/create-item';
      },
      edit() {
        return API_HOST_ADMIN + 'auth/edit-item';
      },
      delete() {
        return API_HOST_ADMIN + 'auth/delete-item';
      },
      updateByRole() {
        return API_HOST_ADMIN + 'auth/update-role-item';
      },
      getByRole(roleId) {
        return API_HOST_ADMIN + `auth/role-item-list?role=${roleId}`;
      },

      updateBySystem() {
        return API_HOST_ADMIN + 'auth/update-system-item';
      },
      getBySystem(systemType) {
        return API_HOST_ADMIN + `auth/system-item-list?system_type=${systemType}`;
      },
    },
  },

  // 2、公司
  company: {
    add() {
      return API_HOST_ADMIN + 'company/create';
    },
    edit() {
      return API_HOST_ADMIN + 'company/edit';
    },
    list(page) {
      return API_HOST_ADMIN + `company/company-list?skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getAll() {
      return API_HOST_ADMIN + 'company/company-list?skip=0&limit=-1';
    },
    keyList(key) {
      return API_HOST_ADMIN + `company/company-list?skip=0&limit=20&key=${key}`;
    },
    detail() {
      return API_HOST_ADMIN + 'company/detail?company_id=';
    },
    switch() {
      return API_HOST_ADMIN + 'company/switch-company';
    },

    getCommissionRate(){
      return API_HOST_ADMIN + 'company/commission-rate-detail';
    },
    editCommissionRate(){
      return API_HOST_ADMIN + 'company/edit-commission-rate';
    },

    //TODO 获取公司角色的权限
    getRolePermissions(roleId) {
      return API_HOST_ADMIN + `user/company-role-item-list?role=${roleId}`;
    },
  },

  //3、总览
  overview: {
    companyList(condition) {
      return API_HOST_ADMIN + (`company/company-list?skip=${((condition.page - 1) || api.config.skip) * 15}
      &limit=${condition.limit || 15}
      &province=${condition.province || ''}
      &city=${condition.city || ''}
      &country=${condition.country || ''}
      &expire_day=${condition.expireDay || ''}
      &company_type=${condition.companyType || ''}
      &cooperation_type=${condition.cooperationType || ''}
      &key=${condition.key || ''}`).replace(/\s/g, '');
    },
    getAgentList(key, page) {
      return API_HOST_ADMIN + `company/sell-agent-list?skip=${((page - 1) || api.config.skip) * api.config.limit}&limit=${'-1'}&key=${key}`;
    },
    createSellAgent() {
      return API_HOST_ADMIN + 'company/create-sell-agent';
    },
    createCompany() {
      return API_HOST_ADMIN + 'company/create';
    },
    editCompany() {
      return API_HOST_ADMIN + 'company/edit';
    },
    getCompanyDetail(id) {
      return API_HOST_ADMIN + `company/detail?company_id=${id}`;
    },
    editBank() {
      return API_HOST_ADMIN + 'company/edit-bank';
    },
    editApp() {
      return API_HOST_ADMIN + 'company/edit-app';
    },
    editPos() {
      return API_HOST_ADMIN + 'company/edit-pos';
    },
    editContact() {
      return API_HOST_ADMIN + 'company/edit-contact';
    },
    getChainList(key, page) {
      return API_HOST_ADMIN + `chain/chain-list?key=${key}&skip=${((page - 1) || api.config.skip) * 15}&limit=${15}`;
    },
    getAllChains() {
      return API_HOST_ADMIN + 'chain/chain-list?key=&skip=0&limit=-1';
    },
    createChain() {
      return API_HOST_ADMIN + 'chain/create';
    },
    editChain() {
      return API_HOST_ADMIN + 'chain/edit';
    },

    statistics: {
      getCompanyMaintainTodaySummary(companyId) {
        return API_HOST_ADMIN + `statistic/company-maintain-today-summary?company_id=${companyId}`;
      },
      getChainMaintainTodaySummary() {
        return API_HOST_ADMIN + 'statistic/chain-maintain-today-summary';
      },
      getAllMaintainTodaySummary() {
        return API_HOST_ADMIN + 'statistic/all-maintain-today-summary';
      },
      getAllMaintainSummaryDays(startTime, endTime) {
        return API_HOST_ADMIN + `statistic/all-maintain-summary-days?start_date=${startTime}&end_date=${endTime}`;
      },
      getChainMaintainSummaryDays(startTime, endTime) {
        return API_HOST_ADMIN + `statistic/chain-maintain-summary-days?start_date=${startTime}&end_date=${endTime}`;
      },
    },
  },

  // 4、广告
  advert: {
    add (){
      return API_HOST_ADMIN + 'advert/create';
    },
    edit() {
      return API_HOST_ADMIN + 'advert/edit';
    },
    offline() {
      return API_HOST_ADMIN + 'advert/offline';
    },
    list(condition) {
      return API_HOST_ADMIN + `advert/list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 5、活动
  activity: {
    add() {
      return API_HOST_ADMIN + 'activity/create';
    },
    edit() {
      return API_HOST_ADMIN + 'activity/edit';
    },
    offline() {
      return API_HOST_ADMIN + 'activity/offline';
    },
    list(condition) {
      return API_HOST_ADMIN + `activity/list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 6、评论
  comment: {
    list(condition) {
      return API_HOST_ADMIN + `comment/list?comment_date=${condition.comment_date}&company_id=${condition.company_id}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 7、问题管理
  question: {
    list(condition) {
      return API_HOST_ADMIN + `question/question-list?company_id=${condition.companyId}&type=${condition.type}&status=${condition.status}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    listOfUnbalance(condition) {
      return API_HOST_ADMIN + `question/unbalance-question-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    listOfMine(condition) {
      return API_HOST_ADMIN + `question/my-question-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    listOfCompany(condition) {
      return API_HOST_ADMIN + `question/company-question-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    detail(id) {
      return API_HOST_ADMIN + `question/question-detail?question_id=${id}`;
    },

    adoptAllAnswer(id) {
      return API_HOST_ADMIN + `question/adopt-all-dialog?question_id=${id}`;
    },

    shield() {
      return API_HOST_ADMIN + 'question/delete-question';
    },

    shieldDialog() {
      return API_HOST_ADMIN + 'question/delete-question-dialog';
    },

    dialogList(id){
      return API_HOST_ADMIN + `question/question-dialog-list?question_id=${id}`;
    },
    dialogItemList(id, dialogId){
      return API_HOST_ADMIN + `question/question-dialog-item-list?question_id=${id}&dialog_id=${dialogId}`;
    },
  },

  // 8、技师管理
  technician: {
    list(condition) {
      return API_HOST_ADMIN + `artificer/list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}&brand=${condition.brand}&status=${condition.status}`;
    },
    settlement() {
      return API_HOST_ADMIN + 'artificer/withdraw';
    },
    detail(id) {
      return API_HOST_ADMIN + `artificer/detail?artificer_id=${id}`;
    },
    auditLogList(id) {
      return API_HOST_ADMIN + `artificer/audit-log-list?artificer_id=${id}`;
    },
    withDrawList(id, page) {
      return API_HOST_ADMIN + `artificer/withdraw-list?artificer_id=${id}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    auditExamine(id) {
      return API_HOST_ADMIN + `artificer/audit?artificer_id=${id}`;
    },
    editAlipayAccount(id) {
      return API_HOST_ADMIN + `artificer/edit-alipay-account?artificer_id=${id}`;
    },
  },

  //9、authority
  authority: {
    list(id) {
      return API_HOST_ADMIN + `auth/item-list?parent_id=${id}`;
    },
    edit() {
      return API_HOST_ADMIN + 'auth/edit-item';
    },
    delete() {
      return API_HOST_ADMIN + 'auth/delete-item';
    },
    create() {
      return API_HOST_ADMIN + 'auth/create-item';
    },
  },


  //门店接口

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
    getFileUrl (customerId, autoId, fileType) {
      return API_HOST + `auto/get-auto-file-url?customer_id=${customerId}&auto_id=${autoId}&file_type=${fileType}`;
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
    getCustomerUnpayAmount(customer_id) {
      return API_HOST + `customer/total-unpay-amount?customer_id=${customer_id}`;
    },
    getCustomerPayLog() {
      return API_HOST + 'maintain/intention-pay-log';
    },
    searchCustomer(key) {
      return API_HOST + `customer/search-customers?key=${key}`;
    },

    // 七牛上传token
    getUploadToken (customer_id, file_type) {
      return API_HOST + `customer/get-upload-token?customer_id=${customer_id}&file_type=${file_type}`;
    },
    getFileUrl (customer_id, file_type) {
      return API_HOST + `customer/get-file-url?customer_id=${customer_id}&file_type=${file_type}`;
    },
  },

  // 1. 销售
  presales: {
    // 1.意向客户
    intention: {
      list (condition) {
        let {page, key, source, intention_level, create_day, intention_brand, budget_level, is_mortgage} = condition;
        return API_HOST + `purchase/potential-list?key=${key}&source=${source}&intention_level=${intention_level}`
          + `&create_day=${create_day}&intention_brand=${intention_brand}`
          + `&budget_level=${budget_level}&is_mortgage=${is_mortgage}`
          + `&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
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

      getIntentionDetailByAutoId (customerId, autoId) {
        return API_HOST + `purchase/intention-detail-by-auto-id?customer_id=${customerId}&auto_id=${autoId}`;
      },

      getListByCustomerId (customerId) {
        return API_HOST + `purchase/intention-list-by-customer-id?customer_id=${customerId}`;
      },

      getFailTypes () {
        return API_HOST + 'purchase/intention-fail-types';
      },
      getBudgetLevels () {
        return API_HOST + 'purchase/intention-budget-levels';
      },

    },

    // 2. 成交单
    deal: {
      list(condition) {
        return API_HOST + `purchase/auto-deal-list?key=${condition.key}&pay_status=${condition.payStatus}&last_deal_days=${condition.lastDealDays}&skip=${(condition.page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return API_HOST + 'purchase/create-auto-deal';
      },
      edit() {
        return API_HOST + 'purchase/edit-auto-deal';
      },
      detail (customerId, autoId) {
        return API_HOST + `purchase/auto-deal-detail?customer_id=${customerId}&auto_id=${autoId}`;
      },
      getAutoDealDetailByAutoId(customerId, autoId) {
        return API_HOST + `purchase/auto-deal-detail-by-auto-id?customer_id=${customerId}&auto_id=${autoId}`;

      },
      listByCustomerId(customerId) {
        return API_HOST + `purchase/auto-deal-list-by-customer-id?customer_id=${customerId}`;
      },

      auth(id) {
        return API_HOST + `financial/auth-purchase-income?auto_deal_id=${id}`;
      },

      addAuto () {
        return API_HOST + 'purchase/create-auto-deal';
      },
      editAuto () {
        return API_HOST + 'purchase/edit-auto-deal';
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

      getLoanDetail (customerId, autoDealId) {
        return API_HOST + `financial/loan-log-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
      },
      getInsuranceLogDetail (customerId, autoDealId) {
        return API_HOST + `financial/insurance-log-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
      },
      getDecorationLogDetail (customerId, autoDealId) {
        return API_HOST + `purchase/decoration-log-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
      },
    },

    getInsuranceDetail(customerId, autoId) {
      return API_HOST + `auto/get-insurance-info?customer_id=${customerId}&auto_id=${autoId}`;
    },
    getAutoPurchaseDetail(autoDealId){
      return API_HOST + `financial/purchase-detail?auto_deal_id=${autoDealId}`;
    },
    editPurchaseIncome(autoDealId){
      return API_HOST + `financial/edit-purchase-income?auto_deal_id=${autoDealId}`;
    },
    checkPurchaseIncome(autoDealId){
      return API_HOST + `financial/check-purchase-income?auto_deal_id=${autoDealId}`;
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

    searchAutoCustomers () {
      return API_HOST + 'customer/search-customers?key=';
    },

    searchCustomerAutos (key) {
      return API_HOST + `customer/search-autos?key=${key}`;
    },

    searchAutoCustomerList () {
      return API_HOST + 'purchase/customer-list?key=';
    },

    userAutoList (id) {
      return API_HOST + `auto/auto-list?customer_id=${id}`;
    },

    superUserAutoList (id) {
      return API_HOST + `auto/super-auto-list?customer_id=${id}`;
    },

    autoIntentionDetail (customerId, autoDealId) {
      return API_HOST + `purchase/auto-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
    },

    autoDealInfo (customer_id, autoDealId) {
      return API_HOST + `purchase/auto-deal-detail?customer_id=${customer_id}&auto_deal_id=${autoDealId}`;
    },

    autoIntentionInfo (customer_id, auto_id) {
      return API_HOST + `purchase/intention-detail-by-auto-id?customer_id=${customer_id}&auto_id=${auto_id}`;
    },

    getIntentionAutoInfo (customerId, intentionId) {
      return API_HOST + `purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
    },
  },

  // 2. 售后
  aftersales: {
    maintain: {
      getUploadToken (customerId, intentionId, fileType) {
        return API_HOST + `maintain/get-operation-record-upload-token?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
      },
      getFileUrl (customerId, intentionId, fileType) {
        return API_HOST + `maintain/get-operation-record-file-url?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
      },
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

    project: {
      list(condition) {
        let {page, key, status, pay_status} = condition;
        return API_HOST + `maintain/search-intention-list?key=${key}&status=${status}&pay_status=${pay_status}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      destroy() {
        return API_HOST + 'maintain/intention-cancel';
      },
      finish() {
        return API_HOST + 'maintain/intention-finish';
      },
      detail (id) {
        return API_HOST + `maintain/intention-detail?_id=${id}`;
      },
    },

    //maint list
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
      let limit = condition.limit || api.config.limit;
      return API_HOST + `maintain/search-customer-list?key=${condition.key}&skip=${(limit === -1 ? 0 : (condition.page - 1) || api.config.skip) * limit}&limit=${limit}`;
    },

    searchMaintainProjectList (condition) {
      return API_HOST + `maintain/search-intention-list?key=${condition.key}&status=${condition.status}&skip=${((condition.page - 1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
    },

    payProjectByPOS () {
      return API_HOST + 'maintain/intention-pay-by-pos';
    },

    payProjectOnAccount () {
      return API_HOST + 'maintain/intention-pay-on-account';
    },

    payProjectOnRepayment () {
      return API_HOST + 'maintain/intention-pay-back';
    },

    //maint project detail
    maintProjectByProjectId (project_id) {
      return API_HOST + `maintain/intention-detail?_id=${project_id}`;
    },

    maintProjectsByAutoId (customer_id, auto_id) {
      return API_HOST + `maintain/intention-list-by-auto-id?auto_id=${auto_id}&customer_id=${customer_id}&skip=${api.config.skip}&limit=${api.config.limit}`;
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

    //配件销售
    createPartSell() {
      return API_HOST + 'part-sell/create';
    },
    getPartSellDetail(order_id) {
      return API_HOST + `part-sell/detail?order_id=${order_id}`;
    },
    getPartSellPartList(order_id) {
      return API_HOST + `part-sell/part-list?order_id=${order_id}`;
    },
    partSellPayByPos() {
      return API_HOST + 'part-sell/pay-by-pos';
    },
    partSellPayOnAccount() {
      return API_HOST + 'part-sell/pay-on-account';
    },
    partSellPayBack() {
      return API_HOST + 'part-sell/pay-back';
    },
    partSellEdit() {
      return API_HOST + 'part-sell/edit';
    },
    partSellPayLog() {
      return API_HOST + 'part-sell/pay-log';
    },
    getPartSellList(condition) {
      let {key, status, page} = condition;
      return API_HOST + `part-sell/list?skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}&key=${key}&status=${status}`;
    },
  },

  // 3. 仓库
  warehouse: {
    part: {
      list(condition){
        return API_HOST + `part/part-list?keyword=${condition.key}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      stockLogs(partId, page){
        return API_HOST + `part/stock-log-list?part_id=${partId}&type=-1&type_from=-1&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      detail(partId){
        return API_HOST + `part/part-detail?part_id=${partId}`;
      },
      search(keyword){
        return API_HOST + `part/part-search?keyword=${keyword}`;
      },
      searchByTypeId(key, partTypeId, supplierId){
        partTypeId = partTypeId ? partTypeId : 0;
        supplierId = supplierId ? supplierId : 0;
        return API_HOST + `part/part-search?keyword=${key}&part_type_id=${partTypeId}&supplier_id=${supplierId}`;
      },
      searchPartTypes(key){
        return API_HOST + `part/search-part-type?keyword=${key}`;
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
        return API_HOST + `part/part-type-list?name=${condition.key}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
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
      search(companyName) {
        return API_HOST + `part/supplier-list?company=${companyName}&skip=0&limit=-1`;
      },
      getAll() {
        return API_HOST + 'part/supplier-list?company=&skip=0&limit=-1';
      },
      pay() {
        return API_HOST + 'part/pay-supplier';
      },
    },

    purchase: {
      list(condition) {
        let {page, startDate, endDate, supplierId, type, status, payStatus} = condition;
        return API_HOST + `part/purchase-list?start_date=${startDate}&end_date=${endDate}&supplier_id=${supplierId}&type=${type}&status=${status}&pay_status=${payStatus}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      getListBySupplierAndPayStatus(supplierId, payStatus, page) {
        return API_HOST + `part/purchase-list?start_date=&end_date=&supplier_id=${supplierId}&type=-1&status=1&pay_status=${payStatus}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      getAllBySupplierAndPayStatus(supplierId, payStatus) {
        return API_HOST + `part/purchase-list?start_date=&end_date=&supplier_id=${supplierId}&type=-1&status=1&pay_status=${payStatus}&skip=0&limit=-1`;
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
      items(id, page) {
        return API_HOST + `part/purchase-item-list?purchase_id=${id}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      itemsBySupplierAndPart(partId, supplierId, page) {
        return API_HOST + `part/purchase-item-list-by-supplier-part?part_id=${partId}&supplier_id=${supplierId}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
    },

    reject: {
      list(condition) {
        let {page, startDate, endDate, supplierId, status, payStatus} = condition;
        return API_HOST + `part/reject-list?start_date=${startDate}&end_date=${endDate}&supplier_id=${supplierId}&status=${status}&pay_status=${payStatus}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      getListBySupplierAndPayStatus(supplierId, payStatus, page) {
        return API_HOST + `part/reject-list?start_date=&end_date=&supplier_id=${supplierId}&status=1&pay_status=${payStatus}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
      getAllBySupplierAndPayStatus(supplierId, payStatus) {
        return API_HOST + `part/reject-list?start_date=&end_date=&supplier_id=${supplierId}&status=1&pay_status=${payStatus}&skip=0&limit=-1`;
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
      detail(id) {
        return API_HOST + `part/reject-detail?reject_id=${id}`;
      },
      items(id, page) {
        return API_HOST + `part/reject-item-list?reject_id=${id}&skip=${(page - 1) * api.config.limit}&limit=${api.config.limit}`;
      },
    },

    stocktaking: {
      list(condition){
        let {page, startDate, endDate} = condition;
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

      logs(condition) {
        let {page, startDate, endDate, type, fromType} = condition;
        return API_HOST + `part/stock-log-list?start_date=${startDate}&end_date=${endDate}&type=${type}&from_type=${fromType}&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
    },
  },

  // 4. 项目
  maintainItem: {
    list(condition) {
      return API_HOST + `maintain/item-list?name=${condition.key}&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    add(){
      return API_HOST + 'maintain/add-item';
    },
    edit(){
      return API_HOST + 'maintain/edit-item';
    },
  },

  // 5. 报表
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

  },


  // 6、财务
  finance: {
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

    getProjectTypeList(type, showAll = 0){
      return API_HOST + `financial/journal-sub-type-list?show_all=${showAll}&type=${type}&key&skip=0&limit=-1`;
    },

    fixedAssets: {
      list(condition) {
        let {name, page} = condition;
        return API_HOST + `fixed-assets/fixed-assets-list?key=${name}&skip=${((parseInt(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      listById(id) {
        return API_HOST + `fixed-assets/fixed-assets-detail?fixed_assets_id=${id}`;
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
  },

  // 7. 人事
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
      // return API_HOST + 'user/edit-salary';
      return API_HOST + 'user/edit-salary-v2';
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

    getAllDepartmentRoles() {
      return API_HOST + 'user/all-department-roles';
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

    // permission
    // 1. 员工所属公司的全部权限
    getCompanyPermissions() {
      return API_HOST + 'user/company-auth-item-list';
    },

    // 2. 员工的全部权限
    getUserPermissions(userId) {
      return API_HOST + `user/user-auth-item-list?user_id=${userId}`;
    },

    // 3. 员工所属角色的全部权限
    getRolePermissions(roleId) {
      return API_HOST + `user/company-role-item-list?role=${roleId}`;
    },

    // 登录获取全部权限
    getAllPermission() {
      return API_HOST + 'user/self-auth-item-list';
    },
    editPermission() {
      return API_HOST + 'user/edit-auth';
    },
    checkPermission(path) {
      return API_HOST + `user/check-auth?path=${path}`;
    },
  },


// 8. 营销
  coupon: {
    getCouponList(condition) {
      return API_HOST + `coupon/coupon-item-list?skip=${((parseInt(condition.page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}&keyword=${condition.key}&status=${condition.status}&type=${condition.type}`;
    },
    createCouponItem() {
      return API_HOST + 'coupon/create-coupon-item';
    },
    updataCouponStatus() {
      return API_HOST + 'coupon/update-coupon-item-status';
    },
    addMemberCardType() {
      return API_HOST + 'coupon/create-member-card-type';
    },
    editMemberCardType() {
      return API_HOST + 'coupon/edit-member-card-type';
    },
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
    getMemberCardTypeInfo(memberCardTypeId) {
      return API_HOST + `coupon/member-card-type-detail?member_card_type=${memberCardTypeId}`;
    },
    genMemberCard() {
      return API_HOST + 'coupon/gen-member-card';
    },
    getGenMemberCardLog(memberCardTypeId){
      return API_HOST + `coupon/member-card-gen-log-list?member_card_type_id=${memberCardTypeId}&skip=${api.config.skip}&limit=${api.config.limit}`;
    },
    updateMemberCardTypeStatus() {
      return API_HOST + 'coupon/update-member-card-type-status';
    },
    exportMemberCardDistributeLog(memberCardTypeId, logId) {
      return API_HOST + `coupon/export-member-card?member_card_type_id=${memberCardTypeId}&member_card_gen_log_id=${logId}`;
    },
    checkMemberCard() {
      return API_HOST + 'coupon/check-member-card';
    },
    activateMemberCard() {
      return API_HOST + 'coupon/activate-member-card';
    },
    getMemberOrderList(condition) {
      return API_HOST + `coupon/member-order-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}&keyword=${condition.key}&member_card_type=${condition.currentCardTypeID}&member_start_date_begin=${condition.startDate}&member_start_date_end=${condition.endDate}`;
    },
    payMemberOrder() {
      return API_HOST + 'coupon/pay-member-order';
    },
    getMemberCardTypeCompanyList(type, key) {
      return API_HOST + `coupon/member-card-type-company-list?member_card_type=${type}&key=${key}&skip=${0}&limit=${10}`;
    },
    getMemberOrderDetail(orderId) {
      return API_HOST + `coupon/member-order-detail?order_id=${orderId}`;
    },
  },

  // 9. 任务
  task: {
    getMaintenanceList(between, status, page) {
      return API_HOST + `task/maintain-list?between=${between}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getRenewalTaskList(between, status, page) {
      return API_HOST + `task/insurance-list?between=${between}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getYearlyInspectionTaskList(between, status, page) {
      return API_HOST + `task/inspection-list?between=${between}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getCustomerTask(type, status, page) {
      return API_HOST + `task/common-list?type=${type}&status=${status}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    createCustomerTask() {
      return API_HOST + 'task/create-common-task';
    },
    createMaintainTask() {
      return API_HOST + 'task/create-maintain-task';
    },
    taskFollowUp() {
      return API_HOST + 'task/follow-up';
    },
    taskFollowHistory(taskId, taskType) {
      return API_HOST + `task/follow-up-list?task_id=${taskId}&task_type=${taskType}`;
    },
    commonTaskTypeList() {
      return API_HOST + 'task/common-task-type-list';
    },
    createCommonTaskType() {
      return API_HOST + 'task/create-common-task-type';
    },
    tastSummary() {
      return API_HOST + 'task/task-summary';
    },
    taskCustomerMaintainList(customerId, page = 1) {
      return API_HOST + `task/customer-maintain-list?customer_id=${customerId}&skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=${''}`;
    },
  },
};

export default api;
