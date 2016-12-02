import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import AddEditMaintainPartForm from '../../forms/aftersales/AddEditMaintainPartForm'

export default class AddMaintainPartModal extends BaseModal {
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
          size={this.props.size || "small"}>
          添加配件
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 添加配件</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <AddEditMaintainPartForm
            cancelModal={this.hideModal}
            onSuccess={this.onSuccess.bind(this)}
          />
        </Modal>
      </span>
    );
  }
}
