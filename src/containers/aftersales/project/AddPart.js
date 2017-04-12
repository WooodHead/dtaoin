import React from 'react';
import {Modal, Button, Icon} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import PartForm from './FormPart';

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.handleSuccess = this.handleSuccess.bind(this);
  }

  handleSuccess(data, cancelModal = true) {
    this.props.onSuccess(data);
    if (cancelModal) {
      this.hideModal();
    }
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          size={this.props.size || 'small'}
          icon="plus"
        >
          添加配件
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 添加配件</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <PartForm
            cancelModal={this.hideModal}
            onSuccess={this.handleSuccess}
            maintain_parts={this.props.maintain_parts}
          />
        </Modal>
      </span>
    );
  }
}
