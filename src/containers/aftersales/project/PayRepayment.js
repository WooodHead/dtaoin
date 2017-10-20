import React from 'react';
import { Row, Col, Modal, Button, Form, Icon, Select, message, DatePicker } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import NumberInput from '../../../components/widget/NumberInput';
import PrintArrearsModal from './PrintArrearsModal';

const FormItem = Form.Item;

class PayRepayment extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      payMethod: [{ method: '2', money: '0' }],
      debts: 0,
      printOptionProps: '',
    };

    [
      'handlePayMethodAdd',
      'handlePayMethodDelete',
      'handlePayMethodSelect',
      'handleMoneyChange',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { payMethod } = this.state;
    const { detail } = this.props;
    if (!!detail && Number(payMethod.length) === 1) {
      payMethod[0].money = Number(detail.unpay_amount).toFixed(2);
      this.setState({ payMethod });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { payMethod } = this.state;
    if (!!nextProps.detail && Number(payMethod.length) === 1) {
      if (String(nextProps.detail.unpay_amount) !== this.state.unpayAmount) {
        payMethod[0].money = nextProps.detail.unpay_amount ? Number(nextProps.detail.unpay_amount).
          toFixed(2) : '0';
      }
      this.setState({ payMethod, unpayAmount: nextProps.detail.unpay_amount });
    }
  }

  handlePayMethodAdd() {
    const { payMethod } = this.state;
    const { detail } = this.props;
    let paid = 0;
    payMethod.forEach(item => {
      paid += Number(item.money);
    });

    const difference = Number(detail.unpay_amount) - paid;

    if (difference > 0) {
      payMethod.push({ method: '2', money: difference });
    } else {
      message.warn('付款金额足够');
    }
    this.setState({ payMethod, debts: 0 });
  }

  handlePayMethodDelete(index) {
    const { payMethod } = this.state;
    const { detail } = this.props;
    payMethod.splice(index, 1);

    let paid = 0;
    payMethod.forEach(item => {
      paid += Number(item.money);
    });

    const difference = Number(detail.unpay_amount) - paid;

    this.setState({ payMethod, debts: difference });
  }

  handlePayMethodSelect(value, index) {
    const { payMethod } = this.state;
    payMethod[index].method = value;
    this.setState({ payMethod });
  }

  handleMoneyChange(value, index) {
    const { payMethod } = this.state;
    const { detail } = this.props;

    payMethod[index].money = value;

    let paid = 0;
    payMethod.forEach(item => {
      paid += Number(item.money);
    });

    const difference = Number(detail.unpay_amount) - paid + Number(payMethod[index].money);

    if (paid > Number(detail.unpay_amount)) {
      message.warn('支付金额不可大于应付金额');
      payMethod[index].money = difference.toFixed(2);
    }

    const debts = (Number(detail.unpay_amount) - paid) > 0 ? (Number(detail.unpay_amount) - paid) : 0;
    this.setState({ payMethod, debts });
  }

  showModal() {
    const { detail } = this.props;

    if (Number(detail.status) === 1) {
      this.setState({ visible: true });
    } else {
      api.ajax({
        url: api.aftersales.project.finish(),
        type: 'POST',
        data: { _id: detail._id },
      }, () => {
        this.setState({ visible: true });
        this.props.onFinish(detail._id);
      }, err => {
        message.error(err);
      },
      );
    }
  }

  handleSubmit() {
    const { detail } = this.props;
    const { payMethod } = this.state;

    const payTypeList = [];
    payMethod.map(item => {
      payTypeList.push({ pay_type: item.method, amount: item.money });
    });

    const data = {
      _id: detail._id,
      customer_id: detail.customer_id,
      pay_type_list: JSON.stringify(payTypeList),
      next_pay_date: DateFormatter.day(this.props.form.getFieldValue('next_pay_date')),
    };
    api.ajax({
      url: api.aftersales.payProjectOnRepayment(),
      type: 'POST',
      data,
    }, () => {
      message.success('结算成功');
      this.setState({ visible: false });
      location.reload();
    }, err => {
      message.error(err);
    },
    );
  }

  disabledStartDate(current) {
    return current && current.valueOf() < new Date(new Date().setDate(new Date().getDate() - 1));
  }

  render() {
    const { payMethod, visible, debts } = this.state;
    const { detail, size } = this.props;
    const printOptionProps = this.props.printOptionProps;

    // printOptionProps.project.unpay_amount = debts;
    printOptionProps.project.next_pay_date = DateFormatter.day(this.props.form.getFieldValue('next_pay_date'));
    const { getFieldDecorator } = this.props.form;
    const { formItemTwo } = Layout;

    const footer = [
      <div>
        <Button key="btn1" type="primary" onClick={this.handleSubmit}>结算</Button>
        {
          Number(debts) > 0 ? <PrintArrearsModal
            debts={debts}
            payMethod={payMethod}
            {...printOptionProps}
            type="button"
            isReload={true}
          /> : ''
        }
      </div>,
    ];

    const payMethodShow = (
      payMethod.map((item, index) => (
          <Row key={`${index}1`}>
            <Col span={12}>
              <FormItem label={'支付方式'} {...formItemTwo}>
                <Select
                  onSelect={value => this.handlePayMethodSelect(value, index)}
                  value={item.method}
                  style={{ width: '180px' }}
                >
                  <Option key="1">银行转账</Option>
                  <Option key="2">现金支付</Option>
                  <Option key="3">微信支付</Option>
                  <Option key="4">支付宝支付</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem label="付款金额" {...formItemTwo}>
                <NumberInput
                  id="pay_amount"
                  rules={[{ required: true, message: '请输入实付金额' }]}
                  onChange={value => this.handleMoneyChange(value, index)}
                  placeholder="请输入工时单价"
                  unit="元"
                  value={item.money}
                />
              </FormItem>
            </Col>
            <Col span={3}>
              <a href="javascript:;" className={payMethod.length === 1 ? 'hide' : 'ml10'}>
                <Icon
                  className="dynamic-delete-button"
                  type="delete"
                  onClick={() => this.handlePayMethodDelete(index)}
                />
              </a>
            </Col>
          </Row>
        ))
    );

    return (
      <div className="inline-block">
        {
          size === 'small' ? <a href="javascript:;" onClick={this.showModal}>还款</a> :
            <span onClick={this.showModal}>还款</span>
        }
        <Modal
          visible={visible}
          title="还款"
          onCancel={this.hideModal}
          footer={footer}
          width="720px"
        >
          <p className="font-size-14 ml45 mb20">
            <label className="label">应付金额</label>
            <a className="font-size-16" href="javascript:;">
              {Number(detail.unpay_amount).toFixed(2)}元
            </a>
          </p>
          {payMethodShow}
          <Row>
            <Col span={24} className="center">
              <Button
                type="dashed"
                style={{ width: '71%', marginLeft: '28px' }}
                onClick={this.handlePayMethodAdd}
              >
                <Icon type="plus" /> 添加支付方式
              </Button>
            </Col>
          </Row>

          <Form>
            <Row className="mt10">
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
          </Form>
          <p className="font-size-14 ml45 mt10">
            <label className="label">挂账金额</label>
            <a className="font-size-16" href="javascript:;">{Number(debts).toFixed(2)}元</a>
          </p>
        </Modal>

      </div>
    );
  }
}

PayRepayment = Form.create()(PayRepayment);
export default PayRepayment;
