import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Context for user authentication
import { AuthContext } from '../contexts/AuthContext';

// App shell components
import AppHeader from '../components/AppHeader/AppHeader';
import AppFooter from '../components/AppFooter/AppFooter';

// React Router page components
import Home from '../pages/Home/Home';
import Search from '../pages/Search/Search';
import Login from '../pages/Login/Login';
import Details from '../pages/Details/Details';
import { AppProvider } from '../contexts/AppContext';
// Bootstrap styles, optionally with jQuery and Popper
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
// Custom app styles
import './App.css';

export default function App() {
  let BASE_URL = "https://instaagentsearch-mwvqt7kpva-uc.a.run.app";
  const [warmedSearch, setWarmedSearch] = useState(false);
  const [warmedFetchAll, setwarmedFetchAll] = useState(false);
  const [warmedFetchMoreModels, setwarmedFetchMoreModels] = useState(false);
  useEffect(() => {
    console.log("Warming up APIs for demo");
    const body1 = {
      q: "abc",
      top: 10,
      skip: 1,
      filters: [],
      model_top: 1
      };
    const body2 = {
      partialModel: "abc",
      model_top: 10,
      filters: []
    }
    if (!warmedSearch) {
      axios.post(BASE_URL+'/search', body1)
          .then(response => {
            console.log("/search working", response);
            setWarmedSearch(true);
          }).
          catch(error => {
            console.log("Ran into error warming up /search", error)
          });
      }
      if (!warmedFetchAll) {
        axios.get(BASE_URL+'/fetch_all?searchTerm=123')
          .then(response => {
            console.log("/fetch_all working", response);
            setwarmedFetchAll(true);
        }).
        catch(error => {
          console.log("Ran into error warming up /fetch_all", error)
        });
      }
      if (!warmedFetchMoreModels) {
      axios.post(BASE_URL+'/fetch_more_models', body2)
        .then(response => {
          console.log("/fetch_all working", response);
          setwarmedFetchMoreModels(true);
      }).
      catch(error => {
        console.log("Ran into error warming up /fetch_all", error)
      });
    }
  }, []);

  return (
      <div className="container-fluid app">
        <BrowserRouter>
          <Routes>
            {/* <Route path={`/`} element={<Login />} /> */}
            <Route path={`/search`} element={<AppProvider><><Search /></></AppProvider>} />
            <Route path={`/`} element={<Home />} />
          </Routes>
        </BrowserRouter>
        {<AppFooter />}
      </div>
  );
}
