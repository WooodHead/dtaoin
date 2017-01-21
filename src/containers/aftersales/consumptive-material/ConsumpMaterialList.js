import React, {Component} from 'react';
import {Row, Col, Popconfirm, Select, DatePicker, message} from 'antd';
import api from '../../../middleware/api';
import TableWithPagination from '../../../components/base/TableWithPagination';
import SearchSelectBox from '../../../components/base/SearchSelectBox';
import ConsumpMaterialModal from './ConsumpMaterialModal';
import formatter from '../../../utils/DateFormatter';


const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
export default class ConsumptiveMaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      total: 1,
      page: 1,
      status: '-2',
      startTime: '',
      endTime: '',
    };
    [
      'handleDateRangeChange',
      'getList',
      'handleStatusSelectChange',
      'handlePaginationChange',
      'onSearch',
      'onSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList();
  }

  handlePaginationChange(page) {
    this.setState({
      page,
    }, () => {
      this.getList();
    });
  }

  handleDateRangeChange(momentTime, stringTime) {
    let startTime = stringTime[0];
    let endTime = stringTime[1];
    this.setState({
      startTime,
      endTime,
      page: 1,
    }, () => {
      this.getList();
    });
  }

  handleStatusSelectChange(value) {
    let now = new Date();
    let startTime = '';
    let endTime = '';
    if (Number(value) === 1) {
      startTime = formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10));
      endTime = formatter.day(now);
    }
    this.setState({
      status: value,
      page: 1,
      startTime,
      endTime,
    }, () => {
      this.getList();
    });
  }

  handleDeleteConsumable(_id) {
    api.ajax({url: api.statistics.deleteConsumable(), type: 'POST', data: {consumable_id: _id}}, function () {
      message.success('取消成功');
      this.getList();
    }.bind(this));
  }

  onSearch(key, successHandle, failHandle) {
    let url = api.statistics.getConsumableList(key, this.state.page, this.state.startTime, this.state.endTime, this.state.status);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        let {list, total} = data.res;
        this.setState({list, total: parseInt(total)});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, () => {
    });
  }

  onSelectItem(selectInfo) {
    let list = [];
    list.push(selectInfo);
    this.setState({list, total: 1});
  }

  getList(key = '') {
    this.setState({
      isFetching: true,
    });
    api.ajax({url: api.statistics.getConsumableList(key, this.state.page, this.state.startTime, this.state.endTime, this.state.status)}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }


  render() {
    let {page, startTime, endTime, isFetching} = this.state;
    let self = this;
    const columns = [{
      title: '开单时间',
      dataIndex: 'ctime',
      key: 'ctime',
    }, {
      title: '配件名',
      dataIndex: 'part_names',
      key: 'part_names',
    }, {
      title: '领用人',
      dataIndex: 'take_user_name',
      key: 'take_user_name',
    }, {
      title: '审核人',
      dataIndex: 'authorize_user_name',
      key: 'authorize_user_name',
    }, {
      title: '状态',
      dataIndex: 'status_name',
      key: 'status_name',
    }, {
      title: '领用时间',
      dataIndex: 'take_time',
      key: 'take_time',
      render(value) {
        if (value.charAt(0) == '0') {
          return <span className="margin-left-50">{'---'}</span>;
        }
        return value;
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      width: '8%',
      render(value, record) {
        if (Number(record.status) === 0) {
          return (
            <div>
              <Popconfirm title="确定取消吗?" onConfirm={() => self.handleDeleteConsumable(record._id)} okText="确定" cancelText="取消">
                <a href="javascript:void(0)" size="small" className="margin-right-10 pull-left">取消</a>
              </Popconfirm>
              <ConsumpMaterialModal consumableId={record._id} type={'edit'}/>
            </div>
          );
        } else {
          return <ConsumpMaterialModal consumableId={record._id} type={'see'}/>;
        }
      },
    }];

    return (
      <div>
        <Row className="mb15">
          <Col span={22}>
            <SearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入搜索名称'}
              onSearch={this.onSearch}
              displayPattern={item => item.part_names}
              onSelectItem={this.onSelectItem}
            />

            <label className="margin-right-20 margin-left-60">状态:</label>
            <Select size="large" defaultValue="-2" onSelect={this.handleStatusSelectChange} style={{width: 200}}>
              <Option value="-2">全部</Option>
              <Option value="-1">已取消</Option>
              <Option value="0">待审核</Option>
              <Option value="1">已领用</Option>
            </Select>

            <span className={Number(this.state.status) === 1 ? '' : 'hide'}>
              <label className="margin-right-20 margin-left-60">领用日期:</label>
              <RangePicker
                format={formatter.pattern.day}
                value={[formatter.getMomentDate(startTime), formatter.getMomentDate(endTime)]}
                onChange={this.handleDateRangeChange}
              />
            </span>

          </Col>
          <Col span={2}>
            <div className="pull-right">
              <ConsumpMaterialModal />
            </div>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          total={this.state.total}
          currentPage={page}
          onPageChange={this.handlePaginationChange}
          dataSource={this.state.list}
        />

      </div>
    );
  }
}
