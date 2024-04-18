import React, {useContext} from 'react';
import Result from './Result/Result';
import { AppContext } from '../../contexts/AppContext';
import "./Results.css";

export default function Results() {
  const { results, skip, resultCount, top, userSearchDesc } = useContext(AppContext);
  let res = results.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });

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
