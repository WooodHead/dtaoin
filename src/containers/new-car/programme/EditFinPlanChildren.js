import React from 'react';
import { message, Modal, Form, Button, Icon, Select, Row, Col, Input, Checkbox } from 'antd';
import Layout from '../../../utils/FormLayout';
import { bindActionCreators } from 'redux';
import BaseModal from '../../../components/base/BaseModal';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const InputGroup = Input.Group;

class EditFinPlanChildren extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBrandTrue: true,
      disabledModels: false,
      disabledCustom: true,
      product_id: '',
      auto_brand_id: '',
      auto_series_id: '',
      auto_type_id: '',
      guide_price: '',
      pickupModuleVisible: false,
      auto_type_version: '',
      auto_type_year: '',
      displacement: '',
      resource_id: '',
      type: '1',
    };
  }

  componentDidMount() {
    if (this.props.getPlanDetailData.length > 0) {
      this.setState({
        guide_price: this.props.getPlanDetailData.guide_price,
        product_id: this.props.getPlanDetailData.product_id,
        auto_brand_id: this.props.getPlanDetailData.auto_brand_id,
        auto_series_id: this.props.getPlanDetailData.auto_series_id,
        auto_type_id: this.props.getPlanDetailData.auto_type_id,
      });
    }
  }

  componentWillMount() {
    const data = {
      skip: 0,
      limit: '',
      resource_id: 2,
    };
    this.props.get_marketMaterialListData(data.skip, data.limit, data.resource_id);
  }

  componentWillReceiveProps(props2) {
    if ((this.props.getPlanDetailData !== props2.getPlanDetailData) &&
      (this.props.getPlanDetailData !== '' || [])) {
      this.setState({
        guide_price: this.props.getPlanDetailData.guide_price,
        product_id: this.props.getPlanDetailData.product_id,
        auto_brand_id: this.props.getPlanDetailData.auto_brand_id,
        auto_series_id: this.props.getPlanDetailData.auto_series_id,
        auto_type_id: this.props.getPlanDetailData.auto_type_id,
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
      this.props.get_typesBySeriesData(this.state.auto_series_id);
    }
  }

  onChangeMakeModule = e => {
    const is_have_serise = this.props.form.getFieldValue('auto_series_id');
    if (is_have_serise) {
      this.setState({
        disabledModels: true,
        pickupModuleVisible: true,
      });
    } else {
      alert('请选择车辆品牌和车系');
    }
  };
  handleChangeBrand = value => {
    this.setState({
      auto_brand_id: value,
    });
    this.props.form.setFieldsValue({
      auto_series_id: '',
      auto_type_id: '',
      module_auto_brand_id: '',
    });
    this.props.get_seriesByBrand(value);
  };
  handleChangeSeries = value => {
    const toArry = value.split('/');
    const toStringAuto_series_id = toArry[0];
    this.setState({
      auto_series_id: toStringAuto_series_id,
    });
    this.props.form.setFieldsValue({ module_auto_type_id: '' });
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
  change_guide_price = e => {
    const { value } = e.target;
    this.setState({ guide_price: value });
    this.props.form.setFieldsValue({ guide_price: value });
  };
  change_displacement = e => {
    const { value } = e.target;
    this.setState({
      displacement: value,
    });
    this.props.form.setFieldsValue({ displacement: value });
  };
  changeCustom = e => {
    this.setState({
      guide_price: e.target.value,
    });
  };
  sureCreateFin = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          plan_id: this.props.plan_id,
          auto_brand_id: values.auto_brand_id,
          auto_series_id: values.auto_series_id,
          auto_type_id: values.auto_type_id,
          product_id: values.product_id,
          guide_price: values.guide_price,
        };
        this.props.post_editLoanPlan(data);
      }
    });
  };
  cancelpickupModule = () => {
    this.setState({ pickupModuleVisible: false });
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

  post_createAutoType = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!values.module_guide_price) {
        message.error('厂商指导价不可为空');
        return;
      }
      if (!values.module_displacement) {
        message.error('排量不可为空');
        return;
      }
      const data = {
        auto_brand_id: values.auto_brand_id,
        auto_series_id: values.auto_series_id,
        auto_type_year: this.state.auto_type_year,
        auto_type_version: this.state.auto_type_version,
        guide_price: values.module_guide_price,
        displacement: values.module_displacement,
      };
      this.setState({
        guide_price: values.module_guide_price,
        displacement: values.module_displacement,
        auto_series_id: values.auto_series_id,
        pickupModuleVisible: false,
      });
      console.log(data);
      const auto_series_id = values.auto_series_id;
      this.props.post_createAutoType(data, autoTypeId => this.refresh(auto_series_id, autoTypeId));
    });
  };
  refresh = (auto_series_id, autoTypeId) => {
    this.props.get_typesBySeriesData(auto_series_id);
    this.props.form.setFieldsValue({ auto_type_id: String(autoTypeId) });
  };

  render() {
    const { getMarketProAllListData, getBrandsData, getSeriesByBrandData, getTypesBySeriesData, postCreateAutoTypeDataRes, postCreateLoanPlanDataRes } = this.props;
    const getMarketProAllListData2 = getMarketProAllListData.list;
    const getBrandsDataList = getBrandsData.auto_brand_list;
    const getSeriesByBrandDataList = getSeriesByBrandData.series;
    const getSeriesByBrandDataType = getTypesBySeriesData.type;
    const getPlanDetailData = this.props.getPlanDetailData;
    const propductList = [];
    if (getMarketProAllListData2) {
      for (let i = 0; i < getMarketProAllListData2.length; i++) {
        propductList.push(<Select.Option
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
        brandsListChildren.push(<Select.Option
          key={getSeriesByBrandDataList[i]._id}
          value={getSeriesByBrandDataList[i]._id}
        >
          {getSeriesByBrandDataList[i].name}
        </Select.Option>);
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
    const { formItemLayout, formItemLayoutHalf } = Layout;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="">
        <Row className="head-action-bar-line mb20">
          <Col span={8}>金融方案基本信息</Col>
          <Col span={16}>
            <Button style={{ float: 'right' }} type="primary" htmlType="submit"
                    onClick={this.sureCreateFin}>保存编辑</Button>
          </Col>
        </Row>

        <Form>
          <FormItem
            {...formItemLayoutHalf}
            label="产品名称"
          >
            {getFieldDecorator('product_name', {
              rules: [{ required: false, message: '产品名称', whitespace: false }],
              initialValue: getPlanDetailData.product_id,
            })(
              <Select placeholder="产品名称" disabled={true} style={{ width: 360 }}>
                {propductList}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="车辆品牌"
          >
            {getFieldDecorator('auto_brand_id', {
              rules: [{ required: false, message: '品牌', whitespace: false }],
              initialValue: getPlanDetailData.auto_brand_id,
            })(
              <Select placeholder="品牌" onChange={this.handleChangeBrand} style={{ width: 360 }}>
                {brandsList}
              </Select>,
            )}

          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="车系"
          >
            {getFieldDecorator('auto_series_id', {
              rules: [{ required: false, message: '车系', whitespace: false }],
              initialValue: getPlanDetailData.auto_series_id,
            })(
              <Select placeholder="车系" onChange={this.handleChangeSeries} style={{ width: 360 }}>
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
                  initialValue: getPlanDetailData.auto_type_id,
                  rules: [{ required: false, message: '车型', whitespace: false }],
                })(
                  <Select placeholder="车型"
                          onChange={this.handleChangeSeriesType}
                          style={{ width: 360 }}
                  >
                    {getSeriesByBrandDataTypeList}
                  </Select>,
                )}
              </Col>
              <Col span={8} offset={1}>
                <span onClick={this.onChangeMakeModule}><a>自定义车型</a></span>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="厂商指导价"
          >
            {getFieldDecorator('guide_price', {
              rules: [{ required: false, message: '厂商指导价格', whitespace: false }],
              initialValue: Number(getPlanDetailData.guide_price).toFixed(0),
            })(
              <Input placeholder="厂商指导价" type="number"
                     addonAfter={'元'} disabled={true} style={{ width: 360 }} />,
            )}
          </FormItem>
          <FormItem label="排量" {...formItemLayoutHalf}>
            {getFieldDecorator('displacement', {
              rules: [{ required: false, message: '排量', whitespace: true }],
              initialValue: getPlanDetailData.displacement,
            })(
              <Input placeholder="排量" type="number"
                     addonAfter={<span style={{ width: 14, display: 'block' }}>L</span>}
                     onBlur={this.change_displacement} disabled={true} style={{ width: 360 }} />,
            )}
          </FormItem>
        </Form>
        <Modal
          visible={this.state.pickupModuleVisible}
          onCancel={this.cancelpickupModule}
          maskClosable={true}
          footer={[
            <Button key="1" onClick={this.cancelpickupModule}>取消</Button>,
            <Button key="2" type="primary" onClick={this.post_createAutoType}> 确定</Button>,
          ]}
          title="自定义车型"
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="车辆品牌"
            >
              {getFieldDecorator('module_auto_brand_id', {
                initialValue: getPlanDetailData.auto_brand_id,
              })(
                <Select placeholder="品牌"
                        onChange={this.handleChangeBrand}
                        disabled={this.state.disabledModels}
                >
                  {brandsList}
                </Select>,
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="车系"
            >
              {getFieldDecorator('module_auto_series_id', {
                initialValue: getPlanDetailData.auto_series_id,
              })(
                <Select placeholder="车系" onChange={this.handleChangeSeries}
                        disabled={true}>
                  {brandsListChildren}
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="车型"
            >
              {getFieldDecorator('module_auto_type_id', {
                rules: [{ required: false, message: '车型', whitespace: true }],
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
            <FormItem label="厂商指导价" {...formItemLayout} required>
              {getFieldDecorator('module_guide_price', {
                initialValue: getPlanDetailData.guide_price,
              })(
                <Input placeholder="厂商指导价" type="number"
                       addonAfter={'元'}
                       onChange={this.change_guide_price}
                />,
              )}
            </FormItem>
            <FormItem label="排量" {...formItemLayout} required>
              {getFieldDecorator('module_displacement', {
                initialValue: getPlanDetailData.displacement,
              })(
                <Input placeholder="排量" type="number"
                       addonAfter={<span style={{ width: 14, display: 'block' }}>L</span>}
                       onChange={this.change_displacement}
                />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

EditFinPlanChildren = Form.create()(EditFinPlanChildren);
export default EditFinPlanChildren;
