import React from 'react';
import { Modal, Icon } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import api from '../../../middleware/api';

export default class PartEntryLog extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      list: [],
      total: 0,
    };

    this.handleShowModal = this.handleShowModal.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handleShowModal() {
    this.getPayRejects(this.props.supplierId, this.state.page);
    this.showModal();
  }

  handlePageChange(page) {
    this.setState({ page });
    this.getPayRejects(this.props.supplierId, page);
  }

  getPayRejects(supplierId, page) {
    api.ajax({ url: api.warehouse.reject.getListBySupplierAndPayStatus(supplierId, '', page) }, data => {
      const { list, total } = data.res;
      this.setState({ list, total: parseInt(total) });
    });
  }

  render() {
    const { visible, list, total, page } = this.state;

    const columns = [
      {
        title: '单号',
        dataIndex: '_id',
        key: '_id',
        className: 'center',
      }, {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
        className: 'center',
      }, {
        title: '出库时间',
        dataIndex: 'export_time',
        key: 'export_time',
        className: 'center',
      }, {
        title: '退款金额',
        dataIndex: 'new_worth',
        key: 'new_worth',
        className: 'text-right',
      }, {
        title: '退款差价',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
      }, {
        title: '运费',
        dataIndex: 'freight',
        key: 'freight',
        className: 'text-right',
      }, {
        title: '结算时间',
        dataIndex: 'pay_time',
        key: 'pay_time',
        className: 'center',
      },
    ];

    return (
      <span>
        <a href="javascript:" onClick={this.handleShowModal}>退货记录</a>

        <Modal
          title={<span><Icon type="clock-circle"/> 退货记录</span>}
          visible={visible}
          width={960}
          onCancel={this.hideModal}
          footer={null}
        >
          <TableWithPagination
            columns={columns}
            dataSource={list}
            total={total}
            currentPage={page}
            onPageChange={this.handlePageChange}
          />
        </Modal>
      </span>
    );
  }
}
