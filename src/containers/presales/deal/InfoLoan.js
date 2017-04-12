import React, {Component} from 'react';
import {message, Form, Input, Button, Radio, DatePicker, Row, Col} from 'antd';
import className from 'classnames';

import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';
import api from '../../../middleware/api';

import NumberInput from '../../../components/widget/NumberInput';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NewLoanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      isEdit: true,
      mortgageInfo: {},
    };
    [
      'handleIsEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {customerId, autoDealId, autoId} = this.props;
    this.getMortgageInfo(customerId, autoDealId);
    if (!!autoId || !!autoDealId) {
      this.setState({isEdit: false});
    }
  }


  handleIsEdit() {
    let {isEdit} = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let {isNew} = this.state;
    let {autoDealId, customerId} = this.props;

    if (!autoDealId) {
      message.error('请先填写交易信息并保存');
      return false;
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      values.sign_date = formatter.date(values.sign_date);

      api.ajax({
        url: isNew ? api.presales.deal.addLoan() : api.presales.deal.editLoan(),
        type: 'POST',
        data: values,
      }, function (data) {
        message.success(this.state.isNew ? '按揭信息添加成功' : '按揭信息修改成功');
        this.getMortgageInfo(customerId, autoDealId);
        this.handleIsEdit();
        this.setState({
          isNew: false,
          loan_log_id: data.res.loan_log_id,
        });
      }.bind(this));
    });
  }

  getMortgageInfo(customerId, autoDealId) {
    api.ajax({url: api.presales.deal.getLoanDetail(customerId, autoDealId)}, data => {
      this.setState({
        mortgageInfo: data.res.detail || {},
        isNew: !(data.res.detail),
        isEdit: !(data.res.detail),
      });
    }, () => {
      this.setState({
        isNew: true,
        isEdit: true,
      });
    });
  }

  render() {
    const {formItemLayout} = Layout;
    const {getFieldDecorator} = this.props.form;
    let {isEdit, mortgageInfo} = this.state;
    let {customerId, autoId, autoDealId} = this.props;
    const show = className({
      '': !isEdit,
      'hide': isEdit,
    });

    const inputShow = className({
      'hide': !isEdit,
      '': isEdit,
    });

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('_id', {initialValue: mortgageInfo._id})(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('customer_id', {initialValue: customerId})(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('seller_user_id', {initialValue: this.props.seller_user_id})(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('auto_id', {initialValue: autoId})(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('auto_deal_id', {initialValue: autoDealId})(
            <Input type="hidden"/>
          )}
          <Row>
            <Col span={6}>
              <FormItem label="年限" {...formItemLayout}>
                {getFieldDecorator('loan_years', {initialValue: mortgageInfo.loan_years || '1'})(
                  <RadioGroup>
                    <Radio key="1" value="1">一年</Radio>
                    <Radio key="2" value="2">两年</Radio>
                    <Radio key="3" value="3">三年</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="按揭银行" {...formItemLayout}>
                {getFieldDecorator('bank', {
                  initialValue: mortgageInfo.bank,
                })(
                  <Input placeholder="请输入按揭银行"/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="担保公司" {...formItemLayout}>
                {getFieldDecorator('guarantee_company', {
                  initialValue: mortgageInfo.guarantee_company || '',
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入担保公司"/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="签单日期" {...formItemLayout}>
                {getFieldDecorator('sign_date', {initialValue: formatter.getMomentDate(mortgageInfo.sign_date) || formatter.getMomentDate()})(
                  <DatePicker placeholder="请选择签单日期" allowClear={false}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="担保人" {...formItemLayout}>
                {getFieldDecorator('guarantee_user', {initialValue: mortgageInfo.guarantee_user})(
                  <Input placeholder="请输入担保人"/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="担保人电话" {...formItemLayout}>
                {getFieldDecorator('guarantee_phone', {
                  rules: FormValidator.getRulePhoneOrTelNumber(),
                  validateTrigger: 'onBlur',
                  initialValue: mortgageInfo.guarantee_user,
                })(
                  <Input placeholder="担保人电话"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <NumberInput
                label="首付款"
                defaultValue={(mortgageInfo.pre_payment && Number(mortgageInfo.pre_payment).toFixed(2)) || ''}
                id="pre_payment"
                self={this}
                layout={formItemLayout}
                placeholder="请输入首付款"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="贷款金额"
                defaultValue={(mortgageInfo.bank_loan && Number(mortgageInfo.bank_loan).toFixed(2)) || ''}
                id="bank_loan"
                self={this}
                layout={formItemLayout}
                placeholder="请输入贷款金额"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="每月金额"
                defaultValue={(mortgageInfo.month_pay && Number(mortgageInfo.month_pay).toFixed(2)) || ''}
                id="month_pay"
                self={this}
                layout={formItemLayout}
                placeholder="请输入每月还款"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="资料费"
                defaultValue={(mortgageInfo.material_fee && Number(mortgageInfo.material_fee).toFixed(2)) || ''}
                id="material_fee"
                self={this}
                layout={formItemLayout}
                placeholder="请输入资料费"
              />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <NumberInput
                label="公证费"
                defaultValue={(mortgageInfo.notary_fee_in && Number(mortgageInfo.notary_fee_in).toFixed(2)) || ''}
                id="notary_fee_in"
                self={this}
                layout={formItemLayout}
                placeholder="请输入公证费"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="担保费"
                defaultValue={(mortgageInfo.guarantee_fee_in && Number(mortgageInfo.guarantee_fee_in).toFixed(2)) || ''}
                id="guarantee_fee_in"
                self={this}
                layout={formItemLayout}
                placeholder="请输入担保费"
              />
            </Col>
            <Col span={6}>
              <NumberInput
                label="银行保证金"
                defaultValue={(mortgageInfo.bank_deposit_in && Number(mortgageInfo.bank_deposit_in).toFixed(2)) || ''}
                id="bank_deposit_in"
                self={this}
                layout={formItemLayout}
                placeholder="请输入银行保证金"
              />
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
              <FormItem label="年限" {...formItemLayout}>
                <span>{mortgageInfo.loan_years || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="按揭银行" {...formItemLayout}>
                <span>{mortgageInfo.bank}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="担保公司" {...formItemLayout}>
                <span>{mortgageInfo.guarantee_company}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="签单日期" {...formItemLayout}>
                <span>{mortgageInfo.sign_date}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="担保人" {...formItemLayout}>
                <span>{mortgageInfo.guarantee_user}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="担保人电话" {...formItemLayout}>
                <span>{mortgageInfo.guarantee_phone}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="首付款" {...formItemLayout}>
                <span>{(mortgageInfo.pre_payment && Number(mortgageInfo.pre_payment).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="贷款金额" {...formItemLayout}>
                <span>{(mortgageInfo.bank_loan && Number(mortgageInfo.bank_loan).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="每月金额" {...formItemLayout}>
                <span>{(mortgageInfo.month_pay && Number(mortgageInfo.month_pay).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="资料费" {...formItemLayout}>
                <span>{(mortgageInfo.material_fee && Number(mortgageInfo.material_fee).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="公证费" {...formItemLayout}>
                <span>{(mortgageInfo.notary_fee_in && Number(mortgageInfo.notary_fee_in).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="担保费" {...formItemLayout}>
                <span>{(mortgageInfo.guarantee_fee_in && Number(mortgageInfo.guarantee_fee_in).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="银行保证金" {...formItemLayout}>
                <span>{(mortgageInfo.bank_deposit_in && Number(mortgageInfo.bank_deposit_in).toFixed(2)) || ''}</span>
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

NewLoanForm = Form.create()(NewLoanForm);
export default NewLoanForm;
