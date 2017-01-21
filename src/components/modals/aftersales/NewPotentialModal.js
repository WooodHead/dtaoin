import React from 'react';
import {Modal, Steps, Icon, Button} from 'antd';
import BaseModal from '../../base/BaseModal';
import NewCustomerForm from '../../forms/aftersales/NewCustomerForm';
import NewAutoForm from '../../forms/aftersales/NewAutoForm';
import NewProjectForm from '../../forms/aftersales/NewProjectForm';
import ConfirmProjectForm from '../../forms/aftersales/ConfirmProjectForm';

class NewMaintainPotentialModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reload: false,
      width: '680px',
      currentStep: 0,
      customerForm: '',
      autoForm: 'hide',
      projectForm: 'hide',
      confirmProject: 'hide',
      customer_id: '',
      project_id: '',
      project: {},
      items: [],
      parts: [],
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  hideModal() {
    this.setState({visible: false});
  }

  showModal() {
    this.state = {
      visible: true,
      reload: false,
      width: '680px',
      currentStep: 0,
      customerForm: '',
      autoForm: 'hide',
      projectForm: 'hide',
      confirmProject: 'hide',
      customer_id: '',
      project_id: '',
      project: {},
      items: [],
      parts: [],
    };
    this.updateState = this.updateState.bind(this);
    this.setState({visible: true});
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      isNew: true,
      customer_id: this.state.customer_id,
      auto_id: this.state.auto_id,
      project_id: this.state.project_id,
      project: this.state.project,
      items: this.state.items,
      parts: this.state.parts,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
      reload: this.state.reload,
      visible: this.state.visible,
    };

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          className="pull-right">
          新增工单
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 新增工单</span>}
          visible={this.state.visible}
          width={this.state.width}
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}>
          <Steps current={this.state.currentStep}>
            <Step key="0" title="客户信息"/>
            <Step key="1" title="车辆信息"/>
            <Step key="2" title="工单信息"/>
            <Step key="3" title="工单预览"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.customerForm}>
              <NewCustomerForm nextStep={1} {...formProps} />
            </div>

            <div className={this.state.autoForm}>
              <NewAutoForm prevStep={0} nextStep={2} {...formProps} />
            </div>

            <div className={this.state.projectForm}>
              <NewProjectForm prevStep={1} nextStep={3} {...formProps} />
            </div>

            <div className={this.state.confirmProject}>
              <ConfirmProjectForm prevStep={2} {...formProps} />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default NewMaintainPotentialModal;
