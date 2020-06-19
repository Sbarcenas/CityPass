import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Image
} from "react-native";
import { RNS3 } from "react-native-aws3-anarock";
import CheckBox from "react-native-check-box";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Navigation } from "react-native-navigation";
import LinearGradient from "react-native-linear-gradient";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import "moment/min/locales";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import { getUser } from "../../utils/sessionUser";
import { categories, current, benefits, memberships } from "../../feathers";
import { Toaster } from "../../utils/toaster";
import { getAvatarPhoto } from "../../utils/S3Photos";
moment.locale("es");
const { width } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;
const offset = Platform.OS === "android" ? -200 : 0;
const OPTIONS = [
  {
    name: "Escanear",
    view: "qrReader"
  },
  {
    name: "Beneficios",
    view: "benefits"
  }
];

const file = {
  type: "image/png"
};
const options = {
  bucket: "cityprime-static",
  region: "us-east-1",
  accessKey: "AKIAILXWHXVE6ZHEFWTA",
  secretKey: "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",
  successActionStatus: 201
};

const getDates = (startDate, endDate) => {
  var dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

class BenefitForm extends Base {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: moment().format("YYYY[-]MM[-]DD"),
      establishment: {},
      dateRange: {},
      categories: [],
      category: ""
    };
  }
  static options() {
    return {
      topBar: {
        rightButtons: [],
        drawBehind: true,
        background: {
          color: "transparent"
        }
      }
    };
  }
  gotoView = view => {
    Navigation.push(this.props.componentId, {
      component: {
        name: `app.${view}`
      }
    });
  };
  async componentDidMount() {
    console.log("CDM ----<<>", this.props);
    const { benefit = { memberships_ids: [] }, id } = this.props;
    const { data } = await memberships.find();
    console.log("le benefit", benefit);
    this.setState({
      ...benefit,
      category: (benefit.categories || {}).name,
      memberships_ids: data.map(el => {
        const checked = benefit.memberships_ids.find(id => id == el.id);
        return { ...el, checked: checked ? true : false };
      })
    });
    if (id) {
      const date_start = benefit.date_start.split("T")[0];
      const date_end = benefit.date_end.split("T")[0];
      console.log("---->", date_start);

      const dates = {};
      const [lastY, lastM, lastD] = date_start.split("-");
      const [year, month, day] = date_end.split("-");
      const rawDates = getDates(
        new Date(lastY, lastM - 1, lastD),
        new Date(year, month - 1, day)
      );
      rawDates.map(date => {
        dates[moment(date.getTime()).format("YYYY-MM-DD")] = {
          color: "#473E69",
          selected: true
        };
      });

      this.setState({
        dateRange: {
          ...dates,
          [date_start]: { startingDay: true, color: "#473E69", selected: true },
          [date_end]: { endingDay: true, color: "#473E69", selected: true }
        }
      });
    }

    const user = await current.find();
    this.setState({ establishment_id: user.establishment.id });
  }
  onDayPress = ({ dateString, year, month, day }) => {
    const { dateRange, lastDate, lastY, lastM, lastD } = this.state;
    console.log(dateString, lastDate);
    console.log(!lastDate);
    if (
      !lastDate ||
      moment(dateString).isBefore(lastDate) ||
      Object.keys(dateRange)[1]
    ) {
      this.setState({
        dateRange: {
          [dateString]: { startingDay: true, color: "#473E69", selected: true }
        },
        lastDate: dateString,
        lastY: year,
        lastM: month,
        lastD: day
      });
    } else {
      const dates = {};
      console.log(lastY, lastM, lastD, "---", year, month, day);
      const rawDates = getDates(
        new Date(lastY, lastM - 1, lastD),
        new Date(year, month - 1, day)
      );
      rawDates.map(date => {
        dates[moment(date.getTime()).format("YYYY-MM-DD")] = {
          color: "#473E69",
          selected: true
        };
      });
      this.setState({
        dateRange: {
          ...dates,
          ...dateRange,
          [dateString]: { endingDay: true, color: "#473E69", selected: true }
        },
        lastDate: dateString
      });
    }
  };
  chooseCategory = () => {
    Navigation.showOverlay({
      component: {
        name: "app.categoryPicker",
        passProps: {
          handlePress: this.handlePickCategory
        }
      }
    });
  };
  handlePickCategory = el => {
    this.setState({ category_id: el.id, category: el.name });
  };
  submit = async () => {
    const {
      name,
      category_id,
      description,
      terms,
      quantity,
      quantity_per_user,
      points = 0,
      dateRange,
      image
    } = this.state;
    console.log("form data", this.state);
    const { id } = this.props;
    const date_start = Object.keys(dateRange).find(
      el => dateRange[el].startingDay
    );
    const date_end = Object.keys(dateRange).find(el => dateRange[el].endingDay);

    if (id) {
      try {
        const benefit = await benefits.patch(id, {
          name,
          category_id,
          description,
          terms,
          quantity,
          quantity_per_user,
          points,
          date_start,
          date_end
          // establishment_id: 1,
          // memberships_ids: memberships_ids.filter(el => el.checked).map(el => el.id),
        });
        console.log("response", benefit);
        Navigation.popToRoot(this.props.componentId);
        Toaster({ type: "success", text: "Beneficio Actualizado" });
      } catch ({ message }) {
        Toaster({ type: "error", text: message });
      }
    } else {
      try {
        const benefit = await benefits.create({
          name,
          category_id,
          description,
          terms,
          quantity,
          quantity_per_user,
          points,
          date_start,
          date_end,
          image
          // establishment_id: 1,
          // memberships_ids: memberships_ids.filter(el => el.checked).map(el => el.id),
        });
        console.log("response", benefit);
        Navigation.popToRoot(this.props.componentId);
        Toaster({ type: "success", text: "Beneficio Creado" });
      } catch ({ message }) {
        Toaster({ type: "error", text: message });
      }
    }
  };
  setProfiles = id => {
    const { memberships_ids } = this.state;
    this.setState({
      memberships_ids: memberships_ids.map(el => ({
        ...el,
        checked: el.id == id ? !el.checked : el.checked
      }))
    });
  };
  showGallery = () => {
    const { id } = this.props;
    Navigation.showOverlay({
      component: {
        name: "app.gallery",
        passProps: {
          id,
          setImage: image => {
            this.setState({ image });
          }
        }
      }
    });
  };
  render() {
    const {
      currentDate,
      dateRange,
      name,
      description,
      terms,
      image,
      quantity = 0,
      quantity_per_user = 0,
      points = 0,
      category
    } = this.state;
    const { id } = this.props;
    const range = {
      [currentDate]: { marked: true },
      ...dateRange
    };
    console.log("RANGE", image);
    console.log("form data", getAvatarPhoto(image, true));
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={offset}
        style={[styles.fill, styles.bodyBackground]}
        behavior="padding"
        enabled>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 1.0, y: 0.8 }}
          colors={["#473E69", "#249EC7"]}
          style={styles.headerGradient}
        />
        <View style={styles.fill}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.fill}>
            <View style={styles.content}>
              <View
                style={{
                  borderColor: "#473E69",
                  borderBottomWidth: 2,
                  width: "75%",
                  marginBottom: 20
                }}>
                <CustomFont>Nombre del beneficio</CustomFont>
                <TextInput
                  ºaceholder="2x1 en bebidas"
                  style={{ width: "100%" }}
                  onChangeText={name => this.setState({ name })}
                  value={name}
                />
              </View>
              <View style={{ width: "100%", marginBottom: 20 }}>
                <CustomFont style={{ marginBottom: 10 }}>
                  Categoria actual: {category}
                </CustomFont>
                <TouchableOpacity onPress={this.chooseCategory}>
                  <View
                    style={{
                      width: "100%",
                      height: 40,
                      backgroundColor: "#473E69",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                    <CustomFont style={{ color: "white" }}>
                      {id ? "Cambiar Categoría" : "Seleccionar Categoria"}
                    </CustomFont>
                  </View>
                </TouchableOpacity>
              </View>
              <Calendar
                style={{
                  width: "100%",
                  marginBottom: 10
                }}
                current={currentDate}
                minDate={currentDate}
                markedDates={range}
                onDayPress={this.onDayPress}
                markingType="period"
              />
              {true && (
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <CustomFont>Imagen del Beneficio</CustomFont>
                  <TouchableOpacity onPress={this.showGallery}>
                    <View
                      style={{
                        width: "100%",
                        height: 250,
                        backgroundColor: "#FAFAFA"
                      }}>
                      <Image
                        source={{ uri: getAvatarPhoto(image, true) }}
                        style={{ height: 250, width: "100%" }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              <View style={{ width: "75%", marginBottom: 20 }}>
                <CustomFont>Descripción</CustomFont>
                <View style={{ borderColor: "#473E69", borderWidth: 1 }}>
                  <TextInput
                    placeholder="2x1 en bebidas"
                    style={{
                      width: "100%",
                      height: 80,
                      textAlignVertical: "top"
                    }}
                    value={description}
                    onChangeText={description => this.setState({ description })}
                    multiline
                  />
                </View>
              </View>
              <View style={{ width: "75%", marginBottom: 20 }}>
                <CustomFont>Terminos y Condiciones</CustomFont>
                <View style={{ borderColor: "#473E69", borderWidth: 1 }}>
                  <TextInput
                    placeholder="2x1 en bebidas"
                    style={{
                      width: "100%",
                      height: 80,
                      textAlignVertical: "top"
                    }}
                    onChangeText={terms => this.setState({ terms })}
                    value={terms}
                    multiline
                  />
                </View>
              </View>
              <View
                style={{
                  borderColor: "#473E69",
                  borderBottomWidth: 2,
                  width: "75%",
                  marginBottom: 20
                }}>
                <CustomFont>Cantidad disponible</CustomFont>
                <TextInput
                  placeholder="120"
                  style={{ width: "100%" }}
                  keyboardType="number-pad"
                  onChangeText={quantity => this.setState({ quantity })}
                  value={`${quantity}`}
                />
              </View>
              <View
                style={{
                  borderColor: "#473E69",
                  borderBottomWidth: 2,
                  width: "75%",
                  marginBottom: 20
                }}>
                <CustomFont>
                  Cantidad de veces que un usuario puede comprarlo
                </CustomFont>
                <TextInput
                  placeholder="5"
                  style={{ width: "100%" }}
                  keyboardType="number-pad"
                  onChangeText={quantity_per_user =>
                    this.setState({ quantity_per_user })
                  }
                  value={`${quantity_per_user}`}
                />
              </View>
              {/* <View style={{ borderColor: '#473E69', borderBottomWidth: 2, width: '75%', marginBottom: 20 }}>
                <CustomFont>Puntos necesarios</CustomFont>
                <TextInput
                  placeholder="40" style={{ width: '100%' }} keyboardType="number-pad"
                  onChangeText={points => this.setState({ points })} value={`${points}`}
                />
              </View> */}

              <TouchableOpacity style={{ width: "100%" }} onPress={this.submit}>
                <View
                  style={{
                    backgroundColor: "#473E69",
                    width: "100%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6
                  }}>
                  <CustomFont style={{ color: "white", fontSize: 16 }}>
                    Guardar
                  </CustomFont>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  bodyBackground: {
    backgroundColor: "white"
  },
  fill: {
    flex: 1
  },
  headerGradient: {
    width,
    height: HEADER_MIN_HEIGHT,
    alignItems: "center"
  },
  content: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  saveButton: {
    height: 40,
    width: 200,
    borderRadius: 6,
    backgroundColor: "#53D1FB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  row: {
    height: width * 0.44,
    width: width * 0.44,
    marginVertical: 8,
    elevation: 10,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    overflow: "hidden"
  },
  rowText: {
    color: "white",
    fontSize: 24
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 3
  }
});

export default connect()(BenefitForm);
