import { loadRecipe, state } from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

const controlRecipeView = async function () {
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
};

const init = function () {
  recipeView.addRenderHandler(controlRecipeView);
};
init();
