import React, {Component} from 'react'
import {Form, Input, Modal, Button, Select, Checkbox, Row, Col, message} from 'antd'
import FormModalLayout from '../../../components/forms/Layout';
const FormItem = Form.Item;

import HCSearchSelectBox from '../../../components/base/HCSearchSelectBox'

import api from '../../../middleware/api'

export default class AddDiscountToMCTModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discountList: [],
      currentDiscount: null,
      countCheck: false,  //不限次CheckBox是否选中
      discountType: 0,    //搜索，优惠类型，全部匹配
      discountStatus: 0,  //搜索，优惠状态，启用
      scope: '0',         //提交，适用门店
      count: 10,          //提交，优惠使用数量
    };

    //自动绑定
    [
      'onClickFinish',
      'onClickFinishAndContinue',
      'onSearch',
      'onSelectItem',
      'onSelectScope',
      'onInputCount',
      'onChangeCountCheckBox',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  search(key, status = 1, type = 1, successHandle = null, failHandle = null) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    let url = api.coupon.getCouponList({key, status, type});
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({discountList: data.res.list});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    })
  }

  onSearch(key, successHandle, failHandle) {
    this.search(key, this.state.discountStatus, this.state.discountType, successHandle, failHandle);
  }

  onSelectItem(selectInfo) {
    this.setState({currentDiscount: selectInfo});
  }

  onSelectScope(value) {
    this.setState({scope: value});
  }

  onInputCount(value) {
    if (value === '' || parseInt(value) > 0) {
      this.setState({count: value});
    }
  }

  onChangeCountCheckBox(checked) {
    checked
      ?
      this.setState({countCheck: checked, count: 0})
      :
      this.setState({countCheck: checked, count: 10});
  }

  onClickFinish() {
    const data = this.assembleFinishData();
    if (data) {
      this.props.finish(data);
      this.setState({
        countCheck: false,  //不限次CheckBox是否选中
        scope: '0',         //提交，适用门店
        count: 10,          //提交，优惠使用数量
      });
      this.props.cancel();
    } else {
      message.error('请选择优惠信息！');
    }
  }

  onClickFinishAndContinue() {
    const data = this.assembleFinishData();
    if (data) {
      this.props.finish(data);
      this.setState({
        countCheck: false,  //不限次CheckBox是否选中
        scope: '0',         //提交，适用门店
        count: 10,          //提交，优惠使用数量
      });
    } else {
      message.error('请选择优惠信息！');
    }
  }

  assembleFinishData() {
    const {currentDiscount, scope, count} = this.state;

    if (currentDiscount && Object.keys(currentDiscount).length && count !== '') {
      let data = {
        _id: currentDiscount._id,
        name: currentDiscount.name,
        type: currentDiscount.type,
        remark: currentDiscount.remark,
        scope: scope,
        amount: count,
      };
      return data;
    } else {
      return null;
    }

  }

  render() {
    const {countCheck, scope, count} = this.state;
    let {formItemThree} = FormModalLayout;

    return (
      <Modal
        title="添加优惠"
        visible={this.props.visible}
        onCancel={this.props.cancel}
        footer={
          <Row>
            <Col span={4} offset={8}>
              <Button
                key="finish"
                type="ghost"
                size="large"
                style={{width: '100%'}}
                onClick={this.onClickFinish}>完 成</Button>
            </Col>
            <Col span={4} offset={3}>
              <Button
                key="submit"
                type="primary"
                size="large"
                style={{width: '100%'}}
                onClick={this.onClickFinishAndContinue}>继续添加</Button>
            </Col>
          </Row>
        }
      >
        <Form horizontal>
          <Row>
            <Col>
              <FormItem
                label="优惠名称"
                labelCol={{span: 4}}
                wrapperCol={{span: 18}}
              >
                <HCSearchSelectBox
                  style={{width: 250}}
                  placeholder={'请输入优惠名称搜索'}
                  onSearch={this.onSearch}
                  autoSearch={false}
                  onSelectItem={this.onSelectItem}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                label="适用门店"
                {...formItemThree}
                required
              >
                <Select
                  style={{width: 120}}
                  size="large"
                  value={scope}
                  onChange={this.onSelectScope}
                >
                  <Select.Option key="0" value="0">通店</Select.Option>
                  <Select.Option key="1" value="1">售卡门店</Select.Option>
                </Select>

              </FormItem>
            </Col>
            <Col span={8} offset={1}>
              <FormItem
                label="数量"
                {...formItemThree}
                required
              >
                <Input
                  value={count || ''}
                  type="number"
                  placeholder="请输入使用次数"
                  disabled={countCheck}
                  onChange={(e) => this.onInputCount(e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={4} offset={1}>
              <Checkbox
                {...formItemThree}
                style={{marginTop: 7}}
                checked={countCheck}
                onChange={(e) => this.onChangeCountCheckBox(e.target.checked)}
              >
                不限次
              </Checkbox>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
