import { recipeNames } from '../utils/recipeNameHelper'

export default function SearchHelper(query) {


  const results = [];
  const queryUpperCase = query.toUpperCase();

  for (const letter in recipeNames) {
    recipeNames[letter].forEach((recipe) => {
      if (recipe.toUpperCase().includes(queryUpperCase) && recipe.toUpperCase() !== '') {
        results.push(recipe);
      }
    });
  }

  return results;
}