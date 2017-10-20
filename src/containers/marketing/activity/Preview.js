import React from 'react';
import { Modal, Button } from 'antd';

import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';

const logo = require('../../../images/activity_preview/coupon_h5_logo.png');
const icon1 = require('../../../images/activity_preview/coupon_h5_bottom_icon1.png');
const icon2 = require('../../../images/activity_preview/coupon_h5_bottom_icon2.png');
const icon3 = require('../../../images/activity_preview/coupon_h5_bottom_icon3.png');
const icon4 = require('../../../images/activity_preview/coupon_h5_bottom_icon4.png');

require('../activity.less');

export default class StarterCustomer extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
    };
    this.getImage = this.getImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.detail) {
      this.getImage(nextProps.detail);
    }
  }

  getImage(detail) {
    api.ajax({ url: api.system.getPublicPicUrl(detail.banner_pic) }, data => {
      this.setState({ imgUrl: data.res.url });
    });
  }

  getCouponRate(value) {
    let rate = String(Number(Number(value).toFixed(2)) * 100);
    if (rate.length === 1) {
      return `${(rate / 10) || '0'  }折`;
    }

    if (Number(rate.charAt(rate.length - 1)) === 0) {
      rate = rate.slice(0, rate.length - 1);
    }
    return `${rate || '0'  }折`;
  }

  render() {
    const { detail } = this.props;
    const { imgUrl } = this.state;

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>预览</Button>
        <Modal
          title="预览"
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <div className="content-preview" style={{ backgroundColor: detail.background_color }}>

            <div className="banner">
              <img src={imgUrl} alt="" />
            </div>

            <div className="coupon">

              <div className="descript">
                <p>{detail.description}</p>
              </div>

              <div className="active">
                <div className="card clearfix">
                  <div className="left">
                    <div>
                      {
                        detail.coupon_item_info &&
                        (String(detail.coupon_item_info.type) === '1'
                          ?
                          <span><span>￥</span><span>{parseFloat(detail.coupon_item_info.price)}</span></span>
                          :
                          <span>{this.getCouponRate(Number(detail.coupon_item_info.discount_rate))}</span>)
                      }
                    </div>
                  </div>
                  <div className="right">
                    <p>{detail.coupon_item_info && detail.coupon_item_info.name}</p>
                    <p>
                      {detail.coupon_item_info &&
                      (String(detail.coupon_item_info.type) === '1' ? '计次券' : '折扣券')}
                    </p>
                    {
                      (detail.coupon_item_info && Number(detail.coupon_item_info.valid_type) === 0)
                        ? <span className="valid-day">
                            <p>{detail.coupon_item_info &&
                            `${detail.coupon_item_info.valid_start_date} 至 ${detail.coupon_item_info.valid_expire_date}`}</p>
                          </span>
                        : <p>{`领取后当天生效${detail.coupon_item_info &&
                      detail.coupon_item_info.valid_day}天内有效`}</p>
                    }
                  </div>
                </div>

                <div className="prompt">
                  <p>输入手机号码，领取优惠券</p>
                </div>

                <div className="btn">
                  <div>
                    <input disabled={true} className="input-phone" type="text"
                           placeholder="输入手机号码" />
                  </div>

                  <div className="verification">
                    <input className="input-code" type="text" placeholder="请输入验证码" />
                    <button className="get-code">获取验证码</button>
                  </div>

                  <div>
                    <button className="receive" style={{ backgroundColor: detail.button_color }}>立即领取</button>
                  </div>
                </div>

                <div className="explain">
                  <p>查看活动说明 ></p>
                </div>
              </div>

              <div className="overdue">
                <p>活动已过期</p>
                <p>{}</p>
                <p>更多优惠敬请期待</p>
              </div>

              <div className="has-receive">
                <p>您已经领取过优惠券了</p>
                <p>9.9元洗车卷</p>
                <p>已发送至账户：21231312313</p>
              </div>

              <div className="success-receive">
                <p>恭喜领取成功</p>
                <p>9.9元洗车卷</p>
                <p>已发送至账户：21231312313</p>
              </div>

              <div className="download">
                <p>下载水稻汽车APP享受优质服务</p>
                <a className="downloadBtn" href="">
                  <button>立即下载</button>
                </a>
              </div>

            </div>

            <footer>

              <div className="logo">
                <div>
                  <img src={logo} alt="" />
                </div>

                <div>
                  <p>平价放心的汽车服务连锁</p>
                </div>
              </div>

              <div className="show">
                <div>
                  <img src={icon1} alt="精致洗车" />
                  <span>精致洗车</span>
                </div>

                <div>
                  <img src={icon2} alt="深度保养" />
                  <span>深度保养</span>
                </div>

                <div>
                  <img src={icon3} alt="专业维修" />
                  <span>专业维修</span>
                </div>

                <div>
                  <img src={icon4} alt="钣金喷漆" />
                  <span>钣金喷漆</span>
                </div>
              </div>
            </footer>

            <div className="activity-description">
              <div>
                <div>
                  <h1>活动说明</h1>
                  <p>本活动阿萨德雷锋静安寺大连房价阿萨德飞机啦按时来对付按时撒地方撒地方阿斯蒂芬撒地方撒地方撒地方撒地方阿斯蒂芬大发</p>
                  <p>活动有效期至：<span>2017年6月30日</span></p>
                  <p>详情请咨询店内前台</p>
                </div>

                <div className="close">
                  <p>关闭</p>
                </div>
              </div>
            </div>

          </div>

        </Modal>
      </span>
    );
  }
}
