import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SearchBar } from '@rneui/themed';
import SearchHelper from './SearchHelper';
import IconButton from './IconButton';

export default function SearchResult({ search, setSearch, handleClear, handleSearch, results, setResults }) {

    const updateSearch = (search) => {
        setSearch(search);
        const results = SearchHelper(search)
        setResults(results)
    };

    return (
        <View className="bg-teal-50">
            <SearchBar
                lightTheme={true}
                placeholder="Míchaná vejce..."
                onChangeText={updateSearch}
                onClear={handleClear}
                value={search}
                containerStyle={{ backgroundColor: '#F0FDFA', borderTopWidth: 0, borderBottomWidth: 0 }}
            />

            {results.length > 0 && (
                <ScrollView className="border border-slate-300 rounded-md mx-5 mt-1 p-2 overflow-scroll bg-white shadow-sm max-h-[50%]">
                    {results.map((recipeName, index) => {
                        return (
                            <View key={index}>
                                <TouchableOpacity onPress={() => setSearch(recipeName)}>
                                    <Text className="text-lg my-2 text-slate-900">{recipeName}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </ScrollView>
            )}
            {search !== '' && (
                <View className="flex flex-row justify-center m-2 py-2">
                    <IconButton icon={'search'} onPress={() => handleSearch()} color={'#0D9488'} />
                </View>
            )}
        </View>
    )
}