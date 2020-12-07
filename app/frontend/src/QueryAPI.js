import React, { Component } from 'react';
import BasicTable from './BasicTable';
import ErrorTable from './ErrorTable';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ControlGrid from './components/ControlGrid';
import StepCountSelector from './components/StepCountSelector';
import { TextareaAutosize } from '@material-ui/core';



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
          else if(reply !== null){
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

  getControllerCreds = () => {
    var shouldShow = ! this.state.showControllerCreds;
    this.setState({showControllerCreds: shouldShow});
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization',"Bearer " + this.props.keycloak.token);
    const myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
    };  
    var clientidval = null;
    // Fetch the client list, find the apicallers client and retrieve the secret. This user must be assigned a role
    // in keycloak that has view-clients permission for the realm that contains the apicallers client.
    fetch('http://localhost:8080/auth/admin/realms/master/clients?clientId=apicallers',myInit)
      .then(response => Promise.all([response,response.json()]))
      .then(([response,json]) => {
          if(response.status === 200)
          {
            // Note this assumes only 1 matching client was returned; if multiple clients with name
            // apicaller are defined this will break.
            clientidval = json[0].id;
          }
      })
      .then(() => {
        var furl = 'http://localhost:8080/auth/admin/realms/master/clients/' + clientidval + '/client-secret';
        fetch(furl,myInit)
          .then(response => Promise.all([response,response.json()]))
          .then(([response,json]) => {
            if(response.status === 200)
            {
              return json;
            }
          })
          .then(json => this.setState((state,props) => ({
            clientsecret: json.value,
            clientcreds: "\nClient ID: apicallers\nClient Secret: " + json.value
          })))
          .catch(err => {
            return err.toString();
          })
        })
      .catch(err => {
        return err.toString();
      })
    
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
        cfgresponse: JSON.stringify(json, null, 2),
        fullTurnValue: json.fullTurns, 
        partialTurnValue: json.partialTurns,
        command: 'getfullturn'
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
        cfgresponse: JSON.stringify(json, null, 2),
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
        cfgresponse: JSON.stringify(json, null, 2),
        partialTurnValue: json.partialTurns,
        command: 'setpartialturn'
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

  handleClicks = (event) => {
    // Strange workaround, when clicking on buttons in buttongroup
    // found that event target was the label in the button if clicking on the
    // label portion of the button but if clicked outside the button label (but still
    // within the button boundary), the event target was the button itself. So
    // we'll fire this event if either the label or the button is the event target.
    if((event.target.offsetParent.value === 'forward:1') ||
    (event.target.value === 'forward:1'))
    {
      this.handleForwardClick(event,1,0);
    }
    else if((event.target.offsetParent.value === 'forward:.5') ||
    (event.target.value === 'forward:.5'))
    {
      this.handleForwardClick(event,0,50);
    }
    else if((event.target.offsetParent.value === 'backward:1') ||
    (event.target.value === 'backward:1'))
    {
      this.handleBackwardClick(event,1,0);
    }
    else if((event.target.offsetParent.value === 'backward:.5') ||
    (event.target.value === 'backward:.5'))
    {
      this.handleBackwardClick(event,0,50);
    }
  }

  handleForwardClick = (event,fturn,pturn) => {
    var item = {};
    item['name'] = 'work50';
    var partialturn = 0;
    var fullturn = 0;
    if(fturn !== undefined)
    {
      fullturn = fturn;
    }
    else if(this.state.fullTurnValue) {
      fullturn = this.state.fullTurnValue;
    }
    if(pturn !== undefined)
    {
      partialturn = pturn;
    }
    else if(this.state.partialTurnValue) {
      partialturn = this.state.partialTurnValue;
    }
    item['value'] = 'ardmotordrive:forward:' + fullturn + '.' + partialturn;
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

   handleBackwardClick = (event,fturn,pturn) => {
    var item = {};
    item['name'] = 'work50';
    var partialturn = 0;
    var fullturn = 0;
    if(fturn !== undefined)
    {
      fullturn = fturn;
    }
    else if(this.state.fullTurnValue) {
      fullturn = this.state.fullTurnValue;
    }
    if(pturn !== undefined)
    {
      partialturn = pturn;
    }
    else if(this.state.partialTurnValue) {
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

    const controllerCreds = {
      padding: '0 30px',
      marginTop: '50px',
      marginLeft: '100px',
    }

    return (
      <div className="QueryAPI">
        <div>
        <ButtonGroup>
          <Button style={openButton} onClick={this.handleBackwardClick}>Open Door</Button>
          <Button style={closeButton} onClick={this.handleForwardClick}>Close Door</Button>
          <Button onClick={this.toggleHide} style={configButton}>Configure Motor Steps</Button>
          <Button onClick={this.getControllerCreds} style={configButton}>Get Controller Credentials</Button>
        </ButtonGroup>
        </div>
        <div>
        {this.state.showConfig ?(
            <div>
              <StepCountSelector displayLabel="Full Turns" min={0} max={200} step={1} defaultValue={this.state.fullTurnValue} onChangeCommitted={this.handleFullTurnChange}/>
              <StepCountSelector displayLabel="Partial Turns" min={0} max={100} step={1} defaultValue={this.state.partialTurnValue} onChangeCommitted={this.handlePartialTurnChange}/>
            </div>
           ) : null}
        </div>
        <div>
        {this.state.showControllerCreds ?(
            <div>
              <TextareaAutosize style={controllerCreds} defaultValue={this.state.clientcreds} readOnly cols="70" rows="4"/>
            </div>
           ) : null}
        </div>
        <div>
          <ButtonGroup onClick={this.handleClicks}>
            <Button style={openFineButton} value="backward:1">One Turn Open</Button>
            <Button style={openFineButton} value="backward:.5">Half Turn Open</Button>
            <Button style={closeFineButton} value="forward:1">One Turn Close</Button>
            <Button style={closeFineButton} value="forward:.5">Half Turn Close</Button>
          </ButtonGroup>
        </div>
        <APIResponse response={this.state.response}/>
      </div>
    );
  }
}



export default QueryAPI;