import React from 'react';
import { message, Modal, Form, Button, Icon, Select } from 'antd';
import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';

const FormItem = Form.Item;
const Option = Select.Option;

export default class Dispatch extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      fitterUsers: [],
      fitter_user_ids: '',
      fitter_user_names: '',
      visible: false,
    };

    this.showDispatchModal = this.showDispatchModal.bind(this);
  }

  showDispatchModal() {
    this.getFitterUsers();
    this.showModal();
  }

  getFitterUsers() {
    api.ajax({ url: api.user.getMaintainUsers(0) }, data => {
      this.setState({ fitterUsers: data.res.user_list });
    });
  }

  handleFixerChange(value) {
    const userIds = value ? value.toString() : '';

    const userIdArray = userIds.split(',');
    const userNameArray = [];
    for (let i = 0; i < this.state.fitterUsers.length; i++) {
      if (userIdArray.indexOf(this.state.fitterUsers[i]._id) > -1) {
        userNameArray.push(this.state.fitterUsers[i].name);
      }
    }

    this.setState({
      fitter_user_ids: userIds,
      fitter_user_names: userNameArray.join(','),
    });
  }

  handleCommit(e) {
    e.preventDefault();

    const { fitter_user_ids, fitter_user_names } = this.state;
    if (!fitter_user_ids) {
      message.warning('请选择工人');
      return;
    }

    this.setState({ visible: false });
    this.props.onSuccess(this.props.itemIds, fitter_user_ids, fitter_user_names);
  }


  render() {
    const { formItemLayout, selectStyle } = Layout;

    const { disabled } = this.props;
    const { visible, fitterUsers } = this.state;

    return (
      <span>
        <Button
          type="primary"
          disabled={disabled}
          onClick={this.showDispatchModal}
          className="pull-right"
        >
          批量派工
        </Button>

        <Modal
          title={<span><Icon type="double-right"/> 项目派工</span>}
          visible={visible}
          width="600px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Form>
            <FormItem label="维修人员" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} required>
              <Select
                mode="multiple"
                {...selectStyle}
                onChange={this.handleFixerChange.bind(this)}
                placeholder="请选择维修人员"
              >
                {fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem wrapperCol={{ span: 14, offset: 6 }}>
              <Button type="primary" className="mr15" onClick={this.handleCommit.bind(this)}>确认派工</Button>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}
