import React from 'react';
import {Row, Col, Input, Badge} from 'antd';

import AuthImport from './AuthImport';

import api from '../../../middleware/api';
import path from '../../../config/path';
import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.location.query.id,
      page: 1,
      detail: {},
      parts: [],
      total: 0,
      hasPermission: false,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleRemarkBlur = this.handleRemarkBlur.bind(this);
  }

  componentDidMount() {
    let {id, page} = this.state;

    this.getStocktakingDetail(id);
    this.getStockTakingParts(id, page);
    this.checkPermission(path.warehouse.stocktaking.auth);
  }

  async checkPermission(path) {
    let hasPermission = await api.checkPermission(path);
    this.setState({hasPermission});
  }

  handlePageChange(page) {
    this.setState({page});
    this.getStockTakingParts(this.state.id, page);
  }

  handleRemarkBlur(e) {
    this.setState({remark: e.target.value});
  }

  getStocktakingDetail(id) {
    api.ajax({
      url: api.warehouse.stocktaking.detail(id),
    }, (data) => {
      this.setState({detail: data.res.detail});
    });
  }

  getStockTakingParts(id, page) {
    api.ajax({
      url: api.warehouse.stocktaking.parts(id, page),
    }, (data) => {
      this.setState({
        parts: data.res.list,
        total: parseInt(data.res.total),
      });
    });
  }

  render() {
    let {page, total, parts, detail, remark, hasPermission} = this.state;

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
        title: '剩余库存数',
        dataIndex: 'amount',
        key: 'amount',
        className: 'center',
      }, {
        title: '实际数量',
        dataIndex: 'real_amount',
        key: 'real_amount',
        className: 'center',
      }, {
        title: '盘亏',
        dataIndex: 'diff_amount',
        key: 'pankui_status',
        className: 'center',
        render(diffAmount) {
          let status;
          if (parseInt(diffAmount) > 0) {
            status = <Badge status="success" text="盘盈"/>;
          } else if (parseInt(diffAmount) < 0) {
            status = <Badge status="error" text="盘亏"/>;
          } else {
            status = <Badge status="default" text="正常"/>;
          }
          return status;
        },
      }, {
        title: '盘差数量',
        dataIndex: 'diff_amount',
        key: 'diff_amount',
        className: 'center',
      }, {
        title: '盘差金额',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
      }];

    if (!hasPermission && String(detail.authorize_user_id) === '0') {
      return <h5 className="center text-red">您无权限查看，请先授权</h5>;
    }

    return (
      <div>
        <Row className={String(detail.status) === '0' ? '' : 'hide'}>
          <Col span={24}>
            <span className="pull-right">
              <AuthImport
                id={detail._id}
                type="import"
                remark={remark}
              />
            </span>
          </Col>
        </Row>

        <Row type="flex" gutter={16}>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘点时间：</span>
            <span className="line-height32-middle">{detail.stocktaking_time}</span>
          </Col>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘点人：</span>
            <span className="line-height32-middle">{detail.stocktaking_user_name}</span>
          </Col>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘亏数：</span>
            <span className="line-height32-middle">{detail.pankui_amount}</span>
          </Col>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘亏金额：</span>
            <span className="line-height32-middle">{detail.pankui_worth}</span>
          </Col>
        </Row>

        <Row type="flex" gutter={16}>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘盈数：</span>
            <span className="line-height32-middle">{detail.panying_amount}</span>
          </Col>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘盈金额：</span>
            <span className="line-height32-middle">{detail.panying_worth}</span>
          </Col>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘前总值：</span>
            <span className="line-height32-middle">{detail.panqian_worth}</span>
          </Col>
          <Col span={6}>
            <span className="ant-form-item-label width-80">盘后总值：</span>
            <span className="line-height32-middle">{detail.panhou_worth}</span>
          </Col>
        </Row>

        <Row>
          <Col span={20}>
            <span style={{display: 'inline-block', height: 46, width: 80, textAlign: 'right'}}>备注：</span>
            {detail.status + '' === '0' ?
              <Input
                type="textarea"
                defaultValue={detail.remark}
                style={{width: '50%'}}
                onBlur={this.handleRemarkBlur}
              />
              :
              detail.remark
            }
          </Col>
        </Row>

        <Row className="mb15">
          <Col span={24}>
            <p className="text-gray">提示：剩余库存数=配件库存数-工单冻结配件数</p>
          </Col>
        </Row>

        <TableWithPagination
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
