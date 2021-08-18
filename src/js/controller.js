import {
  loadSearchResults,
  loadRecipe,
  state,
  getSearchResultsPage,
} from './model';
import recipeView from './views/recipeView';
import searchResultView from './views/searchResultView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

const controlRecipe = async function () {
  try {
    // Get id from window location
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Add new recipe by id to model state
    await loadRecipe(id);
    // console.log(state.recipe);

    // Render search results
    if (state.search.query !== '')
      searchResultView.render(state.search.results);

    // Render recipe
    recipeView.render(state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Get query from search input field
    const query = searchResultView.getQuery();
    if (!query) throw err;

    // Clear input field
    searchResultView.clearInput();

    // Get search results
    await loadSearchResults(query);

    // Get search results on page 1
    const results = getSearchResultsPage();

    // Render search results
    searchResultView.render(results);

    // Render paginaiton
    paginationView.render(state.search);
  } catch (err) {
    searchResultView.renderError('Please put in your keywords!');
  }
};

const controlPagination = function (page = 1) {
  // Get search result page
  const results = getSearchResultsPage(page);
  // Render search results
  searchResultView.render(results);
  // Render pagination
  paginationView.render(state.search);
};

const init = function () {
  recipeView.addRenderHandler(controlRecipe);
  searchResultView.addSubmitHandler(controlSearchResult);
  paginationView.addRenderHandler(controlPagination);
};
init();
