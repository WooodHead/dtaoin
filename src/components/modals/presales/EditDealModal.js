import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import EditPurchaseForm from '../../forms/presales/EditPurchaseForm'

export default class EditPurchaseModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}>
          编辑
        </Button>
        <Modal
          title={<span><Icon type="edit"/> 编辑交易信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}>
          <EditPurchaseForm
            cancelModal={this.hideModal}
            customer_id={this.props.customer_id}
            user_auto_id={this.props.user_auto_id}
          />
        </Modal>
      </span>
    );
  }
}
