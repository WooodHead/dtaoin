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

class EditAdvert extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      banner_pic_key: '',
      banner_pic_files: [],
      banner_pic_progress: {},
    };
    [
      'editAdvert',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  editAdvert() {
    let {advert} = this.props;
    this.setState({banner_pic_key: advert.banner_pic});
    if (advert.banner_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(advert.banner_pic), 'banner_pic');
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
          url: api.advert.edit(),
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

    let {advert} = this.props;

    return (
      <span>
        <Button
          className="mr5"
          size="small"
          onClick={this.editAdvert}>
          编辑
        </Button>
        <Modal
          title={<span><Icon type="edit" className="margin-right-10"/>编辑广告</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >

          <Form horizontal>
            {getFieldDecorator('advert_id', {initialValue: advert._id})(
              <Input type="hidden"/>
            )}

            <FormItem label="顺序" {...formItemLayout}>
              {getFieldDecorator('order', {initialValue: advert.order})(
                <Input type="number" placeholder="请输入广告排序"/>
              )}
            </FormItem>

            <FormItem label="上线时间" {...formItemLayout}>
              {getFieldDecorator('online_time', {initialValue: advert.online_time ? formatter.getMomentDate(advert.online_time) : formatter.getMomentDate(advert.online_time)})(
                <DatePicker placeholder="请选择广告上线时间"/>
              )}
            </FormItem>

            <FormItem label="下线时间" {...formItemLayout}>
              {getFieldDecorator('offline_time', {initialValue: advert.offline_time ? formatter.getMomentDate(advert.offline_time) : formatter.getMomentDate(advert.online_time)})(
                <DatePicker placeholder="请选择广告下线时间"/>
              )}
            </FormItem>

            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('remark', {initialValue: advert.remark})(
                <Input />
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

            <FormItem label="图片" {...formItemLayout} help="尺寸: 1080*360px" required>
              {getFieldDecorator('banner_pic', {initialValue: advert.banner_pic})(
                <Input type="hidden"/>
              )}
              <Qiniu
                prefix="banner_pic"
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('banner_pic')}
                onDrop={this.onDrop.bind(this, 'banner_pic')}
                onUpload={this.onUpload.bind(this, 'banner_pic')}
              >
                {this.renderImage('banner_pic')}
              </Qiniu>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

EditAdvert = Form.create()(EditAdvert);
export default EditAdvert;
