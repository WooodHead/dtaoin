import React, {Component} from 'react'
import {Link} from 'react-router'
import {message, Breadcrumb, Form, Input, Select, Button, DatePicker, Radio, Row, Col, Icon} from 'antd'
import api from "../../../middleware/api";
import formatter from '../../../middleware/formatter'
import Layout from '../../../components/forms/Layout'
import validator from '../../../middleware/validator'
import MaintainItemTable from '../../../components/tables/aftersales/MaintainItemTable'
import MaintainPartTable from '../../../components/tables/aftersales/MaintainPartTable'
import FormValidator from '../../../components/forms/FormValidator'
import CustomerAutoSearchBox from '../../../components/search/CustomerAutoSearchBox'
import NewCustomerAutoModal from '../../../components/modals/aftersales/NewCustomerAutoModal'
import PayProjectModal from '../../../components/modals/aftersales/PayProjectModal'
import ProjectPrintPayModal from '../../../components/modals/aftersales/ProjectPrintPayModal'
import ProjectPrintDispatchModal from '../../../components/modals/aftersales/ProjectPrintDispatchModal'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_id: this.props.location.query.customer_id,
      user_auto_id: this.props.location.query.user_auto_id,
      maintain_intention_id: this.props.location.query.maintain_intention_id,
      isNew: !this.props.location.query.maintain_intention_id,
      is_show_maintain_advice: false,
      is_show_remark: false,
      is_change: false,
      customer: {},
      memberLevels: [],
      memberPrice: 0,
      user_auto: {},
      maintain_intention: {},
      btnDisable: false,
      maintain_items: new Map(),
      maintain_parts: new Map(),
      deleted_maintain_items: new Set(),
      deleted_maintain_parts: new Set(),
      totalFee: 0
    };
    [
      'getCustomerDetail',
      'getAutoDetail',
      'getMaintainIntentionDetail',
      'setTotalFee',
      'calculateTotalFee',
      'handleSubmit'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
      if (this.state.customer_id) {
        this.getCustomerDetail(this.state.customer_id);
        this.getAutoDetail(this.state.customer_id, this.state.user_auto_id);
        if (this.state.maintain_intention_id) {
          this.getMaintainIntentionDetail(this.state.customer_id, this.state.maintain_intention_id);
        }
      }
      this.getMemberLevels();
  }

  getMemberLevels() {
      api.ajax({url: api.getMemberConfig()}, (data) => {
          this.setState({memberLevels: data.res.member_levels});
      });
  }

  handleLevelChange(levelId) {                         
      this.state.memberLevels.forEach((item) => {
          if (levelId.toString() === item._id.toString()) {
              this.setState({memberPrice: item.price});
          }
      })
  }
  
  getMaintainIntentionDetail(customer_id, maintain_intention_id) {
    api.ajax({url: api.maintProjectByProjectId(customer_id, maintain_intention_id)}, (data) => {
      this.setState({
          maintain_intention: data.res.intention_info,
          is_show_remark: !!data.res.intention_info.remark,
          is_show_maintain_advice: !!data.res.intention_info.maintain_advice
        });
      this.setTotalFee();
    })
  }

  getCustomerDetail(customer_id, customer_name, customer_phone) {
    if (customer_id) {
      api.ajax({url: api.getCustomerDetail(customer_id)}, (data) => {
        this.setState({
            customer_id: customer_id,
            customer: data.res.customer_info
          });
        let form = this.props.form;
        form.setFieldsValue({
              customer_id: customer_id, 
              customer_name: customer_name ? customer_name : this.state.customer.name, 
              gender: this.state.customer.gender, 
              customer_phone: customer_phone ? customer_phone : this.state.customer.phone, 
              member_level: this.state.customer.member_level_name, 
            });
          })                                                                
    } else {
      this.setState({customer: {}});
    } 
  }

  getAutoDetail(customer_id, user_auto_id, plate_num) {
    if (user_auto_id) {
      api.ajax({url: api.getAutoDetail(customer_id, user_auto_id)}, (data) => {
        this.setState({
            user_auto_id: user_auto_id,
            user_auto: data.res.detail
          });
        let form = this.props.form;
        form.setFieldsValue({
              user_auto_id: user_auto_id, 
              auto_type_name: this.state.user_auto ? this.state.user_auto.auto_brand_name +' '+ this.state.user_auto.auto_type_name : '', 
              plate_num: plate_num ? plate_num : this.state.user_auto.plate_num, 
              vin_num: this.state.user_auto.vin_num, 
            });
          })                                                                
    } else {
      this.setState({user_auto: {}});
    } 
  }


  handleDateChange(field, value) {
    this.setState({[field]: value});
  }

  showMaintainAdvice() {
    this.setState({is_show_maintain_advice: !this.state.is_show_maintain_advice});
  }

  showRemark() {
    this.setState({is_show_remark: !this.state.is_show_remark});
  }

  handleMaintainItemUpdate(maintain_items, deleted_maintain_items) {
    this.setState({maintain_items: maintain_items, deleted_maintain_items: deleted_maintain_items});
    this.setTotalFee();
  }

  handleMaintainPartUpdate(maintain_parts, deleted_maintain_parts) {
    this.setState({maintain_parts: maintain_parts, deleted_maintain_parts: deleted_maintain_parts});
    this.setTotalFee();
  }

  handleSearchSelect(data) {
    location.hash = '/aftersales/project/create/?customer_id='+data.customer_id+'&user_auto_id='+data._id
    location.reload();
    //this.getCustomerDetail(data.customer_id, data.customer_name, data.customer_phone);
    //this.getAutoDetail(data.customer_id, data._id, data.plate_num);
  }

  calculateTotalMaterialFee() {
    let {maintain_parts} = this.state,
      materialFee = 0;
    for ( let value of maintain_parts.values() ) {
      let mf = Number(value.material_fee);
      if (!isNaN(mf)) {
        materialFee += mf;
      }
    }
    return materialFee;
  }

  calculateTotalTimeFee() {
    let {maintain_items} = this.state,
      timeFee = 0;
    for ( let value of maintain_items.values() ) {
      let tf = Number(value.time_fee);
      if (!isNaN(tf)) {
        timeFee += tf;
      }
    }
    return timeFee;
  }

  setTotalFee() {
    let totalFee = this.calculateTotalFee();
    this.setState({totalFee: totalFee});
  }

  handleFieldChange(field, e) {
    let coupon = (field == 'coupon') ? e.target.value : this.state.coupon;
    let group_purchase = (field == 'group_purchase') ? e.target.value : this.state.group_purchase;
    let discount = (field == 'discount') ? e.target.value : this.state.discount;

    let totalFee = this.calculateTotalFee(coupon, group_purchase, discount);
    this.setState({totalFee: totalFee, [field]: e.target.value});
  }

  calculateTotalFee(coupon_input, group_purchase_input, discount_input) {
    let form = this.props.form,
      coupon = coupon_input ? coupon_input : form.getFieldProps('coupon').value,
      group_purchase = group_purchase_input ? group_purchase_input : form.getFieldProps('group_purchase').value,
      discount = discount_input ? discount_input : form.getFieldProps('discount').value,
      timeFee = this.calculateTotalTimeFee(),
      materialFee = this.calculateTotalMaterialFee(),
      totalFee = 0;

    if (!isNaN(timeFee)) {
      totalFee += timeFee;
    }
    if (!isNaN(materialFee)) {
      totalFee += materialFee;
    }
    if (!isNaN(Number(discount))) {
      totalFee -= Number(discount);
    } else if (this.state.maintain_intention) {
      totalFee -= Number(this.state.maintain_intention.discount) ? Number(this.state.maintain_intention.discount) : 0;
    }
    if (!isNaN(Number(group_purchase))) {
      totalFee -= Number(group_purchase);
    } else if (this.state.maintain_intention) {
      totalFee -= Number(this.state.maintain_intention.group_purchase) ? Number(this.state.maintain_intention.group_purchase) : 0;
    }
    if (!isNaN(Number(coupon))) {
      totalFee -= Number(coupon);
    } else if (this.state.maintain_intention) {
      totalFee -= Number(this.state.maintain_intention.coupon) ? Number(this.state.maintain_intention.coupon) : 0;
    }

    return totalFee;
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.hasError);
        return;
      }

      if (this.state.btnDisable) {
        return;
      }

      let {isNew, maintain_items, maintain_parts, deleted_maintain_items, deleted_maintain_parts} = this.state,
        itemNames = [],
        partNames = [],
        items = [],
        parts = [],
        deleteItemIds = new Set(),
        deletePartIds = new Set();

      if (!isNew) {
        if (deleted_maintain_items) {
          for (let item_id of deleted_maintain_items.values()) {
            deleteItemIds.add(item_id);
          }
        }
        if (deleted_maintain_items) {
          for (let part_id of deleted_maintain_parts.values()) {
            deletePartIds.add(part_id);
          }
        }
        values.item_delete_ids = Array.from(deleteItemIds).toString();
        values.part_delete_ids = Array.from(deletePartIds).toString();
      }

      for (let item of maintain_items.values()) {
        itemNames.push(item.item_name);
        items.push(item);
      }
      let partMap_count = 1;
      for (let part of maintain_parts.values()) {
        partNames.push(part.part_name);
        parts.push(part);
      }

      values.start_time = formatter.date(this.state.startDate);
      values.scheduled_end_time = formatter.date(values.scheduled_end_time);
      values.item_names = itemNames.toString();
      values.part_names = partNames.toString();
      values.item_list = JSON.stringify(items);
      values.part_list = JSON.stringify(parts);
      values.total_fee = this.calculateTotalFee();

      this.setState({btnDisable: true});
      api.ajax({
        url: isNew ? api.addMaintainIntention() : api.editMaintainIntention(),
        type: 'POST',
        data: values
      }, (data) => {
        message.success(isNew ? '新增维保记录成功' : '修改维保记录成功');
        //let {maintain_intention} = this.state;
        //maintain_intention._id = data.res.intention_id;
        //this.setState({
        //  maintain_intention_id: data.res.intention_id,
        //  maintain_intention: maintain_intention,
        //  isNew: false,
        //  is_change: false,
        //});
        location.hash = '/aftersales/project/create/?customer_id='+data.res.customer_id+'&user_auto_id='+data.res.user_auto_id+'&maintain_intention_id='+data.res.intention_id
        location.reload();
      }, (error) => {
        console.log("commit error");
        console.error(error);
        //this.setState({btnDisable: false});
        location.reload();
      });
    })
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    let {
      isNew,
      btnDisable,
      fitterAdmins,
      customer,
      user_auto,
      maintain_intention
    } = this.state;

    let materialFee = this.calculateTotalMaterialFee(),
      timeFee = this.calculateTotalTimeFee();

    const mileageProps = getFieldProps('mileage', {initialValue: maintain_intention.mileage}, {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: false, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const plateNumProps = getFieldProps('plate_num', {
      initialValue: user_auto.plate_num,
      validate: [{
        rules: [{validator: FormValidator.validatePlateNumber}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.plateNumber}],
        trigger: 'onBlur'
      }]
    });

    let isPayModalDisabled = true;
    if (this.state.maintain_intention_id && Number(this.state.maintain_intention.status) !== 3) {
      isPayModalDisabled = false;
    }
    let isSaveButtonDisabled = false;
    if (this.state.maintain_intention_id && Number(this.state.maintain_intention.status) >= 3) {
      isSaveButtonDisabled = true;
    }

    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>售后/工单管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              创建工单
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

      <Form horizontal >
        <div>
        <Row>
          <Col span="6">
            <CustomerAutoSearchBox
              api={api.searchCustomerAutos()}
              select={this.handleSearchSelect.bind(this)}
              style={{width: 250}}
              className="no-print"/>
          </Col>

          <Col span="18">
            <span className="pull-right">
              <FormItem>
                <ProjectPrintPayModal isDisabled={this.state.is_change} project={this.state.maintain_intention} customer={this.state.customer} auto={this.state.user_auto} items={this.state.maintain_items} parts={this.state.maintain_parts} materialFee={materialFee} timeFee={timeFee}/>
                <ProjectPrintDispatchModal isDisabled={this.state.is_change} project={this.state.maintain_intention} customer={this.state.customer} auto={this.state.user_auto} items={this.state.maintain_items} parts={this.state.maintain_parts} />
                <PayProjectModal size="default" isDisabled={this.state.is_change || isPayModalDisabled} customer_id={this.state.customer_id} project_id={this.state.maintain_intention_id} />
                <Button type="primary" size="default" onClick={this.handleSubmit} disabled={btnDisable || isSaveButtonDisabled}>保存</Button>
              </FormItem>
            </span>
          </Col>
        </Row>
        </div>

        <Input type="hidden" {...getFieldProps('_id', {initialValue: this.state.maintain_intention._id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.state.customer_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: this.state.user_auto_id})}/>


        <div className="form-board">
          <Row className="margin-top-20">
            <Col span="8">
              <FormItem label="手机号" labelCol={{span: 6}} wrapperCol={{span: 14}} required>
                <Input disabled {...getFieldProps('customer_phone', {initialValue: customer.phone})} placeholder="请在左上角搜索"/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="客户姓名" labelCol={{span: 6}} wrapperCol={{span: 14}} required>
                <Row>
                  <Col span="17">
                    <Input {...getFieldProps('customer_name', {initialValue: customer.name})}/>
                  </Col>
                  <Col span="7">
                    <Select
                      {...getFieldProps('gender', {initialValue: customer.gender ? customer.gender : 1})}
                      {...selectStyle}>
                      <Option value={1}>男士</Option>
                      <Option value={0}>女士</Option>
                      <Option value={-1}>未知</Option>
                    </Select>
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="会员卡类型" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Row>
                  <Col span="18">
                    <Select disabled
                      onSelect={this.handleLevelChange.bind(this)}
                      {...getFieldProps('member_level', {initialValue: customer.member_level_name})}
                      size="large"
                      {...selectStyle}>
                      {this.state.memberLevels.map(level => <Option key={level._id}>{level.desc}</Option>)}
                    </Select>
                  </Col>
                  <Col span="2">
                    <p className="ant-form-split">--</p>
                  </Col>
                  <Col span="4">
                    <p className="ant-form-text">{customer.member_price}元</p>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="车牌号" labelCol={{span: 6}} wrapperCol={{span: 14}} required>
                <Input {...plateNumProps} placeholder="请输入车牌号"/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="车型信息" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Input {...getFieldProps('auto_type_name', {initialValue: user_auto.auto_brand_name ? user_auto.auto_brand_name +' '+ user_auto.auto_type_name : ''})} disabled/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="车架号" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Input {...getFieldProps('vin_num', {initialValue: user_auto.vin_num})}/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="是否事故车" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <RadioGroup {...getFieldProps('is_accident', {initialValue: '0'})}>
                  <Radio value="0">否</Radio>
                  <Radio value="1">是</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="里程数" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Input {...getFieldProps('mileage', {initialValue: maintain_intention.mileage})} addonAfter="公里"/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="预计出厂日期" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <DatePicker
                  {...getFieldProps('scheduled_end_time', {initialValue: maintain_intention.scheduled_end_time ? maintain_intention.scheduled_end_time : new Date()})}
                  placeholder="请选择出厂时间"/>
              </FormItem>
            </Col>
          </Row>

        </div>

        <Row className="margin-top-20">
          <Col span="8">
          -预检信息
          </Col>
          <Col span="16">
            <span className="pull-right">
              <Button type="ghost" className="mr15" onClick={this.showMaintainAdvice.bind(this)}>维修建议</Button>
              <Button type="ghost" onClick={this.showRemark.bind(this)}>备注</Button>
            </span>
          </Col>
        </Row>
        <div className="form-board">
        <Row className="margin-top-20">
          <Col span="24">
              <FormItem label="故障描述" labelCol={{span: 2}} wrapperCol={{span: 21}}>
                <Input type="textarea" {...getFieldProps('failure_desc', {initialValue: maintain_intention.failure_desc})}/>
              </FormItem>
          </Col>
        </Row>
        <Row className={this.state.is_show_maintain_advice ? 'is_show_maintain_advice' : 'hide'}>
          <Col span="24">
              <FormItem label="维修建议" labelCol={{span: 2}} wrapperCol={{span: 21}}>
                <Input type="textarea" {...getFieldProps('maintain_advice', {initialValue: maintain_intention.maintain_advice})}/>
              </FormItem>
          </Col>
        </Row>
        <Row className={this.state.is_show_remark ? 'is_show_remark' : 'hide'}>
          <Col span="24">
              <FormItem label="备注" labelCol={{span: 2}} wrapperCol={{span: 21}}>
                <Input type="textarea" {...getFieldProps('remark', {initialValue: maintain_intention.remark})}/>
              </FormItem>
          </Col>
        </Row>
        </div>

        <MaintainItemTable intention_id={this.state.maintain_intention_id} customer_id={this.state.customer_id} onSuccess={this.handleMaintainItemUpdate.bind(this)}/>

        <MaintainPartTable intention_id={this.state.maintain_intention_id} customer_id={this.state.customer_id} onSuccess={this.handleMaintainPartUpdate.bind(this)}/>

        <Row className="margin-top-20">
          <Col span="8">
            -结算信息
          </Col>
        </Row>

        <div className="form-board">
        <Row className="margin-top-20">
          <Col span="6">
            <FormItem label="结算金额" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <p className="ant-form-text">{Number(materialFee + timeFee).toFixed(2)}元</p>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="优惠券抵扣" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <Input
                type="number" {...getFieldProps('coupon', {initialValue: maintain_intention.coupon, onChange: this.handleFieldChange.bind(this, 'coupon')})}
                defaultValue="0.00"
                placeholder="优惠券抵扣金额"
                min={0.00}
                addonAfter="元"/>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="团购抵扣" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <Input
                type="number" {...getFieldProps('group_purchase', {initialValue: maintain_intention.group_purchase, onChange: this.handleFieldChange.bind(this, 'group_purchase')})}
                defaultValue="0.00"
                placeholder="团购抵扣金额"
                min={0.00}
                addonAfter="元"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="抹零优惠" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <Input
                type="number" {...getFieldProps('discount', {initialValue: maintain_intention.discount, onChange: this.handleFieldChange.bind(this, 'discount')})}
                defaultValue="0.00"
                placeholder="抹零优惠金额"
                min={0.00}
                addonAfter="元"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <span className="pull-right">
            <FormItem label="实收金额" labelCol={{span: 14}} wrapperCol={{span: 6}}>
              <p className="ant-form-text">{Number(this.state.totalFee).toFixed(2)}元</p>
            </FormItem>
            </span>
          </Col>
        </Row>
        </div>

      </Form>
      </div>
    )
  }
}

Create = Form.create()(Create);
export default Create
