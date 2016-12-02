import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import NewDecorationForm from '../../forms/presales/NewDecorationForm'

export default class NewDecorationModal extends BaseModal {
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
          添加
        </Button>
        <Modal title={<span><Icon type="plus"/> 添加装潢信息</span>}
               visible={this.state.visible}
               width="680px"
               onCancel={this.hideModal}
               footer={null}>
          <NewDecorationForm
            onSuccess={this.updateState}
            cancelModal={this.hideModal}
            isSingle={this.props.isSingle}
            customer_id={this.props.customer_id}
            user_auto_id={this.props.user_auto_id}
          />
        </Modal>
      </span>
    );
  }
}
