import * as model from './model';
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
    await model.loadRecipe(id);

    // Render search results
    if (model.state.search.query !== '')
      searchResultView.render(model.state.search.results);

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
    searchResultView.renderError('Please put in your keywords!');
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
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addRenderHandler(controlRecipe);
  recipeView.addUpdateServingsHandler(controlServings);
  searchResultView.addSubmitHandler(controlSearchResult);
  paginationView.addRenderHandler(controlPagination);
};
init();
