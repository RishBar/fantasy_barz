import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, Fragment } from "react";
import {useLocation} from "react-router-dom";

function App() {

  let location = useLocation();
  let [alerts, setAlerts] =  useState(null) 
  useEffect(() => {
    setAlerts(location.pathname)
  }, [location])

  return (
    <div className="App">
      <p>
        {alerts}
      </p>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://fantasybarz-production.up.railway.app/auth/yahoo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Yahoo verification
        </a>
      </header>
    </div>
  );
}

export default App;
