import React  from 'react';
import PropTypes from 'prop-types';
import {Table, Row, Col, Button} from 'antd';
import axios from 'axios'
import BasicTable from './BasicTable';

class AdvancedTable extends React.Component {

    render() {
        return (
            <div>
                <Row type="flex" justify="start">
                  <Col span={4}><Button type="primary">添加</Button></Col>
                  <Col span={4}><Button type="danger">删除</Button></Col>
                </Row>
                <BasicTable showSelection={true} showPagination={true} columns={this.props.columns}
                    dataUrl = {this.props.dataUrl}
                 />
            </div>
        );
    }
}

AdvancedTable.protoTypes = {
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired
};

export default AdvancedTable;
