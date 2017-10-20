import React from 'react';
import { message, Row, Col, Button, Form, Input } from 'antd';

import api from '../../../middleware/api';
import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';
import Qiniu from '../../../components/widget/UploadQiniu';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import DateTimeRangeSelect from '../../../components/widget/DateTimeRangeSelect';
import SearchCouponDrop from './SearchCouponDrop';

import Delivery from './Delivery';
import Preview from './Preview';

const FormItem = Form.Item;
const Search = Input.Search;
const TextArea = Input.TextArea;

class New extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      banner_pic_key: '',
      banner_pic_files: [],
      banner_pic_progress: {},
      data: {},
      couponId: props.match.params.couponId || '', // 从优惠券路由过来
      id: props.match.params.id || '', // 从活动管理业路由过来，编辑
      startTime: null,
      endTime: null,
      key: '',
      detail: '',
    };
    [
      'handleSubmit',
      'handleCouponSearch',
      'handTableRowClick',
      'handleDateChange',
      'getCouponItemDetail',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { couponId, id } = this.state;
    if (!!couponId) {
      this.getCouponItemDetail(couponId);
    }
    if (!!id) {
      this.getDetail(id);
    }
  }

  getDetail(id) {
    api.ajax({ url: api.coupon.getCouponActivityDetail(id) }, data => {
      const { detail } = data.res;
      this.setState({
        detail,
        startTime: detail.start_time,
        endTime: detail.expire_time,
        couponId: detail.coupon_item_info && detail.coupon_item_info._id,
        key: detail.coupon_item_info && detail.coupon_item_info.name,
      });
      this.props.form.setFieldsValue({ banner_pic: detail.banner_pic });
      this.getUploadedImages(detail);
    });
  }

  getUploadedImages(detail) {
    if (detail.banner_pic) {
      this.getPublicImageUrl('banner_pic', detail.banner_pic);
    }
  }

  getCouponItemDetail(id) {
    api.ajax({
      url: api.coupon.getCouponItemDetail(id),
    }, data => {
      const { detail } = data.res;
      this.setState({ key: detail.name });
    });
  }

  handleCouponSearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);

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

  handTableRowClick(value) {
    this.setState({ couponId: value._id, key: value.name });
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime });
    this.setState({ endTime });
  }

  handleSubmit() {
    const { couponId, startTime, endTime, detail } = this.state;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return false;
      }
      if (!values.banner_pic) {
        message.error('请上传banner图');
        return false;
      }

      if (!startTime || !endTime) {
        message.error('请填写活动时间');
        return false;
      }

      if (!couponId) {
        message.error('请选择优惠券');
        return false;
      }

      values.activity_id = detail._id;// 编辑时候需要

      values.coupon_item = couponId;
      values.start_time = startTime;
      values.expire_time = endTime;

      const url = !!detail ? api.coupon.editCouponActivity() : api.coupon.createCouponActivity();

      api.ajax({
        url,
        type: 'POST',
        data: values,
      }, data => {
        // this.setState({ detail: data.res.detail });
        this.getDetail(data.res.detail._id);
        message.success(!!detail ? '编辑活动成功' : '创建活动成功');
      });
    });
  }

  render() {
    const { data, key, detail } = this.state;
    const { getFieldDecorator } = this.props.form;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };
    return (
      <span>
        <SearchCouponDrop
          partsInfo={data}
          onTableRowClick={this.handTableRowClick}
          onCancel={this.handleCancel}
        />

        <Form>
          <FormItem label="上传banner图" {...layout} help="尺寸: 500*300px" required>
              {getFieldDecorator('banner_pic')(
                <Input type="hidden" />,
              )}
            <span>
              <Qiniu
                prefix="banner_pic"
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('banner_pic')}
                onDrop={this.onDrop.bind(this, 'banner_pic')}
                onUpload={this.onUpload.bind(this, 'banner_pic')}
              >
                {this.renderImage('banner_pic', {
                  position: 'absolute',
                  left: '75px',
                  top: '25px',
                  color: 'green',
                  width: '100px',
                })}
              </Qiniu>
            </span>
          </FormItem>

          <FormItem label="主标题" {...layout}>
            {getFieldDecorator('title', {
              initialValue: detail && detail.title,
              rules: FormValidator.getRuleNotNull(),
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入主标题" />,
            )}
          </FormItem>

          {/* <FormItem label="副标题" {...layout}>
            {getFieldDecorator('sub_title', {
              initialValue: detail && detail.sub_title,
            })(
              <Input placeholder="请输入副标题" />,
            )}
          </FormItem>*/}

          <FormItem label="活动时间" {...layout} required>
            <DateTimeRangeSelect
              startTime={detail ? detail.start_time : ''}
              endTime={detail ? detail.expire_time : ''}
              onDateChange={this.handleDateChange}
              isDisabled="false"
            />
          </FormItem>

          <FormItem label="营销文案" {...layout}>
            {getFieldDecorator('description', {
              initialValue: detail && detail.description,
            })(
              <Input placeholder="请输入营销文案" />,
            )}
          </FormItem>

          <FormItem label="活动规则描述" {...layout}>
            {getFieldDecorator('rule', {
              initialValue: detail && detail.rule,
              rules: FormValidator.getRuleNotNull(),
              validateTrigger: 'onBlur',
            })(
              <TextArea rows={4} placeholder={`请输入活动规则描述，建议格式：
1、每人只可领取一张优惠券。
2、优惠券可在水稻汽车APP--我的优惠券页面查看。`} />,
            )}
          </FormItem>


          <FormItem label="优惠券" {...layout} required>
            <Search
              placeholder="请输入优惠券名称"
              onChange={this.handleCouponSearch}
              value={key}
            />
          </FormItem>

           <FormItem label="设置页面背景色" {...layout}>
            {getFieldDecorator('background_color', {
              initialValue: detail && detail.background_color,
            })(
              <Input placeholder="请输入色值，例如#666666" />,
            )}
          </FormItem>
           <FormItem label="设置按钮颜色" {...layout}>
            {getFieldDecorator('button_color', {
              initialValue: detail && detail.button_color,
            })(
              <Input placeholder="请输入色值，例如#666666" />,
            )}
          </FormItem>
        </Form>
        <Row className="mb20">
          <Col span={6} offset={10}>
            <span className={!!detail ? 'ml10' : 'hide'}>
              <Preview detail={detail} />
            </span>

            <Button type="primary" className="ml10" onClick={this.handleSubmit}>保存</Button>

            <span className={!!detail ? 'ml10' : 'hide'}>
              <Delivery detail={detail} />
            </span>
          </Col>
        </Row>
      </span>
    );
  }
}

New = Form.create()(New);
export default New;
