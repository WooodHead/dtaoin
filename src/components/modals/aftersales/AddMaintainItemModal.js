import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../base/BaseModal';
import AddEditMaintainItemForm from '../../forms/aftersales/AddEditMaintainItemForm';

export default class AddMaintainItemModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data, is_hide = true) {
      this.props.onSuccess(data);
      if(is_hide) this.hideModal();
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          size={this.props.size || 'small'}>
          添加项目
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 添加项目</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <AddEditMaintainItemForm
            cancelModal={this.hideModal}
            onSuccess={this.onSuccess.bind(this)}
            maintain_items={this.props.maintain_items}
          />
        </Modal>
      </span>
    );
  }
}
