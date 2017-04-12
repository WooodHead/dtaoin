import React from 'react';
import {Button, Modal, Table} from 'antd';

import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';

export default class TablePaymentHistory extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      paymentHistory: [],
    };
  }

  showModal() {
    this.setState({visible: true});
    this.getCustomerPayLog(this.props.customerInfo);
  }

  getCustomerPayLog(customerInfo) {
    api.ajax({
      url: api.aftersales.partSellPayLog(),
      type: 'POST',
      data: {order_id: customerInfo._id, customer_id: customerInfo.customer_id},
    }, (data) => {
      this.setState({
        paymentHistory: data.res.list,
      });
    });
  }

  render() {
    let {size} = this.props;
    const columns = [
      {
        title: '支付时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '支付金额(元)',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '支付方式',
        dataIndex: 'pay_type_name',
        key: 'pay_type_name',
      }, {
        title: '剩余应还(元)',
        dataIndex: 'remain_unpay',
        key: 'remain_unpay',
        render: value => Number(value).toFixed(2),
      },
    ];

    return (
      <span>
        {
          size === 'small' ?
            <a href="javascript:;" onClick={this.showModal}>查看</a> :
            <Button type="primary" onClick={this.showModal}>查看</Button>
        }

        <Modal
          title={<span>还款记录</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Table
            columns={columns}
            dataSource={this.state.paymentHistory}
            pagination={false}
            bordered
            rowKey={record => record.ctime}
          />
        </Modal>
      </span>
    );
  }
}
