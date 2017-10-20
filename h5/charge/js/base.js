//获取地址栏参数
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

function isZhifubao() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.match(/Alipay/i) == 'alipay') {
    return true;
  } else {
    return false;
  }
}

//获取公众号认证地址
function getAuthLoginUrl() {
  $.ajax({
    url: window.baseURL + '/wechat/' + 'customer/get-auth-login-url',
    data: {
      url: window.location.href,
    },
    type: 'POST',
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    success: function (data) {
      location.href = data.res.auth_login_url;
    },
    error: function (data) {
      alert(data);
    },
  });
};

function getZhifubaoChargeParams(api, params) {
  $.ajax({
    url: api,
    data: params,
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    success: function (data) {
      location.href = data.res.url;
    },
    error: function (data) {
      alert(data);
    },
  });
}

function getWeiXinChargeParams(api, params) {
  $.ajax({
    url: api,
    data: params,
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    dataType: 'json',
    success: function (data) {
      //1001此时是微信浏览器且没有授权,走授权流程
      if (String(data.code) === '1001') {
        getAuthLoginUrl();
      } else if (String(data.code) === '0') {
        createPayment(data.res.charge);
      }
    },
    error: function (data) {
      console.log(data);
    },
  });
}

function createPayment(charge) {
  pingpp.createPayment(charge, function (result, err) {
    // console.log(result);
    // console.log(err.msg);
    // console.log(err.extra);
    if (result == 'success') {
      // alert('支付成功');
      // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
      location.href = 'success.html';
    } else if (result == 'fail') {
      // alert('支付失败');
      // charge 不正确或者微信公众账号支付失败时会在此处返回
      location.href = 'fail.html';
    } else if (result == 'cancel') {
      alert('取消支付');
      // 微信公众账号支付取消支付
    }
  });
}