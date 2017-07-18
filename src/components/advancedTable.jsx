import React  from 'react';
import PropTypes from 'prop-types';
import {Table, Modal, Button, Form} from 'antd';
import axios from 'axios'
import BasicTable from './BasicTable';
import SideModal from "./SideModal";
import {getFormItems, handleFormData} from './forms'
import {RandomStr} from "./common";
import {isEqual} from 'lodash/lang';

class AdvancedTableBase extends React.Component {
    state = {
        selectedRowKeys: [],
        formInitData: {},
        formVisible: false,
        refreshTable: "",
        formUrl: ""
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    add = () => {
        // reset form
        this.props.form.resetFields();
        this.setState({
            formInitData: {},
            formVisible: true,
            formUrl: this.props.addUrl
        })
    };

    edit = (record, index, event) => {
        // reset form
        this.props.form.resetFields();
        this.setState({
            formInitData: record,
            formVisible: true,
            formUrl: this.props.editUrl
        })
    };

    remove = () => {
        const count = this.state.selectedRowKeys.length;
        if (count === 0) return;
        Modal.confirm({
            title: '确认删除',
            content: '确认删除选中记录？',
            onOk: () => {
                this.setState({loading: true});
                axios.post(this.props.removeUrl, {
                    ids: this.state.selectedRowKeys
                }).then((response) => {
                    if (response.data.error) {
                        Modal.error({
                            title: '删除失败',
                            content: response.data.error
                        });
                    } else {
                        Modal.error({
                            title: '删除失败',
                            content: '共删除' + count + "条数据"
                        });
                    }
                    this.setState({
                        refreshTable: RandomStr(),
                        loading: false,
                    });
                }).catch(function (error) {
                    Modal.error({
                        title: '删除失败',
                        content: error + '. 请检查网络'
                    });
                });
            },
        });

    };

    cancelModal = () => {
        this.setState({formVisible: false})
    };

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (isEqual(values, this.state.formInitData)) {
                    Modal.warning({
                        title: '提交表单',
                        content: "表单未修改"
                    });
                    return
                }
                this.sendForm(handleFormData(values, this.props.formOptions))
            }
        });
    };

    sendForm = (params) => {
        this.setState({
            loading: true
        });
        axios.post(this.state.formUrl, params).then((response) => {
                if (response.data.error) {
                    Modal.error({
                        title: '提交失败',
                        content: response.data.error
                    });
                } else {
                    this.setState({
                        loading: false,
                        formVisible: false,
                    });
                }
            }
        ).catch((error) => {
            Modal.error({
                title: '提交失败',
                content: error + '. 请检查网络'
            });
        });
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const formItems = getFormItems(getFieldDecorator, this.props.formOptions, this.state.formInitData, formItemLayout);
        return (
            <div>
                <div style={{textAlign: "left"}}>
                    <Button type="primary" onClick={this.add}>添加</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="danger" disabled={this.state.selectedRowKeys.length === 0}
                            onClick={this.remove}>删除</Button>
                </div>
                <br />
                <BasicTable showSelection={true} onSelectChange={this.onSelectChange}
                            selectedRowKeys={this.state.selectedRowKeys} showPagination={true}
                            columns={this.props.columns}
                            dataUrl={this.props.dataUrl}
                            onRowDoubleClick={this.edit}
                            refresh={this.state.refreshTable}
                />
                <SideModal title={this.props.formTitle} visible={this.state.formVisible}
                           onOk={this.handleSubmit} onCancel={this.cancelModal}>
                    <Form>
                        {formItems}
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
    editUrl: PropTypes.string.isRequired,
    formTitle: PropTypes.string.isRequired
};

const AdvancedTable = Form.create()(AdvancedTableBase);

export default AdvancedTable;
