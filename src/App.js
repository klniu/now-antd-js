import React, {Component} from 'react';
import './App.css';
import AdvancedTable from "./components/AdvancedTable";
import BasicTable from "./components/BasicTable";

class App extends Component {
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

        return (
            <div className="App">
                <br /><br />
                <BasicTable dataUrl={"http://localhost:3001/table"} columns={tableColumns}/>
                <br /><br />
            </div>
        );
    }
}

export default App;
