import React from 'react';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Row,
  Select,
  Tooltip,
} from 'antd';
import BaseAutoComponent from '../../components/base/BaseAuto';
import Qiniu from '../../components/widget/UploadQiniu';
import Layout from '../../utils/FormLayout';
import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TextArea = Input.TextArea;

class NewAutoForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      autoDisabled: {
        brand: false,
        series: false,
        type: false,
        outColor: false,
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
      vehicle_license_pic_back_progress: [],
    };

    [
      'handlePrevStep',
      'handleNextStep',
      'handleSubmit',
      'handleAutoSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getAutoBrands();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.getCustomerAutos(nextProps.customer_id);
      this.getAutoBrands();
      this.props.onSuccess({ reload: false });
    }
  }

  handlePrevStep(e) {
    e.preventDefault();
    this.setState({
      first: true,
      auto: {},
      autos: [],
    });
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      customerForm: '',
      autoForm: 'hide',
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
      values.force_expire_date = formatter.date(values.force_expire_date);
      values.business_expire_date = formatter.date(values.business_expire_date);

      api.ajax({
        url: this.state.isNew ? api.auto.add() : api.auto.edit(),
        type: 'POST',
        data: values,
      }, data => {
        message.success(this.state.isNew ? '新增车辆成功' : '修改车辆成功');
        this.props.onSuccessAdd(data.res.auto_id);
        this.setState({ isNew: false });
        if (action === 'NEXT') {
          this.props.onSuccess({
            width: '900px',
            auto_id: data.res.auto_id,
            currentStep: this.props.nextStep,
            autoForm: 'hide',
            projectForm: '',
          });
        } else {
          this.props.cancelModal();
          // location.reload();
        }
      });
    });
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
          outColor: false,
        },
      });
    }

    for (const auto of this.state.autos) {
      if (auto._id === autoId) {
        this.props.onSuccess({ auto_id: autoId });
        this.setState({
          isNew: false,
          auto_id: autoId,
        });
        this.getPurchaseAutoDetail(auto.customer_id, auto._id);

        this.getAutoSeries(auto.auto_brand_id);
        this.getAutoTypes(auto.auto_series_id);
        break;
      }
    }
  }

  getPurchaseAutoDetail(customerId, autoId) {
    api.ajax({ url: api.auto.detail(customerId, autoId) }, data => {
      const detail = data.res.detail;
      // let brandId = detail.auto_brand_id;
      // let seriesId = detail.auto_series_id;
      this.setState({
        auto: detail,
        auto_factory_id: detail.auto_factory_id,
        brands_name: detail.auto_brand_name,
        series_name: detail.auto_series_name,
        types_name: detail.auto_type_name,
      });
    });
  }

  addAuto() {
    const form = this.props.form;
    form.resetFields();
    form.setFieldsValue({ select_auto: 'addAuto' });
    this.setState({
      isNew: true,
      auto: {},
      autoDisabled: {
        brand: false,
        series: false,
        type: false,
        outColor: false,
      },
    });
    this.getNewAutoId();
  }

  getCustomerAutos(customerId) {
    api.ajax({ url: api.presales.userAutoList(customerId) }, data => {
      let autos = data.res.auto_list,
        auto = {},
        isNew = true;

      if (autos.length > 0) {
        const firstAuto = autos[0];
        isNew = false;
        auto = firstAuto;
        this.props.form.setFieldsValue({ select_auto: firstAuto._id });
      } else {
        this.getNewAutoId();
      }
      this.setState({
        isNew,
        auto,
        autos,
      });
    });
  }

  getNewAutoId() {
    api.ajax({ url: api.auto.genNewId() }, data => {
      const userAutoId = data.res.auto_id;
      this.setState({ auto_id: userAutoId });
      this.props.onSuccess(data.res);
    });
  }

  render() {
    const { formItem8_15, formItem4_19, selectStyle } = Layout;
    const { getFieldDecorator } = this.props.form;
    const {
      newAuto,
      newProject,
    } = this.props;
    const {
      auto,
      isNew,
      // autos,
      brands,
      series,
      types,
      // brands_name,
      // series_name,
      // types_name,
      outColor,
    } = this.state;

    if (auto.auto_brand_name == undefined) auto.auto_brand_name = '';
    if (auto.auto_series_name == undefined) auto.auto_series_name = '';
    if (auto.auto_type_name == undefined) auto.auto_type_name = '';
    // let autoTypeName = (Number(getFieldDecorator('auto_type_id').value) > 0) ? (brands_name + ' ' + series_name + ' ' + types_name) : (auto.auto_brand_name + ' ' + auto.auto_series_name + ' ' + auto.auto_type_name);

    return (
      <Form className="form-collapse">
        {getFieldDecorator('customer_id', { initialValue: this.props.customer_id })(
          <Input type="hidden" />,
        )}

        {isNew
          ? getFieldDecorator('auto_id', { initialValue: this.state.auto_id })(
            <Input type="hidden" />,
          )
          : getFieldDecorator('_id', { initialValue: this.state.auto_id || this.state.auto._id })(
            <Input type="hidden" />,
          )}

        {getFieldDecorator('auto_factory_id', { initialValue: this.state.auto_factory_id })(
          <Input type="hidden" />,
        )}

        <Collapse defaultActiveKey={['1']}>
          <Panel header="基本信息" key="1">

            {/*
             <FormItem label="选择车辆" {...formItemLayout} className={'hide'} required>
             {getFieldDecorator('select_auto', {initialValue: 'addAuto'})(
             <Select
             onSelect={this.handleAutoSelect}
             {...selectStyle}>
             {autos.map((auto) => <Option key={auto._id}>{auto.auto_type_name}</Option>)}
             <Option key='addAuto'>新增车辆</Option>
             </Select>
             )}
             </FormItem>
             */}

            <Row>
              <Col span={12}>
                <FormItem label="车牌号" {...formItem8_15}>
                  {getFieldDecorator('plate_num', {
                    rules: FormValidator.getRulePlateNumber(true),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入车牌号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="品牌" {...formItem8_15}>
                  {getFieldDecorator('auto_brand_id', {
                    rules: FormValidator.getRuleNotNull(),
                    validatorTrigger: 'onBlur',
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
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <div className="form-line-divider" />

            <Row>
              <Col span={12}>
                <FormItem label="车系" {...formItem8_15}>
                  {getFieldDecorator('auto_series_id')(
                    <Select onSelect={this.handleSeriesSelect} {...selectStyle}>
                      <Option key="0">未知</Option>
                      {series.map(series => <Option key={series._id}>{series.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="车型" {...formItem8_15}>
                  {getFieldDecorator('auto_type_id')(
                    <Select onSelect={this.handleTypeSelect} {...selectStyle}>
                      <Option key="0">未知</Option>
                      {types.map(type => <Option
                        key={type._id}>{type.year} {type.version}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="外观" {...formItem8_15}>
                  {getFieldDecorator('out_color')(
                    <Select{...selectStyle}>
                      <Option key="0">未知</Option>
                      {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="车型名称" {...formItem8_15}>
                  {getFieldDecorator('auto_type_name')(
                    <Input placeholder="请输入车型描述" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <div className="form-line-divider" />

            <Row>
              <Col span={12}>
                <FormItem label="车架号" {...formItem8_15}>
                  {getFieldDecorator('vin_num', { initialValue: auto.vin_num })(
                    <Input placeholder="请输入车架号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="发动机号" {...formItem8_15}>
                  {getFieldDecorator('engine_num', { initialValue: auto.engine_num })(
                    <Input placeholder="请输入发动机号" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="燃油" {...formItem8_15}>
                  {getFieldDecorator('energy_type', {
                    initialValue: auto.energy_type
                      ? auto.energy_type.toString()
                      : '-1',
                  })(
                    <Select {...selectStyle} placeholder="请选择燃油类型">
                      <Option key="-1">未知</Option>
                      <Option key="0">汽油</Option>
                      <Option key="1">柴油</Option>
                      <Option key="2">新能源</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="初登日期" {...formItem8_15}>
                  <div>
                    {getFieldDecorator('register_date', {
                      initialValue: auto.register_date
                        ? formatter.getMomentDate(auto.register_date)
                        : formatter.getMomentDate(),
                    })(
                      <DatePicker size="large" placeholder="请选择初登日期" allowClear={false} />,
                    )}

                    <Tooltip title="初登日期指交管所车辆的登记日期，亦即年检日期" arrowPointAtCenter>
                      <Icon type="question-circle-o" className="help-icon-font" />
                    </Tooltip>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Panel>

          <Panel header="保险信息" key="2">
            <Row>
              <Col span={12}>
                <FormItem label="交强险承保公司" {...formItem8_15}>
                  {getFieldDecorator('force_company')(
                    <Input placeholder="交强险承保公司" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="交强险到期日期" {...formItem8_15}>
                  {getFieldDecorator('force_expire_date')(
                    <DatePicker placeholder="交强险到期日" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="商业险承保公司" {...formItem8_15}>
                  {getFieldDecorator('business_company')(
                    <Input placeholder="请输入商业险承保公司" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="商业险到期日期" {...formItem8_15}>
                  {getFieldDecorator('business_expire_date')(
                    <DatePicker placeholder="商业险到期日" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="商业险总额" {...formItem8_15}>
                  {getFieldDecorator('business_amount')(
                    <Input placeholder="请输入商业险总额" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>

          <Panel header="其它信息" key="3">
            <Row>
              <Col span={12}>
                <FormItem label="内饰" {...formItem8_15}>
                  {getFieldDecorator('in_color', { initialValue: auto.in_color })(
                    <Select {...selectStyle}>
                      <Option key="-1">未知</Option>
                      <Option key="0">米</Option>
                      <Option key="1">棕</Option>
                      <Option key="2">黑</Option>
                      <Option key="3">灰</Option>
                      <Option key="4">红</Option>
                      <Option key="5">蓝</Option>
                      <Option key="6">白</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="车辆型号" {...formItem8_15}>
                  {getFieldDecorator('auto_type_num', { initialValue: auto.auto_type_num })(
                    <Input placeholder="请输入车辆型号" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="销售地" {...formItem8_15}>
                  {getFieldDecorator('source', { initialValue: auto.source })(
                    <Input placeholder="请输入销售地" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="来源4S店" {...formItem8_15}>
                  {getFieldDecorator('source_4s', { initialValue: auto.source_4s })(
                    <Input placeholder="请输入来源4S店" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="行驶证照片" {...formItem8_15}>
                  <span className="mr10">
                    {getFieldDecorator('vehicle_license_pic_front')(
                      <Input type="hidden" />,
                    )}
                    <Qiniu
                      prefix="vehicle_license_pic_front"
                      saveKey={this.handleKey.bind(this)}
                      source={api.system.getPrivatePicUploadToken('vehicle_license_pic_front')}
                      onDrop={this.onDrop.bind(this, 'vehicle_license_pic_front')}
                      onUpload={this.onUpload.bind(this, 'vehicle_license_pic_front')}>
                      {this.renderImage('vehicle_license_pic_front')}
                    </Qiniu>
                  </span>
                  <span className="hide">
                    {getFieldDecorator('vehicle_license_pic_back')(
                      <Input type="hidden" />,
                    )}
                    <Qiniu
                      prefix="vehicle_license_pic_back"
                      saveKey={this.handleKey.bind(this)}
                      source={api.system.getPrivatePicUploadToken('vehicle_license_pic_back')}
                      onDrop={this.onDrop.bind(this, 'vehicle_license_pic_back')}
                      onUpload={this.onUpload.bind(this, 'vehicle_license_pic_back')}>
                      {this.renderImage('vehicle_license_pic_back')}
                    </Qiniu>
                  </span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="备注"{...formItem4_19}>
                  {getFieldDecorator('remark', { initialValue: auto.remark })(
                    <TextArea placeholder="备注" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <div className="form-action-container">
          {(() => {
            if (newAuto) {
              return (
                <span>
                  <Button size="large" onClick={this.props.cancelModal} className="mr10">取消</Button>
                  <Button size="large" type="primary"
                          onClick={this.handleSubmit.bind(this)}>保存</Button>
                </span>
              );
            } else {
              return (
                <span>
                  <Button size="large" type="ghost" onClick={this.handlePrevStep}
                          className={newProject ? 'hide' : 'mr15'}>上一步</Button>
                  <Button size="large" type="primary" className="mr15"
                          onClick={this.handleNextStep}>下一步</Button>
                  <Button size="large" type="ghost" onClick={this.handleSubmit}>保存并退出</Button>
                </span>
              );
            }
          })()}
        </div>
      </Form>
    );
  }
}

NewAutoForm = Form.create()(NewAutoForm);
export default NewAutoForm;
