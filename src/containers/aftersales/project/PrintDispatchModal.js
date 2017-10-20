import React from 'react';
import { Modal, Icon } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import PrintDispatch from './PrintDispatch';

export default class PrintDispatchModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  onSuccess(data) {
    this.props.onSuccess(data);
    this.hideModal();
  }

  render() {
    const {
      project,
      customer,
      auto,
      items,
      parts,
    } = this.props;

    return (
      <span className="center">
        <p onClick={this.showModal} style={{ width: '120px' }}>打印派工单</p>

        <Modal
          title={<span><Icon type="file"/> 派工单预览</span>}
          visible={this.state.visible}
          width="980px"
          onCancel={this.hideModal}
          footer={null}
        >
          <PrintDispatch
            project={project}
            customer={customer}
            auto={auto}
            itemMap={items}
            partMap={parts}
          />
        </Modal>
      </span>
    );
  }
}
