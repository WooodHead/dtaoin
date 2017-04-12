import React from 'react';
import {Modal} from 'antd';

import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';

import Table from './SettlementHistoryTable';

export default class SettlementHistory extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.customerId,
      visible: false,
      page: 1,
    };

    [
      'updateState',
    ].map(method => this[method] = this[method].bind(this));
  }

  updateState(obj) {
    this.setState(obj);
  }


  render() {
    let {visible, page, customerId} = this.state;

    return (
      <span>
        <a href="javascript:" onClick={this.showModal}>结算历史</a>

        <Modal
          visible={visible}
          title="结算历史"
          onCancel={this.hideModal}
          footer={null}
          width="720px"
        >
        <Table
          page={page}
          source={api.technician.withDrawList(customerId, page)}
          updateState={this.updateState}
        />
        </Modal>
      </span>
    );
  }
}
