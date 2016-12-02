import React from 'react'
import {message, Form, Select, Row, Col, Icon} from 'antd'
import api from '../../middleware/api'
import Layout from '../../components/forms/Layout'
import NewOptItem from '../popover/NewOptItem'
import MaintainItemSearchBox from '../../components/search/MaintainItemSearchBox'
import PartSearchBox from '../../components/search/PartSearchBox'

const FormItem = Form.Item;
const Option = Select.Option;

export default class BaseProject extends React.Component {
  constructor(props) {
    super(props);
    [
      'addItem',
      'addPart',
      'disabledStartDate',
      'disabledEndDate',
      'handleDateChange',
      'calculateTotalTimeFee',
      'calculateTotalMaterialFee',
      'calculateTotalFee'
    ].map(method => this[method] = this[method].bind(this));
  }

  handleTimeFeeChange(index, event) {
    let timeFeeProp = 'time_fee_' + index,
      timeFee = event.target.value;

    let {itemMap} = this.state;
    if (itemMap.has(index)) {
      let item = itemMap.get(index);
      item.time_fee = timeFee;
      itemMap.set(index, item);
    }

    this.setState({
      [timeFeeProp]: timeFee,
      itemMap: itemMap
    });
    this.calculateTotalFee();
  }

  handlePartPriceChange(index, event) {
    let part = {},
      partPriceProp = 'part_price_' + index,
      partCountProp = 'part_count_' + index,
      partAmountProp = 'part_amount_' + index,
      partPrice = event.target.value,
      partCount = this.state[partCountProp],
      partAmount = 0;

    if (partCount > 0) {
      partAmount = partPrice * partCount;
    }

    let {partMap} = this.state;
    if (partMap.has(index)) {
      part = partMap.get(index);
      part.material_fee = partAmount;
    } else {
      part = {_id: 0, material_fee: partAmount};
    }
    this.setPartsMap(index, part);

    this.setState({
      [partPriceProp]: partPrice,
      [partAmountProp]: partAmount,
      partMap: partMap
    });

    $('#' + partAmountProp).text(`${partAmount}元`);
    this.calculateTotalFee();
  }

  handlePartCountChange(index, event) {
    let part = {},
      partPriceProp = 'part_price_' + index,
      partCountProp = 'part_count_' + index,
      partAmountProp = 'part_amount_' + index,
      partTotalNumProp = 'part_total_' + index,
      partRemainderProp = 'part_remainder_' + index,

      partPrice = this.state[partPriceProp],
      oldPartCount = this.state[partCountProp],
      partCount = event.target.value,
      partAmount = partPrice * partCount,
    //parseInt(oldPartCount)
      partRemainder = this.state[partTotalNumProp] - parseInt(partCount);

    if (partCount < 0) {
      message.error('数量不可以少于0');
      return;
    }

    if (partRemainder < 0) {
      message.error('剩余库存不足,请重新填写或进货', 2);
      // $('#' + partAmountProp).text('0元');
      $('#' + partRemainderProp).text('剩余0件');
      return;
    }

    let {partMap} = this.state;
    if (partMap.has(index)) {
      part = partMap.get(index);
      part.count = partCount;
      part.material_fee = partAmount;
    } else {
      part = {_id: 0, count: partCount, material_fee: partAmount};
    }
    this.setPartsMap(index, part);

    this.setState({
      [partCountProp]: partCount,
      [partAmountProp]: partAmount,
      // [partRemainderProp]: partRemainder, //初始化时写入,只读
      partMap: partMap
    });

    $('#' + partAmountProp).text(`${partAmount}元`);
    $('#' + partRemainderProp).text(`剩余${partRemainder}件`);
    this.calculateTotalFee();
  }

  handleItemChange(index, result) {
    let item = {},
      {itemMap} = this.state,
      optItem = result.data;

    // if (util.isMapContainsObj(itemMap, 'item_id', optItem._id)) {
    //   return false;
    // }

    if (itemMap.has(index)) {
      item = itemMap.get(index);
      item.item_id = optItem._id;
      item.item_name = optItem.name;
    } else {
      item = {_id: 0, item_id: optItem._id, item_name: optItem.name, time_fee: 0, fitter_user_ids: 0};
    }
    itemMap.set(index, item);

    this.setState({itemMap: itemMap});
  }

