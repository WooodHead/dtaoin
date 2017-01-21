import React, {Component} from 'react';
import {Row, Col} from 'antd';

import TableWithPagination from '../../../components/base/TableWithPagination';
import PartBasicInfo from '../../../components/boards/aftersales/PartBasicInfo';
import StockPartModal from './StockPartModal';

import api from '../../../middleware/api';

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.location.query.id,
      detail: {},
      list: [],
      page: 1,
      total: 0,
    };
  }

  componentDidMount() {
    let {id, page} = this.state;
    this.getPartDetail(id);
    this.getPartEntryList(id, page);
  }

  handlePageChange(page) {
    this.setState({page});
    this.getPartEntryList(this.state.id, page);
  }

  getPartDetail(id) {
    api.ajax({url: api.getPartsDetail(id)}, function (data) {
      this.setState({detail: data.res.detail});
    }.bind(this));
  }

  getPartEntryList(id, page) {
    api.ajax({url: api.getPartsEntryList(id, page)}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    }.bind(this));
  }

  render() {
    let {detail, list, total, page}=this.state;

    const columns = [
      {
        title: '单号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '单据',
        dataIndex: 'action_type',
        key: 'action_type',
      }, {
        title: '类型',
        dataIndex: 'entry_type',
        key: 'entry_type',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '单价',
        dataIndex: 'in_price',
        key: 'in_price',
      }, {
        title: '金额',
        dataIndex: 'total',
        key: 'total',
        render(value, record) {
          return parseFloat(record.in_price) * parseInt(record.amount);
        },
      }, {
        title: '出入库日期',
        dataIndex: 'ctime',
        key: 'ctime',
      },
    ];

    return (
      <div>
        <PartBasicInfo detail={detail}/>

        <Row className="mt15 mb10">
          <Col span={12}>
            <h3>进货信息</h3>
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <StockPartModal
                isNew={false}
                part={detail}
              />
            </div>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
