import React, {Component} from 'react';

import TableWithPagination from '../../../components/widget/TableWithPagination';
import PartBasicInfo from './BasicInfo';

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
    this.getStockLogs(id, page);
  }

  handlePageChange(page) {
    this.setState({page});
    this.getStockLogs(this.state.id, page);
  }

  getPartDetail(id) {
    api.ajax({url: api.warehouse.part.detail(id)}, (data) => {
      this.setState({detail: data.res.detail});
    });
  }

  getStockLogs(id, page) {
    api.ajax({url: api.warehouse.part.stockLogs(id, page)}, (data) => {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    });
  }

  render() {
    let {detail, list, total, page}=this.state;

    const columns = [
      {
        title: '单据',
        dataIndex: 'from_type_desc',
        key: 'from_type_desc',
      }, {
        title: '类型',
        dataIndex: 'type_desc',
        key: 'type_desc',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '单价',
        dataIndex: 'unit_price',
        key: 'unit_price',
        className: 'text-right',
      }, {
        title: '金额',
        dataIndex: 'total_price',
        key: 'total_price',
        className: 'text-right',
      }, {
        title: '出入库时间',
        dataIndex: 'mtime',
        key: 'mtime',
        className: 'center',
      },
    ];

    return (
      <div>
        <PartBasicInfo detail={detail}/>

        <h3 className="mt15 mb10">出入库记录</h3>

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
