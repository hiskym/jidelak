import { Text, ActivityIndicator, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import RecipeArea from '../components/RecipeArea'
import { ScrollView } from 'react-native'
import { getAllRecipes, getRecipesByName, getAllRecipesByCookTime, getAllRecipesByIngredient, getAllRecipesByCalories, getAllRecipesByCategory } from '../utils/recipeUtils'
import RecipeFilters from '../components/RecipeFilters'
import SearchResult from '../components/SearchResult';
import { handleSearch, handleClear } from '../utils/SearchUtils';
import IconButton from '../components/IconButton'

export default function Recipes({ navigation }) {

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([]);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [lastDocument, setLastDocument] = useState(null);

  const [timeQuery, setTimeQuery] = useState(0);
  const [ingredient, setIngredient] = useState('');

  const [calories, setCalories] = useState(0);

  const [category, setCategory] = useState('');

  useEffect(() => {
    if (searchQuery !== '') {
      getRecipesByName(setLoading, setErr, searchQuery, setLastDocument, setRecipes);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (timeQuery > 0) {
      getAllRecipesByCookTime(setLoading, setErr, lastDocument, setLastDocument, setRecipes, timeQuery)
    }
  }, [timeQuery])

  useEffect(() => {
    if (ingredient !== '') {
      getAllRecipesByIngredient(setLoading, setErr, setRecipes, ingredient)
    }
  }, [ingredient])

  useEffect(() => {
    if (calories !== '') {
      getAllRecipesByCalories(setLoading, setErr, lastDocument, setLastDocument, setRecipes, calories)
    }
  }, [calories])

  useEffect(() => {
    if (category !== '') {
      getAllRecipesByCategory(setLoading, setErr, lastDocument, setLastDocument, setRecipes, category)
    }
  }, [category])

  useEffect(() => {
    if (search === '') {
      setResults([]);
    }
  }, [search])

  const handleClearFilter = async () => {
    setSearch('');
    setSearchQuery('');
    setLastDocument(null);
    setRecipes([]);
    setTimeQuery(0);
    setIngredient('');
    setCategory('');
    setCalories(0);
  }

  const handleGetAllRecipes = async () => {
    await getAllRecipes(setLoading, setErr, lastDocument, setLastDocument, setRecipes)
  }

  return (
    <ScrollView className="flex-1">
      <View className="bg-teal-50 mb-2 shadow-sm rounded-2xl h-max">
        <SearchResult
          search={search}
          setSearch={setSearch}
          handleClear={() => handleClear(setSearch, setSearchQuery, setRecipes, setLastDocument, setResults)}
          handleSearch={() => handleSearch(search, setRecipes, setLastDocument, setResults, setSearch, setSearchQuery, setErr)}
          results={results}
          setResults={setResults}
        />
        {search === '' && (
          <RecipeFilters
            recipes={recipes}
            handleGetAllRecipes={handleGetAllRecipes}
            handleClearFilter={handleClearFilter}
            setTimeQuery={setTimeQuery}
            setIngredient={setIngredient}
            setCalories={setCalories}
            setCategory={setCategory}
          />
        )
        }
      </View>

      {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />}
      {err && <Text className="text-center text-slate-900">Chyba při načítání. Zkuste to prosím později.</Text>}
      {recipes.length === 0 && <Text className="text-center text-slate-900">Vyberte si jednu z možností a zobrazte recepty. 😉</Text>}
      <RecipeArea recipes={recipes} navigation={navigation} />
      {searchQuery !== '' && recipes.length === 0 && <Text className="text-center text-slate-900">Pro hledaný výraz "{searchQuery}" nebyla nalezena shoda. Zkuste něco jiného.</Text>}
      {lastDocument !== null && recipes.length !== 0 && (
        <View className="items-center m-2">
          <IconButton icon="reload" onPress={() => getAllRecipes(setLoading, setErr, lastDocument, setLastDocument, setRecipes)} disabled={searchQuery !== ''} />
        </View>
      )}
    </ScrollView>
  )
}
