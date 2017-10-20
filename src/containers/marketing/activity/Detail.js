import React from 'react';
import { Table, message, Row, Col } from 'antd';

import BaseList from '../../../components/base/BaseList';
import api from '../../../middleware/api';
import text from '../../../config/text';
import QRCode from 'qrcode.react';

import TablePushList from './TablePushList';
import Preview from './Preview';
import Delivery from './Delivery';

require('../markingActivity.less');

export default class Detail extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      detail: {},
      imgUrl: '',
      page: 1,
    };
    [
      'getDetail',
      'getPicUrl',
      'handleClick',
      'handleCopyUrl',
      'showModal',
      'hideModal',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getDetail();

    setTimeout(() => {
      this.qrCode.refs.canvas.style.verticalAlign = 'top';
    }, 0);
  }

  handleSaveFile = function(data, filename) {
    const saveLink = document.createElement('a');
    saveLink.href = data;
    saveLink.download = filename;

    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    saveLink.dispatchEvent(event);
  };

  handleFixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    const r = type.match(/png|jpeg|bmp|gif/)[0];
    return `image/${  r}`;
  };

  handleClick() {
    const canvas = this.qrCode.refs.canvas.toDataURL('image/png');
    const imgData = canvas.replace(this.handleFixType('png'), 'image/octet-stream');
    const filename = `qrCode${  (new Date()).getTime()  }.` + 'png';
    this.handleSaveFile(imgData, filename);
  }

  handleCopyUrl() {
    const url = this.url;
    url.select();
    try {
      if (document.execCommand('copy', false, null)) {
        message.success('复制成功');
      } else {
        message.success('复制失败');
      }
    } catch (err) {
      message.success('复制失败');
    }
  }

  getDetail() {
    const { id } = this.state;
    api.ajax({ url: api.coupon.getCouponActivityDetail(id) }, data => {
      const { detail } = data.res;
      this.setState({ detail });
      this.getPicUrl(detail.banner_pic);
    });
  }

  getPicUrl(picName) {
    api.ajax({ url: api.system.getPublicPicUrl(picName) }, data => {
      const url = data.res.url;
      this.setState({ imgUrl: url });
    });
  }

  showModal() {
    this.setState({ visible: true });
  }

  hideModal() {
    this.setState({ visible: false });
  }

  render() {
    const { detail, imgUrl, page, reload } = this.state;
    const rules = detail.rule ? detail.rule.split('\n') : [];
    const dataSource = detail.coupon_item_info ? [detail.coupon_item_info] : [];

    const endTime = new Date(detail.expire_time);
    const now = new Date();

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '优惠信息',
        key: 'coupon_info',
        render: (value, record) => {
          if (String(record.type) === '1') {
            return `${record.price}元`;
          } else if (String(record.type) === '2') {
            let rate = String(Number(Number(record.discount_rate).toFixed(2)) * 100);
            if (rate.length === 1) {
              return `${(rate / 10) || '0'  }折`;
            }

            if (Number(rate.charAt(rate.length - 1)) === 0) {
              rate = rate.slice(0, rate.length - 1);
            }
            return `${rate || '0'  }折`;
          }
        },
      }, {
        title: '优惠券类型',
        dataIndex: 'type',
        key: 'type',
        render: value => text.couponType[value],
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
        title: '领用限制',
        dataIndex: 'limit_count',
        key: 'limit_count',
        render: value => Number(value) === 0 ? '无限制' : value,
      }];

    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <div className="pull-right">
            <Preview detail={detail} />
          </div>
          <div className={!!detail.expire_time
            ? new Date() > new Date(detail.expire_time)
              ? 'hide'
              : 'pull-right mr10'
            : 'hide'}
          >
            <Delivery detail={detail} onSuccess={this.handleSuccess} />
          </div>
        </Row>

        <div className="content clearfix">
          <div className="pic-content">
            <img src={imgUrl} style={{ width: '200px', height: '200px' }} />
          </div>
          <div className="word-content">
            <div className="title">
              <h1>{detail.title}</h1>
              <p className="mb10">{detail.sub_title}</p>
            </div>
            <div className="plan clearfix">
              <div>
                <label className="label mr30">活动时间</label>
                <span>{`${detail.start_time} 至 ${detail.expire_time}`}</span>
              </div>
              <div>
                <label className="label mr30">营销文案</label>
                <span>{detail.description}</span>
              </div>
              <div>
                <label className="label pull-left">活动规则描述</label>
                <span className="pull-left">
                  {
                    rules.map((item, index) => <span key={index}><span>{item}</span><br /></span>)
                  }
                </span>
              </div>
            </div>

            <div className="coupon">
              <label className="label">优惠券</label>
              <Table
                dataSource={dataSource}
                columns={columns}
                size="small"
                bordered={false}
                pagination={false}
                onRowClick={this.handleTableRowClick}
                rowKey={record => record._id}
              />
            </div>

            <div className={now > endTime ? 'hide' : ''}>
              <label
                className="label mb10"
                style={{ fontWeight: 'bolder', display: 'inline-block' }}
              >
                转发活动
              </label>
              <p className="font-size-14 mb10 grey-999">您可选择复制该链接转发或下载二维码制作门店活动物料</p>
              <div className="mb15">
                <span className="label font-size-14 grey-999">链接</span>
                <input
                  className="font-size-14"
                  style={{ border: 'none', outline: 'none', width: '510px', color: '#999' }}
                  value={detail.url}
                  ref={url => this.url = url}
                />
                <a
                  href="javascript:;"
                  className="font-size-14"
                  onClick={this.handleCopyUrl}
                >
                  复制链接
                </a>
                <br />
              </div>

              <div className="mb20">
                <span className="label grey-999" style={{ verticalAlign: 'top' }}>二维码</span>
                <span
                  style={{
                    padding: '10px',
                    display: 'inline-block',
                    border: '1px solid rgba(225, 225, 225, 1)',
                    verticalAlign: 'top',
                  }}
                >
                  <QRCode
                    value={detail.url || ''}
                    size={128}
                    ref={qrCode => this.qrCode = qrCode}
                  />
                </span>

                <a
                  href="javascript:;"
                  className="ml10 font-size-14"
                  onClick={this.handleClick}
                >
                  下载二维码
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid #f5f5f5' }} />

        <Row className="mb15 mt20">
          <Col span={12}>
            <h3>推送记录</h3>
          </Col>
        </Row>

        <TablePushList
          page={page}
          source={api.coupon.getCouponActivityPushList(this.state)}
          updateState={this.updateState}
          reload={reload}
        />
      </div>
    );
  }
}

