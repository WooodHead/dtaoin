import React from 'react';
import {Modal, Steps, Icon, Button} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import StockPartForm from '../../../components/forms/aftersales/StockPartForm';
import StockPartConfirm from '../../../components/forms/aftersales/StockPartConfirm';

const Step = Steps.Step;

export default class StockPartModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibility_form_part: '',
      visibility_form_preview: 'hide',
      currentStep: 0,
      formData: {},
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    let {
      size,
      part,
    } =this.props;

    let {
      visible,
      currentStep,
      formData,
    } =this.state;

    let formProps = {
      part,
      visible,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
    };

    return (
      <span>
        <Button
          onClick={this.showModal}
          size={size || 'default'}
          className="btn-action-small"
        >
          进货
        </Button>

        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>进货</span>}
          visible={visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Steps current={currentStep}>
            <Step key="0" title="进货"/>
            <Step key="1" title="预览确认"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.visibility_form_part}>
              <StockPartForm {...formProps} />
            </div>
            <div className={this.state.visibility_form_preview}>
              <StockPartConfirm
                {...formProps}
                formData={formData}
                submit={this.submit}
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}
