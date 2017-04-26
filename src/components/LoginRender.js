/**
 * # Login.js
 *
 * This class is a little complicated as it handles multiple states.
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * Router actions
 */
import { Actions } from 'react-native-router-flux'
/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../components/ErrorAlert'
/**
 *  The country code number picker for iOS library
 */
import PhoneNumberPicker from '../lib/CountryCodePicker/phonenumberpicker'
/**
 * React-native vector icons library
 */
import Icon from 'react-native-vector-icons/Ionicons';

import Dimensions from 'Dimensions'
/**
 * The necessary React components
 */
import React, {Component} from 'react'
import
{
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  Button
}
from 'react-native'

/**
 *  The fantastic little form library
 */
const t = require('tcomb-form-native')
var _ = require('lodash');
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;

stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;
stylesheet.textboxView.normal.borderRadius = 0;
stylesheet.textboxView.error.borderRadius = 0;
stylesheet.textboxView.normal.borderBottomWidth = 1;
stylesheet.textboxView.normal.borderBottomColor = '#CECED2';
stylesheet.textboxView.error.borderBottomWidth = 1;
stylesheet.textboxView.error.borderBottomColor = '#FFF';
stylesheet.textbox.normal.marginBottom = 5;
stylesheet.textbox.error.marginBottom = 5;

const ssCountryCode = _.cloneDeep(t.form.Form.stylesheet);
ssCountryCode.textboxView.normal.width =50;


var optionsEmail = {
  fields: {
    emailAddress: {
      //label: 'phone number'
      error: 'Insert a valid email address'
    },
    password:{
      secureTextEntry:true
    }
  },
  auto: 'placeholders',
  stylesheet: stylesheet
};

var optionsPhone = {
  fields: {
    countryCode: {
      hidden: true,
    },
    phoneNumber: {
      //label: 'phone number'
      error: 'Insert a valid phone number'
    },
    password:{
      secureTextEntry:true
    }
  },
  auto: 'placeholders',
  stylesheet: stylesheet
};

var Password = t.String;

// if you define a getValidationErrorMessage function, it will be called on validation errors
Password.getValidationErrorMessage = function (value, path, context) {
  if(value.length<6)
  return 'Password length minimum 6 char';
};

var {height, width} = Dimensions.get('window') // Screen dimensions in current orientation

/**
 * The states were interested in
 */
const {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../lib/constants').default

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  headerLayout:{
    marginTop:height*0.05,
    width:width,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center',
  },
  proofnTitle:{
    fontSize:24,
    fontWeight:'bold',
    color:'#F0A534'
  },
  image: {
      width:width*0.9,
      height:height*0.4,
  },
  formText: {
      fontSize:20,
      height:50,
      alignItems:'center',
      color:'black'
  },
  centerComponent:{
    justifyContent:'center',
    alignItems:'center'
  },
  formText:{
    fontSize:20,
    height:60,
    alignItems:'center'
  },
  viewBottomBorder: {
      marginHorizontal:40,
      borderBottomColor: '#CECED2',
      borderBottomWidth: 2,
      marginBottom:10
  },
  hyperlinkText:{
      color:'#F0A534',
      fontSize:16,
      fontWeight:'bold'
  },
  textInputStyle:{
      height:40,width: width-80,
      marginBottom:10,
      borderBottomWidth:1,
      borderBottomColor:'#CECED2'
  }
})

/**
 * ## Redux boilerplate
 */

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
  }
}
/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations

class LoginRender extends Component {
  constructor (props) {
    super(props)
    this.errorAlert = new ErrorAlert()
    this.state = {
      value: {
        phoneNumber: this.props.auth.form.fields.username,
        email: this.props.auth.form.fields.email,
        password: this.props.auth.form.fields.password,
        countryCode:"+1",
      },
      loginWithPhone:true,
      type:this.getType(true),
      options:this.getOptions(true)
    }
  }

  /*
   *  This function is used to set form type when user select different login method
   */
  getType(value){
    if(value){
      return t.struct({
        countryCode: t.maybe(t.String),
        phoneNumber: t.Number,
        password: Password
      });
    }else{
      return t.struct({
        emailAddress: t.Number,
        password: Password
      });
    }
  }

  /*
   * return "option" based on form type
   */
  getOptions(value){
    if(value){
      return optionsPhone;
    }else{
      return optionsEmail;
    }
  }

