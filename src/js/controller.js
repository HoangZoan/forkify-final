import * as model from './model';
import recipeView from './views/recipeView';
import searchResultView from './views/searchResultView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import bookmarkView from './views/bookmarkView';

const controlRecipe = async function () {
  try {
    // Get id from window location
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show loading spinner
    recipeView.renderSpinner();

    // Update bookmarks list when page loaded
    if (model.state.bookmarks.length > 0)
      bookmarkView.update(model.state.bookmarks);
    else bookmarkView.renderMessage();

    // Render search results
    if (model.state.search.query !== '')
      searchResultView.update(model.getSearchResultsPage());

    // Add new recipe by id to model state
    await model.loadRecipe(id);

    // Mark bookmark button as filled when recipe is bookmarked
    if (model.state.bookmarks.some(bm => bm.id === model.state.recipe.id)) {
      model.state.recipe.bookmarked = true;
    }

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Get query from search input field
    const query = searchResultView.getQuery();
    if (!query) throw err;

    // Show loading spinner
    searchResultView.renderSpinner();

    // Clear input field
    searchResultView.clearInput();

    // Get search results
    await model.loadSearchResults(query);

    // Get search results on page 1
    const results = model.getSearchResultsPage(1);

    // Render search results
    searchResultView.render(results);

    // Render paginaiton
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultView.renderMessage();
  }
};

const controlPagination = function (page = 1) {
  // Get search result page
  const results = model.getSearchResultsPage(page);
  // Render search results
  searchResultView.render(results);
  // Render pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // Update servings in model state
  model.updateNewServings(newServing);

  // Render recipe
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function (recipe) {
  // Add or delete bookmarked recipe
  model.updateBookmark(recipe);
  // Update bookmark button as filled or undfilled
  recipeView.update(model.state.recipe);
  // Render bookmarks list
  if (model.state.bookmarks.length > 0)
    bookmarkView.render(model.state.bookmarks);
  else bookmarkView.renderMessage();
};

const init = function () {
  recipeView.addRenderHandler(controlRecipe);
  recipeView.addUpdateServingsHandler(controlServings);
  recipeView.addUpdateBookmarkHanlder(controlBookmarks);
  searchResultView.addSubmitHandler(controlSearchResult);
  searchResultView.addPreviewClickHandler();
  paginationView.addRenderHandler(controlPagination);
};
init();
