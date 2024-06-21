import React, { useContext, useState } from "react";
import { List, Chip } from "@mui/material";
import CheckboxFacet from "./CheckboxFacet/CheckboxFacet";
import styled from "styled-components";
import "./Facets.css";
import { AppContext } from "../../contexts/AppContext";

export default function Facets() {
  const { facets, filters, setFilters, exactModelMatch, noResults } =
    useContext(AppContext);
  function mapFacetName(facetName) {
    const capitalizeFirstLetter = (string) =>
      string[0] ? `${string[0].toUpperCase()}${string.substring(1)}` : "";
    facetName = facetName.trim();
    facetName = capitalizeFirstLetter(facetName);

    facetName = facetName.replace("_", " ");
    return facetName;
  }

  function addFilter(name, value) {
    const newFilters = filters && filters.concat({ field: name, value: value });
    setFilters(newFilters);
  }

  function removeFilter(filter) {
    const newFilters =
      filters && filters.filter((item) => item.value !== filter.value);
    setFilters(newFilters);
  }

  var Facets;
  const sortOrder = [
    "Brand Name",
    "Equipment Type",
    // "Part Type",
    "Model Number",
  ];

  try {
    console.log(exactModelMatch);
    Facets = Object.keys(facets)
      .filter(
        (key) =>
        facets[key].length > 0 &&
          !(
            (exactModelMatch && key === "Equipment Type") ||
            (exactModelMatch && key === "Brand Name")
          )
      )
      .sort((a, b) => {
        const indexA = sortOrder.indexOf(a);
        const indexB = sortOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        } else if (indexA !== -1) {
          return -1;
        } else if (indexB !== -1) {
          return 1;
        } else {
          return 0;
        }
      })
      .map((key) => {
        return (
          <CheckboxFacet
            key={key}
            name={key}
            values={facets[key]}
            addFilter={addFilter}
            removeFilter={removeFilter}
            mapFacetName={mapFacetName}
            selectedFacets={filters && filters.filter((f) => f.field === key)}
          />
        );
      });
  } catch (error) {
    console.log(error);
  }

  const Filters =
    filters &&
    filters.map((filter, index) => {
      return (
        <li key={index}>
          <Chip
            label={`${mapFacetName(filter.field)}: ${filter.value}`}
            onDelete={() => removeFilter(filter)}
            className="chip"
          />
        </li>
      );
    });
  const clearFilters = () => {
    if (Filters && Filters.length > 0) {
      setFilters([]);
    }
  };
  return (
    <div id="facetPanel" className="box">
      <div className="facetbox">
        {!noResults && <div className="clear-filters" onClick={clearFilters}>
          <u>Clear filters</u>
        </div>}
        <div id="clearFilters">
          <ul className="filterlist">{Filters}</ul>
        </div>
        <FacetList component="nav" className="listitem">
          {Facets}
        </FacetList>
      </div>
    </div>
  );
}

const FacetList = styled(List)({
  marginTop: "0px !important",
});
