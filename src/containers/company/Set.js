import React from 'react';
import { Form, Input, Icon, Button, message } from 'antd';

import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

class Set extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      companyDetail: {},
    };

    [
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCompanyDetail();
  }

  handleSubmit() {
    const { companyDetail } = this.state;

    const formData = this.props.form.getFieldsValue();
    formData.company_id = companyDetail._id;
    formData.gross_profit_min_rate = Number(formData.gross_profit_min_rate) / 100;

    formData.hotline_phone = formData.hotline_phone_after;
    if (!!formData.hotline_phone_before) {
      formData.hotline_phone = `${formData.hotline_phone_before  }-${  formData.hotline_phone_after}`;
    }

    api.ajax({
      url: api.company.edit(),
      type: 'POST',
      data: formData,
    }, () => {
      message.success('编辑门店成功');
    });
  }

  getCompanyDetail() {
    api.ajax({
      url: api.company.detail(),
    }, data => {
      const companyDetail = data.res.company;
      const hotlinePhone = companyDetail.hotline_phone;

      let hotlinePhoneArr = [];

      if (hotlinePhone.indexOf('-') > -1) {
        hotlinePhoneArr = hotlinePhone.split('-');
        companyDetail.areaCode = hotlinePhoneArr[0];
        companyDetail.phone = hotlinePhoneArr[1];
      } else {
        companyDetail.areaCode = '';
        companyDetail.phone = hotlinePhone;
      }

      this.setState({ companyDetail });
    });
  }

  render() {
    const { companyDetail } = this.state;

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <h3 className="head-action-bar-line font-size-14 mb20">基础信息</h3>
        <Form>
          <div className="mb10">
            <label className="label label-right ant-form-item-required">门店名称</label>
            <Input size="large" style={{ width: '505px' }} value={companyDetail.name} disabled />
          </div>

          <div className="mb10">
            <label className="label label-right ant-form-item-required">省份</label>
            <Input size="large" style={{ width: '127px' }} value={companyDetail.province}
                   disabled />

            <label className="label ant-form-item-required ml10">城市</label>
            <Input size="large" style={{ width: '127px' }} value={companyDetail.city} disabled />

            <label className="label ant-form-item-required ml10">区县</label>
            <Input size="large" style={{ width: '127px' }} value={companyDetail.country} disabled />
          </div>

          <div className="mb10">
            <label className="label ant-form-item-required label-right">详细地址</label>
            {getFieldDecorator('address', {
              initialValue: companyDetail.address,
            })(
              <Input size="large" style={{ width: '505px' }} />,
            )}
          </div>

          <div className="mb10">
            <label className="label ant-form-item-required label-right">店总负责人</label>
            <Input size="large" style={{ width: '127px' }} value={companyDetail.admin_name}
                   disabled />

            <label className="label ant-form-item-required ml10">手机</label>
            <Input size="large" style={{ width: '127px' }} value={companyDetail.admin_phone}
                   disabled />
          </div>

          <div>
            <label className="label label-right">咨询电话</label>
            {getFieldDecorator('hotline_phone_before', {
              initialValue: companyDetail.areaCode,
            })(
              <Input size="large" placeholder="区号" style={{ width: '80px' }} />,
            )}

            <span className="ml10 mr10">-</span>

            {getFieldDecorator('hotline_phone_after', {
              initialValue: companyDetail.phone,
            })(
              <Input size="large" placeholder="请输入电话号码(区号可留空)" style={{ width: '210px' }} />,
            )}
          </div>

          <h3 className="head-action-bar-line font-size-14 mb20 mt20 ">毛利率设置</h3>
          <span><Icon type="info-circle-o" className="ml20 mr10" />设置最低毛利率用来保障门店基本利润，工单毛利率会在结算后计算，低于最低毛利率时给予异常提醒。</span>

          <div className="mt10">
            <label className="label label-right" style={{ verticalAlign: 'middle' }}>最低毛利率</label>
            {getFieldDecorator('gross_profit_min_rate', {
              initialValue: companyDetail.gross_profit_min_rate &&
              ((Number(companyDetail.gross_profit_min_rate) * 100).toFixed(2)),
            })(
              <Input
                size="large"
                placeholder="请输入最低毛利率"
                style={{ width: '315px' }}
                addonAfter="%"
              />,
            )}
          </div>

          <div className="head-action-bar-line" />
          <Button type="primary" className="mt20 ml20 mb20" onClick={this.handleSubmit}>保存</Button>
        </Form>
      </div>
    );
  }
}

Set = Form.create()(Set);
export default Set;
