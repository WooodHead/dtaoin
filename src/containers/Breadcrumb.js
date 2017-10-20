import React, { Component } from 'react';
import { Breadcrumb } from 'antd';

const BreadcrumbItem = Breadcrumb.Item;

export default class BreadCrumb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbArr: [],
    };
  }

  componentDidMount() {
    const { breadcrumbName } = this.props;
    const breadcrumbArr = breadcrumbName.split('/');
    this.setState({ breadcrumbArr });
  }

  render() {
    const { breadcrumbArr } = this.state;
    return (
      <Breadcrumb>
        {breadcrumbArr.map((item, index) => <BreadcrumbItem key={index}>{item}</BreadcrumbItem>)}
      </Breadcrumb>
    );
  }
}
