import React, {Component} from 'react';
import {message, Form, Input, Select, Button, DatePicker, Radio, Row, Col, Checkbox} from 'antd';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import MaintainItemTable from '../../../components/tables/aftersales/MaintainItemTable';
import MaintainPartTable from '../../../components/tables/aftersales/MaintainPartTable';
import CustomerAutoSearchBox from '../../../components/search/CustomerAutoSearchBox';
import PayProjectModal from '../../../components/modals/aftersales/PayProjectModal';
import ProjectPrintPayModal from '../../../components/modals/aftersales/ProjectPrintPayModal';
import ProjectPrintDispatchModal from '../../../components/modals/aftersales/ProjectPrintDispatchModal';
import MemberCardTypeInfoTable from './MemberCardTypeInfoTable';
import EditAutoModal from '../../../components/modals/presales/EditAutoModal';
import NewAutoModal from '../../../components/modals/aftersales/NewAutoModal';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_id: this.props.location.query.customer_id,
      auto_id: this.props.location.query.auto_id,
      maintain_intention_id: this.props.location.query.maintain_intention_id,
      isNew: !this.props.location.query.maintain_intention_id,
      is_show_maintain_advice: false,
      is_show_remark: false,
      is_change: false,
      is_realTotalFee: false,
      customer: {},
      memberPrice: 0,
      auto: {},
      autos: [],
      maintain_intention: {},
      btnDisable: false,
      maintain_items: new Map(),
      maintain_parts: new Map(),
      deleted_maintain_items: new Set(),
      deleted_maintain_parts: new Set(),
      totalFee: 0,
      realTotalFee: 0,
      coupon: 0.00,
      group_purchase: 0.00,
      discount: '',
      couponItem: [],
      couponPartType: [],
      couponItemFilteredRemoved: [],
      isRounding: false,
      memberDetailList: [],
    };
    [
      'getCustomerDetail',
      'getAutoDetail',
      'getMaintainIntentionDetail',
      'setTotalFee',
      'calculateTotalFee',
      'handleSubmit',
      'getcouponItem',
      'getcouponPartType',
      'addMaintainItem',
      'getcouponItemRemoved',
      'removeMaintainItem',
      'addMaintainPart',
      'removeMaintainPart',
      'getcouponPartsRemoved',
      'handleCheckBoxChange',
      'handleMaintainItemUpdate',
      'setMemberDetailList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    if (this.state.customer_id) {
      this.getCustomerDetail(this.state.customer_id);
      this.getUserAutos(this.state.customer_id);
      this.getAutoDetail(this.state.customer_id, this.state.auto_id);
      if (this.state.maintain_intention_id) {
        this.getMaintainIntentionDetail(this.state.customer_id, this.state.maintain_intention_id);
      }
    }
  }

  setMemberDetailList(memberDetailList) {
    this.setState({
      memberDetailList: memberDetailList,
    });
  }

  handleCheckBoxChange(e) {
    const totalFee = Number(this.state.totalFee);
    const coupon = Number(this.state.coupon);
    const group_purchase = Number(this.state.group_purchase);

    let realTotalFee, discount, is_realTotalFee;

    if (e.target.checked) {
      realTotalFee = parseInt(totalFee - coupon - group_purchase).toFixed(2);
      discount = Number(totalFee - realTotalFee - coupon - group_purchase).toFixed(2);
      is_realTotalFee = true;
    } else {
      realTotalFee = (totalFee - coupon - group_purchase).toFixed(2);
      discount = 0;
      is_realTotalFee = false;
    }

    this.setState({
      realTotalFee: realTotalFee,
      discount: discount,
      is_realTotalFee: is_realTotalFee,
    });
  }

  getcouponItem(couponItem) {
    couponItem.map((item) => {
      this.addMaintainItem(item);
    });
  }

  getcouponPartType(couponPartType) {
    couponPartType.map((item) => {
      this.addMaintainPart(item);
    });
  }

  getcouponItemRemoved(couponItemFilteredRemoved) {
    couponItemFilteredRemoved.map((item) => {
      this.removeMaintainItem(item.item_id, item._id);
    });
  }

  getcouponPartsRemoved(couponPartsFilteredRemoved) {
    couponPartsFilteredRemoved.map((item) => {
      this.removeMaintainPart(item.part_type_id, item._id);
    });
  }

  addMaintainItem(maintain_item) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.set(maintain_item.item_id, maintain_item);
    this.handleMaintainItemUpdate(maintain_items, deleted_maintain_items);
  }

  removeMaintainItem(item_id, _id) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.delete(item_id);
    if (_id) {
      deleted_maintain_items.add(_id);
    }
    this.handleMaintainItemUpdate(maintain_items, deleted_maintain_items);
  }

  addMaintainPart(maintain_part) {
    let {maintain_parts, deleted_maintain_parts} = this.state;
    maintain_parts.set(maintain_part.part_type_id, maintain_part);
    this.handleMaintainPartUpdate(maintain_parts, deleted_maintain_parts);
  }

  removeMaintainPart(part_type_id, _id) {
    let {maintain_parts, deleted_maintain_parts} = this.state;
    maintain_parts.delete(part_type_id);
    if (_id) {
      deleted_maintain_parts.add(_id);
    }
    this.handleMaintainPartUpdate(maintain_parts, deleted_maintain_parts);
  }

  handleUserAutoChange(id) {
    this.state.autos.forEach((item) => {
      if (id.toString() === item._id.toString()) {
        this.setState({auto: item, auto_id: id});
        let form = this.props.form;
        form.setFieldsValue({
          auto_id: id,
          auto_type_name: item.auto_type_name,
          plate_num: item.plate_num,
          vin_num: item.vin_num,
        });
      }
    });
  }

  getMaintainIntentionDetail(customer_id, maintain_intention_id) {
    api.ajax({url: api.maintProjectByProjectId(customer_id, maintain_intention_id)}, (data) => {
      this.setState({
        maintain_intention: data.res.intention_info,
        is_show_remark: !!data.res.intention_info.remark,
        is_show_maintain_advice: !!data.res.intention_info.maintain_advice,
        discount: data.res.intention_info.discount,
        realTotalFee: data.res.intention_info.total_fee,
        coupon: data.res.intention_info.coupon,
        group_purchase: data.res.intention_info.group_purchase,
        is_realTotalFee: data.res.intention_info.discount > 0,
      });
      // this.setTotalFee();
    });
  }

  getCustomerDetail(customer_id, customer_name, customer_phone) {
    if (customer_id) {
      api.ajax({url: api.customer.detail(customer_id)}, (data) => {
        this.setState({
          customer_id: customer_id,
          customer: data.res.customer_info,
        });
        let form = this.props.form;
        form.setFieldsValue({
          customer_id: customer_id,
          customer_name: customer_name ? customer_name : this.state.customer.name,
          gender: this.state.customer.gender,
          customer_phone: customer_phone ? customer_phone : this.state.customer.phone,
          member_level: this.state.customer.member_level_name,
        });
      });
    } else {
      this.setState({customer: {}});
    }
  }

  getAutoDetail(customer_id, auto_id, plate_num) {
    if (Number(auto_id)) {
      api.ajax({url: api.auto.detail(customer_id, auto_id)}, (data) => {
        this.setState({
          auto_id: auto_id,
          auto: data.res.detail ? data.res.detail : {},
        });
        let form = this.props.form;
        form.setFieldsValue({
          auto_id: auto_id,
          auto_type_name: this.state.auto ? this.state.auto.auto_brand_name + ' ' + this.state.auto.auto_series_name + ' ' + this.state.auto.auto_type_name : '',
          plate_num: plate_num ? plate_num : this.state.auto.plate_num,
          vin_num: this.state.auto.vin_num,
        });
      });
    } else {
      this.setState({auto: {}});
    }
  }

  getUserAutos(customer_id) {
    api.ajax({url: api.superUserAutoList(customer_id)}, (data) => {
      this.setState({autos: data.res.auto_list});
    });
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
    location.href = '/aftersales/project/create/?customer_id=' + data.customer_id + '&auto_id=' + data._id;
    // location.reload();
    // window.location.href = '/aftersales/project/create/?customer_id=' + data.customer_id + '&auto_id=' + data._id;
  }

  calculateTotalMaterialFee() {
    let {maintain_parts} = this.state,
      materialFee = 0;
    for (let value of maintain_parts.values()) {
      let mf = Number(value.material_fee);
      let couponDiscountf = Number(value.coupon_discount);
      if (!isNaN(mf)) {
        materialFee += mf;
        materialFee -= couponDiscountf;
      }
    }
    return materialFee;
  }

  calculateTotalTimeFee() {
    let {maintain_items} = this.state,
      timeFee = 0;
    for (let value of maintain_items.values()) {
      let tf = Number(value.time_fee);
      let couponDiscountt = Number(value.coupon_discount);
      if (!isNaN(tf)) {
        timeFee += tf;
        timeFee -= couponDiscountt;
      }
    }
    return timeFee;
  }

  setTotalFee() {
    const coupon = Number(this.state.coupon);
    const group_purchase = Number(this.state.group_purchase);

    let totalFee = this.calculateTotalFee();
    let realTotalFee, discount;
    if (this.state.is_realTotalFee) {
      realTotalFee = parseInt(totalFee - coupon - group_purchase).toFixed(2);
      discount = Number(totalFee - realTotalFee - coupon - group_purchase).toFixed(2);
    } else {
      realTotalFee = (totalFee - coupon - group_purchase).toFixed(2);
      discount = 0;
    }

    this.setState({
      totalFee: totalFee,
      realTotalFee: realTotalFee,
      discount: discount,
    });
  }

  handleFieldChange(field, e) {
    let coupon = Number((field == 'coupon') ? e.target.value : this.state.coupon).toFixed(2);
    let group_purchase = Number((field == 'group_purchase') ? e.target.value : this.state.group_purchase).toFixed(2);
    let totalFee = Number(this.state.totalFee).toFixed(2);

    let realTotalFee, discount;
    if (this.state.is_realTotalFee) {
      realTotalFee = parseInt(totalFee - coupon - group_purchase).toFixed(2);
      discount = Number(totalFee - realTotalFee - coupon - group_purchase).toFixed(2);
    } else {
      realTotalFee = (totalFee - coupon - group_purchase).toFixed(2);
      discount = 0;
    }

    this.setState({
      [field]: e.target.value,
      realTotalFee: realTotalFee,
      discount: discount,
    });
  }

  calculateTotalFee() {
    let timeFee = this.calculateTotalTimeFee();
    let materialFee = this.calculateTotalMaterialFee();
    let totalFee = 0;

    if (!isNaN(timeFee)) {
      totalFee += timeFee;
    }
    if (!isNaN(materialFee)) {
      totalFee += materialFee;
    }

    return Number(totalFee);
  }

  handleSubmit(e) {
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
      // let partMap_count = 1;
      for (let part of maintain_parts.values()) {
        partNames.push(part.part_name);
        parts.push(part);
      }

      values.start_time = DateFormatter.date(this.state.startDate);
      values.scheduled_end_time = DateFormatter.date(values.scheduled_end_time);
      values.item_names = itemNames.toString();
      values.part_names = partNames.toString();
      values.item_list = JSON.stringify(items);
      values.part_list = JSON.stringify(parts);
      values.total_fee = this.state.realTotalFee;
      values.discount = this.state.discount;
      // values.coupon_item_id = 1;

      this.setState({btnDisable: true});
      api.ajax({
          url: isNew ? api.addMaintainIntention() : api.editMaintainIntention(),
          type: 'POST',
          data: values,
        },
        (data) => {
          message.success(isNew ? '新增维保记录成功' : '修改维保记录成功');
          //let {maintain_intention} = this.state;
          //maintain_intention._id = data.res.intention_id;
          //this.setState({
          //  maintain_intention_id: data.res.intention_id,
          //  maintain_intention: maintain_intention,
          //  isNew: false,
          //  is_change: false,
          //});


          location.href = '/aftersales/project/create/?customer_id=' + data.res.customer_id + '&auto_id=' + data.res.auto_id + '&maintain_intention_id=' + data.res.intention_id;
          // window.location.href = '/aftersales/project/create/?customer_id=' + data.res.customer_id + '&auto_id=' + data.res.auto_id + '&maintain_intention_id=' + data.res.intention_id;
          // location.reload();
        },
        (data) => {
          message.error(data);
          this.setState({btnDisable: false});
        });
    });
  }

  render() {
    const {selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    let {
      btnDisable,
      customer,
      auto,
      maintain_intention,
    } = this.state;

    let materialFee = this.calculateTotalMaterialFee(),
      timeFee = this.calculateTotalTimeFee();

    // const mileageProps = getFieldDecorator('mileage', {initialValue: maintain_intention.mileage}, {
    //   validate: [{
    //     rules: [{validator: FormValidator.notNull}],
    //     trigger: ['onBlur'],
    //   }, {
    //     rules: [{required: false, message: validator.required.notNull}],
    //     trigger: 'onBlur',
    //   }],
    // });


    let isPayModalDisabled = true;
    if (this.state.maintain_intention_id && Number(this.state.maintain_intention.status) !== 3) {
      isPayModalDisabled = false;
    }
    let isSaveButtonDisabled = false;
    if (this.state.maintain_intention_id && (Number(this.state.maintain_intention.status) == 3 || Number(this.state.maintain_intention.status) == 5)) {
      isSaveButtonDisabled = true;
    }

    return (
      <Form horizontal>
        <Row>
          <Col span={6}>
            <CustomerAutoSearchBox
              api={api.searchCustomerAutos()}
              select={this.handleSearchSelect.bind(this)}
              style={{width: 250}}
              className="no-print"/>
          </Col>

          <Col span={18}>
            <div className="pull-right">
              <ProjectPrintPayModal
                isDisabled={this.state.is_change}
                project={this.state.maintain_intention}
                customer={this.state.customer}
                auto={this.state.auto}
                items={this.state.maintain_items}
                parts={this.state.maintain_parts}
                materialFee={materialFee}
                timeFee={timeFee}
                realTotalFee={this.state.realTotalFee}
              />

              <ProjectPrintDispatchModal
                isDisabled={this.state.is_change}
                project={this.state.maintain_intention}
                customer={this.state.customer}
                auto={this.state.auto}
                items={this.state.maintain_items}
                parts={this.state.maintain_parts}
              />

              <PayProjectModal
                size="default"
                isDisabled={this.state.is_change || isPayModalDisabled}
                customer_id={this.state.customer_id}
                project_id={this.state.maintain_intention_id}
              />
              <Button
                type="primary"
                size="default"
                onClick={this.handleSubmit}
                disabled={btnDisable || isSaveButtonDisabled}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>

        {getFieldDecorator('_id', {initialValue: this.state.maintain_intention._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: this.state.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: this.state.auto_id})(
          <Input type="hidden"/>
        )}

        <div className="form-board">
          <Row className="margin-top-20">
            <Col span={8}>
              <FormItem
                label="手机号"
                labelCol={{span: 6}}
                wrapperCol={{span: 14}}
                required
              >
                {getFieldDecorator('customer_phone', {initialValue: customer.phone})(
                  <Input disabled placeholder="请在左上角搜索"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户姓名" labelCol={{span: 6}} wrapperCol={{span: 14}} required>
                <Row>
                  <Col span={17}>
                    {getFieldDecorator('customer_name', {initialValue: customer.name})(
                      <Input/>
                    )}
                  </Col>
                  <Col span={7}>
                    {getFieldDecorator('gender', {initialValue: '' + (customer.gender ? customer.gender : -1)})(
                      <Select{...selectStyle}>
                        <Option value={'1'}>男士</Option>
                        <Option value={'0'}>女士</Option>
                        <Option value={'-1'}>未知</Option>
                      </Select>
                    )}
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="会员卡类型" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <p>
                  {
                    customer.member_card_name
                      ?
                      `${customer.member_card_name}`
                      :
                      '普通用户'
                  }
                </p>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="车牌号" labelCol={{span: 6}} wrapperCol={{span: 14}} required>
                {getFieldDecorator('plate_num', {initialValue: auto ? auto.plate_num : ''})(
                  <Input type="hidden"/>
                )}
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('plate_num', {initialValue: auto ? auto.plate_num : ''})(
                      <Select disabled onSelect={this.handleUserAutoChange.bind(this)}{...selectStyle}>
                        {this.state.autos.map(auto =>
                          <Option key={auto._id}>{auto.plate_num}</Option>
                        )}
                      </Select>
                    )}
                  </Col>
                  <Col span={7}>
                    {/*<EditAutoModal customer_id={this.state.customer_id} auto_id={auto._id}
                     isDisable={this.state.maintain_intention_id || !Number(this.state.auto_id)}/>*/}
                    <EditAutoModal
                      customer_id={this.state.customer_id}
                      auto_id={auto._id}
                      isDisable={this.state.maintain_intention_id ? !this.state.maintain_intention_id : !Number(this.state.auto_id)}
                    />
                  </Col>
                  <Col span={6}>
                    <NewAutoModal customer_id={this.state.customer_id} isDisable={this.state.maintain_intention_id}/>
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="车型信息" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('auto_type_name', {
                  initialValue: auto.auto_brand_name
                    ? auto.auto_brand_name + ' ' + auto.auto_series_name + ' ' + auto.auto_type_name : '',
                })(
                  <Input disabled/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="车架号" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('vin_num', {initialValue: auto.vin_num})(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="是否事故车" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('is_accident', {initialValue: maintain_intention.is_accident || '0'})(
                  <RadioGroup>
                    <Radio value="0">否</Radio>
                    <Radio value="1">是</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="里程数" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('mileage', {initialValue: maintain_intention.mileage})(
                  <Input addonAfter="公里"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="预计出厂日期" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('scheduled_end_time', {
                  initialValue: maintain_intention.scheduled_end_time ? DateFormatter.getMomentDate(maintain_intention.scheduled_end_time) : DateFormatter.getMomentDate(),
                })(
                  <DatePicker format={DateFormatter.pattern.day} placeholder="请选择出厂时间"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row className="margin-top-20">
          <Col span={8}>
            -预检信息
          </Col>
          <Col span={16}>
            <span className="pull-right">
              <Button type="ghost" className="mr15" onClick={this.showMaintainAdvice.bind(this)}>维修建议</Button>
              <Button type="ghost" onClick={this.showRemark.bind(this)}>备注</Button>
            </span>
          </Col>
        </Row>

        <div className="form-board">
          <Row className="margin-top-20">
            <Col span={24}>
              <FormItem label="故障描述" labelCol={{span: 2}} wrapperCol={{span: 21}}>
                {getFieldDecorator('failure_desc', {initialValue: maintain_intention.failure_desc})(
                  <Input type="textarea"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={this.state.is_show_maintain_advice ? 'is_show_maintain_advice' : 'hide'}>
            <Col span={24}>
              <FormItem label="维修建议" labelCol={{span: 2}} wrapperCol={{span: 21}}>
                {getFieldDecorator('maintain_advice', {initialValue: maintain_intention.maintain_advice})(
                  <Input type="textarea"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={this.state.is_show_remark ? 'is_show_remark' : 'hide'}>
            <Col span={24}>
              <FormItem label="备注" labelCol={{span: 2}} wrapperCol={{span: 21}}>
                {getFieldDecorator('remark', {initialValue: maintain_intention.remark})(
                  <Input type="textarea"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <MemberCardTypeInfoTable
          customer={this.state.customer}
          getcouponItem={this.getcouponItem}
          getcouponPartType={this.getcouponPartType}
          maintain_items={this.state.maintain_items}
          maintain_parts={this.state.maintain_parts}
          getcouponItemRemoved={this.getcouponItemRemoved}
          getcouponPartsRemoved={this.getcouponPartsRemoved}
          setMemberDetailList={this.setMemberDetailList}
        />
        <MaintainItemTable
          intention_id={this.state.maintain_intention_id}
          customer_id={this.state.customer_id}
          onSuccess={this.handleMaintainItemUpdate.bind(this)}
          couponItem={this.state.couponItem}
          maintain_items={this.state.maintain_items}
          deleted_maintain_items={this.state.deleted_maintain_items}
          addMaintainItem={this.addMaintainItem}
          removeMaintainItem={this.removeMaintainItem}
          memberDetailList={this.state.memberDetailList}
        />
        <MaintainPartTable
          intention_id={this.state.maintain_intention_id}
          customer_id={this.state.customer_id}
          onSuccess={this.handleMaintainPartUpdate.bind(this)}
          couponPartType={this.state.couponPartType}
          maintain_parts={this.state.maintain_parts}
          deleted_maintain_parts={this.state.deleted_maintain_parts}
          addMaintainPart={this.addMaintainPart}
          removeMaintainPart={this.removeMaintainPart}
          memberDetailList={this.state.memberDetailList}
        />

        <Row className="margin-top-20">
          <Col span={8}>
            -结算信息
          </Col>
        </Row>

        <div className="form-board">
          <Row className="margin-top-20">
            <Col span={5}>
              <FormItem label="结算金额" labelCol={{span: 8}} wrapperCol={{span: 14}}>
                <p className="ant-form-text">{Number(materialFee + timeFee).toFixed(2)}元</p>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="优惠券抵扣" labelCol={{span: 8}} wrapperCol={{span: 14}}>
                {getFieldDecorator('coupon', {
                  initialValue: maintain_intention.coupon || '0.00',
                  onChange: this.handleFieldChange.bind(this, 'coupon'),
                })(
                  <Input
                    type="number"
                    placeholder="优惠券抵扣金额"
                    min={0.00}
                    addonAfter="元"
                  />
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="团购抵扣" labelCol={{span: 6}} wrapperCol={{span: 10}}>
                {getFieldDecorator('group_purchase', {
                  initialValue: maintain_intention.group_purchase || '0.00',
                  onChange: this.handleFieldChange.bind(this, 'group_purchase'),
                })(
                  <Input
                    type="number"
                    placeholder="团购抵扣金额"
                    min={0.00}
                    addonAfter="元"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
                  <span style={{fontSize: '16px', color: '#2db7f5'}} className="ant-form-text">
                    实收金额：
                  </span>
              <span style={{fontSize: '16px', color: '#2db7f5'}} className="ant-form-text">
                    {Number(this.state.realTotalFee).toFixed(2)}
                元
                  </span>
            </Col>
            <Col span={2}>
                <span className="">
                  <Checkbox
                    onChange={this.handleCheckBoxChange}
                    checked={this.state.is_realTotalFee}
                  >
                    抹零
                  </Checkbox>
                </span>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

Create = Form.create()(Create);
export default Create;
