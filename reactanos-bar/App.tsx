import { Provider } from 'react-redux';
import generateStore from './src/redux/store';
import InitApp from './src/InitApp';
import FlashMessage from 'react-native-flash-message';
import {NativeBaseProvider} from 'native-base';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function App() {
  const store = generateStore();
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <FlashMessage position="top" />
        <InitApp />
      </NativeBaseProvider>
    </Provider>
  );
}