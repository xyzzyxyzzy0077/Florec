import * as firebase from 'firebase'
import {
  FireBase_API_KEY,
  FireBase_AUTH_DOMAIN,
  FireBase_DATABASE_URL,
  FireBase_STORAGE_BUCKET
} from 'react-native-dotenv'

const firebaseConfig = {
  apiKey: FireBase_API_KEY,
  authDomain: FireBase_AUTH_DOMAIN,
  databaseURL: FireBase_DATABASE_URL,
  storageBucket: FireBase_STORAGE_BUCKET,
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

module.exports = firebaseApp
