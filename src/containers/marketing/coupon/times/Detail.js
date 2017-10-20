import React from 'react';
import { Button, Row, Col, Table } from 'antd';

import api from '../../../../middleware/api';
import text from '../../../../config/text';
import BaseList from '../../../../components/base/BaseList';

import Delivery from '../Delivery';
import AdminDelivery from '../AdminDelivery';
import TablePushList from '../TablePushList';

export default class Detail extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || '',
      detail: {},
      page: 1,
    };
    [
      'getDetail',
      'handleUseStatusChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getDetail();
    // this.getCouponItemPushList();
  }

  handleUseStatusChange() {
    const { id, detail } = this.state;
    const status = String(detail.status) === '0' ? '1' : '0';

    api.ajax({
      url: api.coupon.updataCouponStatus(),
      type: 'POST',
      data: { coupon_item_id: id, status },
    }, () => {
      this.getDetail();
    });
  }

  getDetail() {
    api.ajax({ url: api.coupon.getCouponItemDetail(this.state.id) }, data => {
      this.setState({ detail: data.res.detail });
    });
  }

  getVaild(record) {
    if (String(record.valid_type) === '0') {
      // 时间段
      return `${record.valid_start_date}至${record.valid_expire_date}`;
    } else if (String(record.valid_type) === '1') {
      // 具体天数
      return `自开卡日起${record.valid_day}天`;
    }
  }

  render() {
    const { detail, page } = this.state;

    const items = !!detail.items ? JSON.parse(detail.items) : [];
    const partTypes = !!detail.part_types ? JSON.parse(detail.part_types) : [];

    const columnsProject = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        width: '10%',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
      }, {
        title: '优惠工时',
        dataIndex: 'amount',
        key: 'amount',
        width: '15%',
      }, {
        title: '售价',
        dataIndex: 'price',
        key: 'price',
        width: '35%',
        render: value => !!value ? Number(value).toFixed(2) : '0.00',
      }];

    const columnsParts = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        width: '10%',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '配件分类名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
      }, {
        title: '优惠数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '15%',
      }, {
        title: '售价',
        dataIndex: 'price',
        key: 'price',
        width: '35%',
        render: value => !!value ? Number(value).toFixed(2) : '0',
      }];

    return (
      <span>
        <Row className="mb15">
          <Col span={12}>
            <h3>基础信息</h3>
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <Button type="primary" onClick={() => this.handleUseStatusChange()}>
                {String(detail.status) === '0' ? text.useStatus['1'] : text.useStatus['0']}
              </Button>

              <Button type="primary" className={(Number(detail.status) === 0) ? 'ml10' : 'hide'}>
                {
                  api.isHeadquarters()
                    ? <AdminDelivery detail={detail} onSuccess={this.handleSuccess} />
                    : <Delivery detail={detail} onSuccess={this.handleSuccess} />
                }
              </Button>
            </span>
          </Col>
        </Row>

        <div className="align-left">
          <Row className="mb20">
            <div style={{ display: 'inline-block', width: '300px' }}>
               <label className="label">优惠券名称</label>
               <span>{detail.name}</span>
            </div>
            <div style={{ display: 'inline-block', width: '300px' }}>
              <label className="label">售价</label>
              <span>{Number(detail.price).toFixed(2)}</span>
            </div>
          </Row>

          <Row className="mb20">
             <div style={{ display: 'inline-block', width: '300px' }}>
              <label className="label">有效期</label>
              <span>{this.getVaild(detail)}</span>
             </div>
             <div style={{ display: 'inline-block', width: '300px' }}>
               <label className="label">领取限制</label>
               <span>{Number(detail.limit_count) > 0
                 ? `每个用户限领${detail.limit_count}张`
                 : '无限制'}</span>
             </div>
          </Row>

          <Row className="mb20">
            <label className="label">描述</label>
            <span>{detail.remark}</span>
          </Row>
        </div>

        <Row className="mb15 mt20">
          <Col span={12}>
            <h3>优惠项目</h3>
          </Col>
        </Row>
        <Table
          dataSource={items}
          columns={columnsProject}
          pagination={false}
          bordered
          rowKey={record => record._id}
        />

         <Row className="mb15 mt20">
           <Col span={12}>
           <h3>优惠配件</h3>
           </Col>
         </Row>
         <Table
           className="mt20"
           dataSource={partTypes}
           columns={columnsParts}
           pagination={false}
           bordered
           rowKey={record => record._id}
         />

        <div style={{ border: '1px solid #f5f5f5', margin: '20px -20px 0' }} />

        <Row className="mb15 mt20">
          <Col span={12}>
          <h3>发放记录</h3>
          </Col>
        </Row>

        <TablePushList
          page={page}
          source={api.coupon.getCouponItemPushList(this.state)}
          updateState={this.updateState}
          reload={this.state.reload}
        />
      </span>
    );
  }
}
