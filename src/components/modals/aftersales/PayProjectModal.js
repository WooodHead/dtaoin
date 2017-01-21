import React from 'react';
import {Modal, Icon, Button} from 'antd';
import BaseModal from '../../base/BaseModal';
import PayProjectForm from '../../forms/aftersales/PayProjectForm';

export default class PayProjectModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const formProps = {
      customerId: this.props.customer_id,
      projectId: this.props.project_id,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
    };

    return (
      <span>
        <Button
          type="primary"
          size={this.props.size ? this.props.size : 'small'}
          className="btn-action-small"
          disabled={this.props.isDisabled}
          onClick={this.showModal}
        >
          结算
        </Button>
        <Modal
          title={<span><Icon type="pay-circle-o"/> 工单结算</span>}
          visible={this.state.visible}
          width={500}
          onCancel={this.hideModal}
          footer={null}
        >
          <PayProjectForm {...formProps} />
        </Modal>
      </span>
    );
  }
}
