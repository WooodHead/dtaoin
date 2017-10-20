import React from 'react';
import { Modal, Table } from 'antd';
import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';

export default class TablePaymentHistory extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.customerId ? props.customerId : '',
      id: props.id ? props.id : '',
      paymentHistory: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      customerId: nextProps.customerId,
      id: nextProps.id,
    });
  }

  showModal() {
    this.setState({ visible: true });
    this.getCustomerPayLog(this.state.customerId, this.state.id);
  }

  getCustomerPayLog(customerId, id) {
    api.ajax({
      url: api.customer.getCustomerPayLog(),
      type: 'POST',
      data: { customer_id: customerId, _id: id },
    }, data => {
      this.setState({
        paymentHistory: data.res.list,
      });
    });
  }

  render() {
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
        render: value => !Number.isNaN(Number(value)) && Number(value).toFixed(2),
      },
    ];

    return (
      <span>
        <a href="javascript:" onClick={this.showModal}>查看</a>

        <Modal
          title={<span>还款记录</span>}
          visible={this.state.visible}
          width="720px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Table
            columns={columns}
            dataSource={this.state.paymentHistory}
            pagination={false}
            bordered
          />
        </Modal>
      </span>
    );
  }
}
