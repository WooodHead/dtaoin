import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../base/BaseModal';
import AddEditMaintainItemForm from '../../forms/aftersales/AddEditMaintainItemForm';

export default class EditMaintainItemModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data) {
      this.props.onSuccess(data);
      this.hideModal();
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          size={this.props.size || 'small'}>
          编辑项目
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 编辑项目</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <AddEditMaintainItemForm
            cancelModal={this.hideModal}
            onSuccess={this.onSuccess.bind(this)}
            maintain_item={this.props.maintain_item}
            customer_id={this.props.customer_id}
            memberDetailList={this.props.memberDetailList}
            projectDisabled={true}
          />
        </Modal>
      </span>
    );
  }
}
