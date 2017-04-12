import React from 'react';
import {Modal, Button, Icon} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import NewForm from './NewForm';

export default class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const {size, customerId, isSingle, onSuccess} = this.props;
    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.showModal}>添加意向</a> :
          <Button type="primary" onClick={this.showModal}>添加意向</Button>
        }

        <Modal
          title={<span><Icon type="plus"/> 新增意向信息</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <NewForm
            cancelModal={this.hideModal}
            customerId={customerId}
            isSingle={isSingle}
            onSuccess={onSuccess}
          />
        </Modal>
      </span>
    );
  }
}
