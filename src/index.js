import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login/Login'
import Header from './components/Header/Header'
import Body from './components/Body/Body'
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Body />} />
        <Route path="login" element={<Login />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
