import React from 'react'
import {message, Modal, Form, Button, Icon, Select} from 'antd'
import api from '../../../middleware/api'
import Layout from '../../forms/Layout'
import BaseModal from '../../base/BaseModal'

const FormItem = Form.Item;
const Option = Select.Option;

export default class ProjectDispatchModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
        fitterUsers: [],
        fitter_user_ids: '',
        fitter_user_names: '',
        visible: false,
    };
  }

  componentWillMount() {
    this.getFitterUsers();
  }

  getFitterUsers() {
    api.ajax({url: api.user.getMaintainUsers(0)}, function (data) {
      this.setState({fitterUsers: data.res.user_list});
    }.bind(this))
  }

  handleFixerChange(value) {
    let userIds = value ? value.toString() : '';

    let userIdArray = userIds.split(',');
    let userNameArray = [];
    for(let i = 0; i < this.state.fitterUsers.length; i++){
        if(userIdArray.indexOf(this.state.fitterUsers[i]._id) > -1) {
          userNameArray.push(this.state.fitterUsers[i].name);
        }
    }

    this.setState({fitter_user_ids: userIds, fitter_user_names: userNameArray.join(',')});
  }

  handleCommit(e) {
    e.preventDefault();
    if (!this.state.fitter_user_ids) {
      message.warning('请选择工人');
      return;
    }

    this.setState({visible: false});
    this.props.onSuccess(this.props.itemIds, this.state.fitter_user_ids, this.state.fitter_user_names);
  }


  render() {
    let {formItemLayout, buttonLayout, selectStyle} = Layout;
    return (
      <span>
        <Button
          type="primary"
          disabled={this.props.disabled}
          onClick={this.showModal}
          size={this.props.size || "small"}>
          派工
        </Button>
        <Modal
          title={<span><Icon type="plus"/> 添加项目</span>}
          visible={this.state.visible}
          width="600px"
          onCancel={this.hideModal}
          footer={null}>
          <Form horizontal>
            <FormItem label="维修人员" {...formItemLayout} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} required>
              <Select
                multiple
                onChange={this.handleFixerChange.bind(this)}
                {...selectStyle}                                                                 
                className="no-margin-bottom"
                placeholder="请选择维修人员">
                {this.state.fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
              </Select>
            </FormItem>
            <FormItem {...buttonLayout}>
              <Button type="primary" className="mr15" onClick={this.handleCommit.bind(this)}>提交</Button>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}
