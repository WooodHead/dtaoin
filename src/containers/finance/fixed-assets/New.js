import React from 'react';
import {Row, Col, message, Modal, Icon, Button, Form, Input, Select, DatePicker} from 'antd';
import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';

import validator from '../../../utils/validator';
import FormLayout from '../../../utils/FormLayout';
import DateFormatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;

class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      users: [],
    };
    [
      'handleAdd',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleAdd() {
    this.getUsers();
    this.showModal();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      values.buy_date = DateFormatter.date(values.buy_date);

      api.ajax({
        url: api.fixedAssets.add(),
        type: 'POST',
        data: values,
      }, () => {
        this.hideModal();
        this.props.form.resetFields();
        location.reload();
      });
    });
  }

  getUsers() {
    api.ajax({url: api.user.getUsers()}, data => {
      this.setState({users: data.res.user_list});
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {visible, users} = this.state;
    const {formItemThree, selectStyle} = FormLayout;

    return (
      <span>
        <Button
          type="primary"
          className="pull-right"
          onClick={this.handleAdd}
        >
          添加固定资产
        </Button>
        <Modal
          title={<span><Icon type="plus" className="mr10"/>添加固定资产</span>}
          visible={visible}
          width={960}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >

          <Form horizontal>
            <Row type={'flex'}>
              <Col span={8}>
                <FormItem label="资产名称" {...formItemThree}>
                  {getFieldDecorator('name', {
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入资产名称"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="品牌型号" {...formItemThree}>
                  {getFieldDecorator('brand')(
                    <Input placeholder="请输入品牌型号"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type={'flex'}>
              <Col span={8}>
                <FormItem label="购入单价" {...formItemThree}>
                  {getFieldDecorator('unit_price', {
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input type="number" addonBefore="¥" placeholder="请输入金额"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="数量" {...formItemThree}>
                  {getFieldDecorator('total_count', {
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input type="number" placeholder="请输入购买数量"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="购入日期" {...formItemThree}>
                  {getFieldDecorator('buy_date', {
                    initialValue: DateFormatter.getMomentDate(),
                  })(
                    <DatePicker placeholder="请选择购入日期"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type={'flex'}>
              <Col span={8}>
                <FormItem label="存放地点" {...formItemThree}>
                  {getFieldDecorator('location', {
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入存放地点"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="负责人" {...formItemThree}>
                  {getFieldDecorator('incharge_user_id')(
                    <Select showSearch {...selectStyle} placeholder="请选择负责人">
                      {users.map(user => <Option key={user._id}>{user.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type={'flex'}>
              <Col span={8}>
                <FormItem label="供应商" {...formItemThree}>
                  {getFieldDecorator('supplier_company')(
                    <Input placeholder="请选择购供应商"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                 <FormItem label="联系人" {...formItemThree}>
                    {getFieldDecorator('supplier_name')(
                      <Input placeholder="请选择购联系人"/>
                    )}
                  </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="联系电话" {...formItemThree}>
                  {getFieldDecorator('supplier_phone', {
                    rules: FormValidator.getRulePhoneNumber(false),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入联系电话"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

New = Form.create()(New);
export default New;
