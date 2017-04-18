// Copyright (c) 2014-Present All rights reserved.
// The Authors at Excubito Pvt Ltd.

'use strict';

import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
}  from 'react-native';


import { parse, format, asYouType } from 'libphonenumber-js'
/* maps callingCode -> CCA2        */
import CallingCodeToCCA2 from 'libphonenumber-js/metadata.min'

import CountryPicker from './countrypicker'
/* maps CCA2 -> CountryLocalDetails */
import Countries     from './data/data'

import Icon from 'react-native-vector-icons/MaterialIcons';


var styles = StyleSheet.create({
    containerCol: {
        flexDirection: 'column',
        marginVertical:8,
        marginHorizontal:8
    },

    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    viewBottomBorder: {
        marginHorizontal:30,
        borderBottomColor: '#CECED2',
        borderBottomWidth: 1
    },

    TextInputPhoneNumber: {
        fontSize:20,
        height:50,
        alignItems:'center'
    },

    TextCountryName: {
        fontSize:20,
        color:'#5890FF'
    }
});


class PhoneNumberPicker extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
          phoneNo: '',
          country: props.countryHint,
          onChange: props.onChange,
          skipFormatAsYouType: false
      }
   }
   showCountryList = () =>  {
     return (<Icon name="chevron-right" size={30} color="#4F8EF7" onIconClicked={()=> this.countryPicker.openModal()}/>);
   }

    numberChanged(country, callingCode, phoneNumber) {
        callingCode = callingCode + ""
        phoneNumber = phoneNumber + ""
        callingCode = callingCode.replace(/\D/g,'');
        phoneNumber = phoneNumber.replace(/\D/g,'');
        this.state.onChange(country, callingCode, phoneNumber)
    }

    getCountryFromCCA2(cca2) {
        let countryName=""
        let callingCode=""

        do {
            if (cca2.length > 2) {
                cca2 = ""
                break
            }

            for (let i = 0; i < Countries.length; i++) {
                if (Countries[i].code.toUpperCase() == cca2.toUpperCase()) {
                    countryName = Countries[i].name
                    callingCode = Countries[i].dial_code
                    break
                }
            }
        } while (0)

        /* both the name an cc2 should be resoled or none */
        if (countryName.length == 0 || cca2.length == 0 || callingCode.length == 0) {
            countryName = this.state.country.callingCode.length > 0 ? "Invalid country code" : "Choose a country"
            /* reset calling code as countryPicker cannot handle invalid cca2 */
            cca2 = ""
            callingCode = ""
        }

        return {name:countryName,
                cca2:cca2,
                callingCode:callingCode}
    }

    getCountryFromCallingCode(callingCode, phoneNumber) {
        let cca2 = ""
        let countryName = ""

        callingCode = callingCode.replace(/\D/g,'')
        phoneNumber = phoneNumber.replace(/\D/g,'')

        do {
            if (callingCode.length > 4) {
                callingCode = callingCode.slice(0,4)
                break
            }

            if (CallingCodeToCCA2.country_phone_code_to_countries[callingCode] &&
                CallingCodeToCCA2.country_phone_code_to_countries[callingCode][0]) {
                cca2  = CallingCodeToCCA2.country_phone_code_to_countries[callingCode][0]
            }

            let formatter = new asYouType()
            /* may be a multi nation code as AS +1684 or +1242 bahamas try the formatter instead */
            if (cca2.length == 0) {
                formatter.input("+" + callingCode)
                if (formatter.country !== undefined && formatter.country.length == 2) {
                    cca2 = formatter.country
                }
            }

            /* see if the user mistypped +1684 as +168 calling code and 4 as country number */
            if (cca2.length == 0) {
                formatter.input("+" + callingCode + phoneNumber)
                if (formatter.country !== undefined && formatter.country.length == 2) {
                    cca2 = formatter.country
                }
            }

            if (cca2.length) {
                for (let i = 0; i < Countries.length; i++) {
                    if (Countries[i].code.toUpperCase() == cca2.toUpperCase()) {
                        countryName = Countries[i].name
                        callingCode = Countries[i].dial_code.replace(/\D/g,'')
                        break
                    }
                }
            }
        } while (0)

        /* both the name an cc2 should be resoled or none */
        if (countryName.length == 0 || cca2.length == 0) {
            countryName = this.state.country.callingCode.length > 0 ? "Invalid country code" : "Choose a country"
            cca2 = ""
        }

        return {name:countryName,
                cca2:cca2,
                callingCode:callingCode}
    }

    FlagPickedChanged(updatedCountry) {
        if (updatedCountry === undefined) {
            return
        }
        this.setState({country: updatedCountry})
        this.numberChanged(updatedCountry,
                           updatedCountry.callingCode,
                           this.state.phoneNo)
        this.textInputPhoneNumber.focus()
    }

    CallingCodeChanged(updatedCallingCode) {
        let countryFromCallingCode = this.getCountryFromCallingCode(updatedCallingCode, this.state.phoneNo)
        this.setState({country:countryFromCallingCode})
        this.numberChanged(countryFromCallingCode,
                           countryFromCallingCode.callingCode,
                           this.state.phoneNo)
        if (countryFromCallingCode.cca2.length) {
           this.textInputPhoneNumber.focus()
        }
    }

    PhoneChanged(updatedPhoneNo) {
        updatedPhoneNo = updatedPhoneNo.replace(/\D/g,'');
        /*
         * updated state and new state is the same, so this callback
         * must be due to a result of formatting character removal
         * Stop auto formatting for the next render otherwise we will
         * loop as (412) backspace (412 - will be rerendered as (412)
         * by formatter as_you_type()
         */
        let skipFormatAsYouType = updatedPhoneNo == this.state.phoneNo
        /* Also skip format as user is deleting */
        skipFormatAsYouType |= (updatedPhoneNo.length < this.state.phoneNo.length)
        this.setState({skipFormatAsYouType:skipFormatAsYouType})
        this.setState({phoneNo: updatedPhoneNo})

        this.numberChanged(this.state.country,
                           this.state.country.callingCode,
                           updatedPhoneNo)
    }

    componentDidMount() {

        setTimeout(
            () => {
                this.textInputPhoneNumber.focus()},
            100
        );
    }

    SafeRenderCountryPicker(cca2) {
        /*
         * don't render flag for a invalid cca2, this can be passed
         * via props or can dynamically get updated when calling code
         * changes
         */
        let countryPicker
        let countryFromCCA2 = this.getCountryFromCCA2(cca2)
        if (countryFromCCA2.cca2.length == 0) {
            cca2 = 'LS' /* Lesotho :( */
        }
        countryPicker =
            <View style={[styles.viewBottomBorder,styles.containerRow]}>
              <Text style={{flex:1,fontSize:18}}>
                Country
              </Text>
              <TouchableOpacity style={{flexDirection:'row',flex:2}} onPress={()=> this.countryPicker.openModal()}>
                <CountryPicker
                ref={countryPicker => this.countryPicker = countryPicker}
                closeable
                onChange={this.FlagPickedChanged.bind(this)}
                cca2={cca2} translation='eng'/>
                <Text style={[styles.TextCountryName,{flex:3}]}> {countryFromCCA2.name} </Text>
                <View style={{flex:0.5}}>
                  {this.showCountryList()}
                </View>
              </TouchableOpacity>
            </View>
        return (countryPicker)
    }

    PhoneNumberFormatAsYouType() {
        if (this.state.skipFormatAsYouType) {
            return this.state.phoneNo
        }
        return new asYouType(this.state.country.cca2).input(this.state.phoneNo)
    }
  /*
    <TextInput style={[styles.TextInputPhoneNumber, {flex:3, borderBottomWidth:2}]}
    underlineColorAndroid="#CECED2"
    onChangeText={this.CallingCodeChanged.bind(this)}
    value={"+" + this.state.country.callingCode}
    keyboardType="phone-pad"/>
  */
    render() {
        return (
            <View style={styles.containerCol}>
                {this.SafeRenderCountryPicker(this.state.country.cca2)}
                <View style={styles.containerRow}>
                     <View style={[styles.containerRow, styles.viewBottomBorder]}>
                       <Text style={[{flex:3, borderBottomWidth:2,fontSize:20,textAlign:'center'}]}
                       underlineColorAndroid="#CECED2">
                         {"+" + this.state.country.callingCode}
                       </Text>

                       <TextInput style={[styles.TextInputPhoneNumber,{flex:1}]}
                       underlineColorAndroid="#CECED2"
                       editable={false}
                       value={"-"}/>

                       <TextInput style={[styles.TextInputPhoneNumber, {flex:8, borderBottomWidth:2}]}
                       ref={textInputPhoneNumber => this.textInputPhoneNumber = textInputPhoneNumber}
                       underlineColorAndroid="black"
                       onChangeText={this.PhoneChanged.bind(this)}
                       placeholder="  your phone number"
                       value={this.PhoneNumberFormatAsYouType()}
                       autoFocus={true}
                       keyboardType="phone-pad"/>

                    </View>

                </View>
            </View>
        );
    }
}

PhoneNumberPicker.PropTypes = {
    onChange: React.PropTypes.Function,
    countryHint: React.PropTypes.Object,
}

PhoneNumberPicker.defaultProps = {
    countryHint: {name: 'United States', cca2: 'US', callingCode:'1'},
}

export default PhoneNumberPicker
