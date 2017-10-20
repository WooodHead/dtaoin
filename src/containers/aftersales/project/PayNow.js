import React from 'react';
import { Row, Col, Modal, Button, Form, Popconfirm, Icon, Select, message } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

import Debts from './Debts';
import NumberInput from '../../../components/widget/NumberInput';
import PrintPaymentModal from './PrintPaymentModal';

const FormItem = Form.Item;

export default class ClassName extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      payMethod: [{ method: '2', money: '0' }],
      debts: 0,
      totalFee: '0',
    };

    [
      'handlePayMethodAdd',
      'handlePayMethodDelete',
      'handlePayMethodSelect',
      'handleMoneyChange',
      'handleSubmit',
      'handleDebtsShow',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { payMethod } = this.state;
    const { detail } = this.props;
    if (!!detail && Number(payMethod.length) === 1) {
      payMethod[0].money = Number(detail.total_fee).toFixed(2) || '0';
      this.setState({ payMethod });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { payMethod } = this.state;
    if (!!nextProps.detail && Number(payMethod.length) === 1) {
      if (String(nextProps.detail.total_fee) !== this.state.totalFee) {
        payMethod[0].money = nextProps.detail.total_fee ? Number(nextProps.detail.total_fee).
          toFixed(2) : '0';
        this.setState({ payMethod, totalFee: nextProps.detail.total_fee });
      }
    }
  }

  handleDebtsShow() {
    this.setState({ visible: false });
  }

  handlePayMethodAdd() {
    const { payMethod } = this.state;
    const { detail } = this.props;
    let paid = 0;
    payMethod.forEach(item => {
      paid += Number(item.money);
    });

    const difference = Number(detail.total_fee) - paid;

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

    const difference = Number(detail.total_fee) - paid;

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

    const difference = Number(detail.total_fee) - paid + Number(payMethod[index].money);

    if (paid > Number(detail.total_fee)) {
      message.warn('支付金额不可大于应付金额');
      payMethod[index].money = difference.toFixed(2);
    }

    const debts = (Number(detail.total_fee) - paid) > 0 ? (Number(detail.total_fee) - paid) : 0;

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
    };
    api.ajax({
      url: api.aftersales.maintainIntentionPayByHand(),
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

  render() {
    const { payMethod, visible, debts } = this.state;
    const { detail, printOptionProps, size } = this.props;

    const footer = [
      <div key="footer">
        {
          Number(debts) > 0 ? <Debts
            printOptionProps={printOptionProps}
            payMethod={payMethod}
            detail={detail}
            debts={debts}
            onShowSuccess={this.handleDebtsShow}
          /> : <Button key="btn1" type="primary" onClick={this.handleSubmit}>结算</Button>
        }
        {
          Number(debts) > 0 ? '' : <PrintPaymentModal
            {...printOptionProps}
            type="button"
            payMethod={payMethod}
            isReload={true}
          />
        }
      </div>,
    ];
    const { formItemTwo } = Layout;

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
              <FormItem label="付款金额" {...formItemTwo} required>
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
              <a href="javascript:;" className="ml10" disabled={payMethod.length === 1}>
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
          size === 'small'
            ? String(detail.status) === '1'
            ? <a href="javascript:;" onClick={this.showModal}>结算</a>
            : <Popconfirm
              placement="topRight"
              title="请确认施工完毕，配件出库"
              onConfirm={this.showModal}
            >
              <a href="javascript:;">结算</a>
            </Popconfirm>
            : String(detail.status) === '1'
            ? <span onClick={this.showModal}>结算</span>
            : <Popconfirm
              placement="topRight"
              title="请确认施工完毕，配件出库"
              onConfirm={this.showModal}
            >
              <span>结算</span>
            </Popconfirm>
        }
        <Modal
          visible={visible}
          title="结算"
          onCancel={this.hideModal}
          footer={footer}
          width="720px"
        >
          <p className="font-size-14 ml45 mb20">
            应付金额:
            <a className="font-size-16 ml10" href="javascript:;">
              {Number(detail.total_fee).toFixed(2)}元
            </a>
          </p>
          {payMethodShow}
          <Row>
            <Col span={24} className="center mt8">
              <Button
                type="dashed"
                className="ml3 font-size-13"
                style={{ width: '86%', color: '#333', marginLeft: '-1%' }}
                onClick={this.handlePayMethodAdd}
              >
                <Icon type="plus" /> 添加支付方式
              </Button>
            </Col>
          </Row>
          <p className="font-size-14 ml45 mt10 mb5">
            <label className="label">挂账金额</label>
            <a className="font-size-16 ml10" href="javascript:;">{debts}元</a>
          </p>
        </Modal>
      </div>
    );
  }
}
