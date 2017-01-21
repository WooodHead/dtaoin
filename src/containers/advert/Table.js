import React, {Component} from 'react';
import {Row, Col, message} from 'antd';
import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import TableWithPagination from '../../components/base/TableWithPagination';

import NewAdvert from './New';
import EditAdvert from './Edit';
import OfflineAdvert from './Offline';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  offline(id) {
    api.ajax({
      url: api.advert.offline(),
      type: 'POST',
      data: {advert_id: id},
    }, (data => {
      if (data.code === 0) {
        message.success('广告下线成功');
        this.refreshData();
      } else {
        message.error('广告下线失败');
      }
    }));
  }

  refreshData() {
    this.getListData(this.props);
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    }.bind(this));
  }

  render() {
    let {list, total} = this.state;

    const columns = [{
      title: '上线时间',
      dataIndex: 'online_time',
      key: 'online_time',
    }, {
      title: '下线时间',
      dataIndex: 'offline_time',
      key: 'offline_time',
    }, {
      title: '位置',
      dataIndex: 'order',
      key: 'order',
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      render (value) {
        let sub = value.substring(0, 100);
        if (value.length > 100) {
          sub += '...';
        }
        return (
          <span>
            <a href={value} title={value} target="_blank">{sub}</a>
          </span>
        );
      },
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (value, record) {
        return (
          <span>
            <EditAdvert advert={record}/>
            <OfflineAdvert
              id={value}
              disabled={record.status !== '0' || record.offline_time <= formatter.date(new Date())}
            />
          </span>
        );
      },
    }];

    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <span className="pull-right">
              <NewAdvert onSuccess={this.refreshData.bind(this)}/>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={this.props.currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}