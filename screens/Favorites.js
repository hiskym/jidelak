import { ScrollView, Text, View, ActivityIndicator, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FavoriteArea from '../components/FavoriteArea';
import { usersRef, recipesRef, favoritesRef } from '../firebaseConfig';
import { doc, getDoc, onSnapshot, deleteField, updateDoc, query, where } from 'firebase/firestore';
import { useUserStore } from '../store/UserStore';

export default function Favorites({ navigation }) {

  // const [favorites, setFavorites] = useState(["0DPQ881QkuN1B2mMEbD6", "0DPQ881QkuN1B2mMEbD6"]);

  const {user} = useUserStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setLoading(true);

    const favoritesQuery = query(favoritesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(favoritesQuery, async (querySnapshot) => {
    try {
      
        const favoritesData = [];

        for (const docSnapshot of querySnapshot.docs) {

          const favoriteData = docSnapshot.data();
          const recipeId = favoriteData.recipeId;
          const recipeDocRef = doc(recipesRef, recipeId);
          const recipeDocSnapshot = await getDoc(recipeDocRef);

          if (recipeDocSnapshot.exists()) {
            const { name, image, description } = recipeDocSnapshot.data();
            favoritesData.push({ ...favoriteData, data: {name, image, description} });
          }
        }

        setFavorites(favoritesData)
        setLoading(false)
      }catch (error) {
        console.error('Error fetching favorites and recipes:', error);
        setLoading(false);
      
  }}) 
    
  console.log(favorites)
    return () => unsubscribe;

    
  }, [user.uid])

// testovaci funkce
  const clearFavorites = () => {

    const userDoc = doc(usersRef, user.uid);

    try {
      Alert.alert('Smazat seznam', 'Opravdu chcete smazat oblíbené recepty?', [
        {
          text: 'Zrušit',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'OK',
          onPress: async () => {
            await updateDoc(userDoc, {favorites: deleteField()})
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