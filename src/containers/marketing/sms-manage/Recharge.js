import React from 'react';
import { Link } from 'react-router-dom';

import { Modal, Row, message, Button, Icon } from 'antd';
import QRCode from 'qrcode.react';
import className from 'classnames';

import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';

require('../sms-manage.less');

export default class Recharge extends BaseModal {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      visible: false,
      choose: '',
      company: {},
      rechargeRecordTotal: 10000, // 为了判断是否支付成功，通过支付记录判断
    };
    [
      'handleChoose',
      'handleViewProblem',
      'handlePayFailure',
      'getRechargeRecordTotal',
      'handleIsRecharge',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getRechargeRecordTotal();
  }

  handleChoose(choose) {
    this.setState({ choose });
  }

  showModal() {
    this.setState({ visible: true });
    this.getCompanyDetail();
    this.handleIsRecharge();
  }

  hideModal() {
    this.setState({ visible: false });
    clearInterval(this.timer);
  }

  handleViewProblem() {
    this.setState({ visible: false });
    history.replaceState({}, '水稻汽车', '/marketing/sms-manage/3/');
  }

  handlePayFailure() {
    message.error(
      <span>
        支付失败 <a href="#" onClick={this.handleViewProblem}>查看常见问题</a>
      </span>, 5,
    );
  }

  handleIsRecharge() {
    const { rechargeRecordTotal } = this.state;
    this.timer = setInterval(() => {
      api.ajax({ url: api.coupon.smsChargeList({ page: 1 }) }, data => {
        const { total } = data.res;
        if (Number(total) > Number(rechargeRecordTotal)) {
          clearInterval(this.timer);
          message.success('支付成功');
          setTimeout(() => {
            location.href = '/marketing/sms-manage/2';
          }, 2000);
        }
      });
    }, 2000);
  }

  getCompanyDetail() {
    api.ajax({
      url: api.company.detail(),
    }, data => {
      const { company } = data.res;
      this.setState({ company });
    });
  }

  getRechargeRecordTotal() {
    api.ajax({ url: api.coupon.smsChargeList({ page: 1 }) }, data => {
      const { total } = data.res;
      this.setState({ rechargeRecordTotal: total });
    });
  }

  render() {
    const { visible, choose, company } = this.state;
    const { type } = this.props;

    const loginUserInfo = api.getLoginUser();
    const companyId = loginUserInfo.companyId;
    const userId = loginUserInfo.uid;

    const infoOneShow = className({
      'info info-one info-chose': choose === '1',
      'info info-one': choose !== '1',
    });

    const infoTwoShow = className({
      'info info-one info-chose ml15': choose === '2',
      'info info-one ml15': choose !== '2',
    });

    return (
      <span>
        {
          type === '1'
            ? <a href="javascript:;" onClick={this.showModal}>短信充值</a>
            : type === '2'
            ? <a href="javascript:;" onClick={this.showModal}>立即充值</a>
            : (
              <Row className="sms-manage head-action-bar-line">
                <span className="inline-block" onClick={this.showModal}>
                  <div className={infoOneShow} onClick={() => this.handleChoose('1')}>
                    <p className="number">5000条</p>
                    <p className="money">￥ 500.00</p>
                    <p className="single">单价 ￥0.1/条，有效期1年</p>
                  </div>

                  <div className={infoTwoShow} onClick={() => this.handleChoose('2')}>
                    <p className="number">10000条</p>
                    <p className="money">￥ 800.00</p>
                    <p className="single">单价 ￥0.08/条，有效期1年</p>
                  </div>
                </span>
              </Row>
            )
        }

        <Modal
          title="短信充值"
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width={720}
          className="sms-manage"
          footer={null}
        >
          <h3>充值信息</h3>
          <div className="ml40 mt20">
            <label className="label grey-9c9c9c">门店名称</label>
            <span className="company font-size-14">{company.name}</span>

            <label className="label grey-9c9c9c">当前短信余额</label>
            <span className="font-size-14">{`${company.sms_remain}条`}</span>
          </div>

          <div className="ml40 mt20">
            <label className="label grey-9c9c9c">购买信息</label>
            <div className={infoOneShow} onClick={() => this.handleChoose('1')}>
              <p className="number">5000条</p>
              <p className="money">￥500.00</p>
              <p className="single">单价 ￥0.1/条，有效期1年</p>
            </div>

            <div className={infoTwoShow} onClick={() => this.handleChoose('2')}>
              <p className="number">10000条</p>
              <p className="money">￥800.00</p>
              <p className="single">单价 ￥0.08/条，有效期1年</p>
            </div>
          </div>

          <div className="line" />

          <h3>订单支付</h3>
          <div className="qr-code">
            {
              !!choose ? (
                <QRCode
                  value={`${location.origin
                  }/h5/charge/index.html?chargeLevel=${choose}&companyId=${companyId}&userId=${userId}`}
                  size={100} ref="qrCode"
                />
              ) : (
                <p className="mt-10">请选择购买信息</p>
              )
            }
          </div>

          <div className="introduce">
            <p className="mb15">微信或支付宝扫码支付成功后立即充值到账</p>
            <Button type="ghost" size="large" onClick={this.handlePayFailure}>支付遇到问题</Button>

            <Button className="ml10" type="primary" size="large"
                    onClick={this.hideModal}>我已成功支付</Button>
          </div>
        </Modal>
      </span>
    );
  }
}
