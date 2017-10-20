import React from 'react';
import { message, Row, Col, Button, Input, Tooltip } from 'antd';

import api from '../../../middleware/api';

import TableWithPagination from '../../../components/widget/TableWithPagination';
import SearchDropDown from '../../../components/widget/SearchDropDown';

import Base from './Base';
import AddPart from './AddPart';
import AuthPopover from './AuthPopover';
import Print from './Print';

export default class New extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      parts: [],
      partsAll: [],
      page: 1,
      total: 0,
      chooseParts: '',
    };

    [
      'handlePageChange',
      'handleSaveNewParts',
      'handleComplete',
      'handTableRowClick',
      'handleShowPartsInfo',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.createStocktaking();
    this.setInputContentPadding();
  }

  componentDidUpdate() {
    this.setInputContentPadding();
  }

  setInputContentPadding() {
    let inputContent = document.getElementsByClassName('input-content');
    inputContent = Array.from(inputContent);
    if (inputContent) {
      for (const i in inputContent) {
        if (inputContent.hasOwnProperty(i)) {
          inputContent[i].parentNode.parentNode.style.padding = '2px 2px';
        }
      }
    }
  }

  createStocktaking() {
    api.ajax({
      url: api.warehouse.stocktaking.new(),
    }, data => {
      const { detail } = data.res;

      this.setState({ id: detail._id });
      this.getStockTakingParts(detail._id, this.state.page);
      this.getAllStockTakingParts(detail._id);
    }, err => {
      message.error(`开单失败[${err}]`);
    });
  }

  handleShowPartsInfo(partsInfo) {
    this.setState({ partsInfo, chooseParts: '' });
  }

  handTableRowClick(value) {
    this.setState({ chooseParts: value });
  }

  render() {
    const { isFetching, id, parts, page, total, chooseParts, updatePermission, partsAll } = this.state;

    const self = this;
    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: 'index',
        className: 'center',
        width: '48px',
        render(value, record, index) {
          return (page - 1) * api.config.limit + (index + 1);
        },
      }, {
        title: '配件分类',
        dataIndex: 'auto_part.part_type_name',
        key: 'part_type_name',
        width: '245px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 12) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '配件名称',
        dataIndex: 'auto_part.name',
        key: 'name',
      }, {
        title: '配件号',
        dataIndex: 'auto_part.part_no',
        key: 'part_no',
        width: '120px',
      }, {
        title: '规格',
        key: 'spec',
        width: '75px',
        render: (value, record) => `${record.auto_part.spec}${record.auto_part.unit}`,
      }, {
        title: '适用车型',
        dataIndex: 'auto_part.scope',
        key: 'scope',
        width: '135px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '品牌',
        dataIndex: 'auto_part.brand',
        key: 'brand',
        width: '75px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 4) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '实际数量',
        dataIndex: 'real_amount',
        key: 'real_amount',
        className: 'center',
        width: '75px',
        render(value, record) {
          return (
            <div>
              <div className="input-content" />
              <Input
                defaultValue={value}
                style={{ width: 70 }}
                onBlur={self.handleInputBlur.bind(self, record._id, record.auto_part._id, id)}
                size="large"
              />
            </div>
          );
        },
      }];

    return (
      <div>
        <SearchDropDown
          partsInfo={this.state.partsInfo}
          onTableRowClick={this.handTableRowClick}
        />
        <Row className="mb15">
          <Col span={24}>
            <div className="pull-right">
              <span className="mr10">
                <AuthPopover size="default" id={id} updatePermission={updatePermission} />
              </span>
              <span className="mr10">
                <Print id={id} />
              </span>
              <Button type="primary" onClick={this.handleComplete}>完成</Button>
            </div>
          </Col>
        </Row>

        <Row className="mb5">
          <Col span={18}>
            <p className="text-gray">
              提示：由于盘点数据过多，建议先打印盘点单，将盘点数据填写完整后,再进行系统录入，盘点单中缺失的配件，请点击“添加配件”手动录入</p>
          </Col>
          <Col span={6}>
            <div className="pull-right">
              <AddPart
                stocktakingId={id}
                onSave={this.handleSaveNewParts}
                showPartsInfo={this.handleShowPartsInfo}
                chooseParts={chooseParts}
                partsAll={partsAll}
              />
            </div>
          </Col>
        </Row>

        <span className="stocktaking-new">
          <TableWithPagination
            isLoading={isFetching}
            tip="正在导入库存，请稍候..."
            columns={columns}
            dataSource={parts}
            total={total}
            currentPage={page}
            onPageChange={this.handlePageChange}
          />
        </span>
      </div>
    );
  }
}
