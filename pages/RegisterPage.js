'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage
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
  Text,
  Picker
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";

import Login from './LoginPage.js';
import firebaseApp from '../components/Firebase.js'

export default class Register extends Component {

  static navigationOptions = {
    title: 'Register'
  }

  constructor(props){
    super(props);

    this.state = {
      loaded: true,
      email: '',
      password: '',
      gender: '',
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

  onValueChange(value: string) {
    this.setState({
      gender: value
    })
  }

  render() {
    const {navigate} = this.props.navigation
    return (

      <Container>
        <Content contentContainerStyle={{flex: 1}} style={{padding: 10}}>
        <Grid style={{alignItems: 'center'}}>
         <Row>
          <Form style={{flex: 1}}>
          <Item>
          <Icon active name='contacts' />
          <Label>Gender</Label>
            <Picker
              mode="dropdown"
              placeholder="Please select"
              selectedValue={this.state.gender}
              onValueChange={this.onValueChange.bind(this)}>
              <Item label="Male" value="key0" />
              <Item label="Female" value="key1" />
            </Picker>
          </Item>
            <Item>
              <Icon active name='ios-flower' />
              <Input
                placeholder='Email'
                value = {this.state.email}
                onChangeText={(text) => this.setState({email: text})}/>
            </Item>
            <Item>
              <Icon active name='ios-lock' />
              <Input
              placeholder='Password'
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
              secureTextEntry = {true} />
            </Item>
          </Form>
          </Row>
          </Grid>

          <Button block
            style={{marginTop: 30}}
            onPress={this.signup.bind(this)}>
            <Text>OK</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent('Register', () => Register);
