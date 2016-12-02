import React from 'react'
import {Row, Col, Modal, Icon, Button, Form, Input, DatePicker, Select} from 'antd'
import api from '../../../middleware/api'
import Layout from '../../forms/Layout'
import BaseModal from '../../base/BaseModal'
import BaseTable from '../../base/BaseTable'

const FormItem = Form.Item;

class TransferIncomeListModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      page: 1,
      transfer_id: this.props.transfer_id
    };
  }

  componentDidMount() {
    this.incomeListByTransferId(this.props.transfer_id);
  }

  onPageChange(page) {
      this.setState({page: page});
  }

  incomeListByTransferId(transfer_id) {
    api.ajax({
      url: api.incomeListByTransferId(transfer_id, this.state.page),
    }, function (data) {
      this.setState({data: data.res.list});
    }.bind(this));
  }

  render() {
    const {visible, data} = this.state;

    const columns = [
      {
        title: '交易时间',
        dataIndex: 'ctime',
        key: 'ctime'
      }, {
        title: '订单号',
        dataIndex: '_id',
        key: '_id'
      }, {
        title: '金额',
        dataIndex: 'amount',
        className: 'column-money',
        key: 'amount'
      }
    ];

    return (
      <span>
        <Button type="primary"
                className="margin-left-20"
                onClick={this.showModal}>
          查看详情
        </Button>
        <Modal title={<span><Icon type="plus" className="margin-right-10"/>结算详情</span>}
               visible={visible}
               width="680px"
               onOk={this.hideModal}
               onCancel={this.hideModal}>

           <div>
             <BaseTable
               columns={columns}
               dataSource={this.state.data}
               onPageChange={this.onPageChange.bind(this)}
               page={this.props.page}
             />
           </div>
        </Modal>
      </span>
    );
  }
}

TransferIncomeListModal = Form.create()(TransferIncomeListModal);
export default TransferIncomeListModal
