import React, {useContext, useState} from 'react';
import { Collapse, Checkbox, List, ListItem, ListItemText, Radio } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styled from 'styled-components';

import './CheckboxFacet.css';
import { AppContext } from '../../../contexts/AppContext';

export default function CheckboxFacet(props) {
    const {postSearchHandler,endOfModelList,seeMore,setModelNameDesc,setExactModelMatch,setModelNumSearch} = useContext(AppContext);
    let [isExpanded, setIsExpanded] = useState(false);
    let [selectedModel, setSelectedModel] = useState(null);
    const handleModelChange = (event, id, model) => {
        if (selectedModel === model) {
            setSelectedModel(null);
            event.target.checked = false;
        } else {
            setSelectedModel(model);
            console.log(model);
            setModelNameDesc(model);
            setExactModelMatch(true);
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
                        <ListItemText primary={facetValue.value}/>
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
                    {props.name === "Model Number" && !endOfModelList && <div class="see-more" role="button" tabindex="0" onClick={seeMore}>See More...</div>}
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
})