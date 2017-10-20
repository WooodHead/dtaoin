import React from 'react';
import { message, Modal, Icon, Button, Form, Input } from 'antd';

import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';

const FormItem = Form.Item;

class New extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    const offline_time = new Date();
    offline_time.setFullYear(offline_time.getFullYear() + 10);

    this.state = {
      visible: false,
      offline_time,
      icon_pic_key: '',
      icon_pic_files: [],
      icon_pic_progress: {},
    };
    [
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll(errors => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      const formData = this.props.form.getFieldsValue();
      formData.offline_time = formatter.date(formData.offline_time);
      formData.online_time = formatter.date(formData.online_time);

      this.props.createResource(formData, this.hideModal);
    });
  }

  showModal() {
    this.props.form.resetFields();
    this.setState({ visible: true });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    return (
      <span>
        <Button type="primary" className="ml20" onClick={this.showModal}>新增资源方</Button>

        <Modal
          title={<span><Icon type="plus" className="mr10" />新增资源方</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >

          <Form>
            <FormItem label="资源方名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入资源方" />,
              )}
            </FormItem>

            <FormItem label="联系人" {...formItemLayout}>
              {getFieldDecorator('contact')(
                <Input placeholder="请输入联系人" />,
              )}
            </FormItem>

            <FormItem label="电话" {...formItemLayout}>
              {getFieldDecorator('telphone')(
                <Input placeholder="请输入电话" />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

New = Form.create()(New);
export default New;
