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
import Map from './pages/MapPage.js'
import { StackNavigator } from 'react-navigation'

var test

export default class Florec extends Component<{}> {

  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props)
    this.state = {
      component: null,
      loaded: false
    }
    test = this.state.component
  }

  componentWillMount(){

    AsyncStorage.getItem('user_data').then((user_data_json) => {

      let user_data = JSON.parse(user_data_json);
      let component = {component: Register};
      if(user_data != null){
        firebaseApp.authWithCustomToken(user_data.token, (error, authData) => {
          if(error){
            this.setState(component);
            test = this.state.component
          }else{
            this.setState({component: Account});
            test = this.state.component
          }
        });
      }else{
        this.setState(component);
        test = this.state.component
      }
    });
  }

}

  const StackNav = StackNavigator({
    Register: {screen: Register},
    Main: {screen: Map},
  },{
    initialRouteName: test != Register ? 'Register':'Main'
  })

AppRegistry.registerComponent('Florec', () => Florec);
