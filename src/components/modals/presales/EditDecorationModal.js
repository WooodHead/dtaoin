import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../base/BaseModal';
import EditDecorationForm from '../../forms/presales/EditDecorationForm';

export default class EditDecorationModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    return (
      <span>
        <Button type="primary"
                onClick={this.showModal}>
          编辑
        </Button>
        <Modal
          title={<span><Icon type="edit"/> 编辑装潢信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}>
          <EditDecorationForm
            cancelModal={this.updateState}
            cancelModal={this.hideModal}
            customer_id={this.props.customer_id}
            auto_id={this.props.auto_id}
          />
        </Modal>
      </span>
    );
  }
}
