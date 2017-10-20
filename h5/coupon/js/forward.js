// 分享领券活动
const ShareController = {
  getShareActivityDetail(id, userId = '', attendId = '') {
    $.ajax({
      url: API.shareActivityDetail(id, userId, attendId),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        if (data.code === 1001) {
          BaseController.authWXLogin();
        } else {
          let detail = data.res.detail;
          BaseController.renderBannerPicture(detail.banner_pic, true);

          let searchString = location.search;
          if (searchString || searchString.indexOf('attend_id') < 0) {
            searchString = '?attend_id=' + data.res.self_attend_id + searchString.replace('?', '&');
          }

          window.shareTitle = detail.title;
          window.shareDescription = detail.description;
          window.shareLink = `${location.origin}/${location.pathname}${searchString}`;

          ShareController.showPageInfo(data.res);
        }
      },
      error: function(error) {
      },
    });
  },

  getShareActivityRank(id, attendId) {
    $.ajax({
      url: API.shareActivityRank(id, attendId),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        ShareController.renderRank(data.res.list);
      },
      error: function(error) {

      },
    });
  },

  showPageInfo(response) {
    // 邀请信息
    let attendInfo = response.attend_info;

    // 已绑定手机号
    let selfPhone = response.self_phone;

    // 若已经绑定了手机号且未领取过优惠券，则自动获取优惠券
    if (selfPhone && BaseInfo.attendId && response.self_grab_info === null) {
      let params = {
        activity_id: BaseInfo.activityId,
        attend_id: BaseInfo.attendId,
        phone: selfPhone,
      };
      ShareController.requestGrabCoupon(params);
    }

    let grabInfo = response.self_grab_info;
    let isGrabbed = !!grabInfo || grabInfo !== null && Object.keys(grabInfo).length > 0;
    let isSelf = attendInfo !== null ? attendInfo.phone === selfPhone : true;

    // 活动详情
    let detail = response.detail;

    ShareController.renderBaseInfo(detail);
    BaseController.renderRules(detail.rule);

    // 如已经领取
    if (isGrabbed) {
      ShareController.renderGrabSuccessInfo(response.self_phone);
    }

    if (!isSelf && attendInfo && Object.keys(attendInfo).length > 0) {
      let redPacketText = `领到了${detail.coupon_count}个红包`;
      if (String(detail.coupon_count) === '0') {
        redPacketText = '领到了优惠券大礼包';
      }

      $('.-content-body-title').empty().removeClass('hide').addClass('rank-list').append(
        `<div class="rank-item" style="justify-content:flex-start;">
          <div class="rank-item-left">
            <img src="${attendInfo.avatar_url}" alt="" class="user-avatar">
            <div class="user-info">
              <h3 class="right-top-desc">${attendInfo.nick_name}${redPacketText}</h3>
              <p class="right-bottom-desc">也想分你点</p>
            </div>
          </div>
        </div>`);
    }

    ShareController.renderCoupons(response);
    StoreController.renderFirstValidStore(detail.valid_company_infos);
    sessionStorage.setItem('stores', JSON.stringify(detail.valid_company_infos));
  },

  renderBaseInfo(detail) {
    let redPacketText = `送你${detail.coupon_count}个红包`;
    if (String(detail.coupon_count) === '0') {
      redPacketText = '送你个优惠券大礼包';
    }

    $('#app').css('background', detail.background_color);
    $('.-activity-title').text(detail.title);
    $('.-activity-desc').text(detail.description);
    $('.-activity-packet-count').text(redPacketText);
    $('.-activity-expire-date').text(`活动有效期至：${Util.formatDateToCN(detail.expire_date)}`);
  },

  renderGrabSuccessInfo(account) {
    $('.-content-body-title').addClass('hide');
    $('.-content-body-success-title').removeClass('hide');

    $('.-form').addClass('hide');
    $('.-body-footer-info')
      .removeClass('hide')
      .empty()
      .append(`<p>优惠券已经放到您 <span class="text-primary">${account}</span> 的账户中</p>`);

    $('.-store-container-title').addClass('hide');
    $('.-store-container-title-success').removeClass('hide');

    // 显示下载app button
    $('.-page-container').addClass('show-bottom-bar');
    $('.-bottom-action-bar').removeClass('hide');
    // 生成下载链接
    BaseController.downloadApp();
  },

  renderCoupons(response) {
    let $couponCardList = $('.-coupon-card-list');

    let coupons = response.detail.coupon_item_infos;

    let couponHtmls = [];

    if (coupons && coupons.length > 0) {
      $.each(coupons, function(index, item) {
        couponHtmls.push(
          `<div class="coupon-card-item">
            <div class="card-left">
              <span class="rmb">￥</span>${Util.renderCouponFaceValue(item.price)}
            </div>
            <div class="card-right">
              <h3 class="card-title">${item.name}</h3>
              <p class="card-time">有效期至${item.valid_expire_date}</p>
            </div>
          </div>`);
      });

      $couponCardList.empty().append(couponHtmls);

      // 非不限次活动
      if (response.attend_info && response.attend_info.coupon_count !== '0') {
        // 已抢完
        if (response.attend_info && parseInt(response.attend_info.coupon_remain, 10) === 0) {
          $couponCardList
            .find('.coupon-card-item')
            .addClass('disabled')
            .first()
            .find('.card-right')
            .after('<img src="./img/stamp_closed.png" class="stamp" alt="已抢完">');

          $('.-content-footer-desc').text('祝你下次好运，手速逆天');
          $('.-store-container-title').text('可使用门店').removeClass('hide');
        } else if (BaseController.isActivityOver(response.detail.expire_date)) {
          // 已过期
          $couponCardList
            .find('.coupon-card-item')
            .addClass('disabled')
            .first()
            .find('.card-right')
            .after('<img src="./img/stamp_overdue.png" class="stamp" alt="已过期">');
        }
      }
    }
  },

  renderRank(items) {
    if (items && items.length > 0) {
      let rankHtmls = [];
      items.map(item => {
        rankHtmls.push(
          `<div class="rank-item">
            <div class="rank-item-left">
              <img src="${item.avatar_url}" alt="" width="40" height="40" class="user-avatar">
              <div class="user-info">
                <h3 class="user-name">${item.nick_name} <span class="time">${item.mtime}</span></h3>
                <p class="rank-desc">${Util.getRandomText()}</p>
              </div>
            </div>
            <div class="rank-item-right">
              <p class="rank-money">${item.show_price}</p>
            </div>
          </div>`);
      });

      $('.-rank-list').empty().append(rankHtmls);
    }
  },

  handleGrabButtonClick(activityId, attendId) {
    let phone = $('#phone').val();
    let code = $('#code').val();
    let codeId = BaseInfo.codeId;

    if (!phone) {
      BaseController.showToast(Text.error.noPhone);
      return;
    }
    if (!code) {
      BaseController.showToast(Text.error.noCode);
      return;
    }
    if (!codeId) {
      BaseController.showToast(Text.error.noCodeId);
      return;
    }

    if (!!phone && !Validator.validate(phone, Validator.pattern.phone)) {
      BaseController.showToast(Text.error.phone);
      return;
    }

    let params = {
      activity_id: activityId,
      attend_id: attendId,
      phone: phone,
      code: code,
      code_id: BaseInfo.codeId,
    };

    ShareController.requestGrabCoupon(params);
  },

  requestGrabCoupon(params) {
    $.ajax({
      type: 'POST',
      url: API.shareActivityGrabCoupons(),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: params,
      dataType: 'json',
      success: function(data) {
        // 领取成功后，重新请求详情和排行榜
        if (data.code === 0) {
          ShareController.getShareActivityDetail(BaseInfo.activityId, BaseInfo.userId, BaseInfo.attendId);
          ShareController.getShareActivityRank(BaseInfo.activityId, BaseInfo.attendId);
        } else if (data.code === 3113) {
          BaseController.showToast(Text.error.grabFail);
          return false;
        }
      },
      error: function(error) {
        BaseController.showToast(Text.error.grabFail);
        return false;
      },
    });
  },
};

