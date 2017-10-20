import React, { Component } from 'react';
import { message, Form, Input, Button, Select, DatePicker, Row, Col, Switch } from 'antd';
import className from 'classnames';

import InsuranceSelector from './InsuranceSelector';

import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';
import text from '../../../config/text';
import api from '../../../middleware/api';

import NumberInput from '../../../components/widget/NumberInput';

const FormItem = Form.Item;
const Option = Select.Option;

class InfoInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      isEdit: true,
      customerName: '',
      companyRebate: '',
      insuranceCompanies: [],
      startDate: '',
      endDate: '',
      depositDisabled: false,
      ciContent: '',
      insuranceInfo: {},
    };
    [
      'handleSubmit',
      'saveInsurance',
      'handleInsuranceDate',
      'handleCompanyChange',
      'handleIsEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { customerId, autoDealId, autoId } = this.props;
    this.getInsuranceDetail(customerId, autoDealId);
    this.getCustomerDetail(customerId);
    this.getInsuranceCompanies();
    this.handleInsuranceDate();
    if (!!autoId || !!autoDealId) {
      this.setState({ isEdit: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    const deliverDate = nextProps.deliverDate;
    if (deliverDate) {
      this.handleInsuranceDate(new Date(deliverDate));
      this.setState({ depositDisabled: parseInt(nextProps.payType) === 0 });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { isNew } = this.state;
    const { autoDealId, customerId } = this.props;
    if (!autoDealId) {
      message.error('请先填写交易信息并保存');
      return false;
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      const { usage_tax, traffic_insurance, ci_total } = values;
      values.force_start_date = formatter.date(values.force_start_date);
      values.force_end_date = formatter.date(values.force_end_date);
      values.sign_date = formatter.date(values.sign_date);
      values.total = parseFloat(usage_tax) + parseFloat(traffic_insurance) + parseFloat(ci_total);
      values.is_deposit_ic = values.is_deposit_ic ? 1 : 0;

      api.ajax({
        url: isNew ? api.presales.deal.addInsurance() : api.presales.deal.editInsurance(),
        type: 'POST',
        data: values,
      }, data => {
        message.success(this.state.isNew ? '保险信息添加成功' : '保险信息修改成功');
        this.setState({
          isNew: false,
          insurance_log_id: data.res.insurance_log_id,
        });
        this.getInsuranceDetail(customerId, autoDealId);
        this.handleIsEdit();
      });
    });
  }

  handleInsuranceDate(start) {
    start = formatter.getMomentDate(start);
    const end = formatter.getMomentDate(new Date(start.year() + 1, start.month(), start.date() - 1));
    this.setState({ startDate: start, endDate: end });
  }

  handleCompanyChange(name) {
    this.props.form.setFieldsValue({ ci_insurance_company: name });
  }

  handleIsEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  saveInsurance(insurances) {
    this.setState({ ciContent: insurances });
  }

  getInsuranceDetail(customerId, autoDealId) {
    api.ajax({ url: api.presales.deal.getInsuranceLogDetail(customerId, autoDealId) }, data => {
      this.setState({
        insuranceInfo: data.res.detail || {},
        isNew: !data.res.detail,
        isEdit: !data.res.detail,
      });
    }, () => {
      this.setState({
        isNew: true,
        isEdit: true,
      });
    });
  }

  getCustomerDetail(customerId) {
    api.ajax({ url: api.customer.detail(customerId) }, data => {
      this.setState({ customerName: data.res.customer_info.name });
    });
  }

  getInsuranceCompanies() {
    api.ajax({ url: api.presales.deal.getInsuranceCompanies() }, data => {
      this.setState({ insuranceCompanies: data.res.company_list });
    });
  }

  render() {
    const { selectStyle, formItemLayout_1014, formItem9_15, formItemLayout_1113 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const {
      startDate,
      endDate,
      depositDisabled,
      insuranceInfo,
      isEdit,
      ciContent,
    } = this.state;
    const { autoDealId, autoId, customerId } = this.props;

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
          {getFieldDecorator('_id', { initialValue: insuranceInfo._id })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('customer_id', { initialValue: customerId })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('seller_user_id', { initialValue: this.props.seller_user_id })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('auto_id', { initialValue: autoId })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('auto_deal_id', { initialValue: autoDealId })(
            <Input type="hidden" />,
          )}


          <Row>
            <Col span={6}>
              <FormItem label="被保人" {...formItem9_15} required>
                {getFieldDecorator('insured_person', {
                  initialValue: insuranceInfo.insured_person,
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入被保人" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="保险公司" {...formItemLayout_1113} required>
                {getFieldDecorator('force_company', {
                  initialValue: insuranceInfo.insurance_company,
                  rules: FormValidator.getRuleNotNull(),
                })(
                  <Select
                    onSelect={this.handleCompanyChange}
                    {...selectStyle}
                    placeholder="请选择保险公司"
                  >
                    {this.state.insuranceCompanies.map(company =>
                      <Option key={company.name}>{company.name}</Option>,
                    )}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="交强险单号" {...formItemLayout_1014} required>
                {getFieldDecorator('force_num', {
                  initialValue: insuranceInfo.insurance_num,
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入交强险单号" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <NumberInput
                label="车船税"
                defaultValue={(insuranceInfo.usage_tax &&
                  Number(insuranceInfo.usage_tax).toFixed(2)) || ''}
                id="usage_tax"
                self={this}
                layout={formItem9_15}
                placeholder="请输入车船税"
                rules={FormValidator.getnotNullGreateZero()}
              />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <NumberInput
                label="交强险"
                defaultValue={(insuranceInfo.traffic_insurance &&
                  Number(insuranceInfo.traffic_insurance).toFixed(2)) || ''}
                id="traffic_insurance"
                self={this}
                layout={formItem9_15}
                placeholder="请输入交强险"
                rules={FormValidator.getnotNullGreateZero()}
              />
            </Col>
            <Col span={6}>
              <FormItem label="商业保险公司" {...formItemLayout_1113}>
                {getFieldDecorator('business_company', {
                  initialValue: insuranceInfo.ci_insurance_company,
                })(
                  <Select{...selectStyle} placeholder="请选择保险公司">
                    {this.state.insuranceCompanies.map(company =>
                      <Option key={company.name}>{company.name}</Option>,
                    )}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="商业险单号" {...formItemLayout_1014}>
                {getFieldDecorator('business_num', {
                  initialValue: insuranceInfo.ci_insurance_num,
                })(
                  <Input placeholder="请输入商业险单号" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <NumberInput
                label="商业险总额"
                defaultValue={(insuranceInfo.ci_total &&
                  Number(insuranceInfo.ci_total).toFixed(2)) || ''}
                id="ci_total"
                self={this}
                layout={formItem9_15}
                placeholder="请输入商业险总额"
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="商业险让利" {...formItem9_15}>
                {getFieldDecorator('ci_discount', {
                  initialValue: insuranceInfo.ci_discount,
                })(
                  <Input placeholder="请输入商业险让利" />,
                )}
              </FormItem>
            </Col>
            <Col span={18}>
              <Col span={3}>
                <span style={{ position: 'absolute', right: '-7px', top: '5px', zIndex: '9998' }}>
                  <InsuranceSelector save={this.saveInsurance} /> :
                </span>
              </Col>

              <Col span={16} style={{ marginLeft: '17px' }}>
                <FormItem wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('ci_content', {
                    initialValue: ciContent || insuranceInfo.ci_discount,
                  })(
                    <Input rows="1" type="textarea" disabled placeholder="请选择商业险类型" />,
                  )}
                </FormItem>
              </Col>

            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <NumberInput
                label="保险押金"
                defaultValue={(insuranceInfo.deposit && Number(insuranceInfo.deposit).toFixed(2)) ||
                ''}
                id="deposit"
                self={this}
                layout={formItem9_15}
                placeholder="请输入保险押金"
                disabled={depositDisabled}
              />
            </Col>
            <Col span={6}>
              <FormItem label="押金给保险公司" {...formItemLayout_1113}>
                {getFieldDecorator('is_deposit_ic', {
                  valuePropName: 'checked',
                  initialValue: Number(insuranceInfo.is_deposit_ic) === 1,
                })(
                  <Switch checkedChildren={'是'} unCheckedChildren={'否'}
                          disabled={depositDisabled} />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="投保日期" {...formItemLayout_1014}>
                {getFieldDecorator('force_start_date', {
                  initialValue: formatter.getMomentDate(insuranceInfo.start_date) ||
                  formatter.getMomentDate(startDate),
                })(
                  <DatePicker onChange={this.handleInsuranceDate} placeholder="起始日期"
                              allowClear={false} />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="到期日期" {...formItem9_15}>
                {getFieldDecorator('force_end_date', {
                  initialValue: formatter.getMomentDate(insuranceInfo.end_date) ||
                  formatter.getMomentDate(endDate),
                })(
                  <DatePicker placeholder="终止日期" allowClear={false} />,
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
              <FormItem label="被保人" {...formItem9_15}>
                <span>{insuranceInfo.insured_person}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="保险公司" {...formItemLayout_1113} required>
                <span>{insuranceInfo.force_company}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="交强险单号" {...formItem9_15} required>
                <span>{insuranceInfo.force_num}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车船税" {...formItem9_15} required>
                <span>{(insuranceInfo.usage_tax && Number(insuranceInfo.usage_tax).toFixed(2)) ||
                ''}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="交强险" {...formItem9_15} required>
                <span>{(insuranceInfo.traffic_insurance &&
                  Number(insuranceInfo.traffic_insurance).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="商业保险公司" {...formItemLayout_1113}>
                <span>{insuranceInfo.business_company}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="商业险单号" {...formItem9_15}>
                <span>{insuranceInfo.business_num}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="商业险总额" {...formItem9_15}>
                <span>{(insuranceInfo.ci_total && Number(insuranceInfo.ci_total).toFixed(2)) ||
                ''}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="商业险让利" {...formItem9_15}>
                <span>{insuranceInfo.ci_discount}</span>
              </FormItem>
            </Col>
            <Col span={6}>

              <FormItem label="商业险类型" {...formItemLayout_1113}>
                <span>{insuranceInfo.ci_content}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="保险押金" {...formItem9_15}>
                <span>{(insuranceInfo.deposit && Number(insuranceInfo.deposit).toFixed(2)) ||
                ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="押金给保险公司" {...formItemLayout_1113}>
                <span>{text.isOrNot[insuranceInfo.is_deposit_ic]}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="投保日期" {...formItem9_15}>
                <span>{insuranceInfo.start_date}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="到期日期" {...formItem9_15}>
                <span>{insuranceInfo.end_date}</span>
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

InfoInsurance = Form.create()(InfoInsurance);
export default InfoInsurance;
