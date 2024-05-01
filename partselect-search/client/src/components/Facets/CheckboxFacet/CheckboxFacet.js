import React, { useContext, useState, useEffect } from 'react';
import { Collapse, Checkbox, List, ListItem, ListItemText, Radio } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styled from 'styled-components';

import './CheckboxFacet.css';
import { AppContext } from '../../../contexts/AppContext';

export default function CheckboxFacet(props) {
    const { postSearchHandler, endOfModelList, seeMore, setModelNameDesc, setExactModelMatch, setModelNumSearch } = useContext(AppContext);

    // Initialize state based on window width
    const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);

    useEffect(() => {
        function handleResize() {
            setIsExpanded(window.innerWidth > 768);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let [selectedModel, setSelectedModel] = useState(null);
    const handleModelChange = (event, id, model) => {
        if (selectedModel === model) {
            setSelectedModel(null);
            event.target.checked = false;
        } else {
            setSelectedModel(model);
            setModelNameDesc(model);
            setModelNumSearch(true);
            postSearchHandler(id);
        }
    };

    const checkboxes = props.values.map(facetValue => {
        let isSelected = props.selectedFacets.some(facet => facet.value === facetValue.value);

        return (
            <FacetValueListItem dense disableGutters id={facetValue.value} key={facetValue.value}>
                {props.name !== "Model Number" ? (
                    <>
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
                        <ListItemText primary={`${facetValue.value} (${facetValue.count})`}/>
                    </>
                ) : (
                    <>
                        <Radio
                            edge="start"
                            disableRipple
                            checked={selectedModel === facetValue.value}
                            onChange={(event) => handleModelChange(event, facetValue.id, facetValue.value)}
                        />
                        <ListItemText primary={`${facetValue.value}`}/>
                    </>
                )}
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
                <FacetValuesList>
                    {checkboxes}
                    {props.name === "Model Number" && !endOfModelList && <div className="see-more" role="button" tabIndex="0" onClick={seeMore}>See More...</div>}
                </FacetValuesList>
            </Collapse>
        </div>
    );
}

const FacetListItem = styled(ListItem)({
    paddingLeft: '16px !important',
})

const FacetValueListItem= styled(ListItem)({
    paddingLeft: '32px !important',
});

const FacetValuesList= styled(List)({
    marginRight: '18px !important'
});
