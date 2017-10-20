import React from 'react';
import { Modal, Button, Icon } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import LostForm from './LostForm';

export default class Lost extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  render() {
    const { size, disabled } = this.props;

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:" onClick={this.showModal} disabled={disabled}>流失</a> :
          <Button type="ghost" onClick={this.showModal} disabled={disabled}>流失</Button>
        }

        <Modal
          title={<span><Icon type="info-circle-o"/> 选择意向流失原因</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <LostForm
            intentionId={this.props.intentionId}
            customerId={this.props.customerId}
            cancelModal={this.hideModal}
          />
        </Modal>
      </span>
    );
  }
}
