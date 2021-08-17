import { loadSearchResults, loadRecipe, state } from './model';
import recipeView from './views/recipeView';
import searchResultView from './views/searchResultView';

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

    // Render search results
    searchResultView.render(state.search.results);
  } catch (err) {
    searchResultView.renderError('Please put in your keywords!');
  }
};

const init = function () {
  recipeView.addRenderHandler(controlRecipe);
  searchResultView.addSubmitHandler(controlSearchResult);
};
init();
