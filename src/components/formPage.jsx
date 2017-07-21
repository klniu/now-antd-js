import React  from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Form, Spin} from 'antd';
import axios from 'axios'
import {getFormItems, handleFormData} from './formBuilder'
import {isEqual} from 'lodash/lang';

class FormPageBase extends React.Component {
    state = {
        loading: false,
    };

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (isEqual(values, this.props.initData)) {
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
        axios.post(this.props.url, params).then((response) => {
                if (response.data.error) {
                    Modal.error({
                        title: '保存失败',
                        content: response.data.error
                    });
                } else {
                    this.setState({ loading: false });
                }
            }
        ).catch((error) => {
            Modal.error({
                title: '保存失败',
                content: error + '. 请检查网络'
            });
            this.setState({ loading: false });
        });
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const formItems = getFormItems(getFieldDecorator, this.props.formOptions, this.props.initData, formItemLayout);
        return (
            <Spin spinning={this.state.loading}>
                <Form>
                    {formItems}
                </Form>
                <div style={{textAlign: "center"}}>
                    <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                </div>
            </Spin>
        );
    }
}

FormPageBase.protoTypes = {
    formOptions: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    initData: PropTypes.object
};

const FormPage = Form.create()(FormPageBase);

export default FormPage;
