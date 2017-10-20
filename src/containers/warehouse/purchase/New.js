import React from 'react';
import { Link } from 'react-router-dom';
import {
  message,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Alert,
  InputNumber,
  Tooltip,
  Icon,
} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

import TableWithPagination from '../../../components/widget/TableWithPagination';
import NumberInput from '../../../components/widget/NumberInput';

import AddPart from './AddPart';
import AuthPay from './AuthPay';
import AuthImport from './AuthImport';
import NewSupplier from '../supplier/New';
import InfoDropDown from '../../../components/widget/InfoDropDown';

const FormItem = Form.Item;
const Option = Select.Option;

class New extends React.Component {
  constructor(props) {
    super(props);

    const { id, partId } = props.match.params;
    this.state = {
      isNew: !id,
      id: id || 0,
      partId: partId || '',
      page: 1,
      intentionValid: !!id || false,
      suppliers: [],
      oldItemIdSet: new Set(),
      delItemIdSet: new Set(),
      itemMap: new Map(), // 新增或编辑时的配件集合
      detail: {},
      total: 0,
      enterPartInfo: '',
    };

    [
      'handlePartsChange',
      'handlePartDelete',
      'handleCheckIntention',
      'handleSubmit',
      'handleAddSupplierSuccess',
      'handleCountChange',
      'handlePartEnter',
      'handleSellPriceChange',
      'handlePriceChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id, page, partId } = this.state;

    this.getSuppliers();
    if (id) {
      this.getPurchaseDetail(id);
      this.getPurchaseItems(id, page);
    }
    if (partId) {
      this.getPartDetailById(partId);
    }
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

  handlePartsChange(parts) {
    this.setState({ itemMap: parts });
  }

  handleCountChange(value, record) {
    const { itemMap } = this.state;
    record.amount = value;

    itemMap.set(record.part_id || record._id, JSON.parse(JSON.stringify(record)));
    this.setState({ itemMap });
  }

  handlePriceChange(value, record) {
    const { itemMap } = this.state;
    record.in_price = value;
    itemMap.set(record.part_id || record._id, JSON.parse(JSON.stringify(record)));
    this.setState({ itemMap });
  }

  handleSellPriceChange(value, record) {
    const { itemMap } = this.state;
    record.sell_price = value;
    itemMap.set(record.part_id || record._id, JSON.parse(JSON.stringify(record)));
    this.setState({ itemMap });
  }

  handlePartDelete(record) {
    const { delItemIdSet, itemMap } = this.state;
    const id = record.part_id || record._id;

    itemMap.delete(id);
    delItemIdSet.add(record._id);
    this.setState({ delItemIdSet, itemMap });
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

  handleCheckIntention(e) {
    const intentionId = e.target.value;

    if (!intentionId) {
      return;
    }

    api.ajax({
      url: api.aftersales.maintProjectByProjectId(intentionId),
    }, data => {
      const detail = data.res.intention_info;
      if (detail || Object.keys(detail).length > 0) {
        if (String(detail.status) === '-1') {
          this.setState({ intentionValid: false });
        } else {
          this.setState({ intentionValid: true });
        }
      }
    }, () => {
      this.setState({ intentionValid: false });
    });
  }

  handleAddSupplierSuccess(id) {
    api.ajax({ url: api.warehouse.supplier.getAll() }, data => {
      this.setState({ suppliers: data.res.list }, () => {
        this.props.form.setFieldsValue({ supplier_id: id });
      });
    });
  }

  handleSubmit() {
    const { id, isNew, itemMap, oldItemIdSet, delItemIdSet } = this.state;

    const formData = this.props.form.getFieldsValue();

    const partArr = [];
    for (const item of itemMap.values()) {
      partArr.push({
        _id: item._id.length === 17 ? item._id : '0', // TODO 如何判断是已经保存的配件，还是新添加的？
        part_id: item.part_id || item._id,
        amount: item.amount,
        in_price: item.in_price,
        sell_price: item.sell_price,
      });
    }

    /* Array.from(itemMap).forEach(item => {
     partArr.push({
     _id: item._id.length === 17 ? item._id : '0', // TODO 如何判断是已经保存的配件，还是新添加的？
     part_id: item.part_id,
     amount: item.amount,
     in_price: item.in_price,
     });
     });*/

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
      location.href = `/warehouse/purchase/edit/${data.res.detail._id}`;
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

  getPurchaseDetail(id) {
    api.ajax({ url: api.warehouse.purchase.detail(id) }, data => {
      const { detail } = data.res;
      this.setState({ detail, supplier_name: detail.supplier_name });
    });
  }

  getPurchaseItems(id) {
    api.ajax({ url: api.warehouse.purchase.itemsAll(id) }, data => {
      const { list, total } = data.res;

      const oldItemIdSet = new Set();
      const itemMap = new Map();

      list.map(item => {
        oldItemIdSet.add(item._id);
        itemMap.set(item.part_id || item._id, item);
      });

      this.setState({
        oldItemIdSet,
        itemMap,
        total: parseInt(total),
      });
    });
  }

  getPartDetailById(partId) {
    const partIdArr = partId.split(',');
    const itemMap = new Map();

    partIdArr.map(item => {
      api.ajax({ url: api.warehouse.part.detail(item) }, data => {
        const { detail } = data.res;
        detail.part_name = detail.name;
        detail.remain_amount = detail.amount;
        detail.amount = 1;

        itemMap.set(detail._id, detail);

        this.setState({
          itemMap,
        });
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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      isNew,
      intentionValid,
      total,
      itemMap,
      detail,
      suppliers,
      enterPartInfo,
    } = this.state;

    const parts = Array.from(itemMap.values());

    let partAmount = 0;
    let partAmountPrice = 0;

    parts.map(item => {
      partAmount += Number(item.amount);
      partAmountPrice += Number(item.in_price) * Number(item.amount);
    });

    if (parts.length > 0) {
      parts.push({
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
      if (Number(index) === Number(parts.length - 1)) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const minPrice = (
      <div>
        <span className="mr10">最低售价</span>
        <Tooltip placement="top" title="最低售价=进价+进价*该配件加价率">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const price = (
      <div>
        <span className="mr10">售价</span>
        <Tooltip placement="top" title="售价是仓库对配件的建议零售价，会在开单添加配件时，显示给开单人员">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const self = this;
    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: 'index',
        width: '48px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
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
                to={{ pathname: `/warehouse/part/detail/${record.part_id || record._id}` }}
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
        width: '76px',
        render: (value, record, index) => {
          const obj = {
            children: (value && value.length <= 5)
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
        title: '规格',
        key: 'spec',
        width: '75px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: value,
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
        title: '剩余库存',
        dataIndex: 'remain_amount',
        key: 'remain_amount',
        width: '75px',
        render: renderContent,
      }, {
        title: '采购数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '74px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return (
              <div>
                <div className="input-content" />
                <InputNumber
                  defaultValue={value}
                  onChange={value => self.handleCountChange(value, record)}
                  min={0}
                  style={{ width: '69px' }}
                  size="large"
                />
              </div>
            );
          }
        },
      }, {
        title: '采购单价',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'text-right',
        width: '74px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: '',
              props: {
                colSpan: 1,
              },
            };
          } else {
            return (
              <div>
                <div className="input-content" />
                <NumberInput
                  value={value}
                  id={`in_price${record._id}`}
                  onChange={value => self.handlePriceChange(value, record)}
                  unitVisible={false}
                  style={{ width: '69px' }}
                />
              </div>
            );
          }
        },
      }, {
        title: '采购金额',
        dataIndex: 'amount_price',
        key: 'amount_price',
        className: 'text-right',
        width: '85px',
        render: (id, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: id,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return Number(record.in_price * record.amount).toFixed(2);
          }
        },
      }, {
        title: minPrice,
        key: 'min_price',
        className: 'text-right',
        width: '100px',
        render: (value, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: value,
              props: {
                colSpan: 3,
              },
            };
          } else {
            return (Number(record.in_price) * (1 + Number(record.markup_rate) || 0)).toFixed(2);
          }
        },
      }, {
        title: price,
        dataIndex: 'sell_price',
        key: 'sell_price',
        className: 'text-right',
        width: '74px',
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
              <div>
                <div className="input-content" />
                <NumberInput
                  value={value}
                  id={`in_price${record._id}`}
                  onChange={value => self.handleSellPriceChange(value, record)}
                  unitVisible={false}
                  style={{ width: '69px' }}
                />
              </div>
            );
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '70px',
        render: (id, record, index) => {
          if (Number(index) === Number(parts.length - 1)) {
            return {
              children: id,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return (
              <div>
                <a
                  href="javascript:"
                  onClick={self.handlePartDelete.bind(self, record)}
                >
                  删除
                </a>
              </div>
            );
          }
        },
      },
    ];

    return (
      <div>
        <InfoDropDown partInfo={enterPartInfo} />

        {getFieldValue('type') === '1' && getFieldValue('intention_id') && !intentionValid ?
          <Alert type="error" message="维保记录不存在，请检查工单号" showIcon /> : null
        }

        <Row className="mb15">
          <Col span={19}>
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
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                {getFieldValue('type') === '1' ? <Col span={7} lg={7} sm={12}>
                  <FormItem label="工单号" {...formItemThree}>
                    {getFieldDecorator('intention_id', {
                      initialValue: detail.intention_id,
                      rules: FormValidator.getRuleNotNull(),
                      validateTrigger: 'onBlur',
                      onChange: this.handleCheckIntention,
                    })(
                      <Input placeholder="填写工单号" disabled={!isNew} />,
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
                        {suppliers.map(supplier => <Option
                          key={supplier._id}>{supplier.supplier_company}</Option>)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col span={3} lg={3} sm={12}>
                  <span className="ml20">
                    <NewSupplier onSuccess={this.handleAddSupplierSuccess} />
                  </span>
                </Col>
              </Row>

              <Row>
                <Col span={7} lg={7} sm={12}>
                  <FormItem label="运费" {...formItemThree}>
                    {getFieldDecorator('freight', {
                      initialValue: detail.freight || '',
                    })(
                      <Input addonAfter="元" placeholder="输入运费" />,
                    )}
                  </FormItem>
                </Col>
                <Col span={7} lg={7} sm={12}>
                  <FormItem label="物流公司" {...formItemThree}>
                    {getFieldDecorator('logistics', {
                      initialValue: detail.logistics || '',
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
                      <Input type="textarea" placeholder="输入备注" rows={1} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={5}>
            <div className="pull-right">
              <span className="mr5">
                <AuthPay
                  id={detail._id}
                  detail={detail}
                  disabled={Object.keys(detail).length === 0 || String(detail.status) !== '1' ||
                  String(detail.pay_status) === '2'}
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
            <h4 style={{ lineHeight: '28px' }}>配件信息</h4>
          </Col>
          <Col span={8}>
            <div className="pull-right">
              <AddPart partsMap={itemMap} onPartsChange={this.handlePartsChange} />
            </div>
          </Col>
        </Row>

        <Row className="mb20 purchase-new">
          <TableWithPagination
            columns={columns}
            dataSource={parts}
            total={total === 0 ? parts.length : total}
            pageSize={100000}
            pagination={false}
          />
        </Row>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
