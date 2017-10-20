import React from 'react';
import { Modal, Icon, Button, Tabs } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import EditUserForm from './EditUserForm';
import EditPositionAndSalaryForm from './EditPositionAndSalaryForm';
import Permission from './Permission';

const TabPane = Tabs.TabPane;

export default class EditUserModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roleId: '',
    };

    [
      'updateState',
    ].map(method => this[method] = this[method].bind(this));
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const { size, user = {} } = this.props;
    const { visible } = this.state;

    const formProps = {
      roleId: this.state.roleId,
      userId: user._id,
      user,
      onSuccess: this.props.onSuccess,
      cancelModal: this.hideModal,
      updateState: this.updateState,
    };

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.showModal}>编辑</a> :
          <Button onClick={this.showModal}>编辑</Button>
        }

        <Modal
          title={<span><Icon type="edit"/> 编辑员工</span>}
          visible={visible}
          width="960px"
          className="ant-modal-full"
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <EditUserForm {...formProps}/>
            </TabPane>
            <TabPane tab="职位及薪资信息" key="2">
              <EditPositionAndSalaryForm {...formProps} />
            </TabPane>
            <TabPane tab="系统角色设置" key="3">
              <Permission {...formProps} />
            </TabPane>
          </Tabs>
        </Modal>
      </span>
    );
  }
}
