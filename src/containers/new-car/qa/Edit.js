import React from 'react';
import { message, Modal, Icon, Form, Input } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';
import Qiniu from '../../../components/widget/UploadQiniu';

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
      'editQa',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  editQa() {
    const { detail } = this.props;
    this.setState({ icon_pic_key: detail.cover_pic });
    if (detail.cover_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(detail.cover_pic), 'cover_pic');
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

      this.props.submit(formData, this.hideModal);
    });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    const { detail } = this.props;

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
        <a href="javascript:" onClick={this.editQa}>编辑</a>

        <Modal
          title={<span><Icon type="edit" className="mr10" />编辑文章</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('article_id', { initialValue: detail._id })(
              <Input type="hidden" />,
            )}

            <FormItem label="文章标题" {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: detail.title,
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem label="封面" {...formItemLayout} help="尺寸: 180*60" required>
              {getFieldDecorator('cover_pic', { initialValue: detail.cover_pic })(
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
                initialValue: detail.url,
                rules: FormValidator.getRuleUrl(true),
                validateTrigger: 'onBlur',
              })(
                <Input type="url" placeholder="请输入" />,
              )}
            </FormItem>

            <FormItem label="顺序" {...formItemLayout}>
              {getFieldDecorator('order', { initialValue: detail.order })(
                <Input placeholder="请输入" />,
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
