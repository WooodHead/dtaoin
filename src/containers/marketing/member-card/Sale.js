import React from 'react';
import {Form, Button, Input, Table, Select, Row, Col, message, Modal, Icon} from 'antd';

import className from 'classnames';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import text from '../../../config/text';
import api from '../../../middleware/api';
import NumberInput from '../../../components/widget/NumberInput';

import SearchSelectBox from '../../../components/widget/SearchSelectBox';
import NewCustomerAutoModal from '../../auto/NewCustomerAutoModal';
import BaseModal from '../../../components/base/BaseModal';

const Option = Select.Option;
const FormItem = Form.Item;

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
    };

    [
      'handleSearchCustomer',
      'handleSelectCustomer',
      'handleCreateCustomerSuccess',
      'handleMemberInfoChange',
      'handleCheckMemberCard',
      'handleSelectMaintainUser',
      'handleDiscountChange',
      'handleSubmit',
    ].forEach((method) => this[method] = this[method].bind(this));

    //搜索下拉选择框的显示模式
    this.customerPattern = (customerAuto) => {
      return `${customerAuto.customer_name} ${customerAuto.customer_phone} ${customerAuto.plate_num}`;
    };

    this.couponColumns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => {
          return index + 1;
        },
      }, {
        title: '优惠名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '适用门店',
        dataIndex: 'scope',
        key: 'scope',
        render: text => {
          switch ('' + text) {
            case '0':
              return '通店';
            case '1':
              return '售卡门店';
            default:
              return null;
          }
        },
      }, {
        title: '优惠类型',
        dataIndex: 'type',
        key: 'type',
        render: text => {
          switch ('' + text) {
            case '1':
              return '计次优惠';
            case '2':
              return '折扣优惠';
            case '3':
              return '立减优惠';
            default:
              return '';
          }
        },
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        render: text => text === 0 ? '不限次数' : text,
      },
    ];
  }

  //数据访问部分
  //搜索用户
  searchCustomer(key, successHandle, failHandle) {
    this.setState({searchKey: key});
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    let url = api.presales.searchCustomerAutos(key);
    api.ajax({url}, (data) => {
      this.setState({customerAuto: data.res.list});
      successHandle(data.res.list);
    }, (error) => {
      failHandle(error);
    });
  }

  //验证并拉取会员卡信息
  checkMemberCardInfo(cardNumber, cardSecret) {
    let url = api.coupon.checkMemberCard();
    let data = {card_number: cardNumber, card_secret: cardSecret};
    api.ajax({url, data, type: 'POST'}, (data) => {
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

  //事件处理
  //搜索用户事件
  handleSearchCustomer(key, successHandle, failHandle) {
    this.searchCustomer(key, successHandle, failHandle);
  }

  //选择用户事件
  handleSelectCustomer(customer) {
    this.setState({customerAuto: customer});

    this.getCustomerInfo(customer.customer_id);
    this.getCustomerAutos(customer.customer_id);
  }

  //处理创建客户成功
  handleCreateCustomerSuccess(customerData) {
    //创建成功后重新请求客户数据
    this.getCustomerInfo(customerData.customer_id);
    this.getCustomerAutos(customerData.customer_id);
  }

  //处理会员卡号或密码编辑事件：编辑后需要重新验证
  handleMemberInfoChange() {
    this.setState({memberCardValidate: false});
  }

  //验证会员卡事件
  handleCheckMemberCard() {
    const formValues = this.props.form.getFieldsValue();
    const {card_number, card_secret} = formValues;

    if (card_number && card_secret) {
      this.checkMemberCardInfo(card_number, card_secret);
      this.getMaintainUsers();
    } else {
      message.error('请输入卡号和卡密码！');
    }
  }

  //选择销售人员的事件
  handleSelectMaintainUser(user) {
    this.setState({selectMaintainUser: user});
  }

  //会员卡优惠信息
  handleDiscountChange(value) {
    this.setState({discount: value});
    if (Number(value) > this.state.memberCard.original_price) {
      message.error('优惠金额不能超过结算金额, 请重新输入');
      return false;
    }
    this.setState({discount: value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')});
    return true;
  }


  //提交事件
  handleSubmit(e) {
    e.preventDefault();
    const isPosDevice = api.getLoginUser().isPosDevice;
    const FieldsValue = this.props.form.getFieldsValue();

    if (Number(isPosDevice) === 1) {
      delete FieldsValue.pay_type;
    }

    const {
      customer,
      memberCard,
      memberCardValidate,
      selectMaintainUser,
    } = this.state;

    if (!customer) {
      message.error('请选择客户');
      return false;
    }
    FieldsValue['customer_id'] = customer._id;

    //会员卡未验证
    if (!memberCardValidate) {
      message.error('请先验证会员卡信息');
      return false;
    }

    if (memberCard && memberCard.is_self_company === true && !selectMaintainUser) {
      message.error('请选择销售人员');
      return false;
    }
    FieldsValue['seller_user_id'] = selectMaintainUser && selectMaintainUser._id || 0;
    FieldsValue.discount = '' + Number(FieldsValue.discount);
    const originalPrice = memberCard.original_price || 0;
    FieldsValue['original_price'] = originalPrice;
    const discount = FieldsValue.discount || 0;
    const realPrice = (Number(originalPrice) - Number(discount)).toFixed(2);
    FieldsValue['price'] = realPrice || originalPrice;

    this.submitActivateMemberCardData(FieldsValue);
  }

  //提交激活数据
  submitActivateMemberCardData(data) {
    const isPosDevice = api.getLoginUser().isPosDevice;
    let timer = isPosDevice == 0 ? 200 : 2000;

    if (Number(data.discount) < 0) {
      message.warning('优惠金额不能为负数');
      return;
    }
    this.setState({btnLoading: true});

    let url = api.coupon.activateMemberCard();
    api.ajax({url, data, type: 'post'}, value => {
      window.time = setInterval(() => {
        api.ajax({url: api.coupon.getMemberOrderDetail(value.res.order._id)}, data => {
          if (Number(data.res.detail.status) === 1) {
            window.clearInterval(window.time);

            this.setState({btnLoading: false});
            message.success('结算成功!');
            window.location.href = '/marketing/membercard/salelog';
          }
        });
      }, Number(timer));
    }, (error) => {
      message.error(error);
    });
  }

  //获取员工列表
  getMaintainUsers() {
    let url = api.user.getMaintainUsers(0);
    api.ajax({url}, (data) => {
      this.setState({
        maintainUsers: data.res.user_list,
      });
    }, (error) => {
      message.error(error);
    });
  }

  //查询用户信息
  getCustomerInfo(customerId) {
    let url = api.customer.detail(customerId);
    api.ajax({url}, (data) => {
      this.setState({customer: data.res.customer_info});
    }, (error) => {
      message.error(error);
    });
  }

  //查询用户车辆
  getCustomerAutos(customerId) {
    let url = api.presales.superUserAutoList(customerId);
    api.ajax({url}, (data) => {
      this.setState({autos: data.res.auto_list});
    }, (error) => {
      message.error(error);
    });
  }

  render() {
    const customerAuto = this.state.customerAuto;
    const companyNum = this.state.companyNum || '';
    const customer = this.state.customer || {};
    const autos = this.state.autos || [];
    const btnLoading = this.state.btnLoading;
    const memberCard = this.state.memberCard || {member_card_type_info: {}};
    const visible = this.state.visible;
    const couponItemsStr = memberCard.member_card_type_info.coupon_items || '[]';
    const couponColumns = this.couponColumns;
    const couponItems = JSON.parse(couponItemsStr) || [];

    const maintainUsers = this.state.maintainUsers || [];
    const {getFieldDecorator} = this.props.form;

    const discount = this.state.discount || 0;
    const realPrice = (Number(memberCard.sell_price || 0) - Number(discount)).toFixed(2);
    const {formItemFour} = Layout;
    let footer = [
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
      'hide': !customer._id,
    });

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>

          {/*//信息筛选*/}
          <Row className="">
            <Col span={4}>
              <SearchSelectBox
                placeholder={'请输入手机号、车牌号搜索'}
                displayPattern={this.customerPattern}
                onSearch={this.handleSearchCustomer}
                onSelectItem={this.handleSelectCustomer}
                autoSearchLength={3}
              />
            </Col>
            <Col span={2} offset={1}>
              {
                customerAuto && customerAuto.length === 0
                  ?
                  <NewCustomerAutoModal
                    inputValue={this.state.searchKey}
                    onSuccess={this.handleCreateCustomerSuccess}
                    size="default"
                  />
                  :
                  null
              }
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
                          <Select style={{width: '150px'}}>
                            <Option key="1">银行转账</Option>
                            <Option key="2">现金支付</Option>
                            <Option key="3">微信支付</Option>
                            <Option key="4">支付宝支付</Option>
                          </Select>
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
                {customer.name ? customer.name.substr(0, 1) : <Icon type="user" style={{color: '#fff'}}/>}
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
              autos.map((auto) => {
                return (
                  <div className="auto">
                    <div>
                      <label>车牌号</label>
                      <span> {auto.plate_num || '' }</span>
                    </div>

                    <div>
                      <label>车型信息</label>
                      <span>{auto.auto_type_name || ''}</span>
                    </div>
                  </div>
                );
              })
            }
          </div>

          <Row className="mt20 mb10">
            <Col span={4}>
              <h3>开卡信息</h3>
            </Col>
          </Row>

          <div className="padding-bottom-15 with-bottom-divider">
            <Row className="mt20">
              <div className="info-line pull-left">
                <label className="label ant-form-item-required">输入卡号</label>
                <div className="width-150">
                  {getFieldDecorator('card_number', {
                    initialValue: companyNum || '',
                    onChange: this.handleMemberInfoChange,
                  })(
                    <Input />
                  )}
                </div>
              </div>

              <div className="info-line pull-left ml40 mr10">
                <label className="label ant-form-item-required">输入密码</label>
                <div className="width-150">
                  {getFieldDecorator('card_secret', {
                    initialValue: '',
                    rules: FormValidator.getRuleNotNull(),
                    onChange: this.handleMemberInfoChange,
                  })(
                    <Input />
                  )}
                </div>
              </div>

              <Button type="primary" onClick={this.handleCheckMemberCard}>验证</Button>
            </Row>

            <Row className="mt10">
              <div className="info-line pull-left" style={{marginRight: '200px'}}>
                <label className="label">会员卡名称</label>
                <span>{memberCard.member_card_type_info.name || ''}</span>
              </div>

              <div className="info-line pull-left" style={{marginRight: '250px'}}>
                <label className="label">售价</label>
                <span>{memberCard.original_price ? `${memberCard.original_price} 元` : ''}</span>
              </div>

              <div className="info-line pull-left">
                <label className="label">有效期</label>
                <span>
                    {
                      memberCard.member_card_type_info.valid_day
                        ?
                        `${memberCard.member_card_type_info.valid_day} 天`
                        :
                        ''
                    }
                </span>
              </div>
            </Row>

            <Row className="mt10">
              <div className="info-line pull-left">
                <label className="label ant-form-item-required">销售人员</label>
                <div className="width-150">
                  {
                    memberCard.is_self_company === undefined
                      ?
                      <Select disabled size="large"/>
                      :
                      memberCard.is_self_company == false
                        ?
                        <Select disabled placeholder="非本店卡片" size="large"/>
                        :
                        (
                          <Select
                            size="large"
                            placeholder="请选择销售人员"
                            onSelect={(index) => this.handleSelectMaintainUser(maintainUsers[index])}
                          >
                            {
                              maintainUsers.map((user, index) => {
                                return <Option key={user._id} value={'' + index}>{user.name}</Option>;
                              })
                            }
                          </Select>
                        )
                  }
                </div>
              </div>

              <div className="info-line pull-left ml55">
                <label className="label">备注</label>
                <div style={{width: '220px'}}>
                  {getFieldDecorator('remark', {initialValue: ''})(
                    <Input />
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
          <div className="with-bottom-divider">
            <div className="info-line">
              <label className="label">应收金额</label>
              <span>{memberCard.original_price ? `${memberCard.original_price} 元` : ''}</span>
            </div>

            <div className="info-line">
              <NumberInput
                defaultValue={(Number(memberCard.original_price || 0) - Number(memberCard.sell_price || 0)).toFixed(2)}
                id="discount"
                onChange={this.handleDiscountChange}
                self={this}
                label="优惠金额"
                disabled={Number(memberCard.original_price) !== Number(memberCard.sell_price)}
              />
            </div>

            <div className="info-line">
              <label className="label">实收金额</label>
              <span style={{color: '#2db7f5', fontSize: 18, fontWeight: 'bold'}}>
              {memberCard.original_price ? `${realPrice} 元` : ''}
              </span>
            </div>
          </div>

          <Row className="mt20 mb10">
            <Col span={4}>
              <h3>卡内优惠</h3>
            </Col>
          </Row>

          <Table
            columns={couponColumns}
            dataSource={couponItems}
            pagination={false}
            bordered
          />
        </Form>
      </div>
    );
  }
}

Sale = Form.create()(Sale);
export default Sale;
