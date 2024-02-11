import { ScrollView, Text, View, ActivityIndicator, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteArea from '../components/FavoriteArea';

export default function Favorites({ navigation, favorites, setFavorites }) {

  // const [favorites, setFavorites] = useState([{"data": {"alergens": [Array], "category": [Array], "cook_time": 10, "description": "Míchaná vejce na cibulce s bylinkami na přepuštěném másle.", "diet": [Array], "image": "https://yummyforadam.ca/wp-content/uploads/2020/07/Herby-Scrambled-Eggs-2x3-1-scaled.jpg", "ingredients": [Array], "name": "Míchaná vejce na cibulce", "nutrition": [Array], "prepare_time": "5", "price": "30", "servings": 1, "steps": [Array]}, "id": "0DPQ881QkuN1B2mMEbD6"}]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        console.log(savedFavorites)
        if (savedFavorites !== null) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
      setLoading(false)
    }

    loadFavorites();
  }, []);


  const clearFavorites = () => {
    try {
      Alert.alert('Smazat seznam', 'Opravdu chcete smazat nákupní seznam?', [
        {
          text: 'Zrušit',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('favorites');
            setFavorites([])
          }
        },
      ])
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  return (
    <ScrollView className="flex-1">
      {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />}
      {err && <Text>Chyba při načítání. Zkuste to prosím později.</Text>}
      <FavoriteArea favorites={favorites} navigation={navigation} />

      {/* testovaci tlacitka */}
      <Button title="clear" onPress={() => clearFavorites()} />
      <Button title="console favorites" onPress={() => console.log(favorites.map((favorite) => favorite.data))} />

    </ScrollView>
  )
}