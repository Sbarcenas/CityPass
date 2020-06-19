import React from 'react';

const ComponentSelector = props => {
  const {componentList, type} = props;
  const MatchingComponent = componentList[type];
  return <MatchingComponent {...props} />;
};

export default ComponentSelector;
