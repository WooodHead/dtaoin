import React from 'react';
import {Modal, Icon, Button} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import TableWithPagination from '../../../components/base/TableWithPagination';

import api from '../../../middleware/api';
import text from '../../../config/text';

export default class PartEntryLog extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      logs: [],
      page: 1,
    };

    this.handleShowModal = this.handleShowModal.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handleShowModal() {
    this.getTableData(this.props.supplierId, this.state.page);
  }

  handlePageChange(page) {
    this.setState({page});
    this.getTableData(this.props.supplierId, page);
  }

  getTableData(supplierId, page) {
    api.ajax({
      url: api.warehouse.supplier.entryLogs(supplierId, page),
    }, (data) => {
      let {list, total} = data.res;
      this.setState({
        visible: true,
        list,
        total: parseInt(total),
      });
    });
  }

  render() {
    const {visible, list, total, page}=this.state;

    const columns = [
      {
        title: '配件名称',
        dataIndex: 'part_name',
        key: 'part_name',
      }, {
        title: '进货价（元）',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'column-money',
        render: (value) => (
          Number(value).toFixed(2)
        ),
      }, {
        title: '进货数量',
        dataIndex: 'amount',
        key: 'amount',
        className: 'center',
      }, {
        title: '账单金额',
        dataIndex: 'pay',
        key: 'pay',
        className: 'column-money',
        render: (value, item) => (
          Number(item.in_price * item.amount).toFixed(2)
        ),
      }, {
        title: '进货时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '结算状态',
        dataIndex: 'is_pay',
        key: 'is_pay',
        render: (value) => (
          value == 1 ? '已支付' : '未支付'
        ),
      }, {
        title: '支付方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        render: (value) => (
          text.partPayType[Number(value)]
        ),
      }, {
        title: '结算时间',
        dataIndex: 'ptime',
        key: 'ptime',
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];

    return (
      <span>
        <Button
          type="ghost"
          size="small"
          className="btn-action-small"
          onClick={this.handleShowModal}
        >
          进货记录
        </Button>

        <Modal
          title={<span><Icon type="clock-circle"/> 进货记录</span>}
          visible={visible}
          width="960px"
          onCancel={this.hideModal}
          onOk={this.hideModal}
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
