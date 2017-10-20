import React from 'react';
import { message, Row, Col, Button, Form, Input, Select } from 'antd';

import api from '../../../middleware/api';
import FormLayout from '../../../utils/FormLayout';
import NumberInput from '../../../components/widget/NumberInput';

const FormItem = Form.Item;
const Option = Select.Option;

class Clearing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || '',
      isFetching: false,
      noLoan: false,
      noInsurance: false,
      noDecoration: false,
      insuranceCompanies: [],
      pay_status: '0',
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
      gift_cost: 0,
      autoId: '',
      status: '',
    };

    [
      'handleClearing',
      'handleSubmit',
      'handleRebateCoefficient',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getDealDetail(this.state.id);
    this.getInsuranceCompanies();
  }

  handleClearing(e) {
    e.preventDefault();
    this.setState({ isFetching: true });
    api.ajax({ url: api.presales.checkPurchaseIncome(this.state.id) }, () => {
      message.success('结算成功');
      this.setState({ isFetching: false });
      setTimeout(() => {
        location.href = '/presales/deal/index';
      }, 1000);
    }, err => {
      message.error(`结算失败[${err}]`);
      this.setState({ isFetching: false });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = this.props.form.getFieldsValue();

    this.setState({ isFetching: true });
    api.ajax({
      url: api.presales.editPurchaseIncome(this.state.id),
      type: 'POST',
      data: formData,
    }, () => {
      message.success('销售收益更新成功');
      this.setState({ isFetching: false });

      setTimeout(() => {
        location.reload();
      }, 1000);
    }, err => {
      message.error(`销售收益更新失败[${err}]`);
      this.setState({ isFetching: false });
    });
  }

  setFieldValue(field, value) {
    this.setState({ [field]: value });
  }

  handleRebateCoefficient(companyName) {
    const { insuranceCompanies, ci_total } = this.state;
    for (const company of insuranceCompanies) {
      if (company.name === companyName) {
        this.setState({
          rebate_coefficient: company.rebate_coefficient,
          ci_rebate: ci_total * Number(company.rebate_coefficient) / 100,
        });
        break;
      }
    }
  }

  getDealDetail(id) {
    api.ajax({ url: api.presales.getAutoPurchaseDetail(id) }, data => {
      let res = data.res, rebate_coefficient = 0;
      if (res.insurance_log_info) {
        const { insuranceCompanies } = this.state;
        for (const company of insuranceCompanies) {
          if (company.name === res.insurance_log_info.insurance_company) {
            rebate_coefficient = company.rebate_coefficient;
            break;
          }
        }
      }

      const dealInfo = res.auto_deal_info;
      if (dealInfo) {
        this.setState({
          pay_status: dealInfo.pay_status,
          sell_price: dealInfo.sell_price,
          buy_price: dealInfo.buy_price,
          trade_in_price: dealInfo.trade_in_price,
          license_tax_in: dealInfo.license_tax_in,
          license_tax_out: dealInfo.license_tax_out,
          autoId: dealInfo.auto_id,
          status: dealInfo.status,
        });
      }

      const loanInfo = res.loan_log_info;
      if (loanInfo) {
        this.setState({
          material_fee: loanInfo.material_fee,
          guarantee_fee_in: loanInfo.guarantee_fee_in,
          notary_fee_in: loanInfo.notary_fee_in,
          bank_deposit_in: loanInfo.bank_deposit_in,
          guarantee_fee_out: loanInfo.guarantee_fee_out,
          notary_fee_out: loanInfo.notary_fee_out,
          bank_deposit_out: loanInfo.bank_deposit_out,
        });
      } else {
        this.setState({ noLoan: true });
      }

      const insuranceInfo = res.insurance_log_info;
      if (insuranceInfo) {
        this.setState({
          insurance_company: insuranceInfo.insurance_company,
          rebate_coefficient,
          ci_total: insuranceInfo.ci_total,
          ci_discount: insuranceInfo.ci_discount,
          force_rebate: insuranceInfo.force_rebate,
        });
      } else {
        this.setState({ noInsurance: true });
      }

      const decorationInfo = res.decoration_log_info;
      if (decorationInfo) {
        this.setState({
          decoration_price: decorationInfo.price,
          decoration_cost: decorationInfo.cost,
        });
      } else {
        this.setState({ noDecoration: true });
      }
    });
  }

  getInsuranceCompanies() {
    api.ajax({ url: api.presales.deal.getInsuranceCompanies() }, data => {
      this.setState({ insuranceCompanies: data.res.company_list });
    });
  }

  render() {
    const { formItemThree, selectStyle } = FormLayout;
    const { getFieldDecorator } = this.props.form;

    const {
      isFetching,
      noLoan,
      noInsurance,
      noDecoration,
      insuranceCompanies,
      pay_status,
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
      gift_cost,
      autoId,
      status,
    } = this.state;

    const isPayed = String(pay_status) === '1';
    const isSave = String(status) === '0';

    const autoDealAmount = Number(sell_price) + Number(trade_in_price) - Number(buy_price);
    const licenceAmount = Number(license_tax_in) - Number(license_tax_out);
    const loanAmount = Number(material_fee)
      + Number(guarantee_fee_in)
      - Number(guarantee_fee_out)
      + Number(notary_fee_in)
      - Number(notary_fee_out)
      + Number(bank_deposit_in)
      - Number(bank_deposit_out);
    const insuranceAmount = (Number(ci_total) - Number(ci_discount)) * Number(rebate_coefficient) / 100 + Number(force_rebate);
    const decorationAmount = Number(decoration_price) - Number(decoration_cost) - Number(gift_cost);

    const totalAmount = autoDealAmount + licenceAmount + loanAmount + insuranceAmount + decorationAmount;

    return (
      <div className="render-content">
        <Row className="head-action-bar-line">
          <Col span={12}>
            <h3 className="mb10">车辆结算单</h3>
          </Col>
          <Col span={12} className={isPayed ? 'hide' : ''}>
            <div className="pull-right">
              <Button
                onClick={this.handleClearing}
                className="mr10"
                loading={isFetching}
                disabled={isFetching || !Number(autoId) || isSave}
              >
                结算
              </Button>

              <Button
                type="primary"
                onClick={this.handleSubmit}
                loading={isFetching}
                disabled={isFetching}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>

        <Form>
          <div className="mb10 line-block">
            <h3 className="mb10">裸车收入</h3>

            <Row>
              <Col span={8}>

                {
                  isPayed ?
                    <FormItem label="裸车价" {...formItemThree}>
                      <p className="ant-form-text">{Number(sell_price).toFixed(2)}元</p>
                    </FormItem> :
                    <NumberInput
                      label="裸车价"
                      defaultValue={sell_price}
                      id="auto_sell_price"
                      onChange={this.setFieldValue.bind(this, 'sell_price')}
                      self={this}
                      layout={formItemThree}
                      placeholder="请输入裸车价"
                    />
                }

              </Col>
              <Col span={8}>

                {
                  isPayed ?
                    <FormItem label="二手车置换价" {...formItemThree}>
                      <p className="ant-form-text">{Number(trade_in_price).toFixed(2)}元</p>
                    </FormItem> :
                    <NumberInput
                      label="二手车置换价"
                      defaultValue={trade_in_price}
                      id="trade_in_price"
                      onChange={this.setFieldValue.bind(this, 'trade_in_price')}
                      self={this}
                      layout={formItemThree}
                      placeholder="请输入二手车置换差价"
                    />
                }

                {/* <FormItem label="二手车置换价" {...formItemThree}>
                 {isPayed ?
                 <p className="ant-form-text">{Number(trade_in_price).toFixed(2)}元</p> :
                 getFieldDecorator('trade_in_price', {
                 initialValue: trade_in_price,
                 onChange: this.setFieldValue.bind(this, 'trade_in_price'),
                 })(
                 <Input placeholder="请输入二手车置换差价"/>
                 )}
                 </FormItem>*/}
              </Col>
              <Col span={8}>

                {
                  isPayed ?
                    <FormItem label="进价" {...formItemThree}>
                      <p className="ant-form-text">{Number(buy_price).toFixed(2)}元</p>
                    </FormItem> :
                    <NumberInput
                      label="进价"
                      defaultValue={buy_price}
                      id="auto_buy_price"
                      onChange={this.setFieldValue.bind(this, 'buy_price')}
                      self={this}
                      layout={formItemThree}
                      placeholder="请输入4S报价"
                    />
                }

                {/* <FormItem label="进价" className="text-red" {...formItemThree}>
                 {isPayed ?
                 <p className="ant-form-text">{Number(buy_price).toFixed(2)}元</p> :
                 getFieldDecorator('auto_buy_price', {
                 initialValue: buy_price,
                 onChange: this.setFieldValue.bind(this, 'buy_price'),
                 })(
                 <Input placeholder="请输入4S报价"/>
                 )}
                 </FormItem>*/}
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="收入" className="text-red" {...formItemThree}>
                  <p className="ant-form-text">{Number(autoDealAmount).toFixed(2)}元</p>
                </FormItem>
              </Col>
            </Row>
          </div>

          <div className="mb10 line-block">
            <h3 className="mb10">上牌收入</h3>

            <Row>
              <Col span={8}>

                {
                  isPayed ?
                    <FormItem label="代理上牌费" {...formItemThree}>
                      <p className="ant-form-text">{Number(license_tax_in).toFixed(2)}元</p>
                    </FormItem> :
                    <NumberInput
                      label="代理上牌费"
                      defaultValue={license_tax_in}
                      id="license_tax_in"
                      onChange={this.setFieldValue.bind(this, 'license_tax_in')}
                      self={this}
                      layout={formItemThree}
                      placeholder="请输入用户实付上牌费"
                    />
                }

                {/* <FormItem label="代理上牌费" {...formItemThree}>
                 {isPayed ?
                 <p className="ant-form-text">{Number(license_tax_in).toFixed(2)}元</p> :
                 getFieldDecorator('license_tax_in', {
                 initialValue: license_tax_in,
                 onChange: this.setFieldValue.bind(this, 'license_tax_in'),
                 })(
                 <Input placeholder="请输入用户实付上牌费"/>
                 )}
                 </FormItem>*/}
              </Col>
              <Col span={8}>

                {
                  isPayed ?
                    <FormItem label="官方上牌费" {...formItemThree}>
                      <p className="ant-form-text">{Number(license_tax_out).toFixed(2) || 150.00}元</p>
                    </FormItem> :
                    <NumberInput
                      label="官方上牌费"
                      defaultValue={license_tax_out || 150}
                      id="license_tax_out"
                      onChange={this.setFieldValue.bind(this, 'license_tax_out')}
                      self={this}
                      layout={formItemThree}
                      placeholder="请输入车管所上牌费"
                    />
                }

                {/* <FormItem label="官方上牌费" className="text-red" {...formItemThree}>
                 {isPayed ?
                 <p className="ant-form-text">{Number(license_tax_out).toFixed(2) || 150.00}元</p> :
                 getFieldDecorator('license_tax_out', {
                 initialValue: license_tax_out || 150,
                 onChange: this.setFieldValue.bind(this, 'license_tax_out'),
                 })(
                 <Input placeholder="请输入车管所上牌费"/>
                 )}
                 </FormItem>*/}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="收入" {...formItemThree}>
                  <p className="ant-form-text">{Number(licenceAmount).toFixed(2)}元</p>
                </FormItem>
              </Col>
            </Row>
          </div>

          {!noLoan && (
            <div className="mb10 line-block">
              <h3 className="mb10">按揭收入</h3>

              <Row>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="按揭资料费" {...formItemThree}>
                        <p className="ant-form-text">{Number(material_fee).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="按揭资料费"
                        defaultValue={material_fee}
                        id="material_fee"
                        onChange={this.setFieldValue.bind(this, 'material_fee')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入按揭资料费"
                      />
                  }

                  {/* <FormItem label="按揭资料费" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(material_fee).toFixed(2)}元</p> :
                   getFieldDecorator('material_fee', {
                   initialValue: material_fee,
                   onChange: this.setFieldValue.bind(this, 'material_fee'),
                   })(
                   <Input placeholder="请输入按揭资料费"/>
                   )}
                   </FormItem>*/}
                </Col>
                <Col span={8}>
                  {
                    isPayed ?
                      <FormItem label="按揭担保费" {...formItemThree}>
                        <p className="ant-form-text">{Number(guarantee_fee_in).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="按揭担保费"
                        defaultValue={guarantee_fee_in}
                        id="guarantee_fee_in"
                        onChange={this.setFieldValue.bind(this, 'guarantee_fee_in')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入按揭担保费"
                      />
                  }

                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="代理公证费" {...formItemThree}>
                        <p className="ant-form-text">{Number(notary_fee_in).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="代理公证费"
                        defaultValue={notary_fee_in}
                        id="notary_fee_in"
                        onChange={this.setFieldValue.bind(this, 'notary_fee_in')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入代理公证费"
                      />
                  }
                </Col>
              </Row>
              <Row>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="银行保证金" {...formItemThree}>
                        <p className="ant-form-text">{Number(bank_deposit_in).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="银行保证金"
                        defaultValue={bank_deposit_in}
                        id="bank_deposit_in"
                        onChange={this.setFieldValue.bind(this, 'bank_deposit_in')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入银行保证金"
                      />
                  }

                  {/* <FormItem label="银行保证金" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(bank_deposit_in).toFixed(2)}元</p> :
                   getFieldDecorator('bank_deposit_in', {
                   initialValue: bank_deposit_in,
                   onChange: this.setFieldValue.bind(this, 'bank_deposit_in'),
                   })(
                   <Input placeholder="请输入银行保证金"/>
                   )}
                   </FormItem>*/}
                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="担保公司担保费支出" {...formItemThree}>
                        <p className="ant-form-text">{Number(guarantee_fee_out).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="担保公司担保费支出"
                        defaultValue={guarantee_fee_out}
                        id="guarantee_fee_out"
                        onChange={this.setFieldValue.bind(this, 'guarantee_fee_out')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入担保公司担保费支出"
                      />
                  }


                  {/* <FormItem label="担保公司担保费支出" className="text-red" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(guarantee_fee_out).toFixed(2)}元</p> :
                   getFieldDecorator('guarantee_fee_out', {
                   initialValue: guarantee_fee_out,
                   onChange: this.setFieldValue.bind(this, 'guarantee_fee_out'),
                   })(
                   <Input placeholder="请输入担保公司担保费支出"/>
                   )}
                   </FormItem>*/}
                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="公证费支出" {...formItemThree}>
                        <p className="ant-form-text">{Number(notary_fee_out).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="公证费支出"
                        defaultValue={notary_fee_out}
                        id="notary_fee_out"
                        onChange={this.setFieldValue.bind(this, 'notary_fee_out')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入公证费支出"
                      />
                  }

                  {/* <FormItem label="公证费支出" className="text-red" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(notary_fee_out).toFixed(2)}元</p> :
                   getFieldDecorator('notary_fee_out', {
                   initialValue: notary_fee_out,
                   onChange: this.setFieldValue.bind(this, 'notary_fee_out'),
                   })(
                   <Input placeholder="请输入公证费支出"/>
                   )}
                   </FormItem>*/}
                </Col>
              </Row>
              <Row>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="银行保证金支出" {...formItemThree}>
                        <p className="ant-form-text">{Number(bank_deposit_out).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="银行保证金支出"
                        defaultValue={bank_deposit_out}
                        id="bank_deposit_out"
                        onChange={this.setFieldValue.bind(this, 'bank_deposit_out')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入银行保证金支出"
                      />
                  }


                  {/* <FormItem label="银行保证金支出" className="text-red" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(bank_deposit_out).toFixed(2)}元</p> :
                   getFieldDecorator('bank_deposit_out', {
                   initialValue: bank_deposit_out,
                   onChange: this.setFieldValue.bind(this, 'bank_deposit_out'),
                   })(
                   <Input placeholder="请输入银行保证金支出"/>
                   )}
                   </FormItem>*/}
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="收入" {...formItemThree}>
                    <p className="ant-form-text">{Number(loanAmount).toFixed(2)}元</p>
                  </FormItem>
                </Col>
              </Row>
            </div>
          )}

          {!noInsurance && (
            <div className="mb10 line-block">
              <h3 className="mb10">保险收入</h3>

              <Row>
                <Col span={8}>
                  <FormItem label="保险公司" {...formItemThree}>
                    {isPayed ?
                      <p className="ant-form-text">{Number(insurance_company).toFixed(2)}</p> :
                      getFieldDecorator('insurance_company', {
                        initialValue: insurance_company,
                      })(
                        <Select
                          onSelect={this.handleRebateCoefficient}
                          {...selectStyle}
                          placeholder="请选择保险公司"
                        >
                          {insuranceCompanies.map(company => <Option key={company.name}>{company.name}</Option>)}
                        </Select>
                      )}
                  </FormItem>
                </Col>
                <Col span={8}>

                  <FormItem label="返利系数" {...formItemThree}>
                    {isPayed ?
                      <p className="ant-form-text">{Number(rebate_coefficient).toFixed(2)}</p> :
                      getFieldDecorator('rebate_coefficient', {
                        initialValue: rebate_coefficient,
                      })(
                        <Input placeholder="请输入返利系数"/>
                      )}
                  </FormItem>
                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="商业保险额" {...formItemThree}>
                        <p className="ant-form-text">{Number(ci_total).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="商业保险额"
                        defaultValue={ci_total}
                        id="ci_total"
                        onChange={this.setFieldValue.bind(this, 'ci_total')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入商业保险额"
                      />
                  }

                  {/* <FormItem label="商业保险额" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(ci_total).toFixed(2)}元</p> :
                   getFieldDecorator('ci_total', {
                   initialValue: ci_total,
                   onChange: this.setFieldValue.bind(this, 'ci_total'),
                   })(
                   <Input placeholder="请输入商业保险额"/>
                   )}
                   </FormItem>*/}
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  {
                    isPayed ?
                      <FormItem label="商业险让利" {...formItemThree}>
                        <p className="ant-form-text">{Number(ci_discount).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="商业险让利"
                        defaultValue={ci_discount}
                        id="ci_discount"
                        onChange={this.setFieldValue.bind(this, 'ci_discount')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入银行保证金"
                      />
                  }

                  {/* <FormItem label="商业险让利" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(ci_discount).toFixed(2)}元</p> :
                   getFieldDecorator('ci_discount', {
                   initialValue: ci_discount,
                   onChange: this.setFieldValue.bind(this, 'ci_discount'),
                   })(
                   <Input placeholder="请输入银行保证金"/>
                   )}
                   </FormItem>*/}
                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="商业险返利" {...formItemThree}>
                        <p className="ant-form-text">{Number(ci_rebate).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="商业险返利"
                        defaultValue={ci_rebate}
                        id="ci_rebate"
                        onChange={this.setFieldValue.bind(this, 'ci_rebate')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入银行保证金"
                      />
                  }
                  {/* <FormItem label="商业险返利" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(ci_rebate).toFixed(2)}元</p> :
                   getFieldDecorator('ci_rebate', {
                   initialValue: ci_rebate,
                   onChange: this.setFieldValue.bind(this, 'ci_rebate'),
                   })(
                   <Input placeholder="请输入银行保证金"/>
                   )}
                   </FormItem>*/}
                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="交强险返利" {...formItemThree}>
                        <p className="ant-form-text">{Number(force_rebate).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="交强险返利"
                        defaultValue={force_rebate}
                        id="force_rebate"
                        onChange={this.setFieldValue.bind(this, 'force_rebate')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入银行保证金"
                      />
                  }

                  {/* <FormItem label="交强险返利" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(force_rebate).toFixed(2)}元</p> :
                   getFieldDecorator('force_rebate', {
                   initialValue: force_rebate,
                   onChange: this.setFieldValue.bind(this, 'force_rebate'),
                   })(
                   <Input placeholder="请输入银行保证金"/>
                   )}
                   </FormItem>*/}
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="收入" {...formItemThree}>
                    <p className="ant-form-text">{Number(insuranceAmount).toFixed(2)}元</p>
                  </FormItem>
                </Col>
              </Row>
            </div>
          )}

          {!noDecoration && (
            <div className="mb10 line-block">
              <h3 className="mb10">加装收入</h3>

              <Row>
                <Col span={8}>
                  {
                    isPayed ?
                      <FormItem label="装潢金额" {...formItemThree}>
                        <p className="ant-form-text">{Number(decoration_price).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="装潢金额"
                        defaultValue={decoration_price}
                        id="decoration_price"
                        onChange={this.setFieldValue.bind(this, 'decoration_price')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入用户实付装潢金额"
                      />
                  }

                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="装潢费用" {...formItemThree}>
                        <p className="ant-form-text">{Number(decoration_cost).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="装潢费用"
                        defaultValue={decoration_cost}
                        id="decoration_cost"
                        onChange={this.setFieldValue.bind(this, 'decoration_cost')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入装潢费用"
                      />
                  }

                  {/* <FormItem label="装潢费用" className="text-red" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(decoration_cost).toFixed(2)}元</p> :
                   getFieldDecorator('decoration_cost', {
                   initialValue: decoration_cost,
                   onChange: this.setFieldValue.bind(this, 'decoration_cost'),
                   })(
                   <Input placeholder="请输入装潢费用"/>
                   )}
                   </FormItem>*/}
                </Col>
                <Col span={8}>

                  {
                    isPayed ?
                      <FormItem label="赠品成本" {...formItemThree}>
                        <p className="ant-form-text">{Number(gift_cost).toFixed(2)}元</p>
                      </FormItem> :
                      <NumberInput
                        label="赠品成本"
                        defaultValue={gift_cost}
                        id="gift_cost"
                        onChange={this.setFieldValue.bind(this, 'gift_cost')}
                        self={this}
                        layout={formItemThree}
                        placeholder="请输入赠品成本"
                      />
                  }

                  {/* <FormItem label="赠品成本" className="text-red" {...formItemThree}>
                   {isPayed ?
                   <p className="ant-form-text">{Number(gift_cost).toFixed(2)}元</p> :
                   getFieldDecorator('gift_cost', {
                   initialValue: gift_cost,
                   onChange: this.setFieldValue.bind(this, 'gift_cost'),
                   })(
                   <Input placeholder="请输入赠品成本"/>
                   )}
                   </FormItem>*/}
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="收入" {...formItemThree}>
                    <p className="ant-form-text">{Number(decorationAmount).toFixed(2)}元</p>
                  </FormItem>
                </Col>
              </Row>
            </div>
          )}

          <div className="mb10 line-block">
            <h3 className="mb10">结算信息</h3>

            <Row>
              <Col span={8}>
                <FormItem label="收入" {...formItemThree}>
                  <p className="ant-form-text">{Number(totalAmount).toFixed(2)}元</p>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}

Clearing = Form.create()(Clearing);
export default Clearing;
