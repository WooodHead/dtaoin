$(function() {
  //获取地址栏传递参数
  var id = getQueryString('id');
  var attendId = getQueryString('attend_id');
  var userId = getQueryString('user_id');

  //砍价音频
  var audio = document.getElementById('audio');

  //活动信息
  var detail = {};

  //转发参与信息
  var attendInfo = {};

  //自己参加的id
  var selfAttendId = '';

  //排行榜信息
  var rankListInfo = [];

  //帮砍榜信息
  var helpBargainListInfo = [];

  //获取地址栏参数
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  //检测手机号码合法性
  function checkMobile(phoneValue) {
    return /^1[3|4|5|7|8][0-9]{9}$/.test(phoneValue);
  }

  //获取日期格式，主要兼容ios浏览器问题
  function getDate(dateStr) {
    var dateArr = dateStr.split(/[- : \/]/);
    if (!!dateArr[3]) {
      return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
    }
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
  }

  //获取优惠活动详情，如果可以获取到则继续获取其他信息，若获取不到，则调用微信登录接口进行登录
  function getDetail() {
    $.ajax({
      url: window.baseURL + '/wechat/' + 'coupon/bargain-activity-detail',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        id: id,
        attend_id: attendId,
        user_id: userId,
      },
      dataType: 'json',
      success: function(data) {
        //  code为1001 则未登录 跳获取公众号认证地址
        if (String(data.code) === '1001') {
          getAuthLoginUrl();
        } else if (data.res.detail) {
          detail = data.res.detail;

          attendInfo = data.res.attend_info;
          selfAttendId = data.res.self_attend_id;

          //已经参加过重新扫码进入 跳到自己的活动中
          if (!attendId && !!selfAttendId) {
            var url = location.origin + location.pathname + '?id=' + id + '&attend_id=' +
              selfAttendId;
            location.href = url;
          }

          window.showTitle = detail.title;
          //设置描述图片
          setDescriptPic();

          //设置banner图片以及邀请好友弹窗图片
          setBannerPic();

          //设置页面显示内容
          setActivityInfo();

          //设置进度条显示
          setProgressInfo();

          //设置邀请朋友砍价
          if (!!attendInfo) {
            setInvitationBargain();
          }
        }

      },
      error: function(data) {
      },
    });
  }

  getDetail();

  //获取并设置排行榜
  function getRankingList() {
    $.ajax({
      url: window.baseURL + '/wechat/' + 'coupon/bargain-activity-max-attend-list',
      data: {
        id: id,
        use_id: userId,
      },
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        if (Number(data.code) === 0) {

          $('#rand-list').empty();

          var list = data.res.list;
          if (list.length > 0) {
            rankListInfo = list;
          }

          var ul = $('<ul>');
          for (var i = 0; i < list.length; i++) {
            var li = $('<li>\n' +
              '          <div class="name">\n' +
              '            <div class="index">' + (i + 1) + '</div>\n' +
              '            <img src=' + list[i].avatar_url + '>\n' +
              '            <span>' + list[i].nick_name + '</span>\n' +
              '          </div>\n' +
              '          <span class="bargain-price">￥' + list[i].current_price + '</span>\n' +
              '        </li>');
            ul.append(li);
          }
          var p = $('<p>');
          p.css('height', '10px');
          ul.append(p);
        }

        $('#rand-list').append(ul);
      },
      error: function(data) {
      },
    });
  }

  getRankingList();

  //获取并设置帮砍榜
  function helpCutList(limit) {
    $('#help-bargain-introduce').text('加载中...');
    $.ajax({
      url: window.baseURL + '/wechat/' + 'coupon/bargain-activity-assist-list',
      data: {
        id: id,
        attend_id: attendId,
        use_id: userId,
        skip: 0,
        limit: limit,
      },
      xhrFields: {
        withCredentials: true,
      },
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
        if (Number(data.code) === 0) {
          if (Number(data.res.total) <= 0) {
            $('#help-bargain-introduce').text('暂时还没有砍价记录哦');
            return false;
          }

          if (String(limit) === '-1') {
            $('#help-bargain-introduce').text('已经全部加载');
          } else {
            $('#help-bargain-introduce').text('点击加载全部');
          }

          if (Number(data.res.total) <= 5) {
            $('#help-bargain-introduce').text('已经加载全部');
          }

          $('#help-bargain-list').empty();

          var list = data.res.list;
          if (list.length > 0) {
            helpBargainListInfo = list;
          }
          var ul = $('<ul>');
          for (var i = 0; i < list.length; i++) {
            var li = $('<li>\n' +
              '          <div class="name">\n' +
              '            <img src=' + list[i].avatar_url + '>\n' +
              '            <span>' + list[i].nick_name + '</span>\n' +
              '          </div>\n' +
              '          <span class="bargain-price">已砍 ￥' + list[i].bargain_price + '</span>\n' +
              '        </li>');
            ul.append(li);
          }
        } else {
          $('#help-bargain-introduce').text('暂无数据');
        }

        $('#help-bargain-list').append(ul);
      },
      error: function() {
        $('#help-bargain-introduce').text('暂无数据');
      },
    });
  }

  helpCutList(10);

  //获取公众号认证地址
  function getAuthLoginUrl() {
    $.ajax({
      type: 'POST',
      url: window.baseURL + '/wechat/' + 'customer/get-auth-login-url',
      data: {
        url: window.location.href,
        use_id: userId,
      },
      xhrFields: {
        withCredentials: true,
      },
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
        location.href = data.res.auth_login_url;
      },
      error: function() {
      },
    });
  }

  //设置描述图片显示
  function setDescriptPic() {
    var descript = {};
    try {
      descript = JSON.parse(detail.description);
    } catch (e) {
    }

    $('#introduce').empty();
    setDescriptOrder(descript, 0);
  }

  function setDescriptOrder(descript, order) {
    if (!!descript[order]) {
      $.ajax({
        url: window.baseURL + '/v1/' + 'system/get-public-pic-url',
        data: {
          file_name: descript[order].pic,
          use_id: userId,
        },
        dataType: 'json',
        success: function(data) {
          var pic = $('<div>');
          var img = $('<img>');
          img.attr('src', data.res.url);

          pic.append(img);

          if (!!descript[order].text) {
            pic.attr('class', 'pic');
            var p = $('<p>');
            p.text(descript[order].text);
            pic.append(p);
          } else {
            pic.attr('class', 'pic-no-text');

          }

          $('#introduce').append(pic);

          setDescriptOrder(descript, order + 1);
        },
        error: function(data) {
        },
      });
    }
  }

  //设置banner图片以及邀请好友弹窗图片显示
  function setBannerPic() {
    var bannerPic = detail.banner_pic;

    $.ajax({
      url: window.baseURL + '/v1/' + 'system/get-public-pic-url',
      data: {
        file_name: bannerPic,
        use_id: userId,
      },
      dataType: 'json',
      success: function(data) {
        var url = data.res.url;

        window.shareUrl = url;
        getConfig();

        $('#title-pic').attr('src', url);
        $('#invitation-pic').attr('src', url);
      },
      error: function(data) {
      },
    });
  }

  //将邀请好友dom映射成图片
  function getInvitationPic() {
    var dom = $('#invitation-bargain');
    var width = dom.width();
    var height = dom.height();
    var type = 'png';
    var scaleBy = 2;
    var showScaleBy = 2;
    var canvas = document.createElement('canvas');

    var offsetTop = dom.offset().top;

    canvas.width = width * scaleBy;
    canvas.height = (height + offsetTop) * scaleBy;
    canvas.style.width = width * scaleBy + 'px';
    canvas.style.height = height * scaleBy + 'px';

    var context = canvas.getContext('2d');
    context.scale(showScaleBy, showScaleBy);
    context.font = 'Microsoft YaHei';
    html2canvas(dom, {
      scale: scaleBy,
      width: width, //dom 原始宽度
      height: height, //dom 原始高度
      canvas: canvas,
      profile: true,
      useCORS: true,
      allowTaint: true,
      onrendered: function(canvas) {
        $('#invitation-bargain').hide();
        var all_width = $(window).width();
        $('#invitation-bargain-pic-img').
          append(Canvas2Image.convertToImage(canvas, width * showScaleBy, height *
            showScaleBy, type));

        $('.img-container img').css('width', all_width + 'px').css('height', 'auto');
      },
    });
  }

  //设置页面显示内容
  function setActivityInfo() {
    $('.activity-info #title').text(detail.title);
    $('.activity-info #time').text('活动时间: ' + detail.start_date + ' 至 ' + detail.expire_date);
    $('.all-price #min-price').text('底价' + detail.min_price + '元');
    $('.all-price #sell_price').text('原价' + detail.sell_price + '元');
    // $('.progress-bar #start_price').text('现价' + detail.start_price + '元');
    $('.all-price #coupon_total').text('剩余' + detail.remain_coupon_count + '份');

    $('#get-prize-time').text('【活动时间】' + detail.start_date + '至' + detail.expire_date);
    $('#get-prize-company').text('【兑奖门店】' + detail.company_name);
    $('#get-prize-address').text('【门店地址】' + detail.company_address);

    $('.explain a').attr('href', 'tel:' + detail.company_hotline_phone);
    $('.explain a').text('咨询电话 ' + detail.company_hotline_phone);

    //设置活动规则
    var rules = detail.rule ? detail.rule.split('\n') : [];
    $('.explain #rules').children('p').remove();

    for (var index in rules) {
      var p = $('<p/>');
      p.text(rules[index]);
      $('.explain #rules').append(p);
    }

    //  项目已经售完
    if ((Number(detail.remain_coupon_count) <= 0) && !attendId) {
      $('#cut_stamp').show();
      $('#join').hide();
      if (!!attendInfo) {
        $('.progress-bar #start_price').text('现价' + attendInfo.current_price + '元');
        if (!!attendInfo.is_self) {
          $('title').html('我的砍价');
        } else {
          $('title').html(attendInfo.nick_name + '的砍价');
        }
      } else {
        $('.progress-bar #start_price').text('现价' + detail.start_price + '元');
        $('title').html(detail.title);
      }
      return false;
    }

    var expireDate = getDate((detail.expire_date + ' 23:59:59'));
    var now = new Date();

    //过期了
    if (now > expireDate) {
      $('#cut_stamp').attr('src', './images/cut_stamp_overdue@3x.png').show();
      $('#join').hide();
      if (!!attendInfo) {
        $('.progress-bar #start_price').text('现价' + attendInfo.current_price + '元');
        if (!!attendInfo.is_self) {
          $('title').html('我的砍价');
        } else {
          $('title').html(attendInfo.nick_name + '的砍价');
        }
      } else {
        $('.progress-bar #start_price').text('现价' + detail.start_price + '元');
        $('title').html(detail.title);
      }
      return false;
    }

    //这是一个新的活动，不是由别人转发过来的
    if (!attendInfo) {
      $('title').html(detail.title);
      $('#count-time p').text('参与活动即可享受优惠，快快行动吧！');
      $('.progress-bar #start_price').text('现价' + detail.start_price + '元');
    }

    if (!!attendInfo) {
      var bargainPrice = Number(detail.start_price) - Number(attendInfo.current_price);
      $('#current-price').show();
      $('.progress-bar #start_price').text('现价' + attendInfo.current_price + '元');
      $('#bargain-price').
        text(attendInfo.bargain_count + '人帮砍啦，共计已砍价' + bargainPrice.toFixed(2) + '元');

      $('title').html(attendInfo.nick_name + '的砍价');
    }

    //是一个参与过的，不是自己的活动
    if (!!attendInfo && !attendInfo.is_self) {
      $('#join').hide();
      $('#help-bargain-btn').show();

      if (!selfAttendId) {
        $('#join').show();
        $('#join').css({
          'background': 'white',
          'border': '1px solid #CCCCCC',
        });
      } else {
        $('#join').hide();
        $('#my-bargain').show();
        $('#my-bargain').css({
          'background': 'white',
          'border': '1px solid #CCCCCC',
        });
      }

      //如果好友已经兑换，则显示好友已兑换，不显示帮砍成功以及已砍到底
      if (Number(attendInfo.status) === 1) {
        $('#has-exchange').show();
        $('#help-bargain-btn').hide();
        $('#bargain-total').hide();
        $('#bargain-help-success').hide();
      } else {
        //if 砍价到底  else if 已经帮砍成功
        if (Number(attendInfo.current_price) <= Number(detail.min_price)) {
          $('#help-bargain-btn').hide();
          $('#bargain-total').show();
        } else if (attendInfo.is_assist) {
          $('#help-bargain-btn').hide();
          $('#bargain-total').hide();
          $('#bargain-help-success').show();
        }
      }
    }

    //是一个参与过的，是自己的活动
    if (!!attendInfo && attendInfo.is_self) {
      $('#bargain-btn').show();
      $('#invitation').show();
      $('#invitation-help-btn').show();
      $('#join').hide();

      if (!attendInfo.is_assist) {
        $('#invitation-help-btn').css({
          'background': 'white',
          'border': '1px solid #CCCCCC',
        });
      }

      $('title').html('我的砍价');

      //自己已经砍价过了
      if (attendInfo.is_assist) {
        $('#bargain-btn').hide();
        $('#invitation-help-btn').show();
      }
    }
  }

  //设置进度条显示
  function setProgressInfo() {
    var currentPrice = 0;
    if (!!attendInfo) {
      currentPrice = attendInfo.current_price;
    } else {
      currentPrice = detail.start_price;
    }

    var sellPrice = detail.sell_price;
    var minPrice = detail.min_price;
    var totalDiff = Number(sellPrice) - Number(minPrice);
    var currentDiff = Number(currentPrice) - Number(minPrice);

    var rate = currentDiff / totalDiff;
    var currentPriceWidth = $('#progress-bar').width() * rate;

    //设置最短距离
    if (currentPriceWidth < 6) {
      currentPriceWidth = 6;
    }

    $('#now-price').css('width', currentPriceWidth);
    $('#triangle-handstand').css('left', currentPriceWidth - 6);

    var priceWordChangeWidth = $('#progress-bar').width() + 30 - 135;
    var currentPriceWordWidth = priceWordChangeWidth * rate;
    $('#start_price').css('left', currentPriceWordWidth - 15);
  }

  //设置邀请好友弹窗dom
  function setInvitationBargain() {
    var nickName = attendInfo.nick_name;
    if(attendInfo.nick_name && attendInfo.nick_name.length > 6) {
      nickName = attendInfo.nick_name.slice(0, 6) + '...';
    }

    $('#invitation-nick-name').text(nickName);
    $('#invitation-nick-pic').attr('src', attendInfo.attend_customer_avatar_url);

    var title = detail.title;
    if (title.length > 12) {
      title = detail.title.slice(0, 12) + '...';
    }

    $('#invitation-title').text(title);
    $('#invitation-sell-price').text('原价 ￥' + detail.sell_price);
    $('#invitation-min-price').text('底价 ￥' + detail.min_price);

    //获取短链接
    $.ajax({
      url: window.baseURL + '/wechat/' + 'system/get-short-url',
      data: {
        url: location.href,
        use_id: userId,
      },
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        if (Number(data.code) === 0) {
          //删除原有的二维码
          $('#qrcode').empty();

          // 设置二维码
          new QRCode(document.getElementById('qrcode'), {
            text: data.res.short_url,
            width: 60,
            height: 60,
          });
        }

        setTimeout(function() {
          $('#invitation-bargain').show();
          getInvitationPic();
        });
      },
      error: function(data) {
      },
    });

  }

  //点击我要参加
  $('#join').on('click', function() {
    //活动已经售完
    if (Number(detail.remain_coupon_count) <= 0) {
      $('#active-end').show();
      setTimeout(function() {
        $('#active-end').hide();
      }, 2000);
      return false;
    }

    $('#mask').show();
    $('#awarding').show();
  });

  //点击加载全部
  $('#help-bargain-introduce').on('click', function() {
    helpCutList('-1');
  });

  //点击我要砍价
  $('#bargain-btn').on('click', function() {
    audio.play();
    $.ajax({
      url: window.baseURL + '/wechat/' + 'coupon/assist-bargain-activity',
      type: 'POST',
      data: {
        id: id,
        attend_id: attendId,
        use_id: userId,
      },
      xhrFields: {
        withCredentials: true,
      },
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
        if (Number(data.code) === 0) {
          var bargainPrice = data.res.assist_info.bargain_price;
          var currentPrice = Number(attendInfo.current_price) - Number(bargainPrice);

          //  自己砍价成功后
          $('#own-bargain-success').show();
          $('#mask').show();

          var title = detail.title;
          if (detail.title.length > 12) {
            title = detail.title.slice(0, 12) + '...';
          }
          $('#own-bargain-coupon').text('已成功将' + title);
          $('#own-bargain-price').html('砍到了<span>' + Number(currentPrice).toFixed(2) + '<span>元');
        }
      },
      error: function(data) {
      },
    });
  });

  //点击帮ta砍价
  $('#help-bargain-btn').on('click', function() {
    audio.play();
    $.ajax({
      url: window.baseURL + '/wechat/' + 'coupon/assist-bargain-activity',
      type: 'POST',
      data: {
        id: id,
        attend_id: attendId,
        use_id: userId,
      },
      xhrFields: {
        withCredentials: true,
      },
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
        if (Number(data.code) === 0) {
          var bargainPrice = data.res.assist_info.bargain_price;

          //帮砍成功后
          $('#help-bargain-success').show();
          $('#mask').show();
          $('#help-bargain-price').html('成功砍价<span>' + bargainPrice + '<span>元');
        }
      },
      error: function(data) {
      },
    });
  });

  //点击邀请好友帮砍
  $('.invitation-help-btn').on('click', function() {
    /*$('#invitation-bargain').show();
    getInvitationPic();*/
    $('#own-bargain-success').hide();
    $('#invitation-bargain-pic').show();
    $('#mask').show();
  });

  $('#input-phone').bind('input propertychange', function(e) {
    var value = e.target.value;
    if (checkMobile(value)) {
      $('#input-phone').attr('class', 'input-phone-right');
      $('#phone-error').css('visibility', 'hidden');
    }
  });

  //点击我要参加的确定按钮
  $('#awarding-confirm').on('click', function() {
    var phoneValue = $('#input-phone').val();
    var isPhone = checkMobile(phoneValue);

    if (!isPhone) {
      $('#input-phone').attr('class', 'input-phone-error');
      $('#phone-error').css('visibility', 'visible');
      $('#input-phone').val('');
      return false;
    }

    $.ajax({
      url: window.baseURL + '/wechat/' + 'coupon/attend-bargain-activity',
      type: 'POST',
      data: {
        id: id,
        phone: phoneValue,
        user_id: userId,
        attend_id: attendId,
      },
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        var selfAttendId = data.res.attend_info._id;
        var url = location.origin + location.pathname + '?id=' + id + '&attend_id=' + selfAttendId;
        location.href = url;
      },
      error: function(data) {
      },
    });

    $('#mask').hide();
    $('#awarding').hide();

  });

  //点击我的砍价
  $('#my-bargain').on('click', function() {
    var url = location.origin + location.pathname + '?id=' + id + '&attend_id=' + selfAttendId;
    location.href = url;
  });

  //点击关闭按钮
  $('.close').on('click', function() {
    $('#mask').hide();
    $('#awarding').hide();
    $('#own-bargain-success').hide();
    $('#help-bargain-success').hide();
    $('#invitation-bargain-pic').hide();

    $('#invitation-bargain-pic-img').find('img').remove();

    getDetail();
    getRankingList();
    helpCutList(10);
  });

  //砍价榜tab切换栏
  var tabOne = $('#tab-one');
  var tabTwo = $('#tab-two');
  var helpBargainList = $('#help-bargain-list');
  var randList = $('#rand-list');
  tabOne.on('click', function() {
    tabOne.css({
      'border-bottom': '2px solid #ff7720',
      'color': '#ff7720',
    });
    tabTwo.css({
      'border-bottom': '1px solid #d8d8d8',
      'color': 'black',
    });
    helpBargainList.show();
    randList.hide();
    $('#help-bargain-introduce').show();
    $('#rank-list-introduce').hide();
  });

  tabTwo.on('click', function() {
    tabTwo.css({
      'border-bottom': '2px solid #ff7720',
      'color': '#ff7720',
    });
    tabOne.css({
      'border-bottom': '1px solid #d8d8d8',
      'color': 'black',
    });
    helpBargainList.hide();
    randList.show();
    $('#help-bargain-introduce').hide();
    if (rankListInfo.length <= 0) {
      $('#rank-list-introduce').show();
    }
  });

});