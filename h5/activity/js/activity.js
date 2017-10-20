$(function() {
  //获取地址栏传递参数
  var id = getQueryString('id');

  //获取地址栏参数
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  //活动Id
  var activityId = '';

  //验证码Id
  var codeId = '';

  //活动说明页面
  var desc = $('.activity-description');

  $('.explain').on('click', function() {
    desc.fadeIn(200);
    desc.height($('.content').height());
  });

  $('.close').on('click', function() {
    desc.fadeOut(200);
    desc.height(0);
  });

  $('.receive').on('click', function() {
    var phoneValue = $('.input-phone').val();
    var isPhone = checkMobile(phoneValue);

    if (!isPhone) {
      return false;
    }
    //领取优惠
    grabCoupon(phoneValue);
  });

  function grabCoupon(phoneValue) {
    var data = {};

    if (!!codeId) {
      data = {
        activity_id: activityId,
        phone: phoneValue,
        code_id: codeId,
        code: $('.input-code').val(),
      };
    } else {
      data = {
        activity_id: activityId,
        phone: phoneValue,
      };
    }

    $.ajax({
      type: 'POST',
      url: window.baseURL + '/wechat/' + 'coupon/grab-coupon-activity',
      data: data,
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: function(data) {
        var code = String(JSON.parse(data).code);

        if (code === '0') {
          //直接领取优惠券
          $('.success-receive p:nth-of-type(2)').text($('.card .right p:nth-of-type(1)').text());
          $('.success-receive p:nth-of-type(3)').text('已发送至账户: ' + phoneValue);
          $('.success-receive').css('display', 'flex');
          $('.download').css('display', 'flex');
          $('.download a button').text('立即使用');
          $('.overdue').hide();
          $('.active').hide();
          $('.has-receive').hide();
        } else if (code === '3113') {
          //超过了领用数量限制
          $('.has-receive p:nth-of-type(2)').text($('.card .right p:nth-of-type(1)').text());
          $('.has-receive p:nth-of-type(3)').text('已发送至账户: ' + phoneValue);
          $('.success-receive').hide();
          $('.download').css('display', 'flex');
          $('.download a button').text('立即使用');
          $('.overdue').hide();
          $('.active').hide();
          $('.has-receive').css('display', 'flex');
        } else if (code === '3112') {
          //活动已经结束
        } else if (code === '3114') {
          //手机号需要验证

          $('.success-receive').hide();
          $('.download').hide();
          $('.download a button').text('立即使用');
          $('.overdue').hide();
          $('.active').show();
          $('.verification').css('display', 'flex');
          $('.has-receive').hide();

          // verificationPhone(phoneValue);
        } else if (code === '3115') {
          sweetAlert({ title: '提示', text: '验证码输入错误，请核对后重新输入' });
        }
      },
      error: function() {
      },
    });
  }

  //检测手机号码合法性
  function checkMobile(phoneValue) {
    if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(phoneValue))) {
      sweetAlert({ title: '提示', text: '请填写正确手机号码' });
      // $('.input-phone').focus();
      return false;
    }
    return true;
  }

  $('.get-code').on('click', function() {
    var phoneValue = $('.input-phone').val();
    var isPhone = checkMobile(phoneValue);

    if (!isPhone) {
      return false;
    }

    //点击获取验证码 按钮置灰，倒计时一分钟
    $('.get-code').attr('disabled', true);
    var time = 60;
    window.timer = setInterval(function() {
      time--;
      $('.get-code').text('重发(' + time + '秒)');
      if (Number(time) <= 0) {
        clearInterval(window.timer);
        $('.get-code').attr('disabled', false);
        $('.get-code').text('获取验证码');
      }
    }, 1000);

    $.ajax({
      type: 'POST',
      url: window.baseURL + '/client/' + 'customer/get-code',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        phone: phoneValue,
      },
      success: function(data) {
        codeId = JSON.parse(data).res.sms._id;
      },
    });
  });

  //获取当前优惠信息
  $.ajax({
    type: 'GET',
    url: window.baseURL + '/wechat/' + 'coupon/coupon-activity-detail?id=' + id,
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    success: function(data) {
      data = JSON.parse(data);

      if (String(data.code) === '1001') {
        getAuthLoginUrl();
      } else if (String(data.code) === '0') {
        var detail = data.res.detail;
        window.shareTitle = detail.title;
        window.shartDescription = detail.description;
        handle(detail);
      }
    }, error: function() {
    },
  });

  //获取公众号认证地址
  function getAuthLoginUrl() {
    $.ajax({
      url: window.baseURL + '/wechat/' + 'customer/get-auth-login-url',
      data: {
        url: window.location.href,
      },
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: function(data) {
        data = JSON.parse(data);
        location.href = data.res.auth_login_url;
      },
      error: function(data) {
      },
    });
  }

  function handle(detail) {
    activityId = detail._id;
    getImage(detail.banner_pic);

    //设置背景色和按钮的颜色
    $('.content').css('background-color', detail.background_color);
    $('.receive').css('background-color', detail.button_color);
    $('.banner').css('background-color', detail.background_color);

    //设置主标题和副标题
    $('.descript p:nth-of-type(1)').text(detail.description);
    // $('.descript p:nth-of-type(2)').text(detail.sub_title);

    //设置活动规则
    var rules = detail.rule ? detail.rule.split('\n') : [];

    var p = $('<p/>');

    for (var index in rules) {
      var span = $('<span/><br/>');
      span.text(rules[index]);
      p.append(span);
    }

    var time = $('<span />');
    time.text(detail.expire_time.split(' ')[0] + '日');
    var timeDesc = $('<p>活动有效期至: </p>');
    timeDesc.append(time);

    $('.rule').append('<h1>活动说明</h1>');
    $('.rule').append(p);
    $('.rule').append(timeDesc);
    $('.rule').append('<p>详情请咨询店内前台</p>');

    //已经过期
    var couponItem = detail.coupon_item_info;

    var arr = detail.expire_time.split(/[- : \/]/);
    var endTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    var now = new Date();

    if (now > endTime) {
      $('.overdue').css('display', 'flex');
      $('.download').css('display', 'flex');
      $('.download a button').text('立即下载');
      $('.active').hide();
      $('.has-receive').hide();
      $('.overdue p:nth-of-type(2)').text(couponItem.name + ' 已无法领取');
      // $('.overdue p:nth-of-type(2)').text(couponItem.name + ' 已无法领取已无法领取已无法领取');
      return false;
    }
    setCouponInfo(couponItem, detail);
  }

  //获取banner图片
  function getImage(pic) {
    $.ajax({
      type: 'GET',
      url: window.baseURL + '/v1/' + 'system/get-public-pic-url?file_name=' + pic,
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: function(data) {
        var picUrl = JSON.parse(data).res.url;
        window.shareUrl = picUrl;
        $('.banner img').attr('src', picUrl);
        //这个函数是调用微信转发是获取的config，script在index.html页面。在window设置完成后再调用
        getConfig();
      },
      error: function() {
      },
    });
  }

  //计算折扣率
  function getCouponRate(value) {
    var rate = String(Number(Number(value).toFixed(2)) * 100);
    if (rate.length === 1) {
      return ((rate / 10) || '0') + '折';
    }

    if (Number(rate.charAt(rate.length - 1)) === 0) {
      rate = rate.slice(0, rate.length - 1);
    }
    return (rate || '0') + '折';
  }

  //设置优惠券信息
  function setCouponInfo(couponItem, detail) {
    //优惠券没有过期 正常领取
    if (String(couponItem.type) === '1') {
      $('.card .left span:nth-of-type(1)').text('￥');
      $('.card .left span:nth-of-type(2)').text(parseFloat(couponItem.price));

      $('.card .right p:nth-of-type(2)').text('计次券');
    } else if (String(couponItem.type) === '2') {
      $('.card .left span:nth-of-type(1)').text('');
      $('.card .left span:nth-of-type(2)').text(getCouponRate(couponItem.discount_rate));

      $('.card .right p:nth-of-type(2)').text('折扣券');
    }

    $('.card .right p:nth-of-type(1)').text(couponItem.name);

    if (Number(detail.coupon_item_info.valid_type) === 0) {
      $('.card .right p:nth-of-type(3)').
        text(detail.coupon_item_info && (detail.coupon_item_info.valid_start_date + ' 至 ' +
          detail.coupon_item_info.valid_expire_date));
      /*$('.card .right p:nth-of-type(4)').
        text(detail.coupon_item_info && detail.coupon_item_info.valid_expire_date);*/
    } else if (Number(detail.coupon_item_info.valid_type) === 1) {
      $('.card .right p:nth-of-type(3)').
        text('领取后当天生效 ' + detail.coupon_item_info.valid_day + '天内有效');
    }

  }

  //下载链接
  (function downloadApp() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var downloadUrl = '';

    $('button').on('touchstart', function(e) {
      e.stopPropagation();
      $(this).css({
        border: '1px solid #02C874',
        color: '#02C874',
      });
    });

    $.ajax({
      type: 'GET',
      url: window.baseURL + '/v1/' + 'system/get-app-toc-download-url',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: function(data) {
        downloadUrl = JSON.parse(data).res.url;
        var iosUrl = downloadUrl.ios ? downloadUrl.ios.url : '';
        var androidUrl = downloadUrl.android ? downloadUrl.android.url : '';
        if (isAndroid) {
          $('.downloadBtn').attr('href', androidUrl);
        } else {
          $('.downloadBtn').attr('href', iosUrl);
        }
      },
      error: function() {
      },
    });
  })();

});