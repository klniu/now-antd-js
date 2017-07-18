import * as React from 'react';
import { Input, Form, InputNumber, Select, DatePicker, Cascader, TreeSelect, Checkbox } from 'antd';
import moment from 'moment';
import { isArray, isObject } from 'lodash/lang';
import update from 'immutability-helper';

export var FieldType;
(function (FieldType) {
    FieldType[FieldType["Text"] = 0] = "Text";
    FieldType[FieldType["PlainText"] = 1] = "PlainText";
    FieldType[FieldType["Number"] = 2] = "Number";
    FieldType[FieldType["InputNumber"] = 3] = "InputNumber";
    FieldType[FieldType["Password"] = 4] = "Password";
    FieldType[FieldType["Date"] = 5] = "Date";
    FieldType[FieldType["DateTime"] = 6] = "DateTime";
    FieldType[FieldType["DateRange"] = 7] = "DateRange";
    FieldType[FieldType["DateTimeRange"] = 8] = "DateTimeRange";
    FieldType[FieldType["Checkbox"] = 9] = "Checkbox";
    FieldType[FieldType["Radio"] = 10] = "Radio";
    FieldType[FieldType["Select"] = 11] = "Select";
    FieldType[FieldType["MultiSelect"] = 12] = "MultiSelect";
    FieldType[FieldType["Cascader"] = 13] = "Cascader";
    FieldType[FieldType["TreeSelect"] = 14] = "TreeSelect";
})(FieldType || (FieldType = {}));


// form options
// interface ColumnField {
//    id: string;                     the id of the input
//    type: FieldType;
//    label?: string; // the name of the field
//    hideLabel?: boolean; // if the label is hidden
//    hide?: boolean; // the whole field will be hidden
//    defaultValue?: number | string | boolean | moment.Moment[]; // the defaultValue value of the field
//    fieldOptions?: StringAnyMap; // ones of getFieldDecorator using.
    // used as array, object, will expanded according the input element type;
    // if it is a function, it will be executed to get the values.
    // only used in Tree, Cascader, Select, multiSelect
//    arrayData?: CascaderOptionType[] | TreeData[] | OptionData[] | (() => CascaderOptionType[] | TreeData[] | OptionData[]) ;
    // a function to render defaultData, the first param is the default value,
    // the second is the all form fields
    // the third is the initialData of all form fields
//    render?: (val: any, formOptions?: ColumnField[], Data?: StringAnyMap) => any;
    // a function to handle the submit data, the first param is the value of the field
    // the second is the all form fields
//    submit?: (val: any, formsOptions?: ColumnField[], Data?: StringAnyMap) => any;
//}

