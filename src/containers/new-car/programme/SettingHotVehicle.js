import React from 'react';
import { message, Modal, Form, Button, Switch, Select, Row, Col, Input } from 'antd';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

class SettingHotVehicle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = record => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

      }
    });
  };

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    return (
      <span>
	        <a href="#" onClick={() => {
          this.showModal(record);
        }}>
	          设置热门
	        </a>
              <Modal
                visible={this.state.visible}
                title="设置热门"
                footer={<Row>
                  <Col>
                    <Button key="back" onClick={this.handleCancel}>取消</Button>
                    <Button type="primary">确定</Button>

                  </Col>
                </Row>}
                onCancel={this.handleCancel}
              >
              <Form onSubmit={this.handleSubmit}>
               <FormItem
                 {...formItemLayout}
                 label="热门方案"
               >
		          {getFieldDecorator('is_hot', { valuePropName: 'checked' })(
                <Switch />,
              )}
		        </FormItem>
                <FormItem
                  {...formItemLayout}
                  help="值越大越靠前"
                  label="顺序"
                >
                    {getFieldDecorator('order', {
                      rules: [{ required: true, message: '请填写序号', whitespace: true }],
                    })(
                      <Input type="number" placeholder="值越大越靠前" />,
                    )}
                  </FormItem>
                 
              </Form>
        </Modal>
      </span>
    );
  }
}

SettingHotVehicle = Form.create()(SettingHotVehicle);
export default SettingHotVehicle;
