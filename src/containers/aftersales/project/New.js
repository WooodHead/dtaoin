import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import className from 'classnames';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  message,
  Popconfirm,
  Popover,
  Row,
  Select,
  Tooltip,
} from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import text from '../../../config/text';

import CustomerSearchDrop from '../../../components/widget/CustomerSearchDrop';

import Destroy from './Destroy';
import PrintPaymentModal from './PrintPaymentModal';
import PrintDispatchModal from './PrintDispatchModal';
import PrintArrearsModal from './PrintArrearsModal';
import EditAutoModal from '../../auto/EditAutoModal';
import NewAutoModal from '../../auto/NewAutoModal';
import PutCarRemind from './PutCarRemind';
import PayNow from './PayNow';
import PayRepayment from './PayRepayment';
import PayByPosOrApp from './PayByPosOrApp';
import NumberInput from '../../../components/widget/NumberInput';

import TableItem from './TableItem';
import TablePart from './TablePart';
import TableMemberCardType from './TableMemberCard';
import TablePaymentHistory from './TablePaymentHistory';
import TableProfit from './TableProfit';

const FormItem = Form.Item;
const Option = Select.Option;
const DropdownButton = Dropdown.Button;
const completed = require('../../../images/completed.png');
const nvalid = require('../../../images/nvalid.png');
const closed = require('../../../images/closed.png');
const bad = require('../../../images/stamp_bad.png');
const Search = Input.Search;

require('../project.less');

class New extends Component {
  constructor(props) {
    super(props);

    const { id, customerId, autoId } = props.match.params;
    this.state = {
      id: id || '',
      customerId: customerId || '',
      autoId: autoId || '',
      isNew: !id,
      isEditing: false,
      isVisibleRemark: false,
      isChange: false,
      isBtnDisable: false, // save btn
      isHide: true,
      isShowTip: false, // 显示引导信息

      detail: {},
      customer: {},
      auto: {},
      autos: [],
      maintain_items: new Map().set('add', { item_id: 'add' }),
      maintain_parts: new Map().set('add', { part_id: 'add' }),
      deleted_maintain_items: new Set(),
      deleted_maintain_parts: new Set(),

      memberPrice: 0,
      totalFee: 0,
      realTotalFee: 0,
      discount: '',
      couponItem: [],
      couponPartType: [],
      couponItemFilteredRemoved: [],
      couponUseStatus: {},
      memberDetailList: [],
      historicalDebts: '0.00',

      nextRemindDateVisible: true,
      key: '',
      fitterUsers: [],
      meritPayItemList: [],

      rectInfo: {}, // 下次保养时间日期框坐标及大小
    };

    [
      'onNoLongerRemindChange',
      'onIKnowClick',
      'handleSearchSelect',
      'handleEditUserInfo',
      'handleSaveUserInfo',
      'handleAutoChange',
      'handleCouponChange',
      'setTotalFee',
      'addMaintainItem',
      'removeMaintainItem',
      'addMaintainPart',
      'removeMaintainPart',
      'handleItemsUpdate',
      'handlePartsUpdate',
      'setMemberDetailList',
      'handleSubmit',
      'handleMaintainTaskChange',
      'handleHideAutoInfo',
      'getMaintainIntentionDetail',
      'handleEditCouponUseState',
      'handleCustomerSearch',
      'handleSearchClear',
      'handleIntentionPayFail',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id, customerId, autoId } = this.state;

    if (id) {
      this.getCustomerId(id);
    }
    if (customerId) {
      this.getCustomerDetail(customerId);
      this.getCustomerUnpayAmount(customerId);
      this.getAutoDetail(customerId, autoId);
      this.getAutos(customerId);
    }
    if (id) {
      this.getMaintainIntentionDetail(id);
    }

    this.getFitterUsers();

    this.refs.canHide.style.height = '0px';

    this.calculateRectInfo();
  }

  onNoLongerRemindChange(e) {
    localStorage.setItem('no_remind_project', e.target.checked);
  }

  onIKnowClick() {
    this.setState({ isShowTip: false });
  }

  handleSearchSelect(data) {
    this.getCustomerDetail(data.customer_id);
    this.getCustomerUnpayAmount(data.customer_id);
    this.getAutoDetail(data.customer_id, data._id);
    this.getAutos(data.customer_id);

    // TODO 这种方式会刷新页面，填充在search中的值被清空
    // location.href = `/aftersales/project/new/${data.customer_id}/${data._id}`;
  }

