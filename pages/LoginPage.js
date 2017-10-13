'use strict';
import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage
} from 'react-native';

import { Container, Header, Content, Icon, Form, Item, Input, Label, Button, Text, Spinner} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";
import Register from './RegisterPage.js';
import Account from './AccountPage.js';
import firebaseApp from '../components/Firebase.js';

export default class Login extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      loaded: true
    }
  }

  login(){

    this.setState({
      loaded: false
    });

    firebaseApp.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
    .then(() => {
      this.setState({
        error: '',
        loading: true
      });
      AsyncStorage.setItem('@UserData:Email', JSON.stringify(firebaseApp.auth().currentUser.email));
      alert('Login success!')
      alert(firebaseApp.auth().currentUser.email)
      this.setState({
        email: '',
        password: '',
        loaded: true
      });
    })
    .catch((error) => {
      alert(error.message)
      this.setState({
        error: 'Login Failed',
        loading: false
      });
    });

  }

  goToSignup(){
    this.props.navigator.push({
      component: Signup
    });
  }
  render(){
    const {navigate} = this.props.navigation
    return (
      <Container>
      <Header />
       <Content contentContainerStyle={{flex: 1}}>

          <Form>
          <Item floatingLabel>
            <Label>Email Address</Label>
              <Icon active name='ios-flower' />
              <Input
              value = {this.state.email}
              onChangeText={(text) => this.setState({email: text})}/>
            </Item>
            <Item floatingLabel>
              <Icon active name='ios-lock' />
              <Label>Password</Label>
              <Input
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
              secureTextEntry = {true} />
            </Item>
          </Form>

          <Button full style={{marginTop: 30}}
            onPress={this.login.bind(this)}>
            <Text>Login</Text>
          </Button>

          <Button full light style={{marginTop: 10}}
            onPress={() => navigate('Register')}>
            <Text>Register</Text>
          </Button>

        </Content>
        </Container>

    );
  }
}

AppRegistry.registerComponent('Login', () => Login);
