import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
//import Table from './Table.js';

var apiKey = null
var tenantId = null
const apiUrl = "https://29x0zqh2mi.execute-api.us-east-1.amazonaws.com/prod/"
const pathKey = "key?groupId="
const pathTable = "table?groupId="
const pathTranslate = "translate?groupId="
const pathPolly = "polly?groupId="
const queryYear = "&year=2001"

function App() {
  const [lang, setLang] = useState();
  const [year, setYear] = useState();

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
      //console.log(url)
  
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
          //console.log("funcName then: ", blobOrJson)
          if (isBinary)
          {
            let blob = new Blob([blobOrJson], {type: 'audio/mp3'});
            let url = window.URL.createObjectURL(blob)
            window.audio = new Audio();
            window.audio.src = url;
            window.audio.play();
          }
          else {
            //console.log(apiKey, "*********", blobOrJson)
            if (apiKey != null && (blobOrJson !== apiKey)) {
              //console.log("*** Alert!")
              alert(blobOrJson)
            }
            else {
              //console.log("### Set Api Key!", blobOrJson)
              apiKey = blobOrJson
            }
          }
        });
      };
      return funcName();
    })
    .catch(err => console.log(err));
  }

  function setApiKey() {
    Auth.currentAuthenticatedUser().then(user => {
      if (typeof user.signInUserSession.accessToken.payload["cognito:groups"] !== 'undefined') {
        tenantId = user.signInUserSession.accessToken.payload["cognito:groups"][0]
        //console.log("Auth Tenant group: ", tenantId, pathKey+tenantId)
        getRoute(pathKey+tenantId)
      }
    })
  }

  function checkYear() {
    let path = pathTable + tenantId
    if (year != null && typeof year !== 'undefined' && year !== '') {
      let check = path+"&year="+year
      getRoute(path + "&year="+year)
    } else {
      getRoute(path + queryYear)
    }

  }

  function checkLang() {
    let path = pathTranslate+tenantId
    if (lang != null && typeof lang !== 'undefined' && lang !== '') {
      let check = path+"&lang="+lang
      getRoute(pathTranslate+tenantId+"&lang="+lang)
    } else {
      getRoute(path)
    }
  }

  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
        {setApiKey()}
        <p><button onClick={() => getRoute(pathTable+tenantId)}>Get Movies Table</button></p>
        <p><button onClick={checkYear}>Get Film by Year</button>
        <input type="text" placeholder="Year" onChange={e => setYear(e.target.value)} /></p>
        <p><button onClick={checkLang}>Translate Movies</button>
        <input type="text" placeholder="Language" onChange={e => setLang(e.target.value)} /></p>
        <p><button onClick={() => getRoute(pathPolly+tenantId, true)}>Read Movies Table</button></p>
        <br></br>
      </header>
      <AmplifySignOut />
    </div>
  );
} 

//
//         <p><button onClick={signOut()}>Sign out</button></p>
//        <Table />

/*async function signOut() {
  try {
      const {authState, authData} = this.props
      apiKey = null
      await Auth.signOut().then(() => {
      });
  } catch (error) {
      console.log('error signing out: ', error);
  }
}*/

/*function renderTableData(path, isBinary) {
  return getRoute(path, isBinary).map((movie, index) => {
    const { year, title } = movie
    return (
      <tr>
        <td>{year}</td>
        <td>{title}</td>
      </tr>
    )
  })
}*/

//  if (typeof isCharged !== 'undefined') 

export default withAuthenticator(App);