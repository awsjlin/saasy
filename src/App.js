import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Amplify, { API, Auth } from 'aws-amplify';

const apiName = "https://29x0zqh2mi.execute-api.us-east-1.amazonaws.com/prod/"
const pathTable = "table"
const queryYear = "?year=2020"
const myInit = {
  headers: {
    'Content-Type': 'application/json'
  },
  response: true
}

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
        <button onClick={() => getTable(pathTable)}>Get Table</button><br></br>
        <button onClick={() => getTable(pathTable+queryYear)}>Get Film by Year 2020</button>
      </header>
      <AmplifySignOut />
    </div>
  );
}

function getTable(path) {
  console.log('Get DynamoDB table');
  
  Auth.currentSession()
  .then(data => {
    //let authToken = data.getIdToken().getJwtToken();
    //console.log(authToken)
    const funcName = async () => {
      fetch(apiName + path, {
        method: "GET",
        headers: {
          Authorization: data.getIdToken().getJwtToken()
        }
      }).then(function(response) {
        console.log(response)
        return response.text();
      }, function(error) {
        console.log(error.message); //=> String
      })
      .then(function(myJson) {
        console.log(myJson);
        alert(myJson);
      });
    };
  
    funcName();
  })
  .catch(err => console.log(err));
}

export default withAuthenticator(App);