import React, {useContext, useState} from 'react';
import { Collapse, Checkbox, List, ListItem, ListItemText, Radio } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styled from 'styled-components';

import './CheckboxFacet.css';
import { AppContext } from '../../../contexts/AppContext';

export default function CheckboxFacet(props) {
    const {postSearchHandler,endOfModelList,filters,setFilters,seeMore,setModelBrandName,setModelEquipmentType} = useContext(AppContext);
    let [isExpanded, setIsExpanded] = useState(false);
    let [selectedModel, setSelectedModel] = useState(null);
    const handleModelChange = (event, model) => {
        if (selectedModel === model) {
            setSelectedModel(null);
            event.target.checked = false;
        } else {
            setSelectedModel(model);
            console.log(model);
            const [modelnum, brandname, eqtype] = model.split()
            setModelBrandName(brandname);
            setModelEquipmentType(eqtype);
            postSearchHandler(model);
            // let newFilters = props.filters;
            // if (props.filters) {
            //     newFilters = newFilters.concat({field: "Model Number", value: `${model}`});
            //     console.log("new filters: ", newFilters);
            // }
            // props.setFilters(newFilters);
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
                            onChange={(event) => handleModelChange(event, facetValue.value)}
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
    paddingLeft: '36px !important',
})

const FacetValueListItem= styled(ListItem)({
    paddingLeft: '46px !important',
});

const FacetValuesList= styled(List)({
    maxHeight: 300,
    overflowY: 'auto !important',
    marginRight: '18px !important'
})