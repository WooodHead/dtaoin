import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import EditAutoForm from '../../forms/presales/EditAutoForm'

export default class EditAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    console.log(this.props.customer_id, this.props.auto_id);
    
    return (
      <span>
        <Button type="primary"
                onClick={this.showModal}>
          编辑
        </Button>
        <Modal title={<span><Icon type="edit"/> 编辑车辆信息</span>}
               visible={this.state.visible}
               width="680px"
               onCancel={this.hideModal}
               footer={null}>
          <EditAutoForm
            cancelModal={this.hideModal}
            customer_id={this.props.customer_id}
            user_auto_id={this.props.auto_id}
          />
        </Modal>
      </span>
    );
  }
}
