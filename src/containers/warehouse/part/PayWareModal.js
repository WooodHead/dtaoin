import React from 'react';
import {Modal, Steps, Icon, Button} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import PayWareForm from '../../../components/forms/aftersales/PayWareForm';
import PayWareConfirmForm from '../../../components/forms/aftersales/PayWareConfirmForm';

export default class NewDealModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      payWareForm: '',
      supplierId: this.props.supplierId,
      payWareConfirmForm: 'hide',
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      data: this.state.data,
      payObj: this.state.payObj,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
      supplierId: this.state.supplierId,
    };

    return (
      <span>
        <Button
          type="primary"
          className="btn-action-small"
          size={this.props.size}
          onClick={this.showModal}
          disabled={this.props.disabled}
        >
          结算
        </Button>
        <Modal
          title={<span><Icon type="pay-circle-o"/> 仓库结算</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          maskClosable={true}
          footer={null}
        >
          <Steps current={this.state.currentStep}>
            <Step key="0" title="结算"/>
            <Step key="1" title="结算单"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.payWareForm}>
              <PayWareForm nextStep={1} {...formProps} />
            </div>

            <div className={this.state.payWareConfirmForm}>
              <PayWareConfirmForm prevStep={0} {...formProps} />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}
