import React from 'react';
import { message, Form, Input, Select, Button, Row, Col } from 'antd';
import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';
import MaintainPartTypeSearchBox from '../../../components/search/MaintainPartTypeSearchBox';
import PartSearchBox from '../../../components/search/PartSearchBox';

const FormItem = Form.Item;
const Option = Select.Option;

class FormPart extends BaseModal {
  constructor(props) {
    super(props);
    this.setMaintainPartName(props.maintain_part, props.memberDetailList);
    this.state = {
      maintain_part: this.props.maintain_part ? this.props.maintain_part : {},
      memberDetailList: this.props.memberDetailList,
    };
    [
      'updateState',
      'handleFocusBlur',
      'getPreferentialAmount',
      'getPaidAmount',
      'setformDataTypeRate',
      'setMaintainPartName',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    if (this.props.maintain_part && parseInt(this.props.maintain_part.part_id) > 0) {
      api.ajax({ url: api.warehouse.part.detail(this.props.maintain_part.part_id) }, data => {
        const { maintain_part } = this.state;
        maintain_part.part_amount = Number(data.res.detail.amount) - Number(data.res.detail.freeze);
        if (maintain_part._id) {
          maintain_part.part_amount += Number(maintain_part.real_count);
        }
        this.setState({ maintain_part });
      });
    }
  }

  handleMaterialFeeBaseChange(event) {
    const materialFeeBase = event.target.value;

    const { maintain_part } = this.state;

    if (maintain_part) {
      maintain_part.material_fee_base = materialFeeBase;
      maintain_part.material_fee = maintain_part.count * materialFeeBase;
      //
      this.setformDataTypeRate(maintain_part, this.state.memberDetailList);
      maintain_part.coupon_discount = this.getPreferentialAmount(maintain_part);
      maintain_part.paid_amount = this.getPaidAmount(maintain_part);
    }

    this.setState({
      maintain_part,
    });
    const form = this.props.form;
    form.setFieldsValue({
      material_fee_base: maintain_part.material_fee_base,
    });
  }

  handleMaterialCountChange(event) {
    const count = event.target.value;

    const { maintain_part } = this.state;
    if (maintain_part) {
      maintain_part.count = count;
      maintain_part.material_fee = maintain_part.material_fee_base * count;

      this.setformDataTypeRate(maintain_part, this.state.memberDetailList);
      maintain_part.coupon_discount = this.getPreferentialAmount(maintain_part);
      maintain_part.paid_amount = this.getPaidAmount(maintain_part);
    }

    this.setState({
      maintain_part,
    });

    const form = this.props.form;
    form.setFieldsValue({
      count: maintain_part.count,
    });
  }

  handleRealCountChange(event) {
    let real_count = event.target.value;
    if (Number(real_count) > Number(this.state.maintain_part.part_amount)) {
      real_count = this.state.maintain_part.part_amount;
      message.warning('配件数量不够');
      return;
    }

    const { maintain_part } = this.state;
    maintain_part.real_count = real_count;
    maintain_part.remain_count = Number(this.state.maintain_part.part_amount) - Number(real_count);

    this.setState({ maintain_part });
    const form = this.props.form;
    form.setFieldsValue({
      real_count: maintain_part.real_count,
    });
  }

  updateState(obj) {
    this.setState(obj);
  }

  handleLevelSelect(value, option) {
    const { maintain_part } = this.state;

    const index = option.props.index;
    const list = maintain_part.levels;

    if (maintain_part) {
      maintain_part.material_fee_base = list[index].price;
      maintain_part.material_fee = maintain_part.count * list[index].price;
    }

    this.setState({ maintain_part });
    const form = this.props.form;
    form.setFieldsValue({
      material_fee_base: maintain_part.material_fee_base,
    });
  }

  handlePartSelect(data) {
    const part = data.data;
    const { maintain_part } = this.state;

    if (maintain_part) {
      maintain_part.part_id = part._id;
      maintain_part.part_name = part.name;
      maintain_part.part_amount = part.amount - part.freeze;
      maintain_part.part_freeze = part.freeze;
      maintain_part.material_fee_base = 0;
      maintain_part.material_fee = 0;
      maintain_part.count = 1;
      maintain_part.coupon_discount = 0;
      maintain_part.scope = part.scope;
      maintain_part.part_spec = part.spec;
      maintain_part.part_unit = part.unit;
      maintain_part.maintain_type = part.maintain_type;
      maintain_part.maintain_type_name = part.maintain_type_name;
      maintain_part.remain_count = part.amount - part.freeze;
    }

    this.setState({ maintain_part });
  }

  handlePartTypeSelect(optPart) {
    const { maintain_part } = this.state;

    maintain_part._id = maintain_part._id ? maintain_part._id : 0;

    maintain_part.part_type_id = optPart._id;
    maintain_part.part_type_name = optPart.name;
    maintain_part.levels = optPart.levels ? JSON.parse(optPart.levels) : [];
    maintain_part.count = maintain_part.count ? maintain_part.count : 1;
    maintain_part.material_fee = maintain_part.material_fee ? maintain_part.material_fee : 0.00;

    this.setState({ maintain_part });

    const form = this.props.form;
    form.setFieldsValue({
      level_name: (maintain_part.levels.length == 0) ? '现场报价' : '',
      material_fee_base: 0,
    });
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  }

  getPreferentialAmount(record) {
    switch (Number(record.type)) {
    case 1:
      if (Number(record.count) >= Number(record.coupon_part_count)) {
        return Number(record.coupon_part_count) * (Number(record.material_fee_base) - Number(record.coupon_price || '0'));
      } else {
        return Number(record.count) * (Number(record.material_fee_base) - Number(record.coupon_price || '0'));
      }
    case 2:
      if (Number(record.count) >= Number(record.coupon_part_count)) {
        return Number(record.coupon_part_count * (1 - record.discount_rate) * record.material_fee_base).toFixed(2);
      } else {
        return Number(record.count * (1 - record.discount_rate) * record.material_fee_base).toFixed(2);
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

  setformDataTypeRate(formData, memberDetailList) {
    if (memberDetailList) {
      memberDetailList.map(item => {
        if (Number(item._id) === Number(formData.customer_coupon_item_id)) {
          formData.type = item.coupon_item_info.type;
          formData.discount_rate = item.coupon_item_info.discount_rate;
          if (formData.item_id) {
            item.coupon_item_info.items.map(value => {
              if (String(value._id) === String(formData.item_id)) {
                formData.coupon_price = value.price || 0;
              }
            });
          } else if (formData.part_type_id) {
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

  setMaintainPartName(maintain_part, memberDetailList) {
    if (memberDetailList) {
      memberDetailList.map(item => {
        if (Number(item._id) === Number(maintain_part.customer_coupon_item_id)) {
          maintain_part.type = item.coupon_item_info.type;
          maintain_part.discount_rate = item.coupon_item_info.discount_rate;
          maintain_part.name = item.name;
        }
      });
    }
  }

  handleCommit(e) {
    e.preventDefault();
    const formData = this.props.form.getFieldsValue();
    const { maintain_parts } = this.props;

    if (maintain_parts) {
      for (const key of maintain_parts) {
        if (Number(key[0]) === Number(formData.part_type_id)) {
          message.warn('该项目已经添加,请重新选择');
          return;
        }
      }
    }

    if (!formData.material_fee_base) {
      formData.material_fee_base = 0;
    }

    if (!formData.part_id) {
      message.warning('配件不存在');
      return;
    }

    if (Number(formData.real_count) > Number(this.state.maintain_part.part_amount)) {
      message.warning('配件数量不够');
      return;
    }

    this.setformDataTypeRate(formData, this.state.memberDetailList);
    formData.coupon_discount = this.getPreferentialAmount(formData);
    formData.paid_amount = this.getPaidAmount(formData);
    formData.material_fee = formData.count * formData.material_fee_base;

    this.props.onSuccess(formData);
    this.props.form.resetFields();
  }

  handleCommitNext(e) {
    e.preventDefault();
    const formData = this.props.form.getFieldsValue();
    const { maintain_parts } = this.props;

    if (maintain_parts) {
      for (const key of maintain_parts) {
        if (Number(key[0]) === Number(formData.part_id)) {
          message.warn('该项目已经添加,请重新选择');
          return;
        }
      }
    }

    if (!formData.part_id) {
      message.warning('配件不存在');
      return;
    }

    if (!formData.material_fee_base) {
      formData.material_fee_base = 0;
    }

    if (Number(formData.real_count) > Number(this.state.maintain_part.part_amount)) {
      message.warning('配件数量不够');
      return;
    }

    formData.coupon_discount = this.getPreferentialAmount(formData);
    formData.paid_amount = this.getPaidAmount(formData);
    formData.material_fee = formData.count * formData.material_fee_base;

    this.props.onSuccess(formData, false);
    message.success('添加成功，请继续添加下一个');
    this.props.form.resetFields();
  }

  render() {
    const { formItem8_15 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { maintain_part } = this.state;
    const part_type_data = maintain_part.part_type_id ? [{
      _id: maintain_part.part_type_id,
      name: maintain_part.part_type_name,
    }] : [];
    const part_data = maintain_part.part_id ? [{ _id: maintain_part.part_id, name: maintain_part.part_name }] : [];

    return (
      <Form>
        {getFieldDecorator('_id', { initialValue: maintain_part._id })(<Input type="hidden"/>)}
        {getFieldDecorator('part_type_id', { initialValue: maintain_part.part_type_id })(<Input type="hidden"/>)}
        {getFieldDecorator('part_type_name', { initialValue: maintain_part.part_type_name })(<Input type="hidden"/>)}
        {getFieldDecorator('part_id', { initialValue: maintain_part.part_id })(<Input type="hidden"/>)}
        {getFieldDecorator('part_name', { initialValue: maintain_part.part_name })(<Input type="hidden"/>)}
        {getFieldDecorator('part_spec', { initialValue: maintain_part.part_spec })(<Input type="hidden"/>)}
        {getFieldDecorator('part_unit', { initialValue: maintain_part.part_unit })(<Input type="hidden"/>)}
        {getFieldDecorator('scope', { initialValue: maintain_part.scope })(<Input type="hidden"/>)}
        {getFieldDecorator('maintain_type', { initialValue: maintain_part.maintain_type })(<Input type="hidden"/>)}
        {getFieldDecorator('type', { initialValue: maintain_part.type })(<Input type="hidden"/>)}
        {getFieldDecorator('discount_rate', { initialValue: maintain_part.discount_rate })(<Input type="hidden"/>)}
        {getFieldDecorator('customer_coupon_item_id', { initialValue: maintain_part.customer_coupon_item_id })(<Input
          type="hidden"/>)}
        {getFieldDecorator('maintain_type_name', { initialValue: maintain_part.maintain_type_name })(<Input
          type="hidden"/>)}
        {getFieldDecorator('coupon_discount', { initialValue: maintain_part.coupon_discount })(<Input type="hidden"/>)}

        <Row>
          <Col span={12}>
            <FormItem label="配件分类" {...formItem8_15} required>
              <MaintainPartTypeSearchBox
                value={maintain_part.part_type_name}
                data={part_type_data}
                select={this.handlePartTypeSelect.bind(this)}
                style={{ width: '100%' }}
                disabled={this.props.projectDisabled}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="分类档次" {...formItem8_15}>
              {getFieldDecorator('level_name', { initialValue: maintain_part.level_name })(
                <Select
                  filterOption={false}
                  onSelect={this.handleLevelSelect.bind(this)}
                  disabled={!maintain_part.levels}
                  optionFilterProp="children"
                  placeholder="请选择档次">
                  {maintain_part.levels && maintain_part.levels.map(part => <Option
                    key={part.name}>{part.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="配件名称" {...formItem8_15} required>
              <PartSearchBox
                value={maintain_part.part_name ? `${maintain_part.part_name  } ${  maintain_part.scope}` : ''}
                data={part_data}
                part_type_id={maintain_part.part_type_id}
                select={this.handlePartSelect.bind(this)}
              />
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="配件单价" {...formItem8_15}>
              {getFieldDecorator('material_fee_base', { initialValue: maintain_part.material_fee_base })(
                <Input
                  type="number"
                  disabled={maintain_part.levels && maintain_part.levels.length > 0}
                  onChange={this.handleMaterialFeeBaseChange.bind(this)}
                  min={0}
                  step={0.01}
                  placeholder="配件单价"
                  addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-line-divider"/>

        <Row>
          <Col span={12}>
            <FormItem label="计费数量" {...formItem8_15}>
              {getFieldDecorator('count', { initialValue: maintain_part.part_type_id ? maintain_part.count : '' })(
                <Input
                  type="number"
                  disabled={!!maintain_part._id}
                  onChange={this.handleMaterialCountChange.bind(this)}
                  min={1}
                  step={1}
                  placeholder="客户显示数量"
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="领料数量" {...formItem8_15}>
              {getFieldDecorator('real_count', { initialValue: maintain_part.real_count ? maintain_part.real_count : '' })(
                <Input
                  type="number"
                  onChange={this.handleRealCountChange.bind(this)}
                  min={1}
                  step={1}
                  placeholder="实际使用数量"
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="剩余库存" {...formItem8_15}>
              {getFieldDecorator('remain_count', { initialValue: maintain_part.part_name ? (maintain_part.real_count ? maintain_part.part_amount - maintain_part.real_count : maintain_part.part_amount) : 0 })(
                <Input type="number" disabled/>
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-line-divider"/>

        <Row>
          <Col span={12}>
            <FormItem label="优惠券名称" {...formItem8_15}>
              {getFieldDecorator('coupon_item_name', { initialValue: maintain_part.name || '' })(
                <Input disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="优惠数量" {...formItem8_15}>
              {getFieldDecorator('coupon_part_count', { initialValue: maintain_part.coupon_part_count })(
                <Input
                  type="number"
                  disabled min={1}
                  step={1}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="优惠金额" {...formItem8_15}>
              {getFieldDecorator('coupon_discount', { initialValue: maintain_part.coupon_discount })(
                <Input
                  type="number"
                  disabled min={0}
                  step={1}
                  placeholder="优惠金额"
                  addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="实收金额" className="no-margin-bottom"  {...formItem8_15}>
              {getFieldDecorator('paid_amount', { initialValue: Number(maintain_part.material_fee - (maintain_part.coupon_discount || 0)).toFixed(2) })(
                <Input
                  type="number"
                  disabled min={0} step={1} placeholder="实收金额"
                  addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-action-container">
          <Button type="ghost" size="large" className="mr10" onClick={this.handleCommit.bind(this)}>完成</Button>
          <Button type="primary" size="large" onClick={this.handleCommitNext.bind(this)}>继续添加</Button>
        </div>
      </Form>
    );
  }
}

FormPart = Form.create()(FormPart);
export default FormPart;
