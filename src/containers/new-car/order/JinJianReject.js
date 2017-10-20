import React from 'react';
import { Input, Modal, Form, Button, message } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

const TextArea = Input.TextArea;

class JinJianReject extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: '',
    };
    [
      'handleReject',
      'handleChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  showModal() {
    this.setState({ visible: true, value: '' });
  }

  handleReject() {
    const { value } = this.state;
    if (!value) {
      message.error('请填写原因');
      return false;
    }

    this.props.jinJianReject(value);
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
        <Button type="primary" onClick={this.showModal}>驳回</Button>

        <Modal
          title="填写驳回原因"
          visible={visible}
          onCancel={this.hideModal}
          footer={
            <span>
              <Button size="large" className="mr5" onClick={this.hideModal}>取消</Button>
              <Button size="large" type="primary" onClick={this.handleReject}>确定</Button>
            </span>
          }
        >
          <label className="label ant-form-item-required">驳回原因</label>
          <TextArea
            value={value}
            onChange={this.handleChange}
            style={{ width: '400px', verticalAlign: 'top' }}
          />
        </Modal>
      </span>
    );
  }
}

JinJianReject = Form.create()(JinJianReject);
export default JinJianReject;
