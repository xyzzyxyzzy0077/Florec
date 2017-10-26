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
  Picker,
  ActionSheet
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'

import Login from './LoginPage.js';
import firebaseApp from '../components/Firebase.js'
import AvatarUpload from '../components/AvatarUpload.js'

var BUTTONS = ['Male', 'Female', 'Cancel']
var CANCEL_INDEX = 2

export default class Register extends Component {

  static navigationOptions = {
    title: 'Register',
    headerBackTitleStyle: {color: 'black',},
    headerTintColor: 'black',
  }

  constructor(props){
    super(props);

    this.state = {
      user: {
        email: '',
        password: '',
        gender: 'Please select',
        dob: this.props.date,
        nickname: ''
      },
      app: {
        err: '',
        loaded: true,
      }
  }
}

  signup(){

    this.setState({
      app: {
        ...this.state.app,
        loaded: false
    }})

    firebaseApp.auth().createUserWithEmailAndPassword(this.state.user.email, this.state.user.password)
    .then(() => {
      this.setState({
        app: {
          ...this.state.app,
          error: '',
          loading: false
      }});
      alert('Account created!');
    })
    .catch((error) => {
      alert(error.message)
      this.setState({
        app: {
          ...this.state.app,
          error: 'Create user failed.',
          loading: false
      }});
    });

      this.setState({
        user: {
          ...this.state.user,
          password: '',
        },
        app: {
          ...this.state.app,
          loaded: true,
        }
    });

  };


  render() {
    const {navigate} = this.props.navigation
    return (

      <Container>
        <Content contentContainerStyle={{flex: 1}} style={{padding: 10}}>
        <Grid style={{alignItems: 'center'}}>
         <Row>
          <Form style={{flex: 1}}>

            <Item style={{padding: 10}}>
              <AvatarUpload />
            </Item>

            <Item style={{height: 55, flexDirection: 'row', paddingRight: 14}}>
              <Icon active name='contacts' />
              <Label style={{flex: 1}}>Gender</Label>
              <Label style={{color: '#aaaaaa', fontSize: 16, marginRight: 10}}
                onPress={() =>
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                  },
                  buttonIndex => {
                    if(buttonIndex!=2){
                      this.setState({
                      user: {
                        ...this.state.user,
                        gender: BUTTONS[buttonIndex]
                      }})
                    }
                  }
                )}>
                {this.state.user.gender}
              </Label>
            </Item>

            <Item style={{height: 55, flexDirection: 'row'}}>
              <Icon active name='calendar' />
              <Label style={{flex: 1}}>Birthday</Label>
              <DatePicker
                style={{flex: 1, justifyContent: 'flex-start'}}
                customStyles={{
                  dateInput:{borderWidth: 0},
                  dateText:{fontSize: 16},
                  placeholderText:{fontSize:16, color:'#aaaaaa'}
                }}
                date={this.state.user.dob}
                mode="date"
                placeholder="Please select"
                format="DD-MM-YYYY"
                minDate="01-01-1900"
                maxDate="31-12-2016"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={
                  (date) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        dob: date
                      }
                    })
                  }
                }/>
            </Item>


            <Item>
              <Icon active name='mail' />
              <Input
                placeholder='Email'
                value = {this.state.user.email}
                onChangeText={
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      email: text
                    }
                  })
                }/>
            </Item>

            <Item>
              <Icon active name='happy' />
              <Input
                placeholder='Nickname'
                value = {this.state.user.nickname}
                onChangeText={
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      nickname: text
                    }
                  })
                }/>
            </Item>

            <Item>
              <Icon active name='ios-lock' />
              <Input
                placeholder='Password'
                value={this.state.user.password}
                onChangeText={
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      password: text
                    }
                  })
                }
                secureTextEntry = {true} />
            </Item>
          </Form>
          </Row>
          </Grid>

          <Button block
            style={styles.OKbutton}
            onPress={this.signup.bind(this)}>
            <Text>OK</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  OKbutton: {
    backgroundColor: '#7acc31'
  }
})

AppRegistry.registerComponent('Register', () => Register);
