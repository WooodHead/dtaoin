import React from 'react';
import {message, Row, Col, Form, Input, Select, Button, Alert} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import AddPart from './AddPart';
import EditPart from './EditPart';
import AuthPay from './AuthPay';
import AuthImport from './AuthImport';
import NewSupplier from '../supplier/New';

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
      intentionValid: !!id || false,
      suppliers: [],
      oldItemIdSet: new Set(),
      delItemIdSet: new Set(),
      itemSet: new Set(), // 新增或编辑时的配件集合
      detail: {},
      total: 0,
    };

    [
      'handlePartAdd',
      'handlePartDelete',
      'handlePageChange',
      'handleCheckIntention',
      'handleSubmit',
      'handleAddSupplierSuccess',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {id, page}= this.state;

    this.getSuppliers();
    if (id) {
      this.getPurchaseDetail(id);
      this.getPurchaseItems(id, page);
    }
  }

  handlePartAdd(part) {
    let {itemSet} = this.state;

    itemSet.forEach(ps => {
      if (ps.part_id === part.part_id) {
        itemSet.delete(ps);
      }
    });
    itemSet.add(part);

    this.setState({itemSet});
  }

  handlePartDelete(id) {
    let {delItemIdSet, itemSet} = this.state;
    itemSet.forEach(ps => {
      if (ps._id === id) {
        delItemIdSet.add(id);
        itemSet.delete(ps);
      }
    });
    this.setState({delItemIdSet, itemSet});
  }

  handlePageChange(page) {
    let {id, total} = this.state;
    this.setState({page});
    if (total) {
      this.getPurchaseItems(id, page);
    }
  }

  handleCheckIntention(e) {
    let intentionId = e.target.value;

    if (!intentionId) {
      return;
    }

    api.ajax({
      url: api.aftersales.maintProjectByProjectId(intentionId),
    }, (data) => {
      let detail = data.res.intention_info;
      if (detail || Object.keys(detail).length > 0) {
        if (String(detail.status) === '-1') {
          this.setState({intentionValid: false});
        } else {
          this.setState({intentionValid: true});
        }
      }
    }, () => {
      this.setState({intentionValid: false});
    });
  }

  handleAddSupplierSuccess(id) {
    api.ajax({url: api.warehouse.supplier.getAll()}, data => {
      this.setState({suppliers: data.res.list}, () => {
        this.props.form.setFieldsValue({supplier_id: id});
      });
    });
  }

  handleSubmit() {
    let {id, isNew, itemSet, oldItemIdSet, delItemIdSet} = this.state;
    let formData = this.props.form.getFieldsValue();

    let partArr = [];
    Array.from(itemSet).forEach(item => {
      partArr.push({
        _id: item._id.length === 17 ? item._id : '0', // TODO 如何判断是已经保存的配件，还是新添加的？
        part_id: item.part_id,
        amount: item.amount,
        in_price: item.in_price,
      });
    });

    formData.part_list = JSON.stringify(partArr);

    if (!formData.supplier_id) {
      message.warning('请选择供应商');
      return;
    }

    if (partArr.length === 0) {
      message.warning('请添加配件');
      return;
    }

    if (formData.type === '1' && !formData.intention_id) {
      message.warning('临时采购需要填写工单号');
      return;
    }

    if (!isNew) { // edit
      formData.purchase_id = id;
      formData.delete_item_ids = this.assembleDelInfo(oldItemIdSet, delItemIdSet);
    }

    api.ajax({
      type: 'post',
      url: isNew ? api.warehouse.purchase.add() : api.warehouse.purchase.edit(),
      data: formData,
    }, data => {
      message.success('进货单保存成功');
      location.href = `/warehouse/purchase/edit?id=${data.res.detail._id}`;
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

  getPurchaseDetail(id) {
    api.ajax({url: api.warehouse.purchase.detail(id)}, data => {
      let {detail} = data.res;
      this.setState({detail, supplier_name: detail.supplier_name});
    });
  }

  getPurchaseItems(id, page) {
    api.ajax({url: api.warehouse.purchase.items(id, page)}, data => {
      let {list, total} = data.res;

      let oldItemIdSet = new Set();
      let itemSet = new Set();

      list.map(item => {
        oldItemIdSet.add(item._id);
        itemSet.add(item);
      });

      this.setState({
        oldItemIdSet,
        itemSet,
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
    let {getFieldDecorator, getFieldValue} = this.props.form;
    let {
      isNew,
      intentionValid,
      page,
      total,
      itemSet,
      detail,
      suppliers,
    } = this.state;

    let parts = Array.from(itemSet);

    let self = this;
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
        title: '规格',
        key: 'spec',
        render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
      },{
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
        title: '历史最低进价',
        dataIndex: 'min_in_price',
        key: 'min_in_price',
        className: 'center',
      }, {
        title: '本次采购单价',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'center',
      }, {
        title: '金额',
        dataIndex: '_id',
        key: 'worth',
        className: 'text-right',
        render: (id, record) => Number(record.in_price * record.amount).toFixed(2),
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render: (id, record) => {
          return (
            <div>
              <EditPart
                part={record}
                onAdd={self.handlePartAdd}
              />
              <a
                href="javascript:"
                onClick={self.handlePartDelete.bind(self, id)}
              >
                删除
              </a>
            </div>
          );
        },
      }];

    return (
      <div>
        {getFieldValue('type') === '1' && getFieldValue('intention_id') && !intentionValid ?
          <Alert type="error" message="维保记录不存在，请检查工单号" showIcon/> : null
        }

        <Row className="mb15">
          <Col span={20}>
            <h4 className="mb10">基本信息</h4>

            <Form>
              <Row>
                <Col span={7} lg={7} sm={12}>
                  <FormItem label="采购类型" {...formItemThree}>
                    {getFieldDecorator('type', {
                      initialValue: detail.type || '0',
                    })(
                      <Select {...selectStyle} disabled={!isNew}>
                        <Option value="0">常规采购</Option>
                        <Option value="1">临时采购</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                {getFieldValue('type') === '1' ?
                  <Col span={7} lg={7} sm={12}>
                    <FormItem label="工单号" {...formItemThree}>
                      {getFieldDecorator('intention_id', {
                        initialValue: detail.intention_id,
                        rules: FormValidator.getRuleNotNull(),
                        validateTrigger: 'onBlur',
                        onChange: this.handleCheckIntention,
                      })(
                        <Input placeholder="填写工单号" disabled={!isNew}/>
                      )}
                    </FormItem>
                  </Col> : null
                }

                <Col span={7} lg={7} sm={12}>
                  <FormItem label="供应商" {...formItemThree}>
                    {getFieldDecorator('supplier_id', {
                      initialValue: detail.supplier_id,
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        {...selectStyle}
                        placeholder="选择供应商"
                        notFoundContent="未找到"
                      >
                        {suppliers.map(supplier => <Option key={supplier._id}>{supplier.supplier_company}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col span={3} lg={3} sm={12}>
                  <span className="ml20">
                    <NewSupplier onSuccess={this.handleAddSupplierSuccess}/>
                  </span>
                </Col>
              </Row>

              <Row>
                <Col span={7} lg={7} sm={12}>
                  <FormItem label="运费" {...formItemThree}>
                    {getFieldDecorator('freight', {
                      initialValue: detail.freight || '',
                    })(
                      <Input addonAfter="元" placeholder="输入运费"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={7} lg={7} sm={12}>
                  <FormItem label="物流公司" {...formItemThree}>
                    {getFieldDecorator('logistics', {
                      initialValue: detail.logistics || '',
                    })(
                      <Input placeholder="输入物流公司"/>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={7} lg={7}>
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

          <Col span={4}>
            <div className="pull-right">
              <span className="mr5">
                <AuthPay
                  id={detail._id}
                  detail={detail}
                  disabled={Object.keys(detail).length === 0 || String(detail.status) !== '1' || String(detail.pay_status) === '2'}
                />
              </span>

              <span className="mr5">
                <AuthImport
                  id={detail._id}
                  type={getFieldValue('type')}
                  disabled={Object.keys(detail).length === 0 || String(detail.status) !== '0'}
                />
              </span>

              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled={parts.length === 0 || getFieldValue('type') === '1' && !intentionValid}
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
              <AddPart onAdd={this.handlePartAdd}/>
            </div>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={parts}
          total={total === 0 ? parts.length : total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
