import React, {Component} from "react";
import {Button, Breadcrumb, Icon} from "antd";
import api from "../../../middleware/api";
import PartBasicInfo from "../../../components/boards/aftersales/PartBasicInfo";
import PartEntryInfo from "../../../components/boards/aftersales/PartEntryInfo";
import TablePagination from "../../../components/tables/TablePagination";

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      entry_list: []
    };
  }

  componentDidMount() {
    this.initPage();
  }

  componentWillReceiveProps() {
    this.initPage();
  }

  initPage() {
    const {id} = this.props.params, {page} = this.props.location.query;
    this.getPartDetail(id);
    this.getPartEntryList(id, page);
  }

  getPartDetail(id) {
    api.ajax({url: api.getPartsDetail(id)}, function (data) {
      this.setState({detail: data.res.detail});
    }.bind(this))
  }

  getPartEntryList(id, page) {
    api.ajax({url: api.getPartsEntryList(id, page)}, function (data) {
      this.setState({entry_list: data.res.list});
    }.bind(this))
  }

  render() {
    const {detail, entry_list}=this.state,
      {id}=this.props.params,
      {page}=this.props.location.query,
      itemsLength = entry_list ? entry_list.length : 0;
    
    const paginationProps = {
      pathname: `maint-sell/warehouse/detail/${id}`,
      page: page,
      prevDisabled: page < 2,
      nextDisabled: itemsLength < api.config.halfLimit
    };
    
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/> 配件信息</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {detail.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="margin-bottom-20">
          <PartBasicInfo detail={detail}/>
        </div>

        <div className="margin-top-40">
          <h3 className="font-size-24 margin-bottom-10">进货信息</h3>
          {entry_list.map((item, index)=><PartEntryInfo key={item._id} detail={item}/>)}
          <TablePagination {...paginationProps}/>
        </div>
      </div>
    )
  }
}


