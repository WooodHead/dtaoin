import React from 'react';
import { message, Modal, Icon, Button, Form, Input } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import Qiniu from '../../../components/widget/UploadQiniu';
import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';

const FormItem = Form.Item;

class New extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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

      this.props.createArticle(formData);
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

    const progressStyle = {
      position: 'absolute',
      left: '120px',
      top: '30px',
      zIndex: '10',
      width: '100px',
      color: '#87d068',
    };

    return (
      <span>
        <Button type="primary" className="ml20" onClick={this.showModal}>创建文章</Button>

        <Modal
          title={<span><Icon type="plus" className="mr10" />创建文章</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >

          <Form>
            <FormItem label="文章标题" {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem label="封面" {...formItemLayout} help="建议尺寸: 180*60" required>
              {getFieldDecorator('cover_pic')(
                <Input type="hidden" />,
              )}
              <Qiniu
                prefix="cover_pic"
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('cover_pic')}
                onDrop={this.onDrop.bind(this, 'cover_pic')}
                onUpload={this.onUpload.bind(this, 'cover_pic')}
              >
                {this.renderImage('cover_pic', progressStyle, { width: '90%', height: '80px' })}
              </Qiniu>
            </FormItem>

            <FormItem label="文章链接" {...formItemLayout}>
              {getFieldDecorator('url', {
                rules: FormValidator.getRuleUrl(true),
                validateTrigger: 'onBlur',
              })(
                <Input type="url" />,
              )}
            </FormItem>

            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('order')(
                <Input type="number" placeholder="请输入" />,
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
