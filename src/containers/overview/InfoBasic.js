import React, {Component} from 'react';
import {Row, Col, Form, Input, Select, Switch, Button, message} from 'antd';

import api from '../../middleware/api';
import text from '../../config/text';
import className from 'classnames';

import Layout from '../../utils/FormLayout';
import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';

import NewAgent from './NewAgent';

const FormItem = Form.Item;
const Option = Select.Option;

class InfoBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provinces: [],
      cities: [],
      countries: [],
      agentId: '',
      chainId: '',
      isEdit: true,
      agentData: [],
      chainData: [],
      isNew: !props.companyInfo,
    };

    [
      'handleProvinceChange',
      'handleCityChange',
      'handleAgentSelect',
      'handleAgentSearch',
      'handleIsEdit',
      'handleChainSelect',
      'handleSubmit',
      'handleAddAgent',
      'handleIsChainChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getProvinces();
    this.getAgentList();
    this.getChainList();
  }

  handleAgentSearch(key, successHandle, failHandle) {
    let url = api.overview.getAgentList(key, 1);
    api.ajax({url}, data => {
      if (data.code === 0) {
        successHandle(data.res.list);
        this.setState({agentData: data.res.list});
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  handleChainSelect(value) {
    this.props.form.setFieldsValue({chain_id: value});
  }

  handleAgentSelect(value) {
    this.props.form.setFieldsValue({sell_agent_id: value});
  }

  handleProvinceChange(value) {
    this.getCities(value);
  }

  handleCityChange(value) {
    this.getCountries(this.state.province, value);
  }

  handleAddAgent(name, phone) {
    api.ajax({
      url: api.overview.createSellAgent(),
      type: 'POST',
      data: {name: name, phone: phone},
    }, agent => {
      message.success('创建代理人成功');
      this.getAgentList();
      setTimeout(() => {
        this.props.form.setFieldsValue({sell_agent_id: String(agent.res.agent._id)});
      }, 100);
    });
  }

  handleIsEdit() {
    let {isEdit} = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleIsChainChange(value) {
    if (!value) {
      this.props.form.setFieldsValue({chain_id: '0'});
    }
  }

  handleSubmit() {
    let {isNew} = this.state;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return false;
      }

      api.ajax({
        url: isNew ? api.overview.createCompany() : api.overview.editCompany(),
        type: 'POST',
        data: values,
      }, data => {
        this.handleIsEdit();
        message.success('编辑成功');
        this.props.onSuccess(data.res.company._id);
      });
    });
  }

  getProvinces() {
    api.ajax({url: api.system.getProvinces()}, data => {
      this.setState({provinces: data.res.province_list});
    });
  }

  getCities(province) {
    api.ajax({url: api.system.getCities(province)}, data => {
      this.setState({
        province: province,
        cities: data.res.city_list,
      });
    });
  }

  getCountries(province, city) {
    api.ajax({url: api.system.getCountries(province, city)}, data => {
      this.setState({countries: data.res.country_list});
    });
  }

  getAgentList(key = '', page = 1) {
    api.ajax({url: api.overview.getAgentList(key, page)}, data => {
      this.setState({agentData: data.res.list});
    });
  }

  getChainList(key = '', page = 1) {
    api.ajax({url: api.overview.getChainList(key, page, -1)}, data => {
      this.setState({chainData: data.res.list});
    });
  }

  render() {
    let {provinces, cities, countries, isEdit, agentData, chainData, isNew} = this.state;
    let {getFieldDecorator} = this.props.form;
    const {formItemThree, formItem12, formItemLg} = Layout;
    let companyInfo = this.props.companyInfo || {};

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
          {getFieldDecorator('company_id', {initialValue: companyInfo._id})(
            <Input type="hidden"/>
          )}

          {getFieldDecorator('sell_agent_id', {initialValue: companyInfo.sell_agent_id})(
            <Input type="hidden"/>
          )}

          {getFieldDecorator('chain_id', {initialValue: companyInfo.chain_id})(
            <Input type="hidden"/>
          )}
          <Row>
            <Col span={16}>
              <FormItem label="门店名称" {...formItemLg}>
                {getFieldDecorator('company_name', {
                  initialValue: companyInfo.name,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入门店名称"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="省份" {...formItemThree}>
                {getFieldDecorator('province', {
                  initialValue: companyInfo.province,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Select onSelect={this.handleProvinceChange} placeholder="请选择省份" disabled={!isNew}>
                    {provinces.map(province => <Option key={province.name}>{province.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="城市" {...formItemThree}>
                {getFieldDecorator('city', {
                  initialValue: companyInfo.city,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Select onSelect={this.handleCityChange} placeholder="请选择城市" disabled={!isNew}>
                    {cities.map(city => <Option key={city.name}>{city.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="区县" {...formItemThree}>
                {getFieldDecorator('country', {
                  initialValue: companyInfo.country,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Select placeholder="请选择区县" disabled={!isNew}>
                    {countries.map(country => <Option key={country.name}>{country.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <FormItem label="详细地址" {...formItem12}>
                {getFieldDecorator('address', {
                  initialValue: companyInfo.address,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入门店地址"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="门店类型" {...formItemThree}>
                {getFieldDecorator('company_type', {
                  initialValue: Number(companyInfo.company_type) == 0 ? '' : companyInfo.company_type,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Select onSelect={this.handleCityChange} placeholder="请选择">
                    <Option value="1">社区店</Option>
                    <Option value="2">综合售后店</Option>
                    <Option value="3">销售服务店</Option>
                    <Option value="4">综合服务店</Option>
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="是否连锁" {...formItemThree}>
                {getFieldDecorator('isChain', {
                  valuePropName: 'checked',
                  initialValue: !(Number(companyInfo.chain_id) === 0),
                  onChange: this.handleIsChainChange,
                })(
                  <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="关联连锁店面" {...formItemThree}>
                <Select
                  showSearch
                  style={{width: 200}}
                  placeholder="选择连锁门店"
                  optionFilterProp="children"
                  onChange={this.handleChainSelect}
                  value={this.props.form.getFieldValue('chain_id')}
                >
                  <Option value="0">无关联连锁</Option>
                  {chainData.map(item =>
                    <Option key={item._id} value={item._id}>{item.chain_name}</Option>
                  )}
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row>

            <Col span={8}>
              <FormItem label="合作类型" {...formItemThree}>
                {getFieldDecorator('cooperation_type', {
                  initialValue: Number(companyInfo.cooperation_type) == 0 ? '' : companyInfo.cooperation_type,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Select
                    onSelect={this.handleCityChange}
                    placeholder="请选择"
                    disabled={Number(companyInfo.chain_id) > 0}
                  >
                    <Option value="1">FC友情合作店</Option>
                    <Option value="2">MC重要合作店</Option>
                    <Option value="3">AP高级合伙店</Option>
                    <Option value="4">TP顶级合伙店</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="系统" {...formItemThree}>
                {getFieldDecorator('system_type', {
                  initialValue: Number(companyInfo.system_type) == 0 ? '' : companyInfo.system_type,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Select onSelect={this.handleCityChange} placeholder="请选择">
                    <Option value="1">基础版</Option>
                    <Option value="2">标准版</Option>
                    <Option value="3">高级版</Option>
                    <Option value="4">MC版</Option>
                    <Option value="5">销售版</Option>
                    <Option value="6">基础版+销售版</Option>
                    <Option value="7">标准版+销售版</Option>
                    <Option value="8">高级版+销售版</Option>
                    <Option value="9">MC版+销售版</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="店总负责人" {...formItemThree}>
                {getFieldDecorator('admin_name', {
                  initialValue: companyInfo.admin_name,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                {getFieldDecorator('admin_phone', {
                  initialValue: companyInfo.admin_phone,
                  rules: FormValidator.getRulePhoneNumber(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="其他联系人" {...formItemThree}>
                {getFieldDecorator('other_name', {
                  initialValue: companyInfo.other_name,
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                {getFieldDecorator('other_phone', {
                  initialValue: companyInfo.other_phone,
                  rules: FormValidator.getRulePhoneNumber(false),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <Col span={19}>
                <FormItem label="代理联系人" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  <Select
                    showSearch
                    style={{width: 150}}
                    placeholder="选择代理人"
                    optionFilterProp="children"
                    onChange={this.handleAgentSelect}
                    value={this.props.form.getFieldValue('sell_agent_id')}
                  >
                    <Option value="0">{''}</Option>
                    {agentData.map(item =>
                      <Option key={item._id} value={item._id}>{item.name}</Option>
                    )}
                  </Select>
                </FormItem>
              </Col>
              <Col span={5}>
                <span className="ml20">
                  <NewAgent addAgent={this.handleAddAgent}/>
                </span>
              </Col>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <FormItem label="公司名称" {...formItemLg}>
                {getFieldDecorator('business_license_name', {
                  initialValue: companyInfo.business_license_name,
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="工商注册号" {...formItemThree}>
                {getFieldDecorator('business_license', {
                  initialValue: companyInfo.business_license,
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                  <span className="ml10">
                  <Button type="dash" onClick={this.handleIsEdit}>取消编辑</Button>
                </span>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>

        <Form className={show}>
          <Row>
            <Col span={16}>
              <FormItem label="门店名称" {...formItemLg}>
                <span>{companyInfo.name}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="省份" {...formItemThree}>
                <span>{companyInfo.province}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="城市" {...formItemThree}>
                <span>{companyInfo.city}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="区县" {...formItemThree}>
                <span>{companyInfo.country}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <FormItem label="详细地址" {...formItem12}>
                <span>{companyInfo.address}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="门店类型" {...formItemThree}>
                <span>{text.companyType[companyInfo.company_type]}</span>
              </FormItem>
            </Col>

            <Col span={7} offset={1}>
              <FormItem label="是否连锁" {...formItemThree}>
                <span>{Number(companyInfo.chain_id) === 0 ? '否' : '是'}</span>
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="关联连锁店面" {...formItemThree}>
                <span>{companyInfo.chain_name}</span>
              </FormItem>
            </Col>
          </Row>


          <Row>
            <Col span={8}>
              <FormItem label="合作类型" {...formItemThree}>
                <span>{text.cooperationType[companyInfo.cooperation_type]}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="系统" {...formItemThree}>
                <span>{text.systemType[companyInfo.system_type]}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="店总负责人" {...formItemThree}>
                <span>{companyInfo.admin_name}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                <span>{companyInfo.admin_phone}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="其他联系人" {...formItemThree}>
                <span>{companyInfo.other_name}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                <span>{companyInfo.other_phone}</span>
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="代理联系人" {...formItemThree}>
                <span>{companyInfo.sell_agent_name}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <FormItem label="公司名称" {...formItemLg}>
                <span>{companyInfo.business_license_name}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="工商注册号" {...formItemThree}>
                <span>{companyInfo.business_license}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

InfoBasic = Form.create()(InfoBasic);
export default InfoBasic;
