/**
 * # app.js
 *  Display startup screen and
 *  getSessionTokenAtStartup which will navigate upon completion
 *
 *
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * Project actions
 */
import * as authActions from '../reducers/auth/authActions'
import * as deviceActions from '../reducers/device/deviceActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * The components we need from ReactNative
 */
import React,{Component} from 'react'
import {StyleSheet, View, Dimensions,Button, Image, Text} from 'react-native';

/**
 * The components we need from other library
 */
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * The Header will display a Image and support Hot Loading
 */
import type { ViewPagerScrollState } from 'ViewPagerAndroid';
var PAGES = 4;
var BGCOLOR = '#ffffff';
var IMAGE_URIS = [
  require("../images/tour/guide1.png"),
  require("../images/tour/guide2.png"),
  require("../images/tour/guide3.png"),
  require("../images/tour/guide4.png")
];
var TOUR_TEXT=[
  "Welcome to Proofn Messages",
  "Improve Your Future",
  "Build Stronger Connection",
  "Always Notified"
]

var TOUR_DETAIL=[
  "Proofn help convey your exact thoughts",
  "Change what you have said, sent, and attached. Re-do the past to improve your future",
  "Richer hence useful client information right from your contact. Topics to follow, to avoid, and client's birthday reminder",
  "Peek your notes and client information easily when composing message"
]

/**
 *  Save that state
 */
function mapStateToProps (state) {
  return {
    deviceVersion: state.device.version,
    auth: {
      form: {
        isFetching: state.auth.form.isFetching
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
}

/**
 * Generate arrow icon for tour
 */

class NextArrow extends React.Component {
  render() {
    return (<Icon name="keyboard-arrow-right" size={30} color="#000000" />);
  }
}
/**
 * Bind all the actions from authActions, deviceActions and globalActions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...deviceActions, ...globalActions }, dispatch)
  }
}

/**
 * ## App class
 */
var reactMixin = require('react-mixin')
import TimerMixin from 'react-timer-mixin'
/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations


/**
 * ProofnTour Class
 */

export class ProofnTour extends Component {
    render() {
        var pages = [];
         for (var i = 0; i < PAGES; i++) {
           var pageStyle = {

           };
           pages.push(
             <View key={i} style={styles.pageStyle} collapsable={false}>
             <Text style={styles.emptySpace}>

             </Text>
               <Image resizeMode="contain" style = {styles.image}
                 source={IMAGE_URIS[i]}
               />
             <Text style={styles.tourText}>
                   {TOUR_TEXT[i]}
             </Text>
             <Text style={styles.detailText}>
                   {TOUR_DETAIL[i]}
             </Text>

            </View>
           );
         }
        return (
            <View>
                <View style={styles.buttonLayout}>
                  <Text style={styles.buttonStyle,{marginLeft:24}}>
                        SKIP
                  </Text>
                  <View style={styles.buttonStyle,{marginRight:24}}>
                    <NextArrow/>
                  </View>


                </View>
                <IndicatorViewPager
                    style={styles.IndicatorStyle}
                    indicator={this._renderDotIndicator()}
                >
                {pages}
                </IndicatorViewPager>

            </View>

        );
    }

    _renderDotIndicator() {
        return <PagerDotIndicator
                dotStyle={styles.dotStyle}
                selectedDotStyle={styles.selectedDotStyle}
                pageCount={4}
                />;
    }
}
/**
  * Button Actions
  */
const onButtonPress = () => {
  Alert.alert('Button has been pressed!');
};

/**
 * ViewPager Image and Text Styles
 */
 var {height, width} = Dimensions.get('window');

 const styles = StyleSheet.create({
     container: {
         flex: 1,
         flexDirection: "row",
         alignItems: "center",
         justifyContent: "space-between"
     },
     tourText: {
        fontSize: 24,
        color:'#F0A534',
        marginTop:30,
        height:40,
        textAlign: 'center'
     },
     detailText: {
        flex:1,
        textAlign: 'center',
        flexWrap: "wrap",
        marginLeft:16,
        marginRight:16
     },
     image: {
         width:width*0.8,
         height:height*0.3,
     },
     pageStyle:{
       backgroundColor: BGCOLOR,
       height:height,
       flexDirection: "column",
       justifyContent: 'center',
       alignItems: 'center',
     },
     IndicatorStyle:{
       height:height,
       zIndex:0,
     },
     emptySpace:{
       flex:1,
     },
     dotStyle:{
       height:15,
       width:15,
       marginRight:10,
       backgroundColor:'#A3A3A3',
       borderRadius: 50,
       marginBottom:40,
     },
     selectedDotStyle:{
       height:15,
       width:15,
       marginRight:10,
       backgroundColor:'#F0A534',
       borderRadius: 50,
       marginBottom:40,

     },
     buttonLayout:{
       zIndex:1,
       marginTop:(height*0.9),
       flexDirection:'row',
       height:30,
       width:width,
       justifyContent: 'space-between',
       alignItems:'center',
       backgroundColor:"transparent",
       position:'absolute'
     },
     buttonStyle:{
       color:'#000000',
       fontSize:20
     },
     skipButton:{
       zIndex:2
     }
 });


/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(ProofnTour)
