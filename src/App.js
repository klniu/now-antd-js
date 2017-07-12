import React, {Component} from 'react';
import './App.css';
import BasicTable from "./components/BasicTable";
import AdvancedTable from "./components/advancedTable";
import {FieldType, getFormItems} from './components/forms'
import { Form, Button} from 'antd';
import SideModal from "./components/SideModal";

class App extends Component {
    state ={
        modalVisible: false,
        modalTitle: "Modal",
        onOk: ()=> this.setState({modalVisible: false}),
        onCancel: ()=> this.setState({modalVisible: false}),
    };
    openModal = ()=>{
        this.setState({modalVisible: true});
    };
    render() {
        const tableColumns = [
            {
                dataIndex: 'id',
                className: 'none'
            }, {
                title: 'Title',
                dataIndex: 'title',
                sorter: true,
            }, {
                title: 'Author',
                dataIndex: 'author',
            }];
        const tableDataUrl = "http://localhost:3001/table";
        const formOptions = [
            {
                id: "id",
                type: FieldType.Text,
                hide: true
            }, {
                id: "title",
                type: FieldType.Text,
                label: "Title",
            }, {
                id: "author",
                type: FieldType.Text,
                label: "Author"
            }
        ];

        return (
            <div className="App">
                <br /><br />
                <h2>基础表格</h2>
                <BasicTable dataUrl={tableDataUrl} columns={tableColumns}/>
                <br /><br />
                <h2>带分页的基础表格</h2>
                <BasicTable dataUrl={tableDataUrl} columns={tableColumns} showPagination={true}/>
                <br /><br />
                <h2>带分页和多选的基础表格</h2>
                <BasicTable dataUrl={tableDataUrl} columns={tableColumns} showPagination={true}
                            showSelection={true}/>
                <br /><br />
                <WrappedFormDemo />
                <br /><br />
                <Button onClick={this.openModal}>Modal</Button>
                <SideModal title={this.state.modalTitle} visible={this.state.modalVisible} onOK={this.state.onOk}
                           onCancel={this.state.onCancel}
                ><WrappedFormDemo /></SideModal>

                <br /><br />
                <h2>高级表格</h2>
                <AdvancedTable columns={tableColumns} dataUrl = {tableDataUrl} removeUrl = {tableDataUrl+"/remove"}
                               formOptions={formOptions} formTitle="高级表格测试" addUrl={tableDataUrl + "/add"}
                               editUrl={tableDataUrl + "/edit"}
                />
            </div>
        );
    }
}

class FormDemo extends React.Component {
    render() {
        let formOptions= [
            {
                id: "Text",
                type: FieldType.Text,
                label: "Text",
            },{
                id: "TextWithDefaultValue",
                type: FieldType.Text,
                label: "TextWithDefaultValue",
                defaultValue: "DefaultValue"
            },{
                id: "TextWithDefaultValueAndRender",
                type: FieldType.Text,
                label: "TextWithDefaultValue",
                defaultValue: "DefaultValue",
                render: val => val +"AndRender"
            },{
                id: "Number",
                type: FieldType.Number,
                label: "Number",
                fieldOptions : {
                    rules :[
                        {
                            type: "number",
                            min: 2,
                            max: 10,
                            required: true,
                            message: "输入2-10之间的整数"
                        }
                    ]
                },
            },{
                id: "Password",
                type: FieldType.Password,
                label: "Password",
                fieldOptions : {
                    rules :[
                        {
                            type: "string",
                            min: 6,
                            max: 50,
                            required: true,
                            message: "输入长度在2-50之间的密码"
                        }
                    ]
                },
            },{
                id: "Date",
                type: FieldType.Date,
                label: "Date",
                defaultValue: "2016-12-31"
            },{
                id: "DateTime",
                type: FieldType.DateTime,
                label: "DateTime",
                defaultValue: "2016-12-31 11:11:11"
            },{
                id: "DateRange",
                type: FieldType.DateRange,
                label: "DateRange",
                defaultValue: ["2016-12-31", "2017-05-01"]
            },{
                id: "DateTimeRange",
                type: FieldType.DateTimeRange,
                label: "DateTimeRange",
                defaultValue: ["2016-12-31 11:11:11", "2017-05-01 12:12:12"]
            },{
                id: "CheckBox",
                type: FieldType.Checkbox,
                hideLabel: true,
                label: "CheckBox",
                defaultValue: true
            }, {
                id: "Select",
                type: FieldType.Select,
                label: "Select",
                defaultValue: "10",
                arrayData: [{
                    value: "10",
                    title: "First"
                },{
                    value: "20",
                    title: "Second"
                }]
            }, {
                id: "MultiSelect",
                type: FieldType.MultiSelect,
                label: "MultiSelect",
                defaultValue: ["10","20"],
                arrayData: [{
                    value: "10",
                    title: "First"
                }, {
                    value: "20",
                    title: "Second"
                }]
            }, {
                id: "Cascader",
                type: FieldType.Cascader,
                label: "Cascader",
                defaultValue: ["zhejiang","hangzhou", "xihu"],
                arrayData:  [{
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [{
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [{
                            value: 'xihu',
                            label: 'West Lake',
                        }],
                    }],
                }, {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [{
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [{
                            value: 'zhonghuamen',
                            label: 'Zhong Hua Men',
                        }],
                    }],
                }]
            }, {
                id: "TreeSelect",
                type: FieldType.TreeSelect,
                label: "TreeSelect",
                defaultValue: ["xihu"],
                arrayData:  [{
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [{
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [{
                            value: 'xihu',
                            label: 'West Lake',
                        }],
                    }],
                }, {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [{
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [{
                            value: 'zhonghuamen',
                            label: 'Zhong Hua Men',
                        }],
                    }],
                }]
            }
        ];
        let initData =
            {
                Text: "text",
                TextWithDefaultValue: "TextWithDefaultValue",
                TextWithDefaultValueAndRender: "TextWithDefaultValue",
                Number: 11,
                Password: "Password",
                Date: "2017-12-31",
                DateTime: "2017-12-31 11:11:11",
                DateRange: ["2017-12-31", "2018-05-01"],
                DateTimeRange: ["2017-12-31 11:11:11", "2018-05-01 12:12:12"],
                CheckBox: false,
                Select: "20",
                MultiSelect: ["10"],
                Cascader: ["jiangsu", "nanjing", "zhonghuamen"],
                TreeSelect: ["zhonghuamen"]
            };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let formItems = getFormItems(getFieldDecorator, formOptions, undefined, formItemLayout)
        let formItemsIncludeInit = getFormItems(getFieldDecorator, formOptions, initData, formItemLayout)

        return (
            <div>
                <h2>表单</h2>
                <Form>
                    {formItems}
                </Form>

                <h2>含初始化数据的表单</h2>
                <Form>
                    {formItemsIncludeInit}
                </Form>
            </div>
        )
    }
}

const WrappedFormDemo = Form.create()(FormDemo);

export default App;
