import React from 'react';
import { Modal, Icon, Button, Form, Input, Row, Col, message, DatePicker } from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import Qiniu from '../../../components/widget/UploadQiniu';

import BaseModal from '../../../components/base/BaseModalWithUpload';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

const FormItem = Form.Item;

class NewIncomeTransferModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      company_data: this.props.company_data ? this.props.company_data : [],
      company: {},
      company_id: '',
      end_date: formatter.getMomentDate(),
      amount: 0.00,
      ids: '',
      pay_pic_key: '',
      pay_pic_files: [],
      pay_pic_progress: {},
    };
    [
      'handleSearch',
      'handleSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  genUntransferIncome(company_id, end_date) {
    if (!company_id) {
      message.warning('请选择公司');
      return;
    }
    api.ajax({
      url: api.finance.genIncomeUntransfer(company_id, end_date),
      type: 'GET',
    }, data => {
      this.setState({ amount: data.res.amount, ids: data.res.ids });
    });
  }

  handleCompanySelect(value, option) {
    const index = option.props.index;
    const list = this.state.company_data;
    this.setState({ value: option.props.children, company_id: list[index]._id, company: list[index] });
    this.genUntransferIncome(list[index]._id, this.state.end_date);
  }

  handleSearch(key, successHandle, failHandle) {
    api.ajax({ url: api.company.keyList(key) }, data => {
      if (data.code === 0) {
        this.setState({ company_data: data.res.list });
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, () => {
    });
  }

  handleSelectItem = function (selectInfo) {
    this.setState({ value: selectInfo.name, company_id: selectInfo._id, company: selectInfo });
    this.props.form.setFieldsValue({ company_id: selectInfo._id });
    this.genUntransferIncome(selectInfo._id, this.state.end_date);
  };

  handleChangeTime(value, dateString) {
    this.setState({
      end_date: dateString,
    });
    this.genUntransferIncome(this.state.company_id, dateString);
  }

  handleSubmit() {
    const formData = this.props.form.getFieldsValue();
    if (!formData.amount || !formData.pay_pic) {
      message.warning('请转账后再提交');
      return;
    }

    formData.end_date = formatter.day(formData.end_date);

    api.ajax({
      url: api.finance.setIncomeTransfered(),
      type: 'POST',
      data: formData,
    }, data => {
      if (data.code === 0) {
        message.info('转账信息提交成功！');
        this.hideModal();
        location.reload();
      }
    });
  }

  render() {
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { company } = this.state;

    return (
      <span>
        <Button
          type="primary"
          className="ml20"
          onClick={this.showModal}
        >
          计算金额
        </Button>
        <Modal
          title={<span><Icon type="plus" className="mr10"/>计算金额</span>}
          visible={visible}
          width="880px"
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('company_id')(
              <Input className="hide"/>
            )}

            <FormItem label="门店选择" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} required>
              <SearchSelectBox
                style={{ float: 'left', width: '283px' }}
                placeholder={'请输入门店名称'}
                onSearch={this.handleSearch}
                displayPattern={item => item.name}
                onSelectItem={this.handleSelectItem}
              />
            </FormItem>

            <Row type="flex">
              <Col span={12}>
                <FormItem label="账户名" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} required>
                  {getFieldDecorator('bank_account_name', { initialValue: company.bank_account_name })(
                    <Input disabled/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="收款账号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('bank_account_number', { initialValue: company.bank_account_number })(
                    <Input disabled/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <FormItem label="开户银行" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('bank_name', { initialValue: company.bank_name })(
                <Input disabled/>
              )}
            </FormItem>

            <Row type="flex">
              <Col span={12}>
                <FormItem label="结算时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} required>
                  {getFieldDecorator('end_date', { initialValue: this.state.end_date })(
                    <Input type="hidden"/>
                  )}
                  <DatePicker
                    format={formatter.pattern.day}
                    defaultValue={formatter.getMomentDate(this.state.end_date)}
                    onChange={this.handleChangeTime.bind(this)}
                    allowClear={false}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="待支付金额" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('amount', { initialValue: this.state.amount })(
                    <Input type="hidden"/>
                  )}
                  {getFieldDecorator('ids', { initialValue: this.state.ids })(
                    <Input type="hidden"/>
                  )}
                  <span>{Number(this.state.amount).toFixed(2)}元</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={12}>
                <FormItem label="电子回单" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} required>
                  {getFieldDecorator('pay_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="pay_pic"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPrivatePicUploadToken('pay_pic')}
                    onDrop={this.onDrop.bind(this, 'pay_pic')}
                    onUpload={this.onUpload.bind(this, 'pay_pic')}
                  >
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
export default NewIncomeTransferModal;
