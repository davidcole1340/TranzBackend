import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Appearance } from 'react-native-appearance';

const scheme = Appearance.getColorScheme()
export const grey = '#7C7C7D'
export const isDark = scheme === 'dark'

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
    flex: 1,
    padding: 10
  },
  spinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  title: {
    color: isDark ? 'white' : 'black',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 6
  },
  text: {
    color: isDark ? 'white' : 'black',
    margin: 6
  }
})

export const Table = StyleSheet.create({
  border: {
    borderColor: isDark ? 'white' : 'black',
    borderWidth: 2
  },
  header: {
    backgroundColor: 'white',
    height: 40
  },
  headerText: {
    ...Page.text,
    color: 'black'
  }
})

export const Title = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  buttonContainer: {
    flex: 1,
    paddingLeft: 20
  }
})

export const List = StyleSheet.create({
  container: {
    padding: 10
  },
  item: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    marginBottom: 4,
    borderColor: isDark ? 'white' : 'black',
    borderWidth: 2,
    borderRadius: 5
  },
  title: {
    ...Page.title,
    fontSize: 15,
    flex: 1,
    flexDirection: 'column'
  },
  text: {
    ...Page.text,
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    backgroundColor: isDark ? 'white' : 'black'
  },
  headerTitle: {
    color: isDark ? 'black' : 'white'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  }
})