import React from 'react';
import {StyleSheet} from 'react-native';

import RenderCarousel from './RenderCarousel';

const MainCarrousel = props => {
  const {numItems, RenderItem, carouselItems, carouselHeight} = props;
  let data =
    numItems === 1
      ? {
          elements: carouselItems.map(el => ({children: [el]})),
        }
      : carouselItems.reduce(
          (total, el) => {
            let all = total;
            if ([1, NaN].includes(all.index / numItems)) {
              all.elements.push({children: [...all.tempElements, el]});
              all.tempElements = [];
              all.index = 1;
            } else if (all.id === carouselItems.length - 1) {
              all.elements.push({children: [...all.tempElements, el]});
            } else {
              all.tempElements.push(el);
              all.index++;
            }
            all.id++;
            return all;
          },
          {id: 0, lastElement: null, index: 1, elements: [], tempElements: []},
        );
  return (
    <RenderCarousel
      carouselHeight={carouselHeight}
      carouselItems={data.elements}
      RenderItem={props => <RenderItem {...props} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MainCarrousel;
