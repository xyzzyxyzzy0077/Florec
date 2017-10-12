import { AppRegistry } from 'react-native';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import LoginForm from './components/Login/LoginForm.js'

export default class App extends Component<{}> {

  constructor(props){
    super(props)
  }

  render() {
    return(
        <LoginForm/>
    )
  }
}
