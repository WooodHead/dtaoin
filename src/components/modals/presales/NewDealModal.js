import React from 'react'
import {Modal, Steps, Icon, Button} from 'antd'
import BaseModal from '../../base/BaseModal'
import NewAutoFrom from '../../forms/presales/NewAutoForm'
import NewPurchaseForm from '../../forms/presales/NewPurchaseForm'
import NewInsuranceForm from '../../forms/presales/NewInsuranceForm'
import NewLoanForm from '../../forms/presales/NewLoanForm'
import NewDecorationForm from '../../forms/presales/NewDecorationForm'

export default class NewDealModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      autoForm: '',
      purchaseForm: 'hide',
      loanForm: 'hide',
      insuranceForm: 'hide',
      decorationForm: 'hide',
      payType: '0',
      deliverDate: new Date()
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      customer_id: this.props.customer_id,
      intention_id: this.props.intention_id,
      user_auto_id: this.state.user_auto_id,
      seller_user_id: this.state.seller_user_id,
      auto_deal_id: this.state.auto_deal_id,
      deliverDate: this.state.deliverDate,
      onSuccess: this.updateState,
      cancelModal: this.hideModal
    };

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          className="mr15"
          disabled={this.props.disabled}
          size={this.props.size || 'small'}>
          成交
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 新增交易</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          maskClosable={true}
          footer={null}>

          <Steps current={this.state.currentStep}>
            <Step key="0" title="车辆信息"/>
            <Step key="1" title="新车交易"/>
            <Step key="2" title="按揭交易"/>
            <Step key="3" title="保险交易"/>
            <Step key="4" title="装潢交易"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.autoForm}>
              <NewAutoFrom nextStep={1} {...formProps} />
            </div>

            <div className={this.state.purchaseForm}>
              <NewPurchaseForm prevStep={0} nextStep={2} {...formProps} />
            </div>

            <div className={this.state.loanForm}>
              <NewLoanForm prevStep={1} nextStep={3} {...formProps} />
            </div>

            <div className={this.state.insuranceForm}>
              <NewInsuranceForm payType={this.state.payType} prevStep={2} nextStep={4} {...formProps} />
            </div>

            <div className={this.state.decorationForm}>
              <NewDecorationForm prevStep={3} {...formProps} />
            </div>
          </div>
        </Modal>
      </span>
    )
  }
}
