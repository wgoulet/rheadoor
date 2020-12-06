import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Welcome from './Welcome';
import Secured from './Secured';
import Sidebar from "./components/sidebar";
import './App.css';
import Typography from '@material-ui/core/Typography';
import 'fontsource-roboto';


class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const textStyle = {
      marginLeft: '50px',
    };
    return (
      <BrowserRouter>
        <div className="container">
          <div class="grid-container">
            <Sidebar class="grid-sidebar" />
            <div class="header"/>
            <div class="content" />           
          </div>
          <div class="header">
              <Typography variant="h3" component="h3" gutterBottom style={textStyle}>
                Chicken Coop Door Control
              </Typography>
          </div>
          <div class="content">
              <Route exact path="/" component={Welcome} />
              <Route path="/secured" component={Secured} />
              <Route path="/logout" component={Secured}  />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;