import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
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
  Text} from 'native-base';
import MapView from 'react-native-maps'
import ActionButton from '../components/ActionButton';

export default class Map extends Component {

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

  componentWillMount() {
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

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Florec</Title>
          </Body>
        </Header>
        <MapView
          style={styles.map}
          region={this.state.region}
          showsUserLocation = {true}
          followsUserLocation = {true}
          showsMyLocationButton = {true}
        >
          <MapView.Marker
            coordinate={{
              latitude: 31.2295,
              longitude: 121.4728,
            }}
            draggable
          />
        </MapView>
        <Button full onPress={() => this.getAndUpdateLocation()}>
        <Text>Find me!</Text>
        </Button>

        <Footer>
          <FooterTab>
            <Button active>
              <Icon active name="navigate" />
            </Button>
            <Button>
              <Icon name="person" />
            </Button>
          </FooterTab>
        </Footer>

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
})
