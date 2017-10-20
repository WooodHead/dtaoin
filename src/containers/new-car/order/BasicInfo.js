import React from 'react';
import { Row, Button, Popconfirm } from 'antd';

import classNames from 'classnames';

import JinJianReject from './JinJianReject';
import OrderFail from './OrderFail';

import text from '../../../config/text';

require('./basic-info.less');

export default class BasicInfo extends React.Component {
  getPic(pic) {
    this.props.getPic(pic, this.downloadPic);
  }

  downloadPic(url) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', '-');
    a.click();
  }

  render() {
    const { detail } = this.props;

    const jinJian = classNames({
      ml10: (String(detail.status) === '1' || String(detail.status) === '3'),
      hide: (String(detail.status) !== '1' && String(detail.status) !== '3'),
    });
    const jinJianReject = classNames({
      ml10: String(detail.status) === '2',
      hide: !(String(detail.status) === '2'),
    });
    const jinJianPass = classNames({
      ml10: String(detail.status) === '2',
      hide: !(String(detail.status) === '2'),
    });
    const jinJianFail = classNames({
      ml10: String(detail.status) === '2',
      hide: !(String(detail.status) === '2'),
    });
    const qianDan = classNames({
      ml10: String(detail.status) === '5',
      hide: !(String(detail.status) === '5'),
    });
    const orderFinish = classNames({
      ml10: String(detail.status) === '6',
      hide: !(String(detail.status) === '6'),
    });

    const depositStatus = classNames({
      hide: String(detail.product_type) === '1',
      item: !(String(detail.product_type) === '1'),
    });

    return (
      <div className="new-car-basic-info">
        <Row>
          <p className="customer-info">
            <span className="info">
              {
                `${!!detail.customer_name ? detail.customer_name : ''} ${!!detail.customer_gender
                  ? text.gender[detail.customer_gender]
                  : ''} ${!!detail.customer_phone ? detail.customer_phone : ''}`
              }
            </span>

            {!!detail.status_name ? <span className="type">{detail.status_name}</span> : ''}

            <span className="ml40">
              {
                String(detail.status) === '-1'
                  ? `取消原因: ${detail.jinjian_fail_reason}`
                  : String(detail.status) === '3'
                  ? `驳回原因: ${detail.jinjian_reject_reason}` : null
              }
            </span>
          </p>

          <div className="button-action">
            <Button type="primary" className={jinJian} onClick={this.props.jinJian}>进件</Button>

            <span className={jinJianFail}>
              <OrderFail jinJianFail={this.props.jinJianFail} />
            </span>

            <span className={jinJianReject}>
                <JinJianReject jinJianReject={this.props.jinJianReject} />
            </span>

            <Button
              type="primary"
              className={jinJianPass}
              onClick={this.props.jinJianPass}
            >
              进件通过
            </Button>

            <Button type="primary" className={qianDan} onClick={this.props.qianDan}>签单</Button>

            <Popconfirm
              title={<div>
                <div>确定交易完成吗?</div>
                <div>交易完成后所有信息不可编辑</div>
              </div>}
              onConfirm={this.props.orderFinish}
              okText="确定"
              cancelText="取消"
              overlayClassName="white"
            >
              <Button
                type="primary"
                className={orderFinish}
              >
                交易完成
              </Button>
            </Popconfirm>
          </div>
        </Row>

        <div className="line" />

        <Row>
          <span className="item">
            <label className="label">产品方案</label>
            <span>{detail.product_name}</span>
          </span>

          <span className="item">
            <label className="label">资源方产品</label>
            <span>{detail.resource_product_name}</span>
          </span>

          <span className="item">
            <label className="label">融资类型</label>
            <span>{detail.product_type_name}</span>
          </span>
        </Row>

        <Row>
          <span className="item">
            <label className="label">负责门店</label>
            <span>{detail.company_name}</span>
          </span>
          <span className="item">
            <label className="label">销售人员</label>
            <span>{detail.seller_user_name}</span>
          </span>
        </Row>

        <Row>
          <span className="item">
            <label className="label">意向创建</label>
            <span>{detail.ctime && (detail.ctime.indexOf('0000') > -1 ? '--' : detail.ctime)}</span>
          </span>

          <span className="item">
            <label className="label">订单创建</label>
            <span>{detail.earnest_pay_time &&
            (detail.earnest_pay_time.indexOf('0000') > -1 ? '--' : detail.earnest_pay_time)}</span>
          </span>

          <span className="item">
            <label className="label">进件时间</label>
            <span>{detail.jinjian_time &&
            (detail.jinjian_time.indexOf('0000') > -1 ? '--' : detail.jinjian_time)}</span>
          </span>

          <span className="item">
            <label className="label">交易完成</label>
            <span>{detail.finish_time &&
            (detail.finish_time.indexOf('0000') > -1 ? '--' : detail.finish_time)}</span>
          </span>
        </Row>

        <Row>
          <span className="item">
            <label className="label">意向金状态</label>
            {
              String(detail.earnest_status) === '1'
                ? <span style={{ color: '#7ed321' }}>已收</span>
                : ''
            }

            {
              String(detail.earnest_status) === '0' ? <span style={{ color: 'red' }}>未支付</span> : ''
            }

            {
              !!detail.earnest_pic
                ? (
                  <a
                    href="javascript:;"
                    className="ml10"
                    onClick={() => this.getPic(detail.earnest_pic)}
                  >
                    下载凭证
                  </a>
                )
                : ''
            }
          </span>

          <span className={depositStatus}>
            <label className="label">定金状态</label>
            {
              String(detail.deposit_status) === '1'
                ? <span style={{ color: '#7ed321' }}>已收</span>
                : ''
            }

            {
              String(detail.deposit_status) === '0' ? <span style={{ color: 'red' }}>未支付</span> : ''
            }

            {
              !!detail.deposit_pic
                ? (
                  <a
                    href="javascript:;"
                    className="ml10"
                    onClick={() => this.getPic(detail.deposit_pic)}
                  >
                    下载凭证
                  </a>
                )
                : ''
            }
          </span>
        </Row>
      </div>
    );
  }
}
