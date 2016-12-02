import React, {Component} from "react";
import {Button, Breadcrumb, Icon} from "antd";

let image = require('../../../images/commingsoon.png');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>仓库-配件商城</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="margin-bottom-20 center">
          <img src={image}/>
        </div>
      </div>
    )
  }
}


