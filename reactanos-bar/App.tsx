import { Provider } from 'react-redux';
import generateStore from './src/redux/store';
import InitApp from './src/InitApp';
import FlashMessage from 'react-native-flash-message';
import {NativeBaseProvider} from 'native-base';
import { ImageBackground, LogBox } from 'react-native';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import AnimatedLottieView from 'lottie-react-native';
import store from './src/redux/store';

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

  useEffect(() => {
    setTimeout(() => {
      setLottieLoad(true)
    }, 4000);
  }, [])
  
  if(!lottieLoad){
    return (
    <ImageBackground style={{height:'100%', width:'100%'}} source={require('./assets/splashWithoutLogo.png')}>
      <AnimatedLottieView
        autoPlay
        source={require('./assets/icon.json')}
        />
    </ImageBackground>)
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