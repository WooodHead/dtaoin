import React from 'react';
import {Modal, Icon} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import PrintPayment from './PrintPayment';

export default class PrintPaymentModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <p onClick={this.showModal}>打印销售单</p>

        <Modal
          title={<span><Icon type="file"/>销售单预览</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <PrintPayment
            customerInfo={this.props.customerInfo}
            partsDetail={this.props.partsDetail}
          />
        </Modal>
      </span>
    );
  }
}
