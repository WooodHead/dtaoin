import React from 'react';
import { message, Modal, Icon, Row, Col, Button, Input } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import api from '../../../middleware/api';

const Search = Input.Search;

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
      'handlePartsSearch',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chooseParts) {
      this.handleSearchSelect(nextProps.chooseParts);
    }
    if (nextProps.partsAll) {
      this.setState({ partsAll: nextProps.partsAll });
    }
  }

  handleCancel() {
    this.hideModal();
    this.props.showPartsInfo({});
  }

  handleSearchSelect(select) {
    const { parts, partsAll } = this.state;

    for (const item of partsAll) {
      if (String(item.part_id) === String(select._id)) {
        message.error('这个配件已经在盘点中！');
        return false;
      }
    }

    // TODO 从handleSearchSelect中过滤数据
    if (select && String(select._id) !== '-1') {
      parts.add(select);
      this.setState({ parts });
    }
  }

  handlePageChange(page) {
    this.setState({ page });
  }

  handleDelete(id) {
    const { parts, countPartsMap, selectPartsMap } = this.state;
    parts.forEach(part => {
      if (part._id === id) {
        parts.delete(part);
      }
    });

    countPartsMap.delete(id);
    selectPartsMap.delete(id);

    this.setState({ parts });
  }

  handleInputBlur(id, part, e) {
    const realCount = e.target.value;
    const { countPartsMap, selectPartsMap } = this.state;

    if (countPartsMap.has(id)) {
      const reCount = countPartsMap.get(id);
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

    this.setState({ countPartsMap, selectPartsMap });
  }

  handlePartsSearch(e) {
    const coordinate = api.getPosition(e);
    const key = e.target.value;
    if (key.length >= 1) {
      api.ajax({ url: api.warehouse.part.list({ key }) }, data => {
        const list = data.res.list;
        const partsInfo = {};
        partsInfo.info = list;
        partsInfo.coordinate = coordinate;
        partsInfo.visible = true;
        partsInfo.keyword = key;
        this.props.showPartsInfo(partsInfo);
      });
    }
  }

  /**
   * 保存信息，同时添加配件到盘点列表
   */
  handleSubmit() {
    const { countPartsMap, selectPartsMap } = this.state;

    const countInPartsArr = [];
    const selectPartsArr = [];
    countPartsMap.forEach(part => {
      countInPartsArr.push(part);
    });
    selectPartsMap.forEach(part => {
      selectPartsArr.push(part);
    });

    if (selectPartsArr.length === 0) {
      message.warn('请添加配件并检查配件实际数量');
      return false;
    }

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
    let { visible, parts, page } = this.state;
    parts = Array.from(parts);

    const self = this;
    const columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
        width: '15%',
      }, {
        title: '规格',
        className: 'text-right',
        width: '10%',
        render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
        width: '15%',
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: '15%',
      }, {
        title: '实际数量',
        dataIndex: '_id',
        key: 'real_amount',
        className: 'center',
        width: '15%',
        render(id, record) {
          return <Input style={{ width: 100 }}
                        onBlur={self.handleInputBlur.bind(self, id, record)} />;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '15%',
        render(id) {
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
          title={<span><Icon type="plus" /> 添加配件</span>}
          visible={visible}
          maskClosable={false}
          width={960}
          onCancel={this.handleCancel}
          onOk={this.handleSubmit}
          okText="添加到盘点单"
        >
          <Row type={'flex'} className="mb10">
            <Col span={12}>
              <Search
                placeholder="用关键字或编号搜索配件"
                style={{ width: 210 }}
                onChange={this.handlePartsSearch}
                size="large"
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
