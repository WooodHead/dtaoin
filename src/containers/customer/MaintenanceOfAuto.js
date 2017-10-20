import React from 'react';
import api from '../../middleware/api';
import MaintProjectInfo from './ProjectInfo';

export default class MaintenanceOfAuto extends React.Component {
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
    api.ajax({ url: api.aftersales.maintProjectsByAutoId(customerId, autoId) }, data => {
      this.setState({ projects: data.res.list });
    });
  }

  render() {
    const detail = this.state.projects;
    return <MaintProjectInfo detail={detail}/>;
  }
}

