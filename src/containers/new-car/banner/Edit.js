import React from 'react';
import { message, Modal, Icon, Form, Input, DatePicker } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
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
        <a href="javascript:" onClick={this.editBanner}>编辑</a>

        <Modal
          title={<span><Icon type="edit" className="mr10" />编辑Banner</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('banner_id', { initialValue: detail._id })(
              <Input type="hidden" />,
            )}

            <FormItem label="banner图片" {...formItemLayout} help="尺寸: 180*60" required>
              {getFieldDecorator('banner_pic', { initialValue: detail.banner_pic })(
                <Input type="hidden" />,
              )}
              <Qiniu
                prefix="banner_pic"
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('banner_pic')}
                onDrop={this.onDrop.bind(this, 'banner_pic')}
                onUpload={this.onUpload.bind(this, 'banner_pic')}
              >
                {this.renderImage('banner_pic', progressStyle)}
              </Qiniu>
            </FormItem>

            <FormItem label="链接" {...formItemLayout}>
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

            <FormItem label="上线时间" {...formItemLayout}>
              {getFieldDecorator('online_time', {
                initialValue: detail.online_time
                  ? formatter.getMomentDate(detail.online_time)
                  : formatter.getMomentDate(),
              })(
                <DatePicker placeholder="请选择活动上线时间" allowClear={false} />,
              )}
            </FormItem>

            <FormItem label="下线时间" {...formItemLayout}>
              {getFieldDecorator('offline_time', {
                initialValue: detail.offline_time
                  ? formatter.getMomentDate(detail.offline_time)
                  : formatter.getMomentDate(),
              })(
                <DatePicker placeholder="请选择活动下线时间" allowClear={false} />,
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
