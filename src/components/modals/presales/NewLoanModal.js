import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../base/BaseModal';
import NewLoanForm from '../../forms/presales/NewLoanForm';

export default class NewLoanModal extends BaseModal {
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
          title={<span><Icon type="plus"/> 添加按揭信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}>
          <NewLoanForm
            cancelModal={this.hideModal}
            isSingle={this.props.isSingle}
            customer_id={this.props.customer_id}
            seller_user_id={this.props.seller_user_id}
            auto_id={this.props.auto_id}
          />
        </Modal>
      </span>
    );
  }
}
