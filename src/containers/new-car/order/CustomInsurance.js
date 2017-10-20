import React from 'react';
import { Modal, Icon, Table } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

export default class AuthPay extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  showModal() {
    this.setState({ visible: true });
  }

  handleRowClick(item) {
    const listMap = new Map([...this.props.listMap]);

    if (listMap.has(item._id)) {
      listMap.delete(item._id);
    } else {
      item.is_non_deductible = 0;
      item.amount = 0;
      item.compensation_level = '';
      listMap.set(item._id, item);
    }

    this.props.setInsuranceListMap(listMap);
  }

  getInsuranceConfigShow(insuranceConfigMap, listMap) {
    for (const [key, value] of insuranceConfigMap.entries()) {
      if (listMap.has(key)) {
        const chooseValue = value;
        chooseValue.choose = true;
        insuranceConfigMap.set(key, chooseValue);
      } else {
        const chooseValue = value;
        chooseValue.choose = false;
        insuranceConfigMap.set(key, chooseValue);
      }
    }
  }

  render() {
    const { visible } = this.state;
    const { insuranceConfigMap, listMap } = this.props;

    // 获取当前已经选中的保险项目
    this.getInsuranceConfigShow(insuranceConfigMap, listMap);

    const insuranceConfig = Array.from(insuranceConfigMap.values());

    const columns = [
      {
        title: '序号',
        key: '序号',
        render: (value, record, index) => index + 1,
      }, {
        title: '险种',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '',
        key: '121',
        dataIndex: 'choose',
        className: 'center',
        render: value => value ? <a href="javascript:;"><Icon type="check" /></a> : '',
      }];

    return (
      <span>
        <a href="javascript:;" onClick={this.showModal}>自定义投保</a>

        <Modal
          title={<span><Icon type="plus" /> 添加投保项目</span>}
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <Table
            columns={columns}
            dataSource={insuranceConfig}
            pagination={false}
            rowKey={record => record.name}
            bordered={false}
            onRowClick={this.handleRowClick}
          />
        </Modal>
      </span>
    );
  }
}
