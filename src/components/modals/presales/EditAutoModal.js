import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../base/BaseModal';
import EditAutoForm from '../../forms/presales/EditAutoForm';

export default class EditAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      auto_id: this.props.auto_id,
      customer_id: this.props.customer_id,
      isDisable: !!this.props.isDisable,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDisable: nextProps.isDisable,
      auto_id: nextProps.auto_id,
      customer_id: nextProps.customer_id,
    });
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          disabled={this.state.isDisable}
        >
          编辑
        </Button>
        <Modal
          title={<span><Icon type="edit"/> 编辑车辆信息</span>}
          visible={this.state.visible}
          width="680px"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditAutoForm
            cancelModal={this.hideModal}
            customer_id={this.state.customer_id}
            auto_id={this.state.auto_id}
          />
        </Modal>
      </span>
    );
  }
}