// getFormItems return FormItems according the item config.
// getFieldDecorator is the getFieldDecorator function from antd,
// formOptions is the collection of item configs,
// refData is the parent data of items,
// initData is for initializing the items
// itemOptions is the item options for all the items.
export function getFormItems(getFieldDecorator, formOptions, initData, formItemLayout) {
    let components = [];
    for (let i = 0, len = formOptions.length; i < len; i++) {
        let v = formOptions[i];
        let element;
        let defaultData = v.defaultValue;

        // init Data if has
        if (isObject(initData) && initData[v.id]) {
            defaultData = initData[v.id];
        }
        // if there is render function, render it
        if (typeof v.render === 'function') {
            defaultData = v.render(defaultData, formOptions, initData);
        }
        // handle arrayValues for select, multipleSelect, cascade
        let arrayValues;
        if (v.arrayData && typeof v.arrayData === 'function') {
            arrayValues = v.arrayData();
        }
        else {
            arrayValues = v.arrayData;
        }
        switch (v.type) {
            case FieldType.Text:
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <Input size="default" />);
                break;
            // input number is the Input element using a type number,not InputNumber,
            // because antd can't trigger OnChange for changing instantly in InputNumber
            case FieldType.InputNumber:
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <Input type="number" size="default" style={{width: '100%'}} />
                );
                break;
            case FieldType.Number:
                element = getFieldDecorator(v.id, {...v.fieldOptions,  initialValue: defaultData})(
                    <InputNumber size="default" style={{width: '100%'}} />);
                break;
            case FieldType.PlainText :
                element = <span className="ant-form-text">{defaultData}</span>;
                break;
            case FieldType.Select :
                let options = [];

                if (arrayValues) {
                    for (let opt of arrayValues) {
                        options.push((
                            <Select.Option value={opt.value} key={opt.value}>
                                {opt.title}
                            </Select.Option>));
                    }
                }
                // set defaultData "" if not set
                if (!defaultData) {
                    defaultData = '';
                } else {
                    // set to string
                    defaultData += '';
                }
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <Select size="default">{options}</Select>);
                break;
            case FieldType.MultiSelect:
                let mOptions = [];

                if (arrayValues) {
                    for (let opt of arrayValues) {
                        mOptions.push((
                            <Select.Option value={opt.value} key={opt.value}>
                                {opt.title}
                            </Select.Option>));
                    }
                }
                // set defaultData to string[]
                if (isArray(defaultData)) {
                    defaultData = defaultData.map((item) => '' + item);
                }
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <Select size="default" mode="multiple" >
                        {mOptions}
                    </Select>);
                break;
            case FieldType.Date :
                defaultData = defaultData && moment(defaultData);
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <DatePicker size="default" style={{width: '100%'}} />);
                break;
            case FieldType.DateTime :
                defaultData = defaultData && moment(defaultData);
                element = getFieldDecorator(v.id, {...v.fieldOptions,  initialValue: defaultData})(
                    <DatePicker
                        showTime={true}
                        size="default"
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width: '100%'}}
                    />);
                break;
            case FieldType.DateRange:
                defaultData= isArray(defaultData)?defaultData.map(val=>moment(val)):[];
                element = getFieldDecorator(v.id, {...v.fieldOptions,  initialValue: defaultData})(
                    <DatePicker.RangePicker
                        size="default"
                        format="YYYY-MM-DD"
                        style={{width: '100%'}}
                    />);
                break;
            case FieldType.DateTimeRange:
                defaultData= isArray(defaultData)?defaultData.map(val=>moment(val)):[];
                element = getFieldDecorator(v.id, {...v.fieldOptions,  initialValue: defaultData})(
                    <DatePicker.RangePicker
                        showTime={true}
                        size="default"
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width: '100%'}}
                    />);
                break;
            case FieldType.Cascader :
                element = getFieldDecorator(v.id, {...v.fieldOptions,  initialValue: defaultData})(
                    <Cascader
                        style={{width: '100%'}}
                        size="default"
                        options={arrayValues}
                    />);
                break;
            case FieldType.TreeSelect :
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <TreeSelect dropdownMatchSelectWidth={false} treeData={arrayValues}/>);
                break;
            case FieldType.Password :
                element = getFieldDecorator(v.id, {...v.fieldOptions, initialValue: defaultData})(
                    <Input type="password" />);
                break;
            case FieldType.Checkbox :
                element = getFieldDecorator(v.id, {...v.fieldOptions, valuePropName: 'checked',
                    initialValue: defaultData})(
                    <Checkbox> {v.label} </Checkbox>);
                break;
            default:
                break;
        }
        if (v.hideLabel) {
            components.push(
                // set key more unique because sometime the id is same when there are reference data
                <Form.Item key={v.id + v.type} style={v.hide ? {display: 'none'} : {}} {...formItemLayout}>
                    {element}
                </Form.Item>
            );
        } else {
            components.push(
                // set key more unique because sometime the id is same when there are reference data
                <Form.Item
                    key={v.id + v.type}
                    style={v.hide ? {display: 'none'} : {}}
                    {...formItemLayout}
                    label={v.label}
                >
                    {element}
                </Form.Item>
            );
        }
    }
    return components;
}
// execute the submit for every field, convert date to utc
// formOptions is like
export function handleFormData(values, formOptions) {
    // make a new object to include new value
    let params = {};
    for (let i = 0, len = formOptions.length; i < len; i++) {
        let v = formOptions[i];
        let value = values[v.id];
        if (v.submit && v.hasOwnProperty('submit')) {
            params[v.id] = v.submit(value, formOptions, values);
        }
    }
    return update(values, { $merge: params });
}
