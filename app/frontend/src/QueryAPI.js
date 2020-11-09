import React, { Component } from 'react';

class APIResponse extends Component {
  render() {
    if(this.props.response)
      return ( <pre>{this.props.response}</pre> );
    else
      return (<div/>);
  }
}

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

  handleClick = () => {
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

    fetch('http://localhost:8000/items', myInit)
      .then(response => {
        if (response.status === 200)
          return response.json();
        else
          return { status: response.status, message: response.statusText }
      })
      .then(json => this.setState((state, props) => ({
        response: JSON.stringify(json, null, 2)
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

  render() {
    return (
      <div className="QueryAPI">
        <button onClick={this.handleClick}>Move Motor Forward</button>
        <APIResponse response={this.state.response}/>
      </div>
    );
  }
}

export default QueryAPI;