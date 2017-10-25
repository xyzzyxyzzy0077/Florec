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
import MapView from 'react-native-maps'
import Map from '../components/Map.js'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

export default class Main extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0048,
      },
    }
  }

  componentDidMount() {
    this.getAndUpdateLocation()
  }

  getAndUpdateLocation() {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        const region = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0048,
        };

        this.setState({
          region
        });
      },
      (err) => {
        console.log('err', err);
      },
      {}
    );
  }

  onRegionChangeComplete(region) {
    this.setState({ region });
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
  map: {
    flex:1
  },
  locateButton: {
    position: 'absolute',
    bottom: Dimensions.get("window").height * 0.11,
    right: Dimensions.get("window").height * 0.05,
    height: 53,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  footer: {
    height: Dimensions.get("window").height * 0.06,
    backgroundColor: '#f2ffe7'
  },
  compassIcon: {

  }
})
