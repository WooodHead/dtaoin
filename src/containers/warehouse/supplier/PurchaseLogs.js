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
    this.getPayPurchases(this.props.supplierId, this.state.page);
    this.showModal();
  }

  handlePageChange(page) {
    this.setState({ page });
    this.getPayPurchases(this.props.supplierId, page);
  }

  getPayPurchases(supplierId, page) {
    api.ajax({ url: api.warehouse.purchase.getListBySupplierAndPayStatus(supplierId, '', page) }, data => {
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
      }, {
        title: '类型',
        dataIndex: 'type_name',
        key: 'type_name',
        className: 'center',
      }, {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
        className: 'center',
      }, {
        title: '入库时间',
        dataIndex: 'arrival_time',
        key: 'arrival_time',
        className: 'center',
        render: value => value && value.indexOf('0000') > -1 ? null : value,
      }, {
        title: '采购金额',
        dataIndex: 'worth',
        key: 'worth',
        className: 'text-right',
      }, {
        title: '实付金额',
        dataIndex: 'unpay_worth',
        key: 'unpay_worth',
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
        render: value => value && value.indexOf('0000') > -1 ? '--' : value,
      },
    ];

    return (
      <span>
        <a href="javascript:" onClick={this.handleShowModal}>进货记录</a>

        <Modal
          title={<span><Icon type="clock-circle"/> 供应商进货记录</span>}
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
