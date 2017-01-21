import React from 'react';
import {Modal, Form, Icon, Button, Input, DatePicker} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

class FireUserModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let formData = this.props.form.getFieldsValue();
    formData.fire_date = formatter.day(formData.fire_date);
    api.ajax({
      url: api.user.fire(),
      type: 'POST',
      data: formData,
    }, () => {
      this.hideModal();
      location.reload();
    });
  }

  render() {
    const FormItem = Form.Item;
    let {formItemLayout} = Layout;
    let {getFieldDecorator} = this.props.form;
    let {user} = this.props;

    return (
      <span>
        <Button
          type="ghost"
          onClick={this.showModal}
          size="small"
          className="mr15"
          disabled={this.props.disabled}>
          离职
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 离职</span>}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}>

          <Form horizontal>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {initialValue: user.name})(
                <Input placeholder="请输入姓名" disabled/>
              )}
            </FormItem>

            <FormItem label="员工编号" {...formItemLayout}>
              {getFieldDecorator('_id', {initialValue: user._id})(
                <Input placeholder="请输入员工编号" disabled/>
              )}
            </FormItem>

            <FormItem label="离职时间" {...formItemLayout}>
              {getFieldDecorator('fire_date', {initialValue: formatter.getMomentDate()})(
                <DatePicker />
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

FireUserModal = Form.create()(FireUserModal);
export default FireUserModal;
