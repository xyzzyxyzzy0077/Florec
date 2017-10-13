import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  AsyncStorage
} from 'react-native'

import firebaseApp from './components/Firebase.js'
import Login from './pages/LoginPage.js'
import Register from './pages/RegisterPage.js'
import Account from './pages/AccountPage.js'
import Map from './pages/MapPage.js'

export default class App extends Component<{}> {

  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props)
    this.state = {
      component: null,
      loaded: false
    }
  }

  componentWillMount(){

    AsyncStorage.getItem('user_data').then((user_data_json) => {

      let user_data = JSON.parse(user_data_json);
      let component = {component: Register};
      if(user_data != null){
        firebaseApp.authWithCustomToken(user_data.token, (error, authData) => {
          if(error){
            this.setState(component);
          }else{
            this.setState({component: Account});
          }
        });
      }else{
        this.setState(component);
      }
    });
  }


  render() {
    const {navigate} = this.props.navigation
    if(this.state.component){
      return (
        <App >




        <Navigator
          initialRoute={{component: this.state.component}}
          configureScene={() => {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          renderScene={(route, navigator) => {
            if(route.component){
              return React.createElement(route.component, { navigator });
            }
          }}
        />
      );
    }else{
      return (
        <Map />
      );
    }
  }
}
