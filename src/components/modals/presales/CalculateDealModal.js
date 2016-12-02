import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseModal from '../../base/BaseModal'
import CalculateDealForm from '../../forms/presales/CalculateDealForm'

export default class CalculateDealModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          onClick={this.showModal}
          disabled={this.props.isDisabled}
          className="mr15"
          size="small">
          计算收益
        </Button>
        <Modal title={<span><Icon type="calculator"/> 新车销售收益计算</span>}
               visible={this.state.visible}
               width="680px"
               onCancel={this.hideModal}
               footer={null}>
          <CalculateDealForm
            cancelModal={this.hideModal}
            userAutoId={this.props.userAutoId}
          />
        </Modal>
      </span>
    );
  }
}
