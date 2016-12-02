import React from 'react'
import {Modal, Button} from 'antd'
import BaseModal from '../../base/BaseModal'
import NewPurchaseForm from '../../forms/presales/NewPurchaseForm'

export default class NewPurchaseModal extends BaseModal {
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
          添加
        </Button>
        <Modal
          title="添加成交信息"
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}>
          <NewPurchaseForm
            cancelModal={this.hideModal}
            isSingle={this.props.isSingle}
            customer_id={this.props.customer_id}
            user_auto_id={this.props.user_auto_id}/>
        </Modal>
      </span>
    );
  }
}
