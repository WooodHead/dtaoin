/**
 * Created by mrz on 16-12-1.
 */
import React, {Component} from 'react'
import {Modal, Button, Row, Col, Table} from 'antd';
import {Link} from 'react-router'
import text from '../../../middleware/text'

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
      'handleCancel'
    ].map(method => this[method] = this[method].bind(this));
  };

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

  handleCancel(e) {
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

    // console.log('------------memberDetail', memberDetail)

    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return index + 1;
      }
    }, {
      title: '优惠名称',
      dataIndex: 'coupon_item_name',
      key: 'coupon_item_name',
    }, {
      title: '适用门店',
      dataIndex: 'scope',
      key: 'scope',
      render(value) {
        return text.applicableStore[Number(value)];
      }
    }, {
      title: '描述',
      dataIndex: 'coupon_item_remark',
      key: 'coupon_item_remark',
    }, {
      title: '优惠类型',
      dataIndex: 'coupon_item_type',
      key: 'coupon_item_type',
      render(value, record) {
        return text.couponType[Number(value)];
      }
    }, {
      title: '剩余数量',
      dataIndex: 'amount',
      key: 'amount',
    }];


    return (
      <div className="margin-left-20" style={{display: 'inline-block'}}>
        <Button type="dashed" size="small" onClick={this.checkDetails}>查看详情</Button>
        <Modal
          title="详情信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table dataSource={memberDetail} columns={columns} pagination={false}/>
        </Modal>
      </div>
    );
  };
}
