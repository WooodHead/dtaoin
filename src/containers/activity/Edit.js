import React from 'react';
import {message, Modal, Icon, Button, Form, Input, DatePicker} from 'antd';
import api from '../../middleware/api';
import Layout from '../../utils/FormLayout';
import BaseModalWithUpload from '../../components/base/BaseModalWithUpload';
import Qiniu from '../../components/UploadQiniu';
import formatter from '../../utils/DateFormatter';
import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';

const FormItem = Form.Item;

class EditActivity extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      icon_pic_key: '',
      icon_pic_files: [],
      icon_pic_progress: {},
    };
    [
      'editActivity',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  editActivity() {
    let {activity} = this.props;
    this.setState({icon_pic_key: activity.icon_pic});
    if (activity.icon_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(activity.icon_pic), 'icon_pic');
    }
    this.showModal();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors) => {
      if (!!errors) {
        message.error(validator.hasError);
        return;
      }

      let formData = this.props.form.getFieldsValue();
      formData.offline_time = formatter.date(formData.offline_time);
      formData.online_time = formatter.date(formData.online_time);

      api.ajax({
          url: api.activity.edit(),
          type: 'POST',
          data: formData,
        },
        () => {
          // (data) => {
          this.hideModal();
          location.reload();
        });
    });
  }

  render() {
    const {formItemLayout} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {visible} = this.state;

    let {activity} = this.props;

    return (
      <span>
        <Button
          className="mr5"
          size="small"
          onClick={this.editActivity}>
          编辑
        </Button>
        <Modal
          title={<span><Icon type="edit" className="margin-right-10"/>编辑活动</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>

          <Form horizontal>
            {getFieldDecorator('activity_id', {initialValue: activity._id})(
              <Input type="hidden"/>
            )}

            <FormItem label="顺序" {...formItemLayout}>
              {getFieldDecorator('order', {initialValue: activity.order})(
                <Input placeholder="请输入活动排序"/>
              )}
            </FormItem>

            <FormItem label="上线时间" {...formItemLayout}>
              {getFieldDecorator('online_time', {initialValue: activity.online_time ? formatter.getMomentDate(activity.online_time) : formatter.getMomentDate()})(
                <DatePicker placeholder="请选择活动上线时间"/>
              )}
            </FormItem>

            <FormItem label="下线时间" {...formItemLayout}>
              {getFieldDecorator('offline_time', {initialValue: activity.offline_time ? formatter.getMomentDate(activity.offline_time) : formatter.getMomentDate()})(
                <DatePicker placeholder="请选择活动下线时间"/>
              )}
            </FormItem>

            <FormItem label="标题" {...formItemLayout}>
              {getFieldDecorator('name', {initialValue: activity.name})(
                <Input />
              )}
            </FormItem>

            <FormItem label="链接" {...formItemLayout}>
              {getFieldDecorator('url', {
                initialValue: activity.url,
                rules: FormValidator.getRuleUrl(true),
                validateTrigger: 'onBlur',
              })(
                <Input type="url"/>
              )}
            </FormItem>

            <FormItem label="图片" {...formItemLayout} help="尺寸: 495*210px" required>
              {getFieldDecorator('icon_pic', {initialValue: activity.icon_pic})(
                <Input type="hidden"/>
              )}
              <Qiniu
                prefix="icon_pic"
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('icon_pic')}
                onDrop={this.onDrop.bind(this, 'icon_pic')}
                onUpload={this.onUpload.bind(this, 'icon_pic')}
              >
                {this.renderImage('icon_pic')}
              </Qiniu>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

EditActivity = Form.create()(EditActivity);
export default EditActivity;
