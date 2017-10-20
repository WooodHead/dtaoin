import React from 'react';
import { message, Modal, Form, Button, Icon, Select, Row, Col, Input, Checkbox } from 'antd';
import BaseModal from '../../../components/base/BaseModal';

require('./index.less');
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const InputGroup = Input.Group;

class AddFinPlanChildren extends React.Component {
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
      auto_factory_id: '',
      auto_type_version: '',
      auto_type_year: '',
      displacement: '',
      auto_series_factory_id: '',
      is_made_moduleCar: false,
    };
  }

  changeProduct = e => {
    this.setState({
      product_id: e,
    });
  };
  makeCarModule = e => {
    const is_have_serise = this.props.form.getFieldValue('auto_series_id');
    this.props.get_seriesByBrand(this.state.auto_brand_id);
    if (is_have_serise) {
      this.setState({
        disabledModels: true,
        pickupModuleVisible: true,
        is_made_moduleCar: false,
      });
    } else {
      message.error('请选择车辆品牌和车系');
    }
  };
  handleChangeBrand = value => {
    this.setState({
      auto_brand_id: value,
    });

    this.props.get_seriesByBrand(value);
    this.props.form.setFieldsValue({ auto_series_id: '', auto_type_id: '' });
  };
  handleChangeSeries = value => {
    console.log(value);
    const toArry = value.split('/');
    const toStringAuto_series_id = toArry[0];
    const toStringAuto_factory_id = toArry[1];
    this.setState({
      auto_series_factory_id: value,
      auto_series_id: toStringAuto_series_id,
      auto_factory_id: toStringAuto_factory_id,
    });
    this.props.get_typesBySeriesData(value.split('/')[0]);

    this.props.form.setFieldsValue({ auto_type_id: '' });
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
  }

  sureCreateFin = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          auto_brand_id: values.auto_brand_id,
          auto_series_id: values.auto_series_id,
          auto_type_id: values.auto_type_id,
          product_id: values.product_id,
          guide_price: this.state.guide_price,
          displacement: this.state.displacement,
        };
        this.props.post_createLoanPlan(data);
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

  change_guide_price(e) {
    const { value } = e.target;
    this.setState({ guide_price: value });
    this.props.form.setFieldsValue({ guide_price: value });
  }

  change_displacement = e => {
    const { value } = e.target;
    this.setState({
      displacement: value,
    });
    this.props.form.setFieldsValue({ displacement: value });
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
        auto_brand_id: this.state.auto_brand_id,
        auto_series_id: this.state.auto_series_id,
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
        is_made_moduleCar: true,
      });
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
        brandsListChildren.push(<Select.Option
          key={`${getSeriesByBrandDataList[i]._id  }/${  getSeriesByBrandDataList[i].auto_factory_id}`}
          value={`${getSeriesByBrandDataList[i]._id  }/${
          getSeriesByBrandDataList[i].auto_factory_id}`}
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
                    onClick={this.sureCreateFin}>确认创建</Button>
          </Col>
        </Row>
        <Form>
          <FormItem
            {...formItemLayoutHalf}
            label="产品名称"
          >
            <Row>
              <Col span={18}>
                {getFieldDecorator('product_id', {
                  rules: [{ required: true, message: '产品名称', whitespace: true }],
                  initialValue: this.props.product_id !== '' ? this.props.product_id : '',
                })(
                  <Select placeholder="产品名称" onChange={this.changeProduct}
                          disabled={!!this.props.product_id}
                          style={{ width: 360 }}
                  >
                    {rouceList}
                  </Select>,
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="车辆品牌"
          >
            <Row>
              <Col span={18}>
                {getFieldDecorator('auto_brand_id', {
                  rules: [{ required: true, message: '品牌', whitespace: true }],
                })(
                  <Select placeholder="品牌"
                          onChange={this.handleChangeBrand}
                          style={{ width: 360 }}
                  >
                    {brandsList}
                  </Select>,
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="车系"
          >
            <Row>
              <Col span={18}>
                {getFieldDecorator('auto_series_id', {
                  rules: [{ required: true, message: '车系', whitespace: true }],
                })(
                  <Select placeholder="车系"
                          onChange={this.handleChangeSeries}
                          style={{ width: 360 }}>
                    {brandsListChildren}
                  </Select>,
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="车型"
          >
            <Row>
              <Col span={10}>
                {getFieldDecorator('auto_type_id', {
                  rules: [{ required: false, message: '车型', whitespace: true }],
                })(
                  <Select
                    placeholder="车型"
                    onChange={this.handleChangeSeriesType}
                    style={{ width: 360 }}
                  >
                    {getSeriesByBrandDataTypeList}
                  </Select>,
                )}
              </Col>
              <Col span={8} offset={1}>
                <span onClick={this.makeCarModule}><a>自定义车型</a></span>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayoutHalf}
            label="厂商指导价"
          >
            <Row>
              <Col span={18}>
                {getFieldDecorator('guide_price', {
                  rules: [{ required: false, message: '请输入厂商指导价', whitespace: true }],
                  initialValue: this.state.guide_price,
                })(
                  <Input placeholder="厂商指导价" type="number"
                         onChange={this.change_guide_price.bind(this)}
                         addonAfter={'元'}
                         disabled
                         style={{ width: 360 }}
                  />,
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem label="排量" {...formItemLayoutHalf}>
            <Row>
              <Col span={18}>
                {getFieldDecorator('displacement', {
                  rules: [{ required: false, message: '排量', whitespace: true }],
                  initialValue: this.state.displacement,
                })(
                  <Input placeholder="排量" type="number"
                         addonAfter={<span style={{ width: 14, display: 'block' }}>L</span>}
                         onChange={this.change_displacement}
                         disabled
                         style={{ width: 360 }}
                  />,
                )}
              </Col>
            </Row>
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
                initialValue: this.state.auto_brand_id || null,
              })(
                <Select placeholder="品牌" onChange={this.handleChangeBrand}
                        disabled={this.state.disabledModels}>
                  {brandsList}
                </Select>,
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="车系"
            >
              {getFieldDecorator('module_auto_type_id', {
                initialValue: this.state.auto_series_factory_id,

              })(
                <Select placeholder="车系" onChange={this.handleChangeSeries}
                        disabled={this.state.disabledModels}>
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
              {getFieldDecorator('module_guide_price')(
                <Input placeholder="厂商指导价" type="number" addonAfter={'元'}
                       onChange={this.change_guide_price.bind(this)}
                />,
              )}
            </FormItem>
            <FormItem label="排量" {...formItemLayout} required>
              {getFieldDecorator('module_displacement')(
                <Input placeholder="排量" type="number"
                       addonAfter={<span style={{ width: 14, display: 'block' }}>L</span>}
                       onChange={this.change_displacement} />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
      ;
  }
}

AddFinPlanChildren = Form.create()(AddFinPlanChildren);
export default AddFinPlanChildren;
