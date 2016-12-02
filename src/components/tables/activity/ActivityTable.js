import React, {Component, PropTypes} from 'react'
import {Table, Row, Col, Button, message} from 'antd'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import TableWithPagination from '../../base/TableWithPagination'

import NewActivity from '../../modals/activity/NewActivity'
import EditActivity from '../../modals/activity/EditActivity'
import OfflineActivity from '../../modals/activity/OfflineActivity'

export default class ActivityTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  componentWillMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  offline(id) {
    api.ajax({
      url: api.activity.offline(),
      type: 'POST',
      data: {activity_id: id}
    }, (data => {
      if (data.code === 0) {
        message.success('活动下线成功');
        this.refreshData();
      } else {
        message.error('活动下线失败');
      }
    }))
  }

  refreshData() {
    this.getListData(this.props);
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({tableData: data.res.list});
    }.bind(this));
  }

  render() {
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
      title: '标题',
      dataIndex: 'name',
      key: 'name',
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
        )
      }
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (value, record) {
        let that = this;
        return (
          <span>
            <EditActivity activity={record}/>
            <OfflineActivity
              id={value}
              disabled={record.status !== '0' || record.offline_time <= formatter.date(new Date())}
            />
          </span>
        )
      }
    }];

    return (
      <div>
        <Row>
          <Col span="12"></Col>
          <Col span="12">
            <span className="pull-right mb10">
              <NewActivity onSuccess={this.refreshData.bind(this)}/>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.tableData}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
