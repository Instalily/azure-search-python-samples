import React, { useContext, useState, useEffect } from 'react';
import { Collapse, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styled from 'styled-components';

import './CheckboxFacet.css';
import { AppContext } from '../../../contexts/AppContext';

export default function CheckboxFacet(props) {
    const { postSearchHandler, setModelNameDesc, seeMore, endOfModelList, setExactModelMatch, setModelNumSearch } = useContext(AppContext);
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
                    {props.name === "Model Number" && !endOfModelList && <div className="see-more" role="button" tabIndex="0" onClick={seeMore}>See More...</div>}
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
