import { View, Button, Text, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
// import SearchBar from '../components/SearchBar'
import RecipeArea from '../components/RecipeArea'
import { recipesRef } from '../firebaseConfig'
import { getDocs } from 'firebase/firestore'
import { ScrollView } from 'react-native'
import { SearchBar } from '@rneui/themed';

// getAllRecipes();

export default function Recipes({navigation}) {

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const updateSearch = (search) => {
    // e.preventDefault();
    setSearch(search);
  };

// kdyz je hledani prazdne, tak ziskat vsechny + pridat limit(20), orderBy("name")

  const getAllRecipes = async () => {
    setLoading(true);
    setErr("");
    try {

      // upravit query - přidat limit

      const querySnapshot = await getDocs(recipesRef);
      // console.log(recipesRef)
      setRecipes(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        // data: doc.data(),
        data: {
          image: doc.data().image,
          name: doc.data().name,
          description: doc.data().description
        }
    })));
    } catch (error) {
      console.log("Error:", error);
      setErr(error);
      setRecipes([]);
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllRecipes();
    console.log(recipes)
  }, []);

  // console.log(recipes)

  // const cleanData = (data)

  return (
    <ScrollView className="flex-1">
      {/* <Button onPress={() => console.log(recipes)} title={"console recipes"} /> */}
      <SearchBar 
        lightTheme={true}
        placeholder="Míchaná vejce..."
        onChangeText={updateSearch}
        value={search}
      />
      {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />}
      {err && <Text>Chyba při načítání. Zkuste to prosím později.</Text>}
      <RecipeArea recipes={recipes} navigation={navigation} />
    </ScrollView>
  )
}
