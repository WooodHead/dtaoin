// 直接领券活动
const DirectController = {
  getDirectActivityDetail(id, userId = '0') {
    $.ajax({
      url: API.directActivityDetail(id, userId),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      dataType: 'json',
      success: function(data) {
        if (data.code === 0) {
          DirectController.showInfo(data.res);
        }
      },
      error: function(error) {
        BaseController.showToast('请稍后重试');
      },
    });
  },

  showInfo(response) {
    let detail = response.detail;

    let redPacketText = `送你${detail.coupon_count}个红包`;
    if (String(detail.coupon_count) === '0') {
      redPacketText = '送你个优惠券大礼包';
    }

    $('#app').css('background', detail.background_color);
    $('.-activity-title').text(detail.title);
    $('.-activity-desc').text(detail.description);
    $('.-activity-packet-count').text(redPacketText);
    $('.-activity-expire-date').text(`活动有效期至：${Util.formatDateToCN(detail.expire_date)}`);

    let selfPhone = response.self_phone;
    let grabInfo = response.self_grab_info;
    let isGrabbed = !!grabInfo || grabInfo !== null && Object.keys(grabInfo).length > 0;

    // 若已经绑定了手机号且未领取过优惠券，则自动获取优惠券
    if (selfPhone && grabInfo === null) {
      if (BaseController.isActivityOver(detail.expire_date)) {
        return;
      }

      let params = {
        activity_id: BaseInfo.activityId,
        phone: selfPhone,
      };
      DirectController.requestGrabCoupon(params);
    }

    if (isGrabbed) {
      DirectController.renderGrabSuccessInfo(selfPhone);
    }

    BaseController.renderBannerPicture(detail.banner_pic);
    DirectController.renderCouponCards(detail);
    StoreController.renderFirstValidStore(detail.valid_company_infos);
    BaseController.renderRules(detail.rule);

    sessionStorage.setItem('stores', JSON.stringify(detail.valid_company_infos));
  },

  renderCouponCards(detail) {
    let coupons = detail.coupon_item_infos;

    let couponHtmls = [];
    if (coupons && coupons.length > 0) {
      coupons.map(item => {
        couponHtmls.push(
          `<div class="coupon-card-item">
            <div class="card-left">
              <span class="rmb">￥</span>
              ${Util.renderCouponFaceValue(item.price)}
            </div>
            <div class="card-right">
             <h3 class="card-title">${item.name}</h3>
             <p class="card-time">有效期至${item.valid_expire_date}</p>
            </div>
          </div>`);
      });

      $('#coupons').empty().append(couponHtmls);

      // 已过期
      if (BaseController.isActivityOver(detail.expire_date)) {
        $('#coupons')
          .find('.coupon-card-item')
          .addClass('disabled')
          .first()
          .find('.card-right')
          .after('<img src="./img/stamp_overdue.png" class="stamp" alt="已过期">');

        $('.-body-title').addClass('hide');
        $('.-form').addClass('hide');
        $('.-body-footer-info')
          .removeClass('hide')
          .empty()
          .append('<p class="content-body-footer-desc">祝你下次好运，手速逆天</p>');
      }
    }
  },

  renderGrabSuccessInfo(account) {
    $('.-body-title').empty().append('<p>恭喜获得优惠券!</p><p>凭手机号就可到店使用啦！</p>');
    $('.-form').addClass('hide');
    $('.-body-footer-info')
      .removeClass('hide')
      .empty()
      .append(`<p>优惠券已经放到您 <span class="text-primary">${account}</span> 的账户中</p>`);
  },

  handleGrabButtonClick(activityId) {
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
      phone: phone,
      code: code,
      code_id: codeId,
    };

    DirectController.requestGrabCoupon(params);
  },

  requestGrabCoupon(params) {
    $.ajax({
      type: 'POST',
      url: API.directActivityGrabCoupons(),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: params,
      dataType: 'json',
      success: function(data) {
        if (data.code === 0) {
          DirectController.renderGrabSuccessInfo(params.phone);
        } else {
          // todo 已参与过，不能重复参与, 页面该如何展示
          BaseController.showToast(data.msg);
        }
      },
      error: function(error) {
        BaseController.showToast(Text.error.grabFail);
      },
    });
  },
};

$(function() {
  BaseController.init();

  let activityId = BaseController.getLocationParam('id');
  BaseInfo.activityId = activityId;

  DirectController.getDirectActivityDetail(activityId);

  $('#phone').on('blur', function() {
    let phone = $(this).val();
    if (!phone) {
      return;
    }

    let $btnSendVerifyCode = $('.-btn-send-verify-code');
    let $btnGrabCoupon = $('.-btn-grab-direct-coupon');
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
  $(document).on('click', '.-btn-grab-direct-coupon', function() {
    DirectController.handleGrabButtonClick(activityId);
  });

  // 点击发送验证码
  $(document).on('click', '.-btn-send-verify-code', function() {
    BaseController.handleSendVerifyCode();
  });
});
