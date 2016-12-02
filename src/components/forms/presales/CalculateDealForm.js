import React from 'react'
import {message, Form, Input, Select, Button, Row, Col, Collapse} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'

class CalculateDealForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noLoan: false,
      noInsurance: false,
      noDecoration: false,
      insuranceCompanies: [],
      sell_price: 0,
      buy_price: 0,
      trade_in_price: 0,
      license_tax_in: 0,
      license_tax_out: 0,
      material_fee: 0,
      guarantee_fee_in: 0,
      notary_fee_in: 0,
      bank_deposit_in: 0,
      guarantee_fee_out: 0,
      notary_fee_out: 0,
      bank_deposit_out: 0,
      insurance_company: '',
      rebate_coefficient: 0,
      ci_total: 0,
      ci_discount: 0,
      ci_rebate: 0,
      force_rebate: 0,
      decoration_price: 0,
      decoration_cost: 0,
      gift_cost: 0
    };
    [
      'handleSubmit',
      'handleRebateCoefficient'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getInsuranceCompanies();
    this.getCustomerAutoPurchaseDetail(this.props.userAutoId);
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();

    api.ajax({
      url: api.editPurchaseIncome(this.props.userAutoId),
      type: 'POST',
      data: formData
    }, function (data) {
      message.success('销售收益更新成功');
      this.props.cancelModal();
      location.hash = api.getHash();
    }.bind(this));
  }

  setFieldValue(field, e) {
    console.log(field, e.target.value);
    this.setState({[field]: e.target.value});
  }

  handleRebateCoefficient(companyName) {
    let {insuranceCompanies, ci_total} = this.state;
    for (let company of insuranceCompanies) {
      if (company.name === companyName) {
        this.setState({
          rebate_coefficient: company.rebate_coefficient,
          ci_rebate: ci_total * Number(company.rebate_coefficient) / 100
        });
        break;
      }
    }
  }

  getCustomerAutoPurchaseDetail(userAutoId) {
    api.ajax({url: api.getAutoPurchaseDetail(userAutoId)}, function (data) {
      let res = data.res, rebate_coefficient = 0;
      if (res.insurance_log_info) {
        let {insuranceCompanies} = this.state;
        for (let company of insuranceCompanies) {
          if (company.name === res.insurance_log_info.insurance_company) {
            rebate_coefficient = company.rebate_coefficient;
            break;
          }
        }
      }

      if (res.auto_deal_info) {
        this.setState({
          sell_price: res.auto_deal_info.sell_price,
          buy_price: res.auto_deal_info.buy_price,
          trade_in_price: res.auto_deal_info.trade_in_price,
          license_tax_in: res.auto_deal_info.license_tax_in,
          license_tax_out: res.auto_deal_info.license_tax_out
        });
      }

      if (res.loan_log_info) {
        this.setState({
          material_fee: res.loan_log_info.material_fee,
          guarantee_fee_in: res.loan_log_info.guarantee_fee_in,
          notary_fee_in: res.loan_log_info.notary_fee_in,
          bank_deposit_in: res.loan_log_info.bank_deposit_in,
          guarantee_fee_out: res.loan_log_info.guarantee_fee_out,
          notary_fee_out: res.loan_log_info.notary_fee_out,
          bank_deposit_out: res.loan_log_info.bank_deposit_out
        });
      } else {
        this.setState({noLoan: true});
      }

      if (res.insurance_log_info) {
        this.setState({
          insurance_company: res.insurance_log_info.insurance_company,
          rebate_coefficient: rebate_coefficient,
          ci_total: res.insurance_log_info.ci_total,
          ci_discount: res.insurance_log_info.ci_discount,
          force_rebate: res.insurance_log_info.force_rebate
        });
      } else {
        this.setState({noInsurance: true});
      }

      if (res.decoration_log_info) {
        this.setState({
          decoration_price: res.decoration_log_info.price,
          decoration_cost: res.decoration_log_info.cost
        });
      } else {
        this.setState({noDecoration: true});
      }
    }.bind(this))
  }

  getInsuranceCompanies() {
    api.ajax({url: api.getInsuranceCompanies()}, function (data) {
      this.setState({insuranceCompanies: data.res.company_list});
    }.bind(this))
  }

  render() {
    const FormItem = Form.Item;
    const Panel = Collapse.Panel;
    const {formItemLayout, formItemLeft, formItemRight, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;

    let {
      noLoan,
      noInsurance,
      noDecoration,
      insuranceCompanies,
      sell_price,
      buy_price,
      trade_in_price,
      license_tax_in,
      license_tax_out,
      material_fee,
      guarantee_fee_in,
      notary_fee_in,
      bank_deposit_in,
      guarantee_fee_out,
      notary_fee_out,
      bank_deposit_out,
      insurance_company,
      rebate_coefficient,
      ci_total,
      ci_rebate,
      ci_discount,
      force_rebate,
      decoration_price,
      decoration_cost,
      gift_cost
    } = this.state;

    let autoDealAmount = Number(sell_price) + Number(trade_in_price) - Number(buy_price),
      licenceAmount = Number(license_tax_in) - Number(license_tax_out),
      loanAmount = Number(material_fee)
        + Number(guarantee_fee_in)
        - Number(guarantee_fee_out)
        + Number(notary_fee_in)
        - Number(notary_fee_out)
        + Number(bank_deposit_in)
        - Number(bank_deposit_out),
      insuranceAmount = (Number(ci_total) - Number(ci_discount)) * Number(rebate_coefficient) / 100 + Number(force_rebate),
      decorationAmount = Number(decoration_price) - Number(decoration_cost) - Number(gift_cost);

    let totalAmount = autoDealAmount + licenceAmount + loanAmount + insuranceAmount + decorationAmount;
    return (
      <Form horizontal >
        <Collapse defaultActiveKey={['1']}>
          <Panel
            header={<div><span>裸车销售收入</span><span className="pull-right mr32">{autoDealAmount}元</span></div>}
            key="1">
            <FormItem label="裸车价" {...formItemLayout}>
              <Input
                {...getFieldProps('auto_sell_price', {
                  initialValue: sell_price,
                  onChange: this.setFieldValue.bind(this, 'sell_price')
                })}
                placeholder="请输入裸车价"/>
            </FormItem>
            <FormItem label="二手车置换价" {...formItemLayout}>
              <Input
                {...getFieldProps('trade_in_price', {
                  initialValue: trade_in_price,
                  onChange: this.setFieldValue.bind(this, 'trade_in_price')
                })}
                placeholder="请输入二手车置换差价"/>
            </FormItem>
            <FormItem label="进价" className="text-red" {...formItemLayout}>
              <Input
                {...getFieldProps('auto_buy_price', {
                  initialValue: buy_price,
                  onChange: this.setFieldValue.bind(this, 'buy_price')
                })}
                placeholder="请输入4S报价"/>
            </FormItem>
          </Panel>

          <Panel
            header={<div><span>上牌收入</span> <span className="pull-right mr32">{licenceAmount}元</span></div>}
            key="2">
            <FormItem label="代理上牌费" {...formItemLayout}>
              <Input
                {...getFieldProps('license_tax_in', {
                  initialValue: license_tax_in,
                  onChange: this.setFieldValue.bind(this, 'license_tax_in')
                })}
                placeholder="请输入用户实付上牌费"/>
            </FormItem>
            <FormItem label="官方上牌费" className="text-red" {...formItemLayout}>
              <Input
                {...getFieldProps('license_tax_out', {
                  initialValue: license_tax_out || 150,
                  onChange: this.setFieldValue.bind(this, 'license_tax_out')
                })}
                placeholder="请输入车管所上牌费"/>
            </FormItem>
          </Panel>

          <Panel
            header={<div><span>按揭收入</span> <span
              className="pull-right mr32">{noLoan ? '无按揭信息' : `${loanAmount}元`}</span></div>}
            key="3">
            {
              noLoan ? '' :
                <div>
                  <Row className="mb10">
                    <Col span="13">
                      <FormItem label="按揭资料费" {...formItemLeft}>
                        <Input
                          {...getFieldProps('material_fee', {
                            initialValue: material_fee,
                            onChange: this.setFieldValue.bind(this, 'material_fee')
                          })}
                          placeholder="请输入按揭资料费"/>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="按揭担保费" {...formItemRight}>
                        <Input
                          {...getFieldProps('guarantee_fee_in', {
                            initialValue: guarantee_fee_in,
                            onChange: this.setFieldValue.bind(this, 'guarantee_fee_in')
                          })}
                          placeholder="请输入按揭担保费"/>
                      </FormItem>
                    </Col>
                  </Row>

                  <Row className="mb10">
                    <Col span="13">
                      <FormItem label="公证费" {...formItemLeft}>
                        <Input
                          {...getFieldProps('notary_fee_in', {
                            initialValue: notary_fee_in,
                            onChange: this.setFieldValue.bind(this, 'notary_fee_in')
                          })}
                          placeholder="请输入公证费"/>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="银行保证金" {...formItemRight}>
                        <Input
                          {...getFieldProps('bank_deposit_in', {
                            initialValue: bank_deposit_in,
                            onChange: this.setFieldValue.bind(this, 'bank_deposit_in')
                          })}
                          placeholder="请输入银行保证金"/>
                      </FormItem>
                    </Col>
                  </Row>

                  <Row className="mb10">
                    <Col span="13">
                      <FormItem label="担保公司担保费支出" className="text-red" {...formItemLeft}>
                        <Input
                          {...getFieldProps('guarantee_fee_out', {
                            initialValue: guarantee_fee_out,
                            onChange: this.setFieldValue.bind(this, 'guarantee_fee_out')
                          })}
                          placeholder="请输入担保公司担保费支出"/>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="公证费支出" className="text-red" {...formItemRight}>
                        <Input
                          {...getFieldProps('notary_fee_out', {
                            initialValue: notary_fee_out,
                            onChange: this.setFieldValue.bind(this, 'notary_fee_out')
                          })}
                          placeholder="请输入公证费支出"/>
                      </FormItem>
                    </Col>
                  </Row>

                  <Row>
                    <Col span="13">
                      <FormItem label="银行保证金支出" className="text-red" {...formItemLeft}>
                        <Input
                          {...getFieldProps('bank_deposit_out', {
                            initialValue: bank_deposit_out,
                            onChange: this.setFieldValue.bind(this, 'bank_deposit_out')
                          })}
                          placeholder="请输入银行保证金支出"/>
                      </FormItem>
                    </Col>
                  </Row>
                </div>
            }
          </Panel>

          <Panel
            header={<div><span>商业险收入</span> <span
              className="pull-right mr32">{noInsurance ? '无保险信息' : `${insuranceAmount}元`}</span></div>}
            key="4">
            {
              noInsurance ? '' :
                <div>
                  <Row className="mb10">
                    <Col span="13">
                      <FormItem label="保险公司" {...formItemLeft}>
                        <Select
                          onSelect={this.handleRebateCoefficient}
                          {...getFieldProps('insurance_company', {initialValue: insurance_company})}
                          {...selectStyle}
                          placeholder="请选择保险公司">
                          {insuranceCompanies.map(company => <Option key={company.name}>{company.name}</Option>)}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="返利系数" {...formItemRight}>
                        <Input
                          {...getFieldProps('rebate_coefficient', {initialValue: rebate_coefficient})}
                          placeholder="请输入返利系数"
                        />
                      </FormItem>
                    </Col>
                  </Row>

                  <Row className="mb10">
                    <Col span="13">
                      <FormItem label="商业保险额" {...formItemLeft}>
                        <Input
                          {...getFieldProps('ci_total', {
                            initialValue: ci_total,
                            onChange: this.setFieldValue.bind(this, 'ci_total')
                          })}
                          placeholder="请输入商业保险额"/>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="商业险让利" {...formItemRight}>
                        <Input
                          {...getFieldProps('ci_discount', {
                            initialValue: ci_discount,
                            onChange: this.setFieldValue.bind(this, 'ci_discount')
                          })}
                          placeholder="请输入银行保证金"/>
                      </FormItem>
                    </Col>
                  </Row>

                  <Row>
                    <Col span="13">
                      <FormItem label="商业险返利" {...formItemLeft}>
                        <Input
                          {...getFieldProps('ci_rebate', {
                            initialValue: ci_rebate || Number(ci_total) * Number(rebate_coefficient) / 100,
                            onChange: this.setFieldValue.bind(this, 'ci_rebate')
                          })}
                          placeholder="请输入商业险返利"/>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="交强险返利" {...formItemRight}>
                        <Input
                          {...getFieldProps('force_rebate', {
                            initialValue: force_rebate,
                            onChange: this.setFieldValue.bind(this, 'force_rebate')
                          })}
                          placeholder="请输入银行保证金"/>
                      </FormItem>
                    </Col>
                  </Row>
                </div>
            }
          </Panel>

          <Panel
            header={<div><span>加装收入</span> <span
              className="pull-right mr32">{noDecoration ? '无装潢信息' : `${decorationAmount}元`}</span></div>}
            key="5">
            {
              noDecoration ? '' :
                <div>
                  <FormItem label="装潢金额" {...formItemLayout}>
                    <Input
                      {...getFieldProps('decoration_price', {
                        initialValue: decoration_price,
                        onChange: this.setFieldValue.bind(this, 'decoration_price')
                      })}
                      placeholder="请输入用户实付装潢金额"/>
                  </FormItem>

                  <Row className="mb10">
                    <Col span="13">
                      <FormItem label="装潢费用" className="text-red" {...formItemLeft}>
                        <Input
                          {...getFieldProps('decoration_cost', {
                            initialValue: decoration_cost,
                            onChange: this.setFieldValue.bind(this, 'decoration_cost')
                          })}
                          placeholder="请输入装潢费用"/>
                      </FormItem>
                    </Col>
                    <Col span="11">
                      <FormItem label="赠品成本" className="text-red" {...formItemRight}>
                        <Input
                          {...getFieldProps('gift_cost', {
                            initialValue: gift_cost,
                            onChange: this.setFieldValue.bind(this, 'gift_cost')
                          })}
                          placeholder="请输入赠品成本"/>
                      </FormItem>
                    </Col>
                  </Row>
                </div>
            }
          </Panel>

          <Panel header={<div><span>总收入</span> <span className="pull-right mr32">{totalAmount}元</span></div>} key="6">
            <span></span>
          </Panel>
        </Collapse>

        <Row type="flex" justify="center" className="mt30">
          <Col span="2">
            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

CalculateDealForm = Form.create()(CalculateDealForm);
export default CalculateDealForm
