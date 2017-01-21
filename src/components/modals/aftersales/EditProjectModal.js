import React from 'react'
import {Modal, Steps, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import EditProjectForm from '../../forms/aftersales/EditProjectForm'
import ConfirmProjectForm from '../../forms/aftersales/ConfirmProjectForm'

export default class EditProjectModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      projectForm: '',
      confirmProject: 'hide',
      auto_id: '',
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
      isNew: false,
      customer_id: this.props.customer_id,
      project_id: this.props.project_id,
      project: this.state.project,
      items: this.state.items,
      parts: this.state.parts,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
    };

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          disabled={this.props.ifDisabled}
          className="mr5"
          size={this.props.size || 'small'}>
          编辑
        </Button>

        <Modal
          title={<span><Icon type="edit"/> 编辑维保单</span>}
          visible={this.state.visible}
          width="900px"
          onCancel={this.hideModal}
          maskClosable={false}
          data-time={this.state.time}
          footer={null}>

          <Steps current={this.state.currentStep}>
            <Step key="0" title="工单编辑"/>
            <Step key="1" title="工单预览"/>
          </Steps>

          <div className={this.state.projectForm}>
              <EditProjectForm nextStep={1} {...formProps} />
          </div>

          <div className={this.state.confirmProject}>
            <ConfirmProjectForm prevStep={0} {...formProps} />
          </div>
        </Modal>
      </span>
    );
  }
}
