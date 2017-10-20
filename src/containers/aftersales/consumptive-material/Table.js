import React from 'react';
import { message, Popconfirm } from 'antd';

import ConsumpMaterialModal from './New';

import BaseTable from '../../../components/base/BaseTable';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

export default class Table extends BaseTable {

  componentWillReceiveProps(nextProps) {
    // 有问题，因为在list页面要主动刷新数据，而且要求刷新的时候source不变，这快暂时不判断请求数据
    /* if (this.props.source != nextProps.source) {
     this.getList(nextProps.source);
     }*/
    this.getList(nextProps);
  }

  handleDeleteConsumable(_id) {
    api.ajax({
      url: api.aftersales.deleteConsumable(),
      type: 'POST',
      data: { consumable_id: _id },
    }, () => {
      message.success('取消成功');
      this.props.onSuccess();
      this.props.onSuccess();
    });
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        className: 'center',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '配件名',
        dataIndex: 'part_names',
        key: 'part_names',
        render: value => value.substr(0, value.length - 1),
      }, {
        title: '领用人',
        dataIndex: 'take_user_name',
        key: 'take_user_name',
        width: '75px',
      }, {
        title: '审核人',
        dataIndex: 'authorize_user_name',
        key: 'authorize_user_name',
        className: 'center',
        width: '75px',
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        width: '80px',
      }, {
        title: '领用时间',
        dataIndex: 'take_time',
        key: 'take_time',
        className: 'center',
        width: '130px',
        render: value => String(value.charAt(0)) === '0' ? <span>{'--'}</span> : DateFormatter.getFormatTime(value),
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '94px',
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
                <span className="ant-divider" />
                <ConsumpMaterialModal
                  getList={() => self.props.updateState({ reload: true })}
                  consumableId={record._id}
                  type={'edit'}
                  size="small"
                />
              </div>
            );
          } else {
            return (
              <ConsumpMaterialModal
                getList={() => self.props.updateState({ reload: true })}
                consumableId={record._id}
                type={'see'}
                size="small"
              />
            );
          }
        },
      }];
    return this.renderTable(columns);
  }
}
