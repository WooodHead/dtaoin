import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../components/base/BaseModal';

import EditForm from './EditForm';

export default class EditCustomerModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button type="primary" onClick={this.showModal}>编辑</Button>

        <Modal
          title={<span><Icon type="edit"/> 编辑客户信息</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditForm
            onSuccess={this.hideModal}
            customer_id={this.props.customer_id}
          />
        </Modal>
      </span>
    );
  }
}
