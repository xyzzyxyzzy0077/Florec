import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions
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
  Spinner,
  Toast
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid"
import Register from './RegisterPage.js'
import Account from './AccountPage.js'
import firebaseApp from '../components/Firebase.js'

export default class Login extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false
    }
  }

  isLoading(bool) {
    this.setState({
      loading: bool
    })
  }

  login(){

    this.isLoading(true)

    firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(async () => {
      try {
        await AsyncStorage.setItem('@UserData:Username', firebaseApp.auth().currentUser.displayName)
      } catch (error) {
        Toast.show({
                    text: error,
                    position: 'bottom',
                    buttonText: 'OK',
                    duration: 9000,
                    type: 'danger'
                  })
      }
      this.props.navigation.navigate('Main')
    })
    .catch((error) => {

      Toast.show({
                  text: error.message,
                  position: 'bottom',
                  buttonText: 'OK',
                  duration: 7000,
                  type: 'danger'
                })
      this.isLoading(false)
    })

  }


  render(){
    const {navigate} = this.props.navigation
    return (
      <Container>
       <Content contentContainerStyle={{flex: 1}} style={{padding: 10}}>
       <Grid style={{alignItems: 'center'}}>
        <Row>
          <Image
            source={require('../src/flower.png')}
            style={styles.image}/>
        </Row>
        <Row>
          <Form style={{flex: 1, alignItems: 'center'}}>
          <Item floatingLabel>
            <Label>Email Address</Label>
              <Icon active name='mail' />
              <Input
              value = {this.state.email}
              autoCapitalize = 'none'
              onChangeText={(text) => this.setState({email: text})}/>
            </Item>
            <Item floatingLabel>
              <Icon active name='ios-lock' />
              <Label>Password</Label>
              <Input
              value={this.state.password}
              autoCapitalize = 'none'
              onChangeText={(text) => this.setState({password: text})}
              secureTextEntry = {true} />
            </Item>
          </Form>
        </Row>
        </Grid>

          <Button block
            style={styles.loginButton}
            onPress={this.login.bind(this)}>
            {this.state.loading && <Spinner color = 'white'/>
            || !this.state.loading && <Text>Login</Text>}
          </Button>

          <Button block light
            style={styles.registerButton}
            onPress={() => navigate('Register')}>
            <Text>Register</Text>
          </Button>

        </Content>
        </Container>

    );
  }
}

const styles = StyleSheet.create({

  loginButton: {
    backgroundColor: '#ff5064'
  },
  registerButton: {
    marginTop: 10,
  },
  image: {
    marginTop: Dimensions.get("window").height * 0.1,
    height: Dimensions.get("window").width * 0.4,
    width: Dimensions.get("window").width * 0.4
  }
})

AppRegistry.registerComponent('Login', () => Login);