  /**
    * Action when user press login button
    */
  onPress = () => {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    t.validate(value.password, Password)
    if (value) { // if validation fails, value will be null
      alert(value.phoneNumber+" "+this.state.value.countryCode); // value here is an instance of Person
    }
    var result = t.validate(value.password, Password);
    result.firstError().message;
  }
  /**
    * Generate login button using react-native-vector-icons
    */
  loginButton = () =>  {
    return (<Icon.Button name="ios-add" backgroundColor="#F0A534" color="#F0A534" iconStyle={{textAlign:'center',height:30}} onPress={this.onPress}>
              <Text style={{color:'#fff',marginLeft:width*0.3,fontSize:20}}>Login</Text>
            </Icon.Button>);
  }

  /**
   * ### componentWillReceiveProps
   * As the properties are validated they will be set here.
   */
  componentWillReceiveProps (nextprops) {
    this.setState({
      value: {
        username: nextprops.auth.form.fields.username,
        email: nextprops.auth.form.fields.email,
        password: nextprops.auth.form.fields.password,
        passwordAgain: nextprops.auth.form.fields.passwordAgain
      }
    })
  }
  /**
   * Initialize country code number picker
   */
  PhoneNumberPickerChanged(country, callingCode, phoneNumber) {
    this.setState({
      countryName: country.name,
      callingCode: callingCode,
      phoneNo:phoneNumber,
      cca2:"US",
      value:{
        countryCode:callingCode,
      }
    });
  }
  /**
    * Change Login method state value to true or false
    * to replace phone textinput to email textinput,vica versa
    */
  onLoginMethodPress = () =>  {
     this.setState({
       value:{
          loginWithPhone: !this.state.loginWithPhone,
       },
       type:this.getType(!this.state.loginWithPhone),
       options:this.getOptions(!this.state.loginWithPhone)
     });
  }
  /**
   * ### render
   * Setup some default presentations and render
   */
  render () {
    let self = this
    let button = this.loginButton();

    let onForgotPasswordPress = () => {
        Actions.forgotModal();
    }

    let loginWithPhone = null;
    let loginMethodText = null;

    const loginWithEmail = this.state.loginWithPhone;
    if(loginWithEmail){
      loginWithPhone = <PhoneNumberPicker countryHint={{name: 'United States', cca2: 'US', callingCode:"1"}}
                       onChange={this.PhoneNumberPickerChanged.bind(this)}/>;

      loginMethodText = <View style={{flexDirection:'row',marginTop:20,marginBottom:10}}>
                         <Text style={{fontSize:16}}>Login using </Text><Text style={styles.hyperlinkText} onPress={() => this.onLoginMethodPress()}>Email</Text>
                       </View>;
    }else{
      loginMethodText = <View style={{flexDirection:'row',marginTop:20,marginBottom:10}}>
                         <Text style={{fontSize:16}}>Login using </Text><Text style={styles.hyperlinkText} onPress={() => this.onLoginMethodPress()}>Phone</Text>
                       </View>;
    }



    // display the login / register / change password screens
    this.errorAlert.checkError(this.props.auth.form.error)
    return (
      <View style={styles.container}>
        <ScrollView horizontal={false} width={width} height={height}>
          <View>
            <View style={styles.headerLayout}>
              <Text style={styles.proofnTitle} >
              Proofn
              </Text>
              <Image resizeMode="contain" style = {styles.image}
                source={require("../images/illustration_login.png")}
              />
            </View>

            <View style={styles.centerComponent}>
                 {loginWithPhone}
                 <View style={{width:width-80,marginTop:10}}>
                   <t.form.Form
                     ref="form"
                     value={this.state.value}
                     type={this.state.type}
                     options={this.state.options}
                   />
                 </View>
                 <View style={{width:width-80}}>
                  {button}
                 </View>
                 <View style={[{width:width-80},styles.centerComponent]}>
                      {loginMethodText}
                      <View style={{flexDirection:'row',marginVertical:10}}>
                        <Text style={{fontSize:16}}>Dont' have an account? </Text><Text style={styles.hyperlinkText}>Sign up</Text>
                      </View>
                      <View style={{flexDirection:'row',marginVertical:10}}>
                        <Text style={styles.hyperlinkText} onPress={onForgotPasswordPress}>Forgot password</Text>
                      </View>
                </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
export default connect(null, mapDispatchToProps)(LoginRender)
