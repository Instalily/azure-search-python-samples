import React, {createContext,useState,useRef,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    let location = useLocation();
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const qParam = new URLSearchParams(location.search).get('q') ?? "*";
    const topParam = parseInt(new URLSearchParams(location.search).get('top') ?? 8, 10);
    const skipParam = parseInt(new URLSearchParams(location.search).get('skip') ?? 0, 10);
    const [q, setQ] = useState(qParam);
    const [skip, setSkip] = useState(skipParam);
    const [top] = useState(topParam);
    const [filters, setFilters] = useState(undefined);
    const [facets, setFacets] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [preSelectedFilters, setPreSelectedFilters] = useState([]);
    const [preSelectedFlag, setPreSelectedFlag] = useState(false);
    const [keywords, setKeywords] = useState(q);
    const [resultFlag, setResultFlag] = useState(undefined);
    const [modelBrandName, setModelBrandName] = useState("");
    const [modelEquipmentType, setModelEquipmentType] = useState("");
    const resultsPerPage = top;
    const [matchedModels, setMatchedModels] = useState(undefined);
    const [modelTop, setModelTop] = useState(10);
    const [endOfModelList, setEndOfModelList] = useState(false);
    let exactModelMatch = false;
    const initialRef = useRef(true);
    const navigate = useNavigate();
    let BASE_URL;

    if(window.location.href.startsWith("http://localhost")) {
        BASE_URL = "http://0.0.0.0:8000"
        }
        else {
        BASE_URL = "https://instaagentsearch-mwvqt7kpva-uc.a.run.app";
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
    
        if (!preSelectedFlag && filters) {
            const body = {
            q: keywords,
            top: top,
            skip: skip,
            filters: filters,
            model_top: modelTop
            };
            axios.post(BASE_URL+'/search', body)
                .then(response => {
                setResults(response.data.results);
                let allFacets = response.data.facets;
                if (response.data.matched_models && response.data.matched_models.length > 0) {
                    setMatchedModels(response.data.matched_models);
                    if (response.data.matched_models.length === 1 && response.data.matched_models[0]["ModelNum"].toLowerCase() === keywords.toLowerCase()) {
                        exactModelMatch = true;
                    }
                    if (!exactModelMatch) {
                    allFacets["Model Number"] = [];
                    response.data.matched_models.map((model) => {
                        allFacets["Model Number"].push({"value": `${model["ModelNum"]} ${model["BrandName"]} ${model["EquipmentType"]}` })
                    });
                    }
                }
                if (response.data.endofModelList) {
                    setEndOfModelList(true);
                }
                setFacets(allFacets);
                setResultCount(response.data.count);
                if (response.data.preselectedFilters && response.data.preselectedFilters.length > 0) {
                    setPreSelectedFilters(response.data.preselectedFilters);
                    setPreSelectedFlag(true);
                }
                if (response.data.keywords.toLowerCase() !== q.toLowerCase()) {
                    setKeywords(response.data.keywords);
                }
                setResultFlag(response.data.resultFlag);
                setModelBrandName(response.data.modelBrandName);
                setModelEquipmentType(response.data.modelEquipmentType);
                setIsLoading(false);
                })
                .catch(error => {
                console.error(error);
                setIsLoading(false);
                });
        } else {
            setPreSelectedFlag(false);
            setIsLoading(false);
        }
        }, [keywords, top, skip, filters, currentPage]);
        
    useEffect(() => {
    if (preSelectedFilters && preSelectedFilters.length > 0) {
        setFilters(preSelectedFilters);
        setPreSelectedFilters([]);
    }
    }, [preSelectedFilters]);

    useEffect(() => {
        setCurrentPage(1);
        setFilters([]);
        setKeywords(q);
        setModelTop(10);
        setEndOfModelList(false);
        setFacets([]);
        navigate('/search?q=' + q);
    }, [q]);

    let postSearchHandler = (searchTerm) => {
        if (!searchTerm || searchTerm === '') {
          searchTerm = '*'
        }
        setQ(searchTerm);
      }

      const seeMore = () => {
        if (!endOfModelList) {
          const body = {
            partialModel: keywords,
            model_top: modelTop + 10,
            filters: filters
          }
          axios.post(BASE_URL+`/fetch_more_models`, body)
          .then(response => {
              let allFacets = [];
              if (response.data.matched_models && response.data.matched_models.length > 0) {
                response.data.matched_models.map((model) => {
                  allFacets.push({"value": model});
                })
              }
              if (response.data.end_of_list) {
                setEndOfModelList(response.data.end_of_list);
              }
              setFacets({...facets, "Model Number": allFacets});
              setModelTop(modelTop + 10);
          }).catch(error => {
              console.error(error);
            });
        }
    }

    return (
        <AppContext.Provider
            value={{navigate,BASE_URL,results,setResults,resultCount,setResultCount,currentPage,setCurrentPage,qParam,topParam,skipParam,
            q,setQ,skip,setSkip,top,filters,setFilters,facets,setFacets,isLoading,setIsLoading,preSelectedFilters,setPreSelectedFilters,
            preSelectedFlag,setPreSelectedFlag,keywords,setKeywords,resultFlag,setResultFlag,modelBrandName,setModelBrandName,
            modelEquipmentType,setModelEquipmentType,resultsPerPage,matchedModels,setMatchedModels,modelTop,setModelTop,
            endOfModelList,setEndOfModelList,exactModelMatch,initialRef,postSearchHandler,seeMore}}>
            {children}
        </AppContext.Provider>
    );
};