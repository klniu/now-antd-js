import React  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import BasicTable from "./components/BasicTable";

class AdvancedTable extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
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

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    };

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
        axios.post(this.props.dataUrl, {
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

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                <Table bordered={true} pagination={pagination} scroll={{ x: true, y: 600 }} columns={this.props.columns}
                       rowKey={record => record[this.props.columns[0].dataIndex]} rowSelection={rowSelection}
                       dataSource={this.state.data} onChange={this.handleTableChange} />
            </div>
        );
    }
}

AdvancedTable.protoTypes = {
    showPagination: PropTypes.bool,
    showSelection: PropTypes.bool,
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    dataParams: PropTypes.object,
};

export default AdvancedTable;
