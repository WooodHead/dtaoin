import React from 'react';
import { Tag } from 'antd';

import api from '../../middleware/api';

import BaseTable from '../../components/base/BaseTable';
import TableWithPagination from '../../components/widget/TableWithPagination';

import CreateStore from './CreateStore';
import SwitchCompany from '../../containers/company/SwitchCompany';

export default class
TableStore extends BaseTable {

  getList(props) {
    this.setState({ isFetching: true });

    api.ajax({ url: props.source }, data => {
      const { list, total } = data.res;
      // 在拿到门店信息后要分别对每个门店请求该门店的销售数据
      const listPromises = list.map(item => new Promise((resolve, reject) => {
        api.ajax({ url: api.overview.statistics.getCompanyMaintainTodaySummary(item._id) }, data => {
          const listStatistics = data.res;
          item.total_fee = listStatistics.maintain_total_incomes.total_fee;
          item.total_profit = listStatistics.maintain_total_incomes.total_profit;
          item.maintain_count = listStatistics.maintain_count.count;
          item.beauty_count = listStatistics.maintain_count.beauty_count;
          item.member_new = listStatistics.member_summary.count;
          resolve(item);
        }, () => {
          reject('0');
        });
      }));

      Promise.all(listPromises).then(() => {
        this.setState({
          isFetching: false,
          list,
          total: parseInt(total),
        });
      });
    });
  }

  renderTable(columns) {
    const { isFetching, list, total } = this.state;
    // pageSize为5
    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
        pageSize={15}
        scroll={{ x: 1050 }}
      />
    );
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'name',
        key: 'name',
        render: (value, record) => {
          if (Number(record.cooperation_type) === 1) {
            return (
              <div>
                {value}
                <Tag className="ml10">FC</Tag>
              </div>
            );
          } else if (Number(record.cooperation_type) === 2) {
            return (
              <div>
                {value}
                <Tag className="ml10">MC</Tag>
              </div>
            );
          } else if (Number(record.cooperation_type) === 3) {
            return (
              <div>
                {value}
                <Tag color="orange-inverse" className="ml10">AP</Tag>
              </div>
            );
          } else if (Number(record.cooperation_type) === 4) {
            return (
              <div>
                {value}
                <Tag color="green-inverse" className="ml10">TP</Tag>
              </div>
            );
          } else {
            return value;
          }
        },
      }, {
        title: '今日营业额',
        dataIndex: 'total_fee',
        key: 'total_fee',
        width: '90px',
      }, {
        title: '今日毛利润',
        dataIndex: 'total_profit',
        key: 'total_profit',
        width: '90px',
      }, {
        title: '今日开单数',
        dataIndex: 'maintain_count',
        key: 'maintain_count',
        width: '90px',
      }, {
        title: '今日洗车数',
        dataIndex: 'beauty_count',
        key: 'beauty_count',
        width: '90px',
      }, {
        title: '今日新增套餐卡',
        dataIndex: 'member_new',
        key: 'member_new',
        width: '120px',
      }, {
        title: '店总负责人',
        dataIndex: 'admin_name',
        key: 'admin_name',
        width: '110px',
      }, {
        title: '负责人电话',
        dataIndex: 'admin_phone',
        key: 'admin_phone',
        width: '110px',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '120px',
        fixed: 'right',
        render: (id, record) => (
            <span key={id}>
            <span className={api.isSuperAdministrator() ? '' : 'hide'}>
              <CreateStore size="small" companyInfo={record} onSuccess={self.props.onSuccess} />
              <span className="ant-divider" />
            </span>
            <SwitchCompany company={record} />
          </span>
          ),
      }];

    return this.renderTable(columns);
  }
}
