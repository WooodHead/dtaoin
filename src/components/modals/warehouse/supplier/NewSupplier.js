import React from 'react'
import {message, Modal, Icon, Row, Col, Button, Form, Input, InputNumber} from 'antd'
import api from '../../../../middleware/api'
import validator from '../../../../middleware/validator'
import BaseModal from '../../../base/BaseModal'
import FormValidator from '../../../forms/FormValidator'
import Layout from '../../../forms/Layout'

const FormItem = Form.Item;

class NewSupplier extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      api.ajax({
        url: api.warehouse.addSupplier(),
        type: "POST",
        data: values
      }, (data) => {
        message.info('添加成功！');
        this.hideModal();
        location.hash = api.getHash();
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
          onClick={this.showModal}>
          添加进货商
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 添加进货商</span>}
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}>

          <Form horizontal>
            <Row>
              <Col span={18} offset={6}>
                <h6 className="form-module-title">供应商信息</h6>
              </Col>
            </Row>
            <FormItem label="单位名称" {...formItemLayout}>
              <Input type="text" {...supplierCompanyProps} placeholder="请输入单位名称"/>
            </FormItem>

            <FormItem label="联系人" {...formItemLayout}>
              <Input type="text" {...nameProps} placeholder="请输入联系人"/>
            </FormItem>

            <FormItem label="电话号码" {...formItemLayout}>
              <Input type="text" {...phoneProps} placeholder="请输入电话号码"/>
            </FormItem>

            <FormItem label="单位地址" {...formItemLayout}>
              <Input type="text" {...getFieldProps('address')} placeholder="请输入单位地址"/>
            </FormItem>

            <Row>
              <Col span={18} offset={6}>
                <h6 className="form-module-title">付款信息</h6>
              </Col>
            </Row>

            <FormItem label="单位税号" {...formItemLayout}>
              <Input type="text" {...getFieldProps('tax')} placeholder="请输入单位税号"/>
            </FormItem>

            <FormItem label="开户银行" {...formItemLayout}>
              <Input type="text" {...getFieldProps('bank')} placeholder="请输入开户银行"/>
            </FormItem>

            <FormItem label="单位帐号" {...formItemLayout}>
              <Input type="text" {...getFieldProps('bank_account')} placeholder="请输入单位帐号"/>
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

NewSupplier = Form.create()(NewSupplier);
export default NewSupplier
