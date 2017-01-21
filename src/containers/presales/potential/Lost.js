import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import LostForm from './LostForm';

export default class Lost extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type="ghost"
          onClick={this.showModal}
          disabled={this.props.disabled}
          size={this.props.size || 'small'}
        >
          流失
        </Button>

        <Modal
          title={<span><Icon type="info-circle-o"/> 选择意向流失原因</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}
        >
          <LostForm
            cancelModal={this.hideModal}
            intention_id={this.props.intention_id}
            customer_id={this.props.customer_id}
          />
        </Modal>
      </span>
    );
  }
}
