import {
    StyleSheet,
    Dimensions
} from 'react-native';

const {
    width,
    height
} = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    content: {
        flex: 2,
        backgroundColor: 'skyblue',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 0.15,
        backgroundColor: 'steelblue',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {

        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 10,
        width: '80%',
        marginTop: '5%'
    },
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        margin: 10,
        borderBottomColor: 'white',
        borderBottomWidth: 1
    },
    SectionStyleError: {
        backgroundColor: 'rgba(248, 215, 218,0.9)',
        borderColor: 'rgb(248, 215, 218)',
    },
    linearGradient: {
        flex: 1,
        width: '100%',
        height: 200,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    headerMerchant: {
        flex: 1,
        width: '100%',
        height: 250,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconPlaceholder: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
    textWhite:{
        color : '#ffffff'
    },
    title: {
        color: 'white',
        fontSize: 18,
        textAlign: 'left',
        marginBottom: '1%',
        marginTop: '1%',
        width: '80%'
    },
    link: {
        color: 'white',
        textDecorationLine: 'underline'
    },
    titleTop: {
        marginTop: 20,
        fontSize: 24,
        color: 'rgba(255,255,255,1)',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {
            width: -1,
            height: 1
        },
        textShadowRadius: 3
    },
    titleMerchant: {
        marginTop: 0,
        fontSize: 24,
        color: 'rgba(255,255,255,1)',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {
            width: -1,
            height: 1
        },
        textShadowRadius: 3
    },
    searchBox: {
        flex : 2,
        flexDirection : 'row',
        height : 20,
        alignItems : 'flex-start',
    },
    TextInputSearch: {
        width: '70%',
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        height : 40,
        

    },
    buttonWhite : {
        backgroundColor : 'rgba(255, 255, 255, 0.4)',
        padding : 4,
        borderRadius: 40/2,
        height : 40,
    },
    buttonBorderWhite : {
        backgroundColor : 'transparent',
        borderRadius: 40/2,
        padding : 5,
        borderWidth : 2,
        borderColor : '#ffffff',
        height : 40,
    },

    iconPlaceholder: {

        marginTop : 15,
        padding: 5,
        height: 25,
        width: 25,
        resizeMode: 'contain',
        alignItems: 'flex-end'

    },
    textWhite : {
        color : 'white'
    },
    textGreen : {
        color : '#50E0B4'
    },
    
    text10 : {
        fontSize : 10
    },
    text12 : {
        fontSize : 12
    },
    text14 : {
        fontSize : 14
    },
    text18 : {
        fontSize : 18
    },
    mt5 : {
        marginTop : 5
    },
    mt10 : {
        marginTop : 10
    },
    mt20 : {
        marginTop : 20
    },
    mb5 : {
        marginBottom : 5
    },
    mb10 : {
        marginBottom : 10
    },
    mb20 : {
        marginBottom : 20
    },
});