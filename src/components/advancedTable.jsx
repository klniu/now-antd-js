import React  from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios'

class AdvancedTable extends React.Component {
    state = {
        loading: false,
        pagination: {
            total: 0,
            pageSize: 20,
            showTotal: (total, range) => {`${range[0]}-${range[1]} 共${total}条`},
            defaultCurrent: 1
        },
        data: []
    };

    componentDidMount() {
        this.fetch()
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pageSize: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });
        axios.get(this.props.dataUrl, {
            pageSize: this.state.pagination.pageSize,
            ...this.props.dataParams,
            ...params
        }).then((response) => {
            const pagination = {...this.state.pagination};
            pagination.total = response.data.totalCount;
            this.setState({
                loading: false,
                data: response.data.results,
                pagination,
            });
        })
    };

    render() {
        // pagination
        const pagination = this.props.showPagination?this.state.pagination:false;

        return (
            <div>
                <Table bordered={true} pagination={pagination} scroll={{ x: true, y: 600 }} columns={this.props.columns}
                       rowKey={record => record[this.props.columns[0].dataIndex]}
                       dataSource={this.state.data} onChange={this.handleTableChange} />
            </div>
        );
    }
}

AdvancedTable.protoTypes = {
    showPagination: PropTypes.bool,
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    dataParams: PropTypes.object,
    addUrl: PropTypes.string.isRequired,
    removeUrl: PropTypes.string.isRequired,
};

export default AdvancedTable;
