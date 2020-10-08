import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

export const Map = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export const Page = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 6,
    flex: 1
  },
  spinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 6
  },
  text: {
    margin: 6
  }
})

export const Table = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderColor: '#000000'
  },
  header: {
    height: 40,
    backgroundColor: '#ffffff'
  }
})