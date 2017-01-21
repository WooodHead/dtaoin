import React from 'react';
import {message, DatePicker, Row, Col, Form, Input, Select, Button, Collapse} from 'antd';
import BaseAutoComponent from '../../base/BaseAuto';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import formatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class NewCustomerAutoForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      customer_id: '',
      // customer: {},
      memberLevels: [],
      memberPrice: 0,
      // auto: {},
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

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }
      values.register_date = formatter.date(values.register_date);
      values.customer_id = this.state.customer_id;

      api.ajax({
        url: this.state.isNew ? api.customer.addCustomerAndAuto() : api.customer.edit(),
        type: 'POST',
        data: values,
      }, (data) => {
        message.success(this.state.isNew ? '新增客户成功!' : '修改客户成功!');
        this.setState({isNew: false});
        this.props.onSuccess({
          customer_id: data.res.customer._id,
          customer_name: data.res.customer.name,
          customer_phone: data.res.customer.phone,
          _id: data.res.auto._id,
          plate_num: data.res.auto.plate_num,
        });
      });
    });
  }

  handleLevelChange(levelId) {
    this.state.memberLevels.forEach((item) => {
      if (levelId.toString() === item._id.toString()) {
        this.setState({memberPrice: item.price});
      }
    });
  }

  getMemberLevels() {
    api.ajax({url: api.customer.getMemberConfig()}, (data) => {
      this.setState({memberLevels: data.res.member_levels});
    });
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {customer_id} = this.props;
    const {
      // auto,
      // customer,
      brands,
      series,
      types,
      outColor,
      // sourceType,
      // memberLevels,
      // memberPrice,
    } = this.state;


    // const idCardProps = getFieldDecorator('id_card_num', {
    //   validate: [{
    //     rules: [{validator: FormValidator.validateIdCard}],
    //     trigger: ['onBlur', 'onChange'],
    //   }, {
    //     rules: [{required: false, message: validator.required.idCard}],
    //     trigger: 'onBlur',
    //   }],
    // });

    const selectGenderAfter = (
      getFieldDecorator('gender', {initialValue: '1'})(
        <Select style={{width: 70}}>
          <Option value={'1'}>先生</Option>
          <Option value={'0'}>女士</Option>
          <Option value={'-1'}>未知</Option>
        </Select>
      )
    );

    const selectInColorAfter = (
      getFieldDecorator('in_color', {initialValue: '-1'})(
        <Select {...selectStyle}>
          <Option value={'-1'}>未知</Option>
          <Option value={'0'}>米</Option>
          <Option value={'1'}>棕</Option>
          <Option value={'2'}>黑</Option>
          <Option value={'3'}>灰</Option>
          <Option value={'4'}>红</Option>
          <Option value={'5'}>蓝</Option>
          <Option value={'6'}>白</Option>
        </Select>
      )
    );

    return (
      <Form horizontal>
        {getFieldDecorator('customer_id', {initialValue: customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('is_maintain', {initialValue: 1})(
          <Input type="hidden"/>
        )}

        <Collapse className="" defaultActiveKey={['1']}>
          <Panel header="客户信息" key="1">
            <Row>
              <Col span={7}>
                <FormItem label="姓名" labelCol={{span: 6}} wrapperCol={{span: 15}} required>
                  {getFieldDecorator('name', {
                    initialValue: '',
                  })(
                    <Input placeholder="请输入姓名" addonAfter={selectGenderAfter}/>
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="手机号" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                  {getFieldDecorator('phone', {
                    initialValue: parseInt(this.props.inputValue) == this.props.inputValue ? this.props.inputValue : '',
                    rules: [{
                      required: true,
                      message: validator.required.phone,
                    }, {validator: FormValidator.validatePhone}],
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入手机号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="车牌号" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}} required>
                  {getFieldDecorator('plate_num', {
                    initialValue: parseInt(this.props.inputValue) != this.props.inputValue ? this.props.inputValue : '',
                    rules: [{
                      required: true,
                      message: validator.required.plateNumber,
                    }, {validator: FormValidator.validatePlateNumber}],
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入车牌号"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <FormItem label="品牌" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}
                          required>
                  {getFieldDecorator('auto_brand_id')(
                    <Select
                      showSearch
                      onSelect={this.handleBrandSelect}
                      optionFilterProp="children"
                      placeholder="请选择品牌"
                      notFoundContent="无法找到"
                      searchPlaceholder="输入品牌"
                      {...selectStyle}
                    >
                      {brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="车系" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                  {getFieldDecorator('auto_series_id')(
                    <Select onSelect={this.handleSeriesSelect}{...selectStyle}>
                      <Option key="0">未知</Option>
                      {series.map(series => <Option key={series._id}>{series.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="车型" {...formItemLayout} labelCol={{span: 6}} wrapperCol={{span: 15}}>
                  {getFieldDecorator('auto_type_id')(
                    <Select onSelect={this.handleTypeSelect} {...selectStyle}>
                      <Option key="0">未知</Option>
                      {types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <FormItem label="车型名称" {...formItemLayout} labelCol={{span: 2}} wrapperCol={{span: 22}}>
                  {getFieldDecorator('auto_type_name')(
                    <Input placeholder="请输入车型描述"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <FormItem label="车架号" {...formItemLayout}>
                  {getFieldDecorator('vin_num')(
                    <Input placeholder="请输入车架号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="发动机号" {...formItemLayout}>
                  {getFieldDecorator('engine_num')(
                    <Input placeholder="请输入发动机号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="外观/内饰" {...formItemLayout}>
                  <Row>
                    <Col span={11}>
                      {getFieldDecorator('out_color', {initialValue: '未知'})(
                        <Select {...selectStyle}>
                          <Option key="0">未知</Option>
                          {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
                        </Select>
                      )}
                    </Col>
                    <Col span={2}>
                      <p className="ant-form-split">/</p>
                    </Col>
                    <Col span={11}>
                      {selectInColorAfter}
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
          </Panel>
          <Panel header="客户其它信息" key="p2">
            <Row>
              <Col span={8}>
                <FormItem label="微信号" {...formItemLayout}>
                  {getFieldDecorator('weixin')(
                    <Input placeholder="请输入微信号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="QQ" {...formItemLayout}>
                  {getFieldDecorator('qq')(
                    <Input type="number" placeholder="请输入QQ"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="邮箱" {...formItemLayout}>
                  {getFieldDecorator('mail')(
                    <Input type="email" placeholder="请输入邮箱"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="身份证号" {...formItemLayout} hasFeedback>
                  {getFieldDecorator('id_card_num')(
                    <Input placeholder="请输入身份证号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="身份证地址" {...formItemLayout}>
                  {getFieldDecorator('id_card_address')(
                    <Input placeholder="请输入身份证地址"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="常住地址" {...formItemLayout}>
                  {getFieldDecorator('address')(
                    <Input placeholder="请输入常住地址"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="驾驶证号" {...formItemLayout}>
                  {getFieldDecorator('driver_license_num')(
                    <Input placeholder="请输入驾驶证号"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>

          <Panel header="车辆其他信息" key="p3">
            <Row>
              <Col span={8}>
                <FormItem label="燃油" {...formItemLayout}>
                  {getFieldDecorator('energy_type', {initialValue: '-1'})(
                    <Select {...selectStyle} placeholder="请选择燃油类型">
                      <Option key="-1">未知</Option>
                      <Option key="0">汽油</Option>
                      <Option key="1">柴油</Option>
                      <Option key="2">新能源</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="初登日期" {...formItemLayout}>
                  {getFieldDecorator('register_date', {initialValue: formatter.getMomentDate()})(
                    <DatePicker placeholder="请选择初登日期"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="车辆型号" {...formItemLayout}>
                  {getFieldDecorator('auto_type_num')(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="备注" {...formItemLayout} labelCol={{span: 3}} wrapperCol={{span: 19}}>
                  {getFieldDecorator('remark')(
                    <Input type="textarea"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>

        </Collapse>

        <FormItem {...buttonLayout} className="margin-top-40">
          <Button type="ghost" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}

NewCustomerAutoForm = Form.create()(NewCustomerAutoForm);
export default NewCustomerAutoForm;
