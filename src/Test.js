import React from 'react';
import {Select, Input, Form, Button} from 'antd';

import MoneyInput from './components/widget/NumberInput';

const FormItem = Form.Item;
const Option = Select.Option;

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ['a', 'b', 'c', 'd'],
    };

    [
      'getValue',
      'handleButtonClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleButtonClick() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      console.log('values', values);
      this.props.form.resetFields();
    });
  }

  getValue(value) {
    if (Number(value) > 100) {
      return false;
    }
    return true;
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let {data} = this.state;
    return (
      <div>
        <FormItem label="QQ" labelCol={{span: 2}} wrapperCol={{span: 22}}>
          {getFieldDecorator('qq')(
            <Select
              combobox
              filterOption={false}
              style={{width: '200px'}}
              dropdownStyle={{maxHeight: '200px'}}
            >
              {data.map((item, index) =>
                <Option key={item}>{item}</Option>
              )}
            </Select>
          )}
        </FormItem>

        <FormItem label="价格" labelCol={{span: 2}} wrapperCol={{span: 22}}>
          <MoneyInput
            defaultValue=""
            id="plate_num"
            onChange={this.getValue}
            isInt={false}
            self={this}
            placeholder="34"
          />
        </FormItem>

        <Button onClick={this.handleButtonClick}>提交</Button>
      </div>
    );
  }
}

Test = Form.create()(Test);
export default Test;

