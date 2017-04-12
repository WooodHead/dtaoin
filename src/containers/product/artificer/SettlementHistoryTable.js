import {message} from 'antd';

import api from '../../../middleware/api';

import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps);
    }
    if (JSON.stringify(this.props.selectedItem) != JSON.stringify(nextProps.selectedItem)) {
      this.setState({list: [nextProps.selectedItem], total: 1});
    }
  }

  getList(props) {
    this.setState({isFetching: true});
    api.ajax({
      url: props.source,
    }, data => {
      let {list, total} = data.res;
      this.getAccumulatedAmount(list);
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });
    }, (error) => {
      message.error(`获取列表数据失败[${error}]`);
      this.setState({isFetching: false});
    });
  }

  getAccumulatedAmount(list) {
    list.map((item, index) => {
      item.accumulateAmount = 0;
      for (let i = 0; i <= index; i++) {
        item.accumulateAmount += Number(list[i].amount);
        item.accumulateAmount = Number(item.accumulateAmount).toFixed(2);
      }
    });
  }

  render() {
    const columns = [
      {
        title: '结算时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '结算金额',
        className: 'column-money',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '累计金额',
        className: 'column-money',
        dataIndex: 'accumulateAmount',
        key: 'accumulateAmount',
      }];

    return this.renderTable(columns);
  }
}
