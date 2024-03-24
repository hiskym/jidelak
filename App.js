import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Root from './navigations/Root';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'
import AppNavigation from './navigations/AppNavigation';
import { FIREBASE_AUTH } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './store/UserStore';


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

  const { setUser } = useUserStore();

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user)
      setUser(user)
    })
  }, [])

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

  if (!appIsReady) {
    return (<ActivityIndicator size="large" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />)
  }
  return (
    <View className="flex-1" onLayout={onLayoutRootView}>
      <AppNavigation />
    </View>
  )
}
