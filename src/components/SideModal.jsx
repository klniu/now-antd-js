import React  from 'react';
import {Button, Row, Col, Icon} from 'antd';
import PropTypes from 'prop-types';
import "./SideModal.css"

class SideModal extends React.Component {
    render() {
        return (
            <div style={{display: this.props.visible?"block":"none"}} className={`side-modal ${this.props.className}`}>
                <div className={`side-modal-title ${this.props.titleClassName}`}>
                    {this.props.title}
                    <Button ghost={true} className="side-modal-title-close" onClick={this.props.onCancel}>
                        <Icon type="close" style={{fontSize: "20px"}}/>
                    </Button>
                </div>
                <div className={`side-modal-content ${this.props.contentClassName}`}>{this.props.children}</div>
                <div className={`side-modal-footer ${this.props.footerClassName}`}>
                    <Row gutter={16}>
                        <Col span={6} offset={6}>
                            <Button type="primary" onClick={this.props.onOk}>提交</Button>
                        </Col>
                        <Col span={6}>
                            <Button onClick={this.props.onCancel}>取消</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

SideModal.protoTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default SideModal;
