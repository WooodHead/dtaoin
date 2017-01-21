import React, {Component} from 'react';
import {Form, Button, Input, Table, Select, Row, Col, message, Modal} from 'antd';

import FormModalLayout from '../../../../utils/FormLayout';
import SearchSelectBox from '../../../../components/base/SearchSelectBox';
import NewCustomerAutoModal from '../../../../components/modals/aftersales/NewCustomerAutoModal';

import api from '../../../../middleware/api';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class MemberCardSale extends Component {

  constructor(props) {
    super(props);

    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
    const companyNum = USER_SESSION.company_num || '';

    this.state = {
      companyNum: companyNum,
      searchKey: '',
      customerAuto: null,
      customer: null,
      autos: null,
      memberCard: null,
      memberCardValidate: false,
      maintainUsers: null,
      selectMaintainUser: null,
      discount: undefined,
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

    //Table的columns
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
    let url = api.searchCustomerAutos(key);
    api.ajax({url}, (data) => {
      this.setState({customerAuto: data.res.list});
      successHandle(data.res.list);
    }, (error) => {
      failHandle(error);
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
    let url = api.superUserAutoList(customerId);
    api.ajax({url}, (data) => {
      this.setState({autos: data.res.auto_list});
    }, (error) => {
      message.error(error);
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

  //提交激活数据
  submitActivateMemberCardData(data) {
    let url = api.coupon.activateMemberCard();
    api.ajax({url, data, type: 'post'}, () => {
      // window.location.href='#/marketing/membercard/salelog'
      confirm({
        title: '订单是否已经结算成功？',
        content: '',
        okText: '结算成功',
        onOk() {
          window.location.href = '#/marketing/membercard/salelog';
        },
        cancelText: '结算失败',
        onCancel() {
          window.location.href = '#/marketing/membercard/salelog';
        },
      });
    }, (error) => {
      message.error(error);
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
  handleDiscountChange(e) {
    this.setState({discount: e.target.value});
  }

  //提交事件
  handleSubmit(e) {
    e.preventDefault();
    const FieldsValue = this.props.form.getFieldsValue();

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


  render() {
    const customerAuto = this.state.customerAuto;
    const companyNum = this.state.companyNum || '';
    const customer = this.state.customer || {};
    const genderDisplay =
      customer.gender === undefined ? '' : ('' + customer.gender == '0' ? '女' : ('' + customer.gender == '1' ? '男' : '未知'));
    const autos = this.state.autos || [];
    const memberCard = this.state.memberCard || {member_card_type_info: {}};
    const couponItemsStr = memberCard.member_card_type_info.coupon_items || '[]';
    const couponColumns = this.couponColumns;
    const couponItems = JSON.parse(couponItemsStr) || [];

    const maintainUsers = this.state.maintainUsers || [];
    const {getFieldDecorator} = this.props.form;

    const discount = this.state.discount || 0;
    const realPrice = (Number(memberCard.sell_price || 0) - Number(discount)).toFixed(2);

    const {formItemThree} = FormModalLayout;

    return (
      <div>
        <Form horizontal onSubmit={this.handleSubmit}>

          {/*//信息筛选*/}
          <Row className="mb10 mt30">
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
            <Col span={2} offset={15}>
              <Button size="large" type="primary" htmlType="submit">
                结算
              </Button>
            </Col>
          </Row>

          {/*//用户信息展示*/}
          <div className="form-board padding-bottom-15">
            <Row className="margin-top-20">
              <Col span={4} offset={1}>
                <FormItem label="客户姓名" {...formItemThree} className="mb10">
                  <span>{customer.name || ''}</span>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="性别" {...formItemThree} className="mb10">
                  <span>{genderDisplay}</span>
                </FormItem>
              </Col>
              <Col span={4} offset={1}>
                <FormItem label="手机号" {...formItemThree} className="mb10">
                  <span>{customer.phone || ''}</span>
                </FormItem>
              </Col>
            </Row>

            {
              autos.map((auto, index) => {
                return (
                  <Row key={auto._id}>
                    <Col span={4} offset={1}>
                      <FormItem label={`车牌号${index + 1}`} {...formItemThree} className="mb10">
                        <span>{auto.plate_num || ''}</span>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="车型" labelCol={{span: 4}} wrapperCol={{span: 20}} className="mb10">
                        <span>{auto.auto_type_name || ''}</span>
                      </FormItem>
                    </Col>
                  </Row>
                );
              })
            }

          </div>

          {/*//开卡信息*/}
          <Row className="margin-top-20 margin-bottom-10">
            <Col span={4}>
              <h3>- 开卡信息</h3>
            </Col>
          </Row>
          <div className="form-board padding-bottom-15">
            <Row className="margin-top-20">
              <Col span={6} offset={1}>
                <FormItem
                  label="输入卡号"
                  {...formItemThree}
                  required
                  className="mb10"
                >
                  {getFieldDecorator('card_number', {
                    initialValue: companyNum || '',
                    onChange: this.handleMemberInfoChange,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  label="输入密码"
                  {...formItemThree}
                  required
                  className="mb10"
                >
                  {getFieldDecorator('card_secret', {initialValue: '', onChange: this.handleMemberInfoChange})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={5} offset={2}>
                <FormItem
                  {...formItemThree}
                  className="mb10"
                >
                  <Button size="large" type="primary" onClick={this.handleCheckMemberCard}>验证</Button>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={6} offset={1}>
                <FormItem label="会员卡名称" {...formItemThree} className="mb10">
                  <span>{memberCard.member_card_type_info.name || ''}</span>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="售价" {...formItemThree} className="mb10">
                  <span>{memberCard.original_price ? `${memberCard.original_price} 元` : ''}</span>
                </FormItem>
              </Col>
              <Col span={5} offset={1}>
                <FormItem label="有效期" {...formItemThree} className="mb10">
                  <span>
                    {
                      memberCard.member_card_type_info.valid_day
                        ?
                        `${memberCard.member_card_type_info.valid_day} 天`
                        :
                        ''
                    }

                    </span>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={6} offset={1}>
                <FormItem
                  label="销售人员 "
                  {...formItemThree}
                  required
                  className="mb10"
                >
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

                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem
                  label="备注"
                  labelCol={{span: 3}}
                  wrapperCol={{span: 21}}
                  className="mb10"
                >
                  {getFieldDecorator('remark', {initialValue: ''})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>

          {/*//结算金额*/}
          <Row className="margin-top-20 margin-bottom-10">
            <Col span={4}>
              <h3>- 结算金额</h3>
            </Col>
          </Row>
          <div className="form-board padding-bottom-15">
            <Row className="margin-top-20">
              <Col span={6} offset={1}>
                <FormItem label="应收金额" {...formItemThree} className="mb10">
                  <span>{memberCard.original_price ? `${memberCard.original_price} 元` : ''}</span>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="优惠" {...formItemThree} className="mb10">
                  {getFieldDecorator('discount', {
                    initialValue: '' + (Number(memberCard.original_price || 0) - Number(memberCard.sell_price || 0)).toFixed(2),
                    onChange: this.handleDiscountChange,
                  })(
                    <Input
                      disabled={Number(memberCard.original_price) !== Number(memberCard.sell_price)}
                      type="number"
                      addonAfter="元"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col offset={1}>
                实收金额：
                <span style={{color: '#2db7f5', fontSize: 18, fontWeight: 'bold'}}>
                  {memberCard.original_price ? `${realPrice} 元` : ''}
                </span>
              </Col>
            </Row>
          </div>

          {/*//卡内优惠*/}
          <Row className="margin-top-20 margin-bottom-10">
            <Col span={4}>
              <h3>- 卡内优惠</h3>
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


MemberCardSale = Form.create()(MemberCardSale);
export default MemberCardSale;
