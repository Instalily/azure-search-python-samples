import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppFooter from '../components/AppFooter/AppFooter';
import Home from '../pages/Home/Home';
import Search from '../pages/Search/Search';
import { AppProvider } from '../contexts/AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login/Login';

export default function App() {

  return (
      <div className="container-fluid app">
        <BrowserRouter>
          <Routes>
            <Route path={`/search`} element={<AuthProvider><AppProvider><><Search /></></AppProvider></AuthProvider>} />
            <Route path={`/`} element={<AuthProvider><AppProvider><><Home /></></AppProvider></AuthProvider>} />
          </Routes>
        </BrowserRouter>
        {<AppFooter />}
      </div>
  );
}