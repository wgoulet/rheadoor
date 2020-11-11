import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Welcome from './Welcome';
import Secured from './Secured';
import Sidebar from "./components/sidebar";
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <div class="grid-container">
            <Sidebar class="grid-sidebar" />
            <div class="header" />
            <div class="content" />           
          </div>
          <div class="header">Home Page</div>
          <div class="content">
              <Route exact path="/" component={Welcome} />
              <Route path="/secured" component={Secured} />
            </div>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;