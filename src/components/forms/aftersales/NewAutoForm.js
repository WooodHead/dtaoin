import React from 'react'
import {message, Icon, Form, Input, Button, Select, DatePicker, Row, Col, Collapse} from 'antd'
import BaseAutoComponent from '../../base/BaseAuto'
import Qiniu from '../../../middleware/UploadQiniu'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import validator from '../../../middleware/validator'
import FormValidator from '../FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class NewAutoForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      autoDisabled: {
        brand: true,
        series: true,
        type: true,
        outColor: true
      },
      auto_id: '',
      auto: {},
      autos: [],
      brands: [],
      series: [],
      types: [],
      brands_name: '',
      series_name: '',
      types_name: '',
      outColor: [],
      auto_factory_id: '',
      vehicle_license_pic_front_files: [],
      vehicle_license_pic_back_files: [],
      vehicle_license_pic_front_progress: [],
      vehicle_license_pic_back_progress: []
    };
    [
      'handlePrevStep',
      'handleNextStep',
      'handleSubmit',
      'handleAutoSelect'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {customer_id, user_auto_id} = this.props;
    this.getAutoBrands();
    if (customer_id) {
      this.getCustomerAutos(customer_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.getCustomerAutos(nextProps.customer_id);
      this.getAutoBrands();
      this.props.onSuccess({reload: false});
    }
  }

  handlePrevStep(e) {
    e.preventDefault();
    this.setState({
      first: true,
      auto: {},
      autos: []
    });
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      customerForm: '',
      autoForm: 'hide'
    });
  }

  handleNextStep(e) {
    e.preventDefault();
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      values.register_date = formatter.date(values.register_date);

      api.ajax({
        url: this.state.isNew ? api.addAuto() : api.editAuto(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success(this.state.isNew ? '新增车辆成功' : '修改车辆成功');
        this.setState({isNew: false});
        if (action === 'NEXT') {
          this.props.onSuccess({
            width: '900px',
            user_auto_id: data.res.user_auto_id,
            currentStep: this.props.nextStep,
            autoForm: 'hide',
            projectForm: ''
          });
        } else {
          this.props.cancelModal();
          location.reload();
        }
      }.bind(this));
    })
  }

  handleAutoSelect(autoId) {
    if (autoId == 'addAuto') {
      this.getAutoBrands();
      this.addAuto();
      return false;
    } else {
      this.setState({
        autoDisabled: {
          brand: false,
          series: false,
          type: false,
          outColor: false
        }
      });
    }

    for (let auto of this.state.autos) {
      if (auto._id === autoId) {
        this.props.onSuccess({user_auto_id: autoId});
        this.setState({
          isNew: false,
          auto_id: autoId
        });
        this.getPurchaseAutoDetail(auto.customer_id, auto._id);

        this.getAutoSeries(auto.auto_brand_id);
        this.getAutoTypes(auto.auto_series_id);
        break;
      }
    }
  }

  getPurchaseAutoDetail(customerId, autoId) {
    api.ajax({url: api.getAutoDetail(customerId, autoId)}, function (data) {
      let detail = data.res.detail,
        brandId = detail.auto_brand_id,
        seriesId = detail.auto_series_id;
      this.setState({
        auto: detail,
        auto_factory_id: detail.auto_factory_id,
        brands_name: detail.auto_brand_name,
        series_name: detail.auto_series_name,
        types_name: detail.auto_type_name
      });
    }.bind(this))
  }

  addAuto() {
    let form = this.props.form;
    form.resetFields();
    form.setFieldsValue({select_auto: 'addAuto'});
    this.setState({
      isNew: true,
      auto: {},
      autoDisabled: {
        brand: false,
        series: false,
        type: false,
        outColor: false
      }
    });
    this.getNewAutoId();
  }

  getCustomerAutos(customerId) {
    api.ajax({url: api.purchasedAutoList(customerId)}, function (data) {
      let autos = data.res.user_auto_list,
        auto = {},
        isNew = true;

      if (autos.length > 0) {
        let firstAuto = autos[0];
        isNew = false;
        auto = firstAuto;
        this.props.form.setFieldsValue({select_auto: firstAuto._id});
      } else {
        this.getNewAutoId();
      }
      this.setState({
        isNew: isNew,
        auto: auto,
        autos: autos
      });
    }.bind(this))
  }

  getNewAutoId() {
    api.ajax({url: api.generateNewAutoId()}, function (data) {
      let customerId = this.props.customer_id,
        userAutoId = data.res.user_auto_id;
      this.setState({auto_id: userAutoId});
      this.props.onSuccess(data.res);
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {
      newAuto,
      newProject,
      customer_id,
      user_auto_id
    } = this.props;
    const {
      autoDisabled,
      auto,
      isNew,
      autos,
      brands,
      series,
      types,
      brands_name,
      series_name,
      types_name,
      outColor
    } = this.state;

    const plateNumProps = getFieldProps('plate_num', {
      validate: [{
        rules: [{validator: FormValidator.validatePlateNumber}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.plateNumber}],
        trigger: 'onBlur'
      }]
    });

    if (auto.auto_brand_name == undefined) auto.auto_brand_name = '';
    if (auto.auto_series_name == undefined) auto.auto_series_name = '';
    if (auto.auto_type_name == undefined) auto.auto_type_name = '';
    let autoTypeName = (Number(getFieldProps('auto_type_id').value) > 0) ? (brands_name + ' ' + series_name + ' ' + types_name) : (auto.auto_brand_name + ' ' + auto.auto_series_name + ' ' + auto.auto_type_name);

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>
        {isNew ?
          <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: this.state.auto_id})}/>
          :
          <Input type="hidden" {...getFieldProps('_id', {initialValue: this.state.auto_id || this.state.auto._id})}/>
        }
        <Input type="hidden" {...getFieldProps('auto_factory_id', {initialValue: this.state.auto_factory_id})}/>

        <Collapse defaultActiveKey={['1']}>
          <Panel header="基本信息" key="1">

            <FormItem label="车牌号" {...formItemLayout}>
              <Input {...plateNumProps} placeholder="请输入车牌号"/>
            </FormItem>

           {/*<FormItem label="选择车辆" {...formItemLayout} required>
              <Select
                onSelect={this.handleAutoSelect}
                {...getFieldProps('select_auto')}
                size="large"
                {...selectStyle}>
                {autos.map((auto) => <Option key={auto._id}>{auto.auto_type_name}</Option>)}
                <Option key='addAuto'>新增车辆</Option>
              </Select>
            </FormItem>*/}

            <FormItem label="品牌" {...formItemLayout} required>
              <Select
                showSearch
                onSelect={this.handleBrandSelect}
                optionFilterProp="children"
                placeholder="请选择品牌"
                notFoundContent="无法找到"
                searchPlaceholder="输入品牌"
                size="large"
                {...selectStyle}
                {...getFieldProps('auto_brand_id')}
              >
                {brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem label="车系" {...formItemLayout}>
              <Select
                onSelect={this.handleSeriesSelect}
                size="large"
                {...selectStyle}
                {...getFieldProps('auto_series_id')}
              >
                <Option key="0">未知</Option>
                {series.map(series => <Option key={series._id}>{series.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem label="车型" {...formItemLayout}>
              <Select
                onSelect={this.handleTypeSelect}
                {...getFieldProps('auto_type_id')}
                {...selectStyle}
                size="large">
                <Option key="0">未知</Option>
                {types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
              </Select>
            </FormItem>

            <FormItem label="外观" {...formItemLayout}>
              <Select {...getFieldProps('out_color')}
                      size="large"
                      {...selectStyle}>
                <Option key="0">未知</Option>
                {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem label="车型名称" {...formItemLayout}>
              <Input {...getFieldProps('auto_type_name')} placeholder="请输入车型描述"/>
            </FormItem>



            <FormItem label="车架号" {...formItemLayout}>
              <Input {...getFieldProps('vin_num', {initialValue: auto.vin_num})} placeholder="请输入车架号"/>
            </FormItem>

            <FormItem label="发动机号" {...formItemLayout}>
              <Input {...getFieldProps('engine_num', {initialValue: auto.engine_num})} placeholder="请输入发动机号"/>
            </FormItem>

            <FormItem label="燃油" {...formItemLayout}>
              <Select
                {...getFieldProps('energy_type', {initialValue: auto.energy_type ? auto.energy_type.toString() : '-1'})}
                {...selectStyle}
                size="large"
                placeholder="请选择燃油类型">
                <Option key="-1">未知</Option>
                <Option key="0">汽油</Option>
                <Option key="1">柴油</Option>
                <Option key="2">新能源</Option>
              </Select>
            </FormItem>
          </Panel>

          <Panel header="其它信息" key="2">
            <FormItem label="初登日期" {...formItemLayout}>
              <DatePicker
                {...getFieldProps('register_date', {initialValue: auto.register_date ? auto.register_date : new Date()})}
                placeholder="请选择初登日期"
              />
            </FormItem>

            <FormItem label="内饰" {...formItemLayout}>
              <Select
                {...getFieldProps('in_color', {initialValue: auto.in_color})}
                {...selectStyle}
                size="large">
                <Option key="-1">未知</Option>
                <Option key="0">米</Option>
                <Option key="1">棕</Option>
                <Option key="2">黑</Option>
                <Option key="3">灰</Option>
                <Option key="4">红</Option>
                <Option key="5">蓝</Option>
                <Option key="6">白</Option>
              </Select>
            </FormItem>

            <FormItem label="销售地" {...formItemLayout}>
              <Input {...getFieldProps('source', {initialValue: auto.source})} placeholder="请输入销售地"/>
            </FormItem>

            <FormItem label="来源4S店" {...formItemLayout}>
              <Input {...getFieldProps('source_4s', {initialValue: auto.source_4s})} placeholder="请输入来源4S店"/>
            </FormItem>

            <FormItem label="车辆型号" {...formItemLayout}>
              <Input {...getFieldProps('auto_type_num', {initialValue: auto.auto_type_num})} placeholder="请输入车辆型号"/>
            </FormItem>

            <FormItem label="行驶证照片" {...formItemLayout}>
              <Row>
                <Col span="10">
                  <Input type="hidden" {...getFieldProps('vehicle_license_pic_front')} />
                  <Qiniu
                    prefix="vehicle_license_pic_front"
                    saveKey={this.handleKey.bind(this)}
                    source={api.getAutoUploadToken(customer_id, user_auto_id, 'vehicle_license_pic_front')}
                    onDrop={this.onDrop.bind(this, 'vehicle_license_pic_front')}
                    onUpload={this.onUpload.bind(this, 'vehicle_license_pic_front')}>
                    {this.renderImage('vehicle_license_pic_front')}
                  </Qiniu>
                </Col>
                <Col span="10" className="hide">
                  <Input type="hidden" {...getFieldProps('vehicle_license_pic_back')} />
                  <Qiniu
                    prefix="vehicle_license_pic_back"
                    saveKey={this.handleKey.bind(this)}
                    source={api.getAutoUploadToken(customer_id, user_auto_id, 'vehicle_license_pic_back')}
                    onDrop={this.onDrop.bind(this, 'vehicle_license_pic_back')}
                    onUpload={this.onUpload.bind(this, 'vehicle_license_pic_back')}>
                    {this.renderImage('vehicle_license_pic_back')}
                  </Qiniu>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="备注"{...formItemLayout}>
              <Input {...getFieldProps('remark', {initialValue: auto.remark})} type="textarea" placeholder="备注"/>
            </FormItem>
          </Panel>
        </Collapse>

        <FormItem {...buttonLayout} className={newAuto ? 'hide' : "margin-top-40"}>
          <Button type="ghost" onClick={this.handlePrevStep} className={newProject ? 'hide' : 'mr15'}>
            上一步
          </Button>
          <Button type="primary" className="mr15" onClick={this.handleNextStep}>下一步</Button>
          <Button type="ghost" onClick={this.handleSubmit}>保存并退出</Button>
        </FormItem>

        <FormItem {...buttonLayout} className={newAuto ? 'margin-top-40' : "hide"}>
          <Button type="primary" className="mr15" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewAutoForm = Form.create()(NewAutoForm);
export default NewAutoForm
