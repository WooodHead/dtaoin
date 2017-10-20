import React from 'react';
import { Button, Col, Form, Icon, Input, Radio, Row, Select, Table, Tooltip } from 'antd';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';

const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class FinBankingPro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      service_fee_config: '',
      finance_length_type12: '',
      finance_length_type24: '',
      finance_length_type36: '',
      finance_length_type48: '',
      finance_length_type60: '',
      finance_length_type72: '',
    };
  }

  componentDidMount() {
    const getProductDetailRes = this.props.getProductDetailRes;
    const service_fee_config = JSON.parse(this.props.getProductDetailRes.service_fee_config);
    if (service_fee_config.length > 0) {
      this.setState({
        finance_length_type12: service_fee_config[0].fee,
        finance_length_type24: service_fee_config[1].fee,
        finance_length_type36: service_fee_config[2].fee,
        finance_length_type48: service_fee_config[3].fee,
        finance_length_type60: service_fee_config[4].fee,
        finance_length_type72: service_fee_config[5].fee,
      });
    }
  }

  finance_length_types_change = value => {
    console.log(`selected ${value}`);
  };

  change_finance_config(record, e) {
    switch (String(record.key)) {
    case '1':
      this.setState({ finance_length_type12: e.target.value });
      break;
    case '2':
      this.setState({ finance_length_type24: e.target.value });
      break;
    case '3':
      this.setState({ finance_length_type36: e.target.value });
      break;
    case '4':
      this.setState({ finance_length_type48: e.target.value });
      break;
    case '5':
      this.setState({ finance_length_type60: e.target.value });
      break;
    case '6':
      this.setState({ finance_length_type72: e.target.value });
      break;
    default:
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const str_finance_length = [
          { begain: 0, end: 100000, fee: this.state.finance_length_type12 },
          { begain: 100000, end: 200000, fee: this.state.finance_length_type24 },
          { begain: 200000, end: 300000, fee: this.state.finance_length_type36 },
          { begain: 300000, end: 400000, fee: this.state.finance_length_type48 },
          { begain: 400000, end: 500000, fee: this.state.finance_length_type60 },
          { begain: 500000, end: 10000000, fee: this.state.finance_length_type72 },
        ];
        const service_fee_config = JSON.stringify(str_finance_length);
        const data = {
          product_id: this.props.product_id,
          calculate_type: values.calculate_type,
          pickup_fee: values.pickup_fee,
          finance_length_types: values.finance_length_types.join(','),
          service_fee_config,
        };
        this.props.post_markertEditLoanFinance(data);
      }
    });
  };

  render() {
    const self = this;
    const { visible } = this.state;
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const getProductDetailRes = this.props.getProductDetailRes;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const columns = [
      {
        title: '开票价',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="#">{text}</a>,
      }, {
        title: '服务费（元）',
        key: 'action',
        render: (text, record) => (
          <span>
             <Input
               type="number"
               value={record.fee_Value}
               onChange={self.change_finance_config.bind(self, record)}
               addonAfter={'元'}
             />
          </span>
        ),
      }];
    const data = [
      {
        key: 1,
        name: '0-10W（元）',
        fee_Value: this.state.finance_length_type12,
      }, {
        key: 2,
        name: '10-20W（元）',
        fee_Value: this.state.finance_length_type24,
      }, {
        key: 3,
        name: '20-30W（元）',
        fee_Value: this.state.finance_length_type36,
      }, {
        key: 4,
        name: '30-40W（元）',
        fee_Value: this.state.finance_length_type48,
      }, {
        key: 5,
        name: '40-50W（元）',
        fee_Value: this.state.finance_length_type60,
      }, {
        key: 6,
        name: '50W以上',
        fee_Value: this.state.finance_length_type72,
      }];
    return (
      <div style={{ paddingTop: 20 }} className="finBingPro">
        <Row>
          <Col span={18}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="计算器"
              >
                {getFieldDecorator('calculate_type', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                  initialValue: getProductDetailRes.calculate_type,
                })(
                  <Select placeholder="请选择" disabled={this.props.hqOrOperate}>
                    <Select.Option value="0">请选择</Select.Option>
                    <Select.Option value="1">易鑫优质客户</Select.Option>
                    <Select.Option value="2">易鑫保证金客户</Select.Option>
                    <Select.Option value="3">金磁客户</Select.Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="融资期限"
              >
                {getFieldDecorator('finance_length_types', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                  initialValue: (getProductDetailRes.finance_length_types &&
                    getProductDetailRes.finance_length_types.split(',')) || [],
                })(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.finance_length_types_change}
                    disabled={this.props.hqOrOperate}
                  >
                    <Select.Option value="">请选择</Select.Option>
                    <Select.Option value="12">12期</Select.Option>
                    <Select.Option value="24">24期</Select.Option>
                    <Select.Option value="36">36期</Select.Option>
                    <Select.Option value="48">48期</Select.Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                label="服务费"
                {...formItemLayout}
              >
                {getFieldDecorator('service_fee_config', {})(
                  <Table columns={columns} dataSource={data} pagination={false} />,
                )
                }
              </FormItem>
              <FormItem
                label="提车费"
                {...formItemLayout}
              >
                <Row gutter={8}>
                  <Col span={12}>
                    {getFieldDecorator('pickup_fee', {
                      rules: [{ required: false }],
                      initialValue: getProductDetailRes.pickup_fee,
                    })(
                      <Input type="number" placeholder="请输入提车费" addonAfter={'元'} />,
                    )}
                  </Col>
                  <Col span={12}>
                    <Tooltip title="提车费计入首付。为经销商收取的相关费用，若无此项无需填写">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </Col>
                </Row>
              </FormItem>

              <Row style={{ marginTop: 40 }}>
                <Col span={4} offset={18}>
                  <FormItem {...formItemLayout}>
                    <Button type="primary" htmlType="submit"
                            disabled={this.props.hqOrOperate}>保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

FinBankingPro = Form.create()(FinBankingPro);
export default FinBankingPro;
