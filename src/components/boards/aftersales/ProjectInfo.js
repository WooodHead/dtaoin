import React from 'react';
import {Link} from 'react-router';
import {Table} from 'antd';
import BasePrint from '../../base/BasePrint';
import text from '../../../config/text';

export default class MaintProjectInfo extends BasePrint {
  constructor(props) {
    super(props);
    this.state = {
      operation_record_pic: '',
    };
  }

  render() {
    let {detail} = this.props;
    let dataSource = detail;

    const columns = [{
      title: '创建时间',
      dataIndex: 'ctime',
      key: 'ctime',
      width: '16%',
      render(value) {
        return value;
      },
    }, {
      title: '维修项目',
      dataIndex: 'item_names',
      key: 'item_names',
      width: '25%',
    }, {
      title: '实收金额',
      dataIndex: 'total_fee',
      key: 'total_fee',
      className: 'column-money',
      width: '7%',
    }, {
      title: '里程数(公里)',
      dataIndex: 'mileage',
      key: 'mileage',
      className: 'center',
      width: '16%',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      className: 'center',
      width: '16%',
      render(value) {
        return text.maintenanceCar[value];
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      width: '16%',
      className: 'center',
      render(value, record) {
        return (
          <div>
            <Link
              to={{
                pathname: '/aftersales/project/create/',
                query: {customer_id: record.customer_id, maintain_intention_id: record._id},
              }}
              target="_blank"
            >
              {Number(record.status || 0) >= 3 ? '详情' : '编辑'}
            </Link>
          </div>
        );
      },
    }];

    return (
      <div className="margin-bottom-20 margin-top-20">
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          size="middle"
          rowKey={record => record._id}
        />
      </div>
    );
  }
}

