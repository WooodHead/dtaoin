import React from 'react';
import {Select, Row, Col, DatePicker} from 'antd';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import BaseList from '../../../components/base/BaseList';
import NewIncomeTransferModal from '../../../components/modals/finance/NewIncomeTransferModal';
import IncomeTransferTable from './IncomeTransferTable';

const Option = Select.Option;

export default class IncomeTransferList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      end_date: '',
      company_id: '',
      company_data: [],
    };
    [
      'handleTimeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCompanyList();
  }

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.company_data;
    this.setState({value: option.props.children, company_id: list[index]._id, page: 1});
  }

  handleChange(value) {
    if (!value) {
      this.setState({company_id: '', page: 1});
    }
  }

  handleTimeChange(value, dateString) {
    this.setState({
      end_date: dateString,
      page: 1,
    });
  }

  getCompanyList() {
    api.ajax({url: api.company.list()}, (data) => {
      let list = data.res.company_list;
      if (list.length > 0) {
        this.setState({company_data: list});
      } else {
        this.setState({company_data: []});
      }
    });
  }

  render() {
    return (
      <div>
        <Row className="mb15">
          <Col span={18}>
            <label className="margin-right-20">结算时间:</label>
            <DatePicker
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate()}
              onChange={this.handleTimeChange.bind(this)}
            />

            <label span={6} className="ml15 mr5">门店筛选:</label>
            <Select
              span={14}
              style={{width: 300}}
              placeholder="请选择公司"
              allowClear
              size="large"
              onSelect={this.handleSelect.bind(this)}
              onChange={this.handleChange.bind(this)}>
              {this.state.company_data.map((item, index) =>
                <Option key={index} value={item._id}>{item.name}</Option>)
              }
            </Select>
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
          source={api.getIncomeTransferList(this.state)}
        />
      </div>
    );
  }
}
