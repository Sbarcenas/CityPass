import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  ImageBackground
} from "react-native";
import { connect } from "react-redux";
import AppIntroSlider from "react-native-app-intro-slider";
import LinearGradient from "react-native-linear-gradient";
import CustomFont from "../../components/CustomFont/index";
import { users } from "../../feathers";
import { Navigation } from "react-native-navigation";
// import cityLogo from '../../assets/intro/LOGO.png'
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 320
  }
});
const slides = [
  {
    key: "1",
    titleB: "WELCOME TO",
    text: "UN CLUB EXCLUSIVO PENSADO SOLO PARA TI",
    image: require("../../assets/intro/1.png"),
    imageStyle: styles.image,
    hasLogo: true
  },
  {
    key: "2",
    titleB: "PUNTOS Y",
    title: "BENEFICIOS",
    text: "UTILIZA TUS PUNTOS PARA OBTENER BENEFICIOS ÚNICOS",
    text2: "PODRÁS ADQUIRIRLOS EN",
    text3: "NUESTRA TIENDA DE PUNTOS",
    image: require("../../assets/intro/2.png"),
    imageStyle: styles.image
  },
  {
    key: "3",
    titleB: "!¡",
    text:
      "Disfruta tus beneficios presentando tu Prime Pass en los comercios que visites!",
    image: require("../../assets/intro/3.png"),
    imageStyle: styles.image
  }
];

class IntroShow extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }
  onDone = () => {
    const { user } = this.props;
    users.patch(user.id, { is_new: "false" });

    Navigation.pop(this.props.componentId);
  };
  renderItem = ({ image, titleB, title, text, hasLogo }) => (
    <ImageBackground style={{ height, width }} source={image} />
  );
  render() {
    return (
      <AppIntroSlider
        slides={slides}
        onDone={this.onDone}
        renderItem={this.renderItem}
      />
    );
  }
}

const stateToProps = state => state;
export default connect(stateToProps)(IntroShow);
