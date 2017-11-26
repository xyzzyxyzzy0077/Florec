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

var checkSignedIn = async () => {
  AsyncStorage.getItem('@UserData:Username',(err, data) => {
    if(err) {
      console.log('err is ', err)
      alert(error)
      return false
    } else {
      console.log('data is ', data)
      if(data == null){
        console.log('gonna return false')
        return false
      }
      else {
        console.log('gonna return true')
        return true
      }
    }
  })
}
  const StackNav = StackNavigator({
    Login: {screen: Login},
    Main: {screen: Main},
    Register: {screen: Register},
    Account: {screen: Account},
    UploadMarker: {screen: UploadMarker},
    Detail: {screen: Detail},
    MyUploads: {screen: MyUploads}
  },{
    headerMode: 'screen',
    initialRouteName: (!checkSignedIn()) ? 'Main' : 'Login'
  })

  export default () =>
    <Root>
      <StackNav />
    </Root>
