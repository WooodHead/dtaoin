import React, {Component} from 'react'
import {Row, Col, Button, Table, Icon} from 'antd'
import BasePrint from '../../base/BasePrint'
import DetailModal from '../../../containers/aftersales/customer/MaintenanceDetailModalAndEdit'

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
      render(value, record) {
        return value
      }
    }, {
      title: '里程数(公里)',
      dataIndex: 'mileage',
      key: 'mileage',
      width: '16%',
    }, {
      title: '维修项目',
      dataIndex: 'item_names',
      key: 'item_names',
      width: '16%',
    }, {
      title: '实收金额',
      dataIndex: 'total_fee',
      key: 'total_fee',
      width: '16%',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '16%',
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      width: '16%',
      render(value, record, index) {
        return (
          <div>
            <DetailModal
              detail={detail[index]}
            />
          </div>
        )
      }
    }];

    return (
      <div className="margin-bottom-20 margin-top-20">
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          size='small'
        />
      </div>
    );
  }
}

