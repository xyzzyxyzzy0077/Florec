'use strict';
import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Image,
  AsyncStorage,
  Dimensions
} from 'react-native';

import {
  Container,
  Header,
  Content,
  Icon,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";


import login from './LoginPage.js';

import firebaseApp from '../components/Firebase.js';

export default class Account extends Component {

    static navigationOptions = {
      headerTitle: 'You'
  }


  constructor(props){

    super(props);
    this.state = {
      user: {
        nickname: '',
        email: '',
        gender: ''
      },
      loaded: false,
    }
  }

  render(){

    return (
      <Container>
        <Content contentContainerStyle={{flex: 1}}>


          <List style={{flex: 1}}>
            <ListItem style={styles.listItem}>
                <Thumbnail large source={{ uri: 'https://img3.doubanio.com/icon/ul34286196-36.jpg' }} />
              <Body>
                <Text>Username</Text>
                <Text note>Tap your profile picture to change</Text>
              </Body>
            </ListItem>
            <ListItem icon style={styles.listItem}>
              <Left>
                <Icon name='mail' />
              </Left>
              <Body>
                <Text>Change Email address</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem itemDivider/>

            <ListItem icon style={styles.listItem}>
              <Left>
                <Icon name='cloud-upload' />
              </Left>
            <Body>
              <Text>My Uploads</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
            </ListItem>

          </List>

          <Button full danger style={styles.logoutButton}>
            <Text>Log out</Text>
          </Button>
          </Content>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
    paddingLeft: 15
  },
  logoutButton: {
    marginBottom: Dimensions.get("window").height * 0.05
  }
});
