import React from 'react';
import { Form, Input, Modal, Button, Row, Col } from 'antd';

import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';

import Table from './TableAddParts';

const Search = Input.Search;
const FormItem = Form.Item;

export default class AddDiscount extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      visible: false,
    };

    [
      'handleCouponSearch',
      'handleTableRowClick',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  handleCouponSearch(e) {
    const key = e.target.value;
    this.setState({ key });
  }

  handleTableRowClick(coupon) {
    const { couponMap } = this.props;
    if (couponMap.has(coupon._id)) {
      couponMap.delete(coupon._id);
    } else {
      coupon.scope = '1';
      coupon.amount = '1';
      couponMap.set(coupon._id, coupon);
    }

    this.props.onCouponChange(couponMap);
  }

  showModal() {
    this.setState({ visible: true, reload: true, key: '' });
  }

  render() {
    const { key, visible } = this.state;
    const { couponMap } = this.props;

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>添加</Button>
        <Modal
          title="添加优惠券"
          visible={visible}
          onCancel={this.hideModal}
          width="960px"
          footer={null}
        >
          <Row>
            <Col>
              <FormItem
                label="搜索"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 10 }}
              >
                <Search onChange={this.handleCouponSearch} placeholder="请输入优惠券名称搜索"/>
              </FormItem>
            </Col>
          </Row>

          <Table
            source={api.coupon.getCouponList({ key, status: 0, type: 0 })}
            page={this.state.page}
            updateState={this.updateState}
            handleRowClick={this.handleTableRowClick}
            reload={this.state.reload}
            couponMap={couponMap}
          />
        </Modal>
      </span>
    );
  }
}
