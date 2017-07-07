import React  from 'react';
import {Table} from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios'
import _ from 'lodash';

class BasicTable extends React.Component {
    state = {
        loading: false,
        data: []
    };

    componentDidMount() {
        this.fetch(this.props.dataParams)
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.dataParams, nextProps.dataParams)) {
            this.fetch(nextProps.dataParams)
        }
    }

    fetch = (params = {}) => {
        this.setState({loading: true});
        axios.get(this.props.dataUrl, {
            params: {
                ...params
            }
        }).then((response) => {
            this.setState({
                loading: false,
                data: response.data.results
            });
        })
    };

    render() {
        return (
            <div>
                <Table bordered={true} columns={this.props.columns}
                       rowKey={record => { return record[this.props.columns[0].dataIndex]}}
                       dataSource={this.state.data} {...this.props.tableProps}/>
            </div>
        );
    }
}

BasicTable.protoTypes = {
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    dataParams: PropTypes.object,
    tableProps: PropTypes.object
};

export default BasicTable;
