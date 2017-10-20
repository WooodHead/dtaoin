import React from 'react';
import { Modal, DatePicker, Select } from 'antd';

import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';
import formatter from '../../../utils/DateFormatter';

import Table from './TablePerson';

const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;

export default class EditItem extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      month: props.month,
      visible: false,
      userId: props.detail.user_id,
      totalAmount: '0',
      type: '-1',
    };

    [
      'handleMonthChange',
      'handleTotalAmountChange',
      'handleTypeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleMonthChange(value) {
    this.setState({ month: formatter.month(value) });
  }

  handleTotalAmountChange(totalAmount) {
    this.setState({ totalAmount });
  }

  handleTypeChange(value) {
    this.setState({ type: value });
  }

  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  render() {
    const { month, page, totalAmount } = this.state;
    const { detail } = this.props;
    return (
      <span>
        <a href="javascript:;" onClick={this.showModal}>查看详情</a>

        <Modal
          title={`${detail.user_info.name}--月提成详情`}
          visible={this.state.visible}
          width={960}
          onCancel={this.hideModal}
          footer={null}
        >

          <label className="label">发放月份</label>
          <MonthPicker
            disabledDate={this.disabledDate}
            size="large"
            defaultValue={formatter.getMomentMonth(new Date(month))}
            onChange={this.handleMonthChange}
          />

          <label className="label ml20">当月提成总额(元)</label>
          <span className="font-size-14">{Number(totalAmount).toFixed(2)}</span>

          <label className="label ml20">提成类型</label>
          <Select
            defaultValue="-1"
            style={{ width: 164 }}
            onChange={this.handleTypeChange}
            size="large"
          >
            <Option value="-1">全部</Option>
            <Option value="1">项目销售</Option>
            <Option value="2">项目施工</Option>
            <Option value="3">套餐卡销售</Option>
            <Option value="4">领券活动阅读</Option>
            <Option value="5">领券活动核销</Option>
            <Option value="6">助力砍价阅读</Option>
            <Option value="7">助力砍价核销</Option>
          </Select>
          <div className="mt20">
            <Table
              source={api.user.getUserMeritPayItem(this.state)}
              page={page}
              updateState={this.updateState}
              month={month}
              onTotalAmount={this.handleTotalAmountChange}
            />
          </div>
        </Modal>
      </span>
    );
  }
}
