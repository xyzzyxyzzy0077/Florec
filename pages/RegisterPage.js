'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  TextInput,
  View
} from 'react-native';

import {
  Container,
  Header,
  Content,
  Icon,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text
} from 'native-base';

import Login from './LoginPage.js';
import firebaseApp from '../components/Firebase.js'

export default class Register extends Component {

  static navigationOptions = {
    title: 'Register!'
  }

  constructor(props){
    super(props);

    this.state = {
      loaded: true,
      email: '',
      password: ''
    };
  }

  signup(){

    this.setState({
      loaded: false
    });

    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      this.setState({
        error: '',
        loading: false
      });
      alert('Account created!');
    })
    .catch((error) => {
      alert(error.message)
      this.setState({
        error: 'Create user failed.',
        loading: false
      });
    });

      this.setState({
        email: '',
        password: '',
        loaded: true
      });

    };


  goToLogin(){
    this.props.navigator.push({
      component: Login
    });
  }

  render() {
    const {navigate} = this.props.navigation
    return (

      <Container>
        <Content>
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
            onPress={this.signup.bind(this)}>
            <Text>Register</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent('Register', () => Register);
