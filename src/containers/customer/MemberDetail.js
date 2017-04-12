import React, {Component} from 'react';
import {Modal, Table} from 'antd';

import api from '../../middleware/api';
import text from '../../config/text';

export default class MemberDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    [
      'checkDetails',
      'showModal',
      'handleOk',
      'handleCancel',
    ].map(method => this[method] = this[method].bind(this));
  }

  checkDetails() {
    this.setState({visible: true});
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    let userInfo = api.getLoginUser();
    let {memberDetail} = this.props;

    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '优惠名称',
      dataIndex: 'coupon_item_name',
      key: 'coupon_item_name',
    }, {
      title: '适用门店',
      dataIndex: 'scope',
      key: 'scope',
      render(value) {
        return Number(value) === 0 ? '通店' : userInfo.companyName;
      },
    }, {
      title: '描述',
      dataIndex: 'coupon_item_remark',
      key: 'coupon_item_remark',
    }, {
      title: '优惠类型',
      render(value, record) {
        return text.couponType[record.coupon_item_info.type] + '优惠';
      },
    }, {
      title: '剩余数量',
      dataIndex: 'amount',
      key: 'amount',
      render(value, record) {
        if (Number(record.total) > 0) {
          return record.amount;
        } else if (Number(record.total) === 0) {
          return '不限次数';
        } else {
          return '异常情况';
        }
      },
    }, {
      title: '总数',
      dataIndex: 'total',
      key: 'total',
      render(value, record) {
        if (Number(record.total) > 0) {
          return record.total;
        } else if (Number(record.total) === 0) {
          return '不限次数';
        } else {
          return '异常情况';
        }
      },
    }];

    return (
      <div className="ml20" style={{display: 'inline-block'}}>
        <a href="javascript:;" onClick={this.checkDetails}>预览</a>
        <Modal
          title="详情信息"
          visible={this.state.visible}
          width={1000}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table dataSource={memberDetail} columns={columns} pagination={false} size="small"/>
        </Modal>
      </div>
    );
  }
}
