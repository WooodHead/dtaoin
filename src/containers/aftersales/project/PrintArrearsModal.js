import React from 'react';
import {Modal, Icon} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import PrintArrears from './PrintArrears';


export default class PrintArrearsModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data) {
    this.props.onSuccess(data);
    this.hideModal();
  }

  render() {
    return (
      <span>
        <p onClick={this.showModal}>打印挂账单</p>

        <Modal
          title={<span><Icon type="file"/> 挂账单预览</span>}
          visible={this.state.visible}
          width="980px"
          onCancel={this.hideModal}
          footer={null}
        >
          <PrintArrears
            project={this.props.project}
            customer={this.props.customer}
            materialFee={this.props.materialFee}
            timeFee={this.props.timeFee}
            auto={this.props.auto}
            items={this.props.items}
            parts={this.props.parts}
            realTotalFee={this.props.realTotalFee}
          />
        </Modal>
      </span>
    );
  }
}
