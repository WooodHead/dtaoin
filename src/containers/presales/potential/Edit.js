import React from 'react';
import { Modal, Button, Icon } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import EditForm from './EditForm';

export default class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const { size, disabled, customerId, intentionId, isSingle, onSuccess } = this.props;

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:" onClick={this.showModal} disabled={disabled}>编辑</a> :
          <Button type="primary" onClick={this.showModal} disabled={disabled}>编辑</Button>
        }

        <Modal
          title={<span><Icon type="edit"/> 编辑意向信息</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditForm
            cancelModal={this.hideModal}
            customerId={customerId}
            intentionId={intentionId}
            isSingle={isSingle}
            onSuccess={onSuccess}
          />
        </Modal>
      </span>
    );
  }
}
