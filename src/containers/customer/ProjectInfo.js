import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Badge, Tooltip } from 'antd';

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
    const { detail } = this.props;
    const { visible } = this.state;
    const dataSource = detail;

    const columns = [
      {
        title: '维修项目',
        dataIndex: 'item_names',
        key: 'item_names',
      }, {
        title: '工人',
        dataIndex: 'fitter_user_names',
        key: 'fitter_user_names',
        width: '135px',
      }, {
        title: '金额',
        dataIndex: 'total_fee',
        key: 'total_fee',
        className: 'column-money',
        width: '85px',
      }, {
        title: '里程数',
        dataIndex: 'mileage',
        key: 'mileage',
        className: 'text-right',
        width: '85px',
      }, {
        title: '进厂时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '160px',
        render(value) {
          return value;
        },
      }, {
        title: '业务状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '80px',
        render(value) {
          const statusValue = String(value);
          let statusLabel = 'default';

          if (statusValue === '0') {
            statusLabel = 'processing';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }

          return <Badge status={statusLabel} text={text.project.status[value]} />;
        },
      }, {
        title: '结算状态',
        dataIndex: 'pay_status',
        key: 'pay_status',
        className: 'center',
        width: '80px',
        render(value, record) {
          const status = String(record.status);
          const payStatus = String(value);
          const payStatusLabel = text.project.payStatus[value];

          let statusLabel = 'default';

          if (status === '0' || status === '-1') {
            return '--';
          }

          if (payStatus === '1') {
            statusLabel = 'processing';
          } else if (payStatus === '2') {
            statusLabel = 'success';
          }
          return <Badge status={statusLabel} text={payStatusLabel} />;
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '74px',
        className: 'center',
        render(value, record) {
          return (
            <div>
              <Link
                to={{ pathname: `/aftersales/project/edit/${record._id}` }} target="_blank">
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
          width="960px"
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

