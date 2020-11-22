import React, { Component } from 'react';
import BasicTable from './BasicTable';
import ErrorTable from './ErrorTable';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ControlGrid from './components/ControlGrid';
import StepCountSelector from './components/StepCountSelector';



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
    this.state = { response: null,fullTurnValue: null, partialTurnValue: null };
  }

  componentDidMount() {
    this.getTurnValues();
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

  toggleHide = () => {
    var shouldShow = ! this.state.showConfig;
    this.setState({showConfig: shouldShow});
  }

  getTurnValues = () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization',"Bearer " + this.props.keycloak.token);
    const myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
    };
    // Fetch the reply from the server. If a non-200 error code is returned, parse the JSON body from 
    // the reply and send it back to caller so they can display the error.
    fetch('http://localhost:8000/config',myInit)
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
        response: JSON.stringify(json, null, 2),
        fullTurnValue: json.fullTurns, 
        partialTurnValue: json.partialTurns,
        command: 'setfullturn'
      })))
      .catch(err => {
        return err.toString();
      })
  }

  handleFullTurnChange = (event, value) => {
    var change = event;
    var num = value;
    var configChange = {};
    configChange['fullTurns'] = value;
    var partialTurns = 0;
    if(this.state.partialTurnValue) {
      partialTurns = this.state.partialTurnValue;
    }
    configChange['partialTurns'] = partialTurns;
    // Extract roles from the idtoken to send to server
    var roles = ''
    Object.entries(this.props.keycloak.idTokenParsed.realm_access.roles).forEach(([key, value]) => {
      roles = roles + ":" + value
    });
    configChange['userRoles'] = roles;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization',"Bearer " + this.props.keycloak.token);
    const myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(configChange)
    };
    // Fetch the reply from the server. If a non-200 error code is returned, parse the JSON body from 
    // the reply and send it back to caller so they can display the error.
    fetch('http://localhost:8000/config', myInit)
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
        response: JSON.stringify(json, null, 2),
        fullTurnValue: json.fullTurns,
        command: 'setfullturn'
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }
  

  handlePartialTurnChange = (event, value) => {
    var change = event;
    var num = value;
    var configChange = {};
    configChange['partialTurns'] = value;
    var fullTurns = 0;
    if(this.state.fullTurnValue)
    {
      fullTurns = this.state.fullTurnValue;
    }
    configChange['fullTurns'] = fullTurns;
    // Extract roles from the idtoken to send to server
    var roles = ''
    Object.entries(this.props.keycloak.idTokenParsed.realm_access.roles).forEach(([key, value]) => {
      roles = roles + ":" + value
    });
    configChange['userRoles'] = roles;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization',"Bearer " + this.props.keycloak.token);
    const myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(configChange)
    };
    // Fetch the reply from the server. If a non-200 error code is returned, parse the JSON body from 
    // the reply and send it back to caller so they can display the error.
    fetch('http://localhost:8000/config', myInit)
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
        response: JSON.stringify(json, null, 2),
        partialTurnValue: json.partialTurns,
        command: 'setpartialturn'
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

  handleForwardClick = () => {
    var item = {};
    item['name'] = 'work50';
    item['value'] = 'ardmotordrive:forward:21.5';
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
        response: JSON.stringify(json, null, 2),
        command: 'forward'
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

   handleBackwardClick = () => {
    var item = {};
    item['name'] = 'work50';
    var partialturn = 0;
    var fullturn = 0;
    if(this.state.fullTurnValue) {
      fullturn = this.state.fullTurnValue;
    }
    if(this.state.partialTurnValue) {
      partialturn = this.state.partialTurnValue;
    }
    item['value'] = 'ardmotordrive:backward:' + fullturn + '.' + partialturn;
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
        response: JSON.stringify(json, null, 2),
        command: 'backwards'
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

    const openFineButton = {
      background: '#4caf50',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      marginRight: '5px',
      marginLeft: '100px',
      marginTop: '50px',
    };

   const closeFineButton = {
      background: '#d32f2f',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      marginRight: '5px',
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

    const configButton = {
      borderRadius: 3,
      border: 0,
      height: 48,
      padding: '0 30px',
      marginTop: '50px',
    }
    return (
      <div className="QueryAPI">
        <div>
        <ButtonGroup>
          <Button style={openButton} onClick={this.handleBackwardClick}>Open Door</Button>
          <Button style={closeButton} onClick={this.handleForwardClick}>Close Door</Button>
          <Button onClick={this.toggleHide} style={configButton}>Configure Motor Steps</Button>
        </ButtonGroup>
        </div>
        <div>
        {this.state.showConfig ?(
            <div>
              <StepCountSelector displayLabel="Full Turns" min={0} max={200} step={1} defaultValue={this.state.fullTurnValue} onChangeCommitted={this.handleFullTurnChange}/>
              <StepCountSelector displayLabel="Partial Turns" min={0} max={100} step={1} defaultValue={0} onChangeCommitted={this.handlePartialTurnChange}/>
            </div>
           ) : null}
        </div>
        <div>
          <ButtonGroup>
            <Button style={openFineButton}>One Turn Open</Button>
            <Button style={openFineButton}>Half Turn Open</Button>
            <Button style={closeFineButton}>One Turn Close</Button>
            <Button style={closeFineButton}>Half Turn Close</Button>
          </ButtonGroup>
        </div>
        <APIResponse response={this.state.response}/>
      </div>
    );
  }
}



export default QueryAPI;