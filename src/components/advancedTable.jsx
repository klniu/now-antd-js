import React  from 'react';
import { Table, Modal } from 'antd';
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
        data: {}
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
            limit: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });
        axios.post(this.props.dataUrl, {
            limit: this.state.pagination.pageSize,
            ...params,
        }).then((response) => {
            const pagination = {...this.state.pagination};
            pagination.total = response.totalCount;
            this.setState({
                loading: false,
                data: response.data,
                pagination,
            });
        })
    };

    render() {
        // pagination
        const pagination = this.props.showPagination?this.state.pagination:false;

        return (
            <div>
                <Table bordered={true} pagination={pagination} scroll={true} columns={this.props.columns}
                       dataSource={this.state.data} onChange={this.handleTableChange} />
            </div>
        );
    }
}

AdvancedTable.protoTypes = {
    showPagination: PropTypes.bool,
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    addUrl: PropTypes.string.isRequired,
    removeUrl: PropTypes.string.isRequired,
};

export default AdvancedTable;
