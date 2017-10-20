import { message } from 'antd';

const API_HOST = `${window.baseURL  }/v1/`;
const API_HOST_ADMIN = `${window.baseURL  }/admin/`;

function getUserSession() {
  let USER_SESSION = localStorage.getItem('USER_SESSION')
    ? window.decodeURIComponent(window.atob(localStorage.getItem('USER_SESSION')))
    : '';
  USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
  return USER_SESSION;
}

// -2:管理员
// 0:无权限
// 1:总经办
// 2:售前
// 3:售后

/**
 * API
 *
 * @desc 部分分页接口，查询全部数据时，limit=-1即可
 */
const api = {
  config: {
    limit: 15,
    halfLimit: 10,
    skip: 0,
  },

  getLoginUser() {
    let USER_SESSION = localStorage.getItem('USER_SESSION')
      ? window.decodeURIComponent(window.atob(localStorage.getItem('USER_SESSION')))
      : '';
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

  getOffsetParentPosition(e) {
    const scrollHeight = document.body.clientHeight;

    const eLeft = e.target.offsetParent.getBoundingClientRect().left + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    const eTop = e.target.offsetParent.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      document.body.scrollTop;
    const eBottom = e.target.offsetParent.getBoundingClientRect().bottom +
      document.documentElement.scrollTop +
      document.body.scrollTop;

    const left = eLeft;
    let top = eBottom;

    if (scrollHeight - eBottom < 250) {
      top = eTop - 220;
    }
    return { left, top };
  },

  getPosition(e) {
    const left = e.target.getBoundingClientRect().left + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    const top = e.target.getBoundingClientRect().bottom + document.body.scrollTop +
      document.documentElement.scrollTop;
    return { left, top };
  },

  getUserPermissions() {
    const userPermission = localStorage.getItem('user_permission')
      ? window.decodeURIComponent(window.atob(localStorage.getItem('user_permission')))
      : [];
    return userPermission;
  },

  isLogin() {
    return !!api.getLoginUser().uid;
  },

  isHeadquarters() {
    return Number(api.getLoginUser().companyId) === 1;
  },

  // userType 1 连锁店 2 区域管理员 3 总公司管理员
  isSuperAdministrator() {
    return Number(api.getLoginUser().userType) === 3;
  },

  isChainAdministrator() {
    return Number(api.getLoginUser().userType) === 1;
  },

  isRegionAdministrator() {
    return Number(api.getLoginUser().userType) === 2;
  },

  isStoreGeneralManager() {
    return Number(api.getLoginUser().userType) === 0 &&
      Number(api.getLoginUser().department) === 1 && Number(api.getLoginUser().role) === 100;
  },

  checkPermission(path) {
    return new Promise((resolve, reject) => {
      if (api.isSuperAdministrator() || api.isChainAdministrator() || api.isStoreGeneralManager()) {
        resolve(true);
      } else {
        api.ajax({ url: api.user.checkPermission(path) }, () => {
          resolve(true);
        }, () => {
          reject(false);
        });
      }
    });
  },

  ajax(options, successCallback, errorCallback) {
    const USER_SESSION = getUserSession();
    const uid = String(USER_SESSION && USER_SESSION.department);
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
      success(data) {
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
      error(data) {
        typeof(errorCallback) == 'function' ? errorCallback(data) : message.error(data);
      },
    });
  },

  // 系统通用接口
  system: {
    getVerifyCode() {
      return `${API_HOST}user/get-code`;
    },
    register() {
      return `${API_HOST}user/register`;
    },
    login() {
      return `${API_HOST}user/login`;
    },
    logout() {
      return `${API_HOST}user/logout`;
    },

    getProvinces() {
      return `${API_HOST}system/province-list`;
    },
    getCities(province) {
      return `${API_HOST}system/city-list?province=${province}`;
    },
    getCountries(province, city) {
      return `${API_HOST}system/country-list?province=${province}&city=${city}`;
    },

    // 七牛
    uploadURl: 'https://up.qbox.me',

    getPublicPicUploadToken(file_type) {
      return `${API_HOST}system/get-public-pic-upload-token?file_type=${file_type}`;
    },
    getPublicPicUrl(file_name) {
      if (file_name.length == 0) return '';
      return `${API_HOST}system/get-public-pic-url?file_name=${file_name}`;
    },

    getPrivatePicUploadToken(file_type) {
      return `${API_HOST}system/get-private-pic-upload-token?file_type=${file_type}`;
    },
    getPrivatePicUrl(file_name) {
      if (file_name.length == 0) return '';
      return `${API_HOST}system/get-private-pic-url?file_name=${file_name}`;
    },

    getAppTobDownloadUrl() {
      return `${API_HOST}system/get-app-tob-download-url`;
    },
    getAppTocDownloadUrl() {
      return `${API_HOST}system/get-app-toc-download-url`;
    },
    getQaPublicFileUrl(fileName, type) {
      return `${API_HOST}system/get-qa-public-file-url?file_name=${fileName}&thumb_type=${type}`;
    },
  },

  // 总公司后台接口
  // 1、总公司管理员
  admin: {
    account: {
      list(condition) {
        return `${API_HOST_ADMIN}user/super-user-list?keyword=${condition.key}&user_type=${condition.userType}&skip=${(condition.page -
          1) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return `${API_HOST_ADMIN}user/create-super-user`;
      },
      edit() {
        return `${API_HOST_ADMIN}user/edit-super-user`;
      },
      detail(id) {
        return `${API_HOST_ADMIN}user/super-user-detail?_id=${id}`;
      },
      modifyStatus() {
        return `${API_HOST_ADMIN}user/update-login-status`;
      },
    },

    permission: {
      list(parentId) {
        return `${API_HOST_ADMIN}auth/item-list?parent_id=${parentId}`;
      },
      add() {
        return `${API_HOST_ADMIN}auth/create-item`;
      },
      edit() {
        return `${API_HOST_ADMIN}auth/edit-item`;
      },
      delete() {
        return `${API_HOST_ADMIN}auth/delete-item`;
      },
      updateByRole() {
        return `${API_HOST_ADMIN}auth/update-role-item`;
      },
      getByRole(roleId) {
        return `${API_HOST_ADMIN}auth/role-item-list?role=${roleId}`;
      },

      updateBySystem() {
        return `${API_HOST_ADMIN}auth/update-system-item`;
      },
      getBySystem(systemType) {
        return `${API_HOST_ADMIN}auth/system-item-list?system_type=${systemType}`;
      },
    },
  },

  // 2、公司
  company: {
    add() {
      return `${API_HOST_ADMIN}company/create`;
    },
    edit() {
      return `${API_HOST_ADMIN}company/edit`;
    },
    list(page) {
      return `${API_HOST_ADMIN}company/company-list?skip=${((Number(page) - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    getAll() {
      return `${API_HOST_ADMIN}company/company-list?skip=0&limit=-1`;
    },
    keyList(key) {
      return `${API_HOST_ADMIN}company/company-list?skip=0&limit=20&key=${key}`;
    },
    detail() {
      return `${API_HOST}company/detail`;
    },

    companyList(key) {
      return `${API_HOST}company/company-list?key=${key}&skip=0&limit=5`;
    },
    edit() {
      return `${API_HOST}company/edit`;
    },
    switch() {
      return `${API_HOST_ADMIN}company/switch-company`;
    },

    getCommissionRate() {
      return `${API_HOST_ADMIN}company/commission-rate-detail`;
    },
    editCommissionRate() {
      return `${API_HOST_ADMIN}company/edit-commission-rate`;
    },

    // TODO 获取公司角色的权限
    getRolePermissions(roleId) {
      return `${API_HOST_ADMIN}user/company-role-item-list?role=${roleId}`;
    },
  },

  // 3、总览
  overview: {
    companyList(condition) {
      return API_HOST_ADMIN +
        (`company/company-list?skip=${((condition.page - 1) || api.config.skip) * 15}
      &limit=${condition.page ? api.config.limit : '-1'}
      &province=${condition.province || ''}
      &city=${condition.city || ''}
      &country=${condition.country || ''}
      &expire_day=${condition.expireDay || ''}
      &company_type=${condition.companyType || ''}
      &cooperation_types=${condition.cooperationTypes || ''}
      &key=${condition.key || ''}`).replace(/\s/g, '');
    },
    getAgentList(key, page) {
      return `${API_HOST_ADMIN}company/sell-agent-list?skip=${((page - 1) || api.config.skip) *
      api.config.limit}&limit=${'-1'}&key=${key}`;
    },
    createSellAgent() {
      return `${API_HOST_ADMIN}company/create-sell-agent`;
    },
    createCompany() {
      return `${API_HOST_ADMIN}company/create`;
    },
    editCompany() {
      return `${API_HOST_ADMIN}company/edit`;
    },
    getCompanyDetail(id) {
      return `${API_HOST_ADMIN}company/detail?company_id=${id}`;
    },
    editBank() {
      return `${API_HOST_ADMIN}company/edit-bank`;
    },
    editApp() {
      return `${API_HOST_ADMIN}company/edit-app`;
    },
    editPos() {
      return `${API_HOST_ADMIN}company/edit-pos`;
    },
    editProfit() {
      return `${API_HOST_ADMIN}company/edit-profit`;
    },
    editContact() {
      return `${API_HOST_ADMIN}company/edit-contact`;
    },
    getChainList(key, page) {
      return `${API_HOST_ADMIN}chain/chain-list?key=${key}&skip=${((page - 1) || api.config.skip) *
      15}&limit=${15}`;
    },
    getAllChains() {
      return `${API_HOST_ADMIN}chain/chain-list?key=&skip=0&limit=-1`;
    },
    createChain() {
      return `${API_HOST_ADMIN}chain/create`;
    },
    editChain() {
      return `${API_HOST_ADMIN}chain/edit`;
    },

    statistics: {
      getCompanyMaintainTodaySummary(companyId) {
        return `${API_HOST_ADMIN}statistic/company-maintain-today-summary?company_id=${companyId}`;
      },
      getChainMaintainTodaySummary() {
        return `${API_HOST_ADMIN}statistic/chain-maintain-today-summary`;
      },
      getAllMaintainTodaySummary() {
        return `${API_HOST_ADMIN}statistic/all-maintain-today-summary`;
      },
      getAllMaintainSummaryDays(startTime, endTime) {
        return `${API_HOST_ADMIN}statistic/all-maintain-summary-days?start_date=${startTime}&end_date=${endTime}`;
      },
      getChainMaintainSummaryDays(startTime, endTime) {
        return `${API_HOST_ADMIN}statistic/chain-maintain-summary-days?start_date=${startTime}&end_date=${endTime}`;
      },
    },
  },

  // 新车
  newCar: {
    marketOrderList(condition) {
      return `${API_HOST_ADMIN}market-order/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}&key=${condition.searchKey}&province=${condition.province}&city=${condition.city}&country=${condition.country}&company_id=${condition.companyId}&start_date=${condition.startDate}&end_date=${condition.endDate}&product_id=${condition.productId}&product_type=${condition.type}&status=${condition.status}`;
    },
    marketOrderIntentionList(condition) {
      return `${API_HOST_ADMIN}market-order/intention-list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}&key=${condition.searchKey}&province=${condition.province}&city=${condition.city}&country=${condition.country}&company_id=${condition.companyId}&start_date=${condition.startDate}&end_date=${condition.endDate}&product_id=${condition.productId}&product_type=${condition.financingType}`;
    },

    marketOrderDetail(orderId) {
      return `${API_HOST_ADMIN}market-order/detail?order_id=${orderId}`;
    },
    marketOrderEditAuto() {
      return `${API_HOST_ADMIN}market-order/edit-auto`;
    },

    marketOrderEditLoan() {
      return `${API_HOST_ADMIN}market-order/edit-loan`;
    },

    marketOrderGetInsuranceConfig() {
      return `${API_HOST_ADMIN}market-order/get-insurance-config`;
    },

    marketOrderGetInsuranceLogDetail(orderId) {
      return `${API_HOST_ADMIN}market-order/get-insurance-log-detail?order_id=${orderId}`;
    },

    marketOrderEditInsuranceLog() {
      return `${API_HOST_ADMIN}market-order/edit-insurance-log`;
    },

    // 收益信息
    marketOrderGetFinanceDetail(orderId) {
      return `${API_HOST_ADMIN}market-order/get-finance-detail?order_id=${orderId}`;
    },
    marketOrderEditFinance() {
      return `${API_HOST_ADMIN}market-order/edit-finance`;
    },

    marketOrderFinanceList(condition) {
      return `${API_HOST_ADMIN}market-order/finance-list?province=${condition.province}&city=${condition.city}&resource_id=${condition.resourceId}&skip=${((condition.page -
        1) || 0) *
      api.config.limit}&limit=${api.config.limit}&start_date=${condition.startDate}&end_date=${condition.endDate}`;
    },

    // 订单状态
    marketOrderJinJian() {
      return `${API_HOST_ADMIN}market-order/jin-jian`;
    },
    marketOrderJinJianReject() {
      return `${API_HOST_ADMIN}market-order/jin-jian-reject`;
    },
    marketOrderJinJianPass() {
      return `${API_HOST_ADMIN}market-order/jin-jian-pass`;
    },
    marketOrderJinJianQianDan() {
      return `${API_HOST_ADMIN}market-order/qian-dan`;
    },
    marketOrderJinJianFinish() {
      return `${API_HOST_ADMIN}market-order/finish`;
    },
    marketOrderJinJianFail() {
      return `${API_HOST_ADMIN}market-order/jin-jian-fail`;
    },

    createMarketBanner() {
      return `${API_HOST_ADMIN}market-banner/create`;
    },
    editMarketBanner() {
      return `${API_HOST_ADMIN}market-banner/edit`;
    },
    offlineMarketBanner() {
      return `${API_HOST_ADMIN}market-banner/offline`;
    },
    marketBannerList(condition) {
      return `${API_HOST_ADMIN}market-banner/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },

    createMarketArticle() {
      return `${API_HOST_ADMIN}market-article/create`;
    },
    editMarketArticle() {
      return `${API_HOST_ADMIN}market-article/edit`;
    },
    offlineMarketArticle() {
      return `${API_HOST_ADMIN}market-article/offline`;
    },
    marketArticleList(condition) {
      return `${API_HOST_ADMIN}market-article/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    createMarketResource() {
      return `${API_HOST_ADMIN}market-resource/create`;
    },
    editMarketResource() {
      return `${API_HOST_ADMIN}market-resource/edit`;
    },
    offlineMarketResource() {
      return `${API_HOST_ADMIN}market-resource/offline`;
    },
    marketResourceList(condition) {
      return `${API_HOST_ADMIN}market-resource/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },

    marketResourceListAll() {
      return `${API_HOST_ADMIN}market-resource/list?skip=0&limit=`;
    },
    getProductListAll() {
      return `${API_HOST_ADMIN}market-product/list?skip=0&limit=&status&resource_id&type=`;
    },

    // 材料
    marketMaterialListAll() {
      return `${API_HOST_ADMIN}market-material/list?skip=0&limit=&resource_id=0`;
    },

    // 材料
    marketMaterialListAll() {
      return `${API_HOST_ADMIN}market-material/list?skip=0&limit=&resource_id=0`;
    },
    marketMaterialCreate() {
      return `${API_HOST_ADMIN}market-material/create`;
    },
    marketMaterialEdit() {
      return `${API_HOST_ADMIN}market-material/edit`;
    },
    // 刘家顺
    getMarketList(skip, limit) {
      return `${API_HOST_ADMIN}market-resource/list?skip=${skip}&limit=${limit}`;
    },
    postMarkertProductCreate() {
      return `${API_HOST_ADMIN}market-product/create`;
    },
    postMarketProductEdit() {
      return `${API_HOST_ADMIN}market-product/edit-base`;
    },
    postMarkertPeditRisk() {
      return `${API_HOST_ADMIN}market-product/edit-risk`;
    },
    postMarkertDitAmountFixFinance() {
      return `${API_HOST_ADMIN}market-product/edit-amount-fix-finance`;
    },
    postMarkertEditLoanFinance() {
      return `${API_HOST_ADMIN}market-product/edit-loan-finance`;
    },
    getMarketMaterialListData(skip, limit, resource_id) {
      return `${API_HOST_ADMIN}market-material/list?skip=${skip}&limit=${limit}&resource_id=${resource_id}`;
    },
    postMarketEditMaterial() {
      return `${API_HOST_ADMIN}market-product/edit-material`;
    },
    postMarkertResourceCreate() {
      return `${API_HOST_ADMIN}market-resource/create`;
    },
    postMarketProductOffline() {
      return `${API_HOST_ADMIN}market-product/offline`;
    },
    postMarketProductOnline() {
      return `${API_HOST_ADMIN}market-product/online`;
    },
    getProductDetail(product_id) {
      return `${API_HOST_ADMIN}market-product/detail?product_id=${product_id}`;
    },

    // 方案管理
    getmarketProAllListData(data) {
      return `${API_HOST_ADMIN}market-product/list?skip=${data.skip}&limit=${data.limit}&status=${data.status}&resource_id=${data.resource_id}&type=${data.type}`;
    },
    postCreateLoanPlan() {
      return `${API_HOST_ADMIN}market-plan/create-loan-plan`;
    },
    postCreateAmountFixPlan() {
      return `${API_HOST_ADMIN}market-plan/create-amount-fix-plan`;
    },
    postCreateAutoType() {
      return `${API_HOST_ADMIN}market-plan/create-auto-type`;
    },
    getMarketPlanAllList(data) {
      return `${API_HOST_ADMIN}market-plan/list?skip=${data.skip}&limit=${data.limit}&product_id=${data.product_id}&guide_price=${data.guide_price}&product_type=${data.product_type}&status=${data.status}`;
    },
    postMarketPlanEditHot() {
      return `${API_HOST_ADMIN}market-plan/edit-hot`;
    },
    postMarketPlanOffline() {
      return `${API_HOST_ADMIN}market-plan/offline`;
    },
    postMarketPlanOnline() {
      return `${API_HOST_ADMIN}market-plan/online`;
    },
    getPlanDetail(plan_id) {
      return `${API_HOST_ADMIN}market-plan/detail?plan_id=${plan_id}`;
    },
    postEditAmountFixPlan() {
      return `${API_HOST_ADMIN}market-plan/edit-amount-fix-plan`;
    },
    postEditLoanPlan() {
      return `${API_HOST_ADMIN}market-plan/edit-loan-plan`;
    },
    getProductListAllType(type) {
      return `${API_HOST_ADMIN}market-product/list?skip=0&limit=&status&resource_id&type=${type}`;
    },
  },
  // 4、广告
  advert: {
    add() {
      return `${API_HOST_ADMIN}advert/create`;
    },
    edit() {
      return `${API_HOST_ADMIN}advert/edit`;
    },
    offline() {
      return `${API_HOST_ADMIN}advert/offline`;
    },
    list(condition) {
      return `${API_HOST_ADMIN}advert/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 5、活动
  activity: {
    add() {
      return `${API_HOST_ADMIN}activity/create`;
    },
    edit() {
      return `${API_HOST_ADMIN}activity/edit`;
    },
    offline() {
      return `${API_HOST_ADMIN}activity/offline`;
    },
    list(condition) {
      return `${API_HOST_ADMIN}activity/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 6、评论
  comment: {
    list(condition) {
      return `${API_HOST_ADMIN}comment/list?start_date=${condition.startDate}&end_date=${condition.endDate}&company_id=${condition.company_id}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 7、问题管理
  question: {
    list(condition) {
      return `${API_HOST_ADMIN}question/question-list?company_id=${condition.companyId}&type=${condition.type}&status=${condition.status}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    listOfUnbalance(condition) {
      return `${API_HOST_ADMIN}question/unbalance-question-list?skip=${((condition.page - 1) ||
        0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    listOfMine(condition) {
      return `${API_HOST_ADMIN}question/my-question-list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    listOfCompany(condition) {
      return `${API_HOST_ADMIN}question/company-question-list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },

    detail(id) {
      return `${API_HOST_ADMIN}question/question-detail?question_id=${id}`;
    },

    adoptAllAnswer() {
      return `${API_HOST_ADMIN}question/adopt-all-dialog`;
    },

    shield() {
      return `${API_HOST_ADMIN}question/delete-question`;
    },

    shieldDialog() {
      return `${API_HOST_ADMIN}question/delete-question-dialog`;
    },

    dialogList(id) {
      return `${API_HOST_ADMIN}question/question-dialog-list?question_id=${id}`;
    },
    dialogItemList(id, dialogId) {
      return `${API_HOST_ADMIN}question/question-dialog-item-list?question_id=${id}&dialog_id=${dialogId}`;
    },
  },

  // 8、技师管理
  technician: {
    list(condition) {
      return `${API_HOST_ADMIN}artificer/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}&brand=${condition.brand}&status=${condition.status}`;
    },
    settlement() {
      return `${API_HOST_ADMIN}artificer/withdraw`;
    },
    detail(id) {
      return `${API_HOST_ADMIN}artificer/detail?artificer_id=${id}`;
    },
    auditLogList(id) {
      return `${API_HOST_ADMIN}artificer/audit-log-list?artificer_id=${id}`;
    },
    withDrawList(id, page) {
      return `${API_HOST_ADMIN}artificer/withdraw-list?artificer_id=${id}&skip=${((page - 1) ||
        0) * api.config.limit}&limit=${api.config.limit}`;
    },
    auditExamine(id) {
      return `${API_HOST_ADMIN}artificer/audit?artificer_id=${id}`;
    },
    editAlipayAccount(id) {
      return `${API_HOST_ADMIN}artificer/edit-alipay-account?artificer_id=${id}`;
    },
    editArtificerName(id) {
      return `${API_HOST_ADMIN}artificer/edit-name?artificer_id=${id}`;
    },
    getArtificerChargeList(condition) {
      return `${API_HOST_ADMIN}artificer/charge-list?artificer_id=${condition.customerId}&skip=${((condition.page -
        1) ||
        0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 9、authority
  authority: {
    list(id) {
      return `${API_HOST_ADMIN}auth/item-list?parent_id=${id}`;
    },
    edit() {
      return `${API_HOST_ADMIN}auth/edit-item`;
    },
    delete() {
      return `${API_HOST_ADMIN}auth/delete-item`;
    },
    create() {
      return `${API_HOST_ADMIN}auth/create-item`;
    },

  },

  // 10、头条管理
  headlines: {
    add() {
      return `${API_HOST_ADMIN}news/create`;
    },
    edit() {
      return `${API_HOST_ADMIN}news/edit`;
    },
    list(condition) {
      return `${API_HOST_ADMIN}news/list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    offline() {
      return `${API_HOST_ADMIN}news/offline`;
    },
  },

  // 门店接口

  // 车辆信息
  auto: {
    genNewId() {
      return `${API_HOST}auto/gen-new-auto-id`;
    },
    add() {
      return `${API_HOST}auto/create-auto`;
    },
    edit() {
      return `${API_HOST}auto/edit-auto`;
    },
    detail(customerId, autoId) {
      return `${API_HOST}auto/auto-detail?customer_id=${customerId}&auto_id=${autoId}`;
    },
    getUploadToken(customerId, userAutoId, fileType) {
      return `${API_HOST}auto/get-auto-upload-token?customer_id=${customerId}&auto_id=${userAutoId}&file_type=${fileType}`;
    },
    getFileUrl(customerId, autoId, fileType) {
      return `${API_HOST}auto/get-auto-file-url?customer_id=${customerId}&auto_id=${autoId}&file_type=${fileType}`;
    },
    getBrands() {
      return `${API_HOST}system/auto-brand-list`;
    },
    getByGuidePrice(guidePrice) {
      return `${API_HOST}system/search-auto-type?price=${guidePrice}`;
    },
    getSeriesByBrand(brandId) {
      return `${API_HOST}system/series-list-by-brand?auto_brand_id=${brandId}`;
    },
    getTypesBySeries(seriesId) {
      return `${API_HOST}system/type-list-by-series?auto_series_id=${seriesId}`;
    },
    getOutColorBySeries(seriesId) {
      return `${ API_HOST}system/out-color-by-series?auto_series_id=${seriesId}`;
    },
  },

  // 客户信息
  customer: {
    genNewId() {
      return `${API_HOST}customer/gen-new-id`;
    },
    add() {
      return `${API_HOST}customer/create`;
    },
    edit() {
      return `${API_HOST}customer/edit`;
    },
    detail(customerId) {
      return `${API_HOST}customer/info?customer_id=${customerId}`;
    },
    addCustomerAndAuto() {
      return `${API_HOST}customer/create-customer-and-auto`;
    },
    getSourceTypes(sourceDeal) {
      return `${API_HOST}customer/source-types?source_deal=${sourceDeal}`;
    },
    getCustomerUnpayAmount(customer_id) {
      return `${API_HOST}customer/total-unpay-amount?customer_id=${customer_id}`;
    },
    getCustomerPayLog() {
      return `${API_HOST}maintain/intention-pay-log`;
    },
    searchCustomer(key) {
      return `${API_HOST}customer/search-customers?key=${key}`;
    },

    customerCouponCardOrderList(id) {
      return `${API_HOST}coupon/customer-coupon-card-order-list?customer_id=${id}`;
    },

    // 七牛上传token
    getUploadToken(customer_id, file_type) {
      return `${API_HOST}customer/get-upload-token?customer_id=${customer_id}&file_type=${file_type}`;
    },
    getFileUrl(customer_id, file_type) {
      return `${API_HOST}customer/get-file-url?customer_id=${customer_id}&file_type=${file_type}`;
    },
  },

  // 1. 销售
  presales: {
    // 1.意向客户
    intention: {
      list(condition) {
        const { page, key, source, intention_level, create_day, intention_brand, budget_level, is_mortgage } = condition;
        return `${API_HOST}purchase/potential-list?key=${key}&source=${source}&intention_level=${intention_level}`
          + `&create_day=${create_day}&intention_brand=${intention_brand}`
          + `&budget_level=${budget_level}&is_mortgage=${is_mortgage}`
          + `&skip=${((page - 1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return `${API_HOST}purchase/create-intention`;
      },
      edit() {
        return `${API_HOST}purchase/edit-intention`;
      },
      lost() {
        return `${API_HOST}purchase/intention-fail`;
      },
      detail(customerId, intentionId) {
        return `${API_HOST}purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
      },

      getIntentionDetailByAutoId(customerId, autoId) {
        return `${API_HOST}purchase/intention-detail-by-auto-id?customer_id=${customerId}&auto_id=${autoId}`;
      },

      getListByCustomerId(customerId) {
        return `${API_HOST}purchase/intention-list-by-customer-id?customer_id=${customerId}`;
      },

      getFailTypes() {
        return `${API_HOST}purchase/intention-fail-types`;
      },
      getBudgetLevels() {
        return `${API_HOST}purchase/intention-budget-levels`;
      },

    },

    // 2. 成交单
    deal: {
      list(condition) {
        return `${API_HOST}purchase/auto-deal-list?key=${condition.key}&pay_status=${condition.payStatus}&last_deal_days=${condition.lastDealDays}&skip=${(condition.page -
          1) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return `${API_HOST}purchase/create-auto-deal`;
      },
      edit() {
        return `${API_HOST}purchase/edit-auto-deal`;
      },
      detail(customerId, autoId) {
        return `${API_HOST}purchase/auto-deal-detail?customer_id=${customerId}&auto_id=${autoId}`;
      },
      getAutoDealDetailByAutoId(customerId, autoId) {
        return `${API_HOST}purchase/auto-deal-detail-by-auto-id?customer_id=${customerId}&auto_id=${autoId}`;
      },
      listByCustomerId(customerId) {
        return `${API_HOST}purchase/auto-deal-list-by-customer-id?customer_id=${customerId}`;
      },

      auth(id) {
        return `${API_HOST}financial/auth-purchase-income?auto_deal_id=${id}`;
      },

      addAuto() {
        return `${API_HOST}purchase/create-auto-deal`;
      },
      editAuto() {
        return `${API_HOST}purchase/edit-auto-deal`;
      },

      addLoan() {
        return `${API_HOST}financial/create-loan-log`;
      },
      editLoan() {
        return `${API_HOST}financial/edit-loan-log`;
      },

      addInsurance() {
        return `${API_HOST}financial/create-insurance-log`;
      },
      editInsurance() {
        return `${API_HOST}financial/edit-insurance-log`;
      },

      addDecoration() {
        return `${API_HOST}purchase/create-decoration-log`;
      },
      editDecoration() {
        return `${API_HOST}purchase/edit-decoration-log`;
      },

      getInsuranceCompanies() {
        return `${API_HOST}financial/get-insurance-company-list`;
      },
      getGuaranteeCompanies() {
        return `${API_HOST}financial/get-guarantee-company-list`;
      },

      getLoanDetail(customerId, autoDealId) {
        return `${API_HOST}financial/loan-log-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
      },
      getInsuranceLogDetail(customerId, autoDealId) {
        return `${API_HOST}financial/insurance-log-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
      },
      getDecorationLogDetail(customerId, autoDealId) {
        return `${API_HOST}purchase/decoration-log-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
      },
    },

    getInsuranceDetail(customerId, autoId) {
      return `${API_HOST}auto/get-insurance-info?customer_id=${customerId}&auto_id=${autoId}`;
    },
    getAutoPurchaseDetail(autoDealId) {
      return `${API_HOST}financial/purchase-detail?auto_deal_id=${autoDealId}`;
    },
    editPurchaseIncome(autoDealId) {
      return `${API_HOST}financial/edit-purchase-income?auto_deal_id=${autoDealId}`;
    },
    checkPurchaseIncome(autoDealId) {
      return `${API_HOST}financial/check-purchase-income?auto_deal_id=${autoDealId}`;
    },

    // list
    autoSellPotentialList(condition) {
      return `${API_HOST}purchase/potential-list?source=${condition.source}&intention_level=${condition.intention_level}`
        + `&create_day=${condition.create_day}&intention_brand=${condition.intention_brand}`
        + `&budget_level=${condition.budget_level}&is_mortgage=${condition.is_mortgage}`
        + `&skip=${((condition.page - 1) || 0) * api.config.limit}&limit=${api.config.limit}&key=`;
    },

    autoSellCustomerList(condition) {
      return `${API_HOST}purchase/customer-list?source=${condition.source}&create_day=${condition.create_day}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    searchAutoCustomers() {
      return `${API_HOST}customer/search-customers?key=`;
    },

    searchCustomerAutos(key) {
      return `${API_HOST}customer/search-autos?key=${key}`;
    },

    searchAutoCustomerList() {
      return `${API_HOST}purchase/customer-list?key=`;
    },

    userAutoList(id) {
      return `${API_HOST}auto/auto-list?customer_id=${id}`;
    },

    superUserAutoList(id) {
      return `${API_HOST}auto/super-auto-list?customer_id=${id}`;
    },

    autoIntentionDetail(customerId, autoDealId) {
      return `${API_HOST}purchase/auto-detail?customer_id=${customerId}&auto_deal_id=${autoDealId}`;
    },

    autoDealInfo(customer_id, autoDealId) {
      return `${API_HOST}purchase/auto-deal-detail?customer_id=${customer_id}&auto_deal_id=${autoDealId}`;
    },

    autoIntentionInfo(customer_id, auto_id) {
      return `${API_HOST}purchase/intention-detail-by-auto-id?customer_id=${customer_id}&auto_id=${auto_id}`;
    },

    getIntentionAutoInfo(customerId, intentionId) {
      return `${API_HOST}purchase/intention-detail?customer_id=${customerId}&_id=${intentionId}`;
    },
  },

  // 2. 售后
  aftersales: {
    maintain: {
      getUploadToken(customerId, intentionId, fileType) {
        return `${API_HOST}maintain/get-operation-record-upload-token?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
      },
      getFileUrl(customerId, intentionId, fileType) {
        return `${API_HOST}maintain/get-operation-record-file-url?customer_id=${customerId}&intention_id=${intentionId}&file_type=${fileType}`;
      },
    },

    getConsumableList(key, page, startTime, endTime, status) {
      return `${API_HOST}part/consumable-list?key=${key}&start_date=${startTime}&end_date=${endTime}&skip=${((page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}&status=${status}`;
    },
    createConsumable() {
      return `${API_HOST}part/create-consumable`;
    },
    authorizeConsumable() {
      return `${API_HOST}part/authorize-consumable`;
    },
    getConsumableDetail(_id) {
      return `${API_HOST}part/consumable-detail?consumable_id=${_id}`;
    },
    deleteConsumable() {
      return `${API_HOST}part/delete-consumable`;
    },
    editConsumable() {
      return `${API_HOST}part/edit-consumable`;
    },

    maintainIntentionPayFail() {
      return `${API_HOST}maintain/intention-pay-fail`;
    },

    project: {
      list(condition) {
        const { page = 1, key, status = '', pay_status = '' } = condition;
        return `${API_HOST}maintain/intention-list?key=${key}&status=${status}&pay_status=${pay_status}&skip=${(page -
          1) * api.config.limit}&limit=${api.config.limit}`;
      },
      destroy() {
        return `${API_HOST}maintain/intention-cancel`;
      },
      finish() {
        return `${API_HOST}maintain/intention-finish`;
      },
      detail(id) {
        return `${API_HOST}maintain/intention-detail?_id=${id}`;
      },
    },

    // maint list
    maintCustomerList(condition) {
      return `${API_HOST}maintain/customer-list?skip=${((condition.page - 1) || api.config.skip) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    maintProjectList(condition) {
      return `${API_HOST}maintain/intention-list?skip=${((condition.page - 1) ||
        api.config.skip) *
      api.config.limit}&limit=${api.config.limit}`;
    },

    maintainIntentionPayByHand() {
      return `${API_HOST}maintain/intention-pay-by-hand`;
    },

    // 售后搜索
    searchMaintainPotentialCustomerList() {
      return `${API_HOST}maintain/search-potential-customer-list?skip=${api.config.skip}&limit=${api.config.limit}&key=`;
    },

    searchMaintainCustomerList(condition = {}) {
      const limit = condition.limit || api.config.limit;
      return `${API_HOST}maintain/customer-auto-list?key=${condition.key}&auto_brand_id=${condition.autoBrandId}&skip=${(limit ===
      -1 ? 0 : (condition.page - 1) || api.config.skip) * limit}&limit=${limit}`;
    },

    maintainCustomerList(condition) {
      return `${API_HOST}maintain/customer-list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}&is_login=${condition.isLogin}&company_id=${condition.companyId}&coupon_card_type=${condition.couponCardType}`;
    },

    /* allMaintainCustomerList (condition = {}) {
     return API_HOST + `maintain/customer-list?skip=${((condition.page - 1) || 0) * api.config.limit}&limit=&key=${condition.key}&is_login=${condition.isLogin}&company_id=${condition.companyId}&auto_brand_id=${condition.autoBrandId}&sort_config=${condition.sortConfig}`;
     },*/

    searchMaintainProjectList(condition) {
      return `${API_HOST}maintain/intention-list?key=${condition.key}&status=${condition.status}&skip=${((condition.page -
        1) || api.config.skip) * api.config.limit}&limit=${api.config.limit}`;
    },

    payProjectByPOS() {
      return `${API_HOST}maintain/intention-pay-by-pos`;
    },

    payProjectByApp() {
      return `${API_HOST}maintain/intention-pay-by-app`;
    },

    payProjectOnAccount() {
      return `${API_HOST}maintain/intention-pay-on-account`;
    },

    payProjectOnRepayment() {
      return `${API_HOST}maintain/intention-pay-back`;
    },

    // maint project detail
    maintProjectByProjectId(project_id) {
      return `${API_HOST}maintain/intention-detail?_id=${project_id}`;
    },

    maintProjectsByAutoId(customer_id, auto_id) {
      return `${API_HOST}maintain/intention-list-by-auto-id?auto_id=${auto_id}&customer_id=${customer_id}&skip=${api.config.skip}&limit=${api.config.limit}`;
    },

    maintainIntentionSendSms() {
      return `${API_HOST}maintain/intention-send-sms`;
    },

    searchMaintainItems(keyword) {
      return `${API_HOST}maintain/item-search?keyword=${keyword}`;
    },

    getMaintainItemTypes() {
      return `${API_HOST}maintain/type-list`;
    },
    addMaintainItem() {
      return `${API_HOST}maintain/add-item`;
    },

    addMaintainIntention() {
      return `${API_HOST}maintain/create-intention`;
    },

    editMaintainIntention() {
      return `${API_HOST}maintain/edit-intention`;
    },

    getItemListOfMaintProj(id) {
      return `${API_HOST}maintain/intention-item-list?intention_id=${id}`;
    },

    getPartListOfMaintProj(id) {
      return `${API_HOST}maintain/intention-part-list?intention_id=${id}`;
    },

    getMaintProjPayURL(id) {
      return `${API_HOST}maintain/get-wechat-pay-url?intention_id=${id}`;
    },

    // 配件销售
    createPartSell() {
      return `${API_HOST}part-sell/create`;
    },
    getPartSellDetail(order_id) {
      return `${API_HOST}part-sell/detail?order_id=${order_id}`;
    },
    getPartSellPartList(order_id) {
      return `${API_HOST}part-sell/part-list?order_id=${order_id}`;
    },
    partSellPayByPos() {
      return `${API_HOST}part-sell/pay-by-pos`;
    },
    partSellPayOnAccount() {
      return `${API_HOST}part-sell/pay-on-account`;
    },
    partSellPayBack() {
      return `${API_HOST}part-sell/pay-back`;
    },
    partSellEdit() {
      return `${API_HOST}part-sell/edit`;
    },
    partSellPayLog() {
      return `${API_HOST}part-sell/pay-log`;
    },
    getPartSellList(condition) {
      const { key, status, page } = condition;
      return `${API_HOST}part-sell/list?skip=${(page - 1) *
      api.config.limit}&limit=${api.config.limit}&key=${key}&status=${status}`;
    },
    intentionAutoPartFreeze() {
      return `${API_HOST}maintain/intention-auto-part-freeze`;
    },
    intentionAutoPartUnfreeze() {
      return `${API_HOST}maintain/intention-auto-part-unfreeze`;
    },

    weekly: {
      saveIntentionSummary() {
        return `${API_HOST}statistic/save-intention-summary`;
      },
      getIntentionSummary(startTime) {
        return `${API_HOST}statistic/get-intention-summary?start_date=${startTime}`;
      },

      weekLowGrossProfitIntentionList(startTime) {
        return `${API_HOST}statistic/week-low-gross-profit-intention-list?start_date=${startTime}`;
      },
      saveLowGrossProfitIntention() {
        return `${API_HOST}statistic/save-low-gross-profit-intention`;
      },
      lowGrossProfitIntentionDetail(startTime) {
        return `${API_HOST}statistic/low-gross-profit-intention-detail?start_date=${startTime}`;
      },

      saveInvalidItemPartIntention() {
        return `${API_HOST}statistic/save-invalid-item-part-intention`;
      },

      invalidItemPartIntentionDetail(startTime) {
        return `${API_HOST}statistic/invalid-item-part-intention-detail?start_date=${startTime}`;
      },

      weekOverPurchasePartList(startTime) {
        return `${API_HOST}statistic/week-over-purchase-part-list?start_date=${startTime}`;
      },
      saveOverPurchasePart() {
        return `${API_HOST}statistic/save-over-purchase-part`;
      },
      overPurchasePartDetail(startTime) {
        return `${API_HOST}statistic/over-purchase-part-detail?start_date=${startTime}`;
      },

      weekPriceRisePurchasePartList(startTime) {
        return `${API_HOST}statistic/week-price-rise-purchase-part-list?start_date=${startTime}`;
      },

      savePriceRisePurchasePart() {
        return `${API_HOST}statistic/save-price-rise-purchase-part`;
      },

      priceRisePurchasePartDetail(startTime) {
        return `${API_HOST}statistic/price-rise-purchase-part-detail?start_date=${startTime}`;
      },

      weekRejectPartList(startTime) {
        return `${API_HOST}statistic/week-reject-part-list?start_date=${startTime}`;
      },

      saveRejectPart() {
        return `${API_HOST}statistic/save-reject-part`;
      },

      rejectPartDetail(startTime) {
        return `${API_HOST}statistic/reject-part-detail?start_date=${startTime}`;
      },
    },
    comment: {
      getCommentList(condition) {
        return `${API_HOST}comment/list?skip=${((condition.page - 1) || 0) *
        api.config.limit}&limit=${api.config.limit}&start_date=${condition.startDate}&end_date=${condition.endDate}&rate=${condition.rate}&source=${condition.source}`;
      },
    },
  },

  // 3. 仓库
  warehouse: {
    part: {
      list(condition) {
        return `${API_HOST}part/part-list?keyword=${condition.key}&skip=${((condition.page - 1) ||
          0) * api.config.limit}&limit=${api.config.limit}&part_type=${condition.partType ||
        ''}&brand=${condition.brand || ''}&scope=${condition.scope ||
        ''}&status=${condition.status || ''}`;
      },
      updatePartStatus() {
        return `${API_HOST}part/update-part-status`;
      },
      partMaintainUseLogList(condition) {
        return `${API_HOST}part/maintain-use-log-list?start_date=${condition.startDate}&end_date=${condition.endDate}&skip=${((condition.page -
          1) || 0) * api.config.limit}&limit=${api.config.limit}&part_id=${condition.partId}`;
      },

      detail(partId) {
        return `${API_HOST}part/part-detail?part_id=${partId}`;
      },
      search(keyword) {
        return `${API_HOST}part/part-search?keyword=${keyword}`;
      },
      searchBySupplierId(key, supplierId) {
        supplierId = supplierId ? supplierId : 0;
        return `${API_HOST}part/supplier-part-search?keyword=${key}&supplier_id=${supplierId}`;
      },
      searchPartTypes(key) {
        return `${API_HOST}part/search-part-type?keyword=${key}`;
      },
      add() {
        return `${API_HOST}part/add-part`;
      },
      edit() {
        return `${API_HOST}part/edit-part`;
      },
      entryDocumentToken(id, type) {
        return `${API_HOST}part/get-godown-entry-upload-token?godown_entry_id=${id}&file_type=${type}`;
      },
      entryDocumentUrl(id, type) {
        return `${API_HOST}part/get-godown-entry-url?godown_entry_id=${id}&file_type=${type}`;
      },
      partLowAmountList(page) {
        return `${API_HOST}part/low-amount-part-list?skip=${((page - 1) || 0) *
        api.config.limit}&limit=${api.config.limit}`;
      },
      partTypeMarkup() {
        return `${API_HOST}part/edit-part-type-markup`;
      },
      editPartType() {
        return `${API_HOST}part/edit-part-type`;
      },
    },

    category: {
      superPartTypeList() {
        return `${API_HOST}part/super-part-type-list`;
      },
      partAllPartTypes() {
        return `${API_HOST}part/all-part-types`;
      },
      partTypeList(pid, page) {
        return `${API_HOST}part/part-type-list?pid=${pid}&skip=${((page - 1) || 0) *
        api.config.limit * 2}&limit=${api.config.limit * 2}`;
      },
      partTypeFullList(pid, page) {
        return `${API_HOST}part/part-type-full-list?pid=${pid}&skip=${((page - 1) || 0) *
        api.config.limit * 2}&limit=${api.config.limit * 2}`;
      },

      partTypeALlList(pid) {
        return `${API_HOST}part/part-type-list?pid=${pid}&skip=0&limit=''`;
      },
      add() {
        return `${API_HOST}part/add-part-type`;
      },
      edit() {
        return `${API_HOST}part/edit-part-type`;
      },
      search(keyword) {
        return `${API_HOST}part/search-part-type?keyword=${keyword}`;
      },
    },

    supplier: {
      list(condition) {
        return `${API_HOST}part/supplier-list?company=${condition.company}&skip=${((condition.page -
          1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      add() {
        return `${API_HOST}part/add-supplier`;
      },
      edit() {
        return `${API_HOST}part/edit-supplier`;
      },
      search(companyName) {
        return `${API_HOST}part/supplier-list?company=${companyName}&skip=0&limit=-1`;
      },
      getAll() {
        return `${API_HOST}part/supplier-list?company=&skip=0&limit=-1`;
      },
      pay() {
        return `${API_HOST}part/pay-supplier`;
      },
    },

    purchase: {
      list(condition) {
        const { page, startDate, endDate, supplierId, type, status, payStatus } = condition;
        return `${API_HOST}part/purchase-list?start_date=${startDate}&end_date=${endDate}&supplier_id=${supplierId}&type=${type}&status=${status}&pay_status=${payStatus}&skip=${((page -
          1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      getListBySupplierAndPayStatus(supplierId, payStatus, page) {
        return `${API_HOST}part/purchase-list?start_date=&end_date=&supplier_id=${supplierId}&type=-1&status=1&pay_status=${payStatus}&skip=${(page -
          1) * api.config.limit}&limit=${api.config.limit}`;
      },
      getAllBySupplierAndPayStatus(supplierId, payStatus) {
        return `${API_HOST}part/purchase-list?start_date=&end_date=&supplier_id=${supplierId}&type=-1&status=1&pay_status=${payStatus}&skip=0&limit=-1`;
      },
      add() {
        return `${API_HOST}part/create-purchase`;
      },
      edit() {
        return `${API_HOST}part/edit-purchase`;
      },
      cancel() {
        return `${API_HOST}part/cancel-purchase`;
      },
      import() {
        return `${API_HOST}part/import-purchase`;
      },
      pay() {
        return `${API_HOST}part/pay-purchase`;
      },
      detail(id) {
        return `${API_HOST}part/purchase-detail?purchase_id=${id}`;
      },
      items(id, page) {
        return `${API_HOST}part/purchase-item-list?purchase_id=${id}&skip=${(page - 1) *
        api.config.limit}&limit=${api.config.limit}`;
      },
      itemsAll(id) {
        return `${API_HOST}part/purchase-item-list?purchase_id=${id}&skip=0&limit=-1`;
      },
      itemsBySupplierAndPart(partId, supplierId, page) {
        return `${API_HOST}part/purchase-item-list-by-supplier-part?part_id=${partId}&supplier_id=${supplierId}&skip=${(page -
          1) * api.config.limit}&limit=${api.config.limit}`;
      },
    },

    reject: {
      list(condition) {
        const { page, startDate, endDate, supplierId, status, payStatus } = condition;
        return `${API_HOST}part/reject-list?start_date=${startDate}&end_date=${endDate}&supplier_id=${supplierId}&status=${status}&pay_status=${payStatus}&skip=${((page -
          1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      getListBySupplierAndPayStatus(supplierId, payStatus, page) {
        return `${API_HOST}part/reject-list?start_date=&end_date=&supplier_id=${supplierId}&status=1&pay_status=${payStatus}&skip=${(page -
          1) * api.config.limit}&limit=${api.config.limit}`;
      },
      getAllBySupplierAndPayStatus(supplierId, payStatus) {
        return `${API_HOST}part/reject-list?start_date=&end_date=&supplier_id=${supplierId}&status=1&pay_status=${payStatus}&skip=0&limit=-1`;
      },
      add() {
        return `${API_HOST}part/create-reject`;
      },
      edit() {
        return `${API_HOST}part/edit-reject`;
      },
      cancel() {
        return `${API_HOST}part/cancel-reject`;
      },
      export() {
        return `${API_HOST}part/export-reject`;
      },
      pay() {
        return `${API_HOST}part/pay-reject`;
      },
      detail(id) {
        return `${API_HOST}part/reject-detail?reject_id=${id}`;
      },
      items(id, page) {
        return `${API_HOST}part/reject-item-list?reject_id=${id}&skip=${(page - 1) *
        api.config.limit}&limit=${api.config.limit}`;
      },
    },

    stocktaking: {
      list(condition) {
        const { page, startDate, endDate } = condition;
        return `${API_HOST}part/stocktaking-list?start_date=${startDate}&end_date=${endDate}&skip=${((page -
          1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      parts(id, page) {
        return `${API_HOST}part/stocktaking-item-list?stocktaking_id=${id}&skip=${((page - 1) ||
          0) * api.config.limit}&limit=${page ? api.config.limit : ''}`;
      },
      getAllParts(id) {
        return `${API_HOST}part/stocktaking-item-list?stocktaking_id=${id}&skip=0&limit=1000000`;
      },
      new() {
        return `${API_HOST}part/create-stocktaking`;
      },
      edit() {
        return `${API_HOST}part/update-stocktaking-items`;
      },
      cancel() {
        return `${API_HOST}part/cancel-stocktaking`;
      },
      detail(id) {
        return `${API_HOST}part/get-stocktaking-detail?stocktaking_id=${id}`;
      },
      checkUpdateAllStockaking() {
        return `${API_HOST}part/check-update-all-stocktaking`;
      },
      auth() {
        return `${API_HOST}part/authorize-stocktaking`;
      },
      import() {
        return `${API_HOST}part/import-stocktaking`;
      },
      updateParts() {
        return `${API_HOST}part/update-stocktaking-items`;
      },

      stockLogs(condition) {
        return API_HOST + (`part/stock-log-list?
        part_id=${condition.partId || ''}
        &type=${condition.type}
        &from_type=${condition.fromType || ''}
        &skip=${(condition.page - 1) * api.config.limit}
        &limit=${api.config.limit}
        &start_date=${condition.startDate}
        &end_date=${condition.endDate}
        &keyword=${condition.keyword || ''}
        &brand=${condition.brand || ''}
        &scope=${condition.scope || ''}
        &part_type=${condition.partType || ''}`).replace(/\s/g, '');
      },
    },
  },

  // 4. 项目
  maintainItem: {
    list(condition) {
      return `${API_HOST}maintain/item-list?keyword=${condition.key}&maintain_type=${condition.maintainType}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${condition.page ? api.config.limit : ''}`;
    },
    add() {
      return `${API_HOST}maintain/add-item`;
    },
    edit() {
      return `${API_HOST}maintain/edit-item`;
    },
  },

  // 5. 报表
  statistics: {
    // 售前
    getPurchaseSummary(startTime, endTime) {
      return `${API_HOST}statistic/purchase-summary?start_date=${startTime}&end_date=${endTime}`;
    },

    getNewPotentialAndIntentionDaysData(startTime, endTime) {
      return `${API_HOST}statistic/purchase-potential-summary-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getNewDealDaysData(startTime, endTime) {
      return `${API_HOST}statistic/purchase-auto-deals-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getPurchaseFailDays(startTime, endTime) {
      return `${API_HOST}statistic/purchase-fail-days?start_date=${startTime}&end_date=${endTime}`;
    },

    getPurchaseIncomeInfo(startTime, endTime) {
      return `${API_HOST}statistic/purchase-incomes?start_date=${startTime}&end_date=${endTime}`;
    },

    getIntentionLostInfo(startTime, endTime) {
      return `${API_HOST}statistic/purchase-fail-types?start_date=${startTime}&end_date=${endTime}`;
    },

    getIntentionInfo(startTime, endTime) {
      return `${API_HOST}statistic/purchase-intentions?start_date=${startTime}&end_date=${endTime}`;
    },

    // 售后
    getMaintainTypeCount(startTime, endTime) {
      return `${API_HOST}statistic/maintain-type-count?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainTypeIncomes(startTime, endTime) {
      return `${API_HOST}statistic/maintain-type-summary?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainPayTypes(startTime, endTime) {
      return `${API_HOST}statistic/maintain-income-pay-types?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainIncomeUnpay(startTime, endTime) {
      return `${API_HOST}statistic/maintain-income-unpay?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainCouponByLevel(startTime, endTime) {
      return `${API_HOST}statistic/maintain-coupon-cards?start_date=${startTime}&end_date=${endTime}`;
    },

    getMaintainSummary(startTime, endTime) {
      return `${API_HOST}statistic/maintain-summary?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainCountDaysData(startTime, endTime) {
      return `${API_HOST}statistic/maintain-count-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainIncomeDaysData(startTime, endTime) {
      return `${API_HOST}statistic/maintain-incomes-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainAutoPartDays(startTime, endTime) {
      return `${API_HOST}statistic/maintain-auto-part-days?start_date=${startTime}&end_date=${endTime}`;
    },
    getMaintainAccident(startTime, endTime) {
      return `${API_HOST}statistic/maintain-accident?start_date=${startTime}&end_date=${endTime}`;
    },
    getCustomerCouponCards(customerId, is_show_detail, is_filter_remain) {
      return `${API_HOST}coupon/customer-coupon-item-list?customer_id=${customerId}&is_show_detail=${is_show_detail}&is_filter_remain=${is_filter_remain}`;
    },

    getMaintainTypeDays(condition) {
      return `${API_HOST}statistic/maintain-type-days?start_date=${condition.startTime}&end_date=${condition.endTime}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
  },

  // 6、财务
  finance: {
    getIncomeList(condition) {
      return `${API_HOST}financial/income-list?start_time=${condition.start_time}&end_time=${condition.end_time}&account_type=${condition.account_type}&status=${condition.status}&transfer_status=${condition.transfer_status}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    getFinancialSummary(month) {
      return `${API_HOST}financial/financial-summary?month=${month}`;
    },

    getPresalesIncomeList(condition) {
      return `${API_HOST}financial/purchase-income-list?start_date=${condition.start_date}&end_date=${condition.end_date}&from_type=${condition.pay_type}&plate_num=${condition.plate_num}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    newIncomeStatement() {
      return `${API_HOST}financial/create-check-sheet`;
    },

    getIncomeStatementDetail(id) {
      return `${API_HOST}financial/check-sheet-detail?_id=${id}`;
    },

    scanQRCodeToVerify(id, type) {
      return `${API_HOST}financial/confirm-check-sheet-user?_id=${id}&user_type=${type}`;
    },

    confirmIncomeStatement() {
      return `${API_HOST}financial/confirm-check-sheet`;
    },

    getIncomeTransferList(condition) {
      return `${API_HOST}financial/income-transfer-list?end_date=${condition.end_date}&company_id=${condition.company_id}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    genIncomeUntransfer(company_id, end_date) {
      return `${API_HOST}financial/gen-income-untransfer?end_date=${end_date}&company_id=${company_id}`;
    },

    setIncomeTransfered() {
      return `${API_HOST}financial/set-income-transfered`;
    },

    incomeListByTransferId(transfer_id) {
      return `${API_HOST}financial/income-list-by-transfer-id?transfer_id=${transfer_id}`;
    },

    getExpenseList(page, startTime, endTime, type, sub_type) {
      return `${API_HOST}financial/journal-list?skip=${((page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}&start_date=${startTime}&end_date=${endTime}&type=${type}&sub_type=${sub_type}`;
    },

    newDailyExpense() {
      return `${API_HOST}financial/create-journal`;
    },

    newExpenseType() {
      return `${API_HOST}financial/create-journal-sub-type`;
    },

    getProjectTypeList(type, showAll = 0) {
      return `${API_HOST}financial/journal-sub-type-list?show_all=${showAll}&type=${type}&key&skip=0&limit=-1`;
    },

    fixedAssets: {
      list(condition) {
        const { name, page } = condition;
        return `${API_HOST}fixed-assets/fixed-assets-list?key=${name}&skip=${((parseInt(page) -
          1) || 0) * api.config.limit}&limit=${api.config.limit}`;
      },
      listById(id) {
        return `${API_HOST}fixed-assets/fixed-assets-detail?fixed_assets_id=${id}`;
      },
      add() {
        return `${API_HOST}fixed-assets/add-assets`;
      },
      editStatus() {
        return `${API_HOST}fixed-assets/change-status`;
      },
      useLogs(fixedAssetsId) {
        return `${API_HOST}fixed-assets/fixed-assets-log-list?fixed_assets_id=${fixedAssetsId}`;
      },
    },
  },

  // 7. 人事
  user: {
    genNewId() {
      return `${API_HOST}user/gen-user-new-id`;
    },
    getUploadToken(userId, fileType) {
      return `${API_HOST}user/get-user-upload-token?user_id=${userId}&file_type=${fileType}`;
    },
    getFileUrl(userId, fileType) {
      return `${API_HOST}user/get-user-file-url?user_id=${userId}&file_type=${fileType}`;
    },
    info() {
      return `${API_HOST}user/info`;
    },
    add() {
      return `${API_HOST}user/create`;
    },
    edit() {
      return `${API_HOST}user/edit`;
    },
    fire() {
      return `${API_HOST}user/fire`;
    },
    getList(condition) {
      return `${API_HOST}user/user-full-list?company_id=&department=${condition.department}&salary_group=${condition.salaryGroup}&keyword=${condition.key}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getDetail(userId) {
      return `${API_HOST}user/user-full-detail?_id=${userId}`;
    },

    getCompanyLoginLimit() {
      return `${API_HOST}company/login-limit`;
    },

    // certificate
    genCaNewId() {
      return `${API_HOST}user/gen-user-ca-new-id`;
    },
    getCaUploadToken(userCaId, fileType) {
      return `${API_HOST}user/get-user-ca-upload-token?user_ca_id=${userCaId}&file_type=${fileType}`;
    },
    getCaFileUrl(userCaId, fileType) {
      return `${API_HOST}user/get-user-ca-file-url?user_ca_id=${userCaId}&file_type=${fileType}`;
    },
    getCaList(userId) {
      return `${API_HOST}user/user-ca-list?user_id=${userId}`;
    },
    deleteUserCertificate(userId, userCaId) {
      return `${API_HOST}user/user-ca-delete?user_id=${userId}&_id=${userCaId}`;
    },

    getUsersByDeptAndRole(departmentId = '', role = '') {
      return `${API_HOST}user/user-list?department=${departmentId}&role=${role}`;
    },

    // salary
    getSalaryGroups() {
      return `${API_HOST}user/salary-group-list`;
    },
    getSalaryItems(userId) {
      return `${API_HOST}user/user-salary-items?user_id=${userId}`;
    },
    updateSalaryInfo() {
      // return API_HOST + 'user/edit-salary';
      return `${API_HOST}user/edit-salary-v2`;
    },
    prepareCalculateSalary(userId, month) {
      return `${API_HOST}user/prepare-calculate-salary?user_id=${userId}&month=${month}`;
    },
    calculateSalary(userId, month) {
      return `${API_HOST}user/calculate-salary?user_id=${userId}&month=${month}`;
    },
    getSalaryHistory(userId) {
      return `${API_HOST}user/self-salary-list?user_id=${userId}`;
    },
    calculateTax() {
      return `${API_HOST}user/calculate-tax`;
    },
    freezeSalary() {
      return `${API_HOST}user/freeze-salary`;
    },
    getSalaryList(condition) {
      return `${API_HOST}user/salary-list?department=${condition.department}&month=${condition.month}&keyword=${condition.key}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    getUserMeritPayItem(condition) {
      return `${API_HOST}user/user-merit-pay-items?user_id=${condition.userId}&month=${condition.month}&skip=${((condition.page -
        1) || 0) * api.config.limit}&limit=${api.config.limit}&type=${condition.type}`;
    },

    getDepartmentRoles(departmentId) {
      return `${API_HOST}user/department-roles?department=${departmentId}`;
    },

    getAllDepartmentRoles() {
      return `${API_HOST}user/all-department-roles`;
    },

    getUsers() {
      return `${API_HOST}user/user-list`;
    },

    getPurchaseUsers(isLeader) {
      return `${API_HOST}user/purchase-user-list?is_leader=${isLeader}`;
    },
    getMaintainUsers(isLeader) {
      return `${API_HOST}user/maintain-user-list?is_leader=${isLeader}`;
    },

    // permission
    // 1. 员工所属公司的全部权限
    getCompanyPermissions() {
      return `${API_HOST}user/company-auth-item-list`;
    },

    // 2. 员工的全部权限
    getUserPermissions(userId) {
      return `${API_HOST}user/user-auth-item-list?user_id=${userId}`;
    },

    // 3. 员工所属角色的全部权限
    getRolePermissions(roleId) {
      return `${API_HOST}user/company-role-item-list?role=${roleId}`;
    },

    // 登录获取全部权限
    getAllPermission() {
      return `${API_HOST}user/self-auth-item-list`;
    },
    editPermission() {
      return `${API_HOST}user/edit-auth`;
    },
    checkPermission(path) {
      return `${API_HOST}user/check-auth?path=${path}`;
    },
  },

  // 8. 营销
  coupon: {
    getCouponList(condition = {}) {
      return `${API_HOST}coupon/coupon-item-list?skip=${((parseInt(condition.page) - 1) || 0) *
      api.config.limit}&limit=${condition.page ? api.config.limit : ''}&keyword=${condition.key ||
      ''}&status=${condition.status || ''}&type=${condition.type || ''}`;
    },
    getCouponItemDetail(id) {
      return `${API_HOST}coupon/coupon-item-detail?id=${id}`;
    },
    createCouponItem() {
      return `${API_HOST}coupon/create-coupon-item`;
    },
    updataCouponStatus() {
      return `${API_HOST}coupon/update-coupon-item-status`;
    },
    addCouponCardType() {
      return `${API_HOST}coupon/create-coupon-card-type`;
    },
    editCouponCardType() {
      return `${API_HOST}coupon/edit-coupon-card-type`;
    },
    getCouponCardTypeList(keyword, status, pageSetting = {}) {
      if (!pageSetting.page || pageSetting.page < 1) {
        pageSetting.page = 1;
      }
      if (!pageSetting.pageSize || pageSetting.pageSize < 0) {
        pageSetting.pageSize = api.config.limit;
      }
      const skip = (pageSetting.page - 1) * pageSetting.pageSize;
      const limit = pageSetting.pageSize;
      return `${API_HOST}coupon/coupon-card-type-list?skip=${skip}&limit=${limit}&keyword=${keyword}&status=${status}`;
    },
    getCouponCardTypeInfo(memberCardTypeId) {
      return `${API_HOST}coupon/coupon-card-type-detail?coupon_card_type=${memberCardTypeId}`;
    },
    genMemberCard() {
      return `${API_HOST}coupon/gen-member-card`;
    },
    getGenMemberCardLog(memberCardTypeId) {
      return `${API_HOST}coupon/member-card-gen-log-list?member_card_type_id=${memberCardTypeId}&skip=${api.config.skip}&limit=${api.config.limit}`;
    },
    updateCouponCardTypeStatus() {
      return `${API_HOST}coupon/update-coupon-card-type-status`;
    },
    exportMemberCardDistributeLog(memberCardTypeId, logId) {
      return `${API_HOST}coupon/export-member-card?member_card_type_id=${memberCardTypeId}&member_card_gen_log_id=${logId}`;
    },
    checkMemberCard() {
      return `${API_HOST}coupon/check-member-card`;
    },
    activateCouponCard() {
      return `${API_HOST}coupon/activate-coupon-card`;
    },
    getCouponOrderList(condition) {
      return `${API_HOST}coupon/coupon-card-order-list?skip=${((condition.page - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}&keyword=${condition.key}&coupon_card_type=${condition.couponCardId}&coupon_start_date_begin=${condition.startDate}&coupon_start_date_end=${condition.endDate}`;
    },
    payMemberOrder() {
      return `${API_HOST}coupon/pay-member-order`;
    },
    getCouponCardTypeCompanyList(type, key) {
      return `${API_HOST}coupon/coupon-card-type-company-list?coupon_card_type=${type}&key=${key}&skip=${0}&limit=-1`;
    },
    getCouponOrderDetail(orderId) {
      return `${API_HOST}coupon/coupon-card-order-detail?order_id=${orderId}`;
    },

    getCouponGiveCouponItem() {
      return `${API_HOST}coupon/give-coupon-item`;
    },

    getCouponCustomerCount(companyId, couponCardType, autoBrandIds) {
      return `${API_HOST}coupon/customer-count?company_id=${companyId}&coupon_card_type=${couponCardType}&auto_brand_ids=${autoBrandIds}`;
    },

    getCouponItemPushList(condition) {
      return `${API_HOST}coupon/coupon-item-push-list?coupon_item_id=${condition.id}&skip=${((condition.page -
        1) || 0) * 5}&limit=5`;
    },

    // 活动
    getCouponActivityList(condition = {}) {
      return `${API_HOST}coupon/coupon-activity-list?keyword=${condition.key ||
      ''}&limit=${condition.page ? api.config.limit : ''}&skip=${((condition.page - 1) || 0) *
      api.config.limit}`;
    },

    createCouponActivity() {
      return `${API_HOST}coupon/create-coupon-activity`;
    },

    editCouponActivity() {
      return `${API_HOST}coupon/edit-coupon-activity`;
    },

    getCouponActivityDetail(id) {
      return `${API_HOST}coupon/coupon-activity-detail?id=${id}`;
    },
    couponGiveCouponItem() {
      return `${API_HOST}coupon/give-coupon-item`;
    },
    couponPushCouponActivity() {
      return `${API_HOST}coupon/push-coupon-activity`;
    },
    getCouponActivityPushList(condition) {
      return `${API_HOST}coupon/coupon-activity-push-list?activity_id=${condition.id}&skip=${((condition.page -
        1) || 0) * 5}&limit=5`;
    },

    // 数据统计
    statisticCouponItemGrabDays(startTime, endTime, couponItemId) {
      return `${API_HOST_ADMIN}statistic/coupon-item-grab-days?start_date=${startTime}&end_date=${endTime}&coupon_item=${couponItemId}`;
    },

    statisticActivityViewDays(startTime, endTime, activityId) {
      return `${API_HOST_ADMIN}statistic/coupon-activity-view-days?start_date=${startTime}&end_date=${endTime}&activity_id=${activityId}`;
    },

    statisticActivityGrabDays(startTime, endTime, activityId) {
      return `${API_HOST_ADMIN}statistic/coupon-activity-grab-days?start_date=${startTime}&end_date=${endTime}&activity_id=${activityId}`;
    },

    //  助力砍价
    bargainActivityList(condition, all = false) {
      return `${API_HOST}coupon/bargain-activity-list?skip=${((Number(condition.page) - 1) || 0) *
      api.config.limit}&limit=${all ? '-1' : api.config.limit}`;
    },
    bargainActivityAttendList(condition) {
      return `${API_HOST}coupon/bargain-activity-attend-list?activity_id=${condition.activityId}&keyword=${condition.key}&skip=${((Number(condition.page) -
        1) || 0) *
      api.config.limit}&limit=${api.config.limit}&status=${condition.status}&user_id=${condition.inviterId}`;
    },
    bargainActivityChange() {
      return `${API_HOST}coupon/bargain-activity-change`;
    },

    bonusEditBargainActivity() {
      return `${API_HOST}coupon/bonus-edit-bargain-activity`;
    },

    // 砍价记录列表
    bargainActivityAssistList(condition) {
      return `${API_HOST}coupon/bargain-activity-assist-list?activity_id=${condition.activityId}&attend_id=${condition.attendId}&skip=${((Number(condition.page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    createBargainActivity() {
      return `${API_HOST}coupon/create-bargain-activity`;
    },
    editBargainActivity() {
      return `${API_HOST}coupon/edit-bargain-activity`;
    },
    bargainActivityDetail(activityId) {
      return `${API_HOST}coupon/bargain-activity-detail?activity_id=${activityId}`;
    },

    //  短信相关
    smsConsumeList(condition) {
      return `${API_HOST}sms/consume-list?sub_type=${condition.subType}&skip=${((Number(condition.page) -
        1) || 0) *
      api.config.limit}&limit=${api.config.limit}&status=${condition.status}&start_date=${condition.startDate}&end_date=${condition.endDate}`;
    },
    smsChargeList(condition) {
      return `${API_HOST}sms/charge-list?skip=${((Number(condition.page) - 1) || 0) *
      api.config.limit}&limit=${api.config.limit}`;
    },
    smsGenChargeParams(chargeLevel) {
      return `${API_HOST}sms/gen-charge-params?charge_level=${chargeLevel}`;
    },

    //  领券活动
    createCouponActivity() {
      return `${API_HOST}coupon/create-coupon-activity`;
    },
    baseEditCouponActivity() {
      return `${API_HOST}coupon/base-edit-coupon-activity`;
    },
    bonusEditCouponActivity() {
      return `${API_HOST}coupon/bonus-edit-coupon-activity`;
    },
    couponActivityList(condition) {
      return `${API_HOST}coupon/coupon-activity-list?limit=${api.config.limit}&skip=${((Number(condition.page) -
        1) || 0) * api.config.limit}&keyword=${condition.key ||
      ''}&is_show_all=${condition.isShowAll || '1'}`;
    },
    couponActivityListAll() {
      return `${API_HOST}coupon/coupon-activity-list?limit=&skip=&keyword=&is_show_all=0`;
    },
    couponActivityDetail(condition) {
      return `${API_HOST}coupon/coupon-activity-detail?id=${condition.id}`;
    },
    pushCouponActivity() {
      return `${API_HOST}coupon/push-coupon-activity`;
    },
    couponActivityPushList(condition) {
      return `${API_HOST}coupon/coupon-activity-push-list?activity_id=${condition.id}&skip=${((Number(condition.page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    couponActivityAttendList(condition) {
      return `${API_HOST}coupon/coupon-activity-attend-list?activity_id=${condition.activityId}&keyword=${condition.key}&user_id=${condition.inviterId}&skip=${((Number(condition.page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    couponActivityGrabList(condition) {
      return `${API_HOST}coupon/coupon-activity-grab-list?activity_id=${condition.activityId}&attend_id=${condition.attendId}&skip=${((Number(condition.page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    //  核销
    searchCouponItemList(condition) {
      return `${API_HOST}coupon/search-coupon-item-list?phone=${condition.phone}&skip=${((Number(condition.page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    useCustomerCouponItem() {
      return `${API_HOST}coupon/use-customer-coupon-item`;
    },

    couponItemConsumeFullList(condition) {
      return `${API_HOST}coupon/coupon-item-consume-full-list?phone=${condition.phone}&skip=${((Number(condition.page) -
        1) || 0) *
      api.config.limit}&limit=${api.config.limit}&coupon_item_name=${condition.couponItemName}&start_date=${condition.startDate}&end_date=${condition.endDate}`;
    },
    couponItemConsumeSelfList(condition) {
      return `${API_HOST}coupon/coupon-item-consume-self-list?phone=${condition.phone}&skip=${((Number(condition.page) -
        1) || 0) *
      api.config.limit}&limit=${api.config.limit}&coupon_item_name=${condition.couponItemName}&start_date=${condition.startDate}&end_date=${condition.endDate}`;
    },
  },

  // 9. 任务/提醒 todo change task to remind
  task: {
    /**
     * 提醒列表
     */

    getRenewalInsuranceList(between, status, page) {
      return `${API_HOST}task/insurance-list?between=${between}&status=${status}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getMaintenanceList(between, status, page) {
      return `${API_HOST}task/maintain-list?between=${between}&status=${status}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getYearlyInspectionList(between, status, page) {
      return `${API_HOST}task/inspection-list?between=${between}&status=${status}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getDebtList(startDate, endDate, status, page) {
      return `${API_HOST}task/debt-list?start_date=${startDate}&end_date=${endDate}&status=${status}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getMemberCardExpireList(between, status, page) {
      return `${API_HOST}task/coupon-card-list?between=${between}&status=${status}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getBirthdayList(between, status, page) {
      return `${API_HOST}task/birthday-list?between=${between}&status=${status}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },
    getCommonTask(status, startDate, endDate, page) {
      return `${API_HOST}task/common-list?status=${status}&start_date=${startDate}&end_date=${endDate}&skip=${((Number(page) -
        1) || 0) * api.config.limit}&limit=${api.config.limit}`;
    },

    /**
     * 客户详情页提醒列表
     */
    // 1.保养
    getCustomerMaintainReminders(customerId) {
      return `${API_HOST}task/maintain-list?customer_id=${customerId}&between=0-30&status=-2&skip=0&limit=-1`;
    },

    // 2.续保
    getCustomerRenewalReminders(customerId) {
      return `${API_HOST}task/insurance-list?customer_id=${customerId}&between=0-45&status=-1&skip=0&limit=-1`;
    },

    // 3.年检
    getCustomerYearlyInspectionReminders(customerId) {
      return `${API_HOST}task/inspection-list?customer_id=${customerId}&between=0-30&status=-1&skip=0&limit=-1`;
    },

    // 4.套餐卡
    getCustomerCouponCardReminders(customerId) {
      return `${API_HOST}task/coupon-card-list?customer_id=${customerId}&between=0-30&status=-1&skip=0&limit=-1`;
    },

    // 5.生日
    getCustomerBirthdayReminders(customerId) {
      return `${API_HOST}task/birthday-list?customer_id=${customerId}&between=0-30&status=-1&skip=0&limit=-1`;
    },

    // 6.催收款
    getCustomerDebtReminders(customerId, startDate, endDate) {
      return `${API_HOST}task/debt-list?customer_id=${customerId}&start_date=${startDate}&end_date=${endDate}&status=-1&skip=0&limit=-1`;
    },

    // 7.其他回访
    getCustomerCommonRemimders(status, startDate, endDate) {
      return `${API_HOST}task/common-list?status=-1&start_date=${startDate}&end_date=${endDate}&skip=0&limit=-1`;
    },

    // 1.创建
    createCustomerTask() {
      return `${API_HOST}task/create-common-task`;
    },
    // deleted
    createMaintainTask() {
      return `${API_HOST}task/create-maintain-task`;
    },

    taskFollowUp() {
      return `${API_HOST}task/follow-up`;
    },
    taskFollowHistory(taskId, taskType) {
      return `${API_HOST}task/follow-up-list?task_id=${taskId}&task_type=${taskType}`;
    },
    commonTaskTypeList() {
      return `${API_HOST}task/common-task-type-list`;
    },
    createCommonTaskType() {
      return `${API_HOST}task/create-common-task-type`;
    },
    tastSummary() {
      return `${API_HOST}task/task-summary`;
    },
    taskCustomerMaintainList(customerId, page = 1) {
      return `${API_HOST}task/customer-maintain-list?customer_id=${customerId}
      &skip=${((Number(page) - 1) || 0) * api.config.limit}&limit=`;
    },
  },
};

export default api;
