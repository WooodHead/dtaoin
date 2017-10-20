import React from 'react';
import { Modal, Form, Row, Col, Input, Radio, Select, Icon, Button, message } from 'antd';

import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';

import RechargeSms from './RechargeSms';

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
      smsRemain: 0,
      smsVisible: false,
    };

    [
      'handleRadioChange',
      'getBrands',
      'handleSubmit',
      'handleAutoBrandChange',
      'handleCouponCardChange',
      'handleHideRechargeSms',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCompanyDetail();
  }

  getCompanyDetail() {
    api.ajax({
      url: api.company.detail(),
    }, data => {
      this.setState({ smsRemain: data.res.company.sms_remain });
    });
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
    const { totalPeople, smsRemain } = this.state;

    if (Number(smsRemain) < Number(totalPeople)) {
      this.setState({ smsVisible: true });
      return false;
    } else {
      this.setState({ smsVisible: false });
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('数据填写错误');
        return false;
      }

      const { detail } = this.props;
      const userInfo = api.getLoginUser();
      const cooperationTypeShort = userInfo.cooperationTypeShort;
      const isC = (String(cooperationTypeShort) === 'MC') || (String(cooperationTypeShort) === 'FC');

      values.company_id = userInfo.companyId;
      values.coupon_item_id = detail._id;
      values.auto_brand_ids = values.auto_brand_ids.join(',');

      if (isC) {
        values.title = '';
        values.abstract = '';
      }

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
    const autoBrandIds = value ? value.toString() : '';
    this.getCouponCustomerCount(0, autoBrandIds);
  }

  handleCouponCardChange(value) {
    this.getCouponCustomerCount(value, '');
  }

  handleHideRechargeSms() {
    this.setState({ smsVisible: false });
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
    const userInfo = api.getLoginUser();
    const companyId = userInfo.companyId;
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
    this.getCouponCustomerCount(0, 0);
  }

  render() {
    const { visible, brands, comboCard, chooseVisible, totalPeople, smsVisible, smsRemain } = this.state;
    const { detail, size } = this.props;

    const { formItemLayout_10, formItem_618 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const userInfo = api.getLoginUser();
    const cooperationTypeShort = userInfo.cooperationTypeShort;
    const isC = (String(cooperationTypeShort) === 'MC') || (String(cooperationTypeShort) === 'FC');

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

            <div className={isC ? 'hide' : ''}>
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
                      initialValue: `【${userInfo.companyName}】送您一张【${ detail.name }】，快来享受优惠吧!`,
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
            </div>

             <Row>
               <h3 className="coupon-line ml90">短信推送</h3>
             </Row>

            <Row>
              {
                isC
                  ? (
                    <p style={{ marginLeft: '194px' }} className="ml20 mb10">
                      <Icon type="exclamation-circle-o" />
                      <span className="ml5">短信为固定模板，信息不可修改</span>
                    </p>
                  )
                  : (
                    <div>
                      <p style={{ marginLeft: '194px' }} className="ml20">
                        <Icon type="exclamation-circle-o" />
                        <span style={{ marginLeft: '5px' }}>未安装客户端的客户，会以短信形式发送优惠券到账提醒</span>
                      </p>
                      <p className="mb10" style={{ marginLeft: '212px' }}>短信为固定模板，信息不可修改</p>
                    </div>
                  )
              }
            </Row>

            <Row>
              <Col span={24} className="ml20">
                <FormItem label="短信内容" {...formItem_618}>
                  {getFieldDecorator('content', {
                    initialValue: `【水稻汽车】${ userInfo.companyName } 送您一张 ${ detail.name }，用手机号登录水稻汽车App即可查看并到店使用，快来享受优惠吧！App下载地址：http://t.cn/RotZez6,退订回N`,
                  })(
                    <TextArea rows="4" style={{ width: '300px' }} disabled />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

        <RechargeSms
          visible={smsVisible}
          hideRechargeSms={this.handleHideRechargeSms}
          smsRemain={smsRemain}
        />
      </span>
    );
  }
}

Delivery = Form.create()(Delivery);
export default Delivery;
