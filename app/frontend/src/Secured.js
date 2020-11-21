import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import QueryAPI from './QueryAPI';
import Typography from '@material-ui/core/Typography';
import 'fontsource-roboto';

class Secured extends Component {

  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({onLoad: 'login-required'}).then(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated })
    })
  }

  render() {
   const textStyle = {
      //background: '#d32f2f',
      //borderRadius: 3,
      //border: 0,
      //color: 'white',
      //height: 48,
      marginLeft: '30px',
    };

    if (this.state.keycloak) {
      if (this.state.authenticated) return (
        <div>
          <QueryAPI keycloak={this.state.keycloak}/>
        </div>
      ); else return (<div>Unable to authenticate!</div>)
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }
}
export default Secured;