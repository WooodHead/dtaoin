import React from 'react';
import { Modal } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import FormPay from './FormPay';
import FormBill from './FormBill';
import FormRepayment from './FormRepayment';

export default class Pay extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: '',
      repaymentForm: 'hide',
      settlementLossesVisible: false,
      repaymentVisible: false,
    };

    this.payVisible = this.payVisible.bind(this);
  }

  payVisible() {
    this.setState({
      paymentForm: 'hide',
      repaymentForm: '',
    });
  }

  showModal() {
    const { project } = this.props;
    const payStatus = String(project.pay_status);
    if (payStatus === '0') {
      this.setState({
        settlementLossesVisible: true,
        repaymentVisible: false,
      });
    } else if (payStatus === '1') {
      this.setState({
        settlementLossesVisible: false,
        repaymentVisible: true,
      });
    }
  }

  hideModal() {
    clearInterval(window.time);
    this.setState({
      settlementLossesVisible: false,
      repaymentVisible: false,
    });
  }

  render() {
    const {
      paymentForm,
      repaymentForm,
      settlementLossesVisible,
      repaymentVisible,
    } = this.state;

    const {
      project_id,
      customer_id,
      project,
      customer,
      materialFee,
      timeFee,
      realTotalFee,
      size,
      disabled,
    } = this.props;

    const formProps = {
      customerId: customer_id,
      projectId: project_id,
      project,
      customer,
      materialFee,
      timeFee,
      realTotalFee,
      repaymentVisible,
      settlementLossesVisible,
      cancelModal: this.hideModal,
      payVisible: this.payVisible,
    };

    const status = String(project.status);
    const payStatus = String(project.pay_status);

    let btnText = '结算';
    if (payStatus === '1') {
      btnText = '还款';
    }

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:" onClick={this.showModal}>{btnText}</a> :
          <p
            onClick={this.showModal}
            disabled={status === '-1' || status == 0 || payStatus === '2' || disabled}
          >
            {btnText}
          </p>
        }

        <Modal
          title={paymentForm === '' ? '结算' : '挂账'}
          visible={settlementLossesVisible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <div className={paymentForm}>
            <FormPay {...formProps} />
          </div>

          <div className={repaymentForm}>
            <FormBill {...formProps} />
          </div>
        </Modal>

        <Modal
          title="还款"
          visible={repaymentVisible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <FormRepayment{...formProps}/>
        </Modal>
      </span>
    );
  }
}
