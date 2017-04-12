import React from 'react';
import {Modal, Icon} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import PrintPayment from './PrintPayment';

export default class PrintPaymentModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data) {
    this.props.onSuccess(data);
    this.hideModal();
  }

  render() {
    let {
      project,
      customer,
      materialFee,
      timeFee,
      auto,
      items,
      parts,
      realTotalFee,
    } = this.props;

    return (
      <span>
        <p onClick={this.showModal}>打印结算单</p>

        <Modal
          title={<span><Icon type="file"/> 结算单预览</span>}
          visible={this.state.visible}
          width="980px"
          onCancel={this.hideModal}
          footer={null}
        >
          <PrintPayment
            project={project}
            customer={customer}
            auto={auto}
            itemMap={items}
            partMap={parts}
            timeFee={timeFee}
            materialFee={materialFee}
            realTotalFee={realTotalFee}
          />
        </Modal>
      </span>
    );
  }
}
