import React from 'react';
import { Input, Modal, Form, Button, message } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

const TextArea = Input.TextArea;

class OrderFail extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: '',
    };
    [
      'handleFail',
      'handleChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  showModal() {
    this.setState({ visible: true, value: '' });
  }

  handleFail() {
    const { value } = this.state;
    if (!value) {
      message.error('请填写原因');
      return false;
    }
    this.props.jinJianFail(value);
    this.hideModal();
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }

  render() {
    const { visible, value } = this.state;

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>交易失败</Button>

        <Modal
          title="填写失败原因"
          visible={visible}
          onCancel={this.hideModal}
          footer={
            <span>
              <Button size="large" className="mr5" onClick={this.hideModal}>取消</Button>
              <Button size="large" type="primary" onClick={this.handleFail}>确定</Button>
            </span>
          }
        >
          <label className="label ant-form-item-required">交易失败原因</label>
          <TextArea
            value={value}
            onChange={this.handleChange}
            style={{ width: '300px', verticalAlign: 'top' }}
          />
        </Modal>
      </span>
    );
  }
}

OrderFail = Form.create()(OrderFail);
export default OrderFail;
