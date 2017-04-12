import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '配件名',
        dataIndex: 'part_name',
        key: 'part_name',
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '类型',
        dataIndex: 'type_desc',
        key: 'type_desc',
      }, {
        title: '单据',
        dataIndex: 'from_type_desc',
        key: 'from_type_desc',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '单价',
        dataIndex: 'unit_price',
        key: 'unit_price',
        className: 'text-right',
      }, {
        title: '账单金额',
        dataIndex: 'total_price',
        key: 'total_price',
        className: 'text-right',
      }, {
        title: '出入库时间',
        dataIndex: 'mtime',
        key: 'mtime',
        className: 'center',
      }];

    return this.renderTable(columns);
  }
}
