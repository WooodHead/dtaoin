import React from 'react';
import {message, Row, Col, Button, Input} from 'antd';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import Base from './Base';
import AddPart from './AddPart';
import AuthPopover from './AuthPopover';
import Print from './Print';

import api from '../../../middleware/api';

export default class New extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      parts: [],
      page: 1,
      total: 0,
    };

    [
      'handlePageChange',
      'handleSaveNewParts',
      'handleComplete',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.createStocktaking();
  }

  createStocktaking() {
    api.ajax({
      url: api.warehouse.stocktaking.new(),
    }, (data) => {
      let {detail} = data.res;

      this.setState({id: detail._id});
      this.getStockTakingParts(detail._id, this.state.page);
    }, (err) => {
      message.error(`开单失败[${err}]`);
    });
  }

  render() {
    let {isFetching, id, parts, page, total} = this.state;

    console.log('parts', parts);
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
        title: '规格',
        key: 'spec',
        render: (value, record) => `${record.auto_part.spec}${record.auto_part.unit}`,
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
        },
      }];

    return (
      <div>
        <Row className="mb15">
          <Col span={24}>
            <div className="pull-right">
              <span className="mr10">
                <AuthPopover size="default" id={id}/>
              </span>
              <span className="mr10">
                <Print id={id}/>
              </span>
              <Button type="primary" onClick={this.handleComplete}>完成</Button>
            </div>
          </Col>
        </Row>

        <Row className="mb5">
          <Col span={18}>
            <p className="text-gray">提示：由于盘点数据过多，建议先打印盘点单，将盘点数据填写完整后,再进行系统录入，盘点单中缺失的配件，请点击“添加配件”手动录入</p>
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
