import React from 'react';
import { message, Modal, Icon, Button, Form, Input, DatePicker } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import Qiniu from '../../../components/widget/UploadQiniu';
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
    const { visible, offline_time } = this.state;

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
        <Button type="primary" className="ml20" onClick={this.showModal}>新增Banner</Button>

        <Modal
          title={<span><Icon type="plus" className="mr10" />创建Banner</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >

          <Form>
            <FormItem label="banner图片" {...formItemLayout} help="建议尺寸: 180*60" required>
              {getFieldDecorator('banner_pic')(
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

            <FormItem label="上线时间" {...formItemLayout}>
              {getFieldDecorator('online_time', { initialValue: formatter.getMomentDate() })(
                <DatePicker placeholder="请选择活动上线时间" allowClear={false} />,
              )}
            </FormItem>

            <FormItem label="下线时间" {...formItemLayout}>
              {getFieldDecorator('offline_time', { initialValue: formatter.getMomentDate(offline_time) })(
                <DatePicker placeholder="请选择活动下线时间" allowClear={false} />,
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
