import { Provider } from 'react-redux';
import generateStore from './src/redux/store';
import InitApp from './src/InitApp';
import FlashMessage from 'react-native-flash-message';
import {NativeBaseProvider} from 'native-base';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';

const ignoreWarns = [
  "Setting a timer for a long period of time",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  "AsyncStorage has been extracted from react-native",
  "EventEmitter.removeListener",
  "Non-serializable values were found in the navigation state. Check:",
  "Found screens with the same name nested inside one another. Check:",
  "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle."
];

const warn = console.warn;
console.warn = (...arg) => {
  for (let i = 0; i < ignoreWarns.length; i++) {
      if (arg[0].startsWith(ignoreWarns[i]))  return;
  }
  warn(...arg);
};

LogBox.ignoreLogs(ignoreWarns);

export default function App() {
  const [lottieLoad, setLottieLoad] = React.useState(false);
  const store = generateStore();

  useEffect(() => {
    setTimeout(() => {
      setLottieLoad(true)
    }, 4000);
  }, [])
  
  if (!lottieLoad) {
    return (
      <LottieView
        autoPlay
        style={styles.splash}
        source={require('./assets/icon.json')}
      />)
  }

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <FlashMessage position="top" />
        <InitApp />
      </NativeBaseProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splash: {    
    backgroundColor: '#fff',    
  },
});