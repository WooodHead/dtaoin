import React from 'react';
import {Modal, Steps, Icon, Button} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import NewCustomerForm from './NewCustomerForm';
import NewIntentionForm from './NewForm';

export default class NewCustomerAndIntention extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      customerForm: '',
      intentionForm: 'hide',
      customerId: '',
    };

    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      customerId: this.state.customerId,
      cancelModal: this.hideModal,
      updateState: this.updateState,
      onSuccess: this.props.onSuccess,
    };

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>创建意向</Button>

        <Modal
          title={<span><Icon type="plus"/> 创建意向</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}
        >
          <div className="ml20 mr20 mt20">
            <Steps current={this.state.currentStep}>
              <Step key="0" title="客户信息"/>
              <Step key="1" title="意向信息"/>
            </Steps>
          </div>

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
    );
  }
}
