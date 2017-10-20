// 分享领券活动
const ShareController = {
  /**
   * 获取转发领券活动详情
   * type 0:直接领券 1: 转发领券
   * coupon_item_info: 单个优惠券信息 type 0:固定时间 1: 往后推n天, valid_day
   * attend_info: coupon_count:优惠券次数,0为不限次； coupon_remain: 剩余几个还未领，一次领一组，若为0且是限次活动，则该活动已领完
   * @param id
   * @param userId
   * @param attendId
   */
  getShareActivityDetail(id, userId = '0', attendId = '0') {
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

          let searchString = location.search;
          let searchAttendId = BaseController.getLocationParam('attend_id');
          if (!searchString || searchString.indexOf('attend_id') < 0 || searchAttendId === null) {
            searchString = '?attend_id=' + data.res.self_attend_id + searchString.replace('?', '&');
            location.href = location.origin + location.pathname + searchString;
          }

          // 保存分享信息
          window.shareTitle = detail.title;
          window.shareDescription = detail.description;
          window.shareLink = `${location.origin}/h5/coupon/forward.html${searchString}`;

          BaseController.renderBannerPicture(detail.banner_pic, true);
          ShareController.showPageInfo(data.res);
        }
      },
      error: function(error) {
      },
    });
  },

  showPageInfo(response) {
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

    ShareController.renderCoupons(response);
    BaseController.renderRules(detail.rule);
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
              <p class="card-time">有效期至${Util.formatDateToCN(item.valid_expire_date)}</p>
            </div>
          </div>`);
      });

      $couponCardList.empty().append(couponHtmls);

      // 非不限次活动
      if (response.attend_info && response.attend_info.coupon_count !== '0') {
        // 已抢完
        if (parseInt(response.attend_info.coupon_remain, 10) === 0) {
          $couponCardList
            .find('.coupon-card-item')
            .addClass('disabled')
            .first()
            .find('.card-right')
            .after('<img src="./img/stamp_closed.png" class="stamp" alt="已抢完">');
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
};

$(function() {
  let activityId = BaseController.getLocationParam('id');
  let attendId = BaseController.getLocationParam('attend_id');
  let userId = BaseController.getLocationParam('user_id') || '0';

  ShareController.getShareActivityDetail(activityId, userId, attendId);

  // click share button, show modal
  $('.-btn-share').on('click', function() {
    $('.-share-tip-modal').removeClass('hide');
  });

  // click modal mask, close modal
  $('.-share-tip-modal').on('click', function() {
    $(this).toggleClass('hide');
  });

  // click modal content, do nothing
  $('.-share-tip-container').on('click', function() {
    return false;
  });
});
