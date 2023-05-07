import React, {useRef} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

function App(): JSX.Element {
  const webview = useRef<WebView>(null);

  const eventList: {[key: string]: (value: unknown) => void} = {};

  const sendEvent = (result: number, key: string) => {
    webview.current?.injectJavaScript(`
      window.receiveFromNative(${result}, '${key}');
      true;
    `);
  };

  function callNative() {
    webEvent('add2', 21, 21).then(result => {
      console.log(`callNative result: ${result}`); // 42
    });
  }

  function webEvent(key: string, num1: number, num2: number) {
    webview.current?.injectJavaScript(`
      window.receiveFromNativeRequest(${num1},${num2},'${key}');
      true;
    `);

    return new Promise(resolve => {
      eventList[key] = resolve;
    });
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <Button title="Send To Web" onPress={() => sendEvent(123, 'World')} />
      <Button title={'send to web add2 event'} onPress={() => callNative()} />
      <WebView
        source={{uri: 'https://w7sr1u.csb.app'}}
        ref={webview}
        applicationNameForUserAgent="MyDcode"
        pullToRefreshEnabled={true}
        onMessage={message => {
          const {data, key} = JSON.parse(message.nativeEvent.data);

          if (eventList[key]) {
            eventList[key](data);
            return;
          }

          setTimeout(() => {
            if (key === 'add') {
              sendEvent(parseInt(data.num1) + parseInt(data.num2), key);
              return;
            }

            sendEvent(data.length, key); // 2초 후 data의 길이를
          }, 2000);
        }}
      />
    </SafeAreaView>
  );
}

export default App;
