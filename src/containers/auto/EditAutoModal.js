import React from 'react';
import {Modal, Button, Icon} from 'antd';
import BaseModal from '../../components/base/BaseModal';
import EditAutoForm from './EditAutoForm';

export default class EditAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      auto_id: props.auto_id,
      customer_id: props.customer_id,
      isDisabled: !!props.isDisable,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDisabled: nextProps.isDisable,
      auto_id: nextProps.auto_id,
      customer_id: nextProps.customer_id,
    });
  }

  render() {
    let {
      visible,
      auto_id,
      customer_id,
      isDisabled,
    } = this.state;

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          disabled={isDisabled}
        >
          编辑
        </Button>

        <Modal
          title={<span><Icon type="edit"/> 编辑车辆信息</span>}
          visible={visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditAutoForm
            cancelModal={this.hideModal}
            auto_id={auto_id}
            customer_id={customer_id}
          />
        </Modal>
      </span>
    );
  }
}
