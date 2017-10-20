import React, { Component } from 'react';
import { Row, Col, Button, Input, Form, message, Table, Icon, Radio, Checkbox } from 'antd';

import FormValidator from '../../../../utils/FormValidator';
import api from '../../../../middleware/api';
import Layout from '../../../../utils/FormLayout';

import Type from '../../../warehouse/part/Type';
import ItemSearchDrop from '../../../../components/widget/ItemSearchDrop';
import DateRangeSeletor from '../../../../components/widget/DateRangeSelector';

const Search = Input.Search;
const FormItem = Form.Item;

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnDisabled: false,
      itemData: '',
      itemsKey: '',
      itemsMap: new Map(),
      partTypeMap: new Map(),
      fixedDateCheck: true,
      startTime: null,
      endTime: null,
    };

    [
      'handleSubmit',
      'handleItemSearch',
      'handleItemCountChange',
      'handleItemDelete',
      'handlePartTypeSelect',
      'handlePartTypeCountChange',
      'handlePartsTypeDelete',
      'renderItemFooter',
      'renderPartTypeFooter',
      'handleItemAdd',
      'handlePartTypeAdd',
      'handleSearchClear',
      'handleItemSelect',
      'handleDateChange',
      'handleFixedDateChange',
      'handleAfterDateChange',
      'handleLimitChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
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

  handleSearchClear() {
    const { itemsKey } = this.state;
    if (!!itemsKey) {
      this.setState({ itemsKey: '' });
    }
  }

  handleItemSelect(item) {
    const { itemsMap } = this.state;
    if (itemsMap.has(item._id)) {
      message.warn('该项目已经添加，请重新选择');
      return false;
    }
    itemsMap.set(item._id, { _id: item._id, name: item.name, amount: '1' });
    itemsMap.delete('add');
    this.setState({ itemsMap });
  }

  handleItemSearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);

    this.setState({ itemsKey: key });
    if (!!key && key.length >= 2) {
      api.ajax({ url: api.maintainItem.list({ key }) }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list;
        info.coordinate = coordinate;
        info.visible = true;
        this.setState({ itemData: info });
      });
    }
  }

  handleItemCountChange(e, record) {
    const { itemsMap } = this.state;
    const item = itemsMap.get(record._id);
    item.amount = e.target.value;
    itemsMap.set(record._id, item);
  }

  handleItemDelete(record) {
    const { itemsMap } = this.state;
    itemsMap.delete(record._id);
    this.setState({ itemsMap });
  }

  handlePartTypeSelect(id, partType, cancelCb, partTypeSuperName) {
    if (!!id && !!partType) {
      const { partTypeMap } = this.state;
      if (partTypeMap.has(id)) {
        message.warn('该项目已经添加，请重新选择');
        cancelCb();
        return false;
      }
      partTypeMap.set(id, { _id: id, name: `${partTypeSuperName}/${partType.name}`, amount: '1' });
      partTypeMap.delete('add');
      this.setState({ partTypeMap });
    }
  }

  handlePartTypeCountChange(e, record) {
    const { partTypeMap } = this.state;
    const item = partTypeMap.get(record._id);
    item.amount = e.target.value;
    partTypeMap.set(record._id, item);
  }

  handlePartsTypeDelete(record) {
    const { partTypeMap } = this.state;
    partTypeMap.delete(record._id);
    this.setState({ partTypeMap });
  }

  handleItemAdd() {
    const { itemsMap } = this.state;
    if (itemsMap.has('add')) {
      message.warn('请先选择项目');
      return false;
    }

    const record = {
      _id: 'add',
    };
    itemsMap.set('add', record);
    this.setState({ itemsMap });
  }

  handlePartTypeAdd() {
    const { partTypeMap } = this.state;
    if (partTypeMap.has('add')) {
      message.warn('请先选择项目');
      return false;
    }

    const record = {
      _id: 'add',
    };
    partTypeMap.set('add', record);
    this.setState({ partTypeMap });
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime });
    this.setState({ endTime });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('请填写完整信息');
        return;
      }

      if (Number(values.discount_rate) >= 1 || Number(values.discount_rate) < 0) {
        message.warn('折扣比例需要大于0且小于1, 请重新输入');
        return false;
      }

      const { itemsMap, partTypeMap, fixedDateCheck, startTime, endTime } = this.state;
      itemsMap.delete('add');
      partTypeMap.delete('add');

      const items = Array.from(itemsMap.values());
      const partTypes = Array.from(partTypeMap.values());

      values.type = '2';

      // 判断有效期是固定日期还是有效天数
      if (fixedDateCheck) {
        values.valid_type = '0';
        if (!startTime || !endTime) {
          message.warn('请填写固定日期范围');
          return false;
        }
        values.valid_start_date = startTime;
        values.valid_expire_date = endTime;
      } else {
        if (!values.valid_day) {
          message.warn('请填写有效天数');
          return false;
        }
        values.valid_type = '1';
      }

      if (values.unlimited) {
        values.limit_count = '0';
      }

      if (items.length === 0 && partTypes.length === 0) {
        message.warn('请填写优惠项目、优惠配件');
        return false;
      }

      values.items = JSON.stringify(items);
      values.part_types = JSON.stringify(partTypes);

      api.ajax({
        url: api.coupon.createCouponItem(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('保存成功');
        this.setState({ btnDisabled: true });
        window.location.href = '/marketing/discount/list';
      });
    });
  }

  handleFixedDateChange() {
    this.setState({ fixedDateCheck: true });
    this.valid.refs.input.value = '';
  }

  handleAfterDateChange() {
    this.setState({ fixedDateCheck: false });
  }

  handleLimitChange(checked) {
    if (checked.target.checked) {
      this.limitCount.refs.input.value = '';
    }
  }

  renderItemFooter() {
    return (
      <Row>
        <Col span={6}>
          <p className="ml20 pointer" style={{ color: '#108ee9' }} onClick={this.handleItemAdd}>
            <Icon type="plus" />添加项目
          </p>
        </Col>
      </Row>
    );
  }

  renderPartTypeFooter() {
    return (
      <Row>
        <Col span={6}>
          <p className="ml20 pointer" style={{ color: '#108ee9' }} onClick={this.handlePartTypeAdd}>
            <Icon type="plus" />添加配件分类
          </p>
        </Col>
      </Row>
    );
  }

  render() {
    const self = this;
    const { itemsMap, partTypeMap, itemsKey, itemData, fixedDateCheck } = this.state;
    const { getFieldDecorator } = this.props.form;

    const items = Array.from(itemsMap.values());
    const partTypes = Array.from(partTypeMap.values());

    const { formItem5_19 } = Layout;

    const columnsProject = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        width: '5%',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        render: (value, record) => (
            <div>
              <div className="input-content" />
              {
                value ? value : <div>
                  <Search
                    placeholder="请输入项目名称"
                    onChange={e => self.handleItemSearch(e, record)}
                    value={itemsKey}
                    size="large"
                  />
                </div>
              }
            </div>
          ),
      }, {
        title: '优惠数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '40%',
        render: (value, record) => (
            <div>
              <div className="input-content" />
              <Input
                type="number"
                defaultValue={value ? value : '0'}
                onChange={e => self.handleItemCountChange(e, record)}
                size="large"
              />
            </div>
          ),
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '5%',
        render: (text, record) => <a href="javascript:;"
                                     onClick={() => this.handleItemDelete(record)}>删除</a>,
      }];

    const columnsParts = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        width: '5%',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '配件',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        render: value => (
            <div>
              <div className="input-content" />
              {
                value ? value : <div>
                  <Type
                    onSuccess={this.handlePartTypeSelect}
                    size="small"
                    style={{ width: '100%' }}
                  />
                </div>
              }
            </div>
          ),
      }, {
        title: '优惠数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '40%',
        render: (value, record) => (
            <div>
              <div className="input-content" />
              <Input
                type="number"
                defaultValue={value ? value : '0'}
                onChange={e => self.handlePartTypeCountChange(e, record)}
                size="large"
              />
            </div>
          ),
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '5%',
        render: (text, record) => <a href="javascript:;"
                                     onClick={() => this.handlePartsTypeDelete(record)}>删除</a>,
      }];

    return (
      <div>
        <ItemSearchDrop
          info={itemData}
          onItemSelect={this.handleItemSelect}
          onCancel={this.handleSearchClear}
          isInsertPart="false"
        />

        <Row className="head-action-bar-line">
          <Col span={24}>
            <span className="pull-right">
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={{ marginLeft: '20px' }}
                disabled={this.state.btnDisabled}
              >
                保存
              </Button>
            </span>
          </Col>
        </Row>
        <Row className="mt20 mb20">
          <h3>基础信息</h3>
        </Row>

        <Form>
          <Row>
            <Col span={13}>
              <FormItem label="优惠券名称" {...formItem5_19}>
                {getFieldDecorator('name', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={13}>
              <FormItem label="折扣比例" {...formItem5_19}>
                {getFieldDecorator('discount_rate', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入大于0小于1的数字" />,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={13}>
              <FormItem label="描述" {...formItem5_19}>
                {getFieldDecorator('remark', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={13}>
              <FormItem label="有效期" {...formItem5_19} required>
                <span>
                  <Radio checked={fixedDateCheck} onChange={this.handleFixedDateChange}>固定日期</Radio>
                  <DateRangeSeletor
                    startTime=""
                    endTime=""
                    onDateChange={this.handleDateChange}
                    isDisabled="false"
                    disabled={!fixedDateCheck}
                  />
                </span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={13}>
              <FormItem label=" " {...formItem5_19}>
                <span style={{ paddingLeft: '20px', marginLeft: '-20px', background: 'white' }}>
                  <Radio
                    checked={!fixedDateCheck}
                    onChange={this.handleAfterDateChange}
                  >
                    领取后，有效天数
                  </Radio>
                  {getFieldDecorator('valid_day')(
                    <span style={{ display: 'inline-block', verticalAlign: 'top' }}>
                      <Input
                        addonAfter="天"
                        type="number"
                        disabled={fixedDateCheck}
                        ref={valid => this.valid = valid}
                        size="large"
                      />
                    </span>,
                  )}
                </span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={13}>
              <FormItem label="领取限制" {...formItem5_19}>
                {getFieldDecorator('limit_count')(
                  <span className="mr10" style={{ display: 'inline-block', verticalAlign: 'top' }}>
                    <Input
                      addonAfter="张"
                      type="number"
                      disabled={this.props.form.getFieldValue('unlimited')}
                      ref={valid => this.limitCount = valid}
                      size="large"
                    />
                  </span>,
                )}
                {getFieldDecorator('unlimited', {
                  onChange: this.handleLimitChange,
                })(
                  <Checkbox>无限制</Checkbox>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>


        <Row className="mb20">
          <h3>优惠项目</h3>
        </Row>
        <Table
          dataSource={items}
          columns={columnsProject}
          pagination={false}
          footer={this.renderItemFooter}
          bordered
          rowKey={record => record._id}
          size="middle"
        />

        <Row className="mb20 mt10">
          <h3>优惠配件</h3>
        </Row>

        <div className="mb20">
          <Table
            dataSource={partTypes}
            columns={columnsParts}
            pagination={false}
            footer={this.renderPartTypeFooter}
            bordered
            rowKey={record => record._id}
            size="middle"
          />
        </div>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
