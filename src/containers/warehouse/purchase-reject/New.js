import React from 'react';
import {message, Row, Col, Form, Input, Select, Button} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import AddPart from './AddPart';
import AuthPay from './AuthPay';
import AuthExport from './AuthExport';

const FormItem = Form.Item;
const Option = Select.Option;

class New extends React.Component {
  constructor(props) {
    super(props);

    let {id} = props.location.query;
    this.state = {
      isNew: !id,
      id: id || 0,
      page: 1,
      supplierId: '',
      suppliers: [],
      oldItemIdSet: new Set(),
      delItemIdSet: new Set(),
      itemMap: new Map(), // 新增或编辑时的配件集合
      detail: {},
      total: 0,
    };

    [
      'handleSupplierChange',
      'handlePartAdd',
      'handlePartDelete',
      'handlePageChange',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {id, page}= this.state;

    this.getSuppliers();
    if (id) {
      this.getRejectDetail(id);
      this.getRejectItems(id, page);
    }
  }

  handleSupplierChange(supplierId) {
    this.setState({supplierId});
  }

  handlePartAdd(items) {
    let {itemMap} = this.state;

    items.map(item => {
      itemMap.set(item.purchase_item_id, item);
    });

    this.setState({itemMap});
  }

  /**
   * del part item
   * @param id purchase_item_id
   */
  handlePartDelete(id) {
    let {delItemIdSet, itemMap} = this.state;
    itemMap.forEach(item => {
      if (item.purchase_item_id === id) {
        // 已保存的退货配件，保存删除信息
        if (String(item._id) !== '0') {
          delItemIdSet.add(item._id);
        }
        itemMap.delete(id);
      }
    });

    this.setState({delItemIdSet, itemMap});
  }

  handlePageChange(page) {
    let {id, total} = this.state;
    this.setState({page});
    if (total) {
      this.getRejectItems(id, page);
    }
  }

  handleSubmit() {
    let {id, isNew, itemMap, oldItemIdSet, delItemIdSet} = this.state;
    let formData = this.props.form.getFieldsValue();

    let params = [];
    Array.from(itemMap.values()).forEach(item => {
      params.push({
        _id: item._id,
        purchase_id: item.purchase_id,
        purchase_item_id: item.purchase_item_id,
        part_id: item.part_id,
        amount: item.reject_count,
        reject_price: item.reject_price,
      });
    });

    formData.part_list = JSON.stringify(params);

    if (!formData.supplier_id) {
      message.warning('请选择供应商');
      return;
    }

    if (params.length === 0) {
      message.warning('请添加配件');
      return;
    }

    if (!isNew) { // edit
      formData.reject_id = id;
      formData.delete_item_ids = this.assembleDelInfo(oldItemIdSet, delItemIdSet);
    }

    api.ajax({
      type: 'post',
      url: isNew ? api.warehouse.reject.add() : api.warehouse.reject.edit(),
      data: formData,
    }, data => {
      message.success('退货单保存成功');
      this.setState({detail: data.res.detail});
    });
  }

  assembleDelInfo(oldItemIdSet, delItemIdSet) {
    let delIds = [];
    oldItemIdSet.forEach(oldId => {
      if (delItemIdSet.has(oldId)) {
        delIds.push(oldId);
      }
    });
    return delIds.toString();
  }

  getRejectDetail(id) {
    api.ajax({url: api.warehouse.reject.detail(id)}, data => {
      let {detail} = data.res;
      this.setState({
        detail,
        supplierId: detail.supplier_id,
        supplier_name: detail.supplier_name,
      });
    });
  }

  getRejectItems(id, page) {
    api.ajax({url: api.warehouse.reject.items(id, page)}, data => {
      let {list, total} = data.res;
      let oldItemIdSet = new Set();
      let itemMap = new Map();

      list.map(item => {
        oldItemIdSet.add(item._id); // save reject_item_id

        item.reject_count = item.amount;
        itemMap.set(item.purchase_item_id, item); // 以purchase_item_id为唯一标识
      });

      this.setState({
        oldItemIdSet,
        itemMap,
        total: parseInt(total),
      });
    });
  }

  getSuppliers() {
    api.ajax({url: api.warehouse.supplier.getAll()}, data => {
      this.setState({suppliers: data.res.list});
    });
  }

  render() {
    const {formItemThree, selectStyle} = Layout;
    let {getFieldDecorator} = this.props.form;

    let {
      page,
      total,
      itemMap,
      detail,
      suppliers,
      supplierId,
    } = this.state;

    let parts = Array.from(itemMap.values());

    let self = this;
    let columns = [
      {
        title: '序号',
        dataIndex: 'purchase_item_id',
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
        title: '规格',
        key: 'spec',
        render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
      },{
        title: '退货数量',
        dataIndex: 'reject_count',
        key: 'reject_count',
        className: 'center',
      }, {
        title: '进货单价',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: '退货单价',
        dataIndex: 'reject_price',
        key: 'reject_price',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: '退货金额',
        dataIndex: '_id',
        key: 'reject_amount',
        className: 'text-right',
        render: (id, record) => Number(record.reject_count * record.reject_price).toFixed(2),
      }, {
        title: '差价',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
        render: (id, record) => {
          let diffPrice = parseFloat(record.purchase_price) - parseFloat(record.reject_price);
          let count = parseInt(record.reject_count);
          return Number(diffPrice * count).toFixed(2);
        },
      }, {
        title: '操作',
        dataIndex: 'purchase_item_id',
        key: 'action',
        className: 'center',
        render: (id) => {
          return <a href="javascript:" onClick={self.handlePartDelete.bind(self, id)}>删除</a>;
        },
      },
    ];

    return (
      <div>
        <Row className="mb15">
          <Col span={18}>
            <h4 className="mb10">基本信息</h4>

            <Form>
              <Row>
                <Col span={8} lg={8} sm={12}>
                  <FormItem label="供应商" {...formItemThree}>
                    {getFieldDecorator('supplier_id', {
                      initialValue: detail.supplier_id,
                      onChange: this.handleSupplierChange,
                      rules: FormValidator.getRuleNotNull(),
                      validateTrigger: 'onChange',
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        {...selectStyle}
                        placeholder="选择供应商">
                        {suppliers.map(supplier => <Option key={supplier._id}>{supplier.supplier_company}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col span={8} lg={8} sm={12}>
                  <FormItem label="运费" {...formItemThree}>
                    {getFieldDecorator('freight', {
                      initialValue: detail.freight,
                    })(
                      <Input addonAfter="元" placeholder="输入运费"/>
                    )}
                  </FormItem>
                </Col>

                <Col span={8} lg={8} sm={12}>
                  <FormItem label="物流公司" {...formItemThree}>
                    {getFieldDecorator('logistics', {
                      initialValue: detail.logistics,
                    })(
                      <Input placeholder="输入物流公司"/>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8} lg={8}>
                  <FormItem label="备注" {...formItemThree}>
                    {getFieldDecorator('remark', {
                      initialValue: detail.remark,
                    })(
                      <Input type="textarea" placeholder="输入备注"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={6}>
            <div className="pull-right">
              <span className="mr5">
                <AuthPay
                  id={detail._id}
                  detail={detail}
                  disabled={
                    Object.keys(detail).length === 0 ||
                    String(detail.status) !== '1' ||
                    String(detail.pay_status) === '2'
                  }
                />
              </span>

              <span className="mr5">
                <AuthExport
                  id={detail._id}
                  disabled={
                    Object.keys(detail).length === 0 ||
                    String(detail.status) === '2'
                  }
                />
              </span>

              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled={parts.length === 0}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mb10">
          <Col span={16}>
            <h4 style={{lineHeight: '28px'}}>配件信息</h4>
          </Col>
          <Col span={8}>
            <div className="pull-right">
              <AddPart supplierId={supplierId} onAdd={this.handlePartAdd}/>
            </div>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={parts}
          total={total === 0 ? parts.length : total}
          currentPage={page}
          onPageChange={this.handlePageChange}
          rowKey={record => record.purchase_item_id}
        />
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
