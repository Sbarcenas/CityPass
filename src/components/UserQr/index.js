import React from 'react';
import { 
  View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { QRCode } from 'react-native-custom-qr-codes';
import * as Progress from 'react-native-progress';
import Avatar from '../../components/Avatar';
import { Navigation } from 'react-native-navigation';
import {getAvatarPhoto} from '../../utils/S3Photos';

const { width, height } = Dimensions.get('window');
const TICKET_HEIGHT = height * .75;
const TICKET_WIDTH = width * .85;

const RedeemBenefit = ({ user = {}, componentId }) => {
  console.log('QR CODE USER', user)
  const { membership = {} } = user;
  const avatar = (user.avatar == null) ? '' : user.avatar;
  const isPrime = membership.id == 2;
  const dismiss = () => {
    Navigation.dismissOverlay(componentId);
  }
  return (
    <TouchableWithoutFeedback style={[styles.fill]} onPress={dismiss}>
      <View
        colors={['#473E69', '#249EC7']}
        style={[styles.fill, styles.center, { backgroundColor: 'rgba(0, 0, 0, .5)' }]}      
      >
        <View style={styles.container}>
          <View style={styles.avatar}>
            <View style={{ height: 80, width: 80, borderRadius: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar image={getAvatarPhoto(avatar, true)} style={{ flex: 1, resizeMode: 'cover' }} />
            </View>
          </View>
          <View style={[styles.ticketTop, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            {
              user.token && (
                <QRCode
                  content={`US-${user.token}`}
                  size={180}
                />
              )
            }
          </View>
          <View style={{ flex: .6 }}>
            <Image
              source={require('../../assets/img/ticketBGP.png')}
              style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
            />
          </View>
          <View style={[styles.ticketBottom, { borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: -5 }]}>
            <Text style={[{ fontSize: 20, color: '#727272' }, { fontFamily: 'Poppins-Light'}]}>
              {`${user.first_name} ${user.last_name}`}
            </Text>
            {
              isPrime ? (
                <View style={{ flexDirection: 'row', width: width * .75 , justifyContent: 'space-around', marginTop: 20 }}>
                  <View>
                    <Text style={[{ fontSize: 12, color: '#727272' }, { fontFamily: 'Poppins-Light'}]}>
                      Eres usuario {` ${membership.name}`}
                    </Text>
                  </View>
                </View> 
              ) : (
                <View style={{ flexDirection: 'row', width: width * .75 , justifyContent: 'space-around', marginTop: 20 }}>
                  <View>
                    {/* <Progress.Bar progress={progress} width={110} height={12} color="#6D56DB" borderRadius={100} /> */}
                    <Text style={[{ fontSize: 12, color: '#727272' }, { fontFamily: 'Poppins-Light'}]}>{user.points} puntos</Text>
                  </View>
                </View>
              )
            }
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80
  },
  container: {
    width: TICKET_WIDTH,
    height: TICKET_HEIGHT,
    // backgroundColor: 'rgba(0, 0, 0, .1)',
    position: 'relative',
    paddingTop: 47,
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    position: 'absolute',
    width: TICKET_WIDTH,
    alignItems: 'center',
    zIndex: 10,
  },
  ticketTop: {
    flex: 1.7,
    backgroundColor: 'white',
    borderRadius: 6,
    paddingTop: 50,
    alignItems: 'center',
  },
  ticketBottom: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 20,
  },
  ticketName: {
    width: '100%',
    paddingHorizontal: 30,
  },
  ticketNameText: {
    width: '80%',
    color: '#7C7C7C',
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 20,
  },
  ticketBrief: {
    marginVertical: 20,
    width: '100%',
    flexDirection: 'row',
  },
  ticketBriefPart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupIcon: {
    tintColor: '#F8C270',
    marginRight: 5,
  },
  groupText: {
    width: 80,
    fontSize: 11,
    color: '#727272',
  },
  expiresIn: {
    fontSize: 11,
    color: '#727272',
  },
  ticketDisponibility: {
    color: '#F8C270'
  },
  dividerCont: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: 'white',
    tintColor: '#8E2EDA',
  },
  redeemButton: {
    marginHorizontal: 'auto',
    width: '80%',
    height: 40,
    backgroundColor: '#F7C36F',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 18,
  },
  bodyDestails: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  bodyDestailsTitle: {
    color: 'dimgrey',
    marginBottom: 6,
    fontSize: 15,
  },
  bodyDestailsDesc: {
    color: '#7C7C7C',
  },
  alignCenter: {
    alignItems: 'center',
  },
  benefitIcon: {
    height: 60,
    width: 60,
    resizeMode: 'contain'
  },
});

const mapState = state => state;
export default connect(mapState)(RedeemBenefit);