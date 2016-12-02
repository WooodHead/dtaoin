import React from 'react'
import {Row, Col, message, Icon, Input, Form, Select, Checkbox, DatePicker, Button} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import ShowParts from '../../popover/ShowParts'

const FormItem = Form.Item;
const Option = Select.Option;

class PayWareConfirmForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirst: true,
      checkAll: false,
      check: {},
      data: [],
      payObj: {},
      amount: 0,
      checkedSet: new Set()
    };
    [
      'handlePrevStep',
      'handleSubmit',
      'handlePartChecked',
      'handleCheckAll'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    let data = nextProps.data;
    if (data) {
      if (data.length > 0 && this.state.isFirst) {
        let check = {};
        data.map(item => {
          check[item.part_id] = false;
        });

        this.setState({
          isFirst: false,
          check: check,
          data: data,
          payObj: nextProps.payObj
        });
      }
    }
  }

  handlePrevStep() {
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      payWareForm: '',
      payWareConfirmForm: 'hide'
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let {payObj, checkedSet, amount} = this.state;
    let formData = this.props.form.getFieldsValue();
    formData.supplier_id = payObj.supplier_id;
    formData.pay_total = amount;
    formData.godown_entry_ids = Array.from(checkedSet).toString();

    api.ajax({
      url: api.maintPayWare(),
      type: 'POST',
      data: formData
    }, function (data) {
      message.success('结算成功!');
      this.props.cancelModal();
      location.reload();
    }.bind(this));
  }

  handlePartChecked(e) {
    let {check, checkAll, data, checkedSet, amount} = this.state;
    let partId = e.target.value;

    if (e.target.checked) {
      data.map(item => {
        if (item.part_id == partId) {
          item.list.map(subItem => checkedSet.add(subItem._id));
          amount += Number(item.cash);
        }
      });
      check[partId] = true;
    } else {
      data.map(item => {
        if (item.part_id == partId) {
          item.list.map(subItem => checkedSet.delete(subItem._id));
          amount -= Number(item.cash);
        }
      });
      check[partId] = false;
      checkAll = false;
    }
    this.setState({
      check: check,
      checkAll: checkAll,
      checkedSet: checkedSet,
      amount: amount
    });
  }

  handleCheckAll(e) {
    let {check, checkAll, data} = this.state;
    let checkedSet = new Set(),
      amount = 0;

    if (e.target.checked) {
      data.map(item => {
        item.list.map(subItem => checkedSet.add(subItem._id));
        check[item.part_id] = true;
        amount += Number(item.cash);
      });
    } else {
      data.map(item => {
        check[item.part_id] = false;
      });
    }
    this.setState({
      amount: amount,
      check: check,
      checkAll: !checkAll,
      checkedSet: checkedSet
    });
  }

  render() {
    const {formItemLg, buttonLg} = Layout;
    const {getFieldProps} = this.props.form;
    const {check, checkAll, data, payObj, amount} = this.state;

    if (data.length === 0) {
      return (
        <div>
          <h2 className="margin-top-40 text-gray center">
            该公司配件费用已结清
            <small>
              <a href="javascript:;" onClick={this.handlePrevStep}>返回</a>
            </small>
          </h2>
        </div>
      )
    } else {
      return (
        <Form horizontal >
          <FormItem label="收款方" {...formItemLg}>
            <p className="ant-form-text">{payObj.supplier_company}</p>
          </FormItem>

          <FormItem label="起始时间" {...formItemLg}>
            <p className="ant-form-text">{payObj.start_time}</p>
          </FormItem>

          <FormItem label="截止时间" {...formItemLg}>
            <p className="ant-form-text">{payObj.end_time}</p>
          </FormItem>

          <Row type="flex" justify="start" className="mb15">
            <Col span="22" offset="2">
              {data.map((item, index) =>
                <Row key={index} className="mb10">
                  <Col span="6">
                    <Checkbox
                      key={index}
                      value={item.part_id}
                      checked={check[item.part_id]}
                      onChange={this.handlePartChecked}>
                      {item.part_name}
                    </Checkbox>
                  </Col>
                  <Col span="5">
                    进货批次：{item.count}
                  </Col>
                  <Col span="6">
                    进货数量：{item.amount}
                  </Col>
                  <Col span="5">
                    小计(元)：{item.cash}
                  </Col>
                  <Col span="2">
                    <ShowParts parts={item.list}/>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>

          <Row type="flex" className="mb15">
            <Col span="12" offset="2">
              <Checkbox checked={checkAll} onChange={this.handleCheckAll}> 全选</Checkbox>
            </Col>
          </Row>

          <FormItem label="付款金额" {...formItemLg}>
            <p className="ant-form-text">{amount}元</p>
          </FormItem>

          <FormItem label="付款方式" {...formItemLg}>
            <Select
              {...getFieldProps('pay_type', {initialValue: '2'})}
              size="large"
              style={{width: 230}}>
              <Option key="2">现金支付</Option>
              <Option key="5">银行转账</Option>
            </Select>
          </FormItem>

          <FormItem label="备注" {...formItemLg}>
            <Input type="textarea" {...getFieldProps('remark')}/>
          </FormItem>

          <FormItem {...buttonLg} className="mt15">
            <Button type="ghost" className="mr15" onClick={this.handlePrevStep}>上一步</Button>
            <Button type="primary" onClick={this.handleSubmit}>保存并提交</Button>
          </FormItem>
        </Form>
      )
    }
  }
}

PayWareConfirmForm = Form.create()(PayWareConfirmForm);
export default PayWareConfirmForm
