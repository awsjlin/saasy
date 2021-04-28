import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify';

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
        <button onClick={callGetEntry}>Get Entry!</button>
      </header>
      <AmplifySignOut />
    </div>
  );
}

function callGetEntry() {
  console.log('This is your data');
  
  Auth.currentSession()
  .then(data => console.log(data))
  .catch(err => console.log(err));
}


export default withAuthenticator(App);