$(function() {
  var type = getQueryString('type');

  var zhifubaoApi = '';
  var weixinApi = '';

  var params = {};

  if (String(type) === 'dealerPayIntention') {
    //todo 意向金支付参数
    var orderId = getQueryString('order_id');

    params = {
      order_id: orderId,
    };

    zhifubaoApi = window.baseURL + '/admin/' + 'market-order/gen-earnest-pay-params';
    weixinApi = window.baseURL + '/wechat/' + 'pay/gen-market-order-earnest-params';
    document.title = '意向金支付';

  } else if (String(type) === 'dealerPayDeposit') {
    //todo 找车定金支付参数
    var orderId = getQueryString('order_id');

    params = {
      order_id: orderId,
    };

    zhifubaoApi = window.baseURL + '/admin/' + 'market-order/gen-deposit-pay-params';
    weixinApi = window.baseURL + '/wechat/' + 'pay/gen-market-order-deposit-params';
    document.title = '定金支付';

  } else {
    //todo 稻田系统购买短信支付
    var chargeLevel = getQueryString('chargeLevel');
    var companyId = getQueryString('companyId');
    var userId = getQueryString('userId');

    params = {
      charge_level: chargeLevel,
      company_id: companyId,
      user_id: userId,
    };

    zhifubaoApi = window.baseURL + '/v1/' + 'sms/gen-charge-params';
    weixinApi = window.baseURL + '/wechat/' + 'pay/gen-sms-charge-params';
    document.title = '购买短信支付';
  }

  if (isWeiXin()) {
    getWeiXinChargeParams(weixinApi, params);
  } else {
    getZhifubaoChargeParams(zhifubaoApi, params);
  }
});