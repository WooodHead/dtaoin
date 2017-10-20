// api 接口配置
const API = {
  // 系统
  verifyCode() {
    return `${window.baseURL}/client/customer/get-code`;
  },

  getPublicFile(fileName) {
    return `${window.baseURL}/v1/system/get-public-pic-url?file_name=${fileName}`;
  },

  getAppDownloadUrl() {
    return `${window.baseURL}/v1/system/get-app-toc-download-url`;
  },

  // 微信
  getWXSDKConfig(url) {
    return `${window.baseURL}/wechat/system/get-js-sdk-config?url=${url}`;
  },
  getWXAuthLoginURL() {
    return `${window.baseURL}/wechat/customer/get-auth-login-url`;
  },

  // 直领优惠券详情
  directActivityDetail(id, userId) {
    return `${window.baseURL}/wechat/coupon/coupon-activity-direct-detail?id=${id}&user_id=${userId}`;
  },
  // 领取直领券优惠券
  directActivityGrabCoupons() {
    return `${window.baseURL}/wechat/coupon/direct-grab-coupon-activity`;
  },
  // 分享优惠券详情
  shareActivityDetail(id, userId, attendId) {
    return `${window.baseURL}/wechat/coupon/coupon-activity-share-detail?id=${id}&user_id=${userId}&attend_id=${attendId}`;
  },
  // 领取分享优惠券
  shareActivityGrabCoupons() {
    return `${window.baseURL}/wechat/coupon/share-grab-coupon-activity`;
  },
  // 领取排行榜
  shareActivityRank(id, attendId) {
    return `${window.baseURL}/wechat/coupon/coupon-activity-grab-list?activity_id=${id}&attend_id=${attendId}`;
  },
};

const Text = {
  rankRandomDesc: [
    '欢天喜地抢了个红包',
    '快来抢红包，看看谁的手机好',
    '养车我只服水稻汽车',
    '修车养车，就选水稻汽车',
  ],
  error: {
    noPhone: '请输入电话号码',
    noCode: '请输入验证码',
    noCodeId: '请输获取验证码',
    phone: '电话号码错误',
    reqCode: '获取验证码失败',
    grabSuccess: '领取成功',
    grabFail: '领取失败',
  },
};

const Validator = {
  pattern: {
    phone: /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/,
  },

  validate(val, reg) {
    if (!reg) {
      return true;
    }
    return !!val && !!val.match(reg);
  },
};

const Util = {
  renderCouponFaceValue(faceValue) {
    if (isNaN(faceValue)) return 0;

    let valueString = String(faceValue);
    if (valueString.indexOf('.') > 0) {
      if (valueString.substring(valueString.indexOf('.') + 1).startsWith('0')) {
        return parseInt(valueString);
      } else {
        return Number(valueString).toFixed(2);
      }
    }
  },

  getRandomText() {
    let randomIndex = Math.floor(Math.random() * 4);
    return Text.rankRandomDesc[randomIndex];
  },

  formatDateToCN(dateString) {
    let date = new Date(dateString);
    if (dateString && $.type(date) === 'date') {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    return '';
  },
};

// 保存基本信息
const BaseInfo = {
  phone: '',
  code: '',
  codeId: '',
};

// 公共业务
const BaseController = {
  init() {
    BaseController.getJSSDKConfig(encodeURIComponent(window.location.href));
  },

  initWXConfig(config) {
    wx.config({
      debug: false,
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
    });

    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: window.shareTitle,
        link: window.shareLink,
        imgUrl: window.shareUrl,
        success: function() {
        },
        cancel: function() {
        },
      });

      wx.onMenuShareAppMessage({
        title: window.shareTitle,
        desc: window.shareDescription,
        link: window.shareLink,
        imgUrl: window.shareUrl,
        success: function(data) {
          let shareLink = window.shareLink;

          if (shareLink && shareLink.indexOf('id') > 0 && shareLink.indexOf('attend_id') > -1) {
            location.href = window.shareLink;
          }
        },
        cancel: function() {
        },
      });
      wx.error(function(err) {
      });
    });
  },

  getJSSDKConfig(url) {
    $.getJSON(API.getWXSDKConfig(url), function(data) {
      let config = data.res.config;
      if (config) {
        BaseController.initWXConfig(config);
      }
    });
  },

  authWXLogin() {
    $.post(API.getWXAuthLoginURL(), {url: window.location.href}, data => {
      window.location.href = data.res.auth_login_url;
    }, 'json');
  },

  handleSendVerifyCode() {
    let $btnSendVerifyCode = $('.-btn-send-verify-code');

    let phone = $('#phone').val();

    $btnSendVerifyCode.attr('disabled', true).addClass('disabled');

    let time = 60;
    window.timer = setInterval(function() {
      time--;
      $btnSendVerifyCode.text('重发(' + time + 's)');
      if (Number(time) <= 0) {
        clearInterval(window.timer);
        $btnSendVerifyCode
          .removeAttr('disabled')
          .removeClass('disabled')
          .text('获取验证码');
      }
    }, 1000);

    $.ajax({
      type: 'POST',
      url: API.verifyCode(),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {phone},
      dataType: 'json',
      success: function(data) {
        BaseInfo.phone = phone;
        BaseInfo.codeId = data.res.sms._id;
      },
      error: function(error) {
        alert(Text.error.reqCode);
      },
    });
  },

  getLocationParam(paramsName) {
    let reg = new RegExp('(^|&)' + paramsName + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r) return unescape(r[2]);
    return null;
  },

  isActivityOver(expireDate) {
    let now = new Date();
    let month = now.getMonth() + 1;
    let currentDateStr = `${now.getFullYear()}-${month}-${now.getDate()}`;

    if (month < 10) {
      currentDateStr = `${now.getFullYear()}-0${month}-${now.getDate()}`;
    }

    if (expireDate && typeof expireDate === 'string') {
      return currentDateStr > expireDate;
    }
  },

  renderBannerPicture(fileName, isInitWX) {
    $.getJSON(API.getPublicFile(fileName), data => {
      let imgURL = data.res.url +
        '?imageMogr2/auto-orient/thumbnail/50x50/blur/1x0/quality/75|imageslim';
      window.shareUrl = data.res.url;

      if (isInitWX) {
        BaseController.init();
      }

      $('.-top-banner img').attr('src', imgURL);
    });
  },

  renderRules(rule) {
    if (rule && typeof rule === 'string') {
      let rulesHtml = [];
      let rules = rule.split('\n');
      $.each(rules, function(index, rule) {
        rulesHtml.push(`<p class="list-item">${rule}</p>`);
      });
      $('.-rule-list').empty().append(rulesHtml);
    }
  },

  showToast(msg) {
    $('#toast').removeClass('hide');
    $('#toast_msg').text(msg);

    setTimeout(function() {
      $('#toast').addClass('hide');
    }, 2000);
  },

  downloadApp() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let downloadUrl = '';

    $.ajax({
      type: 'GET',
      url: API.getAppDownloadUrl(),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        downloadUrl = data.res.url;
        let iosUrl = downloadUrl.ios ? downloadUrl.ios.url : '';
        let androidUrl = downloadUrl.android ? downloadUrl.android.url : '';

        let $btnDownload = $('#btn_download');
        if (isAndroid) {
          $btnDownload.attr('href', androidUrl);
        } else {
          $btnDownload.attr('href', iosUrl);
        }
      },
      error: function() {
      },
    });
  },
};
