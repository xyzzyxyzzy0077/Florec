import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import {
  Container,
  Body,
  Title,
  Header,
  Content,
  Icon,
  Button,
  Footer,
  FooterTab,
  Text,
  StyleProvider
} from 'native-base';

import Map from '../components/Map.js'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

export default class Main extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Container style={styles.container}>

        <Map/>

        <StyleProvider style={getTheme(platform)}>
          <Footer style={styles.footer}>
            <FooterTab>
              <Button active>
                <Icon outline active name="compass"
                  style={styles.compassIcon}/>
              </Button>
              <Button>
                <Icon name="person" />
              </Button>
            </FooterTab>
          </Footer>
        </StyleProvider>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  footer: {
    height: Dimensions.get("window").height * 0.06,
    backgroundColor: '#f2ffe7'
  },
  compassIcon: {

  }
})
