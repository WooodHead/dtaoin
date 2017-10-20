import React from 'react';
import { message, Modal, Icon, Form, Input } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';

const FormItem = Form.Item;

class Edit extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      icon_pic_key: '',
      icon_pic_files: [],
      icon_pic_progress: {},
    };
    [
      'editBanner',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  editBanner() {
    const { detail } = this.props;
    this.setState({ icon_pic_key: detail.banner_pic });
    if (detail.banner_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(detail.banner_pic), 'banner_pic');
    }
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

      this.props.submit(formData, this.hideModal);
    });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    const { detail } = this.props;

    return (
      <span>
        <a href="javascript:" onClick={this.editBanner}>编辑</a>

        <Modal
          title={<span><Icon type="edit" className="mr10" />编辑资源方</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('resource_id', { initialValue: detail._id })(
              <Input type="hidden" />,
            )}

            <FormItem label="资源方名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: detail.name,
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入资源方" />,
              )}
            </FormItem>

            <FormItem label="联系人" {...formItemLayout}>
              {getFieldDecorator('contact', { initialValue: detail.contact })(
                <Input placeholder="请输入联系人" />,
              )}
            </FormItem>

            <FormItem label="电话" {...formItemLayout}>
              {getFieldDecorator('telphone', { initialValue: detail.telphone })(
                <Input placeholder="请输入电话" />,
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
