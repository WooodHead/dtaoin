import React from 'react';
import {Modal, Steps, Icon, Button} from 'antd';
import BaseModal from '../../base/BaseModal';
import NewAutoForm from '../../forms/aftersales/NewAutoForm';
import NewProjectForm from '../../forms/aftersales/NewProjectForm';
import ConfirmProjectForm from '../../forms/aftersales/ConfirmProjectForm';

export default class NewMaintainPotentialModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reload: false,
      currentStep: 0,
      autoForm: '',
      projectForm: 'hide',
      confirmProject: 'hide',
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

  render() {
    const Step = Steps.Step;
    const formProps = {
      visible: this.state.visible,
      reload: this.state.reload,
      customer_id: this.props.customer_id,
      auto_id: this.state.auto_id,
      project_id: this.state.project_id,
      project: this.state.project,
      items: this.state.items,
      parts: this.state.parts,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
    };
    return (
      <span>
        <Button type="primary"
                onClick={this.showModal}
                size="small">
          添加工单
        </Button>
        <Modal title={<span><Icon type="plus"/> 添加工单</span>}
               visible={this.state.visible}
               width="900px"
               maskClosable={false}
               onCancel={this.hideModal}
               footer={null}>
          <Steps current={this.state.currentStep}>
            <Step key="0" title="车辆信息"/>
            <Step key="1" title="工单信息"/>
            <Step key="2" title="工单预览"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.autoForm}>
              <NewAutoForm nextStep={1} newProject="true" {...formProps} />
            </div>
            <div className={this.state.projectForm}>
              <NewProjectForm prevStep={0} nextStep={2} {...formProps} />
            </div>
            <div className={this.state.confirmProject}>
              <ConfirmProjectForm prevStep={1} {...formProps} />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}
