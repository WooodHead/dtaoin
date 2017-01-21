import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../base/BaseModal';
import NewCustomerAutoForm from '../../forms/aftersales/NewCustomerAutoForm';

export default class NewCustomerAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data) {
    // console.log('onSuccess');
    // console.log(data);
    this.hideModal();
    this.props.onSuccess(data);
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          size={this.props.size || 'small'}>
          创建客户
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 创建客户</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <NewCustomerAutoForm
            inputValue={this.props.inputValue}
            onSuccess={this.onSuccess.bind(this)}
            cancelModal={this.hideModal}
          />
        </Modal>
      </span>
    );
  }
}
