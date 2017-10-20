import React from 'react';
import { message, Modal, Icon, Row, Col, Button, Form, Input } from 'antd';
import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import BaseModal from '../../../components/base/BaseModal';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  closeModal() {
    this.hideModal();
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      api.ajax({
        url: api.warehouse.supplier.add(),
        type: 'POST',
        data: values,
      }, data => {
        message.success('添加成功！');
        this.hideModal();
        this.props.form.resetFields();
        this.props.onSuccess(data.res.supplier_id);
      });
    });
  }

  render() {
    const { visible } = this.state;
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>新增供应商</Button>

        <Modal
          title={<span><Icon type="plus"/> 新增供应商</span>}
          visible={visible}
          onCancel={this.closeModal}
          onOk={this.handleSubmit}
        >
          <Form>

            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('supplier_company', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入单位名称"/>
              )}
            </FormItem>

            <FormItem label="主营业务" {...formItemLayout}>
              {getFieldDecorator('main_business')(
                <Input placeholder="请输入主营业务"/>
              )}
            </FormItem>

            <FormItem label="联系人" {...formItemLayout}>
              {getFieldDecorator('user_name', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入联系人"/>
              )}
            </FormItem>

            <FormItem label="电话号码" {...formItemLayout}>
              {getFieldDecorator('phone', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入电话号码"/>
              )}
            </FormItem>

            <FormItem label="单位地址" {...formItemLayout}>
              {getFieldDecorator('address')(
                <Input placeholder="请输入单位地址"/>
              )}
            </FormItem>

            <Row>
              <Col span={18} offset={6}>
                <h6 className="form-module-title">付款信息</h6>
              </Col>
            </Row>

            <FormItem label="单位税号" {...formItemLayout}>
              {getFieldDecorator('tax')(
                <Input placeholder="请输入单位税号"/>
              )}
            </FormItem>

            <FormItem label="开户行" {...formItemLayout}>
              {getFieldDecorator('bank')(
                <Input placeholder="请输入开户行"/>
              )}
            </FormItem>

            <FormItem label="银行账号" {...formItemLayout}>
              {getFieldDecorator('bank_account')(
                <Input placeholder="请输入银行账号"/>
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
