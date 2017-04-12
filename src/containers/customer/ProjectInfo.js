import React from 'react';
import {Link} from 'react-router';
import {Table, Button, Modal} from 'antd';

import BaseModal from '../../components/base/BaseModal';

import text from '../../config/text';

export default class MaintProjectInfo extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      operation_record_pic: '',
      visible: false,
    };
  }

  render() {
    let {detail} = this.props;
    let {visible} = this.state;
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
      width: '15%',
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
      width: '10%',
      render(value) {
        return text.maintenanceCar[value];
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      width: '10%',
      className: 'center',
      render(value, record) {
        return (
          <div>
            <Link
              to={{
                pathname: '/aftersales/project/new',
                query: {customer_id: record.customer_id, id: record._id},
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
      <div>
        <Button
          type="dash"
          onClick={this.showModal}
        >
          维保记录
        </Button>

        <Modal
          visible={visible}
          title="维保信息"
          onCancel={this.hideModal}
          footer={null}
          width="720px"
        >
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            size="middle"
            rowKey={record => record._id}
          />
        </Modal>
      </div>

    );
  }
}

