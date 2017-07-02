import React, { Component } from 'react';
import './App.css';
import AdvancedTable from "./components/advancedTable";

class App extends Component {
  render() {
      const tableColumns = [{
          title: 'Name',
          dataIndex: 'name',
          sorter: true,
          render: name => `${name.first} ${name.last}`,
          width: '20%',
      }, {
          title: 'Gender',
          dataIndex: 'gender',
          filters: [
              { text: 'Male', value: 'male' },
              { text: 'Female', value: 'female' },
          ],
          width: '20%',
      }, {
          title: 'Email',
          dataIndex: 'email',
      }];

    return (
      <div className="App">
          <AdvancedTable showPagination={true} dataUrl={"https://randomuser.me/api"} columns={tableColumns} />
      </div>
    );
  }
}

export default App;
