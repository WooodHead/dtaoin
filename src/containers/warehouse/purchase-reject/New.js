import React from 'react';
import { Link } from 'react-router-dom';
import { message, Row, Col, Form, Input, Select, Button, Tooltip } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import AddPart from './AddPart';
import AuthPay from './AuthPay';
import AuthExport from './AuthExport';
import InfoDropDown from '../../../components/widget/InfoDropDown';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class New extends React.Component {
  constructor(props) {
    super(props);

    const { id } = props.match.params;
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
      partsInfo: '',
      enterPartInfo: '',
    };

    [
      'handleSupplierChange',
      'handlePartAdd',
      'handlePartDelete',
      'handlePageChange',
      'handleSubmit',
      'handleShowPartsInfo',
      'handlePartEnter',
      'handlePartLeave',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id, page } = this.state;

    this.getSuppliers();
    if (id) {
      this.getRejectDetail(id);
      this.getRejectItems(id, page);
    }
  }

  handlePartEnter(e, record) {
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.info = record;
    enterPartInfo.visible = true;
    this.setState({ enterPartInfo });
  }

  handlePartLeave() {
    const { enterPartInfo } = this.state;
    enterPartInfo.visible = false;
    this.setState({ enterPartInfo });
  }

  handleSupplierChange(supplierId) {
    const { itemMap } = this.state;
    itemMap.clear();
    this.setState({ supplierId, itemMap });
  }

  handleShowPartsInfo(partsInfo) {
    this.setState({ partsInfo });
  }

  handlePartAdd(items) {
    const { itemMap } = this.state;

    items.map(item => {
      itemMap.set(item.purchase_item_id, item);
    });

    this.setState({ itemMap });
  }

  /**
   * del part item
   * @param id purchase_item_id
   */
  handlePartDelete(id) {
    const { delItemIdSet, itemMap } = this.state;
    itemMap.forEach(item => {
      if (item.purchase_item_id === id) {
        // 已保存的退货配件，保存删除信息
        if (String(item._id) !== '0') {
          delItemIdSet.add(item._id);
        }
        itemMap.delete(id);
      }
    });

    this.setState({ delItemIdSet, itemMap });
  }

  handlePageChange(page) {
    const { id, total } = this.state;
    this.setState({ page });
    if (total) {
      this.getRejectItems(id, page);
    }
  }

  handleSubmit() {
    const { id, isNew, itemMap, oldItemIdSet, delItemIdSet } = this.state;
    const formData = this.props.form.getFieldsValue();

    const params = [];
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
      this.setState({ detail: data.res.detail });
    });
  }

  assembleDelInfo(oldItemIdSet, delItemIdSet) {
    const delIds = [];
    oldItemIdSet.forEach(oldId => {
      if (delItemIdSet.has(oldId)) {
        delIds.push(oldId);
      }
    });
    return delIds.toString();
  }

  getRejectDetail(id) {
    api.ajax({ url: api.warehouse.reject.detail(id) }, data => {
      const { detail } = data.res;
      this.setState({
        detail,
        supplierId: detail.supplier_id,
        supplier_name: detail.supplier_name,
      });
    });
  }

  getRejectItems(id, page) {
    api.ajax({ url: api.warehouse.reject.items(id, page) }, data => {
      const { list, total } = data.res;
      const oldItemIdSet = new Set();
      const itemMap = new Map();

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
    api.ajax({ url: api.warehouse.supplier.getAll() }, data => {
      this.setState({ suppliers: data.res.list });
    });
  }

  render() {
    const { formItemThree, selectStyle } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { enterPartInfo, isNew } = this.state;

    const {
      page,
      total,
      itemMap,
      detail,
      suppliers,
      supplierId,
    } = this.state;

    const parts = Array.from(itemMap.values());
    let reject_count = 0;
    let purchase_amount_price = 0;
    let reject_amount = 0;
    let diff_worth = 0;

    parts.map(item => {
      reject_count += Number(item.reject_count);
      purchase_amount_price += Number(item.reject_count) * Number(item.purchase_price);
      reject_amount += Number(item.reject_count * item.reject_price);
      diff_worth += ((parseFloat(item.purchase_price) - parseFloat(item.reject_price)) *
        parseInt(item.reject_count));
    });

    if (parts.length > 0) {
      parts.push({
        _id: '合计',
        reject_count,
        purchase_amount_price: purchase_amount_price.toFixed(2),
        reject_amount: reject_amount.toFixed(2),
        diff_worth: diff_worth.toFixed(2),
      });
    }

    const renderContent = (value, record, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (Number(index) === Number(parts.length - 1)) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const self = this;
    const columns = [
      {
        title: '序号',
        dataIndex: 'purchase_item_id',
        key: 'index',
        width: '48px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: '合计',
              props: {
                colSpan: 6,
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
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return (
              <Link
                to={{ pathname: `/warehouse/part/detail/${record._id}` }}
                onMouseEnter={e => self.handlePartEnter(e, record)}
                onMouseLeave={e => self.handlePartLeave(e, record)}
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
        width: '120px',
        render: renderContent,
      }, {
        title: '规格',
        key: 'spec',
        width: '75px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: 'value',
              props: {
                colSpan: 0,
              },
            };
          } else {
            return `${record.spec || ''}${record.unit || ''}`;
          }
        },
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: '75px',
        render: (value, record, index) => {
          const obj = {
            children: (value && value.length <= 4)
              ? value
              : <Tooltip placement="topLeft" title={value}>{value}</Tooltip>,
            props: {},
          };
          if (Number(index) === Number(parts.length - 1)) {
            obj.props.colSpan = 0;
          }
          return obj;
        },
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
        width: '135px',
        render: (value, record, index) => {
          const obj = {
            children: (value && value.length <= 8)
              ? value
              : <Tooltip placement="topLeft" title={value}>{value}</Tooltip>,
            props: {},
          };
          if (Number(index) === Number(parts.length - 1)) {
            obj.props.colSpan = 0;
          }
          return obj;
        },
      }, {
        title: '退货数量',
        dataIndex: 'reject_count',
        key: 'reject_count',
        width: '75px',
      }, {
        title: '采购单价',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        className: 'text-right',
        width: '80px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return Number(value).toFixed(2);
          }
        },
      }, {
        title: '采购总价',
        dataIndex: 'purchase_amount_price',
        className: 'text-right',
        width: '85px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: `￥${value}`,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return (Number(record.reject_count) * Number(record.purchase_price)).toFixed(2);
          }
        },
      }, {
        title: '退货单价',
        dataIndex: 'reject_price',
        key: 'reject_price',
        className: 'text-right',
        width: '85px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: '',
              props: {
                colSpan: 1,
              },
            };
          } else {
            return Number(value).toFixed(2);
          }
        },
      }, {
        title: '退货金额',
        dataIndex: 'reject_amount',
        key: 'reject_amount',
        className: 'text-right',
        width: '85px',
        render: (id, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: `￥${id}`,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return Number(record.reject_count * record.reject_price).toFixed(2);
          }
        },
      }, {
        title: '退货差价',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
        width: '80px',
        render: (id, record, index) => {
          const diffPrice = parseFloat(record.purchase_price) - parseFloat(record.reject_price);
          const count = parseInt(record.reject_count);
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: `￥${id}`,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return Number(diffPrice * count).toFixed(2);
          }
        },
      }, {
        title: '操作',
        dataIndex: 'purchase_item_id',
        key: 'action',
        className: 'center',
        width: '70px',
        fixed: 'right',
        render: (id, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: id,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return <a href="javascript:" onClick={self.handlePartDelete.bind(self, id)}>删除</a>;
          }
        },
      },
    ];

    return (
      <div>
        <InfoDropDown partInfo={enterPartInfo} />

        <Row className="mb15">
          <Col span={18}>
            <h4 className="mb10">基本信息</h4>

            <Form>
              <Row>
                <Col span={7}>
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
                        disabled={!isNew}
                        placeholder="选择供应商"
                      >
                        {suppliers.map(supplier => <Option
                          key={supplier._id}>{supplier.supplier_company}</Option>)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col span={7}>
                  <FormItem label="运费" {...formItemThree}>
                    {getFieldDecorator('freight', {
                      initialValue: detail.freight,
                    })(
                      <Input addonAfter="元" placeholder="输入运费" />,
                    )}
                  </FormItem>
                </Col>

                <Col span={7}>
                  <FormItem label="物流公司" {...formItemThree}>
                    {getFieldDecorator('logistics', {
                      initialValue: detail.logistics,
                    })(
                      <Input placeholder="输入物流公司" />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={14}>
                  <FormItem label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('remark', {
                      initialValue: detail.remark,
                    })(
                      <TextArea placeholder="输入备注" rows="1" />,
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

        <div className="mb10 clearfix">
          <div className="pull-left">
            <h4 style={{ lineHeight: '28px' }}>配件信息</h4>
          </div>

          <div className="pull-right">
            <AddPart
              supplierId={supplierId}
              onAdd={this.handlePartAdd}
              showPartsInfo={this.handleShowPartsInfo}
            />
          </div>
        </div>

        <span className="purchase-reject">
          <TableWithPagination
            columns={columns}
            dataSource={parts}
            total={total === 0 ? parts.length : total}
            currentPage={page}
            onPageChange={this.handlePageChange}
            rowKey={record => record.purchase_item_id}
            scroll={{ x: 1200 }}
          />
        </span>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
