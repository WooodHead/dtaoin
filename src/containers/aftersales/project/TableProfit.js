import React from 'react';
import { Modal, Table } from 'antd';
import BaseModal from '../../../components/base/BaseModal';

export default class TablePaymentHistory extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const { meritPayItemList } = this.props;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'user_name',
        key: 'user_name',
      }, {
        title: '提成项目',
        dataIndex: 'item',
        key: 'item',
      }, {
        title: '提成(元)',
        dataIndex: 'amount',
        key: 'amount',
        render: value => Number(value).toFixed(2),
      },
    ];

    return (
      <span>
        <a href="javascript:" onClick={this.showModal}>查看</a>

        <Modal
          title={<span>提成详情</span>}
          visible={this.state.visible}
          width="720px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Table
            columns={columns}
            dataSource={meritPayItemList}
            pagination={false}
            bordered
          />
        </Modal>
      </span>
    );
  }
}
