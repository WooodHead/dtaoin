import React from 'react';
import {Row, Col, Popover} from 'antd';
import formatter from '../../utils/DateFormatter';

let ShowParts = React.createClass({
  getInitialState() {
    return {
      visible: false,
    };
  },

  hide() {
    this.setState({
      visible: false,
    });
  },

  handleVisibleChange(visible) {
    this.setState({visible});
  },

  addNewItem(){
    let newItem = this.refs.newItem.value;
    if (newItem) {
      this.props.save(newItem);
      this.hide();
    }
  },

  render() {
    let {parts} = this.props;

    const content = (
      <div>
        <Row type="flex">
          <Col span={10}>
            <p className="text-gray">进货时间</p>
          </Col>
          <Col span={4}>
            <p className="text-gray">单价(元)</p>
          </Col>
          <Col span={4}>
            <p className="text-gray">进货数量</p>
          </Col>
          <Col span={6}>
            <p className="text-gray">金额小计(元)</p>
          </Col>
        </Row>
        {parts.map((part, index) =>
          <Row key={index} type="flex">
            <Col span={10}>
              <p className="text-gray">{formatter.hour(part.ctime)}</p>
            </Col>
            <Col span={4}>
              <p className="text-gray">{part.in_price}</p>
            </Col>
            <Col span={4}>
              <p className="text-gray">{part.amount}</p>
            </Col>
            <Col span={6}>
              <p className="text-gray">{Number(part.in_price) * Number(part.amount)}元</p>
            </Col>
          </Row>
        )}
      </div>
    );

    return (
      <Popover
        content={content}
        title="进货详情"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        overlayStyle={{width: '450px'}}>
        <a href="javascript:;">详情</a>
      </Popover>
    );
  },
});

export default ShowParts;
