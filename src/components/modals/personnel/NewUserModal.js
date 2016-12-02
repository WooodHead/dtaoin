import React from 'react'
import {Modal, Steps, Icon, Button} from 'antd'
import BaseModal from '../../base/BaseModal'
import NewUserForm from '../../forms/personnel/NewUserForm'
import NewPositionAndSalaryForm from '../../forms/personnel/NewPositionAndSalaryForm'

export default class NewUserModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      basicInfoForm: '',
      positionAndSalaryForm: 'hide',
      userId: ''
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      userId: this.state.userId,
      onSuccess: this.updateState,
      cancelModal: this.hideModal
    };

    return (
      <span>
        <Button type="primary"
                onClick={this.showModal}
                className="pull-right">
          创建员工
        </Button>
        <Modal title={<span><Icon type="plus"/> 创建员工</span>}
               visible={this.state.visible}
               width="960px"
               onCancel={this.hideModal}
               maskClosable={false}
               footer={null}>
          <Steps current={this.state.currentStep}>
            <Step key="0" title="基本信息"/>
            <Step key="1" title="职位及薪资信息"/>
          </Steps>

          <div className="mt15">
            <div className={this.state.basicInfoForm}>
              <NewUserForm nextStep={1} {...formProps} />
            </div>
            <div className={this.state.positionAndSalaryForm}>
              <NewPositionAndSalaryForm prevStep={0} {...formProps} />
            </div>
          </div>
        </Modal>
      </span>
    )
  }
}
