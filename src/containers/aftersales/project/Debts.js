import React from 'react';
import { Row, Col, Modal, Button, Form, Input, message, DatePicker } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';
import PrintArrearsModal from './PrintArrearsModal';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';

const FormItem = Form.Item;

class Debts extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      debts: 0,
    };

    [
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  showModal() {
    this.props.onShowSuccess();
    this.setState({ visible: true });
  }

  handleSubmit() {
    const { payMethod, detail } = this.props;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return false;
      }

      const payTypeList = [];
      payMethod.map(item => {
        payTypeList.push({ pay_type: item.method, amount: item.money });
      });

      values._id = detail._id;
      values.customer_id = detail.customer_id;
      values.pay_type_list = JSON.stringify(payTypeList);
      values.next_pay_date = DateFormatter.day(values.next_pay_date);

      api.ajax({
        url: api.aftersales.payProjectOnAccount(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('挂账成功');
        this.setState({ visible: false });
        location.reload();
      }, err => {
        message.error(err);
      },
      );
    });
  }

  disabledStartDate(current) {
    return current && current.valueOf() < new Date(new Date().setDate(new Date().getDate() - 1));
  }

  render() {
    const { visible } = this.state;
    const { debts, printOptionProps, payMethod } = this.props;

    printOptionProps.project.unpay_amount = debts;
    printOptionProps.project.next_pay_date = DateFormatter.day(this.props.form.getFieldValue('next_pay_date'));
    printOptionProps.project.idCardNum = this.props.form.getFieldValue('id_card_num');
    const footer = [
      <div>
        <Button key="btn1" type="primary" onClick={this.handleSubmit}>结算</Button>
        <PrintArrearsModal payMethod={payMethod} {...printOptionProps} type="button"
                           isReload={true} />
      </div>,
    ];

    const { formItemTwo } = Layout;
    const { getFieldDecorator } = this.props.form;

    return (
      <span>
        <Button onClick={this.showModal} type="primary" className="mr10">挂账</Button>

        <Form style={{ display: 'inline-block' }}>
          <Modal
            visible={visible}
            title="挂账"
            onCancel={this.hideModal}
            footer={footer}
            width="720px"
          >
            <p className="font-size-14 ml45 mb10">
              <label className="label">挂账金额</label>
              <a className="font-size-16" href="javascript:;">{debts}元</a>
            </p>
            <Row>
              <Col span={12}>
                <FormItem label="身份证号" {...formItemTwo}>
                  {getFieldDecorator('id_card_num', {
                    initialValue: '',
                    rules: [
                      {
                        required: false,
                        message: validator.required.idCard,
                      }, { validator: FormValidator.validateIdCard }],
                    validateTrigger: 'onBlur',
                  })(
                    <Input />,
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="还款时间" {...formItemTwo}>
                  {getFieldDecorator('next_pay_date', {
                    initialValue: DateFormatter.getMomentDate(new Date(new Date().getFullYear(), new Date().getMonth() +
                      1, new Date().getDate())),
                    rules: [{ required: true, message: '请输入还款时间' }],
                  })(
                    <DatePicker
                      format={DateFormatter.pattern.day}
                      placeholder="请选择还款时间"
                      allowClear={false}
                      disabledDate={this.disabledStartDate}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Modal>
        </Form>
      </span>
    );
  }
}

Debts = Form.create()(Debts);
export default Debts;
