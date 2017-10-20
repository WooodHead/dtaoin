import BaseTable from '../../../components/base/BaseTable';

export default class TableActivityStatistics extends BaseTable {
  render() {
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'title',
        key: 'title',
        render: value => value || '--',
      }, {
        title: '优惠券名称',
        dataIndex: 'coupon_item_names',
        key: 'coupon_item_names',
        render: value => value.name || '--',
      }, {
        title: '阅读数',
        dataIndex: 'view_count',
        key: 'view_count',
      }, {
        title: '领取数',
        dataIndex: 'change_count',
        key: 'change_count',
      }, {
        title: '领取率',
        key: 'take-rate',
        render: (value, record) => {
          if (Number(record.change_count) === 0 || Number(record.view_count) === 0) {
            return '0.00%';
          }
          return `${(Number((Number(record.change_count) / Number(record.view_count)).toFixed(4)) *
            100).toFixed(2)}%`;
        },
      }];
    return this.renderTable(columns);
  }
}
