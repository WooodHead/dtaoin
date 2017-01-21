import React from 'react';
// import {Link} from 'react-router';
// import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import MaintProjectInfo from './ProjectInfo';

export default class MaintProjectsInfoOfAuto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.getAutoProjects(this.props.customer_id, this.props.auto_id);
  }

  getAutoProjects(customerId, autoId) {
    api.ajax({url: api.maintProjectsByAutoId(customerId, autoId)}, function (data) {
      this.setState({projects: data.res.intention_list});
    }.bind(this));
  }

  render() {
    let detail = this.state.projects;
    return (
      <div>
        {/*<Row type="flex" className="info-row">*/}
        {/*<Col span={4}>*/}
        {/*<span className="margin-left-20" style={{fontSize : '16px'}}>维保信息</span>*/}
        {/*</Col>*/}

        {/*<Col span="20">*/}
        {/*<Link*/}
        {/*to={{ pathname: '/aftersales/project/create/', query: { customer_id: this.props.customer_id, auto_id: this.props.auto_id}}}*/}
        {/*target="_blank"*/}
        {/*>*/}
        {/*<Button type="primary" style={{float: 'right'}}>添加工单</Button>*/}
        {/*</Link>*/}
        {/*</Col>*/}
        {/*</Row>*/}

        <MaintProjectInfo detail={detail}/>
      </div>
    );
  }
}

