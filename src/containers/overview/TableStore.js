import React from 'react';
import {Tag} from 'antd';

import api from '../../middleware/api';

import BaseTable from '../../components/base/BaseTable';
import TableWithPagination from '../../components/widget/TableWithPagination';

import CreateStore from './CreateStore';
import SwitchCompany from '../../containers/company/SwitchCompany';

export default class TableStore extends BaseTable {

  getList(props) {
    this.setState({isFetching: true});

    api.ajax({url: props.source}, data => {
      let {list, total} = data.res;
      //在拿到门店信息后要分别对每个门店请求该门店的销售数据
      let listPromises = list.map(item => {
        return new Promise((resolve, reject) => {
          api.ajax({url: api.overview.statistics.getCompanyMaintainTodaySummary(item._id)}, data => {
            let listStatistics = data.res;
            item.total_fee = listStatistics.maintain_total_incomes.total_fee;
            item.total_profit = listStatistics.maintain_total_incomes.total_profit;
            item.maintain_count = listStatistics.maintain_count.count;
            item.beauty_count = listStatistics.maintain_count.beauty_count;
            item.member_new = listStatistics.member_summary.count;
            resolve(item);
          }, () => {
            reject('0');
          });
        });
      });

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
    let {isFetching, list, total} = this.state;
    //pageSize为5
    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
        pageSize={15}
      />
    );
  }

  render() {
    const columns = [{
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
    }, {
      title: '今日毛利润',
      dataIndex: 'total_profit',
      key: 'total_profit',
    }, {
      title: '今日开单数',
      dataIndex: 'maintain_count',
      key: 'maintain_count',
    }, {
      title: '今日洗车数',
      dataIndex: 'beauty_count',
      key: 'beauty_count',
    }, {
      title: '今日新增会员',
      dataIndex: 'member_new',
      key: 'member_new',
    }, {
      title: '店总负责人',
      dataIndex: 'admin_name',
      key: 'admin_name',
    }, {
      title: '负责人电话',
      dataIndex: 'admin_phone',
      key: 'admin_phone',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center action-three',
      width: '10%',
      render: (id, record) => {
        return (
          <span key={id}>
            <span className={api.isSuperAdministrator() ? '' : 'hide'}>
              <CreateStore size="small" companyInfo={record}/>
              <span className="ant-divider"/>
            </span>
            <SwitchCompany company={record}/>
          </span>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
