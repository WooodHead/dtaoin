import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Table,
  Row,
  Col,
  message,
  TreeSelect,
  Select,
  InputNumber,
  Checkbox,
} from 'antd';

import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';
import api from '../../../middleware/api';
import text from '../../../config/text';
import path from '../../../config/path';

import AddCoupon from './AddDiscount';
import CardStore from './CardStore';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

require('../componentsTableNest.css');

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || '',
      treeData: [],
      companyListId: [],
      selectValue: '',
      storeValue: [],
      hasPermission: false,
      couponCardInfo: '',
      couponMap: new Map(),
      submitIsDisabled: false,
    };

    [
      'getCompanyListAsync',
      'getCouponCardTypeInfo',
      'handleStoreSelect',
      'handleSubmit',
      'getCompanyList',
      'handleCouponChange',
      'handleDeleteCoupon',
      'handleAmountChange',
      'handleAmountUnlimited',
      'handleAmountBlur',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id } = this.state;

    this.getTreeDate();

    if (Number(api.getLoginUser().companyId) === 1) {
      this.getCompanyList();
    }

    if (!!id) {
      this.getCouponCardTypeInfo();
    }

    this.checkPermission(path.marketing.commission);
  }

  async checkPermission(path) {
    const hasPermission = await api.checkPermission(path);
    this.setState({ hasPermission });
  }

  getTreeDate() {
    const isHeadquarters = api.isHeadquarters();

    if (isHeadquarters) {
      this.setState({
        treeData: [
          { label: 'AP高级合伙店', value: '3', key: '3' },
          { label: 'TP顶级合伙店', value: '4', key: '4' },
        ],
      });
    } else {
      this.setState({
        treeData: [
          { label: 'FC友情合作店', value: '1', key: '1' },
          { label: 'MC重要合作店', value: '2', key: '2' },
          { label: 'AP高级合伙店', value: '3', key: '3' },
          { label: 'TP顶级合伙店', value: '4', key: '4' },
        ],
      });
    }
  }

  getCouponCardTypeInfo() {
    const { id } = this.state;
    const url = api.coupon.getCouponCardTypeInfo(id);
    api.ajax({ url }, data => {
      const { detail } = data.res;

      const couponItems = JSON.parse(detail.coupon_items);
      const couponMap = new Map();

      couponItems.forEach(item => {
        if (Number(item.amount) > 0) {
          item.isInfinite = false;
        } else {
          item.isInfinite = true;
        }
        couponMap.set(item._id, item);
      });

      this.setState({
        couponCardInfo: detail,
        couponMap,
      });
    });
  }

  getCompanyListAsync(treeNode) {
    const treeData = [...this.state.treeData];
    const type = treeNode.props.value;
    const index = type - 3;

    return new Promise((resolve, reject) => {
      api.ajax({ url: api.overview.companyList({ limit: '-1', cooperationTypes: type }) }, data => {
        treeData[index].children = [];
        const companyList = data.res.list;
        companyList.map(item => {
          treeData[index].children.push({
            label: item.name,
            value: item._id,
            key: item._id,
            isLeaf: true,
          });
        });
        this.setState({ treeData }, () => {
        });
        resolve(true);
      }, () => {
        reject(false);
      });
    });
  }

  getCompanyList() {
    const companyListId = this.state.companyListId;

    [1, 2, 3, 4].map((item, index) => {
      let companyId = '';

      api.ajax({ url: api.overview.companyList({ limit: '-1', cooperationTypes: item }) }, data => {
        const companyList = data.res.list;
        companyList.map(item => {
          if (!!item) {
            companyId += `${item._id},`;
          }
        });
        companyListId[index] = companyId;
        this.setState({ companyListId });
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitIsDisabled: true });
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(errors);
        return false;
      }

      const { couponMap, id } = this.state;
      const coupons = Array.from(couponMap.values());

      if (!!this.state.selectValue) {
        values.company_ids = this.state.selectValue;
      } else if (String(api.getLoginUser().companyId) !== '1') {
        values.company_ids = api.getLoginUser().companyId;
      }

      if (!values.sell_bonus_amount) {
        values.sell_bonus_amount = '0';
      }

      values.coupon_items = JSON.stringify(coupons);
      values.coupon_card_type_id = id;

      let url = api.coupon.addCouponCardType();
      if (!!id) {
        url = api.coupon.editCouponCardType();
      }

      api.ajax({ url, data: values, type: 'POST' }, data => {
        message.success('提交成功！');
        this.setState({ couponCardInfo: data.res.detail });
      }, error => {
        this.setState({ submitIsDisabled: false });
        message.error(error);
      });
    });
  }

  handleStoreSelect(value) {
    const { companyListId } = this.state;
    let selectValue = [...value];

    // 判断是否是选中全部FC MC AP TP
    ['1', '2', '3', '4'].map((item, index) => {
      if (String(selectValue.indexOf(item)) !== '-1') {
        selectValue.splice(selectValue.indexOf(item), 1, companyListId[index]);
      }
    });

    while (String(selectValue.indexOf('')) !== '-1') {
      selectValue.splice(selectValue.indexOf(''), 1);
    }

    selectValue = selectValue.join(',');
    this.setState({ storeValue: value, selectValue });
  }

  handleUpdateMemberCardTypeStatus(newStatus) {
    const couponCardTypeId = this.state.couponCardInfo._id;
    const url = api.coupon.updateCouponCardTypeStatus();
    const data = { coupon_card_type_id: couponCardTypeId, status: newStatus };
    api.ajax({ url, data, type: 'POST' }, () => {
      message.success('更改成功！');
      location.href = '/marketing/membercard/list';
    }, error => {
      message.error(error);
    });
  }

  handleDeleteCoupon(record) {
    const { couponMap } = this.state;
    couponMap.delete(record._id);
    this.setState({ couponMap });
  }

  handleCouponChange(coupon) {
    this.setState({ couponMap: coupon });
  }

  handleSelectScope(value, record) {
    const { couponMap } = this.state;
    const coupon = couponMap.get(record._id);
    coupon.scope = value;
    couponMap.set(coupon._id, coupon);

    this.setState({ couponMap });
  }

  handleAmountChange(value, record) {
    const { couponMap } = this.state;
    const coupon = couponMap.get(record._id);

    coupon.amount = value;
    couponMap.set(coupon._id, coupon);

    this.setState({ couponMap });
  }

  handleAmountBlur(e, record) {
    const value = e.target.value;
    const { couponMap } = this.state;
    const coupon = couponMap.get(record._id);

    if (Number(value) > 0) {
      coupon.isInfinite = false;
    } else {
      coupon.isInfinite = true;
    }
    couponMap.set(coupon._id, coupon);

    this.setState({ couponMap });
  }

  handleAmountUnlimited(e, record) {
    const { couponMap } = this.state;
    const coupon = couponMap.get(record._id);

    coupon.amount = e.target.checked ? 0 : 1;
    coupon.isInfinite = !!e.target.checked;
    couponMap.set(coupon._id, coupon);

    this.setState({ couponMap });
  }

  render() {
    const { treeData, couponCardInfo, id, couponMap, hasPermission, submitIsDisabled } = this.state;
    const { formItem12, formItem5_19 } = Layout;
    const coupon = Array.from(couponMap.values());
    const { getFieldDecorator } = this.props.form;

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
          width: '25%',
          className: String(record.type) === '2' ? '' : 'hide',
          render: () => {
            let rate = String(Number(Number(record.discount_rate).toFixed(2)) * 100);
            if (rate.length === 1) {
              return `${(rate / 10) || '0'  }折`;
            }

            if (Number(rate.charAt(rate.length - 1)) === 0) {
              rate = rate.slice(0, rate.length - 1);
            }
            return `${rate || '0'  }折`;
          },
        }];

      const items = record.items && JSON.parse(record.items) || [];
      const partTypes = record.part_types && JSON.parse(record.part_types) || [];
      const data = items.concat(partTypes);

      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={record => record._id}
        />
      );
    };

    const self = this;
    const columns = [
      {
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
        title: '优惠券信息',
        dataIndex: 'type',
        key: 'type',
        render: value => text.couponType[value],
      }, {
        title: '适用门店',
        dataIndex: 'scope',
        key: 'scope',
        className: scopeVisible,
        render: (value, record) => (
            <Select
              style={{ width: 120 }}
              size="large"
              value={!!value ? String(value) : '1'}
              onChange={value => self.handleSelectScope(value, record)}
            >
              <Option key="0" value="0">适用门店</Option>
              <Option key="1" value="1">售卡门店</Option>
            </Select>
          ),

      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        render: (value, record) => (
            <div>
              <InputNumber
                onChange={value => self.handleAmountChange(value, record)}
                onBlur={e => self.handleAmountBlur(e, record)}
                value={Number(value) === 0 ? '' : value}
                disabled={record.isInfinite}
              />
              <Checkbox
                checked={record.isInfinite}
                onChange={e => self.handleAmountUnlimited(e, record)}
              >
                不限次
              </Checkbox>
            </div>
          ),
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        render: (text, record, index) => <a href="javascript:;"
                    onClick={() => self.handleDeleteCoupon(record, index)}>删除</a>,
      }];

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <div className="with-bottom-divider">
            <Row className="head-action-bar-line">
              <Col span={24}>
                <Button
                  className="ml10 pull-right"
                  type="primary"
                  htmlType="submit"
                  disabled={submitIsDisabled}
                >
                  保存
                </Button>

                <Button
                  disabled={!couponCardInfo || Number(couponCardInfo.status) === 0}
                  type="primary"
                  className="pull-right"
                  onClick={() => this.handleUpdateMemberCardTypeStatus(0)}
                >
                  启用
                </Button>
              </Col>
            </Row>

            <Row className="mt20 mb20">
              <Col span={12}>
                <h3>开卡信息</h3>
              </Col>
            </Row>

            <Row>
              <Col span={10}>
                <FormItem label="名称" {...formItem5_19}>
                  {getFieldDecorator('name', {
                    initialValue: couponCardInfo && couponCardInfo.name,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      placeholder="请输入套餐卡名称"
                      style={{ width: '530px' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem label="售价" {...formItem5_19}>
                  {getFieldDecorator('price', {
                    initialValue: couponCardInfo && couponCardInfo.price,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      type="number"
                      placeholder="请输入售价"
                      addonAfter="元"
                      style={{ width: '530px' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem label="有效期" {...formItem5_19} help="提示:请确保套餐卡有效期在全部优惠券有效期之内">
                  {getFieldDecorator('valid_day', {
                    initialValue: couponCardInfo && couponCardInfo.valid_day,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      type="number"
                      placeholder="请输入有效期"
                      addonAfter="天"
                      style={{ width: '530px' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={10}>
                <FormItem label="描述" {...formItem5_19}>
                  {getFieldDecorator('remark', {
                    initialValue: couponCardInfo && couponCardInfo.remark,
                  })(
                    <TextArea
                      autosize={true}
                      placeholder="请输入套餐卡描述"
                      style={{ width: '530px' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row className={Number(api.getLoginUser().companyId) === 1 ? '' : 'hide'}>
              <Col span={10}>
                <FormItem label="适用门店" {...formItem5_19} required>
                  <span className={!!id ? 'hide' : ''}>
                    <TreeSelect
                      treeData={treeData}
                      value={this.state.storeValue}
                      onChange={this.handleStoreSelect}
                      multiple={true}
                      treeCheckable={true}
                      showCheckedStrategy={TreeSelect.SHOW_PARENT}
                      searchPlaceholder="请选择适用门店"
                      style={{ width: '530px' }}
                      loadData={this.getCompanyListAsync}
                      disabled={!!id}
                      size="large"
                    />
                  </span>
                  <span className={!!id ? 'ml10' : 'hide'}>
                    <CardStore id={id} />
                  </span>
                </FormItem>
              </Col>
            </Row>

            <Row className={hasPermission ? '' : 'hide'}>
              <Col span={10}>
                <FormItem label="提成金额" {...formItem5_19}>
                  {getFieldDecorator('sell_bonus_amount', {
                    initialValue: couponCardInfo &&
                    Number(couponCardInfo.sell_bonus_amount).toFixed(2),
                  })(
                    <Input
                      placeholder="请输入提成金额"
                      style={{ width: '530px' }}
                      addonBefore="￥"
                      type="number"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>

          <div className="mt15">
            <Row className="mb10">
              <Col span={24}>
                <h3>卡内优惠</h3>
                <span className="pull-right">
                  <AddCoupon
                    onCouponChange={this.handleCouponChange}
                    couponMap={couponMap}
                  />
                </span>
              </Col>
            </Row>

            <Table
              className="components-table-demo-nested"
              columns={columns}
              dataSource={coupon}
              pagination={false}
              rowKey={record => record._id}
              expandedRowRender={expandedRowRender}
            />
          </div>
        </Form>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
