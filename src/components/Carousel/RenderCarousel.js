import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
const { width } = Dimensions.get("window");

const RenderCarousel = props => {
  const {
    carouselItems,
    RenderItem,
    carouselHeight,
    pagStyle,
    tabs,
    dotPagination = true,
    itemWidth = width,
    loop
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const Dots = () => (
    <Pagination
      dotsLength={carouselItems.length}
      activeDotIndex={activeIndex}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "white"
      }}
      inactiveDotStyle={{
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "white"
        // Define styles for inactive dots here
      }}
      inactiveDotOpacity={1}
      inactiveDotScale={1}
    />
  );

  const Tabs = () => {
    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          borderRadius: 5,
          backgroundColor: "purple"
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

  return (
    <View style={{ flex: 1, position: "relative" }}>
      {tabs && <View style={[styles.pagStyle, pagStyle]}>{<Tabs />}</View>}
      <View style={[styles.container, { height: carouselHeight }]}>
        <View style={{ flex: 1 }}>
          <Carousel
            autoplay
            loop={loop}
            ref={ref => (this.carousel = ref)}
            data={carouselItems}
            sliderWidth={width}
            itemWidth={itemWidth}
            renderItem={props => <RenderItem {...props} />}
            onSnapToItem={index => setActiveIndex(index)}
          />
        </View>
      </View>
      {dotPagination && (
        <View style={[styles.pagStyle, pagStyle]}>{<Dots />}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  pagStyle: {}
});

/*
 retorna true si al pasar los nextProps a renderizar retorna
 el mismo resultado que al pasar los prevProps a renderizar,
 de otro modo retorna false
 */

function areEqual(prevProps, nextProps) {
  return (
    prevProps.carouselItems.length === nextProps.carouselItems.length ||
    nextProps.carouselItems.length === 0
  );
}

export default React.memo(RenderCarousel, areEqual);
