import React from 'react';
import {message, Modal, Icon, Row, Col, Button, Input} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import PartSearchBox from '../../../components/search/PartSearchBox';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import api from '../../../middleware/api';

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      parts: new Set(),
      countPartsMap: new Map(),
      selectPartsMap: new Map(),
    };

    [
      'handleCancel',
      'handleSearchSelect',
      'handlePageChange',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleCancel() {
    this.hideModal();
  }

  handleSearchSelect(select) {
    let {parts} = this.state;
    // TODO 从handleSearchSelect中过滤数据
    if (select.data && String(select.data._id) !== '-1') {
      parts.add(select.data);
      this.setState({parts});
    }
  }

  handlePageChange(page) {
    this.setState({page});
  }

  handleDelete(id) {
    let {parts} = this.state;
    parts.forEach(part => {
      if (part._id === id) {
        parts.delete(part);
      }
    });

    this.setState({parts});
  }

  handleInputBlur(id, part, e) {
    let realCount = e.target.value;
    let {countPartsMap, selectPartsMap} = this.state;

    if (countPartsMap.has(id)) {
      let reCount = countPartsMap.get(id);
      reCount.real_amount = realCount;
      countPartsMap.set(id, reCount);
      selectPartsMap.set(id, reCount);
    } else {
      countPartsMap.set(id, {
        _id: 0,
        part_id: id,
        real_amount: realCount,
      });
      selectPartsMap.set(id, {
        _id: 0,
        part_id: id,
        real_amount: realCount,
        auto_part: part,
      });
    }

    this.setState({countPartsMap, selectPartsMap});
  }

  /**
   * 保存信息，同时添加配件到盘点列表
   */
  handleSubmit() {
    let {countPartsMap, selectPartsMap} = this.state;

    let countInPartsArr = [];
    let selectPartsArr = [];
    countPartsMap.forEach(part => {
      countInPartsArr.push(part);
    });
    selectPartsMap.forEach(part => {
      selectPartsArr.push(part);
    });

    api.ajax({
      url: api.warehouse.stocktaking.updateParts(),
      type: 'POST',
      data: {
        stocktaking_id: this.props.stocktakingId,
        items: JSON.stringify(countInPartsArr),
      },
    }, () => {
      message.info('添加成功！');
      this.props.onSave(selectPartsArr);
      this.hideModal();
    });
  }

  render() {
    let {visible, parts, page}=this.state;
    parts = Array.from(parts);

    let self = this;
    let columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '规格',
        className: 'text-right',
        render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      }, {
        title: '实际数量',
        dataIndex: '_id',
        key: 'real_amount',
        className: 'center',
        render: function (id, record) {
          return <Input style={{width: 100}} onBlur={self.handleInputBlur.bind(self, id, record)}/>;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render: function (id) {
          return <a href="javascript:" onClick={self.handleDelete.bind(self, id)}>删除</a>;
        },
      }];

    return (
      <span>
        <Button
          type="ghost"
          onClick={this.showModal}
        >
          添加配件
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 添加配件</span>}
          visible={visible}
          maskClosable={false}
          width={960}
          onCancel={this.handleCancel}
          onOk={this.handleSubmit}
          okText="添加到盘点单"
        >
          <Row type={'flex'} className="mb10">
            <Col span={12}>
              <PartSearchBox
                api={api.warehouse.part.searchByTypeId}
                select={this.handleSearchSelect}
                style={{width: 250}}
              />
            </Col>
          </Row>

          <TableWithPagination
            columns={columns}
            dataSource={parts}
            total={parts.length}
            currentPage={page}
            onPageChange={this.handlePageChange}
            size="small"
          />
        </Modal>
      </span>
    );
  }
}
