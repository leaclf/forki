import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './view/recipe-view';
import searchview from './view/search-view';
import resultsview from './view/results-view';
import paginationView from './view/pagination-view';
import bookmarkView from './view/bookmark-view.';
import AddRecipeView from './view/addRecipeView';
// console.log(bookmarkView);
// import PaginationView from './view/pagination-view';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './view/addRecipeView';
// console.log(resultsview);
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
////////// Loading recipe API //////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 0) Update results view to mark selected search results
    resultsview.update(model.getSearchResultsPage());
    // 1) Updating bookmarks view
    bookmarkView.update(model.state.bookmark);

    recipeView.renderSpinner();
    // 2) Loading the recipe
    await model.loadRecipe(id);
    // 3) Rendering the recipe
    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // console.log(resultsview);
    // 1) Get search query
    resultsview.renderSpinner();
    const query = searchview.getQuery();
    // console.log(query);
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // console.log(model.state.search.results);
    resultsview.render(model.getSearchResultsPage());
    // console.log(paginationView);

    // 4)Render initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};
// controlSearchResults();

const controlPagination = function (page) {
  // 3) Render New results
  // console.log(model.state.search.results);
  resultsview.render(model.getSearchResultsPage(page));
  // console.log(paginationView);

  // 4)Render New Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/ Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update Recipe view
  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe);

  // 3) Render Bookmarks
  bookmarkView.render(model.state.bookmark);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmark);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render A Spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    // console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderSuccess();

    // Render Boomark view
    bookmarkView.render(model.state.bookmark);

    // Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};
const newFeatures = function () {
  console.log('Welcome');
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView._addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchview.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeatures();
};
init();
