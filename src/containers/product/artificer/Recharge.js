import React from 'react';
import { Modal } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import Table from './TableRecharge';

export default class TablePaymentHistory extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      customerId: props.customerId,
    };
    [
      'showModal',
      'hideModal',
    ].map(method => this[method] = this[method].bind(this));
  }

  showModal() {
    this.setState({ visible: true });
  }

  hideModal() {
    this.setState({ visible: false });
  }

  render() {
    const { page } = this.state;

    return (
      <span>
        <a href="javascript:" onClick={this.showModal}>充值记录</a>
        <Modal
          title={<span>充值记录</span>}
          visible={this.state.visible}
          width="720px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Table
            page={page}
            source={api.technician.getArtificerChargeList(this.state)}
            updateState={this.updateState}
          />
        </Modal>
      </span>
    );
  }
}