  handleFixerChange(index, value) {
    let userIds = value.toString();
    let item, {itemMap} = this.state;
    if (itemMap.has(index)) {
      item = itemMap.get(index);
      item.fitter_user_ids = userIds;
    } else {
      item = {_id: 0, fitter_user_ids: userIds};
    }
    itemMap.set(index, item);

    this.setState({itemMap: itemMap});
  }

  handlePartSelect(index, result) {
    let part = result.data;
    // if (util.isMapContainsObj(partMap, 'part_id', part._id)) {
    //   return false;
    // }

    let
      partPriceProp = 'part_price_' + index,
      partCountProp = 'part_count_' + index,
      partAmountProp = 'part_amount_' + index,
      partTotalNumProp = 'part_total_' + index,
      partRemainderProp = 'part_remainder_' + index,

      partPrice = Number(part.sell_price),
      partCount = Number(this.state[partCountProp]),
      partTotalNum = parseInt(part.amount) - parseInt(part.freeze),
      partRemainder = partTotalNum;

    if (partTotalNum <= 0) {
      message.error('库存为0');
      this.setState({
        [partPriceProp]: 0,
        [partCountProp]: 0,
        [partTotalNumProp]: 0,
        [partAmountProp]: 0,
        [partRemainderProp]: 0
      });

      $('#' + partPriceProp).val(0);
      $('#' + partCountProp).val(0);
      $('#' + partAmountProp).text(`0元`);
      $('#' + partRemainderProp).text(`剩余0件`);
      return;
    }

    if (isNaN(partRemainder)) {
      partRemainder = 0;
    }
    if (isNaN(partCount)) {
      partCount = 1;
    } else if (partRemainder - partCount < 0) {
      partCount = 1;
    }
    // 初始化默认配件数为1
    if (partRemainder > 0) {
      partCount = 1;
      partRemainder -= partCount; // 初始化时计入冻结的数目,这里默认是1
    }

    let partAmount = partPrice * partCount;
    part.count = partCount;
    part.material_fee = partAmount;
    this.setPartMap(index, part);

    this.setState({
      [partPriceProp]: partPrice,
      [partCountProp]: partCount,
      [partTotalNumProp]: partTotalNum,
      [partAmountProp]: partAmount,
      [partRemainderProp]: partRemainder // 初始化时写入配件剩余数量,其余地方均不写入,只读取数据
    });

    $('#' + partPriceProp).val(partPrice);
    $('#' + partCountProp).val(partCount);
    $('#' + partAmountProp).text(`${partAmount}元`);
    $('#' + partRemainderProp).text(`剩余${partRemainder}件`);
  }

  setPartMap(index, part) {
    let partItem = {}, {partMap} = this.state;
    if (partMap.has(index)) {
      partItem = partMap.get(index);
      partItem.part_id = part._id;
      partItem.count = part.count;
      partItem.part_name = part.name;
      partItem.material_fee = part.material_fee;
    } else {
      partItem = {_id: 0, part_id: part._id, count: 1, part_name: part.name, material_fee: 0}
    }
    partMap.set(index, partItem);

    this.setState({partMap: partMap});
  }

  addItem() {
    let {itemHtml} = this.state,
      index = itemHtml.length + 1;
    itemHtml.push(this.renderItemHtml(index));
    this.setState({itemHtml: itemHtml});
  }

  addPart() {
    let {partHtml} = this.state,
      index = partHtml.length + 1;
    partHtml.push(this.renderPartHtml(index));
    this.setState({partHtml: partHtml});
  }

  removeItem(index) {
    let {isNew, itemHtml, itemMap, deleteItemSet} = this.state;

    if (!isNew) {
      deleteItemSet.add(itemMap.get(index));
    }

    itemHtml.splice((index - 1), 1);
    itemMap.delete(index);

    this.setState({
      itemHtml: itemHtml,
      itemMap: itemMap
    });
  }

