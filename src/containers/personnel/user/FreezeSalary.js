import React from 'react';
import {message, Modal, Icon, Button} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import api from '../../../middleware/api';

export default class FreezeSalaryModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick() {
    let {salaryIds} = this.props;
    if (salaryIds.length === 0) {
      message.warning('请选择需要冻结工资的员工');
      return false;
    } else {
      this.showModal();
    }
  }

  handleSubmit() {
    let {salaryIds} = this.props;
    api.ajax({
        url: api.user.freezeSalary(),
        type: 'POST',
        data: {salary_ids: salaryIds.toString()},
      },
      () => {
        // (data) => {
        // console.log('success', data);
      });
  }

  render() {
    let {size, disabled} = this.props;
    return (
      <span>
        <Button
          type="ghost"
          onClick={this.handleClick}
          size={size || 'default'}
          disabled={disabled}
          className="mr15">
          冻结工资
        </Button>
        <Modal
          title={<span><Icon type="lock"/> 冻结工资</span>}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>
          <span>确定要冻结工资吗</span>
        </Modal>
      </span>
    );
  }
}
