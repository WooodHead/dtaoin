import React from 'react';
import { Row, Col, Form, Select, DatePicker, Table, Icon, Checkbox, Button, Input } from 'antd';

import Layout from '../../../utils/FormLayout';
import DateFormatter from '../../../utils/DateFormatter';

import CustomInsurance from './CustomInsurance';

const FormItem = Form.Item;
const Option = Select.Option;

class InsuranceInfo extends React.Component {
  constructor(props) {
    super(props);

    this.renderFooter = this.renderFooter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getInsurceCompany();
    this.props.getInsuranceConfig();
  }

  handleCheckboxChange(id, e) {
    const listMap = new Map([...this.props.listMap]);
    const value = listMap.get(id);
    value.is_non_deductible = e.target.checked ? 1 : 0;

    listMap.set(id, value);
    this.props.setInsuranceListMap(listMap);
  }

  handlePremiumChange(id, e) {
    const listMap = new Map([...this.props.listMap]);
    const value = listMap.get(id);

    value.amount = e.target.value;
    listMap.set(id, value);
    this.props.setInsuranceListMap(listMap);
  }

  handleDelete(id) {
    const listMap = new Map([...this.props.listMap]);
    listMap.delete(id);
    this.props.setInsuranceListMap(listMap);
  }

  handleSubmit() {
    const formData = this.props.form.getFieldsValue();
    const { listMap } = this.props;

    formData.content = JSON.stringify(Array.from(listMap.values()));
    formData.business_start_date = DateFormatter.day(formData.business_start_date);
    formData.force_start_date = DateFormatter.day(formData.force_start_date);

    this.props.submitInsuranceInfo(formData);
  }

  handleCompensationLevelChange(type, id, e) {
    const listMap = new Map([...this.props.listMap]);
    const item = listMap.get(id);

    let value = '';
    if (type === '1') {
      value = e.target.value;
    } else if (type === '2') {
      value = e;
    }

    item.compensation_level = value;
    listMap.set(id, item);
    this.props.setInsuranceListMap(listMap);
  }

  getListMap(listMap, insuranceConfigMap) {
    if (listMap.size > 0) {
      return true;
    } else {
      // 获取默认展示项目
      for (const [key, value] of insuranceConfigMap.entries()) {
        if (String(value.is_default) === '1') {
          value.is_non_deductible = 0;
          value.amount = 0;
          value.compensation_level = '';
          listMap.set(key, value);
        }
      }
    }
  }

  getInsuranceTotal(listMap) {
    let force = 0;
    let business = 0;

    for (const value of listMap.values()) {
      if (String(value._id) === '1' || String(value._id) === '2') {
        force += Number(value.amount) || 0;
      }
      business += Number(value.amount) || 0;
    }
    return { force, business };
  }

  renderFooter() {
    const { insuranceConfigMap, listMap } = this.props;
    return (
      <p className="ml10 pointer" style={{ color: '#108ee9' }}>
        <Icon type="plus" />
        <CustomInsurance
          insuranceConfigMap={insuranceConfigMap}
          listMap={listMap}
          setInsuranceListMap={this.props.setInsuranceListMap}
        />
      </p>
    );
  }

  render() {
    const { formItemThree } = Layout;
    const { getFieldDecorator } = this.props.form;

    const { listMap, insuranceCompanys, insuranceConfigMap, insuranceDetail, detail } = this.props;

    this.getListMap(listMap, insuranceConfigMap);
    const total = this.getInsuranceTotal(listMap);

    const list = Array.from(listMap.values());

    const self = this;
    const columns = [
      {
        title: '保险名称',
        dataIndex: 'name',
        key: 'name',
        width: '140px',
      }, {
        title: '不计免赔投保',
        dataIndex: 'is_non_deductible',
        key: 'is_non_deductible',
        width: '140px',
        render: (value, record) => (
            <div>
              <Checkbox
                checked={Number(value) === 1}
                onChange={e => self.handleCheckboxChange(record._id, e)}
              >
                投保
              </Checkbox>
            </div>
          ),
      }, {
        title: '赔付额度',
        dataIndex: 'compensation_level',
        key: 'compensation_level',
        width: '140px',
        render: (value, record) => (
            <div>
              {
                record.compensation_levels.length <= 0
                  ? (
                    <Input
                      onChange={e => self.handleCompensationLevelChange('1', record._id, e)}
                      value={value}
                    />
                  )
                  : (
                    <Select
                      size="large"
                      value={value}
                      style={{ width: '100%' }}
                      onChange={e => self.handleCompensationLevelChange('2', record._id, e)}
                    >
                      {
                        record.compensation_levels.map((item, index) => (
                          <Option key={index} value={item}>{item}</Option>
                        ))
                      }
                    </Select>
                  )
              }
            </div>
          ),
      }, {
        title: '保费(元)',
        dataIndex: 'amount',
        key: 'amount',
        width: '140px',
        render: (value, record) => (
            <Input
              value={Number(value) > 0 ? value : ''}
              onChange={e => self.handlePremiumChange(record._id, e)}
            />
          ),
      }, {
        title: '操作',
        width: '48px',
        className: 'center',
        render: (value, record) => (
          <a
            href="javascript:;"
            onClick={e => this.handleDelete(record._id, e)}
          >
            删除
          </a>
        ),
      }];

    return (
      <div className="order-insurance">
        {getFieldDecorator('order_id', { initialValue: detail._id })(
          <Input className="hide" />,
        )}

        <Row>
          <Col span={10}>
            <FormItem label="强制险公司" {...formItemThree}>
              {getFieldDecorator('force_company', {
                initialValue: insuranceDetail.force_company,
              })(
                <Select style={{ width: '200px' }} placeholder="请选择保险公司">
                  {insuranceCompanys.map(company =>
                    <Option key={company.name}>{company.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="强制险总额" {...formItemThree}>
              {getFieldDecorator('force_total', {
                initialValue: total.force,
              })(
                <p>{`${total.force  } 元`}</p>,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="强制险投保时间" {...formItemThree}>
              {getFieldDecorator('force_start_date', {
                initialValue: !!insuranceDetail.force_start_date
                  ? DateFormatter.getMomentDate(DateFormatter.getDate(insuranceDetail.force_start_date))
                  : null,
              })(
                <DatePicker />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={10}>
            <FormItem label="商业险公司" {...formItemThree}>
              {getFieldDecorator('business_company', {
                initialValue: insuranceDetail.business_company,
              })(
                <Select style={{ width: '200px' }} placeholder="请选择保险公司">
                  {insuranceCompanys.map(company =>
                    <Option key={company.name}>{company.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="商业险额" {...formItemThree}>
              {getFieldDecorator('ci_total', {
                initialValue: total.business,
              })(
                <p>{`${total.business  } 元`}</p>,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="商业险投保时间" {...formItemThree}>
              {getFieldDecorator('business_start_date', {
                initialValue: !!insuranceDetail.business_start_date
                  ? DateFormatter.getMomentDate(DateFormatter.getDate(insuranceDetail.business_start_date))
                  : null,
              })(
                <DatePicker />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={20}>
            <FormItem label="保险明细" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Table
                bordered
                columns={columns}
                dataSource={list}
                pagination={false}
                footer={this.renderFooter}
                rowKey={record => record._id}
                size="middle"
              />
            </FormItem>
          </Col>
        </Row>

        <div className="line" />
        <Row>
          <Col span={20}>
            <div style={{ marginLeft: '16.5%' }}>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled={Number(detail.status) === 7}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

InsuranceInfo = Form.create()(InsuranceInfo);
export default InsuranceInfo;