  removePart(index) {
    let {isNew, partHtml, partMap, deletePartSet} = this.state;

    if (!isNew) {
      deletePartSet.add(partMap.get(index));
    }

    partHtml.splice(index - 1, 1);
    partMap.delete(index);

    this.calculateTotalMaterialFee();
    this.calculateTotalFee();

    this.setState({
      partHtml: partHtml,
      partMap: partMap
    });
  }

  calculateTotalTimeFee() {
    let {itemMap} = this.state,
      timeFee = 0;
    for (let i = 0; i < itemMap.size; i++) {
      let timeFeeProp = 'time_fee_' + (i + 1);
      let tf = Number(this.state[timeFeeProp]);
      if (!isNaN(tf)) {
        timeFee += tf;
      }
    }
    return timeFee;
  }

  calculateTotalMaterialFee() {
    let {partMap} = this.state,
      materialFee = 0;
    for (let i = 0; i < partMap.size; i++) {
      let partAmount = 'part_amount_' + (i + 1);
      let mf = Number(this.state[partAmount]);
      if (!isNaN(mf)) {
        materialFee += mf;
      }
    }
    return materialFee;
  }

  calculateTotalFee() {
    let form = this.props.form,
      discount = form.getFieldProps('discount').value,
      coupon = form.getFieldProps('coupon').value,
      auxiliaryMaterialFee = form.getFieldProps('auxiliary_material_fee').value,
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
    }
    if (!isNaN(Number(coupon))) {
      totalFee -= Number(coupon);
    }
    if (!isNaN(Number(auxiliaryMaterialFee))) {
      totalFee += Number(auxiliaryMaterialFee);
    }

