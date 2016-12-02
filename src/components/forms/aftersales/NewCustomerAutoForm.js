import React from 'react'
import {message, DatePicker, Icon, Row, Col, Form, Input, Select, Radio, Button, Collapse} from 'antd'
import BaseAutoComponent from '../../base/BaseAuto'
import Layout from '../Layout'
import api from '../../../middleware/api'
import validator from '../../../middleware/validator'
import formatter from '../../../middleware/formatter'
import FormValidator from '../FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class NewCustomerAutoForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      customer_id: '',
      customer: {},
      memberLevels: [],
      memberPrice: 0,
      auto: {},
      brands: [],
      series: [],
      types: [],
      brands_name: '',
      series_name: '',
      types_name: '',
      outColor: [],
    };
  }

  componentDidMount() {
    this.getMemberLevels();
    this.getAutoBrands();
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }
      values.register_date = formatter.date(values.register_date);
      values.customer_id = this.state.customer_id;

      api.ajax({
        url: this.state.isNew ? api.addCustomerAndAuto() : api.editCustomer(),
        type: 'POST',
        data: values
      }, (data) => {
        message.success(this.state.isNew ? '新增客户成功!' : '修改客户成功!');
        this.setState({isNew: false});
        this.props.onSuccess({
          customer_id: data.res.customer._id,
          customer_name: data.res.customer.name,
          customer_phone: data.res.customer.phone,
          _id: data.res.user_auto._id,
          plate_num: data.res.user_auto.plate_num,
        });
      });
    });
  }

  handleLevelChange(levelId) {
    this.state.memberLevels.forEach((item) => {
      if (levelId.toString() === item._id.toString()) {
        this.setState({memberPrice: item.price});
      }
    })
  }

  getMemberLevels() {
    api.ajax({url: api.getMemberConfig()}, (data) => {
      this.setState({memberLevels: data.res.member_levels});
    });
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {customer_id} = this.props;
    const {
      auto,
      customer,
      brands,
      series,
      types,
      outColor,
      sourceType,
      memberLevels,
      memberPrice
    } = this.state;

    const phoneProps = getFieldProps('phone', {
      initialValue: parseInt(this.props.inputValue) == this.props.inputValue ? this.props.inputValue : '',
      validate: [{
        rules: [{validator: FormValidator.validatePhone}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: true, message: validator.required.phone}],
        trigger: ['onBlur', 'onChange']
      }]
    });

    const idCardProps = getFieldProps('id_card_num', {
      validate: [{
        rules: [{validator: FormValidator.validateIdCard}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: false, message: validator.required.idCard}],
        trigger: 'onBlur'
      }]
    });

    const plateNumProps = getFieldProps('plate_num', {
      initialValue: parseInt(this.props.inputValue) != this.props.inputValue ? this.props.inputValue : '',
      validate: [{
        rules: [{validator: FormValidator.validatePlateNumber}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.plateNumber}],
        trigger: 'onBlur'
      }]
    });

    const selectGenderAfter = (
      <Select style={{width: 70}} {...getFieldProps('gender', {initialValue: '1'})}>
        <Option value={'1'}>先生</Option>
        <Option value={'0'}>女士</Option>
        <Option value={'-1'}>未知</Option>
      </Select>
    );
    const selectInColorAfter = (
      <Select
        size="large"
        {...selectStyle}
        {...getFieldProps('in_color', {initialValue: '-1'})}
      >
        <Option value={'-1'}>未知</Option>
        <Option value={'0'}>米</Option>
        <Option value={'1'}>棕</Option>
        <Option value={'2'}>黑</Option>
        <Option value={'3'}>灰</Option>
        <Option value={'4'}>红</Option>
        <Option value={'5'}>蓝</Option>
        <Option value={'6'}>白</Option>
      </Select>
    );

    return (
      <Form horizontal>
        {[''].map(()=>{console.log(1)})}
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: customer_id})}/>
        <Input type="hidden" {...getFieldProps('is_maintain', {initialValue: 1})}/>

        {[''].map(()=>{console.log(2)})}
        <Collapse className="padding-top-15" defaultActiveKey={['1']}>
          <Row>
            <Col span="7">
              <FormItem label="姓名" labelCol={{span: 6}} wrapperCol={{span: 15}} required>
                <Input {...getFieldProps('name')} placeholder="请输入姓名" addonAfter={selectGenderAfter}/>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="手机号" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <Input {...phoneProps} placeholder="请输入手机号"/>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="会员信息" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <Row>
                  <Col span="18">
                    <Select
                      onSelect={this.handleLevelChange.bind(this)}
                      {...getFieldProps('member_level', {initialValue: '0'})}
                      size="large"
                      {...selectStyle}>
                      {memberLevels.map(level => <Option key={level._id}>{level.desc}</Option>)}
                    </Select>
                  </Col>
                  <Col span="2">
                    <p className="ant-form-split">--</p>
                  </Col>
                  <Col span="4">
                    <p className="ant-form-text">{memberPrice}元</p>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          {[''].map(()=>{console.log(3)})}
          <Row>
            <Col span="7">
              <FormItem label="品牌" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}
                        required>
                <Select
                  showSearch
                  onSelect={this.handleBrandSelect}
                  optionFilterProp="children"
                  placeholder="请选择品牌"
                  notFoundContent="无法找到"
                  searchPlaceholder="输入品牌"
                  size="large"
                  {...selectStyle}
                  {...getFieldProps('auto_brand_id')}>
                  {brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
                </Select>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="车系" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <Select
                  onSelect={this.handleSeriesSelect}
                  size="large"
                  {...selectStyle}
                  {...getFieldProps('auto_series_id')}>
                  <Option key="0">未知</Option>
                  {series.map(series => <Option key={series._id}>{series.name}</Option>)}
                </Select>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="车型" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <Select
                  onSelect={this.handleTypeSelect}
                  {...getFieldProps('auto_type_id')}
                  {...selectStyle}
                  size="large">
                  <Option key="0">未知</Option>
                  {types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
                </Select>
              </FormItem>
            </Col>
          </Row>
          {[''].map(()=>{console.log(4)})}
          <Row>
            <Col span="14">
              <FormItem label="车型名称" {...formItemLayout} labelCol={{span: 3}} wrapperCol={{span: 19}}>
                <Input {...getFieldProps('auto_type_name')} placeholder="请输入车型描述"/>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="车牌号" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}} required>
                <Input {...plateNumProps} placeholder="请输入车牌号"/>
              </FormItem>
            </Col>
          </Row>
          {[''].map(()=>{console.log(5)})}
          <Row>
            <Col span="7">
              <FormItem label="车架号" {...formItemLayout}>
                <Input {...getFieldProps('vin_num')} placeholder="请输入车架号"/>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="发动机号" {...formItemLayout}>
                <Input {...getFieldProps('engine_num')} placeholder="请输入发动机号"/>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="外观/内饰" {...formItemLayout}>
                <Row>
                  <Col span="11">
                    <Select {...getFieldProps('out_color', {initialValue: '未知'})}
                            size="large"
                            {...selectStyle}>
                      <Option key="0">未知</Option>
                      {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
                    </Select>
                  </Col>
                  <Col span="2">
                    <p className="ant-form-split">/</p>
                  </Col>
                  <Col span="11">
                    {selectInColorAfter}
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>

          {[''].map(()=>{console.log(6)})}

          <Panel header="客户其他信息" key="p2">
            {[''].map(()=>{console.log(7)})}
            <Row>
              <Col span="8">
                <FormItem label="微信号" {...formItemLayout}>
                  <Input {...getFieldProps('weixin')} placeholder="请输入微信号"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="QQ" {...formItemLayout}>
                  <Input type="number" {...getFieldProps('qq')} placeholder="请输入QQ"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="邮箱" {...formItemLayout}>
                  <Input type="email" {...getFieldProps('mail')} placeholder="请输入邮箱"/>
                </FormItem>
              </Col>
            </Row>
            {[''].map(()=>{console.log(8)})}
            <Row>
              <Col span="8">
                <FormItem label="身份证号" {...formItemLayout} hasFeedback>
                  <Input {...getFieldProps('id_card_num')} placeholder="请输入身份证号"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="身份证地址" {...formItemLayout}>
                  <Input {...getFieldProps('id_card_address')}
                         placeholder="请输入身份证地址"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="常住地址" {...formItemLayout}>
                  <Input {...getFieldProps('address')} placeholder="请输入常住地址"/>
                </FormItem>
              </Col>
            </Row>
            {[''].map(()=>{console.log(8)})}
            <Row>
              <Col span="8">
                <FormItem label="驾驶证号" {...formItemLayout}>
                  <Input {...getFieldProps('driver_license_num')}
                         placeholder="请输入驾驶证号"/>
                </FormItem>
              </Col>
            </Row>
          </Panel>

          {[''].map(()=>{console.log(9)})}

          <Panel header="车辆其他信息" key="p3">
            {[''].map(()=>{console.log(10)})}
            <Row>
              <Col span="8">
                <FormItem label="燃油" {...formItemLayout}>
                  <Select
                    {...getFieldProps('energy_type', {initialValue: '-1'})}
                    {...selectStyle}
                    size="large"
                    placeholder="请选择燃油类型">
                    <Option key="-1">未知</Option>
                    <Option key="0">汽油</Option>
                    <Option key="1">柴油</Option>
                    <Option key="2">新能源</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="初登日期" {...formItemLayout}>
                  <DatePicker
                    {...getFieldProps('register_date', {initialValue: new Date()})}
                    placeholder="请选择初登日期"
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="车辆型号" {...formItemLayout}>
                  <Input type="text" {...getFieldProps('auto_type_num')}/>
                </FormItem>
              </Col>
            </Row>
            {[''].map(()=>{console.log(11)})}
            <Row>
              <Col span="24">
                <FormItem label="备注" {...formItemLayout} labelCol={{span: 3}} wrapperCol={{span: 19}}>
                  <Input type="textarea" {...getFieldProps('remark')}/>
                </FormItem>
              </Col>
            </Row>
            {[''].map(()=>{console.log(12)})}

          </Panel>

        </Collapse>
        {[''].map(()=>{console.log(13)})}

        <FormItem {...buttonLayout} className="margin-top-40">
          <Button type="ghost" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
        {[''].map(()=>{console.log(14)})}
      </Form>
    )
  }
}

NewCustomerAutoForm = Form.create()(NewCustomerAutoForm);
export default NewCustomerAutoForm
