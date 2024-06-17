import React, {createContext,useState,useRef,useEffect, useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const {userEmail, setUserEmail} = useContext(AuthContext);
    let location = useLocation();
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const qParam = new URLSearchParams(location.search).get('q');
    const topParam = parseInt(new URLSearchParams(location.search).get('top') ?? 8, 10);
    const skipParam = parseInt(new URLSearchParams(location.search).get('skip') ?? 0, 10);
    const [currentPage, setCurrentPage] = useState(1);
    const [q, setQ] = useState(qParam);
    const [skip, setSkip] = useState(skipParam);
    const [top] = useState(topParam);
    const modelsearchParam = new URLSearchParams(location.search).get('modelsearch') ?? "false";
    const [filters, setFilters] = useState(undefined);
    const [facets, setFacets] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [preSelectedFilters, setPreSelectedFilters] = useState([]);
    const [preSelectedFlag, setPreSelectedFlag] = useState(false);
    const [keywords, setKeywords] = useState(q);
    const resultsPerPage = top;
    const defaultFacetLen = 10;
    const [matchedBrands, setMatchedBrands] = useState(undefined);
    const [matchedEqTypes, setMatchedEqTypes] = useState(undefined);
    const [matchedModels, setMatchedModels] = useState(undefined);
    const [brandTop, setBrandTop] = useState(defaultFacetLen);
    const [eqTypeTop, setEqTypeTop] = useState(defaultFacetLen);
    const [modelTop, setModelTop] = useState(defaultFacetLen);
    const [endOfBrandList, setEndOfBrandList] = useState(false);
    const [endOfEqTypeList, setEndOfEqTypeList] = useState(false);
    const [endOfModelList, setEndOfModelList] = useState(false);
    const [userSearchDesc, setUserSearchDesc] = useState("");
    const [modelNumSearch, setModelNumSearch] = useState(modelsearchParam === "true")
    const modelnameParam =  new URLSearchParams(location.search).get('modelname') ?? "";
    const [modelNameDesc, setModelNameDesc] = useState(modelnameParam);
    const [selectModelNum, setSelectModelNum] = useState(undefined);
    const [sortedFilters, setSortedFilters] = useState([]);
    const [filterDesc, setFilterDesc] = useState("");
    const TOTAL_RES_COUNT = 4412838;
    const sortOrder = {
        'Brand Name': 1,
        'Equipment Type': 2,
      };
    const [exactModelMatch, setExactModelMatch] = useState(false);
    const initialRef = useRef(true);
    const navigate = useNavigate();
    let BASE_URL;

    if(window.location.href.startsWith("http://localhost")) {
        BASE_URL = "http://0.0.0.0:8000"
        }
        else {
          BASE_URL = process.env.REACT_APP_BASE_URL;
        }

    useEffect(() => {
        if (initialRef.current && (top===topParam || skip===skipParam || q===qParam || filters===undefined)) {
            initialRef.current = false;
            return;
        }
    
        setIsLoading(true);
        const newSkip = (currentPage - 1) * top;
        if (skip !== newSkip) {
            setSkip(newSkip);
            return;
        }
        
        if (!preSelectedFlag && (filters || (keywords && keywords.length !== 0))) {
            const body = {
            q: keywords,
            top: top,
            skip: skip,
            filters: filters ?? [],
            // model_top: modelTop,
            modelnum_search: modelNumSearch,
            // user: userEmail
            };
            axios.post(BASE_URL+'/search', body)
                .then(response => {
                if (JSON.stringify(response.data) === '{}') {
                  setQ("*");
                }
                else {
                  setResults(response.data.results);
                  let allFacets = {...response.data.facets};
                  if ("Brand Name" in response.data.facets && response.data.facets["Brand Name"]) {
                    setMatchedBrands(response.data.facets["Brand Name"]);
                    allFacets["Brand Name"] = [];
                    response.data.facets["Brand Name"]
                      .slice(0, brandTop)
                      .map((brand) => {
                        allFacets["Brand Name"].push(brand);
                      });
                    if (response.data.facets["Brand Name"].length <= brandTop) {
                      setEndOfBrandList(true);
                    }
                  } 
                  if ("Equipment Type" in response.data.facets && response.data.facets["Equipment Type"]) {
                    setMatchedEqTypes(response.data.facets["Equipment Type"]);
                    allFacets["Equipment Type"] = [];
                    response.data.facets["Equipment Type"]
                      .slice(0, eqTypeTop)
                      .map((eq) => {
                        allFacets["Equipment Type"].push(eq);
                      });
                      if (response.data.facets["Equipment Type"].length <= eqTypeTop) {
                        setEndOfEqTypeList(true);
                      }
                  } 
                  if (response.data.matched_models && response.data.matched_models.length > 0) {
                      setMatchedModels(response.data.matched_models);
                      setSelectModelNum(true);
                      if (response.data.matched_models.length === 1 && response.data.matched_models[0]["ModelNum"].toLowerCase() === keywords && keywords.toLowerCase()) {
                          setExactModelMatch(true);
                      }
                      else {
                        setExactModelMatch(false);
                      }
                      if (!exactModelMatch) {
                      allFacets["Model Number"] = [];
                      response.data.matched_models
                          .slice(0, modelTop)
                          .map((model) => {
                          allFacets["Model Number"].push(
                              {
                                  "id": model["kModelMasterId"], 
                                  "value": `${model["ModelNum"]} ${model["BrandName"]} ${model["EquipmentType"]} ${model["MfgModelNum"] === "nan" ? "" : `(${model["MfgModelNum"].replace(/[()]/g, "")})`}` 
                                })
                      });
                      }
                  }
                  if (response.data.matched_models && response.data.matched_models.length <=modelTop) {
                      setEndOfModelList(true);
                  }
                  console.log("Facets: ", allFacets)
                  setFacets(allFacets);
                  setResultCount(response.data.count);
                  if (response.data.preselectedFilters && response.data.preselectedFilters.length > 0) {
                      setPreSelectedFilters(response.data.preselectedFilters);
                      setPreSelectedFlag(true);
                  }
                  if (response.data.keywords.toLowerCase() !== q.toLowerCase()) {
                      setKeywords(response.data.keywords);
                  }
                  setIsLoading(false);
                }
                })
                .catch(error => {
                console.error(error);
                setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
        }, [keywords, top, skip, filters, currentPage, preSelectedFlag]);

  useEffect(() => {
    if (preSelectedFlag) {
      setPreSelectedFlag(false);
    }
  }, [skip]);
        
    useEffect(() => {
    if (preSelectedFilters && preSelectedFilters.length > 0) {
        setFilters(preSelectedFilters);
        console.log(preSelectedFilters);
    }
    }, [preSelectedFilters]);

    useEffect(() => {
        if (sortedFilters && sortedFilters.length > 0) {
          setFilterDesc(sortedFilters.map(filter => {
            if (filter.value === 'Others') {
              return 'Uncategorized';
            }
            if (filter.field === 'Brand Name' || filter.field === 'Equipment Type') {
              return filter.value;
            }
            return null;
          }).filter(Boolean).join(' ')); 
        }
      }, [sortedFilters]);

    useEffect(() => {
      if (preSelectedFlag)
      {
        if (filters === preSelectedFilters) {
          setSortedFilters(filters && filters.sort((a, b) => {
          return (sortOrder[a.field] || 4) - (sortOrder[b.field] || 4);
          }));
        }
        else {
          setPreSelectedFlag(false);
          setPreSelectedFilters([]);
          if (!keywords || keywords.length === 0) {
            setFilterDesc("");
            // setKeywords("*");
          }
        }
      }
    }, [filters]);

    useEffect(() => {
      if (modelNumSearch) {
        setExactModelMatch(true);
      }
    }, [modelNumSearch]);

    useEffect(() => {
      if (q) {
        setKeywords(q);
        setBrandTop(defaultFacetLen);
        setEqTypeTop(defaultFacetLen);
        // setPartTypeTop(defaultFacetLen);
        setModelTop(defaultFacetLen);
        setEndOfBrandList(false);
        setEndOfEqTypeList(false);
        // setEndOfPartTypeList(false);
        setEndOfModelList(false);
        setFacets([]);
        setSelectModelNum(false);
        if (!filters) {
          setFilters([]);
        }
        if (!modelNumSearch)
        {
          setFilters([]);
          setExactModelMatch(false);
        }
        setPreSelectedFlag(false);
        let endpoint = '/search?q=' + q + '&modelsearch=' + modelNumSearch;
        if (modelNameDesc) {
          endpoint = endpoint += "&modelname=" + modelNameDesc;
          if (!exactModelMatch) {
            setExactModelMatch(true);
          }
        }
        navigate(endpoint);
      }
    }, [q, modelNumSearch, modelNameDesc]);

    useEffect(() => {
        setUserSearchDesc(createUserSearchDescription());
    }, [keywords,resultCount,selectModelNum,modelNumSearch,modelNameDesc,filterDesc,matchedModels]);

    const navigateToSearchPage = (searchTerm) => {
      if (!searchTerm || searchTerm === '') {
        searchTerm = '*'
      }
      setQ(searchTerm);
    }

    let postSearchHandler = (searchTerm) => {
        if (!searchTerm || searchTerm === '') {
          searchTerm = '*'
        }
        setQ(searchTerm);
      }

    function createUserSearchDescription() {
      let searchDesc = '';
      if (keywords && keywords.length > 0 && keywords !== "*") {
        if (resultCount === 0 || resultCount === TOTAL_RES_COUNT) {
          if (selectModelNum) {
            searchDesc = searchDesc + `<h4>${matchedModels.length} models matched your search: <u>${keywords.trim().replaceAll("*", '')}</u></h4><hr/>` +
          "<h6>Please select a model number from the filter panel for the best results.</h6>";
          }
          else {
            if(!modelNumSearch) {
              searchDesc = searchDesc + `<h4>No results found for your search: <u>${keywords.trim().replaceAll("*", '')}</u></h4><hr/>`;
            }
            else {
              searchDesc = searchDesc + `<h4>No parts found for model: <u>${modelNameDesc}</u></h4><hr/>`;
            }
          }
        }
        else {
          if (modelNumSearch && modelNameDesc!=="") {
            searchDesc = searchDesc + `<h3>${modelNameDesc} Parts</h3><hr>`;
          }
          else {
            if (selectModelNum) {
              searchDesc = searchDesc + `<h4>${matchedModels.length} models matched your search: <u>${keywords.trim().replaceAll("*", '')}</u></h4><hr/>` +
            "<h6>Please select a model number from the filter panel for the best results.</h6>";
            }
            else {
              searchDesc = searchDesc + `<h4>You searched for: <strong><u>${keywords.trim().replaceAll("*", '')}</u></strong></h4>`;
            }
          }
        }
      }
      else if (keywords === "*") {
        searchDesc = searchDesc + (!filterDesc || filterDesc.length === 0) ? 
          "<h2>Showing All Results</h2><hr/>" : 
          `<h2>All ${filterDesc} Parts</h2><hr/>`;
      }
      else if (filterDesc &&  filterDesc.length > 0) {
        searchDesc = searchDesc + `<h2>${filterDesc} Parts</h2><hr/>`;
      }

      return searchDesc;
    }


    const seeMore = (facetType, facetList, endOfFacetTypeList, setEndOfFacetTypeList, facetTop, setFacetTop) => {
      if (!endOfFacetTypeList) {
            let allFacets = [];
            if (facetList && facetList.length > 0) {
              facetList
              .slice(0, facetTop+10)
              .map((facet) => {
                if (facetType === "Model Number") {
                  allFacets.push({
                  "id": facet["kModelMasterId"], 
                  "value": `${facet["ModelNum"]} ${facet["BrandName"]} ${facet["EquipmentType"]} ${facet["MfgModelNum"] === "nan" ? "" : `(${facet["MfgModelNum"].replace(/[()]/g, "")})`}` 
                  });
                  
                }
                else {
                  allFacets.push(facet);
                }
              })
            }
            setFacets({...facets, [facetType]: allFacets});
            setFacetTop(facetTop+10);
            if (facetList.length < facetTop+10) {
              setEndOfFacetTypeList(true);
            }
      }
  }
  
  const seeLess = (facetType, facetList, endOfFacetTypeList, setEndOfFacetTypeList, facetTop, setFacetTop) => {
    if (endOfFacetTypeList) {
          let allFacets = [];
          if (facetList && facetList.length > 0) {
            facetList
            .slice(0, 10)
            .map((facet) => {
              if (facetType === "Model Number") {
                allFacets.push({
                "id": facet["kModelMasterId"], 
                "value": `${facet["ModelNum"]} ${facet["BrandName"]} ${facet["EquipmentType"]} ${facet["MfgModelNum"] === "nan" ? "" : `(${facet["MfgModelNum"].replace(/[()]/g, "")})`}` 
                });
                
              }
              else {
                allFacets.push(facet);
              }
            })
          }
          setFacets({...facets, [facetType]: allFacets});
          setFacetTop(defaultFacetLen);
          if (facetList.length > defaultFacetLen) {
            setEndOfFacetTypeList(false);
          }
    }
}

    return (
        <AppContext.Provider
            value={{navigate,BASE_URL,results,setResults,resultCount,setResultCount,currentPage,setCurrentPage,qParam,topParam,skipParam,
            q,setQ,skip,setSkip,top,filters,setFilters,facets,setFacets,isLoading,setIsLoading,preSelectedFilters,setPreSelectedFilters,
            preSelectedFlag,setPreSelectedFlag,keywords,setKeywords,resultsPerPage,matchedModels,setMatchedModels,matchedBrands, setMatchedBrands, 
            matchedEqTypes, setMatchedEqTypes, defaultFacetLen, modelTop, setModelTop, brandTop, setBrandTop, endOfBrandList, setEndOfBrandList, 
            eqTypeTop, setEqTypeTop, endOfEqTypeList, setEndOfEqTypeList,endOfModelList, setEndOfModelList,userSearchDesc,
            setUserSearchDesc,exactModelMatch,setExactModelMatch,initialRef,postSearchHandler,modelNameDesc,setModelNameDesc,seeMore,seeLess,
            navigateToSearchPage,selectModelNum,setSelectModelNum,modelNumSearch,setModelNumSearch,sortedFilters,setSortedFilters,
            filterDesc,setFilterDesc}}>
            {children}
        </AppContext.Provider>
    );
};