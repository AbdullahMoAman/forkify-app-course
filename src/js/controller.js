import * as module from './module.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { updateServings } from './module.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

// This is a parcel code not js code ----
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0- Update results view to mark selected search result
    resultsView.update(module.getSearchResultsPage());

    // 1- Update bookmarks view
    bookmarksView.update(module.state.bookmarks);

    // 2- Loading the recipe by calling fetch API
    await module.loadRecipe(id);
    // const { recipe } = module.state;

    // 3- Rendaring the recipe
    recipeView.render(module.state.recipe);

    // TEST
    // controllServings();
  } catch (err) {
    recipeView.randerError();
  }
};

const controllSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    // 1- Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2- Load search results
    await module.loadSearchResults(query);

    // 3- Render results
    resultsView.render(module.getSearchResultsPage());

    // 4- Rander pagination
    paginationView.render(module.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controllerPagination = goToPage => {
  // 1- Render NEW results
  resultsView.render(module.getSearchResultsPage(goToPage));

  // 2- Render NEW pagination buttons
  paginationView.render(module.state.search);
};

const controllServings = newServings => {
  // 1- update the recipe servings
  module.updateServings(newServings);

  // 2- update the receipe view
  // recipeView.render(module.state.recipe);
  recipeView.update(module.state.recipe);
};

const controllAddBookmarks = () => {
  // 1- add/remove bookmarks
  if (!module.state.recipe.bookmarked) module.addBookmark(module.state.recipe);
  else module.deleteBookmark(module.state.recipe.id);

  // 2- update the recipe
  recipeView.update(module.state.recipe);

  // 3- render bookmarks
  bookmarksView.render(module.state.bookmarks);
};

const controllBookmarks = () => {
  bookmarksView.render(module.state.bookmarks);
};

const controllAddRecipe = async newRecipe => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe
    await module.uploadRecipe(newRecipe);
    console.log(module.state.recipe);

    // Render recipe
    recipeView.render(module.state.recipe);

    // Close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Succuss message
    addRecipeView.renderMessage();

    // render bookmarks
    bookmarksView.render(module.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${module.state.recipe.id}`);
  } catch (err) {
    console.error('❌', err);
    addRecipeView.randerError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controllBookmarks);
  recipeView.addHandlerRander(controlRecipe);
  recipeView.addHandlerUpdateServings(controllServings);
  recipeView.addHandlerBookmark(controllAddBookmarks);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controllerPagination);
  addRecipeView.addHandlerUpload(controllAddRecipe);
};

init();
