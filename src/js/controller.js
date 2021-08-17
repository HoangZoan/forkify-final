import { loadRecipe, state } from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

const controlRecipeView = async function () {
  await loadRecipe();
  console.log(state.recipe);

  recipeView.render(state.recipe);
};
controlRecipeView();
