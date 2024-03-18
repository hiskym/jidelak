import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import IconButton from '../components/IconButton';
import { getRecipesByName } from '../utils/recipeUtils';
import { useUserStore } from '../store/UserStore';
import MenuAddDetails from '../components/MenuAddDetails';
import SearchResult from '../components/SearchResult';
import { handleSearch, handleClear } from '../utils/SearchUtils';

export default function MenuAddRecipe() {

  const { user } = useUserStore();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const [recipes, setRecipes] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [lastDocument, setLastDocument] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState('');

  const [err, setErr] = useState("");

  const handleAddRecipe = (recipeId) => {
    setShowDetails(true);
    setSelectedRecipe(recipeId)
  }

  useEffect(() => {
    if (searchQuery !== '') {
      getRecipesByName(setLoading, setErr, searchQuery, setLastDocument, setRecipes);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (search === '') {
      setResults([])
    }
  }, [search]);

  return (
    <View className="flex flex-auto mt-3 w-full py-3 bg-teal-50">
      <Text className="text-center font-semibold text-slate-900 my-2">Zkuste najít recept</Text>
      <SearchResult
        search={search}
        setSearch={setSearch}
        handleClear={() => handleClear(setSearch, setSearchQuery, setRecipes, setLastDocument, setResults)}
        handleSearch={() => handleSearch(search, setRecipes, setLastDocument, setResults, setSearch, setSearchQuery, setErr)}
        results={results}
        setResults={setResults}
      />
      {recipes.length !== 0 && recipes.map((recipe) => {
        return (
          <View key={recipe.id} className="flex flex-row justify-between px-3 my-2">
            <Text className="text-lg text-slate-900">{recipe.data.name}</Text>
            <IconButton icon="add" onPress={() => { handleAddRecipe(recipe.id) }} />
          </View>
        )
      })}
      <View className="items-center">
        {showDetails && (
          <MenuAddDetails
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            recipeId={selectedRecipe}
            userId={user.uid}
          />
        )}
      </View>

      {recipes.length === 0 && searchQuery !== '' && <Text className="text-slate-900">Pro hledaný výraz "{searchQuery}" se bohužel nic nenašlo.</Text>}
    </View>
  )
}