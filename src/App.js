import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Amplify, { API, Auth } from 'aws-amplify';

const apiName = "https://29x0zqh2mi.execute-api.us-east-1.amazonaws.com/prod/"
const pathTable = "table"
const pathTranslate = "translate"
const pathPolly = "polly"
const queryYear = "?year=2020"
const myInit = {
  headers: {
    'Content-Type': 'application/json'
  },
  response: true
}

function App() {
  const getPolly = () => {
    //audio.play()
  }

  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
        <p><button onClick={() => getTable(pathTable)}>Get Table</button></p>
        <p><button onClick={() => getTable(pathTable+queryYear)}>Get Film by Year 2020</button></p>
        <p><button onClick={() => getTable(pathTranslate)}>Translate</button></p>
        <p><button onClick={() => getTable(pathPolly, true)}>Read Movies Table</button></p>
      </header>
      <AmplifySignOut />
    </div>
  );
}

function getTable(path, isBinary) {
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
        if (isBinary)
          return response.blob();
        else
          return response.text();
      }, function(error) {
        console.log(error.message); //=> String
      })
      .then(function(myJson)
      {
        if (isBinary)
        {
          console.log(myJson)
          let blob = new Blob([myJson], {type: 'audio/mp3'});
          let url = window.URL.createObjectURL(blob)
          window.audio = new Audio();
          window.audio.src = url;
          window.audio.play();
        }
        else
          alert(myJson);
      });
    };

    funcName();
  })
  .catch(err => console.log(err));
}

export default withAuthenticator(App);