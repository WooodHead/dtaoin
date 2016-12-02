import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import EditCustomerForm from '../../forms/presales/EditCustomerForm'

export default class EditCustomerModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button type="primary"
                onClick={this.showModal}>
          编辑
        </Button>
        <Modal title={<span><Icon type="edit"/> 编辑客户信息</span>}
               visible={this.state.visible}
               width="680px"
               onCancel={this.hideModal}
               footer={null}>
          <EditCustomerForm
            cancelModal={this.hideModal}
            customer_id={this.props.customer_id}
          />
        </Modal>
      </span>
    );
  }
}
