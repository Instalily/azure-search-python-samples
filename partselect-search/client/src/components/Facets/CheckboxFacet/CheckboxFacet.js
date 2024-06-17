import React, { useContext, useState, useEffect } from 'react';
import { Collapse, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styled from 'styled-components';

import './CheckboxFacet.css';
import { AppContext } from '../../../contexts/AppContext';

export default function CheckboxFacet(props) {
    const { postSearchHandler, seeMore, seeLess, defaultFacetLen, setModelNameDesc, matchedModels, endOfModelList, setEndOfModelList, modelTop, setModelTop,
        matchedBrands, endOfBrandList, setEndOfBrandList, brandTop, setBrandTop, matchedEqTypes, endOfEqTypeList, setEndOfEqTypeList, 
        eqTypeTop, setEqTypeTop, matchedPartTypes, endOfPartTypeList, setEndOfPartTypeList, partTypeTop, setPartTypeTop, setModelNumSearch } = useContext(AppContext);

    const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            setIsExpanded(window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFacetClick = (id, model) => {
        setModelNameDesc(model);
        setModelNumSearch(true);
        postSearchHandler(id);
    };

    const renderSeeMoreButton = (props) => {
        switch (props.name) {
          case "Model Number":
            return !endOfModelList && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeMore(props.name, matchedModels, endOfModelList, setEndOfModelList, modelTop, setModelTop)}}>See More...</div>;
          case "Brand Name":
            return !endOfBrandList && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeMore(props.name, matchedBrands, endOfBrandList, setEndOfBrandList, brandTop, setBrandTop)}}>See More...</div>;
          case "Equipment Type":
            return !endOfEqTypeList && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeMore(props.name, matchedEqTypes, endOfEqTypeList, setEndOfEqTypeList, eqTypeTop, setEqTypeTop)}}>See More...</div>;
          // case "Part Type":
          //   return !endOfPartTypeList && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeMore(props.name, matchedPartTypes, endOfPartTypeList, setEndOfPartTypeList, partTypeTop, setPartTypeTop)}}>See More...</div>;
          default:
            return null;
        }
      };   
      
      const renderSeeLessButton = (props) => {
        switch (props.name) {
          case "Model Number":
            return endOfModelList && (matchedModels.length > defaultFacetLen) && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeLess(props.name, matchedModels, endOfModelList, setEndOfModelList, modelTop, setModelTop)}}>See Less...</div>;
          case "Brand Name":
            return endOfBrandList && (matchedBrands.length > defaultFacetLen) && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeLess(props.name, matchedBrands, endOfBrandList, setEndOfBrandList, brandTop, setBrandTop)}}>See Less...</div>;
          case "Equipment Type":
            return endOfEqTypeList && (matchedEqTypes.length > defaultFacetLen) && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeLess(props.name, matchedEqTypes, endOfEqTypeList, setEndOfEqTypeList, eqTypeTop, setEqTypeTop)}}>See Less...</div>;
          // case "Part Type":
            // return endOfPartTypeList && (matchedPartTypes.length > defaultFacetLen) && <div className="see-more" role="button" tabIndex="0" onClick={() => {seeLess(props.name, matchedPartTypes, endOfPartTypeList, setEndOfPartTypeList, partTypeTop, setPartTypeTop)}}>See Less...</div>;
          default:
            return null;
        }
      };   

    const facetItems = props.values.map(facetValue => {
        const isSelected = props.selectedFacets.some(facet => facet.value === facetValue.value);
        
        return props.name === "Model Number" ? (
            <FacetValueListItem
                dense
                disableGutters
                key={facetValue.value}
                button
                onClick={() => handleFacetClick(facetValue.id, facetValue.value)}
            >
                <ListItemText primary={facetValue.value} />
            </FacetValueListItem>
        ) : (
            <FacetValueListItem dense disableGutters id={facetValue.value} key={facetValue.value}>
                <Checkbox
                    edge="start"
                    disableRipple
                    checked={isSelected}
                    onChange={() => {
                        isSelected 
                            ? props.removeFilter({ field: props.name, value: facetValue.value })
                            : props.addFilter(props.name, facetValue.value);
                    }}
                />
                <ListItemText primary={`${facetValue.value} (${facetValue.count})`} />
            </FacetValueListItem>
        );
    });

    return (
        <div>
            <FacetListItem disableRipple={true} button onClick={() => setIsExpanded(!isExpanded)}>
                <ListItemText 
                    primary={props.mapFacetName(props.name)}
                />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </FacetListItem>
            <Collapse in={isExpanded} component="div">
                <List component="div" disablePadding>
                    {facetItems}
                    {renderSeeMoreButton(props)}
                    {renderSeeLessButton(props)}
                </List>
            </Collapse>
        </div>
    );
}

const FacetListItem = styled(ListItem)({
    paddingLeft: '16px !important',
});

const FacetValueListItem = styled(ListItem)({
    paddingLeft: '32px !important',
});

const FacetValuesList = styled(List)({
    marginRight: '18px !important'
});
