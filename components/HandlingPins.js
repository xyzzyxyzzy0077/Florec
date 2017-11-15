import firebaseApp from './Firebase.js'
console.ignoredYellowBox = ['Setting a timer for a long period of time']

const markerDatabase = firebaseApp.database().ref('markers')

export const uploadMarker =
  ({
    UID,
    username,
    marker,
    photo,
    title,
    description
  }) =>
  {
    if (UID === null) {
      throw new Error('UID is required');
    }
    console.log(marker)
    return markerDatabase.child(username).push({...marker, UID, username, photo,title, description})
  }

let currentQuery;
let currentCallback;

export const getMarkers = (callback, maxMessages = 10240) => {

  if (!callback) {
    throw new Error('A subscription callback required!');
  }

  if (currentQuery && currentCallback) {
    currentQuery.off('value', currentCallback);
    currentQuery = null;
    currentCallback = null;
  }

  currentQuery = markerDatabase.limitToLast(maxMessages);
  currentCallback = callback;

  currentQuery.on('value', snapshot => {
    const data = snapshot.val()
    console.log(data)
    const markers = []
    for (const UID in data) {
      for (const key in data[UID]){
        const {title, coordinates, timestamp} = data[UID][key]
        markers.push({
          key,
          id: key + UID,
          UID,
          title,
          coordinates,
          timestamp: timestamp ? new Date(timestamp) : new Date(2000, 0, 1)
        })
      }
    }
    callback(markers);
  })
}
