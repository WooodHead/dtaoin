import React from 'react';
import { message, Modal, Icon, Form, Input, DatePicker } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import BaseModal from '../../../components/base/BaseModal';

const FormItem = Form.Item;

class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      banner_pic_key: '',
      banner_pic_files: [],
      banner_pic_progress: {},
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

      api.ajax({
        url: api.headlines.edit(),
        type: 'POST',
        data: formData,
      }, () => {
        message.success('编辑成功！');
        this.props.onSuccess();
        this.hideModal();
      }, () => {
        message.error('编辑失败！');
      });
    });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    const { news } = this.props;

    return (
      <span>
        <a href="javascript:" onClick={this.showModal}>编辑</a>

        <Modal
          title={<span><Icon type="edit" className="mr10"/>编辑头条</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('news_id', { initialValue: news._id })(
              <Input type="hidden"/>
            )}

            <FormItem label="顺序" {...formItemLayout}>
              {getFieldDecorator('order', { initialValue: news.order })(
                <Input type="number" placeholder="请输入头条排序"/>
              )}
            </FormItem>

            <FormItem label="标题" {...formItemLayout}>
              {getFieldDecorator('name', { initialValue: news.name })(
                <Input />
              )}
            </FormItem>

            <FormItem label="上线时间" {...formItemLayout}>
              {getFieldDecorator('online_time', { initialValue: news.online_time ? formatter.getMomentDate(news.online_time) : formatter.getMomentDate(news.online_time) })(
                <DatePicker placeholder="请选择头条上线时间" allowClear={false}/>
              )}
            </FormItem>

            <FormItem label="下线时间" {...formItemLayout}>
              {getFieldDecorator('offline_time', { initialValue: news.offline_time ? formatter.getMomentDate(news.offline_time) : formatter.getMomentDate(news.online_time) })(
                <DatePicker placeholder="请选择头条下线时间" allowClear={false}/>
              )}
            </FormItem>

            <FormItem label="链接" {...formItemLayout}>
              {getFieldDecorator('url', {
                initialValue: news.url,
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

Edit = Form.create()(Edit);
export default Edit;
