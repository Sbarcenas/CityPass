/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import algoliasearch from "algoliasearch/lite";
import {
  Configure,
  connectHits,
  Index,
  InstantSearch
} from "react-instantsearch-native";
import { ALGOLIA } from "../../utils/data";
export const searchClient = algoliasearch(ALGOLIA.APP_ID, ALGOLIA.API_KEY);
/**
 * @return {null}
 */

const Results = connectHits(props => {
  const { hits, Item } = props;
  return <Item hits={hits} />;
});

function WrapperAlgolia(props) {
  const { keys, index, Item } = props;
  return (
    <InstantSearch searchClient={searchClient} indexName={index || "benefits"}>
      <Index key={index} indexName={keys.index}>
        <Configure
          query={keys.query}
          hitsPerPage={keys.hitsPerPage || 20}
          facets={keys.facets || []}
          facetFilters={keys.facetFilters || []}
          {...keys}
        />
        <Results Item={Item} />
      </Index>
    </InstantSearch>
  );
}

export default React.memo(WrapperAlgolia);
