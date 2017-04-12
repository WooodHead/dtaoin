import React from 'react';
import {Modal, Icon} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import PrintArrears from './PrintArrears';


export default class PrintArrearsModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <p onClick={this.showModal}>打印挂账单</p>

        <Modal
          title={<span><Icon type="plus"/>挂账单预览</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}
        >
          <PrintArrears
            customerInfo={this.props.customerInfo}
            partsDetail={this.props.partsDetail}
          />
        </Modal>
      </span>
    );
  }
}
