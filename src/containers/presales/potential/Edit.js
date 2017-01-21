import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import EditForm from './EditForm';

export default class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type={this.props.type || 'primary'}
          onClick={this.showModal}
          disabled={this.props.disabled}
          size={this.props.size || 'small'}
        >
          编辑
        </Button>

        <Modal
          title={<span><Icon type="edit"/> 编辑意向信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditForm
            cancelModal={this.hideModal}
            customer_id={this.props.customer_id}
            intention_id={this.props.intention_id}
            isSingle={this.props.isSingle}
          />
        </Modal>
      </span>
    );
  }
}