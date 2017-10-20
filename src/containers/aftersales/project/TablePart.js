import React from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Tooltip,
  Table,
  Icon,
  Input,
  Popconfirm,
  Button,
  message,
  Checkbox,
  Select,
} from 'antd';

import api from '../../../middleware/api';

import PartsSearchDrop from './PartsSearchDrop';
import InfoDropDown from '../../../components/widget/InfoDropDown';

const Search = Input.Search;
const Option = Select.Option;

export default class TablePart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      selectedPartIds: [],
      partIndex: '',
      enterPartInfo: '',
      key: [],
      partsSaveCount: [],
      pickDisable: false,
    };

    [
      'handleAddPart',
      'renderFooter',
      'handlePartSearch',
      'handleRowSelect',
      'handlePartFeeBaseChange',
      'handTableRowClick',
      'handleRemovePart',
      'handleBatchPick',
      'handlePicking',
      'handlePromptChange',
      'handlePartEnter',
      'handlePartLeave',
      'handleCancel',
      'handlePartFeeBaseBlur',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainParts(this.props.intention_id, this.props.customer_id);
    this.setInputContentPadding();
    this.setcouponIconPositon();
  }

  componentDidUpdate() {
    this.setInputContentPadding();
    this.setcouponIconPositon();
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

  setcouponIconPositon() {
    let couponIcon = document.getElementsByClassName('couponIcon');
    couponIcon = Array.from(couponIcon);

    if (couponIcon) {
      for (const i in couponIcon) {
        if (couponIcon.hasOwnProperty(i)) {
          couponIcon[i].parentNode.style.position = 'relative';
        }
      }
    }
  }

  handleAddPart() {
    const { partMap } = this.props;
    if (partMap.has('add')) {
      message.warn('请先选择维修配件');
      return false;
    }
    const record = {
      part_id: 'add',
    };
    partMap.set('add', record);
    this.props.onSuccess(partMap);
  }

  handlePartSearch(e, record, index) {
    const key = [];
    const keyword = e.target.value;
    key[index] = keyword;
    const coordinate = api.getPosition(e);

    this.setState({ key });

    let url = '';
    // 判断是否是会员
    if (!!record.customer_coupon_item_id) {
      url = api.warehouse.part.list({ key: keyword, partType: record.part_type_id });
    } else {
      url = api.warehouse.part.list({ key: keyword });
    }

    api.ajax({ url }, data => {
      const list = data.res.list;
      const info = {};
      info.info = list;
      info.coordinate = coordinate;
      info.visible = true;
      this.setState({ data: info, partIndex: index });
    });
  }

  handTableRowClick(value) {
    const { partIndex } = this.state;
    const { partMap } = this.props;

    const partIndexDate = partMap.has(partIndex) ? partMap.get(partIndex) : {};

    for (const part of partMap.values()) {
      if (Number(value._id) === Number(part.part_id)) {
        message.warn('该配件已添加，请重新选择配件或修改配件信息');
        return false;
      }
    }

    partIndexDate.part_id = value._id;
    partIndexDate.part_name = value.name;
    partIndexDate.part_amount = value.amount - value.freeze;
    partIndexDate.part_freeze = value.freeze;
    partIndexDate.material_fee_base = Number(value.sell_price) === 0 ? '' : value.sell_price;
    partIndexDate.material_fee = 0;
    partIndexDate.count = 1;
    partIndexDate.coupon_discount = 0;
    partIndexDate.part_spec = value.spec;
    partIndexDate.part_unit = value.unit;
    partIndexDate.remain_count = value.amount - value.freeze;
    partIndexDate.real_count = 0;
    partIndexDate._id = partIndexDate._id ? partIndexDate._id : '0';
    partIndexDate.maintain_type = value.maintain_type;
    partIndexDate.min_in_price = value.min_in_price;
    partIndexDate.part_type_levels = value.part_type_levels;
    partIndexDate.levels_name = value.level_name;
    partIndexDate.part_type_id = value.part_type;
    partIndexDate.in_price = value.in_price;
    partIndexDate.markup_rate = value.markup_rate;
    partIndexDate.brand = value.brand;
    partIndexDate.part_no = value.part_no;
    partIndexDate.part_type = value.part_type;
    partIndexDate.part_type_name = value.part_type_name;
    partIndexDate.scope = value.scope;
    partIndexDate.min_amount = value.min_amount;

    this.setformDataTypeRate(partIndexDate, this.props.memberDetailList);
    partIndexDate.coupon_discount = this.getPreferentialAmount(partIndexDate);
    partIndexDate.paid_amount = this.getPaidAmount(partIndexDate);
    partIndexDate.material_fee = partIndexDate.count * partIndexDate.material_fee_base;

    partMap.delete('add');
    partMap.set(partIndex, partIndexDate);
    this.props.onSuccess(partMap);

    const record = {
      part_id: 'add',
    };
    partMap.set('add', record);
  }

  handleRowSelect(selectedRowKeys, selectedRows) {
    const { partMap } = this.props;
    const { partsSaveCount } = this.state;

    const parts = Array.from(partMap.values());

    const ids = [];
    let isPick = true;
    selectedRows.forEach(row => {
      ids.push(row._id);
      if (Number((Number(row.part_amount) - Number(row.part_freeze)) <= 0)) {
        isPick = false;
      }
    });

    // 批量领料是否可点
    let pickDisable = false;
    parts.map((part, index) => {
      if (Number(part.count) !== Number(partsSaveCount[index])) {
        pickDisable = true;
      }
    });

    if (!isPick || pickDisable) {
      this.setState({ selectedPartIds: [] });
      return false;
    }
    this.setState({ selectedPartIds: ids });
  }

  handlePartCountChange(e, record, index) {
    const timeCount = e.target.value;

    const { partsSaveCount } = this.state;
    const { partMap } = this.props;

    record.count = timeCount;
    record.material_fee = record.material_fee_base * timeCount;

    this.setformDataTypeRate(record, this.props.memberDetailList);
    record.coupon_discount = this.getPreferentialAmount(record);
    record.paid_amount = this.getPaidAmount(record);

    if (partMap.has(index)) {
      partMap.set(index, record);
    } else {
      partMap.set('add', record);
    }

    /* todo判断批量领料是否要不可点*/
    const parts = Array.from(partMap.values());

    let pickDisable = false;
    parts.map((part, index) => {
      if (Number(part.count) !== Number(partsSaveCount[index])) {
        pickDisable = true;
      }
    });

    this.setState({ pickDisable });

    this.props.onSuccess(partMap);
  }

  handleCancel() {
    this.setState({ key: [] });
  }

  handleLevelsChange(value, record, index) {
    const materialFeeBase = value.split(',')[0];
    const levelName = value.split(',')[1];

    const { partMap } = this.props;

    record.material_fee_base = materialFeeBase;
    record.material_fee = record.count * materialFeeBase;
    this.setformDataTypeRate(record, this.props.memberDetailList);
    record.coupon_discount = this.getPreferentialAmount(record);
    record.paid_amount = this.getPaidAmount(record);
    record.level_name = levelName;

    partMap.set(index, record);
    this.props.onSuccess(partMap);
  }

  handlePartFeeBaseChange(e, record, index) {
    const { partMap } = this.props;
    let materialFeeBase = e.target.value;

    if (Number(materialFeeBase) < 0) {
      message.error('配件单价需要大于0, 请重新填写');
      materialFeeBase = '';
    }

    record.material_fee_base = materialFeeBase;
    record.material_fee = record.count * materialFeeBase;
    this.setformDataTypeRate(record, this.props.memberDetailList);
    record.coupon_discount = this.getPreferentialAmount(record);
    record.paid_amount = this.getPaidAmount(record);

    if (partMap.has(index)) {
      partMap.set(index, record);
    } else {
      partMap.set('add', record);
    }

    this.props.onSuccess(partMap);
  }

  handlePartFeeBaseBlur(e, record) {
    const partFeeBase = e.target.value;
    if (Number(record.coupon_price) > 0 && (Number(partFeeBase) < Number(record.coupon_price))) {
      message.error(`最低售价为${record.coupon_price}`);
      this.partFee.refs.input.value = '';
    }
  }

  handleRemovePart(record, index) {
    const { itemMap, partMap } = this.props;
    if (Number(record.customer_coupon_item_id) > 0) {
      Array.from(itemMap.values()).map(item => {
        if (Number(item.customer_coupon_item_id) === Number(record.customer_coupon_item_id)) {
          this.props.removeMaintainItem(item.item_id, item._id);
        }
      });

      for (const [key, value] of partMap.entries()) {
        if (Number(value.customer_coupon_item_id) === Number(record.customer_coupon_item_id)) {
          this.props.removeMaintainPart(key, value._id);
        }
      }
      this.props.onEditCouponUseState(record.customer_coupon_item_id, 'delete');
    } else {
      this.props.removeMaintainPart(index, record._id);
    }
  }

  handleBatchPick() {
    // 设置派工提醒，1 以后不再提醒，0 提醒
    localStorage.setItem('prompt', '1');

    const { selectedPartIds } = this.state;

    const data = {
      _id: this.props.intention_id,
      auto_part_ids: selectedPartIds.join(','),
    };

    api.ajax({
      url: api.aftersales.intentionAutoPartFreeze(),
      type: 'POST',
      data,
    }, () => {
      message.success('领料成功');
      this.getMaintainParts(this.props.intention_id, this.props.customer_id);
    });
  }

  handlePicking(record) {
    const isPicking = Number(record.real_count) >= Number(record.count);

    const url = isPicking
      ? api.aftersales.intentionAutoPartUnfreeze()
      : api.aftersales.intentionAutoPartFreeze();

    const data = {
      _id: this.props.intention_id,
      auto_part_ids: record._id,
    };

    api.ajax({
      url,
      type: 'POST',
      data,
    }, () => {
      message.success(isPicking ? '取消领料成功' : '领料成功');
      this.getMaintainParts(this.props.intention_id, this.props.customer_id);
    });
  }

  handlePromptChange(e) {
    // 设置派工提醒，1 以后不再提醒，0 提醒
    if (e.target.checked) {
      localStorage.setItem('prompt', '1');
    } else {
      localStorage.setItem('prompt', '0');
    }
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

  setformDataTypeRate(formData, memberDetailList) {
    if (memberDetailList) {
      memberDetailList.map(item => {
        if (Number(item._id) === Number(formData.customer_coupon_item_id)) {
          formData.type = item.coupon_item_info.type;
          formData.discount_rate = item.coupon_item_info.discount_rate;
          if (formData.item_id) {
            item.coupon_item_info.items instanceof Array &&
            item.coupon_item_info.items.map(value => {
              if (String(value._id) === String(formData.item_id)) {
                formData.coupon_price = value.price || 0;
              }
            });
          } else if (formData.part_type_id) {
            item.coupon_item_info.part_types instanceof Array &&
            item.coupon_item_info.part_types.map(value => {
              if (String(value._id) === String(formData.part_type_id)) {
                formData.coupon_price = value.price || 0;
              }
            });
          }
        }
      });
    }
  }

  getPreferentialAmount(record) {
    switch (Number(record.type)) {
    case 1:
      if (Number(record.count) >= Number(record.coupon_part_count)) {
        return Number(record.coupon_part_count) *
            (Number(record.material_fee_base) - Number(record.coupon_price || '0'));
      } else {
        return Number(record.count) *
            (Number(record.material_fee_base) - Number(record.coupon_price || '0'));
      }
    case 2:
      if (Number(record.count) >= Number(record.coupon_part_count)) {
        return Number(record.coupon_part_count * (1 - record.discount_rate) *
            record.material_fee_base).toFixed(2);
      } else {
        return Number(record.count * (1 - record.discount_rate) * record.material_fee_base).
            toFixed(2);
      }
    case 3:
      return Number(record.discount_amount);
    default:
      return 0;
    }
  }

  getPaidAmount(record) {
    return Number(record.time_fee) - this.getPreferentialAmount(record);
  }

  getCouponAmount(record) {
    if (!record) {
      return;
    }
    switch (Number(record.type)) {
    case 1:
      if (Number(record.count) >= Number(record.coupon_part_count)) {
        return Number(record.coupon_part_count) *
            (Number(record.material_fee_base) - Number(record.coupon_price));
      } else {
        return Number(record.count) *
            (Number(record.material_fee_base) - Number(record.coupon_price));
      }
    case 2:
      if (Number(record.count) >= Number(record.coupon_part_count)) {
        return Number(record.coupon_part_count * (1 - record.discount_rate) *
            record.material_fee_base);
      } else {
        return Number(record.count * (1 - record.discount_rate) * record.material_fee_base);
      }
    case 3:
      return Number(record.discount_amount);
    default:
      return 0;
    }
  }

  getMaintainParts(intentionId = '', customerId = '') {
    if (intentionId) {
      api.ajax({ url: api.aftersales.getPartListOfMaintProj(intentionId, customerId) }, data => {
        const { list } = data.res;
        const partMap = new Map();
        const partsSaveCount = [];

        list.map(part => {
          partMap.set(partMap.size, part);
          partsSaveCount.push(part.count);
        });
        this.setState({ partsSaveCount });
        this.props.onSuccess(partMap);
      });
    }
  }

  renderFooter(parts) {
    let materialFee = 0;
    parts.map(part => {
      const partMaterialFee = Number(part.material_fee - part.coupon_discount);
      if (!isNaN(partMaterialFee)) {
        materialFee += partMaterialFee;
      }
    });

    return (
      <Row>
        <Col span={12}><p className="ml55 pointer" style={{ color: '#108ee9' }}
                          onClick={this.handleAddPart}><Icon
          type="plus" />添加维修配件</p></Col>
        <Col span={12}><span className="pull-right mr120">配件费合计(元)：{Number(materialFee).
          toFixed(2)}</span></Col>
      </Row>
    );
  }

  render() {
    const { partMap, payStatus, status } = this.props;
    const { data, selectedPartIds, enterPartInfo, key, pickDisable } = this.state;

    if (Number(payStatus) === 2) {
      partMap.delete('add');
    }

    const parts = Array.from(partMap.values());

    const self = this;
    const columns = [
      {
        title: '配件名称',
        dataIndex: 'part_name',
        key: 'part_name',
        render: (value, record, index) => (
            <div className="couponIcon">
              {
                record.customer_coupon_item_id > 0 ? <div className="coupon-icon">
                  <div style={{ zIndex: '100' }} className="triangle-border" />
                  <div className="coupon-word-icon">优惠
                  </div>
                </div> : null
              }

              {
                value
                  ? <Link
                    to={{ pathname: `/warehouse/part/detail/${record.part_id}` }}
                    onMouseEnter={e => self.handlePartEnter(e, record)}
                    onMouseLeave={e => self.handlePartLeave(e, record)}
                    target="_blank"
                  >
                    {value}
                  </Link>
                  : <div className="input-content">
                    <Search
                      value={key[index]}
                      placeholder={!!record.customer_coupon_item_id
                        ? `请选择"${record.part_type_name}"类型的配件`
                        : '搜索配件名、首字母或配件号'}
                      onChange={e => this.handlePartSearch(e, record, index)}
                      size="large"
                    />
                  </div>
              }
            </div>
          ),
      }, {
        title: '配件单价',
        dataIndex: 'material_fee_base',
        key: 'material_fee_base',
        width: '74px',
        className: 'text-right',
        render: (value, record, index) => {
          if (record.part_type_levels && typeof record.part_type_levels === 'string') {
            record.part_type_levels = JSON.parse(record.part_type_levels);
          }

          let levelPrice = '';
          let defaultValue = '';

          record.part_type_levels && record.part_type_levels.map(item => {
            if (item.name === record.level_name) {
              levelPrice = item.price;
            }
          });

          if (levelPrice) {
            defaultValue = `${levelPrice},${record.level_name}`;
          }

          const difference = Number(value) - Number(record.min_in_price);
          const fontColor = difference < 0 ? 'red' : '#333333';

          return (
            <div>
              {
                Number(payStatus) === 2
                  ? <p style={{ color: fontColor, paddingRight: '6px' }}>{value}</p>
                  : record.part_type_levels && record.part_type_levels.length > 0
                  ? <div className="input-content">
                    <Select
                      onSelect={e => this.handleLevelsChange(e, record, index)}
                      placeholder="请选择档次"
                      defaultValue={defaultValue}
                      size="large"
                    >
                      {
                        record.part_type_levels.map(item =>
                          <Option key={`${item.price},${item.name}`}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              minWidth: '120px',
                            }}>
                              <span>{item.name}</span>
                              <span>{Number(item.price).toFixed(2)}</span>
                            </div>
                          </Option>,
                        )
                      }
                    </Select>
                  </div>
                  : <div className="input-content">
                    <Input
                      value={value ? Number(value) : ''}
                      onChange={e => self.handlePartFeeBaseChange(e, record, index)}
                      style={{ textAlign: 'right' }}
                      onBlur={e => self.handlePartFeeBaseBlur(e, record)}
                      ref={partFee => this.partFee = partFee}
                      type="number"
                      min="0"
                      size="large"
                    />
                  </div>
              }
            </div>
          );
        },
      }, {
        title: '加价情况',
        key: 'plus_price',
        width: Number(payStatus) === 2 ? '180px' : '75px',
        className: Number(payStatus) === 2 ? 'center' : 'hide',
        render: (value, record) => {
          const minPrice = record.min_in_price;
          const materialFeeBase = record.material_fee_base;

          const difference = Math.abs(materialFeeBase - minPrice).toFixed(2);
          const proportion = (Number(difference) / Number(minPrice)).toFixed(2);

          if (!minPrice) {
            return '';
          }

          if (Number(materialFeeBase) > Number(minPrice)) {
            return (
              <div>
                {
                  Number(minPrice) === 0 ?
                    <span style={{ color: '#8FCE5B' }}>{`+${difference}`}</span> :
                    <span style={{ color: '#8FCE5B' }}>{`+${difference},折扣率${Number(proportion).
                      toFixed(2)}`}</span>
                }
              </div>
            );
          } else if (Number(materialFeeBase) < Number(minPrice)) {
            return (
              <div>
                <span style={{ color: 'red' }}>{`-${difference},折扣率${Number(proportion).
                  toFixed(2)}`}</span>
              </div>
            );
          } else {
            return (
              <div>
                <span style={{ color: '#8FCE5B' }}>{'0%,正常'}</span>
              </div>
            );
          }
        },
      }, {
        title: '使用数量',
        dataIndex: 'count',
        key: 'count',
        width: '75px',
        render: (value, record, index) => (
            <div>
              <div className="input-content" />
              {
                Number(payStatus) === 2
                  ? <p>{value}</p>
                  : <Input
                    type="number"
                    defaultValue={value ? value : '0'}
                    onChange={e => self.handlePartCountChange(e, record, index)}
                    size="large"
                  />
              }
            </div>
          ),
      }, {
        title: '剩余库存',
        dataIndex: 'part_amount',
        key: 'part_amount',
        width: Number(payStatus) === 2 ? '75px' : '95px',
        render: (value, record) => value && record.part_freeze ? Number(value) - Number(record.part_freeze) : '0',
      }, {
        title: '配件费',
        dataIndex: 'material_fee',
        key: 'material_fee',
        className: 'text-right',
        width: Number(payStatus) === 2 ? '95px' : '75px',
        render(value, record) {
          return (record.material_fee_base && record.count) ? (record.material_fee_base *
            record.count).toFixed(2) : '--';
        },
      }, {
        title: '优惠数量',
        dataIndex: 'coupon_part_count',
        key: 'coupon_part_count',
        width: Number(payStatus) === 2 ? '75px' : '95px',
        render: value => value || '--',
      }, {
        title: '优惠金额',
        key: 'coupon_discount',
        dataIndex: 'coupon_discount',
        className: 'text-right',
        width: '95px',
        render: (value, record) => {
          if (record.hasOwnProperty('coupon_item_info')) {
            self.getCouponAmount(record.coupon_item_info).toFixed(2);
          } else {
            return Number(record.coupon_discount) > 0
              ? Number(record.coupon_discount).toFixed(2)
              : '--';
          }
        },
      }, {
        title: '实收金额',
        dataIndex: 'paid_amount',
        key: 'paid_amount',
        className: 'text-right',
        width: Number(payStatus) === 2 ? '95px' : '85px',
        render: (value, record) => {
          if (record.hasOwnProperty('type')) {
            if (String(record.time_fee) && self.getCouponAmount(record)) {
              return ((Number(record.material_fee) - self.getCouponAmount(record)).toFixed(2));
            }
            return '0.00';
          } else {
            return record.material_fee ? (Number(record.material_fee) -
              record.coupon_discount).toFixed(2) : '--';
          }
        },
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        width: '85px',
        fixed: String(status) === '1' ? null : 'right',
        className: String(status) === '1' ? 'hide' : 'center width-120',
        render: (value, record, index) => {
          const text = Number(Number(record.customer_coupon_item_id)) ? (
            <div>
              <p>该配件是套餐卡优惠项,</p>
              <p>删除该项会同时移除相关项目、配件，</p>
              <p>是否确认？</p>
            </div>
          ) : '确定删除该项?';

          const width = Number(Number(record.customer_coupon_item_id))
            ? { width: '272px' }
            : { width: '170px' };

          const pickingText = Number(record.real_count) >= Number(record.count) ? '取消领料' : '领料';

          return (
            <div>
              <a
                href="javascript:;"
                onClick={() => this.handlePicking(record)}
                disabled={(!(Number(record._id) > 0) || (Number(payStatus) === 2) || pickDisable)}
              >
                {pickingText}
              </a>

              <span className="ant-divider" />
              <Popconfirm
                title={text}
                onConfirm={() => self.handleRemovePart(record, index)}
                okText="确定"
                cancelText="取消"
                overlayStyle={width}
                placement="topRight"
              >
                <a href="javascript:;" className="action-delete" disabled={Number(payStatus) === 2}>删除</a>
              </Popconfirm>
            </div>
          );
        },
      }];

    const rowSelection = {
      onChange: this.handleRowSelect,
    };

    return (
      <div className="with-bottom-divider">
        <PartsSearchDrop
          partsInfo={data}
          onTableRowClick={this.handTableRowClick}
          onCancel={this.handleCancel}
        />
        <InfoDropDown partInfo={enterPartInfo} />

        <Row className="module-head">
          <Col span={12}>
            <h3>维修配件</h3>
          </Col>
          <Col span={12}>
            {/* "领料后改配件会冻结，等待结算后出库？"*/}
            <div className="pull-right">
              {
                localStorage.getItem('prompt') === '1' ? <Button
                    type="primary"
                    disabled={selectedPartIds.length <= 0}
                    onClick={this.handleBatchPick}
                  >
                    批量领料
                  </Button>
                  : <Popconfirm
                    placement="topRight"
                    title={
                      <span>
                        <p>领料后该配件会冻结，等待结算后出库</p>
                        <p>保存后方可领料, 确认领料?</p>
                        <Checkbox
                          defaultChecked={true}
                          className="pull-left mt15"
                          onChange={this.handlePromptChange}
                        >
                          <span style={{ color: '#999' }}>不再提示</span>
                        </Checkbox>
                      </span>
                    }
                    onConfirm={this.handleBatchPick}
                    overlayStyle={{ width: '274px' }}
                    okText="我知道了"
                  >
                    <Button
                      type="primary"
                      disabled={(selectedPartIds.length <= 0) || pickDisable}
                    >
                      批量领料
                    </Button>
                  </Popconfirm>
              }
            </div>
          </Col>
        </Row>

        <Table
          bordered
          rowSelection={rowSelection}
          columns={columns}
          dataSource={parts}
          size="middle"
          pagination={false}
          footer={this.renderFooter}
          rowKey={record => `${record.part_id}${record.part_type_id}`}
          scroll={{ x: 1050 }}
        />
      </div>
    );
  }
}
