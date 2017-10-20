import React from 'react';
import { Modal, Form, Icon, Button, Input, DatePicker } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

class FireUserModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const formData = this.props.form.getFieldsValue();
    formData.fire_date = formatter.day(formData.fire_date);
    api.ajax({
      url: api.user.fire(),
      type: 'POST',
      data: formData,
    }, () => {
      this.hideModal();
      this.props.onSuccess();
    });
  }

  render() {
    const FormItem = Form.Item;
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { user, size, disabled } = this.props;

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.showModal} disabled={disabled}>离职</a> :
          <Button onClick={this.showModal} disabled={disabled}>离职</Button>
        }

        <Modal
          title={<span><Icon type="plus"/> 离职</span>}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}>

          <Form>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', { initialValue: user.name })(
                <Input placeholder="请输入姓名" disabled/>
              )}
            </FormItem>

            <FormItem label="员工编号" {...formItemLayout}>
              {getFieldDecorator('_id', { initialValue: user._id })(
                <Input placeholder="请输入员工编号" disabled/>
              )}
            </FormItem>

            <FormItem label="离职时间" {...formItemLayout}>
              {getFieldDecorator('fire_date', { initialValue: formatter.getMomentDate() })(
                <DatePicker allowClear={false}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

FireUserModal = Form.create()(FireUserModal);
export default FireUserModal;
