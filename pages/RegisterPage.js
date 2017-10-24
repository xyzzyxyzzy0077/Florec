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
import DatePicker from 'react-native-datepicker'

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
      dob: this.props.date
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

            <Item style={{height: 55, flexDirection: 'row', paddingRight: 14}}>
              <Icon active name='contacts' />
              <Label style={{flex: 1}}>Gender</Label>
                <Picker
                  style={{flex: 1}}
                  mode="dropdown"
                  placeholder="Please select"
                  selectedValue={this.state.gender}
                  onValueChange={this.onValueChange.bind(this)}>
                  <Item label="Male" value="key0" />
                  <Item label="Female" value="key1" />
                </Picker>
            </Item>

            <Item style={{height: 55, flexDirection: 'row'}}>
              <Icon active name='calendar' />
              <Label style={{flex: 1}}>Birthday</Label>
              <DatePicker
                style={{flex: 1, justifyContent: 'flex-start'}}
                customStyles={{
                  dateInput:{borderWidth: 0},
                  dateText:{fontSize: 16},
                  placeholderText:{fontSize:16, color:'rgb(170,170,170)'}
                }}
                date={this.state.dob}
                mode="date"
                placeholder="Please select"
                format="DD-MM-YYYY"
                minDate="01-01-1900"
                maxDate="31-12-2016"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(date) => {this.setState({dob: date})}}/>
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
