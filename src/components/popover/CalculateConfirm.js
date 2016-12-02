import React from 'react'
import {Popconfirm, message, Button} from 'antd'
import api from '../../middleware/api'

const CalculateConfirm = React.createClass({
  onConfirm(){
    api.ajax({url: api.checkPurchaseIncome(this.props.userAutoId)}, (data) => {
      console.log(data);
      message.success('锁定成功');
      location.hash = api.getHash();
    })
  },

  render() {
    return (
      <Popconfirm
        title="确定要锁定吗?"
        onConfirm={this.onConfirm}>
        <Button
          size="small"
          type="primary"
          disabled={this.props.isDisabled}>
          锁定收益
        </Button>
      </Popconfirm>
    );
  }
});

export default CalculateConfirm;
