import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import Form from './components/Form'
import { MuiThemeProvider} from '@material-ui/core';
console.log()
class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <Header></Header>
        <Form></Form>
      </MuiThemeProvider>
    );
  }
}

export default App;
