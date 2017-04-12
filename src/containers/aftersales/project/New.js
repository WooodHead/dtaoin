import React, {Component} from 'react';
import className from 'classnames';
import {
  message,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Menu,
  Dropdown,
  Alert,
  Switch,
  Icon,
} from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import text from '../../../config/text';

import CustomerAutoSearchBox from '../../../components/search/CustomerAutoSearchBox';

import Destroy from './Destroy';
import Finish from './Finish';
import PrintPaymentModal from './PrintPaymentModal';
import PrintDispatchModal from './PrintDispatchModal';
import PrintArrearsModal from './PrintArrearsModal';
import Pay from './Pay';
import EditAutoModal from '../../auto/EditAutoModal';
import NewAutoModal from '../../auto/NewAutoModal';

import TableItem from './TableItem';
import TablePart from './TablePart';
import TableMemberCardType from './TableMemberCard';
import TablePaymentHistory from './TablePaymentHistory';

require('../../../styles/order.less');

const FormItem = Form.Item;
const Option = Select.Option;
// const DropdownButton = Dropdown.Button;

class New extends Component {
  constructor(props) {
    super(props);

    let {id, customer_id, auto_id} = props.location.query;
    this.state = {
      id: id,
      customer_id: customer_id,
      auto_id: auto_id,
      isNew: !id,
      isEditing: false,
      isVisibleAdvice: false,
      isVisibleRemark: false,
      isChange: false,
      isBtnDisable: false, // save btn

      detail: {},
      customer: {},
      auto: {},
      autos: [],
      maintain_items: new Map(),
      maintain_parts: new Map(),
      deleted_maintain_items: new Set(),
      deleted_maintain_parts: new Set(),

      memberPrice: 0,
      totalFee: 0,
      realTotalFee: 0,
      discount: '',
      couponItem: [],
      couponPartType: [],
      couponItemFilteredRemoved: [],
      memberDetailList: [],
      historicalDebts: '0.00',

      nextRemindDateVisible: true,
    };

    [
      'handleSearchSelect',
      'handleEditUserInfo',
      'handleSaveUserInfo',
      'handleAutoChange',
      'handleCouponChange',
      'setTotalFee',
      'getCouponItem',
      'getCouponPartType',
      'addMaintainItem',
      'getCouponItemRemoved',
      'removeMaintainItem',
      'addMaintainPart',
      'removeMaintainPart',
      'getCouponPartsRemoved',
      'handleItemsUpdate',
      'setMemberDetailList',
      'handleSubmit',
      'handleMaintainTaskChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {id, customer_id, auto_id} = this.state;

    if (id) {
      this.getCustomerId(id);
    }
    if (customer_id) {
      this.getCustomerDetail(customer_id);
      this.getCustomerUnpayAmount(customer_id);
      this.getAutoDetail(customer_id, auto_id);
      this.getAutos(customer_id);
      if (id) {
        this.getMaintainIntentionDetail(id);
      }
    }
  }

  handleSearchSelect(data) {
    // TODO 这种方式会刷新页面，填充在search中的值被清空
    location.href = `/aftersales/project/new?customer_id=${data.customer_id}&auto_id=${data._id}`;
  }

  handleEditUserInfo() {
    this.setState({isEditing: true});
  }

  handleSaveUserInfo() {
    let {customer} = this.state;
    let {getFieldValue} = this.props.form;
    let customerName = getFieldValue('customer_name');
    let customerGender = getFieldValue('gender');

    api.ajax({
      url: api.customer.edit(),
      type: 'post',
      data: {
        customer_id: customer._id,
        name: customerName,
        gender: customerGender,
        phone: customer.phone,
        is_maintain: 1,
      },
    }, data => {
      let {customer_id} = data.res;
      if (customer._id === customer_id) {
        message.success('修改客户信息成功');
        this.getCustomerDetail(customer_id);
      }
    });

    this.setState({isEditing: false});
  }

  handleAutoChange(id) {
    let selectedAuto = this.state.autos.find(auto => auto._id === id);

    this.setState({
      auto: selectedAuto,
      auto_id: id,
    });
    this.props.form.setFieldsValue({
      auto_id: id,
      auto_type_name: selectedAuto.auto_type_name,
      plate_num: selectedAuto.plate_num,
      vin_num: selectedAuto.vin_num,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      let {
        isNew,
        isBtnDisable,
        maintain_items,
        maintain_parts,
        deleted_maintain_items,
        deleted_maintain_parts,
        auto,
      } = this.state;

      if (isBtnDisable) {
        return;
      }

      let itemNames = [];
      let partNames = [];
      let items = [];
      let parts = [];
      let deleteItemIds = new Set();
      let deletePartIds = new Set();

      if (!isNew) {
        if (deleted_maintain_items) {
          for (let item_id of deleted_maintain_items.values()) {
            deleteItemIds.add(item_id);
          }
        }
        if (deleted_maintain_items) {
          for (let part_id of deleted_maintain_parts.values()) {
            deletePartIds.add(part_id);
          }
        }
        values.item_delete_ids = Array.from(deleteItemIds).toString();
        values.part_delete_ids = Array.from(deletePartIds).toString();
      }

      for (let item of maintain_items.values()) {
        itemNames.push(item.item_name);
        items.push(item);
      }

      for (let part of maintain_parts.values()) {
        partNames.push(part.part_name);
        parts.push(part);
      }

      values.scheduled_end_time = DateFormatter.date(values.scheduled_end_time);
      values.start_time = DateFormatter.date(values.start_time);
      values.task_remind_date = DateFormatter.day(values.task_remind_date);
      values.item_names = itemNames.toString();
      values.part_names = partNames.toString();
      values.item_list = JSON.stringify(items);
      values.part_list = JSON.stringify(parts);
      values.total_fee = this.state.realTotalFee;
      values.discount = this.state.discount;
      values.is_accident = values.is_accident ? '1' : '0';
      values.is_maintain_task = values.is_maintain_task ? '1' : '0';
      values.vin_num = auto.vin_num;

      this.setState({isBtnDisable: true});
      api.ajax({
        url: isNew ? api.aftersales.addMaintainIntention() : api.aftersales.editMaintainIntention(),
        type: 'POST',
        data: values,
      }, data => {
        let {intention_id, customer_id, auto_id} = data.res;
        message.success(isNew ? '新增维保记录成功' : '修改维保记录成功');
        location.href = `/aftersales/project/new?id=${intention_id}&customer_id=${customer_id}&auto_id=${auto_id}`;
      }, (data) => {
        this.setState({isBtnDisable: false});
        message.error(data);
      });
    });
  }

  handleDateChange(field, value) {
    this.setState({[field]: value});
  }

  handleItemsUpdate(maintain_items, deleted_maintain_items) {
    this.setState({
      maintain_items,
      deleted_maintain_items,
    });
    this.setTotalFee();
  }

  handlePartsUpdate(maintain_parts, deleted_maintain_parts) {
    this.setState({
      maintain_parts,
      deleted_maintain_parts,
    });
    this.setTotalFee();
  }

  handleCouponChange(e) {
    let discount = Number(e.target.value).toFixed(2);
    let totalFee = Number(this.state.totalFee).toFixed(2);
    let realTotalFee = (Number(totalFee) - Number(discount)).toFixed(2);

    this.setState({
      discount: discount,
      realTotalFee: realTotalFee,
    });
  }

  handleMaintainTaskChange(checked) {
    let threeMonthsLater = DateFormatter.day(new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()));
    if (!checked) {
      this.props.form.setFieldsValue({task_remind_date: DateFormatter.getMomentDate(threeMonthsLater)});
      this.setState({nextRemindDateVisible: false});
    } else {
      this.setState({nextRemindDateVisible: true});
    }
  }

