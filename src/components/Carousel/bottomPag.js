import React from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const BottomPag = props => {
  const {entries, activeSlide} = props;
  return (
    <Pagination
      dotsLength={entries.length}
      activeDotIndex={activeSlide}
      containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
      }}
      inactiveDotStyle={
        {
          // Define styles for inactive dots here
        }
      }
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  );
};

export default BottomPag;
