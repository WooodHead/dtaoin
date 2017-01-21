import React, {Component} from 'react';
import {Row, Col, Button, Select, message} from 'antd';
import api from '../../../../middleware/api';
import SearchSelectBox from '../../../../components/base/SearchSelectBox';
import TableWithPagination from '../../../../components/base/TableWithPagination';
import {Link} from 'react-router';
import DetailModal from '../DetailModal';
import text from '../../../../config/text';

const Option = Select.Option;
export default class TimecountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      totalPagination: 1,
      page: 1,
      data: [],
      condition: {key: '', type: 1, status: -1},
    };
    [
      'onSearch',
      'handleSelectChange',
      'getList',
      'handleUseStatusChange',
      'onSelectItem',
      'handlePaginationChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList();
  }

  handleSelectChange(value) {
    this.setState({
      condition: Object.assign(this.state.condition, {status: value}),
      page: 1,
    }, () => {
      this.getList();
    });
  }

  handlePaginationChange(page) {
    this.setState({
      page: page,
    }, () => {
      this.getList();
    });
  }

  getList() {
    this.setState({isFetching: true});
    api.ajax({
      url: api.coupon.getCouponList(this.state.condition, this.state.page),
    }, (data) => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        let list = data.res.list ? data.res.list : [];
        this.setState({
          data: list,
          isFetching: false,
          totalPagination: data.res.total,
        });
      }
    });
  }

  onSearch(key, successHandle, failHandle) {
    let {type, status} = this.state.condition;
    let condition = {key, type, status};
    let url = api.coupon.getCouponList(condition);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({data: data.res.list, totalPagination: data.res.total});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  onSelectItem(selectedItem) {
    let data = [];
    data.push(selectedItem);
    this.setState({
      data,
      totalPagination: 1,
    });
  }

  handleUseStatusChange(index, record) {
    let couponItemId = record._id;
    let status = Number(record.status) === 0 ? 1 : 0;
    api.ajax({
      url: api.coupon.updataCouponStatus(),
      type: 'POST',
      data: {coupon_item_id: couponItemId, status: status},
    }, () => {
      this.getList();
    });
  }

  render() {
    let self = this;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '更新日期',
      dataIndex: 'mtime',
      key: 'mtime',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(value, record) {
        return text.useStatus[record.status];
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render(value, record, index) {
        let userStatus = text.useStatus[-(record.status) + 1];
        return (
          <div>
            <Button size="small" onClick={() => self.handleUseStatusChange(index, record)}>
              {userStatus}
            </Button>
            <DetailModal data={record}/>
          </div>
        );
      },
    }];
    return (
      <div>
        <Row className="mb15">
          <Col span={19}>
            <SearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入搜索名称'}
              onSearch={this.onSearch}
              onSelectItem={this.onSelectItem}
              displayPattern={item => item.name + '  ' + item.remark}
            />

            <label span={6} className="margin-right-20 margin-left-60">状态:</label>
            <Select size="large" defaultValue="-1" onSelect={this.handleSelectChange} style={{width: 200}}>
              <Option value="-1">全部</Option>
              <Option value="1">停用</Option>
              <Option value="0">启用</Option>
            </Select>
          </Col>

          <Col span={5}>
            <span className="pull-right">
              <Button type="primary">
                <Link to="/marketing/timecount/createTimecount">创建计次</Link>
              </Button>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={this.state.isFetching}
          columns={columns}
          dataSource={this.state.data}
          total={Number(this.state.totalPagination)}
          currentPage={this.state.page}
          onPageChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
