import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import useOutsideClick from './useOutsideClick';
import "./SearchBar.css";
import { AppContext } from '../../contexts/AppContext';

export default function SearchBar(props) {
  const {BASE_URL,setSelectModelNum,setModelNameDesc} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [modelSuggestions, setModelSuggestions] = useState([]);
    const [partSuggestions, setPartSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const [manufacturers, setManufacturers] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(true);
    const [exactBrandMatch, setExactBrandMatch] = useState(false);
    const maxQueryLen = 100;
    const searchBarRef = useRef(null);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const onOutsideClick = () => {
      setIsDropdownVisible(false);
    };

    useOutsideClick(searchBarRef, onOutsideClick);

    useEffect(() => {
      setExactBrandMatch(false);
        if (searchTerm.length < 3 || searchTerm.length >= maxQueryLen) {
          setIsLoading(true);
          setModelSuggestions([]);
          setPartSuggestions([]);
          setManufacturers([]);
          setRecommendations([]);
          setError(null);
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        setModelSuggestions([]);
        setPartSuggestions([]);
        setManufacturers([]);
        setRecommendations([]);
        setError(null);
        const debounceTimeout = setTimeout(() => {
          setIsLoading(true);
          if (searchTerm) {
            setError(null);
    
            const source = axios.CancelToken.source();
            axios.get(BASE_URL+`/fetch_all?searchTerm=${encodeURIComponent(searchTerm)}&user=${props.userEmail}`, {
                cancelToken: source.token,
              })
              .then(response => response.data)
              .then(function(response) {
                // console.log(response);
                if (response.parts && response.parts.length !== 0) {
                  setPartSuggestions(response.parts.map((pt) => 
                    pt ? pt.toUpperCase() : ""
                  ))
                }
          
                  if(response.models && response.models.length !== 0){
                    setModelSuggestions(response.models)
                }
          
                if(response.manufacturers && response.manufacturers.length!==0) {
                  setManufacturers(response.manufacturers);
                }
          
                if (response.recommendations && response.recommendations.length!==0) {
                  setRecommendations(response.recommendations.slice(0, 5));
                  }     
                if (response.exactBrandMatch && response.exactBrandMatch !== false) {
                  setExactBrandMatch(true);
                }
                 setIsLoading(false);
              })
              .catch(function (error) {
                if (axios.isCancel(error)) {
                  // console.log("Request canceled:", error.message);
                } else {
                  console.log(error);
                  setError("Something went wrong");
                  setIsLoading(false);
                }
              })
            return () => {
              source.cancel("Operation canceled by the user.");
            };  
          }
        }, 500);
        return () => clearTimeout(debounceTimeout);
      }, [searchTerm]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(`Searching for: ${searchTerm}`);
        setModelSuggestions([]);
        setPartSuggestions([]);
        setManufacturers([]);
        setRecommendations([]);
        setExactBrandMatch(false);
        setIsDropdownVisible(false);
        let query = (searchTerm.length >= 3 && searchTerm.length <6) ? searchTerm.replaceAll("*", "").trim() + "*": searchTerm.replaceAll("*", "").trim();
        props.setModelNameDesc("");
        props.setModelNumSearch(false);
        props.onSearchHandler(query);
        setSearchTerm("");
    };

    return (
          <div ref={searchBarRef}>
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Search model or part number"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownVisible(true)}
                style={{ padding: '8px', paddingRight: '10px' }}
              />
              {searchTerm && (
                <div
                  className="clear-icon" 
                  onClick={() => handleSearchChange({ target: { value: '' } })}
                >
                  &#x2715;
                </div>
              )}
            </div>
          <div className={props.page==="searchpage"? "button-container-searchpage": "button-container"}>
            <button type="submit">
              {!isLoading ? "Search" : <div className="loader"></div>}
              {error && <div>{error}</div>}
            </button>
          </div>
          </form>
          {(modelSuggestions.length > 0 ||
            partSuggestions.length > 0 ||
            manufacturers.length > 0 ||
            recommendations.length > 0) && (isDropdownVisible) && (
              <div className={`suggestions-dropdown ${props.page === 'search' ? 'search-page' : ''}`}>
              {modelSuggestions.length > 0 && <div className="suggestions-column">
                <h3>Matching Models</h3>
                <ul>
                {
                    modelSuggestions.map((suggestion, index) => {
                      const isDuplicate = modelSuggestions.filter(item => item.ModelNum === suggestion.ModelNum).length > 1;
                      const modelNameDropdown = `${suggestion.ModelNum}`+ 
                      `${(isDuplicate &&suggestion.BrandName!== "nan") ? ` ${suggestion.BrandName}` : ''}` + 
                      `${(isDuplicate && (suggestion.EquipmentType!== "nan")) ? ` ${suggestion.EquipmentType}` : ''}` +
                      `${(isDuplicate && suggestion.MfgModelNum !== "nan") ? ` (${suggestion.MfgModelNum})` : ''}`;
                      const modelNameDesc = `${suggestion.ModelNum} ${suggestion.BrandName} ${suggestion.EquipmentType} ${suggestion.MfgModelNum !== "nan" ? `(${suggestion.MfgModelNum})`: ""}`;
                      // console.log(modelNameDesc)
                      return(
                        <li
                          key={index}
                          onClick={() => {
                            setModelSuggestions([]);
                            setPartSuggestions([]);
                            setManufacturers([]);
                            setRecommendations([]);
                            setSelectModelNum(modelNameDesc);
                            setModelNameDesc(modelNameDesc);
                            if (props.setModelNumSearch) {
                              props.setModelNumSearch(true);
                            }
                            props.onSearchHandler(suggestion["kModelMasterId"]);
                            setSearchTerm("");
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: modelNameDropdown.replace(
                                new RegExp(`(${searchTerm})`, "gi"),
                                "<strong>$1</strong>"
                              ),
                            }}
                          />
                        </li>
                      );
                  })}
                </ul>
              </div>}
              {partSuggestions.length>0 && <div className="suggestions-column">
                <h3>Matching Parts</h3>
                <ul>
                  {
                    partSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setModelSuggestions([]);
                            setPartSuggestions([]);
                            setManufacturers([]);
                            setRecommendations([]);
                            props.setModelNameDesc("");
                            props.setModelNumSearch(false);
                            props.onSearchHandler(suggestion);
                            setSearchTerm("");
                          }}
                        >
                          <span
                                    dangerouslySetInnerHTML={{
                                      __html: suggestion.replace(
                                        new RegExp(`(${searchTerm})`, "gi"),
                                        "<strong>$1</strong>"
                                      ),
                                    }}
                                  />
                        </li>
                      ))}
                </ul>
              </div>}
              {manufacturers.length > 0 && <div className="suggestions-column">
                <h3>Brands</h3>
                <ul>
                  {
                  manufacturers.map((manu, index) => {
                    const manufacturerName = Object.keys(manu)[0];
                    const logoUrl = manu[manufacturerName];
                  
                    return (
                      <li
                        key={index}
                        onClick={() => {
                          setModelSuggestions([]);
                          setPartSuggestions([]);
                          setManufacturers([]);
                          setRecommendations([]);
                          props.setModelNameDesc("");
                          props.setModelNumSearch(false);
                          // console.log(searchTerm);
                          if (!exactBrandMatch) {
                            props.onSearchHandler(manufacturerName + ` ${searchTerm}`);
                          }
                          else {
                            props.onSearchHandler(manufacturerName);
                          }
                          setSearchTerm("");
                        }}
                      >
                        <div style={{ display: "flex", paddingTop: "8px", alignItems: "center" }}>
                          <div style={{ marginRight: "20px" }}>
                            <img
                              src={logoUrl}
                              alt={`${manufacturerName} Logo`}
                              style={{ width: "75px", maxHeight: "34px", objectFit: "contain" }}
                            />
                          </div>
                  
                          <div style={{ marginTop: '-8px', fontWeight: 'bold', fontSize: '18px' }}>
                            {manufacturerName}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  
                </ul>
              </div>}
              {recommendations.length > 0 && <div
                className="suggestions-column"
                style={{
                  borderRadius: "16px",
                  width: "100%",
                  flex: "2",
    
                }}
              >
                <h3>Top Part Recommendations</h3>
                <ul>
                  {
                    recommendations.map((rec, index) => (
                        <li
                          key={index}
                          style={{ marginBottom: "10px" }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ marginRight: "20px" }}>
                              <img
                                src={rec.imageURL}
                                alt="Recommendation"
                                style={{ width: "80px" }}
                              />
                            </div>
                            <div
                              style={{
                                alignSelf: "flex-start",
                                display: "block",
                                textDecoration: "none",
                                color: "black",
                                fontWeight: "600",
                                fontSize:"15px"
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "500",
                                  color: "black",
                                  textDecoration: "none",
                                }}
                              >
                                <a
                                  // href={`/search?q=${encodeURIComponent(rec.partNum)}`}
                                  onClick={() => {
                                    setModelSuggestions([]);
                                    setPartSuggestions([]);
                                    setManufacturers([]);
                                    setRecommendations([]);
                                    props.setModelNameDesc("");
                                    props.setModelNumSearch(false);
                                    props.onSearchHandler(rec.partNum);
                                    setSearchTerm("");
                                  
                                  }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: rec.description.replace(
                                        new RegExp(`(${searchTerm})`, "gi"),
                                        "<strong>$1</strong>"
                                      ),
                                    }}
                                  />
                                </a>
                                <div>PartSelect Part #: PS{rec.InventoryID}</div>
                                <div>Manufacturer Part #: {rec.partNum}</div>
                                <div>Manufactured by: {rec.manufacturer}</div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                </ul>
              </div>}
            </div>
          )}
          {
            (searchTerm && searchTerm.length>0 && searchTerm.length<3 && searchTerm.length<maxQueryLen) && (modelSuggestions.length === 0 &&
              partSuggestions.length === 0 &&
              manufacturers.length === 0 &&
              recommendations.length === 0) && (!isLoading)
              &&
              (
                <div className="suggestions-dropdown">
                  <div className="suggestions-column" >
                    <h3>Keep typing for more specific results...</h3>
                  </div>
                </div>
              )
          }
          {
            (searchTerm && searchTerm.length>0 && searchTerm.length>3 && searchTerm.length<maxQueryLen) && (modelSuggestions.length === 0 &&
              partSuggestions.length === 0 &&
              manufacturers.length === 0 &&
              recommendations.length === 0) && (!isLoading)
              &&
              (
                <div className="suggestions-dropdown">
                  <div className="suggestions-column" >
                    <h3>No search results found.</h3>
                  </div>
                </div>
              )
          }
        </div>
      );
};