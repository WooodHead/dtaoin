import React from 'react';
import {Modal, Icon, Button} from 'antd';
import BaseModal from '../../base/BaseModal';
import NewAutoForm from '../../forms/aftersales/NewAutoForm';

export default class NewAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isDisable: !!this.props.isDisable,
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const formProps = {
      customer_id: this.props.customer_id,
      auto_id: this.state.auto_id,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
    };

    return (
      <span>
        <Button
          type="primary"
          disabled={this.state.isDisable}
          onClick={this.showModal}
        >
          添加
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 添加车辆</span>}
          visible={this.state.visible}
          width="50%"
          onCancel={this.hideModal}
          footer={null}
        >
          <NewAutoForm newAuto="true" {...formProps} />
        </Modal>
      </span>
    );
  }
}
