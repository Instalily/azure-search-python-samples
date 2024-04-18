import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress  from '@mui/material/CircularProgress';
import Results from '../../components/Results/Results';
import Pager from '../../components/Pager/Pager';
import Facets from '../../components/Facets/Facets';
import SearchBar from '../../components/SearchBar/SearchBar';
import logo from '../../images/partselect.svg';
import "../../components/SearchBar/SearchBar.css"
import "./Search.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from '../../contexts/AppContext';

export default function Search() {
  
  const {isLoading,postSearchHandler} = useContext(AppContext);
  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>);
  } else {
    body = (
      <div className="col-md-9">
        <Results/>
        <Pager className="pager-style"></Pager>
      </div>
    )
  }

  return (
    <div>
    <header className="header">
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="/">
          <img src={logo} height="50" className="navbar-logo" alt="PartSelect" />
        </a>
      </nav>
    </header>
    <div className="search-bar-container-searchpage">
      <div className="search-bar-searchpage">
      <SearchBar pageContext="search" page="searchpage" onSearchHandler={postSearchHandler}></SearchBar>
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
}
