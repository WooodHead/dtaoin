import React from 'react';
import {message, DatePicker, Row, Col, Form, Input, Select, Button, Collapse} from 'antd';

import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import Layout from '../../utils/FormLayout';
import FormValidator from '../../utils/FormValidator';

import BaseAuto from '../../components/base/BaseAuto';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class NewCustomerAutoForm extends BaseAuto {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      isNew: true,
      customer_id: '',
      memberLevels: [],
      memberPrice: 0,
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

      values.customer_id = this.state.customer_id;
      values.register_date = formatter.date(values.register_date);

      this.setState({isFetching: true});
      api.ajax({
        url: this.state.isNew ? api.customer.addCustomerAndAuto() : api.customer.edit(),
        type: 'POST',
        data: values,
      }, (data) => {
        message.success(this.state.isNew ? '新增客户成功!' : '修改客户成功!');
        this.setState({isFetching: false, isNew: false});
        this.props.onSuccess({
          customer_id: data.res.customer._id,
          customer_name: data.res.customer.name,
          customer_phone: data.res.customer.phone,
          _id: data.res.auto._id,
          plate_num: data.res.auto.plate_num,
        });
      }, () => {
        this.setState({isFetching: false});
        message.error('提交失败');
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
    const {formItemLg, formItemThree, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {customer_id, required} = this.props;
    let isRequired = required == 'false';

    const {
      isFetching,
      brands,
      series,
      types,
      outColor,
    } = this.state;

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
      <Form className="form-collapse">
        {getFieldDecorator('customer_id', {initialValue: customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('is_maintain', {initialValue: 1})(
          <Input type="hidden"/>
        )}

        <Collapse className="" defaultActiveKey={['1']}>
          <Panel header="客户基本信息" key="1">
            <Row>
              <Col span={8}>
                <FormItem label="姓名" {...formItemThree}>
                  {getFieldDecorator('name', {
                    initialValue: '',
                    rules: FormValidator.getRuleNotNull(),
                    validatorTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入姓名" addonAfter={selectGenderAfter}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="手机号" {...formItemThree}>
                  {getFieldDecorator('phone', {
                    initialValue: parseInt(this.props.inputValue) == this.props.inputValue ? this.props.inputValue : '',
                    rules: FormValidator.getRulePhoneNumber(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入手机号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="车牌号" {...formItemThree}>
                  {getFieldDecorator('plate_num', {
                    initialValue: parseInt(this.props.inputValue) != this.props.inputValue ? this.props.inputValue : '',
                    rules: FormValidator.getRulePlateNumber(!isRequired),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入车牌号"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="品牌" {...formItemThree}>
                  {getFieldDecorator('auto_brand_id', {
                    rules: FormValidator.getRuleNotNull(!isRequired),
                    validateTrigger: 'onBlur',
                  })(
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
              <Col span={8}>
                <FormItem label="车系" {...formItemThree}>
                  {getFieldDecorator('auto_series_id')(
                    <Select onSelect={this.handleSeriesSelect}{...selectStyle}>
                      <Option key="0">未知</Option>
                      {series.map(series => <Option key={series._id}>{series.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="车型" {...formItemThree}>
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
              <Col span={16}>
                <FormItem label="车型名称" {...formItemLg}>
                  {getFieldDecorator('auto_type_name')(
                    <Input placeholder="请输入车型描述"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="车架号" {...formItemThree}>
                  {getFieldDecorator('vin_num')(
                    <Input placeholder="请输入车架号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="发动机号" {...formItemThree}>
                  {getFieldDecorator('engine_num')(
                    <Input placeholder="请输入发动机号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="外观/内饰" {...formItemThree}>
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
                <FormItem label="微信号" {...formItemThree}>
                  {getFieldDecorator('weixin')(
                    <Input placeholder="请输入微信号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="QQ" {...formItemThree}>
                  {getFieldDecorator('qq')(
                    <Input type="number" placeholder="请输入QQ"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="邮箱" {...formItemThree}>
                  {getFieldDecorator('mail')(
                    <Input type="email" placeholder="请输入邮箱"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="身份证号" {...formItemThree} hasFeedback>
                  {getFieldDecorator('id_card_num')(
                    <Input placeholder="请输入身份证号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="身份证地址" {...formItemThree}>
                  {getFieldDecorator('id_card_address')(
                    <Input placeholder="请输入身份证地址"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="常住地址" {...formItemThree}>
                  {getFieldDecorator('address')(
                    <Input placeholder="请输入常住地址"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="驾驶证号" {...formItemThree}>
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
                <FormItem label="燃油" {...formItemThree}>
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
                <FormItem label="初登日期" {...formItemThree}>
                  {getFieldDecorator('register_date', {
                    initialValue: formatter.getMomentDate(),
                  })(
                    <DatePicker placeholder="请选择初登日期" allowClear={false}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="车辆型号" {...formItemThree}>
                  {getFieldDecorator('auto_type_num')(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="备注" {...formItemLg}>
                  {getFieldDecorator('remark')(
                    <Input type="textarea"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <div className="form-action-container">
          <Button type="ghost" onClick={this.props.cancelModal} className="mr10" size="large">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} size="large" loading={isFetching}
                  disabled={isFetching}>保存</Button>
        </div>
      </Form>
    );
  }
}

NewCustomerAutoForm = Form.create()(NewCustomerAutoForm);
export default NewCustomerAutoForm;
