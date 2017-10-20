import React from 'react';
import { Row, Col, Form } from 'antd';

import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import AuthPay from './AuthPay';

const FormItem = Form.Item;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      page: 1,
      detail: {},
      list: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    const { id, page } = this.state;

    this.getRejectDetail(id);
    this.getRejectItems(id, page);
  }

  handlePageChange(page) {
    this.setState({ page });
    this.getRejectItems(this.state.id, page);
  }

  getRejectDetail(id) {
    api.ajax({ url: api.warehouse.reject.detail(id) }, data => {
      const { detail } = data.res;
      this.setState({ detail });
    });
  }

  getRejectItems(id, page) {
    api.ajax({ url: api.warehouse.reject.items(id, page) }, data => {
      const { list, total } = data.res;
      this.setState({ list, total: parseInt(total) });
    });
  }

  render() {
    const { formItemThree, formItem12 } = Layout;
    const {
      page,
      detail,
      list,
      total,
    } = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        render: (value, record, index) => index + 1,
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
      }, {
        title: '配件名',
        dataIndex: 'part_name',
        key: 'part_name',
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      }, {
        title: '退货数量',
        dataIndex: 'amount',
        key: 'amount',
        className: 'center',
      }, {
        title: '进货单价',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        className: 'text-right',
      }, {
        title: '退货单价',
        dataIndex: 'reject_price',
        key: 'reject_price',
        className: 'text-right',
      }, {
        title: '退货金额',
        dataIndex: '_id',
        key: 'reject_amount',
        className: 'text-right',
        render: (id, record) => Number(record.amount * record.reject_price).toFixed(2),
      }, {
        title: '差价',
        dataIndex: '_id',
        key: 'diff_worth',
        className: 'text-right',
        render: (id, record) => Number((record.purchase_price - record.reject_price) * record.amount).toFixed(2),
      }];

    return (
      <div>
        <h4 className="mb10">基本信息</h4>

        <Row>
          <Col span={16}>
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem label="供应商" {...formItemThree}>
                    <p>{detail.supplier_company}</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="采购金额" {...formItemThree}>
                    <p>{detail.old_worth} 元</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="退货金额" {...formItemThree}>
                    <p>{detail.new_worth} 元</p>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="退款差价" {...formItemThree}>
                    <p>{detail.diff_worth}</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="运费" {...formItemThree}>
                    <p>{detail.freight} 元</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="物流公司" {...formItemThree}>
                    <p>{detail.logistics}</p>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <FormItem label="备注" {...formItem12}>
                    <p>{detail.remark}</p>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={8}>
            {String(detail.pay_status) === '2' || String(detail.status) === '-1' ? null :
              <div className="pull-right">
                <AuthPay id={detail._id} detail={detail}/>
              </div>
            }
          </Col>
        </Row>

        <h4 className="mb10">配件列表</h4>

        <TableWithPagination
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
          footer={() => <Row><Col span={24}><span className="pull-right">合计：{detail.new_worth}</span></Col></Row>}
        />
      </div>
    );
  }
}

export default Detail;
