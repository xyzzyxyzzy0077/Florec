'use strict';
import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  AsyncStorage
} from 'react-native';

import {
  Container,
  Header,
  Content,
  Icon,
  Button,
  Text,
} from 'native-base';

import login from './LoginPage.js';

import firebaseApp from '../components/Firebase.js';

export default class Account extends Component {

  constructor(props){

    super(props);
    this.state = {
      loaded: false,
    }
  }

  render(){

    return (
      <Container>
        <Text> TODO: Profile Page</Text>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  email_container: {
    padding: 20
  },
  email_text: {
    fontSize: 18
  }
});
