import React from 'react';
import {Link} from 'react-router';
import {Row, Col, Form} from 'antd';

import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import AuthPay from './AuthPay';

const FormItem = Form.Item;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.location.query.id,
      page: 1,
      detail: {},
      list: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    let {id, page}= this.state;

    this.getPurchaseDetail(id);
    this.getPurchaseItems(id, page);
  }

  handlePageChange(page) {
    this.setState({page});
    this.getPurchaseItems(this.state.id, page);
  }

  getPurchaseDetail(id) {
    api.ajax({url: api.warehouse.purchase.detail(id)}, data => {
      let {detail} = data.res;
      this.setState({detail});
    });
  }

  getPurchaseItems(id, page) {
    api.ajax({url: api.warehouse.purchase.items(id, page)}, data => {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    });
  }

  render() {
    const {formItemThree, formItem12} = Layout;

    let {detail, page, list, total} = this.state;

    let columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: 'index',
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
        title: '库存数量',
        dataIndex: 'remain_amount',
        key: 'remain_amount',
        className: 'center',
      }, {
        title: '采购数量',
        dataIndex: 'amount',
        key: 'amount',
        className: 'center',
      }, {
        title: '历史最低进价(元)',
        dataIndex: 'min_in_price',
        key: 'min_in_price',
        className: 'center',
      }, {
        title: '本次采购单价(元)',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'center',
      }, {
        title: '金额(元)',
        dataIndex: '_id',
        key: 'total_fee',
        className: 'text-right',
        render: (value, record) => Number(record.in_price * record.amount).toFixed(2),
      }];

    return (
      <div>
        <h4 className="mb10">基本信息</h4>

        <Row>
          <Col span={16}>
            <Form>
              <Row className={String(detail.intention_id) === '0' ? 'hide' : null}>
                <Col span={16}>
                  <FormItem label="工单号" {...formItem12}>
                    <Link to={{
                      pathname: '/aftersales/project/new',
                      query: {id: detail.intention_id},
                    }}>
                      {detail.intention_id}
                    </Link>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="供应商" {...formItemThree}>
                    <p>{detail.supplier_company}</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="采购金额" {...formItemThree}>
                    <p>{detail.worth} 元</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="实付金额" {...formItemThree}>
                    <p>{Number(parseFloat(detail.worth) - parseFloat(detail.unpay_worth)).toFixed(2)} 元</p>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="采购类型" {...formItemThree}>
                    <p>{detail.type_name}</p>
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
                <Col span={16}>
                  <FormItem label="备注" {...formItem12}>
                    <p>{detail.remark}</p>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={8}>
            {Object.keys(detail).length === 0 || String(detail.status) === '-1' || String(detail.pay_status) === '2' ? null :
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
          footer={() => <Row><Col span={24}><span className="pull-right">合计：{detail.worth}</span></Col></Row>}
        />
      </div>
    );
  }
}

export default Detail;
