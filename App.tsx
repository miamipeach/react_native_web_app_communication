import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

function App(): JSX.Element {
  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <WebView source={{uri: 'https://w7sr1u.csb.app'}} />
    </SafeAreaView>
  );
}

export default App;
