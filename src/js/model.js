import { async } from 'regenerator-runtime';
import { API_URL, RESUTLS_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESUTLS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

const createPreviewObject = function (data) {
  return data.map(rec => {
    return {
      bookmarked: false,
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url || rec.image,
      ...(rec.key && { key: rec.key }),
    };
  });
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    state.recipe = createRecipeObject(data);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    const searchResults = data.data.recipes;

    state.search.results = createPreviewObject(searchResults);
  } catch (err) {
    console.log('model error');
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RESUTLS_PER_PAGE; // 0, 9, 19...
  const end = page * 10; // 10, 20, 30...
  return state.search.results.slice(start, end);
};

export const updateNewServings = function (newServings) {
  state.recipe.ingredients
    .filter(ing => ing.quantity !== null)
    .forEach(
      ing =>
        (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
    );
  state.recipe.servings = newServings;
};

const addBookmark = function (recipe) {
  state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);
  state.bookmarks = createPreviewObject(state.bookmarks);
  state.bookmarks[state.bookmarks.length - 1].bookmarked = true;
};

const removeBookmark = function (recipe) {
  state.recipe.bookmarked = false;
  const index = state.bookmarks.findIndex(bm => bm.id === recipe.id);
  state.bookmarks.splice(index, 1);
};

export const updateBookmark = function (recipe) {
  if (!state.bookmarks.some(bm => bm.id === recipe.id)) addBookmark(recipe);
  else removeBookmark(recipe);
};
