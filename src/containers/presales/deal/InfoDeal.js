import React, { Component } from 'react';
import { message, Form, Input, Button, Radio, Select, DatePicker, Row, Col } from 'antd';
import className from 'classnames';

import NumberInput from '../../../components/widget/NumberInput';

import Layout from '../../../utils/FormLayout';
import text from '../../../config/text';
import formatter from '../../../utils/DateFormatter';

import api from '../../../middleware/api';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewPurchaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !props.autoDealId,
      isEdit: true,
      dealInfo: props.dealInfo,
      users: [],
    };
    [
      'handleIsEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { autoDealId, customerId, autoId } = this.props;
    this.getPurchaseUsers(0);
    if (!!autoDealId) {
      this.getAutoPurchaseByDealId(customerId, autoDealId);
    }
    if (!!autoId || !!autoDealId) {
      this.setState({ isEdit: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.dealInfo) !== '{}' && !!nextProps.dealInfo) {
      this.setState({
        isNew: false,
        dealInfo: nextProps.dealInfo,
      });
    }
  }

  handleIsEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { customerId, intentionId, autoId } = this.props;
    const { isNew } = this.state;
    const formData = this.props.form.getFieldsValue();

    formData.deliver_date = formatter.day(formData.deliver_date);
    formData.deal_date = formatter.day(formData.deal_date);

    api.ajax({
      url: isNew ? api.presales.deal.addAuto() : api.presales.deal.editAuto(),
      type: 'POST',
      data: formData,
    }, data => {
      const autoDealId = data.res.auto_deal_id;
      this.setState({ isNew: false });
      this.props.onSuccess(autoDealId, 'autoDealId');
      this.handleIsEdit();
      this.getAutoPurchaseByDealId(customerId, autoDealId);
      message.success(isNew ? '交易信息添加成功' : '交易信息修改成功');

      autoId ?
        location.href = `/presales/deal/detail/${autoDealId}/${customerId}/${autoId}/${intentionId}` :
        location.href = `/presales/deal/detail/${autoDealId}/${customerId}/${intentionId}`;
    });
  }

  getAutoPurchaseByDealId(customerId, autoDealId) {
    if (customerId && autoDealId) {
      api.ajax({ url: api.presales.autoDealInfo(customerId, autoDealId) }, data => {
        const dealInfo = data.res.detail;
        this.props.onSuccess(dealInfo, 'dealInfo');
        this.setState({ dealInfo: dealInfo || {} });
      });
    }
  }

  getPurchaseUsers(isLeader) {
    api.ajax({ url: api.user.getPurchaseUsers(isLeader) }, data => {
      this.setState({ users: data.res.user_list });
    });
  }

  render() {
    const { selectStyle, formItem9_15 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { isEdit, dealInfo, users } = this.state;
    const { customerId, intentionId } = this.props;

    const show = className({
      '': !isEdit,
      hide: isEdit,
    });

    const inputShow = className({
      hide: !isEdit,
      '': isEdit,
    });

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('_id', { initialValue: dealInfo._id })(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('customer_id', { initialValue: customerId })(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('intention_id', { initialValue: intentionId })(
            <Input type="hidden"/>
          )}

          <Row>
            <Col span={6}>
              <FormItem label="销售负责人" {...formItem9_15}>
                {getFieldDecorator('seller_user_id', { initialValue: dealInfo.seller_user_id })(
                  <Select {...selectStyle} placeholder="请选择销售负责人">
                    {users.map(user => <Option key={user._id}>{user.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="交易类型" {...formItem9_15}>
                {getFieldDecorator('car_type', { initialValue: dealInfo.car_type })(
                  <RadioGroup>
                    <Radio value="0">现车</Radio>
                    <Radio value="1">订车</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="付款方式" {...formItem9_15}>
                {getFieldDecorator('pay_type', { initialValue: dealInfo.pay_type })(
                  <RadioGroup>
                    <Radio value="0">全款</Radio>
                    <Radio value="1">按揭</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="成交时间" {...formItem9_15}>
                {getFieldDecorator('deal_date', { initialValue: formatter.getMomentDate(dealInfo.deal_date) })(
                  <DatePicker placeholder="请选择成交时间" allowClear={false}/>
                )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label="交车时间" {...formItem9_15}>
                {getFieldDecorator('deliver_date', { initialValue: formatter.getMomentDate(dealInfo.deliver_date) })(
                  <DatePicker placeholder="请选择交车时间" allowClear={false}/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <NumberInput
                label="车辆售价"
                defaultValue={(dealInfo.sell_price && Number(dealInfo.sell_price).toFixed(2)) || ''}
                id="sell_price"
                self={this}
                layout={formItem9_15}
                placeholder="请输入车辆售价"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="置换旧车价"
                defaultValue={(dealInfo.trade_in_price && Number(dealInfo.trade_in_price).toFixed(2)) || ''}
                id="trade_in_price"
                self={this}
                layout={formItem9_15}
                placeholder="请输入置换旧车价"
              />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <NumberInput
                label="订金"
                defaultValue={(dealInfo.deposit && Number(dealInfo.deposit).toFixed(2)) || ''}
                id="deposit"
                self={this}
                layout={formItem9_15}
                placeholder="请输入订金"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="上牌费"
                defaultValue={(dealInfo.license_tax_in && Number(dealInfo.license_tax_in).toFixed(2)) || ''}
                id="license_tax_in"
                self={this}
                layout={formItem9_15}
                placeholder="请输入上牌费"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="购置税"
                defaultValue={(dealInfo.purchase_tax && Number(dealInfo.purchase_tax).toFixed(2)) || ''}
                id="purchase_tax"
                self={this}
                layout={formItem9_15}
                placeholder="请输入购置税"
              />
            </Col>
            <Col span={6}>
              <FormItem label="赠品内容" {...formItem9_15}>
                {getFieldDecorator('gift', { initialValue: dealInfo.gift })(
                  <Input placeholder="请输入赠品内容"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="备注" {...formItem9_15}>
                {getFieldDecorator('remark', { initialValue: dealInfo.remark })(
                  <Input type="textarea" placeholder="请输入备注"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={18}>
              <Col span={24} offset={2}>
                <div className="pull-left">
                  <Button type="dash" onClick={this.handleIsEdit}>取消</Button>
                  <span className="ml10">
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
                </span>
                </div>
              </Col>
            </Col>
          </Row>

        </Form>

        <Form className={show}>
          <Row>
            <Col span={6}>
              <FormItem label="销售负责人" {...formItem9_15}>
                <span className="ant-form-text">{dealInfo.seller_user_name}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="交易类型" {...formItem9_15}>
                <span>{text.carType[dealInfo.car_type]}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="付款方式" {...formItem9_15}>
                <span>{text.autoPayType[dealInfo.pay_type]}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="成交时间" {...formItem9_15}>
                <span>{dealInfo.deal_date}</span>
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label="交车时间" {...formItem9_15}>
                <span>{dealInfo.deliver_date}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车辆售价" {...formItem9_15}>
                <span>{(dealInfo.sell_price && Number(dealInfo.sell_price).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="置换旧车价" {...formItem9_15}>
                <span>{(dealInfo.trade_in_price && Number(dealInfo.trade_in_price).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="订金" {...formItem9_15}>
                <span>{(dealInfo.deposit && Number(dealInfo.deposit).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="上牌费" {...formItem9_15}>
                <span>{(dealInfo.license_tax_in && Number(dealInfo.license_tax_in).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="购置税" {...formItem9_15}>
                <span>{(dealInfo.purchase_tax && Number(dealInfo.purchase_tax).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="赠品内容" {...formItem9_15}>
                <span>{dealInfo.gift}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="备注" {...formItem9_15}>
                <span>{dealInfo.remark}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Col span={24} offset={2}>
                <div className="pull-left">
                  <Button type="dash" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

NewPurchaseForm = Form.create()(NewPurchaseForm);
export default NewPurchaseForm;
