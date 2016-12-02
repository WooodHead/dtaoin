import React from 'react'
import {Link} from 'react-router'
import {Button, Icon} from 'antd'

const TablePagination = React.createClass({
  render() {
    const {prevDisabled, page, nextDisabled, pathname} = this.props;
    let prevPage = prevDisabled ? Number(page) : Number(page) - 1,
      nextPage = nextDisabled ? Number(page) : Number(page) + 1;

    return (
      <div className="pull-right mt15">
        <Link to={{pathname,query:{page:prevPage}}}>
          <Button
            type="ghost"
            className="mr15"
            disabled={prevDisabled}>
            <Icon type="left"/>
          </Button>
        </Link>

        <Button
          className="mr15"
          type="primary">
          {page}
        </Button>

        <Link to={{pathname,query:{page:nextPage}}}>
          <Button
            type="ghost"
            disabled={nextDisabled}>
            <Icon type="right"/>
          </Button>
        </Link>
      </div>
    );
  }
});

TablePagination.defaultProps = {};
export default TablePagination;
