import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form } from 'antd';

import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

import TableWithPagination from '../../../components/widget/TableWithPagination';
import InfoDropDown from '../../../components/widget/InfoDropDown';

import AuthPay from './AuthPay';

const FormItem = Form.Item;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || '',
      page: 1,
      detail: {},
      list: [],
      enterPartInfo: '',
    };

    [
      'handlePartEnter',
      'handlePartLeave',
      'handlePageChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id, page } = this.state;

    this.getPurchaseDetail(id);
    this.getPurchaseItems(id, page);
  }

  handlePageChange(page) {
    this.setState({ page });
    this.getPurchaseItems(this.state.id, page);
  }

  handlePartEnter(e, record) {
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.info = record;
    enterPartInfo.visible = true;
    this.setState({ enterPartInfo });
  }

  handlePartLeave(e, record) {
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.info = record;
    enterPartInfo.visible = false;
    this.setState({ enterPartInfo });
  }

  getPurchaseDetail(id) {
    api.ajax({ url: api.warehouse.purchase.detail(id) }, data => {
      const { detail } = data.res;
      this.setState({ detail });
    });
  }

  getPurchaseItems(id, page) {
    api.ajax({ url: api.warehouse.purchase.items(id, page) }, data => {
      const { list, total } = data.res;
      this.setState({ list, total: parseInt(total) });
    });
  }

  render() {
    const { formItemThree, formItem12 } = Layout;

    const { detail, page, list, total, enterPartInfo } = this.state;

    let partAmount = 0;
    let partAmountPrice = 0;

    const listShow = JSON.parse(JSON.stringify(list));

    listShow.map(item => {
      partAmount += Number(item.amount);
      partAmountPrice += Number(item.in_price) * Number(item.amount);
    });

    if (listShow.length > 0) {
      listShow.push({
        _id: '合计',
        amount: partAmount,
        amount_price: Number(partAmountPrice).toFixed(2),
      });
    }

    const renderContent = (value, record, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (Number(index) === Number(listShow.length - 1)) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: 'index',
        render: (value, record, index) => {
          if (Number(index) === Number(listShow.length - 1)) {
            return {
              children: '合计',
              props: {
                colSpan: 7,
              },
            };
          } else {
            return index + 1;
          }
        },
      }, {
        title: '配件名',
        dataIndex: 'part_name',
        key: 'part_name',
        render: (value, record, index) => {
          if (Number(index) === Number(listShow.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return (
              <Link
                to={{ pathname: `/warehouse/part/detail/${record.part_id}` }}
                onMouseEnter={e => this.handlePartEnter(e, record)}
                onMouseLeave={e => this.handlePartLeave(e, record)}
              >
                {value}
              </Link>
            );
          }
        },
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
        render: renderContent,
      }, {
        title: '规格',
        dataIndex: 'spec',
        key: 'spec',
        render: (value, record, index) => {
          if (Number(index) === Number(listShow.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return value + record.unit;
          }
        },
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render: renderContent,
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
        render: renderContent,
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
        render: renderContent,
      }, {
        title: '采购数量',
        dataIndex: 'amount',
        key: 'amount',
        render: (value, record, index) => {
          if (Number(index) === Number(listShow.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 4,
              },
            };
          } else {
            return value;
          }
        },
      }, {
        title: '库存数量',
        dataIndex: 'remain_amount',
        key: 'remain_amount',
        render: renderContent,
      }, {
        title: '本次采购单价(元)',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'text-right',
        render: renderContent,
      }, {
        title: '历史最低进价(元)',
        dataIndex: 'min_in_price',
        key: 'min_in_price',
        className: 'text-right',
        render: renderContent,
      }, {
        title: '金额(元)',
        dataIndex: 'amount_price',
        key: 'total_fee',
        className: 'text-right',
        render: (value, record, index) => {
          if (Number(index) === Number(listShow.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return Number(record.in_price * record.amount).toFixed(2);
          }
        },
      }];

    return (
      <div>
        <InfoDropDown partInfo={enterPartInfo} />
        <Row className="clearfix">
          <h4 className="mb10 pull-left">基本信息</h4>
          <div className="pull-right">
            {
              Object.keys(detail).length === 0 || String(detail.status) === '-1' ||
              String(detail.pay_status) === '2'
                ? null
                : <div className="pull-right">
                  <AuthPay id={detail._id} detail={detail} />
                </div>
            }
          </div>
        </Row>

        <Row>
          <Col span={16}>
            <Form>
              <Row className={String(detail.intention_id) === '0' ? 'hide' : null}>
                <Col span={16}>
                  <FormItem label="工单号" {...formItem12}>
                    <Link to={{ pathname: `/aftersales/project/new/${detail.intention_id}` }}>
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
                    <p>
                      {(detail.worth && detail.unpay_worth) ? Number(parseFloat(detail.worth) -
                        parseFloat(detail.unpay_worth)).toFixed(2) : '0.00'}元
                    </p>
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
        </Row>

        <h4 className="mb10">配件列表</h4>

        <TableWithPagination
          columns={columns}
          dataSource={listShow}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Detail;
