import React from 'react';
import { message, Modal, Icon, Button } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import api from '../../../middleware/api';

export default class FreezeSalaryModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick() {
    const { salaryIds } = this.props;
    if (salaryIds.length === 0) {
      message.warning('请选择需要冻结工资的员工');
      return false;
    } else {
      this.showModal();
    }
  }

  handleSubmit() {
    const { salaryIds } = this.props;
    api.ajax({
      url: api.user.freezeSalary(),
      type: 'POST',
      data: { salary_ids: salaryIds.toString() },
    },
      () => {

      });
  }

  render() {
    const { size, disabled } = this.props;
    const { visible } = this.state;
    return (
      <span>
        {
          size === 'small'
            ?
            <a href="javascript:;" onClick={this.handleClick} disabled={disabled}>冻结工资</a>
            :
            <Button onClick={this.handleClick} disabled={disabled}>冻结工资</Button>
        }
        <Modal
          title={<span><Icon type="lock"/> 冻结工资</span>}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>
          <span>确定要冻结工资吗</span>
        </Modal>
      </span>
    );
  }
}
