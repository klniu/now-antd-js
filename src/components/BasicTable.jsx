import React  from 'react';
import {Table, Modal} from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios'
import _ from 'lodash';
import update from 'immutability-helper';

class BasicTable extends React.Component {
    state = {
        loading: false,
        data: [],
        tableParams: {pagination: {current: 1, total: 0, pageSize: 10}, sorter: {}} // the parameter of table changing, include pagination, filter and sorter
    };

    componentDidMount() {
        this.fetch()
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.dataParams, nextProps.dataParams) || this.props.refresh !== nextProps.refresh) {
            this.fetch()
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        let tableParams = this.state.tableParams;
        // display pagination
        if (this.props.showPagination) {
            tableParams = update(tableParams, { pagination: {$merge: {current: pagination.current}}});
            // const pager = {...this.state.tableParams.pagination};
            // pager.current = pagination.current;
            //   this.setState({
            //       pagination: pager,
            //   });
            // params = _.assign(params, {
            //     pageSize: pagination.pageSize,
            //     page: pagination.current
            // });
        }
        if (!_.isUndefined(sorter)) {
            tableParams = update(tableParams, {sorter: {$merge: {field: sorter.field, order: sorter.order}}})
        }
        this.setState({tableParams});
        this.fetch();
    };

    fetch = () => {
        this.setState({loading: true});
        axios.get(this.props.dataUrl, {
            ...this.state.tableParams.pagination,
            ...this.state.tableParams.sorter,
            ...this.props.dataParams
        }).then((response) => {
            let tableParams = this.state.tableParams;
            if (this.props.showPagination) {
                tableParams = update(tableParams, {pagination: {$merge: {total: response.data.totalCount}}});
            }
            this.setState({
                loading: false,
                data: response.data.results,
                tableParams
            });
        }).catch(function (error) {
            Modal.error({
                title: '数据获取失败',
                content: error +'. 请检查网络'
            });
        });
    };

    render() {
        // pagination
        const pagination = this.props.showPagination ? this.state.tableParams.pagination : false;

        // selection
        const {selectedRowKeys} = this.props;
        const rowSelection = this.props.showSelection ? {
            selectedRowKeys,
            onChange: this.props.onSelectChange,
        } : null;

        return (
            <div>
                <Table bordered={true} columns={this.props.columns} pagination={pagination}
                       rowSelection={rowSelection}
                       rowKey={record => { return record[this.props.columns[0].dataIndex] }}
                       dataSource={this.state.data} onChange={this.handleTableChange}
                       onRowDoubleClick={this.props.onRowDoubleClick}
                       {...this.props.tableProps}/>
            </div>
        );
    }
}

BasicTable.protoTypes = {
    showSelection: PropTypes.bool,
    onSelectChange: PropTypes.func,
    selectedRowKeys: PropTypes.array,
    showPagination: PropTypes.bool,
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    dataParams: PropTypes.object,
    tableProps: PropTypes.object,
    onRowDoubleClick: PropTypes.func,
    refresh: PropTypes.string
};

export default BasicTable;
