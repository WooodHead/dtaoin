import React from 'react';
import { Form, Button, Input, Table, Select, Row, Col, message, Modal, Icon } from 'antd';

import className from 'classnames';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import text from '../../../config/text';
import api from '../../../middleware/api';
import NumberInput from '../../../components/widget/NumberInput';

import NewCustomerAutoModal from '../../auto/NewCustomerAutoModal';
import BaseModal from '../../../components/base/BaseModal';
import SearchCouponCardDrop from './SearchCouponCardDrop';
import CustomerSearchDrop from '../../../components/widget/CustomerSearchDrop';

const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;

require('../componentsTableNest.css');

class Sale extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      companyNum: api.getLoginUser().companyNum,
      searchKey: '',
      customerAuto: null,
      customer: null,
      autos: null,
      memberCard: null,
      memberCardValidate: false,
      maintainUsers: null,
      selectMaintainUser: null,
      discount: undefined,
      visible: false,
      btnLoading: false,
      couponCardData: '',

      key: '',
      couponCardInfo: '',
      data: '',
    };

    [
      'handleCreateCustomerSuccess',
      'handleMemberInfoChange',
      'handleCheckMemberCard',
      'handleSelectMaintainUser',
      'handleDiscountChange',
      'handleSubmit',

      'handleSearch',
      'handTableRowClick',
      'handleSearchClear',
      'handleSearchSelect',
      'submitActivateMemberCardData',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainUsers();
  }

  // 数据访问部分
  // 搜索用户
  searchCustomer(key, successHandle, failHandle) {
    this.setState({ searchKey: key });
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = error => {
      message.error(error);
    });
    const url = api.presales.searchCustomerAutos(key);
    api.ajax({ url }, data => {
      this.setState({ customerAuto: data.res.list });
      successHandle(data.res.list);
    }, error => {
      failHandle(error);
    });
  }

  // 验证并拉取套餐卡信息
  checkMemberCardInfo(cardNumber, cardSecret) {
    const url = api.coupon.checkMemberCard();
    const data = { card_number: cardNumber, card_secret: cardSecret };
    api.ajax({ url, data, type: 'POST' }, data => {
      this.setState({
        memberCard: data.res.detail,
        memberCardValidate: true,
      });
    }, () => {
      message.error('验证失败');
      this.setState({
        memberCard: null,
        memberCardValidate: false,
      });
    });
  }

  handleCustomerSearch(e) {
    const customerKey = e.target.value;
    const coordinate = api.getPosition(e);
    this.setState({ customerKey });

    if (!!customerKey) {
      const keyType = Number(customerKey);

      if (isNaN(keyType) && customerKey.length < 2) {
        return false;
      }
      // phone number
      if (!isNaN(keyType) && customerKey.length < 6) {
        return false;
      }

      api.ajax({ url: api.presales.searchCustomerAutos(customerKey) }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list.filter(item => item._id != null);
        info.coordinate = coordinate;
        info.visible = true;
        info.keyword = customerKey;
        this.setState({ data: info });
      });
    }
  }

  // 选择用户事件
  handleSearchSelect(customer) {
    this.setState({ customerAuto: customer });

    this.getCustomerInfo(customer.customer_id);
    this.getCustomerAutos(customer.customer_id);
  }

  handleSearchClear() {
    this.setState({ customerKey: '' });
  }

  // 处理创建客户成功
  handleCreateCustomerSuccess(customerData) {
    // 创建成功后重新请求客户数据
    this.getCustomerInfo(customerData.customer_id);
    this.getCustomerAutos(customerData.customer_id);
  }

  // 处理套餐卡号或密码编辑事件：编辑后需要重新验证
  handleMemberInfoChange() {
    this.setState({ memberCardValidate: false });
  }

  // 验证套餐卡事件
  handleCheckMemberCard() {
    const formValues = this.props.form.getFieldsValue();
    const { card_number, card_secret } = formValues;

    if (card_number && card_secret) {
      this.checkMemberCardInfo(card_number, card_secret);
      this.getMaintainUsers();
    } else {
      message.error('请输入卡号和卡密码！');
    }
  }

  // 选择销售人员的事件
  handleSelectMaintainUser(user) {
    this.setState({ selectMaintainUser: user });
  }

  // 套餐卡优惠信息
  handleDiscountChange(value) {
    this.setState({ discount: value });
    if (Number(value) > this.state.couponCardInfo.price) {
      message.error('优惠金额不能超过结算金额, 请重新输入');
      return false;
    }
    this.setState({ discount: value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') });
    return true;
  }

  handleSearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);

    this.setState({ key });
    if (!!key) {
      api.ajax({ url: api.coupon.getCouponCardTypeList(key, '0') }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list;
        info.coordinate = coordinate;
        info.visible = true;
        info.keyword = key;
        this.setState({ couponCardData: info });
      });
    }
  }

  handTableRowClick(value) {
    this.setState({ key: value.name, couponCardInfo: value });
  }

  // 提交事件
  handleSubmit(e) {
    e.preventDefault();
    const isPosDevice = api.getLoginUser().isPosDevice;
    const values = this.props.form.getFieldsValue();

    if (Number(isPosDevice) === 1) {
      delete values.pay_type;
    }

    const {
      customer,
      selectMaintainUser,
      couponCardInfo,
    } = this.state;

    if (!customer) {
      message.error('请选择客户');
      return false;
    }

    if (!selectMaintainUser) {
      message.error('请选择销售人员');
      return false;
    }

    if (!couponCardInfo) {
      message.error('请选择套餐卡名称！');
      return false;
    }

    values.customer_id = customer._id;
    values.seller_user_id = selectMaintainUser && selectMaintainUser._id || 0;
    values.coupon_card_type = couponCardInfo._id;

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

  // 获取员工列表
  getMaintainUsers() {
    const url = api.user.getMaintainUsers(0);
    api.ajax({ url }, data => {
      this.setState({
        maintainUsers: data.res.user_list,
      });
    }, error => {
      message.error(error);
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
    const { key, customerKey, customerAuto, btnLoading, visible, couponCardInfo, data } = this.state;

    const couponItems = JSON.parse(couponCardInfo.coupon_items || '[]');

    const customer = this.state.customer || {};
    const autos = this.state.autos || [];

    const maintainUsers = this.state.maintainUsers || [];
    const { getFieldDecorator } = this.props.form;

    const { formItemFour } = Layout;

    const userInfo = api.getLoginUser();
    const cooperationTypeShort = userInfo.cooperationTypeShort;
    const isC = (String(cooperationTypeShort) === 'MC') || (String(cooperationTypeShort) === 'FC');

    const scopeVisible = (Number(api.getLoginUser().companyId) === 1 || !isC) ? '' : 'hide';

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
          title: '面值(元)',
          dataIndex: 'price',
          key: 'price',
          width: '25%',
          className: String(record.type) === '1' ? '' : 'hide',
          render: value => !!value ? Number(value).toFixed(2) : '0.00',
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
        <SearchCouponCardDrop
          partsInfo={this.state.couponCardData}
          onTableRowClick={this.handTableRowClick}
          onCancel={this.handleCancel}
        />

        <CustomerSearchDrop
          info={data}
          onItemSelect={this.handleSearchSelect}
          onCancel={this.handleSearchClear}
        />

        <Form onSubmit={this.handleSubmit}>
          <Row className="">
            <Col span={10}>
              <span className="pull-left">
                <Search
                  placeholder="请输入手机号、车牌号选择或创建用户"
                  onChange={e => this.handleCustomerSearch(e)}
                  size="large"
                  style={{ width: '500px' }}
                  value={customerKey}
                />

              </span>
              {
                customerAuto && customerAuto.length === 0
                  ? <span style={{ marginLeft: '-60px', float: 'left' }}>
                      <NewCustomerAutoModal
                        inputValue={this.state.searchKey}
                        onSuccess={this.handleCreateCustomerSuccess}
                        size="default"
                      />
                    </span>
                  : null
              }
            </Col>
            <Col span={2}>

            </Col>
            <Col className="pull-right">

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

          <div className="base-info mt14">
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

          <div className="padding-bottom-15 with-bottom-divider" style={{ marginLeft: '-50px' }}>
            <Row>
              <div className="info-line pull-left">
                <label className="label ant-form-item-required">套餐卡名称</label>
                <Search
                  onChange={this.handleSearch}
                  placeholder="请输入套餐卡名字"
                  style={{ width: '300px' }}
                  value={key}
                  size="large"
                />
              </div>
            </Row>
            <Row className="mt10">
              <div className="info-line pull-left">
                <label className="label ant-form-item-required">销售人员</label>
                <div className="width-150">
                  <Select
                    size="large"
                    placeholder="请选择销售人员"
                    onSelect={index => this.handleSelectMaintainUser(maintainUsers[index])}
                    style={{ width: '162px' }}
                  >
                    {
                      maintainUsers.map((user, index) => <Option key={user._id} value={`${  index}`}>{user.name}</Option>)
                    }
                  </Select>
                </div>
              </div>

              <div className="info-line pull-left ml52">
                <label className="label">备注</label>
                <div style={{ width: '235px' }}>
                  {getFieldDecorator('remark', { initialValue: '' })(
                    <Input size="large" />,
                  )}
                </div>
              </div>

            </Row>
          </div>

          <Row className="mt20 mb20">
            <Col span={4}>
              <h3>结算信息</h3>
            </Col>
          </Row>
          <div className="with-bottom-divider" style={{ marginLeft: '-50px' }}>
            <div className="info-line">
              <label className="label">应收金额</label>
              <span>{`${couponCardInfo ? couponCardInfo.price : '0'} 元`}</span>
            </div>

            <div className="info-line">
              <label className="label">优惠金额</label>
              <NumberInput
                id="discount"
                onChange={this.handleDiscountChange}
                self={this}
                style={{ position: 'relative', top: '13px' }}
                disabled={!couponCardInfo}
              />
            </div>

            <div className="info-line">
              <label className="label">实收金额</label>
              <span style={{ color: '#2db7f5', fontSize: 18, fontWeight: 'bold' }}>
                {`${((Number(couponCardInfo.price) || 0) -
                  (Number(this.props.form.getFieldValue('discount') || 0))).toFixed(2)} 元`}
              </span>
            </div>
          </div>

          <Row className="mt20 mb10">
            <Col span={4}>
              <h3>卡内优惠</h3>
            </Col>
          </Row>

          <Table
            className="components-table-demo-nested"
            columns={columns}
            dataSource={couponItems}
            pagination={false}
            bordered={false}
            expandedRowRender={expandedRowRender}
            rowKey={record => record._id}
          />
        </Form>
      </div>
    );
  }
}

Sale = Form.create()(Sale);
export default Sale;
