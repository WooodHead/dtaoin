import React from 'react';
import {message, Popconfirm} from 'antd';

import ConsumpMaterialModal from './New';

import BaseTable from '../../../components/base/BaseTable';

import api from '../../../middleware/api';

export default class Table extends BaseTable {

  componentWillReceiveProps(nextProps) {
    //有问题，因为在list页面要主动刷新数据，而且要求刷新的时候source不变，这快暂时不判断请求数据
    /*if (this.props.source != nextProps.source) {
     this.getList(nextProps.source);
     }*/
    if (JSON.stringify(this.props.selectedItem) != JSON.stringify(nextProps.selectedItem)) {
      this.setState({list: [nextProps.selectedItem], total: 1});
    } else {
      this.getList(nextProps);
    }
  }

  handleDeleteConsumable(_id) {
    api.ajax({url: api.aftersales.deleteConsumable(), type: 'POST', data: {consumable_id: _id}}, function () {
      message.success('取消成功');
      this.props.onSuccess();
      this.props.onSuccess();
    }.bind(this));
  }

  render() {
    let self = this;
    const columns = [
      {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '配件名',
        dataIndex: 'part_names',
        key: 'part_names',
        render: value => value.substr(0, value.length - 1),
      }, {
        title: '领用人',
        dataIndex: 'take_user_name',
        key: 'take_user_name',
        className: 'center',
      }, {
        title: '审核人',
        dataIndex: 'authorize_user_name',
        key: 'authorize_user_name',
        className: 'center',
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
      }, {
        title: '领用时间',
        dataIndex: 'take_time',
        key: 'take_time',
        className: 'center',
        render: value => value.charAt(0) == '0' ? <span>{'--'}</span> : value,
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '8%',
        className: 'center',
        render: (value, record) => {
          if (Number(record.status) === 0) {
            return (
              <div>
                <Popconfirm
                  title="确定取消吗?"
                  onConfirm={() => self.handleDeleteConsumable(record._id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:;" size="small">取消</a>
                </Popconfirm>
                <span className="ant-divider"/>
                <ConsumpMaterialModal getList={self.getList} consumableId={record._id} type={'edit'} size="small"/>
              </div>
            );
          } else {
            return <ConsumpMaterialModal getList={self.getList} consumableId={record._id} type={'see'} size="small"/>;
          }
        },
      }];
    return this.renderTable(columns);
  }
}