  setMemberDetailList(memberDetailList) {
    this.setState({memberDetailList: memberDetailList});
  }

  getCouponItem(couponItem) {
    couponItem.map((item) => this.addMaintainItem(item));
  }

  getCouponPartType(couponPartType) {
    couponPartType.map((item) => this.addMaintainPart(item));
  }

  getCouponItemRemoved(couponItemFilteredRemoved) {
    couponItemFilteredRemoved.map((item) => {
      this.removeMaintainItem(item.item_id, item._id);
    });
  }

  getCouponPartsRemoved(couponPartsFilteredRemoved) {
    couponPartsFilteredRemoved.map((item) => this.removeMaintainPart(item.part_type_id, item.part_id, item._id));
  }

  addMaintainItem(maintain_item) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.set(maintain_item.item_id, maintain_item);
    this.handleItemsUpdate(maintain_items, deleted_maintain_items);
  }

  removeMaintainItem(item_id, _id) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.delete(item_id);
    if (_id) {
      deleted_maintain_items.add(_id);
    }
    this.handleItemsUpdate(maintain_items, deleted_maintain_items);
  }

  addMaintainPart(maintain_part) {
    let {maintain_parts, deleted_maintain_parts} = this.state;
    maintain_parts.set(`${maintain_part.part_type_id}-${maintain_part.part_id}`, maintain_part);
    this.handlePartsUpdate(maintain_parts, deleted_maintain_parts);
  }

  removeMaintainPart(part_type_id, part_id, _id) {
    let {maintain_parts, deleted_maintain_parts} = this.state;
    maintain_parts.delete(`${part_type_id}-${part_id}`);
    if (_id) {
      deleted_maintain_parts.add(_id);
    }
    this.handlePartsUpdate(maintain_parts, deleted_maintain_parts);
  }

  showMaintainAdvice() {
    this.setState({isVisibleAdvice: !this.state.isVisibleAdvice});
  }

  showRemark() {
    this.setState({isVisibleRemark: !this.state.isVisibleRemark});
  }

  setTotalFee() {
    const discount = Number(this.state.discount);
    let totalFee = this.calculateTotalFee();
    let realTotalFee = (totalFee - discount).toFixed(2);

    this.setState({
      totalFee: totalFee,
      realTotalFee: realTotalFee,
    });
  }

  getDisabledOutDate(current) {
    let today = new Date();
    return current && current.valueOf() < new Date(today.setDate(today.getDate() - 1)).getTime();
  }

  getDisabledInDate(current) {
    let today = new Date();
    return current && current.valueOf() > new Date(today.setDate(today.getDate())).getTime();
  }

  calculateTotalTimeFee() {
    let {maintain_items} = this.state;
    let timeFee = 0;

    for (let item of maintain_items.values()) {
      let itemTimeFee = Number(item.time_fee);
      let itemCouponDiscount = Number(item.coupon_discount);
      if (!isNaN(itemTimeFee)) {
        timeFee += itemTimeFee;
        timeFee -= itemCouponDiscount;
      }
    }
    return timeFee;
  }

  calculateTotalMaterialFee() {
    let {maintain_parts} = this.state;
    let materialFee = 0;

    for (let part of maintain_parts.values()) {
      let partMaterialFee = Number(part.material_fee);
      let partDiscount = Number(part.coupon_discount);
      if (!isNaN(partMaterialFee)) {
        materialFee += partMaterialFee;
        materialFee -= partDiscount;
      }
    }
    return materialFee;
  }

  calculateTotalFee() {
    let timeFee = this.calculateTotalTimeFee();
    let materialFee = this.calculateTotalMaterialFee();
    let totalFee = 0;

    if (!isNaN(timeFee)) {
      totalFee += timeFee;
    }
    if (!isNaN(materialFee)) {
      totalFee += materialFee;
    }
    return Number(totalFee);
  }

  getCustomerId(id) {
    api.ajax({url: api.aftersales.maintProjectByProjectId(id)}, data => {
      let {intention_info} = data.res;

      this.setState({
        customer_id: intention_info.customer_id,
        detail: intention_info,
        isVisibleRemark: !!intention_info.remark,
        isVisibleAdvice: !!intention_info.maintain_advice,
        discount: intention_info.discount,
        coupon: intention_info.coupon,
        group_purchase: intention_info.group_purchase,
        realTotalFee: intention_info.total_fee,
      }, () => {
        let {customer_id, auto_id, detail} = this.state;
        this.getCustomerDetail(customer_id);
        this.getCustomerUnpayAmount(customer_id);
        this.getAutos(customer_id);
        this.getAutoDetail(customer_id, auto_id);

        if (!detail.task_maintain_info) {
          this.setState({nextRemindDateVisible: false});
        }
      });
    });
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.customer.detail(customerId)}, (data) => {
      this.setState({
        customer_id: customerId,
        customer: data.res.customer_info,
      });
    });
  }

  getCustomerUnpayAmount(customerId) {
    api.ajax({url: api.customer.getCustomerUnpayAmount(customerId)}, data => {
      let {unpay_amount} = data.res;
      this.setState({historicalDebts: unpay_amount ? Number(unpay_amount).toFixed(2) : '0.00'});
    });
  }

  getMaintainIntentionDetail(id) {
    api.ajax({url: api.aftersales.maintProjectByProjectId(id)}, data => {
      let {intention_info} = data.res;

      if (!intention_info.task_maintain_info) {
        this.setState({nextRemindDateVisible: false});
      }

      this.setState({
        detail: intention_info,
        customer_id: intention_info.customer_id,
        isVisibleRemark: !!intention_info.remark,
        isVisibleAdvice: !!intention_info.maintain_advice,
        discount: intention_info.discount,
        realTotalFee: intention_info.total_fee,
        coupon: intention_info.coupon,
        group_purchase: intention_info.group_purchase,
      });
    });
  }

  getAutoDetail(customerId, autoId) {
    if (Number(autoId)) {
      api.ajax({url: api.auto.detail(customerId, autoId)}, data => {
        this.setState({
          auto_id: autoId,
          auto: data.res.detail || {},
        });

        let {setFieldsValue} = this.props.form;
        let {auto} = this.state;

        setFieldsValue({
          auto_id: autoId,
          auto_type_name: auto ? `${auto.auto_brand_name} ${auto.auto_series_name} ${auto.auto_type_name}` : '',
          plate_num: auto.plate_num,
          vin_num: auto.vin_num,
        });
      });
    } else {
      this.setState({auto: {}});
    }
  }

  getAutos(customerId) {
    api.ajax({url: api.presales.superUserAutoList(customerId)}, data => {
      this.setState({autos: data.res.auto_list});
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    let {
      id,
      customer_id,
      auto_id,
      isNew,
      isEditing,
      isVisibleAdvice,
      isVisibleRemark,
      isChange,
      isBtnDisable,
      detail,
      customer,
      auto,
      autos,
      maintain_items,
      maintain_parts,
      deleted_maintain_items,
      deleted_maintain_parts,
      realTotalFee,
      couponItem,
      couponPartType,
      memberDetailList,
      historicalDebts,
      nextRemindDateVisible,
    } = this.state;

    let timeFee = this.calculateTotalTimeFee();
    let materialFee = this.calculateTotalMaterialFee();

    let status = String(detail.status);
    let payStatus = String(detail.pay_status);

    let threeMonthsLater = DateFormatter.day(new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()));

    const printOptionProps = {
      isDisabled: isChange,
      project: detail,
      customer: customer,
      auto: auto,
      items: maintain_items,
      parts: maintain_parts,
      timeFee: timeFee,
      materialFee: materialFee,
      realTotalFee: realTotalFee,
    };

    const printMenu = (
      <Menu>
        <Menu.Item key="1">
          <PrintPaymentModal {...printOptionProps}/>
        </Menu.Item>
        {status === '0' && (
          <Menu.Item key="2">
            <PrintDispatchModal {...printOptionProps}/>
          </Menu.Item>
        )}
        {payStatus === '1' && (
          <Menu.Item key="3">
            <PrintArrearsModal {...printOptionProps}/>
          </Menu.Item>
        )}
      </Menu>
    );

    const isEditContainer = className({
      hide: !isEditing,
    });
    const isShowContainer = className({
      hide: isEditing,
    });

    const customerInfoContainer = className({
      'customer-info': !!customer._id,
      hide: !customer._id,
    });

    const customerInfo = className({
      'text-gray': true,
      hide: isEditing,
    });

    const customerNameIcon = className({
      'icon-first-name-none': !customer._id,
      'icon-first-name': true,
    });

    const adviceContainer = className({
      hide: !isVisibleAdvice,
      'info-line': true,
    });
    const remarkContainer = className({
      hide: !isVisibleRemark,
      'info-line': true,
      'mb20': true,
    });

    return (
      <div>
        {status === '-1' && (
          <Alert
            message="该工单已作废"
            description={`作废原因：${detail.cancel_reason || '无原因'}`}
            type="warning"
            showIcon
          />
        )}

        <Row className="head-action-bar">
          <Col span={6}>
            <CustomerAutoSearchBox
              api={api.presales.searchCustomerAutos()}
              select={this.handleSearchSelect}
              style={{width: 250}}
            />
          </Col>
          <Col span={18}>
            <div className="pull-right">
              <span className="mr10">
                <Destroy detail={detail}/>
              </span>

              <span className="mr10">
                <Dropdown
                  overlay={printMenu}
                  trigger={['click']}
                  disabled={JSON.stringify(this.props.location.query) == '{}' || status === '-1'}
                >
                  <Button>打印 <Icon type="down"/></Button>
                </Dropdown>
              </span>

              <span className="mr10">
                <Pay
                  project_id={id}
                  customer_id={customer_id}
                  project={detail}
                  customer={customer}
                  auto={auto}
                  items={maintain_items}
                  parts={maintain_parts}
                  timeFee={timeFee}
                  materialFee={materialFee}
                  realTotalFee={realTotalFee}
                  disabled={isNew}
                />
              </span>

              <span className="mr10">
                <Finish
                  detail={detail}
                  items={Array.from(maintain_items.values())}
                  parts={Array.from(maintain_parts.values())}
                  disabled={isNew}
                />
              </span>

              <Button
                className="ml5"
                size="default"
                type="primary"
                onClick={this.handleSubmit}
                disabled={isBtnDisable || (status !== 'undefined' && status !== '0') || (!isNew && false)}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>

        <Form>
          {getFieldDecorator('_id', {initialValue: detail._id || id})(<Input type="hidden"/>)}
          {getFieldDecorator('customer_id', {initialValue: customer_id})(<Input type="hidden"/>)}
          {getFieldDecorator('plate_num', {initialValue: auto.plate_num})(<Input type="hidden"/>)}

          <div className="base-info">
            <div className="customer-container">
              <div className={customerNameIcon}>
                {customer.name ? customer.name.substr(0, 1) : <Icon type="user" style={{color: '#fff'}}/>}
              </div>
              <div className={customerInfoContainer}>
                <div className={isShowContainer}>
                  <span className="customer-name">{customer.name}</span>
                  <span className="ml6">{text.gender[String(customer.gender)]}</span>
                  <a href="javascript:" className="ml6" onClick={this.handleEditUserInfo}>编辑</a>
                </div>

                <div className={isEditContainer}>
                  {getFieldDecorator('customer_name', {
                    initialValue: customer.name,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="客户姓名" style={{width: 100}}/>
                  )}
                  {getFieldDecorator('gender', {initialValue: String(customer.gender || -1)})(
                    <Select className="ml6" style={{width: 60}}>
                      <Option value={'1'}>男士</Option>
                      <Option value={'0'}>女士</Option>
                      <Option value={'-1'}>未知</Option>
                    </Select>
                  )}
                  <a href="javascript:" className="ml6" onClick={this.handleSaveUserInfo}>保存</a>
                </div>

                <div className={customerInfo}>
                  <span>{customer.phone}</span>
                  <span className="ml10 mr10">历史欠款 {historicalDebts}元</span>
                  <span className="tag">
                    {customer.member_card_name ? `${customer.member_card_name}` : '普通用户'}
                  </span>
                </div>
              </div>
            </div>

            <div className="line-middle">
              <FormItem label="工单号" className="inline-block" labelCol={{span: 9}} wrapperCol={{span: 15}}
                        style={{minWidth: 160}}>
                <p className="ant-form-text">{detail._id || '--'}</p>
              </FormItem>

              <FormItem label="事故车" className="inline-block" labelCol={{span: 16}} wrapperCol={{span: 8}}
                        style={{minWidth: 140}}>
                {getFieldDecorator('is_accident', {
                  valuePropName: 'checked',
                  initialValue: detail.is_accident === '1',
                })(
                  <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                )}
              </FormItem>

              <FormItem label="里程数" className="inline-block" labelCol={{span: 8}} wrapperCol={{span: 14}}>
                {getFieldDecorator('mileage', {initialValue: detail.mileage})(
                  <Input addonAfter="公里"/>
                )}
              </FormItem>

              <FormItem label="进厂日期" className="inline-block" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                {getFieldDecorator('start_time', {
                  initialValue: detail.start_time && detail.start_time.indexOf('0000') < 0 ? DateFormatter.getMomentDate(detail.start_time) : DateFormatter.getMomentDate(),
                })(
                  <DatePicker
                    format={DateFormatter.pattern.day}
                    disabledDate={this.getDisabledInDate}
                    placeholder="请选择进厂日期"
                    disabled={!isNew}
                    allowClear={false}
                  />
                )}
              </FormItem>

              <FormItem label="预计出厂日期" className="inline-block" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                {getFieldDecorator('scheduled_end_time', {
                  initialValue: detail.scheduled_end_time && detail.scheduled_end_time.indexOf('0000') < 0 ? DateFormatter.getMomentDate(detail.scheduled_end_time) : DateFormatter.getMomentDate(),
                })(
                  <DatePicker
                    format={DateFormatter.pattern.day}
                    disabledDate={this.getDisabledOutDate}
                    placeholder="请选择出厂时间"
                    allowClear={false}
                  />
                )}
              </FormItem>
            </div>
          </div>

          <div className="auto-container">
            <label className="ml20 mr5 text-gray label">车牌号</label>
            {auto_id ?
              <div style={{display: 'flex', alignItems: 'center'}}>
                {getFieldDecorator('auto_id', {
                  initialValue: auto_id || '',
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onChange',
                })(
                  <Select
                    size="large"
                    style={{width: 110}}
                    onSelect={this.handleAutoChange}
                    disabled={!isNew}
                  >
                    {autos.map(auto => <Option key={auto._id}>{auto.plate_num}</Option>)}
                  </Select>
                )}

                <span className="ml5">
                  <EditAutoModal
                    customer_id={customer_id}
                    auto_id={auto._id}
                    //判断是否已是完工和作废 再判断工单id 最后判断autoId
                    isDisable={['1', '-1'].indexOf(String(detail.status)) > -1 ? true : id ? !id : !Number(auto_id)}
                  />
                </span>

                <span className="ml5">
                  <NewAutoModal customer_id={customer_id} isDisable={id}/>
                </span>
              </div> :
              '--'
            }

            <label className="ml30 text-gray label">车型信息</label>
            <div className="ant-form-text">
              {auto.auto_brand_name ? auto.auto_brand_name + ' ' + auto.auto_series_name + ' ' + auto.auto_type_name : '--'}
            </div>

            <label className="ml30 text-gray label">车架号</label>
            <div className="ant-form-text">{auto.vin_num || '--'}</div>
          </div>

          <div className="with-bottom-divider">
            <Row className="mt20 mb20">
              <Col span={8}>
                <h3>保养信息</h3>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <label className="label">是否提醒保养</label>
                {getFieldDecorator('is_maintain_task', {
                  valuePropName: 'checked',
                  initialValue: !!detail.task_maintain_info,
                  onChange: this.handleMaintainTaskChange,
                })(
                  <Switch
                    checkedChildren={'是'} unCheckedChildren={'否'}
                    disabled={detail.status ? !(Number(detail.status) === 0) : false}
                  />
                )}
              </Col>

              <Col span={6}>
                <label className="label">下次保养时间</label>
                {getFieldDecorator('task_remind_date', {
                  initialValue: !!detail.task_maintain_info ? DateFormatter.getMomentDate(detail.task_maintain_info.remind_date) : DateFormatter.getMomentDate(threeMonthsLater),
                })(
                  <DatePicker
                    format={DateFormatter.pattern.day}
                    disabled={detail.status ? (!(Number(detail.status) === 0 && nextRemindDateVisible)) : !nextRemindDateVisible}
                    allowClear={false}
                  />
                )}
              </Col>
              <Col>
                <p className="text-gray">注：如果不填写默认为三个月后</p>
              </Col>
            </Row>
          </div>

          <div className="with-bottom-divider">
            <Row className="module-head">
              <Col span={8}>
                <h3>预检信息</h3>
              </Col>
              <Col span={16}>
                <div className="pull-right">
                  <Button type="ghost" className="mr15" onClick={this.showMaintainAdvice.bind(this)}>维修建议</Button>
                  <Button type="ghost" onClick={this.showRemark.bind(this)}>备注</Button>
                </div>
              </Col>
            </Row>

            <div className="info-line">
              <label className="label">故障描述</label>
              {getFieldDecorator('failure_desc', {initialValue: detail.failure_desc})(
                <Input type="textarea" placeholder="故障描述" autosize/>
              )}
            </div>

            <div className={adviceContainer}>
              <label className="label">维修建议</label>
              {getFieldDecorator('maintain_advice', {initialValue: detail.maintain_advice})(
                <Input type="textarea" placeholder="维修建议" autosize/>
              )}
            </div>

            <div className={remarkContainer}>
              <label className="label ml7">备注</label>
              {getFieldDecorator('remark', {initialValue: detail.remark})(
                <Input type="textarea" placeholder="备注" autosize/>
              )}
            </div>
          </div>

          <TableMemberCardType
            customer={customer}
            itemMap={maintain_items}
            partMap={maintain_parts}
            getCouponItem={this.getCouponItem}
            getCouponPartType={this.getCouponPartType}
            getCouponItemRemoved={this.getCouponItemRemoved}
            getCouponPartsRemoved={this.getCouponPartsRemoved}
            setMemberDetailList={this.setMemberDetailList}
          />

          <TableItem
            intention_id={id}
            customer_id={customer_id}
            couponItem={couponItem}
            memberDetailList={memberDetailList}
            itemMap={maintain_items}
            deleted_maintain_items={deleted_maintain_items}
            addMaintainItem={this.addMaintainItem}
            removeMaintainItem={this.removeMaintainItem}
            onSuccess={this.handleItemsUpdate.bind(this)}
          />

          <TablePart
            intention_id={id}
            customer_id={customer_id}
            couponPartType={couponPartType}
            memberDetailList={memberDetailList}
            partMap={maintain_parts}
            deleted_maintain_parts={deleted_maintain_parts}
            addMaintainPart={this.addMaintainPart}
            removeMaintainPart={this.removeMaintainPart}
            onSuccess={this.handlePartsUpdate.bind(this)}
          />

          <div className="module-head">
            <h3>结算信息</h3>
          </div>

          <div className="info-line">
            <label className="label">结算金额</label>
            <p className="ant-form-text">{Number(materialFee + timeFee).toFixed(2)}元</p>
          </div>

          <div className="info-line">
            <label className="label">优惠金额</label>
            <div className="width-150">
              {getFieldDecorator('discount', {
                initialValue: detail.discount || '0.00',
                onChange: this.handleCouponChange,
              })(
                <Input type="number" min={0.00} addonAfter="元" placeholder="优惠金额"/>
              )}
            </div>
          </div>

          <div className="info-line">
            <label className="label">应付金额</label>
            <p className="ant-form-text order-money">{Number(realTotalFee).toFixed(2)}元</p>

            <div className={payStatus === '1' ? 'ml40' : 'hide'}>
              <label className="label">实付金额</label>
              <p
                className="ant-form-text order-money">{Number((detail.total_fee || 0) - (detail.unpay_amount || 0)).toFixed(2)}元</p>
            </div>

            <div className={payStatus === '1' ? 'ml40' : 'hide'}>
              <label className="label">还款记录</label>
              <p className="ant-form-text"><TablePaymentHistory customerId={customer_id} id={detail._id}/></p>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
