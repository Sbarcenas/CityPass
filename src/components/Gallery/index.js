import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, CameraRoll, PermissionsAndroid, Dimensions, Image, ScrollView, ActivityIndicator,
  Platform,
} from 'react-native';
import {Toaster} from '../../utils/toaster';
import { benefits } from '../../feathers';
import { RNS3 } from 'react-native-aws3-anarock';
import { Navigation } from 'react-native-navigation';
const file = {
  type: "image/png"
}
const options = {
  bucket: "cityprime-static",
  region: "us-east-1",
  accessKey: "AKIAILXWHXVE6ZHEFWTA",
  secretKey: "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",
  successActionStatus: 201,
}
const { width, height } = Dimensions.get('window');
class Gallery extends Component {
  state = {
    photos: [],
    loading: true,
  }
  async componentDidMount() {
    try {
      if (Platform.OS === 'ios') {
        this.fetchPhotos()
      } else {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        console.log('response', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          this.fetchPhotos()
        } else {
          console.log('Camera permission denied');
        }
      }
    } catch (error) {
      Toaster({ type: 'error', title: error.message });
    }
  }
  fetchPhotos = async () => {
    const { edges } = await CameraRoll.getPhotos({ first: 200, assetType: 'Photos' });
    const photos = edges.map(({ node }) => node.image.uri);
    this.setState({ photos, loading: false });
  }
  dismiss = () => {
    Navigation.dismissOverlay(this.props.componentId);
  }
  upload = async (uri) => {
    const { id, setImage } = this.props;
    this.setState({ loading: true, })
    const res = await RNS3.put({ ...file, name: `image-${Date.now()}.png`, uri }, { ...options, keyPrefix: `benefits/${id}/image/` });
    try {
      if (res.status !== 201) {
        Toaster({ type: 'error', title: 'Error al subir tu foto', text: 'Intentalo mas tarde' });
        console.log('error ----<<>', res.body)
        this.dismiss();
      } else {
        setImage(res.body.postResponse.key);
        if (!id) {
          this.dismiss();
          return;
        }
        await benefits.patch(id, { image: res.body.postResponse.key });
        Toaster({ type: 'success', title: 'Foto Actualizada' });
        this.dismiss();
      }
    } catch (error) {
      Toaster({ type: 'error', title: error.message });
      this.setState({ loading: false });
    }
  }
  render() {
    const { photos, loading } = this.state;
    console.log(photos)
    return (
      <View style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 20 }}>
      {
          loading && (
            <View style={{
              width, height, justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 100,
              backgroundColor: 'rgba(255, 255, 255, .7)'
            }}>
              <ActivityIndicator size="large" />
            </View>
          )
        }
        <Text style={{ width: '100%', textAlign: 'center', marginVertical: 20, fontSize: 18 }}>Selecciona una imagen</Text>
        
        <ScrollView style={{ height: height * .75, width: '100%' }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            photos.map((photo, key) => (
              <TouchableOpacity key={key} onPress={() => this.upload(photo)}>
                <View style={{ width: (width - 40) * .25, height: (width - 40) * .25, padding: 1 }}>
                  <Image source={{ uri: photo }} style={{ flex: 1 }} />
                </View>
              </TouchableOpacity>
            ))
          }
        </ScrollView>

        <TouchableOpacity onPress={this.dismiss}>
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#473E69', borderRadius: 6, height: 40, marginBottom: 10 }}>
            <Text style={{ color: 'white' }}>Cancelar</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
 
export default Gallery;