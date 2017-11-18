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
import UploadMarker from './pages/UploadMarkerPage.js'
import Detail from './pages/DetailPage.js'
import MyUploads from './pages/MyUploadsPage.js'
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
    Account: {screen: Account},
    UploadMarker: {screen: UploadMarker},
    Detail: {screen: Detail},
    MyUploads: {screen: MyUploads}
  },{
    headerMode: 'screen',
    initialRouteName: checkSignedIn() ? 'Account' : 'Login'
  })

  export default () =>
    <Root>
      <StackNav />
    </Root>