    return totalFee;
  }

  renderItemHtml(index) {
    const {selectStyle} = Layout;
    let label = `项目${index}：`;
    let newItem = 'new_item_' + index,
      newItemContainer = 'new_item_container_' + index;

    return (
      <div key={index} className="form-card">
        <a
          href="javascript:;"
          className="close"
          onClick={this.removeItem.bind(this, index)}>
          <Icon type="cross"/>
        </a>

        <Row className="mb5">
          <Col span="14">
            <FormItem label={label} className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <MaintainItemSearchBox
                change={this.handleItemChange.bind(this, index)}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span="10">
            <NewOptItem save={this.addMaintainItem.bind(this, index)}/>
          </Col>
        </Row>

        <Row>
          <Col span="14">
            <FormItem label="维修人员：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <Select
                multiple
                onChange={this.handleFixerChange.bind(this, index)}
                {...selectStyle}
                className="no-margin-bottom"
                placeholder="请选择维修人员">
                {this.state.fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="工时费：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <span className="ant-input-wrapper ant-input-group">
                <input
                  type="number"
                  className="ant-input ant-input-lg"
                  onChange={this.handleTimeFeeChange.bind(this, index)}
                  min={0}
                  placeholder="工时费"
                />
                <span className="ant-input-group-addon">元</span>
              </span>
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }

  renderPartHtml(index) {
    let label = `配件${index}：`,
      partAmountProp = 'part_amount_' + index,
      partRemainderProp = 'part_remainder_' + index,
      price = 'part_price_' + index,
      count = 'part_count_' + index,
      remainder = 'part_remainder_' + index,
      amount = 'part_amount_' + index;

    return (
      <div key={index} className="form-card">
        <a href="javascript:;" className="close" onClick={this.removePart.bind(this, index)}><Icon type="cross"/></a>
        <Row className="mb5">
          <Col span="14">
            <FormItem label={label} className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <PartSearchBox
                select={this.handlePartSelect.bind(this, index)}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="零售价：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <span className="ant-input-wrapper ant-input-group">
                <input
                  type="number"
                  id={price}
                  className="ant-input ant-input-lg"
                  onChange={this.handlePartPriceChange.bind(this, index)}
                  min={0}
                  placeholder="零售价"
                />
                <span className="ant-input-group-addon">元</span>
              </span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="14">
            <FormItem label="使用数量：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <span className="ant-input-wrapper ant-input-group">
                <input
                  type="number"
                  id={count}
                  className="ant-input ant-input-lg"
                  onChange={this.handlePartCountChange.bind(this, index)}
                  min={1}
                  placeholder="使用数量"
                />
                <span className="ant-input-group-addon">件</span>
              </span>
              <span className="ant-form-explain" id={remainder}></span>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="小计：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <p className="ant-form-text" id={amount}>0元</p>
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }

  setItemsTimeFee(items) {
    for (let i = 0; i < items.length; i++) {
      let timeFeeProp = 'time_fee_' + (i + 1);
      this.setState({[timeFeeProp]: Number(items[i].time_fee)});
    }
  }

  setPartsPriceAndCount(parts) {
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i],
        index = i + 1,
        partPriceProp = 'part_price_' + index,
        partCountProp = 'part_count_' + index,
        partAmountProp = 'part_amount_' + index;

      this.setState({
        [partPriceProp]: Number(part.material_fee) / Number(part.count),
        [partCountProp]: Number(part.count),
        [partAmountProp]: Number(part.material_fee)
      });
    }
  }

  setItemsMap(items) {
    let itemMap = new Map();
    for (let i = 0; i < items.length; i++) {
      itemMap.set((i + 1), items[i]);
    }
    this.setState({itemMap: itemMap});
  }

  setPartsMap(parts) {
    let partMap = new Map();
    for (let i = 0; i < parts.length; i++) {
      partMap.set((i + 1), parts[i]);
    }
    this.setState({partMap: partMap});
  }

  initItemsHtml(items) {
    let itemHtml = [];
    for (let i = 0; i < items.length; i++) {
      itemHtml.push(this.renderOptItem((i + 1), items[i]));
    }
    this.setState({itemHtml: itemHtml});
  }

  initPartsHtml(parts) {
    let partHtml = [];
    for (let i = 0; i < parts.length; i++) {
      partHtml.push(this.renderPartItem((i + 1), parts[i]));
    }
    this.setState({partHtml: partHtml});
  }

  renderOptItem(index, itemObj) {
    const {selectStyle} = Layout;
    let label = `项目${index}：`,
      itemProp = 'item_' + index;
    let {fitterUsers} = this.state;
    let fixerSelect = '';
    if (Number(itemObj.fitter_user_ids) === 0) {
      fixerSelect = (
        <Select
          multiple
          onChange={this.handleFixerChange.bind(this, index)}
          {...selectStyle}
          className="no-margin-bottom"
          placeholder="请选择维修人员">
          {fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
        </Select>
      );
    } else {
      fixerSelect = (
        <Select
          multiple
          defaultValue={itemObj.fitter_user_ids.split(',')}
          onChange={this.handleFixerChange.bind(this, index)}
          {...selectStyle}
          className="no-margin-bottom"
          placeholder="请选择维修人员">
          {fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
        </Select>
      );
    }

    return (
      <div key={index} className="form-card">
        <a
          className="close"
          href="javascript:;"
          onClick={this.removeItem.bind(this, index)}>
          <Icon type="cross"/>
        </a>
        <Row className="mb5">
          <Col span="14">
            <FormItem label={label} className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <MaintainItemSearchBox
                value={itemObj.item_name}
                select={this.handleItemChange.bind(this, index)}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span="10">
            <NewOptItem save={this.addMaintainItem.bind(this, index)}/>
          </Col>
        </Row>

        <Row>
          <Col span="14">
            <FormItem label="维修人员：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              {fixerSelect}
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="工时费：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <span className="ant-input-wrapper ant-input-group">
                <input
                  type="number"
                  defaultValue={itemObj.time_fee}
                  className="ant-input ant-input-lg"
                  onChange={this.handleTimeFeeChange.bind(this, index)}
                  min={0}
                  placeholder="工时费"
                />
                <span className="ant-input-group-addon">元</span>
              </span>
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }

  renderPartItem(index, part) {
    let label = `配件${index}：`,
      partAmountProp = 'part_amount_' + index,
      partRemainderProp = 'part_remainder_' + index,
      price = 'part_price_' + index,
      count = 'part_count_' + index,
      remainder = 'part_remainder_' + index,
      amount = 'part_amount_' + index;
    /**
     * 初始化编辑时,获取配件详情,计算配件剩余数量
     * 初始化时,不减配件数量count
     */
    this.getPartRemainder(index, part);

    return (
      <div key={index} className="form-card">
        <a href="javascript:;"
           className="close"
           onClick={this.removePart.bind(this, index)}>
          <Icon type="cross"/>
        </a>

        <Row className="mb5">
          <Col span="14">
            <FormItem label={label} labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <PartSearchBox
                value={part.part_name}
                select={this.handlePartSelect.bind(this, index)}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="零售价：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <span className="ant-input-wrapper ant-input-group">
                <input
                  type="number"
                  id={price}
                  defaultValue={Number(part.material_fee) / Number(part.count)}
                  className="ant-input ant-input-lg"
                  onChange={this.handlePartPriceChange.bind(this, index)}
                  min={0}
                  placeholder="零售价"
                />
                <span className="ant-input-group-addon">元</span>
              </span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="14">
            <FormItem label="使用数量：" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <span className="ant-input-wrapper ant-input-group">
                <input
                  type="number"
                  id={count}
                  defaultValue={part.count}
                  className="ant-input ant-input-lg"
                  onChange={this.handlePartCountChange.bind(this, index)}
                  min={1}
                  placeholder="使用数量"
                />
                <span className="ant-input-group-addon">件</span>
              </span>
              <span className="ant-form-explain" id={remainder}></span>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="小计：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <p className="ant-form-text" id={amount}>{part.material_fee}元</p>
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }

  addMaintainItem(index, typeId, name) {
    api.ajax({
      url: api.addMaintainItem(),
      type: 'POST',
      data: {type: typeId, name: name}
    }, function (data) {
      message.success('维保项目添加成功');
    }.bind(this))
  }

  disabledStartDate(startDate) {
    if (!startDate || !this.state.endDate) {
      return false;
    }
    return startDate.getTime() > this.state.endDate.getTime();
  }

  disabledEndDate(endDate) {
    if (!endDate || !this.state.startDate) {
      return false;
    }
    return endDate.getTime() < this.state.startDate.getTime();
  }

  handleDateChange(field, value) {
    this.setState({[field]: value});
  }

  getFitterAdmins(isLeader) {
    api.ajax({url: api.user.getMaintainUsers(isLeader)}, function (data) {
      let admins = data.res.user_list;
      if (admins.length === 0) {
        return;
      }
      this.setState({fitterAdmins: admins});
      if (this.state.isNew) {
        this.props.form.setFieldsValue({fitter_admin_id: admins[0]._id})
      }
    }.bind(this))
  }

  getFitterUsers(isLeader) {
    api.ajax({url: api.user.getMaintainUsers(isLeader)}, function (data) {
      this.setState({fitterUsers: data.res.user_list});
    }.bind(this))
  }

  getOptItems(projectId) {
    api.ajax({url: api.getItemListOfMaintProj(projectId)}, function (data) {
      let items = data.res.list;
      this.setItemsTimeFee(items);
      this.setItemsMap(items);
      this.initItemsHtml(items);
    }.bind(this));
  }

  getPartItems(projectId) {
    api.ajax({url: api.getPartListOfMaintProj(projectId)}, function (data) {
      let parts = data.res.list;
      this.setPartsPriceAndCount(parts);
      this.setPartsMap(parts);
      this.initPartsHtml(parts);
    }.bind(this));
  }

  getPartRemainder(index, part) {
    api.ajax({url: api.getPartsDetail(part.part_id)}, function (data) {
      let partDetail = data.res.detail,
        partRemainderProp = 'part_remainder_' + index,
        partTotalNumProp = 'part_total_' + index;
      // 初始化时,配件使用数量已经包含在已冻结的数量里面,这里计算时解冻,重新计算
      let usedCount = parseInt(part.count);
      let totalNum = parseInt(partDetail.amount) - parseInt(partDetail.freeze) + usedCount;
      this.setState({
        [partTotalNumProp]: totalNum,
        [partRemainderProp]: totalNum - usedCount // TODO 可以不记录
      });
      $('#' + partRemainderProp).text(`剩余${totalNum - usedCount}件`);
    }.bind(this));
  }
}
