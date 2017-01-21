import React from 'react';
import {message, Modal, Icon, Button, Form, Input} from 'antd';
import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import BaseModal from '../../../components/base/BaseModal';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

class NewPartSupplier extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      api.ajax({
        url: api.addPartsSupplier(),
        type: 'POST',
        data: values,
      }, (data) => {
        message.info('添加成功！');
        this.props.getPartSupplierList();
        this.props.updateState({supplier_id: data.res.supplier_id});
        this.hideModal();
      });
    });
  }

  render() {
    const {visible}=this.state;
    const {formItemLayout} = Layout;
    const {getFieldDecorator} = this.props.form;

    return (
      <span>
        <Button
          type="primary"
          className="margin-left-20"
          onClick={this.showModal}>
          添加进货商
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 添加进货商</span>}
          visible={visible}
          style={{top: 100, borderRadius: 6, marginTop: '50px'}}
          onCancel={this.hideModal}
          onOk={this.handleSubmit.bind(this)}>

          <Form horizontal>
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('supplier_company', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入单位名称"/>
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

            <FormItem label="联系人" {...formItemLayout}>
              {getFieldDecorator('user_name', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入联系人"/>
              )}
            </FormItem>

            <FormItem label="单位地址" {...formItemLayout}>
              {getFieldDecorator('address')(
                <Input placeholder="请输入单位地址"/>
              )}
            </FormItem>

            <FormItem label="单位税号" {...formItemLayout}>
              {getFieldDecorator('tax')(
                <Input placeholder="请输入单位税号"/>
              )}
            </FormItem>

            <FormItem label="单位帐号" {...formItemLayout}>
              {getFieldDecorator('bank_account')(
                <Input placeholder="请输入单位帐号"/>
              )}
            </FormItem>

            <FormItem label="开户银行" {...formItemLayout}>
              {getFieldDecorator('bank')(
                <Input placeholder="请输入开户银行"/>
              )}
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark')(
                <Input type="textarea" placeholder="请输入备注"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

NewPartSupplier = Form.create()(NewPartSupplier);
export default NewPartSupplier;
