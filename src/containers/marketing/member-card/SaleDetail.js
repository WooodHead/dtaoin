import React from 'react';
import { Button, Col, Form, Icon, message, Modal, Row, Select, Table } from 'antd';

import className from 'classnames';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import text from '../../../config/text';
import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';

const Option = Select.Option;
const FormItem = Form.Item;

require('../componentsTableNest.css');

class Sale extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      companyNum: api.getLoginUser().companyNum,
      customer: null,
      autos: null,
      visible: false,
      btnLoading: false,

      key: '',
      couponCardInfo: {},
      data: '',

      id: props.match.params.id || '',
      detail: {},
    };

    [
      'handleSubmit',

      'submitActivateMemberCardData',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getDetail();
  }

  // 提交事件
  handleSubmit(e) {
    e.preventDefault();
    const isPosDevice = api.getLoginUser().isPosDevice;
    const values = this.props.form.getFieldsValue();

    if (Number(isPosDevice) === 1) {
      delete values.pay_type;
    }

    const { detail } = this.state;

    values.coupon_card_type = detail.coupon_card_type;
    values.customer_id = detail.customer_id;
    values.seller_user_id = detail.seller_user_id;
    values.discount = detail.discount;
    values.remark = detail.remark;

    this.submitActivateMemberCardData(values);
  }

  // 提交激活数据
  submitActivateMemberCardData(data) {
    const isPosDevice = api.getLoginUser().isPosDevice;
    const timer = Number(isPosDevice) === 0 ? 200 : 2000;

    if (Number(data.discount) < 0) {
      message.warning('优惠金额不能为负数');
      return;
    }
    this.setState({ btnLoading: true });

    const url = api.coupon.activateCouponCard();
    api.ajax({ url, data, type: 'post' }, value => {
      window.time = setInterval(() => {
        api.ajax({ url: api.coupon.getCouponOrderDetail(value.res.order._id) }, data => {
          if (Number(data.res.detail.status) === 1) {
            window.clearInterval(window.time);

            this.setState({ btnLoading: false });
            message.success('结算成功!');
            window.location.href = '/marketing/membercard/salelog';
          }
        }, err => {
          message.error(err);
          this.setState({ btnLoading: false });
        });
      }, Number(timer));
    }, error => {
      message.error(error);
      this.setState({ btnLoading: false });
    });
  }

  hideModal() {
    this.setState({ visible: false, btnLoading: false });
  }

  getDetail() {
    api.ajax({ url: api.coupon.getCouponOrderDetail(this.state.id) }, data => {
      const { detail } = data.res;
      this.setState({ detail });

      this.getCustomerInfo(detail.customer_id);
      this.getCustomerAutos(detail.customer_id);

      this.getCouponCardTypeInfo(detail.coupon_card_type);
    });
  }

  getCouponCardTypeInfo(couponType) {
    const url = api.coupon.getCouponCardTypeInfo(couponType);
    api.ajax({ url }, data => {
      this.setState({ couponCardInfo: data.res.detail });
    });
  }

  // 查询用户信息
  getCustomerInfo(customerId) {
    const url = api.customer.detail(customerId);
    api.ajax({ url }, data => {
      this.setState({ customer: data.res.customer_info });
    }, error => {
      message.error(error);
    });
  }

  // 查询用户车辆
  getCustomerAutos(customerId) {
    const url = api.presales.superUserAutoList(customerId);
    api.ajax({ url }, data => {
      this.setState({ autos: data.res.auto_list });
    }, error => {
      message.error(error);
    });
  }

  render() {
    const { btnLoading, visible, couponCardInfo, detail } = this.state;

    // 为了让在卡内优惠列表显示
    couponCardInfo.start_date = detail.start_date;
    couponCardInfo.expire_date = detail.expire_date;

    const couponItems = JSON.parse(couponCardInfo.coupon_items || '[]');

    const customer = this.state.customer || {};
    const autos = this.state.autos || [];

    const { getFieldDecorator } = this.props.form;

    const { formItemFour } = Layout;

    const userInfo = api.getLoginUser();
    const cooperationTypeShort = userInfo.cooperationTypeShort;
    const isC = (String(cooperationTypeShort) === 'MC') || (String(cooperationTypeShort) === 'FC');

    const scopeVisible = (Number(api.getLoginUser().companyId) === 1 || !isC) ? '' : 'hide';

    const couponCardColumns = [
      {
        title: '套餐卡名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '售价',
        dataIndex: 'price',
        key: 'price',
      }, {
        title: '开卡日期',
        dataIndex: 'start_date',
        key: 'start_date',
      }, {
        title: '到期日期',
        dataIndex: 'expire_date',
        key: 'expire_date',
      }, {
        title: '有效期(天)',
        dataIndex: 'valid_day',
        key: 'valid_day',
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
        width: '30%',
      }];

    const expandedRowRender = record => {
      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name1',
          width: '25%',
        }, {
          title: '类型',
          dataIndex: '_id',
          key: 'type',
          width: '25%',
          render: value => value.length > 4 ? '配件' : '项目',
        }, {
          title: '优惠数量',
          dataIndex: 'amount',
          key: 'amount',
          width: '25%',
        }, {
          title: '售价(元)',
          dataIndex: 'price',
          key: 'price',
          width: '25%',
          className: String(record.type) === '1' ? '' : 'hide',
          render: value => Number(value).toFixed(2),
        }, {
          title: '折扣',
          key: 'discount_rate',
          className: String(record.type) === '2' ? '' : 'hide',
          width: '25%',
          render: () => {
            let rate = String(Number(Number(record.discount_rate).toFixed(2)) * 100);
            if (rate.length === 1) {
              return `${rate || '0'  }折`;
            }

            if (Number(rate.charAt(rate.length - 1)) === 0) {
              rate = rate.slice(0, rate.length - 1);
            }
            return `${rate || '0'  }折`;
          },
        }];

      const items = (record.items && JSON.parse(record.items)) || [];
      const partTypes = (record.part_types && JSON.parse(record.part_types)) || [];
      const data = items.concat(partTypes);

      return (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={record => record._id}
        />
      );
    };

    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => index + 1,
      }, {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '有效期',
        dataIndex: 'valid_type',
        key: 'valid_type',
        render: (value, record) => {
          if (String(value) === '0') {
            // 时间段
            return `${record.valid_start_date}至${record.valid_expire_date}`;
          } else if (String(value) === '1') {
            // 具体天数
            return `领取后当天生效${record.valid_day}天有效`;
          }
        },
      }, {
        title: '优惠券类型',
        dataIndex: 'type',
        key: 'type',
        render: value => text.couponType[value],
      }, {
        title: '门店',
        dataIndex: 'scope',
        key: 'scope',
        className: scopeVisible,
        render: text => {
          switch (`${  text}`) {
          case '0':
            return '适用门店';
          case '1':
            return '售卡门店';
          default:
            return null;
          }
        },
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        render: text => text === 0 ? '不限次数' : text,
      }];

    const footer = [
      <div>
        <Button
          key="btn4"
          type="primary"
          onClick={this.handleSubmit}
          loading={btnLoading}
        >结算
        </Button>
        <Button key="btn5" type="ghost" onClick={this.hideModal}>取消</Button>
      </div>,
    ];

    const isPosDevice = api.getLoginUser().isPosDevice;

    const customerNameIcon = className({
      'icon-first-name-none': !customer._id,
      'icon-first-name': true,
    });

    const customerInfoContainer = className({
      'customer-info': !!customer._id,
      hide: !customer._id,
    });

    const autoContainerDisabled = className({
      hide: !customer._id,
    });

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={10}>
              <div className="base-info" style={{ borderTop: 0, paddingTop: 0 }}>
                <div className="customer-container">
                  <div className={customerNameIcon}>
                    {customer.name ? customer.name.substr(0, 1) :
                      <Icon type="user" style={{ color: '#fff' }} />}
                  </div>
                  <div className={customerInfoContainer}>
                    <div>
                      <span className="customer-name">{customer.name}</span>
                      <span className="ml6">{text.gender[String(customer.gender)]}</span>
                    </div>
                    <div>
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col className={Number(detail.status) === 1 ? 'hide' : 'pull-right'}>
              <div className={Number(isPosDevice) === 1 ? '' : 'hide'}>
                <Button type="primary" htmlType="submit" loading={btnLoading}>
                  结算
                </Button>
              </div>

              <div className={Number(isPosDevice) === 0 ? '' : 'hide'}>
                <Button type="primary" onClick={this.showModal}>
                  结算
                </Button>
                <Modal
                  visible={visible}
                  title="结算方式"
                  onCancel={this.hideModal}
                  footer={footer}
                >
                  <Row>
                    <Col span={14}>
                      <FormItem label="支付方式" {...formItemFour}>
                        {getFieldDecorator('pay_type', {
                          initialValue: '2',
                          rules: FormValidator.getRuleNotNull(),
                          validateTrigger: 'onBlur',
                        })(
                          <Select style={{ width: '150px' }}>
                            <Option key="1">银行转账</Option>
                            <Option key="2">现金支付</Option>
                            <Option key="3">微信支付</Option>
                            <Option key="4">支付宝支付</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Modal>
              </div>
            </Col>
          </Row>

          <div className={`member-autos-info ${autoContainerDisabled}`}>
            {
              autos.map(auto => (
                  <div className="auto" key={auto._id}>
                    <div>
                      <label className="label">车牌号</label>
                      <span> {auto.plate_num || ''}</span>
                    </div>

                    <div>
                      <label className="label">车型信息</label>
                      <span>{auto.auto_type_name || ''}</span>
                    </div>
                  </div>
                ))
            }
          </div>

          <Row className="mt20 mb10">
            <Col span={4}>
              <h3>开卡信息</h3>
            </Col>
          </Row>

          <Table
            columns={couponCardColumns}
            dataSource={[couponCardInfo]}
            pagination={false}
            rowKey={(record, index) => `${record._id}_${index}`}
          />

          <div className="with-bottom-divider mt20">
            <div className="info-line">
              <div className="width-200">
                <label className="label">销售人员</label>
                <span>{detail.seller_user_name}</span>
              </div>

              <div className="width-200">
                <label className="label">销售提成</label>
                <span>{`${Number(couponCardInfo.sell_bonus_amount || 0).toFixed(2)} 元`}</span>
              </div>
              <div className="width-200">
                <label className="label" style={{ marginLeft: '27px' }}>备注</label>
                <span style={{ color: '#2db7f5', fontSize: 18, fontWeight: 'bold' }}>
                {detail.remark}
              </span>
              </div>
            </div>
          </div>

          <Row className="mt20 mb20">
            <Col span={4}>
              <h3>结算信息</h3>
            </Col>
          </Row>
          <div className="with-bottom-divider">
            <div className="info-line">
              <div className="width-200">
                <label className="label">应收金额</label>
                <span>{`${(Number(detail.price) + Number(detail.discount)).toFixed(2)} 元`}</span>
              </div>

              <div className="width-200">
                <label className="label">优惠金额</label>
                <span>{`${Number(detail.discount).toFixed(2)} 元`}</span>
              </div>

              <div className="width-200">
                <label className="label">实收金额</label>
                <span style={{ color: '#2db7f5', fontSize: 18, fontWeight: 'bold' }}>
                  {`${Number(detail.price).toFixed(2)} 元`}
                </span>
              </div>
            </div>
          </div>

          <Row className="mt20 mb10">
            <Col span={4}>
              <h3>卡内优惠</h3>
            </Col>
          </Row>

          <div className="mb20">
            <Table
              className="components-table-demo-nested"
              columns={columns}
              dataSource={couponItems}
              pagination={false}
              bordered={false}
              expandedRowRender={expandedRowRender}
              rowKey={record => record._id}
            />
          </div>
        </Form>
      </div>
    );
  }
}

Sale = Form.create()(Sale);
export default Sale;
