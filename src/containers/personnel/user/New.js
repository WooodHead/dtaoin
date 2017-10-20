import React from 'react';
import { Modal, Icon, Button, Tabs } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import NewUserForm from './NewUserForm';
import NewPositionAndSalaryForm from './NewPositionAndSalaryForm';
import Permission from './Permission';

const TabPane = Tabs.TabPane;

export default class NewUserModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentStep: 0,
      basicInfoForm: '',
      positionAndSalaryForm: 'hide',
      userId: '',
      roleId: '',
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const { userId } = this.state;
    const formProps = {
      userId: this.state.userId,
      roleId: this.state.roleId,
      onSuccess: this.props.onSuccess,
      cancelModal: this.hideModal,
      updateState: this.updateState,
      visible: this.state.visible,
    };

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          className="pull-right"
        >
          创建员工
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 创建员工</span>}
          visible={this.state.visible}
          width="960px"
          className="ant-modal-full"
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <NewUserForm nextStep={1} {...formProps} />
            </TabPane>
            <TabPane tab="职位及薪资信息" key="2" disabled={!userId}>
              <NewPositionAndSalaryForm prevStep={0} {...formProps} />
            </TabPane>
            <TabPane tab="系统角色设置" key="3" disabled={!userId}>
              <Permission {...formProps} />
            </TabPane>
          </Tabs>
        </Modal>
      </span>
    );
  }
}
