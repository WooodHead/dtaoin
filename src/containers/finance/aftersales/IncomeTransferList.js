import React from 'react';
import { Row, Col, DatePicker } from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

import NewIncomeTransferModal from './NewIncomeTransfer';
import IncomeTransferTable from './IncomeTransferTable';

export default class IncomeTransferList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      end_date: '',
      company_id: '',
      company_data: [],
    };
    [
      'handleTimeChange',
      'handleSearch',
      'handleSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleTimeChange(value, dateString) {
    this.setState({
      end_date: dateString,
      page: 1,
    });
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
    this.setState({ value: selectInfo.name, company_id: selectInfo._id, page: 1 });
  };

  render() {
    return (
      <div>
        <Row className="mb15">
          <Col span={18}>
            <SearchSelectBox
              style={{ float: 'left', width: '250px' }}
              placeholder={'请输入门店名称'}
              onSearch={this.handleSearch}
              displayPattern={item => item.name}
              onSelectItem={this.handleSelectItem}
            />

            <span className="pull-left ml20">
              <label className="mr20">结算时间:</label>
              <DatePicker
                format={formatter.pattern.day}
                defaultValue={formatter.getMomentDate()}
                onChange={this.handleTimeChange.bind(this)}
                allowClear={false}
              />
            </span>
          </Col>

          <Col span={6}>
            <span className="pull-right">
              <NewIncomeTransferModal company_data={this.state.company_data}/>
            </span>
          </Col>
        </Row>

        <IncomeTransferTable
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.finance.getIncomeTransferList(this.state)}
        />
      </div>
    );
  }
}
