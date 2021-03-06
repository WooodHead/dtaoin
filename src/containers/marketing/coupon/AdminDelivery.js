import React from 'react';
import { Modal, Form, Row, Col, Input, Radio, Select, Icon, Button, message } from 'antd';

import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';
import CompanySearchDrop from './CompanySearchDrop';

import api from '../../../middleware/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
const Search = Input.Search;

require('../delivery.less');

class Delivery extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      brands: [],
      comboCard: [],
      chooseVisible: '',
      totalPeople: 0,
      data: '',
      key: '',
    };

    [
      'handleRadioChange',
      'getBrands',
      'handleSubmit',
      'handleAutoBrandChange',
      'handleCouponCardChange',
      'handleSelectItem',
      'handleCompanySearch',
      'handleSearchClear',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleRadioChange(e) {
    const value = Number(e.target.value);
    let chooseVisible = '';
    if (value === 1) {
      chooseVisible = '';
      this.props.form.setFieldsValue({ coupon_card_type: [] });
      this.props.form.setFieldsValue({ auto_brand_ids: [] });
      this.getCouponCustomerCount(0, 0);
    } else if (value === 2) {
      chooseVisible = 'auto';
      this.props.form.setFieldsValue({ coupon_card_type: [] });
      this.props.form.setFieldsValue({ auto_brand_ids: [] });
      this.setState({ totalPeople: 0 });
    } else if (value === 3) {
      chooseVisible = 'coupon';
      this.props.form.setFieldsValue({ auto_brand_ids: [] });
      this.props.form.setFieldsValue({ coupon_card_type: [] });
      this.setState({ totalPeople: 0 });
    }

    this.setState({ chooseVisible });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('数据填写错误');
        return false;
      }

      const { detail } = this.props;
      const { companyId } = this.state;

      values.company_id = companyId;
      values.coupon_item_id = detail._id;
      values.auto_brand_ids = values.auto_brand_ids.join(',');

      api.ajax({
        url: api.coupon.getCouponGiveCouponItem(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('优惠券发放成功');
        this.hideModal();
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }
      },
      );
    });
  }

  handleAutoBrandChange(value) {
    const { companyId } = this.state;
    if (!!companyId) {
      const autoBrandIds = value ? value.toString() : '';
      this.getCouponCustomerCount(0, autoBrandIds);
    }
  }

  handleCouponCardChange(value) {
    const { companyId } = this.state;
    if (!!companyId) {
      this.getCouponCustomerCount(value, '');
    }
  }

  handleCompanySearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);
    coordinate.left = 200;
    coordinate.top = 150;

    this.setState({ key });
    if (!!key && key.length >= 2) {
      api.ajax({ url: api.overview.companyList({ key, cooperationTypes: '3,4' }) }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list;
        info.coordinate = coordinate;
        info.visible = true;
        info.keyword = key;
        this.setState({ data: info });
      });
    }
  }

  handleSelectItem(selectedItem) {
    this.setState({ companyId: selectedItem._id, key: selectedItem.name }, () => {
      const auto_brand_ids = this.props.form.getFieldValue('auto_brand_ids');
      const coupon_card_type = this.props.form.getFieldValue('coupon_card_type');

      if (auto_brand_ids.length === 0 && !coupon_card_type) {
        this.getCouponCustomerCount(0, 0);
      } else if (auto_brand_ids.length === 0 && !!coupon_card_type) {
        this.getCouponCustomerCount(coupon_card_type, '');
      } else if (auto_brand_ids.length > 0 && !coupon_card_type) {
        const autoBrandIds = auto_brand_ids.toString();
        this.getCouponCustomerCount(0, autoBrandIds);
      }
    });
  }

  handleSearchClear() {
    this.setState({ key: '' });
  }

  getBrands() {
    api.ajax({ url: api.auto.getBrands() }, data => {
      this.setState({ brands: data.res.auto_brand_list });
    },
    );
  }

  getCouponCardTypeList() {
    api.ajax({
      url: api.coupon.getCouponCardTypeList('', '0', {
        page: 1,
        pageSize: '9999',
      }),
    }, data => {
      const { list } = data.res;
      this.setState({ comboCard: list });
    },
    );
  }

  getCouponCustomerCount(couponIds, autoBrandIds) {
    const { companyId } = this.state;
    api.ajax({ url: api.coupon.getCouponCustomerCount(companyId, couponIds, autoBrandIds) }, data => {
      const { total } = data.res;
      this.setState({ totalPeople: total });
    },
    );
  }

  showModal() {
    this.setState({ visible: true });
    this.getBrands();
    this.getCouponCardTypeList();
  }

  render() {
    const { visible, brands, comboCard, chooseVisible, totalPeople, data, key } = this.state;
    const { detail, size } = this.props;

    const { formItemLayout_10, formItem_618 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const userInfo = api.getLoginUser();

    const footer = [
      <Button key="btn2" type="ghost" onClick={this.hideModal}>取消</Button>,
      <Button key="btn1" type="primary" onClick={this.handleSubmit}>确定</Button>,
    ];

    return (
      <span>
        {
          size === 'small'
            ? <a href="javascript:;" onClick={this.showModal}>发放</a>
            : <span onClick={this.showModal}>发 放</span>
        }
        <Modal
          title={<span>发放优惠券</span>}
          visible={visible}
          width={690}
          onCancel={this.hideModal}
          footer={footer}
        >
          <CompanySearchDrop
            info={data}
            onItemSelect={this.handleSelectItem}
            onCancel={this.handleSearchClear}
          />

          <Form>
            <Row>
              <Col span={24} className="ml20">
                <FormItem label="优惠券名称" {...formItemLayout_10}>
                  <p>{detail.name}</p>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24} className="ml20">
                <label style={{ margin: '4px 0 17px 122px' }} className="label pull-left">门店</label>
                <Search
                  placeholder="请输入门店名称"
                  onChange={this.handleCompanySearch}
                  value={key}
                  style={{ width: 250, float: 'left' }}
                />
              </Col>
            </Row>

            <Row>
              <Col span={24} className="ml20">
                <FormItem label="发放对象" {...formItemLayout_10}>
                  {getFieldDecorator('choose', {
                    onChange: this.handleRadioChange,
                    initialValue: 1,
                  })(
                    <RadioGroup>
                      <Radio value={1}>全部</Radio>
                      <Radio value={2}>车辆品牌</Radio>
                      <Radio value={3}>套餐卡</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row className={(chooseVisible === 'auto' || chooseVisible === 'coupon') ? 'hide' : ''}>
              <Col span={24} className="ml20">
                <FormItem {...formItemLayout_10}>
                  <span
                    className="font-size-14"
                    style={{ width: 200, marginLeft: '60%' }}
                  >
                  {`共选择${totalPeople}人`}
                </span>
                </FormItem>
              </Col>
            </Row>

            <Row className={chooseVisible === 'auto' ? '' : 'hide'}>
              <Col span={24} className="ml20">
                <FormItem {...formItemLayout_10}>
                  {getFieldDecorator('auto_brand_ids', {
                    initialValue: [],
                    onChange: this.handleAutoBrandChange,
                  })(
                    <Select
                      mode="multiple"
                      size="large"
                      style={{ width: 200, marginLeft: '60%' }}
                      placeholder="请选择车辆品牌"
                    >
                      {brands.map(item => <Option key={item._id}>{item.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
                <span
                  className="font-size-14"
                  style={{ position: 'absolute', right: '200px', top: '8px' }}
                >
                  {`共选择${totalPeople}人`}
                </span>
              </Col>
            </Row>

            <Row className={chooseVisible === 'coupon' ? '' : 'hide'}>
              <Col span={24} className="ml20">
                <FormItem  {...formItemLayout_10}>
                  {getFieldDecorator('coupon_card_type', {
                    onChange: this.handleCouponCardChange,
                  })(
                    <Select
                      size="large"
                      style={{ width: 200, marginLeft: '60%' }}
                      placeholder="选择套餐卡"
                    >
                      {comboCard.map(item => <Option key={item._id}>{item.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
                <span
                  className="font-size-14"
                  style={{ position: 'absolute', right: '200px', top: '8px' }}
                >
                  {`共选择${totalPeople}人`}
                </span>
              </Col>
            </Row>

            <Row>
              <h3 className="coupon-line ml90">客户端推送</h3>
            </Row>

            <Row>
              <Col span={24} className="ml20">
                <FormItem label="通知标题" {...formItemLayout_10}>
                  {getFieldDecorator('title', {
                    initialValue: '水稻汽车',
                  })(
                    <Input placeholder="请输入推送标题，仅安卓客户端可见" style={{ width: '300px' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24} className="ml20">
                <FormItem label="通知内容" {...formItem_618}>
                  {getFieldDecorator('abstract', {
                    initialValue: `【${ key }】送您一张【${ detail.name }】，快来享受优惠吧!`,
                  })(
                    <TextArea
                      rows="4"
                      placeholder="请输入推送标题，仅安卓客户端可见"
                      style={{ width: '300px' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>

           <Row>
             <h3 className="coupon-line ml90">短信推送</h3>
           </Row>

          <Row>
            <p style={{ marginLeft: '194px' }}>
              <Icon type="exclamation-circle-o" />
              <span style={{ marginLeft: '5px' }}>未安装客户端的客户，会以短信形式发送优惠券到账提醒</span>
            </p>
            <p className="mb10" style={{ marginLeft: '212px' }}>短信为固定模板，信息不可修改</p>
          </Row>

          <Row>
            <Col span={24} className="ml20">
              <FormItem label="短信内容" {...formItem_618}>
                {getFieldDecorator('name', {
                  initialValue: `【水稻汽车】${ key } 送您一张 ${ detail.name }，用手机号登录水稻汽车App即可查看并到店使用，快来享受优惠吧！App下载地址：http://t.cn/RotZez6,退订回N`,
                })(
                  <TextArea rows="4" style={{ width: '300px' }} disabled />,
                )}
              </FormItem>
            </Col>
          </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

Delivery = Form.create()(Delivery);
export default Delivery;
