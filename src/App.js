import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { API, Auth } from 'aws-amplify';
//import Table from './Table.js';

const apiUrl = "https://29x0zqh2mi.execute-api.us-east-1.amazonaws.com/prod/"
const pathKey = "key?groupId="
const pathTable = "table?groupId="
const pathTranslate = "translate?groupId="
const pathPolly = "polly?groupId="
const queryYear = "&year=2001"
const myInit = {
  headers: {
    'Content-Type': 'application/json'
  },
  response: true
}
var apiKey = null
var tenantId = null

function App() {
  const getPolly = () => {
    //audio.play()
  }
//js={() => getTable(pathTable)}
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
        {setApiKey()}
        <p><button onClick={() => getRoute(pathTable+tenantId)}>Get Movies Table</button></p>
        <p><button onClick={() => getRoute(pathTable+tenantId+queryYear)}>Get Film by Year 2001</button></p>
        <p><button onClick={() => getRoute(pathTranslate+tenantId)}>Translate Movies to ZH</button></p>
        <p><button onClick={() => getRoute(pathPolly+tenantId, true)}>Read Movies Table</button></p>
      </header>
      <AmplifySignOut />
    </div>
  );
} 

//        <Table />

function setApiKey() {
  Auth.currentAuthenticatedUser().then(user => {
    tenantId = user.signInUserSession.accessToken.payload["cognito:groups"][0]
    //console.log("Auth Tenant group: ", tenantId, pathKey+tenantId)
    getRoute(pathKey+tenantId)
  })
}

function renderTableData(path, isBinary) {
  return getRoute(path, isBinary).map((movie, index) => {
    const { year, title } = movie
    return (
      <tr>
        <td>{year}</td>
        <td>{title}</td>
      </tr>
    )
  })
}

//  if (typeof isCharged !== 'undefined') 
function getRoute(path, isBinary) {
  Auth.currentSession().then(data => {
    //console.log(data.getIdToken().getJwtToken();)

    let initData = null
    //console.log(apiKey)
    if (apiKey == null) {
      initData = {
        method: "GET",
        headers: {
          Authorization: data.getIdToken().getJwtToken()
        }
      }
    }
    else {
      initData = {
        method: "GET",
        headers: {
          Authorization: data.getIdToken().getJwtToken(),
          'x-api-key': apiKey
        }
      }
    }
    //console.log(initData)
    let url = apiUrl + path
    console.log(url)

    const funcName = async () => {
      fetch(url, initData).then(function(response) {
        if (isBinary)
          return response.blob();
        else
          return response.text();
      }, function(error) {
        console.log(error.message);
      })
      .then(function(blobOrJson)
      {
        console.log(blobOrJson)
        if (isBinary)
        {
          let blob = new Blob([blobOrJson], {type: 'audio/mp3'});
          let url = window.URL.createObjectURL(blob)
          window.audio = new Audio();
          window.audio.src = url;
          window.audio.play();
        }
        else
          if (apiKey != null && (blobOrJson != apiKey)) {
            //console.log("*** Alert!")
            alert(blobOrJson)
          }
          else {
            //console.log("### Set Api Key!")
            apiKey = blobOrJson
          }
      });
    };
    return funcName();
  })
  .catch(err => console.log(err));
}

export default withAuthenticator(App);