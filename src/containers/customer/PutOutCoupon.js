import React from 'react';
import { Form, Input, Modal, Button, message } from 'antd';

import Layout from '../../utils/FormLayout';
import BaseModal from '../../components/base/BaseModal';
import api from '../../middleware/api';

import SearchCouponDrop from '../marketing/activity/SearchCouponDrop';

const FormItem = Form.Item;
const Search = Input.Search;

class PutOutCoupon extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      couponId: '',
      key: '',
    };

    [
      'handleCouponSearch',
      'handTableRowClick',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
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

  handleSubmit() {
    const { couponId } = this.state;
    const { state } = this.props;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(errors);
        return false;
      }

      values.coupon_item_id = couponId;
      values.company_id = state.companyId;
      values.coupon_card_type = state.couponCardType;
      values.is_login = state.isLogin;

      api.ajax({
        url: api.coupon.couponGiveCouponItem(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('推送优惠券成功');
        this.hideModal();
      });
    });
  }

  render() {
    const { key, data } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { formItemLayout } = Layout;

    const contentFooter = (
      [
        <Button key="submit" type="primary" onClick={this.handleSubmit}>确定</Button>,
        <Button key="back" type="ghost" onClick={this.hideModal}>取消</Button>,
      ]
    );
    return (
      <span>
        <SearchCouponDrop
          partsInfo={data}
          onTableRowClick={this.handTableRowClick}
          onCancel={this.handleCancel}
        />

        <Button type="primary" onClick={this.showModal}>发放优惠券</Button>
        <Modal
          title="发放优惠券"
          visible={this.state.visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width="720px"
          footer={contentFooter}
        >
          <Form>
            <FormItem label="优惠券名称" {...formItemLayout}>
              <Search
                placeholder="请输入优惠券名称"
                onChange={this.handleCouponSearch}
                value={key}
              />
            </FormItem>
            <FormItem label="通知标题" {...formItemLayout}>
              {getFieldDecorator('title')(
                <Input placeholder="请输入推送标题"/>
              )}
            </FormItem>
            <FormItem label="通知内容" {...formItemLayout}>
              {getFieldDecorator('abstract')(
                <Input placeholder="请输入推送内容"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

PutOutCoupon = Form.create()(PutOutCoupon);
export default PutOutCoupon;
