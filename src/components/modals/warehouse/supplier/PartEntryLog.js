import React from 'react'
import {message, Modal, Icon, Button} from 'antd'
import api from '../../../../middleware/api'
import BaseModal from '../../../base/BaseModal'
import PartEntryLogTable from '../../../tables/warehouse/PartEntryLogTable'

export default class PartEntryLog extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      logs: [],
      page: 1,
    };
  }

  render() {
    const {visible}=this.state;

    return (
      <span>
        <Button
          type="ghost"
          size="small"
          onClick={this.showModal}>
          进货记录
        </Button>

        <Modal
          title={<span><Icon type="clock-circle"/> 进货记录</span>}
          visible={visible}
          width="680px"
          onCancel={this.hideModal}
          onOk={this.hideModal}>

          <PartEntryLogTable
            source={api.warehouse.getSupplierEntryLog(this.props.supplierId, this.state.page)}
            path="warehouse/supplier/list"
          />
        </Modal>
      </span>
    )
  }
}
