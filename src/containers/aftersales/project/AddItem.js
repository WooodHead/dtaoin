import React from 'react';
import {Modal, Button, Icon} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import ItemForm from './FormItem';

export default class AddItem extends BaseModal {
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
          icon="plus"
        >
          添加项目
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 添加项目</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <ItemForm
            cancelModal={this.hideModal}
            onSuccess={this.handleSuccess}
            maintain_items={this.props.itemMap}
          />
        </Modal>
      </span>
    );
  }
}
