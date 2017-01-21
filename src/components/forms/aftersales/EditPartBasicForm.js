import React, {Component} from 'react'
import {Button, Form, Input, Select, message} from 'antd'
import api from '../../../middleware/api'
import Layout from '../../../utils/FormLayout'

const FormItem = Form.Item;
const Option = Select.Option;

class EditPartBasicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {types: []}
  }

  componentDidMount() {
    this.getPartsDetailById(this.props.partId);
    this.getItemTypes();
  }

  getPartsDetailById(id) {
    api.ajax({url: api.getPartsDetail(id)}, data => {
      let detail = data.res.detail;
      this.props.form.resetFields();
      this.props.form.setFieldsValue({
        name: detail.name,
        part_no: detail.part_no,
        part_id: detail._id,
        type: detail.type,
        remark: detail.remark,
      });
    })
  }

  submit(e) {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();
    api.ajax({url: api.editParts(), type: 'POST', data: data}, function () {
      message.info('编辑成功！');
      this.props.cancelModal();
      location.reload();
    }.bind(this))
  }

  getItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, function (data) {
      this.setState({types: data.res.type_list});
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {partId} =this.props;
    const {getFieldDecorator} = this.props.form;

    return <Form horizontal>
      {getFieldDecorator('part_id', {initialValue: partId})(
        <Input type="hidden"/>
      )}
      <FormItem label="配件号" {...formItemLayout}>
        {getFieldDecorator('part_no')(
          <Input type="text"/>
        )}
      </FormItem>

      <FormItem label="配件名" {...formItemLayout}>
        {getFieldDecorator('name')(
          <Input type="text"/>
        )}
      </FormItem>

      <FormItem label="配件使用项目类型" {...formItemLayout}>
        {getFieldDecorator('type')(
          <Select{...selectStyle} placeholder="请选择使用配件的项目类型">
            {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
          </Select>
        )}
      </FormItem>

      <FormItem label="备注" {...formItemLayout}>
        {getFieldDecorator('remark')(
          <Input type="textarea"/>
        )}
      </FormItem>

      <FormItem {...buttonLayout}>
        <Button type="ghost" className="mr15" onClick={this.props.cancelModal.bind(this)}>取消</Button>
        <Button type="primary" onClick={this.submit.bind(this)}>确认提交</Button>
      </FormItem>
    </Form>
  }
}

EditPartBasicForm = Form.create()(EditPartBasicForm);
export default EditPartBasicForm
