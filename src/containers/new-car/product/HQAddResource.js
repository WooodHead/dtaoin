import React from 'react';
import { message, Modal, Form, Button, Icon, Select, Row, Col, Input } from 'antd';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

class HQAddResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = () => {
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
        this.props.post_markertResourceCreate(values);
        this.props.get_marketList(0, -1);
        this.setState({ visible: false });
      }
    });
  };

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    return (
      <span>
        <Col span={24}>
	        <Button type="primary" style={{ width: '100%' }} onClick={this.showModal}>
	          新增资源方
	        </Button>
        </Col>
              <Modal
                visible={this.state.visible}
                title="新增资源方"
                footer={[
                  <Button key="back" onClick={this.handleCancel}>取消</Button>,
                  <Button key="2" type="primary" htmlType="submit"
                          onClick={this.handleSubmit}>确定</Button>,
                ]}
                onCancel={this.handleCancel}
              >
              <Form onSubmit={this.handleSubmit}>
               <Row>
		          <Col span={24}>
		            <FormItem
                  {...formItemLayout}
                  label="资源方名称"
                >
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请填写资源方名称', whitespace: true }],
                      })(
                        <Input placeholder="请输入资源方名称" />,
                      )}
               </FormItem>
                <FormItem label="联系人" {...formItemLayout}>
                    {getFieldDecorator('contact', {
                      rules: [{ required: false, message: '请填写联系人', whitespace: true }],
                    })(
                      <Input placeholder="请输入联系人" />,
                    )}
                  </FormItem>
                  <FormItem label="电话" {...formItemLayout}>
                    {getFieldDecorator('telphone', {
                      rules: [{ required: false, message: '请输入电话', whitespace: true }],
                    })(
                      <Input type="number" placeholder="请输入电话" />,
                    )}
                  </FormItem>
                    <FormItem {...formItemLayout}>
			          </FormItem>
                  </Col>
                  </Row>
              </Form>
        </Modal>
      </span>
    );
  }
}

HQAddResource = Form.create()(HQAddResource);
export default HQAddResource;
