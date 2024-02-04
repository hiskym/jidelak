import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Root from './navigations/Root';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();

const getFonts = () => Font.loadAsync({
  'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
  'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
  'nunito-light': require('./assets/fonts/Nunito-Light.ttf'),
  'nunito-medium': require('./assets/fonts/Nunito-Medium.ttf'),
  'nunito-semibold': require('./assets/fonts/Nunito-SemiBold.ttf')
})

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);


  useEffect(() => {
    async function prepare() {
      try {
        await getFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady){
    return (<ActivityIndicator size="large" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />)
  }
  return (
    <View className="flex-1" onLayout={onLayoutRootView}>
      <Root />
    </View>
  )
}
