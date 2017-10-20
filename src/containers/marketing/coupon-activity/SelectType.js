import React from 'react';
import { Button, Radio, Checkbox, Popover, message, Alert, Popconfirm } from 'antd';

import api from '../../../middleware/api';

const RadioGroup = Radio.Group;

const createSample1 = require('../../../images/marketing-coupon-activity/create_sample_1.png');
const createSample2 = require('../../../images/marketing-coupon-activity/create_sample_2.png');
const createSample3 = require('../../../images/marketing-coupon-activity/create_sample_3.png');
const createSample4 = require('../../../images/marketing-coupon-activity/create_sample_4.png');

export default class SelectType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: '0',
      checkboxScan: true,
      checkboxSettlement: false,
    };
    [
      'handleRadioChange',
      'handleCheckChange',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getDetail();
  }

  handleRadioChange(e) {
    const value = e.target.value;
    this.props.onTypeChange(value);
    this.setState({ radioValue: value, checkboxScan: true, checkboxSettlement: false });
  }

  handleCheckChange(e, type) {
    const value = e.target.checked;
    if (type === 'scan') {
      this.setState({ checkboxScan: value });
    } else if (type === 'settlement') {
      this.setState({ checkboxSettlement: value });
    }
  }

  handleSubmit() {
    const { radioValue, checkboxScan, checkboxSettlement } = this.state;

    if (!checkboxScan && !checkboxSettlement) {
      message.error('请选择使用场景');
      return false;
    }

    const data = {
      type: radioValue,
      is_show_qr: checkboxScan ? '1' : '0',
      is_pay_send: checkboxSettlement ? '1' : '0',
    };

    this.props.onActivityKeyChange('2');
    api.ajax({
      url: api.coupon.createCouponActivity(),
      type: 'POST',
      data,
    }, data => {
      this.props.onActivityIdGet(data.res.detail._id);
    });
  }

  getDetail() {
    const id = this.props.activityId;
    if (!!id) {
      api.ajax({
        url: api.coupon.couponActivityDetail({ id }),
      }, data => {
        const { detail } = data.res;
        this.setState({
          radioValue: detail.type,
          checkboxScan: detail.is_show_qr === '1',
          checkboxSettlement: detail.is_pay_send === '1',
        });
      });
    }
  }

  render() {
    const { radioValue, checkboxScan, checkboxSettlement } = this.state;
    const { activityId } = this.props;

    return (
      <div className="select-type">
        <div className="select-type-left">
          <p>活动示例</p>
          <img src={String(radioValue) === '1' ? createSample2 : createSample1} alt="" />
        </div>
        <div className="select-type-right">
          <Alert message="活动类型选择后不可更改" type="success" />
          <div className="top">
            <label className="label ant-form-item-required">活动规则</label>
            <RadioGroup value={radioValue} onChange={this.handleRadioChange}>
              <Radio value="0">直接领券</Radio>
              <p>传统优惠券的电子版，可在微信中传播或通过短信投放使用，客户可以在活动页自己领取</p>
              <Radio value="1">分享领券</Radio>
              <p>用户需要通过先分享的方式获得优惠券，这将为您的优惠券带来更多的曝光和使用</p>
            </RadioGroup>
          </div>

          <div className="bottom">
            <label className="label ant-form-item-required">使用场景</label>
            <Checkbox
              disabled={String(radioValue) === '0'}
              onChange={e => this.handleCheckChange(e, 'scan')}
              checked={checkboxScan}
            >
              扫二维码或点击链接领取
            </Checkbox>
            <Popover
              placement="bottom"
              title={null}
              content={<img src={createSample3} alt="" />}
              trigger="hover"
              overlayClassName="white"
              overlayStyle={{ width: '470px' }}
            >
              <a href="#">查看详情</a>
            </Popover>
            <br />
            <span className="inline-block" style={{ margin: '10px 0 0 80px' }}>
              <Checkbox
                disabled={String(radioValue) === '0'}
                onChange={e => this.handleCheckChange(e, 'settlement')}
                checked={checkboxSettlement}
              >
                结算成功后领取
                </Checkbox>
              <Popover
                placement="bottom"
                title={null}
                content={<img src={createSample4} alt="" />}
                trigger="hover"
                overlayClassName="white"
                overlayStyle={{ width: '470px' }}
              >
              <a href="#">查看详情</a>
            </Popover>
            </span>
          </div>

          {
            !!activityId
              ? ''
              : !!checkboxSettlement
              ? <Popconfirm
                title="当前活动生效后，其余结算活动自动失效，以当前活动为准，确认继续创建活动吗？"
                onConfirm={this.handleSubmit}
                okText="确认"
                cancelText="取消"
                overlayClassName="white"
                overlayStyle={{ width: '250px' }}
                trigger="click"
              >
                <Button type="primary" className="next">
                  下一步
                </Button>
              </Popconfirm>
              : <Button
                type="primary"
                className="next"
                onClick={this.handleSubmit}
              >
                下一步
              </Button>
          }
        </div>
      </div>
    );
  }
}
