import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import ProjectPrintDispatch from '../../tables/aftersales/ProjectPrintDispatch'

export default class ProjectPrintDispatchModal extends BaseModal {
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
          打印派工单
        </Button>
        <Modal
          title={<span><Icon type="plus"/>派工单预览</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <ProjectPrintDispatch
            project={this.props.project}
            customer={this.props.customer}
            auto={this.props.auto}
            items={this.props.items}
            parts={this.props.parts}
          />
        </Modal>
      </span>
    );
  }
}
