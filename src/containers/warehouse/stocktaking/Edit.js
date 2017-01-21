import React from 'react';
import {Row, Col, Button, Input} from 'antd';

import TableWithPagination from '../../../components/base/TableWithPagination';

import Base from './Base';
import AddPart from './AddPart';
import AuthPopover from './AuthPopover';
import Print from './Print';

import api from '../../../middleware/api';

export default class Edit extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      page: 1,
      id: props.location.query.id,
      detail: {},
      parts: [],
    };

    [
      'handlePageChange',
      'handleSaveNewParts',
      'handleComplete',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {id, page} = this.state;

    this.getStocktakingDetail(id);
    this.getStockTakingParts(id, page);
  }

  render() {
    let {isFetching, parts, page, total, id, detail} = this.state;

    let self = this;
    let columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: 'index',
        className: 'center',
        render(value, record, index) {
          return (page - 1) * api.config.limit + (index + 1);
        },
      }, {
        title: '配件分类',
        dataIndex: 'auto_part.part_type_name',
        key: 'part_type_name',
      }, {
        title: '配件名',
        dataIndex: 'auto_part.name',
        key: 'name',
      }, {
        title: '配件号',
        dataIndex: 'auto_part.part_no',
        key: 'part_no',
      }, {
        title: '适用车型',
        dataIndex: 'auto_part.scope',
        key: 'scope',
      }, {
        title: '品牌',
        dataIndex: 'auto_part.brand',
        key: 'brand',
      }, {
        title: '实际数量',
        dataIndex: 'real_amount',
        key: 'real_amount',
        className: 'center',
        render: function (value, record) {
          if (detail.status + '' === '0') {
            let initValue = '';
            if (value && parseFloat(value) !== 0) {
              initValue = value;
            }

            return (
              <Input
                defaultValue={initValue}
                style={{width: 100}}
                onBlur={self.handleInputBlur.bind(self, record._id, record.auto_part._id)}
              />
            );
          } else {
            return value;
          }
        },
      }];

    return (
      <div>
        <Row className={String(detail.status) === '0' ? 'mb15' : 'hide'}>
          <Col span={24}>
            <div className="pull-right">
              <AuthPopover size="default" id={id}/>
              <Print id={id}/>
              <Button type="primary" onClick={this.handleComplete}>完成</Button>
            </div>
          </Col>
        </Row>

        <Row className={String(detail.status) === '0' ? 'mb15' : 'hide'}>
          <Col span={18}>
            <p className="text-gray">
              提示：由于盘点数据过多，建议先打印盘点单，将盘点数据填写完整后,再进行系统录入，盘点单中缺失的配件，请点击“添加配件”手动录入
            </p>
          </Col>
          <Col span={6}>
            <div className="pull-right">
              <AddPart stocktakingId={id} onSave={this.handleSaveNewParts}/>
            </div>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          tip="正在导入库存，请稍候..."
          columns={columns}
          dataSource={parts}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
