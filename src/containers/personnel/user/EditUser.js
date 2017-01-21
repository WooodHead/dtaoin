import React from 'react';
import {Modal, Steps, Icon, Button} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import NewUserForm from './EditUserForm';
import EditPositionAndSalaryForm from './EditPositionAndSalaryForm';

export default class EditUserModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      basicInfoForm: '',
      positionAndSalaryForm: 'hide',
    };

    [
      'updateState',
      'nextStep',
      'prevStep',
      'cancel',
    ].map(method => this[method] = this[method].bind(this));
  }

  updateState(obj) {
    this.setState(obj);
  }

  nextStep(obj = null) {
    obj || (obj = {});
    obj['currentStep'] = 1;
    this.setState(obj);
  }

  prevStep(obj = null) {
    obj || (obj = {});
    obj['currentStep'] = 0;
    this.setState(obj);
  }

  cancel(obj = null) {
    obj || (obj = {});
    obj['visible'] = false;
    obj['currentStep'] = 0;
    this.setState(obj);
  }

  render() {
    const Step = Steps.Step;
    const formProps = {
      user: this.state.user || this.props.user,
      // onSuccess: this.updateState,
      nextStep: this.nextStep,
      prevStep: this.prevStep,
      cancel: this.cancel,
    };

    const steps = [{
      title: '基本信息',
      content: <NewUserForm {...formProps}/>,
    }, {
      title: '职位及薪资信息',
      content: <EditPositionAndSalaryForm {...formProps} />,
    }];

    return (
      <span>
        <Button
          onClick={this.showModal}
          size="small"
          className="mr15"
        >
          编辑
        </Button>

        <Modal
          title={<span><Icon type="edit"/> 编辑员工</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={() => this.cancel()}
          maskClosable={false}
          footer={null}
        >
          <Steps current={this.state.currentStep}>
            {steps.map(item => <Step key={item.title} title={item.title}/>)}
          </Steps>
          <div className="steps-content mt30">{steps[this.state.currentStep].content}</div>
        </Modal>
      </span>
    );
  }
}
