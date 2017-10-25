'use strict';
import React, {Component} from 'react';
import {
  Platform,
  AppRegistry,
  Text,
  View,
  Navigator,
  AsyncStorage
} from 'react-native';

import Login from './pages/LoginPage.js'
import Register from './pages/RegisterPage.js'
import Account from './pages/AccountPage.js'
import Main from './pages/MainPage.js'
import { StackNavigator } from 'react-navigation'
import firebaseApp from './components/Firebase.js'

const navigationOptions = {
  header: null
}

let checkSignedIn = function() {
  AsyncStorage.getItem('@UserData:Email',(err, data) => {
    if(err) {
      console.error('Error loading user', err)
      return true
    } else {
      if(data == null){
        return true
      }
      else {
        return false
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
    initialRouteName: checkSignedIn() ? 'Register' : 'Main'
  })

AppRegistry.registerComponent('Florec', () => StackNav);
