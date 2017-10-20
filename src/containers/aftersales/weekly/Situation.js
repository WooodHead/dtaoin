import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

import Basic from './Basic';
import ProfitLow from './ProfitLow';
import PurchaseInStock from './PurchaseInStock';
import ItemNotMatch from './ItemNotMatch';
import PriceRise from './PriceRise';
import Reject from './Reject';

require('../weekly.less');

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      superPartList: [
        {
          index: 1,
          name: '开单基本情况',
        }, {
          index: 2,
          name: '毛利率偏低',
        }, {
          index: 3,
          name: '配件与项目不符',
        }, {
          index: 4,
          name: '有库存进货',
        }, {
          index: 5,
          name: '比历史进价高',
        }, {
          index: 6,
          name: '退货',
        }],
      currentId: '1',
      page: 1,
      visible: false,
      partsId: '',
      reload: false,
    };

    [].map(method => this[method] = this[method].bind(this));
  }

  handleSuperPartClick(e, item) {
    this.setState({ currentId: item.index });
  }

  render() {
    const { superPartList, currentId } = this.state;

    const { startTime } = this.props;

    return (
      <div className="mt10 ml-20">
        <Row>
          <Col className="top-category" span={6}>
            <ul>
              {
                superPartList.map(item => {
                  const isActive = Number(item.index) === Number(currentId);
                  return (
                    <li
                      className={isActive ? 'active' : ''}
                      key={item.index}
                      onClick={() => this.handleSuperPartClick(this, item)}
                    >
                      {item.name}
                    </li>
                  );
                })
              }
            </ul>
          </Col>
          <Col className="second-category pl20" span={18}>
            <div className={String(currentId) === '1' ? '' : 'hide'}>
              <Basic startTime={startTime} />
            </div>

            <div className={String(currentId) === '2' ? '' : 'hide'}>
              <ProfitLow startTime={startTime} />
            </div>

            <div className={String(currentId) === '3' ? '' : 'hide'}>
              <ItemNotMatch startTime={startTime} />
            </div>

            <div className={String(currentId) === '4' ? '' : 'hide'}>
              <PurchaseInStock startTime={startTime} />
            </div>

            <div className={String(currentId) === '5' ? '' : 'hide'}>
              <PriceRise startTime={startTime} />
            </div>

            <div className={String(currentId) === '6' ? '' : 'hide'}>
              <Reject startTime={startTime} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

List = Form.create()(List);
export default List;
