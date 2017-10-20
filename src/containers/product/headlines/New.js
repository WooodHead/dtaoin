import React from 'react';
import { message, Modal, Icon, Button, Form, Input, DatePicker } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';


const FormItem = Form.Item;

class New extends BaseModal {
  constructor(props) {
    super(props);
    const offline_time = new Date();
    offline_time.setFullYear(offline_time.getFullYear() + 10);

    this.state = {
      visible: false,
      offline_time,
      banner_pic_key: '',
      banner_pic_files: [],
      banner_pic_progress: {},
    };
    [
      'newAdvert',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  newAdvert() {
    this.showModal();
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

      api.ajax({
        url: api.headlines.add(),
        type: 'POST',
        data: formData,
      },
        () => {
          this.hideModal();
          location.reload();
        });
    });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible, offline_time } = this.state;

    return (
      <span>
        <Button
          type="primary"
          className="ml20"
          onClick={this.newAdvert}>
          新增头条
        </Button>
        <Modal
          title={<span><Icon type="plus" className="mr10"/>新增头条</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>

          <Form>
            <FormItem label="顺序" {...formItemLayout}>
              {getFieldDecorator('order')(
                <Input type="number" placeholder="请输入头条排序"/>
              )}
            </FormItem>

            <FormItem label="标题" {...formItemLayout}>
              {getFieldDecorator('name')(
                <Input />
              )}
            </FormItem>

            <FormItem label="上线时间" {...formItemLayout}>
              {getFieldDecorator('online_time', { initialValue: formatter.getMomentDate() })(
                <DatePicker placeholder="请选择头条上线时间" allowClear={false}/>
              )}
            </FormItem>

            <FormItem label="下线时间" {...formItemLayout}>
              {getFieldDecorator('offline_time', { initialValue: formatter.getMomentDate(offline_time) })(
                <DatePicker placeholder="请选择头条下线时间" allowClear={false}/>
              )}
            </FormItem>

            <FormItem label="链接" {...formItemLayout}>
              {getFieldDecorator('url', {
                rules: FormValidator.getRuleUrl(true),
                validateTrigger: 'onBlur',
              })(
                <Input type="url"/>
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
