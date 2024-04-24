import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from '../../components/SearchBar/SearchBar';
import "../../components/SearchBar/SearchBar.css";
import "./Home.css";
import "../Search/Search.css";
import logo from '../../images/cognitive_search.jpg';
import { AppContext } from "../../contexts/AppContext";

export default function Home() {
  const {navigateToSearchPage,setModelNumSearch,setModelNameDesc} = useContext(AppContext);

  return (
    <main className="main main--home">
      <div className="SearchApp">
      <header className="App-header">
      <div className="search-bar-container">
          <div className="search-bar">
            <SearchBar 
              pageContext="home" 
              onSearchHandler={navigateToSearchPage} 
              setModelNumSearch={setModelNumSearch}
              setModelNameDesc={setModelNameDesc}
            />
          </div>
        </div>
      </header>
    </div>
    </main>
  );
};
