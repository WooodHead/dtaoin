import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, Switch, Button, message } from 'antd';

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
      'getCompanyInfo',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getProvinces();
    this.getAgentList();
    this.getChainList();
  }

  handleAgentSearch(key, successHandle, failHandle) {
    const url = api.overview.getAgentList(key, 1);
    api.ajax({ url }, data => {
      if (data.code === 0) {
        successHandle(data.res.list);
        this.setState({ agentData: data.res.list });
      } else {
        failHandle(data.msg);
      }
    }, error => {
      failHandle(error);
    });
  }

  handleChainSelect(value) {
    this.props.form.setFieldsValue({ chain_id: value });
  }

  handleAgentSelect(value) {
    this.props.form.setFieldsValue({ sell_agent_id: value });
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
      data: { name, phone },
    }, agent => {
      message.success('创建代理人成功');
      this.getAgentList();
      setTimeout(() => {
        this.props.form.setFieldsValue({ sell_agent_id: String(agent.res.agent._id) });
      }, 100);
    });
  }

  handleIsEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleIsChainChange(value) {
    if (!value) {
      this.props.form.setFieldsValue({ chain_id: '0' });
    }
  }

  handleSubmit() {
    const { isNew } = this.state;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return false;
      }

      values.hotline_phone = values.hotline_phone_after;
      if (!!values.hotline_phone_before) {
        values.hotline_phone = `${values.hotline_phone_before  }-${  values.hotline_phone_after}`;
      }

      api.ajax({
        url: isNew ? api.overview.createCompany() : api.overview.editCompany(),
        type: 'POST',
        data: values,
      }, data => {
        this.handleIsEdit();
        isNew ? message.success('创建成功') : message.success('编辑成功');
        this.props.onSuccess(data.res.company._id);
      });
    });
  }

  getProvinces() {
    api.ajax({ url: api.system.getProvinces() }, data => {
      this.setState({ provinces: data.res.province_list });
    });
  }

  getCities(province) {
    api.ajax({ url: api.system.getCities(province) }, data => {
      this.setState({
        province,
        cities: data.res.city_list,
      });
    });
  }

  getCountries(province, city) {
    api.ajax({ url: api.system.getCountries(province, city) }, data => {
      this.setState({ countries: data.res.country_list });
    });
  }

  getAgentList(key = '', page = 1) {
    api.ajax({ url: api.overview.getAgentList(key, page) }, data => {
      this.setState({ agentData: data.res.list });
    });
  }

  getChainList(key = '', page = 1) {
    api.ajax({ url: api.overview.getChainList(key, page, -1) }, data => {
      this.setState({ chainData: data.res.list });
    });
  }

  getCompanyInfo() {
    const { companyInfo } = this.props;
    if (!companyInfo) {
      return {};
    }

    const hotlinePhone = companyInfo.hotline_phone;
    let hotlinePhoneArr = [];

    if (hotlinePhone.indexOf('-') > -1) {
      hotlinePhoneArr = hotlinePhone.split('-');
      companyInfo.areaCode = hotlinePhoneArr[0];
      companyInfo.phone = hotlinePhoneArr[1];
    } else {
      companyInfo.areaCode = '';
      companyInfo.phone = hotlinePhone;
    }
    return companyInfo;
  }

  render() {
    const { provinces, cities, countries, isEdit, agentData, chainData, isNew } = this.state;
    const { getFieldDecorator } = this.props.form;
    const companyInfo = this.getCompanyInfo();

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
          {getFieldDecorator('company_id', { initialValue: companyInfo._id })(
            <Input type="hidden" />,
          )}

          {getFieldDecorator('sell_agent_id', { initialValue: companyInfo.sell_agent_id })(
            <Input type="hidden" />,
          )}

          {getFieldDecorator('chain_id', { initialValue: companyInfo.chain_id })(
            <Input type="hidden" />,
          )}
          <div className="mb10">
            <label className="label ant-form-item-required label-right">门店名称</label>
            {getFieldDecorator('company_name', {
              initialValue: companyInfo.name,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入门店名称" style={{ width: '500px' }} size="large" />,
            )}
          </div>
          <div className="mb10">
            <label className="label ant-form-item-required label-right">省份</label>
            {getFieldDecorator('province', {
              initialValue: companyInfo.province,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Select
                onSelect={this.handleProvinceChange}
                placeholder="请选择省份"
                disabled={!isNew}
                size="large"
                style={{ width: '160px' }}
              >
                {provinces.map(province => <Option key={province.name}>{province.name}</Option>)}
              </Select>,
            )}

            {getFieldDecorator('city', {
              initialValue: companyInfo.city,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Select
                onSelect={this.handleCityChange}
                placeholder="请选择城市"
                disabled={!isNew}
                size="large"
                style={{ width: '160px', marginLeft: '10px' }}
              >
                {cities.map(city => <Option key={city.name}>{city.name}</Option>)}
              </Select>,
            )}

            {getFieldDecorator('country', {
              initialValue: companyInfo.country,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Select
                placeholder="请选择区县"
                disabled={!isNew}
                size="large"
                style={{ width: '160px', marginLeft: '10px' }}
              >
                {countries.map(country => <Option key={country.name}>{country.name}</Option>)}
              </Select>,
            )}
          </div>

          <div className="mb10">
            <label className="label ant-form-item-required label-right">详细地址</label>
            {getFieldDecorator('address', {
              initialValue: companyInfo.address,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入门店地址" style={{ width: '500px' }} size="large" />,
            )}
          </div>

          <Row className="mb10">
            <label className="label label-right ant-form-item-required">门店类型</label>
            {getFieldDecorator('company_type', {
              initialValue: Number(companyInfo.company_type) == 0
                ? ''
                : companyInfo.company_type,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Select
                onSelect={this.handleCityChange}
                placeholder="请选择"
                style={{ width: '160px' }}
                size="large"
              >
                <Option value="1">社区店</Option>
                <Option value="2">综合售后店</Option>
                <Option value="3">销售服务店</Option>
                <Option value="4">综合服务店</Option>
              </Select>,
            )}

            <label className="label ml20">是否连锁</label>
            {getFieldDecorator('isChain', {
              valuePropName: 'checked',
              initialValue: !(Number(companyInfo.chain_id) === 0),
              onChange: this.handleIsChainChange,
            })(
              <Switch checkedChildren={'是'} unCheckedChildren={'否'} />,
            )}

            <label className="label label-right">关联连锁店面</label>
            <Select
              showSearch
              style={{ width: 160 }}
              placeholder="选择连锁门店"
              optionFilterProp="children"
              onChange={this.handleChainSelect}
              value={this.props.form.getFieldValue('chain_id')}
              size="large"
            >
              <Option value="0">无关联连锁</Option>
              {chainData.map(item =>
                <Option key={item._id} value={item._id}>{item.chain_name}</Option>,
              )}
            </Select>
          </Row>

          <Row className="mb10">
            <label className="label label-right ant-form-item-required">合作类型</label>
            {getFieldDecorator('cooperation_type', {
              initialValue: Number(companyInfo.cooperation_type) == 0
                ? ''
                : companyInfo.cooperation_type,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Select
                onSelect={this.handleCityChange}
                placeholder="请选择"
                disabled={Number(companyInfo.chain_id) > 0}
                size="large"
                style={{ width: '160px' }}
              >
                <Option value="1">FC友情合作店</Option>
                <Option value="2">MC重要合作店</Option>
                <Option value="3">AP高级合伙店</Option>
                <Option value="4">TP顶级合伙店</Option>
              </Select>,
            )}

            <label className="label ml10 ant-form-item-required">系统</label>
            {getFieldDecorator('system_type', {
              initialValue: Number(companyInfo.system_type) == 0 ? '' : companyInfo.system_type,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Select
                onSelect={this.handleCityChange}
                placeholder="请选择"
                size="large"
                style={{ width: '160px' }}
              >
                <Option value="1">基础版</Option>
                <Option value="2">标准版</Option>
                <Option value="3">高级版</Option>
                <Option value="4">MC版</Option>
                <Option value="5">销售版</Option>
                <Option value="6">基础版+销售版</Option>
                <Option value="7">标准版+销售版</Option>
                <Option value="8">高级版+销售版</Option>
                <Option value="9">MC版+销售版</Option>
              </Select>,
            )}
          </Row>

          <Row className="mb10">
            <label className="label label-right ant-form-item-required">店总负责人</label>
            {getFieldDecorator('admin_name', {
              initialValue: companyInfo.admin_name,
              rules: [
                {
                  required: true,
                  message: validator.required.notNull,
                }, { validator: FormValidator.notNull }],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入" style={{ width: '160px' }} size="large" />,
            )}

            <label className="label ml10 ant-form-item-required">手机</label>
            {getFieldDecorator('admin_phone', {
              initialValue: companyInfo.admin_phone,
              rules: FormValidator.getRulePhoneNumber(),
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入" style={{ width: '160px' }} size="large" />,
            )}

            <label className="label ml25">咨询电话</label>
            {getFieldDecorator('hotline_phone_before', {
              initialValue: companyInfo.areaCode,
            })(
              <Input size="large" placeholder="区号" style={{ width: '50px' }} />,
            )}

            <span>-</span>

            {getFieldDecorator('hotline_phone_after', {
              initialValue: companyInfo.phone,
            })(
              <Input size="large" placeholder="请输入电话" style={{ width: '103px' }} />,
            )}

          </Row>

          <Row className="mb10">
            <label className="label label-right">其他联系人</label>
            {getFieldDecorator('other_name', {
              initialValue: companyInfo.other_name,
            })(
              <Input placeholder="请输入" style={{ width: '160px' }} size="large" />,
            )}

            <label className="label ml20">手机</label>
            {getFieldDecorator('other_phone', {
              initialValue: companyInfo.other_phone,
              rules: FormValidator.getRulePhoneNumber(false),
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入" style={{ width: '160px' }} size="large" />,
            )}

            <label className="label ml10">代理联系人</label>
            <Select
              showSearch
              style={{ width: 160 }}
              placeholder="选择代理人"
              optionFilterProp="children"
              onChange={this.handleAgentSelect}
              value={this.props.form.getFieldValue('sell_agent_id')}
              size="large"
            >
              <Option value="0">{''}</Option>
              {agentData.map(item =>
                <Option key={item._id} value={item._id}>{item.name}</Option>,
              )}
            </Select>

            <span className="ml20">
              <NewAgent addAgent={this.handleAddAgent} />
            </span>
          </Row>

          <Row className="mb10">
            <label className="label label-right">公司名称</label>
            {getFieldDecorator('business_license_name', {
              initialValue: companyInfo.business_license_name,
            })(
              <Input placeholder="请输入" style={{ width: '380px' }} size="large" />,
            )}

            <label className="label ml12">工商注册号</label>
            {getFieldDecorator('business_license', {
              initialValue: companyInfo.business_license,
            })(
              <Input placeholder="请输入" style={{ width: '160px' }} size="large" />,
            )}
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
          <Row className="mb25">
            <label className="label label-right">门店名称</label>
            <span className="font-size-14">{companyInfo.name}</span>
          </Row>

          <Row className="mb25">
            <label className="label label-right">省份</label>
            <span className="font-size-14">{companyInfo.province}</span>
            <span className="ml10 font-size-14">{companyInfo.city}</span>
            <span className="ml10 font-size-14">{companyInfo.country}</span>
          </Row>

          <Row className="mb25">
            <label className="label label-right">详细地址</label>
            <span className="font-size-14">{companyInfo.address}</span>
          </Row>

          <Row className="mb25">
            <label className="label label-right">门店类型</label>
            <span style={{
              display: 'inline-block',
              width: '160px',
              fontSize: '14px',
            }}>{text.companyType[companyInfo.company_type]}</span>

            <label className="label label-right">是否连锁</label>
            <span style={{ display: 'inline-block', width: '160px', fontSize: '14px' }}>
              {Number(companyInfo.chain_id) === 0 ? '否' : '是'}
            </span>

            <label className="label  label-right">关联连锁店面</label>
            <span className="font-size-14">{companyInfo.chain_name}</span>
          </Row>


          <Row className="mb25">
            <label className="label label-right">合作类型</label>
            <span style={{
              display: 'inline-block',
              width: '160px',
              fontSize: '14px',
            }}>{text.cooperationType[companyInfo.cooperation_type]}</span>

            <label className="label label-right">系统</label>
            <span className="font-size-14">{text.systemType[companyInfo.system_type]}</span>
          </Row>

          <Row className="mb25">
            <label className="label label-right">店总负责人</label>
            <span style={{ display: 'inline-block', width: '160px', fontSize: '14px' }}>
              {companyInfo.admin_name}
            </span>

            <label className="label label-right">手机</label>
            <span style={{ display: 'inline-block', width: '160px', fontSize: '14px' }}>
              {companyInfo.admin_phone}
            </span>

            <label className="label  label-right">咨询电话</label>
            <span className="font-size-14">{companyInfo.areaCode}</span>
            <span>-</span>
            <span className="font-size-14">{companyInfo.phone}</span>
          </Row>

          <Row className="mb25">
            <label className="label label-right">其他联系人</label>
            <span style={{ display: 'inline-block', width: '160px', fontSize: '14px' }}>
              {companyInfo.other_name}
            </span>

            <label className="label  label-right">手机</label>
            <span style={{ display: 'inline-block', width: '160px', fontSize: '14px' }}>
              {companyInfo.other_phone}
            </span>

            <label className="label  label-right">代理联系人</label>
            <span className="font-size-14">{companyInfo.sell_agent_name}</span>
          </Row>

          <Row className="mb25">
            <label className="label label-right">公司名称</label>
            <span style={{ display: 'inline-block', width: '380px', fontSize: '14px' }}>
              {companyInfo.business_license_name}
            </span>

            <label className="label ml50 label-right">工商注册号</label>
            <span className="font-size-14">{companyInfo.business_license}</span>
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
