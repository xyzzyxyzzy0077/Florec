import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Dimensions
} from 'react-native';

import {
  Icon,
  Button,
  Footer,
  FooterTab,
  Text,
  StyleProvider
} from 'native-base';

import { TabNavigator } from "react-navigation";

import Map from '../components/Map.js'
import Account from './AccountPage.js'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';



export default ( Main = TabNavigator(
  {
    Map: {screen: Map},
    Account: {screen: Account},
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
       return (

           <StyleProvider style={getTheme(platform)}>
             <Footer style={styles.footer}>
               <FooterTab>
                 <Button
                  active={props.navigationState.index === 0}
                  onPress={() => props.navigation.navigate("Map")}>
                   <Icon active name="compass"/>
                 </Button>
                 <Button
                  active={props.navigationState.index === 1}
                  onPress={() => props.navigation.navigate("Account")}>
                   <Icon name="person" />
                 </Button>
               </FooterTab>
             </Footer>
           </StyleProvider>

       )
   }
  }
))

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  footer: {
    height: Dimensions.get("window").height * 0.06,
    backgroundColor: '#f2ffe7'
  },
})
