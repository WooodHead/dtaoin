import React from 'react';

import api from '../../../middleware/api';

require('../coupon-activity-preview.less');

const icon = require('../../../images/coupon/info_store_location_h5.png');
const call = require('../../../images/coupon/info_store_call_h5.png');
const backArrow = require('../../../images/preview_titlebar_back_arrow.png');
const avatar = require('../../../images/coupon/sample_avatar.png');

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      introducePicture: '',
    };
    [
      'getBannerPic',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getBannerPic();
  }

  componentWillReceiveProps(nextProps) {
    // 使用定时器可以更准确拿到this.props.state,否则前面setState后不触发此函数
    setTimeout(() => {
      this.getBannerPic();
    });
  }

  getRules = (rule, className) => {
    const rules = rule.split('\n');

    let p = '';
    for (const i in rules) {
      p += `<p class="${  className  }"/>${  rules[i]  }<br/>`;
    }
    return p;
  };

  getPicUrl(pic) {
    if (!pic) {
      return '';
    }
    return new Promise((resolve, reject) => {
      api.ajax({
        url: api.system.getPublicPicUrl(pic),
      }, data => {
        resolve(data.res.url);
      }, () => {
        reject('');
      });
    });
  }

  async getBannerPic() {
    const { state } = this.props;
    const banner_pic = this.props.detail.banner_pic;
    const file = state.banner_pic_files;

    if (!!file && !!file[0]) {
      if (!!banner_pic) {
        this.setState({ introducePicture: file[0].preview });
        return true;
      }
    } else {
      if (!!banner_pic) {
        const url = await this.getPicUrl(banner_pic);
        this.setState({ introducePicture: url });
        return true;
      }
    }
  }

  getCouponRate(value) {
    let rate = String(Number(Number(value).toFixed(2)) * 100);
    if (rate.length === 1) {
      return <span><span>{(rate / 10) || '0'}</span><span className="rmb">折</span></span>;
    }

    if (Number(rate.charAt(rate.length - 1)) === 0) {
      rate = rate.slice(0, rate.length - 1);
    }
    return <span><span>{(rate || '0')}</span><span className="rmb">折</span></span>;
  }

  render() {
    const { introducePicture } = this.state;
    const { detail, couponMap, companyMap, color, type, receiveNum } = this.props;

    const couponMapDeep = new Map([...couponMap]);
    const companyMapDeep = new Map([...companyMap]);

    couponMapDeep.delete('add');
    companyMapDeep.delete('add');

    const couponList = Array.from(couponMapDeep.values());
    const companyList = Array.from(companyMapDeep.values());

    return (
      <div className="marketing-activity-preview">
        <div className="title-bar">
            <span className="return-back">
              <img src={backArrow} /> 返回
            </span>
          <span className="my-bargain">领券活动</span>
        </div>

        <div className="page-container show-bottom-bar" style={{ backgroundColor: color }}>
          <div className="top-banner">
            {
              introducePicture
                ? <img src={introducePicture} alt="" />
                : <div className="img-replace">活动图片</div>
            }

          </div>

          <div className="content">
            <div className="content-head">
              <h3 className="content-head-title">{detail.title || '活动名称'}</h3>
              <div dangerouslySetInnerHTML={{
                __html: detail.description
                  ? this.getRules(detail.description, 'content-head-desc')
                  : '<p class="content-head-desc">营销文案</p>',
              }}>
              </div>

              <div className={String(type) === '1' ? 'prompt' : 'hide'}>
                <div><img src={avatar} alt="" /></div>
                <div className="word">
                  {
                    !!receiveNum ? <p>[微信昵称]领到了{receiveNum}个红包</p> : <p>[微信昵称]领到了优惠大礼包</p>
                  }
                  <p>也想分你一点</p>
                </div>
              </div>

              {String(type) === '1' ? '' : <p className="red-packet">距优惠券一步之遥啦</p>}

            </div>

            <div className="content-body">
              <h3 className="content-body-title hide">距离优惠券一步之遥了</h3>

              <div className="coupon-card-list">
                {
                  !!couponList && couponList.length > 0
                    ? couponList.map(item => (
                        <div key={item._id} className="coupon-card-item">
                          {
                            String(item.type) === '1'
                              ? <p className="card-left">
                                <span className="rmb">￥</span>
                                {parseFloat(item.price)}
                              </p>
                              : <p className="card-left">{this.getCouponRate(item.discount_rate)}</p>
                          }
                          <div className="card-right">
                            <h3 className="card-title">{item.name}</h3>
                            <p className="card-time">
                              {
                                String(item.valid_type) === '0'
                                  ? `有效期至${item.valid_expire_date}`
                                  : `领取后当天生效${item.valid_day}天有效`
                              }
                            </p>
                          </div>
                        </div>
                      ))
                    : (
                      <div>
                        <div className="coupon-card-item">
                          <p className="card-left"><span className="rmb">￥</span>9.9</p>

                          <div className="card-right">
                            <h3 className="card-title">九块九普洗券</h3>
                            <p className="card-time">有效期至2017-03-04</p>
                          </div>
                        </div>

                        <div className="coupon-card-item">
                          <p className="card-left"><span className="rmb">￥</span>9.9</p>

                          <div className="card-right">
                            <h3 className="card-title">九块九普洗券</h3>
                            <p className="card-time">有效期至2017-03-04</p>
                          </div>
                        </div>
                      </div>
                    )
                }
              </div>
              <div className="form hide">
                <div className="form-control">
                  <input type="text" placeholder="输入手机号码即可领取" />
                </div>

                <div className="form-control form-control-inline">
                  <input placeholder="输入验证码" />
                  <button type="button" className="btn btn-code">发送验证码</button>
                </div>

                <div className="form-control">
                  <button type="button" className="btn btn-share">领取优惠券</button>
                </div>
              </div>

              <div className="form">
                <div className="form-control">
                  <input placeholder="输入手机号码即可领取" />
                </div>

                <div className="form-control">
                  <button
                    type="button"
                    className="btn btn-share"
                    style={{ backgroundColor: color }}
                  >
                    领取优惠券
                  </button>
                </div>
              </div>
            </div>

            <div className="store-container">
              <div className="container-title-success">
                <p className="margin-bottom-5">可使用门店</p>
              </div>
              {
                companyList[0] ? (
                  <div className="store-item">
                    <h3 className="item-title">
                      {
                        companyList[0].name.length > 14
                          ? `${companyList[0].name.slice(0, 14)  }...`
                          : companyList[0].name
                      }
                    </h3>
                    <p className="item-desc">
                      <img
                        src={icon}
                        className="icon-location"
                        alt="icon"
                      />
                      {`${companyList[0].province} ${companyList[0].city} ${companyList[0].country} ${companyList[0].address}`}
                    </p>
                    <div className="right-call">
                      <img
                        src={call}
                        className="icon-call"
                        alt="call"
                      />
                    </div>
                  </div>
                ) : null
              }
              <div className="container-footer">更多门店 ></div>
            </div>

            <div className="line-divider">
              <span className="line-left" />
              <span className="line-title">活动规则</span>
              <span className="line-right" />
            </div>

            <div className="rule-wrapper">
              <div className="list">
                <div dangerouslySetInnerHTML={{
                  __html: detail.rule
                    ? this.getRules(detail.rule, 'list-item')
                    : '<p class="content-head-desc">暂无内容~</p>',
                }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
