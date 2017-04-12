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
import {StyleSheet, View, Dimensions, Image, Text} from 'react-native';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
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
               <Image resizeMode = 'cover' style = {styles.image}
                 source={IMAGE_URIS[i]}
               />
             <Text style={styles.tourText}>
                 Example of centered text
             </Text>
             <Text style={styles.detailText}>
                   Example of centered text
             </Text>
            </View>
           );
         }
        return (
            <View style={{flex:1}}>
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
        return <PagerDotIndicator  pageCount={4} />;
    }
}
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
         marginLeft: 20,
     },
     detailText: {
         marginLeft: 20,
     },
     image: {
         marginRight: 20,
         width:width*0.5,
         height: height*0.4,
         flex: 1,
     },
     pageStyle:{
       backgroundColor: BGCOLOR,
       flex: 1,
       flexDirection: "column",
       justifyContent: "space-between"
     },
     IndicatorStyle:{
       height:height,
     }
 });


/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(ProofnTour)
