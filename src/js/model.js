import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helper';
import { AJAX } from './helper';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};
const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(booked => booked.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error(`${error}💥💥💥💥`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(state.search.results);
    state.search.page = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// loadSearchResults('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // console.log(state.search.page);
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach(element => {
    // newQt =  oldQt * newServings / oldServings
    element.quantity = (element.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};
export const addBookmark = function (recipe) {
  // Add bokmark
  state.bookmark.push(recipe);

  // Mark currennt recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete Bookmark
  const index = state.bookmark.findIndex(el => el.id === id);
  console.log(index);
  state.bookmark.splice(index, 1);

  // Mark currennt recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// console.log(state.bookmark);
const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.removeItem('bookmark');
};
// clearBookmarks();
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Format, please ensure you have inputted the ingredient in the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      ingredients,
      cooking_time: newRecipe.cookingTime,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      title: newRecipe.title,
      servings: +newRecipe.servings,
      publisher: newRecipe.publisher,
    };
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
