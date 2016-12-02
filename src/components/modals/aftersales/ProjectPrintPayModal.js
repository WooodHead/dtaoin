import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import ProjectPrintPay from '../../tables/aftersales/ProjectPrintPay'

export default class ProjectPrintPayModal extends BaseModal {
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
        <Button
          type="primary"
          onClick={this.showModal}
          disabled={this.props.isDisabled}
          size="default">
          打印结算单
        </Button>
        <Modal
          title={<span><Icon type="plus"/>结算单预览</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <ProjectPrintPay
            project={this.props.project}
            customer={this.props.customer}
            materialFee={this.props.materialFee} 
            timeFee={this.props.timeFee}
            auto={this.props.auto}
            items={this.props.items}
            parts={this.props.parts}
          />
        </Modal>
      </span>
    );
  }
}
