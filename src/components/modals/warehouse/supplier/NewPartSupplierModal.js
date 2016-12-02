import React from 'react'
import {message, Modal, Icon, Button, Form, Input, InputNumber} from 'antd'
import api from '../../../../middleware/api'
import validator from '../../../../middleware/validator'
import BaseModal from '../../../base/BaseModal'
import FormValidator from '../../../forms/FormValidator'
import Layout from '../../../forms/Layout'

const FormItem = Form.Item;

class NewPartSupplier extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if(!!errors){
        message.error(validator.text.hasError);
        return;
      }

      api.ajax({
        url: api.addPartsSupplier(),
        type: "POST",
        data: values
      }, (data) => {
        message.info('添加成功！');
        this.props.getPartSupplierList();
        this.props.updateState({supplier_id: data.res.supplier_id});
        this.hideModal();
      })
    });
  }

  render() {
    const {visible}=this.state;
    const {formItemLayout} = Layout;
    const {getFieldProps} = this.props.form;

    const supplierCompanyProps = getFieldProps('supplier_company', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const nameProps = getFieldProps('name', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const phoneProps = getFieldProps('phone', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

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
          style={{border: '1px solid #ccc', top: 100, borderRadius: 6, marginTop:'50px'}}
          onCancel={this.hideModal}
          onOk={this.handleSubmit.bind(this)}>

          <Form horizontal form={this.props.form}>
            <FormItem label='单位名称' {...formItemLayout}>
              <Input type="text" {...supplierCompanyProps} placeholder="请输入单位名称"/>
            </FormItem>

            <FormItem label='电话号码' {...formItemLayout}>
              <Input type="text" {...phoneProps} placeholder="请输入电话号码"/>
            </FormItem>

            <FormItem label='联系人' {...formItemLayout}>
              <Input type="text" {...nameProps} placeholder="请输入联系人"/>
            </FormItem>

            <FormItem label='单位地址' {...formItemLayout}>
              <Input type="text" {...getFieldProps('address')} placeholder="请输入单位地址"/>
            </FormItem>

            <FormItem label='单位税号' {...formItemLayout}>
              <Input type="text" {...getFieldProps('tax')} placeholder="请输入单位税号"/>
            </FormItem>

            <FormItem label='单位帐号' {...formItemLayout}>
              <Input type="text" {...getFieldProps('bank_account')} placeholder="请输入单位帐号"/>
            </FormItem>

            <FormItem label='开户银行' {...formItemLayout}>
              <Input type="text" {...getFieldProps('bank')} placeholder="请输入开户银行"/>
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              <Input type="textarea"{...getFieldProps('remark')} placeholder="请输入备注"/>
            </FormItem>
          </Form>
        </Modal>
      </span>
    )
  }
}

NewPartSupplier = Form.create()(NewPartSupplier);
export default NewPartSupplier
