import React from 'react';
import {
  Table,
  Icon,
  Tabs,
  Row,
  Col,
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  Popconfirm,
  Radio,
  Select,
  message,
} from 'antd';

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
require('./index.less');
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  get_marketProAllList,
  get_marketMaterialListData,
} from '../../../reducers/new-car/product/productActions';
import {
  get_brands,
  get_seriesByBrand,
  get_typesBySeries,
  post_createLoanPlan,
  post_createAmountFixPlan,
  post_createAutoType,
  get_planDetail,
} from '../../../reducers/new-car/programe/programeActions';

class EditVehiPlayChildren extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationVisible: false,
      delivery_Data: [],
      application_Data: [],
      financeConfig: [],
      moneyState: 1,
      product_id: '',
      auto_brand_id: '',
      auto_series_id: '',
      auto_type_id: '',
      guide_price: '',
      pickupModuleVisible: false,
      makeModuleCar: false,
      auto_factory_id: '',
      auto_type_version: '',
      auto_type_year: '',
      displacement: '',
      out_in_colors: '',
      remark: '',
      finance_length_type12: '',
      finance_length_type36: '',
      finance_length_type48: '',
      finance_length_type24: '',
      monthly_rent: '',
      cash_deposit: '',
      rent_down_payment: '',
      salvage_value: '',
      service_fee: '',
      pay_service_fee_in_down_payment: 0,
      finance_config: '',
    };
  }

  show_applicationModule = () => {
    this.setState({
      applicationVisible: true,
    });
  };
  show_pickupModule = () => {
    this.setState({
      pickupModuleVisible: true,
    });
  };
  cancelpickupModule = () => {
    this.setState({ pickupModuleVisible: false });
  };
  cancelapplicationModule = () => {
    this.setState({ applicationVisible: false });
  };

  componentDidMount() {
    this.props.actions.get_planDetail(this.props.planId, this.getMaterialAndMonthPayment.bind(this));
  }

  getMaterialAndMonthPayment(data) {
    this.setState({
      application_Data: data.application_material_list,
      delivery_Data: data.pickup_material_list,
      financeConfig: data.detail.finance_config
        ? JSON.parse(data.detail.finance_config)
        : [],
    });
    this.props.get_marketMaterialListData(data.skip, data.limit, data.detail.resource_id);
  }

  componentWillReceiveProps(props2) {
    if ((this.props.getPlanDetailData !== props2.getPlanDetailData) &&
      (this.props.getPlanDetailData !== '' || [])) {
      const getPlanDetailData = props2.getPlanDetailData;
      this.setState({
        product_id: getPlanDetailData.product_id,
        auto_brand_id: getPlanDetailData.auto_brand_id,
        auto_series_id: getPlanDetailData.auto_series_id,
        auto_type_id: getPlanDetailData.auto_type_id,
        out_in_colors: getPlanDetailData.out_in_colors,
        guide_price: getPlanDetailData.guide_price,
        displacement: getPlanDetailData.displacement,
        rent_down_payment: getPlanDetailData.rent_down_payment,
        monthly_rent: getPlanDetailData.monthly_rent,
        salvage_value: getPlanDetailData.salvage_value,
        cash_deposit: getPlanDetailData.cash_deposit,
        service_fee: getPlanDetailData.service_fee,
        finance_config: getPlanDetailData.finance_config,
        remark: getPlanDetailData.remark,
        pickup_material_ids: getPlanDetailData.pickup_material_ids,
        application_material_ids: getPlanDetailData.application_material_ids,
        pay_service_fee_in_down_payment: getPlanDetailData.pay_service_fee_in_down_payment,
      });
    }
    if (!this.regReport) return;
    this.regReport = false;
    if (props2.postCreateAutoTypeDataRes !== '' || null || undefined &&
      this.props.postCreateAutoTypeDataRes.auto_type_id !==
      props2.postCreateAutoTypeDataRes.auto_type_id) {
      this.setState({
        auto_type_id: props2.postCreateAutoTypeDataRes.auto_type_id,
      });
    }
  }

  changeProduct = e => {
    this.setState({
      product_id: e,
    });
  };
  makeCarModuleChange = e => {
    const is_have_serise = this.state.auto_series_id;
    if (is_have_serise) {
      this.setState({
        makeModuleCar: true,
      });
    } else {
      message.error('请选择车辆品牌和车系！');
    }
  };
  handleChangeBrand = value => {
    this.setState({
      auto_brand_id: value,
    });

    this.props.form.setFieldsValue({ auto_series_id: '', auto_type_id: '' });
    this.props.get_seriesByBrand(value);
  };
  handleChangeSeries = value => {
    const toArry = value.split('/');
    const toStringAuto_series_id = toArry[0];
    this.setState({
      auto_series_id: toStringAuto_series_id,
      auto_factory_id: '',
    });
    this.props.form.setFieldsValue({ auto_type_id: '' });
    this.props.get_typesBySeriesData(value.split('/')[0]);
  };
  handleChangeSeriesType = value => {
    this.setState({
      auto_type_id: value,
    });
    this.getGuideAndDisplacement(value);
  };

  getGuideAndDisplacement(id) {
    const getTypesBySeriesData = this.props.getTypesBySeriesData.type;
    let chooseCarType = {};
    getTypesBySeriesData.forEach(item => {
      if (String(item._id) === String(id)) {
        chooseCarType = item;
      }
    });
    this.props.form.setFieldsValue({
      guide_price: chooseCarType.guide_price,
      displacement: chooseCarType.displacement,
    });
    this.setState({
      guide_price: chooseCarType.guide_price,
      displacement: chooseCarType.displacement,
    });
  }

  cancelCoumstModule = () => {
    this.setState({ makeModuleCar: false });
  };
  change_auto_type_version = e => {
    this.setState({
      auto_type_version: e.target.value,
    });
  };
  change_auto_type_year = e => {
    this.setState({
      auto_type_year: e.target.value,
    });
  };
  change_out_in_colors = e => {
    this.setState({
      out_in_colors: e.target.value,
    });
  };
  change_guide_price = e => {
    this.setState({
      guide_price: e.target.value,
    });
  };
  change_displacement = e => {
    this.setState({
      displacement: e.target.value,
    });
  };

  change_rent_down_payment = e => {
    this.setState({
      rent_down_payment: e.target.value,
    });
  };

  change_monthly_rent = e => {
    this.setState({
      monthly_rent: e.target.value,
    });
  };
  change_salvage_value = e => {
    this.setState({
      salvage_value: e.target.value,
    });
  };
  change_cash_deposit = e => {
    this.setState({
      cash_deposit: e.target.value,
    });
  };
  change_service_fee = e => {
    this.setState({
      service_fee: e.target.value,
    });
  };
  change_service_remark = e => {
    this.setState({
      remark: e.target.value,
    });
  };

  change_finance_config(record, e) {
    const value = e.target.value;
    const { financeConfig } = this.state;

    const financeConfigChange = financeConfig.map(item => {
      if (String(item.finance_length_type) === String(record.finance_length_type)) {
        item.monthly_payment = value;
      }
      return item;
    });

    this.setState({ financeConfig: financeConfigChange });
  }

  fuWuFei_shou_fu = e => {
    if (e.target.checked) {
      this.setState({
        pay_service_fee_in_down_payment: 1,
      });
    }
    if (e.target.checked == false) {
      this.setState({
        pay_service_fee_in_down_payment: 0,
      });
    }
  };
  post_createAutoType = () => {
    const data = {
      auto_brand_id: this.state.auto_brand_id,
      // auto_factory_id: this.state.auto_factory_id,
      auto_series_id: this.state.auto_series_id,
      auto_type_year: this.state.auto_type_year,
      auto_type_version: this.state.auto_type_version,
      guide_price: this.state.guide_price,
      displacement: this.state.displacement,
    };
    this.setState({
      makeModuleCar: false,
    });
    const auto_series_id = this.state.auto_series_id;
    this.props.post_createAutoType(data, autoTypeId => this.refresh(auto_series_id, autoTypeId));
  };
  refresh = (auto_series_id, autoTypeId) => {
    this.props.get_typesBySeriesData(auto_series_id);

    this.setState({
      auto_type_id: autoTypeId,
    });
    this.props.form.setFieldsValue({ auto_type_id: String(autoTypeId) });
  };
  onChange = (record, e) => {
    const application_Data = this.state.application_Data;
    if (e.target.checked) {
      this.setState({ application_Data: [...application_Data, record] });
    }
    if (e.target.checked == false) {
      this.deleteApplication_Data(record._id);
    }
  };
  onChangePickup = (record, e) => {
    const delivery_Data = this.state.delivery_Data;
    if (e.target.checked) {
      this.setState({ delivery_Data: [...delivery_Data, record] });
    }
    if (e.target.checked == false) {
      this.deleteDelivery_Data(record._id);
    }
  };
  deleteApplication_Data = _id => {
    const application_Data = [...this.state.application_Data];
    this.setState({
      application_Data: application_Data.filter(application_Data => application_Data._id !== _id),
    });
  };
  deleteDelivery_Data = _id => {
    const delivery_Data = [...this.state.delivery_Data];
    this.setState({
      delivery_Data: delivery_Data.filter(delivery_Data => delivery_Data._id !== _id),
    });
  };
  sureCreateCarPlay = () => {
    const delivery_Data = this.state.delivery_Data;
    const application_Data = this.state.application_Data;
    const financeConfig = this.state.financeConfig;

    const application_material_ids = [];
    const pickup_material_ids = [];
    for (var i = 0, len = application_Data.length; i < len; i++) {
      application_material_ids.push(application_Data[i]._id);
    }
    for (var i = 0, len = delivery_Data.length; i < len; i++) {
      pickup_material_ids.push(delivery_Data[i]._id);
    }
    const strApplication_material_ids = application_material_ids.join(',');
    const strPickup_material_ids = pickup_material_ids.join(',');
    const strabc = JSON.stringify(financeConfig);
    const data = {
      plan_id: this.props.plan_id,
      product_id: this.state.product_id,
      auto_brand_id: this.state.auto_brand_id,
      auto_series_id: this.state.auto_series_id,
      auto_type_id: this.state.auto_type_id,
      out_in_colors: this.state.out_in_colors,
      guide_price: this.state.guide_price,
      displacement: this.state.displacement,
      rent_down_payment: this.state.rent_down_payment,
      monthly_rent: this.state.monthly_rent,
      salvage_value: this.state.salvage_value,
      cash_deposit: this.state.cash_deposit,
      service_fee: this.state.service_fee,
      finance_config: strabc,
      remark: this.state.remark,
      pickup_material_ids: strPickup_material_ids,
      application_material_ids: strApplication_material_ids,
      pay_service_fee_in_down_payment: this.state.pay_service_fee_in_down_payment,
    };
    this.props.post_editAmountFixPlan(data);
  };

  isChoose(chooseItems, currentId) {
    if (Number(chooseItems.length) > 0) {
      for (let i = 0; i < chooseItems.length; i++) {
        if (String(chooseItems[i]._id) === String(currentId)) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const {
      getMarketProAllListData,
      getBrandsData,
      getSeriesByBrandData,
      getTypesBySeriesData,
      getMarketMaterialListData,
      postCreateAmountFixPlanDataRes,
      outColor,
      getPlanDetailData,
    } = this.props;

    const { delivery_Data, application_Data, financeConfig } = this.state;

    const getMarketProAllListData2 = getMarketProAllListData.list;
    const getBrandsDataList = getBrandsData.auto_brand_list;
    const getSeriesByBrandDataList = getSeriesByBrandData.series;
    const getSeriesByBrandDataType = getTypesBySeriesData.type;
    const marketMaterialListData = getMarketMaterialListData.list;
    const { visible } = this.state;
    const { formItemLayout, formItemLayoutHalf, formItemLayoutThree } = Layout;
    const { getFieldDecorator } = this.props.form;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const self = this;
    const monTableColumns = [
      {
        title: '期限',
        dataIndex: 'finance_length_type',
        key: 'finance_length_type',
        render: value => `${value  }期`,
      }, {
        title: '月供（元）',
        key: 'monthly_payment',
        dataIndex: 'monthly_payment',
        render: (value, record) => (
          <span>
             <Input
               placeholder="请输入"
               onChange={self.change_finance_config.bind(self, record)}
               suffix={<span>元</span>}
               value={value}
             />
          </span>
        ),
      }];
    const monTabledata = financeConfig;
    const rouceList = [];
    if (getMarketProAllListData2) {
      for (let i = 0; i < getMarketProAllListData2.length; i++) {
        rouceList.push(<Select.Option
          key={getMarketProAllListData2[i]._id}
          value={getMarketProAllListData2[i]._id}
          title={getMarketProAllListData2[i].name}>
          {getMarketProAllListData2[i].name}
        </Select.Option>);
      }
    }
    // 车辆品牌
    const brandsList = [];
    if (getBrandsDataList) {
      for (let i = 0; i < getBrandsDataList.length; i++) {
        brandsList.push(<Select.Option
          key={getBrandsDataList[i]._id}
          title={getBrandsDataList[i].name}
          value={getBrandsDataList[i]._id}
        >
          {getBrandsDataList[i].name}
        </Select.Option>);
      }
    }
    // 车系
    const brandsListChildren = [];
    if (getSeriesByBrandDataList) {
      for (let i = 0; i < getSeriesByBrandDataList.length; i++) {
        brandsListChildren.push(
          <Select.Option
            key={getSeriesByBrandDataList[i]._id}
            value={getSeriesByBrandDataList[i]._id}
          >
            {getSeriesByBrandDataList[i].name}
          </Select.Option>,
        );
      }
    }

    // 车型
    const getSeriesByBrandDataTypeList = [];
    if (getSeriesByBrandDataType) {
      for (let i = 0; i < getSeriesByBrandDataType.length; i++) {
        getSeriesByBrandDataTypeList.push(<Select.Option
          key={getSeriesByBrandDataType[i]._id}
          value={getSeriesByBrandDataType[i]._id}
        >
          {`${getSeriesByBrandDataType[i].version  },${  getSeriesByBrandDataType[i].year}`}
        </Select.Option>);
      }
    }

    const applicationColumns = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
              <Checkbox
                onChange={e => this.onChange(record, e)}
                checked={this.isChoose(application_Data, record._id)}
              >
              </Checkbox>
          </span>
        ),
      }];
    const pickupColumns = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
              <Checkbox
                onChange={e => this.onChangePickup(record, e)}
                checked={this.isChoose(delivery_Data, record._id)}
              >
              </Checkbox>
          </span>

        ),
      }];
    // 删除deleteApplication_Data
    const columnsModuleApplication = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Popconfirm title="确定要删除此项吗?" onConfirm={() => this.deleteApplication_Data(record._id)}>
              <a href="#">删除</a>
            </Popconfirm>
          ),
      }];
    // 删除columnsModuleDelivery
    const columnsModuleDelivery = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Popconfirm title="确定要删除此项吗?" onConfirm={() => this.deleteDelivery_Data(record._id)}>
              <a href="#">删除</a>
            </Popconfirm>
          ),
      }];

    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={8}>车型方案基本信息</Col>
          <Col span={16}>
            <Button style={{ float: 'right' }} type="primary" onClick={this.sureCreateCarPlay}>
              保存编辑
            </Button>
          </Col>
        </Row>

        <div style={{ paddingTop: 20 }} className="finBingPro">
          <Form>
            <FormItem
              {...formItemLayoutHalf}
              label="产品名称"
            >
              {getFieldDecorator('产品名称', {
                rules: [{ required: true, message: '产品名称', whitespace: true }],
                initialValue: getPlanDetailData.product_name,
              })(
                <Select placeholder="产品名称"
                        onChange={this.changeProduct}
                        disabled={!!this.props.plan_id}
                        style={{ width: '360px' }}>
                  {rouceList}
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutHalf}
              label="车辆品牌"
            >
              {getFieldDecorator('auto_brand_id', {
                rules: [{ required: true, message: '品牌', whitespace: true }],
                initialValue: getPlanDetailData.auto_brand_id,
              })(
                <Select placeholder="品牌"
                        onSelect={this.handleChangeBrand}
                        style={{ width: '360px' }}>
                  {brandsList}
                </Select>,
              )}

            </FormItem>
            <FormItem
              {...formItemLayoutHalf}
              label="车系"
            >
              {getFieldDecorator('auto_series_id', {
                rules: [{ required: true, message: '车系', whitespace: true }],
                initialValue: getPlanDetailData.auto_series_id,
              })(
                <Select placeholder="车系" onSelect={this.handleChangeSeries}
                        style={{ width: '360px' }}>
                  {brandsListChildren}
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutHalf}
              label="车型"
            >
              <Row>
                <Col span={10}>
                  {getFieldDecorator('auto_type_id', {
                    rules: [{ required: true, message: '车型', whitespace: true }],
                    initialValue: getPlanDetailData.auto_type_id,
                  })(
                    <Select placeholder="车型"
                            onSelect={this.handleChangeSeriesType}
                            style={{ width: '360px' }}>
                      {getSeriesByBrandDataTypeList}
                    </Select>,
                  )}
                </Col>
                <Col span={8} offset={1}>
                  <span onClick={this.makeCarModuleChange}><a>自定义车型</a></span>
                </Col>
              </Row>
            </FormItem>
            <FormItem
              label="外观／内饰"
              {...formItemLayoutHalf}
            >
              {getFieldDecorator('out_in_colors', {
                initialValue: getPlanDetailData.out_in_colors,
              })(
                <Input placeholder="请输入外观／内饰颜色。示例：外白内黑；外黑内白"
                       onBlur={this.change_out_in_colors}
                       style={{ width: '360px' }}
                />,
              )
              }
            </FormItem>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="厂商指导价"
                >
                  {getFieldDecorator('guide_price', {
                    rules: [{ required: true, message: '厂商指导价', whitespace: true }],
                    initialValue: Number(getPlanDetailData.guide_price).toFixed(0),
                  })(
                    <Input addonAfter={'元'} type="number" min="1"
                           placeholder="请输入"
                           disabled={true} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="排量"
                >
                  {getFieldDecorator('displacement', {
                    rules: [{ required: true, message: '排量', whitespace: true }],
                    initialValue: getPlanDetailData.displacement,
                  })(
                    <Input addonAfter={<span style={{ width: 14, display: 'block' }}>L</span>}
                           type="number" min="1"
                           placeholder="请输入"
                           disabled={true} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="首付"
                >
                  {getFieldDecorator('rent_down_payment', {
                    rules: [{ required: true, message: '首付', whitespace: true }],
                    initialValue: Number(getPlanDetailData.rent_down_payment).toFixed(0),
                  })(
                    <Input addonAfter={'元'} type="number" min="1"
                           placeholder="请输入"
                           onBlur={this.change_rent_down_payment} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="月租"
                >
                  {getFieldDecorator('monthly_rent', {
                    rules: [{ required: true, message: '月租', whitespace: true }],
                    initialValue: Number(getPlanDetailData.monthly_rent).toFixed(0),
                  })(
                    <Input addonAfter={'元'} type="number" min="1"
                           placeholder="请输入"
                           onBlur={this.change_monthly_rent} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="残值"
                >
                  {getFieldDecorator('salvage_value', {
                    rules: [{ required: true, message: '残值', whitespace: true }],
                    initialValue: Number(getPlanDetailData.salvage_value).toFixed(0),
                  })(
                    <Input addonAfter={'元'} type="number" min="1"
                           placeholder="请输入"
                           onBlur={this.change_salvage_value} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="保证金"
                >
                  {getFieldDecorator('cash_deposit', {
                    rules: [{ required: true, message: '保证金', whitespace: true }],
                    initialValue: Number(getPlanDetailData.cash_deposit).toFixed(0),
                  })(
                    <Input addonAfter={'元'} type="number" min="1"
                           placeholder="请输入"
                           onBlur={this.change_cash_deposit} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label="服务费"
                >
                  {getFieldDecorator('service_fee', {
                    rules: [{ required: true, message: '服务费', whitespace: true }],
                    initialValue: Number(getPlanDetailData.service_fee).toFixed(0),
                  })(
                    <Input addonAfter={'元'} type="number" min="1"
                           placeholder="请输入"
                           onBlur={this.change_service_fee} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutThree}
                  label=""
                >
                  {getFieldDecorator('pay_service_fee_in_down_payment')(
                    <div className="ml20">
                      <Checkbox onChange={this.fuWuFei_shou_fu}>服务费计入首付</Checkbox>
                    </div>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem
              {...formItemLayoutHalf}
              label="月供设置"
            >
              {getFieldDecorator('finance_config', {
                rules: [{ required: true, message: '月供设置', whitespace: false }],
                initialValue: getPlanDetailData.finance_config,
              })(
                <Table
                  columns={monTableColumns}
                  dataSource={monTabledata}
                  pagination={false}
                  style={{ width: 360 }}
                />,
              )}
            </FormItem>
            <FormItem
              label="可选套餐"
              {...formItemLayoutHalf}
            >
              {getFieldDecorator('remark', {
                initialValue: getPlanDetailData.remark,
              })(
                <TextArea placeholder="可描述套餐的优惠项，金额等内容" onBlur={this.change_service_remark}
                          autosize={{ minRows: 2, maxRows: 6 }} style={{ width: 360 }} />,
              )
              }
            </FormItem>

          </Form>
        </div>


        <div>
          <Row className="head-action-bar-line mb20">
            <Col span={8}>申请材料</Col>
            <Col span={16}>
              <Button style={{ float: 'right' }} onClick={this.show_applicationModule}>
                添加材料
              </Button>
            </Col>
            <Modal
              visible={this.state.applicationVisible}
              onCancel={this.cancelapplicationModule}
              maskClosable={true}
              footer={[]}
              title="申请材料"
            >
              <Table columns={applicationColumns} dataSource={marketMaterialListData}
                     pagination={true} />
            </Modal>
          </Row>
          <div>
            <Table className="material_table" columns={columnsModuleApplication} dataSource={this.state.application_Data}
                   pagination={false} />
          </div>
          <Row className="head-action-bar-line mb20" style={{ marginTop: 30 }}>
            <Col span={8}>交车材料</Col>
            <Col span={16}>
              <Button style={{ float: 'right' }} onClick={this.show_pickupModule}>
                添加材料
              </Button>
            </Col>
            <Modal
              visible={this.state.pickupModuleVisible}
              onCancel={this.cancelpickupModule}
              maskClosable={true}
              footer={null}
              title="交车材料"
            >
              <Table columns={pickupColumns} dataSource={marketMaterialListData}
                     pagination={true} />
            </Modal>
          </Row>
          <Table className="material_table" columns={columnsModuleDelivery} dataSource={this.state.delivery_Data}
                 pagination={false} />
        </div>
        <Modal
          visible={this.state.makeModuleCar}
          onCancel={this.cancelCoumstModule}
          maskClosable={true}
          footer={[
            <Button key="1" onClick={this.cancelCoumstModule}>取消</Button>,
            <Button key="2" type="primary" onClick={this.post_createAutoType}> 确定</Button>,
          ]}
          title="自定义车型"
        >

          <Form>
            <FormItem
              {...formItemLayout}
              label="车辆品牌"
            >
              {getFieldDecorator('auto_brand_id', {
                initialValue: getPlanDetailData.auto_brand_id,
              })(
                <Select placeholder="品牌"
                        disabled>
                  {brandsList}
                </Select>,
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="车系"
            >
              {getFieldDecorator('auto_series_id', {
                initialValue: getPlanDetailData.auto_series_id,
              })(
                <Select placeholder="车系" disabled>
                  {brandsListChildren}
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="车型"
            >
              {getFieldDecorator('auto_type_id_no', {
                rules: [{ required: true, message: '车型', whitespace: true }],
              })(
                <InputGroup size="large">
                  <Col span={12}>
                    <Input defaultValue="" placeholder="车型：例如2017款型"
                           onBlur={this.change_auto_type_year} />
                  </Col>
                  <Col span={12}>
                    <Input defaultValue="" placeholder="车型名称：例如豪华版"
                           onBlur={this.change_auto_type_version} />
                  </Col>
                </InputGroup>,
              )}
            </FormItem>
            <FormItem label="厂商指导价" {...formItemLayout}>
              {getFieldDecorator('guide_price', {
                rules: FormValidator.getRuleNotNull(),
              })(
                <Input placeholder="厂商指导价" type="number" addonAfter={'元'}
                       onBlur={this.change_guide_price} />,
              )}
            </FormItem>
            <FormItem label="排量" {...formItemLayout}>
              {getFieldDecorator('displacement', {
                rules: FormValidator.getRuleNotNull(),
              })(
                <Input placeholder="排量" type="number"
                       addonAfter={<span style={{ width: 14, display: 'block' }}>L</span>}
                       onBlur={this.change_displacement} />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

EditVehiPlayChildren = Form.create()(EditVehiPlayChildren);

function mapStateToProps(state) {
  const { getMarketProAllListData, getMarketMaterialListData } = state.productDate;
  const { outColor } = state.orderDetail;
  const { getBrandsData, getSeriesByBrandData, getTypesBySeriesData, postCreateLoanPlanDataRes, postCreateAmountFixPlanDataRes, postCreateAutoTypeDataRes, getPlanDetailData } = state.programeData;
  return {
    getMarketProAllListData,
    getBrandsData,
    getSeriesByBrandData,
    getTypesBySeriesData,
    postCreateLoanPlanDataRes,
    postCreateAmountFixPlanDataRes,
    postCreateAutoTypeDataRes,
    getMarketMaterialListData,
    outColor,
    getPlanDetailData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      get_marketProAllList,
      get_brands,
      get_seriesByBrand,
      get_typesBySeries,
      post_createLoanPlan,
      post_createAmountFixPlan,
      post_createAutoType,
      get_marketMaterialListData,
      get_planDetail,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVehiPlayChildren);
