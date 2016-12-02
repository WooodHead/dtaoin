import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import NewIntentionForm from '../../forms/presales/NewIntentionForm'

export default class NewIntentionModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          size={this.props.size || "small"}>
          添加意向
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 新增意向信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}>
          <NewIntentionForm
            cancelModal={this.hideModal}
            isSingle={this.props.isSingle}
            refresh={this.props.refresh}
            customer_id={this.props.customer_id}
          />
        </Modal>
      </span>
    );
  }
}
