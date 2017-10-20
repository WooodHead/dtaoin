import React, { Component } from 'react';
import { Table, Row, Col, message } from 'antd';

import api from '../../../middleware/api';

import CardStore from './CardStore';

require('../componentsTableNest.css');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGenerateCardModal: false,
      memberCardTypeInfo: null,
      memberCardTypeGenLog: [],
    };

    [
      'handleAddMemberCardCancel',
      'handleAddMemberCardFinish',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMemberCardTypeInfo();
  }

  handleAddMemberCardCancel() {
    this.setState({ showGenerateCardModal: false });
  }

  handleAddMemberCardFinish(newLog) {
    this.setState({ showGenerateCardModal: false });
    const { memberCardTypeGenLog } = this.state;
    newLog && memberCardTypeGenLog.unshift(newLog);
    this.setState(memberCardTypeGenLog);
  }

  // 取套餐卡类型数据
  getMemberCardTypeInfo() {
    const memberCardType = this.props.match.params.memberCardType;
    const urlForInfo = api.coupon.getCouponCardTypeInfo(memberCardType);
    api.ajax({ url: urlForInfo }, data => {
      if (data.code === 0) {
        this.setState({ memberCardTypeInfo: data.res.detail });
      } else {
        this.setState({ memberCardTypeInfo: null });
        message.error(data.msg);
      }
    }, error => {
      this.setState({ memberCardTypeInfo: null });
      message.error(error);
    });
  }

  render() {
    const memberCardTypeInfo = this.state.memberCardTypeInfo || {};
    const coupon = memberCardTypeInfo.coupon_items ? (JSON.parse(memberCardTypeInfo.coupon_items) ||
      []) : [];

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
          title: '售价(元)',
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
          bordered={false}
          rowKey={record => record._id}
        />
      );
    };

    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => index + 1,
      }, {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '适用门店',
        dataIndex: 'scope',
        key: 'scope',
        className: scopeVisible,
        render: text => {
          switch (`${  text}`) {
          case '0':
            return '通店';
          case '1':
            return '售卡门店';
          default:
            return null;
          }
        },
      }, {
        title: '优惠类型',
        dataIndex: 'type',
        key: 'type',
        render: text => {
          switch (`${  text}`) {
          case '1':
            return '计次优惠';
          case '2':
            return '折扣优惠';
          case '3':
            return '立减优惠';
          default:
            return null;
          }
        },
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        render: text => (`${  text}`) == '0' ? '不限次数' : text,
      }];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <h3>开卡信息</h3>
          </Col>
        </Row>

        <Row className="ant-row">

          <Col span={6}>
            <label className="label">套餐卡名称</label>
            <span>{memberCardTypeInfo.name || ''}</span>
          </Col>
          <Col span={6}>
            <label className="label">售价</label>
            <span>{memberCardTypeInfo.price || ''}</span>
          </Col>
          <Col span={6}>
            <label className="label">有效期</label>
            <span>{`${memberCardTypeInfo.valid_day  }天` || ''}</span>
          </Col>
          <Col span={6}>
            <label className="label">创建时间</label>
            <span>{memberCardTypeInfo.ctime || ''}</span>
          </Col>
        </Row>

        <Row className="mt10">
          <Col span={6}>
            <label className="label">描述</label>
            <span>{memberCardTypeInfo.remark || ''}</span>
          </Col>

          <Col span={6} className={api.getLoginUser().companyId == 1 ? '' : 'hide'}>
            <label className="label">适用门店</label>
            <CardStore id={this.props.match.params.memberCardType} />
          </Col>
        </Row>

        <Row className="mb10 mt15">
          <Col span={12}>
            <h3>卡内优惠</h3>
          </Col>
        </Row>

        <Table
          className="components-table-demo-nested"
          columns={columns}
          dataSource={coupon}
          pagination={false}
          bordered={false}
          rowKey={record => record._id}
          expandedRowRender={expandedRowRender}
        />
      </div>
    );
  }
}
