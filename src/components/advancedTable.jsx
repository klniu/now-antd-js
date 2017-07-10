import React  from 'react';
import PropTypes from 'prop-types';
import {Table, Modal, Button, Form} from 'antd';
import axios from 'axios'
import BasicTable from './BasicTable';
import SideModal from "./SideModal";
import {getFormItems} from './forms'

class AdvancedTableBase extends React.Component {
    state= {
        selectedRowKeys: [],
        formItems: [],
        formVisible: false
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    add = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        this.setState({
            formItems: getFormItems(getFieldDecorator,this.props.formOptions, undefined, formItemLayout),
            formVisible: true
        })
    };

    remove = ()=>{
        const count = this.state.selectedRowKeys.length;
        if (count === 0) return;
        this.setState({loading: true});
        axios.post(this.props.removeUrl, {
           ids: this.state.selectedRowKeys
        }).then((response) => {
            if (response.error) {
                Modal.error({
                    title: '删除失败',
                    content: response.error
                });
            } else {
                Modal.error({
                    title: '删除失败',
                    content: '共删除' + count + "条数据"
                });
            }
            this.setState({
                loading: false,
            });
        });
    };

    cancelModal = () => {
        this.setState({formVisible: false})
    };


    render() {
        return (
            <div>
                <div style={{textAlign: "left"}}>
                    <Button type="primary" onClick={this.add}>添加</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="danger" disabled={this.state.selectedRowKeys.length === 0} onClick={this.remove}>删除</Button>
                </div>
                <br />
                <BasicTable showSelection={true} onSelectChange={this.onSelectChange}
                            selectedRowKeys={this.state.selectedRowKeys} showPagination={true}
                            columns={this.props.columns}
                            dataUrl={this.props.dataUrl}


                />
                <SideModal title={this.props.formTitle} visible={this.state.formVisible} onOK={this.refreshTable} onCancel={
                    this.cancelModal}>
                    <Form>
                        {this.state.formItems}
                    </Form>
                </SideModal>
            </div>
        );
    }
}

AdvancedTableBase.protoTypes = {
    columns: PropTypes.shape(Table.Column).isRequired,
    dataUrl: PropTypes.string.isRequired,
    formOptions: PropTypes.object,
    removeUrl: PropTypes.string.isRequired,
    addUrl: PropTypes.string.isRequired,
    formTitle: PropTypes.string.isRequired
};

const AdvancedTable = Form.create()(AdvancedTableBase);

export default AdvancedTable;
