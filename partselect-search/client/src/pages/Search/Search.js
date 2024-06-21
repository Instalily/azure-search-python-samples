import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress  from '@mui/material/CircularProgress';
import Results from '../../components/Results/Results';
import Pager from '../../components/Pager/Pager';
import Facets from '../../components/Facets/Facets';
import NoResults from '../../components/NoResults/NoResults';
import SearchBar from '../../components/SearchBar/SearchBar';
import logo from '../../images/partselect.svg';
import "../../components/SearchBar/SearchBar.css"
import "./Search.css";
// import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from '../../contexts/AppContext';
import { AuthContext } from '../../contexts/AuthContext';
import Login from '../Login/Login';

export default function Search() {
  
  const {isLoading,postSearchHandler,setModelNumSearch,setModelNameDesc} = useContext(AppContext);
  // const {userEmail} = useContext(AuthContext);
  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>);
  } else {
    body = (
      <div className="col-md-9">
        <NoResults />
        <Results/>
        <Pager className="pager-style"></Pager>
      </div>
    )
  }

  return (
  //  userEmail ? (
    <div>
    <header className="header">
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="/">
          <img src={logo} height="40" className="navbar-logo" alt="PartSelect" />
        </a>
      </nav>
    </header>
    <div className="search-bar-container-searchpage">
      <div className="search-bar-searchpage">
      <SearchBar 
        pageContext="search" 
        page="searchpage" 
        onSearchHandler={postSearchHandler} 
        setModelNumSearch={setModelNumSearch} 
        setModelNameDesc={setModelNameDesc}
        // userEmail={userEmail}
        >
      </SearchBar>
      </div>
    </div>
    <main className="main main--search container-fluid">
      <div className="row">
        <div className="col-md-3"> 
          <Facets />
        </div>
        {body}
      </div>
    </main>
    </div>
  );
  // : <Login/>;
}
