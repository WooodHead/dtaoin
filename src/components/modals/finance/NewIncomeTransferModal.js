import React from 'react'
import {Modal, Select, Icon, Button, Form, Input, Row, Col, message, DatePicker} from 'antd'
import api from '../../../middleware/api'
import formatter from "../../../middleware/formatter"
import Qiniu from '../../../middleware/UploadQiniu'
import UploadComponent from '../../base/BaseUpload'
import BaseModal from '../../base/BaseModalWithUpload'
import Layout from '../../forms/Layout'

const FormItem = Form.Item;
const Option = Select.Option;

class NewIncomeTransferModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      company_data: this.props.company_data ? this.props.company_data : [],
      company: {},
      company_id: '',
      end_date: formatter.day(new Date()),
      amount: 0.00,
      ids: '',
      pay_pic_key: '',
      pay_pic_files: [],
      pay_pic_progress: {}
    };
  }

  componentDidMount() {
    this.getCompanyList();
  }

  getCompanyList() {
    api.ajax({url: api.company.list()}, (data)=> {
      let list = data.res.company_list;
      if (list.length > 0) {
        this.setState({company_data: list});
      } else {
        this.setState({company_data: []});
      }
    })
  }

  genUntransferIncome(company_id, end_date) {
    if (!company_id) {
        message.warning('请选择公司');
        return;
    }
    api.ajax({
      url: api.genIncomeUntransfer(company_id, end_date),
      type: 'GET'
    }, function (data) {
      this.setState({amount: data.res.amount, ids: data.res.ids});
    }.bind(this));
  }

  handleCompanySelect(value, option) {
    let index = option.props.index;
    let list = this.state.company_data;
    console.log(option.props.children);
    this.setState({value: option.props.children, company_id: list[index]._id, company: list[index]});
    this.genUntransferIncome(list[index]._id, this.state.end_date);
  }

  onChangeTime(value, dateString) {
    this.setState({
      end_date: dateString
    });
    this.genUntransferIncome(this.state.company_id, dateString);
  }

  handleSubmit() {
    const formData = this.props.form.getFieldsValue();
    if (!formData.amount || !formData.pay_pic) {
        message.warning('请转账后再提交');
        return;
    }

    api.ajax({
      url: api.setIncomeTransfered(),
      type: 'POST',
      data: formData
    }, function (data) {
      if (data.code === 0) {
        message.info('转账信息提交成功！');
        this.hideModal();
        location.hash = api.getHash();
      }
    }.bind(this));
  }

  render() {
    const {visible}=this.state;
    const {formItemLayout_1014} = Layout;
    const {getFieldProps} = this.props.form;
    let {company} = this.state;

    return (
          <span>
        <Button type="primary"
                className="margin-left-20"
                onClick={this.showModal}>
          计算金额
        </Button>
        <Modal title={<span><Icon type="plus" className="margin-right-10"/>计算金额</span>}
               visible={visible}
               width="880px"
               onOk={this.handleSubmit.bind(this)}
               onCancel={this.hideModal}>

          <Form horizontal form={this.props.form}>
            <FormItem label='门店选择'  labelCol={{span: 2}} wrapperCol={{span: 21}} required>
              <Select
              {...getFieldProps('company_id')}
              onSelect={this.handleCompanySelect.bind(this)}
              size="large">
                {this.state.company_data.map(company => <Option key={company._id}>{company.name}</Option>)}
              </Select>
            </FormItem>
            <Row type="flex">
              <Col span="12">
                <FormItem label="账户名" labelCol={{span: 4}} wrapperCol={{span: 18}} required>
                  <Input {...getFieldProps('bank_account_name', {initialValue: company.bank_account_name})} disabled/>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="收款账号" labelCol={{span: 4}} wrapperCol={{span: 18}}>
                  <Input {...getFieldProps('bank_account_number', {initialValue: company.bank_account_number})} disabled/>
                </FormItem>
              </Col>
            </Row>
            <FormItem label='开户银行'  labelCol={{span: 2}} wrapperCol={{span: 21}}>
              <Input {...getFieldProps('bank_name', {initialValue: company.bank_name})} disabled/>
            </FormItem>
            <Row type="flex">
              <Col span="12">
                <FormItem label="结算时间" labelCol={{span: 4}} wrapperCol={{span: 18}} required>
                  <Input type="hidden" {...getFieldProps('end_date', {initialValue: this.state.end_date})} />
                  <DatePicker
                    format="yyyy-MM-dd"
                    defaultValue={this.state.end_date}
                    onChange={this.onChangeTime.bind(this)}
                  />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="待支付金额" labelCol={{span: 4}} wrapperCol={{span: 18}}>
                  <Input type="hidden" {...getFieldProps('amount', {initialValue: this.state.amount})} />
                  <Input type="hidden" {...getFieldProps('ids', {initialValue: this.state.ids})} />
                  <span>{Number(this.state.amount).toFixed(2)}元</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex">
              <Col span="12">
                <FormItem label="电子回单" labelCol={{span: 4}} wrapperCol={{span: 18}} required>
                  <Input type="hidden" {...getFieldProps('pay_pic')} />
                  <Qiniu prefix="pay_pic"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPrivatePicUploadToken('pay_pic')}
                    onDrop={this.onDrop.bind(this, 'pay_pic')}
                    onUpload={this.onUpload.bind(this, 'pay_pic')}>
                    {this.renderImage('pay_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

NewIncomeTransferModal = Form.create()(NewIncomeTransferModal);
export default NewIncomeTransferModal
