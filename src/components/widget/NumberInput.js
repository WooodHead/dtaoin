/**
 *@fileName:NumberInput.js
 *@author:mrz
 *@time:下午12:42
 *@disc:
 需要传入的参数：
 必填参数：  id： 必须保证在this中唯一； self： 如果是表单 self必填。

 选填：
 defaultValue；
 style；
 placeholder；
 rules;
 self 固定格式self={this} 如果是表单 self必填；
 isInt：  true 整数; 默认为false,保留两位小数；
 layout：布局；
 label:
 unitVisible: 单位是否显示，默认显示
 disabled:

 功能：
 输入必须是数字， 不能小于0，小数点位数两位或者无;
 this.props.onChange 返回false则输入框置空 正确的时候一定要return true.

 用法:
 <NumberInput
 defaultValue="0"
 id="pay_amount"
 rules={[{required: true, message: '请输入实付金额'}]}
 onChange={this.handleRealAmountChange}
 self={this}
 layout={formItemFour}
 />
 **/
import React from 'react';
import {message, Form} from 'antd';
import className from 'classnames';

const FormItem = Form.Item;
export default class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitShow: false,
    };

    [
      'handleChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  static defaultProps = {
    defaultValue: '',
    style: {width: '100%'},
    isInt: false,
    placeholder: '',
    rules: '',
    layout: {labelCol: {span: 8}, wrapperCol: {span: 16}},
    label: '',
    unitVisible: true,
    onChange: () => {
    },
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        unitShow: true,
      });
    }, 0);

  }

  handleChange(e) {
    let value = e.target.value;
    let {id, onChange, isInt} = this.props;

    let showValue = '';

    if (isNaN(value)) {
      message.error('只能输入大于零数字');
      this[id].value = '';
      onChange('');
      return false;
    }

    let decimal = value.split('.')[1];

    if (!isInt) {
      (decimal && decimal.length > 2) ? message.warning('最多只能输入两位小数') : '';
      showValue = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      this[id].value = showValue;
    } else {
      value && value.indexOf('.') > 0 ? message.warning('只能输入整数') : '';
      showValue = value.replace(/[^\d]/g, '');
      this[id].value = showValue;
    }

    let isEmpty = onChange(showValue);
    if (isEmpty === false) {
      this[id].value = '';
      onChange('');
    }
  }

  render() {
    let {unitShow} = this.state;
    let {defaultValue, id, style, self, placeholder, rules, layout, label, unitVisible, disabled} = this.props;
    let getFieldDecorator = '';
    let content = '';

    let unit = className({
      'number-input-addon': unitVisible && unitShow,
      hide: !unitVisible || !unitShow,
    });

    self && (getFieldDecorator = self.props.form.getFieldDecorator);

    self ?
      content = (
        <span ref={content => this[`content${id}`] = content}>
          <FormItem label={label} {...layout}>
            {getFieldDecorator(id, {
              initialValue: String(defaultValue) || '',
              validateTrigger: 'onBlur',
              rules: rules,
            })(
              <input
                className="ant-input ant-input-lg"
                style={style}
                ref={price => this[id] = price}
                onInput={e => this.handleChange(e)}
                placeholder={placeholder}
                disabled={disabled}
              />
            )}
            <span className={unit}>元</span>
           </FormItem>
        </span>
      )
      :
      content = (
        <span ref={content => this[`content${id}`] = content}>
          <input
            defaultValue={defaultValue}
            className="ant-input ant-input-lg"
            style={style}
            ref={price => this[id] = price}
            onInput={e => this.handleChange(e)}
            placeholder={placeholder}
            disabled={disabled}
          />
          <span className={unit}>个</span>
        </span>
      );
    return content;
  }
}

