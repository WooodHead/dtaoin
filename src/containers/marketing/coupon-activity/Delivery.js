import React from 'react';
import { Modal, Form, Row, Col, Input, Radio, Select, Icon, Button, message } from 'antd';

import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

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
      companyId: api.getLoginUser().companyId,
    };

    [
      'handleRadioChange',
      'getBrands',
      'handleSubmit',
      'handleAutoBrandChange',
      'handleCouponCardChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCouponCustomerCount(0, 0);
  }

  handleRadioChange(e) {
    const { companyId } = this.state;
    const value = Number(e.target.value);
    let chooseVisible = '';
    if (value === 1) {
      chooseVisible = '';
      this.props.form.setFieldsValue({ coupon_card_type: [] });
      this.props.form.setFieldsValue({ auto_brand_ids: [] });
      if (!!companyId) {
        this.getCouponCustomerCount(0, 0);
      } else {
        this.setState({ totalPeople: 0 });
      }
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

      values.activity_id = detail._id;
      values.auto_brand_ids = values.auto_brand_ids.join(',');

      api.ajax({
        url: api.coupon.pushCouponActivity(),
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

  getCouponCustomerCount(couponIds, autoBrandIds, companyId) {
    const companyIdSearch = companyId || this.state.companyId;
    api.ajax({ url: api.coupon.getCouponCustomerCount(companyIdSearch, couponIds, autoBrandIds) }, data => {
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
    const { visible, brands, comboCard, chooseVisible, totalPeople } = this.state;
    const { detail, size } = this.props;

    const { formItemLayout_10, formItem_618 } = Layout;
    const { getFieldDecorator } = this.props.form;

    const companyName = api.getLoginUser().companyName;

    const footer = [
      <Button key="btn2" type="ghost" onClick={this.hideModal}>取消</Button>,
      <Button key="btn1" type="primary" onClick={this.handleSubmit}>确定</Button>,
    ];

    return (
      <span>
        {
          size === 'small'
            ? <a href="javascript:;" onClick={this.showModal}>推送</a>
            : <Button type="primary" onClick={this.showModal}>推 送</Button>
        }
        <Modal
          title={<span>推送活动</span>}
          visible={visible}
          width={690}
          onCancel={this.hideModal}
          footer={footer}
        >
          <Form>
            <Row>
              <Col span={24} className="ml20">
                <FormItem label="活动名称" {...formItemLayout_10}>
                  <p>{detail.title}</p>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24} className="ml20">
                <FormItem label="推送对象" {...formItemLayout_10}>
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
                      placeholder="选择车辆品牌"
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
                    initialValue: [],
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
                    initialValue: `【${ companyName }】正在进行【${ detail.title }】，快来参与活动吧!`,
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
              <span style={{ marginLeft: '5px' }}>未安装客户端的客户，会以短信形式发送活动推送提醒</span>
            </p>
            <p className="mb10" style={{ marginLeft: '212px' }}>短信为固定模板，信息不可修改</p>
          </Row>

          <Row>
            <Col span={24} className="ml20">
              <FormItem label="短信内容" {...formItem_618}>
                {getFieldDecorator('name', {
                  initialValue: `【水稻汽车】 正在进行 【${ detail.title }】，快来参加活动，领取优惠吧！活动链接：http://t.cn/RotZez6,退订回N`,
                })(
                  <TextArea rows="4" style={{ width: '300px' }} disabled={true} />,
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
