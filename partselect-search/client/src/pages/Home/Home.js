import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from '../../components/SearchBar/SearchBar';
import "../../components/SearchBar/SearchBar.css";
import "./Home.css";
import "../Search/Search.css";
import logo from '../../images/cognitive_search.jpg';
import { AppContext } from "../../contexts/AppContext";

export default function Home() {
  const navigate = useNavigate();
  let BASE_URL;

    if(window.location.href.startsWith("http://localhost")) {
        BASE_URL = "http://0.0.0.0:8000"
        }
        else {
        BASE_URL = "https://instaagentsearch-mwvqt7kpva-uc.a.run.app";
  }
  const navigateToSearchPage = (q) => {
    if (!q || q === '') {
      q = '*'
    }
    navigate('/search?q=' + q);
  }

  return (
    <main className="main main--home">
      <div className="SearchApp">
      <header className="App-header">
      <div className="search-bar-container">
          <div className="search-bar">
            <SearchBar pageContext="home" onSearchHandler={navigateToSearchPage} BASE_URL={BASE_URL}/>
          </div>
        </div>
      </header>
    </div>
    </main>
  );
};
