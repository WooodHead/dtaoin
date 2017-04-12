import React, {Component} from 'react';
import {Form, Input, Modal, Button, Select, Checkbox, Row, Col, message} from 'antd';
import FormModalLayout from '../../../utils/FormLayout';
const FormItem = Form.Item;

import SearchSelectBox from '../../../components/widget/SearchSelectBox';

import api from '../../../middleware/api';

export default class AddDiscount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discountList: [],
      currentDiscount: null,
      countCheck: true,   //不限次CheckBox是否选中
      discountType: 0,    //搜索，优惠类型，全部匹配
      discountStatus: 0,  //搜索，优惠状态，启用
      scope: '0',         //提交，适用门店
      count: 0,           //提交，优惠使用数量
    };

    //自动绑定
    [
      'handleClickFinish',
      'handleClickFinishAndContinue',
      'handleSearch',
      'handleSelectItem',
      'handleSelectScope',
      'handleInputCount',
      'handleChangeCountCheckBox',
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
    });
  }

  handleSearch(key, successHandle, failHandle) {
    this.search(key, this.state.discountStatus, this.state.discountType, successHandle, failHandle);
  }

  handleSelectItem(selectInfo) {
    this.setState({currentDiscount: selectInfo});
  }

  handleSelectScope(value) {
    this.setState({scope: value});
  }

  handleInputCount(value) {
    if (parseInt(value) > 0) {
      this.setState({count: value});
    } else if (value === '') {
      this.setState({count: 0});
    }
  }

  handleChangeCountCheckBox(checked) {
    checked
      ?
      this.setState({countCheck: checked, count: 0})
      :
      this.setState({countCheck: checked});
  }

  handleClickFinish() {
    const data = this.assembleFinishData();
    if (data) {
      if (this.props.finish(data)) {
        this.setState({
          countCheck: true,   //不限次CheckBox是否选中
          scope: '0',         //提交，适用门店
          count: 0,           //提交，优惠使用数量
        });
        this.props.cancel();
      }
    }
  }

  handleClickFinishAndContinue() {
    const data = this.assembleFinishData();
    if (data) {
      if (this.props.finish(data)) {
        this.setState({
          countCheck: true,   //不限次CheckBox是否选中
          scope: '0',         //提交，适用门店
          count: 0,           //提交，优惠使用数量
        });
      }
    }
  }

  assembleFinishData() {
    const {currentDiscount, countCheck, scope, count} = this.state;

    if (!currentDiscount || !Object.keys(currentDiscount).length) {
      message.error('请选择优惠信息！');
      return null;
    } else if (!countCheck && !count) {
      message.error('请输入优惠的使用次数');
      return null;
    } else {
      return {
        _id: currentDiscount._id,
        name: currentDiscount.name,
        type: currentDiscount.type,
        remark: currentDiscount.remark,
        scope: scope,
        amount: count,
      };
    }

  }

  render() {
    const {countCheck, scope, count} = this.state;
    let {formItemThree, formItemLayout_1014} = FormModalLayout;

    return (
      <Modal
        title="添加优惠"
        visible={this.props.visible}
        onCancel={this.props.cancel}
        width="720px"
        footer={[
          <div>
            <Button key="finish" type="ghost" onClick={this.handleClickFinish}>提 交</Button>
            <Button key="submit" type="primary" onClick={this.handleClickFinishAndContinue}>继续添加</Button>
          </div>,
        ]}
      >
        <Form>
          <Row>
            <Col>
              <FormItem
                label="优惠名称"
                labelCol={{span: 4}}
                wrapperCol={{span: 18}}
              >
                <SearchSelectBox
                  style={{width: 350}}
                  placeholder={'请输入优惠名称搜索'}
                  onSearch={this.handleSearch}
                  displayPattern={(item) => {
                    let patternStr = item.name || '';
                    switch ('' + item.type) {
                      case '1':
                        patternStr += ' 计次优惠';
                        break;
                      case '2':
                        patternStr += ' 折扣优惠';
                        break;
                      case '3':
                        patternStr += ' 立减优惠';
                        break;
                      default:
                        return '';
                    }
                    patternStr += item.remark ? ' ' + item.remark : '';
                    return patternStr;
                  }}
                  onSelectItem={this.handleSelectItem}
                  visible={this.props.visible}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9} offset={1}>
              <FormItem
                label="数量"
                {...formItemThree}
                required
              >
                <Input
                  value={count || ''}
                  type="number"
                  placeholder="输入使用次数"
                  disabled={countCheck}
                  onChange={(e) => this.handleInputCount(e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <Checkbox
                {...formItemThree}
                style={{marginTop: 7}}
                checked={countCheck}
                onChange={(e) => this.handleChangeCountCheckBox(e.target.checked)}
              >
                不限次
              </Checkbox>
            </Col>
            <Col span={8} className={api.getLoginUser().companyId == 1 ? '' : 'hide'}>
              <FormItem
                label="适用门店"
                {...formItemLayout_1014}
                required
              >
                <Select
                  style={{width: 120}}
                  size="large"
                  value={scope}
                  onChange={this.handleSelectScope}
                >
                  <Select.Option key="0" value="0">发卡门店</Select.Option>
                  <Select.Option key="1" value="1">售卡门店</Select.Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