  handleEditUserInfo() {
    this.setState({ isEditing: true });
  }

  handleSaveUserInfo() {
    const { customer } = this.state;
    const { getFieldValue } = this.props.form;
    const customerName = getFieldValue('customer_name');
    const customerGender = getFieldValue('gender');

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
      message.success('修改客户信息成功');
      this.getCustomerDetail(data.res.customer_id);
    });

    this.setState({ isEditing: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      const {
        isNew,
        isBtnDisable,
        maintain_items,
        maintain_parts,
        deleted_maintain_items,
        deleted_maintain_parts,
        auto,
      } = this.state;

      if (maintain_items.has('add') && Number(maintain_items.size) === 1) {
        message.warn('请填写维修项目');
        return false;
      }

      maintain_parts.delete('add');
      maintain_items.delete('add');

      if (isBtnDisable) {
        return;
      }

      const itemNames = [];
      const partNames = [];
      const items = [];
      const parts = [];
      const deleteItemIds = new Set();
      const deletePartIds = new Set();

      if (!isNew) {
        if (deleted_maintain_items) {
          for (const item_id of deleted_maintain_items.values()) {
            deleteItemIds.add(item_id);
          }
        }
        if (deleted_maintain_items) {
          for (const part_id of deleted_maintain_parts.values()) {
            deletePartIds.add(part_id);
          }
        }
        values.item_delete_ids = Array.from(deleteItemIds).toString();
        values.part_delete_ids = Array.from(deletePartIds).toString();
      }

      for (const item of maintain_items.values()) {
        if (!item.fitter_user_ids) {
          message.error('请填写维修人员');
          return false;
        }

        if (!item.seller_user_ids) {
          // message.error('请填写销售人员');
          item.seller_user_ids = '';
          // return false;
        }

        if (!item.time_fee_base) {
          message.error('请填写工时单价');
          return false;
        }

        itemNames.push(item.item_name);
        items.push(item);
      }

      for (const part of maintain_parts.values()) {
        if (!part.material_fee_base) {
          message.error('请填写配件单价');
          return false;
        }
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
      values.is_maintain_task = !!(values.task_remind_date === 'Invalid date') ? '0' : '1';
      values.vin_num = auto.vin_num;
      values.auto_id = auto._id;

      this.setState({ isBtnDisable: true });
      api.ajax({
        url: isNew ? api.aftersales.addMaintainIntention() : api.aftersales.editMaintainIntention(),
        type: 'POST',
        data: values,
      }, data => {
        const { intention_id, customer_id, auto_id } = data.res;
        message.success(isNew ? '新增维保记录成功' : '修改维保记录成功');
        location.href = `/aftersales/project/edit/${intention_id}/${customer_id}/${auto_id}`;
      }, data => {
        this.setState({ isBtnDisable: false });
        message.error(data);
      });
    });
  }

  handleDateChange(field, value) {
    this.setState({ [field]: value });
  }

  handleItemsUpdate(maintain_items, deleted_maintain_items) {
    deleted_maintain_items = !!deleted_maintain_items
      ? deleted_maintain_items
      : this.state.deleted_maintain_items;
    this.setState({
      maintain_items,
      deleted_maintain_items,
    });
    this.setTotalFee();
  }

  handlePartsUpdate(maintain_parts, deleted_maintain_parts) {
    deleted_maintain_parts = !!deleted_maintain_parts
      ? deleted_maintain_parts
      : this.state.deleted_maintain_parts;

    this.setState({
      maintain_parts,
      deleted_maintain_parts,
    });
    this.setTotalFee();
  }

  handleCouponChange(value) {
    const totalFee = Number(this.state.totalFee).toFixed(2);
    if (Number(value) > Number(totalFee)) {
      message.warn('优惠金额不能大于结算金额');
      return false;
    }

    const discount = Number(value).toFixed(2);
    const realTotalFee = (Number(totalFee) - Number(discount)).toFixed(2);

    this.setState({
      discount,
      realTotalFee,
    });
  }

  handleAutoChange(autoId) {
    this.getAutoDetail(this.state.customerId, autoId);
  }

  handleMaintainTaskChange(e) {
    const threeMonthsLater = DateFormatter.day(new Date(new Date().getFullYear(), new Date().getMonth() +
      3, new Date().getDate()));
    if (!!e.target.checked) {
      this.props.form.setFieldsValue({ task_remind_date: DateFormatter.getMomentDate(threeMonthsLater) });
      this.setState({ nextRemindDateVisible: false });
    } else {
      this.setState({ nextRemindDateVisible: true });
    }
  }

  handleHideAutoInfo(isHide) {
    const info = this.refs.canHide;
    let height = info.offsetHeight;
    const contentHeight = this.refs.contentInfo.offsetHeight;

    if (isHide) {
      this.setState({ isHide: false });
      window.timer = setInterval(() => {
        height += 4;
        if (Number(height) < (contentHeight + 8)) {
          info.style.height = `${height}px`;
        } else {
          info.style.height = 'auto';
          clearInterval(window.timer);
        }
      }, 10);
    } else {
      this.setState({ isHide: true });
      window.timer = setInterval(() => {
        height -= 4;
        if (Number(height) > 0) {
          info.style.height = `${height}px`;
        } else {
          info.style.height = '0px';
          clearInterval(window.timer);
        }
      }, 10);
    }
  }

  handleEditCouponUseState(id, active) {
    const { couponUseStatus } = this.state;
    if (active === 'delete') {
      delete couponUseStatus[id];
    } else if (active === 'add') {
      couponUseStatus[id] = true;
    }
    this.setState({ couponUseStatus });
  }

  setMemberDetailList(memberDetailList) {
    this.setState({ memberDetailList });
  }

  addMaintainItem(maintain_item) {
    const { maintain_items, deleted_maintain_items } = this.state;
    maintain_items.set(maintain_item.item_id, maintain_item);
    this.handleItemsUpdate(maintain_items, deleted_maintain_items);
  }

  removeMaintainItem(item_id, _id) {
    const { maintain_items, deleted_maintain_items } = this.state;
    maintain_items.delete(item_id);
    if (_id) {
      deleted_maintain_items.add(_id);
    }
    this.handleItemsUpdate(maintain_items, deleted_maintain_items);
  }

  addMaintainPart(maintain_part) {
    const { maintain_parts, deleted_maintain_parts } = this.state;
    maintain_parts.set(`${maintain_part.part_type_id}-${maintain_part.part_id}`, maintain_part);
    this.handlePartsUpdate(maintain_parts, deleted_maintain_parts);
  }

  removeMaintainPart(mapKey, _id) {
    const { maintain_parts, deleted_maintain_parts } = this.state;
    maintain_parts.delete(mapKey);
    // 删除一项后索引需要重新变化
    const partMap = new Map();
    for (const value of maintain_parts.values()) {
      partMap.set(partMap.size, value);
    }

    if (_id) {
      deleted_maintain_parts.add(_id);
    }
    this.handlePartsUpdate(partMap, deleted_maintain_parts);
  }

  setTotalFee() {
    const discount = Number(this.state.discount);
    const totalFee = this.calculateTotalFee();
    const realTotalFee = (totalFee - discount).toFixed(2);

    this.setState({
      totalFee,
      realTotalFee,
    });
  }

  getDisabledOutDate(current) {
    const today = new Date();
    return current && current.valueOf() < new Date(today.setDate(today.getDate() - 1)).getTime();
  }

  getDisabledInDate(current) {
    const today = new Date();
    return current && current.valueOf() > new Date(today.setDate(today.getDate())).getTime();
  }

  calculateTotalTimeFee() {
    const { maintain_items } = this.state;
    let timeFee = 0;

    for (const item of maintain_items.values()) {
      const itemTimeFee = Number(item.time_fee);
      const itemCouponDiscount = Number(item.coupon_discount);
      if (!isNaN(itemTimeFee)) {
        timeFee += itemTimeFee;
        timeFee -= itemCouponDiscount;
      }
    }
    return timeFee;
  }

  calculateTotalMaterialFee() {
    const { maintain_parts } = this.state;
    let materialFee = 0;

    for (const part of maintain_parts.values()) {
      const partMaterialFee = Number(part.material_fee);
      const partDiscount = Number(part.coupon_discount);
      if (!isNaN(partMaterialFee)) {
        materialFee += partMaterialFee;
        materialFee -= partDiscount;
      }
    }
    return materialFee;
  }

  calculateTotalFee() {
    const timeFee = this.calculateTotalTimeFee();
    const materialFee = this.calculateTotalMaterialFee();
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
    api.ajax({ url: api.aftersales.maintProjectByProjectId(id) }, data => {
      const { intention_info } = data.res;

      this.setState({
        customerId: intention_info.customer_id,
        detail: intention_info,
        isVisibleRemark: !!intention_info.remark,
        isVisibleAdvice: !!intention_info.maintain_advice,
        discount: intention_info.discount,
        coupon: intention_info.coupon,
        group_purchase: intention_info.group_purchase,
        realTotalFee: intention_info.total_fee,
      }, () => {
        const { customerId, autoId } = this.state;
        this.getCustomerDetail(customerId);
        this.getCustomerUnpayAmount(customerId);
        this.getAutos(customerId);
        this.getAutoDetail(customerId, autoId);
      });
    });
  }

  // 获取完用户信息后，显示引导信息popover
  getCustomerDetail(customerId) {
    api.ajax({ url: api.customer.detail(customerId) }, data => {
      const isNoRemindProject = localStorage.getItem('no_remind_project') === 'true';
      // 只在新增时提示相关信息
      if (!isNoRemindProject && location.pathname.indexOf('aftersales/project/new') > -1) {
        this.setState({
          customerId,
          customer: data.res.customer_info,
          isShowTip: true,
        });
        this.calculateRectInfo();
      } else {
        this.setState({
          customerId,
          customer: data.res.customer_info,
        });
      }

      this.props.form.setFieldsValue({
        customer_name: data.res.customer_info.name,
      });
    });
  }

  getCustomerUnpayAmount(customerId) {
    api.ajax({ url: api.customer.getCustomerUnpayAmount(customerId) }, data => {
      const { unpay_amount } = data.res;
      this.setState({ historicalDebts: unpay_amount ? Number(unpay_amount).toFixed(2) : '0.00' });
    });
  }

  getMaintainIntentionDetail(id) {
    api.ajax({ url: api.aftersales.maintProjectByProjectId(id) }, data => {
      const { intention_info } = data.res;
      const { merit_pay_item_list } = data.res;

      this.setState({
        detail: intention_info,
        customerId: intention_info.customer_id,
        isVisibleRemark: !!intention_info.remark,
        isVisibleAdvice: !!intention_info.maintain_advice,
        discount: intention_info.discount,
        realTotalFee: intention_info.total_fee,
        coupon: intention_info.coupon,
        group_purchase: intention_info.group_purchase,
        meritPayItemList: merit_pay_item_list,
      });
      if (!this.state.autoId) {
        this.getAutoDetail(intention_info.customer_id, intention_info.auto_id);
      }
    });
  }

  getAutoDetail(customerId, autoId) {
    if (Number(autoId)) {
      api.ajax({ url: api.auto.detail(customerId, autoId) }, data => {
        this.setState({
          autoId,
          auto: data.res.detail || {},
        });

        const { setFieldsValue } = this.props.form;
        const { auto } = this.state;

        setFieldsValue({
          auto_id: autoId,
          auto_type_name: auto
            ? `${auto.auto_brand_name} ${auto.auto_series_name} ${auto.auto_type_name}`
            : '',
          plate_num: auto.plate_num,
          vin_num: auto.vin_num,
        });
      });
    } else {
      this.setState({ auto: {} });
    }
  }

  handleCustomerSearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);
    this.setState({ key });

    if (!!key) {
      const keyType = Number(key);

      if (isNaN(keyType) && key.length < 2) {
        return false;
      }
      // phone number
      if (!isNaN(keyType) && key.length < 6) {
        return false;
      }

      api.ajax({ url: api.presales.searchCustomerAutos(key) }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list.filter(item => item._id != null);
        info.coordinate = coordinate;
        info.visible = true;
        info.keyword = key;
        this.setState({ data: info });
      });
    }
  }

  handleSearchClear() {
    this.setState({ key: '' });
  }

  handleIntentionPayFail() {
    const { id, customerId } = this.state;
    const data = {
      _id: id,
      customer_id: customerId,
    };
    api.ajax({ url: api.aftersales.maintainIntentionPayFail(), type: 'POST', data });
    location.reload();
  }

  disabledStartDate(current) {
    return current && current.valueOf() < new Date(new Date().setDate(new Date().getDate() - 1));
  }

  /**
   * 计算下次保养日期时间选择器的坐标及大小
   * 暂时无法实时监测dom内容的高度变化，所以先用延迟的方式计算坐标
   **/
  calculateRectInfo() {
    const maintainDateElement = this.maintainDate;
    if (maintainDateElement) {
      setTimeout(() => {
        const rectInfo = ReactDOM.findDOMNode(maintainDateElement).getBoundingClientRect();
        this.setState({ rectInfo });
      }, 50);
    }
  }

  getAutos(customerId) {
    api.ajax({ url: api.presales.superUserAutoList(customerId) }, data => {
      this.setState({ autos: data.res.auto_list });
    });
  }

  getFitterUsers() {
    api.ajax({ url: api.user.getMaintainUsers(0) }, data => {
      this.setState({ fitterUsers: data.res.user_list });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      id,
      customerId,
      autoId,
      isNew,
      isEditing,
      isHide,
      isChange,
      isBtnDisable,
      isShowTip,
      detail,
      customer,
      auto,
      data,
      key,
      maintain_items,
      maintain_parts,
      realTotalFee,
      couponItem,
      couponPartType,
      memberDetailList,
      historicalDebts,
      nextRemindDateVisible,
      couponUseStatus,
      fitterUsers,
      meritPayItemList,
      rectInfo,
    } = this.state;

    const timeFee = this.calculateTotalTimeFee();
    const materialFee = this.calculateTotalMaterialFee();
    let profitTotal = 0;

    meritPayItemList.map(item => {
      profitTotal += Number(item.amount);
    });

    const status = String(detail.status);
    const payStatus = String(detail.pay_status);

    const printOptionProps = {
      isDisabled: isChange,
      project: detail,
      customer,
      auto,
      items: maintain_items,
      parts: maintain_parts,
      timeFee,
      materialFee,
      realTotalFee,
    };

    const isPosDevice = api.getLoginUser().isPosDevice;

    const moreMenu = (
      <Menu>
        <Menu.Item key="1">
          <PutCarRemind
            plateNum={auto.plate_num}
            customerName={customer.name}
            gender={customer.gender}
            id={detail._id}
          />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2" className={status === '1' ? 'hide' : ''}>
          <Destroy detail={detail} />
        </Menu.Item>
      </Menu>
    );

    const printMenu = (
      <Menu>
        {status === '0' && (
          <Menu.Item key="2">
            <PrintDispatchModal {...printOptionProps} />
          </Menu.Item>
        )}
        {payStatus === '1' && (
          <Menu.Item key="3">
            <PrintArrearsModal {...printOptionProps} />
          </Menu.Item>
        )}
      </Menu>
    );

    const payMenu = (
      <Menu>
        {Number(isPosDevice) === 1 && (
          <Menu.Item key="1" className={Number(detail.pay_status) === 0 ? '' : 'hide'}>
              <span>
                <PayByPosOrApp
                  project={detail}
                  type="pos"
                  onFinish={this.getMaintainIntentionDetail}
                />
              </span>
          </Menu.Item>
        )}
        <Menu.Item key="2" className={Number(detail.pay_status) === 0 ? '' : 'hide'}>
          <PayByPosOrApp
            project={detail}
            type="app"
            onFinish={this.getMaintainIntentionDetail}
          />
        </Menu.Item>
        <Menu.Item key="3" className={Number(detail.pay_status) === 1 ? '' : 'hide'}>
          <Popconfirm
            placement="topRight"
            title="是否确认欠款无法收回，坏账后将扣除配件成本"
            onConfirm={this.handleIntentionPayFail}
          >
            <p style={{ width: '81px', textAlign: 'center' }}>坏账</p>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    const contentTip = (
      <div>
        <p>录入下次保养日期和当前里程数</p>
        <p>系统可自动发送保养提醒短信</p>

        <div style={{ marginTop: 5, marginBottom: 5 }}>
          <Checkbox onChange={this.onNoLongerRemindChange}>
            <span style={{ fontSize: 12 }}>不再提醒</span>
          </Checkbox>

          <Button
            type={'primary'}
            size={'small'}
            className="shuidao-btn-tiny"
            onClick={this.onIKnowClick}
          >
            <span style={{ fontSize: 12 }}>我知道了</span>
          </Button>
        </div>
      </div>
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

    const guideView = className({
      'modal-guide-mask': isShowTip,
      'modal-guide-mask-scroll': isShowTip,
      hide: !isShowTip,
    });

    return (
      <div>
        <img src={completed} className={payStatus === '2' ? 'completed' : 'hide'} />
        <img src={nvalid} className={status === '-1' ? 'completed' : 'hide'} />
        <img src={closed} className={status === '1' && payStatus !== '2' && payStatus !== '3'
          ? 'completed'
          : 'hide'} />
        <img src={bad} className={status === '1' && payStatus === '3' ? 'completed' : 'hide'} />

        <CustomerSearchDrop
          info={data}
          onItemSelect={this.handleSearchSelect}
          onCancel={this.handleSearchClear}
        />

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
            <Search
              placeholder="请输入手机号、车牌号选择或创建用户"
              onChange={e => this.handleCustomerSearch(e)}
              size="large"
              style={{ width: '500px' }}
              value={key}
            />
          </Col>
          <Col span={18}>
            <div className="pull-right">
              <Link
                to="/aftersales/project/new"
                className={(payStatus === '1' || payStatus === '2') ? 'mr10' : 'hide'}
              >
                <Button>继续开单</Button>
              </Link>

              <span className={status !== '-1' && payStatus === '0' ? 'mr20' : 'hide'}>
                <Dropdown overlay={moreMenu} placement="bottomRight">
                  <a href="javascript:;">更多<Icon type="down" /></a>
                </Dropdown>
              </span>

              <span className={(JSON.stringify(this.props.match.params) === '{}' || status === '-1')
                ? 'hide'
                : 'mr10'}>
                {(status === '1' && payStatus === '2')
                  ? <Button><PrintPaymentModal{...printOptionProps} /></Button>
                  : (
                    <DropdownButton overlay={printMenu} placement="bottomRight">
                      <PrintPaymentModal{...printOptionProps} />
                    </DropdownButton>
                  )
                }
              </span>

              <span
                className={!!detail.pay_status &&
                (Number(detail.pay_status) !== 2 &&
                  Number(detail.pay_status) !== 3 &&
                  String(detail.status) !== '-1')
                  ? 'mr10'
                  : 'hide'}>
                <DropdownButton overlay={payMenu}>
                  {
                    String(detail.pay_status) === '1' ? <PayRepayment
                      detail={detail}
                      printOptionProps={printOptionProps}
                      onFinish={this.getMaintainIntentionDetail}
                    /> : <PayNow
                      detail={detail}
                      printOptionProps={printOptionProps}
                      onFinish={this.getMaintainIntentionDetail}
                    />
                  }
                </DropdownButton>
              </span>

              <Button
                size="default"
                type="primary"
                onClick={this.handleSubmit}
                className={(isBtnDisable || (status !== 'undefined' && status !== '0') ||
                  (!isNew && false)) ? 'hide' : 'ml5'}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>

        <Form>
          {getFieldDecorator('_id', { initialValue: detail._id || id })(<Input type="hidden" />)}
          {getFieldDecorator('customer_id', { initialValue: customerId })(<Input type="hidden" />)}
          {getFieldDecorator('plate_num', { initialValue: auto.plate_num })(<Input
            type="hidden" />)}

          <div className="base-info">
            <div className="customer-container">
              <div className={customerNameIcon}>
                {customer.name ? customer.name.substr(0, 1) :
                  <Icon type="user" style={{ color: '#fff' }} />}
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
                    <Input placeholder="客户姓名" style={{ width: 100 }} />,
                  )}
                  {getFieldDecorator('gender', { initialValue: String(customer.gender || -1) })(
                    <Select className="ml6" style={{ width: 60 }}>
                      <Option value={'1'}>男士</Option>
                      <Option value={'0'}>女士</Option>
                      <Option value={'-1'}>未知</Option>
                    </Select>,
                  )}
                  <a href="javascript:" className="ml6" onClick={this.handleSaveUserInfo}>保存</a>
                </div>

                <div className={customerInfo}>
                  <span>{customer.phone}</span>
                  <span className="ml10 mr10">历史欠款 {historicalDebts}元</span>
                </div>
              </div>
            </div>

            <div className="line-middle">
              <div style={{ width: '200px' }}>
                <label className="label">接车人</label>
                {getFieldDecorator('waiter_user_id', {
                  initialValue: String(detail.waiter_user_id) === '0' ? '' : detail.waiter_user_id,
                })(
                  <Select
                    className="ml6"
                    disabled={!isNew}
                    style={{ width: '130px' }}
                    size="large"
                  >
                    {fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
                  </Select>,
                )}
              </div>

              <FormItem label="进厂日期" className="inline-block" labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                {getFieldDecorator('start_time', {
                  initialValue: detail.start_time && detail.start_time.indexOf('0000') < 0
                    ? DateFormatter.getMomentDate(detail.start_time)
                    : DateFormatter.getMomentDate(),
                })(
                  <DatePicker
                    format={DateFormatter.pattern.day}
                    disabledDate={this.getDisabledInDate}
                    placeholder="请选择进厂日期"
                    disabled={!isNew}
                    allowClear={false}
                  />,
                )}
              </FormItem>

              <FormItem label="预计出厂日期" className="inline-block" labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                {getFieldDecorator('scheduled_end_time', {
                  initialValue: detail.scheduled_end_time &&
                  detail.scheduled_end_time.indexOf('0000') < 0
                    ? DateFormatter.getMomentDate(detail.scheduled_end_time)
                    : DateFormatter.getMomentDate(),
                })(
                  <DatePicker
                    format={DateFormatter.pattern.day}
                    disabledDate={this.getDisabledOutDate}
                    placeholder="请选择出厂时间"
                    allowClear={false}
                  />,
                )}
              </FormItem>
            </div>
          </div>

          <div className="auto-container">
            <div className="bottom-divider-dotted">
              <Row style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <Col span={8}>
                  <div className="info-line ml-60">
                    <label className="label">车牌号</label>
                    <span>{auto.plate_num}</span>
                  </div>
                </Col>
                <Col span={6}>
                  <FormItem
                    label="车型信息"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <div className="ant-form-text">
                      {auto.auto_brand_name ? `${auto.auto_brand_name  } ${  auto.auto_series_name
                        } ${  auto.auto_type_name}` : '--'}
                    </div>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem
                    label="车架号"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                  >
                    <div className="ant-form-text">{auto.vin_num || '--'}</div>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <div className={autoId ? 'pull-right mr10' : 'hide'}>
                    <EditAutoModal
                      customer_id={customerId}
                      auto_id={auto._id}
                      onSuccess={this.handleAutoChange}
                      // 判断是否已是完工和作废 再判断工单id 最后判断autoId
                      isDisable={['1', '-1'].indexOf(String(detail.status)) > -1
                        ? true
                        : id
                          ? !id
                          : !Number(autoId)}
                    />
                    <span className="ml10">
                      <NewAutoModal
                        customer_id={customerId}
                        isDisable={id}
                        onSuccess={this.handleAutoChange}
                      />
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="bottom-divider-dotted mb10 mt10">
              <Row>
                <Col span={8}>
                  <FormItem
                    label="下次保养"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ width: '360px' }}
                  >
                    {getFieldDecorator('task_remind_date', {
                      initialValue: !!detail.task_maintain_info
                        ? DateFormatter.getMomentDate(detail.task_maintain_info.remind_date)
                        : null,
                    })(
                      <DatePicker
                        format={DateFormatter.pattern.day}
                        disabled={!nextRemindDateVisible}
                        size="large"
                        disabledDate={this.disabledStartDate}
                        ref={element => this.maintainDate = element}
                      />,
                    )}

                    <Checkbox className="ml10" onChange={this.handleMaintainTaskChange}>
                      3个月后
                    </Checkbox>
                  </FormItem>
                </Col>

                <Col span={6}>
                  <FormItem label="里程数" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('mileage', { initialValue: detail.mileage })(
                      <Input addonAfter="公里" />,
                    )}
                  </FormItem>
                </Col>

                {/* <Col span={4}>
                  <FormItem
                    label="事故车"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('is_accident', {
                      valuePropName: 'checked',
                      initialValue: detail.is_accident === '1',
                    })(
                      <Switch checkedChildren={'是'} unCheckedChildren={'否'} />,
                    )}
                  </FormItem>
                </Col>*/}

                <Col span={6}>
                  <FormItem
                    label="工单号"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                  >
                    <p className="ant-form-text">{detail._id || '--'}</p>
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div ref="canHide" className="overflow-hidden mt10">
              <div ref="contentInfo">
                <div className="ml-60">
                  <div className="info-line">
                    <label className="label">故障描述</label>
                    {getFieldDecorator('failure_desc', { initialValue: detail.failure_desc })(
                      <Input type="textarea" rows="1" placeholder="请填写故障描述" size="large" />,
                    )}
                  </div>

                  <div className="info-line">
                    <label className="label">维修建议</label>
                    {getFieldDecorator('maintain_advice', { initialValue: detail.maintain_advice })(
                      <Input type="textarea" rows="1" placeholder="请填写车间维修建议" size="large" />,
                    )}
                  </div>

                  <div className="info-line">
                    <label className="label">备注</label>
                    {getFieldDecorator('remark', { initialValue: detail.remark })(
                      <Input type="textarea" rows="1" placeholder="请填写备注" size="large" />,
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="hide-info mb5">
              <a href="javascript:;" onClick={() => this.handleHideAutoInfo(isHide)}>{isHide
                ? '展开车况'
                : '收起车况'}</a>
              {
                isHide ? <span className="triangle-handstand pull-left" /> :
                  <span className="triangle pull-left" />
              }
            </div>
          </div>

          <TableMemberCardType
            customer={customer}
            itemMap={maintain_items}
            partMap={maintain_parts}
            setMemberDetailList={this.setMemberDetailList}
            removeMaintainItem={this.removeMaintainItem}
            removeMaintainPart={this.removeMaintainPart}
            onItemsUpdateSuccess={this.handleItemsUpdate}
            onPartsUpdateSuccess={this.handlePartsUpdate}
            couponUseStatus={couponUseStatus}
            onEditCouponUseState={this.handleEditCouponUseState}
          />

          <TableItem
            intention_id={id}
            customer_id={customerId}
            couponItem={couponItem}
            memberDetailList={memberDetailList}
            itemMap={maintain_items}
            partMap={maintain_parts}
            removeMaintainItem={this.removeMaintainItem}
            removeMaintainPart={this.removeMaintainPart}
            onSuccess={this.handleItemsUpdate.bind(this)}
            payStatus={detail.pay_status}
            status={detail.status}
            onEditCouponUseState={this.handleEditCouponUseState}
          />

          <TablePart
            intention_id={id}
            customer_id={customerId}
            couponPartType={couponPartType}
            memberDetailList={memberDetailList}
            itemMap={maintain_items}
            partMap={maintain_parts}
            addMaintainPart={this.addMaintainPart}
            removeMaintainItem={this.removeMaintainItem}
            removeMaintainPart={this.removeMaintainPart}
            onSuccess={this.handlePartsUpdate.bind(this)}
            payStatus={detail.pay_status}
            status={detail.status}
            onEditCouponUseState={this.handleEditCouponUseState}
          />

          <div className="module-head">
            <h3>结算信息</h3>
          </div>

          <div className="settlement-information">
            <div>
              <label className="label">结算金额</label>
              <p className="ant-form-text">{Number(materialFee + timeFee).toFixed(2)}元</p>
            </div>

            <div>
              <label className="label">优惠金额</label>
              <NumberInput
                defaultValue={detail.discount || '0.00'}
                id="discount"
                onChange={this.handleCouponChange}
                self={this}
                style={{ position: 'relative', top: '13px' }}
              />
            </div>

            <div>
              <label className="label">应付金额</label>
              <p className="ant-form-text order-money">{Number(realTotalFee).toFixed(2)}元</p>
            </div>

            <div className={payStatus === '1' ? '' : 'hide'}>
              <label className="label">实付金额</label>
              <p
                className="ant-form-text order-money">{Number((detail.total_fee || 0) -
                (detail.unpay_amount || 0)).toFixed(2)}元</p>
            </div>

            <div className={payStatus === '1' ? '' : 'hide'}>
              <label className="label">还款记录</label>
              <p className="ant-form-text">
                <TablePaymentHistory customerId={customerId} id={detail._id} />
              </p>
            </div>
          </div>

          <div className={(payStatus === '1' || payStatus === '2')
            ? 'settlement-information'
            : 'hide'}>
            <div>
              <label className="label">配件成本</label>
              <p className="ant-form-text">
                {detail.material_fee_out && Number(detail.material_fee_out).toFixed(2)}元
              </p>
            </div>

            <div>
              <span style={{ zIndex: '1000', position: 'relative', left: '-5px' }}>
                <Tooltip placement="top" title="毛利率=毛利/营业额">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
              <label className="label">毛利率</label>
              <p className="ant-form-text">
                {detail.gross_profit_rate &&
                `${(Number(detail.gross_profit_rate) * 100).toFixed(2)}%`}
              </p>
            </div>

            <div>
              <label className="label">提成合计</label>
              <p className="ant-form-text">{profitTotal.toFixed(2)}元</p>
              <p className="ant-form-text">
                <TableProfit meritPayItemList={meritPayItemList} />
              </p>
            </div>
          </div>
        </Form>

        <div className={guideView}>
          <Popover
            title=""
            content={contentTip}
            visible={isShowTip}
            overlayClassName="white"
          >
            <div style={{
              width: rectInfo.width,
              height: rectInfo.height,
              background: 'transparent',
              border: 0,
              marginTop: rectInfo.top + window.scrollY,
              marginLeft: rectInfo.left,
              borderRadius: 4,
              boxShadow: '0 0 0 9999px rgba(0,0,0,.5), 0 0 15px rgba(0,0,0,.5)',
            }} />
          </Popover>
        </div>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
