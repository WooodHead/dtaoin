import React from 'react';
import {Modal, Icon, Button, Form} from 'antd';
import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';
import TableWithPagination from '../../../components/widget/TableWithPagination';


class TransferIncomeListModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      transfer_id: props.transfer_id,
      data: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.incomeListByTransferId(this.props.transfer_id);
  }

  handlePageChange(page) {
    this.setState({page: page});
  }

  incomeListByTransferId(transfer_id) {
    api.ajax({
      url: api.finance.incomeListByTransferId(transfer_id, this.state.page),
    }, function (data) {
      this.setState({data: data.res.list});
    }.bind(this));
  }

  render() {
    const {visible, total} = this.state;
    let {size} = this.props;
    const columns = [
      {
        title: '交易时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '订单号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '金额',
        dataIndex: 'amount',
        className: 'text-right',
        key: 'amount',
      },
    ];

    return (
      <span>
        {
          size === 'small' ?
            <a href="javascript:;" onClick={this.showModal}>查看详情</a> :
            <Button className="ml20" onClick={this.showModal}>查看详情</Button>
        }
        <Modal
          title={<span><Icon type="info-circle-o" className="mr10"/>结算详情</span>}
          visible={visible}
          width="680px"
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <TableWithPagination
            columns={columns}
            dataSource={this.state.data}
            total={total}
            currentPage={this.props.page}
            onPageChange={this.handlePageChange}
          />
        </Modal>
      </span>
    );
  }
}

TransferIncomeListModal = Form.create()(TransferIncomeListModal);
export default TransferIncomeListModal;