$(function() {
  let activityId = BaseController.getLocationParam('id');
  let attendId = BaseController.getLocationParam('attend_id');
  let userId = BaseController.getLocationParam('user_id');

  BaseInfo.activityId = activityId;
  BaseInfo.attendId = attendId;
  BaseInfo.userId = userId;

  ShareController.getShareActivityDetail(activityId, userId, attendId);
  ShareController.getShareActivityRank(activityId, attendId);

  // 分享领券
  $('.-btn-share').on('click', function() {
    $('.-share-tip-modal').removeClass('hide');
  });

  $('#phone').on('blur', function() {
    let phone = $(this).val();
    if (!phone) {
      return;
    }

    let $btnSendVerifyCode = $('.-btn-send-verify-code');
    let $btnGrabCoupon = $('.-btn-grab-share-coupon');
    let $verifyCodeLine = $('.-verify-code-line');

    if (Validator.validate(phone, Validator.pattern.phone)) {
      $btnSendVerifyCode.removeClass('disabled').removeAttr('disabled');
      $btnGrabCoupon.removeClass('disabled').removeAttr('disabled');
      $verifyCodeLine.removeClass('hide');
    } else {
      $btnSendVerifyCode.addClass('disabled').attr('disabled');
      $btnGrabCoupon.addClass('disabled').attr('disabled');
      BaseController.showToast(Text.error.phone);
    }
  });

  // 点击直接领券
  $(document).on('click', '.-btn-grab-share-coupon', function() {
    ShareController.handleGrabButtonClick(activityId, attendId);
  });

  // 点击发送验证码
  $(document).on('click', '.-btn-send-verify-code', function() {
    BaseController.handleSendVerifyCode();
  });
});
