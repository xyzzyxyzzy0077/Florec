import React, { Component } from 'react';
import { Container, Header,  Content, Icon, Form, Item, Input, Label, Button, Text, Spinner} from 'native-base';

import firebaseApp from './Firebase.js'

export default class LoginForm extends Component {

    state = { email: '', password: '', error: '', loading: false};

  onLoginPress() {
    this.setState({
      error: '',
      loading: true
    });
    const { email, password } = this.state;
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          error: '',
          loading: false
        });
      })
      .catch(() => {
        //Login was not successful, let's create a new account
        firebaseApp.auth().createUserWithEmailAndPassword(email, password)
          .then(() => {
            this.setState({
              error: '',
              loading: false
            });
            alert('Account created!');
          })
          .catch(() => {
            this.setState({
              error: 'Authentication failed.',
              loading: false
            });
            alert('Login Failed. Please try again');
          });
      });
  }
  renderButtonOrSpinner() {
    if (this.state.loading) {
      return <Spinner /> ;
    }
    return <Button full onPress = {this.onLoginPress.bind(this)} title = "Log in" /> ;
  }

  render() {
    return (
      <Container>
      <Header />
        <Content>
        {this.renderButtonOrSpinner()}
          <Form>
            <Item floatingLabel>
              <Icon active name='ios-flower' />
              <Label>Username</Label>
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
          <Button full style={{marginTop: 30}}>
            <Text>Login</Text>
          </Button>
          <Button full light style={{marginTop: 10}}>
            <Text>Register</Text>
          </Button>

        </Content>

      </Container>
    );
  }
}
