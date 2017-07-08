import React  from 'react';
import {Table} from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios'
import _ from 'lodash';

class BasicTable extends React.Component {
    state = {
        loading: false,
        data: [],
        selectedRowKeys: []
    };

    componentDidMount() {
        this.fetch(this.props.dataParams)
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.dataParams, nextProps.dataParams)) {
            this.fetch(nextProps.dataParams)
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    handleTableChange = (pagination, filters, sorter) => {
        let params = {}
        // display pagination
        if (this.props.showPagination) {
            const pager = {...this.state.pagination};
            pager.current = pagination.current;
              this.setState({
                  pagination: pager,
              });
            params = _.assign(params, {
                pageSize: pagination.pageSize,
                page: pagination.current
            });
        }
        if (!_.isUndefined(sorter)) {
            _.assign(params, {
                sortField: sorter.field,
                sortOrder: sorter.order,
            });
        }
        this.fetch({
            ...params,
            ...this.props.dataParams,
            ...filters
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        axios.get(this.props.dataUrl, {
            ...params
        }).then((response) => {
            const pagination = {...this.state.pagination};
            if (this.props.showPagination) {
                pagination.total = response.data.totalCount;
            }
            this.setState({
                loading: false,
                data: response.data.results,
            });
        })
    };

    render() {
        // pagination
        const pagination = this.props.showPagination ? this.state.pagination : false;

        // selection
        const {selectedRowKeys} = this.state;
        const rowSelection = this.props.showSelection ? {
            selectedRowKeys,
            onChange: this.onSelectChange,
        } : null;

        return (
            <div>
                <Table bordered={true} columns={this.props.columns} pagination={pagination}
                       rowSelection={rowSelection}
                       rowKey={record => { return record[this.props.columns[0].dataIndex] }}
                       dataSource={this.state.data} onChange={this.handleTableChange}
                       {...this.props.tableProps}/>
            </div>
        );
    }
}

BasicTable.protoTypes = {
    showSelection: PropTypes.bool,
    showPagination: PropTypes.bool,
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    dataParams: PropTypes.object,
    tableProps: PropTypes.object
};

export default BasicTable;
