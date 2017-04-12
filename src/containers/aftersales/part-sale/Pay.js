import React from 'react';
import {Modal, Button} from 'antd';

import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';

import FormPay from './FormPay';
import FormBill from './FormBill';
import FormRepayment from './FormRepayment';

export default class Pay extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      payVisible: '',
      billVisible: 'hide',
      payBillVisible: false,
      repaymentVisible: false,
      customerInfo: {},
      partsDetail: [],
      btnText: Number(props.status) === 1 ? '还款' : '结算',
    };

    [
      'payVisible',
      'getPartSellDetail',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({btnText: Number(nextProps.status) === 1 ? '还款' : '结算'});
  }

  payVisible() {
    this.setState({
      payVisible: 'hide',
      billVisible: '',
    });
  }

  showModal() {
    this.getPartSellDetail(this.props.orderId);
    this.getPartSellPartList(this.props.orderId);

    if (this.state.btnText === '结算') {
      this.setState({
        payBillVisible: true,
        repaymentVisible: false,
      });
    } else {
      this.setState({
        payBillVisible: false,
        repaymentVisible: true,
      });
    }
  }

  hideModal() {
    window.clearInterval(window.time);
    this.setState({
      payBillVisible: false,
      repaymentVisible: false,
    });
  }

  getPartSellDetail(id) {
    api.ajax({url: api.aftersales.getPartSellDetail(id)}, data => {
      let detail = data.res.detail;
      this.setState({customerInfo: detail});
    });
  }

  getPartSellPartList(id) {
    api.ajax({url: api.aftersales.getPartSellPartList(id)}, data => {
      let list = data.res.list;
      this.setState({partsDetail: list});
    });
  }

  render() {
    let {
      payVisible,
      billVisible,
      payBillVisible,
      repaymentVisible,
      customerInfo,
      partsDetail,
      btnText,
    } = this.state;

    let {status, size} = this.props;

    return (
      <span>
        {
          size === 'small'
            ?
            <a href="javascript:;" onClick={this.showModal} disabled={!status || Number(status) === 2}>{btnText}</a>
            :
            <Button
              type="primary" onClick={this.showModal}
              disabled={!status || Number(status) === 2}
            >
              {btnText}
            </Button>
        }

        <Modal
          visible={payBillVisible}
          width={700}
          onCancel={this.hideModal}
          footer={null}
        >
          <div className={payVisible}>
            <p className="font-size-24 mb20">结算</p>
            <FormPay
              payVisible={this.payVisible}
              customerInfo={customerInfo}
              payBillVisible={payBillVisible}
              cancelModal={this.hideModal}
            />
          </div>

          <div className={billVisible}>
            <p className="font-size-24 mb20">挂账</p>
            <FormBill
              payVisible={this.payVisible}
              customerInfo={customerInfo}
              partsDetail={partsDetail}
              cancelModal={this.hideModal}
              payBillVisible={payBillVisible}
              getPartSellDetail={this.getPartSellDetail}
            />
          </div>
        </Modal>

        <Modal
          visible={repaymentVisible}
          width={700}
          onCancel={this.hideModal}
          footer={null}
        >
          <p className="font-size-24 mb20">还款</p>
          <FormRepayment
            customerInfo={customerInfo}
            partsDetail={partsDetail}
            repaymentVisible={repaymentVisible}
            cancelModal={this.hideModal}
            getPartSellDetail={this.getPartSellDetail}
          />
        </Modal>
      </span>
    );
  }
}
