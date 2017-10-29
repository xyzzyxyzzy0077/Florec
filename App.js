'use strict';
import React, {Component} from 'react';
import {
  Platform,
  AppRegistry,
  Text,
  View,
  Navigator,
  AsyncStorage,
} from 'react-native';

import {
  Root
} from 'native-base'

import Login from './pages/LoginPage.js'
import Register from './pages/RegisterPage.js'
import Account from './pages/AccountPage.js'
import Main from './pages/MainPage.js'
import { StackNavigator } from 'react-navigation'
import firebaseApp from './components/Firebase.js'

const navigationOptions = {
  header: null
}

var checkSignedIn = async function() {
  AsyncStorage.getItem('@UserData:Username',(err, data) => {
    if(err) {
      alert(error)
      return false
    } else {
      if(data == null){
        return false
      }
      else {
        return true
      }
    }
  })
}
  const StackNav = StackNavigator({
    Main: {screen: Main},
    Login: {screen: Login},
    Register: {screen: Register},
    Account: {screen: Account}
  },{
    initialRouteName: checkSignedIn() ? 'Main' : 'Login'
  })

  export default () =>
    <Root>
      <StackNav />
    </Root>
