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
 *  The LoginForm does the heavy lifting of displaying the fields for
 * textinput and displays the error messages
 */
import LoginForm from '../components/LoginForm'
/**
 *  The country code number picker for iOS library
 */
import PhoneNumberPicker from '../lib/CountryCodePicker/phonenumberpicker'

/**
 * React-native vector icons library
 */
import Icon from 'react-native-vector-icons/Ionicons';

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

import Dimensions from 'Dimensions'
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
        username: this.props.auth.form.fields.username,
        email: this.props.auth.form.fields.email,
        password: this.props.auth.form.fields.password,
        passwordAgain: this.props.auth.form.fields.passwordAgain,
        cca2:"US",
        useEmail:false
      }
    }
  }

  /**
    * Change useEmail state value to true or false
    * to replace phone textinput to email textinput,vica versa
    */
  onLoginMethodPress = () =>  {
     this.setState({
       useEmail: !this.state.useEmail,
     })
  }
  /**
    * Generate login button using react-native-vector-icons
    */
  loginButton = () =>  {
    return (<Icon.Button name="ios-add" backgroundColor="#F0A534" color="#F0A534" iconStyle={{textAlign:'center',height:30}}>
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
   * ### onChange
   *
   * As the user enters keys, this is called for each key stroke.
   * Rather then publish the rules for each of the fields, I find it
   * better to display the rules required as long as the field doesn't
   * meet the requirements.
   * *Note* that the fields are validated by the authReducer
   */
  onChange (value) {
    if (value.username !== '') {
      this.props.actions.onAuthFormFieldChange('username', value.username)
    }
    if (value.email !== '') {
      this.props.actions.onAuthFormFieldChange('email', value.email)
    }
    if (value.password !== '') {
      this.props.actions.onAuthFormFieldChange('password', value.password)
    }
    if (value.passwordAgain !== '') {
      this.props.actions.onAuthFormFieldChange('passwordAgain', value.passwordAgain)
    }
    this.setState(
      {value}
    )
  }
  /**
  *  Get the appropriate message for the current action
  *  @param messageType FORGOT_PASSWORD, or LOGIN, or REGISTER
  *  @param actions the action for the message type
  */
  getMessage (messageType, actions) {
    let forgotPassword =
      <TouchableHighlight
        onPress={() => {
          actions.forgotPasswordState()
          Actions.ForgotPassword()
        }} >
        <Text>{I18n.t('LoginRender.forgot_password')}</Text>
      </TouchableHighlight>

    let alreadyHaveAccount =
      <TouchableHighlight
        onPress={() => {
          actions.loginState()
          Actions.Login()
        }} >
        <Text>{I18n.t('LoginRender.already_have_account')}</Text>
      </TouchableHighlight>

    let register =
      <TouchableHighlight
        onPress={() => {
          actions.registerState()
          Actions.Register()
        }} >
        <Text>{I18n.t('LoginRender.register')}</Text>
      </TouchableHighlight>

    switch (messageType) {
      case FORGOT_PASSWORD:
        return forgotPassword
      case LOGIN:
        return alreadyHaveAccount
      case REGISTER:
        return register
    }
  }
  /**
   * Initialize country code number picker
   */
  PhoneNumberPickerChanged(country, callingCode, phoneNumber) {
    this.setState({countryName: country.name, callingCode: callingCode, phoneNo:phoneNumber,cca2:"US"});
  }
  /**
   * ### render
   * Setup some default presentations and render
   */
  render () {
    var loginButtonText = this.props.loginButtonText
    var onButtonPress = this.props.onButtonPress
    var displayPasswordCheckbox = this.props.displayPasswordCheckbox
    var leftMessageType = this.props.leftMessageType
    var rightMessageType = this.props.rightMessageType

    var passwordCheckbox = <Text />
    let leftMessage = this.getMessage(leftMessageType, this.props.actions)
    let rightMessage = this.getMessage(rightMessageType, this.props.actions)

    let self = this
    let button = this.loginButton();

    let onForgotPasswordPress = () => {
        Actions.ForgotPassword();
    }

    let loginMethod = null;
    let loginMethodText = null;
    const loginWithEmail = this.state.useEmail;
    if(!loginWithEmail){
      loginMethod = <PhoneNumberPicker countryHint={{name: 'United States', cca2: 'US', callingCode:"1"}}
                       onChange={this.PhoneNumberPickerChanged.bind(this)}/>;

      loginMethodText = <View style={{flexDirection:'row',marginTop:20,marginBottom:10}}>
                         <Text style={{fontSize:16}}>Login using </Text><Text style={styles.hyperlinkText} onPress={this.onLoginMethodPress}>Email</Text>
                       </View>;
    }else{
      loginMethod = <View style={styles.textInputStyle}>
                      <TextInput
                        style={[styles.formText,{flex:1}]}
                        placeholder="Email address"/>
                    </View>;

      loginMethodText = <View style={{flexDirection:'row',marginTop:20,marginBottom:10}}>
                         <Text style={{fontSize:16}}>Login using </Text><Text style={styles.hyperlinkText} onPress={this.onLoginMethodPress}>Phone</Text>
                       </View>;
    }
    // display the login / register / change password screens
    this.errorAlert.checkError(this.props.auth.form.error)
    /**
     * The LoginForm is now defined with the required fields.  Just
     * surround it with the Header and the navigation messages
     * Note how the button too is disabled if we're fetching. The
     * header props are mostly for support of Hot reloading.
     * See the docs for Header for more info.
     * code backup
     <FormButton
       isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
       onPress={onButtonPress}
       buttonText={loginButtonText} />
     */

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
                  {loginMethod}
                  <View style={styles.textInputStyle}>
                    <TextInput
                      style={[styles.formText,{flex:1}]}
                      secureTextEntry={true}
                      placeholder="Password"/>
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
