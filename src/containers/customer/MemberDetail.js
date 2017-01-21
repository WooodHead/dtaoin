import React, {Component} from 'react';
import {Modal, Button, Table} from 'antd';
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
    // let {detail} = this.props;
    // let {content} = this.props;
    // console.log('------detail', detail);
    // let ifDisabled = Number(detail.status) === 3;
    let {memberDetail} = this.props;

    //console.log('------------memberDetail', memberDetail);

    const columns = [{
      title: '序号',
      width: '5%',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '优惠名称',
      width: '15%',
      dataIndex: 'coupon_item_name',
      key: 'coupon_item_name',
    }, {
      title: '适用门店',
      width: '20%',
      dataIndex: 'scope',
      key: 'scope',
      render(value) {
        return text.applicableStore[Number(value)];
      },
    }, {
      title: '描述',
      width: '20%',
      dataIndex: 'coupon_item_remark',
      key: 'coupon_item_remark',
    }, {
      title: '优惠类型',
      width: '10%',
      render(value, record) {
        return text.couponType[record.coupon_item_info.type] + '优惠';
      },
    }, {
      title: '剩余数量',
      width: '5%',
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
      width: '5%',
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
      <div className="margin-left-20" style={{display: 'inline-block'}}>
        <Button type="dashed" size="small" onClick={this.checkDetails}>查看详情</Button>
        <Modal
          width={800}
          title="详情信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table dataSource={memberDetail} columns={columns} pagination={false}/>
        </Modal>
      </div>
    );
  }
}
