import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import AddEditMaintainPartForm from '../../forms/aftersales/AddEditMaintainPartForm'

export default class EditMaintainPartModal extends BaseModal {
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
          size={this.props.size || "small"}>
          编辑配件
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 编辑配件</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <AddEditMaintainPartForm
            cancelModal={this.hideModal}
            onSuccess={this.onSuccess.bind(this)}
            maintain_part={this.props.maintain_part}
            customer_id={this.props.customer_id}
          />
        </Modal>
      </span>
    );
  }
}
