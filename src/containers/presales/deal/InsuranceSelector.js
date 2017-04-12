import React from 'react';
import {Row, Col, Popover, Button, Icon, Checkbox} from 'antd';
import text from '../../../config/text';

const InsuranceSelector = React.createClass({
  getInitialState() {
    return {
      visible: false,
      ci_damage_nod_disabled: true,
      ci_third_nod_disabled: true,
      ci_driver_nod_disabled: true,
      ci_passenger_nod_disabled: true,
      ci_stolen_nod_disabled: true,
      ci_car_goods_drop_nod_disabled: true,
      ci_windscreen_nod_disabled: true,
      ci_traffic_free_loss_danger_nod_disabled: true,
      ci_combust_nod_disabled: true,
      ci_new_equipment_loss_danger_nod_disabled: true,
      ci_no_fault_liability_nod_disabled: true,
      ci_scratch_nod_disabled: true,
      ci_wade_nod_disabled: true,
      checkedValues: [],
    };
  },

  componentWillReceiveProps(nextProps){
    if (nextProps.value) {
      this.handleSelectedValues(nextProps.value);
    }
  },

  hide() {
    this.setState({
      visible: false,
    });
  },

  handleSelectedValues(values){
    let checkedValues = [];
    let names = values.split('/');
    names.forEach(name => {
      if (name.indexOf('-') > -1) {
        let nameAndNod = name.split('-');
        let isuName = nameAndNod[0];
        let isuNodDisabled = `${text.insuranceValue[isuName]}_nod_disabled`;
        checkedValues.push(text.insuranceValue[isuName]);
        checkedValues.push(`${text.insuranceValue[isuName]}_nod`);
        this.setState({[isuNodDisabled]: false});
      } else if (!text.insuranceValue[name]) {
        this.setState({ciOther: name});
      } else {
        checkedValues.push(text.insuranceValue[name]);
      }
    });
    this.setState({checkedValues: checkedValues});
  },

  handleVisibleChange(visible) {
    this.setState({visible});
  },

  onChange(checkedValues) {
    for (let key in this.state) {
      if (this.state.hasOwnProperty(key)) {
        if(key.indexOf('ci_') > -1) {
          this.setState({[key]: true});
        }
      }
    }

    let realCheckedValues = [];
    checkedValues.map(value => {
      let nodIndex = value.indexOf('_nod');
      let disabledProp = value + '_nod_disabled';
      if (nodIndex === -1) {
        this.setState({[disabledProp]: false});
      }

      if(nodIndex === -1) {
        realCheckedValues.push(value);
      }else {
        if(checkedValues.indexOf(value.slice(0, -4)) > -1) {
          realCheckedValues.push(value);
        }
      }

    });
    this.setState({checkedValues: realCheckedValues});
  },

  confirm(){
    let {checkedValues} = this.state;
    let ciOhter = this.refs.ciOther.value;
    let names = [];
    checkedValues.forEach(item => {
      if (item.indexOf('_nod') === -1) {
        if (checkedValues.indexOf(item + '_nod') > -1) {
          names.push(`${text.insuranceName[item]}-${text.insuranceName[item + '_nod']}`);
        } else {
          names.push(`${text.insuranceName[item]}`);
        }
      }
    });
    if (ciOhter) {
      names.push(ciOhter);
    }
    this.props.save(names.join('/'));
    this.hide();
  },

  render() {
    let {checkedValues} = this.state;
    const CheckboxGroup = Checkbox.Group;

    const options = [
      {
        label: '车辆损失险',
        value: 'ci_damage',
      }, {
        label: '不计免赔',
        value: 'ci_damage_nod',
        disabled: this.state.ci_damage_nod_disabled,
      }, {
        label: '第三责任险',
        value: 'ci_third',
      }, {
        label: '不计免赔',
        value: 'ci_third_nod',
        disabled: this.state.ci_third_nod_disabled,
      }, {
        label: '车上人员责任险(驾驶员)',
        value: 'ci_driver',
      }, {
        label: '不计免赔',
        value: 'ci_driver_nod',
        disabled: this.state.ci_driver_nod_disabled,
      }, {
        label: '车上人员责任险(乘客)',
        value: 'ci_passenger',
      }, {
        label: '不计免赔',
        value: 'ci_passenger_nod',
        disabled: this.state.ci_passenger_nod_disabled,
      }, {
        label: '全车盗抢险',
        value: 'ci_stolen',
      }, {
        label: '不计免赔',
        value: 'ci_stolen_nod',
        disabled: this.state.ci_stolen_nod_disabled,
      }, {
        label: '车载货物掉落责任险',
        value: 'ci_car_goods_drop',
      }, {
        label: '不计免赔',
        value: 'ci_car_goods_drop_nod',
        disabled: this.state.ci_car_goods_drop_nod_disabled,
      }, {
        label: '风挡玻璃单独破碎险',
        value: 'ci_windscreen',
      }, {
        label: '不计免赔',
        value: 'ci_windscreen_nod',
        disabled: this.state.ci_windscreen_nod_disabled,
      }, {
        label: '车辆停驶损失险',
        value: 'ci_traffic_free_loss_danger',
      }, {
        label: '不计免赔',
        value: 'ci_traffic_free_loss_danger_nod',
        disabled: this.state.ci_traffic_free_loss_danger_nod_disabled,
      }, {
        label: '自燃损失险',
        value: 'ci_combust',
      }, {
        label: '不计免赔',
        value: 'ci_combust_nod',
        disabled: this.state.ci_combust_nod_disabled,
      }, {
        label: '新增加设备损失险',
        value: 'ci_new_equipment_loss_danger',
      }, {
        label: '不计免赔',
        value: 'ci_new_equipment_loss_danger_nod',
        disabled: this.state.ci_new_equipment_loss_danger_nod_disabled,
      }, {
        label: '划痕险',
        value: 'ci_scratch',
      }, {
        label: '不计免赔',
        value: 'ci_scratch_nod',
        disabled: this.state.ci_scratch_nod_disabled,
      }, {
        label: '无过错责任险',
        value: 'ci_no_fault_liability',
      }, {
        label: '不计免赔',
        value: 'ci_no_fault_liability_nod',
        disabled: this.state.ci_no_fault_liability_nod_disabled,
      }, {
        label: '涉水行驶险',
        value: 'ci_wade',
      }, {
        label: '不计免赔',
        value: 'ci_wade_nod',
        disabled: this.state.ci_wade_nod_disabled,
      }, {
        label: '不计免赔特约险',
        value: 'ci_spec',
      },
    ];

    const content = (
      <div>
        <Row type="flex" justify="center" className="mb10">
          <Col span={18}>
            <CheckboxGroup
              className="mb10"
              options={options}
              defaultValue={this.state.checkedValues}
              onChange={this.onChange}
              value={checkedValues}
            />
          </Col>
        </Row>

        <Row className="mb15">
          <Col span={6}>
            <label className="input-label">其他：</label>
          </Col>
          <Col span={18}>
            <input
              className="ant-input ant-input-lg"
              defaultValue={this.state.ciOther}
              ref="ciOther"
              placeholder="其他险种"
            />
          </Col>
        </Row>

        <div className="mt15 center">
          <Button type="ghost" onClick={this.hide} className="mr15">取消</Button>
          <Button type="primary" onClick={this.confirm}>确定</Button>
        </div>
      </div>
    );

    return (
      <Popover
        content={content}
        title={<span><Icon type="plus"/> 全部商业险</span>}
        trigger="click"
        visible={this.state.visible}
        overlayStyle={{width: '350px', zIndex: '9999'}}
        onVisibleChange={this.handleVisibleChange}
      >
        <a href="javascript:;">选择商业保险</a>
      </Popover>
    );
  },
});

export default InsuranceSelector;
