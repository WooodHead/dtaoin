import React from 'react'
import {Modal, Steps, Icon, Button} from 'antd'
import BaseModal from '../../base/BaseModal'
import NewCustomerForm from '../../forms/presales/NewCustomerForm'
import NewIntentionForm from '../../forms/presales/NewIntentionForm'

export default class NewPotentialCustomerModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      customerForm: '',
      intentionForm: 'hide',
      customer_id: ''
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      customer_id: this.state.customer_id,
      onSuccess: this.updateState,
      cancelModal: this.hideModal
    };
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          className="pull-right">
          新增意向
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 新增意向</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}>
          <Steps current={this.state.currentStep}>
            <Step key="0" title="客户信息"/>
            <Step key="1" title="意向信息"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.customerForm}>
              <NewCustomerForm nextStep={1} {...formProps} />
            </div>
            <div className={this.state.intentionForm}>
              <NewIntentionForm prevStep={0} {...formProps} />
            </div>
          </div>
        </Modal>
      </span>
    )
  }
}
