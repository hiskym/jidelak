export const handleSearch = async (search, setRecipes, setLastDocument, setResults, setSearch, setSearchQuery, setErr) => {
    if (search.trim() !== '') {
      setRecipes([]);
      setLastDocument(null);
      setResults([])
      setSearchQuery(search.trim())
      setSearch('')
    } else {
      console.log('no input')
      setErr("Please enter a search query.");
    }
  }

export const handleClear = async (setSearch, setSearchQuery, setRecipes, setLastDocument, setResults) => {
    setSearch('');
    setSearchQuery('');
    setRecipes([]);
    setLastDocument(null);
    setResults([]);
  }