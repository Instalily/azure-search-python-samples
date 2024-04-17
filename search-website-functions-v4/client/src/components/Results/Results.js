import React, {useContext} from 'react';
import Result from './Result/Result';
import { AppContext } from '../../contexts/AppContext';
import "./Results.css";

function createUserSearchDescription(keywords, resultFlag, modelBrandName, modelEquipmentType, filterDesc) {
    if (resultFlag === "exact_model") {
    return `<h2>${keywords.toUpperCase()} ${modelBrandName} ${modelEquipmentType} Parts</h2><hr/>`;
  }
  if (keywords.length > 0 && keywords !== "*") {
    if (resultFlag && resultFlag==="no result") {
      return `<h3>No results found for your query.</h3><hr/>`;
    }
    else {
      return `<h5>You searched for: <strong><u>${keywords.toLowerCase().trim().replaceAll("*", '')}</u></strong></h5>`;
   }
    
  }
  if (keywords === "*") {
    return filterDesc.length === 0 ? 
      "<h2>Showing All Results</h2><hr/>" : 
      `<h2>All ${filterDesc} Parts</h2><hr/>`;
  }
  if (filterDesc.length > 0) {
    return `<h2>${filterDesc} Parts</h2><hr/>`;
  }

  return `<h3>No results found for your query.</h3><hr/>`;
}

export default function Results() {
  const { keywords, resultFlag, modelBrandName, modelEquipmentType, results, filters, skip, resultCount, top } = useContext(AppContext);
  let res = results.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });

  const sortOrder = {
    'Brand Name': 1,
    'Equipment Name': 2,
    'Part Type': 3
  };

  const sortedFilters = filters && filters.sort((a, b) => {
    return (sortOrder[a.field] || 4) - (sortOrder[b.field] || 4);
  });

  let filterDesc = sortedFilters && sortedFilters.map(filter => {
    if (filter.value === 'Others') {
      return 'Uncategorized';
    }
    return filter.value;
  }).join(' ');

  const userSearchDesc = createUserSearchDescription(keywords, resultFlag, modelBrandName, modelEquipmentType, filterDesc);

  let beginDocNumber = Math.min(skip + 1, resultCount);
  let endDocNumber = Math.min(skip + top, resultCount);

  return (
    <div>
      <div>
      <div>
        <p className="results-info" dangerouslySetInnerHTML={{__html: userSearchDesc}}></p>
      </div> 
        <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {resultCount.toLocaleString()} results</p>
        <div className="row row-cols-md-4 results">
          {res}
        </div>
      </div>
    </div>
  );
};
