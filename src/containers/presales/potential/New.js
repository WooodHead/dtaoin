import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import NewForm from './NewForm';

export default class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          size={this.props.size || 'default'}
          className="btn-action-small"
          onClick={this.showModal}
        >
          添加意向
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 新增意向信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}>
          <NewForm
            cancelModal={this.hideModal}
            isSingle={this.props.isSingle}
            refresh={this.props.refresh}
            customer_id={this.props.customer_id}
          />
        </Modal>
      </span>
    );
  }
}
