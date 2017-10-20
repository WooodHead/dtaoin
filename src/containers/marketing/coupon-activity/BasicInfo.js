import React from 'react';
import { message, Select, Button, Form, Input, Tooltip, Table, Icon, Checkbox } from 'antd';

import api from '../../../middleware/api';
import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';
import Qiniu from '../../../components/widget/UploadQiniu';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import text from '../../../config/text';
import DateFormatter from '../../../utils/DateFormatter';

import DateRangeSelector from '../../../components/widget/DateRangeSelector';
import SearchCouponDrop from './SearchCouponDrop';
import SearchCompanyDrop from './SearchCompanyDrop';
import ColorSelect from '../../../components/widget/ColorSelect';

import Preview from './Preview';

const FormItem = Form.Item;
const Search = Input.Search;
const TextArea = Input.TextArea;
const Option = Select.Option;

class BasicInfo extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      color: '#4A90E2',
      data: {},
      companyData: {},
      key: '',
      companyKey: '',
      startTime: null,
      endTime: null,
      couponMap: new Map().set('add', { _id: 'add' }),
      companyMap: new Map().set('add', { _id: 'add' }),
      type: props.type,
      receiveNum: '',
      numberUnlimited: false,
      companyIds: [],
      detail: {},
      validCompanys: [],
    };
    [
      'handleCouponSearch',
      'handleAddCoupon',
      'handleAddCompany',
      'renderCouponFooter',
      'renderCompanyFooter',
      'handTableRowClick',
      'handleCouponDelete',
      'handleCompanyDelete',
      'handleCancel',
      'handleDateChange',
      'handleUseCompanyChange',
      'handleSubmit',
      'handleReceiveNumChange',
      'handleReceiveUnlimited',
      'handleUseCompanySearch',
      'handleCompanySearch',
      'handleCompanyTableRowClick',
      'handleCompanyCancel',
      'handleColorChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.setInputContentPadding();
    this.getDetail();
  }

  setInputContentPadding() {
    let inputContent = document.getElementsByClassName('input-content');
    inputContent = Array.from(inputContent);
    if (inputContent) {
      for (const i in inputContent) {
        if (inputContent.hasOwnProperty(i)) {
          inputContent[i].parentNode.parentNode.style.padding = '2px 2px';
        }
      }
    }
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime });
    this.setState({ endTime });
  }

  handleUseCompanyChange(value) {
    const companyIds = value.map(item => item.split('-')[0]);
    this.setState({ companyIds });
  }

  handleUseCompanySearch(key) {
    this.getCompanyList(key);
  }

  handTableRowClick(coupon) {
    const { couponMap, endTime } = this.state;
    if (couponMap.has(coupon._id)) {
      message.error('您已经添加了该项优惠');
      return false;
    }

    if (coupon.valid_type === '0') {
      const expireDate = DateFormatter.getDate(`${coupon.valid_expire_date  } 23:59:59`);
      const endDate = DateFormatter.getDate(`${endTime  } 23:59:59`);
      if (endDate > expireDate) {
        message.error('优惠券有效期短于活动有效期, 请重新选择优惠券');
        return false;
      }
    }

    couponMap.delete('add');
    couponMap.set(coupon._id, coupon);
    const record = {
      _id: 'add',
    };

    couponMap.set('add', record);
    this.setState({ couponMap });
  }

  handleCompanyTableRowClick(company) {
    const { companyMap } = this.state;
    if (companyMap.has(company._id)) {
      message.error('您已经添加了该门店');
      return false;
    }

    companyMap.delete('add');
    companyMap.set(company._id, company);
    const record = {
      _id: 'add',
    };

    companyMap.set('add', record);
    this.setState({ companyMap });
  }

  handleCouponSearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);

    const collapsed = localStorage.getItem('collapsed');
    if (collapsed === 'true') {
      coordinate.left = coordinate.left - 110;
    } else {
      coordinate.left = coordinate.left - 210;
    }
    coordinate.top = coordinate.top - 80;
    this.setState({ key });
    if (!!key && key.length >= 2) {
      api.ajax({ url: api.coupon.getCouponList({ key }) }, data => {
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

  handleCompanySearch(e) {
    const companyKey = e.target.value;
    const coordinate = api.getPosition(e);

    const collapsed = localStorage.getItem('collapsed');
    if (collapsed === 'true') {
      coordinate.left = coordinate.left - 110;
    } else {
      coordinate.left = coordinate.left - 210;
    }
    coordinate.top = coordinate.top - 80;
    this.setState({ companyKey });
    if (!!companyKey && companyKey.length >= 2) {
      api.ajax({ url: api.company.companyList(companyKey) }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list;
        info.coordinate = coordinate;
        info.visible = true;
        info.keyword = companyKey;
        this.setState({ companyData: info });
      });
    }
  }

  handleAddCoupon() {
    const { couponMap } = this.state;
    if (couponMap.has('add')) {
      message.warn('请先选择优惠券');
      return false;
    }

    const record = {
      _id: 'add',
    };
    couponMap.set('add', record);
    this.setState({ couponMap });
  }

  handleAddCompany() {
    const { companyMap } = this.state;
    if (companyMap.has('add')) {
      message.warn('请先选择门店');
      return false;
    }

    const record = {
      _id: 'add',
    };
    companyMap.set('add', record);
    this.setState({ companyMap });
  }

  handleCancel() {
    this.setState({ key: '' });
  }

  handleCompanyCancel() {
    this.setState({ companyKey: '' });
  }

  handleCouponDelete(id) {
    const { couponMap } = this.state;
    couponMap.delete(id);

    this.setState({ couponMap });
  }

  handleCompanyDelete(id) {
    const { companyMap } = this.state;
    companyMap.delete(id);

    this.setState({ companyMap });
  }

  handleReceiveNumChange(e) {
    const value = e.target.value;
    this.setState({ receiveNum: value });
  }

  handleReceiveUnlimited(e) {
    const checked = e.target.checked;
    this.setState({ numberUnlimited: checked });
    if (!!checked) {
      this.setState({ receiveNum: '' });
    }
  }

  handleColorChange(color) {
    this.setState({ color: color.hex });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.warning('请完善表单信息');
        return false;
      }

      const { activityId } = this.props;
      const { startTime, endTime, receiveNum, numberUnlimited, couponMap, color, type, companyMap } = this.state;

      couponMap.delete('add');
      companyMap.delete('add');

      if (!values.banner_pic) {
        message.error('请上传活动图片');
        return false;
      }

      if (!endTime || !startTime) {
        message.error('请选择活动时间');
        return false;
      }

      if (couponMap.size === 0) {
        message.error('请选择优惠券');
        return false;
      }

      if (companyMap.size === 0) {
        message.error('请选择使用门店');
        return false;
      }

      if (String(type) === '1') {
        values.coupon_count = !!numberUnlimited ? '0' : receiveNum;
        if (!numberUnlimited && !receiveNum) {
          message.error('请选择领取量');
          return false;
        }
      }

      const couponArray = Array.from(couponMap.values());
      const couponItems = couponArray.map(item => item._id).join(',');

      const companyArray = Array.from(companyMap.values());
      const validCompanyIds = companyArray.map(item => item._id).join(',');

      values.activity_id = activityId;
      values.start_date = startTime;
      values.expire_date = endTime;
      values.valid_company_ids = validCompanyIds;
      values.coupon_items = couponItems;
      values.background_color = color;

      api.ajax({
        url: api.coupon.baseEditCouponActivity(),
        type: 'POST',
        data: values,
      }, data => {
        location.href = `/marketing/coupon-activity/edit/${data.res.detail._id}`;
        message.success('创建成功');
      });
    });
  }

  getCompanyList(key) {
    const url = api.company.companyList(key);
    api.ajax({ url }, data => {
      this.setState({ companyList: data.res.list });
    });
  }

  getDetail() {
    const { activityId } = this.props;

    if (!!activityId) {
      api.ajax({ url: api.coupon.couponActivityDetail({ id: activityId }) }, data => {
        const { detail } = data.res;
        const { coupon_item_infos, valid_company_infos } = detail;

        const couponMap = new Map();
        coupon_item_infos.map(item => {
          if (!!item) {
            couponMap.set(item._id, item);
          }
        });

        const companyMap = new Map();
        valid_company_infos.map(item => {
          if (!!item) {
            companyMap.set(item._id, item);
          }
        });

        if (couponMap.size === 0) {
          couponMap.set('add', { _id: 'add' });
        }

        if (companyMap.size === 0) {
          companyMap.set('add', { _id: 'add' });
        }

        this.setState({
          detail,
          startTime: detail.start_date.indexOf('0000') > -1 ? '' : detail.start_date,
          endTime: detail.expire_date.indexOf('0000') > -1 ? '' : detail.expire_date,
          receiveNum: Number(detail.coupon_count) > 0 ? detail.coupon_count : '',
          color: detail.background_color || '#FF781A',
          couponMap,
          companyMap,
          type: detail.type,
          numberUnlimited: String(detail.coupon_count) === '0',
          // validCompanys,
          companyIds: detail.valid_company_ids.split(','),
        });

        this.props.form.setFieldsValue({ banner_pic: detail.banner_pic });

        this.getUploadedImages(detail);
      });
    }
  }

  getUploadedImages(detail) {
    if (detail.banner_pic) {
      this.getPublicImageUrl('banner_pic', detail.banner_pic);
    }
  }

  renderCouponFooter() {
    return (
      <p className="ml10 pointer" style={{ color: '#108ee9' }} onClick={this.handleAddCoupon}>
        <Icon type="plus" />添加优惠券
      </p>
    );
  }

  renderCompanyFooter() {
    return (
      <p className="ml10 pointer" style={{ color: '#108ee9' }} onClick={this.handleAddCompany}>
        <Icon type="plus" />添加门店
      </p>
    );
  }

  render() {
    const {
      data,
      key,
      companyKey,
      detail,
      color,
      couponMap,
      receiveNum,
      numberUnlimited,
      type,
      startTime,
      endTime,
      companyIds,
      companyData,
      companyMap,
    } = this.state;

    const couponList = Array.from(couponMap.values());
    const companyList = Array.from(companyMap.values());

    const { formItem12 } = Layout;
    const { getFieldDecorator } = this.props.form;

    const projectProgressStyle = {
      position: 'absolute',
      left: '202px',
      top: '60px',
      zIndex: '10',
      width: '100px',
      color: '#87d068',
    };

    const companyColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: value => (
            <div style={{ position: 'relative' }}>
              {
                !!value ? value : <div className="input-content">
                  <Search
                    defaultValue={value}
                    placeholder="门店名称"
                    onChange={this.handleCompanySearch}
                    value={companyKey}
                    size="large"
                  />
                </div>
              }
            </div>
          ),
      }, {
        title: '地址',
        key: 'address',
        width: '350px',
        render: (value, record) => `${record.province || ''}-${record.city || ''}-${record.country ||
          ''}-${record.address || ''}`,
      }, {
        title: '操作',
        key: 'active',
        width: '48px',
        render: (value, record) => <a href="javascript:;" onClick={() => this.handleCompanyDelete(record._id)}>删除</a>,
      },
    ];

    const couponColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: '140px',
        render: value => (
            <div style={{ position: 'relative' }}>
              {
                !!value ? value : <div className="input-content">
                  <Search
                    defaultValue={value}
                    placeholder="优惠券名称"
                    onChange={this.handleCouponSearch}
                    value={key}
                    size="large"
                  />
                </div>
              }
            </div>
          ),
      }, {
        title: '面值/折扣',
        dataIndex: 'price',
        key: 'price',
        width: '85px',
        render: (value, record) => {
          if (String(record.type) === '1') {
            return `${Number(value).toFixed(2)  }元`;
          } else if (String(record.type) === '2') {
            return `${Number(record.discount_rate * 10).toFixed(0)  }折`;
          }
        },
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '75px',
        render: value => text.couponType[value],
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '有效期',
        key: 'valid_day',
        width: '125px',
        render: (value, record) => {
          if (String(record.valid_type) === '0') {
            // 时间段
            return `至${record.valid_expire_date}`;
          } else if (String(record.valid_type) === '1') {
            // 具体天数
            return `领取后${record.valid_day}天有效`;
          }
        },
      }, {
        title: '领用限制',
        dataIndex: 'limit_count',
        key: 'limit_count',
        width: '80px',
        render: value => Number(value) > 0 ? `${value}次/人` : '不限次/人',
      }, {
        title: '操作',
        key: 'active',
        width: '48px',
        fixed: 'right',
        render: (value, record) => <a href="javascript:;" onClick={() => this.handleCouponDelete(record._id)}>删除</a>,
      }];

    return (
      <div className="basic-info">
        <SearchCouponDrop
          partsInfo={data}
          onTableRowClick={this.handTableRowClick}
          onCancel={this.handleCancel}
        />

        <SearchCompanyDrop
          partsInfo={companyData}
          onTableRowClick={this.handleCompanyTableRowClick}
          onCancel={this.handleCompanyCancel}
        />

        <div className="basic-info-left">
          <Preview
            state={this.state}
            detail={this.props.form.getFieldsValue()}
            couponMap={couponMap}
            companyIds={companyIds}
            color={color}
            type={type}
            numberUnlimited={numberUnlimited}
            receiveNum={receiveNum}
            companyMap={companyMap}
          />
        </div>

        <div className="basic-info-right">
          <Form>
            <div className="line" />
            <FormItem label="活动图片" {...formItem12} required>
              {getFieldDecorator('banner_pic')(
                <Input type="hidden" />,
              )}
              <Tooltip placement="top" title="双击添加或更换图片">
                <div style={{ width: '210px', height: '150px' }}>
                  <Qiniu
                    prefix="banner_pic"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPublicPicUploadToken('banner_pic')}
                    onDrop={this.onDrop.bind(this, 'banner_pic')}
                    onUpload={this.onUpload.bind(this, 'banner_pic')}
                    style={{ width: '200px', height: '150px' }}
                  >
                    {this.renderImage('banner_pic', projectProgressStyle, {
                      width: '100%',
                      height: '140px',
                    })}
                  </Qiniu>
                </div>
              </Tooltip>
            </FormItem>

            <FormItem label="活动名称" {...formItem12}>
              {getFieldDecorator('title', {
                initialValue: detail && detail.title,
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入活动名称" style={{ width: '355px' }} />,
              )}
            </FormItem>

            <FormItem label="活动时间" {...formItem12} required>
              <DateRangeSelector
                startTime={startTime || ''}
                endTime={endTime || ''}
                onDateChange={this.handleDateChange}
                earlyTodayDisabled={true}
              />
            </FormItem>

            <FormItem label="营销文案" {...formItem12}>
              {getFieldDecorator('description', {
                initialValue: detail && detail.description,
              })(
                <TextArea
                  rows={2}
                  style={{ width: '355px' }}
                  placeholder="请输入营销文案"
                />,
              )}
            </FormItem>

            {
              String(type) === '1'
                ? <FormItem label="领取量" {...formItem12} required>
                    <span className="mr20">
                      活动每分享一次，可被 <Input
                      value={receiveNum}
                      disabled={numberUnlimited}
                      onChange={this.handleReceiveNumChange}
                      style={{ width: '100px' }}
                    /> 人领取
                    </span>
                  <Checkbox onChange={this.handleReceiveUnlimited}
                            checked={numberUnlimited}>数量不限</Checkbox>
                </FormItem>
                : null
            }

            <div className="line" />

            <p className="ant-form-item-required coupon-word">优惠券</p>
            <Tooltip placement="top" title="请保证优惠券的有效期长于活动有效期">
              <Icon type="question-circle-o" />
            </Tooltip>
            <div className="mt10 mb10" style={{ marginLeft: '6%' }}>
              <Table
                bordered
                columns={couponColumns}
                dataSource={couponList}
                pagination={false}
                footer={this.renderCouponFooter}
                rowKey={record => record._id}
                size="middle"
              />
            </div>

            <p className="ant-form-item-required coupon-word-company">可使用门店</p>
            <div className="mt10 mb10" style={{ marginLeft: '6%' }}>
              <Table
                bordered
                columns={companyColumns}
                dataSource={companyList}
                pagination={false}
                footer={this.renderCompanyFooter}
                rowKey={record => record._id}
                size="middle"
              />
            </div>

            <FormItem label="活动规则" {...formItem12}>
              {getFieldDecorator('rule', {
                initialValue: detail && detail.rule,
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <TextArea
                  rows={4}
                  style={{ width: '355px' }}
                  placeholder={
                    '请输入活动规则描述，建议格式：\n1、每人只可领取一张优惠券。\n2、优惠券可在水稻汽车APP--我的优惠券页面查看。'
                  }
                />,
              )}
            </FormItem>

            <FormItem label="页面背景色" {...formItem12}>
              <ColorSelect color={color} onColorChange={this.handleColorChange} />
            </FormItem>

            <div className="line" />

            <div style={{ textAlign: 'center' }}>
              <Button
                className="ml10"
                type="primary"
                onClick={this.handleSubmit}
              >
                {detail.title ? '提交' : '确认创建'}
              </Button>
            </div>

          </Form>
        </div>
      </div>
    );
  }
}

BasicInfo = Form.create()(BasicInfo);
export default BasicInfo;
