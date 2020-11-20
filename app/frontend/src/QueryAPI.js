import React, { Component } from 'react';
import BasicTable from './BasicTable';
import ErrorTable from './ErrorTable';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';



class APIResponse extends Component {
  render() {
        if(this.props.response)
        {
          const columns = [
          {
            Header: "Key",
            accessor: "key",
          },
          {
            Header: "Value",
            accessor: "value",
          }
          ]
          // Parse the data from the API response to display in table. Valid replies will be shown in a BasicTable;
          // errors will be shown in ErrorTable.
          var reply = JSON.parse(this.props.response);
          if(reply.hasOwnProperty("name")) {
            var indata = [{name:reply.name,value:reply.value,workid:reply.workid,status:reply.workstatus,workcreated:reply.workcreated}]
          
            return (<div>
              <p className="Table-header">Basic Table</p>
              <BasicTable data={indata}/>
              </div>);
          }
          else {
            var indata = [{error:reply.error,message:reply.message}];
            return (<div>
              <p className="Table-header">Basic Table</p>
              <ErrorTable data={indata}/>
              </div>);
          }
        }
        else {
          return (<div/>);
        }
}};

class QueryAPI extends Component {

  constructor(props) {
    super(props);
    this.state = { response: null };
  }

  authorizationHeader() {
    if(!this.props.keycloak) return {};
    console.log(this.props.keycloak.token);
    return {
      headers: {
        "Authorization": "Bearer " + this.props.keycloak.token
      }
    };
  }

  handleForwardClick = () => {
    var item = {};
    item['name'] = 'work50';
    item['value'] = 'ardmotordrive:forward:75';
    // Extract roles from the idtoken to send to server
    var roles = ''
    Object.entries(this.props.keycloak.idTokenParsed.realm_access.roles).forEach(([key, value]) => {
      roles = roles + ":" + value
    });
    item['userRoles'] = roles;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization',"Bearer " + this.props.keycloak.token);
    const myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(item)
    };

    // Fetch the reply from the server. If a non-200 error code is returned, parse the JSON body from 
    // the reply and send it back to caller so they can display the error.
    fetch('http://localhost:8000/items', myInit)
      .then(response => Promise.all([response,response.json()]))
      .then(([response,json]) => {
        if (response.status === 200)
          return json;
        else if(response.status === 403) {
          var errdata = {error:"API error",message:JSON.stringify(json)};
          return errdata;
        }
      })
      .then(json => this.setState((state, props) => ({
        response: JSON.stringify(json, null, 2)
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

   handleBackwardClick = () => {
    var item = {};
    item['name'] = 'work50';
    item['value'] = 'ardmotordrive:backward:75';
    // Extract roles from the idtoken to send to server
    var roles = ''
    Object.entries(this.props.keycloak.idTokenParsed.realm_access.roles).forEach(([key, value]) => {
      roles = roles + ":" + value
    });
    item['userRoles'] = roles;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization',"Bearer " + this.props.keycloak.token);
    const myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(item)
    };

    // Fetch the reply from the server. If a non-200 error code is returned, parse the JSON body from 
    // the reply and send it back to caller so they can display the error.
    fetch('http://localhost:8000/items', myInit)
      .then(response => Promise.all([response,response.json()]))
      .then(([response,json]) => {
        if (response.status === 200)
          return json;
        else if(response.status === 403) {
          var errdata = {error:"API error",message:JSON.stringify(json)};
          return errdata;
        }
      })
      .then(json => this.setState((state, props) => ({
        response: JSON.stringify(json, null, 2)
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

  

  render() {
    const openButton = {
      background: '#4caf50',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      marginRight: '30px',
      marginLeft: '100px',
      marginTop: '50px',
    };

    const closeButton = {
      background: '#d32f2f',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      marginTop: '50px',
    };

    return (
      
      <div className="QueryAPI">
        <ButtonGroup>
          <Button style={openButton} onClick={this.handleForwardClick}>Open Door</Button>
          <Button style={closeButton} onClick={this.handleBackwardClick}>Close Door</Button>
        </ButtonGroup>
        <APIResponse response={this.state.response}/>
      </div>
    );
  }
}

export default QueryAPI;